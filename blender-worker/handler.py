"""
handler.py — FastAPI worker entrypoint for the StylistAI Blender GPU Worker.

Jobs are accepted immediately and processed in a background thread.
Clients poll GET /jobs/{jobId} for status until completed or failed.
"""
from __future__ import annotations

import os
import threading
import time
import uuid
from pathlib import Path
from typing import Any

import httpx
from fastapi import FastAPI, Header, HTTPException, Response
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel

from controller import run_blender_pipeline
from meshy_pipeline import MeshyPipeline, MeshyPipelineError
import firestore_state


# ── Config ────────────────────────────────────────────────────────────────────

WORKER_TOKEN = os.getenv("BLENDER_WORKER_TOKEN", "").strip()
OUTPUT_ROOT = Path(os.getenv("BLENDER_OUTPUT_DIR", "/workspace/output"))
DOWNLOAD_TIMEOUT = int(os.getenv("DOWNLOAD_TIMEOUT_SECONDS", "120"))

# In-memory job store: jobId → state dict
_jobs: dict[str, dict[str, Any]] = {}
_jobs_lock = threading.Lock()


# ── App ───────────────────────────────────────────────────────────────────────

app = FastAPI(title="StylistAI Blender GPU Worker", version="3.0.0")


# ── Models ────────────────────────────────────────────────────────────────────

class JobRequest(BaseModel):
    jobId: str | None = None
    modelUrl: str | None = None
    meshyTaskId: str | None = None
    meshyGlbUrl: str | None = None
    logoUrl: str | None = None
    frontAxis: str = "Y"
    logoScale: float = 0.25
    logoOffsetV: float = 0.10
    imageUrl: str | None = None
    pieceId: str | None = None
    options: dict[str, Any] = {}


# ── Helpers ───────────────────────────────────────────────────────────────────

def _auth_check(authorization: str | None) -> None:
    if not WORKER_TOKEN:
        return
    if authorization != f"Bearer {WORKER_TOKEN}":
        raise HTTPException(status_code=401, detail="Unauthorized")


def _download_file(url: str, dest: Path) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    with httpx.stream("GET", url, timeout=DOWNLOAD_TIMEOUT, follow_redirects=True) as r:
        r.raise_for_status()
        with dest.open("wb") as f:
            for chunk in r.iter_bytes(chunk_size=65536):
                f.write(chunk)
    print(f"[handler] downloaded {url} → {dest} ({dest.stat().st_size:,} bytes)")


def _set_job(job_id: str, update: dict[str, Any]) -> None:
    with _jobs_lock:
        if job_id not in _jobs:
            _jobs[job_id] = {}
        _jobs[job_id].update(update)


def _get_job(job_id: str) -> dict[str, Any] | None:
    with _jobs_lock:
        return dict(_jobs[job_id]) if job_id in _jobs else None


def _process_job(job_id: str, payload: JobRequest, job_dir: Path) -> None:
    started = time.perf_counter()

    try:
        # ── Step 1: resolve input GLB ─────────────────────────────────────
        glb_url = payload.meshyGlbUrl or payload.modelUrl
        input_glb = job_dir / "base_meshy.glb"

        if glb_url:
            _set_job(job_id, {"status": "downloading_glb"})
            print(f"[handler] downloading GLB: {glb_url}")
            _download_file(glb_url, input_glb)

        elif payload.imageUrl:
            _set_job(job_id, {"status": "meshy_generating"})
            print(f"[handler] generating 3D model via Meshy from imageUrl={payload.imageUrl}")
            meshy = MeshyPipeline()
            piece_type = (payload.options or {}).get("type", "unspecified_piece")
            meshy_output = meshy.generate_base_model(
                piece_type=str(piece_type),
                source_image_url=payload.imageUrl,
                output_dir=job_dir,
                job_id=job_id,
            )
            input_glb = meshy_output.base_model_path

        else:
            _set_job(job_id, {
                "status": "failed",
                "ok": False,
                "error": "No GLB URL provided. Supply meshyGlbUrl, modelUrl, or imageUrl.",
            })
            return

        # ── Step 2: optionally download logo ──────────────────────────────
        logo_path: str | None = None
        if payload.logoUrl:
            logo_dest = job_dir / "logo.png"
            try:
                _download_file(payload.logoUrl, logo_dest)
                logo_path = str(logo_dest)
            except Exception as exc:
                print(f"[handler] WARNING: failed to download logo ({exc}) — skipping decal")

        # ── Step 3: run Blender pipeline ──────────────────────────────────
        _set_job(job_id, {"status": "blender_processing"})
        firestore_state.upsert_job(job_id, {"status": "blender_running"})
        output_glb = job_dir / "final_model.glb"

        extra_args: dict[str, Any] = {
            "front-axis": payload.frontAxis,
            "logo-scale": payload.logoScale,
            "logo-offset-v": payload.logoOffsetV,
        }
        if logo_path:
            extra_args["logo-path"] = logo_path

        result = run_blender_pipeline(
            input_model_path=str(input_glb),
            output_model_path=str(output_glb),
            extra_args=extra_args,
            job_id=job_id,
        )

        if result is None:
            raise RuntimeError("Pipeline returned None — silent exception in worker thread")

        elapsed_ms = int((time.perf_counter() - started) * 1000)

        if not result["success"]:
            _set_job(job_id, {
                "status": "failed",
                "ok": False,
                "error": "Blender pipeline failed",
                "exitCode": result["exit_code"],
                "elapsedMs": elapsed_ms,
                "stdout": result["stdout"],
                "stderr": result["stderr"],
                "command": result["command"],
                "hint": result.get("hint"),
            })
            firestore_state.upsert_job(job_id, {
                "status": "failed",
                "errorCode": "BLENDER_PIPELINE_FAILED",
                "errorDetail": "Blender pipeline failed",
            })
            return

        # ── Step 4: mark completed ────────────────────────────────────────
        _set_job(job_id, {
            "status": "completed",
            "ok": True,
            "stage": "completed",
            "artifacts": {"final_model_glb": str(output_glb)},
            "metrics": {"totalMs": elapsed_ms, "blenderMs": result["elapsed_ms"]},
        })
        firestore_state.upsert_job(job_id, {"status": "succeeded"})

    except MeshyPipelineError as exc:
        elapsed_ms = int((time.perf_counter() - started) * 1000)
        _set_job(job_id, {
            "status": "failed",
            "ok": False,
            "stage": "meshy_generate",
            "error": exc.message,
            "code": exc.code,
            "details": exc.details,
            "elapsedMs": elapsed_ms,
        })
        firestore_state.upsert_job(job_id, {
            "status": "failed",
            "errorCode": exc.code,
            "errorDetail": exc.message,
        })
    except Exception as exc:
        elapsed_ms = int((time.perf_counter() - started) * 1000)
        _set_job(job_id, {
            "status": "failed",
            "ok": False,
            "error": f"Unexpected worker error: {exc}",
            "elapsedMs": elapsed_ms,
        })
        firestore_state.upsert_job(job_id, {
            "status": "failed",
            "errorCode": "WORKER_EXCEPTION",
            "errorDetail": str(exc),
        })


# ── Routes ────────────────────────────────────────────────────────────────────

@app.get("/")
def root() -> dict[str, str]:
    return {"service": "stylistai-blender-worker", "status": "ok"}


@app.get("/ping")
def ping() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/health")
def health() -> dict[str, Any]:
    blender_bin = os.getenv("BLENDER_BIN", "blender")
    blender_exists = Path(blender_bin).exists() if "/" in blender_bin else True
    return {
        "status": "ok",
        "blender_bin": blender_bin,
        "blender_bin_exists": blender_exists,
        "pyopengl_platform": os.getenv("PYOPENGL_PLATFORM", ""),
        "libgl_always_software": os.getenv("LIBGL_ALWAYS_SOFTWARE", ""),
        "output_root": str(OUTPUT_ROOT),
    }


@app.post("/jobs")
def create_job(
    payload: JobRequest,
    authorization: str | None = Header(default=None),
) -> JSONResponse:
    _auth_check(authorization)

    job_id = payload.jobId or str(uuid.uuid4())
    job_dir = OUTPUT_ROOT / job_id
    job_dir.mkdir(parents=True, exist_ok=True)

    created_at_iso = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    _set_job(job_id, {
        "jobId": job_id,
        "status": "queued",
        "ok": True,
        "pieceId": payload.pieceId,
        "createdAt": time.time(),
    })
    firestore_state.upsert_job(job_id, {
        "pieceId": payload.pieceId,
        "userId": None,
        "status": "queued",
        "meshyTaskId": None,
        "model3dUrl": None,
        "errorCode": None,
        "errorDetail": None,
        "createdAt": created_at_iso,
    })

    thread = threading.Thread(target=_process_job, args=(job_id, payload, job_dir), daemon=True)
    thread.start()

    return JSONResponse(
        status_code=202,
        content={"ok": True, "jobId": job_id, "status": "queued"},
    )


@app.get("/jobs/{job_id}")
def get_job(
    job_id: str,
    authorization: str | None = Header(default=None),
) -> JSONResponse:
    _auth_check(authorization)

    state = _get_job(job_id)
    if state is None:
        return JSONResponse(status_code=404, content={"ok": False, "error": "job_not_found", "jobId": job_id})

    return JSONResponse(status_code=200, content={"jobId": job_id, **state})


_ARTIFACT_CONTENT_TYPES: dict[str, str] = {
    ".glb": "model/gltf-binary",
    ".usdz": "model/vnd.usdz+zip",
    ".png": "image/png",
    ".json": "application/json",
}


@app.get("/artifacts/{job_id}/{filename}", response_model=None)
def get_artifact(
    job_id: str,
    filename: str,
    authorization: str | None = Header(default=None),
) -> Response:
    _auth_check(authorization)

    # Prevent path traversal
    if "/" in filename or "\\" in filename or filename.startswith("."):
        raise HTTPException(status_code=400, detail="Invalid filename")

    artifact_path = OUTPUT_ROOT / job_id / filename
    if not artifact_path.exists() or not artifact_path.is_file():
        return JSONResponse(status_code=404, content={"ok": False, "error": "artifact_not_found", "jobId": job_id, "filename": filename})

    suffix = artifact_path.suffix.lower()
    media_type = _ARTIFACT_CONTENT_TYPES.get(suffix, "application/octet-stream")
    return FileResponse(path=str(artifact_path), media_type=media_type, filename=filename)
