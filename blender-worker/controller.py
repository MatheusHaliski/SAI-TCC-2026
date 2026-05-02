from __future__ import annotations

import json
import logging
import os
import subprocess
import time
from dataclasses import dataclass
from pathlib import Path
from typing import Any

from meshy_pipeline import MeshyPipeline

logger = logging.getLogger("stylistai.controller")


def _now_ms() -> int:
    return int(time.time() * 1000)


@dataclass
class ControllerResult:
    artifacts: dict[str, Any]
    metrics: dict[str, Any]
    debug: dict[str, Any]


class Fashion3DController:
    def __init__(self) -> None:
        self.output_root = Path(os.getenv("WORKER_OUTPUT_DIR", "/workspace/output"))
        self.blender_bin = os.getenv("BLENDER_BIN", "blender")
        self.meshy = MeshyPipeline()

    def run(self, *, job_id: str, piece_data: dict[str, Any]) -> ControllerResult:
        self.output_root.mkdir(parents=True, exist_ok=True)
        job_dir = self.output_root / job_id
        debug_dir = job_dir / "debug"
        job_dir.mkdir(parents=True, exist_ok=True)
        debug_dir.mkdir(parents=True, exist_ok=True)

        started_ms = _now_ms()
        debug: dict[str, Any] = {
            "job_id": job_id,
            "pipeline": "fashion-ai-meshy-blender-v2",
            "piece_data": piece_data,
            "steps": {},
        }

        piece_type = str(piece_data.get("piece_type") or "garment")
        preferred_format = str(piece_data.get("base_format") or "glb")

        logger.info("[controller] job=%s start piece_type=%s", job_id, piece_type)
        meshy_output = self.meshy.generate_base_model(
            piece_type=piece_type,
            source_image_url=str(piece_data.get("reference_image_url") or "").strip() or None,
            output_dir=job_dir,
            preferred_format=preferred_format,
        )
        debug["steps"]["meshy"] = meshy_output.metadata

        output_glb = job_dir / "final_model.glb"
        blender_meta = self._run_blender(
            input_model=meshy_output.base_model_path,
            output_model=output_glb,
            piece_data=piece_data,
            debug_dir=debug_dir,
        )
        debug["steps"]["blender"] = blender_meta

        debug_path = debug_dir / "pipeline_debug.json"
        debug_path.write_text(json.dumps(debug, indent=2), encoding="utf-8")

        finished_ms = _now_ms()
        duration_ms = finished_ms - started_ms
        artifacts = {
            "model_3d_path": str(output_glb),
            "model_3d_url": output_glb.as_uri(),
            "model_usdz_path": str(output_glb.with_suffix(".usdz")),
            "base_model_path": str(meshy_output.base_model_path),
            "debug_report_path": str(debug_path),
            "output_root": str(self.output_root),
        }

        metrics = {
            "durationMs": duration_ms,
            "meshyTaskId": meshy_output.meshy_task_id,
            "pipelineVersion": "fashion-ai-meshy-blender-v2",
        }
        logger.info("[controller] job=%s completed duration_ms=%s", job_id, duration_ms)
        return ControllerResult(artifacts=artifacts, metrics=metrics, debug=debug)

    def _run_blender(self, *, input_model: Path, output_model: Path, piece_data: dict[str, Any], debug_dir: Path) -> dict[str, Any]:
        piece_data_path = debug_dir / "piece_data.json"
        piece_data_path.write_text(json.dumps(piece_data, indent=2), encoding="utf-8")

        script_path = Path(__file__).with_name("blender_pipeline.py")
        command = [
            self.blender_bin,
            "-b",
            "--python",
            str(script_path),
            "--",
            "--input-model",
            str(input_model),
            "--output-model",
            str(output_model),
            "--piece-data-json",
            str(piece_data_path),
            "--debug-dir",
            str(debug_dir),
        ]

        logger.info("[controller] running blender command=%s", " ".join(command))
        completed = subprocess.run(command, capture_output=True, text=True)
        blender_stdout_path = debug_dir / "blender.stdout.log"
        blender_stderr_path = debug_dir / "blender.stderr.log"
        blender_stdout_path.write_text(completed.stdout, encoding="utf-8")
        blender_stderr_path.write_text(completed.stderr, encoding="utf-8")

        if completed.returncode != 0:
            raise RuntimeError(
                "Blender headless step failed. "
                f"stdout={completed.stdout[-400:]} stderr={completed.stderr[-400:]}"
            )

        stdout = completed.stdout.strip().splitlines()
        if not stdout:
            return {"warning": "blender_stdout_empty"}
        try:
            return json.loads(stdout[-1])
        except json.JSONDecodeError:
            return {"stdout_tail": stdout[-1]}
