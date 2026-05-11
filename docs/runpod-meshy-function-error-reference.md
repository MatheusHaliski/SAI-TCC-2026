# RunPod Pipeline + Meshy 3D Generation Function Reference

This document explains the **purpose of each key function** in the RunPod-based 3D pipeline and Meshy API generation flow, and maps where/why the requested errors can happen: **401**, **403**, and **502**.

---

## 1) End-to-end flow (high level)

1. Backend service decides whether to use RunPod or Meshy fallback.
2. If RunPod is configured, backend submits job to worker and polls status.
3. Worker uses Meshy image-to-3D API to create/poll/download a base model.
4. Worker returns artifacts; backend validates model URL and persists state.
5. Backend surfaces failures as `ServiceError` (commonly HTTP `502` for upstream/provider failures).

Primary implementation files:
- `app/backend/services/WardrobeService.ts`
- `app/backend/services/MeshyService.ts`
- `blender-worker/meshy_pipeline.py`
- `blender-worker/handler.py`
- `blender-api/app.py`

---

## 2) RunPod pipeline functions (backend orchestration)

## `WardrobeService.generateModelFromImage(...)`
**Purpose**
- Central orchestration point for model generation from an image.
- Updates pipeline status and attempt counters.
- Routes to Meshy fallback when RunPod is not configured.
- Submits/polls RunPod jobs and converts worker/provider failures into API-friendly errors.

**Why 502 can occur here**
- `submitBlenderCloudJob` throws (endpoint/token/worker/network issue), then function wraps into `ServiceError(..., 502)`.
- RunPod returns `failed`/`cancelled` either at submit stage or poll stage.
- RunPod completes but artifacts have no valid HTTP model URL.
- Worker returns Meshy-related failures; this function maps worker codes (`meshy_*`) into pipeline failure metadata and throws `502`.

**Notes on 401/403 in this layer**
- This function usually does not emit raw 401/403 directly; auth-style upstream failures are typically transformed into `502` with diagnostics.

---

## 3) Meshy API functions (backend direct fallback client)

## `MeshyService.generate3DModelFromImage(imageUrl, options?)`
**Purpose**
- Runs direct Meshy flow for fallback scenarios (outside RunPod worker): create task, poll until finished, return GLB URL.

**Why 502 can occur here**
- Create response fails.
- Polling fails.
- Meshy task fails.
- Completed response has no GLB URL.

## `MeshyService.createTask(...)`
**Purpose**
- Sends `POST /openapi/v1/image-to-3d` to Meshy and extracts task ID.

**Why 502 can occur here**
- Any non-OK response is mapped to `ServiceError(..., 502)`.
- Missing task ID in successful payload also mapped to `502`.

## `MeshyService.waitUntilFinished(taskId)`
**Purpose**
- Polls `GET /openapi/v1/image-to-3d/{taskId}` until complete/fail/timeout.

**Why 502 can occur here**
- Poll request returns non-OK response.
- Task reaches failed status.
- (Timeout is currently mapped to `504`, not `502`.)

**401/403 behavior in this backend Meshy service**
- It does not explicitly special-case 401 vs 403; non-OK generally becomes 502 with response details.

---

## 4) Meshy API functions (RunPod worker implementation)

## `MeshyPipeline.generate_base_model(...)`
**Purpose**
- Worker-level top function for Meshy generation.
- Validates key inputs, creates task, waits for completion, selects model URL, downloads file, returns metadata.

**Error mapping relevance**
- Can raise `MeshyPipelineError` from inner calls for auth/provider/request issues.

## `MeshyPipeline._create_task(...)`
**Purpose**
- Build and send Meshy create-task request.

**Where 401/403 occur**
- If Meshy responds 401 or 403, this function throws `meshy_auth_failed`.

**Where provider/upstream failure occurs (mapped later to 502)**
- 5xx from Meshy causes `meshy_provider_error`.
- 4xx payload issues (other than 401/403 special case) causes `meshy_bad_request`.

## `MeshyPipeline._wait_for_completion(task_id)`
**Purpose**
- Poll Meshy task status until success/failure/timeout.

**Where 401/403 occur**
- Polling response 401/403 => `meshy_auth_failed`.

**Where provider/upstream failures occur (mapped later to 502)**
- Polling 5xx => `meshy_provider_error`.
- Polling 4xx => `meshy_bad_request`.
- Failed/cancelled task => `meshy_task_failed`.

## `MeshyPipeline._download(url, destination)`
**Purpose**
- Downloads final mesh artifact.

**Where 401/403 occur**
- Download response 401/403 => `meshy_auth_failed`.

**Where provider/upstream failures occur (mapped later to 502)**
- 4xx => `meshy_bad_request`.
- 5xx => `meshy_provider_error`.

## `MeshyPipeline._request_with_retry(...)`
**Purpose**
- Shared network wrapper with retry/backoff for transient connectivity issues.

**Indirect path to 502**
- DNS or connection failures are raised as structured `MeshyPipelineError` (`dns_resolution_failure` / `meshy_temporarily_unavailable`), which upstream orchestration later surfaces as provider-style failures (commonly 502 in backend API responses).

## `MeshyPipeline._validate_image_url_public(image_url)`
**Purpose**
- Verifies the source image is publicly reachable before task creation.

**How 403 can appear here**
- HEAD may return 403 and code retries with GET bytes probe.
- If final probe still returns HTTP >= 400, raises `meshy_input_image_unreachable`.

**Indirect path to 502**
- This is an upstream validation failure in worker; backend typically converts it into a 502-class pipeline failure.

---

## 5) RunPod worker HTTP auth entry points (direct 401)

## `blender-worker/handler.py` → `validate_auth_header(...)`
**Purpose**
- Enforces bearer-token auth on worker API requests.

**Why 401 occurs**
- Missing bearer token.
- Invalid bearer token.
- In this case worker raises `HTTPException(status_code=401)` directly.

## `blender-worker/app.py` auth middleware/guard
**Purpose**
- Protects worker endpoints.

**Why 401 occurs**
- Unauthorized request at worker API boundary.

---

## 6) API gateway/proxy layer that emits 502

## `blender-api/app.py` proxy calls to worker
**Purpose**
- Sits in front of GPU worker and forwards job requests / status calls.

**Why 502 occurs**
- Worker unreachable (connection failure, timeout).
- Worker request-level errors wrapped as upstream failure.

This layer explicitly raises `HTTPException(status_code=502, ...)` when upstream worker communication fails.

---

## 7) Error-by-error summary (requested set)

## 401 Unauthorized
**Common causes**
- Invalid/missing Meshy API key (`Authorization: Bearer ...`).
- Invalid/missing bearer token when calling protected RunPod worker endpoints.

**Functions that trigger/report it**
- `MeshyPipeline._create_task` (Meshy create 401)
- `MeshyPipeline._wait_for_completion` (Meshy poll 401)
- `MeshyPipeline._download` (asset download 401)
- `validate_auth_header` in worker handler (direct worker 401)
- worker app auth guard (direct worker 401)

## 403 Forbidden
**Common causes**
- Meshy credentials recognized but lacking permission/quota scope.
- Asset or source-image URL denies access to Meshy or to the worker probe.

**Functions that trigger/report it**
- `MeshyPipeline._create_task` (Meshy create 403)
- `MeshyPipeline._wait_for_completion` (Meshy poll 403)
- `MeshyPipeline._download` (asset download 403)
- `MeshyPipeline._validate_image_url_public` (403 during reachability probe)

## 502 Bad Gateway
**Common causes**
- Upstream provider failure (Meshy 5xx, malformed response, task failure).
- RunPod worker submit/poll failure from backend perspective.
- Proxy/gateway cannot reach worker.

**Functions that trigger/report it**
- `WardrobeService.generateModelFromImage` (many upstream failures normalized to 502)
- `MeshyService.createTask` / `waitUntilFinished` / `generate3DModelFromImage` (backend fallback path)
- `blender-api/app.py` worker proxy handlers (worker unreachable/request error -> 502)

---

## 8) Practical debugging hints by error

- **401**: verify `MESHY_API_KEY`, worker bearer token, and whether headers are being forwarded exactly once.
- **403**: verify key permissions/quota, private asset/image ACLs, signed URL token presence and expiration.
- **502**: inspect which layer threw it first:
  1) backend orchestration (`WardrobeService`),
  2) proxy (`blender-api/app.py`),
  3) worker Meshy stage (`meshy_pipeline.py`).
  Use stage/errorCode metadata to isolate submit vs poll vs download vs endpoint mismatch.
