from __future__ import annotations

import os
import time
from typing import Any
from urllib.parse import urlparse

import httpx
from fastapi import FastAPI, Header, HTTPException, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from blender_common import finalize_job_status, normalize_status

GPU_WORKER_URL = os.getenv("GPU_WORKER_URL", "").rstrip("/")
GPU_WORKER_TOKEN = os.getenv("GPU_WORKER_TOKEN", "").strip()
REQUEST_TIMEOUT_MS = int(os.getenv("API_REQUEST_TIMEOUT_MS", "30000"))

if not GPU_WORKER_URL:
    raise RuntimeError("GPU_WORKER_URL is required and must point to the GPU worker service.")


def _is_loopback(url: str) -> bool:
    host = urlparse(url).hostname
    return host in {"127.0.0.1", "localhost"}


if _is_loopback(GPU_WORKER_URL):
    raise RuntimeError("GPU_WORKER_URL cannot point to localhost in orchestrator mode.")

app = FastAPI(title="StylistAI Blender API Orchestrator", version="2.0.0")

ALLOWED_ORIGINS = [
    "https://sai-tcc-2026.vercel.app",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.options("/{rest_of_path:path}")
async def options_handler(request: Request, rest_of_path: str):
    origin = request.headers.get("origin", "*")

    return Response(
        status_code=204,
        headers={
            "Access-Control-Allow-Origin": origin,
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Max-Age": "86400",
        },
    )


@app.middleware("http")
async def add_cors_headers(request: Request, call_next):
    response = await call_next(request)
    origin = request.headers.get("origin")

    if origin:
        response.headers["Access-Control-Allow-Origin"] = origin
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
        response.headers["Access-Control-Allow-Headers"] = "*"

    return response


class JobRequest(BaseModel):
    modelUrl: str | None = None
    imageUrl: str
    jobType: str = "blender_uv_pipeline"
    options: dict[str, Any] = Field(default_factory=dict)


class LbSubmitRequest(BaseModel):
    input: JobRequest


class SubmitResponse(BaseModel):
    jobId: str
    status: str


@app.get("/")
def root() -> dict[str, str]:
    return {"service": "stylistai-blender-api", "status": "ok"}


@app.get("/health")
def health() -> dict[str, Any]:
    return {
        "status": "ok",
        "workerBaseUrl": GPU_WORKER_URL,
        "requestTimeoutMs": REQUEST_TIMEOUT_MS,
    }


@app.get("/ping")
def ping() -> dict[str, str]:
    return {"status": "ok"}


@app.on_event("startup")
def validate_worker():
    if not GPU_WORKER_URL:
        raise RuntimeError("GPU_WORKER_URL not configured")

    try:
        with httpx.Client(timeout=5) as client:
            res = client.get(f"{GPU_WORKER_URL}/ping")
            print("[startup] worker ping:", res.status_code)
    except Exception as exc:
        print("[startup] WARNING: worker not reachable:", str(exc))


def _worker_headers() -> dict[str, str]:
    headers = {"Content-Type": "application/json"}
    if GPU_WORKER_TOKEN:
        headers["Authorization"] = f"Bearer {GPU_WORKER_TOKEN}"
    return headers


def _post_with_retry(
    client: httpx.Client,
    url: str,
    json: dict[str, Any],
    headers: dict[str, str],
    retries: int = 3,
) -> httpx.Response:
    last_exc: Exception | None = None
    for i in range(retries):
        try:
            return client.post(url, json=json, headers=headers)
        except Exception as exc:
            last_exc = exc
            time.sleep(1.5 * (i + 1))
    if last_exc is None:
        raise RuntimeError("Failed to submit request and no exception was captured.")
    raise last_exc


def _normalize_status_payload(job_id: str, payload: dict[str, Any]) -> dict[str, Any]:
    artifacts = payload.get("artifacts") if isinstance(payload.get("artifacts"), dict) else {}
    error = payload.get("error")
    stage = payload.get("stage")
    normalized = finalize_job_status(payload.get("status", stage), artifacts, error)

    response: dict[str, Any] = {
        "jobId": job_id,
        "status": normalized,
    }
    if artifacts:
        response["artifacts"] = artifacts
    if isinstance(payload.get("metrics"), dict):
        response["metrics"] = payload["metrics"]
    if error:
        response["error"] = error
    if stage:
        response["stage"] = normalize_status(stage)
    return response


@app.post("/submit", response_model=SubmitResponse)
def submit(payload: JobRequest, authorization: str | None = Header(default=None)) -> dict[str, str]:
    expected = os.getenv("API_ORCHESTRATOR_TOKEN", "").strip()
    if expected and authorization != f"Bearer {expected}":
        raise HTTPException(status_code=401, detail={"code": "UNAUTHORIZED", "message": "Invalid token."})

    if not payload.imageUrl.strip():
        raise HTTPException(status_code=400, detail={"code": "VALIDATION_ERROR", "message": "imageUrl is required."})

    started = time.perf_counter()
    try:
        print(f"[orchestrator] forwarding request to worker: {GPU_WORKER_URL}/jobs")
        with httpx.Client(timeout=REQUEST_TIMEOUT_MS / 1000) as client:
            response = _post_with_retry(
                client=client,
                url=f"{GPU_WORKER_URL}/jobs",
                json=payload.model_dump(),
                headers=_worker_headers(),
            )
    except Exception as exc:
        print(f"[orchestrator] worker request failed: {str(exc)}")
        raise HTTPException(
            status_code=503,
            detail={
                "code": "WORKER_UNREACHABLE",
                "message": "Failed to reach GPU worker",
                "workerUrl": GPU_WORKER_URL,
                "error": str(exc),
            },
        ) from exc

    if response.status_code >= 400:
        raise HTTPException(
            status_code=502,
            detail={
                "code": "WORKER_SUBMIT_FAILED",
                "message": "GPU worker rejected submit request.",
                "workerStatus": response.status_code,
                "workerBody": response.text[:1200],
            },
        )

    data = response.json()
    status = normalize_status(data.get("status"))
    _ = int((time.perf_counter() - started) * 1000)
    return {"jobId": str(data.get("jobId")), "status": status}


@app.post("/")
def submit_lb(payload: LbSubmitRequest) -> dict[str, str]:
    result = submit(payload.input)
    return {
        "id": result["jobId"],
        "jobId": result["jobId"],
        "status": result["status"].upper(),
    }


@app.get("/status/{job_id}")
def status(job_id: str) -> dict[str, Any]:
    try:
        with httpx.Client(timeout=REQUEST_TIMEOUT_MS / 1000) as client:
            response = client.get(f"{GPU_WORKER_URL}/jobs/{job_id}", headers=_worker_headers())
    except Exception as exc:
        raise HTTPException(
            status_code=503,
            detail={"code": "WORKER_UNREACHABLE", "message": f"Unable to reach GPU worker: {exc}"},
        ) from exc

    if response.status_code == 404:
        raise HTTPException(status_code=404, detail={"code": "NOT_FOUND", "message": "Job not found."})
    if response.status_code >= 400:
        raise HTTPException(
            status_code=502,
            detail={
                "code": "WORKER_STATUS_FAILED",
                "message": "GPU worker status request failed.",
                "workerStatus": response.status_code,
            },
        )

    payload = response.json()
    return _normalize_status_payload(job_id, payload)


@app.get("/jobs/{job_id}")
def status_compat(job_id: str) -> dict[str, Any]:
    return status(job_id)


@app.post("/jobs", response_model=SubmitResponse)
def submit_compat(payload: JobRequest) -> dict[str, str]:
    return submit(payload)


@app.get("/diagnostics")
def diagnostics() -> dict[str, Any]:
    diagnostics_payload: dict[str, Any] = {
        "service": "stylistai-blender-api",
        "workerBaseUrl": GPU_WORKER_URL,
        "workerAuthEnabled": bool(GPU_WORKER_TOKEN),
        "requestTimeoutMs": REQUEST_TIMEOUT_MS,
    }

    try:
        with httpx.Client(timeout=REQUEST_TIMEOUT_MS / 1000) as client:
            response = client.get(f"{GPU_WORKER_URL}/health", headers=_worker_headers())
            diagnostics_payload["workerHealthStatus"] = response.status_code
            diagnostics_payload["workerHealthBody"] = response.json() if response.headers.get("content-type", "").startswith("application/json") else response.text[:300]
    except Exception as exc:
        diagnostics_payload["workerHealthStatus"] = None
        diagnostics_payload["workerHealthError"] = str(exc)

    return diagnostics_payload
