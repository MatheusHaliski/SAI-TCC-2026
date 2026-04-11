# StylistAI GPU Worker Runtime

This folder contains the heavy GPU worker runtime.

## Responsibilities
- execute strict product-only fashion 3D pipeline
- validate and preprocess uploaded image before Meshy
- generate and refine GLB artifact
- expose structured job status and diagnostics

## Base image
- `runpod/pytorch:1.0.2-cu1281-torch280-ubuntu2404`

## Endpoints
- `GET /health`
- `GET /ping`
- `GET /diagnostics`
- `POST /jobs` (also `POST /` for LB payload)
- `GET /jobs/{jobId}` (also `GET /status/{jobId}`)

## Pipeline stages
1. Input fetch + validation gate.
2. Garment-only segmentation and recentered cleaned PNG generation.
3. Image quality scoring on cleaned asset.
4. Meshy base generation using cleaned image + metadata prompt.
5. Blender/trimesh refinement (center, normalize scale, clean scene) and final GLB export.

## Failure codes
- `invalid_input_person_detected`
- `invalid_input_low_quality`
- `invalid_input_background_noise`
- `invalid_input_multiple_objects`
- `segmentation_failed`
- `meshy_failed`
- `blender_failed`

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
