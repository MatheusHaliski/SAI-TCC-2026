from __future__ import annotations

import logging
import os
import time
from dataclasses import dataclass
from pathlib import Path
from typing import Any

import requests

logger = logging.getLogger("stylistai.meshy_pipeline")

MESHY_BASE_URL = os.getenv("MESHY_BASE_URL", "https://api.meshy.ai")
MESHY_IMAGE_TO_3D_PATH = os.getenv("MESHY_IMAGE_TO_3D_PATH", "/openapi/v1/image-to-3d")
MESHY_POLL_DELAY_SECONDS = float(os.getenv("MESHY_POLL_DELAY_SECONDS", "3"))
MESHY_MAX_POLL_ATTEMPTS = int(os.getenv("MESHY_MAX_POLL_ATTEMPTS", "80"))
MESHY_NETWORK_RETRIES = int(os.getenv("MESHY_NETWORK_RETRIES", "3"))
MESHY_NETWORK_RETRY_BASE_SECONDS = float(os.getenv("MESHY_NETWORK_RETRY_BASE_SECONDS", "1.5"))


@dataclass
class MeshyOutput:
    base_model_path: Path
    format: str
    meshy_task_id: str
    model_url: str
    metadata: dict[str, Any]


class MeshyPipelineError(RuntimeError):
    def __init__(self, code: str, message: str, details: dict[str, Any] | None = None):
        super().__init__(message)
        self.code = code
        self.message = message
        self.details = details or {}


class MeshyPipeline:
    def __init__(self, *, api_key: str | None = None, timeout_seconds: int = 45):
        self.api_key = (api_key or os.getenv("MESHY_API_KEY", "")).strip()
        self.timeout_seconds = timeout_seconds
        self.create_url = self._build_url(MESHY_IMAGE_TO_3D_PATH)

    def generate_base_model(
        self,
        *,
        piece_type: str,
        source_image_url: str | None,
        output_dir: Path,
        preferred_format: str = "glb",
    ) -> MeshyOutput:
        if not self.api_key:
            raise MeshyPipelineError("meshy_auth_not_configured", "MESHY_API_KEY is required.")
        if not source_image_url:
            raise MeshyPipelineError("meshy_invalid_request", "source image URL is required for image-to-3d flow.")

        output_dir.mkdir(parents=True, exist_ok=True)
        fmt = "obj" if preferred_format.lower() == "obj" else "glb"

        logger.info("[meshy] create url=%s", self.create_url)
        task_id = self._create_task(image_url=source_image_url, piece_type=piece_type)
        task = self._wait_for_completion(task_id)

        model_url = (
            task.get("model_urls", {}).get(fmt)
            or task.get("model_urls", {}).get("glb")
            or task.get("model_urls", {}).get("obj")
        )
        if not model_url:
            raise MeshyPipelineError(
                "meshy_provider_invalid_response",
                f"Meshy task {task_id} finished without model URLs.",
                {"taskId": task_id, "response": task},
            )

        base_path = output_dir / f"base_meshy.{fmt}"
        self._download(model_url, base_path)

        metadata = {
            "task_id": task_id,
            "status": task.get("status"),
            "thumbnail_url": task.get("thumbnail_url"),
            "preview_url": task.get("preview_url"),
            "resolved_format": fmt,
            "create_url": self.create_url,
        }
        logger.info("[meshy] base model ready task_id=%s path=%s", task_id, base_path)
        return MeshyOutput(base_model_path=base_path, format=fmt, meshy_task_id=task_id, model_url=model_url, metadata=metadata)

    def _build_url(self, path: str) -> str:
        base = MESHY_BASE_URL.strip().rstrip("/")
        normalized_path = path.strip()
        if not normalized_path:
            normalized_path = "/openapi/v1/image-to-3d"
        if not normalized_path.startswith("/"):
            normalized_path = f"/{normalized_path}"
        return f"{base}{normalized_path}"

    def _headers(self) -> dict[str, str]:
        return {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }

    def _request_with_retry(self, method: str, url: str, **kwargs: Any) -> requests.Response:
        transient_error: Exception | None = None
        failure_kind = "network_failure"
        for attempt in range(1, MESHY_NETWORK_RETRIES + 2):
            try:
                return requests.request(method, url, timeout=self.timeout_seconds, **kwargs)
            except requests.exceptions.Timeout as exc:
                raise MeshyPipelineError("meshy_timeout", "Meshy request timed out.", {"url": url, "attempt": attempt}) from exc
            except requests.exceptions.ConnectionError as exc:
                transient_error = exc
                error_text = str(exc).lower()
                if "name resolution" in error_text or "failed to resolve" in error_text or "nodename nor servname provided" in error_text:
                    failure_kind = "dns_resolution_failure"
                else:
                    failure_kind = "network_connection_failure"
                if attempt > MESHY_NETWORK_RETRIES:
                    break
                wait_seconds = MESHY_NETWORK_RETRY_BASE_SECONDS * (2 ** (attempt - 1))
                logger.warning("[meshy] temporary network failure url=%s attempt=%s retry_in=%ss err=%s", url, attempt, wait_seconds, exc)
                time.sleep(wait_seconds)

        raise MeshyPipelineError(
            "meshy_temporarily_unavailable",
            "Meshy service temporarily unavailable. Please retry.",
            {"url": url, "kind": failure_kind, "error": str(transient_error) if transient_error else "network_failure"},
        ) from transient_error

    def _create_task(self, *, image_url: str, piece_type: str) -> str:
        payload = {
            "image_url": image_url,
            "should_texture": True,
            "prompt": f"single {piece_type.strip().lower() or 'garment'} only, no mannequin, no body",
        }
        response = self._request_with_retry("POST", self.create_url, headers=self._headers(), json=payload)

        if response.status_code in {401, 403}:
            raise MeshyPipelineError("meshy_auth_failed", "Meshy authentication failed (401/403).", {"url": self.create_url, "status": response.status_code, "body": response.text[:500]})
        if 400 <= response.status_code < 500:
            raise MeshyPipelineError("meshy_bad_request", "Meshy rejected request payload.", {"url": self.create_url, "status": response.status_code, "body": response.text[:500]})
        if response.status_code >= 500:
            raise MeshyPipelineError("meshy_provider_error", "Meshy provider error.", {"url": self.create_url, "status": response.status_code, "body": response.text[:500]})

        payload_json = response.json()
        task_id = str(payload_json.get("result") or payload_json.get("id") or "").strip()
        if not task_id:
            raise MeshyPipelineError("meshy_provider_invalid_response", "Meshy did not return a task id.", {"url": self.create_url, "response": payload_json})
        return task_id

    def _wait_for_completion(self, task_id: str) -> dict[str, Any]:
        status = "unknown"
        poll_url = f"{self.create_url.rstrip('/')}/{task_id}"
        logger.info("[meshy] poll url=%s", poll_url)

        for attempt in range(1, MESHY_MAX_POLL_ATTEMPTS + 1):
            response = self._request_with_retry("GET", poll_url, headers={"Authorization": f"Bearer {self.api_key}"})

            if response.status_code in {401, 403}:
                raise MeshyPipelineError("meshy_auth_failed", "Meshy authentication failed during polling (401/403).", {"url": poll_url, "status": response.status_code, "body": response.text[:500]})
            if 400 <= response.status_code < 500:
                raise MeshyPipelineError("meshy_bad_request", "Meshy polling request rejected.", {"url": poll_url, "status": response.status_code, "body": response.text[:500]})
            if response.status_code >= 500:
                raise MeshyPipelineError("meshy_provider_error", "Meshy provider error during polling.", {"url": poll_url, "status": response.status_code, "body": response.text[:500]})

            payload = response.json()
            status = str(payload.get("status", "")).strip().lower() or status
            logger.info("[meshy] poll task_id=%s attempt=%s/%s status=%s", task_id, attempt, MESHY_MAX_POLL_ATTEMPTS, status)

            if status in {"succeeded", "success", "completed"}:
                return payload
            if status in {"failed", "error", "cancelled"}:
                raise MeshyPipelineError("meshy_task_failed", f"Meshy task {task_id} finished with status={status}.", {"taskId": task_id, "status": status})

            time.sleep(MESHY_POLL_DELAY_SECONDS)

        raise MeshyPipelineError("meshy_timeout", f"Meshy task timed out before completion. Last status={status}.", {"taskId": task_id, "status": status})

    def _download(self, url: str, destination: Path) -> None:
        logger.info("[meshy] download url=%s", url)
        response = self._request_with_retry("GET", url)
        if response.status_code in {401, 403}:
            raise MeshyPipelineError("meshy_auth_failed", "Meshy asset download auth failed (401/403).", {"url": url, "status": response.status_code, "body": response.text[:500]})
        if 400 <= response.status_code < 500:
            raise MeshyPipelineError("meshy_bad_request", "Meshy asset download request rejected.", {"url": url, "status": response.status_code, "body": response.text[:500]})
        if response.status_code >= 500:
            raise MeshyPipelineError("meshy_provider_error", "Meshy provider error during asset download.", {"url": url, "status": response.status_code, "body": response.text[:500]})
        destination.write_bytes(response.content)
