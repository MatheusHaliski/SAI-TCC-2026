# Blender Worker Setup (RunPod Serverless)

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
RUNPOD_ENDPOINT_ID="..."
BLENDER_CLOUD_API_URL="https://api.runpod.ai/v2/<endpoint-id>" # optional
RUNPOD_ENDPOINT_URL="https://<your-load-balancer-base-url>"    # optional
BLENDER_CLOUD_API_TOKEN="..."                                  # optional
BLENDER_CLOUD_SUBMIT_PATH="/jobs"                              # optional (LB mode default)
BLENDER_CLOUD_STATUS_PATH_TEMPLATE="/jobs/:jobId"              # optional (LB mode default)
BLENDER_CLOUD_LEGACY_QUEUE_MODE="false"                        # optional
```

> This project now defaults to **RunPod Load Balancer mode** and sends direct requests to your worker HTTP API routes.
> Queue mode is still available behind `BLENDER_CLOUD_LEGACY_QUEUE_MODE=true`, which uses fixed `/run` + `/status/:id`.

## Validation

1. Trigger `POST /api/wardrobe-items/generate-uv` with remote `modelUrl`.
2. Confirm the API returns internal `jobId` and `cloudJobId`.
3. Poll `GET /api/pipeline-jobs/{jobId}` until `completed` or `failed`.
4. Verify `sai-pipelineJobs` and wardrobe `pipeline_stage_details` are updated.
