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
"[project]/app/api/3d-worker/jobs/[jobId]/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
;
function resolveWorkerConfig() {
    // Prefer Meshy when API key is present (matches submit route priority)
    const meshyApiKey = process.env.MESHY_API_KEY?.trim() ?? '';
    if (meshyApiKey) {
        const baseUrl = (process.env.MESHY_BASE_URL?.trim() || 'https://api.meshy.ai/openapi/v1').replace(/\/+$/, '');
        return {
            type: 'meshy',
            baseUrl,
            token: meshyApiKey
        };
    }
    const workerUrl = process.env.GPU_WORKER_URL?.trim() ?? '';
    const token = process.env.GPU_WORKER_TOKEN?.trim() ?? '';
    if (workerUrl && token) {
        return {
            type: 'runpod',
            workerUrl: workerUrl.replace(/\/+$/, ''),
            token
        };
    }
    return null;
}
async function GET(_req, { params }) {
    const config = resolveWorkerConfig();
    if (!config) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Worker not configured'
        }, {
            status: 500
        });
    }
    const { jobId } = await params;
    if (!jobId) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Missing jobId'
        }, {
            status: 400
        });
    }
    const statusUrl = config.type === 'meshy' ? `${config.baseUrl}/image-to-3d/${jobId}` : `${config.workerUrl}/jobs/${jobId}`;
    const abort = new AbortController();
    const abortTimer = setTimeout(()=>abort.abort(), 15000);
    let response;
    try {
        response = await fetch(statusUrl, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${config.token}`
            },
            cache: 'no-store',
            signal: abort.signal
        });
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Network error';
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'upstream_timeout',
            message
        }, {
            status: 503
        });
    } finally{
        clearTimeout(abortTimer);
    }
    const contentType = response.headers.get('content-type') ?? 'application/json';
    const data = await response.text();
    return new Response(data, {
        status: response.status,
        headers: {
            'Content-Type': contentType
        }
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__f9a2e0ab._.js.map