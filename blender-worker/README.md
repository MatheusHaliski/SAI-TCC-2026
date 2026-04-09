# StylistAI RunPod Worker (MVP / Option A)

This directory currently runs a **FastAPI RunPod Load Balancer worker** for the Add Piece / Virtual Wardrobe flow.

## Current active runtime
- Active app entrypoint: `handler.py`
- Active container command: `python -m uvicorn handler:app --host 0.0.0.0 --port 8000 --log-level info`
- Load Balancer endpoints:
  - `GET /`
  - `GET /ping`
  - `POST /`
  - `POST /jobs`
  - `GET /jobs/{jobId}`

## MVP behavior
For MVP, the worker:
1. Accepts LB-compatible payloads on `POST /` (`{ "input": ... }`).
2. Queues a lightweight metadata-only processing step.
3. Writes a deterministic `.glb` artifact.
4. Exposes status polling on `GET /jobs/{jobId}`.

`/ping` is intentionally public for RunPod health checks and bypasses auth middleware.

## Not active yet (future phase)
The Blender runtime is intentionally deferred:
- `app.py`
- `worker_entry.py`
- `blender-scripts/uv_unwrap.py`

These files are retained for a future Blender-based phase once the container/runtime supports Blender.


## RunPod startup entrypoint
- Use the image default command from `blender-worker/Dockerfile` (do not override in RunPod):
  `python -m uvicorn handler:app --host 0.0.0.0 --port 8000 --log-level info`
- Health check endpoint: `GET /ping` returns `{"status":"ok"}`.
- Generation endpoints are served by the same FastAPI app (`POST /`, `POST /jobs`, `GET /jobs/{jobId}`).

## Build and tag guidance (production-safe)
- Build using the worker directory as build context so frontend files and repo-level artifacts are never sent to Docker:
  - `docker buildx build --platform linux/amd64 -t stylistai-worker:runpod-2026-04-09 .`
- Prefer explicit immutable tags for deployments:
  - `stylistai-worker:v1`
  - `stylistai-worker:v2`
  - `stylistai-worker:runpod-2026-04-09`
- You may optionally add a moving alias after publishing a versioned tag:
  - `docker tag stylistai-worker:runpod-2026-04-09 stylistai-worker:latest`
  - but deploy RunPod endpoints against the versioned tag, not `latest` alone.

## RunPod deployment requirement (critical)
- If endpoint logs show only template startup lines (for example `runpod/pytorch:...`) and never show uvicorn logs, the endpoint is not using this worker image.
- You must deploy a **custom image built from `blender-worker/Dockerfile`** and set container port `8000`.
- Expected proof in logs:
  - `worker_module_loaded entrypoint=handler.py`
  - `Uvicorn running on http://0.0.0.0:8000`
  - `server_starting ...`
