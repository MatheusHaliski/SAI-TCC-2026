# RunPod 3D Generation — Full Setup Guide

Everything required to have the pipeline go from a garment image all the way to a finished 3D model.
The pipeline has **three deployment targets** that must be configured together:

```
Vercel (Next.js)  ──►  RunPod API pod  ──►  RunPod GPU Worker pod  ──►  Meshy AI
```

If the API pod is skipped, Vercel calls the GPU Worker pod directly.

---

## 1. Architecture Overview

| Layer | Container / Service | What it does |
|-------|-------------------|-------------|
| **Vercel** | Next.js app | Receives user requests, orchestrates the pipeline, polls job status |
| **API pod** (`blender-api`) | `stylistai-api` Docker image | Lightweight orchestrator — validates payloads, routes to GPU Worker |
| **GPU Worker pod** (`blender-worker`) | `stylistai-worker` Docker image | Runs Meshy image-to-3D, Blender UV pipeline, returns GLB artifacts |
| **Meshy AI** | External SaaS | Converts 2D garment image → 3D base model (GLB) |

---

## 2. Git Repository — What Must Be in the Repo

The Docker images are built from these directories. Every commit that changes the following files requires a new image build and push before the pod will use the changes.

| Directory | Built into | What it contains |
|-----------|-----------|-----------------|
| `blender-worker/` | `stylistai-worker` image | `handler.py`, `meshy_pipeline.py`, `blender_pipeline.py`, `controller.py` |
| `blender-worker/blender-scripts/` | `stylistai-worker` image | Python scripts executed by Blender headlessly |
| `blender-api/` | `stylistai-api` image | `app.py`, `tester2d_pipeline.py` |
| `blender_common/` | both images | Shared utilities used by both containers |
| `scripts/runpod-worker-bootstrap.sh` | `stylistai-worker` image | Startup script; copies code from volume if `WORKER_CODE_SYNC_DIR` is set |
| `Dockerfile` | `stylistai-api` image | Multi-stage build for the API pod |
| `blender-worker/Dockerfile` | `stylistai-worker` image | GPU worker image with Blender + CUDA |

### Build & push commands (run from repo root)

```bash
# API pod
DOCKER_BUILDKIT=1 docker build -f Dockerfile \
  -t docker.io/<your-registry>/stylistai-api:<tag> .

# GPU worker pod
DOCKER_BUILDKIT=1 docker build -f blender-worker/Dockerfile \
  -t docker.io/<your-registry>/stylistai-worker:<tag> .

docker push docker.io/<your-registry>/stylistai-api:<tag>
docker push docker.io/<your-registry>/stylistai-worker:<tag>
```

> **No-rebuild shortcut:** if you only changed Python files, mount the repo on a RunPod network volume and set `WORKER_CODE_SYNC_DIR` on the worker pod. The bootstrap script copies the updated code at startup — no new image build needed.

---

## 3. Vercel Environment Variables

Set these in **Vercel → Project → Settings → Environment Variables**.

### 3.1 Required — RunPod Worker connection

| Variable | Example value | Why it matters |
|----------|--------------|---------------|
| `GPU_WORKER_URL` | `https://abc123-8000.proxy.runpod.net` | Base URL of the GPU Worker pod (or API pod if using the two-pod setup). Without this, Vercel falls back to direct Meshy only. |
| `GPU_WORKER_TOKEN` | `a-long-random-string` | Bearer token sent with every request to the worker. Must match `BLENDER_WORKER_TOKEN` set on the pod. |

### 3.2 Required — Meshy AI (used by the worker AND as a direct fallback)

| Variable | Example value | Why it matters |
|----------|--------------|---------------|
| `MESHY_API_KEY` | `msy_...` | Meshy API key. Required on Vercel if the direct-Meshy fallback path is used (i.e. `GPU_WORKER_URL` is not set). Also used server-side for pre-flight checks. |

### 3.3 Required — Firebase / Firestore

| Variable | Example value | Why it matters |
|----------|--------------|---------------|
| `NEXT_PUBLIC_FIREBASE_DATABASE_ID` | `newsaidb` | Firestore database ID where pipeline state is persisted |

### 3.4 Conditional — Segmentation (needed for wardrobe item creation)

| Variable | Example value | Notes |
|----------|--------------|-------|
| `REPLICATE_API_TOKEN` | `r8_...` | Required if `CLOTHING_SEGMENTATION_PROVIDER=replicate` (the default) |
| `REPLICATE_SEGMENTATION_VERSION` | `<model-version-id>` | Replicate model version for clothing segmentation |
| `CLOTHING_SEGMENTATION_PROVIDER` | `replicate` | Defaults to `replicate`; only change if you have a custom provider |

### 3.5 Optional — Tuning

| Variable | Default | What it controls |
|----------|---------|-----------------|
| `BLENDER_CLOUD_SUBMIT_PATH` | `/jobs` | POST path on the worker; use `/run` for RunPod Serverless format |
| `BLENDER_CLOUD_SUBMIT_PAYLOAD_MODE` | `raw` | `raw` sends payload as-is; `input` wraps it in `{ input: ... }` for RunPod Serverless |
| `BLENDER_CLOUD_STATUS_PATH_TEMPLATE` | `/jobs/:jobId` | Status polling path template |
| `BLENDER_CLOUD_SUBMIT_TIMEOUT_MS` | `15000` | Timeout (ms) for job submission POST |
| `BLENDER_CLOUD_STATUS_TIMEOUT_MS` | `10000` | Timeout (ms) for status GET polling |
| `BLENDER_MODEL_MAX_POLLS` | `48` | Max number of status polls before giving up |
| `BLENDER_MODEL_POLL_MS` | `1500` | Milliseconds between status polls |
| `BLENDER_MODEL_JOB_TYPE` | `image_to_garment` | Job type string sent to the worker |
| `MESHY_BASE_URL` | `https://api.meshy.ai` | Override only if using a Meshy proxy |
| `MESHY_MAX_POLL_ATTEMPTS` | `80` | Max Meshy task polling attempts (direct fallback path) |
| `MESHY_POLL_DELAY_MS` | `3000` | Delay between Meshy polls (direct fallback path) |
| `SEGMENTATION_MIN_CONFIDENCE` | `0.75` | Minimum garment detection confidence (0.0–1.0) |
| `CRON_SECRET` | any string | Protects the `/api/3d-worker/reconcile` cron endpoint |
| `OPENAI_API_KEY` | `sk-...` | Only needed if artwork studio feature is enabled |

---

## 4. RunPod — GPU Worker Pod Environment Variables

Set these in the RunPod pod template under **Environment Variables**.

### 4.1 Required

| Variable | Example value | Why it matters |
|----------|--------------|---------------|
| `MESHY_API_KEY` | `msy_...` | The worker calls Meshy directly to convert the garment image to a 3D base model. Without this, any job that starts from an image will fail immediately. |
| `BLENDER_WORKER_TOKEN` | `a-long-random-string` | The token the worker expects in the `Authorization: Bearer` header. Must match `GPU_WORKER_TOKEN` set on Vercel. |

### 4.2 Baked into the Docker image (no action needed unless overriding)

These are set inside `blender-worker/Dockerfile` and do not need to be entered in RunPod unless you want to change the defaults.

| Variable | Dockerfile default | What it does |
|----------|-------------------|-------------|
| `PYOPENGL_PLATFORM` | `egl` | Tells Blender to use EGL for headless GPU rendering. **Do not change** unless you know the GPU driver stack. |
| `LIBGL_ALWAYS_SOFTWARE` | `1` | Enables software OpenGL fallback for headless Blender. Required in containers without a display. |
| `WORKER_OUTPUT_DIR` | `/workspace/output` | Directory where the worker writes GLB files and metrics. |

### 4.3 Recommended

| Variable | Recommended value | Why |
|----------|-----------------|-----|
| `PORT` | `8000` | Uvicorn listening port; must match the container port exposed in the RunPod pod template |
| `LOG_LEVEL` | `INFO` | Set to `DEBUG` while troubleshooting |
| `CORS_ALLOWED_ORIGINS` | `https://your-app.vercel.app,http://localhost:3000` | Restricts which origins can call the worker directly |
| `WORKER_OUTPUT_DIR` | `/tmp/stylistai-3d-output` | Override the artifact output path if needed |

### 4.4 Optional — Meshy tuning (inside the worker)

| Variable | Default | What it controls |
|----------|---------|-----------------|
| `MESHY_BASE_URL` | `https://api.meshy.ai` | Override if using a Meshy proxy |
| `MESHY_IMAGE_TO_3D_PATH` | `/openapi/v1/image-to-3d` | Override if Meshy changes the endpoint path |
| `MESHY_POLL_DELAY_SECONDS` | `3` | Seconds between Meshy task status polls |
| `MESHY_MAX_POLL_ATTEMPTS` | `80` | Max attempts before declaring timeout |
| `MESHY_NETWORK_RETRIES` | `3` | Retry count for failed Meshy HTTP calls |
| `MESHY_NETWORK_RETRY_BASE_SECONDS` | `1.5` | Base backoff seconds for retries (doubles each attempt) |

### 4.5 Optional — Blender execution tuning

| Variable | Default | What it controls |
|----------|---------|-----------------|
| `BLENDER_BIN` | `blender` | Path to the Blender binary (must be in `$PATH` or absolute) |
| `BLENDER_TIMEOUT_SECONDS` | `300` | Max seconds Blender is allowed to run per job |
| `DOWNLOAD_TIMEOUT_SECONDS` | `120` | Max seconds to download a GLB or logo file from a URL |
| `VALIDATION_MODE` | `production` | Set to `strict` for tighter mesh/image quality checks |

### 4.6 Optional — Code sync without rebuilding the image

| Variable | Example value | What it does |
|----------|--------------|-------------|
| `WORKER_CODE_SYNC_DIR` | `/runpod-volume/stylistai-worker` | If set, the bootstrap script copies updated Python code from this path into `/app` at pod startup — no image rebuild needed for code changes |
| `WORKER_CODE_SYNC_GIT` | `https://github.com/<org>/<repo>.git` | If set together with `WORKER_CODE_SYNC_REF`, the bootstrap script pulls fresh code from git on every startup |
| `WORKER_CODE_SYNC_REF` | `main` | Git branch/tag/commit to check out when using git sync |

---

## 5. RunPod — API Pod Environment Variables (two-pod setup)

Only relevant if you deploy the separate `stylistai-api` container as an orchestrator in front of the GPU Worker.

| Variable | Example value | Required | Notes |
|----------|--------------|---------|-------|
| `GPU_WORKER_URL` | `http://<worker-private-host>:8000` | Yes | URL of the GPU Worker pod. Use the internal pod DNS if both pods are on the same RunPod network. |
| `GPU_WORKER_TOKEN` | `a-long-random-string` | If worker uses auth | Must match `BLENDER_WORKER_TOKEN` on the worker pod |
| `API_ORCHESTRATOR_TOKEN` | `another-random-string` | No | If set, the API pod validates this token on incoming `/submit` requests |
| `PORT` | `8000` | No (default `8000`) | Uvicorn port |
| `API_REQUEST_TIMEOUT_MS` | `30000` | No | Timeout for calls from API pod to GPU Worker |

---

## 6. RunPod — Pod Template Checklist

For **each pod** (GPU Worker and API):

- [ ] **Container image** — use the immutable versioned tag, not `latest`
- [ ] **Container port** — set to `8000` (must match `PORT` env var)
- [ ] **HTTP port exposed** — toggle "Expose HTTP Ports" so RunPod assigns a public proxy URL
- [ ] **Volume** (GPU Worker only) — mount a RunPod network volume at `/runpod-volume` if using code sync
- [ ] **Environment variables** — set all required vars from sections 4.1 and 4.2 above
- [ ] **Start command** — leave blank to use the image default (`runpod-worker-bootstrap.sh` for the GPU Worker; `uvicorn` for the API pod)

After the pod starts, verify with:

```bash
# Health check
curl https://<your-pod-proxy-url>/health

# Diagnostics (shows env var status, Blender version, Meshy reachability)
curl https://<your-pod-proxy-url>/diagnostics
```

---

## 7. Minimum Working Configuration (cheat sheet)

| Where | Variable | Value |
|-------|---------|-------|
| Vercel | `GPU_WORKER_URL` | Public proxy URL of the worker pod |
| Vercel | `GPU_WORKER_TOKEN` | Any strong random string (must match below) |
| Vercel | `MESHY_API_KEY` | Your Meshy API key (only needed for direct fallback) |
| Vercel | `REPLICATE_API_TOKEN` | Your Replicate token (for segmentation) |
| Vercel | `NEXT_PUBLIC_FIREBASE_DATABASE_ID` | `newsaidb` |
| RunPod Worker | `MESHY_API_KEY` | Your Meshy API key |
| RunPod Worker | `BLENDER_WORKER_TOKEN` | Same strong random string as `GPU_WORKER_TOKEN` |
| RunPod Worker | `PORT` | `8000` |
| RunPod Worker | *(Dockerfile)* | `PYOPENGL_PLATFORM=egl`, `LIBGL_ALWAYS_SOFTWARE=1` (already baked in) |

With just these variables set and the correct Docker image deployed, the pipeline should complete a full image → 3D model generation cycle.

---

## 8. End-to-End Flow Reference

```
1. User uploads garment image
        │
        ▼
2. Vercel /api/3d-worker/submit
   → POST {imageUrl, pieceId, jobType} to GPU_WORKER_URL/jobs
   → receives {jobId}
        │
        ▼
3. Vercel polls /api/3d-worker/status (every BLENDER_MODEL_POLL_MS ms)
   → GET GPU_WORKER_URL/jobs/{jobId}
        │
        ▼
4. GPU Worker — handler.py
   a. Validates Bearer token (BLENDER_WORKER_TOKEN)
   b. Calls meshy_pipeline.py → POST MESHY_API_KEY to Meshy image-to-3D
   c. Polls Meshy until task is done (MESHY_MAX_POLL_ATTEMPTS × MESHY_POLL_DELAY_SECONDS)
   d. Downloads GLB from Meshy CDN
   e. Runs Blender UV pipeline (blender_pipeline.py) with BLENDER_BIN
   f. Writes artifacts to WORKER_OUTPUT_DIR
   g. Returns {status: "done", modelUrl: "<glb-url>"}
        │
        ▼
5. Vercel receives modelUrl, updates Firestore record
6. UI displays the 3D model
```

---

## 9. Common Setup Mistakes

| Symptom | Most likely cause |
|---------|-----------------|
| `503 worker_unreachable` | `GPU_WORKER_URL` wrong or pod not running |
| `401 Unauthorized` on worker | `GPU_WORKER_TOKEN` ≠ `BLENDER_WORKER_TOKEN` |
| `502` with hint "Invalid or missing MESHY_API_KEY" | `MESHY_API_KEY` not set on the **worker pod** |
| `504` timeout during Meshy polling | Pod cold start; increase `MESHY_MAX_POLL_ATTEMPTS` or pre-warm the pod |
| Worker returns `job_not_found` | Pod restarted and lost in-memory job registry; re-submit the job |
| Blender subprocess fails immediately | `PYOPENGL_PLATFORM` or `LIBGL_ALWAYS_SOFTWARE` missing (check Dockerfile defaults) |
| Segmentation returns 502 | `REPLICATE_API_TOKEN` not set on Vercel, or wrong `REPLICATE_SEGMENTATION_VERSION` |
