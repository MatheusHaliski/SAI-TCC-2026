# SAI Cloud Blender Pipeline (RunPod Separated Runtime)

This repository now supports a **separated RunPod deployment**:

- `blender-api/`: lightweight FastAPI orchestrator (submit/status/health/diagnostics)
- `blender-worker/`: heavy GPU worker runtime (RunPod PyTorch base image)
- `blender_common/`: shared status contracts used by both runtimes

## Why this architecture

- API starts quickly on `python:3.11-slim` and avoids CUDA/PyTorch pull penalties.
- Worker uses RunPod-native PyTorch image (`runpod/pytorch:1.0.2-cu1281-torch280-ubuntu2404`) so the heavy CUDA stack aligns with RunPod template caches.
- Small code changes can be shipped without rebuilding the heavy worker base by syncing code from a mounted volume or Git at startup.

## Runtime contracts

The API/orchestrator and worker preserve the normalized terminal state behavior:

- terminal statuses: `completed`, `failed`, `cancelled`
- artifact-first completion logic
- error-first failure logic (except explicit `cancelled`)

Primary endpoints:

- `POST /submit` (alias: `POST /jobs`, `POST /` LB-compatible)
- `GET /status/{jobId}` (alias: `GET /jobs/{jobId}`)
- `GET /health` (plus `GET /ping`)
- `GET /diagnostics`

## Build images (immutable tags)

```bash
# API orchestrator image
DOCKER_BUILDKIT=1 docker build -f blender-api/Dockerfile -t stylistai-api:runpod-2026-04-09 .

# GPU worker image
DOCKER_BUILDKIT=1 docker build -f blender-worker/Dockerfile -t stylistai-worker:runpod-2026-04-09 .
```

Optional moving aliases **after** versioned tags are published:

```bash
docker tag stylistai-api:runpod-2026-04-09 stylistai-api:latest
docker tag stylistai-worker:runpod-2026-04-09 stylistai-worker:latest
```

## Push images

```bash
docker tag stylistai-api:runpod-2026-04-09 <registry>/stylistai-api:runpod-2026-04-09
docker tag stylistai-worker:runpod-2026-04-09 <registry>/stylistai-worker:runpod-2026-04-09

docker push <registry>/stylistai-api:runpod-2026-04-09
docker push <registry>/stylistai-worker:runpod-2026-04-09
```

## RunPod guidance

See `docs/runpod-separated-deployment.md` for full pod/env/startup/volume guidance.
