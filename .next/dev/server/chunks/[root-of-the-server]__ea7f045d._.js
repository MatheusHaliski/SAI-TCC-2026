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
"[project]/app/lib/firebaseAdmin.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "adminDb",
    ()=>adminDb,
    "getAdminFirestore",
    ()=>getAdminFirestore,
    "getAdminStorageBucket",
    ()=>getAdminStorageBucket
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$app__$5b$external$5d$__$28$firebase$2d$admin$2f$app$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$firebase$2d$admin$29$__ = __turbopack_context__.i("[externals]/firebase-admin/app [external] (firebase-admin/app, esm_import, [project]/node_modules/firebase-admin)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$firestore__$5b$external$5d$__$28$firebase$2d$admin$2f$firestore$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$firebase$2d$admin$29$__ = __turbopack_context__.i("[externals]/firebase-admin/firestore [external] (firebase-admin/firestore, esm_import, [project]/node_modules/firebase-admin)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$storage__$5b$external$5d$__$28$firebase$2d$admin$2f$storage$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$firebase$2d$admin$29$__ = __turbopack_context__.i("[externals]/firebase-admin/storage [external] (firebase-admin/storage, esm_import, [project]/node_modules/firebase-admin)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$app__$5b$external$5d$__$28$firebase$2d$admin$2f$app$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$firebase$2d$admin$29$__,
    __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$firestore__$5b$external$5d$__$28$firebase$2d$admin$2f$firestore$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$firebase$2d$admin$29$__,
    __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$storage__$5b$external$5d$__$28$firebase$2d$admin$2f$storage$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$firebase$2d$admin$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$app__$5b$external$5d$__$28$firebase$2d$admin$2f$app$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$firebase$2d$admin$29$__, __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$firestore__$5b$external$5d$__$28$firebase$2d$admin$2f$firestore$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$firebase$2d$admin$29$__, __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$storage__$5b$external$5d$__$28$firebase$2d$admin$2f$storage$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$firebase$2d$admin$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
let firestoreInstance = null;
const getAdminFirestore = ()=>{
    if (firestoreInstance) return firestoreInstance;
    const projectId = process.env.NEXT_FIREBASE_ADMIN_PROJECT_ID;
    const clientEmail = process.env.NEXT_FIREBASE_ADMIN_CLIENT_EMAIL;
    const privateKey = process.env.NEXT_FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");
    if (!projectId || !clientEmail || !privateKey) {
        throw new Error("Server authentication is not configured.");
    }
    if (!(0, __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$app__$5b$external$5d$__$28$firebase$2d$admin$2f$app$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$firebase$2d$admin$29$__["getApps"])().length) {
        (0, __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$app__$5b$external$5d$__$28$firebase$2d$admin$2f$app$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$firebase$2d$admin$29$__["initializeApp"])({
            credential: (0, __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$app__$5b$external$5d$__$28$firebase$2d$admin$2f$app$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$firebase$2d$admin$29$__["cert"])({
                projectId,
                clientEmail,
                privateKey
            }),
            storageBucket: process.env.NEXT_FIREBASE_ADMIN_STORAGE_BUCKET ?? ("TURBOPACK compile-time value", "funcionarioslistaapp2025.firebasestorage.app")
        });
    }
    firestoreInstance = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$firestore__$5b$external$5d$__$28$firebase$2d$admin$2f$firestore$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$firebase$2d$admin$29$__["getFirestore"])();
    return firestoreInstance;
};
const adminDb = new Proxy({}, {
    get (_target, property, receiver) {
        return Reflect.get(getAdminFirestore(), property, receiver);
    }
});
const getAdminStorageBucket = ()=>{
    getAdminFirestore();
    const app = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$app__$5b$external$5d$__$28$firebase$2d$admin$2f$app$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$firebase$2d$admin$29$__["getApp"])();
    const bucket = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$storage__$5b$external$5d$__$28$firebase$2d$admin$2f$storage$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$firebase$2d$admin$29$__["getStorage"])(app).bucket();
    if (!bucket.name) {
        throw new Error("Storage bucket is not configured.");
    }
    return bucket;
};
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/app/lib/wardrobeModelUrl.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "resolveWardrobeModelCandidateUrls",
    ()=>resolveWardrobeModelCandidateUrls,
    "resolveWardrobeModelUrl",
    ()=>resolveWardrobeModelUrl
]);
function isRenderableHttpUrl(value) {
    return /^https?:\/\//i.test(value);
}
function normalizeUrl(value) {
    const trimmed = value?.trim();
    if (!trimmed) return null;
    if (trimmed.startsWith('file://')) return null;
    return isRenderableHttpUrl(trimmed) ? trimmed : null;
}
function resolveWardrobeModelUrl(item) {
    return normalizeUrl(item.model_3d_url) ?? normalizeUrl(item.model_branded_3d_url) ?? normalizeUrl(item.model_base_3d_url) ?? null;
}
function resolveWardrobeModelCandidateUrls(item) {
    const candidates = [
        normalizeUrl(item.model_3d_url),
        normalizeUrl(item.model_branded_3d_url),
        normalizeUrl(item.model_base_3d_url)
    ].filter((url)=>Boolean(url));
    return [
        ...new Set(candidates)
    ];
}
}),
"[project]/app/backend/repositories/BaseRepository.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "BaseRepository",
    ()=>BaseRepository
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebaseAdmin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/firebaseAdmin.ts [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebaseAdmin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebaseAdmin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
class BaseRepository {
    get db() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebaseAdmin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getAdminFirestore"])();
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/app/backend/repositories/BrandsRepository.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "BrandsRepository",
    ()=>BrandsRepository
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$repositories$2f$BaseRepository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/backend/repositories/BaseRepository.ts [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$repositories$2f$BaseRepository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$repositories$2f$BaseRepository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
const BRANDS_COLLECTION = 'sai-brands';
const BRAND_LOGO_CATALOG_COLLECTION = 'sai-brandLogoCatalog';
class BrandsRepository extends __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$repositories$2f$BaseRepository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BaseRepository"] {
    async listActive() {
        const snapshot = await this.db.collection(BRANDS_COLLECTION).where('is_active', '==', true).get();
        return snapshot.docs.map((doc)=>({
                brand_id: doc.id,
                ...doc.data()
            }));
    }
    async getById(brandId) {
        const snap = await this.db.collection(BRANDS_COLLECTION).doc(brandId).get();
        if (!snap.exists) {
            return null;
        }
        return {
            brand_id: snap.id,
            ...snap.data()
        };
    }
    async existsById(brandId) {
        const snap = await this.db.collection(BRANDS_COLLECTION).doc(brandId).get();
        return snap.exists;
    }
    async getNameMap() {
        const active = await this.listActive();
        return new Map(active.map((brand)=>[
                brand.brand_id,
                brand.name
            ]));
    }
    async listActiveLogoCatalogs() {
        const snapshot = await this.db.collection(BRAND_LOGO_CATALOG_COLLECTION).where('is_active', '==', true).get();
        return snapshot.docs.map((doc)=>{
            const data = doc.data();
            return {
                brand_logo_catalog_id: doc.id,
                ...data,
                detection_aliases: Array.isArray(data.detection_aliases) ? data.detection_aliases : []
            };
        });
    }
    async getActiveLogoCatalogByBrandId(brandId) {
        const snapshot = await this.db.collection(BRAND_LOGO_CATALOG_COLLECTION).where('brand_id', '==', brandId).where('is_active', '==', true).limit(1).get();
        const first = snapshot.docs[0];
        if (!first) {
            return null;
        }
        const data = first.data();
        return {
            brand_logo_catalog_id: first.id,
            ...data,
            detection_aliases: Array.isArray(data.detection_aliases) ? data.detection_aliases : []
        };
    }
    async upsertLogoCatalog(input) {
        const now = new Date().toISOString();
        const docId = `catalog_${input.brandId}`;
        await this.db.collection(BRAND_LOGO_CATALOG_COLLECTION).doc(docId).set({
            brand_id: input.brandId,
            logo_image_url: input.logoImageUrl,
            logo_glb_url: input.logoGlbUrl,
            placement_profiles: input.placementProfiles,
            detection_aliases: input.detectionAliases ?? [],
            is_active: true,
            updated_at: now,
            created_at: now
        }, {
            merge: true
        });
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/app/backend/repositories/MarketsRepository.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "MarketsRepository",
    ()=>MarketsRepository
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$repositories$2f$BaseRepository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/backend/repositories/BaseRepository.ts [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$repositories$2f$BaseRepository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$repositories$2f$BaseRepository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
const MARKETS_COLLECTION = 'sai-markets';
class MarketsRepository extends __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$repositories$2f$BaseRepository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BaseRepository"] {
    async listAll() {
        const snapshot = await this.db.collection(MARKETS_COLLECTION).get();
        return snapshot.docs.map((doc)=>({
                market_id: doc.id,
                ...doc.data()
            }));
    }
    async getById(marketId) {
        const snap = await this.db.collection(MARKETS_COLLECTION).doc(marketId).get();
        if (!snap.exists) return null;
        return {
            market_id: snap.id,
            ...snap.data()
        };
    }
    async existsById(marketId) {
        const snap = await this.db.collection(MARKETS_COLLECTION).doc(marketId).get();
        return snap.exists;
    }
    async getByIdMap() {
        const markets = await this.listAll();
        return new Map(markets.map((market)=>[
                market.market_id,
                market
            ]));
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/app/backend/repositories/UsersRepository.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "UsersRepository",
    ()=>UsersRepository
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$repositories$2f$BaseRepository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/backend/repositories/BaseRepository.ts [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$repositories$2f$BaseRepository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$repositories$2f$BaseRepository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
const USERS_COLLECTION = 'users';
class UsersRepository extends __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$repositories$2f$BaseRepository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BaseRepository"] {
    async getById(userId) {
        const snap = await this.db.collection(USERS_COLLECTION).doc(userId).get();
        if (!snap.exists) return null;
        return {
            user_id: snap.id,
            ...snap.data()
        };
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/app/backend/repositories/WardrobeItemsRepository.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "WardrobeItemsRepository",
    ()=>WardrobeItemsRepository
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebaseAdmin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/firebaseAdmin.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$wardrobeModelUrl$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/wardrobeModelUrl.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$repositories$2f$BaseRepository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/backend/repositories/BaseRepository.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$repositories$2f$BrandsRepository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/backend/repositories/BrandsRepository.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$repositories$2f$MarketsRepository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/backend/repositories/MarketsRepository.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$repositories$2f$UsersRepository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/backend/repositories/UsersRepository.ts [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebaseAdmin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$repositories$2f$BaseRepository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$repositories$2f$BrandsRepository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$repositories$2f$MarketsRepository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$repositories$2f$UsersRepository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebaseAdmin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$repositories$2f$BaseRepository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$repositories$2f$BrandsRepository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$repositories$2f$MarketsRepository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$repositories$2f$UsersRepository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
;
const WARDROBE_ITEMS_COLLECTION = 'sai-wardrobeItems';
function assertPublicModelUrl(url, field) {
    if (url == null) return;
    const s = String(url).trim();
    if (s.startsWith('file://') || s.startsWith('/workspace/') || s.startsWith('/tmp/') || !s.startsWith('http://') && !s.startsWith('https://')) {
        throw new Error(`${field} must be an http(s):// URL — got: ${s.slice(0, 120)}`);
    }
}
const RECOMMENDED_ACTIONS = [
    'approve_catalog_2d',
    'refine_with_diffusion',
    'normalize_only',
    'request_reupload'
];
function normalizeRecommendedAction(value) {
    if (typeof value === 'string' && RECOMMENDED_ACTIONS.includes(value)) {
        return value;
    }
    return 'normalize_only';
}
function aggregate(items, key) {
    return items.reduce((acc, item)=>{
        acc[item[key]] = (acc[item[key]] ?? 0) + 1;
        return acc;
    }, {});
}
class WardrobeItemsRepository extends __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$repositories$2f$BaseRepository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BaseRepository"] {
    brandsRepository;
    marketsRepository;
    usersRepository;
    constructor(brandsRepository = new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$repositories$2f$BrandsRepository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BrandsRepository"](), marketsRepository = new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$repositories$2f$MarketsRepository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["MarketsRepository"](), usersRepository = new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$repositories$2f$UsersRepository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["UsersRepository"]()){
        super(), this.brandsRepository = brandsRepository, this.marketsRepository = marketsRepository, this.usersRepository = usersRepository;
    }
    async findByUser(userId, options) {
        const pageSize = Math.max(1, Math.min(100, Math.floor(options?.limit ?? 24)));
        const status = options?.status ?? 'active';
        const queryFieldsUsed = [
            'where(userId ==)',
            'orderBy(createdAt desc)',
            `limit(${pageSize})`
        ];
        const brandMap = await this.brandsRepository.getNameMap();
        const marketsMap = await this.marketsRepository.getByIdMap();
        let query = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebaseAdmin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["adminDb"].collection(WARDROBE_ITEMS_COLLECTION).where('userId', '==', userId).orderBy('createdAt', 'desc').limit(pageSize);
        if (options?.status) {
            query = query.where('status', '==', status);
            queryFieldsUsed.push('where(status ==)');
        }
        if (options?.piece_type) {
            query = query.where('piece_type', '==', options.piece_type);
            queryFieldsUsed.push('where(piece_type ==)');
        }
        if (options?.cursorCreatedAt) {
            query = query.startAfter(options.cursorCreatedAt);
            queryFieldsUsed.push('startAfter(cursorCreatedAt)');
        }
        console.info('[wardrobe-items/findByUser] Firestore query metadata', {
            collection: WARDROBE_ITEMS_COLLECTION,
            userId,
            status: options?.status ?? null,
            limit: pageSize,
            queryFieldsUsed,
            requiredCompositeIndex: [
                'collection: sai-wardrobeItems',
                'userId Ascending',
                'status Ascending',
                'createdAt Descending'
            ]
        });
        const snapshot = await query.get();
        let docs = snapshot.docs;
        const shouldTryLegacyFields = !options?.cursorCreatedAt && docs.length < pageSize;
        if (shouldTryLegacyFields) {
            const legacySnapshot = await __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebaseAdmin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["adminDb"].collection(WARDROBE_ITEMS_COLLECTION).where('user_id', '==', userId).orderBy('created_at', 'desc').limit(pageSize).get();
            const mergedById = new Map();
            for (const doc of docs)mergedById.set(doc.id, doc);
            for (const doc of legacySnapshot.docs)mergedById.set(doc.id, doc);
            docs = Array.from(mergedById.values()).filter((doc)=>{
                const item = doc.data();
                const matchesStatus = options?.status ? String(item.status ?? 'active') === options.status : true;
                const matchesPieceType = options?.piece_type ? String(item.piece_type ?? '') === options.piece_type : true;
                return matchesStatus && matchesPieceType;
            }).sort((a, b)=>{
                const bCursor = this.extractCreatedAtCursor(b) ?? '';
                const aCursor = this.extractCreatedAtCursor(a) ?? '';
                return bCursor.localeCompare(aCursor);
            }).slice(0, pageSize);
        }
        const items = docs.map((doc)=>{
            const item = doc.data();
            const market = marketsMap.get(String(item.market_id ?? ''));
            const model3dUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$wardrobeModelUrl$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["resolveWardrobeModelUrl"])({
                model_3d_url: item.model_3d_url ?? null,
                model_branded_3d_url: item.model_branded_3d_url ?? null,
                model_base_3d_url: item.model_base_3d_url ?? null
            });
            const modelBase3dUrl = item.model_base_3d_url ?? null;
            const modelBranded3dUrl = item.model_branded_3d_url ?? null;
            const hasAnyModelUrl = [
                model3dUrl,
                modelBase3dUrl,
                modelBranded3dUrl
            ].some((url)=>Boolean(url && url.trim().length > 0));
            const rawStatus = item.model_status ?? 'queued_base';
            const shouldPromoteLegacyDone = hasAnyModelUrl && [
                'queued_segmentation',
                'segmentation_done',
                'queued_base',
                'generating_base',
                'base_done',
                'queued_branding',
                'branding_in_progress',
                'queued_geometry_qa',
                'retrying_generation',
                'needs_brand_review'
            ].includes(rawStatus);
            const normalizedStatus = shouldPromoteLegacyDone ? 'completed' : rawStatus;
            return {
                wardrobe_item_id: doc.id,
                name: String(item.name ?? ''),
                image_url: String(item.image_url ?? ''),
                image_assets: {
                    raw_upload_image_url: String(item.raw_upload_image_url ?? item.image_url ?? ''),
                    segmented_png_url: item.segmented_png_url ?? null,
                    cleaned_png_url: item.cleaned_png_url ?? null,
                    normalized_2d_preview_url: item.normalized_2d_preview_url ?? null,
                    approved_catalog_2d_url: item.approved_catalog_2d_url ?? null,
                    model_3d_url: model3dUrl
                },
                image_analysis: {
                    contains_human: Boolean(item.contains_human),
                    rotation_z_degrees: Number(item.rotation_z_degrees ?? 0),
                    fully_visible: Boolean(item.fully_visible),
                    centered_score: Number(item.centered_score ?? 0),
                    front_view_score: Number(item.front_view_score ?? 0),
                    background_clean_score: Number(item.background_clean_score ?? 0),
                    catalog_readiness_score: Number(item.catalog_readiness_score ?? 0),
                    recommended_action: normalizeRecommendedAction(item.recommended_action)
                },
                model_3d_url: model3dUrl,
                model_preview_url: item.model_preview_url ?? null,
                model_base_3d_url: modelBase3dUrl,
                model_branded_3d_url: modelBranded3dUrl,
                isolated_piece_image_url: item.isolated_piece_image_url ?? null,
                segmentation_confidence: Number(item.segmentation_confidence ?? 0) || null,
                geometry_scope_passed: typeof item.geometry_scope_passed === 'boolean' ? item.geometry_scope_passed : null,
                geometry_scope_score: Number(item.geometry_scope_score ?? 0) || null,
                generation_attempt_count: Number(item.generation_attempt_count ?? 0) || 0,
                pipeline_stage_details: item.pipeline_stage_details ?? null,
                branding_error: item.branding_error ?? null,
                model_status: normalizedStatus,
                model_generation_error: item.model_generation_error ?? null,
                fitProfile: item.fitProfile ?? undefined,
                brand: brandMap.get(String(item.brand_id ?? '')) ?? (item.brand_id === 'default' ? 'Default brand' : 'Unknown'),
                brand_detection_confidence: Number(item.brand_detection_confidence ?? 0) || null,
                brand_detection_source: item.brand_detection_source ?? null,
                brand_applied: Boolean(item.brand_applied),
                placement_profile_id: item.placement_profile_id ?? null,
                branding_pass_version: item.branding_pass_version ?? null,
                season: market?.season ?? 'Unknown',
                gender: market?.gender ?? 'Unknown',
                piece_type: String(item.piece_type ?? '')
            };
        });
        const nextCursor = docs.length === pageSize ? this.extractCreatedAtCursor(docs[docs.length - 1]) ?? '' : null;
        return {
            items,
            nextCursor: nextCursor || null
        };
    }
    extractCreatedAtCursor(doc) {
        const value = doc.get('createdAt') ?? doc.get('created_at') ?? null;
        if (typeof value === 'string') return value;
        if (value instanceof Date) return value.toISOString();
        if (value && typeof value === 'object') {
            const maybeTimestamp = value;
            if (typeof maybeTimestamp.toDate === 'function') {
                return maybeTimestamp.toDate().toISOString();
            }
            if (typeof maybeTimestamp.seconds === 'number' && Number.isFinite(maybeTimestamp.seconds)) {
                const millis = maybeTimestamp.seconds * 1000 + (typeof maybeTimestamp.nanoseconds === 'number' ? maybeTimestamp.nanoseconds / 1_000_000 : 0);
                return new Date(millis).toISOString();
            }
        }
        return null;
    }
    async findDiscoverable(filters) {
        const pageSize = Math.max(1, Math.min(100, Math.floor(filters?.limit ?? 24)));
        const brandMap = await this.brandsRepository.getNameMap();
        const marketsMap = await this.marketsRepository.getByIdMap();
        let query = this.db.collection(WARDROBE_ITEMS_COLLECTION).orderBy('createdAt', 'desc').limit(pageSize);
        if (filters?.brand_id) {
            query = this.db.collection(WARDROBE_ITEMS_COLLECTION).where('brand_id', '==', filters.brand_id).orderBy('createdAt', 'desc').limit(pageSize);
        }
        if (filters?.market_id && filters?.gender) {
            query = this.db.collection(WARDROBE_ITEMS_COLLECTION).where('market_id', '==', filters.market_id).where('gender', '==', filters.gender).orderBy('createdAt', 'desc').limit(pageSize);
        }
        if (filters?.cursorCreatedAt) {
            query = query.startAfter(filters.cursorCreatedAt);
        }
        const snapshot = await query.get();
        const items = await Promise.all(snapshot.docs.map(async (doc)=>{
            const item = doc.data();
            const market = marketsMap.get(String(item.market_id ?? ''));
            const creator = await this.usersRepository.getById(String(item.user_id ?? item.userId ?? ''));
            const brand = brandMap.get(String(item.brand_id ?? '')) ?? (item.brand_id === 'default' ? 'Default brand' : 'Unknown');
            const model3dUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$wardrobeModelUrl$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["resolveWardrobeModelUrl"])({
                model_3d_url: item.model_3d_url ?? null,
                model_branded_3d_url: item.model_branded_3d_url ?? null,
                model_base_3d_url: item.model_base_3d_url ?? null
            });
            return {
                wardrobe_item_id: doc.id,
                user_id: String(item.user_id ?? ''),
                creator_name: creator?.name || 'Creator',
                name: String(item.name ?? ''),
                image_url: String(item.image_url ?? ''),
                image_assets: {
                    raw_upload_image_url: String(item.raw_upload_image_url ?? item.image_url ?? ''),
                    segmented_png_url: item.segmented_png_url ?? null,
                    cleaned_png_url: item.cleaned_png_url ?? null,
                    normalized_2d_preview_url: item.normalized_2d_preview_url ?? null,
                    approved_catalog_2d_url: item.approved_catalog_2d_url ?? null,
                    model_3d_url: model3dUrl
                },
                image_analysis: {
                    contains_human: Boolean(item.contains_human),
                    rotation_z_degrees: Number(item.rotation_z_degrees ?? 0),
                    fully_visible: Boolean(item.fully_visible),
                    centered_score: Number(item.centered_score ?? 0),
                    front_view_score: Number(item.front_view_score ?? 0),
                    background_clean_score: Number(item.background_clean_score ?? 0),
                    catalog_readiness_score: Number(item.catalog_readiness_score ?? 0),
                    recommended_action: normalizeRecommendedAction(item.recommended_action)
                },
                piece_type: String(item.piece_type ?? ''),
                brand,
                color: String(item.color ?? ''),
                material: String(item.material ?? ''),
                rarity: String(item.rarity ?? 'Standard'),
                wearstyles: Array.isArray(item.style_tags) ? item.style_tags.map((tag)=>String(tag)) : [],
                style_tags: Array.isArray(item.style_tags) ? item.style_tags.map((tag)=>String(tag)) : [],
                occasion_tags: Array.isArray(item.occasion_tags) ? item.occasion_tags.map((tag)=>String(tag)) : [],
                season: market?.season ?? 'Unknown',
                gender: market?.gender ?? 'Unknown',
                model_3d_url: item.model_3d_url ?? null,
                model_preview_url: item.model_preview_url ?? null,
                model_base_3d_url: item.model_base_3d_url ?? null,
                model_branded_3d_url: item.model_branded_3d_url ?? null,
                description: String(item.description ?? ''),
                is_public: Boolean(item.is_public ?? true),
                is_discoverable: Boolean(item.is_discoverable ?? true),
                published_in_search: Boolean(item.published_in_search ?? true)
            };
        }));
        const nextCursor = snapshot.docs.length === pageSize ? String(snapshot.docs[snapshot.docs.length - 1]?.get('createdAt') ?? '') : null;
        return {
            items: items.filter((item)=>item.is_public && item.is_discoverable && item.published_in_search),
            nextCursor: nextCursor || null
        };
    }
    async create(input) {
        const now = new Date().toISOString();
        const payload = {
            ...input,
            is_favorite: false,
            is_public: true,
            is_discoverable: true,
            published_in_search: true,
            userId: input.user_id,
            createdAt: now,
            status: 'active',
            created_at: now,
            updated_at: now
        };
        const ref = await this.db.collection(WARDROBE_ITEMS_COLLECTION).add(payload);
        return {
            wardrobe_item_id: ref.id
        };
    }
    async findById(wardrobeItemId) {
        const doc = await this.db.collection(WARDROBE_ITEMS_COLLECTION).doc(wardrobeItemId).get();
        if (!doc.exists) return null;
        return {
            wardrobe_item_id: doc.id,
            ...doc.data()
        };
    }
    async update2DAssets(wardrobeItemId, input) {
        await this.db.collection(WARDROBE_ITEMS_COLLECTION).doc(wardrobeItemId).update({
            raw_upload_image_url: input.image_assets.raw_upload_image_url,
            segmented_png_url: input.image_assets.segmented_png_url,
            normalized_2d_preview_url: input.image_assets.normalized_2d_preview_url,
            approved_catalog_2d_url: input.image_assets.approved_catalog_2d_url,
            contains_human: input.image_analysis.contains_human,
            rotation_z_degrees: input.image_analysis.rotation_z_degrees,
            fully_visible: input.image_analysis.fully_visible,
            centered_score: input.image_analysis.centered_score,
            front_view_score: input.image_analysis.front_view_score,
            background_clean_score: input.image_analysis.background_clean_score,
            catalog_readiness_score: input.image_analysis.catalog_readiness_score,
            recommended_action: input.image_analysis.recommended_action,
            pipeline_stage_details: input.stage_details,
            updated_at: new Date().toISOString()
        });
    }
    async findWith2DAssetsById(wardrobeItemId) {
        const item = await this.findById(wardrobeItemId);
        if (!item) return null;
        const model3dUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$wardrobeModelUrl$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["resolveWardrobeModelUrl"])({
            model_3d_url: item.model_3d_url ?? null,
            model_base_3d_url: item.model_base_3d_url ?? null,
            model_branded_3d_url: item.model_branded_3d_url ?? null
        });
        return {
            ...item,
            image_assets: {
                raw_upload_image_url: String(item.raw_upload_image_url ?? item.image_url ?? ''),
                segmented_png_url: item.segmented_png_url ?? null,
                cleaned_png_url: item.cleaned_png_url ?? null,
                normalized_2d_preview_url: item.normalized_2d_preview_url ?? null,
                approved_catalog_2d_url: item.approved_catalog_2d_url ?? null,
                model_3d_url: model3dUrl
            },
            image_analysis: {
                contains_human: Boolean(item.contains_human),
                rotation_z_degrees: Number(item.rotation_z_degrees ?? 0),
                fully_visible: Boolean(item.fully_visible),
                centered_score: Number(item.centered_score ?? 0),
                front_view_score: Number(item.front_view_score ?? 0),
                background_clean_score: Number(item.background_clean_score ?? 0),
                catalog_readiness_score: Number(item.catalog_readiness_score ?? 0),
                recommended_action: String(item.recommended_action ?? 'normalize_only')
            }
        };
    }
    async existsById(wardrobeItemId) {
        const snap = await this.db.collection(WARDROBE_ITEMS_COLLECTION).doc(wardrobeItemId).get();
        return snap.exists;
    }
    async updatePipelineStatus(wardrobeItemId, status, modelGenerationError = null, stageDetails = null) {
        await this.db.collection(WARDROBE_ITEMS_COLLECTION).doc(wardrobeItemId).update({
            model_status: status,
            model_generation_error: modelGenerationError,
            ...stageDetails ? {
                pipeline_stage_details: stageDetails
            } : {},
            updated_at: new Date().toISOString()
        });
    }
    async updateModelAssets(wardrobeItemId, input) {
        const resolvedModel3dUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$wardrobeModelUrl$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["resolveWardrobeModelUrl"])(input);
        await this.db.collection(WARDROBE_ITEMS_COLLECTION).doc(wardrobeItemId).update({
            ...input,
            model_3d_url: resolvedModel3dUrl,
            model_status: 'completed',
            model_generation_error: input.model_generation_error ?? null,
            updated_at: new Date().toISOString()
        });
    }
    async updateProcessingState(wardrobeItemId, cloudJobId) {
        await this.db.collection(WARDROBE_ITEMS_COLLECTION).doc(wardrobeItemId).update({
            model_status: 'processing',
            // cloud_job_id and runpod_job_id are always the RunPod worker jobId returned
            // by POST /jobs — never a Meshy task ID or Firestore piece ID.
            cloud_job_id: cloudJobId,
            runpod_job_id: cloudJobId,
            model_generation_error: null,
            updated_at: new Date().toISOString()
        });
    }
    async updateCompletedModel(wardrobeItemId, assets, cloudJobId) {
        assertPublicModelUrl(assets.model_3d_url, 'model_3d_url');
        assertPublicModelUrl(assets.model_base_3d_url, 'model_base_3d_url');
        assertPublicModelUrl(assets.model_usdz_url, 'model_usdz_url');
        const update = {
            model_status: 'completed',
            model_3d_url: assets.model_3d_url,
            model_base_3d_url: assets.model_base_3d_url,
            model_usdz_url: assets.model_usdz_url,
            model_preview_url: assets.model_preview_url,
            model_generation_error: null,
            brand_applied: false,
            brand_apply_blocked_reason: 'branded_pass_not_implemented',
            // cloud_job_id and runpod_job_id remain the RunPod worker jobId.
            cloud_job_id: cloudJobId,
            runpod_job_id: cloudJobId,
            completedAt: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
        if (assets.meshy_task_id != null) {
            update.meshy_task_id = assets.meshy_task_id;
        }
        await this.db.collection(WARDROBE_ITEMS_COLLECTION).doc(wardrobeItemId).update(update);
    }
    async updateGenerationAttempt(wardrobeItemId, generationAttemptCount) {
        await this.db.collection(WARDROBE_ITEMS_COLLECTION).doc(wardrobeItemId).update({
            generation_attempt_count: generationAttemptCount,
            updated_at: new Date().toISOString()
        });
    }
    async updateModel3dUrl(wardrobeItemId, model3dUrl) {
        const normalized = model3dUrl.trim();
        if (!normalized) return;
        assertPublicModelUrl(normalized, 'model_3d_url');
        await this.db.collection(WARDROBE_ITEMS_COLLECTION).doc(wardrobeItemId).update({
            model_3d_url: normalized,
            model_status: 'completed',
            model_generation_error: null,
            updated_at: new Date().toISOString()
        });
    }
    async updateCleanedPngUrl(wardrobeItemId, cleanedPngUrl) {
        const normalized = cleanedPngUrl.trim();
        if (!normalized) return;
        await this.db.collection(WARDROBE_ITEMS_COLLECTION).doc(wardrobeItemId).update({
            cleaned_png_url: normalized,
            updated_at: new Date().toISOString()
        });
    }
    async getAnalysisByUser(userId) {
        const { items } = await this.findByUser(userId, {
            status: 'active',
            limit: 500
        });
        return {
            total_items: items.length,
            by_brand: aggregate(items, 'brand'),
            by_season: aggregate(items, 'season'),
            by_gender: aggregate(items, 'gender'),
            by_piece_type: aggregate(items, 'piece_type')
        };
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/app/api/3d-worker/submit/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$api$2f$3d$2d$worker$2f$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/api/3d-worker/utils.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$repositories$2f$WardrobeItemsRepository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/backend/repositories/WardrobeItemsRepository.ts [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$repositories$2f$WardrobeItemsRepository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$repositories$2f$WardrobeItemsRepository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
function normalizeUrl(value) {
    return (value ?? '').trim().replace(/\/+$/, '');
}
function buildMeshyCreateUrl(rawBase) {
    let base = (rawBase || 'https://api.meshy.ai').trim().replace(/\/+$/, '');
    base = base.replace('/openapi/v1/image-to-3d', '');
    base = base.replace('/openapi/v1', '');
    return `${base}/openapi/v1/image-to-3d`;
}
function chooseProvider(bodyProvider) {
    if (typeof bodyProvider === 'string') {
        const normalized = bodyProvider.trim().toLowerCase();
        // Only honour an explicit 'meshy' override when no RunPod worker is configured.
        // When GPU_WORKER_URL is set, RunPod is the entry-point and handles Meshy
        // internally — the Meshy task ID must never leak out as a RunPod job ID.
        if (normalized === 'runpod') return 'runpod';
        if (normalized === 'meshy') {
            const gpuWorkerUrl = normalizeUrl(process.env.GPU_WORKER_URL);
            const gpuWorkerToken = process.env.GPU_WORKER_TOKEN?.trim() ?? '';
            if (!gpuWorkerUrl || !gpuWorkerToken) return 'meshy';
        }
    }
    // Prefer the RunPod worker when it is configured: it handles Meshy internally
    // and returns a stable runpod_job_id that the reconcile route can poll safely.
    const gpuWorkerUrl = normalizeUrl(process.env.GPU_WORKER_URL);
    const gpuWorkerToken = process.env.GPU_WORKER_TOKEN?.trim() ?? '';
    const runpodEndpointUrl = normalizeUrl(process.env.RUNPOD_ENDPOINT_URL);
    const runpodApiKey = process.env.RUNPOD_API_KEY?.trim() ?? '';
    if (gpuWorkerUrl && gpuWorkerToken || runpodEndpointUrl && runpodApiKey) {
        return 'runpod';
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
            const meshyUrl = buildMeshyCreateUrl(normalizeUrl(process.env.MESHY_BASE_URL));
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
        // Persist cloud_job_id / runpod_job_id immediately so that if the user
        // navigates away and returns, the reconcile route uses the correct ID.
        if (jobId && pieceId) {
            const repo = new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$repositories$2f$WardrobeItemsRepository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["WardrobeItemsRepository"]();
            repo.updateProcessingState(pieceId, jobId).catch((err)=>{
                console.error('[3d-worker/submit] failed to persist runpod_job_id', {
                    pieceId,
                    jobId,
                    error: err
                });
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            ok: true,
            provider,
            status,
            jobId,
            runpod_job_id: jobId,
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
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__ea7f045d._.js.map