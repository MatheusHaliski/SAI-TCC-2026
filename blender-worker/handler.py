from __future__ import annotations

import json
import logging
import os
import struct
import threading
import time
import uuid
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Literal

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field

from blender_common import finalize_job_status, normalize_status

logging.basicConfig(
    level=os.getenv("LOG_LEVEL", "INFO").upper(),
    format="%(asctime)s %(levelname)s %(name)s %(message)s",
)
logger = logging.getLogger("stylistai.worker")
logger.info("worker_module_loaded entrypoint=handler.py")

app = FastAPI(title="StylistAI GPU Worker", version="2.0.0")


def get_allowed_origins() -> list[str]:
    raw_origins = os.getenv(
        "CORS_ALLOWED_ORIGINS",
        "https://sai-tcc-2026.vercel.app,http://localhost:3000",
    )
    origins = [origin.strip() for origin in raw_origins.split(",") if origin.strip()]
    return origins or ["https://sai-tcc-2026.vercel.app", "http://localhost:3000"]


allowed_origins = get_allowed_origins()
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

OUTPUT_DIR = Path(os.getenv("WORKER_OUTPUT_DIR", "/tmp/stylistai-3d-output"))
OUTPUT_PUBLIC_BASE_URL = os.getenv("OUTPUT_PUBLIC_BASE_URL", "").strip()
MAX_WORKERS = int(os.getenv("WORKER_MAX_THREADS", "4"))

OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
jobs_lock = threading.Lock()
executor = ThreadPoolExecutor(max_workers=MAX_WORKERS)

JobState = Literal["queued", "submitted", "in_progress", "completed", "failed", "cancelled"]
jobs: dict[str, dict[str, Any]] = {}


class JobRequest(BaseModel):
    modelUrl: str | None = None
    imageUrl: str
    jobType: str = "blender_uv_pipeline"
    options: dict[str, Any] = Field(default_factory=dict)


class JobResponse(BaseModel):
    jobId: str
    status: JobState


class LbRequest(BaseModel):
    input: JobRequest


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
            "metrics": {},
            "error": None,
        }


def update_job(job_id: str, **updates: Any) -> None:
    with jobs_lock:
        record = jobs.get(job_id)
        if not record:
            return
        record.update(updates)
        record["status"] = finalize_job_status(record.get("status"), record.get("artifacts"), record.get("error"))
        record["updatedAt"] = now_iso()


def get_job(job_id: str) -> dict[str, Any] | None:
    with jobs_lock:
        record = jobs.get(job_id)
        return dict(record) if record else None


def write_dummy_glb(output_path: Path, metadata: dict[str, Any]) -> None:
    gltf_json = {
        "asset": {"version": "2.0", "generator": "StylistAI-Worker-RunPod"},
        "scene": 0,
        "scenes": [{"nodes": []}],
        "nodes": [],
        "extras": metadata,
    }
    json_bytes = json.dumps(gltf_json, separators=(",", ":")).encode("utf-8")
    padded_json = json_bytes + (b" " * ((4 - len(json_bytes) % 4) % 4))
    total_length = 12 + 8 + len(padded_json)

    with output_path.open("wb") as glb:
        glb.write(struct.pack("<III", 0x46546C67, 2, total_length))
        glb.write(struct.pack("<I4s", len(padded_json), b"JSON"))
        glb.write(padded_json)


def build_artifact_url(output_path: Path, job_id: str) -> str:
    if OUTPUT_PUBLIC_BASE_URL:
        base = OUTPUT_PUBLIC_BASE_URL.rstrip("/")
        return f"{base}/{job_id}.glb"
    return output_path.as_uri()


def run_3d_pipeline(job_id: str, payload: JobRequest) -> None:
    logger.info("job_started jobId=%s jobType=%s", job_id, payload.jobType)
    update_job(job_id, status="in_progress")
    started = time.perf_counter()
    output_path = OUTPUT_DIR / f"{job_id}.glb"

    try:
        features = {
            "imageUrlLength": len(payload.imageUrl),
            "hasModelUrl": bool(payload.modelUrl),
            "optionKeys": sorted(payload.options.keys()),
        }

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
        logger.info("job_completed jobId=%s durationMs=%s", job_id, duration_ms)
    except Exception as exc:
        logger.exception("job_failed jobId=%s", job_id)
        update_job(
            job_id,
            status="failed",
            error={
                "code": "PROCESSING_ERROR",
                "message": str(exc),
                "type": exc.__class__.__name__,
            },
        )


@app.on_event("startup")
def startup_log() -> None:
    logger.info("app_loaded title=%s version=%s", app.title, app.version)
    logger.info("server_starting app=stylistai-worker host=0.0.0.0 port=%s", os.getenv("PORT", "8000"))
    logger.info("cors_allowed_origins origins=%s", ",".join(allowed_origins))
    logger.info("server_ready output_dir=%s max_workers=%s", OUTPUT_DIR, MAX_WORKERS)
    logger.info("cors_allowed_origins origins=%s", CORS_ALLOWED_ORIGINS)


@app.get("/")
def root() -> dict[str, str]:
    return {"message": "StylistAI GPU worker running"}


@app.get("/ping")
def ping() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/health")
def health() -> dict[str, Any]:
    return {
        "status": "ok",
        "service": "stylistai-gpu-worker",
        "outputDir": str(OUTPUT_DIR),
        "maxWorkers": MAX_WORKERS,
    }


@app.get("/diagnostics")
def diagnostics() -> dict[str, Any]:
    with jobs_lock:
        sample = list(jobs.values())[-3:]
    return {
        "service": "stylistai-gpu-worker",
        "jobCount": len(jobs),
        "sampleJobs": [
            {"jobId": item["jobId"], "status": normalize_status(item.get("status")), "updatedAt": item.get("updatedAt")}
            for item in sample
        ],
    }


@app.middleware("http")
async def auth_middleware(request: Request, call_next):
    if request.url.path in {"/ping", "/", "/health"}:
        return await call_next(request)

    expected_token = os.getenv("BLENDER_WORKER_TOKEN", "").strip()
    if not expected_token:
        return await call_next(request)

    authorization = request.headers.get("authorization", "")
    if authorization != f"Bearer {expected_token}":
        return JSONResponse(status_code=401, content={"detail": "Unauthorized", "message": "no token provided"})

    return await call_next(request)


@app.post("/jobs", response_model=JobResponse)
def create_job(payload: JobRequest) -> dict[str, str]:
    if not payload.imageUrl.strip():
        raise HTTPException(status_code=400, detail={"code": "VALIDATION_ERROR", "message": "imageUrl is required"})

    job_id = str(uuid.uuid4())
    register_job(job_id, payload)
    logger.info("job_created jobId=%s jobType=%s", job_id, payload.jobType)
    executor.submit(run_3d_pipeline, job_id, payload)
    return {"jobId": job_id, "status": "queued"}


@app.post("/")
def create_job_lb(payload: LbRequest) -> dict[str, str]:
    created = create_job(payload.input)
    return {
        "id": created["jobId"],
        "jobId": created["jobId"],
        "status": "QUEUED",
    }


@app.get("/jobs/{jobId}")
def job_status(jobId: str) -> dict[str, Any]:
    record = get_job(jobId)
    if not record:
        raise HTTPException(status_code=404, detail={"code": "NOT_FOUND", "message": "Job not found"})

    status = finalize_job_status(record.get("status"), record.get("artifacts"), record.get("error"))
    response: dict[str, Any] = {
        "jobId": jobId,
        "status": status,
    }
    if record.get("artifacts"):
        response["artifacts"] = record["artifacts"]
    if record.get("metrics"):
        response["metrics"] = record["metrics"]
    if record.get("error"):
        response["error"] = record["error"]
    return response


@app.get("/status/{jobId}")
def job_status_alias(jobId: str) -> dict[str, Any]:
    return job_status(jobId)


if __name__ == "__main__":
    import uvicorn

    port = int(os.environ.get("PORT", "8000"))
    logger.info("server_bootstrap uvicorn host=0.0.0.0 port=%s", port)
    uvicorn.run(app, host="0.0.0.0", port=port)
