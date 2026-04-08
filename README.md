# SAI Cloud Blender Pipeline (RunPod Load Balancer)

This project now uses a **cloud-first Blender pipeline**. Blender runs headless in a RunPod Serverless worker image, and the Next.js backend tracks + syncs RunPod job state into internal pipeline records.

## Architecture

Frontend  
↓  
Backend (Next.js API routes/services)  
↓  
RunPod API  
↓  
RunPod Serverless Worker (`blender-worker`)  
↓  
Remote Storage URLs (input/output artifacts)  
↓  
Backend status sync to `sai-pipelineJobs` and wardrobe records  
↓  
Frontend processing status + artifacts

## Backend Environment Variables

Set these in your server environment:

```bash
RUNPOD_API_KEY="..."
RUNPOD_ENDPOINT_URL="https://<endpoint-id>.api.runpod.ai"
BLENDER_CLOUD_API_TOKEN="..."                                 # optional override token
```

Resolution rules:
- API URL = `RUNPOD_ENDPOINT_URL` (required)
- API token = `BLENDER_CLOUD_API_TOKEN` fallback to `RUNPOD_API_KEY`
- Calls go directly to the LB URL root.

## RunPod Worker Files

- `blender-worker/Dockerfile`
- `blender-worker/requirements.txt`
- `blender-worker/handler.py`
- `blender-worker/blender-scripts/uv_unwrap.py`

## Deploy Worker to RunPod

1. Build and push worker image:
   ```bash
   docker build -t <registry>/<repo>:<tag> ./blender-worker
   docker push <registry>/<repo>:<tag>
   ```
2. In RunPod Serverless, create/update endpoint with your custom image.
3. Configure worker env vars as needed (example: `BLENDER_OUTPUT_UPLOAD_URL` for artifact upload).
4. Set backend env vars (`RUNPOD_API_KEY`, `RUNPOD_ENDPOINT_URL`) and deploy app.

## Example RunPod Job Payload (submit)

```json
{
  "input": {
    "modelUrl": "https://storage.example.com/assets/item-123.glb",
    "jobType": "uv_unwrap",
    "options": {
      "generation_mode": "fast_uv"
    }
  }
}
```

## Example RunPod Status Response (provider -> backend mapping)

```json
{
  "id": "sync-job-id",
  "status": "IN_PROGRESS"
}
```

Mapped internal status:
- `QUEUED` -> `queued`
- `IN_PROGRESS`/`RUNNING` -> `in_progress`
- `COMPLETED` -> `completed`
- `FAILED`/`CANCELLED`/`TIMED_OUT` -> `failed`

## Example Completed Worker Result Shape

```json
{
  "status": "completed",
  "artifacts": {
    "outputModelPath": "/tmp/runpod-.../output-....glb",
    "outputModelUrl": "https://storage.example.com/processed/item-123.glb"
  },
  "metrics": {
    "durationMs": 12345,
    "blenderDurationMs": 11012
  },
  "logs": {
    "stdout": "...",
    "stderr": "..."
  }
}
```

## Error Handling Contract (safe fallback)

Worker failures return:

```json
{
  "status": "failed",
  "error": {
    "code": "blender_failed",
    "message": "Blender execution failed with exit code 1"
  },
  "logs": {
    "stdout": "...",
    "stderr": "..."
  }
}
```

Backend mirrors cloud status into internal records and updates wardrobe pipeline details with failure metadata.

## Fashion AI Background Studio (Adobe Firefly)

The Outfit Card Background Studio now supports Adobe Firefly as a server-side artwork provider for premium fashion/editorial assets (backgrounds, overlays, frames, and shape packs).

### Environment setup

Add the following variables to your server environment (and mirror in local `.env.local` as needed):

```bash
ADOBE_FIREFLY_CLIENT_ID="..."
ADOBE_FIREFLY_CLIENT_SECRET="..."
ADOBE_FIREFLY_ORG_ID="..."
ADOBE_FIREFLY_SCOPES="openid,AdobeID,read_organizations,additional_info.projectedProductContext,firefly_api"
ADOBE_FIREFLY_BASE_URL="https://firefly-api.adobe.io"
ADOBE_FIREFLY_TIMEOUT_MS="25000"
ADOBE_FIREFLY_ENABLE_REFERENCE_IMAGE="false"
NEXT_PUBLIC_ENABLE_ADOBE_FIREFLY_STUDIO="true"
```

### Security model

- Adobe credentials are used **server-side only** in Next.js API routes/services.
- The frontend calls internal routes (`/api/artwork-studio/*`) and never receives Adobe secrets.

### Feature flag behavior

- `NEXT_PUBLIC_ENABLE_ADOBE_FIREFLY_STUDIO=true`: uses Adobe Firefly backend integration.
- `NEXT_PUBLIC_ENABLE_ADOBE_FIREFLY_STUDIO=false`: keeps local fallback generation in Background Studio.
