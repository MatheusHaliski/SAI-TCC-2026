# StylistAI RunPod Worker (MVP / Option A)

This directory currently runs a **FastAPI mock-3D worker** for the Add Piece / Virtual Wardrobe flow.

## Current active runtime
- Active app entrypoint: `handler.py`
- Active container command: `uvicorn handler:app --host 0.0.0.0 --port 8000`
- Load Balancer endpoints:
  - `GET /ping`
  - `POST /jobs`
  - `GET /jobs/{jobId}`

## MVP behavior
For MVP, the worker:
1. Downloads the uploaded clothing image from `imageUrl`.
2. Preprocesses it and computes simple image features.
3. Simulates 3D generation.
4. Writes a placeholder `.glb` artifact.
5. Returns job state/artifacts for backend polling.

This preserves the existing frontend/backend job contract while enabling wardrobe asset flow integration.

## Not active yet (future phase)
The Blender runtime is intentionally deferred:
- `app.py`
- `worker_entry.py`
- `blender-scripts/uv_unwrap.py`

These files are retained for a future Blender-based phase once the container/runtime supports Blender.
