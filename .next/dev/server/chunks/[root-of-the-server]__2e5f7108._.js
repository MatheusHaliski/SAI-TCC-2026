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
"[project]/app/api/3d-worker/status/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "reconcileJob",
    ()=>reconcileJob,
    "resolveWorkerConfig",
    ()=>resolveWorkerConfig
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$repositories$2f$WardrobeItemsRepository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/backend/repositories/WardrobeItemsRepository.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebaseAdmin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/firebaseAdmin.ts [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$repositories$2f$WardrobeItemsRepository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebaseAdmin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$repositories$2f$WardrobeItemsRepository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebaseAdmin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
const RUNNING_STATUSES = new Set([
    'queued',
    'submitted',
    'in_progress',
    'processing',
    'started',
    'accepted',
    'pending',
    'waiting'
]);
const FAILED_STATUSES = new Set([
    'failed',
    'error',
    'errored',
    'cancelled',
    'canceled',
    'timed_out',
    'timeout'
]);
function resolveWorkerConfig() {
    const workerUrl = (process.env.GPU_WORKER_URL ?? process.env.BLENDER_CLOUD_API_URL ?? '').trim().replace(/\/+$/, '');
    const token = (process.env.GPU_WORKER_TOKEN ?? process.env.BLENDER_WORKER_TOKEN ?? process.env.BLENDER_CLOUD_API_TOKEN ?? '').trim();
    if (!workerUrl || !token) return null;
    return {
        workerUrl,
        token
    };
}
async function downloadArtifact(workerUrl, token, jobId, filename) {
    try {
        const res = await fetch(`${workerUrl}/artifacts/${jobId}/${filename}`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            cache: 'no-store'
        });
        if (!res.ok) return null;
        return Buffer.from(await res.arrayBuffer());
    } catch  {
        return null;
    }
}
async function uploadToFirebase(storagePath, buffer, contentType) {
    const bucket = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebaseAdmin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getAdminStorageBucket"])();
    const file = bucket.file(storagePath);
    const token = crypto.randomUUID();
    await file.save(buffer, {
        metadata: {
            contentType,
            metadata: {
                firebaseStorageDownloadTokens: token
            }
        },
        resumable: false,
        public: false,
        validation: 'md5'
    });
    const encodedPath = encodeURIComponent(storagePath);
    return `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodedPath}?alt=media&token=${token}`;
}
async function reconcileJob(pieceId, jobId) {
    const worker = resolveWorkerConfig();
    if (!worker) {
        return {
            ok: false,
            status: 'error',
            error: 'GPU_WORKER_URL and GPU_WORKER_TOKEN must be set'
        };
    }
    const abort = new AbortController();
    const abortTimer = setTimeout(()=>abort.abort(), 15_000);
    let workerRes;
    try {
        workerRes = await fetch(`${worker.workerUrl}/jobs/${jobId}`, {
            headers: {
                Authorization: `Bearer ${worker.token}`
            },
            cache: 'no-store',
            signal: abort.signal
        });
    } catch (err) {
        clearTimeout(abortTimer);
        const msg = err instanceof Error ? err.message : String(err);
        return {
            ok: false,
            status: 'error',
            error: `worker_unreachable: ${msg}`
        };
    } finally{
        clearTimeout(abortTimer);
    }
    if (!workerRes.ok) {
        const body = await workerRes.text().catch(()=>'');
        if (workerRes.status === 404) {
            // The worker returned 404 for this jobId. This means either:
            //   a) The worker restarted and lost its in-memory job registry, OR
            //   b) The jobId stored in cloud_job_id was never a valid RunPod worker job
            //      (e.g. a Meshy task ID or a Firestore piece ID leaked into cloud_job_id).
            //
            // Do NOT attempt to download /artifacts/{jobId} — if the ID is wrong, that
            // endpoint will also 404 and we would be masking the real problem.
            // Surface a clear diagnostic instead so the caller can restart the job.
            console.warn('[3d-worker/reconcile] job_not_found: RunPod worker returned 404', {
                pieceId,
                jobId,
                errorCode: 'INVALID_WORKER_JOB_ID',
                hint: 'The app polled a job ID the RunPod worker does not recognise. Likely cause: a Meshy task ID or piece ID was stored as cloud_job_id. Start a new generation job.'
            });
            return {
                ok: false,
                status: 'job_not_found',
                jobId,
                error: `The app is polling a job ID that the RunPod worker does not know (jobId=${jobId}). Start a new generation job.`,
                diagnostics: {
                    errorCode: 'INVALID_WORKER_JOB_ID',
                    usedJobId: jobId
                }
            };
        }
        return {
            ok: false,
            status: 'error',
            error: `worker_error: HTTP ${workerRes.status} — ${body.slice(0, 300)}`
        };
    }
    const jobData = await workerRes.json();
    const rawStatus = String(jobData.status ?? '').toLowerCase().trim();
    if (RUNNING_STATUSES.has(rawStatus)) {
        return {
            ok: true,
            status: 'processing',
            jobId,
            rawStatus
        };
    }
    const repo = new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$repositories$2f$WardrobeItemsRepository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["WardrobeItemsRepository"]();
    if (FAILED_STATUSES.has(rawStatus)) {
        const rawError = jobData.error && typeof jobData.error === 'object' ? jobData.error : null;
        const workerCode = rawError ? String(rawError.code ?? '') : '';
        const errorMsg = rawError ? String(rawError.message ?? `RunPod job ${rawStatus}`) : `RunPod job ${rawStatus}`;
        const isDnsFailure = workerCode === 'dns_resolution_failure';
        const isMeshyFailure = !isDnsFailure && workerCode.startsWith('meshy_');
        await repo.updatePipelineStatus(pieceId, 'failed', errorMsg, {
            stage: 'failed',
            failedStage: isDnsFailure ? 'network_dns' : isMeshyFailure ? 'meshy_submit' : 'runpod_worker_failure',
            provider: 'runpod',
            errorCode: isDnsFailure ? 'DNS_RESOLUTION_FAILED' : workerCode.toUpperCase() || 'WORKER_FAILED',
            ...isDnsFailure ? {
                kind: 'dns_resolution_failure'
            } : {},
            retryable: true,
            diagnostics: rawError?.details ?? {}
        });
        return {
            ok: false,
            status: 'failed',
            jobId,
            rawStatus,
            error: rawError ?? errorMsg
        };
    }
    if (rawStatus === 'completed' || rawStatus === 'succeeded' || rawStatus === 'done' || rawStatus === 'success') {
        const piece = await repo.findById(pieceId);
        if (!piece) {
            return {
                ok: false,
                status: 'error',
                error: 'piece_not_found'
            };
        }
        const userId = String(piece.user_id ?? piece.userId ?? '');
        if (!userId) {
            return {
                ok: false,
                status: 'error',
                error: 'piece_missing_userId'
            };
        }
        // Extract meshy_task_id from worker metrics — store it separately from
        // cloud_job_id so the two IDs are never confused in Firestore.
        const metrics = jobData.metrics && typeof jobData.metrics === 'object' ? jobData.metrics : {};
        const meshyTaskId = typeof metrics.meshyTaskId === 'string' && metrics.meshyTaskId.trim() ? metrics.meshyTaskId.trim() : null;
        const debug = jobData.debug && typeof jobData.debug === 'object' ? jobData.debug : {};
        const debugSteps = debug.steps && typeof debug.steps === 'object' ? debug.steps : {};
        const meshyStep = debugSteps.meshy && typeof debugSteps.meshy === 'object' ? debugSteps.meshy : {};
        const previewUrl = String(meshyStep.thumbnail_url ?? '').trim() || null;
        const storageBase = `wardrobe-3d-models/${userId}/${pieceId}/${jobId}`;
        console.info('[3d-worker] job_completed', {
            pieceId,
            jobId
        });
        console.info('[artifact-publish] downloading final_model.glb from worker', {
            jobId
        });
        const glbBuf = await downloadArtifact(worker.workerUrl, worker.token, jobId, 'final_model.glb');
        if (!glbBuf) {
            return {
                ok: false,
                status: 'error',
                error: 'artifact_download_failed: final_model.glb'
            };
        }
        const finalModelPath = `${storageBase}/final_model.glb`;
        const finalModelUrl = await uploadToFirebase(finalModelPath, glbBuf, 'model/gltf-binary');
        console.info('[artifact-publish] uploaded', {
            firebasePath: finalModelPath
        });
        console.info('[artifact-publish] publicUrl', {
            publicUrl: finalModelUrl
        });
        const baseBuf = await downloadArtifact(worker.workerUrl, worker.token, jobId, 'base_meshy.glb');
        const baseModelUrl = baseBuf ? await uploadToFirebase(`${storageBase}/base_meshy.glb`, baseBuf, 'model/gltf-binary') : null;
        const usdzBuf = await downloadArtifact(worker.workerUrl, worker.token, jobId, 'final_model.usdz');
        const usdzUrl = usdzBuf ? await uploadToFirebase(`${storageBase}/final_model.usdz`, usdzBuf, 'model/vnd.usdz+zip') : null;
        const debugBuf = await downloadArtifact(worker.workerUrl, worker.token, jobId, 'debug.json');
        const debugUrl = debugBuf ? await uploadToFirebase(`${storageBase}/debug.json`, debugBuf, 'application/json') : null;
        let resolvedPreviewUrl = previewUrl;
        if (!resolvedPreviewUrl) {
            const pngBuf = await downloadArtifact(worker.workerUrl, worker.token, jobId, 'preview.png');
            if (pngBuf) {
                resolvedPreviewUrl = await uploadToFirebase(`${storageBase}/preview.png`, pngBuf, 'image/png');
            }
        }
        await repo.updateCompletedModel(pieceId, {
            model_3d_url: finalModelUrl,
            model_base_3d_url: baseModelUrl,
            model_usdz_url: usdzUrl,
            model_preview_url: resolvedPreviewUrl,
            meshy_task_id: meshyTaskId
        }, jobId);
        const completedAt = new Date().toISOString();
        await repo.updatePipelineStatus(pieceId, 'completed', null, {
            current: {
                provider: 'runpod',
                stage: 'completed',
                runpod_job_id: jobId,
                meshyTaskId,
                durationMs: Number(metrics.durationMs ?? 0) || null,
                completedAt,
                artifacts: {
                    internal: jobData.artifacts ?? null,
                    public: {
                        model_3d_url: finalModelUrl,
                        model_base_3d_url: baseModelUrl,
                        model_usdz_url: usdzUrl,
                        model_preview_url: resolvedPreviewUrl,
                        debug_report_url: debugUrl
                    }
                }
            }
        });
        console.info('[firestore] piece model_status=completed model_3d_url_saved=true', {
            pieceId,
            jobId
        });
        console.info('[3d-worker/reconcile] model completed and synced', {
            pieceId,
            jobId,
            finalModelUrl,
            baseModelUrl,
            usdzUrl,
            previewUrl: resolvedPreviewUrl
        });
        return {
            ok: true,
            status: 'completed',
            jobId,
            model_3d_url: finalModelUrl,
            model_base_3d_url: baseModelUrl,
            model_usdz_url: usdzUrl,
            model_preview_url: resolvedPreviewUrl
        };
    }
    return {
        ok: true,
        status: 'processing',
        jobId,
        rawStatus
    };
}
async function GET(req) {
    const pieceId = req.nextUrl.searchParams.get('pieceId')?.trim() ?? '';
    const jobId = req.nextUrl.searchParams.get('jobId')?.trim() ?? '';
    if (!pieceId || !jobId) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            ok: false,
            error: 'pieceId and jobId are required'
        }, {
            status: 400
        });
    }
    if (!resolveWorkerConfig()) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            ok: false,
            error: 'GPU_WORKER_URL and GPU_WORKER_TOKEN must be set'
        }, {
            status: 500
        });
    }
    const result = await reconcileJob(pieceId, jobId);
    if (result.status === 'error') {
        const errResult = result;
        const isUnreachable = errResult.error.startsWith('worker_unreachable');
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(errResult, {
            status: isUnreachable ? 503 : 502
        });
    }
    if (result.status === 'job_not_found') {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(result, {
            status: 404
        });
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(result, {
        status: result.ok ? 200 : 502
    });
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/app/api/3d-worker/reconcile/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$api$2f$3d$2d$worker$2f$status$2f$route$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/api/3d-worker/status/route.ts [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$api$2f$3d$2d$worker$2f$status$2f$route$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$api$2f$3d$2d$worker$2f$status$2f$route$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
async function POST(req) {
    let body;
    try {
        body = await req.json();
    } catch  {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            ok: false,
            error: 'Invalid JSON body'
        }, {
            status: 400
        });
    }
    const pieceId = String(body.pieceId ?? '').trim();
    const jobId = String(body.jobId ?? '').trim();
    if (!pieceId || !jobId) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            ok: false,
            error: 'pieceId and jobId are required'
        }, {
            status: 400
        });
    }
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$api$2f$3d$2d$worker$2f$status$2f$route$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["resolveWorkerConfig"])()) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            ok: false,
            error: 'GPU_WORKER_URL and GPU_WORKER_TOKEN must be set'
        }, {
            status: 500
        });
    }
    try {
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$api$2f$3d$2d$worker$2f$status$2f$route$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["reconcileJob"])(pieceId, jobId);
        if (result.status === 'error') {
            const errResult = result;
            const isUnreachable = errResult.error.startsWith('worker_unreachable');
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(errResult, {
                status: isUnreachable ? 503 : 502
            });
        }
        if (result.status === 'job_not_found') {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(result, {
                status: 404
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(result, {
            status: result.ok ? 200 : 502
        });
    } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        console.error('[3d-worker/reconcile] unexpected error', {
            pieceId,
            jobId,
            error: message
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            ok: false,
            error: message
        }, {
            status: 500
        });
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__2e5f7108._.js.map