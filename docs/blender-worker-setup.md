# Blender Worker Setup (RunPod Load Balancer)

## Why pods keep restarting with only CUDA + Nginx logs

If logs show only template boot logs like:

- `runpod/pytorch:1.0.2-cu1281-torch280-ubuntu2404`
- CUDA startup
- Nginx startup
- pod restart loop

then the endpoint is running the **RunPod template image only** (not this repo's worker image). In that mode, `handler.py` is never loaded, uvicorn is never started, and `/ping` on port `8000` will fail.

## Build and Push the Worker Image

```bash
cd blender-worker
docker build -t <registry>/<repo>:<tag> .
docker push <registry>/<repo>:<tag>
```

## Create RunPod Endpoint

1. Open RunPod Serverless.
2. Create endpoint with your custom image `<registry>/<repo>:<tag>`. **Do not select only a template image**.
3. Set container start command exactly to:
   `python -m uvicorn handler:app --host 0.0.0.0 --port 8000 --log-level info`
4. Ensure working directory is `/app` (this is where Dockerfile copies `handler.py`).
5. Ensure container HTTP port is `8000`.
6. Keep "Container Disk" enabled only if needed; it does not replace worker image setup.
7. Deploy endpoint revision and wait for the new pod.
8. Set optional env vars:
   - `BLENDER_BIN=blender`
   - `BLENDER_OUTPUT_UPLOAD_URL=<pre-signed PUT URL or upload endpoint>`

## Required container contents (must come from custom image)

From `blender-worker/Dockerfile`:
- requirements installed via `pip install -r requirements.txt` (includes `fastapi`, `uvicorn`)
- worker code copied into `/app` (`COPY . .`)
- `handler.py` present at `/app/handler.py`
- startup command launches uvicorn with `handler:app`

If you do not see these behaviors at runtime, the wrong image is deployed.

## Verify deployment is using the merged code

After deploy, endpoint logs should include all of:

1. `worker_module_loaded entrypoint=handler.py`
2. `Uvicorn running on http://0.0.0.0:8000`
3. `server_starting app=stylistai-worker ...`
4. `server_ready output_dir=...`

Then confirm:

```bash
curl -i https://<endpoint-id>.api.runpod.ai/ping
```

Expected: HTTP `200` with `{"status":"ok"}`.

## Deployment mode checklist (what is currently running?)

- **Template only**: logs mention `runpod/pytorch...`, no uvicorn logs, restarts -> ❌ not using this repo image.
- **Custom image**: logs include worker/uvicorn lines above -> ✅ correct.
- **GitHub repo build**: only valid if RunPod build output produces an image containing `/app/handler.py` and the uvicorn command above.
  If build command/entrypoint is missing, behavior falls back to template-like failures.

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
