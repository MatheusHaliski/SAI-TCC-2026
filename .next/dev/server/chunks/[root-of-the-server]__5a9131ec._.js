module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/app/api/3d-worker/utils.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "StructuredStageError",
    ()=>StructuredStageError,
    "deriveFailureHint",
    ()=>deriveFailureHint,
    "logStage",
    ()=>logStage,
    "safeFetchJson",
    ()=>safeFetchJson,
    "toErrorPayload",
    ()=>toErrorPayload,
    "truncateText",
    ()=>truncateText
]);
class StructuredStageError extends Error {
    stage;
    provider;
    status;
    details;
    hint;
    code;
    constructor(input){
        super(input.message);
        this.name = 'StructuredStageError';
        this.stage = input.stage;
        this.provider = input.provider;
        this.status = input.status;
        this.details = input.details;
        this.hint = input.hint;
        this.code = input.code;
    }
}
function truncateText(value, maxLength = 1000) {
    if (value.length <= maxLength) return value;
    return `${value.slice(0, maxLength)}...<truncated:${value.length - maxLength}>`;
}
function deriveFailureHint(status, code, provider) {
    if (code === 'TIMEOUT') {
        return 'Request timeout: worker cold start or long 3D generation job.';
    }
    if (code === 'INVALID_JSON') {
        return 'Remote service returned invalid JSON (often HTML error page).';
    }
    if (!status) return undefined;
    if (status === 401 || status === 403) {
        return provider === 'meshy' ? 'Invalid or missing MESHY_API_KEY.' : 'Missing or invalid token. Check Authorization Bearer credentials.';
    }
    if (status === 404) {
        return provider === 'meshy' ? 'Meshy endpoint not found. Check MESHY_BASE_URL (expected: https://api.meshy.ai/openapi/v1).' : 'Wrong endpoint path. Verify RunPod path (/jobs vs /run).';
    }
    if (status === 405) return 'Wrong HTTP method used by remote service.';
    if (status === 502 || status === 503) {
        return provider === 'meshy' ? 'Meshy service unavailable.' : 'RunPod pod not ready or Uvicorn app is not running.';
    }
    return undefined;
}
function logStage(event, data) {
    console.info('[3d-worker]', event, data);
}
async function safeFetchJson(url, options, stage, provider) {
    let response;
    try {
        response = await fetch(url, options);
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        const isTimeout = error instanceof Error && error.name === 'AbortError';
        const cause = error instanceof Error ? error.cause : undefined;
        const causeCode = cause instanceof Error ? cause.code : undefined;
        const causeMessage = cause instanceof Error ? cause.message : undefined;
        const errorCode = isTimeout ? 'TIMEOUT' : causeCode ?? undefined;
        const hint = isTimeout ? 'Request timeout: worker cold start or long 3D generation job.' : causeCode === 'ENOTFOUND' ? `DNS resolution failed for "${new URL(url).hostname}". Check network connectivity or MESHY_BASE_URL.` : causeCode === 'ECONNREFUSED' ? `Connection refused by "${new URL(url).hostname}". The host may be down or blocked.` : causeCode ? `Network error (${causeCode}) reaching "${new URL(url).hostname}". Check internet connectivity.` : undefined;
        throw new StructuredStageError({
            stage,
            provider,
            message,
            code: errorCode,
            hint,
            details: {
                fetchError: message,
                causeCode,
                causeMessage
            }
        });
    }
    const status = response.status;
    const contentType = response.headers.get('content-type') ?? 'unknown';
    const rawText = await response.text();
    const rawTextTruncated = truncateText(rawText);
    let parsedJson = null;
    if (rawText.length > 0) {
        try {
            parsedJson = JSON.parse(rawText);
        } catch  {
            parsedJson = null;
        }
    }
    logStage('safe_fetch_result', {
        stage,
        provider,
        status,
        contentType,
        rawTextTruncated,
        parsedJson
    });
    if (!response.ok) {
        throw new StructuredStageError({
            stage,
            provider,
            message: `Remote request failed with status ${status}`,
            status,
            details: {
                contentType,
                rawTextTruncated,
                parsedJson
            },
            hint: deriveFailureHint(status, undefined, provider)
        });
    }
    return {
        status,
        contentType,
        rawText,
        parsedJson
    };
}
function toErrorPayload(error, fallback) {
    if (error instanceof StructuredStageError) {
        return {
            ok: false,
            stage: error.stage,
            provider: error.provider,
            message: error.message,
            status: error.status ?? fallback.status ?? 500,
            details: error.details,
            hint: error.hint ?? deriveFailureHint(error.status, error.code, error.provider),
            code: error.code
        };
    }
    const message = error instanceof Error ? error.message : 'Unknown error';
    const stack = error instanceof Error ? error.stack : undefined;
    return {
        ok: false,
        stage: fallback.stage,
        provider: fallback.provider,
        message,
        status: fallback.status ?? 500,
        details: {
            stack
        },
        hint: 'Unexpected internal error in Next.js proxy route.'
    };
}
}),
"[project]/app/api/3d-worker/submit/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$api$2f$3d$2d$worker$2f$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/api/3d-worker/utils.ts [app-route] (ecmascript)");
;
;
function normalizeUrl(value) {
    return (value ?? '').trim().replace(/\/+$/, '');
}
function chooseProvider(bodyProvider) {
    if (typeof bodyProvider === 'string') {
        const normalized = bodyProvider.trim().toLowerCase();
        if (normalized === 'runpod' || normalized === 'meshy') {
            return normalized;
        }
    }
    if (process.env.MESHY_API_KEY?.trim()) {
        return 'meshy';
    }
    return 'runpod';
}
function requiredEnvForProvider(provider) {
    const missing = [];
    const gpuWorkerUrl = normalizeUrl(process.env.GPU_WORKER_URL);
    const gpuWorkerToken = process.env.GPU_WORKER_TOKEN?.trim() ?? '';
    const runpodEndpointUrl = normalizeUrl(process.env.RUNPOD_ENDPOINT_URL || process.env.BLENDER_CLOUD_API_URL);
    const runpodApiKey = process.env.RUNPOD_API_KEY?.trim() ?? process.env.BLENDER_CLOUD_API_TOKEN?.trim() ?? '';
    const meshyApiKey = process.env.MESHY_API_KEY?.trim() ?? '';
    if (provider === 'runpod') {
        const hasPodConfig = Boolean(gpuWorkerUrl && gpuWorkerToken);
        const hasServerlessConfig = Boolean(runpodEndpointUrl && runpodApiKey);
        if (!hasPodConfig && !hasServerlessConfig) {
            if (!gpuWorkerUrl) missing.push('GPU_WORKER_URL');
            if (!gpuWorkerToken) missing.push('GPU_WORKER_TOKEN');
            if (!runpodEndpointUrl) missing.push('RUNPOD_ENDPOINT_URL');
            if (!runpodApiKey) missing.push('RUNPOD_API_KEY');
        }
    }
    if (provider === 'meshy' && !meshyApiKey) {
        missing.push('MESHY_API_KEY');
    }
    return missing;
}
function getRunpodConfig() {
    const gpuWorkerUrl = normalizeUrl(process.env.GPU_WORKER_URL || process.env.BLENDER_CLOUD_API_URL);
    const gpuWorkerToken = process.env.GPU_WORKER_TOKEN?.trim() ?? process.env.BLENDER_CLOUD_API_TOKEN?.trim() ?? '';
    const runpodEndpointUrl = normalizeUrl(process.env.RUNPOD_ENDPOINT_URL);
    const runpodApiKey = process.env.RUNPOD_API_KEY?.trim() ?? '';
    const submitPathOverride = (process.env.BLENDER_CLOUD_SUBMIT_PATH?.trim() || '').replace(/\/+$/, '');
    if (gpuWorkerUrl && gpuWorkerToken) {
        const pathUsed = submitPathOverride || '/jobs';
        return {
            submitUrl: `${gpuWorkerUrl}${pathUsed.startsWith('/') ? pathUsed : `/${pathUsed}`}`,
            token: gpuWorkerToken,
            pathUsed,
            payloadMode: 'direct',
            baseUrl: gpuWorkerUrl
        };
    }
    if (runpodEndpointUrl && runpodApiKey) {
        const pathUsed = submitPathOverride || '/run';
        return {
            submitUrl: `${runpodEndpointUrl}${pathUsed.startsWith('/') ? pathUsed : `/${pathUsed}`}`,
            token: runpodApiKey,
            pathUsed,
            payloadMode: 'serverless_input_wrapper',
            baseUrl: runpodEndpointUrl
        };
    }
    throw new Error('RunPod environment not configured.');
}
async function runpodRouteDiagnostics(baseUrl, token) {
    const authHeaders = token ? {
        Authorization: `Bearer ${token}`
    } : undefined;
    const getProbe = async (path)=>{
        try {
            const res = await fetch(`${baseUrl}${path}`, {
                method: 'GET',
                headers: authHeaders,
                cache: 'no-store'
            });
            const text = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$api$2f$3d$2d$worker$2f$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["truncateText"])(await res.text());
            return {
                path,
                ok: res.ok,
                status: res.status,
                bodyPreview: text
            };
        } catch (error) {
            return {
                path,
                ok: false,
                status: null,
                bodyPreview: error instanceof Error ? error.message : String(error)
            };
        }
    };
    const postProbe = async (path, payload)=>{
        try {
            const headers = {
                'Content-Type': 'application/json',
                ...token ? {
                    Authorization: `Bearer ${token}`
                } : {}
            };
            const res = await fetch(`${baseUrl}${path}`, {
                method: 'POST',
                headers,
                body: JSON.stringify(payload),
                cache: 'no-store'
            });
            const text = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$api$2f$3d$2d$worker$2f$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["truncateText"])(await res.text());
            return {
                path,
                ok: res.ok,
                status: res.status,
                bodyPreview: text
            };
        } catch (error) {
            return {
                path,
                ok: false,
                status: null,
                bodyPreview: error instanceof Error ? error.message : String(error)
            };
        }
    };
    return {
        ping: await getProbe('/ping'),
        openapi: await getProbe('/openapi.json'),
        jobsProbe: await postProbe('/jobs', {
            healthCheck: true
        }),
        runProbe: await postProbe('/run', {
            input: {
                healthCheck: true
            }
        })
    };
}
function normalizeJobId(payload) {
    if (!payload || typeof payload !== 'object') return null;
    const data = payload;
    // Meshy returns the task id in `result`; RunPod uses `jobId` / `id` / `taskId`
    const candidate = data.result ?? data.jobId ?? data.id ?? data.taskId ?? data.data?.id;
    return typeof candidate === 'string' && candidate.trim() ? candidate.trim() : null;
}
function normalizeStatus(payload) {
    if (!payload || typeof payload !== 'object') return null;
    const data = payload;
    const candidate = data.status ?? data.state ?? data.data?.status;
    return typeof candidate === 'string' && candidate.trim() ? candidate.trim() : null;
}
async function POST(req) {
    const stageBase = 'submit_proxy';
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$api$2f$3d$2d$worker$2f$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logStage"])('incoming_request', {
        method: req.method
    });
    let body;
    try {
        const parsed = await req.json();
        body = parsed && typeof parsed === 'object' ? parsed : null;
    } catch (error) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$api$2f$3d$2d$worker$2f$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logStage"])('invalid_json', {
            stage: `${stageBase}_body_parse`,
            message: error instanceof Error ? error.message : String(error)
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            ok: false,
            stage: 'request_validation',
            provider: 'fallback',
            message: 'Invalid JSON payload.',
            status: 400,
            details: {
                missing: [
                    'pieceId',
                    'imageUrl'
                ]
            },
            hint: 'Send a JSON body with pieceId and imageUrl.'
        }, {
            status: 400
        });
    }
    const bodyKeys = Object.keys(body ?? {});
    const pieceId = typeof body.pieceId === 'string' ? body.pieceId.trim() : '';
    const imageUrl = typeof body.imageUrl === 'string' ? body.imageUrl.trim() : '';
    const provider = chooseProvider(body.provider);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$api$2f$3d$2d$worker$2f$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logStage"])('request_body_summary', {
        bodyKeys,
        pieceId,
        hasImageUrl: Boolean(imageUrl),
        providerSelected: provider,
        hasGpuWorkerUrl: Boolean(normalizeUrl(process.env.GPU_WORKER_URL)),
        hasGpuWorkerToken: Boolean(process.env.GPU_WORKER_TOKEN?.trim()),
        hasRunpodEndpointUrl: Boolean(normalizeUrl(process.env.RUNPOD_ENDPOINT_URL)),
        hasRunpodApiKey: Boolean(process.env.RUNPOD_API_KEY?.trim()),
        hasMeshyApiKey: Boolean(process.env.MESHY_API_KEY?.trim()),
        hasMeshyBaseUrl: Boolean(normalizeUrl(process.env.MESHY_BASE_URL))
    });
    const missingRequestFields = [];
    if (!pieceId) missingRequestFields.push('pieceId');
    if (!imageUrl) missingRequestFields.push('imageUrl');
    if (missingRequestFields.length > 0) {
        const pieceIdMissing = missingRequestFields.includes('pieceId');
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            ok: false,
            stage: 'request_validation',
            provider,
            message: pieceIdMissing ? 'A pieceId is required before starting 3D generation.' : 'Invalid request body.',
            status: 400,
            details: {
                missing: missingRequestFields
            },
            hint: pieceIdMissing ? 'Provide pieceId from the wardrobe item before submitting the 3D job.' : 'Required fields: pieceId, imageUrl.'
        }, {
            status: 400
        });
    }
    const missingEnv = requiredEnvForProvider(provider);
    if (missingEnv.length > 0) {
        const onlyAuthMissing = missingEnv.every((entry)=>entry.includes('TOKEN') || entry.includes('API_KEY'));
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            ok: false,
            failedStage: onlyAuthMissing ? 'auth_config_missing' : 'env_validation',
            provider,
            message: 'Missing required environment configuration.',
            status: 500,
            missing: missingEnv,
            details: {
                missing: missingEnv
            },
            hint: 'Set the missing environment variables on the Next.js server runtime.'
        }, {
            status: 500
        });
    }
    try {
        if (provider === 'meshy') {
            const meshyBase = normalizeUrl(process.env.MESHY_BASE_URL) || 'https://api.meshy.ai/openapi/v1';
            const meshyUrl = `${meshyBase}/image-to-3d`;
            const meshyToken = process.env.MESHY_API_KEY?.trim() ?? '';
            const prompt = typeof body.prompt === 'string' && body.prompt.trim() ? body.prompt.trim() : undefined;
            const payload = {
                image_url: imageUrl,
                should_texture: true,
                ...prompt ? {
                    prompt
                } : {}
            };
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$api$2f$3d$2d$worker$2f$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logStage"])('submit_target', {
                provider,
                finalSubmitUrl: meshyUrl,
                submitPathUsed: '/openapi/v1/image-to-3d',
                payloadModeUsed: 'meshy_image_to_3d'
            });
            const controller = new AbortController();
            const timeout = setTimeout(()=>controller.abort(), 45_000);
            const result = await (async ()=>{
                try {
                    return await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$api$2f$3d$2d$worker$2f$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["safeFetchJson"])(meshyUrl, {
                        method: 'POST',
                        headers: {
                            Authorization: `Bearer ${meshyToken}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(payload),
                        cache: 'no-store',
                        signal: controller.signal
                    }, 'meshy_submit', provider);
                } finally{
                    clearTimeout(timeout);
                }
            })();
            const jobId = normalizeJobId(result.parsedJson);
            const status = normalizeStatus(result.parsedJson) ?? 'queued';
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$api$2f$3d$2d$worker$2f$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logStage"])('normalized_response', {
                provider,
                responseStatus: result.status,
                responseContentType: result.contentType,
                rawResponseTextTruncated: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$api$2f$3d$2d$worker$2f$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["truncateText"])(result.rawText),
                parsedResponseJson: result.parsedJson,
                normalizedJobId: jobId,
                normalizedStatus: status
            });
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                ok: true,
                provider,
                status,
                jobId,
                upstream: result.parsedJson
            }, {
                status: 200
            });
        }
        const runpod = getRunpodConfig();
        const outboundPayload = runpod.payloadMode === 'serverless_input_wrapper' ? {
            input: body
        } : body;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$api$2f$3d$2d$worker$2f$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logStage"])('submit_target', {
            provider,
            finalSubmitUrl: runpod.submitUrl,
            submitPathUsed: runpod.pathUsed,
            payloadModeUsed: runpod.payloadMode
        });
        const controller = new AbortController();
        const timeout = setTimeout(()=>controller.abort(), 45_000);
        const result = await (async ()=>{
            try {
                return await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$api$2f$3d$2d$worker$2f$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["safeFetchJson"])(runpod.submitUrl, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${runpod.token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(outboundPayload),
                    cache: 'no-store',
                    signal: controller.signal
                }, 'runpod_submit', provider);
            } finally{
                clearTimeout(timeout);
            }
        })();
        const jobId = normalizeJobId(result.parsedJson);
        const status = normalizeStatus(result.parsedJson) ?? 'queued';
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$api$2f$3d$2d$worker$2f$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logStage"])('normalized_response', {
            provider,
            responseStatus: result.status,
            responseContentType: result.contentType,
            rawResponseTextTruncated: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$api$2f$3d$2d$worker$2f$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["truncateText"])(result.rawText),
            parsedResponseJson: result.parsedJson,
            normalizedJobId: jobId,
            normalizedStatus: status
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            ok: true,
            provider,
            status,
            jobId,
            upstream: result.parsedJson
        }, {
            status: 200
        });
    } catch (error) {
        if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$api$2f$3d$2d$worker$2f$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["StructuredStageError"] && error.stage === 'runpod_submit' && error.status === 404) {
            const runpod = getRunpodConfig();
            const diagnostics = await runpodRouteDiagnostics(runpod.baseUrl, runpod.token);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                ok: false,
                failedStage: 'runpod_route_mismatch',
                provider: 'runpod',
                message: 'RunPod worker route mismatch detected during submit.',
                hint: 'The configured RunPod worker does not expose POST /jobs. Check FastAPI routes or use the correct submit path.',
                retryable: true,
                diagnostics
            }, {
                status: 502
            });
        }
        const structured = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$api$2f$3d$2d$worker$2f$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["toErrorPayload"])(error, {
            stage: 'submit_proxy',
            provider,
            status: 500
        });
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$api$2f$3d$2d$worker$2f$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logStage"])('caught_error', {
            provider,
            stage: structured.stage,
            status: structured.status,
            message: structured.message,
            details: structured.details,
            hint: structured.hint,
            code: structured.code,
            stack: error instanceof Error ? error.stack : undefined
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            ok: false,
            failedStage: structured.stage,
            provider: structured.provider,
            message: structured.message,
            hint: structured.hint,
            retryable: structured.status ? structured.status >= 500 : true,
            diagnostics: structured.details,
            code: structured.code
        }, {
            status: typeof structured.status === 'number' ? structured.status : 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__5a9131ec._.js.map