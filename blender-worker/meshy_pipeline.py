from __future__ import annotations

import logging
import os
import time
from dataclasses import dataclass
from pathlib import Path
from typing import Any

import requests

logger = logging.getLogger("stylistai.meshy_pipeline")

MESHY_BASE_URL = os.getenv("MESHY_BASE_URL", "https://api.meshy.ai").rstrip("/")
MESHY_POLL_DELAY_SECONDS = float(os.getenv("MESHY_POLL_DELAY_SECONDS", "3"))
MESHY_MAX_POLL_ATTEMPTS = int(os.getenv("MESHY_MAX_POLL_ATTEMPTS", "80"))
MESHY_TEXT_TO_3D_PATHS = [
    path.strip()
    for path in os.getenv("MESHY_TEXT_TO_3D_PATHS", "/openapi/v2/text-to-3d,/openapi/v1/text-to-3d").split(",")
    if path.strip()
]


@dataclass
class MeshyOutput:
    base_model_path: Path
    format: str
    meshy_task_id: str
    model_url: str
    metadata: dict[str, Any]


class MeshyPipelineError(RuntimeError):
    pass


class MeshyPipeline:
    def __init__(self, *, api_key: str | None = None, timeout_seconds: int = 45):
        self.api_key = (api_key or os.getenv("MESHY_API_KEY", "")).strip()
        self.timeout_seconds = timeout_seconds

    def generate_base_model(self, *, piece_type: str, output_dir: Path, preferred_format: str = "glb") -> MeshyOutput:
        if not self.api_key:
            raise MeshyPipelineError("MESHY_API_KEY is required.")

        output_dir.mkdir(parents=True, exist_ok=True)
        fmt = "obj" if preferred_format.lower() == "obj" else "glb"
        prompt = self._build_prompt(piece_type)

        logger.info("[meshy] creating task piece_type=%s format=%s", piece_type, fmt)
        task_id, route = self._create_task(prompt=prompt)
        task = self._wait_for_completion(task_id, route)

        model_url = (
            task.get("model_urls", {}).get(fmt)
            or task.get("model_urls", {}).get("glb")
            or task.get("model_urls", {}).get("obj")
        )
        if not model_url:
            raise MeshyPipelineError(f"Meshy task {task_id} finished without model_urls.")

        base_path = output_dir / f"base_meshy.{fmt}"
        self._download(model_url, base_path)

        metadata = {
            "task_id": task_id,
            "status": task.get("status"),
            "thumbnail_url": task.get("thumbnail_url"),
            "preview_url": task.get("preview_url"),
            "prompt": prompt,
            "resolved_format": fmt,
            "route": route,
        }
        logger.info("[meshy] base model ready task_id=%s path=%s", task_id, base_path)
        return MeshyOutput(base_model_path=base_path, format=fmt, meshy_task_id=task_id, model_url=model_url, metadata=metadata)

    def _build_prompt(self, piece_type: str) -> str:
        normalized = piece_type.strip().lower() or "fashion garment"
        return (
            f"A clean standalone 3D {normalized}, centered, no mannequin, no body, "
            "studio neutral lighting, fashion prototyping quality"
        )

    def _headers(self) -> dict[str, str]:
        return {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }

    def _build_url(self, path: str) -> str:
        normalized = path if path.startswith("/") else f"/{path}"
        return f"{MESHY_BASE_URL}{normalized}"

    def _create_task(self, *, prompt: str) -> tuple[str, str]:
        errors: list[str] = []
        for route in MESHY_TEXT_TO_3D_PATHS:
            url = self._build_url(route)
            response = requests.post(
                url,
                headers=self._headers(),
                json={
                    "mode": "preview",
                    "prompt": prompt,
                    "art_style": "realistic",
                    "should_texture": True,
                },
                timeout=self.timeout_seconds,
            )
            if not response.ok:
                body = response.text[:500]
                errors.append(f"{url} => {response.status_code}: {body}")
                continue

            payload = response.json()
            task_id = str(payload.get("result") or payload.get("id") or "").strip()
            if task_id:
                logger.info("[meshy] task created route=%s task_id=%s", route, task_id)
                return task_id, route

            errors.append(f"{url} => missing task id in response")

        raise MeshyPipelineError(f"Failed to create Meshy task on available routes: {' | '.join(errors)}")

    def _wait_for_completion(self, task_id: str, route: str) -> dict[str, Any]:
        status = "unknown"
        poll_url = self._build_url(f"{route.rstrip('/')}/{task_id}")
        for attempt in range(1, MESHY_MAX_POLL_ATTEMPTS + 1):
            response = requests.get(
                poll_url,
                headers={"Authorization": f"Bearer {self.api_key}"},
                timeout=self.timeout_seconds,
            )
            if not response.ok:
                raise MeshyPipelineError(f"Failed polling Meshy task {task_id}: {response.text[:500]}")

            payload = response.json()
            status = str(payload.get("status", "")).strip().lower() or status
            logger.info("[meshy] poll task_id=%s attempt=%s/%s status=%s", task_id, attempt, MESHY_MAX_POLL_ATTEMPTS, status)

            if status in {"succeeded", "success", "completed"}:
                return payload
            if status in {"failed", "error", "cancelled"}:
                raise MeshyPipelineError(f"Meshy task {task_id} finished with status={status}.")

            time.sleep(MESHY_POLL_DELAY_SECONDS)

        raise MeshyPipelineError(f"Meshy task {task_id} timed out. Last status={status}.")

    def _download(self, url: str, destination: Path) -> None:
        response = requests.get(url, timeout=self.timeout_seconds)
        if not response.ok:
            raise MeshyPipelineError(f"Failed downloading model from Meshy: {response.text[:500]}")
        destination.write_bytes(response.content)
