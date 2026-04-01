from __future__ import annotations

import os
import shutil
import subprocess
import tempfile
import time
import uuid
from pathlib import Path
from typing import Any

import requests
import runpod

SCRIPTS_DIR = Path("/app/blender-scripts")
BLENDER_BIN = os.getenv("BLENDER_BIN", "blender")


def run_blender_script(script_path: str, args: list[str]) -> dict[str, Any]:
    cmd = [BLENDER_BIN, "-b", "-P", script_path, "--", *args]
    started = time.perf_counter()
    completed = subprocess.run(cmd, capture_output=True, text=True)
    duration_ms = int((time.perf_counter() - started) * 1000)

    result = {
        "command": cmd,
        "exitCode": completed.returncode,
        "stdout": completed.stdout[-10000:],
        "stderr": completed.stderr[-10000:],
        "durationMs": duration_ms,
    }

    if completed.returncode != 0:
        raise RuntimeError(f"Blender execution failed with exit code {completed.returncode}", result)

    return result


def download_file(url: str, target_path: Path) -> None:
    with requests.get(url, timeout=180, stream=True) as response:
        response.raise_for_status()
        with target_path.open("wb") as output:
            for chunk in response.iter_content(chunk_size=1024 * 1024):
                if chunk:
                    output.write(chunk)


def upload_artifact(path: Path) -> str | None:
    upload_url = os.getenv("BLENDER_OUTPUT_UPLOAD_URL", "").strip()
    if not upload_url:
        return None

    with path.open("rb") as file_data:
        response = requests.put(upload_url, data=file_data, timeout=180)
        response.raise_for_status()
    return upload_url


def map_job_script(job_type: str) -> str:
    if job_type == "uv_unwrap":
        return str(SCRIPTS_DIR / "uv_unwrap.py")
    raise ValueError(f"Unsupported jobType '{job_type}'")


def handler(event: dict[str, Any]) -> dict[str, Any]:
    started = time.perf_counter()
    payload = event.get("input") if isinstance(event, dict) else None
    if not isinstance(payload, dict):
        return {"status": "failed", "error": {"code": "invalid_input", "message": "Missing input object."}}

    model_url = str(payload.get("modelUrl") or "").strip()
    job_type = str(payload.get("jobType") or "uv_unwrap").strip() or "uv_unwrap"

    if not model_url:
        return {"status": "failed", "error": {"code": "missing_model_url", "message": "input.modelUrl is required."}}

    job_uuid = str(uuid.uuid4())
    temp_dir = Path(tempfile.mkdtemp(prefix=f"runpod-{job_uuid}-", dir="/tmp"))

    try:
        input_path = temp_dir / f"input-{job_uuid}.glb"
        output_path = temp_dir / f"output-{job_uuid}.glb"

        download_file(model_url, input_path)

        script_path = map_job_script(job_type)
        blender_result = run_blender_script(script_path, ["--input", str(input_path), "--output", str(output_path)])

        artifact_url = upload_artifact(output_path)
        duration_ms = int((time.perf_counter() - started) * 1000)

        return {
            "status": "completed",
            "artifacts": {
                "outputModelPath": str(output_path),
                "outputModelUrl": artifact_url,
            },
            "metrics": {
                "durationMs": duration_ms,
                "blenderDurationMs": blender_result["durationMs"],
            },
            "logs": {
                "stdout": blender_result["stdout"],
                "stderr": blender_result["stderr"],
            },
        }
    except ValueError as error:
        return {"status": "failed", "error": {"code": "unsupported_job_type", "message": str(error)}}
    except requests.RequestException as error:
        return {"status": "failed", "error": {"code": "network_error", "message": str(error)}}
    except RuntimeError as error:
        details = error.args[1] if len(error.args) > 1 and isinstance(error.args[1], dict) else {}
        return {
            "status": "failed",
            "error": {"code": "blender_failed", "message": str(error.args[0])},
            "logs": {"stdout": details.get("stdout", ""), "stderr": details.get("stderr", "")},
            "metrics": {"blenderDurationMs": details.get("durationMs")},
        }
    except Exception as error:
        return {"status": "failed", "error": {"code": "worker_exception", "message": str(error)}}
    finally:
        if temp_dir.exists():
            shutil.rmtree(temp_dir, ignore_errors=True)


runpod.serverless.start({"handler": handler})
