module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

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
"[project]/app/sharetechmono_de18a0cb.module.css [app-ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "className": "sharetechmono_de18a0cb-module__i_kq6q__className",
  "variable": "sharetechmono_de18a0cb-module__i_kq6q__variable",
});
}),
"[project]/app/sharetechmono_de18a0cb.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$sharetechmono_de18a0cb$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/app/sharetechmono_de18a0cb.module.css [app-ssr] (css module)");
;
const fontData = {
    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$sharetechmono_de18a0cb$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].className,
    style: {
        fontFamily: "'shareTechMono', 'shareTechMono Fallback'"
    }
};
if (__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$sharetechmono_de18a0cb$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].variable != null) {
    fontData.variable = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$sharetechmono_de18a0cb$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].variable;
}
const __TURBOPACK__default__export__ = fontData;
}),
"[project]/app/fonts.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$sharetechmono_de18a0cb$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/sharetechmono_de18a0cb.js [app-ssr] (ecmascript)");
;
;
}),
"[project]/app/sharetechmono_de18a0cb.js [app-ssr] (ecmascript) <export default as shareTechMono>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "shareTechMono",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$sharetechmono_de18a0cb$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$sharetechmono_de18a0cb$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/sharetechmono_de18a0cb.js [app-ssr] (ecmascript)");
}),
"[project]/app/lib/authAlerts.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "VSModalPaged",
    ()=>VSModalPaged
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sweetalert2$2f$dist$2f$sweetalert2$2e$esm$2e$all$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sweetalert2/dist/sweetalert2.esm.all.js [app-ssr] (ecmascript)");
;
const VSModalPaged = async ({ title, messages, tone = "error", confirmText = "Next" })=>{
    const iconSvg = tone === "success" ? `
<svg class="vs-auth-alert-icon-svg" viewBox="0 0 64 64" aria-hidden="true" focusable="false">
  <circle cx="32" cy="32" r="26" fill="none" stroke="currentColor" stroke-width="4"></circle>
  <path d="M20 33l8 8 16-18" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></path>
</svg>` : `
<svg class="vs-auth-alert-icon-svg" viewBox="0 0 64 64" aria-hidden="true" focusable="false">
  <circle cx="32" cy="32" r="26" fill="none" stroke="currentColor" stroke-width="4"></circle>
  <path d="M22 22l20 20" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"></path>
  <path d="M42 22l-20 20" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"></path>
</svg>`;
    const steps = messages.map((_, i)=>`${i + 1}`);
    const base = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sweetalert2$2f$dist$2f$sweetalert2$2e$esm$2e$all$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].mixin({
        buttonsStyling: false,
        customClass: {
            popup: "vs-auth-alert-popup",
            htmlContainer: "vs-auth-alert-html",
            confirmButton: "vs-auth-alert-button"
        },
        showConfirmButton: true,
        progressSteps: steps
    });
    let i = 0;
    while(i < messages.length){
        const isLast = i === messages.length - 1;
        const result = await base.fire({
            currentProgressStep: i,
            html: `
<div class="vs-auth-alert-inner" role="status" aria-live="polite">
  <div class="vs-auth-alert-icon">${iconSvg}</div>
  <h2 class="vs-auth-alert-title">${title}</h2>
  <p class="vs-auth-alert-message">${messages[i]}</p>
</div>`,
            confirmButtonText: isLast ? "Ok" : confirmText,
            // Opcional: permitir fechar
            showCloseButton: false,
            // Opcional: impedir clique fora
            allowOutsideClick: true
        });
        if (result.isConfirmed) {
            if (isLast) break;
            i += 1;
            continue;
            break;
        }
    }
};
}),
"[project]/app/lib/SafeStorage.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getLS",
    ()=>getLS,
    "removeLS",
    ()=>removeLS,
    "setLS",
    ()=>setLS
]);
function getLS(key) {
    if ("TURBOPACK compile-time truthy", 1) return null;
    //TURBOPACK unreachable
    ;
}
function setLS(key, value) {
    if ("TURBOPACK compile-time truthy", 1) return;
    //TURBOPACK unreachable
    ;
}
function removeLS(key) {
    if ("TURBOPACK compile-time truthy", 1) return;
    //TURBOPACK unreachable
    ;
}
}),
"[project]/app/lib/authSession.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AUTH_SESSION_PROFILE_KEY",
    ()=>AUTH_SESSION_PROFILE_KEY,
    "AUTH_SESSION_TOKEN_KEY",
    ()=>AUTH_SESSION_TOKEN_KEY,
    "clearAuthSessionProfile",
    ()=>clearAuthSessionProfile,
    "clearAuthSessionToken",
    ()=>clearAuthSessionToken,
    "getAuthSessionProfile",
    ()=>getAuthSessionProfile,
    "getAuthSessionToken",
    ()=>getAuthSessionToken,
    "setAuthSessionProfile",
    ()=>setAuthSessionProfile,
    "setAuthSessionToken",
    ()=>setAuthSessionToken
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$SafeStorage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/SafeStorage.ts [app-ssr] (ecmascript)");
;
const AUTH_SESSION_TOKEN_KEY = "restaurantcards_auth_token";
const AUTH_SESSION_PROFILE_KEY = "restaurantcards_auth_profile";
const AUTH_SESSION_TOKEN_TTL_MS = 1000 * 60 * 60 * 12;
const parseExpiringToken = (raw)=>{
    if (!raw) return null;
    try {
        const parsed = JSON.parse(raw);
        if (!parsed?.token || typeof parsed.expiresAt !== "number") return null;
        return parsed;
    } catch  {
        return {
            token: raw,
            expiresAt: Date.now() + AUTH_SESSION_TOKEN_TTL_MS
        };
    }
};
const getAuthSessionToken = ()=>{
    const parsed = parseExpiringToken((0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$SafeStorage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getLS"])(AUTH_SESSION_TOKEN_KEY));
    if (!parsed) return "";
    if (parsed.expiresAt <= Date.now()) {
        clearAuthSessionToken();
        return "";
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$SafeStorage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setLS"])(AUTH_SESSION_TOKEN_KEY, JSON.stringify(parsed));
    return parsed.token;
};
const setAuthSessionToken = (token)=>{
    const payload = {
        token,
        expiresAt: Date.now() + AUTH_SESSION_TOKEN_TTL_MS
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$SafeStorage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setLS"])(AUTH_SESSION_TOKEN_KEY, JSON.stringify(payload));
};
const clearAuthSessionToken = ()=>{
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$SafeStorage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["removeLS"])(AUTH_SESSION_TOKEN_KEY);
};
const getAuthSessionProfile = ()=>{
    const raw = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$SafeStorage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getLS"])(AUTH_SESSION_PROFILE_KEY);
    if (!raw) return {};
    try {
        return JSON.parse(raw);
    } catch  {
        return {};
    }
};
const setAuthSessionProfile = (profile)=>{
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$SafeStorage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setLS"])(AUTH_SESSION_PROFILE_KEY, JSON.stringify(profile));
};
const clearAuthSessionProfile = ()=>{
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$SafeStorage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["removeLS"])(AUTH_SESSION_PROFILE_KEY);
};
}),
"[project]/app/lib/devSession.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DEV_SESSION_TOKEN_KEY",
    ()=>DEV_SESSION_TOKEN_KEY,
    "clearDevSessionToken",
    ()=>clearDevSessionToken,
    "getDevSessionToken",
    ()=>getDevSessionToken,
    "setDevSessionToken",
    ()=>setDevSessionToken
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$SafeStorage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/SafeStorage.ts [app-ssr] (ecmascript)");
;
const DEV_SESSION_TOKEN_KEY = "devAuthToken";
const DEV_SESSION_TOKEN_TTL_MS = 1000 * 60 * 60 * 12;
const parseExpiringToken = (raw)=>{
    if (!raw) return null;
    try {
        const parsed = JSON.parse(raw);
        if (!parsed?.token || typeof parsed.expiresAt !== "number") return null;
        return parsed;
    } catch  {
        return {
            token: raw,
            expiresAt: Date.now() + DEV_SESSION_TOKEN_TTL_MS
        };
    }
};
const getDevSessionToken = ()=>{
    const parsed = parseExpiringToken((0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$SafeStorage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getLS"])(DEV_SESSION_TOKEN_KEY));
    if (!parsed) return "";
    if (parsed.expiresAt <= Date.now()) {
        clearDevSessionToken();
        return "";
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$SafeStorage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setLS"])(DEV_SESSION_TOKEN_KEY, JSON.stringify(parsed));
    return parsed.token;
};
const setDevSessionToken = (token)=>{
    const payload = {
        token,
        expiresAt: Date.now() + DEV_SESSION_TOKEN_TTL_MS
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$SafeStorage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setLS"])(DEV_SESSION_TOKEN_KEY, JSON.stringify(payload));
};
const clearDevSessionToken = ()=>{
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$SafeStorage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["removeLS"])(DEV_SESSION_TOKEN_KEY);
};
}),
"[project]/app/lib/accessTokenShare.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "STYLISTAI_ACCESS_DATA_KEY",
    ()=>STYLISTAI_ACCESS_DATA_KEY,
    "STYLISTAI_ACCESS_TOKEN_KEY",
    ()=>STYLISTAI_ACCESS_TOKEN_KEY,
    "clearSharedAccessToken",
    ()=>clearSharedAccessToken,
    "ensureSharedAccessToken",
    ()=>ensureSharedAccessToken,
    "getSharedAccessData",
    ()=>getSharedAccessData,
    "getSharedAccessToken",
    ()=>getSharedAccessToken,
    "resolveAnyAccessToken",
    ()=>resolveAnyAccessToken,
    "setSharedAccessData",
    ()=>setSharedAccessData,
    "setSharedAccessToken",
    ()=>setSharedAccessToken
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$SafeStorage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/SafeStorage.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$authSession$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/authSession.ts [app-ssr] (ecmascript)");
;
;
const STYLISTAI_ACCESS_TOKEN_KEY = 'stylistai_content_access_token';
const STYLISTAI_ACCESS_DATA_KEY = 'stylistai_content_access_data';
const getSharedAccessToken = ()=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$SafeStorage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getLS"])(STYLISTAI_ACCESS_TOKEN_KEY) ?? '';
};
const setSharedAccessToken = (token)=>{
    if (!token) return;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$SafeStorage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setLS"])(STYLISTAI_ACCESS_TOKEN_KEY, token);
};
const getSharedAccessData = ()=>{
    const raw = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$SafeStorage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getLS"])(STYLISTAI_ACCESS_DATA_KEY);
    if (!raw) return null;
    try {
        const parsed = JSON.parse(raw);
        if (!parsed?.token) return null;
        return parsed;
    } catch  {
        return null;
    }
};
const setSharedAccessData = (data)=>{
    if (!data?.token) return;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$SafeStorage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setLS"])(STYLISTAI_ACCESS_DATA_KEY, JSON.stringify(data));
    setSharedAccessToken(data.token);
};
const clearSharedAccessToken = ()=>{
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$SafeStorage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["removeLS"])(STYLISTAI_ACCESS_TOKEN_KEY);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$SafeStorage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["removeLS"])(STYLISTAI_ACCESS_DATA_KEY);
};
const resolveAnyAccessToken = ()=>{
    return getSharedAccessData()?.token || getSharedAccessToken() || (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$authSession$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getAuthSessionToken"])();
};
const ensureSharedAccessToken = ()=>{
    const resolved = resolveAnyAccessToken();
    if (resolved) {
        setSharedAccessData({
            token: resolved,
            profile: getSharedAccessData()?.profile ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$authSession$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getAuthSessionProfile"])()
        });
    }
    return resolved;
};
}),
"[project]/app/gate/firebaseClient.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "firebaseAuthGate",
    ()=>firebaseAuthGate
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$app$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/app/dist/index.mjs [app-ssr] (ecmascript) <locals>");
"use client";
;
function firebaseAuthGate() {
    // blindagem extra (caso algum import aconteça fora do client)
    if ("TURBOPACK compile-time truthy", 1) {
        return {
            firebaseApp: null,
            hasFirebaseConfig: false
        };
    }
    //TURBOPACK unreachable
    ;
    const firebaseConfig = undefined;
    const hasFirebaseConfig = undefined;
    const firebaseApp = undefined;
}
}),
"[project]/app/auth.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DELETED_GOOGLE_CLIENT_USER_MESSAGE",
    ()=>DELETED_GOOGLE_CLIENT_USER_MESSAGE,
    "extractOAuthErrorDetails",
    ()=>extractOAuthErrorDetails,
    "resolveOAuthUserMessage",
    ()=>resolveOAuthUserMessage,
    "signInWithFacebook",
    ()=>signInWithFacebook,
    "signInWithGoogle",
    ()=>signInWithGoogle,
    "signInWithGoogleRedirect",
    ()=>signInWithGoogleRedirect,
    "signOutUser",
    ()=>signOutUser
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$auth$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/auth/dist/index.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$node$2d$esm$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/auth/dist/node-esm/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$gate$2f$firebaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/gate/firebaseClient.ts [app-ssr] (ecmascript)");
"use client";
;
;
const provider = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$node$2d$esm$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GoogleAuthProvider"]();
const facebookProvider = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$node$2d$esm$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FacebookAuthProvider"]();
provider.setCustomParameters({
    prompt: "select_account"
});
const DELETED_GOOGLE_CLIENT_USER_MESSAGE = "Login temporarily unavailable. Please try again later.";
function extractOAuthErrorDetails(error) {
    const err = error ?? {};
    const tokenResponseError = err.customData?._tokenResponse?.error;
    const loweredMessage = (err.message ?? "").toLowerCase();
    const loweredTokenError = (tokenResponseError ?? "").toLowerCase();
    const isDeletedClient = loweredMessage.includes("deleted_client") || loweredTokenError.includes("deleted_client");
    return {
        code: err.code ?? "auth/unknown",
        message: err.message ?? "Unknown OAuth error.",
        providerId: err.customData?.providerId,
        operationType: err.customData?.operationType,
        credentialProviderId: err.credential?.providerId,
        tokenResponseError,
        isDeletedClient
    };
}
function resolveOAuthUserMessage(error, fallbackMessage) {
    const oauthError = extractOAuthErrorDetails(error);
    if (oauthError.isDeletedClient) {
        return DELETED_GOOGLE_CLIENT_USER_MESSAGE;
    }
    return fallbackMessage;
}
async function signInWithGoogle() {
    const { firebaseApp, hasFirebaseConfig } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$gate$2f$firebaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["firebaseAuthGate"])();
    if (!firebaseApp || !hasFirebaseConfig) {
        throw new Error("Firebase auth is not configured.");
    }
    const auth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$node$2d$esm$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getAuth"])(firebaseApp);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$node$2d$esm$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["signInWithPopup"])(auth, provider);
}
async function signInWithGoogleRedirect() {
    const { firebaseApp, hasFirebaseConfig } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$gate$2f$firebaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["firebaseAuthGate"])();
    if (!firebaseApp || !hasFirebaseConfig) {
        throw new Error("Firebase auth is not configured.");
    }
    const auth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$node$2d$esm$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getAuth"])(firebaseApp);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$node$2d$esm$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["signInWithRedirect"])(auth, provider);
}
async function signInWithFacebook() {
    const { firebaseApp, hasFirebaseConfig } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$gate$2f$firebaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["firebaseAuthGate"])();
    if (!firebaseApp || !hasFirebaseConfig) {
        throw new Error("Firebase auth is not configured.");
    }
    const auth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$node$2d$esm$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getAuth"])(firebaseApp);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$node$2d$esm$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["signInWithPopup"])(auth, facebookProvider);
}
async function signOutUser() {
    const { firebaseApp, hasFirebaseConfig } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$gate$2f$firebaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["firebaseAuthGate"])();
    if (!firebaseApp || !hasFirebaseConfig) return;
    const auth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$node$2d$esm$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getAuth"])(firebaseApp);
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$node$2d$esm$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["signOut"])(auth);
}
}),
"[project]/app/lib/pageBackground.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DEFAULT_PAGE_BACKGROUND_CONFIG",
    ()=>DEFAULT_PAGE_BACKGROUND_CONFIG,
    "DEFAULT_SHELL_BACKGROUND_IMAGE",
    ()=>DEFAULT_SHELL_BACKGROUND_IMAGE,
    "GOLDEN_BACKGROUND_ASSET",
    ()=>GOLDEN_BACKGROUND_ASSET,
    "GOLDEN_WEBSITE_BACKGROUND_GRADIENT",
    ()=>GOLDEN_WEBSITE_BACKGROUND_GRADIENT,
    "OFFICIAL_WEBSITE_BACKGROUND_GRADIENT",
    ()=>OFFICIAL_WEBSITE_BACKGROUND_GRADIENT,
    "applyPageBackgroundConfig",
    ()=>applyPageBackgroundConfig,
    "ensureSavedPageBackgroundConfig",
    ()=>ensureSavedPageBackgroundConfig,
    "readPageBackgroundConfig",
    ()=>readPageBackgroundConfig,
    "savePageBackgroundConfig",
    ()=>savePageBackgroundConfig
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$SafeStorage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/SafeStorage.ts [app-ssr] (ecmascript)");
;
const PAGE_BACKGROUND_KEY = 'sai_page_background_config';
const DEFAULT_SHELL_BACKGROUND_IMAGE = '/Fart.png';
const GOLDEN_BACKGROUND_ASSET = '/Firefly_Consegue adicionar quebras de linha tech ao gradiente (adicionar ranhuras) 3787887.jpg';
const OFFICIAL_WEBSITE_BACKGROUND_GRADIENT = `url("data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='1600' height='1000'>
    <defs>
      <linearGradient id='base' x1='0' y1='0' x2='1' y2='1'>
        <stop offset='0%' stop-color='#f973c9'/>
        <stop offset='26%' stop-color='#a855f7'/>
        <stop offset='58%' stop-color='#7c3aed'/>
        <stop offset='100%' stop-color='#f59e0b'/>
      </linearGradient>
      <radialGradient id='glowA' cx='25%' cy='20%' r='60%'>
        <stop offset='0%' stop-color='rgba(255,224,138,0.85)'/>
        <stop offset='100%' stop-color='rgba(255,224,138,0)'/>
      </radialGradient>
      <radialGradient id='glowB' cx='72%' cy='28%' r='62%'>
        <stop offset='0%' stop-color='rgba(96,165,250,0.68)'/>
        <stop offset='100%' stop-color='rgba(96,165,250,0)'/>
      </radialGradient>
    </defs>
    <rect width='1600' height='1000' fill='url(#base)'/>
    <path d='M0,540 C220,430 420,650 650,560 C860,485 980,360 1250,420 C1420,458 1530,580 1600,660 L1600,1000 L0,1000 Z' fill='rgba(255,118,117,0.45)'/>
    <path d='M0,280 C210,170 410,380 650,300 C870,230 1030,80 1290,135 C1425,165 1525,255 1600,330 L1600,620 C1500,515 1380,440 1210,430 C970,416 830,532 600,600 C360,670 170,505 0,600 Z' fill='rgba(147,197,253,0.32)'/>
    <rect width='1600' height='1000' fill='url(#glowA)'/>
    <rect width='1600' height='1000' fill='url(#glowB)'/>
  </svg>`)}")`;
const GOLDEN_WEBSITE_BACKGROUND_GRADIENT = [
    'linear-gradient(132deg, rgba(8, 6, 2, 0.82) 0%, rgba(42, 25, 7, 0.78) 38%, rgba(12, 10, 7, 0.9) 100%)',
    'linear-gradient(118deg, rgba(255, 214, 120, 0.3) 0%, rgba(240, 180, 66, 0.16) 44%, rgba(52, 33, 11, 0.48) 100%)',
    'repeating-linear-gradient(-20deg, rgba(255, 233, 172, 0.14) 0 1px, rgba(17, 12, 4, 0) 1px 18px)',
    'repeating-linear-gradient(88deg, rgba(252, 221, 149, 0.08) 0 2px, rgba(28, 18, 6, 0) 2px 26px)',
    `url("${GOLDEN_BACKGROUND_ASSET}")`
].join(', ');
const DEFAULT_PAGE_BACKGROUND_CONFIG = {
    gradient: [
        'radial-gradient(circle at 14% 14%, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0.04) 44%)',
        'radial-gradient(circle at 84% 10%, rgba(191, 172, 255, 0.24) 0%, rgba(191, 172, 255, 0) 45%)',
        'linear-gradient(130deg, rgba(235, 226, 255, 0.42) 0%, rgba(255, 214, 226, 0.34) 40%, rgba(206, 225, 255, 0.3) 72%, rgba(255, 234, 210, 0.26) 100%)',
        `url('${DEFAULT_SHELL_BACKGROUND_IMAGE}')`
    ].join(', '),
    shape: 'orb'
};
const withTechGrooves = (base, opacity = 0.1)=>[
        'linear-gradient(160deg, rgba(12, 10, 8, 0.74) 0%, rgba(22, 16, 8, 0.5) 58%, rgba(8, 6, 4, 0.82) 100%)',
        `repeating-linear-gradient(135deg, rgba(255, 240, 200, ${opacity}) 0 1px, rgba(10, 7, 3, 0) 1px 14px)`,
        `repeating-linear-gradient(95deg, rgba(241, 201, 120, ${Math.max(opacity - 0.04, 0.03)}) 0 2px, rgba(10, 7, 3, 0) 2px 24px)`,
        base
    ].join(', ');
const isGoldenBackground = (gradient)=>gradient.includes(GOLDEN_BACKGROUND_ASSET);
const withDefaultBackgroundFallback = (gradient)=>gradient.includes(DEFAULT_SHELL_BACKGROUND_IMAGE) ? gradient : `${gradient}, url('${DEFAULT_SHELL_BACKGROUND_IMAGE}')`;
const normalizePageBackgroundConfig = (candidate)=>({
        gradient: withDefaultBackgroundFallback(candidate?.gradient || DEFAULT_PAGE_BACKGROUND_CONFIG.gradient),
        shape: candidate?.shape || DEFAULT_PAGE_BACKGROUND_CONFIG.shape
    });
const readPageBackgroundConfig = ()=>{
    const raw = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$SafeStorage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getLS"])(PAGE_BACKGROUND_KEY);
    if (!raw) return normalizePageBackgroundConfig(DEFAULT_PAGE_BACKGROUND_CONFIG);
    try {
        const parsed = JSON.parse(raw);
        return normalizePageBackgroundConfig(parsed);
    } catch  {
        return normalizePageBackgroundConfig(DEFAULT_PAGE_BACKGROUND_CONFIG);
    }
};
const applyPageBackgroundConfig = (config)=>{
    if (typeof document === 'undefined') return;
    const resolvedBackground = withDefaultBackgroundFallback(config.gradient);
    document.documentElement.style.setProperty('--home-shell-bg', resolvedBackground);
    document.documentElement.style.setProperty('--sidebar-gradient', withTechGrooves(resolvedBackground, isGoldenBackground(resolvedBackground) ? 0.16 : 0.09));
    document.documentElement.style.setProperty('--sidebar-gradient-soft', withTechGrooves(resolvedBackground, isGoldenBackground(resolvedBackground) ? 0.12 : 0.07));
    document.documentElement.style.setProperty('--drawer-surface-bg', withTechGrooves(resolvedBackground, isGoldenBackground(resolvedBackground) ? 0.2 : 0.08));
    document.documentElement.style.setProperty('--drawer-surface-border', isGoldenBackground(resolvedBackground) ? 'rgba(255, 220, 150, 0.5)' : 'rgba(255, 255, 255, 0.3)');
    document.documentElement.style.setProperty('--drawer-surface-shadow', isGoldenBackground(resolvedBackground) ? '0 22px 50px rgba(92, 54, 8, 0.55)' : '0 22px 50px rgba(12, 24, 18, 0.45)');
    document.documentElement.setAttribute('data-home-shape', config.shape);
};
const savePageBackgroundConfig = (config)=>{
    const normalized = normalizePageBackgroundConfig(config);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$SafeStorage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setLS"])(PAGE_BACKGROUND_KEY, JSON.stringify(normalized));
    applyPageBackgroundConfig(normalized);
};
const ensureSavedPageBackgroundConfig = ()=>{
    const raw = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$SafeStorage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getLS"])(PAGE_BACKGROUND_KEY);
    if (!raw) {
        savePageBackgroundConfig(DEFAULT_PAGE_BACKGROUND_CONFIG);
        return normalizePageBackgroundConfig(DEFAULT_PAGE_BACKGROUND_CONFIG);
    }
    try {
        const parsed = JSON.parse(raw);
        const normalized = normalizePageBackgroundConfig(parsed);
        if (JSON.stringify(parsed) !== JSON.stringify(normalized)) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$SafeStorage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setLS"])(PAGE_BACKGROUND_KEY, JSON.stringify(normalized));
        }
        return normalized;
    } catch  {
        savePageBackgroundConfig(DEFAULT_PAGE_BACKGROUND_CONFIG);
        return normalizePageBackgroundConfig(DEFAULT_PAGE_BACKGROUND_CONFIG);
    }
};
}),
"[project]/app/authview/AuthViewClient.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AuthViewClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$fonts$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/app/fonts.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$sharetechmono_de18a0cb$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__shareTechMono$3e$__ = __turbopack_context__.i("[project]/app/sharetechmono_de18a0cb.js [app-ssr] (ecmascript) <export default as shareTechMono>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$authAlerts$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/authAlerts.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$authSession$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/authSession.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$devSession$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/devSession.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$accessTokenShare$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/accessTokenShare.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/auth.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$pageBackground$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/pageBackground.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$gate$2f$firebaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/gate/firebaseClient.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$auth$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/auth/dist/index.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$node$2d$esm$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/auth/dist/node-esm/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$app$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/app/dist/index.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/app/dist/esm/index.esm.js [app-ssr] (ecmascript)");
"use client";
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
const ff = `${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$sharetechmono_de18a0cb$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__shareTechMono$3e$__["shareTechMono"].style.fontFamily}, 'Inter', 'Segoe UI', Arial, sans-serif`;
const metallicGradient = 'linear-gradient(135deg, #f7e7b2 0%, #d4af37 28%, #f4f4f5 52%, #a3a3a3 74%, #fff5cf 100%)';
const REMEMBERED_EMAIL_KEY = "rememberedEmail";
const SKIPPABLE_FIREBASE_ERROR_CODES = new Set([
    "auth/api-key-not-valid.-please-pass-a-valid-api-key.",
    "auth/invalid-api-key",
    "auth/network-request-failed",
    "auth/configuration-not-found",
    "auth/app-deleted",
    "auth/app-not-authorized"
]);
const normalizeFirebaseErrorCode = (error)=>{
    const maybeAuthError = error;
    return (maybeAuthError?.code ?? "").trim().toLowerCase();
};
const shouldSkipFirebaseSignIn = (error)=>{
    const normalizedCode = normalizeFirebaseErrorCode(error);
    return SKIPPABLE_FIREBASE_ERROR_CODES.has(normalizedCode);
};
const EyeIcon = ({ open })=>open ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        width: "20",
        height: "20",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
            }, void 0, false, {
                fileName: "[project]/app/authview/AuthViewClient.tsx",
                lineNumber: 54,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: "1",
                y1: "1",
                x2: "23",
                y2: "23"
            }, void 0, false, {
                fileName: "[project]/app/authview/AuthViewClient.tsx",
                lineNumber: 54,
                columnNumber: 201
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/app/authview/AuthViewClient.tsx",
        lineNumber: 53,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        width: "20",
        height: "20",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
            }, void 0, false, {
                fileName: "[project]/app/authview/AuthViewClient.tsx",
                lineNumber: 58,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "12",
                cy: "12",
                r: "3"
            }, void 0, false, {
                fileName: "[project]/app/authview/AuthViewClient.tsx",
                lineNumber: 58,
                columnNumber: 65
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/app/authview/AuthViewClient.tsx",
        lineNumber: 57,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
function AuthViewClient() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const [email, setEmail] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [password, setPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [showPassword, setShowPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [rememberMe, setRememberMe] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [submitting, setSubmitting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showForgotModal, setShowForgotModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [forgotEmail, setForgotEmail] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [submittingForgot, setSubmittingForgot] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [socialSubmitting, setSocialSubmitting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [socialErrorMessage, setSocialErrorMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [emailLoginErrorMessage, setEmailLoginErrorMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePathname"])();
    const { firebaseApp, hasFirebaseConfig } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$gate$2f$firebaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["firebaseAuthGate"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        // TODO: reativar verificação do devauthgate em produção
        // const t = getDevSessionToken();
        // if (!t) router.replace("/devauthgate");
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$accessTokenShare$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ensureSharedAccessToken"])();
    }, [
        router
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (pathname !== "/authview") return;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$authSession$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clearAuthSessionToken"])();
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$accessTokenShare$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clearSharedAccessToken"])();
    }, [
        pathname
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if ("TURBOPACK compile-time truthy", 1) return;
        //TURBOPACK unreachable
        ;
        const savedEmail = undefined;
    }, []);
    const setFirebasePersistenceMode = async ()=>{
        if (!firebaseApp || !hasFirebaseConfig) {
            console.log("Persistence set:", "SESSION");
            return "SESSION";
        }
        const auth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$node$2d$esm$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getAuth"])(firebaseApp);
        try {
            if (rememberMe) {
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$node$2d$esm$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setPersistence"])(auth, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$node$2d$esm$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["browserLocalPersistence"]);
                console.log("Persistence set:", "LOCAL");
                return "LOCAL";
            }
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$node$2d$esm$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setPersistence"])(auth, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$node$2d$esm$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["browserSessionPersistence"]);
            console.log("Persistence set:", "SESSION");
            return "SESSION";
        } catch (error) {
            console.error("[AuthView] Failed to set selected persistence, falling back to SESSION:", error);
            try {
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$node$2d$esm$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setPersistence"])(auth, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$node$2d$esm$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["browserSessionPersistence"]);
            } catch (fallbackError) {
                console.error("[AuthView] Failed to set SESSION fallback persistence:", fallbackError);
            }
            console.log("Persistence set:", "SESSION");
            return "SESSION";
        }
    };
    const handleSubmit = async (event)=>{
        event.preventDefault();
        if (submitting) return;
        setSubmitting(true);
        setEmailLoginErrorMessage("");
        const normalizedEmail = email.trim().toLowerCase();
        const normalizedPassword = password;
        const clientProjectId = firebaseApp?.options.projectId ?? ("TURBOPACK compile-time value", "funcionarioslistaapp2025") ?? "";
        const authDomain = firebaseApp?.options.authDomain ?? ("TURBOPACK compile-time value", "funcionarioslistaapp2025.firebaseapp.com") ?? "";
        const appName = firebaseApp?.name ?? "none";
        console.info("[AuthView] Login attempt", {
            provider: "password",
            normalizedEmail,
            projectId: clientProjectId,
            authDomain,
            hasFirebaseConfig,
            firebaseAppName: appName,
            rememberMe,
            route: "/authview"
        });
        if (!normalizedEmail || !normalizedPassword) {
            setSubmitting(false);
            setEmailLoginErrorMessage("E-mail e senha são obrigatórios.");
            void (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$authAlerts$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["VSModalPaged"])({
                title: "Dados obrigatórios",
                messages: [
                    "Informe seu e-mail e sua senha para continuar."
                ],
                tone: "error"
            });
            return;
        }
        try {
            await setFirebasePersistenceMode();
            let firebaseIdToken = "";
            if (firebaseApp && hasFirebaseConfig) {
                const auth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$node$2d$esm$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getAuth"])(firebaseApp);
                try {
                    const credential = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$node$2d$esm$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["signInWithEmailAndPassword"])(auth, normalizedEmail, normalizedPassword);
                    firebaseIdToken = await credential.user.getIdToken(true);
                    console.info("[AuthView] Firebase email/password sign-in succeeded", {
                        provider: "password",
                        normalizedEmail,
                        projectId: clientProjectId
                    });
                } catch (error) {
                    const firebaseError = error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FirebaseError"] ? error : null;
                    const errorCode = firebaseError?.code ?? "auth/unknown";
                    const errorMessage = firebaseError?.message ?? "Unknown Firebase auth error.";
                    let signInMethods = [];
                    try {
                        signInMethods = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$node$2d$esm$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchSignInMethodsForEmail"])(auth, normalizedEmail);
                    } catch (fetchMethodsError) {
                        console.warn("[AuthView] Could not resolve sign-in methods for email", fetchMethodsError);
                    }
                    console.error("[AuthView] Firebase email/password sign-in failed", {
                        provider: "password",
                        normalizedEmail,
                        projectId: clientProjectId,
                        authDomain,
                        errorCode,
                        errorMessage,
                        signInMethods
                    });
                    const invalidCredentialCodes = new Set([
                        "auth/invalid-credential",
                        "auth/wrong-password",
                        "auth/user-not-found",
                        "auth/invalid-login-credentials"
                    ]);
                    const configOrProviderCodes = new Set([
                        "auth/operation-not-allowed",
                        "auth/invalid-api-key",
                        "auth/app-not-authorized",
                        "auth/unauthorized-domain",
                        "auth/configuration-not-found"
                    ]);
                    const hasPasswordProvider = signInMethods.includes("password");
                    const hasSocialProviderOnly = signInMethods.some((method)=>method !== "password") && !hasPasswordProvider;
                    let userMessage = "Não foi possível autenticar no momento. Tente novamente.";
                    if (invalidCredentialCodes.has(errorCode)) {
                        userMessage = hasSocialProviderOnly ? "Esta conta foi criada com login social. Entre com Google/Facebook ou redefina sua senha para usar e-mail e senha." : "E-mail ou senha inválidos.";
                    } else if (configOrProviderCodes.has(errorCode)) {
                        userMessage = "O login por e-mail/senha está desabilitado ou com configuração inválida no Firebase.";
                    }
                    setEmailLoginErrorMessage(userMessage);
                    void (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$authAlerts$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["VSModalPaged"])({
                        title: "Falha no login",
                        messages: [
                            userMessage
                        ],
                        tone: "error"
                    });
                    setSubmitting(false);
                    return;
                }
            } else {
                console.warn("[AuthView] Firebase config not available; using /api/auth/verify only", {
                    provider: "password",
                    normalizedEmail,
                    projectId: clientProjectId,
                    authDomain,
                    hasFirebaseConfig
                });
            }
            const response = await fetch("/api/auth/verify", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: normalizedEmail,
                    password: normalizedPassword,
                    idToken: firebaseIdToken
                })
            });
            if (!response.ok) {
                const data = await response.json().catch(()=>null);
                const userMessage = response.status === 401 ? "E-mail ou senha inválidos." : data?.error ?? "Não foi possível validar suas credenciais agora.";
                setEmailLoginErrorMessage(userMessage);
                void (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$authAlerts$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["VSModalPaged"])({
                    title: "Acesso negado",
                    messages: [
                        userMessage
                    ],
                    tone: "error"
                });
                setSubmitting(false);
                return;
            }
            const payload = await response.json().catch(()=>null);
            const token = crypto.randomUUID();
            const profile = {
                user_id: payload?.profile?.user_id?.trim() || "",
                name: payload?.profile?.name?.trim() || "",
                email: payload?.profile?.email?.trim().toLowerCase() || normalizedEmail
            };
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$authSession$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setAuthSessionToken"])(token);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$authSession$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setAuthSessionProfile"])(profile);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$devSession$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setDevSessionToken"])(token);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$accessTokenShare$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setSharedAccessData"])({
                token,
                profile
            });
            if (rememberMe) {
                window.localStorage.setItem(REMEMBERED_EMAIL_KEY, normalizedEmail);
            } else {
                window.localStorage.removeItem(REMEMBERED_EMAIL_KEY);
            }
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$pageBackground$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ensureSavedPageBackgroundConfig"])();
            router.replace("/home");
        } catch (error) {
            console.error("[AuthView] Unexpected login failure", error);
            setEmailLoginErrorMessage("Não foi possível validar suas credenciais agora.");
            void (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$authAlerts$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["VSModalPaged"])({
                title: "Erro inesperado",
                messages: [
                    "Não foi possível validar suas credenciais agora."
                ],
                tone: "error"
            });
            setSubmitting(false);
        }
    };
    const handleForgotSubmit = async (event)=>{
        event.preventDefault();
        if (submittingForgot) return;
        const normalizedEmail = forgotEmail.trim().toLowerCase();
        if (!normalizedEmail) {
            void (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$authAlerts$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["VSModalPaged"])({
                title: "Email required",
                messages: [
                    "Please enter your email address to continue."
                ],
                tone: "error"
            });
            return;
        }
        setSubmittingForgot(true);
        try {
            const response = await fetch("/api/auth/reset", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: normalizedEmail
                })
            });
            if (!response.ok) {
                const data = await response.json().catch(()=>null);
                void (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$authAlerts$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["VSModalPaged"])({
                    title: "Reset failed",
                    messages: [
                        data?.error ?? "We could not send a reset link right now."
                    ],
                    tone: "error"
                });
                return;
            }
            void (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$authAlerts$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["VSModalPaged"])({
                title: "Check your email",
                messages: [
                    "We sent a redefinition link to your inbox. Follow it to reset your password."
                ],
                tone: "success"
            });
            setShowForgotModal(false);
            setForgotEmail("");
        } catch (error) {
            console.error("[ForgetPassword] Failed to request reset:", error);
            void (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$authAlerts$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["VSModalPaged"])({
                title: "Unexpected error",
                messages: [
                    "Unable to send the reset email right now."
                ],
                tone: "error"
            });
        } finally{
            setSubmittingForgot(false);
        }
    };
    const inputStyle = {
        width: "100%",
        padding: "12px 16px",
        backgroundColor: "#f9fafb",
        borderRadius: 8,
        border: "1px solid #e5e7eb",
        outline: "none",
        color: "#111827",
        fontSize: "1rem",
        fontFamily: ff,
        boxSizing: "border-box"
    };
    const handleSocialSignIn = async (provider)=>{
        if (socialSubmitting) return;
        setSocialSubmitting(provider);
        setSocialErrorMessage("");
        try {
            console.log("RememberMe:", rememberMe);
            await setFirebasePersistenceMode();
            const credential = provider === "google" ? await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["signInWithGoogle"])() : await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["signInWithFacebook"])();
            const user = credential.user;
            const uid = user.uid;
            const normalizedEmail = user.email?.trim().toLowerCase() || "";
            const normalizedName = user.displayName?.trim() || "Usuário";
            const idToken = await user.getIdToken(true);
            const syncResponse = await fetch("/api/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    uid,
                    email: normalizedEmail,
                    name: normalizedName,
                    provider,
                    idToken
                })
            });
            const syncPayload = await syncResponse.json().catch(()=>null);
            if (!syncResponse.ok || !syncPayload?.ok) {
                console.error("[AuthView] social profile sync failed", {
                    provider,
                    uid,
                    normalizedEmail,
                    status: syncResponse.status,
                    error: syncPayload?.error
                });
                throw new Error(syncPayload?.error ?? "Social profile sync failed.");
            }
            const token = crypto.randomUUID();
            const profile = {
                user_id: syncPayload.profile?.user_id?.trim() || uid,
                name: syncPayload.profile?.name?.trim() || normalizedName,
                email: syncPayload.profile?.email?.trim().toLowerCase() || normalizedEmail
            };
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$authSession$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setAuthSessionToken"])(token);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$authSession$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setAuthSessionProfile"])(profile);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$devSession$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setDevSessionToken"])(token);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$accessTokenShare$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setSharedAccessData"])({
                token,
                profile
            });
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$pageBackground$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ensureSavedPageBackgroundConfig"])();
            router.replace("/home");
        } catch (error) {
            const oauthError = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["extractOAuthErrorDetails"])(error);
            const providerLabel = provider === "google" ? "Google" : "Facebook";
            console.error(`[AuthView] ${providerLabel} OAuth failed`, {
                ...oauthError,
                authDomain: ("TURBOPACK compile-time value", "funcionarioslistaapp2025.firebaseapp.com") ?? "",
                projectId: ("TURBOPACK compile-time value", "funcionarioslistaapp2025") ?? "",
                route: "/authview"
            });
            if (provider === "google" && oauthError.code === "auth/popup-blocked") {
                try {
                    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["signInWithGoogleRedirect"])();
                    return;
                } catch (redirectError) {
                    const redirectOAuthError = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["extractOAuthErrorDetails"])(redirectError);
                    console.error("[AuthView] Google redirect fallback failed", redirectOAuthError);
                }
            }
            const userMessageByCode = {
                "auth/invalid-credential": "Sua sessão de autenticação está inválida. Atualize a página e tente novamente.",
                "auth/popup-blocked": "Seu navegador bloqueou o popup de login. Permita popups para este site e tente novamente.",
                "auth/popup-closed-by-user": "O popup de login foi fechado antes da conclusão. Tente novamente."
            };
            const fallbackMessage = "Não foi possível autenticar com o provedor selecionado. Verifique a configuração do Firebase Auth e tente novamente.";
            const userMessage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["resolveOAuthUserMessage"])(error, userMessageByCode[oauthError.code] ?? fallbackMessage);
            setSocialErrorMessage(userMessage);
            void (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$authAlerts$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["VSModalPaged"])({
                title: "Falha no login social",
                messages: [
                    userMessage
                ],
                tone: "error"
            });
        } finally{
            setSocialSubmitting(null);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            fontFamily: ff,
            minHeight: "100vh",
            display: "flex",
            backgroundImage: "none",
            backgroundColor: "#fff"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    background: metallicGradient,
                    padding: "3rem",
                    width: "50%",
                    flexDirection: "column",
                    justifyContent: "space-between"
                },
                className: "hidden lg:flex",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            border: "2px solid rgba(255,255,255,0.92)",
                            borderRadius: 24,
                            background: "rgba(255,255,255,0.06)",
                            padding: "2rem",
                            display: "flex",
                            flexDirection: "column",
                            gap: "1.25rem"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexDirection: "column",
                                    gap: "1.5rem",
                                    minHeight: 220,
                                    textAlign: "center",
                                    background: "linear-gradient(145deg, rgba(30,30,30,0.55), rgba(10,10,10,0.35))",
                                    border: "1px solid rgba(255,255,255,0.28)",
                                    borderRadius: 18,
                                    padding: "1.5rem"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        src: "/FAI-removebg-preview.png",
                                        alt: "Logo metálico oficial da FAI",
                                        width: 168,
                                        height: 168,
                                        style: {
                                            width: "100%",
                                            maxWidth: 280,
                                            height: "auto",
                                            objectFit: "contain"
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/app/authview/AuthViewClient.tsx",
                                        lineNumber: 422,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    color: "#fff",
                                                    fontSize: "2.4rem",
                                                    fontWeight: 700,
                                                    fontFamily: ff,
                                                    lineHeight: 1.1,
                                                    maxWidth: 360,
                                                    textAlign: "center"
                                                },
                                                children: "Welcome back to Fashion AI!"
                                            }, void 0, false, {
                                                fileName: "[project]/app/authview/AuthViewClient.tsx",
                                                lineNumber: 430,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    color: "rgba(255,255,255,0.9)",
                                                    fontSize: "1.05rem",
                                                    marginTop: "0.45rem",
                                                    fontFamily: ff,
                                                    textAlign: "center"
                                                },
                                                children: "Seu estilista pessoal"
                                            }, void 0, false, {
                                                fileName: "[project]/app/authview/AuthViewClient.tsx",
                                                lineNumber: 433,
                                                columnNumber: 29
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/authview/AuthViewClient.tsx",
                                        lineNumber: 429,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/authview/AuthViewClient.tsx",
                                lineNumber: 421,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    background: "linear-gradient(145deg, rgba(255,255,255,0.88), rgba(245,245,245,0.72))",
                                    border: "1px solid rgba(17,24,39,0.16)",
                                    borderRadius: 18,
                                    padding: "1.5rem"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: "2.25rem",
                                            fontWeight: 600,
                                            color: "#111827",
                                            marginBottom: "1.5rem",
                                            lineHeight: 1.3,
                                            fontFamily: ff
                                        },
                                        children: [
                                            "Organize seu estilo",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                                fileName: "[project]/app/authview/AuthViewClient.tsx",
                                                lineNumber: 439,
                                                columnNumber: 173
                                            }, this),
                                            "com inteligência artificial"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/authview/AuthViewClient.tsx",
                                        lineNumber: 439,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        style: {
                                            color: "rgba(17,24,39,0.82)",
                                            fontSize: "1.125rem",
                                            marginBottom: "2rem",
                                            fontFamily: ff
                                        },
                                        children: "Crie combinações perfeitas, gerencie seu guarda-roupa e descubra seu estilo único com a ajuda da IA."
                                    }, void 0, false, {
                                        fileName: "[project]/app/authview/AuthViewClient.tsx",
                                        lineNumber: 440,
                                        columnNumber: 25
                                    }, this),
                                    [
                                        [
                                            "✨",
                                            "Sugestões inteligentes de looks"
                                        ],
                                        [
                                            "👔",
                                            "Guarda-roupa digital organizado"
                                        ],
                                        [
                                            "🎨",
                                            "Visualização em manequim 3D"
                                        ]
                                    ].map(([icon, text])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "0.75rem",
                                                marginBottom: "1rem"
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        width: 40,
                                                        height: 40,
                                                        background: "rgba(17,24,39,0.08)",
                                                        borderRadius: 10,
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        flexShrink: 0
                                                    },
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            fontSize: "1.25rem"
                                                        },
                                                        children: icon
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/authview/AuthViewClient.tsx",
                                                        lineNumber: 444,
                                                        columnNumber: 37
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/authview/AuthViewClient.tsx",
                                                    lineNumber: 443,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    style: {
                                                        color: "rgba(17,24,39,0.9)",
                                                        fontFamily: ff
                                                    },
                                                    children: text
                                                }, void 0, false, {
                                                    fileName: "[project]/app/authview/AuthViewClient.tsx",
                                                    lineNumber: 446,
                                                    columnNumber: 33
                                                }, this)
                                            ]
                                        }, text, true, {
                                            fileName: "[project]/app/authview/AuthViewClient.tsx",
                                            lineNumber: 442,
                                            columnNumber: 29
                                        }, this))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/authview/AuthViewClient.tsx",
                                lineNumber: 438,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/authview/AuthViewClient.tsx",
                        lineNumber: 420,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            color: "rgba(255,255,255,0.5)",
                            fontSize: "0.875rem",
                            fontFamily: ff
                        },
                        children: "© 2026 Fashion AI. Todos os direitos reservados."
                    }, void 0, false, {
                        fileName: "[project]/app/authview/AuthViewClient.tsx",
                        lineNumber: 451,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/authview/AuthViewClient.tsx",
                lineNumber: 419,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "2rem",
                    backgroundColor: "#f8fafc",
                    position: "relative",
                    overflow: "hidden",
                    backgroundImage: "url(/Firefly_Gemini Flash_Crie ideias de background muito bons para um novo website de moda, usando uma rede de 3787887.png)",
                    backgroundSize: "cover",
                    backgroundPosition: "center"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        src: "/Fart.png",
                        alt: "Fashion AI network background",
                        fill: true,
                        priority: true,
                        style: {
                            objectFit: "cover"
                        }
                    }, void 0, false, {
                        fileName: "[project]/app/authview/AuthViewClient.tsx",
                        lineNumber: 456,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            width: "100%",
                            maxWidth: 520,
                            position: "relative",
                            zIndex: 1
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                background: "rgba(255,255,255,0.28)",
                                border: "2px solid #000",
                                borderRadius: 24,
                                padding: "2rem",
                                backdropFilter: "blur(14px) saturate(155%)",
                                WebkitBackdropFilter: "blur(14px) saturate(155%)",
                                boxShadow: "0 16px 40px rgba(15, 23, 42, 0.22)"
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        marginBottom: "2rem"
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            style: {
                                                fontSize: "1.5rem",
                                                fontWeight: 600,
                                                color: "#111827",
                                                marginBottom: "0.5rem",
                                                fontFamily: ff
                                            },
                                            children: "Bem-vindo de volta"
                                        }, void 0, false, {
                                            fileName: "[project]/app/authview/AuthViewClient.tsx",
                                            lineNumber: 466,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            style: {
                                                color: "#6b7280",
                                                fontFamily: ff
                                            },
                                            children: "Entre com suas credenciais para acessar sua conta"
                                        }, void 0, false, {
                                            fileName: "[project]/app/authview/AuthViewClient.tsx",
                                            lineNumber: 467,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/authview/AuthViewClient.tsx",
                                    lineNumber: 465,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                                    onSubmit: handleSubmit,
                                    style: {
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "1.25rem"
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    htmlFor: "auth-email",
                                                    style: {
                                                        display: "block",
                                                        fontSize: "0.875rem",
                                                        fontWeight: 500,
                                                        color: "#374151",
                                                        marginBottom: "0.5rem",
                                                        fontFamily: ff
                                                    },
                                                    children: "E-mail"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/authview/AuthViewClient.tsx",
                                                    lineNumber: 472,
                                                    columnNumber: 29
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    id: "auth-email",
                                                    type: "email",
                                                    value: email,
                                                    onChange: (e)=>setEmail(e.target.value),
                                                    placeholder: "seu@email.com",
                                                    required: true,
                                                    style: {
                                                        ...inputStyle,
                                                        paddingLeft: 16
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/app/authview/AuthViewClient.tsx",
                                                    lineNumber: 473,
                                                    columnNumber: 29
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/authview/AuthViewClient.tsx",
                                            lineNumber: 471,
                                            columnNumber: 25
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    htmlFor: "auth-password",
                                                    style: {
                                                        display: "block",
                                                        fontSize: "0.875rem",
                                                        fontWeight: 500,
                                                        color: "#374151",
                                                        marginBottom: "0.5rem",
                                                        fontFamily: ff
                                                    },
                                                    children: "Senha"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/authview/AuthViewClient.tsx",
                                                    lineNumber: 477,
                                                    columnNumber: 29
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        position: "relative"
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            id: "auth-password",
                                                            type: showPassword ? "text" : "password",
                                                            value: password,
                                                            onChange: (e)=>setPassword(e.target.value),
                                                            placeholder: "••••••••",
                                                            required: true,
                                                            style: {
                                                                ...inputStyle,
                                                                paddingRight: 48
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/authview/AuthViewClient.tsx",
                                                            lineNumber: 479,
                                                            columnNumber: 33
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            type: "button",
                                                            onClick: ()=>setShowPassword(!showPassword),
                                                            style: {
                                                                position: "absolute",
                                                                right: 14,
                                                                top: "50%",
                                                                transform: "translateY(-50%)",
                                                                background: "none",
                                                                border: "none",
                                                                cursor: "pointer",
                                                                color: "#9ca3af",
                                                                padding: 0,
                                                                display: "flex"
                                                            },
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(EyeIcon, {
                                                                open: showPassword
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/authview/AuthViewClient.tsx",
                                                                lineNumber: 481,
                                                                columnNumber: 37
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/authview/AuthViewClient.tsx",
                                                            lineNumber: 480,
                                                            columnNumber: 33
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/authview/AuthViewClient.tsx",
                                                    lineNumber: 478,
                                                    columnNumber: 29
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/authview/AuthViewClient.tsx",
                                            lineNumber: 476,
                                            columnNumber: 25
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "space-between"
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    htmlFor: "remember-me",
                                                    style: {
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: "0.5rem",
                                                        cursor: "pointer",
                                                        fontFamily: ff
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            id: "remember-me",
                                                            type: "checkbox",
                                                            checked: rememberMe,
                                                            onChange: (e)=>setRememberMe(e.target.checked),
                                                            style: {
                                                                width: 16,
                                                                height: 16
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/authview/AuthViewClient.tsx",
                                                            lineNumber: 488,
                                                            columnNumber: 33
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            style: {
                                                                fontSize: "0.875rem",
                                                                color: "#4b5563",
                                                                fontFamily: ff
                                                            },
                                                            children: "Lembrar de mim"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/authview/AuthViewClient.tsx",
                                                            lineNumber: 489,
                                                            columnNumber: 33
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/authview/AuthViewClient.tsx",
                                                    lineNumber: 487,
                                                    columnNumber: 29
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    onClick: ()=>setShowForgotModal(true),
                                                    style: {
                                                        fontSize: "0.875rem",
                                                        color: "#7c3aed",
                                                        background: "none",
                                                        border: "none",
                                                        cursor: "pointer",
                                                        fontWeight: 500,
                                                        fontFamily: ff
                                                    },
                                                    children: "Esqueceu a senha?"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/authview/AuthViewClient.tsx",
                                                    lineNumber: 491,
                                                    columnNumber: 29
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/authview/AuthViewClient.tsx",
                                            lineNumber: 486,
                                            columnNumber: 25
                                        }, this),
                                        emailLoginErrorMessage ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            role: "alert",
                                            style: {
                                                padding: "0.75rem 1rem",
                                                borderRadius: 8,
                                                border: "1px solid #fecaca",
                                                backgroundColor: "#fef2f2",
                                                color: "#991b1b",
                                                fontSize: "0.875rem",
                                                fontFamily: ff
                                            },
                                            children: emailLoginErrorMessage
                                        }, void 0, false, {
                                            fileName: "[project]/app/authview/AuthViewClient.tsx",
                                            lineNumber: 497,
                                            columnNumber: 29
                                        }, this) : null,
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "submit",
                                            disabled: submitting,
                                            style: {
                                                width: "100%",
                                                background: "linear-gradient(to right, #7c3aed, #ec4899)",
                                                color: "#fff",
                                                padding: "12px",
                                                borderRadius: 8,
                                                border: "none",
                                                cursor: submitting ? "not-allowed" : "pointer",
                                                fontSize: "1rem",
                                                fontWeight: 500,
                                                opacity: submitting ? 0.6 : 1,
                                                fontFamily: ff
                                            },
                                            children: submitting ? "Entrando..." : "Entrar"
                                        }, void 0, false, {
                                            fileName: "[project]/app/authview/AuthViewClient.tsx",
                                            lineNumber: 513,
                                            columnNumber: 25
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                position: "relative",
                                                textAlign: "center"
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        borderTop: "1px solid #e5e7eb",
                                                        position: "absolute",
                                                        inset: 0,
                                                        top: "50%"
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/app/authview/AuthViewClient.tsx",
                                                    lineNumber: 518,
                                                    columnNumber: 29
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    style: {
                                                        position: "relative",
                                                        background: "#fff",
                                                        padding: "0 1rem",
                                                        color: "#6b7280",
                                                        fontSize: "0.875rem",
                                                        fontFamily: ff
                                                    },
                                                    children: "Ou continue com"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/authview/AuthViewClient.tsx",
                                                    lineNumber: 519,
                                                    columnNumber: 29
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/authview/AuthViewClient.tsx",
                                            lineNumber: 517,
                                            columnNumber: 25
                                        }, this),
                                        socialErrorMessage ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            role: "alert",
                                            style: {
                                                padding: "0.75rem 1rem",
                                                borderRadius: 8,
                                                border: "1px solid #fecaca",
                                                backgroundColor: "#fef2f2",
                                                color: "#991b1b",
                                                fontSize: "0.875rem",
                                                fontFamily: ff
                                            },
                                            children: socialErrorMessage
                                        }, void 0, false, {
                                            fileName: "[project]/app/authview/AuthViewClient.tsx",
                                            lineNumber: 522,
                                            columnNumber: 29
                                        }, this) : null,
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                display: "grid",
                                                gridTemplateColumns: "1fr 1fr",
                                                gap: "1rem"
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    onClick: ()=>void handleSocialSignIn("google"),
                                                    disabled: Boolean(socialSubmitting),
                                                    style: {
                                                        padding: "12px 16px",
                                                        backgroundColor: "#fff",
                                                        border: "1px solid #e5e7eb",
                                                        borderRadius: 8,
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        gap: "0.5rem",
                                                        color: "#374151",
                                                        fontSize: "1rem",
                                                        fontWeight: 500,
                                                        cursor: socialSubmitting ? "not-allowed" : "pointer",
                                                        fontFamily: ff,
                                                        opacity: socialSubmitting === "google" ? 0.6 : 1
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                            style: {
                                                                width: 20,
                                                                height: 20
                                                            },
                                                            viewBox: "0 0 24 24",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                    fill: "#4285F4",
                                                                    d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/authview/AuthViewClient.tsx",
                                                                    lineNumber: 540,
                                                                    columnNumber: 92
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                    fill: "#34A853",
                                                                    d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/authview/AuthViewClient.tsx",
                                                                    lineNumber: 540,
                                                                    columnNumber: 238
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                    fill: "#FBBC05",
                                                                    d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/authview/AuthViewClient.tsx",
                                                                    lineNumber: 540,
                                                                    columnNumber: 398
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                    fill: "#EA4335",
                                                                    d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/authview/AuthViewClient.tsx",
                                                                    lineNumber: 540,
                                                                    columnNumber: 550
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/authview/AuthViewClient.tsx",
                                                            lineNumber: 540,
                                                            columnNumber: 33
                                                        }, this),
                                                        socialSubmitting === "google" ? "Entrando..." : "Google"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/authview/AuthViewClient.tsx",
                                                    lineNumber: 539,
                                                    columnNumber: 29
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    onClick: ()=>void handleSocialSignIn("facebook"),
                                                    disabled: Boolean(socialSubmitting),
                                                    style: {
                                                        padding: "12px 16px",
                                                        backgroundColor: "#fff",
                                                        border: "1px solid #e5e7eb",
                                                        borderRadius: 8,
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        gap: "0.5rem",
                                                        color: "#1877F2",
                                                        fontSize: "1rem",
                                                        fontWeight: 500,
                                                        cursor: socialSubmitting ? "not-allowed" : "pointer",
                                                        fontFamily: ff,
                                                        opacity: socialSubmitting === "facebook" ? 0.6 : 1
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                            style: {
                                                                width: 20,
                                                                height: 20
                                                            },
                                                            fill: "currentColor",
                                                            viewBox: "0 0 24 24",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                d: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/authview/AuthViewClient.tsx",
                                                                lineNumber: 544,
                                                                columnNumber: 112
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/authview/AuthViewClient.tsx",
                                                            lineNumber: 544,
                                                            columnNumber: 33
                                                        }, this),
                                                        socialSubmitting === "facebook" ? "Entrando..." : "Facebook"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/authview/AuthViewClient.tsx",
                                                    lineNumber: 543,
                                                    columnNumber: 29
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/authview/AuthViewClient.tsx",
                                            lineNumber: 538,
                                            columnNumber: 25
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/authview/AuthViewClient.tsx",
                                    lineNumber: 470,
                                    columnNumber: 21
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    style: {
                                        textAlign: "center",
                                        fontSize: "0.875rem",
                                        color: "#6b7280",
                                        marginTop: "2rem",
                                        fontFamily: ff
                                    },
                                    children: [
                                        "Não tem uma conta?",
                                        " ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>router.push("/signupview"),
                                            style: {
                                                color: "#7c3aed",
                                                background: "none",
                                                border: "none",
                                                cursor: "pointer",
                                                fontWeight: 500,
                                                fontFamily: ff
                                            },
                                            children: "Criar conta"
                                        }, void 0, false, {
                                            fileName: "[project]/app/authview/AuthViewClient.tsx",
                                            lineNumber: 552,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/authview/AuthViewClient.tsx",
                                    lineNumber: 550,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/authview/AuthViewClient.tsx",
                            lineNumber: 464,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/authview/AuthViewClient.tsx",
                        lineNumber: 463,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/authview/AuthViewClient.tsx",
                lineNumber: 455,
                columnNumber: 13
            }, this),
            showForgotModal ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                onClick: ()=>setShowForgotModal(false),
                style: {
                    position: "fixed",
                    inset: 0,
                    backgroundColor: "rgba(15,23,42,0.5)",
                    zIndex: 50,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "1rem"
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    onClick: (event)=>event.stopPropagation(),
                    style: {
                        width: "100%",
                        maxWidth: 740,
                        minHeight: 330,
                        borderRadius: 20,
                        overflow: "hidden",
                        backgroundColor: "#ffffff",
                        boxShadow: "0 24px 60px rgba(30, 64, 175, 0.2)",
                        border: "1px solid rgba(147, 197, 253, 0.45)",
                        display: "flex"
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "hidden md:flex",
                            style: {
                                width: "44%",
                                flexDirection: "column",
                                justifyContent: "space-between",
                                gap: "1.25rem",
                                padding: "1.7rem",
                                color: "#ffffff",
                                background: "linear-gradient(165deg, #1d4ed8 0%, #2563eb 45%, #38bdf8 100%)"
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                fontSize: "2rem",
                                                fontWeight: 700
                                            },
                                            children: "Fashion AI"
                                        }, void 0, false, {
                                            fileName: "[project]/app/authview/AuthViewClient.tsx",
                                            lineNumber: 601,
                                            columnNumber: 33
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            style: {
                                                fontSize: "1.2rem",
                                                color: "rgba(255,255,255,0.9)",
                                                marginTop: "0.5rem"
                                            },
                                            children: "Secure account recovery with a quick reset link."
                                        }, void 0, false, {
                                            fileName: "[project]/app/authview/AuthViewClient.tsx",
                                            lineNumber: 602,
                                            columnNumber: 33
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/authview/AuthViewClient.tsx",
                                    lineNumber: 600,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: "grid",
                                        gap: "0.75rem"
                                    },
                                    children: [
                                        "Account protection",
                                        "One-click reset",
                                        "Fast inbox delivery"
                                    ].map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                borderRadius: 10,
                                                backgroundColor: "rgba(255,255,255,0.16)",
                                                border: "1px solid rgba(255,255,255,0.3)",
                                                padding: "0.6rem 0.8rem",
                                                fontSize: "1rem"
                                            },
                                            children: item
                                        }, item, false, {
                                            fileName: "[project]/app/authview/AuthViewClient.tsx",
                                            lineNumber: 608,
                                            columnNumber: 37
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/app/authview/AuthViewClient.tsx",
                                    lineNumber: 606,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    style: {
                                        fontSize: "0.8rem",
                                        color: "rgba(255,255,255,0.76)",
                                        margin: 0
                                    },
                                    children: "© 2026 Fashion AI"
                                }, void 0, false, {
                                    fileName: "[project]/app/authview/AuthViewClient.tsx",
                                    lineNumber: 622,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/authview/AuthViewClient.tsx",
                            lineNumber: 588,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                flex: 1,
                                backgroundColor: "#ffffff",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                padding: "1.5rem"
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                                onSubmit: handleForgotSubmit,
                                style: {
                                    width: "100%",
                                    maxWidth: 360,
                                    display: "grid",
                                    gap: "1rem"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        style: {
                                            display: "grid",
                                            gap: "0.5rem",
                                            color: "#1e3a8a",
                                            fontWeight: 600,
                                            fontSize: "0.95rem"
                                        },
                                        children: [
                                            "Email address",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "email",
                                                value: forgotEmail,
                                                onChange: (event)=>setForgotEmail(event.target.value),
                                                placeholder: "you@example.com",
                                                className: "w-full rounded-xl border border-blue-200 bg-white px-4 py-3 text-base text-blue-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-300/70"
                                            }, void 0, false, {
                                                fileName: "[project]/app/authview/AuthViewClient.tsx",
                                                lineNumber: 640,
                                                columnNumber: 37
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/authview/AuthViewClient.tsx",
                                        lineNumber: 638,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "submit",
                                        disabled: submittingForgot,
                                        style: {
                                            width: "100%",
                                            border: "none",
                                            borderRadius: 12,
                                            padding: "0.8rem 1rem",
                                            fontSize: "0.95rem",
                                            fontWeight: 600,
                                            color: "#ffffff",
                                            cursor: submittingForgot ? "not-allowed" : "pointer",
                                            opacity: submittingForgot ? 0.7 : 1,
                                            background: "linear-gradient(90deg, #1d4ed8 0%, #2563eb 50%, #38bdf8 100%)"
                                        },
                                        children: submittingForgot ? "Sending..." : "Email the reset link"
                                    }, void 0, false, {
                                        fileName: "[project]/app/authview/AuthViewClient.tsx",
                                        lineNumber: 649,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: ()=>setShowForgotModal(false),
                                        style: {
                                            width: "100%",
                                            borderRadius: 12,
                                            border: "1px solid #bfdbfe",
                                            padding: "0.75rem 1rem",
                                            fontSize: "0.92rem",
                                            fontWeight: 600,
                                            color: "#1d4ed8",
                                            backgroundColor: "#eff6ff",
                                            cursor: "pointer"
                                        },
                                        children: "Return"
                                    }, void 0, false, {
                                        fileName: "[project]/app/authview/AuthViewClient.tsx",
                                        lineNumber: 668,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: ()=>{
                                            setShowForgotModal(false);
                                            router.push("/signupview");
                                        },
                                        style: {
                                            width: "100%",
                                            borderRadius: 12,
                                            border: "1px solid #bfdbfe",
                                            padding: "0.75rem 1rem",
                                            fontSize: "0.92rem",
                                            fontWeight: 600,
                                            color: "#1d4ed8",
                                            backgroundColor: "#ffffff",
                                            cursor: "pointer"
                                        },
                                        children: "Create an account"
                                    }, void 0, false, {
                                        fileName: "[project]/app/authview/AuthViewClient.tsx",
                                        lineNumber: 686,
                                        columnNumber: 33
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/authview/AuthViewClient.tsx",
                                lineNumber: 637,
                                columnNumber: 29
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/authview/AuthViewClient.tsx",
                            lineNumber: 627,
                            columnNumber: 25
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/authview/AuthViewClient.tsx",
                    lineNumber: 574,
                    columnNumber: 21
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/authview/AuthViewClient.tsx",
                lineNumber: 561,
                columnNumber: 17
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/app/authview/AuthViewClient.tsx",
        lineNumber: 417,
        columnNumber: 9
    }, this);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__a10a16bf._.js.map