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
function normalizeUrl(value) {
    const trimmed = value?.trim();
    return trimmed ? trimmed : null;
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
    async updateGenerationAttempt(wardrobeItemId, generationAttemptCount) {
        await this.db.collection(WARDROBE_ITEMS_COLLECTION).doc(wardrobeItemId).update({
            generation_attempt_count: generationAttemptCount,
            updated_at: new Date().toISOString()
        });
    }
    async updateModel3dUrl(wardrobeItemId, model3dUrl) {
        const normalized = model3dUrl.trim();
        if (!normalized) return;
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
"[project]/app/backend/services/errors.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ServiceError",
    ()=>ServiceError
]);
class ServiceError extends Error {
    statusCode;
    constructor(message, statusCode = 400){
        super(message), this.statusCode = statusCode;
    }
}
}),
"[project]/app/backend/services/BrandDetectionService.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "BrandDetectionService",
    ()=>BrandDetectionService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$repositories$2f$BrandsRepository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/backend/repositories/BrandsRepository.ts [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$repositories$2f$BrandsRepository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$repositories$2f$BrandsRepository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
function tokenize(value) {
    return value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').split(' ').map((part)=>part.trim()).filter(Boolean);
}
class BrandDetectionService {
    brandsRepository;
    constructor(brandsRepository = new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$repositories$2f$BrandsRepository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BrandsRepository"]()){
        this.brandsRepository = brandsRepository;
    }
    async detect(input) {
        const activeBrands = await this.brandsRepository.listActive();
        const activeCatalogs = await this.brandsRepository.listActiveLogoCatalogs();
        const searchSpace = `${input.name} ${input.imageUrl}`.toLowerCase();
        const tokens = new Set(tokenize(searchSpace));
        const scored = activeBrands.map((brand)=>{
            const catalog = activeCatalogs.find((entry)=>entry.brand_id === brand.brand_id);
            const aliases = [
                brand.name,
                ...catalog?.detection_aliases ?? []
            ].map((value)=>value.toLowerCase());
            let score = 0;
            aliases.forEach((alias)=>{
                if (!alias.trim()) return;
                if (searchSpace.includes(alias)) score += 0.7;
                const aliasTokens = tokenize(alias);
                const tokenHits = aliasTokens.filter((token)=>tokens.has(token)).length;
                if (aliasTokens.length) {
                    score += tokenHits / aliasTokens.length * 0.3;
                }
            });
            return {
                brand_id: brand.brand_id,
                score
            };
        }).sort((a, b)=>b.score - a.score);
        const best = scored[0];
        if (best && best.score >= 0.55) {
            return {
                brand_id_detected: best.brand_id,
                brand_detection_confidence: Number(best.score.toFixed(2)),
                brand_detection_source: 'hybrid',
                detection_explanation: 'Matched brand aliases from image URL/name against logo catalog.'
            };
        }
        const selectedBrandId = input.selectedBrandId.trim();
        if (selectedBrandId && selectedBrandId !== 'default') {
            return {
                brand_id_detected: selectedBrandId,
                brand_detection_confidence: 0.4,
                brand_detection_source: 'manual',
                detection_explanation: 'No reliable image alias match; falling back to selected form brand.'
            };
        }
        return {
            brand_id_detected: null,
            brand_detection_confidence: 0.2,
            brand_detection_source: 'hybrid',
            detection_explanation: 'No reliable brand match from image data. Item requires brand review.'
        };
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/app/backend/services/BrandPlacementService.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "BrandPlacementService",
    ()=>BrandPlacementService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$repositories$2f$BrandsRepository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/backend/repositories/BrandsRepository.ts [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$repositories$2f$BrandsRepository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$repositories$2f$BrandsRepository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
const DEFAULT_PROFILES = [
    {
        profile_id: 'upper_chest_center',
        piece_type: 'upper_piece',
        anchor: 'chest_center',
        offset: {
            x: 0,
            y: 0.1,
            z: 0.03
        },
        rotation: {
            x: 0,
            y: 0,
            z: 0
        },
        scale: 0.12
    },
    {
        profile_id: 'lower_thigh_front',
        piece_type: 'lower_piece',
        anchor: 'thigh_front',
        offset: {
            x: 0.05,
            y: -0.25,
            z: 0.02
        },
        rotation: {
            x: 0,
            y: 0,
            z: 0
        },
        scale: 0.1
    },
    {
        profile_id: 'shoes_side_outer',
        piece_type: 'shoes_piece',
        anchor: 'outer_side',
        offset: {
            x: 0.08,
            y: -0.45,
            z: 0.08
        },
        rotation: {
            x: 0,
            y: 90,
            z: 0
        },
        scale: 0.09
    },
    {
        profile_id: 'accessory_front_center',
        piece_type: 'accessory_piece',
        anchor: 'front_center',
        offset: {
            x: 0,
            y: 0,
            z: 0.02
        },
        rotation: {
            x: 0,
            y: 0,
            z: 0
        },
        scale: 0.08
    }
];
class BrandPlacementService {
    brandsRepository;
    constructor(brandsRepository = new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$repositories$2f$BrandsRepository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BrandsRepository"]()){
        this.brandsRepository = brandsRepository;
    }
    async getPlacementProfile(input) {
        const catalog = await this.brandsRepository.getActiveLogoCatalogByBrandId(input.brandId);
        const desiredPieceType = input.pieceType;
        const profileFromCatalog = catalog?.placement_profiles?.find((profile)=>profile.piece_type === desiredPieceType);
        if (profileFromCatalog) return profileFromCatalog;
        return DEFAULT_PROFILES.find((profile)=>profile.piece_type === desiredPieceType) ?? DEFAULT_PROFILES[0];
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/app/backend/services/PieceIsolationService.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PieceIsolationService",
    ()=>PieceIsolationService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$services$2f$errors$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/backend/services/errors.ts [app-route] (ecmascript)");
;
const PIECE_TYPE_HINTS = {
    upper_piece: 'upper garment',
    lower_piece: 'lower garment',
    shoes_piece: 'footwear',
    accessory_piece: 'accessory'
};
class PieceIsolationService {
    async isolate(input) {
        const normalizedUrl = input.imageUrl.trim();
        if (!normalizedUrl) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$services$2f$errors$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ServiceError"]('Image URL is required for piece isolation.', 400);
        }
        const pieceHint = PIECE_TYPE_HINTS[input.pieceType] ?? 'garment';
        const urlLower = normalizedUrl.toLowerCase();
        const keywordPenalty = [
            'person',
            'fullbody',
            'full-body',
            'lookbook',
            'model'
        ].some((keyword)=>urlLower.includes(keyword)) ? 0.2 : 0;
        const segmentationConfidence = Math.max(0.55, 0.9 - keywordPenalty);
        return {
            isolatedImageUrl: normalizedUrl,
            segmentationConfidence,
            stageDetails: {
                method: 'v1_url_heuristic_passthrough',
                piece_hint: pieceHint,
                keyword_penalty: keywordPenalty
            }
        };
    }
}
}),
"[project]/app/backend/services/GeometryScopeService.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GeometryScopeService",
    ()=>GeometryScopeService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$services$2f$errors$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/backend/services/errors.ts [app-route] (ecmascript)");
;
const HUMAN_RIG_MARKERS = [
    'mixamorig',
    'armature',
    'hips',
    'spine',
    'head',
    'upperarm',
    'thigh'
];
const MAX_BYTES_BY_TYPE = {
    upper_piece: 18_000_000,
    lower_piece: 18_000_000,
    shoes_piece: 12_000_000,
    accessory_piece: 10_000_000
};
class GeometryScopeService {
    async validate(input) {
        const url = input.modelUrl.trim();
        if (!url) throw new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$services$2f$errors$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ServiceError"]('Model URL is required for geometry scope validation.', 400);
        const response = await fetch(url);
        if (!response.ok) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$services$2f$errors$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ServiceError"]('Unable to fetch generated model for geometry validation.', 502);
        }
        const bytes = new Uint8Array(await response.arrayBuffer());
        const maxBytes = MAX_BYTES_BY_TYPE[input.pieceType] ?? 18_000_000;
        const reasons = [];
        let scopeScore = 1;
        if (bytes.byteLength > maxBytes) {
            reasons.push(`Model size ${bytes.byteLength} exceeds limit ${maxBytes} for ${input.pieceType}.`);
            scopeScore -= 0.35;
        }
        const scanWindow = new TextDecoder('utf-8', {
            fatal: false
        }).decode(bytes.slice(0, Math.min(bytes.length, 700_000))).toLowerCase();
        const markerHits = HUMAN_RIG_MARKERS.filter((marker)=>scanWindow.includes(marker));
        if (markerHits.length) {
            reasons.push(`Detected humanoid rig markers: ${markerHits.join(', ')}.`);
            scopeScore -= 0.5;
        }
        const passed = scopeScore >= 0.65;
        if (passed) reasons.push('Garment-only scope heuristics passed.');
        return {
            passed,
            scopeScore: Number(scopeScore.toFixed(3)),
            reasons
        };
    }
}
}),
"[project]/app/backend/services/MeshyService.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MeshyService",
    ()=>MeshyService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$services$2f$errors$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/backend/services/errors.ts [app-route] (ecmascript)");
;
const MESHY_BASE_URL = 'https://api.meshy.ai/openapi/v1';
const MESHY_MAX_POLL_ATTEMPTS = Number(process.env.MESHY_MAX_POLL_ATTEMPTS ?? 80);
const MESHY_POLL_DELAY_MS = Number(process.env.MESHY_POLL_DELAY_MS ?? 3000);
function sleep(ms) {
    return new Promise((resolve)=>setTimeout(resolve, ms));
}
class MeshyService {
    apiKey = process.env.MESHY_API_KEY;
    async generate3DModelFromImage(imageUrl, options) {
        if (!this.apiKey) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$services$2f$errors$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ServiceError"]('MESHY_API_KEY is not configured.', 500);
        }
        const taskId = await this.createTask(imageUrl, options?.prompt);
        const taskResult = await this.waitUntilFinished(taskId);
        const model3dUrl = taskResult.model_urls?.glb;
        if (!model3dUrl) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$services$2f$errors$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ServiceError"]('Meshy did not return a GLB model URL.', 502);
        }
        return {
            model_3d_url: model3dUrl,
            model_preview_url: taskResult.thumbnail_url ?? taskResult.preview_url ?? null
        };
    }
    async createTask(imageUrl, prompt) {
        const body = {
            image_url: imageUrl,
            should_texture: true
        };
        if (prompt?.trim()) {
            body.prompt = prompt.trim();
        }
        const response = await fetch(`${MESHY_BASE_URL}/image-to-3d`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        if (!response.ok) {
            const details = await response.text();
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$services$2f$errors$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ServiceError"](`Failed to create Meshy task: ${details}`, 502);
        }
        const data = await response.json();
        const taskId = String(data.result ?? data.id ?? '').trim();
        if (!taskId) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$services$2f$errors$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ServiceError"]('Meshy did not return a task id.', 502);
        }
        return taskId;
    }
    async waitUntilFinished(taskId) {
        let lastStatus = 'unknown';
        for(let attempt = 1; attempt <= MESHY_MAX_POLL_ATTEMPTS; attempt += 1){
            const response = await fetch(`${MESHY_BASE_URL}/image-to-3d/${taskId}`, {
                headers: {
                    Authorization: `Bearer ${this.apiKey}`
                }
            });
            if (!response.ok) {
                const details = await response.text();
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$services$2f$errors$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ServiceError"](`Failed to poll Meshy task ${taskId}: ${details}`, 502);
            }
            const data = await response.json();
            const status = String(data.status ?? '').toLowerCase();
            lastStatus = status || lastStatus;
            if (status === 'succeeded' || status === 'success' || data.model_urls?.glb) {
                return data;
            }
            if (status === 'failed' || status === 'error') {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$services$2f$errors$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ServiceError"](`Meshy task ${taskId} failed.`, 502);
            }
            await sleep(MESHY_POLL_DELAY_MS);
        }
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$services$2f$errors$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ServiceError"](`Meshy task timed out before completion. Last known status: ${lastStatus}.`, 504);
    }
}
}),
"[project]/app/backend/repositories/PipelineJobsRepository.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "PipelineJobsRepository",
    ()=>PipelineJobsRepository
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$repositories$2f$BaseRepository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/backend/repositories/BaseRepository.ts [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$repositories$2f$BaseRepository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$repositories$2f$BaseRepository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
const PIPELINE_JOBS_COLLECTION = 'sai-pipelineJobs';
class PipelineJobsRepository extends __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$repositories$2f$BaseRepository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BaseRepository"] {
    async create(input) {
        const now = new Date().toISOString();
        const payload = {
            ...input,
            created_at: now,
            updated_at: now
        };
        const ref = await this.db.collection(PIPELINE_JOBS_COLLECTION).add(payload);
        return {
            pipeline_job_id: ref.id
        };
    }
    async findById(pipelineJobId) {
        const doc = await this.db.collection(PIPELINE_JOBS_COLLECTION).doc(pipelineJobId).get();
        if (!doc.exists) return null;
        return {
            pipeline_job_id: doc.id,
            ...doc.data()
        };
    }
    async findActiveByUser(userId) {
        const snapshot = await this.db.collection(PIPELINE_JOBS_COLLECTION).where('user_id', '==', userId).where('status', 'in', [
            'queued',
            'submitted',
            'in_progress'
        ]).limit(25).get();
        return snapshot.docs.map((doc)=>({
                pipeline_job_id: doc.id,
                ...doc.data()
            }));
    }
    async update(pipelineJobId, input) {
        await this.db.collection(PIPELINE_JOBS_COLLECTION).doc(pipelineJobId).update({
            ...input,
            updated_at: new Date().toISOString()
        });
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/app/backend/services/blenderCloudConfig.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "buildBlenderCloudUrl",
    ()=>buildBlenderCloudUrl,
    "buildHealthUrl",
    ()=>buildHealthUrl,
    "buildStatusUrl",
    ()=>buildStatusUrl,
    "buildSubmitUrl",
    ()=>buildSubmitUrl,
    "isBlenderCloudConfigured",
    ()=>isBlenderCloudConfigured,
    "resolveBlenderCloudConfig",
    ()=>resolveBlenderCloudConfig
]);
function normalizeBaseUrl(rawUrl) {
    return rawUrl.trim().replace(/\/+$/, '');
}
function normalizePath(rawPath) {
    const trimmed = rawPath.trim();
    if (!trimmed) return '/';
    return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
}
function resolveApiUrl() {
    const explicit = process.env.BLENDER_CLOUD_API_URL?.trim();
    if (explicit) return normalizeBaseUrl(explicit);
    const legacy = process.env.RUNPOD_ENDPOINT_URL?.trim();
    if (legacy) return normalizeBaseUrl(legacy);
    throw new Error('Missing Blender Cloud API URL. Set BLENDER_CLOUD_API_URL (or legacy RUNPOD_ENDPOINT_URL).');
}
function resolveAuth() {
    const explicitToken = process.env.BLENDER_CLOUD_API_TOKEN?.trim();
    if (explicitToken) {
        return {
            authToken: explicitToken,
            authSource: 'BLENDER_CLOUD_API_TOKEN'
        };
    }
    const gpuWorkerToken = process.env.GPU_WORKER_TOKEN?.trim();
    if (gpuWorkerToken) {
        return {
            authToken: gpuWorkerToken,
            authSource: 'GPU_WORKER_TOKEN'
        };
    }
    const blenderWorkerToken = process.env.BLENDER_WORKER_TOKEN?.trim();
    if (blenderWorkerToken) {
        return {
            authToken: blenderWorkerToken,
            authSource: 'BLENDER_WORKER_TOKEN'
        };
    }
    const runpodApiKey = process.env.RUNPOD_API_KEY?.trim();
    if (runpodApiKey) {
        return {
            authToken: runpodApiKey,
            authSource: 'RUNPOD_API_KEY'
        };
    }
    return {
        authToken: '',
        authSource: 'none'
    };
}
function resolvePayloadMode() {
    const rawMode = (process.env.BLENDER_CLOUD_SUBMIT_PAYLOAD_MODE ?? 'raw').trim().toLowerCase();
    return rawMode === 'input' ? 'input' : 'raw';
}
function resolveNumber(value, fallback) {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}
function validateConfig(config) {
    try {
        new URL(config.apiUrl);
    } catch  {
        throw new Error(`Invalid BLENDER_CLOUD_API_URL value: "${config.apiUrl}"`);
    }
    if (!config.statusPathTemplate.includes(':jobId')) {
        throw new Error('BLENDER_CLOUD_STATUS_PATH_TEMPLATE must include ":jobId".');
    }
}
function resolveBlenderCloudConfig() {
    const auth = resolveAuth();
    const config = {
        apiUrl: resolveApiUrl(),
        submitPath: normalizePath(process.env.BLENDER_CLOUD_SUBMIT_PATH?.trim() || '/jobs'),
        statusPathTemplate: normalizePath(process.env.BLENDER_CLOUD_STATUS_PATH_TEMPLATE?.trim() || '/jobs/:jobId'),
        healthPath: normalizePath(process.env.BLENDER_CLOUD_HEALTH_PATH?.trim() || '/ping'),
        payloadMode: resolvePayloadMode(),
        authToken: auth.authToken,
        authSource: auth.authSource,
        submitTimeoutMs: resolveNumber(process.env.BLENDER_CLOUD_SUBMIT_TIMEOUT_MS, 15000),
        statusTimeoutMs: resolveNumber(process.env.BLENDER_CLOUD_STATUS_TIMEOUT_MS, 10000),
        healthTimeoutMs: resolveNumber(process.env.BLENDER_CLOUD_HEALTH_TIMEOUT_MS, 5000)
    };
    validateConfig(config);
    return config;
}
function isBlenderCloudConfigured() {
    return Boolean(process.env.BLENDER_CLOUD_API_URL?.trim() || process.env.RUNPOD_ENDPOINT_URL?.trim());
}
function buildBlenderCloudUrl(apiUrl, path) {
    return `${normalizeBaseUrl(apiUrl)}${normalizePath(path)}`;
}
function buildSubmitUrl(config) {
    return buildBlenderCloudUrl(config.apiUrl, config.submitPath);
}
function buildStatusUrl(config, cloudJobId) {
    const statusPath = config.statusPathTemplate.replace(':jobId', encodeURIComponent(cloudJobId));
    return buildBlenderCloudUrl(config.apiUrl, statusPath);
}
function buildHealthUrl(config) {
    return buildBlenderCloudUrl(config.apiUrl, config.healthPath);
}
}),
"[project]/app/backend/services/BlenderCloudService.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BlenderCloudService",
    ()=>BlenderCloudService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$services$2f$blenderCloudConfig$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/backend/services/blenderCloudConfig.ts [app-route] (ecmascript)");
;
function toRecord(value) {
    return value && typeof value === 'object' ? value : {};
}
function getJobId(source) {
    const candidate = source.job_id ?? source.jobId ?? source.id;
    return typeof candidate === 'string' ? candidate.trim() : '';
}
function normalizeStatus(statusLike) {
    const normalized = String(statusLike ?? '').trim().toLowerCase().replace(/[\s-]+/g, '_');
    if (!normalized) return null;
    if ([
        'completed',
        'succeeded',
        'done',
        'success',
        'finished',
        'complete'
    ].includes(normalized)) return 'completed';
    if ([
        'failed',
        'error',
        'errored',
        'timed_out',
        'timeout'
    ].includes(normalized)) return 'failed';
    if ([
        'cancelled',
        'canceled',
        'terminated',
        'aborted'
    ].includes(normalized)) return 'cancelled';
    if ([
        'running',
        'in_progress',
        'processing',
        'started',
        'active'
    ].includes(normalized)) return 'in_progress';
    if ([
        'submitted',
        'accepted'
    ].includes(normalized)) return 'submitted';
    if ([
        'queued',
        'pending',
        'waiting'
    ].includes(normalized)) return 'queued';
    return null;
}
function readString(value) {
    return typeof value === 'string' && value.trim().length > 0 ? value.trim() : null;
}
function findArtifactUrl(value) {
    if (typeof value === 'string') {
        const trimmed = value.trim();
        if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('/')) {
            return trimmed;
        }
    }
    if (!value || typeof value !== 'object') return null;
    const record = value;
    for (const key of [
        'url',
        'href',
        'download_url',
        'downloadUrl',
        'model_url',
        'modelUrl',
        'glb_url',
        'glbUrl'
    ]){
        const candidate = readString(record[key]);
        if (candidate) return candidate;
    }
    return null;
}
function extractArtifacts(payload) {
    const output = toRecord(payload.output);
    const outputArtifacts = toRecord(output.artifacts);
    const topLevelArtifacts = toRecord(payload.artifacts);
    if (Object.keys(topLevelArtifacts).length > 0) return topLevelArtifacts;
    if (Object.keys(outputArtifacts).length > 0) return outputArtifacts;
    const directUrlKeys = [
        'model_3d_url',
        'modelUrl',
        'outputModelUrl',
        'outputUrl',
        'glb',
        'glbUrl',
        'glb_url',
        'model_url',
        'output_url',
        'download_url',
        'file_url',
        'result_url',
        'artifact_url',
        'artifactUrl',
        'url'
    ];
    const fromOutput = directUrlKeys.reduce((acc, key)=>{
        const candidate = output[key];
        if (typeof candidate === 'string' && candidate.trim().length > 0) {
            acc[key] = candidate.trim();
        }
        return acc;
    }, {});
    const fromTop = directUrlKeys.reduce((acc, key)=>{
        const candidate = payload[key];
        if (typeof candidate === 'string' && candidate.trim().length > 0) {
            acc[key] = candidate.trim();
        }
        return acc;
    }, {});
    const nestedOutputCandidates = {};
    const modelCandidate = findArtifactUrl(output.model);
    const fileCandidate = findArtifactUrl(output.file);
    const resultCandidate = findArtifactUrl(output.result);
    if (modelCandidate) nestedOutputCandidates.model = modelCandidate;
    if (fileCandidate) nestedOutputCandidates.file = fileCandidate;
    if (resultCandidate) nestedOutputCandidates.result = resultCandidate;
    const combined = {
        ...fromTop,
        ...fromOutput,
        ...nestedOutputCandidates
    };
    return Object.keys(combined).length > 0 ? combined : null;
}
function isErrorLikeText(value) {
    return /(error|failed|failure|traceback|exception|timed?\s*out|invalid|not found|unable)/i.test(value);
}
function extractErrorMessage(payload) {
    const output = toRecord(payload.output);
    const topLevelError = toRecord(payload.error);
    const outputError = toRecord(output.error);
    const mergedError = {
        ...outputError,
        ...topLevelError
    };
    const errorCode = readString(mergedError.code);
    if (errorCode === 'invalid_input_low_quality') {
        const qualityReport = toRecord(mergedError.qualityReport ?? payload.qualityReport ?? output.qualityReport);
        const brightness = Number(qualityReport.brightness ?? NaN);
        const contrast = Number(qualityReport.contrast ?? NaN);
        const qualityScore = Number(qualityReport.qualityScore ?? payload.qualityScore ?? NaN);
        const threshold = Number(mergedError.qualityThreshold ?? payload.cleanedQualityThreshold ?? NaN);
        const bits = [
            'Cleaned garment image did not meet quality threshold.',
            Number.isFinite(threshold) ? `threshold=${threshold.toFixed(2)}` : null,
            Number.isFinite(brightness) ? `brightness=${brightness.toFixed(3)}` : null,
            Number.isFinite(contrast) ? `contrast=${contrast.toFixed(3)}` : null,
            Number.isFinite(qualityScore) ? `qualityScore=${qualityScore.toFixed(3)}` : null
        ].filter((value)=>Boolean(value));
        return bits.join(' ');
    }
    const candidates = [
        payload.error,
        output.error,
        payload.traceback,
        output.traceback,
        payload.message,
        output.message,
        payload.detail,
        output.detail
    ];
    for (const candidate of candidates){
        if (typeof candidate === 'string' && candidate.trim()) {
            const message = candidate.trim();
            if (candidate === payload.message || candidate === output.message || candidate === payload.detail || candidate === output.detail) {
                if (!isErrorLikeText(message)) continue;
            }
            return message;
        }
        if (candidate && typeof candidate === 'object') {
            return clipForLog(candidate, 800);
        }
    }
    return null;
}
function resolveRawStatus(payload) {
    const output = toRecord(payload.output);
    const candidates = [
        {
            field: 'body.status',
            value: payload.status
        },
        {
            field: 'output.status',
            value: output.status
        },
        {
            field: 'body.state',
            value: payload.state
        },
        {
            field: 'output.state',
            value: output.state
        },
        {
            field: 'body.phase',
            value: payload.phase
        },
        {
            field: 'output.phase',
            value: output.phase
        },
        {
            field: 'body.result',
            value: payload.result
        },
        {
            field: 'output.result',
            value: output.result
        },
        {
            field: 'body.job_status',
            value: payload.job_status
        },
        {
            field: 'output.job_status',
            value: output.job_status
        }
    ].filter((candidate)=>candidate.value !== undefined && candidate.value !== null);
    const preferred = candidates.find((candidate)=>{
        if (typeof candidate.value === 'string') return candidate.value.trim().length > 0;
        return typeof candidate.value === 'number' || typeof candidate.value === 'boolean';
    });
    return {
        rawStatus: preferred?.value ?? null,
        candidates
    };
}
function clipForLog(value, max = 500) {
    const raw = typeof value === 'string' ? value : JSON.stringify(value ?? {});
    return raw.length > max ? `${raw.slice(0, max)}…` : raw;
}
class BlenderCloudService {
    async fetchWithTimeout(url, init, timeoutMs) {
        const controller = new AbortController();
        const timeout = setTimeout(()=>controller.abort(), timeoutMs);
        try {
            return await fetch(url, {
                ...init,
                signal: controller.signal
            });
        } finally{
            clearTimeout(timeout);
        }
    }
    buildHeaders(config) {
        return {
            'Content-Type': 'application/json',
            ...config.authToken ? {
                Authorization: `Bearer ${config.authToken}`
            } : {}
        };
    }
    mapSubmitPayload(config, input) {
        const internalPayload = {
            modelUrl: input.modelUrl,
            ...input.imageUrl ? {
                imageUrl: input.imageUrl
            } : {},
            jobType: input.jobType,
            options: input.options ?? {}
        };
        return config.payloadMode === 'input' ? {
            input: internalPayload
        } : internalPayload;
    }
    isConfigured() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$services$2f$blenderCloudConfig$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isBlenderCloudConfigured"])();
    }
    async getDiagnostics() {
        const config = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$services$2f$blenderCloudConfig$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["resolveBlenderCloudConfig"])();
        const submitUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$services$2f$blenderCloudConfig$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["buildSubmitUrl"])(config);
        const healthUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$services$2f$blenderCloudConfig$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["buildHealthUrl"])(config);
        let health = {
            ok: false,
            status: null,
            bodyExcerpt: null,
            error: null
        };
        try {
            const response = await this.fetchWithTimeout(healthUrl, {
                method: 'GET',
                headers: config.authToken ? {
                    Authorization: `Bearer ${config.authToken}`
                } : {}
            }, config.healthTimeoutMs);
            const text = await response.text().catch(()=>'');
            health = {
                ok: response.ok,
                status: response.status,
                bodyExcerpt: clipForLog(text || null),
                error: null
            };
        } catch (error) {
            health = {
                ok: false,
                status: null,
                bodyExcerpt: null,
                error: error instanceof Error ? error.message : String(error)
            };
        }
        return {
            apiUrl: config.apiUrl,
            submitUrl,
            statusPathTemplate: config.statusPathTemplate,
            healthUrl,
            payloadMode: config.payloadMode,
            authSource: config.authSource,
            health
        };
    }
    async submitBlenderCloudJob(input) {
        const config = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$services$2f$blenderCloudConfig$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["resolveBlenderCloudConfig"])();
        const submitUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$services$2f$blenderCloudConfig$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["buildSubmitUrl"])(config);
        const requestBody = this.mapSubmitPayload(config, input);
        console.info('[blender-cloud] submit request', {
            submitUrl,
            payloadMode: config.payloadMode,
            authSource: config.authSource,
            jobType: input.jobType
        });
        let response;
        try {
            response = await this.fetchWithTimeout(submitUrl, {
                method: 'POST',
                headers: this.buildHeaders(config),
                body: JSON.stringify(requestBody)
            }, config.submitTimeoutMs);
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            throw new Error(`Blender Cloud submit request failed. url=${submitUrl} timeoutMs=${config.submitTimeoutMs} error=${message}`);
        }
        const body = toRecord(await response.json().catch(()=>({})));
        console.info('[blender-cloud] submit response', {
            submitUrl,
            responseStatus: response.status,
            bodyExcerpt: clipForLog(body)
        });
        if (!response.ok) {
            throw new Error(`Blender Cloud submit failed. url=${submitUrl} status=${response.status} body=${clipForLog(body)}`);
        }
        const cloudJobId = getJobId(body);
        const normalizedStatus = normalizeStatus(body.status) ?? (extractArtifacts(body) ? 'completed' : 'submitted');
        const artifacts = extractArtifacts(body);
        if (cloudJobId) {
            return {
                cloudJobId,
                status: normalizedStatus,
                artifacts,
                raw: body
            };
        }
        if (artifacts) {
            return {
                cloudJobId: 'inline-response',
                status: 'completed',
                artifacts,
                raw: body
            };
        }
        throw new Error(`Blender Cloud submit returned no job id and no artifacts. url=${submitUrl} body=${clipForLog(body)}`);
    }
    async getBlenderCloudJobStatus(cloudJobId, inlineRaw) {
        if (cloudJobId === 'inline-response') {
            const artifacts = inlineRaw ? extractArtifacts(inlineRaw) : null;
            return {
                cloudJobId,
                status: 'completed',
                artifacts,
                metrics: null,
                logs: null,
                raw: inlineRaw ?? {
                    status: 'completed'
                },
                errorMessage: null
            };
        }
        const config = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$services$2f$blenderCloudConfig$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["resolveBlenderCloudConfig"])();
        const statusUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$services$2f$blenderCloudConfig$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["buildStatusUrl"])(config, cloudJobId);
        console.info('[blender-cloud] status request', {
            cloudJobId,
            statusUrl,
            authSource: config.authSource
        });
        let response;
        try {
            response = await this.fetchWithTimeout(statusUrl, {
                method: 'GET',
                headers: config.authToken ? {
                    Authorization: `Bearer ${config.authToken}`
                } : {}
            }, config.statusTimeoutMs);
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            throw new Error(`Blender Cloud status request failed. url=${statusUrl} timeoutMs=${config.statusTimeoutMs} error=${message}`);
        }
        const rawText = await response.text().catch(()=>'');
        const rawResponseExcerpt = clipForLog(rawText || null, 800);
        console.info('[blender-cloud] raw status response text', {
            cloudJobId,
            statusUrl,
            responseStatus: response.status,
            rawTextExcerpt: rawResponseExcerpt
        });
        if (!response.ok) {
            throw new Error(`Blender Cloud status failed. cloudJobId=${cloudJobId} url=${statusUrl} status=${response.status} body=${rawResponseExcerpt}`);
        }
        if (!rawText.trim()) {
            console.warn('[blender-cloud] empty status response body', {
                cloudJobId,
                statusUrl,
                responseStatus: response.status
            });
            return {
                cloudJobId,
                status: 'failed',
                artifacts: null,
                metrics: null,
                logs: null,
                raw: {
                    responseStatus: response.status,
                    rawText: ''
                },
                errorMessage: 'Status response body was empty'
            };
        }
        let parsedBody;
        try {
            parsedBody = JSON.parse(rawText);
        } catch (error) {
            console.warn('[blender-cloud] NON-JSON RESPONSE from status endpoint', {
                cloudJobId,
                statusUrl,
                responseStatus: response.status,
                parseError: error instanceof Error ? error.message : String(error),
                rawTextExcerpt: rawResponseExcerpt
            });
            return {
                cloudJobId,
                status: 'failed',
                artifacts: null,
                metrics: null,
                logs: null,
                raw: {
                    responseStatus: response.status,
                    rawText
                },
                errorMessage: 'Status endpoint returned non-JSON response'
            };
        }
        const body = toRecord(parsedBody);
        const output = toRecord(body.output);
        const artifacts = extractArtifacts(body);
        const errorMessage = extractErrorMessage(body);
        const { rawStatus, candidates } = resolveRawStatus(body);
        const normalizedFromStatus = normalizeStatus(rawStatus);
        let finalStatus;
        if (errorMessage) {
            finalStatus = 'failed';
        } else if (artifacts) {
            finalStatus = 'completed';
        } else if (normalizedFromStatus) {
            finalStatus = normalizedFromStatus;
        } else {
            finalStatus = 'in_progress';
            console.warn('[blender-cloud] status missing from payload and no terminal signal found', {
                cloudJobId,
                statusUrl,
                responseStatus: response.status,
                parsedPayloadExcerpt: clipForLog(body, 1200)
            });
        }
        console.info('[blender-cloud] status poll diagnostics', {
            cloudJobId,
            statusUrl,
            responseStatus: response.status,
            rawResponseExcerpt: rawResponseExcerpt,
            statusCandidates: candidates.map((candidate)=>({
                    field: candidate.field,
                    valueExcerpt: clipForLog(candidate.value, 160)
                })),
            rawStatus: rawStatus ?? null,
            normalizedStatus: finalStatus,
            artifactsFound: Boolean(artifacts),
            errorMessageFound: Boolean(errorMessage)
        });
        return {
            cloudJobId,
            status: finalStatus,
            artifacts,
            metrics: Object.keys(toRecord(body.metrics)).length ? toRecord(body.metrics) : Object.keys(toRecord(output.metrics)).length ? toRecord(output.metrics) : null,
            logs: Object.keys(toRecord(body.logs)).length ? toRecord(body.logs) : Object.keys(toRecord(output.logs)).length ? toRecord(output.logs) : null,
            raw: body,
            errorMessage
        };
    }
}
}),
"[project]/app/backend/services/BlenderPipelineService.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "BlenderPipelineService",
    ()=>BlenderPipelineService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$repositories$2f$PipelineJobsRepository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/backend/repositories/PipelineJobsRepository.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$repositories$2f$WardrobeItemsRepository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/backend/repositories/WardrobeItemsRepository.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$services$2f$BlenderCloudService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/backend/services/BlenderCloudService.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$services$2f$errors$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/backend/services/errors.ts [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$repositories$2f$PipelineJobsRepository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$repositories$2f$WardrobeItemsRepository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$repositories$2f$PipelineJobsRepository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$repositories$2f$WardrobeItemsRepository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
function findUrlInArtifacts(artifacts) {
    if (!artifacts) return null;
    const candidates = [
        artifacts.model_3d_url,
        artifacts.modelUrl,
        artifacts.outputModelUrl,
        artifacts.outputUrl,
        artifacts.glbUrl,
        artifacts.artifact_url,
        artifacts.artifactUrl,
        artifacts.url
    ];
    for (const candidate of candidates){
        if (typeof candidate === 'string' && candidate.trim().length > 0) {
            return candidate.trim();
        }
    }
    return null;
}
function findCleanedPngUrlInArtifacts(artifacts) {
    if (!artifacts) return null;
    const candidates = [
        artifacts.cleaned_png_url,
        artifacts.cleanedPngUrl,
        artifacts.cleaned_image_url,
        artifacts.cleanedImageUrl
    ];
    for (const candidate of candidates){
        if (typeof candidate === 'string' && candidate.trim().length > 0) {
            return candidate.trim();
        }
    }
    return null;
}
class BlenderPipelineService {
    pipelineJobsRepository;
    wardrobeItemsRepository;
    blenderCloudService;
    constructor(pipelineJobsRepository = new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$repositories$2f$PipelineJobsRepository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PipelineJobsRepository"](), wardrobeItemsRepository = new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$repositories$2f$WardrobeItemsRepository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["WardrobeItemsRepository"](), blenderCloudService = new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$services$2f$BlenderCloudService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BlenderCloudService"]()){
        this.pipelineJobsRepository = pipelineJobsRepository;
        this.wardrobeItemsRepository = wardrobeItemsRepository;
        this.blenderCloudService = blenderCloudService;
    }
    async createUvJob(input) {
        const user_id = String(input.user_id ?? '').trim();
        const wardrobe_item_id = String(input.wardrobe_item_id ?? '').trim();
        const requestedModelUrl = String(input.modelUrl ?? '').trim();
        const generation_mode = String(input.generation_mode ?? 'fast_uv').trim() === 'hq_uv' ? 'hq_uv' : 'fast_uv';
        if (!user_id || !wardrobe_item_id) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$services$2f$errors$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ServiceError"]('Missing required fields for UV generation job (user_id, wardrobe_item_id).', 400);
        }
        const wardrobeItem = await this.wardrobeItemsRepository.findById(wardrobe_item_id);
        if (!wardrobeItem) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$services$2f$errors$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ServiceError"]('Wardrobe item not found for UV generation.', 404);
        }
        const modelUrlCandidates = [
            requestedModelUrl,
            typeof wardrobeItem.model_3d_url === 'string' ? wardrobeItem.model_3d_url : '',
            typeof wardrobeItem.model_branded_3d_url === 'string' ? wardrobeItem.model_branded_3d_url : '',
            typeof wardrobeItem.model_base_3d_url === 'string' ? wardrobeItem.model_base_3d_url : ''
        ];
        const modelUrl = modelUrlCandidates.find((url)=>url.trim().length > 0)?.trim() ?? '';
        if (!modelUrl) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$services$2f$errors$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ServiceError"]('Model URL not available yet for UV generation. Wait until 3D model generation is done.', 409);
        }
        const created = await this.pipelineJobsRepository.create({
            user_id,
            wardrobe_item_id,
            provider: 'runpod',
            cloud_job_id: null,
            status: 'queued',
            stage: 'queued',
            input_payload: {
                modelUrl,
                jobType: 'uv_unwrap',
                options: {
                    generation_mode
                }
            },
            artifacts: null,
            metrics: null,
            error_message: null,
            started_at: null,
            finished_at: null
        });
        try {
            const runpodSubmitted = await this.blenderCloudService.submitBlenderCloudJob({
                modelUrl,
                jobType: 'uv_unwrap',
                options: {
                    generation_mode
                }
            });
            const submittedStatus = runpodSubmitted.status === 'completed' ? 'completed' : runpodSubmitted.status === 'failed' || runpodSubmitted.status === 'cancelled' ? runpodSubmitted.status : 'submitted';
            await this.pipelineJobsRepository.update(created.pipeline_job_id, {
                cloud_job_id: runpodSubmitted.cloudJobId,
                status: submittedStatus,
                stage: submittedStatus === 'completed' ? 'completed' : 'submitted_to_runpod',
                started_at: new Date().toISOString(),
                metrics: {
                    runpodSubmitResponse: runpodSubmitted.raw
                },
                artifacts: runpodSubmitted.artifacts,
                finished_at: submittedStatus === 'completed' ? new Date().toISOString() : null
            });
            if (submittedStatus === 'completed') {
                const artifactUrl = findUrlInArtifacts(runpodSubmitted.artifacts);
                const cleanedPngUrl = findCleanedPngUrlInArtifacts(runpodSubmitted.artifacts);
                await this.wardrobeItemsRepository.updatePipelineStatus(wardrobe_item_id, 'done', null, {
                    stage: 'uv_pipeline_completed_inline',
                    pipeline_job_id: created.pipeline_job_id,
                    cloud_job_id: runpodSubmitted.cloudJobId,
                    provider: 'runpod',
                    uv_job_artifacts: runpodSubmitted.artifacts
                });
                if (artifactUrl) {
                    await this.wardrobeItemsRepository.updateModel3dUrl(wardrobe_item_id, artifactUrl);
                }
                if (cleanedPngUrl) {
                    await this.wardrobeItemsRepository.updateCleanedPngUrl(wardrobe_item_id, cleanedPngUrl);
                }
            }
            return {
                jobId: created.pipeline_job_id,
                cloudJobId: runpodSubmitted.cloudJobId,
                provider: 'runpod',
                status: submittedStatus,
                stage: submittedStatus === 'completed' ? 'completed' : 'submitted_to_runpod'
            };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unable to submit job to Blender Cloud service.';
            await this.pipelineJobsRepository.update(created.pipeline_job_id, {
                status: 'failed',
                stage: 'submit_failed',
                error_message: errorMessage,
                finished_at: new Date().toISOString()
            });
            await this.wardrobeItemsRepository.updatePipelineStatus(wardrobe_item_id, 'failed', errorMessage, {
                stage: 'uv_pipeline_submit_failed',
                pipeline_job_id: created.pipeline_job_id
            });
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$services$2f$errors$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ServiceError"](errorMessage, 502);
        }
    }
    async getJob(pipelineJobId) {
        const job = await this.syncBlenderCloudJob(pipelineJobId);
        return {
            jobId: job.pipeline_job_id,
            cloudJobId: job.cloud_job_id,
            provider: job.provider,
            status: job.status,
            stage: job.stage,
            artifacts: job.artifacts,
            metrics: job.metrics,
            error: job.error_message,
            startedAt: job.started_at,
            finishedAt: job.finished_at,
            updatedAt: job.updated_at
        };
    }
    async syncBlenderCloudJob(pipelineJobId) {
        const job = await this.pipelineJobsRepository.findById(pipelineJobId);
        if (!job) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$services$2f$errors$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ServiceError"]('Pipeline job not found.', 404);
        }
        if (!job.cloud_job_id) {
            if (job.status !== 'failed' && job.status !== 'cancelled') {
                await this.pipelineJobsRepository.update(pipelineJobId, {
                    status: 'failed',
                    stage: 'missing_cloud_job_id',
                    error_message: 'Pipeline job is missing cloud_job_id.',
                    finished_at: new Date().toISOString()
                });
            }
            return await this.pipelineJobsRepository.findById(pipelineJobId) ?? job;
        }
        if ([
            'completed',
            'failed',
            'cancelled'
        ].includes(job.status)) {
            return job;
        }
        const remote = await this.blenderCloudService.getBlenderCloudJobStatus(job.cloud_job_id, job.metrics?.runpodSubmitResponse);
        const cleanedPngUrl = findCleanedPngUrlInArtifacts(remote.artifacts);
        const mergedMetrics = {
            ...job.metrics ?? {},
            ...remote.metrics ?? {},
            last_remote_status: remote.status,
            last_synced_at: new Date().toISOString()
        };
        if (remote.status === 'completed') {
            const resolvedModelUrl = findUrlInArtifacts(remote.artifacts);
            await this.pipelineJobsRepository.update(pipelineJobId, {
                status: 'completed',
                stage: 'completed',
                artifacts: remote.artifacts,
                metrics: mergedMetrics,
                error_message: null,
                finished_at: new Date().toISOString()
            });
            await this.wardrobeItemsRepository.updatePipelineStatus(job.wardrobe_item_id, 'done', null, {
                stage: 'uv_pipeline_completed',
                pipeline_job_id: pipelineJobId,
                cloud_job_id: job.cloud_job_id,
                provider: 'runpod',
                uv_job_artifacts: remote.artifacts,
                uv_job_metrics: remote.metrics
            });
            if (resolvedModelUrl) {
                await this.wardrobeItemsRepository.updateModel3dUrl(job.wardrobe_item_id, resolvedModelUrl);
            }
            if (cleanedPngUrl) {
                await this.wardrobeItemsRepository.updateCleanedPngUrl(job.wardrobe_item_id, cleanedPngUrl);
            }
        } else if (remote.status === 'failed' || remote.status === 'cancelled') {
            const failureMessage = remote.errorMessage ?? (remote.status === 'cancelled' ? 'RunPod Blender job was cancelled.' : 'RunPod Blender job failed.');
            await this.pipelineJobsRepository.update(pipelineJobId, {
                status: remote.status,
                stage: remote.status,
                artifacts: remote.artifacts,
                metrics: mergedMetrics,
                error_message: failureMessage,
                finished_at: new Date().toISOString()
            });
            await this.wardrobeItemsRepository.updatePipelineStatus(job.wardrobe_item_id, 'failed', failureMessage, {
                stage: remote.status === 'cancelled' ? 'uv_pipeline_cancelled' : 'uv_pipeline_failed',
                pipeline_job_id: pipelineJobId,
                cloud_job_id: job.cloud_job_id,
                provider: 'runpod'
            });
            if (cleanedPngUrl) {
                await this.wardrobeItemsRepository.updateCleanedPngUrl(job.wardrobe_item_id, cleanedPngUrl);
            }
        } else {
            await this.pipelineJobsRepository.update(pipelineJobId, {
                status: remote.status === 'submitted' ? 'submitted' : remote.status === 'in_progress' ? 'in_progress' : 'queued',
                stage: remote.status,
                metrics: mergedMetrics
            });
        }
        const synced = await this.pipelineJobsRepository.findById(pipelineJobId);
        if (!synced) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$services$2f$errors$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ServiceError"]('Pipeline job not found after synchronization.', 404);
        }
        return synced;
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/app/lib/fashion-ai/utils/garment-classification.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "classifyGarmentGender",
    ()=>classifyGarmentGender,
    "classifyGarmentType",
    ()=>classifyGarmentType
]);
const TOP_TOKENS = [
    'shirt',
    'camisa',
    't-shirt',
    'tee',
    'blouse',
    'jacket',
    'hoodie',
    'coat',
    'upper',
    'top'
];
const BOTTOM_TOKENS = [
    'pants',
    'jeans',
    'shorts',
    'skirt',
    'lower',
    'bottom',
    'calça'
];
const SHOE_TOKENS = [
    'shoe',
    'sneaker',
    'boot',
    'heel',
    'sandals'
];
const FULL_BODY_TOKENS = [
    'dress',
    'jumpsuit',
    'macacão',
    'one-piece',
    'full'
];
const MALE_GENDER_TOKENS = [
    'male',
    'masculino',
    'man',
    'men',
    'masc'
];
const FEMALE_GENDER_TOKENS = [
    'female',
    'feminino',
    'woman',
    'women',
    'fem'
];
function escapeRegexToken(token) {
    return token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
function containsBoundedToken(text, token) {
    return new RegExp(`(^|[^a-z])${escapeRegexToken(token)}([^a-z]|$)`, 'i').test(text);
}
function classifyGarmentType(input) {
    const text = `${input.pieceType ?? ''} ${input.name ?? ''}`.toLowerCase();
    if (FULL_BODY_TOKENS.some((token)=>text.includes(token))) return 'full_body';
    if (TOP_TOKENS.some((token)=>text.includes(token))) return 'top';
    if (BOTTOM_TOKENS.some((token)=>text.includes(token))) return 'bottom';
    if (SHOE_TOKENS.some((token)=>text.includes(token))) return 'shoes';
    return 'accessory';
}
function classifyGarmentGender(input) {
    const gender = String(input.gender ?? '').toLowerCase().trim();
    const text = `${gender} ${input.name ?? ''}`.toLowerCase();
    if (FEMALE_GENDER_TOKENS.some((token)=>containsBoundedToken(text, token))) return 'female';
    if (MALE_GENDER_TOKENS.some((token)=>containsBoundedToken(text, token))) return 'male';
    return 'unisex';
}
}),
"[project]/app/lib/fashion-ai/repositories/WardrobeRepository.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "WardrobeRepository",
    ()=>WardrobeRepository
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebaseAdmin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/firebaseAdmin.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$firestore__$5b$external$5d$__$28$firebase$2d$admin$2f$firestore$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$firebase$2d$admin$29$__ = __turbopack_context__.i("[externals]/firebase-admin/firestore [external] (firebase-admin/firestore, esm_import, [project]/node_modules/firebase-admin)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebaseAdmin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$firestore__$5b$external$5d$__$28$firebase$2d$admin$2f$firestore$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$firebase$2d$admin$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebaseAdmin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$firestore__$5b$external$5d$__$28$firebase$2d$admin$2f$firestore$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$firebase$2d$admin$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
const COLLECTION = 'sai-wardrobeItems';
class WardrobeRepository {
    mapDoc(doc) {
        const data = doc.data();
        return {
            id: doc.id,
            name: String(data.name ?? ''),
            image_url: String(data.image_url ?? ''),
            piece_type: typeof data.piece_type === 'string' ? data.piece_type : undefined,
            gender: typeof data.gender === 'string' ? data.gender : undefined,
            createdAt: typeof data.created_at === 'string' ? data.created_at : undefined,
            updatedAt: typeof data.updated_at === 'string' ? data.updated_at : undefined,
            fitProfile: data.fitProfile ?? undefined
        };
    }
    async listAll(maxItems = 100) {
        const safeLimit = Math.max(1, Math.floor(maxItems));
        const snap = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebaseAdmin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getAdminFirestore"])().collection(COLLECTION).orderBy('createdAt', 'desc').limit(safeLimit).get();
        return snap.docs.map((doc)=>this.mapDoc(doc));
    }
    async listPage(params) {
        const pageSize = Math.max(1, Math.floor(params?.limit ?? 100));
        const db = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebaseAdmin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getAdminFirestore"])();
        let query = db.collection(COLLECTION).orderBy(__TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$firestore__$5b$external$5d$__$28$firebase$2d$admin$2f$firestore$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$firebase$2d$admin$29$__["FieldPath"].documentId()).limit(pageSize);
        if (params?.startAfterId) {
            query = query.startAfter(params.startAfterId);
        }
        const snap = await query.get();
        return snap.docs.map((doc)=>this.mapDoc(doc));
    }
    async getById(pieceId) {
        const snap = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebaseAdmin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getAdminFirestore"])().collection(COLLECTION).doc(pieceId).get();
        if (!snap.exists) return null;
        const data = snap.data();
        return {
            id: snap.id,
            name: String(data.name ?? ''),
            image_url: String(data.image_url ?? ''),
            piece_type: typeof data.piece_type === 'string' ? data.piece_type : undefined,
            gender: typeof data.gender === 'string' ? data.gender : undefined,
            createdAt: typeof data.created_at === 'string' ? data.created_at : undefined,
            updatedAt: typeof data.updated_at === 'string' ? data.updated_at : undefined,
            fitProfile: data.fitProfile ?? undefined
        };
    }
    async updateFitProfile(pieceId, fitProfile, debugMeta) {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebaseAdmin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getAdminFirestore"])().collection(COLLECTION).doc(pieceId).set({
            fitProfile,
            ...debugMeta ?? {},
            updated_at: new Date().toISOString()
        }, {
            merge: true
        });
    }
    async markPending(pieceId, imageUrl, pieceType, gender) {
        const now = new Date().toISOString();
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebaseAdmin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getAdminFirestore"])().collection(COLLECTION).doc(pieceId).set({
            fitProfile: {
                pieceType: pieceType,
                targetGender: gender || 'unisex',
                preparationStatus: 'pending',
                originalImageUrl: imageUrl,
                compatibleMannequins: [
                    'male_v1',
                    'female_v1'
                ],
                fitMode: 'overlay',
                validationWarnings: [],
                preparationError: null,
                preparedAt: null,
                updatedAt: now
            },
            updated_at: now
        }, {
            merge: true
        });
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/app/lib/fashion-ai/utils/garment-anchors.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "estimateGarmentAnchors",
    ()=>estimateGarmentAnchors
]);
function estimateGarmentAnchors(pieceType) {
    if (pieceType === 'top') {
        return {
            neckCenter: {
                x: 0.5,
                y: 0.12
            },
            shoulderLeft: {
                x: 0.24,
                y: 0.18
            },
            shoulderRight: {
                x: 0.76,
                y: 0.18
            },
            waistLeft: {
                x: 0.3,
                y: 0.68
            },
            waistRight: {
                x: 0.7,
                y: 0.68
            },
            hemCenter: {
                x: 0.5,
                y: 0.82
            }
        };
    }
    if (pieceType === 'bottom') {
        return {
            waistLeft: {
                x: 0.34,
                y: 0.12
            },
            waistRight: {
                x: 0.66,
                y: 0.12
            },
            hemCenter: {
                x: 0.5,
                y: 0.88
            }
        };
    }
    return null;
}
}),
"[project]/app/lib/fashion-ai/services/WardrobeImagePreparationService.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "WardrobeImagePreparationService",
    ()=>WardrobeImagePreparationService,
    "WardrobePreparationError",
    ()=>WardrobePreparationError
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$fashion$2d$ai$2f$repositories$2f$WardrobeRepository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/fashion-ai/repositories/WardrobeRepository.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$fashion$2d$ai$2f$utils$2f$garment$2d$anchors$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/fashion-ai/utils/garment-anchors.ts [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$fashion$2d$ai$2f$repositories$2f$WardrobeRepository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$fashion$2d$ai$2f$repositories$2f$WardrobeRepository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
const PROCESSING_VERSION = 'mvp-fitprofile-v1';
const MALE_GENDER_TOKENS = [
    'male',
    'masculino',
    'man',
    'men',
    'masc'
];
const FEMALE_GENDER_TOKENS = [
    'female',
    'feminino',
    'woman',
    'women',
    'fem'
];
function escapeRegexToken(token) {
    return token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
function containsBoundedToken(text, token) {
    return new RegExp(`(^|[^a-z])${escapeRegexToken(token)}([^a-z]|$)`, 'i').test(text);
}
class WardrobePreparationError extends Error {
    code;
    status;
    constructor(message, code, status){
        super(message), this.code = code, this.status = status;
    }
}
class WardrobeImagePreparationService {
    wardrobeRepository;
    constructor(wardrobeRepository = new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$fashion$2d$ai$2f$repositories$2f$WardrobeRepository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["WardrobeRepository"]()){
        this.wardrobeRepository = wardrobeRepository;
    }
    async preparePieceForTester2D(pieceId) {
        console.info('[process-piece] loading wardrobe item', {
            pieceId
        });
        const piece = await this.wardrobeRepository.getById(pieceId);
        if (!piece) {
            throw new WardrobePreparationError('Wardrobe item not found.', 'WARDROBE_ITEM_NOT_FOUND', 404);
        }
        console.info('[process-piece] wardrobe item found', {
            pieceId,
            name: piece.name,
            hasImageUrl: Boolean(piece.image_url?.trim()),
            previousFitProfileStatus: piece.fitProfile?.preparationStatus ?? 'missing'
        });
        const imageUrl = piece.image_url?.trim();
        if (!imageUrl) {
            throw new WardrobePreparationError('Wardrobe item image_url is missing.', 'IMAGE_URL_MISSING', 400);
        }
        console.info('[process-piece] inferring pieceType', {
            pieceId,
            name: piece.name,
            piece_type: piece.piece_type ?? null
        });
        const inferredPieceType = this.inferPieceTypeFromWardrobeItem(piece);
        console.info('[process-piece] inferring targetGender', {
            pieceId,
            name: piece.name,
            gender: piece.gender ?? null
        });
        const inferredTargetGender = this.inferTargetGenderFromWardrobeItem(piece);
        const compatibleMannequins = this.resolveCompatibleMannequins(inferredTargetGender);
        const warnings = [];
        let preparationStatus = 'ready';
        if (!this.looksLikeUsableImageUrl(imageUrl)) {
            preparationStatus = 'failed';
            warnings.push('image_url_not_http_like');
        }
        console.info('[process-piece] building fitProfile', {
            pieceId,
            inferredPieceType,
            inferredTargetGender,
            newStatus: preparationStatus
        });
        const fitProfile = {
            pieceType: inferredPieceType,
            targetGender: inferredTargetGender,
            preparationStatus,
            originalImageUrl: imageUrl,
            // TODO: replace with transparent processed garment asset URL from segmentation/isolation pipeline.
            preparedAssetUrl: preparationStatus === 'ready' ? imageUrl : null,
            // TODO: replace with real generated mask URL when segmentation is available.
            preparedMaskUrl: null,
            compatibleMannequins,
            fitMode: 'masked-overlay',
            normalizedBBox: this.buildDefaultNormalizedBBox(inferredPieceType),
            garmentAnchors: this.buildDefaultGarmentAnchors(inferredPieceType),
            validationWarnings: warnings,
            preparationError: preparationStatus === 'failed' ? 'MVP processing rejected image_url format.' : null,
            preparedAt: preparationStatus === 'ready' ? new Date().toISOString() : null,
            updatedAt: new Date().toISOString()
        };
        console.info('[process-piece] saving fitProfile', {
            pieceId,
            oldStatus: piece.fitProfile?.preparationStatus ?? 'missing',
            newStatus: fitProfile.preparationStatus,
            inferredPieceType,
            inferredTargetGender
        });
        await this.wardrobeRepository.updateFitProfile(pieceId, fitProfile, {
            lastProcessingAttemptAt: new Date().toISOString(),
            lastProcessingSource: 'api/wardrobe/process-piece',
            lastProcessingVersion: PROCESSING_VERSION
        });
        const debug = {
            pieceId,
            wardrobeItemFound: true,
            imageUrlFound: true,
            inferredPieceType,
            inferredTargetGender,
            previousFitProfileStatus: piece.fitProfile?.preparationStatus ?? 'missing',
            newPreparationStatus: fitProfile.preparationStatus,
            compatibleMannequins,
            warnings
        };
        return {
            fitProfile,
            debug
        };
    }
    async processPieceForTester2D(pieceId) {
        const result = await this.preparePieceForTester2D(pieceId);
        return result.fitProfile;
    }
    inferPieceTypeFromWardrobeItem(piece) {
        const pieceTypeText = String(piece.piece_type ?? '').toLowerCase();
        const nameText = String(piece.name ?? '').toLowerCase();
        const text = `${pieceTypeText} ${nameText}`;
        if (text.includes('full') || text.includes('dress') || text.includes('jumpsuit')) return 'full_body';
        if (text.includes('shoe') || text.includes('sneaker') || text.includes('boot')) return 'shoes';
        if (text.includes('bottom') || text.includes('lower') || text.includes('pant') || text.includes('short') || text.includes('calça')) return 'bottom';
        if (text.includes('accessory') || text.includes('bag') || text.includes('belt') || text.includes('hat')) return 'accessory';
        if (text.includes('top') || text.includes('upper') || text.includes('shirt') || text.includes('camisa')) return 'top';
        return 'top';
    }
    inferTargetGenderFromWardrobeItem(piece) {
        const genderText = String(piece.gender ?? '').toLowerCase();
        if (FEMALE_GENDER_TOKENS.some((token)=>containsBoundedToken(genderText, token))) return 'female';
        if (MALE_GENDER_TOKENS.some((token)=>containsBoundedToken(genderText, token))) return 'male';
        const nameText = String(piece.name ?? '').toLowerCase();
        if (FEMALE_GENDER_TOKENS.some((token)=>containsBoundedToken(nameText, token))) return 'female';
        if (MALE_GENDER_TOKENS.some((token)=>containsBoundedToken(nameText, token))) return 'male';
        return 'unisex';
    }
    buildDefaultNormalizedBBox(pieceType) {
        // Values describe where the garment content sits within the garment product image (0–1),
        // not where it appears on the body. Typical e-commerce product photos center the garment
        // as the primary subject with ~10% padding on each side.
        if (pieceType === 'top') return {
            x: 0.10,
            y: 0.08,
            w: 0.80,
            h: 0.84
        };
        if (pieceType === 'bottom') return {
            x: 0.12,
            y: 0.06,
            w: 0.76,
            h: 0.88
        };
        if (pieceType === 'shoes') return {
            x: 0.10,
            y: 0.10,
            w: 0.80,
            h: 0.80
        };
        if (pieceType === 'full_body') return {
            x: 0.10,
            y: 0.04,
            w: 0.80,
            h: 0.92
        };
        return {
            x: 0.15,
            y: 0.12,
            w: 0.70,
            h: 0.76
        };
    }
    buildDefaultGarmentAnchors(pieceType) {
        if (pieceType === 'top') return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$fashion$2d$ai$2f$utils$2f$garment$2d$anchors$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["estimateGarmentAnchors"])('top');
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$fashion$2d$ai$2f$utils$2f$garment$2d$anchors$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["estimateGarmentAnchors"])(pieceType);
    }
    resolveCompatibleMannequins(targetGender) {
        if (targetGender === 'male') return [
            'male_v1'
        ];
        if (targetGender === 'female') return [
            'female_v1'
        ];
        return [
            'male_v1',
            'female_v1'
        ];
    }
    looksLikeUsableImageUrl(value) {
        return /^https?:\/\//.test(value) || value.startsWith('/');
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/app/backend/services/modelPipelineDiagnostics.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "buildPipelineInputSnapshot",
    ()=>buildPipelineInputSnapshot,
    "canonicalizeBrandId",
    ()=>canonicalizeBrandId,
    "withStageHistory",
    ()=>withStageHistory
]);
function canonicalizeBrandId(value) {
    const normalized = String(value ?? '').trim().toLowerCase();
    if (!normalized) return 'default';
    if (normalized === 'lacoste' || normalized === 'brand_lacoste') return 'lacoste';
    return normalized.replace(/^brand_/, '');
}
function buildPipelineInputSnapshot(item) {
    const fitProfile = item.fitProfile && typeof item.fitProfile === 'object' ? item.fitProfile : null;
    return {
        pieceId: String(item.wardrobe_item_id ?? ''),
        name: String(item.name ?? ''),
        userId: String(item.user_id ?? ''),
        imageUrlPresent: Boolean(String(item.image_url ?? '').trim()),
        preparedAssetUrlPresent: Boolean(String(fitProfile?.preparedAssetUrl ?? '').trim()),
        brandId: String(item.brand_id ?? ''),
        brandIdDetected: fitProfile ? String(item.brand_id_detected ?? '').trim() || null : null,
        brandIdSelected: String(item.brand_id_selected ?? '').trim() || null,
        preparationStatus: String(fitProfile?.preparationStatus ?? 'missing'),
        hasFitProfile: Boolean(fitProfile),
        hasGarmentAnchors: Boolean(fitProfile?.garmentAnchors),
        hasNormalizedBBox: Boolean(fitProfile?.normalizedBBox),
        geometryScopePassed: Boolean(item.geometry_scope_passed)
    };
}
function withStageHistory(current, next) {
    if (!current || typeof current !== 'object') return {
        ...next
    };
    const prev = current;
    const prevHistory = Array.isArray(prev.history) ? prev.history : [];
    return {
        ...next,
        history: [
            ...prevHistory,
            {
                ...prev,
                archivedAt: new Date().toISOString()
            }
        ]
    };
}
}),
"[project]/app/backend/services/WardrobeService.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "WardrobeService",
    ()=>WardrobeService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$repositories$2f$WardrobeItemsRepository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/backend/repositories/WardrobeItemsRepository.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$services$2f$errors$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/backend/services/errors.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$services$2f$BrandDetectionService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/backend/services/BrandDetectionService.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$services$2f$BrandPlacementService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/backend/services/BrandPlacementService.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$services$2f$PieceIsolationService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/backend/services/PieceIsolationService.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$services$2f$GeometryScopeService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/backend/services/GeometryScopeService.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$services$2f$MeshyService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/backend/services/MeshyService.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$repositories$2f$BrandsRepository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/backend/repositories/BrandsRepository.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$repositories$2f$PipelineJobsRepository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/backend/repositories/PipelineJobsRepository.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$services$2f$BlenderPipelineService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/backend/services/BlenderPipelineService.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$services$2f$BlenderCloudService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/backend/services/BlenderCloudService.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$fashion$2d$ai$2f$utils$2f$garment$2d$classification$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/fashion-ai/utils/garment-classification.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$fashion$2d$ai$2f$services$2f$WardrobeImagePreparationService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/fashion-ai/services/WardrobeImagePreparationService.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$services$2f$modelPipelineDiagnostics$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/backend/services/modelPipelineDiagnostics.ts [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$repositories$2f$WardrobeItemsRepository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$services$2f$BrandDetectionService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$services$2f$BrandPlacementService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$repositories$2f$BrandsRepository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$repositories$2f$PipelineJobsRepository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$services$2f$BlenderPipelineService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$fashion$2d$ai$2f$services$2f$WardrobeImagePreparationService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$repositories$2f$WardrobeItemsRepository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$services$2f$BrandDetectionService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$services$2f$BrandPlacementService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$repositories$2f$BrandsRepository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$repositories$2f$PipelineJobsRepository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$services$2f$BlenderPipelineService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$fashion$2d$ai$2f$services$2f$WardrobeImagePreparationService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
const DEFAULT_BRAND_ID = 'default';
const BRANDING_PASS_VERSION = 'v2-image-first';
const SEGMENTATION_MIN_CONFIDENCE = Number(process.env.SEGMENTATION_MIN_CONFIDENCE ?? 0.75);
const MODEL_GENERATION_MAX_POLLS = Number(process.env.BLENDER_MODEL_MAX_POLLS ?? 48);
const MODEL_GENERATION_POLL_MS = Number(process.env.BLENDER_MODEL_POLL_MS ?? 1500);
const MODEL_GENERATION_JOB_TYPE = (process.env.BLENDER_MODEL_JOB_TYPE ?? 'image_to_garment').trim() || 'image_to_garment';
const BRAND_REVIEW_REQUIRED = String(process.env.BRAND_REVIEW_REQUIRED ?? 'false').trim().toLowerCase() === 'true';
class WardrobeService {
    wardrobeRepo;
    blenderCloudService;
    meshyService;
    brandDetectionService;
    brandPlacementService;
    pieceIsolationService;
    geometryScopeService;
    brandsRepository;
    pipelineJobsRepository;
    blenderPipelineService;
    preparationService;
    constructor(wardrobeRepo = new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$repositories$2f$WardrobeItemsRepository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["WardrobeItemsRepository"](), blenderCloudService = new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$services$2f$BlenderCloudService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BlenderCloudService"](), meshyService = new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$services$2f$MeshyService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["MeshyService"](), brandDetectionService = new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$services$2f$BrandDetectionService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BrandDetectionService"](), brandPlacementService = new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$services$2f$BrandPlacementService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BrandPlacementService"](), pieceIsolationService = new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$services$2f$PieceIsolationService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PieceIsolationService"](), geometryScopeService = new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$services$2f$GeometryScopeService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["GeometryScopeService"](), brandsRepository = new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$repositories$2f$BrandsRepository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BrandsRepository"](), pipelineJobsRepository = new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$repositories$2f$PipelineJobsRepository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PipelineJobsRepository"](), blenderPipelineService = new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$services$2f$BlenderPipelineService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BlenderPipelineService"](), preparationService = new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$fashion$2d$ai$2f$services$2f$WardrobeImagePreparationService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["WardrobeImagePreparationService"]()){
        this.wardrobeRepo = wardrobeRepo;
        this.blenderCloudService = blenderCloudService;
        this.meshyService = meshyService;
        this.brandDetectionService = brandDetectionService;
        this.brandPlacementService = brandPlacementService;
        this.pieceIsolationService = pieceIsolationService;
        this.geometryScopeService = geometryScopeService;
        this.brandsRepository = brandsRepository;
        this.pipelineJobsRepository = pipelineJobsRepository;
        this.blenderPipelineService = blenderPipelineService;
        this.preparationService = preparationService;
    }
    async listUserWardrobe(userId, options) {
        await this.syncActiveUvJobs(userId);
        return this.wardrobeRepo.findByUser(userId, options);
    }
    async syncActiveUvJobs(userId) {
        try {
            const activeJobs = await this.pipelineJobsRepository.findActiveByUser(userId);
            await Promise.all(activeJobs.map((job)=>this.blenderPipelineService.syncBlenderCloudJob(job.pipeline_job_id)));
        } catch (error) {
            console.warn('[wardrobe-service] failed to sync active UV jobs', {
                userId,
                error
            });
        }
    }
    async getWardrobeAnalysis(userId) {
        return this.wardrobeRepo.getAnalysisByUser(userId);
    }
    async listDiscoverablePieces(filters) {
        return this.wardrobeRepo.findDiscoverable(filters);
    }
    async createWardrobeItem(input) {
        const user_id = String(input.user_id ?? '').trim();
        const name = String(input.name ?? '').trim();
        const image_url = String(input.image_url ?? '').trim();
        const piece_type = String(input.piece_type ?? '').trim();
        const gender = String(input.gender ?? '').trim() || 'unspecified';
        const market_id = String(input.market_id ?? '').trim();
        if (!user_id || !name || !image_url || !piece_type || !market_id) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$services$2f$errors$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ServiceError"]('Missing required fields to create wardrobe item.', 400);
        }
        const selectedBrandIdRaw = String(input.brand_id ?? DEFAULT_BRAND_ID).trim() || DEFAULT_BRAND_ID;
        const selectedBrandId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$services$2f$modelPipelineDiagnostics$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["canonicalizeBrandId"])(selectedBrandIdRaw);
        const fitPieceType = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$fashion$2d$ai$2f$utils$2f$garment$2d$classification$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["classifyGarmentType"])({
            pieceType: piece_type,
            name
        });
        const fitGender = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$fashion$2d$ai$2f$utils$2f$garment$2d$classification$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["classifyGarmentGender"])({
            gender,
            name
        });
        const compatibleMannequins = fitGender === 'male' ? [
            'male_v1'
        ] : fitGender === 'female' ? [
            'female_v1'
        ] : [
            'male_v1',
            'female_v1'
        ];
        const detection = await this.brandDetectionService.detect({
            selectedBrandId,
            name,
            imageUrl: image_url
        });
        const resolvedBrandId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$services$2f$modelPipelineDiagnostics$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["canonicalizeBrandId"])(detection.brand_id_detected ?? selectedBrandId);
        const hasReliableBrandMatch = Boolean(detection.brand_id_detected);
        const needsBrandReview = BRAND_REVIEW_REQUIRED && !hasReliableBrandMatch && selectedBrandId === DEFAULT_BRAND_ID;
        const createdItem = await this.wardrobeRepo.create({
            user_id,
            name,
            image_url,
            model_3d_url: null,
            model_preview_url: null,
            model_base_3d_url: null,
            model_branded_3d_url: null,
            isolated_piece_image_url: null,
            segmentation_confidence: null,
            geometry_scope_passed: false,
            geometry_scope_score: null,
            generation_attempt_count: 0,
            pipeline_stage_details: hasReliableBrandMatch ? null : {
                stage: needsBrandReview ? 'needs_brand_review' : 'queued_segmentation',
                brand_detection_warning: detection.detection_explanation
            },
            model_status: needsBrandReview ? 'needs_brand_review' : 'queued_segmentation',
            model_generation_error: needsBrandReview ? detection.detection_explanation : null,
            piece_type,
            gender,
            market_id,
            brand_id: resolvedBrandId,
            brand_id_selected: selectedBrandIdRaw,
            brand_id_detected: detection.brand_id_detected ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$services$2f$modelPipelineDiagnostics$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["canonicalizeBrandId"])(detection.brand_id_detected) : null,
            brand_detection_confidence: detection.brand_detection_confidence,
            brand_detection_source: detection.brand_detection_source,
            brand_applied: false,
            placement_profile_id: null,
            branding_pass_version: null,
            color: String(input.color ?? '').trim() || 'unspecified',
            material: String(input.material ?? '').trim() || 'unspecified',
            style_tags: Array.isArray(input.style_tags) ? input.style_tags.map((tag)=>String(tag)) : [],
            occasion_tags: Array.isArray(input.occasion_tags) ? input.occasion_tags.map((tag)=>String(tag)) : [],
            fitProfile: {
                pieceType: fitPieceType,
                targetGender: fitGender,
                preparationStatus: 'pending',
                originalImageUrl: image_url,
                preparedAssetUrl: null,
                preparedMaskUrl: null,
                compatibleMannequins,
                fitMode: 'overlay',
                normalizedBBox: null,
                garmentAnchors: null,
                validationWarnings: [],
                preparationError: null,
                preparedAt: null,
                updatedAt: new Date().toISOString()
            }
        });
        if (!needsBrandReview) {
            await this.enrichWardrobeItemModel({
                wardrobeItemId: createdItem.wardrobe_item_id,
                imageUrl: image_url,
                pieceType: piece_type,
                brandId: resolvedBrandId
            });
        }
        return createdItem;
    }
    async enrichWardrobeItemModel(input) {
        try {
            // Ensure 2D preparation runs before we check readiness so the piece is
            // never rejected simply because it was just created with status "pending".
            await this.preparationService.preparePieceForTester2D(input.wardrobeItemId);
            const sourceItem = await this.wardrobeRepo.findById(input.wardrobeItemId);
            const fitProfile = sourceItem?.fitProfile && typeof sourceItem.fitProfile === 'object' ? sourceItem.fitProfile : null;
            const hasImageUrl = Boolean(String(sourceItem?.image_url ?? '').trim());
            const preparationStatus = String(fitProfile?.preparationStatus ?? 'missing');
            const hasPreparedAsset = Boolean(String(fitProfile?.preparedAssetUrl ?? '').trim()) || hasImageUrl;
            const hasFitProfile = Boolean(fitProfile);
            const hasGarmentAnchors = Boolean(fitProfile?.garmentAnchors);
            const hasNormalizedBBox = Boolean(fitProfile?.normalizedBBox);
            const requiresAnchors = [
                'upper_piece',
                'top'
            ].includes(String(sourceItem?.piece_type ?? '').toLowerCase());
            if (!hasImageUrl || preparationStatus !== 'ready' || !hasPreparedAsset || !hasFitProfile || !hasNormalizedBBox || requiresAnchors && !hasGarmentAnchors) {
                await this.wardrobeRepo.updatePipelineStatus(input.wardrobeItemId, 'needs_preparation', 'Piece is not ready for 3D generation.', (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$services$2f$modelPipelineDiagnostics$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["withStageHistory"])(sourceItem?.pipeline_stage_details, {
                    stage: 'failed',
                    failedStage: 'preparation_not_ready',
                    provider: 'local',
                    errorCode: 'PREPARATION_NOT_READY',
                    message: '2D preparation and fit profile preconditions are not satisfied.',
                    hint: 'Run 2D preparation before retrying 3D generation.',
                    retryable: true,
                    nextAction: 'POST /api/wardrobe/process-piece',
                    requestUrl: null,
                    responseStatus: null,
                    responseBodyPreview: null,
                    inputSnapshot: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$services$2f$modelPipelineDiagnostics$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["buildPipelineInputSnapshot"])(sourceItem ?? {})
                }));
                return;
            }
            await this.wardrobeRepo.updatePipelineStatus(input.wardrobeItemId, 'queued_segmentation');
            const isolation = await this.pieceIsolationService.isolate({
                imageUrl: input.imageUrl,
                pieceType: input.pieceType
            });
            await this.wardrobeRepo.updatePipelineStatus(input.wardrobeItemId, 'segmentation_done', null, {
                stage: 'segmentation_done',
                ...isolation.stageDetails
            });
            if (isolation.segmentationConfidence < SEGMENTATION_MIN_CONFIDENCE) {
                await this.wardrobeRepo.updatePipelineStatus(input.wardrobeItemId, 'needs_brand_review', `Segmentation confidence ${isolation.segmentationConfidence.toFixed(2)} below threshold ${SEGMENTATION_MIN_CONFIDENCE.toFixed(2)}.`, {
                    stage: 'segmentation_rejected',
                    segmentation_confidence: isolation.segmentationConfidence
                });
                return;
            }
            await this.wardrobeRepo.updatePipelineStatus(input.wardrobeItemId, 'queued_base', null, {
                stage: 'queued_base'
            });
            const basePrompt = `Create a single ${input.pieceType} standalone asset only. Exclude person body, mannequin, full outfit, and scene props.`;
            const baseModel = await this.generateModelFromImage(isolation.isolatedImageUrl, {
                prompt: basePrompt,
                pieceType: input.pieceType,
                wardrobeItemId: input.wardrobeItemId,
                status: 'generating_base',
                attemptIncrement: 1,
                stageLabel: 'base_generation'
            });
            await this.wardrobeRepo.updatePipelineStatus(input.wardrobeItemId, 'base_done');
            const shouldSkipBrandingPipeline = await this.shouldSkipBrandingPipeline(input.brandId);
            if (shouldSkipBrandingPipeline) {
                const meshyFallback = !this.blenderCloudService.isConfigured();
                await this.wardrobeRepo.updateModelAssets(input.wardrobeItemId, {
                    model_3d_url: baseModel.model_3d_url,
                    model_preview_url: baseModel.model_preview_url,
                    model_base_3d_url: baseModel.model_3d_url,
                    model_branded_3d_url: null,
                    isolated_piece_image_url: isolation.isolatedImageUrl,
                    segmentation_confidence: isolation.segmentationConfidence,
                    geometry_scope_passed: true,
                    geometry_scope_score: null,
                    generation_attempt_count: 1,
                    pipeline_stage_details: {
                        stage: 'done_branding_skipped',
                        reason: meshyFallback ? 'RunPod not configured; branding pass skipped for Meshy fallback.' : 'Brand is Zara; logo placement pass intentionally skipped.',
                        segmentation: isolation.stageDetails
                    },
                    placement_profile_id: null,
                    brand_applied: false,
                    branding_pass_version: meshyFallback ? 'skipped-meshy-fallback' : 'skipped-zara'
                });
                this.logPipelineMetrics(input.wardrobeItemId, input.pieceType, true, isolation.segmentationConfidence, 1);
                return;
            }
            await this.wardrobeRepo.updatePipelineStatus(input.wardrobeItemId, 'queued_branding');
            const placementProfile = await this.brandPlacementService.getPlacementProfile({
                brandId: input.brandId,
                pieceType: input.pieceType
            });
            const brandingPrompt = `Create a single ${input.pieceType} standalone asset only with no person body. Use detected brand ${input.brandId} logo only. Place at ${placementProfile.anchor} profile ${placementProfile.profile_id} scale ${placementProfile.scale}.`;
            const brandedModel = await this.generateModelFromImage(isolation.isolatedImageUrl, {
                prompt: brandingPrompt,
                pieceType: input.pieceType,
                wardrobeItemId: input.wardrobeItemId,
                status: 'branding_in_progress',
                attemptIncrement: 0,
                stageLabel: 'branding_generation'
            });
            const qaResult = this.qualityChecksPass({
                baseModelUrl: baseModel.model_3d_url,
                brandedModelUrl: brandedModel.model_3d_url,
                fitProfile,
                brandIdRaw: String(sourceItem?.brand_id ?? ''),
                brandIdSelectedRaw: String(sourceItem?.brand_id_selected ?? ''),
                placementProfileId: placementProfile.profile_id
            });
            if (!qaResult.passed) {
                throw Object.assign(new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$services$2f$errors$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ServiceError"](qaResult.message, 502), {
                    pipelineFailure: {
                        failedStage: qaResult.failedStage,
                        provider: 'branding',
                        errorCode: qaResult.errorCode,
                        hint: qaResult.hint,
                        retryable: qaResult.retryable,
                        diagnostics: qaResult.details
                    }
                });
            }
            await this.wardrobeRepo.updatePipelineStatus(input.wardrobeItemId, 'queued_geometry_qa');
            const geometryScope = await this.validateGeometryScopeWithFallback({
                wardrobeItemId: input.wardrobeItemId,
                modelUrl: brandedModel.model_3d_url,
                pieceType: input.pieceType
            });
            if (!geometryScope.passed) {
                const shouldRetry = geometryScope.scopeScore >= 0.35;
                if (shouldRetry) {
                    await this.wardrobeRepo.updatePipelineStatus(input.wardrobeItemId, 'retrying_generation', `Geometry scope failed first pass: ${geometryScope.reasons.join(' | ')}`, {
                        stage: 'geometry_scope_retry',
                        reasons: geometryScope.reasons,
                        scopeScore: geometryScope.scopeScore
                    });
                    const retryModel = await this.generateModelFromImage(isolation.isolatedImageUrl, {
                        prompt: `${brandingPrompt} Strictly output only the garment mesh with no humanoid rig.`,
                        pieceType: input.pieceType,
                        wardrobeItemId: input.wardrobeItemId,
                        status: 'retrying_generation',
                        attemptIncrement: 1,
                        stageLabel: 'retry_generation'
                    });
                    const retryScope = await this.validateGeometryScopeWithFallback({
                        wardrobeItemId: input.wardrobeItemId,
                        modelUrl: retryModel.model_3d_url,
                        pieceType: input.pieceType
                    });
                    if (!retryScope.passed) {
                        await this.wardrobeRepo.updatePipelineStatus(input.wardrobeItemId, 'failed_geometry_scope', retryScope.reasons.join(' | '), {
                            stage: 'geometry_scope_failed_after_retry',
                            reasons: retryScope.reasons,
                            scopeScore: retryScope.scopeScore
                        });
                        return;
                    }
                    await this.wardrobeRepo.updateModelAssets(input.wardrobeItemId, {
                        model_3d_url: retryModel.model_3d_url,
                        model_preview_url: retryModel.model_preview_url ?? baseModel.model_preview_url,
                        model_base_3d_url: baseModel.model_3d_url,
                        model_branded_3d_url: retryModel.model_3d_url,
                        isolated_piece_image_url: isolation.isolatedImageUrl,
                        segmentation_confidence: isolation.segmentationConfidence,
                        geometry_scope_passed: true,
                        geometry_scope_score: retryScope.scopeScore,
                        generation_attempt_count: 2,
                        pipeline_stage_details: {
                            stage: 'done_after_retry',
                            segmentation: isolation.stageDetails,
                            geometry: retryScope.reasons
                        },
                        placement_profile_id: placementProfile.profile_id,
                        brand_applied: true,
                        branding_pass_version: BRANDING_PASS_VERSION
                    });
                    this.logPipelineMetrics(input.wardrobeItemId, input.pieceType, true, isolation.segmentationConfidence, retryScope.scopeScore);
                    return;
                }
                await this.wardrobeRepo.updatePipelineStatus(input.wardrobeItemId, 'failed_geometry_scope', geometryScope.reasons.join(' | '), {
                    stage: 'geometry_scope_failed',
                    reasons: geometryScope.reasons,
                    scopeScore: geometryScope.scopeScore
                });
                this.logPipelineMetrics(input.wardrobeItemId, input.pieceType, false, isolation.segmentationConfidence, geometryScope.scopeScore);
                return;
            }
            await this.wardrobeRepo.updateModelAssets(input.wardrobeItemId, {
                model_3d_url: brandedModel.model_3d_url,
                model_preview_url: brandedModel.model_preview_url ?? baseModel.model_preview_url,
                model_base_3d_url: baseModel.model_3d_url,
                model_branded_3d_url: brandedModel.model_3d_url,
                isolated_piece_image_url: isolation.isolatedImageUrl,
                segmentation_confidence: isolation.segmentationConfidence,
                geometry_scope_passed: true,
                geometry_scope_score: geometryScope.scopeScore,
                generation_attempt_count: 1,
                pipeline_stage_details: {
                    stage: 'done',
                    segmentation: isolation.stageDetails,
                    geometry: geometryScope.reasons
                },
                placement_profile_id: placementProfile.profile_id,
                brand_applied: true,
                branding_pass_version: BRANDING_PASS_VERSION
            });
            this.logPipelineMetrics(input.wardrobeItemId, input.pieceType, true, isolation.segmentationConfidence, geometryScope.scopeScore);
        } catch (error) {
            const item = await this.wardrobeRepo.findById(input.wardrobeItemId);
            const failureMeta = error?.pipelineFailure ?? {};
            const failedStage = String(failureMeta.failedStage ?? 'unknown_failure');
            const provider = String(failureMeta.provider ?? 'local');
            const errorCode = String(failureMeta.errorCode ?? 'PIPELINE_FAILED');
            const hint = String(failureMeta.hint ?? 'Inspect pipeline_stage_details and retry the suggested next action.');
            const retryable = Boolean(failureMeta.retryable ?? true);
            const diagnostics = failureMeta.diagnostics ?? {};
            await this.wardrobeRepo.updatePipelineStatus(input.wardrobeItemId, 'failed', error instanceof Error ? error.message : 'Unknown model pipeline failure.', (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$services$2f$modelPipelineDiagnostics$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["withStageHistory"])(item?.pipeline_stage_details, {
                stage: 'failed',
                failedStage,
                provider: provider,
                errorCode,
                message: error instanceof Error ? error.message : 'Unknown model pipeline failure.',
                hint,
                retryable,
                requestUrl: diagnostics.requestUrl ? String(diagnostics.requestUrl) : null,
                responseStatus: typeof diagnostics.responseStatus === 'number' ? diagnostics.responseStatus : null,
                responseBodyPreview: diagnostics.responseBodyPreview ? String(diagnostics.responseBodyPreview) : null,
                inputSnapshot: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$services$2f$modelPipelineDiagnostics$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["buildPipelineInputSnapshot"])(item ?? {}),
                diagnostics
            }));
            console.error('[wardrobe-model-pipeline] pipeline failed', {
                wardrobe_item_id: input.wardrobeItemId,
                error: error instanceof Error ? error.message : String(error)
            });
        }
    }
    async retry3DGeneration(wardrobeItemId) {
        const item = await this.wardrobeRepo.findById(wardrobeItemId);
        if (!item) throw new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$services$2f$errors$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ServiceError"]('Wardrobe item not found.', 404);
        const currentStageDetails = item.pipeline_stage_details ?? null;
        const failedStage = String(currentStageDetails?.failedStage ?? '');
        const nextAttempt = (Number(item.generation_attempt_count ?? 0) || 0) + 1;
        await this.wardrobeRepo.updateGenerationAttempt(wardrobeItemId, nextAttempt);
        if (failedStage === 'preparation_not_ready' || item.model_status === 'needs_preparation') {
            await this.preparationService.preparePieceForTester2D(wardrobeItemId);
        }
        if (failedStage === 'runpod_route_mismatch') {
            const diagnostics = await this.blenderCloudService.getDiagnostics().catch((error)=>({
                    diagnosticsError: error instanceof Error ? error.message : String(error)
                }));
            await this.wardrobeRepo.updatePipelineStatus(wardrobeItemId, 'failed', typeof item.model_generation_error === 'string' ? item.model_generation_error : null, (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$services$2f$modelPipelineDiagnostics$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["withStageHistory"])(currentStageDetails, {
                stage: 'failed',
                failedStage: 'runpod_route_mismatch',
                provider: 'runpod',
                errorCode: 'RUNPOD_ROUTE_MISMATCH',
                message: 'RunPod route diagnostics captured before retry.',
                hint: 'Confirm BLENDER_CLOUD_SUBMIT_PATH or worker route configuration.',
                retryable: true,
                diagnostics,
                inputSnapshot: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$services$2f$modelPipelineDiagnostics$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["buildPipelineInputSnapshot"])(item)
            }));
        }
        await this.enrichWardrobeItemModel({
            wardrobeItemId,
            imageUrl: String(item.image_url ?? ''),
            pieceType: String(item.piece_type ?? 'upper_piece'),
            brandId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$services$2f$modelPipelineDiagnostics$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["canonicalizeBrandId"])(String(item.brand_id ?? DEFAULT_BRAND_ID))
        });
        return {
            ok: true,
            wardrobeItemId,
            generation_attempt_count: nextAttempt
        };
    }
    async shouldSkipBrandingPipeline(brandId) {
        if (!this.blenderCloudService.isConfigured()) return true;
        if (!brandId) return false;
        const brand = await this.brandsRepository.getById(brandId);
        return brand?.name?.trim().toLowerCase() === 'zara';
    }
    async generateModelFromImage(imageUrl, options) {
        const item = await this.wardrobeRepo.findById(options.wardrobeItemId);
        const previousAttempts = Number(item?.generation_attempt_count ?? 0) || 0;
        const nextAttempts = previousAttempts + options.attemptIncrement;
        if (options.attemptIncrement > 0) {
            await this.wardrobeRepo.updateGenerationAttempt(options.wardrobeItemId, nextAttempts);
        }
        await this.wardrobeRepo.updatePipelineStatus(options.wardrobeItemId, options.status, null, {
            stage: options.stageLabel,
            provider: this.blenderCloudService.isConfigured() ? 'runpod' : 'meshy',
            generation_attempt_count: nextAttempts
        });
        if (!this.blenderCloudService.isConfigured()) {
            await this.wardrobeRepo.updatePipelineStatus(options.wardrobeItemId, options.status, null, {
                stage: `${options.stageLabel}_fallback_meshy`,
                provider: 'meshy',
                reason: 'runpod_not_configured'
            });
            return this.meshyService.generate3DModelFromImage(imageUrl, {
                prompt: options.prompt
            });
        }
        await this.wardrobeRepo.updatePipelineStatus(options.wardrobeItemId, options.status, null, {
            stage: `${options.stageLabel}_submitting`,
            provider: 'runpod',
            job_type: MODEL_GENERATION_JOB_TYPE
        });
        let submitted;
        try {
            submitted = await this.blenderCloudService.submitBlenderCloudJob({
                modelUrl: imageUrl,
                imageUrl,
                jobType: MODEL_GENERATION_JOB_TYPE,
                options: {
                    prompt: options.prompt,
                    pieceType: options.pieceType,
                    mode: 'model_generation',
                    sourceImageUrl: imageUrl
                }
            });
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            const isRouteMismatch = /status=404/i.test(message) && /\/jobs|\/run/i.test(message);
            throw Object.assign(new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$services$2f$errors$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ServiceError"](message, 502), {
                pipelineFailure: {
                    failedStage: isRouteMismatch ? 'runpod_route_mismatch' : 'runpod_submit',
                    provider: 'runpod',
                    errorCode: isRouteMismatch ? 'RUNPOD_ROUTE_MISMATCH' : 'RUNPOD_SUBMIT_FAILED',
                    hint: isRouteMismatch ? 'The configured RunPod worker does not expose POST /jobs. Check FastAPI routes or use the correct submit path.' : 'RunPod submit failed. Verify endpoint URL, token and worker health.',
                    retryable: true,
                    diagnostics: {
                        responseBodyPreview: message.slice(0, 700)
                    }
                }
            });
        }
        await this.wardrobeRepo.updatePipelineStatus(options.wardrobeItemId, options.status, null, {
            stage: `${options.stageLabel}_submitted`,
            provider: 'runpod',
            cloud_job_id: submitted.cloudJobId,
            job_type: MODEL_GENERATION_JOB_TYPE,
            cloud_submit_status: submitted.status
        });
        const resolveModelFromArtifacts = (artifacts)=>{
            const source = artifacts ?? {};
            const modelUrlCandidates = [
                source.outputModelUrl,
                source.modelUrl,
                source.model_3d_url,
                source.outputUrl,
                source.glbUrl,
                source.artifact_url,
                source.artifactUrl
            ];
            const previewUrlCandidates = [
                source.previewUrl,
                source.posterUrl,
                source.thumbnailUrl
            ];
            const model_3d_url = modelUrlCandidates.find((url)=>typeof url === 'string' && url.trim().length > 0);
            const model_preview_url = previewUrlCandidates.find((url)=>typeof url === 'string' && url.trim().length > 0) ?? null;
            const resolvedModelUrl = typeof model_3d_url === 'string' ? model_3d_url.trim() : '';
            if (!resolvedModelUrl || !resolvedModelUrl.toLowerCase().startsWith('http')) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$services$2f$errors$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ServiceError"]('RunPod Blender model generation completed without a valid model URL.', 502);
            }
            return {
                model_3d_url: resolvedModelUrl,
                model_preview_url: typeof model_preview_url === 'string' ? model_preview_url.trim() : null
            };
        };
        if (submitted.status === 'completed') {
            return resolveModelFromArtifacts(submitted.artifacts);
        }
        if (submitted.status === 'failed' || submitted.status === 'cancelled') {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$services$2f$errors$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ServiceError"](`RunPod Blender model generation ${submitted.status} during submit phase.`, 502);
        }
        for(let poll = 0; poll < MODEL_GENERATION_MAX_POLLS; poll += 1){
            if (poll > 0 && poll % 6 === 0) {
                await this.wardrobeRepo.updatePipelineStatus(options.wardrobeItemId, options.status, null, {
                    stage: `${options.stageLabel}_polling`,
                    provider: 'runpod',
                    cloud_job_id: submitted.cloudJobId,
                    poll_count: poll
                });
            }
            const status = await this.blenderCloudService.getBlenderCloudJobStatus(submitted.cloudJobId);
            if (status.status === 'completed') {
                return resolveModelFromArtifacts(status.artifacts);
            }
            if (status.status === 'failed' || status.status === 'cancelled') {
                const details = status.errorMessage ?? JSON.stringify(status.raw?.error ?? status.raw);
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$services$2f$errors$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ServiceError"](`RunPod Blender model generation ${status.status}: ${details}`, 502);
            }
            await new Promise((resolve)=>setTimeout(resolve, MODEL_GENERATION_POLL_MS));
        }
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$services$2f$errors$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ServiceError"]('RunPod Blender model generation timed out before completion.', 504);
    }
    async validateGeometryScopeWithFallback(input) {
        try {
            return await this.geometryScopeService.validate({
                modelUrl: input.modelUrl,
                pieceType: input.pieceType
            });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown geometry scope validation error.';
            console.warn('[wardrobe-model-pipeline] geometry scope validation failed, applying soft-pass fallback', {
                wardrobe_item_id: input.wardrobeItemId,
                error: message
            });
            await this.wardrobeRepo.updatePipelineStatus(input.wardrobeItemId, 'queued_geometry_qa', null, {
                stage: 'geometry_scope_fallback',
                warning: message
            });
            return {
                passed: true,
                scopeScore: 0.65,
                reasons: [
                    `Soft-pass fallback applied because geometry validation errored: ${message}`
                ]
            };
        }
    }
    qualityChecksPass(input) {
        const geometryScopePassed = input.fitProfile?.preparationStatus === 'ready';
        const hasAnchors = Boolean(input.fitProfile?.garmentAnchors);
        if (!geometryScopePassed || !hasAnchors) {
            return {
                passed: false,
                failedStage: 'branding_precondition_failed',
                message: 'Branding preconditions failed: geometry/anchors unavailable.',
                errorCode: 'BRANDING_PRECONDITION_FAILED',
                hint: 'The item lacks usable garment geometry/anchors. Run 2D preparation before logo placement.',
                retryable: true,
                details: {
                    selectedBrandId: input.brandIdSelectedRaw,
                    normalizedBrandId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$services$2f$modelPipelineDiagnostics$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["canonicalizeBrandId"])(input.brandIdRaw),
                    sourceLogoUrl: null,
                    placementProfileUsed: input.placementProfileId,
                    logoBBox: null,
                    targetGarmentBBox: input.fitProfile?.normalizedBBox ?? null,
                    visibilityScore: 0,
                    contrastScore: 0,
                    placementScore: 0,
                    finalBrandingScore: 0,
                    thresholds: {
                        minFinalBrandingScore: 0.6
                    },
                    reasonForRejection: 'geometry_scope_passed=false or garmentAnchors missing'
                }
            };
        }
        const hasGlbExtension = (url)=>url.split('?')[0].split('#')[0].toLowerCase().endsWith('.glb');
        const baseValid = input.baseModelUrl.trim().length > 0 && hasGlbExtension(input.baseModelUrl);
        const brandedValid = input.brandedModelUrl.trim().length > 0 && hasGlbExtension(input.brandedModelUrl);
        const urlsDiffer = input.baseModelUrl !== input.brandedModelUrl;
        const visibilityScore = brandedValid ? 0.75 : 0.15;
        const contrastScore = brandedValid ? 0.7 : 0.2;
        const placementScore = urlsDiffer ? 0.7 : 0.1;
        const finalBrandingScore = Number(((visibilityScore + contrastScore + placementScore) / 3).toFixed(3));
        const thresholds = {
            minVisibility: 0.55,
            minContrast: 0.5,
            minPlacement: 0.5,
            minFinalBrandingScore: 0.6
        };
        const passed = baseValid && brandedValid && urlsDiffer && finalBrandingScore >= thresholds.minFinalBrandingScore;
        return {
            passed,
            failedStage: 'branding_quality_validation',
            message: passed ? 'Branding quality checks passed.' : 'Branding quality checks failed (logo visibility/placement validation).',
            errorCode: passed ? 'OK' : 'BRANDING_QUALITY_FAILED',
            hint: passed ? '' : 'Improve logo visibility/contrast or adjust placement profile.',
            retryable: true,
            details: {
                selectedBrandId: input.brandIdSelectedRaw,
                normalizedBrandId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$services$2f$modelPipelineDiagnostics$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["canonicalizeBrandId"])(input.brandIdRaw),
                sourceLogoUrl: null,
                placementProfileUsed: input.placementProfileId,
                logoBBox: null,
                targetGarmentBBox: input.fitProfile?.normalizedBBox ?? null,
                visibilityScore,
                contrastScore,
                placementScore,
                finalBrandingScore,
                thresholds,
                reasonForRejection: passed ? null : 'final_branding_score_below_threshold_or_invalid_urls'
            }
        };
    }
    logPipelineMetrics(wardrobeItemId, pieceType, scopePassed, segmentationConfidence, scopeScore) {
        console.info('[wardrobe-model-pipeline]', {
            wardrobe_item_id: wardrobeItemId,
            piece_type: pieceType,
            scope_passed: scopePassed,
            segmentation_confidence: segmentationConfidence,
            geometry_scope_score: scopeScore,
            timestamp: new Date().toISOString()
        });
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/app/backend/services/ClothingAnalysisService.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ClothingAnalysisService",
    ()=>ClothingAnalysisService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$services$2f$errors$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/backend/services/errors.ts [app-route] (ecmascript)");
;
class ClothingAnalysisService {
    async analyze(imageUrl) {
        const visionEndpoint = process.env.CLOTHING_ANALYSIS_ENDPOINT;
        if (visionEndpoint) {
            const response = await fetch(visionEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    image_url: imageUrl
                })
            });
            if (!response.ok) throw new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$services$2f$errors$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ServiceError"]('Clothing analysis service failed.', 502);
            const payload = await response.json();
            return this.withComputedReadiness(payload);
        }
        const openAiModel = process.env.OPENAI_CLASSIFICATION_MODEL;
        const openAiKey = process.env.OPENAI_API_KEY;
        if (!openAiModel || !openAiKey) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$services$2f$errors$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ServiceError"]('Missing clothing analysis provider. Configure CLOTHING_ANALYSIS_ENDPOINT or OPENAI_CLASSIFICATION_MODEL + OPENAI_API_KEY.', 500);
        }
        const response = await fetch('https://api.openai.com/v1/responses', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${openAiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: openAiModel,
                input: [
                    {
                        role: 'user',
                        content: [
                            {
                                type: 'input_text',
                                text: 'Classify clothing image quality and return JSON fields: contains_human,bounding_box,rotation_z_degrees,fully_visible,centered_score,front_view_score,background_clean_score,recommended_action.'
                            },
                            {
                                type: 'input_image',
                                image_url: imageUrl
                            }
                        ]
                    }
                ],
                text: {
                    format: {
                        type: 'json_schema',
                        name: 'clothing_analysis',
                        schema: {
                            type: 'object',
                            additionalProperties: false,
                            properties: {
                                contains_human: {
                                    type: 'boolean'
                                },
                                bounding_box: {
                                    type: 'object',
                                    properties: {
                                        x: {
                                            type: 'number'
                                        },
                                        y: {
                                            type: 'number'
                                        },
                                        width: {
                                            type: 'number'
                                        },
                                        height: {
                                            type: 'number'
                                        }
                                    },
                                    required: [
                                        'x',
                                        'y',
                                        'width',
                                        'height'
                                    ],
                                    additionalProperties: false
                                },
                                rotation_z_degrees: {
                                    type: 'number'
                                },
                                fully_visible: {
                                    type: 'boolean'
                                },
                                centered_score: {
                                    type: 'number'
                                },
                                front_view_score: {
                                    type: 'number'
                                },
                                background_clean_score: {
                                    type: 'number'
                                },
                                recommended_action: {
                                    type: 'string',
                                    enum: [
                                        'approve_catalog_2d',
                                        'refine_with_diffusion',
                                        'normalize_only',
                                        'request_reupload'
                                    ]
                                }
                            },
                            required: [
                                'contains_human',
                                'bounding_box',
                                'rotation_z_degrees',
                                'fully_visible',
                                'centered_score',
                                'front_view_score',
                                'background_clean_score',
                                'recommended_action'
                            ]
                        }
                    }
                }
            })
        });
        if (!response.ok) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$services$2f$errors$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ServiceError"]('OpenAI classification request failed.', 502);
        }
        const payload = await response.json();
        const parsed = JSON.parse(payload.output_text ?? '{}');
        return this.withComputedReadiness(parsed);
    }
    withComputedReadiness(payload) {
        const centered = Number(payload.centered_score ?? 0.5);
        const front = Number(payload.front_view_score ?? 0.5);
        const clean = Number(payload.background_clean_score ?? 0.5);
        const visibility = payload.fully_visible ? 1 : 0.35;
        const rotationPenalty = Math.max(0, Math.abs(Number(payload.rotation_z_degrees ?? 0)) / 45);
        const score = Math.max(0, Math.min(100, Math.round((centered * 0.25 + front * 0.25 + clean * 0.25 + visibility * 0.25 - rotationPenalty * 0.2) * 100)));
        return {
            contains_human: Boolean(payload.contains_human),
            bounding_box: payload.bounding_box ?? {
                x: 0.1,
                y: 0.1,
                width: 0.8,
                height: 0.8
            },
            rotation_z_degrees: Number(payload.rotation_z_degrees ?? 0),
            fully_visible: Boolean(payload.fully_visible),
            centered_score: centered,
            front_view_score: front,
            background_clean_score: clean,
            catalog_readiness_score: score,
            recommended_action: payload.recommended_action ?? (score >= 78 ? 'approve_catalog_2d' : score >= 55 ? 'normalize_only' : 'request_reupload')
        };
    }
}
}),
"[project]/app/backend/services/ImageNormalizationService.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ImageNormalizationService",
    ()=>ImageNormalizationService
]);
class ImageNormalizationService {
    async normalize(input) {
        const targetWidth = input.targetWidth ?? 1200;
        const targetHeight = input.targetHeight ?? 1600;
        const paddingRatio = input.paddingRatio ?? 0.08;
        return {
            normalizedPngUrl: input.segmentedPngUrl,
            targetWidth,
            targetHeight,
            paddingRatio,
            transform: {
                translateX: 0,
                translateY: 0,
                scale: 1,
                rotationZ: 0
            }
        };
    }
}
}),
"[project]/app/backend/services/ImageSegmentationService.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ImageSegmentationService",
    ()=>ImageSegmentationService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$services$2f$errors$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/backend/services/errors.ts [app-route] (ecmascript)");
;
class ImageSegmentationService {
    async segment(input) {
        const provider = (process.env.CLOTHING_SEGMENTATION_PROVIDER ?? 'replicate').toLowerCase();
        if (provider === 'replicate') return this.segmentWithReplicate(input);
        if (provider === 'sam' || provider === 'u2net') return this.segmentWithCustomApi(input, provider);
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$services$2f$errors$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ServiceError"](`Unsupported segmentation provider: ${provider}`, 500);
    }
    async segmentWithReplicate(input) {
        const replicateToken = process.env.REPLICATE_API_TOKEN;
        const version = process.env.REPLICATE_SEGMENTATION_VERSION;
        if (!replicateToken || !version) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$services$2f$errors$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ServiceError"]('Missing Replicate segmentation configuration (REPLICATE_API_TOKEN, REPLICATE_SEGMENTATION_VERSION).', 500);
        }
        const response = await fetch('https://api.replicate.com/v1/predictions', {
            method: 'POST',
            headers: {
                Authorization: `Token ${replicateToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                version,
                input: {
                    image: input.imageUrl,
                    garment_type: input.pieceType,
                    return_mask: true
                }
            })
        });
        if (!response.ok) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$services$2f$errors$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ServiceError"]('Replicate segmentation request failed.', 502);
        }
        const prediction = await response.json();
        const pollUrl = prediction.urls?.get;
        if (!pollUrl) throw new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$services$2f$errors$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ServiceError"]('Replicate did not return a polling URL.', 502);
        const completed = await this.pollReplicatePrediction(pollUrl, replicateToken);
        const output = completed.output;
        let segmentedPngUrl = '';
        let maskUrl = null;
        let confidence = 0.85;
        if (typeof output === 'string') segmentedPngUrl = output;
        if (Array.isArray(output)) segmentedPngUrl = String(output[0] ?? '');
        if (output && typeof output === 'object' && !Array.isArray(output)) {
            const outputPayload = output;
            segmentedPngUrl = String(outputPayload.image ?? '');
            maskUrl = outputPayload.mask ? String(outputPayload.mask) : null;
            confidence = Number(outputPayload.confidence ?? confidence);
        }
        if (!segmentedPngUrl) throw new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$services$2f$errors$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ServiceError"]('Segmentation provider returned no image output.', 502);
        return {
            segmentedPngUrl,
            maskUrl,
            provider: 'replicate',
            confidence,
            stageDetails: {
                pipeline: 'segmentation',
                provider: 'replicate',
                prediction_id: completed.id
            }
        };
    }
    async segmentWithCustomApi(input, provider) {
        const endpoint = process.env.CLOTHING_SEGMENTATION_ENDPOINT;
        if (!endpoint) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$services$2f$errors$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ServiceError"]('Missing CLOTHING_SEGMENTATION_ENDPOINT for custom segmentation provider.', 500);
        }
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                image_url: input.imageUrl,
                piece_type: input.pieceType,
                provider
            })
        });
        if (!response.ok) throw new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$services$2f$errors$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ServiceError"]('Custom segmentation service failed.', 502);
        const data = await response.json();
        if (!data.segmented_png_url) throw new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$services$2f$errors$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ServiceError"]('Custom segmentation service did not return segmented_png_url.', 502);
        return {
            segmentedPngUrl: data.segmented_png_url,
            maskUrl: data.mask_url ?? null,
            provider,
            confidence: Number(data.confidence ?? 0.8),
            stageDetails: {
                pipeline: 'segmentation',
                provider,
                endpoint
            }
        };
    }
    async pollReplicatePrediction(url, token) {
        for(let attempt = 0; attempt < 30; attempt += 1){
            const response = await fetch(url, {
                headers: {
                    Authorization: `Token ${token}`
                }
            });
            if (!response.ok) throw new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$services$2f$errors$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ServiceError"]('Failed polling Replicate segmentation prediction.', 502);
            const payload = await response.json();
            if (payload.status === 'succeeded') return payload;
            if (payload.status === 'failed' || payload.status === 'canceled') {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$services$2f$errors$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ServiceError"](`Replicate segmentation failed: ${payload.error ?? 'unknown error'}`, 502);
            }
            await new Promise((resolve)=>setTimeout(resolve, 1100));
        }
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$services$2f$errors$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ServiceError"]('Segmentation polling timed out.', 504);
    }
}
}),
"[project]/app/backend/services/Clothing2DGenerationService.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "Clothing2DGenerationService",
    ()=>Clothing2DGenerationService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$repositories$2f$WardrobeItemsRepository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/backend/repositories/WardrobeItemsRepository.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$services$2f$ClothingAnalysisService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/backend/services/ClothingAnalysisService.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$services$2f$ImageNormalizationService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/backend/services/ImageNormalizationService.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$services$2f$ImageSegmentationService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/backend/services/ImageSegmentationService.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$services$2f$errors$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/backend/services/errors.ts [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$repositories$2f$WardrobeItemsRepository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$repositories$2f$WardrobeItemsRepository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
class Clothing2DGenerationService {
    wardrobeRepository;
    analysisService;
    segmentationService;
    normalizationService;
    constructor(wardrobeRepository = new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$repositories$2f$WardrobeItemsRepository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["WardrobeItemsRepository"](), analysisService = new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$services$2f$ClothingAnalysisService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ClothingAnalysisService"](), segmentationService = new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$services$2f$ImageSegmentationService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ImageSegmentationService"](), normalizationService = new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$services$2f$ImageNormalizationService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ImageNormalizationService"]()){
        this.wardrobeRepository = wardrobeRepository;
        this.analysisService = analysisService;
        this.segmentationService = segmentationService;
        this.normalizationService = normalizationService;
    }
    async process(input) {
        if (!input.wardrobe_item_id || !input.raw_upload_image_url) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$services$2f$errors$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ServiceError"]('wardrobe_item_id and raw_upload_image_url are required.', 400);
        }
        const analysis = await this.analysisService.analyze(input.raw_upload_image_url);
        const segmentation = await this.segmentationService.segment({
            imageUrl: input.raw_upload_image_url,
            pieceType: input.piece_type
        });
        const normalized = await this.normalizationService.normalize({
            segmentedPngUrl: segmentation.segmentedPngUrl,
            targetWidth: 1200,
            targetHeight: 1600,
            paddingRatio: 0.08
        });
        const shouldRefine = Math.abs(analysis.rotation_z_degrees) > 8 || !analysis.fully_visible || analysis.catalog_readiness_score < 70;
        const refinedImage = shouldRefine ? await this.refineWithDiffusion(normalized.normalizedPngUrl, input.piece_type) : null;
        const approvedCatalog2DUrl = analysis.catalog_readiness_score >= 76 ? refinedImage ?? normalized.normalizedPngUrl : null;
        const recommendedAction = analysis.catalog_readiness_score < 45 ? 'request_reupload' : approvedCatalog2DUrl ? 'approve_catalog_2d' : 'normalize_only';
        await this.wardrobeRepository.update2DAssets(input.wardrobe_item_id, {
            image_assets: {
                raw_upload_image_url: input.raw_upload_image_url,
                segmented_png_url: segmentation.segmentedPngUrl,
                normalized_2d_preview_url: normalized.normalizedPngUrl,
                approved_catalog_2d_url: approvedCatalog2DUrl
            },
            image_analysis: {
                contains_human: analysis.contains_human,
                rotation_z_degrees: analysis.rotation_z_degrees,
                fully_visible: analysis.fully_visible,
                centered_score: analysis.centered_score,
                front_view_score: analysis.front_view_score,
                background_clean_score: analysis.background_clean_score,
                catalog_readiness_score: analysis.catalog_readiness_score,
                recommended_action: recommendedAction
            },
            stage_details: {
                segmentation: segmentation.stageDetails,
                normalization: normalized,
                refinement: shouldRefine ? {
                    attempted: true,
                    output: refinedImage
                } : {
                    attempted: false
                }
            }
        });
        return {
            wardrobe_item_id: input.wardrobe_item_id,
            image_assets: {
                raw_upload_image_url: input.raw_upload_image_url,
                segmented_png_url: segmentation.segmentedPngUrl,
                normalized_2d_preview_url: normalized.normalizedPngUrl,
                approved_catalog_2d_url: approvedCatalog2DUrl
            },
            image_analysis: {
                ...analysis,
                recommended_action: recommendedAction
            }
        };
    }
    async refineWithDiffusion(imageUrl, pieceType) {
        const token = process.env.REPLICATE_API_TOKEN;
        const version = process.env.REPLICATE_CLOTHING_REFINER_VERSION;
        if (!token || !version) return null;
        const response = await fetch('https://api.replicate.com/v1/predictions', {
            method: 'POST',
            headers: {
                Authorization: `Token ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                version,
                input: {
                    image: imageUrl,
                    prompt: `Generate clean catalog-style ${pieceType} product image on transparent background, front-facing, centered.`
                }
            })
        });
        if (!response.ok) return null;
        const prediction = await response.json();
        const pollUrl = prediction.urls?.get;
        if (!pollUrl) return null;
        for(let attempt = 0; attempt < 25; attempt += 1){
            const pollResponse = await fetch(pollUrl, {
                headers: {
                    Authorization: `Token ${token}`
                }
            });
            if (!pollResponse.ok) return null;
            const payload = await pollResponse.json();
            if (payload.status === 'succeeded') {
                if (typeof payload.output === 'string') return payload.output;
                if (Array.isArray(payload.output)) return String(payload.output[0] ?? '');
            }
            if (payload.status === 'failed' || payload.status === 'canceled') return null;
            await new Promise((resolve)=>setTimeout(resolve, 1000));
        }
        return null;
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/app/backend/repositories/WardrobeRepository.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "WardrobeRepository",
    ()=>WardrobeRepository
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$repositories$2f$WardrobeItemsRepository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/backend/repositories/WardrobeItemsRepository.ts [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$repositories$2f$WardrobeItemsRepository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$repositories$2f$WardrobeItemsRepository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
class WardrobeRepository extends __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$repositories$2f$WardrobeItemsRepository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["WardrobeItemsRepository"] {
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/app/backend/controllers/WardrobeController.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "WardrobeController",
    ()=>WardrobeController
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$services$2f$WardrobeService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/backend/services/WardrobeService.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$services$2f$Clothing2DGenerationService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/backend/services/Clothing2DGenerationService.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$repositories$2f$WardrobeRepository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/backend/repositories/WardrobeRepository.ts [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$services$2f$WardrobeService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$services$2f$Clothing2DGenerationService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$repositories$2f$WardrobeRepository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$services$2f$WardrobeService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$services$2f$Clothing2DGenerationService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$repositories$2f$WardrobeRepository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
class WardrobeController {
    wardrobeService;
    clothing2dService;
    wardrobeRepository;
    constructor(wardrobeService = new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$services$2f$WardrobeService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["WardrobeService"](), clothing2dService = new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$services$2f$Clothing2DGenerationService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Clothing2DGenerationService"](), wardrobeRepository = new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$repositories$2f$WardrobeRepository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["WardrobeRepository"]()){
        this.wardrobeService = wardrobeService;
        this.clothing2dService = clothing2dService;
        this.wardrobeRepository = wardrobeRepository;
    }
    async listByUser(userId, options) {
        return this.wardrobeService.listUserWardrobe(userId, options);
    }
    async analysisByUser(userId) {
        return this.wardrobeService.getWardrobeAnalysis(userId);
    }
    async create(input) {
        return this.wardrobeService.createWardrobeItem(input);
    }
    async listDiscoverable(filters) {
        return this.wardrobeService.listDiscoverablePieces(filters);
    }
    async process2D(input) {
        return this.clothing2dService.process({
            wardrobe_item_id: String(input.wardrobe_item_id ?? ''),
            raw_upload_image_url: String(input.raw_upload_image_url ?? ''),
            piece_type: String(input.piece_type ?? 'upper')
        });
    }
    async getByIdWith2D(wardrobeItemId) {
        return this.wardrobeRepository.findWith2DAssetsById(wardrobeItemId);
    }
    async retry3D(wardrobeItemId) {
        return this.wardrobeService.retry3DGeneration(wardrobeItemId);
    }
    async retryBranding(wardrobeItemId, input) {
        void input;
        return this.wardrobeService.retry3DGeneration(wardrobeItemId);
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/app/api/wardrobe-items/user/[userId]/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$controllers$2f$WardrobeController$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/backend/controllers/WardrobeController.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$services$2f$errors$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/backend/services/errors.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$app__$5b$external$5d$__$28$firebase$2d$admin$2f$app$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$firebase$2d$admin$29$__ = __turbopack_context__.i("[externals]/firebase-admin/app [external] (firebase-admin/app, esm_import, [project]/node_modules/firebase-admin)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$controllers$2f$WardrobeController$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$app__$5b$external$5d$__$28$firebase$2d$admin$2f$app$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$firebase$2d$admin$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$controllers$2f$WardrobeController$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$app__$5b$external$5d$__$28$firebase$2d$admin$2f$app$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$firebase$2d$admin$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
const wardrobeController = new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$controllers$2f$WardrobeController$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["WardrobeController"]();
const WARDROBE_ITEMS_COLLECTION = 'sai-wardrobeItems';
const INDEX_URL_REGEX = /(https:\/\/console\.firebase\.google\.com\/[^\s]+)/i;
function parseRequest(request, userIdParam) {
    const { searchParams } = new URL(request.url);
    const requestedStatus = searchParams.get('status');
    const status = requestedStatus === 'processing' || requestedStatus === 'archived' ? requestedStatus : 'active';
    const requestedLimit = Number(searchParams.get('limit') ?? 24);
    const limit = Number.isFinite(requestedLimit) ? Math.max(1, Math.min(100, Math.floor(requestedLimit))) : 24;
    return {
        userId: String(userIdParam ?? '').trim(),
        status,
        limit,
        pieceType: searchParams.get('piece_type') ?? undefined,
        cursorCreatedAt: searchParams.get('cursor') ?? undefined
    };
}
function extractIndexUrl(message) {
    if (!message) return null;
    const match = message.match(INDEX_URL_REGEX);
    return match?.[1] ?? null;
}
function isFirestoreMissingIndexError(error) {
    if (!error || typeof error !== 'object') return false;
    const maybeError = error;
    const code = typeof maybeError.code === 'number' ? maybeError.code : null;
    const message = typeof maybeError.message === 'string' ? maybeError.message.toLowerCase() : '';
    return code === 9 || message.includes('failed-precondition') || message.includes('requires an index');
}
function normalizeError(error) {
    if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$backend$2f$services$2f$errors$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ServiceError"]) {
        return {
            status: error.statusCode,
            payload: {
                ok: false,
                errorCode: 'SERVICE_ERROR',
                message: error.message
            }
        };
    }
    const maybeError = error;
    const rawCode = maybeError && 'code' in maybeError ? maybeError.code : undefined;
    const errorCode = typeof rawCode === 'string' || typeof rawCode === 'number' ? String(rawCode) : 'INTERNAL_ERROR';
    const message = typeof maybeError?.message === 'string' && maybeError.message.trim().length > 0 ? maybeError.message : 'Unexpected server error while loading wardrobe items.';
    const indexUrl = extractIndexUrl(message);
    const isDev = ("TURBOPACK compile-time value", "development") !== 'production';
    if (isFirestoreMissingIndexError(error) && isDev) {
        return {
            status: 500,
            payload: {
                ok: false,
                errorCode: 'FIRESTORE_MISSING_INDEX',
                message: 'Firestore requires a composite index for this query.',
                indexUrl,
                requiredCompositeIndex: {
                    collection: WARDROBE_ITEMS_COLLECTION,
                    fields: [
                        'userId Ascending',
                        'status Ascending',
                        'createdAt Descending'
                    ]
                }
            }
        };
    }
    return {
        status: 500,
        payload: {
            ok: false,
            errorCode,
            message
        }
    };
}
async function GET(request, { params }) {
    try {
        const { userId } = await params;
        const parsed = parseRequest(request, userId);
        console.info('[wardrobe-items/user] incoming request', {
            userId: parsed.userId,
            status: parsed.status,
            limit: parsed.limit,
            pieceType: parsed.pieceType ?? null,
            cursorCreatedAt: parsed.cursorCreatedAt ?? null,
            firebaseAdminInitialized: (0, __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$app__$5b$external$5d$__$28$firebase$2d$admin$2f$app$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$firebase$2d$admin$29$__["getApps"])().length > 0,
            firestoreCollection: WARDROBE_ITEMS_COLLECTION,
            queryFieldsUsed: [
                'where(userId == userId)',
                'where(status == status)',
                'orderBy(createdAt desc)',
                `limit(${parsed.limit})`
            ]
        });
        const data = await wardrobeController.listByUser(parsed.userId, {
            status: parsed.status,
            piece_type: parsed.pieceType,
            cursorCreatedAt: parsed.cursorCreatedAt,
            limit: parsed.limit
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(data);
    } catch (error) {
        const normalized = normalizeError(error);
        const maybeError = error;
        const errorCode = typeof maybeError?.code === 'string' || typeof maybeError?.code === 'number' ? String(maybeError.code) : 'INTERNAL_ERROR';
        const errorMessage = typeof maybeError?.message === 'string' ? maybeError.message : 'Unknown error';
        const errorStack = typeof maybeError?.stack === 'string' ? maybeError.stack : null;
        const indexUrl = extractIndexUrl(errorMessage);
        console.error('[wardrobe-items/user] request failed', {
            errorCode,
            message: errorMessage,
            stack: errorStack,
            isFirestoreMissingIndexError: isFirestoreMissingIndexError(error),
            indexUrl,
            firebaseAdminInitialized: (0, __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$app__$5b$external$5d$__$28$firebase$2d$admin$2f$app$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$firebase$2d$admin$29$__["getApps"])().length > 0,
            firestoreCollection: WARDROBE_ITEMS_COLLECTION
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(normalized.payload, {
            status: normalized.status
        });
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__2fd6abcc._.js.map