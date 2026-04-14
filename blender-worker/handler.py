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
from fastapi.responses import JSONResponse, Response
from pydantic import BaseModel, Field

from blender_common import finalize_job_status, normalize_status

logging.basicConfig(
    level=os.getenv("LOG_LEVEL", "INFO").upper(),
    format="%(asctime)s %(levelname)s %(name)s %(message)s",
)
logger = logging.getLogger("stylistai.worker")
logger.info("worker_module_loaded entrypoint=handler.py")


pipeline = None
pipeline_load_error: str | None = None


def get_pipeline():
    global pipeline, pipeline_load_error
    if pipeline is None:
        try:
            import pipeline as p

            pipeline = p
            pipeline_load_error = None
            print("[PIPELINE] loaded successfully")
        except Exception as e:
            pipeline_load_error = str(e)
            print("❌ Pipeline load failed:", pipeline_load_error)
            pipeline = None
    return pipeline


def _pipeline_constant(name: str, fallback: float) -> float:
    p = get_pipeline()
    return float(getattr(p, name, fallback)) if p is not None else fallback


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
    return {
        "appVersion": os.getenv("APP_VERSION", app.version).strip() or app.version,
        "imageTag": os.getenv("IMAGE_TAG", "").strip() or "unknown",
        "buildSha": os.getenv("BUILD_SHA", "").strip() or "unknown",
        "validationMode": os.getenv("VALIDATION_MODE", "production").strip() or "production",
        "minInputShortestSide": int(os.getenv("MIN_INPUT_SHORTEST_SIDE", "256")),
        "blurThresholdDefault": _get_env_float("BLUR_THRESHOLD", _get_env_float("GARMENT_BLUR_THRESHOLD_DEFAULT", _pipeline_constant("DEFAULT_BLUR_THRESHOLD", 100.0))),
        "blurThresholdLowTexture": _get_env_float("BLUR_THRESHOLD_LOW_TEXTURE", _get_env_float("GARMENT_BLUR_THRESHOLD_LOW_TEXTURE", _pipeline_constant("DEFAULT_BLUR_THRESHOLD_LOW_TEXTURE", 80.0))),
        "edgeDensityMin": _get_env_float("EDGE_DENSITY_MIN", _get_env_float("GARMENT_EDGE_DENSITY_MIN", _pipeline_constant("DEFAULT_EDGE_DENSITY_MIN", 0.01))),
        "edgeDensityLowTexture": _get_env_float("EDGE_DENSITY_LOW_TEXTURE", _get_env_float("GARMENT_EDGE_DENSITY_LOW_TEXTURE", _pipeline_constant("DEFAULT_EDGE_DENSITY_LOW_TEXTURE", 0.008))),
        "qualityScoreMin": _get_env_float("QUALITY_SCORE_MIN", 0.35),
        "enablePersonDetection": os.getenv("ENABLE_PERSON_DETECTION", "false").strip().lower() in {"1", "true", "yes", "on"},
    }

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
    p = get_pipeline()
    if p is None:
        print(f"[JOB] error id={job_id} err=Pipeline not available")
        update_job(job_id, status="failed", error={"code": "pipeline_unavailable", "message": "Pipeline not available"})
        return

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
    original_path = job_dir / "input_original"
    cleaned_path = job_dir / "input_cleaned.png"
    base_glb_path = job_dir / "base_meshy.glb"
    refined_glb_path = OUTPUT_DIR / f"{job_id}.glb"
    debug_path = job_dir / "debug.json"

    debug: dict[str, Any] = {
        "jobId": job_id,
        "originalImageUrl": image_url,
        "pipeline": "hybrid_meshy_blender",
        "timestamps": {"startedAt": now_iso()},
    }

    try:
        try:
            p.fetch_image(image_url, original_path)
            validation = p.validate_input_image(original_path)
            debug["validation"] = {
                "accepted": validation.accepted,
                "code": validation.code,
                "message": validation.message,
                "metadata": validation.metadata,
            }
            if not validation.accepted:
                raise p.PipelineError(validation.code or "invalid_input", validation.message or "Input rejected", {"qualityReport": validation.metadata})

            preprocess_meta = p.preprocess_garment(original_path, cleaned_path)
            quality_report = p.score_cleaned_image(cleaned_path)
            debug["preprocess"] = preprocess_meta
            debug["qualityReport"] = quality_report

            prompt = p.build_meshy_prompt(preprocess_meta, options)
            meshy_meta = p.generate_base_glb_with_meshy(cleaned_path, base_glb_path, prompt, options)
            debug["meshy"] = meshy_meta

            blender_meta = p.run_blender_refinement(base_glb_path, refined_glb_path, job_dir)
            debug["blender"] = blender_meta

            duration_ms = int((time.perf_counter() - started) * 1000)
            debug["timestamps"]["finishedAt"] = now_iso()
            debug["durationMs"] = duration_ms
            debug_path.write_text(json.dumps(debug, indent=2), encoding="utf-8")

            update_job(
                job_id,
                status="completed",
                artifacts={
                    "model_3d_url": build_artifact_url(refined_glb_path, job_id),
                    "model_3d_path": str(refined_glb_path),
                    "cleaned_image_path": str(cleaned_path),
                    "base_glb_path": str(base_glb_path),
                    "debug_report_path": str(debug_path),
                },
                metrics={"durationMs": duration_ms},
                qualityReport=quality_report,
                debug=debug,
                error=None,
            )
            print(f"[JOB] success id={job_id}")
            logger.info("job_completed jobId=%s durationMs=%s", job_id, duration_ms)
        except Exception as e:
            print("\n🔥🔥🔥 PIPELINE ERROR 🔥🔥🔥")
            print("ERROR:", str(e))
            print("TRACE:")
            traceback.print_exc()
            raise
    except p.PipelineError as exc:
        debug["error"] = {"code": exc.code, "message": exc.message, "details": exc.details or {}}
        debug["timestamps"]["failedAt"] = now_iso()
        debug_path.write_text(json.dumps(debug, indent=2), encoding="utf-8")
        print(f"[JOB] error id={job_id} err={exc.message}")
        logger.warning("job_failed jobId=%s code=%s message=%s", job_id, exc.code, exc.message)
        update_job(
            job_id,
            status="failed",
            error={"code": exc.code, "message": exc.message, "details": exc.details or {}},
            qualityReport=(exc.details or {}).get("qualityReport") or debug.get("qualityReport"),
            debug=debug,
        )
    except Exception as exc:
        print(f"[JOB] error id={job_id} err={str(exc)}")
        logger.exception("job_failed jobId=%s", job_id)
        debug["error"] = {"code": "processing_error", "message": str(exc), "type": exc.__class__.__name__}
        debug_path.write_text(json.dumps(debug, indent=2), encoding="utf-8")
        update_job(
            job_id,
            status="failed",
            error={
                "code": "processing_error",
                "message": str(exc),
                "type": exc.__class__.__name__,
            },
            debug=debug,
        )


@app.on_event("startup")
def startup_log() -> None:
    runtime = _runtime_diagnostics()
    adaptive_active = runtime["validationMode"].lower() == "adaptive"
    logger.info("app_loaded title=%s version=%s", app.title, app.version)
    logger.info("server_starting app=stylistai-worker host=0.0.0.0 port=%s", os.getenv("PORT", "8000"))
    logger.info("cors_allowed_origins origins=%s", ",".join(allowed_origins))
    logger.info("runtime_diagnostics %s", json.dumps(runtime, sort_keys=True))
    logger.info("adaptive_garment_validation active=%s validationMode=%s", adaptive_active, runtime["validationMode"])
    logger.info("server_ready output_dir=%s max_workers=%s", OUTPUT_DIR, MAX_WORKERS)


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
        "pipeline_loaded": get_pipeline() is not None,
        "service": "stylistai-gpu-worker",
        "outputDir": str(OUTPUT_DIR),
        "maxWorkers": MAX_WORKERS,
        "appVersion": runtime["appVersion"],
        "imageTag": runtime["imageTag"],
        "buildSha": runtime["buildSha"],
        "validationMode": runtime["validationMode"],
        "blurThresholdDefault": runtime["blurThresholdDefault"],
        "blurThresholdLowTexture": runtime["blurThresholdLowTexture"],
        "edgeDensityMin": runtime["edgeDensityMin"],
        "edgeDensityLowTexture": runtime["edgeDensityLowTexture"],
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

    expected_token = os.getenv("BLENDER_WORKER_TOKEN", "").strip()
    if not expected_token:
        return JSONResponse(status_code=500, content={"detail": "Worker auth token is not configured", "message": "Set BLENDER_WORKER_TOKEN"})

    authorization = request.headers.get("authorization", "")
    if authorization != f"Bearer {expected_token}":
        return JSONResponse(status_code=401, content={"detail": "Unauthorized", "message": "no token provided"})

    return await call_next(request)


@app.options("/{rest_of_path:path}")
def preflight(rest_of_path: str, request: Request) -> Response:
    return build_preflight_response(request)


def _submit_job(payload: dict[str, Any]) -> dict[str, str]:
    p = get_pipeline()
    if p is None:
        raise HTTPException(status_code=500, detail="Pipeline not available")

    if not str(payload.get("imageUrl", "")).strip():
        raise HTTPException(status_code=400, detail={"code": "VALIDATION_ERROR", "message": "imageUrl is required"})
    job_id = str(uuid.uuid4())
    register_job(job_id, payload)
    logger.info("job_created jobId=%s jobType=%s", job_id, payload.get("jobType", "blender_uv_pipeline"))
    print(f"[JOB] queued id={job_id}")
    executor.submit(run_3d_pipeline, job_id, payload)
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


if __name__ == "__main__":
    import uvicorn

    port = int(os.environ.get("PORT", "8000"))
    logger.info("server_bootstrap uvicorn host=0.0.0.0 port=%s", port)
    uvicorn.run(app, host="0.0.0.0", port=port)
