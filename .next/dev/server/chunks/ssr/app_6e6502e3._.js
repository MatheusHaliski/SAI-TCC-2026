module.exports = [
"[project]/app/lib/stylist-shell.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "NAV_ITEMS",
    ()=>NAV_ITEMS,
    "PATH_TO_ROUTE",
    ()=>PATH_TO_ROUTE,
    "ROUTE_TITLES",
    ()=>ROUTE_TITLES
]);
const NAV_ITEMS = [
    {
        route: 'my-wardrobe',
        label: 'Virtual Wardrobe',
        helperText: 'Available, unavailable and favorites',
        icon: '⌂',
        path: '/my-wardrobe'
    },
    {
        route: 'create-my-scheme',
        label: 'Create Outfit',
        helperText: 'Build manually or with AI',
        icon: '✦',
        path: '/create-my-scheme'
    },
    {
        route: 'explore-scheme',
        label: 'Saved Outfit Cards',
        helperText: 'Manage outfits by occasion and preferences',
        icon: '◍',
        path: '/explore-scheme'
    },
    {
        route: 'profile',
        label: 'Profile',
        helperText: 'Manage your account details',
        icon: '◉',
        path: '/profile'
    },
    {
        route: 'profile-settings',
        label: 'Settings',
        helperText: 'Profile settings and privacy',
        icon: '⚙︎',
        path: '/profile/settings'
    },
    {
        route: 'search-items',
        label: 'Search',
        helperText: 'Find users and outfits',
        icon: '⌕',
        path: '/search-items'
    },
    {
        route: 'search-pieces',
        label: 'Search Pieces',
        helperText: 'Discover public pieces from creators',
        icon: '◈',
        path: '/search-pieces'
    },
    {
        route: 'dress-tester',
        label: 'Dress Tester',
        helperText: '2D premium mannequin studio',
        icon: '◌',
        path: '/dress-tester'
    }
];
const ROUTE_TITLES = {
    'my-wardrobe': 'Virtual Wardrobe',
    'create-my-scheme': 'Create Outfit',
    'explore-scheme': 'Saved Outfit Cards',
    profile: 'Profile',
    'profile-settings': 'Settings',
    'search-items': 'Search',
    'search-pieces': 'Search Pieces',
    'dress-tester': 'Dress Tester'
};
const PATH_TO_ROUTE = {
    '/': 'my-wardrobe',
    '/home': 'my-wardrobe',
    '/my-wardrobe': 'my-wardrobe',
    '/create-my-scheme': 'create-my-scheme',
    '/explore-scheme': 'explore-scheme',
    '/profile': 'profile',
    '/profile/settings': 'profile-settings',
    '/search-items': 'search-items',
    '/search-pieces': 'search-pieces',
    '/add-wardrobe-item': 'search-pieces',
    '/dress-tester': 'dress-tester'
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
"[project]/app/lib/theme.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SAI_THEME_KEY",
    ()=>SAI_THEME_KEY,
    "applyTheme",
    ()=>applyTheme,
    "readSavedTheme",
    ()=>readSavedTheme
]);
const SAI_THEME_KEY = 'sai_theme';
const readSavedTheme = ()=>{
    if ("TURBOPACK compile-time truthy", 1) return 'dark';
    //TURBOPACK unreachable
    ;
    const saved = undefined;
};
const applyTheme = (theme)=>{
    if (typeof document === 'undefined') return;
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.colorScheme = theme;
    window.localStorage.setItem(SAI_THEME_KEY, theme);
};
}),
"[project]/app/lib/clientSession.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clearServerSession",
    ()=>clearServerSession,
    "getServerSession",
    ()=>getServerSession
]);
const getServerSession = async ()=>{
    const response = await fetch("/api/auth/session", {
        method: "GET",
        credentials: "include",
        cache: "no-store"
    });
    if (!response.ok) return null;
    const payload = await response.json();
    if (!payload.ok) return null;
    return payload.profile ?? null;
};
const clearServerSession = async ()=>{
    await fetch("/api/auth/session", {
        method: "DELETE",
        credentials: "include"
    });
};
}),
"[project]/app/lib/semantic-badge-tokens.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PIECE_TYPE_TONE_MAP",
    ()=>PIECE_TYPE_TONE_MAP,
    "RARITY_TONE_MAP",
    ()=>RARITY_TONE_MAP,
    "WEARSTYLE_TONE_MAP",
    ()=>WEARSTYLE_TONE_MAP,
    "resolveSemanticTone",
    ()=>resolveSemanticTone
]);
const tone = (gradient, glow)=>({
        gradient,
        border: 'border-white/30',
        glow,
        text: 'text-white'
    });
const WEARSTYLE_TONE_MAP = {
    'statement piece': tone('linear-gradient(120deg, rgba(180,83,9,0.45), rgba(251,191,36,0.3), rgba(253,230,138,0.25))', 'shadow-[0_0_24px_rgba(251,191,36,0.35)]'),
    'visual anchor': tone('linear-gradient(120deg, rgba(76,29,149,0.45), rgba(139,92,246,0.3))', 'shadow-[0_0_24px_rgba(167,139,250,0.34)]'),
    'street energy': tone('linear-gradient(120deg, rgba(190,24,93,0.45), rgba(244,114,182,0.3))', 'shadow-[0_0_24px_rgba(244,114,182,0.33)]'),
    'style accent': tone('linear-gradient(120deg, rgba(8,145,178,0.45), rgba(59,130,246,0.3))', 'shadow-[0_0_24px_rgba(34,211,238,0.33)]'),
    'quiet luxury': tone('linear-gradient(120deg, rgba(30,41,59,0.6), rgba(148,163,184,0.35), rgba(241,245,249,0.25))', 'shadow-[0_0_24px_rgba(203,213,225,0.25)]'),
    'minimal core': tone('linear-gradient(120deg, rgba(241,245,249,0.42), rgba(148,163,184,0.22))', 'shadow-[0_0_20px_rgba(226,232,240,0.28)]'),
    'sport utility': tone('linear-gradient(120deg, rgba(101,163,13,0.45), rgba(20,184,166,0.28))', 'shadow-[0_0_24px_rgba(45,212,191,0.33)]'),
    'creative layering': tone('linear-gradient(120deg, rgba(249,115,22,0.45), rgba(251,146,60,0.3), rgba(147,51,234,0.25))', 'shadow-[0_0_24px_rgba(251,146,60,0.35)]')
};
const RARITY_TONE_MAP = {
    premium: tone('linear-gradient(120deg, rgba(146,64,14,0.5), rgba(251,191,36,0.3))', 'shadow-[0_0_26px_rgba(251,191,36,0.36)]'),
    standard: tone('linear-gradient(120deg, rgba(71,85,105,0.5), rgba(148,163,184,0.3))', 'shadow-[0_0_22px_rgba(148,163,184,0.32)]'),
    'limited edition': tone('linear-gradient(120deg, rgba(88,28,135,0.5), rgba(168,85,247,0.3), rgba(245,158,11,0.15))', 'shadow-[0_0_26px_rgba(168,85,247,0.35)]'),
    rare: tone('linear-gradient(120deg, rgba(14,116,144,0.5), rgba(6,182,212,0.3))', 'shadow-[0_0_24px_rgba(34,211,238,0.35)]')
};
const PIECE_TYPE_TONE_MAP = {
    jacket: tone('linear-gradient(120deg, rgba(180,83,9,0.5), rgba(251,191,36,0.28))', 'shadow-[0_0_22px_rgba(251,191,36,0.36)]'),
    pants: tone('linear-gradient(120deg, rgba(185,28,28,0.5), rgba(244,63,94,0.28))', 'shadow-[0_0_22px_rgba(244,63,94,0.34)]'),
    footwear: tone('linear-gradient(120deg, rgba(190,24,93,0.45), rgba(167,139,250,0.22))', 'shadow-[0_0_18px_rgba(236,72,153,0.3)]'),
    accessory: tone('linear-gradient(120deg, rgba(180,83,9,0.45), rgba(234,179,8,0.25))', 'shadow-[0_0_18px_rgba(251,191,36,0.3)]'),
    top: tone('linear-gradient(120deg, rgba(13,148,136,0.45), rgba(8,145,178,0.25))', 'shadow-[0_0_18px_rgba(34,211,238,0.3)]'),
    bottom: tone('linear-gradient(120deg, rgba(29,78,216,0.45), rgba(30,64,175,0.25))', 'shadow-[0_0_18px_rgba(96,165,250,0.3)]'),
    outerwear: tone('linear-gradient(120deg, rgba(88,28,135,0.45), rgba(30,41,59,0.25))', 'shadow-[0_0_18px_rgba(168,85,247,0.3)]'),
    bag: tone('linear-gradient(120deg, rgba(251,146,60,0.35), rgba(217,119,6,0.25))', 'shadow-[0_0_18px_rgba(251,146,60,0.28)]')
};
const normalize = (value)=>value.trim().toLowerCase();
const resolveSemanticTone = (value, map)=>{
    const normalized = normalize(value);
    const exact = map[normalized];
    if (exact) return exact;
    const matchedKey = Object.keys(map).find((key)=>normalized.includes(key));
    if (matchedKey) return map[matchedKey];
    const hash = normalized.split('').reduce((acc, ch)=>acc + ch.charCodeAt(0), 0);
    const hueA = hash % 360;
    const hueB = (hash + 80) % 360;
    return {
        gradient: `linear-gradient(120deg, hsla(${hueA}, 70%, 60%, 0.35), hsla(${hueB}, 70%, 52%, 0.24))`,
        border: 'border-white/30',
        glow: `shadow-[0_0_24px_hsla(${hueA},70%,60%,0.35)]`,
        text: 'text-white'
    };
};
}),
"[project]/app/lib/outfit-card.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "buildBackgroundCssStyle",
    ()=>buildBackgroundCssStyle,
    "buildOutfitDescriptionFallback",
    ()=>buildOutfitDescriptionFallback,
    "buildOutfitDescriptionRich",
    ()=>buildOutfitDescriptionRich,
    "getCategoryBadgeStyle",
    ()=>getCategoryBadgeStyle,
    "getCategoryFallbackIcon",
    ()=>getCategoryFallbackIcon,
    "getDefaultWearstyleIconDataUri",
    ()=>getDefaultWearstyleIconDataUri,
    "getPieceTypeFallbackIcon",
    ()=>getPieceTypeFallbackIcon,
    "getWearstyleIconPath",
    ()=>getWearstyleIconPath,
    "inferWearstylesByPieceType",
    ()=>inferWearstylesByPieceType,
    "normalizeWearstyles",
    ()=>normalizeWearstyles,
    "resolveBrandLogoUrlByName",
    ()=>resolveBrandLogoUrlByName,
    "resolveOutfitBackgroundForRender",
    ()=>resolveOutfitBackgroundForRender
]);
const FALLBACK_BACKGROUND = {
    background_mode: 'gradient',
    gradient: {
        type: 'linear',
        angle: 180,
        intensity: 100,
        stops: [
            {
                color: '#f8fafc',
                position: 0
            },
            {
                color: '#ffffff',
                position: 100
            }
        ]
    },
    shape: 'none'
};
const clamp = (value, min, max)=>Math.min(max, Math.max(min, value));
const hexToRgba = (hex, alpha)=>{
    const normalized = /^#([0-9A-F]{6})$/i.test(hex) ? hex : '#111827';
    const r = parseInt(normalized.slice(1, 3), 16);
    const g = parseInt(normalized.slice(3, 5), 16);
    const b = parseInt(normalized.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
function resolveOutfitBackgroundForRender(input) {
    if (!input) return FALLBACK_BACKGROUND;
    if ('background_mode' in input) return input;
    if (input.type === 'solid') {
        return {
            background_mode: 'solid',
            solid_color: input.value,
            shape: input.shape
        };
    }
    if (input.type === 'gradient') {
        return {
            background_mode: 'gradient',
            gradient: {
                type: 'linear',
                angle: 140,
                intensity: 100,
                stops: [
                    {
                        color: '#0f172a',
                        position: 0
                    },
                    {
                        color: '#334155',
                        position: 100
                    }
                ]
            },
            shape: input.shape
        };
    }
    return {
        background_mode: 'ai_artwork',
        ai_artwork: {
            prompt: 'Legacy imported background',
            image_url: input.value,
            generation_status: 'done'
        },
        shape: input.shape
    };
}
function buildBackgroundCssStyle(background) {
    if (background.background_mode === 'solid') {
        return {
            background: background.solid_color || '#111827'
        };
    }
    if (background.background_mode === 'gradient' && background.gradient?.stops?.length) {
        const stops = background.gradient.stops.slice(0, 3).map((stop)=>`${stop.color} ${clamp(stop.position, 0, 100)}%`).join(', ');
        const gradientType = background.gradient.type || 'linear';
        const intensity = clamp(background.gradient.intensity ?? 100, 20, 120) / 100;
        const gradientValue = gradientType === 'radial' ? `radial-gradient(circle at center, ${stops})` : gradientType === 'conic' ? `conic-gradient(from ${background.gradient.angle ?? 180}deg at 50% 50%, ${stops})` : `linear-gradient(${background.gradient.angle ?? 135}deg, ${stops})`;
        return {
            backgroundImage: gradientValue,
            filter: `saturate(${intensity})`
        };
    }
    if (background.background_mode === 'ai_artwork' && background.ai_artwork?.image_url) {
        const gradient = background.gradient?.stops?.length ? background.gradient.stops.slice(0, 3).map((stop)=>`${hexToRgba(stop.color, 0.34)} ${clamp(stop.position, 0, 100)}%`).join(', ') : null;
        const gradientType = background.gradient?.type || 'linear';
        const gradientOverlay = gradient ? gradientType === 'radial' ? `radial-gradient(circle at center, ${gradient})` : gradientType === 'conic' ? `conic-gradient(from ${background.gradient?.angle ?? 180}deg at 50% 50%, ${gradient})` : `linear-gradient(${background.gradient?.angle ?? 135}deg, ${gradient})` : null;
        return {
            backgroundImage: gradientOverlay ? `${gradientOverlay}, url(${background.ai_artwork.image_url})` : `url(${background.ai_artwork.image_url})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
        };
    }
    return {
        background: '#111827'
    };
}
const CATEGORY_STYLES = {
    Premium: 'border-amber-300/40 bg-amber-100 text-amber-900',
    Standard: 'border-slate-300/40 bg-slate-200 text-slate-800',
    'Limited Edition': 'border-violet-300/40 bg-violet-100 text-violet-900',
    Rare: 'border-cyan-300/40 bg-cyan-100 text-cyan-900'
};
const PIECE_TYPE_FALLBACK_ICON = {
    jacket: '🧥',
    shirt: '👕',
    top: '👕',
    pants: '👖',
    trouser: '👖',
    bottoms: '👖',
    shoes: '👟',
    footwear: '👟',
    accessory: '👜',
    bag: '👜',
    watch: '⌚'
};
const BRAND_LOGO_BY_NAME = {
    adidas: '/adidas.png',
    nike: '/nike.png',
    zara: '/zara.jpg',
    puma: '/puma.jpg',
    lacoste: '/lacoste.jpg',
    levis: '/levis.jpg',
    'c&a': '/cea.jpg',
    cea: '/cea.jpg'
};
const DESCRIPTION_FALLBACKS = [
    'Balanced outfit with clean visual composition.',
    'Strong style identity with curated piece selection.',
    'Clean structure with a clear visual anchor.',
    'Refined mix of essentials shaped for confident everyday wear.',
    'Intentional layering creates a polished and expressive silhouette.',
    'Versatile combination tuned for comfort, impact, and flow.'
];
const CATEGORY_FALLBACK_ICON = {
    Premium: '💎',
    Standard: '✨',
    'Limited Edition': '🪄',
    Rare: '⭐'
};
const DESCRIPTION_TEMPLATES = [
    ({ mood, styleLine, heroPiece, slotCount })=>`This composition explores a ${mood} mood with ${styleLine.toLowerCase()} direction, anchored by ${heroPiece} and balanced across ${slotCount} curated slots.`,
    ({ occasion, palette, styleLine, heroPiece })=>`Built for ${occasion.toLowerCase()} use, this ${styleLine.toLowerCase()} look pairs ${palette} tones with ${heroPiece} as the visual lead.`,
    ({ styleLine, piecesSummary, mood })=>`A ${styleLine.toLowerCase()} outfit with ${piecesSummary}, delivering a ${mood} aesthetic and a polished premium feel.`,
    ({ heroPiece, palette, occasion })=>`${heroPiece} drives the statement while ${palette} accents keep the silhouette cohesive for ${occasion.toLowerCase()} moments.`,
    ({ styleLine, piecesSummary, mood, occasion })=>`Curated for ${occasion.toLowerCase()}, this ${styleLine.toLowerCase()} composition combines ${piecesSummary} to create a ${mood} identity.`,
    ({ styleLine, heroPiece, palette })=>`Editorial-inspired and ${styleLine.toLowerCase()}, this outfit positions ${heroPiece} against ${palette} accents for refined visual rhythm.`
];
function getCategoryBadgeStyle(category) {
    return CATEGORY_STYLES[category ?? 'Standard'];
}
function normalizeWearstyles(wearstyles) {
    if (!wearstyles?.length) return [];
    return wearstyles.filter(Boolean).slice(0, 3);
}
const PIECE_TYPE_WEARSTYLE_FALLBACKS = [
    {
        matchers: [
            'jacket',
            'coat',
            'blazer'
        ],
        wearstyles: [
            'Statement Piece',
            'Visual Anchor'
        ]
    },
    {
        matchers: [
            'hoodie',
            'sweatshirt',
            'sweater'
        ],
        wearstyles: [
            'Street Core',
            'Balanced Fit'
        ]
    },
    {
        matchers: [
            'shirt',
            'tee',
            'top',
            'blouse'
        ],
        wearstyles: [
            'Visual Anchor',
            'Balanced Fit'
        ]
    },
    {
        matchers: [
            'dress'
        ],
        wearstyles: [
            'Visual Highlight',
            'Statement Piece'
        ]
    },
    {
        matchers: [
            'pants',
            'trouser',
            'jeans',
            'skirt',
            'shorts',
            'lower',
            'bottom'
        ],
        wearstyles: [
            'Base Structure',
            'Balanced Fit'
        ]
    },
    {
        matchers: [
            'shoes',
            'shoe',
            'footwear',
            'boots',
            'sneakers',
            'heels',
            'loafers'
        ],
        wearstyles: [
            'Trend Driver',
            'Street Energy'
        ]
    },
    {
        matchers: [
            'accessory',
            'bag',
            'watch',
            'belt',
            'hat',
            'jewelry',
            'jewellery'
        ],
        wearstyles: [
            'Style Accent',
            'Attention Grabber'
        ]
    }
];
function inferWearstylesByPieceType(pieceType) {
    const normalizedType = pieceType?.trim().toLowerCase() ?? '';
    if (!normalizedType) return [
        'Style Accent'
    ];
    const matchedFallback = PIECE_TYPE_WEARSTYLE_FALLBACKS.find(({ matchers })=>matchers.some((matcher)=>normalizedType.includes(matcher)));
    return matchedFallback?.wearstyles ?? [
        'Style Accent'
    ];
}
const WEARSTYLE_ICON_FILE_MAP = {
    'statement piece': '/statementpiece.png',
    'street core': '/streetcore.png',
    'visual anchor': '/visualanchor.png',
    'base structure': '/basestructure.png',
    'balanced fit': '/balancedfit.png',
    'trend driver': '/trenddriver.png',
    'street energy': '/streetenergy.png',
    'visual highlight': '/visualhighlight.png',
    'style accent': '/styleaccent.png',
    'attention grabber': '/attentiongrabber.png'
};
function getWearstyleIconPath(wearstyle) {
    const mapped = WEARSTYLE_ICON_FILE_MAP[wearstyle.trim().toLowerCase()];
    if (mapped) return mapped;
    const normalizedFileName = wearstyle.trim().toLowerCase().replace(/[^a-z0-9]+/g, '');
    return `/${normalizedFileName}.png`;
}
function getDefaultWearstyleIconDataUri() {
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 18 18'><rect x='1.5' y='1.5' width='15' height='15' rx='4' fill='#EEF2FF' stroke='#CBD5E1'/><circle cx='9' cy='9' r='3.25' fill='#6366F1'/></svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
function getPieceTypeFallbackIcon(pieceType) {
    if (!pieceType) return '👗';
    const normalized = pieceType.trim().toLowerCase();
    const matchedKey = Object.keys(PIECE_TYPE_FALLBACK_ICON).find((key)=>normalized.includes(key));
    return matchedKey ? PIECE_TYPE_FALLBACK_ICON[matchedKey] : '👗';
}
function getCategoryFallbackIcon(category) {
    return CATEGORY_FALLBACK_ICON[category ?? 'Standard'];
}
function resolveBrandLogoUrlByName(brandName) {
    if (!brandName?.trim()) return null;
    const normalizedName = brandName.trim().toLowerCase();
    const compactName = normalizedName.replace(/[^a-z0-9&]/g, '');
    return BRAND_LOGO_BY_NAME[normalizedName] ?? BRAND_LOGO_BY_NAME[compactName] ?? null;
}
function buildOutfitDescriptionRich(input) {
    const style = input.style?.trim() || 'casual';
    const occasion = input.occasion?.trim() || 'daily';
    const styleLine = `${style} ${occasion}`;
    const mood = input.mood?.trim() || 'refined urban';
    const palette = input.palette?.trim() || 'balanced neutral';
    const heroPiece = input.pieces[0]?.name || 'the selected hero piece';
    const piecesSummary = input.pieces.slice(0, 3).map((piece)=>piece.name).join(', ') || 'curated essentials';
    const seedSource = `${input.outfitName || ''}|${style}|${occasion}|${input.brand || ''}|${input.visibility || ''}|${input.pieces.map((piece)=>piece.id).join('|')}`;
    const seed = seedSource.length % DESCRIPTION_TEMPLATES.length;
    return DESCRIPTION_TEMPLATES[seed]({
        ...input,
        style,
        occasion,
        mood,
        palette,
        heroPiece,
        styleLine,
        piecesSummary,
        slotCount: input.pieces.length || 1
    });
}
function buildOutfitDescriptionFallback(input) {
    const firstPiece = input.pieces[0];
    const normalizedWearstyles = normalizeWearstyles(firstPiece?.wearstyles);
    const dominantWearstyle = normalizedWearstyles[0];
    const styleLine = input.outfitStyleLine?.trim();
    if (dominantWearstyle && firstPiece?.name) {
        return `${firstPiece.name} leads this composition with ${dominantWearstyle.toLowerCase()} influence.`;
    }
    if (styleLine && input.pieces.length >= 3) {
        return `Curated ${styleLine.toLowerCase()} direction with layered balance across ${input.pieces.length} key pieces.`;
    }
    if (styleLine && input.outfitName?.trim()) {
        return `${input.outfitName.trim()} explores a ${styleLine.toLowerCase()} mood with clean, intentional styling.`;
    }
    if (styleLine) {
        return `Curated ${styleLine.toLowerCase()} direction with cohesive piece harmony.`;
    }
    const seed = input.pieces.map((piece)=>`${piece.name}|${piece.pieceType}|${piece.category ?? 'standard'}`).join('|').length;
    return DESCRIPTION_FALLBACKS[seed % DESCRIPTION_FALLBACKS.length];
}
}),
"[project]/app/lib/uiToken.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/app/gate/uiTokens.ts
__turbopack_context__.s([
    "CARD_GLASS",
    ()=>CARD_GLASS,
    "FILTER_GLOW_BAR",
    ()=>FILTER_GLOW_BAR,
    "FILTER_GLOW_LINE",
    ()=>FILTER_GLOW_LINE,
    "GLASS",
    ()=>GLASS,
    "GLASS_DEEP",
    ()=>GLASS_DEEP,
    "GLASS_INPUT",
    ()=>GLASS_INPUT,
    "GLASS_PANEL",
    ()=>GLASS_PANEL,
    "GLOW_BAR",
    ()=>GLOW_BAR,
    "GLOW_LINE",
    ()=>GLOW_LINE,
    "INPUT_GLASS",
    ()=>INPUT_GLASS,
    "TEXT_GLOW",
    ()=>TEXT_GLOW
]);
const GLASS = "border border-white/20 bg-white/10";
const GLASS_DEEP = "border border-white/18 bg-white/8 backdrop-blur-2xl";
const FILTER_GLOW_BAR = "bg-white/[0.06] shadow-[0_0_0_1px_rgba(255,255,255,0.10),0_12px_40px_rgba(124,58,237,0.18)]";
const FILTER_GLOW_LINE = "before:pointer-events-none before:absolute before:inset-0 before:rounded-3xl before:bg-[radial-gradient(800px_200px_at_50%_0%,rgba(124,58,237,0.35),transparent_55%)]";
const GLOW_BAR = "bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-500 " + "shadow-[0_14px_45px_rgba(16,185,129,0.25)]";
const GLOW_LINE = "after:content-[''] after:absolute after:left-6 after:right-6 after:-bottom-2 " + "after:h-[10px] after:rounded-full after:bg-gradient-to-r after:from-cyan-400/40 after:via-teal-300/40 after:to-emerald-400/40 " + "after:blur-xl";
const TEXT_GLOW = "text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.25)]";
const GLASS_PANEL = "relative rounded-3xl border border-white/15 bg-white/[0.08] backdrop-blur-2xl shadow-[0_18px_60px_rgba(0,0,0,0.35)]";
const GLASS_INPUT = "h-12 w-full rounded-2xl border border-white/14 bg-white/[0.08] backdrop-blur-2xl px-3 text-white placeholder:text-white/45 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/35";
const CARD_GLASS = "rounded-3xl border border-white/14 bg-white/[0.08] backdrop-blur-2xl shadow-[0_18px_60px_rgba(0,0,0,0.30)]";
const INPUT_GLASS = "w-full rounded-2xl border border-white/18 bg-white/80 px-4 py-3 text-slate-900 placeholder:text-slate-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-300/35";
}),
"[project]/app/lib/fabricTextureRenderer.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "buildFabricScopeStyle",
    ()=>buildFabricScopeStyle,
    "renderFabricTextureToCanvas",
    ()=>renderFabricTextureToCanvas
]);
const clamp = (value, min, max)=>Math.min(max, Math.max(min, value));
const parseHex = (hex)=>{
    const normalized = /^#[0-9A-F]{6}$/i.test(hex) ? hex : '#3f3f46';
    return {
        r: Number.parseInt(normalized.slice(1, 3), 16),
        g: Number.parseInt(normalized.slice(3, 5), 16),
        b: Number.parseInt(normalized.slice(5, 7), 16)
    };
};
const tint = (hex, delta, alpha = 1)=>{
    const { r, g, b } = parseHex(hex);
    const next = (channel)=>clamp(Math.round(channel + delta), 0, 255);
    return `rgba(${next(r)}, ${next(g)}, ${next(b)}, ${alpha})`;
};
function directionToAngle(direction) {
    if (direction === 'horizontal') return 0;
    if (direction === 'vertical') return Math.PI / 2;
    if (direction === 'diagonal') return Math.PI / 4;
    return Math.PI / 4;
}
function drawThreadField(ctx, width, height, material, color, angle) {
    const density = clamp(material.density, 10, 140);
    const spacing = Math.max(4, Math.round(26 - density * 0.2));
    const threadLength = Math.max(6, Math.round(spacing * 1.5));
    const thickness = clamp(material.threadThickness, 0.4, 5);
    const emboss = clamp(material.embossIntensity, 0, 100) / 100;
    ctx.lineCap = 'round';
    for(let y = -height; y < height * 2; y += spacing){
        for(let x = -width; x < width * 2; x += spacing){
            const jitter = (x * 13 + y * 7) % 9 - 4;
            const cx = x + jitter;
            const cy = y - jitter * 0.3;
            const dx = Math.cos(angle) * threadLength * 0.5;
            const dy = Math.sin(angle) * threadLength * 0.5;
            ctx.strokeStyle = tint(color, 42, 0.16 + emboss * 0.1);
            ctx.lineWidth = thickness + 0.45;
            ctx.beginPath();
            ctx.moveTo(cx - dx + 0.8, cy - dy + 0.8);
            ctx.lineTo(cx + dx + 0.8, cy + dy + 0.8);
            ctx.stroke();
            ctx.strokeStyle = tint(color, -36, 0.22 + emboss * 0.12);
            ctx.lineWidth = thickness;
            ctx.beginPath();
            ctx.moveTo(cx - dx, cy - dy);
            ctx.lineTo(cx + dx, cy + dy);
            ctx.stroke();
        }
    }
}
function drawLegoField(ctx, width, height, material, color) {
    const density = clamp(material.density, 10, 140);
    const blockSize = clamp(Math.round(56 - density * 0.22), 22, 54);
    const gap = Math.max(2, Math.round(blockSize * 0.08));
    const emboss = clamp(material.embossIntensity, 0, 100) / 100;
    for(let y = 0; y < height + blockSize; y += blockSize + gap){
        for(let x = 0; x < width + blockSize; x += blockSize + gap){
            const jitter = (x * 17 + y * 11) % 6 - 3;
            const bx = x + jitter * 0.35;
            const by = y + jitter * 0.2;
            const radius = Math.max(4, Math.round(blockSize * 0.15));
            ctx.fillStyle = tint(color, 4 + jitter, 0.92);
            ctx.beginPath();
            ctx.roundRect(bx, by, blockSize, blockSize, radius);
            ctx.fill();
            ctx.strokeStyle = tint(color, -30, 0.32);
            ctx.lineWidth = 1.3;
            ctx.beginPath();
            ctx.roundRect(bx + 0.8, by + 0.8, blockSize - 1.6, blockSize - 1.6, radius - 1);
            ctx.stroke();
            ctx.fillStyle = tint(color, 22, 0.34 + emboss * 0.2);
            ctx.fillRect(bx + 2, by + 2, blockSize - 6, Math.max(2, Math.round(blockSize * 0.18)));
            const studRadius = Math.max(3, Math.round(blockSize * 0.14));
            const studOffset = blockSize / 3;
            const studCenters = [
                [
                    bx + studOffset,
                    by + studOffset
                ],
                [
                    bx + blockSize - studOffset,
                    by + studOffset
                ],
                [
                    bx + studOffset,
                    by + blockSize - studOffset
                ],
                [
                    bx + blockSize - studOffset,
                    by + blockSize - studOffset
                ]
            ];
            studCenters.forEach(([cx, cy])=>{
                const gradient = ctx.createRadialGradient(cx - studRadius * 0.35, cy - studRadius * 0.35, 1, cx, cy, studRadius + 1.5);
                gradient.addColorStop(0, tint(color, 38, 0.86));
                gradient.addColorStop(0.55, tint(color, 10, 0.9));
                gradient.addColorStop(1, tint(color, -28, 0.78));
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(cx, cy, studRadius, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = tint(color, -45, 0.42);
                ctx.lineWidth = 0.8;
                ctx.beginPath();
                ctx.arc(cx, cy, studRadius, 0, Math.PI * 2);
                ctx.stroke();
            });
        }
    }
}
function drawWaterField(ctx, width, height, material, color) {
    const density = clamp(material.density, 10, 140);
    const rippleGap = clamp(Math.round(36 - density * 0.16), 10, 34);
    const emboss = clamp(material.embossIntensity, 0, 100) / 100;
    for(let y = -20; y < height + 20; y += rippleGap){
        const amplitude = 6 + emboss * 9 + y % 13 * 0.1;
        const wave = 60 - density * 0.18;
        ctx.strokeStyle = tint(color, 26, 0.22 + emboss * 0.14);
        ctx.lineWidth = 1.8 + emboss * 1.2;
        ctx.beginPath();
        for(let x = -20; x <= width + 20; x += 10){
            const py = y + Math.sin((x + y * 0.6) / wave) * amplitude;
            if (x === -20) ctx.moveTo(x, py);
            else ctx.lineTo(x, py);
        }
        ctx.stroke();
        ctx.strokeStyle = tint(color, -20, 0.16 + emboss * 0.1);
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        for(let x = -20; x <= width + 20; x += 10){
            const py = y + rippleGap * 0.35 + Math.sin((x + y) / (wave * 0.85)) * (amplitude * 0.55);
            if (x === -20) ctx.moveTo(x, py);
            else ctx.lineTo(x, py);
        }
        ctx.stroke();
    }
    const causticCount = Math.round(width * height / 18000);
    for(let i = 0; i < causticCount; i += 1){
        const cx = i * 73 % width;
        const cy = i * 97 % height;
        const rx = 18 + i % 6 * 6;
        const ry = 6 + i % 4 * 3;
        ctx.strokeStyle = tint(color, 40, 0.12);
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx, ry, i % 8 * 0.35, 0, Math.PI * 2);
        ctx.stroke();
    }
}
function drawGlassField(ctx, width, height, material, color) {
    const density = clamp(material.density, 10, 140);
    const cellSize = clamp(Math.round(68 - density * 0.22), 22, 72);
    const emboss = clamp(material.embossIntensity, 0, 100) / 100;
    for(let y = 0; y < height + cellSize; y += cellSize){
        for(let x = 0; x < width + cellSize; x += cellSize){
            const jitter = (x * 5 + y * 3) % 7 - 3;
            const paneX = x + jitter * 0.5;
            const paneY = y - jitter * 0.35;
            const paneW = cellSize + jitter % 2 * 2;
            const paneH = cellSize - jitter % 3;
            const radius = Math.max(4, Math.round(cellSize * 0.14));
            const paneGradient = ctx.createLinearGradient(paneX, paneY, paneX + paneW, paneY + paneH);
            paneGradient.addColorStop(0, tint(color, 26, 0.18 + emboss * 0.12));
            paneGradient.addColorStop(0.5, 'rgba(255,255,255,0.02)');
            paneGradient.addColorStop(1, tint(color, -12, 0.16));
            ctx.fillStyle = paneGradient;
            ctx.beginPath();
            ctx.roundRect(paneX, paneY, paneW, paneH, radius);
            ctx.fill();
            ctx.strokeStyle = tint(color, 34, 0.22);
            ctx.lineWidth = 1.4;
            ctx.beginPath();
            ctx.roundRect(paneX + 0.6, paneY + 0.6, paneW - 1.2, paneH - 1.2, radius - 1);
            ctx.stroke();
            ctx.strokeStyle = tint(color, -26, 0.18);
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(paneX + paneW * 0.18, paneY + paneH * 0.2);
            ctx.lineTo(paneX + paneW * 0.82, paneY + paneH * 0.8);
            ctx.stroke();
        }
    }
}
function renderFabricTextureToCanvas(input) {
    if (typeof document === 'undefined') {
        return {
            textureDataUrl: null,
            decorativeDataUrl: null
        };
    }
    const width = clamp(Math.round(input.width), 220, 1200);
    const height = clamp(Math.round(input.height), 260, 1600);
    const { material } = input;
    const textureCanvas = document.createElement('canvas');
    textureCanvas.width = width;
    textureCanvas.height = height;
    const textureCtx = textureCanvas.getContext('2d');
    if (!textureCtx) return {
        textureDataUrl: null,
        decorativeDataUrl: null
    };
    textureCtx.fillStyle = tint(input.color, -6, 0.95);
    textureCtx.fillRect(0, 0, width, height);
    const noiseAlpha = 0.035 + clamp(material.surfaceContrast, 0, 100) / 2200;
    for(let y = 0; y < height; y += 2){
        for(let x = 0; x < width; x += 2){
            const grain = (x * 37 + y * 19) % 100 / 100;
            textureCtx.fillStyle = grain > 0.5 ? tint(input.color, 18, noiseAlpha) : tint(input.color, -14, noiseAlpha);
            textureCtx.fillRect(x, y, 2, 2);
        }
    }
    if (material.type === 'lego_material') {
        drawLegoField(textureCtx, width, height, material, input.color);
    } else if (material.type === 'water_material') {
        drawWaterField(textureCtx, width, height, material, input.color);
    } else if (material.type === 'glass_material') {
        drawGlassField(textureCtx, width, height, material, input.color);
    } else {
        const primaryAngle = directionToAngle(material.threadDirection);
        drawThreadField(textureCtx, width, height, material, input.color, primaryAngle);
        if (material.threadDirection === 'cross' || material.threadDirection === 'diagonal') {
            drawThreadField(textureCtx, width, height, material, input.color, primaryAngle + Math.PI / 2.5);
        }
    }
    const finishGradient = textureCtx.createLinearGradient(0, 0, width, height);
    if (material.finish === 'satin') {
        finishGradient.addColorStop(0, tint(input.color, 26, 0.18));
        finishGradient.addColorStop(0.4, 'rgba(255,255,255,0.02)');
        finishGradient.addColorStop(1, tint(input.color, -28, 0.28));
    } else {
        finishGradient.addColorStop(0, tint(input.color, 14, 0.08));
        finishGradient.addColorStop(1, tint(input.color, -18, 0.14));
    }
    textureCtx.fillStyle = finishGradient;
    textureCtx.fillRect(0, 0, width, height);
    const decorativeCanvas = document.createElement('canvas');
    decorativeCanvas.width = width;
    decorativeCanvas.height = height;
    const decoCtx = decorativeCanvas.getContext('2d');
    if (!decoCtx) return {
        textureDataUrl: textureCanvas.toDataURL('image/png'),
        decorativeDataUrl: null
    };
    if (material.stitchBorder) {
        const pad = Math.round(Math.min(width, height) * 0.05);
        decoCtx.strokeStyle = tint(material.stitchColor, -8, 0.9);
        decoCtx.lineWidth = Math.max(1, material.threadThickness + 0.8);
        decoCtx.setLineDash([
            9,
            7
        ]);
        decoCtx.lineCap = 'round';
        decoCtx.beginPath();
        decoCtx.roundRect(pad, pad, width - pad * 2, height - pad * 2, Math.round(pad * 0.35));
        decoCtx.stroke();
        decoCtx.strokeStyle = 'rgba(255,255,255,0.22)';
        decoCtx.lineWidth = 1;
        decoCtx.setLineDash([
            2,
            12
        ]);
        decoCtx.beginPath();
        decoCtx.roundRect(pad + 4, pad + 4, width - (pad + 4) * 2, height - (pad + 4) * 2, Math.round(pad * 0.3));
        decoCtx.stroke();
    }
    return {
        textureDataUrl: textureCanvas.toDataURL('image/png'),
        decorativeDataUrl: decorativeCanvas.toDataURL('image/png')
    };
}
function buildFabricScopeStyle(scope) {
    if (scope === 'hero_block') {
        return {
            inset: '8% 6% 45% 6%'
        };
    }
    if (scope === 'content_block') {
        return {
            inset: '50% 6% 8% 6%'
        };
    }
    return {
        inset: '0'
    };
}
}),
"[project]/app/lib/materialPresets.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MATERIAL_PRESETS",
    ()=>MATERIAL_PRESETS,
    "applyFabricMaterialToCard",
    ()=>applyFabricMaterialToCard,
    "buildFabricPresetConfig",
    ()=>buildFabricPresetConfig
]);
const clamp = (value, min, max)=>Math.min(max, Math.max(min, value));
const resolveNumeric = (value, fallback, min, max)=>{
    if (typeof value !== 'number' || Number.isNaN(value)) return fallback;
    return clamp(value, min, max);
};
function buildFabricPresetConfig(baseColor, overrides = {}) {
    const stitched = overrides.stitchColor || '#1e3a8a';
    const type = overrides.type ?? 'embroidered_fabric';
    return {
        type,
        density: resolveNumeric(overrides.density, 72, 10, 140),
        threadDirection: overrides.threadDirection ?? 'cross',
        threadThickness: resolveNumeric(overrides.threadThickness, 1.8, 0.4, 5),
        embossIntensity: resolveNumeric(overrides.embossIntensity, 42, 0, 100),
        stitchBorder: overrides.stitchBorder ?? true,
        stitchColor: /^#[0-9A-F]{6}$/i.test(stitched) ? stitched : '#1e3a8a',
        surfaceContrast: resolveNumeric(overrides.surfaceContrast, 48, 0, 100),
        finish: overrides.finish ?? 'matte',
        scope: overrides.scope ?? 'card',
        premium: overrides.premium ?? type !== 'none'
    };
}
const MATERIAL_PRESETS = [
    {
        id: 'none',
        label: 'None',
        tier: 'standard',
        description: 'Color and gradient only.',
        buildConfig: ()=>({
                type: 'none',
                density: 0,
                threadDirection: 'cross',
                threadThickness: 1,
                embossIntensity: 0,
                stitchBorder: false,
                stitchColor: '#1e3a8a',
                surfaceContrast: 0,
                finish: 'matte',
                scope: 'card',
                premium: false
            })
    },
    {
        id: 'embroidered_fabric',
        label: 'Embroidered Fabric / Textile Material',
        tier: 'premium',
        description: 'Premium woven textile with stitched details and soft embossed depth.',
        buildConfig: (baseColor)=>buildFabricPresetConfig(baseColor, {
                type: 'embroidered_fabric',
                finish: 'matte'
            })
    },
    {
        id: 'lego_material',
        label: 'Lego Material',
        tier: 'premium',
        description: 'Chunkier block-like structure with bold thread highlights.',
        buildConfig: (baseColor)=>buildFabricPresetConfig(baseColor, {
                type: 'lego_material',
                density: 48,
                threadThickness: 3.2,
                surfaceContrast: 74,
                embossIntensity: 60,
                finish: 'matte'
            })
    },
    {
        id: 'glass_material',
        label: 'Glass Material',
        tier: 'premium',
        description: 'Translucent textile sheen with satin-like highlights.',
        buildConfig: (baseColor)=>buildFabricPresetConfig(baseColor, {
                type: 'glass_material',
                density: 86,
                threadThickness: 0.9,
                surfaceContrast: 38,
                embossIntensity: 24,
                finish: 'satin'
            })
    },
    {
        id: 'water_material',
        label: 'Water Material',
        tier: 'premium',
        description: 'Fluid directional streaks with deeper tonal movement.',
        buildConfig: (baseColor)=>buildFabricPresetConfig(baseColor, {
                type: 'water_material',
                density: 96,
                threadDirection: 'diagonal',
                threadThickness: 1.2,
                surfaceContrast: 66,
                embossIntensity: 34,
                finish: 'satin'
            })
    }
];
function applyFabricMaterialToCard(background, material) {
    if (material.type === 'none') {
        return {
            ...background,
            materialLayer: undefined,
            decorativeOverlayLayer: undefined
        };
    }
    return {
        ...background,
        materialLayer: {
            type: material.type,
            color: background.solid_color || background.gradient?.stops?.[0]?.color || '#374151',
            density: material.density,
            threadDirection: material.threadDirection,
            threadThickness: material.threadThickness,
            embossIntensity: material.embossIntensity,
            surfaceContrast: material.surfaceContrast,
            finish: material.finish,
            scope: material.scope,
            premium: true
        },
        decorativeOverlayLayer: {
            stitchBorder: material.stitchBorder,
            stitchColor: material.stitchColor,
            opacity: 0.72
        },
        studioStyleConfig: {
            ...background.studioStyleConfig,
            material: material.type,
            metadata: {
                ...background.studioStyleConfig?.metadata || {},
                materialTier: 'premium'
            }
        }
    };
}
}),
"[project]/app/lib/artwork-studio.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "applyArtworkToOutfitCard",
    ()=>applyArtworkToOutfitCard,
    "mapArtworkAssetToCardBackgroundLayer",
    ()=>mapArtworkAssetToCardBackgroundLayer,
    "mapArtworkAssetToOverlayLayer",
    ()=>mapArtworkAssetToOverlayLayer
]);
function mapArtworkAssetToCardBackgroundLayer(asset) {
    return {
        background_mode: 'ai_artwork',
        ai_artwork: {
            prompt: asset.prompt,
            image_url: asset.output_url,
            generation_status: 'done'
        },
        texture_overlay: true,
        shape: 'none'
    };
}
function mapArtworkAssetToOverlayLayer(asset) {
    return {
        background_mode: 'ai_artwork',
        ai_artwork: {
            prompt: `${asset.prompt} (overlay mode)`,
            image_url: asset.output_url,
            generation_status: 'done'
        },
        texture_overlay: true,
        shape: 'mesh'
    };
}
function applyArtworkToOutfitCard(asset, mode) {
    if (mode === 'background') return mapArtworkAssetToCardBackgroundLayer(asset);
    if (mode === 'overlay') return mapArtworkAssetToOverlayLayer(asset);
    if (mode === 'frame') {
        return {
            ...mapArtworkAssetToOverlayLayer(asset),
            shape: 'diamond'
        };
    }
    return {
        ...mapArtworkAssetToOverlayLayer(asset),
        shape: 'orb'
    };
}
}),
"[project]/app/lib/outfit-piece-options.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "COLOR_SYNONYMS",
    ()=>COLOR_SYNONYMS,
    "MATERIAL_SYNONYMS",
    ()=>MATERIAL_SYNONYMS,
    "OCCASION_TAG_SYNONYMS",
    ()=>OCCASION_TAG_SYNONYMS,
    "OUTFIT_PIECE_OPTIONS",
    ()=>OUTFIT_PIECE_OPTIONS,
    "SLOT_TYPE_ALIASES",
    ()=>SLOT_TYPE_ALIASES,
    "STYLE_TAG_SYNONYMS",
    ()=>STYLE_TAG_SYNONYMS
]);
const OUTFIT_PIECE_OPTIONS = {
    upper: [
        {
            value: 't-shirt',
            label: 'T-Shirt',
            synonyms: [
                'tshirt',
                't-shirt',
                'tee',
                'camiseta',
                'camisa basica'
            ]
        },
        {
            value: 'shirt',
            label: 'Shirt',
            synonyms: [
                'camisa',
                'social shirt',
                'button up',
                'button-up'
            ]
        },
        {
            value: 'polo',
            label: 'Polo',
            synonyms: [
                'polo shirt',
                'camisa polo'
            ]
        },
        {
            value: 'hoodie',
            label: 'Hoodie',
            synonyms: [
                'moletom',
                'hooded sweatshirt'
            ]
        },
        {
            value: 'sweater',
            label: 'Sweater',
            synonyms: [
                'sueter',
                'pullover',
                'tricô',
                'tricot'
            ]
        },
        {
            value: 'cardigan',
            label: 'Cardigan',
            synonyms: [
                'cardigã',
                'cardiga'
            ]
        },
        {
            value: 'blazer',
            label: 'Blazer',
            synonyms: [
                'sport coat'
            ]
        },
        {
            value: 'jacket',
            label: 'Jacket',
            synonyms: [
                'jaqueta',
                'bomber',
                'windbreaker'
            ]
        },
        {
            value: 'coat',
            label: 'Coat',
            synonyms: [
                'casaco',
                'sobretudo'
            ]
        },
        {
            value: 'trench-coat',
            label: 'Trench Coat',
            synonyms: [
                'trench',
                'gabardine'
            ]
        },
        {
            value: 'vest',
            label: 'Vest',
            synonyms: [
                'colete',
                'waistcoat'
            ]
        },
        {
            value: 'crop-top',
            label: 'Crop Top',
            synonyms: [
                'cropped',
                'top cropped'
            ]
        },
        {
            value: 'tank-top',
            label: 'Tank Top',
            synonyms: [
                'regata'
            ]
        },
        {
            value: 'sweatshirt',
            label: 'Sweatshirt',
            synonyms: [
                'crewneck'
            ]
        }
    ],
    lower: [
        {
            value: 'jeans',
            label: 'Jeans',
            synonyms: [
                'calça jeans',
                'denim pants'
            ]
        },
        {
            value: 'trousers',
            label: 'Trousers',
            synonyms: [
                'calça social',
                'pants',
                'calça'
            ]
        },
        {
            value: 'cargo-pants',
            label: 'Cargo Pants',
            synonyms: [
                'cargo',
                'calça cargo'
            ]
        },
        {
            value: 'shorts',
            label: 'Shorts',
            synonyms: [
                'short',
                'bermuda'
            ]
        },
        {
            value: 'skirt',
            label: 'Skirt',
            synonyms: [
                'saia'
            ]
        },
        {
            value: 'leggings',
            label: 'Leggings',
            synonyms: [
                'legging'
            ]
        },
        {
            value: 'joggers',
            label: 'Joggers',
            synonyms: [
                'calça jogger',
                'sweatpants'
            ]
        },
        {
            value: 'chinos',
            label: 'Chinos',
            synonyms: [
                'chino'
            ]
        },
        {
            value: 'wide-leg-pants',
            label: 'Wide-leg Pants',
            synonyms: [
                'wide leg',
                'pantalona'
            ]
        },
        {
            value: 'mini-skirt',
            label: 'Mini Skirt',
            synonyms: [
                'minissaia',
                'mini saia'
            ]
        },
        {
            value: 'midi-skirt',
            label: 'Midi Skirt',
            synonyms: [
                'saia midi'
            ]
        }
    ],
    shoes: [
        {
            value: 'sneakers',
            label: 'Sneakers',
            synonyms: [
                'tenis',
                'tênis',
                'trainer'
            ]
        },
        {
            value: 'boots',
            label: 'Boots',
            synonyms: [
                'bota',
                'boot'
            ]
        },
        {
            value: 'loafers',
            label: 'Loafers',
            synonyms: [
                'mocassim'
            ]
        },
        {
            value: 'heels',
            label: 'Heels',
            synonyms: [
                'salto',
                'high heels'
            ]
        },
        {
            value: 'sandals',
            label: 'Sandals',
            synonyms: [
                'sandalia',
                'sandália'
            ]
        },
        {
            value: 'flats',
            label: 'Flats',
            synonyms: [
                'sapatilha'
            ]
        },
        {
            value: 'dress-shoes',
            label: 'Dress Shoes',
            synonyms: [
                'social shoes',
                'sapato social'
            ]
        },
        {
            value: 'running-shoes',
            label: 'Running Shoes',
            synonyms: [
                'running',
                'tenis corrida',
                'tênis corrida'
            ]
        }
    ],
    accessory: [
        {
            value: 'bag',
            label: 'Bag',
            synonyms: [
                'bolsa',
                'purse'
            ]
        },
        {
            value: 'backpack',
            label: 'Backpack',
            synonyms: [
                'mochila'
            ]
        },
        {
            value: 'cap',
            label: 'Cap',
            synonyms: [
                'boné',
                'bone'
            ]
        },
        {
            value: 'hat',
            label: 'Hat',
            synonyms: [
                'chapéu',
                'chapeu'
            ]
        },
        {
            value: 'belt',
            label: 'Belt',
            synonyms: [
                'cinto'
            ]
        },
        {
            value: 'sunglasses',
            label: 'Sunglasses',
            synonyms: [
                'óculos de sol',
                'oculos de sol'
            ]
        },
        {
            value: 'watch',
            label: 'Watch',
            synonyms: [
                'relogio',
                'relógio'
            ]
        },
        {
            value: 'necklace',
            label: 'Necklace',
            synonyms: [
                'colar'
            ]
        },
        {
            value: 'bracelet',
            label: 'Bracelet',
            synonyms: [
                'pulseira'
            ]
        },
        {
            value: 'earrings',
            label: 'Earrings',
            synonyms: [
                'brincos',
                'brinco'
            ]
        },
        {
            value: 'scarf',
            label: 'Scarf',
            synonyms: [
                'cachecol'
            ]
        }
    ]
};
const SLOT_TYPE_ALIASES = {
    upper: [
        'upper',
        'upper piece',
        'top',
        'tops',
        'base_upper',
        'outer_layer'
    ],
    lower: [
        'lower',
        'lower piece',
        'bottom',
        'bottoms'
    ],
    shoes: [
        'shoes',
        'shoes piece',
        'shoe',
        'footwear'
    ],
    accessory: [
        'accessory',
        'accessories'
    ]
};
const COLOR_SYNONYMS = {
    azul: 'Blue',
    blue: 'Blue',
    navy: 'Navy',
    marinho: 'Navy',
    preto: 'Black',
    black: 'Black',
    branco: 'White',
    white: 'White',
    cinza: 'Gray',
    grey: 'Gray',
    gray: 'Gray',
    bege: 'Beige',
    beige: 'Beige',
    marrom: 'Brown',
    castanho: 'Brown',
    brown: 'Brown',
    vermelho: 'Red',
    red: 'Red',
    vinho: 'Burgundy',
    burgundy: 'Burgundy',
    verde: 'Green',
    green: 'Green',
    oliva: 'Olive',
    olive: 'Olive',
    amarelo: 'Yellow',
    yellow: 'Yellow',
    roxo: 'Purple',
    purple: 'Purple',
    rosa: 'Pink',
    pink: 'Pink',
    laranja: 'Orange',
    orange: 'Orange'
};
const MATERIAL_SYNONYMS = {
    jeans: 'Denim',
    denim: 'Denim',
    couro: 'Leather',
    leather: 'Leather',
    algodao: 'Cotton',
    algodão: 'Cotton',
    cotton: 'Cotton',
    linho: 'Linen',
    linen: 'Linen',
    seda: 'Silk',
    silk: 'Silk',
    la: 'Wool',
    lã: 'Wool',
    wool: 'Wool',
    nylon: 'Nylon'
};
const STYLE_TAG_SYNONYMS = {
    casual: 'casual',
    streetwear: 'streetwear',
    urbano: 'urban',
    urban: 'urban',
    formal: 'formal',
    social: 'formal',
    minimal: 'minimal',
    minimalista: 'minimal',
    esportivo: 'sporty',
    sporty: 'sporty',
    chic: 'chic'
};
const OCCASION_TAG_SYNONYMS = {
    dia: 'day',
    day: 'day',
    noite: 'night',
    night: 'night',
    trabalho: 'work',
    work: 'work',
    festa: 'party',
    party: 'party',
    daily: 'daily',
    cotidiano: 'daily',
    casual: 'casual'
};
}),
"[project]/app/lib/outfit-ai-mapping.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "buildOutfitCardDraftFromPrompt",
    ()=>buildOutfitCardDraftFromPrompt,
    "mapAiInterpretationToManualForm",
    ()=>mapAiInterpretationToManualForm,
    "normalizeDetectedColor",
    ()=>normalizeDetectedColor,
    "normalizeDetectedMaterial",
    ()=>normalizeDetectedMaterial,
    "normalizeDetectedPieceType",
    ()=>normalizeDetectedPieceType,
    "normalizeTagList",
    ()=>normalizeTagList
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$outfit$2d$piece$2d$options$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/outfit-piece-options.ts [app-ssr] (ecmascript)");
;
const tokenize = (value)=>value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
const uniq = (values)=>Array.from(new Set(values.filter(Boolean)));
const detectByDictionary = (text, dict)=>{
    const normalized = tokenize(text).join(' ');
    const match = Object.entries(dict).find(([key])=>normalized.includes(key));
    return match?.[1] ?? null;
};
function normalizeDetectedPieceType(value) {
    if (!value) return null;
    const normalized = value.trim().toLowerCase();
    const slot = Object.keys(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$outfit$2d$piece$2d$options$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SLOT_TYPE_ALIASES"]).find((key)=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$outfit$2d$piece$2d$options$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SLOT_TYPE_ALIASES"][key].some((alias)=>normalized.includes(alias)));
    if (slot) return slot;
    for (const [slotKey, options] of Object.entries(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$outfit$2d$piece$2d$options$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["OUTFIT_PIECE_OPTIONS"])){
        if (options.some((option)=>[
                option.value,
                option.label.toLowerCase(),
                ...option.synonyms
            ].some((syn)=>normalized.includes(syn)))) {
            return slotKey;
        }
    }
    return null;
}
function normalizeDetectedColor(value) {
    if (!value) return null;
    return detectByDictionary(value, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$outfit$2d$piece$2d$options$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLOR_SYNONYMS"]);
}
function normalizeDetectedMaterial(value) {
    if (!value) return null;
    return detectByDictionary(value, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$outfit$2d$piece$2d$options$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MATERIAL_SYNONYMS"]);
}
function normalizeTagList(values, dict) {
    if (!values?.length) return [];
    return uniq(values.map((entry)=>detectByDictionary(entry, dict) || entry.trim().toLowerCase()));
}
function buildOutfitCardDraftFromPrompt(prompt) {
    const normalized = prompt.trim();
    const tokens = tokenize(normalized);
    const detectedItems = [];
    for (const [slot, options] of Object.entries(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$outfit$2d$piece$2d$options$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["OUTFIT_PIECE_OPTIONS"])){
        options.forEach((option)=>{
            const found = [
                option.value,
                option.label.toLowerCase(),
                ...option.synonyms
            ].some((alias)=>tokens.join(' ').includes(alias.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')));
            if (!found) return;
            detectedItems.push({
                piece_type: slot,
                display_label: option.label,
                color: normalizeDetectedColor(normalized),
                material: normalizeDetectedMaterial(normalized),
                inferred_role: slot === 'upper' ? detectedItems.some((item)=>item.piece_type === 'upper') ? 'outer_layer' : 'base_upper' : null,
                confidence: 0.5
            });
        });
    }
    return {
        title: normalized ? `AI Outfit · ${normalized.slice(0, 42)}` : 'AI Outfit Draft',
        description: normalized,
        detectedStyleTags: normalizeTagList(tokens, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$outfit$2d$piece$2d$options$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["STYLE_TAG_SYNONYMS"]),
        detectedOccasionTags: normalizeTagList(tokens, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$outfit$2d$piece$2d$options$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["OCCASION_TAG_SYNONYMS"]),
        gender: tokens.includes('masculino') || tokens.includes('male') ? 'masculino' : tokens.includes('feminino') || tokens.includes('female') ? 'feminino' : null,
        mood: tokens.includes('streetwear') ? 'Streetwear' : tokens.includes('casual') ? 'Casual' : null,
        items: detectedItems,
        warnings: detectedItems.length ? [] : [
            'Nenhuma peça específica foi detectada com alta confiança.'
        ]
    };
}
function mapAiInterpretationToManualForm(params) {
    const slotAssignments = {};
    const aiSlotOptions = {
        upper: [],
        lower: [],
        shoes: [],
        accessory: []
    };
    params.interpretation.items.forEach((item, index)=>{
        const slot = normalizeDetectedPieceType(item.piece_type) ?? normalizeDetectedPieceType(item.display_label);
        if (!slot) return;
        const inventoryMatch = params.wardrobeItems.find((wardrobeItem)=>wardrobeItem.name.toLowerCase().includes(item.display_label.toLowerCase()));
        const aiOptionId = `suggested:${slot}:ai-${index + 1}`;
        aiSlotOptions[slot].push({
            value: aiOptionId,
            label: item.display_label
        });
        if (!slotAssignments[slot]) {
            slotAssignments[slot] = inventoryMatch?.wardrobe_item_id || aiOptionId;
        }
    });
    return {
        slotAssignments,
        aiSlotOptions,
        style: params.interpretation.detectedStyleTags[0] || '',
        occasion: params.interpretation.detectedOccasionTags[0] || '',
        title: params.interpretation.title || '',
        mood: params.interpretation.mood || ''
    };
}
}),
"[project]/app/lib/wardrobeModelUrl.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/app/lib/fashion-ai/utils/garment-compatibility.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "isPieceCompatibleWithMannequin",
    ()=>isPieceCompatibleWithMannequin
]);
function isPieceCompatibleWithMannequin(fitProfile, mannequinId, mannequin) {
    if (fitProfile.preparationStatus !== 'ready') return false;
    if (!fitProfile.preparedAssetUrl) return false;
    if (fitProfile.targetGender === 'male' && mannequinId !== 'male_v1') return false;
    if (fitProfile.targetGender === 'female' && mannequinId !== 'female_v1') return false;
    if (!Array.isArray(fitProfile.compatibleMannequins) || !fitProfile.compatibleMannequins.includes(mannequinId)) return false;
    if (mannequin) {
        const slot = mannequin.slots[fitProfile.pieceType];
        if (!slot) return false;
    }
    return true;
}
}),
"[project]/app/lib/fashion-ai/services/MannequinFitService.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MannequinFitService",
    ()=>MannequinFitService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$fashion$2d$ai$2f$utils$2f$garment$2d$compatibility$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/fashion-ai/utils/garment-compatibility.ts [app-ssr] (ecmascript)");
;
class MannequinFitService {
    buildFittedGarmentLayer(args) {
        const { mannequin, fitProfile } = args;
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$fashion$2d$ai$2f$utils$2f$garment$2d$compatibility$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isPieceCompatibleWithMannequin"])(fitProfile, mannequin.id, mannequin)) {
            throw new Error('Incompatible piece for mannequin or piece is not ready.');
        }
        const slot = mannequin.slots[fitProfile.pieceType];
        if (!slot) throw new Error(`Slot ${fitProfile.pieceType} not available for mannequin ${mannequin.id}.`);
        const bbox = slot.bbox;
        const normalizedBBox = fitProfile.normalizedBBox;
        const hasUsableNormalizedBBox = Boolean(normalizedBBox) && (normalizedBBox?.w ?? 0) > 0.01 && (normalizedBBox?.h ?? 0) > 0.01 && (normalizedBBox?.w ?? 0) <= 1 && (normalizedBBox?.h ?? 0) <= 1;
        // When the prepared garment image still contains extra transparent/white padding,
        // normalizedBBox describes where the garment content sits inside that image.
        // We project the full image so that the garment bbox fits exactly into the mannequin slot.
        const width = hasUsableNormalizedBBox ? bbox.w / (normalizedBBox?.w ?? 1) : bbox.w;
        const height = hasUsableNormalizedBBox ? bbox.h / (normalizedBBox?.h ?? 1) : bbox.h;
        const x = hasUsableNormalizedBBox ? bbox.x - (normalizedBBox?.x ?? 0) * width : bbox.x;
        const y = hasUsableNormalizedBBox ? bbox.y - (normalizedBBox?.y ?? 0) * height : bbox.y;
        return {
            assetUrl: fitProfile.preparedAssetUrl,
            x,
            y,
            width,
            height,
            clipMaskUrl: slot.clipMaskUrl ?? fitProfile.preparedMaskUrl ?? null,
            slot: fitProfile.pieceType
        };
    }
}
}),
"[project]/app/lib/fashion-ai/services/Tester2DRenderService.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Tester2DRenderService",
    ()=>Tester2DRenderService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$fashion$2d$ai$2f$services$2f$MannequinFitService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/fashion-ai/services/MannequinFitService.ts [app-ssr] (ecmascript)");
;
const slotOrder = [
    'full_body',
    'top',
    'bottom',
    'shoes',
    'accessory'
];
class Tester2DRenderService {
    fitService;
    constructor(fitService = new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$fashion$2d$ai$2f$services$2f$MannequinFitService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MannequinFitService"]()){
        this.fitService = fitService;
    }
    composeLayers(args) {
        const layers = [
            {
                type: 'mannequin-base',
                imageUrl: args.mannequin.baseImageUrl
            }
        ];
        const selectedBySlot = new Map();
        args.appliedPieces.forEach((piece)=>{
            selectedBySlot.set(piece.pieceType, piece);
        });
        const hasFullBody = selectedBySlot.has('full_body');
        const slotsToRender = slotOrder.filter((slot)=>hasFullBody ? slot !== 'top' && slot !== 'bottom' : slot !== 'full_body');
        slotsToRender.forEach((slot)=>{
            const fitProfile = selectedBySlot.get(slot);
            if (!fitProfile) return;
            try {
                const fitted = this.fitService.buildFittedGarmentLayer({
                    mannequin: args.mannequin,
                    fitProfile
                });
                layers.push({
                    type: 'garment',
                    slot: fitted.slot,
                    imageUrl: fitted.assetUrl,
                    x: fitted.x,
                    y: fitted.y,
                    width: fitted.width,
                    height: fitted.height,
                    clipMaskUrl: fitted.clipMaskUrl
                });
            } catch (e) {
                console.warn('[Tester2DRenderService] skipping slot due to fit error', slot, e);
            }
        });
        return layers;
    }
}
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
"[project]/app/lib/dress-tester-models.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DRESS_TESTER_CATEGORIES",
    ()=>DRESS_TESTER_CATEGORIES,
    "DRESS_TESTER_GENDERS",
    ()=>DRESS_TESTER_GENDERS,
    "createEmptySelection",
    ()=>createEmptySelection
]);
const DRESS_TESTER_CATEGORIES = [
    'top',
    'bottom',
    'dress',
    'shoes',
    'bag',
    'outerwear',
    'accessory'
];
const DRESS_TESTER_GENDERS = [
    'female',
    'male'
];
const createEmptySelection = (mannequinId = '', poseCode = '')=>({
        mannequin_id: mannequinId,
        pose_code: poseCode,
        top: null,
        bottom: null,
        dress: null,
        shoes: null,
        bag: null,
        outerwear: null,
        accessory: null
    });
}),
"[project]/app/hooks/useProfileUpdate.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useProfileUpdate",
    ()=>useProfileUpdate
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
'use client';
;
function useProfileUpdate() {
    const [saving, setSaving] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const updateProfile = async (payload)=>{
        setSaving(true);
        setError(null);
        const response = await fetch('/api/users/me', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        setSaving(false);
        if (!response.ok) {
            const data = await response.json().catch(()=>({
                    error: 'Unable to update profile.'
                }));
            setError(data.error || 'Unable to update profile.');
            return null;
        }
        const data = await response.json().catch(()=>null);
        return data?.profile ?? null;
    };
    return {
        saving,
        error,
        updateProfile
    };
}
}),
"[project]/app/hooks/useOutfitExport.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useOutfitExport",
    ()=>useOutfitExport
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
'use client';
;
function useOutfitExport() {
    const [submitting, setSubmitting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const exportOutfit = async (request)=>{
        setSubmitting(true);
        try {
            const response = await fetch('/api/outfit-exports', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(request)
            });
            if (!response.ok) {
                const payload = await response.json().catch(()=>({
                        error: 'Unexpected export error'
                    }));
                throw new Error(payload.error || 'Unable to export outfit');
            }
            return await response.json();
        } finally{
            setSubmitting(false);
        }
    };
    return {
        submitting,
        exportOutfit
    };
}
}),
"[project]/app/hooks/use3dAssetJob.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "use3dAssetJob",
    ()=>use3dAssetJob
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
'use client';
;
const TERMINAL_STATUSES = [
    'completed',
    'failed',
    'timed_out',
    'cancelled'
];
function normalizeStatus(statusLike) {
    const normalized = String(statusLike ?? '').trim().toLowerCase().replace(/\s+/g, '_');
    if (!normalized) return 'idle';
    if ([
        'completed',
        'ready',
        'asset_available',
        'done'
    ].includes(normalized)) return 'completed';
    if ([
        'failed',
        'error'
    ].includes(normalized)) return 'failed';
    if ([
        'cancelled',
        'canceled'
    ].includes(normalized)) return 'cancelled';
    if ([
        'queued',
        'pending',
        'submitted'
    ].includes(normalized)) return 'queued';
    if ([
        'in_progress',
        'processing',
        'running'
    ].includes(normalized)) return 'in_progress';
    if (normalized === 'submitting') return 'submitting';
    return 'idle';
}
function extractArtifactUrl(payload) {
    if (!payload || typeof payload !== 'object') return null;
    const source = payload;
    const artifacts = source.artifacts ?? {};
    const candidate = source.model_3d_url ?? source.modelUrl ?? artifacts.model_3d_url ?? artifacts.modelUrl ?? artifacts.outputModelUrl ?? artifacts.outputUrl ?? artifacts.glbUrl;
    const url = typeof candidate === 'string' ? candidate.trim() : '';
    return url.length > 0 ? url : null;
}
function extractErrorMessage(payload) {
    if (!payload || typeof payload !== 'object') return null;
    const source = payload;
    const error = source.error;
    if (typeof error === 'string' && error.trim()) return error.trim();
    if (error && typeof error === 'object') {
        const structured = error;
        const code = typeof structured.code === 'string' ? structured.code.trim() : '';
        const message = typeof structured.message === 'string' ? structured.message.trim() : '';
        if (code === 'invalid_input_low_quality') {
            return '3D generation failed: cleaned garment too dark/low contrast. Ready for 2D try-on.';
        }
        if (message) return message;
    }
    const diagnostics = source.diagnostics && typeof source.diagnostics === 'object' ? source.diagnostics : null;
    const brightness = Number(diagnostics?.brightness ?? NaN);
    const contrast = Number(diagnostics?.contrast ?? NaN);
    const score = Number(diagnostics?.qualityScore ?? NaN);
    if (Number.isFinite(brightness) || Number.isFinite(contrast) || Number.isFinite(score)) {
        return '3D generation failed: cleaned garment too dark/low contrast. Ready for 2D try-on.';
    }
    return null;
}
function extractJobId(payload) {
    if (!payload || typeof payload !== 'object') return null;
    const source = payload;
    const jobId = source.jobId ?? source.job_id ?? source.id;
    return typeof jobId === 'string' && jobId.trim().length > 0 ? jobId.trim() : null;
}
function use3dAssetJob(options) {
    const basePollIntervalMs = options?.pollIntervalMs ?? 1500;
    const maxPollIntervalMs = options?.maxPollIntervalMs ?? 6000;
    const timeoutMs = options?.timeoutMs ?? 90000;
    const maxPollAttempts = options?.maxPollAttempts ?? 45;
    const [status, setStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('idle');
    const [jobId, setJobId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [artifactUrl, setArtifactUrl] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [progressPercent, setProgressPercent] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [pollAttempts, setPollAttempts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const pollTimeoutRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const absoluteTimeoutRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const activeJobRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const pollJobRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const attemptsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(0);
    const transientFailuresRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(0);
    const MAX_TRANSIENT_FAILURES = 3;
    const stopTimers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (pollTimeoutRef.current !== null) {
            window.clearTimeout(pollTimeoutRef.current);
            pollTimeoutRef.current = null;
        }
        if (absoluteTimeoutRef.current !== null) {
            window.clearTimeout(absoluteTimeoutRef.current);
            absoluteTimeoutRef.current = null;
        }
    }, []);
    const completeWithArtifact = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((url)=>{
        stopTimers();
        setArtifactUrl(url);
        setStatus('completed');
        setProgressPercent(100);
        setError(null);
        options?.onCompleted?.(url);
    }, [
        options,
        stopTimers
    ]);
    const failJob = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((nextStatus, message)=>{
        stopTimers();
        setStatus(nextStatus);
        setError(message);
        setProgressPercent((current)=>Math.max(10, Math.min(99, current)));
    }, [
        stopTimers
    ]);
    const schedulePoll = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((execute, attempt)=>{
        const interval = Math.min(maxPollIntervalMs, Math.round(basePollIntervalMs * Math.pow(1.25, Math.max(0, attempt - 1))));
        pollTimeoutRef.current = window.setTimeout(()=>{
            void execute();
        }, interval);
    }, [
        basePollIntervalMs,
        maxPollIntervalMs
    ]);
    const startPolling = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((nextJobId, pollJob)=>{
        stopTimers();
        activeJobRef.current = nextJobId;
        pollJobRef.current = pollJob;
        attemptsRef.current = 0;
        transientFailuresRef.current = 0;
        setPollAttempts(0);
        absoluteTimeoutRef.current = window.setTimeout(()=>{
            failJob('timed_out', '3D generation timed out. Please retry.');
        }, timeoutMs);
        const runPoll = async ()=>{
            attemptsRef.current += 1;
            setPollAttempts(attemptsRef.current);
            if (attemptsRef.current > maxPollAttempts) {
                failJob('timed_out', `3D generation exceeded ${maxPollAttempts} polling attempts.`);
                return;
            }
            try {
                const payload = await pollJob(nextJobId);
                transientFailuresRef.current = 0;
                const polledStatus = normalizeStatus(payload?.status);
                const resolvedArtifact = extractArtifactUrl(payload);
                if (resolvedArtifact) {
                    completeWithArtifact(resolvedArtifact);
                    return;
                }
                if (polledStatus === 'completed') {
                    failJob('failed', '3D generation finished but no model URL was returned.');
                    return;
                }
                if (polledStatus === 'failed') {
                    failJob('failed', extractErrorMessage(payload) ?? '3D generation failed.');
                    return;
                }
                if (polledStatus === 'cancelled') {
                    failJob('cancelled', '3D generation was cancelled.');
                    return;
                }
                const nextStatus = polledStatus === 'queued' ? 'queued' : 'in_progress';
                setStatus(nextStatus);
                setProgressPercent((current)=>{
                    if (nextStatus === 'queued') {
                        return Math.min(65, Math.max(15, current + 4));
                    }
                    return Math.min(95, Math.max(35, current + 5));
                });
                schedulePoll(runPoll, attemptsRef.current);
            } catch (pollError) {
                transientFailuresRef.current += 1;
                if (transientFailuresRef.current >= MAX_TRANSIENT_FAILURES) {
                    failJob('failed', pollError instanceof Error ? pollError.message : 'Unable to poll 3D generation status.');
                } else {
                    schedulePoll(runPoll, attemptsRef.current);
                }
            }
        };
        void runPoll();
    }, [
        completeWithArtifact,
        failJob,
        maxPollAttempts,
        schedulePoll,
        stopTimers,
        timeoutMs
    ]);
    const startJob = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (input)=>{
        setError(null);
        setArtifactUrl(null);
        setProgressPercent(5);
        setPollAttempts(0);
        if (input.existingArtifactUrl?.trim()) {
            completeWithArtifact(input.existingArtifactUrl.trim());
            return;
        }
        if (input.existingJobId?.trim()) {
            const existing = input.existingJobId.trim();
            setJobId(existing);
            setStatus('queued');
            setProgressPercent(18);
            startPolling(existing, input.pollJob);
            return;
        }
        if (!input.createJob) {
            failJob('failed', 'No active 3D generation job was found for this item.');
            return;
        }
        setStatus('submitting');
        setProgressPercent(12);
        try {
            const createdPayload = await input.createJob();
            const createdArtifact = extractArtifactUrl(createdPayload);
            if (createdArtifact) {
                completeWithArtifact(createdArtifact);
                return;
            }
            const createdJobId = extractJobId(createdPayload);
            if (!createdJobId) {
                failJob('failed', 'The generation request did not return a valid job id.');
                return;
            }
            const normalized = normalizeStatus(createdPayload?.status);
            setJobId(createdJobId);
            setStatus(normalized === 'idle' ? 'queued' : normalized);
            setProgressPercent(normalized === 'in_progress' ? 35 : 20);
            if (TERMINAL_STATUSES.includes(normalized)) {
                if (normalized !== 'completed') {
                    failJob(normalized === 'cancelled' ? 'cancelled' : 'failed', '3D generation ended before polling started.');
                }
                return;
            }
            startPolling(createdJobId, input.pollJob);
        } catch (submitError) {
            failJob('failed', submitError instanceof Error ? submitError.message : 'Unable to submit 3D generation job.');
        }
    }, [
        completeWithArtifact,
        failJob,
        startPolling
    ]);
    const cancelPolling = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        stopTimers();
        activeJobRef.current = null;
        if (!TERMINAL_STATUSES.includes(status)) {
            setStatus('idle');
            setProgressPercent(0);
        }
    }, [
        status,
        stopTimers
    ]);
    const retry = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (!activeJobRef.current || !pollJobRef.current) {
            setStatus('idle');
            setProgressPercent(0);
            setError(null);
            setPollAttempts(0);
            return;
        }
        setError(null);
        setStatus('queued');
        setProgressPercent(20);
        startPolling(activeJobRef.current, pollJobRef.current);
    }, [
        startPolling
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>()=>stopTimers(), [
        stopTimers
    ]);
    return {
        status,
        progressPercent,
        pollAttempts,
        jobId,
        artifactUrl,
        error,
        startJob,
        cancelPolling,
        retry,
        setArtifactUrl,
        setJobId,
        setStatus,
        setError
    };
}
}),
"[project]/app/services/Tester2DAssetResolver.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getBest2DAssetForWardrobeItem",
    ()=>getBest2DAssetForWardrobeItem,
    "getBestTester2DAssetForWardrobeItem",
    ()=>getBestTester2DAssetForWardrobeItem
]);
const normalized = (value)=>String(value ?? '').trim();
function getBestTester2DAssetForWardrobeItem(item) {
    const prioritized = [
        {
            source: 'approved_catalog_2d_url',
            value: normalized(item.image_assets?.approved_catalog_2d_url ?? item.approved_catalog_2d_url)
        },
        {
            source: 'normalized_2d_preview_url',
            value: normalized(item.image_assets?.normalized_2d_preview_url ?? item.normalized_2d_preview_url)
        },
        {
            source: 'segmented_png_url',
            value: normalized(item.image_assets?.segmented_png_url ?? item.segmented_png_url)
        },
        {
            source: 'raw_upload_image_url',
            value: normalized(item.image_assets?.raw_upload_image_url ?? item.raw_upload_image_url)
        },
        {
            source: 'image_url',
            value: normalized(item.image_url)
        }
    ];
    const found = prioritized.find((entry)=>Boolean(entry.value));
    if (!found?.value) return {
        url: '',
        source: 'none',
        geometryReliable: false,
        isOverlaySafe: false
    };
    const geometryReliable = found.source !== 'raw_upload_image_url' && found.source !== 'image_url';
    const isOverlaySafe = geometryReliable;
    if (!geometryReliable && ("TURBOPACK compile-time value", "development") !== 'production') {
        console.warn(`[Tester2D] Falling back to ${found.source}; overlay quality and geometry may be unreliable.`);
    }
    return {
        url: found.value,
        source: found.source,
        geometryReliable,
        isOverlaySafe
    };
}
function getBest2DAssetForWardrobeItem(item) {
    return getBestTester2DAssetForWardrobeItem(item).url;
}
}),
"[project]/app/services/blenderWorkerClient.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "buildBlenderWorkerSubmitPayload",
    ()=>buildBlenderWorkerSubmitPayload,
    "pollBlenderWorkerJob",
    ()=>pollBlenderWorkerJob,
    "resolvePieceImageUrl",
    ()=>resolvePieceImageUrl,
    "submitBlenderWorkerJob",
    ()=>submitBlenderWorkerJob
]);
const DEFAULT_JOB_TYPE = 'blender_uv_pipeline';
function sanitizeUrl(candidate) {
    if (typeof candidate !== 'string') return null;
    const trimmed = candidate.trim();
    return trimmed.length > 0 ? trimmed : null;
}
function readPath(source, path) {
    return path.reduce((acc, key)=>{
        if (!acc || typeof acc !== 'object') return undefined;
        return acc[key];
    }, source);
}
function resolvePieceId(piece) {
    const candidatePaths = [
        [
            'pieceId'
        ],
        [
            'id'
        ],
        [
            'piece_id'
        ],
        [
            'wardrobe_item_id'
        ]
    ];
    for (const path of candidatePaths){
        const value = readPath(piece, path);
        const id = sanitizeUrl(value);
        if (id) return id;
    }
    return null;
}
function resolvePieceImageUrl(piece) {
    const candidatePaths = [
        [
            'imageUrl'
        ],
        [
            'image_url'
        ],
        [
            'imagemUrl'
        ],
        [
            'photoUrl'
        ],
        [
            'thumbnailUrl'
        ],
        [
            'image_assets',
            'segmented_png_url'
        ],
        [
            'image_assets',
            'normalized_2d_preview_url'
        ],
        [
            'image_assets',
            'approved_catalog_2d_url'
        ],
        [
            'image_assets',
            'raw_upload_image_url'
        ]
    ];
    for (const path of candidatePaths){
        const value = readPath(piece, path);
        const url = sanitizeUrl(value);
        if (url) return url;
    }
    return null;
}
function resolvePieceModelUrl(piece) {
    const candidatePaths = [
        [
            'modelUrl'
        ],
        [
            'model_url'
        ],
        [
            'model_3d_url'
        ],
        [
            'model_base_3d_url'
        ],
        [
            'model_branded_3d_url'
        ]
    ];
    for (const path of candidatePaths){
        const value = readPath(piece, path);
        const modelUrl = sanitizeUrl(value);
        if (modelUrl) return modelUrl;
    }
    return null;
}
function buildBlenderWorkerSubmitPayload(piece) {
    const pieceId = resolvePieceId(piece);
    if (!pieceId) {
        throw new Error('A pieceId is required before starting 3D generation.');
    }
    const imageUrl = resolvePieceImageUrl(piece);
    if (!imageUrl) {
        throw new Error('A valid piece image URL is required before starting 3D generation.');
    }
    const prompt = sanitizeUrl(piece.name) ?? sanitizeUrl(piece.title) ?? 'Unnamed piece';
    const type = sanitizeUrl(piece.piece_type) ?? sanitizeUrl(piece.type) ?? 'unspecified_piece';
    const modelUrl = resolvePieceModelUrl(piece);
    const payload = {
        pieceId,
        imageUrl,
        jobType: DEFAULT_JOB_TYPE,
        options: {
            prompt,
            type,
            mode: 'model_generation',
            cleanedImagePreprocess: {
                enabled: true,
                autoBrightnessContrast: true,
                maxBrightnessGain: 0.16,
                maxContrastGain: 0.14,
                keepQualityGateStrict: true
            }
        },
        pieceName: prompt,
        prompt
    };
    if (modelUrl) {
        payload.modelUrl = modelUrl;
    }
    return payload;
}
async function submitBlenderWorkerJob(payload) {
    if (!payload.pieceId?.trim()) {
        throw new Error('A pieceId is required before starting 3D generation.');
    }
    console.info('[3d-worker-client] submit:start', {
        pieceId: payload.pieceId,
        hasImageUrl: Boolean(payload.imageUrl),
        endpoint: '/api/3d-worker/submit'
    });
    const response = await fetch('/api/3d-worker/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });
    const body = await response.json().catch(()=>null);
    console.info('[3d-worker-client] submit:response', {
        pieceId: payload.pieceId,
        status: response.status,
        responseJson: body
    });
    if (!response.ok) {
        const message = typeof body?.message === 'string' ? body.message : typeof body?.error === 'string' ? body.error : `Worker submit failed with status ${response.status}.`;
        throw new Error(message);
    }
    return body ?? {};
}
async function pollBlenderWorkerJob(jobId) {
    const response = await fetch(`/api/3d-worker/jobs/${encodeURIComponent(jobId)}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const body = await response.json().catch(()=>null);
    if (!response.ok) {
        const message = typeof body?.error === 'string' ? body.error : `Worker status poll failed with status ${response.status}.`;
        throw new Error(message);
    }
    return body ?? {};
}
}),
];

//# sourceMappingURL=app_6e6502e3._.js.map