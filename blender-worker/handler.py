"""
handler.py — FastAPI worker entrypoint for the StylistAI Blender GPU Worker.

Async job queue: POST /jobs returns immediately with status=queued.
Heavy Meshy/Blender pipeline runs in a background thread.
GET /jobs/{jobId} polls status. GET /artifacts/{jobId}/{filename} serves outputs.
"""
from __future__ import annotations

import json
import os
import threading
import time
import traceback
import uuid
from pathlib import Path
from typing import Any

import httpx
from fastapi import FastAPI, Header, HTTPException
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel

from controller import run_blender_pipeline
from meshy_pipeline import MeshyPipeline, MeshyPipelineError
from pipeline import detect_back_texture_artifacts


# ── Config ────────────────────────────────────────────────────────────────────

WORKER_TOKEN = os.getenv("BLENDER_WORKER_TOKEN", "").strip()
OUTPUT_ROOT = Path(os.getenv("BLENDER_OUTPUT_DIR", "/workspace/output"))
DOWNLOAD_TIMEOUT = int(os.getenv("DOWNLOAD_TIMEOUT_SECONDS", "120"))

# ── In-memory job store (survives only while process is alive) ─────────────────

_jobs: dict[str, dict[str, Any]] = {}
_jobs_lock = threading.Lock()

# ── App ───────────────────────────────────────────────────────────────────────

app = FastAPI(title="StylistAI Blender GPU Worker", version="3.0.0")


# ── Models ────────────────────────────────────────────────────────────────────

class JobRequest(BaseModel):
    jobId: str | None = None
    pieceId: str | None = None
    imageUrl: str | None = None
    modelUrl: str | None = None          # pre-built GLB URL (skip Meshy step)
    meshyGlbUrl: str | None = None       # direct Meshy GLB download URL
    meshyTaskId: str | None = None       # legacy — unused in async flow
    logoUrl: str | None = None
    frontAxis: str = "Y"
    logoScale: float = 0.25
    logoOffsetV: float = 0.10
    backSanitizeThreshold: float = 0.15
    options: dict[str, Any] = {}


# ── Helpers ───────────────────────────────────────────────────────────────────

def _auth_check(authorization: str | None) -> None:
    if not WORKER_TOKEN:
        return
    if authorization != f"Bearer {WORKER_TOKEN}":
        raise HTTPException(status_code=401, detail="Unauthorized")


def _download_file(url: str, dest: Path) -> None:
    """Stream-download a file from url to dest."""
    dest.parent.mkdir(parents=True, exist_ok=True)
    with httpx.stream("GET", url, timeout=DOWNLOAD_TIMEOUT, follow_redirects=True) as r:
        r.raise_for_status()
        with dest.open("wb") as f:
            for chunk in r.iter_bytes(chunk_size=65536):
                f.write(chunk)
    print(f"[3d-worker] downloaded {url} → {dest} ({dest.stat().st_size:,} bytes)")


def _write_job_file(job_id: str, job_data: dict[str, Any]) -> None:
    job_file = OUTPUT_ROOT / job_id / "job.json"
    try:
        job_file.write_text(json.dumps(job_data, indent=2, default=str))
    except Exception as exc:
        print(f"[3d-worker] WARNING: failed to write job.json jobId={job_id}: {exc}")


def _update_job(job_id: str, updates: dict[str, Any]) -> None:
    with _jobs_lock:
        if job_id in _jobs:
            _jobs[job_id].update(updates)
            _jobs[job_id]["updatedAt"] = time.time()
            snapshot = dict(_jobs[job_id])
        else:
            snapshot = updates
    _write_job_file(job_id, snapshot)


def _load_job(job_id: str) -> dict[str, Any] | None:
    with _jobs_lock:
        if job_id in _jobs:
            return dict(_jobs[job_id])
    # Worker restart: fall back to job.json on disk
    job_file = OUTPUT_ROOT / job_id / "job.json"
    if job_file.exists():
        try:
            return json.loads(job_file.read_text())
        except Exception:
            pass
    return None


# ── Background Pipeline ────────────────────────────────────────────────────────

def _run_pipeline(job_id: str, payload: JobRequest) -> None:
    """Full Meshy + Blender pipeline executed in a background thread."""
    job_dir = OUTPUT_ROOT / job_id

    print(f"[3d-worker] job running jobId={job_id}")
    _update_job(job_id, {"status": "running", "stage": "running", "progress": 5})

    input_glb = job_dir / "base_meshy.glb"
    glb_url = payload.meshyGlbUrl or payload.modelUrl

    try:
        if glb_url:
            # Flow A: pre-built GLB URL → download directly, then run Blender
            print(f"[3d-worker] download_glb start jobId={job_id}")
            _update_job(job_id, {"stage": "download_glb", "progress": 15})
            try:
                _download_file(glb_url, input_glb)
            except Exception as exc:
                print(f"[3d-worker] failed stage=download_glb jobId={job_id} error={exc}")
                _update_job(job_id, {
                    "ok": False,
                    "status": "failed",
                    "stage": "download_glb",
                    "error": f"Failed to download GLB: {exc}",
                    "progress": 0,
                })
                return

        elif payload.imageUrl:
            # Flow B: generate GLB from image via Meshy, then run Blender
            print(f"[3d-worker] meshy_generate start jobId={job_id}")
            _update_job(job_id, {"stage": "meshy_generate", "status": "meshy_generate", "progress": 10})

            piece_type = str((payload.options or {}).get("pieceType") or "upper_piece")
            try:
                meshy = MeshyPipeline()
                meshy_output = meshy.generate_base_model(
                    piece_type=piece_type,
                    source_image_url=payload.imageUrl,
                    output_dir=job_dir,
                )
                input_glb = meshy_output.base_model_path
                print(f"[3d-worker] meshy_generate end jobId={job_id} task_id={meshy_output.meshy_task_id}")
                _update_job(job_id, {
                    "stage": "download_glb",
                    "progress": 40,
                    "meshyTaskId": meshy_output.meshy_task_id,
                })
            except MeshyPipelineError as exc:
                body_preview = str(exc.details.get("body", exc.details.get("bodyPreview", "")))[:300]
                http_status = exc.details.get("status")
                print(
                    f"[3d-worker] failed stage=meshy_generate jobId={job_id} "
                    f"code={exc.code} error={exc.message} bodyPreview={body_preview}"
                )
                _update_job(job_id, {
                    "ok": False,
                    "status": "failed",
                    "stage": "meshy_generate",
                    "provider": "meshy",
                    "error": exc.message,
                    "httpStatus": http_status,
                    "details": {
                        "bodyPreview": body_preview,
                        "hint": exc.details.get("hint", ""),
                        "code": exc.code,
                    },
                    "progress": 0,
                })
                return
            except Exception as exc:
                tb = traceback.format_exc()
                print(f"[3d-worker] failed stage=meshy_generate jobId={job_id} error={exc}\n{tb}")
                _update_job(job_id, {
                    "ok": False,
                    "status": "failed",
                    "stage": "meshy_generate",
                    "error": f"Unexpected Meshy error: {exc}",
                    "details": {"stackTrace": tb[-1000:]},
                    "progress": 0,
                })
                return

        else:
            print(f"[3d-worker] failed stage=validate jobId={job_id} reason=no_input_url")
            _update_job(job_id, {
                "ok": False,
                "status": "failed",
                "stage": "validate",
                "error": "No GLB URL and no imageUrl provided. Supply meshyGlbUrl, modelUrl, or imageUrl.",
                "progress": 0,
            })
            return

        # ── Optional logo download ───────────────────────────────────────────
        logo_path: str | None = None
        if payload.logoUrl:
            logo_dest = job_dir / "logo.png"
            try:
                _download_file(payload.logoUrl, logo_dest)
                logo_path = str(logo_dest)
            except Exception as exc:
                print(f"[3d-worker] WARNING: failed to download logo ({exc}) — skipping decal")

        # ── Blender pipeline ─────────────────────────────────────────────────
        print(f"[3d-worker] blender_process start jobId={job_id}")
        _update_job(job_id, {"stage": "blender_process", "status": "blender_process", "progress": 50})

        output_glb = job_dir / "final_model.glb"
        extra_args: dict[str, Any] = {
            "front-axis": payload.frontAxis,
            "logo-scale": payload.logoScale,
            "logo-offset-v": payload.logoOffsetV,
            "back-sanitize-threshold": payload.backSanitizeThreshold,
        }
        if logo_path:
            extra_args["logo-path"] = logo_path

        result = run_blender_pipeline(
            input_model_path=str(input_glb),
            output_model_path=str(output_glb),
            extra_args=extra_args,
        )

        if not result["success"]:
            error_msg = f"Blender pipeline failed (exit {result['exit_code']})"
            print(f"[3d-worker] failed stage=blender_process jobId={job_id} error={error_msg}")
            _update_job(job_id, {
                "ok": False,
                "status": "failed",
                "stage": "blender_process",
                "error": error_msg,
                "details": {
                    "exitCode": result["exit_code"],
                    "hint": result.get("hint", ""),
                    "stderrTail": result.get("stderr", "")[-500:],
                },
                "progress": 0,
            })
            return

        print(f"[3d-worker] blender_process end jobId={job_id}")

        # ── Post-render back-stain quality check (non-blocking) ──────────────
        back_stain_metrics: dict[str, Any] = {}
        for candidate in (job_dir / "preview_back.png", job_dir / "back_stain_check.png"):
            if candidate.exists():
                try:
                    back_stain_metrics = detect_back_texture_artifacts(candidate)
                    if back_stain_metrics.get("artifactConfidence", 0.0) > 0.50:
                        print(
                            f"[3d-worker] WARNING: residual back stain artifacts detected "
                            f"jobId={job_id} confidence={back_stain_metrics['artifactConfidence']:.3f}"
                        )
                except Exception as exc:
                    print(f"[3d-worker] WARNING: back stain detection failed: {exc}")
                    back_stain_metrics = {"error": str(exc)}
                break

        # ── Completed ─────────────────────────────────────────────────────────
        print(f"[3d-worker] completed jobId={job_id}")
        _update_job(job_id, {
            "ok": True,
            "status": "completed",
            "stage": "completed",
            "progress": 100,
            "error": None,
            "artifacts": {
                "model_3d_path": str(output_glb),
                "model_3d_url": f"/artifacts/{job_id}/final_model.glb",
            },
            "backStainMetrics": back_stain_metrics,
        })

    except Exception as exc:
        tb = traceback.format_exc()
        print(f"[3d-worker] failed jobId={job_id} error={exc}\n{tb}")
        _update_job(job_id, {
            "ok": False,
            "status": "failed",
            "stage": "error",
            "error": str(exc),
            "details": {"stackTrace": tb[-1500:]},
            "progress": 0,
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
        "active_jobs": len(_jobs),
    }


@app.post("/jobs")
def create_job(
    payload: JobRequest,
    authorization: str | None = Header(default=None),
) -> JSONResponse:
    """Accept a job and return immediately. Pipeline runs in background."""
    _auth_check(authorization)

    job_id = payload.jobId or str(uuid.uuid4())
    job_dir = OUTPUT_ROOT / job_id
    job_dir.mkdir(parents=True, exist_ok=True)

    now = time.time()
    initial_state: dict[str, Any] = {
        "jobId": job_id,
        "pieceId": payload.pieceId,
        "status": "queued",
        "stage": "queued",
        "progress": 0,
        "ok": True,
        "error": None,
        "artifacts": {},
        "createdAt": now,
        "updatedAt": now,
    }

    with _jobs_lock:
        _jobs[job_id] = initial_state
    _write_job_file(job_id, initial_state)

    print(f"[3d-worker] submit accepted jobId={job_id} pieceId={payload.pieceId}")

    # Launch heavy pipeline in a daemon background thread
    t = threading.Thread(target=_run_pipeline, args=(job_id, payload), daemon=True)
    t.start()

    return JSONResponse(
        status_code=200,
        content={
            "ok": True,
            "status": "queued",
            "jobId": job_id,
            "message": "Job accepted",
        },
    )


@app.get("/jobs/{job_id}")
def get_job(
    job_id: str,
    authorization: str | None = Header(default=None),
) -> JSONResponse:
    """Return current job status, progress, and artifacts when completed."""
    _auth_check(authorization)

    job_data = _load_job(job_id)
    if job_data is None:
        return JSONResponse(
            status_code=404,
            content={"ok": False, "error": f"Job {job_id} not found"},
        )

    return JSONResponse(
        status_code=200,
        content={
            "ok": job_data.get("ok", True),
            "jobId": job_id,
            "status": job_data.get("status", "unknown"),
            "progress": job_data.get("progress", 0),
            "stage": job_data.get("stage", ""),
            "error": job_data.get("error"),
            "artifacts": job_data.get("artifacts", {}),
            "details": job_data.get("details"),
            "meshyTaskId": job_data.get("meshyTaskId"),
            "httpStatus": job_data.get("httpStatus"),
            "provider": job_data.get("provider"),
        },
    )


@app.get("/artifacts/{job_id}/{filename}")
def get_artifact(
    job_id: str,
    filename: str,
    authorization: str | None = Header(default=None),
) -> FileResponse:
    """Serve a job artifact file (GLB, USDZ, PNG, JSON)."""
    _auth_check(authorization)

    # Prevent path traversal
    if "/" in filename or "\\" in filename or ".." in filename:
        raise HTTPException(status_code=400, detail="Invalid filename")

    artifact_path = OUTPUT_ROOT / job_id / filename
    if not artifact_path.exists():
        raise HTTPException(
            status_code=404,
            detail=f"Artifact {filename} not found for job {job_id}",
        )

    _MEDIA_TYPES = {
        ".glb": "model/gltf-binary",
        ".usdz": "model/vnd.usdz+zip",
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".json": "application/json",
    }
    media_type = _MEDIA_TYPES.get(artifact_path.suffix.lower(), "application/octet-stream")

    return FileResponse(path=str(artifact_path), media_type=media_type, filename=filename)
