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
"[externals]/node:crypto [external] (node:crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:crypto", () => require("node:crypto"));

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
"[project]/app/lib/security/basicRateLimit.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "consumeRateLimit",
    ()=>consumeRateLimit,
    "resolveClientIp",
    ()=>resolveClientIp
]);
const STORAGE_KEY = "__basic_rate_limit_store__";
const getStore = ()=>{
    const scopedGlobal = globalThis;
    if (!scopedGlobal[STORAGE_KEY]) {
        scopedGlobal[STORAGE_KEY] = new Map();
    }
    return scopedGlobal[STORAGE_KEY];
};
const resolveClientIp = (request)=>{
    const forwardedFor = request.headers.get("x-forwarded-for");
    if (forwardedFor) {
        const first = forwardedFor.split(",")[0]?.trim();
        if (first) return first;
    }
    const realIp = request.headers.get("x-real-ip")?.trim();
    if (realIp) return realIp;
    return "unknown";
};
const consumeRateLimit = ({ namespace, key, maxRequests, windowMs })=>{
    const safeMaxRequests = Math.max(1, Math.floor(maxRequests));
    const safeWindowMs = Math.max(1_000, Math.floor(windowMs));
    const now = Date.now();
    const bucketKey = `${namespace}:${key}`;
    const store = getStore();
    const existing = store.get(bucketKey);
    if (!existing || existing.resetAt <= now) {
        store.set(bucketKey, {
            count: 1,
            resetAt: now + safeWindowMs
        });
        return {
            allowed: true,
            remaining: safeMaxRequests - 1,
            retryAfterSeconds: Math.ceil(safeWindowMs / 1000)
        };
    }
    if (existing.count >= safeMaxRequests) {
        return {
            allowed: false,
            remaining: 0,
            retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000))
        };
    }
    existing.count += 1;
    store.set(bucketKey, existing);
    return {
        allowed: true,
        remaining: safeMaxRequests - existing.count,
        retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000))
    };
};
}),
"[project]/app/lib/serverSession.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AUTH_COOKIE_NAME",
    ()=>AUTH_COOKIE_NAME,
    "clearSessionCookie",
    ()=>clearSessionCookie,
    "createSessionToken",
    ()=>createSessionToken,
    "readSession",
    ()=>readSession,
    "requireSession",
    ()=>requireSession,
    "setSessionCookie",
    ()=>setSessionCookie,
    "verifySessionToken",
    ()=>verifySessionToken
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:crypto [external] (node:crypto, cjs)");
;
const AUTH_COOKIE_NAME = "restaurantcards_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 12;
const getSecret = ()=>{
    const secret = process.env.PIN_COOKIE_SECRET;
    if (!secret) {
        throw new Error("AUTH_SESSION_SECRET is not configured.");
    }
    return secret;
};
const toBase64Url = (value)=>Buffer.from(value, "utf8").toString("base64url");
const fromBase64Url = (value)=>Buffer.from(value, "base64url").toString("utf8");
const sign = (payload, secret)=>__TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["default"].createHmac("sha256", secret).update(payload).digest("base64url");
const createSessionToken = (params)=>{
    const now = Date.now();
    const claims = {
        sub: params.sub,
        email: params.email,
        iat: now,
        exp: now + SESSION_TTL_MS,
        nonce: __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["default"].randomBytes(16).toString("base64url")
    };
    const payload = toBase64Url(JSON.stringify(claims));
    const signature = sign(payload, getSecret());
    return `${payload}.${signature}`;
};
const verifySessionToken = (token)=>{
    const [payload, signature] = token.split(".");
    if (!payload || !signature) return null;
    const expected = sign(payload, getSecret());
    const a = Buffer.from(signature);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return null;
    if (!__TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["default"].timingSafeEqual(a, b)) return null;
    try {
        const claims = JSON.parse(fromBase64Url(payload));
        if (!claims?.sub || !claims?.email || !claims?.exp) return null;
        if (claims.exp <= Date.now()) return null;
        return claims;
    } catch  {
        return null;
    }
};
const readSession = (request)=>{
    const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
    if (!token) return null;
    return verifySessionToken(token);
};
const requireSession = (request)=>readSession(request);
const setSessionCookie = (response, token)=>{
    response.cookies.set({
        name: AUTH_COOKIE_NAME,
        value: token,
        httpOnly: true,
        sameSite: "lax",
        secure: ("TURBOPACK compile-time value", "development") === "production",
        path: "/",
        maxAge: SESSION_TTL_MS / 1000
    });
};
const clearSessionCookie = (response)=>{
    response.cookies.set({
        name: AUTH_COOKIE_NAME,
        value: "",
        httpOnly: true,
        sameSite: "lax",
        secure: ("TURBOPACK compile-time value", "development") === "production",
        path: "/",
        maxAge: 0
    });
};
}),
"[project]/app/lib/userProfileSync.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "syncUserProfileFromAuth",
    ()=>syncUserProfileFromAuth
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$firestore__$5b$external$5d$__$28$firebase$2d$admin$2f$firestore$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$firebase$2d$admin$29$__ = __turbopack_context__.i("[externals]/firebase-admin/firestore [external] (firebase-admin/firestore, esm_import, [project]/node_modules/firebase-admin)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$firestore__$5b$external$5d$__$28$firebase$2d$admin$2f$firestore$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$firebase$2d$admin$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$firestore__$5b$external$5d$__$28$firebase$2d$admin$2f$firestore$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$firebase$2d$admin$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
const USER_COLLECTION = "sai-usercontrol";
const syncUserProfileFromAuth = async ({ uid, email, displayName, provider, role = "user", status = "active", db })=>{
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedDisplayName = (displayName ?? "").trim();
    const userRef = db.collection(USER_COLLECTION).doc(uid);
    await userRef.set({
        uid,
        user_id: uid,
        email: normalizedEmail,
        displayName: normalizedDisplayName,
        name: normalizedDisplayName,
        provider,
        role,
        status,
        createdAt: __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$firestore__$5b$external$5d$__$28$firebase$2d$admin$2f$firestore$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$firebase$2d$admin$29$__["FieldValue"].serverTimestamp(),
        updatedAt: __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$firestore__$5b$external$5d$__$28$firebase$2d$admin$2f$firestore$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$firebase$2d$admin$29$__["FieldValue"].serverTimestamp()
    }, {
        merge: true
    });
    const snapshot = await userRef.get();
    return snapshot.data() ?? null;
};
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/app/api/auth/verify/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "POST",
    ()=>POST,
    "runtime",
    ()=>runtime
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:crypto [external] (node:crypto, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebaseAdmin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/firebaseAdmin.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$security$2f$basicRateLimit$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/security/basicRateLimit.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$serverSession$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/serverSession.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$auth__$5b$external$5d$__$28$firebase$2d$admin$2f$auth$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$firebase$2d$admin$29$__ = __turbopack_context__.i("[externals]/firebase-admin/auth [external] (firebase-admin/auth, esm_import, [project]/node_modules/firebase-admin)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$userProfileSync$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/userProfileSync.ts [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebaseAdmin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$auth__$5b$external$5d$__$28$firebase$2d$admin$2f$auth$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$firebase$2d$admin$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$userProfileSync$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebaseAdmin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$auth__$5b$external$5d$__$28$firebase$2d$admin$2f$auth$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$firebase$2d$admin$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$userProfileSync$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
;
;
const runtime = "nodejs";
const HASH_ALGORITHM = "SHA-256";
const APP_PEPPER = "sai-usercontrol-v1";
const USER_COLLECTION = "sai-usercontrol";
const AUTH_VERIFY_IP_LIMIT_MAX = Number(process.env.AUTH_VERIFY_RATE_LIMIT_IP_MAX ?? "10");
const AUTH_VERIFY_EMAIL_LIMIT_MAX = Number(process.env.AUTH_VERIFY_RATE_LIMIT_EMAIL_MAX ?? "5");
const AUTH_VERIFY_EMAIL_GLOBAL_LIMIT_MAX = Number(process.env.AUTH_VERIFY_RATE_LIMIT_EMAIL_GLOBAL_MAX ?? "12");
const AUTH_VERIFY_LIMIT_WINDOW_MS = Number(process.env.AUTH_VERIFY_RATE_LIMIT_WINDOW_MS ?? "60000");
const buildSalt = (saltBase64)=>Buffer.concat([
        Buffer.from(saltBase64, "base64"),
        Buffer.from(APP_PEPPER)
    ]);
const hashPassword = (password, saltBase64, iterations)=>new Promise((resolve, reject)=>{
        __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["default"].pbkdf2(password, buildSalt(saltBase64), iterations, 32, "sha256", (error, derivedKey)=>{
            if (error) {
                reject(error);
                return;
            }
            resolve(derivedKey.toString("base64"));
        });
    });
const verifyPassword = async (password, digest)=>{
    if (!digest.passwordHash || !digest.passwordSalt || !digest.passwordIterations || digest.passwordHashAlgorithm && digest.passwordHashAlgorithm !== HASH_ALGORITHM) {
        return false;
    }
    const candidate = await hashPassword(password, digest.passwordSalt, digest.passwordIterations);
    return candidate === digest.passwordHash;
};
async function POST(request) {
    let body = {};
    try {
        body = await request.json();
    } catch  {
        body = {};
    }
    const email = body.email?.trim().toLowerCase() ?? "";
    const password = body.password ?? "";
    const idToken = body.idToken?.trim() ?? "";
    const firebaseAdminProjectId = process.env.NEXT_FIREBASE_ADMIN_PROJECT_ID ?? "";
    const firebaseClientProjectId = ("TURBOPACK compile-time value", "funcionarioslistaapp2025") ?? "";
    const projectMismatch = Boolean(firebaseAdminProjectId && firebaseClientProjectId && firebaseAdminProjectId !== firebaseClientProjectId);
    if (projectMismatch) {
        console.warn("[Auth Verify API] Firebase project mismatch detected", {
            firebaseAdminProjectId,
            firebaseClientProjectId,
            route: "/api/auth/verify"
        });
    }
    const clientIp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$security$2f$basicRateLimit$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["resolveClientIp"])(request);
    const ipRateLimit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$security$2f$basicRateLimit$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consumeRateLimit"])({
        namespace: "auth-verify-ip",
        key: clientIp,
        maxRequests: AUTH_VERIFY_IP_LIMIT_MAX,
        windowMs: AUTH_VERIFY_LIMIT_WINDOW_MS
    });
    if (!ipRateLimit.allowed) {
        const response = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Too many verification attempts. Please try again shortly."
        }, {
            status: 429
        });
        response.headers.set("Retry-After", String(ipRateLimit.retryAfterSeconds));
        return response;
    }
    if (email) {
        const emailRateLimit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$security$2f$basicRateLimit$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consumeRateLimit"])({
            namespace: "auth-verify-email",
            key: `${clientIp}:${email}`,
            maxRequests: AUTH_VERIFY_EMAIL_LIMIT_MAX,
            windowMs: AUTH_VERIFY_LIMIT_WINDOW_MS
        });
        if (!emailRateLimit.allowed) {
            const response = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Too many verification attempts for this account. Please try again shortly."
            }, {
                status: 429
            });
            response.headers.set("Retry-After", String(emailRateLimit.retryAfterSeconds));
            return response;
        }
        const emailGlobalRateLimit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$security$2f$basicRateLimit$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consumeRateLimit"])({
            namespace: "auth-verify-email-global",
            key: email,
            maxRequests: AUTH_VERIFY_EMAIL_GLOBAL_LIMIT_MAX,
            windowMs: AUTH_VERIFY_LIMIT_WINDOW_MS
        });
        if (!emailGlobalRateLimit.allowed) {
            const response = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Too many verification attempts for this account. Please try again shortly."
            }, {
                status: 429
            });
            response.headers.set("Retry-After", String(emailGlobalRateLimit.retryAfterSeconds));
            return response;
        }
    }
    if (!email || !password) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Missing credentials."
        }, {
            status: 400
        });
    }
    try {
        const db = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$firebaseAdmin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getAdminFirestore"])();
        if (idToken) {
            const adminAuth = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$auth__$5b$external$5d$__$28$firebase$2d$admin$2f$auth$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$firebase$2d$admin$29$__["getAuth"])();
            const decoded = await adminAuth.verifyIdToken(idToken, true);
            const authUser = await adminAuth.getUser(decoded.uid);
            const authEmail = (authUser.email ?? email).trim().toLowerCase();
            if (authEmail !== email) {
                console.warn("[Auth Verify API] email mismatch for idToken login", {
                    uid: decoded.uid,
                    payloadEmail: email,
                    authEmail
                });
            }
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$userProfileSync$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["syncUserProfileFromAuth"])({
                uid: decoded.uid,
                email: authEmail,
                displayName: authUser.displayName ?? "",
                provider: "password",
                db
            });
            const sessionToken = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$serverSession$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createSessionToken"])({
                sub: decoded.uid,
                email: authEmail
            });
            const response = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                ok: true,
                profile: {
                    user_id: decoded.uid,
                    uid: decoded.uid,
                    name: authUser.displayName ?? "",
                    email: authEmail
                }
            });
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$serverSession$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["setSessionCookie"])(response, sessionToken);
            return response;
        }
        const snapshot = await db.collection(USER_COLLECTION).where("email", "==", email).limit(1).get();
        const matchedDoc = snapshot.empty ? null : snapshot.docs[0] ?? null;
        const record = matchedDoc ? matchedDoc.data() : null;
        const firestoreDocId = matchedDoc?.id ?? "";
        if (!record) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "No account was found with these credentials."
            }, {
                status: 401
            });
        }
        const usesDigest = Boolean(record.passwordHash && record.passwordSalt);
        const isValid = usesDigest ? await verifyPassword(password, record) : record.password === password;
        if (!isValid) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "No account was found with these credentials."
            }, {
                status: 401
            });
        }
        const canonicalUserId = record.uid?.trim() || firestoreDocId;
        if (matchedDoc && record.user_id !== canonicalUserId) {
            await matchedDoc.ref.set({
                user_id: canonicalUserId,
                uid: canonicalUserId
            }, {
                merge: true
            });
        }
        const sessionToken = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$serverSession$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createSessionToken"])({
            sub: canonicalUserId,
            email
        });
        const response = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            ok: true,
            profile: {
                user_id: canonicalUserId,
                name: record.displayName ?? record.name ?? "",
                email
            }
        });
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$serverSession$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["setSessionCookie"])(response, sessionToken);
        return response;
    } catch (error) {
        console.error("[Auth Verify API] credential check failed:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Unable to verify credentials right now."
        }, {
            status: 500
        });
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__1cfe9eb1._.js.map