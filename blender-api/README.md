# StylistAI API Orchestrator Runtime

Lightweight FastAPI layer that fronts the GPU worker.

## Endpoints
- `POST /submit` (aliases: `POST /jobs`, `POST /` LB style)
- `GET /status/{jobId}` (alias: `GET /jobs/{jobId}`)
- `GET /health`
- `GET /ping`
- `GET /diagnostics`

## Environment variables
- `GPU_WORKER_URL` (required in production)
- `GPU_WORKER_TOKEN` (optional, recommended)
- `API_ORCHESTRATOR_TOKEN` (optional)
- `API_REQUEST_TIMEOUT_MS` (default `15000`)

## Build

From repo root:

```bash
DOCKER_BUILDKIT=1 docker build -f blender-api/Dockerfile -t stylistai-api:runpod-2026-04-09 .
```
