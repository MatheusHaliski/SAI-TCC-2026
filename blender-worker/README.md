# StylistAI GPU Worker Runtime

This folder contains the heavy GPU worker runtime.

## Responsibilities
- execute GPU/PyTorch/Blender-compatible workload
- generate artifacts
- expose structured job status and diagnostics

## Base image
- `runpod/pytorch:1.0.2-cu1281-torch280-ubuntu2404`

## Endpoints
- `GET /health`
- `GET /ping`
- `GET /diagnostics`
- `POST /jobs` (also `POST /` for LB payload)
- `GET /jobs/{jobId}` (also `GET /status/{jobId}`)

## Startup behavior
Container default command:

```bash
/usr/local/bin/runpod-worker-bootstrap.sh
```

Bootstrap supports no-heavy-rebuild flows:

- `WORKER_CODE_SYNC_DIR=/runpod-volume/stylistai-worker`
- `WORKER_CODE_SYNC_GIT=https://github.com/<org>/<repo>.git`
- `WORKER_CODE_SYNC_REF=main`

Then launches:

```bash
python -m uvicorn handler:app --host 0.0.0.0 --port 8000 --log-level info
```

## Build

From repo root:

```bash
DOCKER_BUILDKIT=1 docker build -f blender-worker/Dockerfile -t docker.io/matheushaliski/stylistai-worker:runpod-2026-04-11-v3 .
```
