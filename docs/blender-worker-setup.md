# Blender UV Worker Setup Guide

This guide explains the exact setup required to run the new UV pipeline end-to-end.

## 1) Install Blender and create base scene
1. Install Blender 4.x locally.
2. Create a scene file named `upper_body_v1.blend`.
3. Ensure the garment mesh object is named exactly: `GARMENT_LAYER`.
4. Save this file in your worker scenes directory, for example: `./blender-worker/scenes/upper_body_v1.blend`.

> The current automation script expects `GARMENT_LAYER` to exist.

## 2) Run the local Blender worker API
From repository root:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r blender-worker/requirements.txt
export BLENDER_BIN="/Applications/Blender.app/Contents/MacOS/Blender"   # adjust for your OS
export BLENDER_SCENE_DIR="$(pwd)/blender-worker/scenes"
export BLENDER_OUTPUT_DIR="$(pwd)/blender-worker/output"
export BLENDER_WORKER_TOKEN="change-me"
uvicorn blender-worker.app:app --host 0.0.0.0 --port 8011
```

## 3) Configure the Next.js backend
In your app environment (`.env.local`):

```bash
BLENDER_PIPELINE_API_URL="http://127.0.0.1:8011/jobs"
BLENDER_PIPELINE_API_TOKEN="change-me"
```

Restart Next.js after updating env vars.

## 4) Validate the flow
1. Open `add-wardrobe-item`.
2. Submit an upper piece (e.g. red adidas shirt).
3. After item creation, the app enqueues a UV job and displays a `jobId` with status.
4. Check `blender-worker/output` for:
   - `<wardrobe_item_id>_uv_layout.png`
   - `<wardrobe_item_id>_preview_front.png`
   - `<wardrobe_item_id>_result.json`

## 5) Troubleshooting
- `Base scene not found`: verify `BLENDER_SCENE_DIR` and file name.
- `Required object not found: GARMENT_LAYER`: rename mesh object in Blender.
- 401 unauthorized: ensure `BLENDER_WORKER_TOKEN` equals `BLENDER_PIPELINE_API_TOKEN`.
- Empty artifacts: check Blender render camera/light in `upper_body_v1.blend`.

