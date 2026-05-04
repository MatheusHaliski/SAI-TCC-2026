from __future__ import annotations

import json
import logging
import os
import threading
import time
import traceback
import uuid
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Literal

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
import mimetypes
import re as _re
from fastapi.responses import FileResponse, JSONResponse, Response
from pydantic import BaseModel, Field

from blender_common import finalize_job_status, normalize_status
from controller import Fashion3DController
from meshy_pipeline import MeshyPipelineError

logging.basicConfig(
    level=os.getenv("LOG_LEVEL", "INFO").upper(),
    format="%(asctime)s %(levelname)s %(name)s %(message)s",
)
logger = logging.getLogger("stylistai.worker")
logger.info("worker_module_loaded entrypoint=handler.py")


pipeline_controller = Fashion3DController()
_AUTH_WARNING_EMITTED = False


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


def _get_env_float(name: str, default: float) -> float:
    raw = os.getenv(name, "").strip()
    if not raw:
        return default
    try:
        return float(raw)
    except ValueError:
        logger.warning("Invalid %s value '%s'; using default %.4f", name, raw, default)
        return default


def _runtime_diagnostics() -> dict[str, Any]:
    auth = _resolve_worker_auth()
    return {
        "appVersion": os.getenv("APP_VERSION", app.version).strip() or app.version,
        "imageTag": os.getenv("IMAGE_TAG", "").strip() or "unknown",
        "buildSha": os.getenv("BUILD_SHA", "").strip() or "unknown",
        "pipelineVersion": "fashion-ai-meshy-blender-v2",
        "workerOutputDir": str(OUTPUT_DIR),
        "authEnabled": bool(auth["tokens"]),
        "authSource": ",".join(auth["sources"]) if auth["tokens"] else "disabled",
    }


def _resolve_expected_worker_token() -> str:
    auth = _resolve_worker_auth()
    return auth["tokens"][0] if auth["tokens"] else ""


def _resolve_worker_auth() -> dict[str, list[str]]:
    tokens: list[str] = []
    sources: list[str] = []

    blender_worker_token = os.getenv("BLENDER_WORKER_TOKEN", "").strip()
    if blender_worker_token:
        tokens.append(blender_worker_token)
        sources.append("BLENDER_WORKER_TOKEN")

    gpu_worker_token = os.getenv("GPU_WORKER_TOKEN", "").strip()
    if gpu_worker_token and gpu_worker_token not in tokens:
        tokens.append(gpu_worker_token)
        sources.append("GPU_WORKER_TOKEN")

    return {"tokens": tokens, "sources": sources}

OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
jobs_lock = threading.Lock()
executor = ThreadPoolExecutor(max_workers=MAX_WORKERS)

JobState = Literal["queued", "submitted", "in_progress", "completed", "failed", "cancelled"]
jobs: dict[str, dict[str, Any]] = {}
job_queue: list[str] = []


class JobRequest(BaseModel):
    modelUrl: str | None = None
    imageUrl: str
    jobType: str = "blender_uv_pipeline"
    options: dict[str, Any] = Field(default_factory=dict)


class JobResponse(BaseModel):
    jobId: str
    status: JobState


class LbRequest(BaseModel):
    input: dict[str, Any]


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def build_preflight_response(request: Request) -> Response:
    request_origin = request.headers.get("origin", "")
    allow_origin = request_origin if request_origin in allowed_origins else allowed_origins[0]
    headers = {
        "Access-Control-Allow-Origin": allow_origin,
        "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
        "Access-Control-Allow-Headers": request.headers.get("access-control-request-headers", "*"),
        "Access-Control-Max-Age": "86400",
    }
    return Response(status_code=204, headers=headers)


def register_job(job_id: str, payload: dict[str, Any]) -> None:
    with jobs_lock:
        job_queue.append(job_id)
        jobs[job_id] = {
            "jobId": job_id,
            "status": "queued",
            "createdAt": now_iso(),
            "updatedAt": now_iso(),
            "request": payload,
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


def build_artifact_url(output_path: Path, job_id: str) -> str:
    if OUTPUT_PUBLIC_BASE_URL:
        base = OUTPUT_PUBLIC_BASE_URL.rstrip("/")
        return f"{base}/{job_id}.glb"
    return output_path.as_uri()


def run_3d_pipeline(job_id: str, payload: dict[str, Any]) -> None:
    image_url = str(payload.get("imageUrl", "")).strip()
    job_type = str(payload.get("jobType", "blender_uv_pipeline") or "blender_uv_pipeline")
    options = payload.get("options", {})
    if not isinstance(options, dict):
        options = {}

    print(f"[JOB] start id={job_id}")
    logger.info("job_started jobId=%s jobType=%s", job_id, job_type)
    with jobs_lock:
        if job_id in job_queue:
            job_queue.remove(job_id)
    update_job(job_id, status="in_progress")
    started = time.perf_counter()

    job_dir = OUTPUT_DIR / job_id
    job_dir.mkdir(parents=True, exist_ok=True)
    debug_path = job_dir / "debug.json"

    debug: dict[str, Any] = {
        "jobId": job_id,
        "originalImageUrl": image_url,
        "pipeline": "fashion-ai-meshy-blender-v2",
        "timestamps": {"startedAt": now_iso()},
    }

    try:
        logger.info("job_meshy_endpoint jobId=%s create_url=%s", job_id, pipeline_controller.meshy.create_url)
        piece_data = {
            "piece_type": options.get("pieceType") or options.get("piece_type") or "garment",
            "color": options.get("color"),
            "material": options.get("material"),
            "fabric_type": options.get("fabricType"),
            "logo_url": options.get("logoUrl"),
            "pattern_url": options.get("patternUrl"),
            "reference_image_url": image_url or None,
            "job_type": job_type,
        }
        result = pipeline_controller.run(job_id=job_id, piece_data=piece_data)
        duration_ms = int((time.perf_counter() - started) * 1000)
        debug.update(result.debug)
        debug["timestamps"]["finishedAt"] = now_iso()
        debug["durationMs"] = duration_ms
        debug_path.write_text(json.dumps(debug, indent=2), encoding="utf-8")

        artifacts = dict(result.artifacts)
        model_path = Path(artifacts.get("model_3d_path", ""))
        if model_path.exists():
            artifacts["model_3d_url"] = build_artifact_url(model_path, job_id)
        artifacts["debug_report_path"] = str(debug_path)

        update_job(
            job_id,
            status="completed",
            artifacts=artifacts,
            metrics=result.metrics,
            debug=debug,
            error=None,
        )
        print(f"[JOB] success id={job_id}")
        logger.info("job_completed jobId=%s durationMs=%s", job_id, duration_ms)
    except Exception as exc:
        print(f"[JOB] error id={job_id} err={str(exc)}")
        logger.exception("job_failed jobId=%s", job_id)
        if isinstance(exc, MeshyPipelineError):
            error_payload = {"code": exc.code, "message": exc.message, "type": exc.__class__.__name__, "details": exc.details}
        else:
            error_payload = {"code": "processing_error", "message": str(exc), "type": exc.__class__.__name__}
        debug["error"] = error_payload
        debug_path.write_text(json.dumps(debug, indent=2), encoding="utf-8")
        update_job(
            job_id,
            status="failed",
            error=error_payload,
            debug=debug,
        )


@app.on_event("startup")
def startup_log() -> None:
    runtime = _runtime_diagnostics()
    logger.info("app_loaded title=%s version=%s", app.title, app.version)
    logger.info("server_starting app=stylistai-worker host=0.0.0.0 port=%s", os.getenv("PORT", "8000"))
    logger.info("cors_allowed_origins origins=%s", ",".join(allowed_origins))
    logger.info("runtime_diagnostics %s", json.dumps(runtime, sort_keys=True))
    logger.info("server_ready output_dir=%s max_workers=%s pipeline=%s", OUTPUT_DIR, MAX_WORKERS, runtime["pipelineVersion"])
    logger.info("meshy_runtime_endpoint create_url=%s", pipeline_controller.meshy.create_url)


@app.get("/")
def root() -> dict[str, str]:
    return {"message": "StylistAI GPU worker running"}


@app.get("/ping")
def ping() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/health")
def health() -> dict[str, Any]:
    runtime = _runtime_diagnostics()
    return {
        "status": "ok",
        "queue_size": len(job_queue),
        "active_jobs": len(jobs),
        "pipeline_loaded": True,
        "service": "stylistai-gpu-worker",
        "outputDir": str(OUTPUT_DIR),
        "maxWorkers": MAX_WORKERS,
        "appVersion": runtime["appVersion"],
        "imageTag": runtime["imageTag"],
        "buildSha": runtime["buildSha"],
        "pipelineVersion": runtime["pipelineVersion"],
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
    if request.method == "OPTIONS":
        return build_preflight_response(request)

    if request.url.path in {"/ping", "/", "/health"}:
        return await call_next(request)

    auth = _resolve_worker_auth()
    expected_tokens = auth["tokens"]
    if not expected_tokens:
        global _AUTH_WARNING_EMITTED
        if not _AUTH_WARNING_EMITTED:
            logger.warning("worker_auth_disabled no BLENDER_WORKER_TOKEN/GPU_WORKER_TOKEN configured; allowing unauthenticated requests")
            _AUTH_WARNING_EMITTED = True
        return await call_next(request)

    authorization = request.headers.get("authorization", "")
    provided = authorization.removeprefix("Bearer ").strip() if authorization.startswith("Bearer ") else ""
    if not provided or provided not in expected_tokens:
        return JSONResponse(
            status_code=401,
            content={
                "detail": "Unauthorized",
                "message": "invalid or missing bearer token",
                "authSource": ",".join(auth["sources"]),
            },
        )

    return await call_next(request)


@app.options("/{rest_of_path:path}")
def preflight(rest_of_path: str, request: Request) -> Response:
    return build_preflight_response(request)


def _submit_job(payload: dict[str, Any]) -> dict[str, str]:
    options = payload.get("options", {})
    has_piece_type = isinstance(options, dict) and bool(str(options.get("pieceType") or options.get("piece_type") or "").strip())
    if not str(payload.get("imageUrl", "")).strip() and not has_piece_type:
        raise HTTPException(status_code=400, detail={"code": "VALIDATION_ERROR", "message": "Provide imageUrl or options.pieceType"})
    job_id = str(uuid.uuid4())
    register_job(job_id, payload)
    logger.info("job_created jobId=%s jobType=%s", job_id, payload.get("jobType", "blender_uv_pipeline"))
    print(f"[JOB] queued id={job_id}")
    try:
        executor.submit(run_3d_pipeline, job_id, payload)
    except Exception as exc:
        logger.exception("executor_submit_failed jobId=%s", job_id)
        update_job(
            job_id,
            status="failed",
            error={"code": "executor_submit_failed", "message": "Failed to submit job to worker executor"},
        )
        raise HTTPException(
            status_code=500,
            detail={"code": "EXECUTOR_SUBMIT_FAILED", "message": "Failed to submit job to worker executor"},
        ) from exc
    return {"jobId": job_id, "status": "queued"}


@app.post("/jobs", response_model=JobResponse)
async def create_job(request: Request) -> dict[str, str]:
    try:
        print("\n🚀 ===== NEW JOB REQUEST =====")
        raw_body = await request.body()
        print("📦 RAW BODY:", raw_body)

        try:
            payload = await request.json()
            print("📦 PARSED JSON:", payload)
        except Exception as exc:
            print("❌ JSON PARSE ERROR:", str(exc))
            raise HTTPException(status_code=400, detail="Invalid JSON") from exc

        if not isinstance(payload, dict):
            raise HTTPException(status_code=400, detail="JSON body must be an object")

        normalized_payload = {
            "modelUrl": payload.get("modelUrl"),
            "imageUrl": payload.get("imageUrl", ""),
            "jobType": payload.get("jobType", "blender_uv_pipeline"),
            "options": payload.get("options", {}),
        }

        result = _submit_job(normalized_payload)
        return result
    except HTTPException:
        raise
    except Exception as exc:
        print("\n🔥🔥🔥 JOB FAILED 🔥🔥🔥")
        print("ERROR:", str(exc))
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail={"error": str(exc), "type": type(exc).__name__},
        ) from exc


@app.post("/")
def create_job_lb(payload: LbRequest) -> dict[str, str]:
    created = _submit_job(payload.input)
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
    if record.get("qualityReport"):
        response["qualityReport"] = record["qualityReport"]
    if record.get("debug"):
        response["debug"] = record["debug"]
    return response


@app.get("/status/{jobId}")
def job_status_alias(jobId: str) -> dict[str, Any]:
    return job_status(jobId)


_ALLOWED_ARTIFACTS = frozenset({"final_model.glb", "base_meshy.glb", "final_model.usdz", "debug.json", "preview.png"})
_ARTIFACT_CONTENT_TYPES: dict[str, str] = {
    ".glb": "model/gltf-binary",
    ".usdz": "model/vnd.usdz+zip",
    ".json": "application/json",
    ".png": "image/png",
}


@app.get("/artifacts/{job_id}/{filename}")
def get_artifact(job_id: str, filename: str) -> Response:
    if not _re.fullmatch(r"[a-zA-Z0-9_\-]{1,64}", job_id):
        raise HTTPException(status_code=400, detail={"code": "INVALID_JOB_ID", "message": "Invalid job_id format"})
    if filename not in _ALLOWED_ARTIFACTS:
        raise HTTPException(status_code=404, detail={"code": "NOT_FOUND", "message": f"Artifact '{filename}' is not available"})
    artifact_path = OUTPUT_DIR / job_id / filename
    if not artifact_path.exists():
        raise HTTPException(status_code=404, detail={"code": "NOT_FOUND", "message": f"Artifact '{filename}' not found for job {job_id}"})
    suffix = artifact_path.suffix.lower()
    content_type = _ARTIFACT_CONTENT_TYPES.get(suffix) or mimetypes.guess_type(filename)[0] or "application/octet-stream"
    logger.info("artifact_download job_id=%s filename=%s", job_id, filename)
    return FileResponse(artifact_path, media_type=content_type, filename=filename)


if __name__ == "__main__":
    import uvicorn

    port = int(os.environ.get("PORT", "8000"))
    logger.info("server_bootstrap uvicorn host=0.0.0.0 port=%s", port)
    uvicorn.run(app, host="0.0.0.0", port=port)
