# RunPod Pipeline + Meshy API (Image-to-3D) Function Reference and Error Guide

This document explains the role of each key function used in the RunPod worker pipeline and the Meshy API 3D generation flow, then maps **HTTP 401 / 403 / 502** to the exact function(s) where those failures are generated or surfaced.

## 1) End-to-end execution flow

At runtime, the worker follows this sequence:

1. `run_3d_pipeline(...)` receives one queued job and normalizes payload options.
2. `Fashion3DController.run(...)` orchestrates the full 3D pipeline.
3. `MeshyPipeline.generate_base_model(...)` performs the Meshy image-to-3D lifecycle:
   - validate auth/input
   - submit task (`_create_task`)
   - poll until finished (`_wait_for_completion`)
   - download model (`_download`)
4. `Fashion3DController._run_blender(...)` runs Blender headless for post-processing/final export.
5. `run_3d_pipeline(...)` persists artifacts/metrics or stores failure payloads.

---

## 2) RunPod pipeline functions and purpose

## `handler.py`

### `run_3d_pipeline(job_id, payload)`
**Purpose:** Main asynchronous job executor for the worker. It assembles normalized `piece_data`, invokes the controller, writes debug files, and updates in-memory job status (`completed` or `failed`).

**Why this function matters for errors:**
- It catches all exceptions and serializes them into job-safe error payloads.
- It is the function that exposes Meshy-specific failures to clients (for example, `MeshyPipelineError` with `code`, `message`, and `details`).

### `build_artifact_url(output_path, job_id)`
**Purpose:** Resolves the public URL for generated outputs (either from `OUTPUT_PUBLIC_BASE_URL` or local `file://` URI).

**Error relationship:** Not directly responsible for 401/403/502, but it runs only after successful pipeline completion.

### `auth_middleware(request, call_next)`
**Purpose:** Enforces worker API authentication for private endpoints (except whitelisted health endpoints).

**Error relationship:**
- Can emit **401** if request auth is missing/invalid according to worker token rules.
- Not part of Meshy provider communication, but part of RunPod API surface.

---

## `controller.py`

### `Fashion3DController.__init__()`
**Purpose:** Initializes output root, Blender binary path, and the Meshy client (`MeshyPipeline`).

### `Fashion3DController.run(job_id, piece_data)`
**Purpose:** Pipeline orchestrator. It creates job/debug directories, calls Meshy generation, calls Blender processing, writes pipeline debug metadata, and returns final artifacts + metrics.

**Error relationship:**
- Propagates Meshy failures from `generate_base_model(...)`.
- Propagates Blender failures from `_run_blender(...)`.

### `Fashion3DController._run_blender(input_model, output_model, piece_data, debug_dir)`
**Purpose:** Runs the headless Blender subprocess and persists stdout/stderr logs.

**Error relationship:**
- Throws runtime errors when Blender exits non-zero.
- Not directly tied to HTTP 401/403/502; those are Meshy/network/auth/provider layer statuses.

---

## `meshy_pipeline.py`

### `MeshyPipeline.__init__(api_key, timeout_seconds)`
**Purpose:** Loads Meshy API key and computes normalized create endpoint URL.

### `MeshyPipeline.generate_base_model(piece_type, source_image_url, output_dir, preferred_format)`
**Purpose:** Top-level Meshy generation routine. Validates prerequisites, submits a task, waits for completion, resolves model URL, downloads output, and returns metadata.

**Error relationship:**
- Raises `meshy_auth_not_configured` if API key is absent.
- Raises `meshy_invalid_request` if source image URL is missing.
- Surfaces downstream provider/network errors from create/poll/download helpers.

### `MeshyPipeline.build_meshy_create_url(base_url)` and `_build_url(...)`
**Purpose:** Normalizes configured base URL and avoids duplicated `/openapi/v1` path fragments.

**Error relationship:**
- Prevents endpoint-shape mistakes that could otherwise lead to provider-side failures.
- If a duplicate path still occurs, `_create_task(...)` raises `meshy_endpoint_misconfigured` on 404 with duplicated path signature.

### `_headers()` / `_safe_log_headers()`
**Purpose:** Builds request auth headers and redacted log-safe variants.

### `_request_with_retry(method, url, **kwargs)`
**Purpose:** Shared HTTP transport with timeout handling + retry/backoff on connection-level issues.

**Error relationship:**
- Converts timeouts to `meshy_timeout`.
- Converts repeated connection failures into `dns_resolution_failure` or `meshy_temporarily_unavailable`.
- A provider **502** may appear here as a successful HTTP response (not exception), then be interpreted by caller functions (`_create_task`, `_wait_for_completion`, `_download`).

### `_create_task(image_url, piece_type)`
**Purpose:** Validates image URL reachability/schema, submits POST to Meshy image-to-3D endpoint, and returns `task_id`.

**Error relationship (key mapping):**
- **401/403** ⇒ raises `meshy_auth_failed`.
- **400** ⇒ raises `meshy_bad_request`.
- **>=500** (includes **502**) ⇒ raises `meshy_provider_error`.
- Missing `result/id` ⇒ raises `meshy_provider_invalid_response`.

### `_validate_create_payload_schema(payload)`
**Purpose:** Enforces allowed fields and value constraints before sending request.

**Error relationship:**
- Raises `meshy_invalid_request` if required fields are missing or unsupported fields are present.

### `_validate_image_url_public(image_url)`
**Purpose:** Probes image URL with `HEAD` (and fallback GET probe) to verify provider-accessible, publicly reachable input.

**Error relationship:**
- Raises `meshy_input_image_unreachable` on unreachable URL statuses or DNS-level failures that imply external inaccessibility.

### `_wait_for_completion(task_id)`
**Purpose:** Polls Meshy task endpoint until terminal success/failure or timeout.

**Error relationship (key mapping):**
- **401/403** ⇒ raises `meshy_auth_failed` (poll stage).
- **400** ⇒ raises `meshy_bad_request` (poll stage).
- **>=500** (includes **502**) ⇒ raises `meshy_provider_error` (poll stage).
- Terminal failed/cancelled status ⇒ raises `meshy_task_failed`.
- Poll timeout ⇒ raises `meshy_timeout`.

### `_download(url, output_path)`
**Purpose:** Downloads generated 3D asset bytes from Meshy-provided model URL.

**Error relationship (key mapping):**
- **401/403** ⇒ raises `meshy_auth_failed` (download stage).
- **400** ⇒ raises `meshy_bad_request` (download stage).
- **>=500** (includes **502**) ⇒ raises `meshy_provider_error` (download stage).

---

## 3) Error mapping for requested statuses (401, 403, 502)

## 401 Unauthorized

### Why it can happen
1. Invalid/expired Meshy API key.
2. Missing `Authorization: Bearer <token>` or malformed header.
3. Poll/download endpoint denied due to token scope/account issues.
4. Worker API call itself is unauthorized at middleware layer (client-to-worker auth).

### Where it is caused
- `MeshyPipeline._create_task(...)` → `meshy_auth_failed` for 401/403 create response.
- `MeshyPipeline._wait_for_completion(...)` → `meshy_auth_failed` during polling.
- `MeshyPipeline._download(...)` → `meshy_auth_failed` during asset retrieval.
- `auth_middleware(...)` in `handler.py` for unauthorized requests to protected worker endpoints.

## 403 Forbidden

### Why it can happen
1. API key is valid format but lacks permission for endpoint/project.
2. Provider account-level policy restrictions.
3. Resource-level access denial during polling or asset download.
4. Worker endpoint token present but not allowed (depending on middleware token list).

### Where it is caused
Same function points as 401:
- `_create_task(...)`
- `_wait_for_completion(...)`
- `_download(...)`
- `auth_middleware(...)`

## 502 Bad Gateway

### Why it can happen
1. Upstream Meshy service gateway/proxy transient failure.
2. Provider deployment incident during create/poll/download stages.
3. Intermediate network path issue between RunPod container and Meshy edge.

### Where it is caused
- In Meshy flow, **502 is handled as `status_code >= 500`**, therefore:
  - `_create_task(...)` raises `meshy_provider_error`.
  - `_wait_for_completion(...)` raises `meshy_provider_error`.
  - `_download(...)` raises `meshy_provider_error`.
- If the failure is connection-level rather than HTTP response, `_request_with_retry(...)` may end as `meshy_temporarily_unavailable` (or DNS-specific failure), which is adjacent to typical 502 symptoms from a client perspective.

---

## 4) Practical debugging checklist by error

## For 401/403
1. Verify `MESHY_API_KEY` exists inside the worker environment.
2. Confirm Bearer header format is correct (`Authorization: Bearer ...`).
3. Check whether failure occurs in create vs poll vs download by reading error `details.url` and controller debug step.
4. Validate worker request token if error is produced before Meshy call (middleware-level auth).

## For 502
1. Retry job (transient gateway/provider outages are common).
2. Check logs to locate stage (`meshy_submit`, poll URL, or download URL).
3. Distinguish HTTP 502 from connection failures (`dns_resolution_failure`, `meshy_temporarily_unavailable`) in stored error code/details.
4. If persistent, verify `MESHY_BASE_URL` normalization and external network reachability from pod.

---

## 5) Quick reference table

| Status | Typical cause | Function that throws | Internal error code |
|---|---|---|---|
| 401 | Invalid/missing Meshy auth | `_create_task`, `_wait_for_completion`, `_download` | `meshy_auth_failed` |
| 403 | Authenticated but forbidden/scope denied | `_create_task`, `_wait_for_completion`, `_download` | `meshy_auth_failed` |
| 502 | Provider upstream failure | `_create_task`, `_wait_for_completion`, `_download` | `meshy_provider_error` |
| n/a (worker API) | Unauthorized request to worker | `auth_middleware` | HTTP response from middleware layer |

