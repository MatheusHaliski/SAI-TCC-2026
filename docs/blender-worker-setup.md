# Blender Worker Setup (RunPod Load Balancer)

## Build and Push the Worker Image

```bash
cd blender-worker
docker build -t <registry>/<repo>:<tag> .
docker push <registry>/<repo>:<tag>
```

## Create RunPod Endpoint

1. Open RunPod Serverless.
2. Create endpoint with your custom image `<registry>/<repo>:<tag>`.
3. Ensure command/entrypoint uses image default (`python3 -u /app/handler.py`).
4. Set optional env vars:
   - `BLENDER_BIN=blender`
   - `BLENDER_OUTPUT_UPLOAD_URL=<pre-signed PUT URL or upload endpoint>`

## Backend Configuration

```bash
RUNPOD_API_KEY="..."
RUNPOD_ENDPOINT_URL="https://<endpoint-id>.api.runpod.ai"
BLENDER_CLOUD_API_TOKEN="..."                                  # optional
BLENDER_CLOUD_STATUS_PATH_TEMPLATE="/jobs/:jobId"              # optional when async job IDs exist
```

> This project uses **RunPod Load Balancer mode** and sends direct requests to your worker HTTP routes.

## Validation

1. Trigger `POST /api/wardrobe-items/generate-uv` with remote `modelUrl`.
2. Confirm the API returns internal `jobId` and `cloudJobId`.
3. Poll `GET /api/pipeline-jobs/{jobId}` until `completed` or `failed`.
4. Verify `sai-pipelineJobs` and wardrobe `pipeline_stage_details` are updated.
