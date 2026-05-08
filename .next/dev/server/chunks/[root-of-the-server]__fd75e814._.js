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
"[project]/app/api/wardrobe/process-piece/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$fashion$2d$ai$2f$services$2f$WardrobeImagePreparationService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/fashion-ai/services/WardrobeImagePreparationService.ts [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$fashion$2d$ai$2f$services$2f$WardrobeImagePreparationService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$fashion$2d$ai$2f$services$2f$WardrobeImagePreparationService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
const preparationService = new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$fashion$2d$ai$2f$services$2f$WardrobeImagePreparationService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["WardrobeImagePreparationService"]();
async function POST(request) {
    console.info('[process-piece] request received');
    let pieceId = '';
    try {
        console.info('[process-piece] validating body');
        const body = await request.json().catch(()=>({}));
        pieceId = String(body.pieceId ?? '').trim();
        if (!pieceId) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                ok: false,
                error: 'INVALID_INPUT',
                pieceId
            }, {
                status: 400
            });
        }
        const { fitProfile, debug } = await preparationService.preparePieceForTester2D(pieceId);
        const response = {
            ok: true,
            pieceId,
            wardrobeItemFound: debug.wardrobeItemFound,
            imageUrlFound: debug.imageUrlFound,
            inferredPieceType: debug.inferredPieceType,
            inferredTargetGender: debug.inferredTargetGender,
            previousFitProfileStatus: debug.previousFitProfileStatus,
            newPreparationStatus: debug.newPreparationStatus,
            compatibleMannequins: debug.compatibleMannequins,
            warnings: debug.warnings,
            fitProfile
        };
        console.info('[process-piece] success', {
            pieceId,
            newPreparationStatus: debug.newPreparationStatus,
            inferredPieceType: debug.inferredPieceType,
            inferredTargetGender: debug.inferredTargetGender
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(response);
    } catch (error) {
        if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$fashion$2d$ai$2f$services$2f$WardrobeImagePreparationService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["WardrobePreparationError"]) {
            console.error('[process-piece] failed', {
                code: error.code,
                status: error.status,
                message: error.message
            });
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                ok: false,
                error: error.code,
                pieceId
            }, {
                status: error.status
            });
        }
        console.error('[process-piece] failed', {
            message: error instanceof Error ? error.message : 'unknown_error'
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            ok: false,
            error: 'UNEXPECTED_PROCESSING_ERROR',
            pieceId
        }, {
            status: 500
        });
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__fd75e814._.js.map