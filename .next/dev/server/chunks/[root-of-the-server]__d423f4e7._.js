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
"[project]/app/api/model-proxy/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
;
const MESHY_BASE_URL = 'https://api.meshy.ai/openapi/v1';
function isAllowedMeshyAsset(url) {
    return url.protocol === 'https:' && (url.hostname === 'assets.meshy.ai' || url.hostname.endsWith('.meshy.ai'));
}
// Extract Meshy task ID from CDN URL path:
// https://assets.meshy.ai/<userId>/tasks/<taskId>/output/model.glb
function extractMeshyTaskId(url) {
    const match = url.pathname.match(/\/tasks\/([^/]+)\//);
    return match ? match[1] : null;
}
async function fetchFreshMeshyUrl(taskId, assetUrl) {
    const apiKey = process.env.MESHY_API_KEY;
    if (!apiKey) {
        console.error('[model-proxy] MESHY_API_KEY is not set');
        return null;
    }
    const apiEndpoint = `${MESHY_BASE_URL}/image-to-3d/${taskId}`;
    const res = await fetch(apiEndpoint, {
        headers: {
            Authorization: `Bearer ${apiKey}`
        }
    });
    if (!res.ok) {
        const body = await res.text();
        console.error(`[model-proxy] Meshy API returned ${res.status} for task ${taskId}: ${body}`);
        return null;
    }
    const data = await res.json();
    const isPreview = /\.(png|jpg|jpeg|webp)$/i.test(assetUrl.pathname);
    const freshUrl = isPreview ? data.thumbnail_url ?? data.preview_url ?? null : data.model_urls?.glb ?? null;
    if (!freshUrl) {
        console.error(`[model-proxy] Meshy API response missing URL for task ${taskId} (isPreview=${isPreview}):`, JSON.stringify(data));
    }
    return freshUrl;
}
async function GET(request) {
    const url = new URL(request.url);
    const rawAssetUrl = String(url.searchParams.get('url') ?? '').trim();
    if (!rawAssetUrl) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Missing url query parameter.'
        }, {
            status: 400
        });
    }
    let parsedAssetUrl;
    try {
        parsedAssetUrl = new URL(rawAssetUrl);
    } catch  {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Invalid asset URL.'
        }, {
            status: 400
        });
    }
    if (!isAllowedMeshyAsset(parsedAssetUrl)) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Only Meshy asset URLs are allowed.'
        }, {
            status: 403
        });
    }
    let assetUrl = parsedAssetUrl.toString();
    let response = await fetch(assetUrl, {
        method: 'GET',
        cache: 'no-store'
    });
    // Signed CDN URLs expire — refresh via Meshy API on 403.
    if (response.status === 403) {
        const taskId = extractMeshyTaskId(parsedAssetUrl);
        if (taskId) {
            const freshUrl = await fetchFreshMeshyUrl(taskId, parsedAssetUrl);
            if (freshUrl) {
                assetUrl = freshUrl;
                response = await fetch(assetUrl, {
                    method: 'GET',
                    cache: 'no-store'
                });
            }
        }
    }
    if (!response.ok) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to fetch model asset.'
        }, {
            status: response.status
        });
    }
    const body = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') ?? 'model/gltf-binary';
    return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"](body, {
        status: 200,
        headers: {
            'Content-Type': contentType,
            'Cache-Control': 'private, max-age=300'
        }
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__d423f4e7._.js.map