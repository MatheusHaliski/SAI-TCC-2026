from __future__ import annotations

import io
import json
import os
import struct
import threading
import time
import uuid
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Literal

import numpy as np
import requests
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from PIL import Image

app = FastAPI(title="StylistAI 3D Worker", version="1.0.0")

OUTPUT_DIR = Path(os.getenv("WORKER_OUTPUT_DIR", "/tmp/stylistai-3d-output"))
OUTPUT_PUBLIC_BASE_URL = os.getenv("OUTPUT_PUBLIC_BASE_URL", "").strip()
REQUEST_TIMEOUT_SECONDS = int(os.getenv("REQUEST_TIMEOUT_SECONDS", "60"))
MAX_WORKERS = int(os.getenv("WORKER_MAX_THREADS", "4"))

OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
jobs_lock = threading.Lock()
executor = ThreadPoolExecutor(max_workers=MAX_WORKERS)

JobState = Literal["queued", "in_progress", "completed", "failed"]
jobs: dict[str, dict[str, Any]] = {}


class JobRequest(BaseModel):
    modelUrl: str | None = None
    imageUrl: str
    jobType: str = "blender_uv_pipeline"
    options: dict[str, Any] = Field(default_factory=dict)


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def register_job(job_id: str, payload: JobRequest) -> None:
    with jobs_lock:
        jobs[job_id] = {
            "jobId": job_id,
            "status": "queued",
            "createdAt": now_iso(),
            "updatedAt": now_iso(),
            "request": payload.model_dump(),
            "artifacts": {},
            "error": None,
        }


def update_job(job_id: str, **updates: Any) -> None:
    with jobs_lock:
        record = jobs.get(job_id)
        if not record:
            return
        record.update(updates)
        record["updatedAt"] = now_iso()


def get_job(job_id: str) -> dict[str, Any] | None:
    with jobs_lock:
        record = jobs.get(job_id)
        return dict(record) if record else None


def download_image(image_url: str) -> Image.Image:
    with requests.get(image_url, timeout=REQUEST_TIMEOUT_SECONDS) as response:
        response.raise_for_status()
        image = Image.open(io.BytesIO(response.content)).convert("RGBA")
    return image


def preprocess_image(image: Image.Image, size: int = 1024) -> Image.Image:
    processed = image.copy()
    processed.thumbnail((size, size), Image.Resampling.LANCZOS)
    return processed


def image_features(image: Image.Image) -> dict[str, Any]:
    rgb = np.array(image.convert("RGB"), dtype=np.float32)
    avg_color = rgb.mean(axis=(0, 1)).round(2).tolist()
    return {
        "width": int(rgb.shape[1]),
        "height": int(rgb.shape[0]),
        "mean_rgb": avg_color,
    }


def write_dummy_glb(output_path: Path, metadata: dict[str, Any]) -> None:
    gltf_json = {
        "asset": {"version": "2.0", "generator": "StylistAI-Worker-MVP"},
        "scene": 0,
        "scenes": [{"nodes": []}],
        "nodes": [],
        "extras": metadata,
    }
    json_bytes = json.dumps(gltf_json, separators=(",", ":")).encode("utf-8")
    padded_json = json_bytes + (b" " * ((4 - len(json_bytes) % 4) % 4))
    total_length = 12 + 8 + len(padded_json)

    with output_path.open("wb") as glb:
        glb.write(struct.pack("<III", 0x46546C67, 2, total_length))  # glTF magic, version, length
        glb.write(struct.pack("<I4s", len(padded_json), b"JSON"))
        glb.write(padded_json)


def build_artifact_url(output_path: Path, job_id: str) -> str:
    if OUTPUT_PUBLIC_BASE_URL:
        base = OUTPUT_PUBLIC_BASE_URL.rstrip("/")
        return f"{base}/{job_id}.glb"
    return output_path.as_uri()


def run_3d_pipeline(job_id: str, payload: JobRequest) -> None:
    update_job(job_id, status="in_progress")
    started = time.perf_counter()
    output_path = OUTPUT_DIR / f"{job_id}.glb"

    try:
        original = download_image(payload.imageUrl)
        processed = preprocess_image(original)
        features = image_features(processed)

        time.sleep(1.5)  # Simulate external generation latency (Meshy/Blender/Tripo plug-in point).
        metadata = {
            "jobType": payload.jobType,
            "sourceImageUrl": payload.imageUrl,
            "options": payload.options,
            "imageFeatures": features,
            "modelSourceHint": payload.modelUrl,
        }
        write_dummy_glb(output_path, metadata)

        duration_ms = int((time.perf_counter() - started) * 1000)
        update_job(
            job_id,
            status="completed",
            artifacts={
                "model_3d_url": build_artifact_url(output_path, job_id),
                "model_3d_path": str(output_path),
            },
            metrics={"durationMs": duration_ms},
            error=None,
        )
    except Exception as exc:
        update_job(
            job_id,
            status="failed",
            error={"message": str(exc), "type": exc.__class__.__name__},
        )


@app.get("/ping")
def ping() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/jobs")
def create_job(payload: JobRequest) -> dict[str, str]:
    if not payload.imageUrl.strip():
        raise HTTPException(status_code=400, detail="imageUrl is required")

    job_id = str(uuid.uuid4())
    register_job(job_id, payload)
    executor.submit(run_3d_pipeline, job_id, payload)
    return {"jobId": job_id, "status": "queued"}


@app.get("/jobs/{job_id}")
def job_status(job_id: str) -> dict[str, Any]:
    record = get_job(job_id)
    if not record:
        raise HTTPException(status_code=404, detail="Job not found")

    response: dict[str, Any] = {
        "jobId": job_id,
        "status": record["status"],
    }
    if record.get("artifacts"):
        response["artifacts"] = record["artifacts"]
    if record.get("metrics"):
        response["metrics"] = record["metrics"]
    if record.get("error"):
        response["error"] = record["error"]
    return response
