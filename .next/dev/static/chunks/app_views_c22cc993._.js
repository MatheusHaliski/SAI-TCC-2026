(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/app/views/ProfileView.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ProfileView
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$cards$2f$ProfileSummaryCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/cards/ProfileSummaryCard.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shell$2f$PageHeader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/shell/PageHeader.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$authSession$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/authSession.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$clientSession$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/clientSession.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$profile$2f$ProfileContextMenu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/profile/ProfileContextMenu.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$profile$2f$ProfileSectionRenderer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/profile/ProfileSectionRenderer.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
;
const ALLOWED_SECTIONS = [
    'wardrobe',
    'user-info',
    'my-schemes',
    'saved-schemes',
    'my-posts',
    'settings'
];
const parseSectionFromQuery = (value)=>{
    if (!value) return 'wardrobe';
    const normalized = value.trim().toLowerCase();
    return ALLOWED_SECTIONS.includes(normalized) ? normalized : 'wardrobe';
};
function ProfileView() {
    _s();
    const authProfile = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$authSession$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAuthSessionProfile"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const pathSegments = pathname.split('/').filter(Boolean);
    const publicUserFromPath = pathSegments[0] === 'profile' && pathSegments[1] && pathSegments[1] !== 'settings' ? pathSegments[1] : '';
    const [authUserId, setAuthUserId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(authProfile.user_id?.trim() || '');
    const [userId, setUserId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(publicUserFromPath || authProfile.user_id?.trim() || '');
    const [viewedProfile, setViewedProfile] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        name: authProfile.name?.trim() || '',
        email: authProfile.email?.trim() || ''
    });
    const [wardrobeItems, setWardrobeItems] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [schemes, setSchemes] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [posts, setPosts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const isOwnerView = Boolean(authUserId) && Boolean(userId) && authUserId === userId;
    const forcedPublicSection = publicUserFromPath && !isOwnerView ? 'user-info' : null;
    const selectedSection = forcedPublicSection ?? (pathname.endsWith('/settings') ? 'settings' : parseSectionFromQuery(searchParams.get('section')));
    const allowedSections = isOwnerView || !publicUserFromPath ? ALLOWED_SECTIONS : [
        'user-info'
    ];
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ProfileView.useEffect": ()=>{
            const loadProfileHubData = {
                "ProfileView.useEffect.loadProfileHubData": async ()=>{
                    const localProfile = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$authSession$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAuthSessionProfile"])();
                    let resolvedAuthUserId = localProfile.user_id?.trim() || '';
                    if (!resolvedAuthUserId) {
                        const serverProfile = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$clientSession$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getServerSession"])();
                        resolvedAuthUserId = serverProfile?.user_id?.trim() || '';
                    }
                    const resolvedViewedUserId = publicUserFromPath || resolvedAuthUserId;
                    setAuthUserId(resolvedAuthUserId);
                    setUserId(resolvedViewedUserId);
                    if (!resolvedViewedUserId) {
                        setWardrobeItems([]);
                        setSchemes([]);
                        setPosts([]);
                        setViewedProfile({});
                        return;
                    }
                    const profileResponse = await fetch(`/api/users/me?userId=${encodeURIComponent(resolvedViewedUserId)}`);
                    const profileData = await profileResponse.json().catch({
                        "ProfileView.useEffect.loadProfileHubData": ()=>null
                    }["ProfileView.useEffect.loadProfileHubData"]);
                    const loadedProfile = profileData?.profile ?? {};
                    setViewedProfile(loadedProfile);
                    if (resolvedViewedUserId !== resolvedAuthUserId) {
                        setWardrobeItems([]);
                        setSchemes([]);
                        setPosts([]);
                        return;
                    }
                    const [wardrobeResponse, schemesResponse, postsResponse] = await Promise.all([
                        fetch(`/api/wardrobe-items/user/${resolvedViewedUserId}`),
                        fetch(`/api/schemes/user/${resolvedViewedUserId}`),
                        fetch(`/api/user-posts?user_id=${encodeURIComponent(resolvedViewedUserId)}`)
                    ]);
                    const wardrobeData = await wardrobeResponse.json().catch({
                        "ProfileView.useEffect.loadProfileHubData": ()=>[]
                    }["ProfileView.useEffect.loadProfileHubData"]);
                    const schemesData = await schemesResponse.json().catch({
                        "ProfileView.useEffect.loadProfileHubData": ()=>[]
                    }["ProfileView.useEffect.loadProfileHubData"]);
                    const postsData = await postsResponse.json().catch({
                        "ProfileView.useEffect.loadProfileHubData": ()=>[]
                    }["ProfileView.useEffect.loadProfileHubData"]);
                    setWardrobeItems(Array.isArray(wardrobeData) ? wardrobeData : []);
                    setSchemes(Array.isArray(schemesData) ? schemesData : []);
                    setPosts(Array.isArray(postsData) ? postsData : []);
                }
            }["ProfileView.useEffect.loadProfileHubData"];
            loadProfileHubData().catch({
                "ProfileView.useEffect": ()=>{
                    setWardrobeItems([]);
                    setSchemes([]);
                    setPosts([]);
                }
            }["ProfileView.useEffect"]);
        }
    }["ProfileView.useEffect"], [
        publicUserFromPath
    ]);
    const email = viewedProfile.email?.trim() || authProfile.email?.trim() || 'not-available@user.local';
    const username = viewedProfile.username?.trim() || viewedProfile.name?.trim() || email.split('@')[0] || 'user';
    const displayName = viewedProfile.name?.trim() || username;
    const activeSectionLabel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ProfileView.useMemo[activeSectionLabel]": ()=>{
            const map = {
                wardrobe: 'My Wardrobe Pieces',
                'user-info': 'User Info',
                'my-schemes': 'My Schemes',
                'saved-schemes': 'Saved Schemes',
                'my-posts': 'My Posts',
                settings: 'Settings'
            };
            return map[selectedSection];
        }
    }["ProfileView.useMemo[activeSectionLabel]"], [
        selectedSection
    ]);
    const updateSection = (section)=>{
        const normalized = allowedSections.includes(section) ? section : allowedSections[0];
        const query = new URLSearchParams(searchParams.toString());
        query.set('section', normalized);
        router.replace(`${pathname}?${query.toString()}`);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "grid gap-6 lg:grid-cols-[280px_1fr]",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$profile$2f$ProfileContextMenu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                selectedSection: selectedSection,
                onSelectSection: updateSection,
                allowedSections: allowedSections
            }, void 0, false, {
                fileName: "[project]/app/views/ProfileView.tsx",
                lineNumber: 156,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shell$2f$PageHeader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        title: isOwnerView ? 'Profile' : `Creator Profile`,
                        subtitle: isOwnerView ? 'Premium creator hub for wardrobe, schemes, publishing, and account controls.' : 'Public creator profile view.'
                    }, void 0, false, {
                        fileName: "[project]/app/views/ProfileView.tsx",
                        lineNumber: 159,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$cards$2f$ProfileSummaryCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        username: username,
                        loginEmail: email,
                        loginStatus: isOwnerView ? 'Authenticated' : 'Public Profile',
                        authSource: "sai-usercontrol"
                    }, void 0, false, {
                        fileName: "[project]/app/views/ProfileView.tsx",
                        lineNumber: 161,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-2xl border border-white/20 bg-white/10 px-4 py-2 text-sm text-white/85 backdrop-blur-md",
                        children: [
                            "Active section: ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-semibold text-cyan-100",
                                children: activeSectionLabel
                            }, void 0, false, {
                                fileName: "[project]/app/views/ProfileView.tsx",
                                lineNumber: 169,
                                columnNumber: 27
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/views/ProfileView.tsx",
                        lineNumber: 168,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$profile$2f$ProfileSectionRenderer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        section: selectedSection,
                        userId: userId,
                        username: username,
                        displayName: displayName,
                        email: email,
                        canEdit: isOwnerView,
                        wardrobeItems: wardrobeItems,
                        schemes: schemes,
                        posts: posts
                    }, void 0, false, {
                        fileName: "[project]/app/views/ProfileView.tsx",
                        lineNumber: 172,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/views/ProfileView.tsx",
                lineNumber: 158,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/views/ProfileView.tsx",
        lineNumber: 155,
        columnNumber: 5
    }, this);
}
_s(ProfileView, "jfqPbQYtuLqX5cEP05Q3ikFqgBI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = ProfileView;
var _c;
__turbopack_context__.k.register(_c, "ProfileView");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/views/CreateMySchemeView.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CreateMySchemeView
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$authSession$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/authSession.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$clientSession$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/clientSession.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shell$2f$PageHeader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/shell/PageHeader.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$outfit$2d$card$2f$OutfitCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/outfit-card/OutfitCard.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shared$2f$SaiModalAlert$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/shared/SaiModalAlert.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shared$2f$SectionBlock$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/shared/SectionBlock.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ui$2f$fancy$2d$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/ui/fancy-select.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$create$2d$scheme$2f$DescriptionModeSelector$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/create-scheme/DescriptionModeSelector.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$create$2d$scheme$2f$GenerationModePanel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/create-scheme/GenerationModePanel.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$create$2d$scheme$2f$SaveSummaryPanel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/create-scheme/SaveSummaryPanel.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$create$2d$scheme$2f$SchemeStepCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/create-scheme/SchemeStepCard.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$create$2d$scheme$2f$SlotReviewCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/create-scheme/SlotReviewCard.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$create$2d$scheme$2f$SchemeStepSidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/create-scheme/SchemeStepSidebar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$create$2d$scheme$2f$OutfitBackgroundStudioModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/create-scheme/OutfitBackgroundStudioModal.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$outfit$2d$ai$2d$mapping$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/outfit-ai-mapping.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$outfit$2d$piece$2d$options$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/outfit-piece-options.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$outfit$2d$card$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/outfit-card.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
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
;
;
;
;
const normalizeSchemePieceType = (value)=>value.trim().toLowerCase();
const DEFAULT_SLOT_SUGGESTIONS = {
    upper: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$outfit$2d$piece$2d$options$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OUTFIT_PIECE_OPTIONS"].upper.map((option)=>({
            value: `suggested:upper:${option.value}`,
            label: option.label
        })),
    lower: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$outfit$2d$piece$2d$options$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OUTFIT_PIECE_OPTIONS"].lower.map((option)=>({
            value: `suggested:lower:${option.value}`,
            label: option.label
        })),
    shoes: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$outfit$2d$piece$2d$options$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OUTFIT_PIECE_OPTIONS"].shoes.map((option)=>({
            value: `suggested:shoes:${option.value}`,
            label: option.label
        })),
    accessory: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$outfit$2d$piece$2d$options$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OUTFIT_PIECE_OPTIONS"].accessory.map((option)=>({
            value: `suggested:accessory:${option.value}`,
            label: option.label
        }))
};
const sections = [
    'Scheme Basics',
    'Build Outfit',
    'AI Assist',
    'Slots Review',
    'Card Background',
    'Save & Generate'
];
const STYLE_OPTIONS = [
    'Urban',
    'Casual',
    'Formal',
    'Outdoors'
];
const OCCASION_OPTIONS = [
    'Shift',
    'Work',
    'Daily',
    'Night',
    'Party'
];
const TITLE_FONT_OPTIONS = [
    'Inter, Segoe UI, sans-serif',
    'Georgia, serif',
    'Trebuchet MS, sans-serif',
    'monospace'
];
const SLOT_AUTO_WEARSTYLE = {
    upper: [
        'Statement Piece'
    ],
    lower: [
        'Visual Anchor'
    ],
    shoes: [
        'Street Energy'
    ],
    accessory: [
        'Style Accent'
    ]
};
const SLOT_DEFAULT_PIECE_TYPES = {
    upper: 'Jacket',
    lower: 'Pants',
    shoes: 'Footwear',
    accessory: 'Accessory'
};
const SLOT_DEFAULT_CATEGORIES = {
    upper: 'Premium',
    lower: 'Standard',
    shoes: 'Rare',
    accessory: 'Limited Edition'
};
const SLOT_ICONS = {
    upper: '🧥',
    lower: '👖',
    shoes: '👟',
    accessory: '👜'
};
const DEFAULT_BRAND_ID = 'default';
const FALLBACK_BRANDS = [
    {
        brand_id: 'lacoste',
        name: 'Lacoste',
        logo_url: '/lacoste.jpg'
    }
];
const DEFAULT_BACKGROUND_CONFIG = {
    background_mode: 'gradient',
    gradient: {
        type: 'linear',
        angle: 135,
        intensity: 100,
        stops: [
            {
                color: '#0f172a',
                position: 0
            },
            {
                color: '#4c1d95',
                position: 100
            }
        ]
    },
    shape: 'orb'
};
const formatDisplayName = (value)=>String(value || '').trim().split(' ').filter(Boolean).map((chunk)=>`${chunk.charAt(0).toUpperCase()}${chunk.slice(1)}`).join(' ');
function CreateMySchemeView() {
    _s();
    const [items, setItems] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [brands, setBrands] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [title, setTitle] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [style, setStyle] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('Minimal');
    const [occasion, setOccasion] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('Daily');
    const [visibility, setVisibility] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('public');
    const [selectedBrandId, setSelectedBrandId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(DEFAULT_BRAND_ID);
    const [slotBrandIds, setSlotBrandIds] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        upper: DEFAULT_BRAND_ID,
        lower: DEFAULT_BRAND_ID,
        shoes: DEFAULT_BRAND_ID,
        accessory: DEFAULT_BRAND_ID
    });
    const [heroImageUrl, setHeroImageUrl] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [heroImageUploading, setHeroImageUploading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [outfitBackgroundConfig, setOutfitBackgroundConfig] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(DEFAULT_BACKGROUND_CONFIG);
    const [backgroundStudioOpen, setBackgroundStudioOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [descriptionMode, setDescriptionMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('ai');
    const [manualDescription, setManualDescription] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [descriptionOverride, setDescriptionOverride] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [titleFontFamily, setTitleFontFamily] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('Inter, Segoe UI, sans-serif');
    const [palette, setPalette] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('Neutral');
    const [mood, setMood] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('Urban Premium');
    const [aiPrompt, setAiPrompt] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [generationMode, setGenerationMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('manual');
    const [aiInterpreting, setAiInterpreting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [aiError, setAiError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [aiInterpretation, setAiInterpretation] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [aiSlotSuggestions, setAiSlotSuggestions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        upper: [],
        lower: [],
        shoes: [],
        accessory: []
    });
    const [selectedSection, setSelectedSection] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(sections[0]);
    const [slots, setSlots] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        upper: null,
        lower: null,
        shoes: null,
        accessory: null
    });
    const [alertMessage, setAlertMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [userId, setUserId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [generatedCardData, setGeneratedCardData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isGeneratingPremiumDesc, setIsGeneratingPremiumDesc] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const inputClassName = 'w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.12)] backdrop-blur-md transition focus:border-violet-400/70 focus:outline-none focus:ring-2 focus:ring-violet-500/40';
    const slotCardClassName = 'rounded-xl border border-white/20 bg-white/10 p-3 text-white shadow-[0_8px_30px_rgba(0,0,0,0.12)] backdrop-blur-md';
    const primaryButtonClassName = 'rounded-xl border border-white/20 bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(139,92,246,0.35)] transition hover:scale-[1.01] hover:brightness-110';
    const secondaryButtonClassName = 'rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white shadow-[0_8px_30px_rgba(0,0,0,0.12)] backdrop-blur-md transition hover:scale-[1.01] hover:bg-white/15';
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CreateMySchemeView.useEffect": ()=>{
            const draftRaw = ("TURBOPACK compile-time truthy", 1) ? sessionStorage.getItem('sai_scheme_inspiration') : "TURBOPACK unreachable";
            if (draftRaw) {
                window.setTimeout({
                    "CreateMySchemeView.useEffect": ()=>{
                        try {
                            const draft = JSON.parse(draftRaw);
                            if (draft.outfitName) setTitle(`${draft.outfitName} · Inspired`);
                            if (draft.outfitStyleLine) setStyle(draft.outfitStyleLine.split('•')[0]?.trim() || 'Minimal');
                        } catch  {}
                        sessionStorage.removeItem('sai_scheme_inspiration');
                    }
                }["CreateMySchemeView.useEffect"], 0);
            }
            const loadSessionAndItems = {
                "CreateMySchemeView.useEffect.loadSessionAndItems": async ()=>{
                    const localProfile = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$authSession$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAuthSessionProfile"])();
                    let resolvedUserId = localProfile.user_id?.trim() || '';
                    if (!resolvedUserId) {
                        const serverProfile = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$clientSession$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getServerSession"])();
                        resolvedUserId = serverProfile?.user_id?.trim() || '';
                    }
                    if (!resolvedUserId) {
                        setAlertMessage('User session not found. Please sign in again.');
                        setItems([]);
                        return;
                    }
                    setUserId(resolvedUserId);
                    const [itemsResponse, brandsResponse] = await Promise.all([
                        fetch(`/api/wardrobe-items/user/${resolvedUserId}`),
                        fetch('/api/brands')
                    ]);
                    const itemsData = await itemsResponse.json().catch({
                        "CreateMySchemeView.useEffect.loadSessionAndItems": ()=>[]
                    }["CreateMySchemeView.useEffect.loadSessionAndItems"]);
                    const brandsData = await brandsResponse.json().catch({
                        "CreateMySchemeView.useEffect.loadSessionAndItems": ()=>[]
                    }["CreateMySchemeView.useEffect.loadSessionAndItems"]);
                    const parsedItems = Array.isArray(itemsData) ? itemsData : [];
                    const apiBrands = Array.isArray(brandsData) ? brandsData : [];
                    setItems(parsedItems);
                    setBrands([
                        ...apiBrands,
                        ...FALLBACK_BRANDS.filter({
                            "CreateMySchemeView.useEffect.loadSessionAndItems": (fallback)=>!apiBrands.some({
                                    "CreateMySchemeView.useEffect.loadSessionAndItems": (brand)=>brand.brand_id === fallback.brand_id
                                }["CreateMySchemeView.useEffect.loadSessionAndItems"])
                        }["CreateMySchemeView.useEffect.loadSessionAndItems"])
                    ]);
                }
            }["CreateMySchemeView.useEffect.loadSessionAndItems"];
            loadSessionAndItems().catch({
                "CreateMySchemeView.useEffect": ()=>{
                    setAlertMessage('Unable to load user session. Please sign in again.');
                    setItems([]);
                    setBrands(FALLBACK_BRANDS);
                }
            }["CreateMySchemeView.useEffect"]);
        }
    }["CreateMySchemeView.useEffect"], []);
    const selectedBrand = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "CreateMySchemeView.useMemo[selectedBrand]": ()=>brands.find({
                "CreateMySchemeView.useMemo[selectedBrand]": (brand)=>brand.brand_id === selectedBrandId
            }["CreateMySchemeView.useMemo[selectedBrand]"]) ?? null
    }["CreateMySchemeView.useMemo[selectedBrand]"], [
        brands,
        selectedBrandId
    ]);
    const resolvedBrands = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "CreateMySchemeView.useMemo[resolvedBrands]": ()=>({
                defaultBrand: selectedBrand,
                byId: new Map(brands.map({
                    "CreateMySchemeView.useMemo[resolvedBrands]": (brand)=>[
                            brand.brand_id,
                            brand
                        ]
                }["CreateMySchemeView.useMemo[resolvedBrands]"]))
            })
    }["CreateMySchemeView.useMemo[resolvedBrands]"], [
        brands,
        selectedBrand
    ]);
    const filledSlotsCount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "CreateMySchemeView.useMemo[filledSlotsCount]": ()=>Object.values(slots).filter(Boolean).length
    }["CreateMySchemeView.useMemo[filledSlotsCount]"], [
        slots
    ]);
    const completedSections = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "CreateMySchemeView.useMemo[completedSections]": ()=>sections.filter({
                "CreateMySchemeView.useMemo[completedSections]": (section)=>{
                    if (section === 'Scheme Basics') return Boolean(title.trim()) && Boolean(style.trim()) && Boolean(occasion.trim());
                    if (section === 'Build Outfit') return Object.values(slots).some(Boolean);
                    if (section === 'AI Assist') return Boolean(aiPrompt.trim()) || generationMode === 'ai';
                    if (section === 'Slots Review') return filledSlotsCount > 0;
                    if (section === 'Card Background') return Boolean(outfitBackgroundConfig.background_mode);
                    return Boolean(generatedCardData);
                }
            }["CreateMySchemeView.useMemo[completedSections]"])
    }["CreateMySchemeView.useMemo[completedSections]"], [
        title,
        style,
        occasion,
        slots,
        aiPrompt,
        generationMode,
        filledSlotsCount,
        outfitBackgroundConfig.background_mode,
        generatedCardData
    ]);
    const isFormValid = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "CreateMySchemeView.useMemo[isFormValid]": ()=>Boolean(title.trim()) && Boolean(style.trim()) && Boolean(occasion.trim()) && Object.values(slots).some(Boolean)
    }["CreateMySchemeView.useMemo[isFormValid]"], [
        title,
        style,
        occasion,
        slots
    ]);
    const schemeItems = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "CreateMySchemeView.useMemo[schemeItems]": ()=>Object.entries(slots).filter({
                "CreateMySchemeView.useMemo[schemeItems]": ([, id])=>Boolean(id)
            }["CreateMySchemeView.useMemo[schemeItems]"]).map({
                "CreateMySchemeView.useMemo[schemeItems]": ([slot, id], idx)=>({
                        wardrobe_item_id: String(id),
                        slot,
                        sort_order: idx + 1
                    })
            }["CreateMySchemeView.useMemo[schemeItems]"])
    }["CreateMySchemeView.useMemo[schemeItems]"], [
        slots
    ]);
    const resolveSlotSelectionLabel = (slot)=>{
        const selectedValue = slots[slot];
        if (!selectedValue) return 'No piece selected';
        const suggested = DEFAULT_SLOT_SUGGESTIONS[slot].find((option)=>option.value === selectedValue);
        if (suggested) return suggested.label;
        const selectedItem = items.find((item)=>item.wardrobe_item_id === selectedValue);
        return selectedItem?.name || 'Custom selection';
    };
    const resolveBrandForSlot = (slot)=>{
        const configuredBrandId = slotBrandIds[slot] || DEFAULT_BRAND_ID;
        if (configuredBrandId === DEFAULT_BRAND_ID) return resolvedBrands.defaultBrand;
        return resolvedBrands.byId.get(configuredBrandId) ?? resolvedBrands.defaultBrand;
    };
    const buildOutfitBackgroundConfig = ()=>{
        return outfitBackgroundConfig;
    };
    const buildGeneratedOutfitCardData = ()=>{
        const defaultBrandName = selectedBrand?.name || 'SELECTION';
        const pieces = Object.keys(slots).map((slot)=>{
            const selectedValue = slots[slot];
            if (!selectedValue) return null;
            const inventoryItem = items.find((item)=>item.wardrobe_item_id === selectedValue);
            const suggestedItem = DEFAULT_SLOT_SUGGESTIONS[slot].find((suggestion)=>suggestion.value === selectedValue);
            const derivedName = inventoryItem?.name || suggestedItem?.label || `${formatDisplayName(slot)} Piece`;
            const pieceType = formatDisplayName(inventoryItem?.piece_type || SLOT_DEFAULT_PIECE_TYPES[slot]);
            const resolvedSlotBrand = resolveBrandForSlot(slot);
            const slotBrandName = resolvedSlotBrand?.name || defaultBrandName;
            return {
                id: selectedValue,
                name: derivedName,
                brand: slotBrandName,
                brandLogoUrl: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$outfit$2d$card$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resolveBrandLogoUrlByName"])(slotBrandName) || resolvedSlotBrand?.logo_url || undefined,
                pieceType,
                category: SLOT_DEFAULT_CATEGORIES[slot],
                wearstyles: SLOT_AUTO_WEARSTYLE[slot]
            };
        }).filter(Boolean);
        const description = descriptionOverride.trim() ? descriptionOverride.trim() : descriptionMode === 'manual' ? manualDescription.trim() || undefined : descriptionMode === 'none' ? '' : (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$outfit$2d$card$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildOutfitDescriptionRich"])({
            outfitName: title.trim() || 'My New Scheme',
            style,
            occasion,
            visibility,
            brand: selectedBrand?.name || 'Selection',
            palette,
            mood,
            pieces,
            titleFontFamily
        });
        return {
            outfitName: title.trim() || 'My New Scheme',
            outfitStyleLine: `${style.trim() || 'Minimal'} · ${occasion.trim() || 'Daily'}`,
            outfitDescription: description,
            heroImageUrl: heroImageUrl.trim() || '/models/model-default.jpeg',
            outfitBackground: buildOutfitBackgroundConfig(),
            metaBadges: [
                {
                    icon: '👕',
                    label: style.trim() || 'Casual'
                },
                {
                    icon: '📆',
                    label: occasion.trim() || 'Daily'
                },
                {
                    icon: visibility === 'public' ? '🌐' : '🔒',
                    label: visibility === 'public' ? 'Public' : 'Private'
                },
                {
                    icon: generationMode === 'manual' ? '✍️' : '✨',
                    label: generationMode === 'manual' ? 'Manual' : 'AI'
                },
                palette.trim() ? {
                    icon: '🎨',
                    label: palette.trim()
                } : null
            ].filter(Boolean),
            pieces,
            titleFontFamily
        };
    };
    const buildSchemePieceSnapshots = (pieces)=>pieces.map((piece)=>{
            const slot = Object.keys(slots).find((slotKey)=>slots[slotKey] === piece.id) || 'upper';
            const sourceType = piece.id.startsWith('suggested:') ? 'suggested' : 'wardrobe';
            return {
                id: piece.id,
                slot,
                sourceType,
                sourceId: piece.id,
                name: piece.name,
                brand: piece.brand,
                brandLogoUrl: piece.brandLogoUrl,
                pieceType: piece.pieceType,
                category: piece.category || 'Standard',
                wearstyles: piece.wearstyles || []
            };
        });
    const uploadHeroImage = (file)=>{
        setHeroImageUploading(true);
        const reader = new FileReader();
        reader.onload = ()=>{
            const result = typeof reader.result === 'string' ? reader.result : '';
            setHeroImageUrl(result);
            setHeroImageUploading(false);
        };
        reader.onerror = ()=>{
            setAlertMessage('Unable to process image. Please try another file.');
            setHeroImageUploading(false);
        };
        reader.readAsDataURL(file);
    };
    const saveScheme = async (creationMode, pieceSnapshots)=>{
        if (!userId) {
            setAlertMessage('User session not found. Please sign in again.');
            return false;
        }
        if (schemeItems.length === 0) {
            setAlertMessage('Select at least one wardrobe item before saving.');
            return false;
        }
        try {
            const selectedBackground = buildOutfitBackgroundConfig();
            const response = await fetch('/api/schemes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_id: userId,
                    title: title.trim() || 'My New Scheme',
                    description: JSON.stringify({
                        outfitBackground: selectedBackground,
                        descriptionMode,
                        descriptionText: descriptionMode === 'manual' ? manualDescription.trim() : null,
                        mood,
                        palette,
                        titleFontFamily,
                        descriptionOverride: descriptionOverride.trim() || null
                    }),
                    style: style.trim() || 'Minimal',
                    occasion: occasion.trim() || 'Daily',
                    cover_image_url: heroImageUrl.trim() || null,
                    visibility,
                    creation_mode: creationMode,
                    pieces: pieceSnapshots,
                    items: schemeItems
                })
            });
            const payload = await response.json().catch(()=>null);
            if (!response.ok) {
                setAlertMessage(payload?.error || 'Unable to save scheme. Please try again.');
                return false;
            }
            setAlertMessage('Scheme saved successfully.');
            return true;
        } catch  {
            setAlertMessage('Unable to save scheme. Please try again.');
            return false;
        }
    };
    const optionsByType = (slot)=>{
        const aliases = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$outfit$2d$piece$2d$options$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SLOT_TYPE_ALIASES"][slot];
        return items.filter((item)=>aliases.includes(normalizeSchemePieceType(item.piece_type)));
    };
    const generateFromAiPrompt = async ()=>{
        const normalizedPrompt = aiPrompt.toLowerCase().trim();
        if (!normalizedPrompt) {
            setAlertMessage('Write a prompt before running AI generation.');
            return false;
        }
        if (aiInterpreting) return false;
        setAiInterpreting(true);
        setAiError(null);
        try {
            const controller = new AbortController();
            const timeout = setTimeout(()=>controller.abort(), 25_000);
            let response;
            try {
                response = await fetch('/api/outfit-card/interpret', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        prompt: normalizedPrompt,
                        locale: 'pt-BR'
                    }),
                    signal: controller.signal
                });
            } finally{
                clearTimeout(timeout);
            }
            const payload = await response.json().catch(()=>null);
            const hasValidItems = Boolean(payload?.data && Array.isArray(payload.data.items));
            if (!response.ok || !payload?.success || !hasValidItems) {
                const errorCode = payload?.error_code || (!hasValidItems ? 'INVALID_AI_RESPONSE' : 'AI_INTERPRETATION_FAILED');
                const userMessage = payload?.error || 'Unable to interpret this look right now.';
                console.error('AI GENERATION ERROR', {
                    code: errorCode,
                    requestId: payload?.request_id,
                    status: response.status,
                    payload
                });
                setAiError({
                    code: errorCode,
                    message: userMessage,
                    requestId: payload?.request_id
                });
                setAlertMessage(userMessage);
                return false;
            }
            const interpretation = payload.data;
            if (!interpretation) {
                setAiError({
                    code: 'INVALID_AI_RESPONSE',
                    message: 'Unable to interpret this look right now.',
                    requestId: payload.request_id
                });
                setAlertMessage('Unable to interpret this look right now.');
                return false;
            }
            setAiInterpretation(interpretation);
            const matchingBrand = brands.find((brand)=>normalizedPrompt.includes(brand.name.toLowerCase()));
            if (matchingBrand) setSelectedBrandId(matchingBrand.brand_id);
            const mapping = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$outfit$2d$ai$2d$mapping$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mapAiInterpretationToManualForm"])({
                interpretation,
                wardrobeItems: items
            });
            setAiSlotSuggestions(mapping.aiSlotOptions);
            setSlots((prev)=>({
                    ...prev,
                    upper: mapping.slotAssignments.upper ?? prev.upper ?? null,
                    lower: mapping.slotAssignments.lower ?? prev.lower ?? null,
                    shoes: mapping.slotAssignments.shoes ?? prev.shoes ?? null,
                    accessory: mapping.slotAssignments.accessory ?? prev.accessory ?? null
                }));
            if (mapping.style) setStyle(mapping.style);
            if (mapping.occasion) setOccasion(mapping.occasion);
            if (mapping.mood) setMood(mapping.mood);
            if (!title.trim() && mapping.title) setTitle(mapping.title);
            setGenerationMode('ai');
            setAlertMessage('Look interpreted. You can keep editing manually.');
            return true;
        } catch (error) {
            const code = error instanceof Error && error.name === 'AbortError' ? 'AI_TIMEOUT' : 'AI_REQUEST_FAILED';
            const message = code === 'AI_TIMEOUT' ? 'AI generation timed out. Please try again.' : 'Unable to interpret this look right now.';
            console.error('AI GENERATION ERROR', {
                code,
                error
            });
            setAiError({
                code,
                message
            });
            setAlertMessage(message);
            return false;
        } finally{
            setAiInterpreting(false);
        }
    };
    const generatePremiumDescription = async ()=>{
        setIsGeneratingPremiumDesc(true);
        try {
            const piecesData = Object.keys(slots).map((slot)=>{
                const selectedValue = slots[slot];
                if (!selectedValue) return null;
                const item = items.find((i)=>i.wardrobe_item_id === selectedValue);
                const suggested = DEFAULT_SLOT_SUGGESTIONS[slot].find((s)=>s.value === selectedValue);
                return {
                    name: item?.name || suggested?.label || `${slot} piece`,
                    brand: resolveBrandForSlot(slot)?.name || 'Unknown'
                };
            }).filter(Boolean);
            if (piecesData.length === 0) {
                setAlertMessage('Please select at least one piece to generate a description.');
                return;
            }
            const response = await fetch('/api/ai/fashion/generate-card-description', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    pieces: piecesData,
                    overallColors: [
                        palette
                    ].filter(Boolean),
                    dominantStyle: style,
                    season: 'all-season',
                    userIntent: aiPrompt,
                    occasion: occasion
                })
            });
            const payload = await response.json();
            if (!response.ok || !payload.ok) {
                setAlertMessage(payload.message || 'Error generating description');
                return;
            }
            const data = payload.data;
            if (data.editorialTitle) setTitle(data.editorialTitle);
            if (data.dominantStyle) setStyle(data.dominantStyle);
            if (data.longDescription) {
                setManualDescription(data.longDescription);
                setDescriptionMode('manual');
            }
            setAlertMessage('Premium editorial description generated successfully!');
        } catch (error) {
            setAlertMessage(error.message || 'Error generating description');
        } finally{
            setIsGeneratingPremiumDesc(false);
        }
    };
    const handleFinalSave = async ()=>{
        if (!isFormValid) {
            setAlertMessage('Fill title, style, occasion, and assign at least one slot before saving.');
            return;
        }
        const nextGeneratedCardData = buildGeneratedOutfitCardData();
        const pieceSnapshots = buildSchemePieceSnapshots(nextGeneratedCardData.pieces);
        const isSaved = await saveScheme(generationMode, pieceSnapshots);
        if (!isSaved) return;
        setGeneratedCardData(nextGeneratedCardData);
        setSelectedSection('Save & Generate');
    };
    const renderManualBuilder = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shared$2f$SectionBlock$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            title: "Build Outfit",
            subtitle: "Define metadata, description behavior, and slot assignment manually.",
            className: "sa-surface-header h-auto border-white/20",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                className: "mt-4 grid gap-3 rounded-2xl border border-white/20 bg-white/5 p-4 shadow-[0_10px_40px_rgba(0,0,0,0.14)] backdrop-blur-md md:grid-cols-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        value: title,
                        onChange: (e)=>setTitle(e.target.value),
                        placeholder: "Title",
                        className: inputClassName
                    }, void 0, false, {
                        fileName: "[project]/app/views/CreateMySchemeView.tsx",
                        lineNumber: 626,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ui$2f$fancy$2d$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        value: titleFontFamily,
                        onChange: setTitleFontFamily,
                        placeholder: "Title Font",
                        options: TITLE_FONT_OPTIONS.map((font)=>({
                                value: font,
                                label: font
                            }))
                    }, void 0, false, {
                        fileName: "[project]/app/views/CreateMySchemeView.tsx",
                        lineNumber: 634,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        value: descriptionOverride,
                        onChange: (e)=>setDescriptionOverride(e.target.value),
                        placeholder: "Card description override (optional)",
                        className: `${inputClassName} md:col-span-2`
                    }, void 0, false, {
                        fileName: "[project]/app/views/CreateMySchemeView.tsx",
                        lineNumber: 641,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ui$2f$fancy$2d$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        value: style,
                        onChange: setStyle,
                        placeholder: "Style",
                        options: STYLE_OPTIONS.map((option)=>({
                                value: option,
                                label: option,
                                group: 'Style'
                            }))
                    }, void 0, false, {
                        fileName: "[project]/app/views/CreateMySchemeView.tsx",
                        lineNumber: 643,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ui$2f$fancy$2d$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        value: occasion,
                        onChange: setOccasion,
                        placeholder: "Occasion",
                        options: OCCASION_OPTIONS.map((option)=>({
                                value: option,
                                label: option,
                                group: 'Occasion'
                            }))
                    }, void 0, false, {
                        fileName: "[project]/app/views/CreateMySchemeView.tsx",
                        lineNumber: 654,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ui$2f$fancy$2d$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        value: visibility,
                        onChange: (selectedVisibility)=>setVisibility(selectedVisibility),
                        options: [
                            {
                                value: 'public',
                                label: 'Public'
                            },
                            {
                                value: 'private',
                                label: 'Private'
                            }
                        ]
                    }, void 0, false, {
                        fileName: "[project]/app/views/CreateMySchemeView.tsx",
                        lineNumber: 665,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        value: palette,
                        onChange: (e)=>setPalette(e.target.value),
                        placeholder: "Palette (e.g. Blue / Neutral)",
                        className: inputClassName
                    }, void 0, false, {
                        fileName: "[project]/app/views/CreateMySchemeView.tsx",
                        lineNumber: 674,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        value: mood,
                        onChange: (e)=>setMood(e.target.value),
                        placeholder: "Mood / aesthetic",
                        className: inputClassName
                    }, void 0, false, {
                        fileName: "[project]/app/views/CreateMySchemeView.tsx",
                        lineNumber: 675,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ui$2f$fancy$2d$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        value: selectedBrandId,
                        onChange: setSelectedBrandId,
                        placeholder: "SELECTION Default Brand",
                        options: [
                            {
                                value: DEFAULT_BRAND_ID,
                                label: 'SELECTION Default Brand',
                                icon: {
                                    type: 'emoji',
                                    value: '🏷️',
                                    alt: 'Default brand'
                                }
                            },
                            ...brands.map((brand)=>{
                                const logoUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$outfit$2d$card$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resolveBrandLogoUrlByName"])(brand.name) || brand.logo_url || null;
                                return {
                                    value: brand.brand_id,
                                    label: brand.name,
                                    icon: logoUrl ? {
                                        type: 'image',
                                        value: logoUrl,
                                        alt: `${brand.name} logo`
                                    } : {
                                        type: 'emoji',
                                        value: '🏷️',
                                        alt: `${brand.name} brand`
                                    }
                                };
                            })
                        ]
                    }, void 0, false, {
                        fileName: "[project]/app/views/CreateMySchemeView.tsx",
                        lineNumber: 677,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ui$2f$fancy$2d$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        value: outfitBackgroundConfig.background_mode,
                        onChange: ()=>setBackgroundStudioOpen(true),
                        placeholder: "Background Studio",
                        options: [
                            {
                                value: 'solid',
                                label: 'Open Background Studio · Solid'
                            },
                            {
                                value: 'gradient',
                                label: 'Open Background Studio · Gradient'
                            },
                            {
                                value: 'ai_artwork',
                                label: 'Open Background Studio · AI Artwork'
                            }
                        ]
                    }, void 0, false, {
                        fileName: "[project]/app/views/CreateMySchemeView.tsx",
                        lineNumber: 701,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        className: `${slotCardClassName} md:col-span-2`,
                        onClick: ()=>setBackgroundStudioOpen(true),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs uppercase tracking-[0.13em] text-white/60",
                                children: "Background"
                            }, void 0, false, {
                                fileName: "[project]/app/views/CreateMySchemeView.tsx",
                                lineNumber: 717,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-2 flex items-center gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "h-10 w-10 rounded-lg border border-white/30",
                                        style: (()=>{
                                            const resolved = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$outfit$2d$card$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resolveOutfitBackgroundForRender"])(outfitBackgroundConfig);
                                            if (resolved.background_mode === 'solid') {
                                                return {
                                                    background: resolved.solid_color || '#111827'
                                                };
                                            }
                                            if (resolved.background_mode === 'gradient') {
                                                const stops = resolved.gradient?.stops?.map((stop)=>`${stop.color} ${stop.position}%`).join(', ') || '#111827, #1f2937';
                                                return {
                                                    backgroundImage: `linear-gradient(${resolved.gradient?.angle ?? 130}deg, ${stops})`
                                                };
                                            }
                                            return {
                                                backgroundImage: `url(${resolved.ai_artwork?.image_url || '/models/model-default.jpeg'})`,
                                                backgroundSize: 'cover'
                                            };
                                        })()
                                    }, void 0, false, {
                                        fileName: "[project]/app/views/CreateMySchemeView.tsx",
                                        lineNumber: 719,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-left",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm font-semibold text-white",
                                                children: "Open Studio"
                                            }, void 0, false, {
                                                fileName: "[project]/app/views/CreateMySchemeView.tsx",
                                                lineNumber: 731,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-white/70",
                                                children: [
                                                    "Current mode: ",
                                                    outfitBackgroundConfig.background_mode.replace('_', ' ')
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/views/CreateMySchemeView.tsx",
                                                lineNumber: 732,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/views/CreateMySchemeView.tsx",
                                        lineNumber: 730,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/views/CreateMySchemeView.tsx",
                                lineNumber: 718,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/views/CreateMySchemeView.tsx",
                        lineNumber: 712,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: `${inputClassName} block cursor-pointer`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "block text-[11px] uppercase tracking-[0.12em] text-white/60",
                                children: "Hero image upload"
                            }, void 0, false, {
                                fileName: "[project]/app/views/CreateMySchemeView.tsx",
                                lineNumber: 740,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "file",
                                accept: "image/*",
                                className: "mt-2 block w-full text-xs text-white file:mr-3 file:rounded-lg file:border-0 file:bg-white/20 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-white/30",
                                onChange: (event)=>{
                                    const file = event.target.files?.[0];
                                    if (!file) return;
                                    uploadHeroImage(file);
                                }
                            }, void 0, false, {
                                fileName: "[project]/app/views/CreateMySchemeView.tsx",
                                lineNumber: 741,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "mt-1 block text-xs text-white/65",
                                children: heroImageUploading ? 'Uploading image...' : heroImageUrl ? 'Hero image uploaded successfully.' : 'Upload a photo of the person wearing the outfit.'
                            }, void 0, false, {
                                fileName: "[project]/app/views/CreateMySchemeView.tsx",
                                lineNumber: 751,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/views/CreateMySchemeView.tsx",
                        lineNumber: 739,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$create$2d$scheme$2f$DescriptionModeSelector$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        value: descriptionMode,
                        onChange: setDescriptionMode
                    }, void 0, false, {
                        fileName: "[project]/app/views/CreateMySchemeView.tsx",
                        lineNumber: 760,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: generatePremiumDescription,
                        disabled: isGeneratingPremiumDesc || filledSlotsCount === 0,
                        className: `${primaryButtonClassName} md:col-span-2 flex justify-center items-center gap-2`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "✨"
                            }, void 0, false, {
                                fileName: "[project]/app/views/CreateMySchemeView.tsx",
                                lineNumber: 768,
                                columnNumber: 11
                            }, this),
                            " ",
                            isGeneratingPremiumDesc ? 'Generating Premium Editorial Copy...' : 'Generate Premium Editorial Copy with Google AI'
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/views/CreateMySchemeView.tsx",
                        lineNumber: 762,
                        columnNumber: 9
                    }, this),
                    descriptionMode === 'manual' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                        value: manualDescription,
                        onChange: (e)=>setManualDescription(e.target.value),
                        placeholder: "Write the description for this outfit card...",
                        className: `${inputClassName} min-h-24 md:col-span-2`
                    }, void 0, false, {
                        fileName: "[project]/app/views/CreateMySchemeView.tsx",
                        lineNumber: 772,
                        columnNumber: 11
                    }, this) : null,
                    [
                        'upper',
                        'lower',
                        'shoes',
                        'accessory'
                    ].map((slot)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `${slotCardClassName} relative overflow-visible`,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm font-semibold capitalize text-white",
                                    children: [
                                        slot,
                                        " piece"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/views/CreateMySchemeView.tsx",
                                    lineNumber: 782,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-2",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ui$2f$fancy$2d$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        value: slots[slot] ?? '',
                                        onChange: (selectedValue)=>setSlots((prev)=>({
                                                    ...prev,
                                                    [slot]: selectedValue || null
                                                })),
                                        placeholder: "Select item",
                                        options: [
                                            {
                                                value: '',
                                                label: 'Select item'
                                            },
                                            ...DEFAULT_SLOT_SUGGESTIONS[slot].map((suggestion)=>({
                                                    value: suggestion.value,
                                                    label: suggestion.label,
                                                    hint: 'Suggested'
                                                })),
                                            ...aiSlotSuggestions[slot].map((suggestion)=>({
                                                    value: suggestion.value,
                                                    label: suggestion.label,
                                                    hint: 'AI'
                                                })),
                                            ...optionsByType(slot).map((item)=>({
                                                    value: item.wardrobe_item_id,
                                                    label: item.name
                                                }))
                                        ]
                                    }, void 0, false, {
                                        fileName: "[project]/app/views/CreateMySchemeView.tsx",
                                        lineNumber: 785,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/views/CreateMySchemeView.tsx",
                                    lineNumber: 784,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-2",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ui$2f$fancy$2d$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        value: slotBrandIds[slot] ?? DEFAULT_BRAND_ID,
                                        onChange: (selectedSlotBrandId)=>setSlotBrandIds((prev)=>({
                                                    ...prev,
                                                    [slot]: selectedSlotBrandId || DEFAULT_BRAND_ID
                                                })),
                                        placeholder: "Brand for this piece",
                                        options: [
                                            {
                                                value: DEFAULT_BRAND_ID,
                                                label: 'Use default outfit brand',
                                                hint: selectedBrand?.name || 'SELECTION'
                                            },
                                            ...brands.map((brand)=>({
                                                    value: brand.brand_id,
                                                    label: brand.name
                                                }))
                                        ]
                                    }, void 0, false, {
                                        fileName: "[project]/app/views/CreateMySchemeView.tsx",
                                        lineNumber: 815,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/views/CreateMySchemeView.tsx",
                                    lineNumber: 814,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-3 rounded-lg border border-white/20 bg-white/5 px-3 py-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-[11px] uppercase tracking-[0.12em] text-white/60",
                                            children: "Selected"
                                        }, void 0, false, {
                                            fileName: "[project]/app/views/CreateMySchemeView.tsx",
                                            lineNumber: 839,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "mt-1 text-sm font-semibold text-white",
                                            children: resolveSlotSelectionLabel(slot)
                                        }, void 0, false, {
                                            fileName: "[project]/app/views/CreateMySchemeView.tsx",
                                            lineNumber: 840,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/views/CreateMySchemeView.tsx",
                                    lineNumber: 838,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, slot, true, {
                            fileName: "[project]/app/views/CreateMySchemeView.tsx",
                            lineNumber: 781,
                            columnNumber: 11
                        }, this))
                ]
            }, void 0, true, {
                fileName: "[project]/app/views/CreateMySchemeView.tsx",
                lineNumber: 625,
                columnNumber: 7
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/views/CreateMySchemeView.tsx",
            lineNumber: 620,
            columnNumber: 5
        }, this);
    const renderSchemeData = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shared$2f$SectionBlock$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            title: "Scheme Basics",
            subtitle: "Defina claramente os dados que orientam a geração do card final.",
            className: "sa-surface-header h-auto border-white/20",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-4 space-y-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$create$2d$scheme$2f$GenerationModePanel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        mode: generationMode,
                        onChange: setGenerationMode
                    }, void 0, false, {
                        fileName: "[project]/app/views/CreateMySchemeView.tsx",
                        lineNumber: 855,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid gap-3 md:grid-cols-2 xl:grid-cols-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$create$2d$scheme$2f$SchemeStepCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                step: "Title",
                                icon: "🧬",
                                title: "Scheme title",
                                description: "Nome principal do card final. Ex: Night Luxe Capsule."
                            }, void 0, false, {
                                fileName: "[project]/app/views/CreateMySchemeView.tsx",
                                lineNumber: 857,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$create$2d$scheme$2f$SchemeStepCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                step: "Description",
                                icon: "🧾",
                                title: "Description",
                                description: "Explica o conceito da composição e aumenta contexto do card."
                            }, void 0, false, {
                                fileName: "[project]/app/views/CreateMySchemeView.tsx",
                                lineNumber: 858,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$create$2d$scheme$2f$SchemeStepCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                step: "Style direction",
                                icon: "🎯",
                                title: "Style + mood + audience",
                                description: "Define estilo, mood, visibilidade e caso de uso."
                            }, void 0, false, {
                                fileName: "[project]/app/views/CreateMySchemeView.tsx",
                                lineNumber: 859,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$create$2d$scheme$2f$SchemeStepCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                step: "Visibility",
                                icon: "🌐",
                                title: "Visibility",
                                description: "Public abre descoberta; private mantém rascunho reservado."
                            }, void 0, false, {
                                fileName: "[project]/app/views/CreateMySchemeView.tsx",
                                lineNumber: 860,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$create$2d$scheme$2f$SchemeStepCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                step: "Impact",
                                icon: "🚀",
                                title: "Impacto no card",
                                description: "Esses dados influenciam descrição, badges e background recomendado."
                            }, void 0, false, {
                                fileName: "[project]/app/views/CreateMySchemeView.tsx",
                                lineNumber: 861,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/views/CreateMySchemeView.tsx",
                        lineNumber: 856,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/views/CreateMySchemeView.tsx",
                lineNumber: 854,
                columnNumber: 7
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/views/CreateMySchemeView.tsx",
            lineNumber: 849,
            columnNumber: 5
        }, this);
    const renderAiGeneration = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shared$2f$SectionBlock$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            title: "AI Assist",
            subtitle: "A IA sugere combinações com base nos seus itens e metadata.",
            className: "sa-surface-header h-auto border-white/20",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-4 space-y-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                        value: aiPrompt,
                        onChange: (e)=>setAiPrompt(e.target.value),
                        placeholder: "Create a premium casual daily outfit with a visual anchor in blue tones.",
                        className: `${inputClassName} min-h-28`
                    }, void 0, false, {
                        fileName: "[project]/app/views/CreateMySchemeView.tsx",
                        lineNumber: 874,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-wrap gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                className: primaryButtonClassName,
                                onClick: async ()=>{
                                    const success = await generateFromAiPrompt();
                                    if (success) setSelectedSection('Slots Review');
                                },
                                disabled: aiInterpreting,
                                children: aiInterpreting ? 'Interpreting...' : 'Interpretar look'
                            }, void 0, false, {
                                fileName: "[project]/app/views/CreateMySchemeView.tsx",
                                lineNumber: 881,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                className: secondaryButtonClassName,
                                onClick: ()=>setGenerationMode('ai'),
                                children: "Set as AI Mode"
                            }, void 0, false, {
                                fileName: "[project]/app/views/CreateMySchemeView.tsx",
                                lineNumber: 892,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/views/CreateMySchemeView.tsx",
                        lineNumber: 880,
                        columnNumber: 9
                    }, this),
                    aiInterpretation ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-xl border border-white/20 bg-white/5 p-3 text-sm text-white/90",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "font-semibold text-white",
                                children: "Structured interpretation"
                            }, void 0, false, {
                                fileName: "[project]/app/views/CreateMySchemeView.tsx",
                                lineNumber: 898,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-1 text-white/70",
                                children: aiInterpretation.description || aiInterpretation.prompt
                            }, void 0, false, {
                                fileName: "[project]/app/views/CreateMySchemeView.tsx",
                                lineNumber: 899,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                className: "mt-2 space-y-1 text-xs text-white/80",
                                children: aiInterpretation.items.map((item, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: [
                                            "• ",
                                            item.display_label,
                                            " · ",
                                            item.piece_type,
                                            item.color ? ` · ${item.color}` : '',
                                            item.material ? ` · ${item.material}` : ''
                                        ]
                                    }, `${item.display_label}-${index}`, true, {
                                        fileName: "[project]/app/views/CreateMySchemeView.tsx",
                                        lineNumber: 902,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/app/views/CreateMySchemeView.tsx",
                                lineNumber: 900,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/views/CreateMySchemeView.tsx",
                        lineNumber: 897,
                        columnNumber: 11
                    }, this) : null,
                    aiError ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-xl border border-rose-300/50 bg-rose-500/10 p-3 text-sm text-rose-100",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "font-semibold",
                                children: "AI generation failed"
                            }, void 0, false, {
                                fileName: "[project]/app/views/CreateMySchemeView.tsx",
                                lineNumber: 913,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-1",
                                children: aiError.message
                            }, void 0, false, {
                                fileName: "[project]/app/views/CreateMySchemeView.tsx",
                                lineNumber: 914,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-2 text-xs text-rose-100/80",
                                children: [
                                    "code: ",
                                    aiError.code,
                                    aiError.requestId ? ` · trace: ${aiError.requestId}` : ''
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/views/CreateMySchemeView.tsx",
                                lineNumber: 915,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/views/CreateMySchemeView.tsx",
                        lineNumber: 912,
                        columnNumber: 11
                    }, this) : null
                ]
            }, void 0, true, {
                fileName: "[project]/app/views/CreateMySchemeView.tsx",
                lineNumber: 873,
                columnNumber: 7
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/views/CreateMySchemeView.tsx",
            lineNumber: 868,
            columnNumber: 5
        }, this);
    const renderSlotsReview = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shared$2f$SectionBlock$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            title: "Slots Review",
            subtitle: "Loadout-style review for each slot with completeness feedback.",
            className: "sa-surface-header h-auto border-white/20",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mt-4 grid gap-3 md:grid-cols-2",
                    children: Object.keys(slots).map((slot)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$create$2d$scheme$2f$SlotReviewCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            slot: slot,
                            icon: SLOT_ICONS[slot],
                            selected: resolveSlotSelectionLabel(slot),
                            status: slots[slot] ? 'filled' : 'empty'
                        }, slot, false, {
                            fileName: "[project]/app/views/CreateMySchemeView.tsx",
                            lineNumber: 933,
                            columnNumber: 11
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/app/views/CreateMySchemeView.tsx",
                    lineNumber: 931,
                    columnNumber: 7
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "mt-4 text-sm text-white/75",
                    children: [
                        "Composition status: ",
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "font-semibold text-white",
                            children: [
                                filledSlotsCount,
                                " of 4 slots filled"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/views/CreateMySchemeView.tsx",
                            lineNumber: 943,
                            columnNumber: 29
                        }, this),
                        "."
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/views/CreateMySchemeView.tsx",
                    lineNumber: 942,
                    columnNumber: 7
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/views/CreateMySchemeView.tsx",
            lineNumber: 926,
            columnNumber: 5
        }, this);
    const renderCardBackground = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shared$2f$SectionBlock$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            title: "Card Background",
            subtitle: "Ajuste cor, gradiente ou IA e persista no draft atual.",
            className: "sa-surface-header h-auto border-white/20",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    type: "button",
                    className: primaryButtonClassName,
                    onClick: ()=>setBackgroundStudioOpen(true),
                    children: "Open Background Studio"
                }, void 0, false, {
                    fileName: "[project]/app/views/CreateMySchemeView.tsx",
                    lineNumber: 956,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/views/CreateMySchemeView.tsx",
                lineNumber: 955,
                columnNumber: 7
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/views/CreateMySchemeView.tsx",
            lineNumber: 950,
            columnNumber: 5
        }, this);
    const renderSaveGenerate = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shared$2f$SectionBlock$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            title: "Save & Generate",
            subtitle: "Final preview, validation, and generation confirmation.",
            className: "sa-surface-header h-auto border-white/20",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-4 space-y-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$create$2d$scheme$2f$SaveSummaryPanel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        mode: generationMode,
                        descriptionMode: descriptionMode,
                        filledSlots: filledSlotsCount,
                        totalSlots: 4
                    }, void 0, false, {
                        fileName: "[project]/app/views/CreateMySchemeView.tsx",
                        lineNumber: 970,
                        columnNumber: 9
                    }, this),
                    !isFormValid ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-xl border border-amber-300/40 bg-amber-500/10 p-3 text-sm text-amber-100",
                        children: "Quality check warning: title, style, occasion, and at least one slot are required before saving."
                    }, void 0, false, {
                        fileName: "[project]/app/views/CreateMySchemeView.tsx",
                        lineNumber: 977,
                        columnNumber: 11
                    }, this) : null,
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        className: primaryButtonClassName,
                        disabled: heroImageUploading,
                        onClick: handleFinalSave,
                        children: generationMode === 'manual' ? 'Save Outfit Card' : 'Generate Outfit Card'
                    }, void 0, false, {
                        fileName: "[project]/app/views/CreateMySchemeView.tsx",
                        lineNumber: 981,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/views/CreateMySchemeView.tsx",
                lineNumber: 969,
                columnNumber: 7
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/views/CreateMySchemeView.tsx",
            lineNumber: 964,
            columnNumber: 5
        }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid gap-6 lg:grid-cols-[280px_1fr]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$create$2d$scheme$2f$SchemeStepSidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        steps: sections,
                        currentStep: selectedSection,
                        completedSteps: completedSections,
                        onSelect: setSelectedSection
                    }, void 0, false, {
                        fileName: "[project]/app/views/CreateMySchemeView.tsx",
                        lineNumber: 991,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shell$2f$PageHeader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                title: "Create my Outfit Card",
                                subtitle: "Premium manual and AI generation paths for outfit cards."
                            }, void 0, false, {
                                fileName: "[project]/app/views/CreateMySchemeView.tsx",
                                lineNumber: 994,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$create$2d$scheme$2f$GenerationModePanel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                mode: generationMode,
                                onChange: setGenerationMode
                            }, void 0, false, {
                                fileName: "[project]/app/views/CreateMySchemeView.tsx",
                                lineNumber: 999,
                                columnNumber: 11
                            }, this),
                            selectedSection === 'Scheme Basics' ? renderSchemeData() : null,
                            selectedSection === 'Build Outfit' ? renderManualBuilder() : null,
                            selectedSection === 'AI Assist' ? renderAiGeneration() : null,
                            selectedSection === 'Slots Review' ? renderSlotsReview() : null,
                            selectedSection === 'Card Background' ? renderCardBackground() : null,
                            selectedSection === 'Save & Generate' ? renderSaveGenerate() : null,
                            generatedCardData ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shared$2f$SectionBlock$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                title: "Generated Outfit Card",
                                subtitle: "Rendered after the final save & generate action.",
                                className: "sa-surface-header h-auto border-white/20",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$outfit$2d$card$2f$OutfitCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    data: generatedCardData
                                }, void 0, false, {
                                    fileName: "[project]/app/views/CreateMySchemeView.tsx",
                                    lineNumber: 1014,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/views/CreateMySchemeView.tsx",
                                lineNumber: 1009,
                                columnNumber: 13
                            }, this) : null
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/views/CreateMySchemeView.tsx",
                        lineNumber: 993,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/views/CreateMySchemeView.tsx",
                lineNumber: 990,
                columnNumber: 7
            }, this),
            alertMessage ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shared$2f$SaiModalAlert$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                message: alertMessage,
                onConfirm: ()=>setAlertMessage(null)
            }, void 0, false, {
                fileName: "[project]/app/views/CreateMySchemeView.tsx",
                lineNumber: 1021,
                columnNumber: 9
            }, this) : null,
            backgroundStudioOpen ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$create$2d$scheme$2f$OutfitBackgroundStudioModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                value: outfitBackgroundConfig,
                onClose: ()=>setBackgroundStudioOpen(false),
                onApply: (nextBackgroundConfig)=>{
                    setOutfitBackgroundConfig(nextBackgroundConfig);
                    setAlertMessage(`Background applied: ${nextBackgroundConfig.background_mode} · shape ${nextBackgroundConfig.shape || 'none'}`);
                    setBackgroundStudioOpen(false);
                },
                outfitMetadata: {
                    style,
                    occasion,
                    palette,
                    mood,
                    brands: selectedBrand?.name ? [
                        selectedBrand.name
                    ] : undefined
                },
                previewCardData: buildGeneratedOutfitCardData()
            }, void 0, false, {
                fileName: "[project]/app/views/CreateMySchemeView.tsx",
                lineNumber: 1025,
                columnNumber: 9
            }, this) : null
        ]
    }, void 0, true);
}
_s(CreateMySchemeView, "3MbtleIDzTA4QtXOTqkY6UqNNj0=");
_c = CreateMySchemeView;
var _c;
__turbopack_context__.k.register(_c, "CreateMySchemeView");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/views/ExploreSchemeView.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ExploreSchemeView
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$outfit$2d$card$2f$OutfitCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/outfit-card/OutfitCard.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shell$2f$PageHeader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/shell/PageHeader.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shared$2f$SectionBlock$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/shared/SectionBlock.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$outfit$2d$card$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/outfit-card.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
const SLOT_PREVIEW_DEFAULTS = {
    upper: {
        pieceType: 'Jacket',
        category: 'Premium',
        wearstyles: [
            'Statement Piece',
            'Visual Anchor'
        ]
    },
    lower: {
        pieceType: 'Pants',
        category: 'Standard',
        wearstyles: [
            'Base Structure',
            'Balanced Fit'
        ]
    },
    shoes: {
        pieceType: 'Footwear',
        category: 'Rare',
        wearstyles: [
            'Trend Driver',
            'Street Energy'
        ]
    },
    accessory: {
        pieceType: 'Accessory',
        category: 'Limited Edition',
        wearstyles: [
            'Style Accent',
            'Attention Grabber'
        ]
    }
};
const toReadableSuggestedName = (value)=>{
    const [, , slug = 'selected-piece'] = value.split(':');
    return slug.replaceAll('-', ' ').split(' ').filter(Boolean).map((token)=>`${token[0]?.toUpperCase() ?? ''}${token.slice(1)}`).join(' ');
};
function ExploreSchemeView() {
    _s();
    const [schemes, setSchemes] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [favorites, setFavorites] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [availability, setAvailability] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [itemsBySchemeId, setItemsBySchemeId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ExploreSchemeView.useEffect": ()=>{
            const loadSchemesWithItems = {
                "ExploreSchemeView.useEffect.loadSchemesWithItems": async ()=>{
                    const response = await fetch('/api/schemes/public');
                    const data = await response.json();
                    const safeSchemes = Array.isArray(data) ? data : [];
                    setSchemes(safeSchemes);
                    const detailResponses = await Promise.all(safeSchemes.map({
                        "ExploreSchemeView.useEffect.loadSchemesWithItems": (scheme)=>fetch(`/api/schemes/${scheme.scheme_id}`).then({
                                "ExploreSchemeView.useEffect.loadSchemesWithItems": (res)=>res.ok ? res.json() : null
                            }["ExploreSchemeView.useEffect.loadSchemesWithItems"]).catch({
                                "ExploreSchemeView.useEffect.loadSchemesWithItems": ()=>null
                            }["ExploreSchemeView.useEffect.loadSchemesWithItems"])
                    }["ExploreSchemeView.useEffect.loadSchemesWithItems"]));
                    const nextItemsBySchemeId = {};
                    detailResponses.forEach({
                        "ExploreSchemeView.useEffect.loadSchemesWithItems": (details, index)=>{
                            const currentScheme = safeSchemes[index];
                            const detailPayload = details;
                            nextItemsBySchemeId[currentScheme.scheme_id] = detailPayload?.items ?? [];
                        }
                    }["ExploreSchemeView.useEffect.loadSchemesWithItems"]);
                    setItemsBySchemeId(nextItemsBySchemeId);
                }
            }["ExploreSchemeView.useEffect.loadSchemesWithItems"];
            loadSchemesWithItems().catch({
                "ExploreSchemeView.useEffect": ()=>{
                    setSchemes([]);
                    setItemsBySchemeId({});
                }
            }["ExploreSchemeView.useEffect"]);
        }
    }["ExploreSchemeView.useEffect"], []);
    const grouped = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ExploreSchemeView.useMemo[grouped]": ()=>{
            const byOccasion = new Map();
            schemes.forEach({
                "ExploreSchemeView.useMemo[grouped]": (scheme)=>{
                    const key = scheme.occasion || 'General';
                    byOccasion.set(key, [
                        ...byOccasion.get(key) ?? [],
                        scheme
                    ]);
                }
            }["ExploreSchemeView.useMemo[grouped]"]);
            return Array.from(byOccasion.entries());
        }
    }["ExploreSchemeView.useMemo[grouped]"], [
        schemes
    ]);
    const buildOutfitPreviewData = (scheme)=>{
        const styleLine = `${scheme.style || 'Streetwear'} • ${scheme.occasion || 'General'}`;
        const relatedItems = itemsBySchemeId[scheme.scheme_id] ?? [];
        const savedPieces = Array.isArray(scheme.pieces) ? scheme.pieces : [];
        let parsedBackground = undefined;
        try {
            const parsedDescription = scheme.description ? JSON.parse(scheme.description) : null;
            if (parsedDescription?.outfitBackground) {
                parsedBackground = parsedDescription.outfitBackground;
            }
        } catch  {
            parsedBackground = undefined;
        }
        const normalizedPieces = savedPieces.length ? savedPieces.map((piece, index)=>({
                id: piece.id || piece.piece_id || `${scheme.scheme_id}-piece-${index}`,
                name: piece.name || piece.piece_name || 'Selected piece',
                brand: piece.brand || piece.brand_name || 'Selection Default Brand',
                brandLogoUrl: piece.brandLogoUrl || piece.brand_logo_url,
                pieceType: piece.pieceType || piece.piece_type || 'Garment',
                category: piece.category,
                wearstyles: piece.wearstyles
            })) : relatedItems.length ? relatedItems.map((item)=>{
            const derivedName = item.wardrobe_name?.trim() || (item.wardrobe_item_id.startsWith('suggested:') ? toReadableSuggestedName(item.wardrobe_item_id) : 'Selected piece');
            return {
                id: item.scheme_item_id,
                name: derivedName,
                brand: 'Selection Default Brand',
                pieceType: SLOT_PREVIEW_DEFAULTS[item.slot].pieceType,
                category: SLOT_PREVIEW_DEFAULTS[item.slot].category,
                wearstyles: SLOT_PREVIEW_DEFAULTS[item.slot].wearstyles,
                pieceTypeIconUrl: item.image_url || undefined
            };
        }) : [];
        return {
            outfitName: scheme.title || 'Untitled Outfit',
            outfitStyleLine: styleLine,
            outfitDescription: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$outfit$2d$card$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildOutfitDescriptionFallback"])({
                pieces: normalizedPieces,
                outfitStyleLine: `${scheme.style || 'Minimal'} ${scheme.occasion || 'General'}`,
                outfitName: scheme.title || 'Untitled Outfit'
            }),
            heroImageUrl: scheme.cover_image_url || '/welcome-newcomers.png',
            outfitBackground: parsedBackground,
            pieces: normalizedPieces
        };
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shell$2f$PageHeader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                title: "Saved Outfit Cards",
                subtitle: "Manage outfits by occasion, preference, favorite, and availability."
            }, void 0, false, {
                fileName: "[project]/app/views/ExploreSchemeView.tsx",
                lineNumber: 179,
                columnNumber: 7
            }, this),
            grouped.map(([occasion, occasionSchemes])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shared$2f$SectionBlock$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    title: `Occasion: ${occasion}`,
                    subtitle: "Outfits grouped by occasion.",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3",
                        children: occasionSchemes.map((scheme)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                                className: "space-y-3 rounded-2xl border border-white/25 p-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$outfit$2d$card$2f$OutfitCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        data: buildOutfitPreviewData(scheme)
                                    }, void 0, false, {
                                        fileName: "[project]/app/views/ExploreSchemeView.tsx",
                                        lineNumber: 186,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "rounded-xl border border-white/20 bg-white/10 p-3 text-xs text-white/80",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                children: [
                                                    "Status: ",
                                                    availability[scheme.scheme_id] ?? 'available'
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/views/ExploreSchemeView.tsx",
                                                lineNumber: 188,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                children: [
                                                    "Favorite: ",
                                                    favorites[scheme.scheme_id] ? 'yes' : 'no'
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/views/ExploreSchemeView.tsx",
                                                lineNumber: 189,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "mt-2 flex flex-wrap gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        onClick: ()=>setFavorites((prev)=>({
                                                                    ...prev,
                                                                    [scheme.scheme_id]: !prev[scheme.scheme_id]
                                                                })),
                                                        className: "rounded-lg border border-white/30 px-2 py-1 text-xs text-white",
                                                        children: "★ Favorite"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/views/ExploreSchemeView.tsx",
                                                        lineNumber: 191,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        onClick: ()=>setAvailability((prev)=>({
                                                                    ...prev,
                                                                    [scheme.scheme_id]: 'available'
                                                                })),
                                                        className: "rounded-lg border border-white/30 px-2 py-1 text-xs text-white",
                                                        children: "Available"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/views/ExploreSchemeView.tsx",
                                                        lineNumber: 192,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        onClick: ()=>setAvailability((prev)=>({
                                                                    ...prev,
                                                                    [scheme.scheme_id]: 'unavailable'
                                                                })),
                                                        className: "rounded-lg border border-white/30 px-2 py-1 text-xs text-white",
                                                        children: "Unavailable"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/views/ExploreSchemeView.tsx",
                                                        lineNumber: 193,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/views/ExploreSchemeView.tsx",
                                                lineNumber: 190,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/views/ExploreSchemeView.tsx",
                                        lineNumber: 187,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, scheme.scheme_id, true, {
                                fileName: "[project]/app/views/ExploreSchemeView.tsx",
                                lineNumber: 185,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/app/views/ExploreSchemeView.tsx",
                        lineNumber: 183,
                        columnNumber: 11
                    }, this)
                }, occasion, false, {
                    fileName: "[project]/app/views/ExploreSchemeView.tsx",
                    lineNumber: 182,
                    columnNumber: 9
                }, this))
        ]
    }, void 0, true, {
        fileName: "[project]/app/views/ExploreSchemeView.tsx",
        lineNumber: 178,
        columnNumber: 5
    }, this);
}
_s(ExploreSchemeView, "diTQsvL1Lnu7Xn7BEf+HKICnQUQ=");
_c = ExploreSchemeView;
var _c;
__turbopack_context__.k.register(_c, "ExploreSchemeView");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/views/MyWardrobeView.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MyWardrobeView
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$authSession$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/authSession.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$clientSession$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/clientSession.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$navigation$2f$ContextSectionMenu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/navigation/ContextSectionMenu.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shell$2f$PageHeader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/shell/PageHeader.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shared$2f$SectionBlock$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/shared/SectionBlock.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$wardrobeModelUrl$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/wardrobeModelUrl.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$wardrobe$2f$ThreeDViewerModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/wardrobe/ThreeDViewerModal.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$wardrobe$2f$WardrobeItemViewerModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/wardrobe/WardrobeItemViewerModal.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$wardrobe$2f$ThreeDGenerationProgressModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/wardrobe/ThreeDGenerationProgressModal.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$wardrobe$2f$WardrobeItemCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/wardrobe/WardrobeItemCard.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$hooks$2f$use3dAssetJob$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/hooks/use3dAssetJob.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$blenderWorkerClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/services/blenderWorkerClient.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
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
const sections = [
    'Available',
    'Unavailable',
    'Favorites'
];
const READY_STATUSES = new Set([
    'done',
    'ready',
    'completed',
    'asset_available'
]);
const FAILED_STATUSES = new Set([
    'failed',
    'failed_geometry_scope'
]);
const QUEUE_STATUSES = new Set([
    'queued_segmentation',
    'queued_base',
    'queued_branding',
    'queued_geometry_qa',
    'segmentation_done'
]);
const PROGRESS_STATUSES = new Set([
    'generating_base',
    'branding_in_progress',
    'base_done',
    'retrying_generation',
    'in_progress'
]);
function mapItemState(item) {
    const normalized = String(item.model_status ?? '').trim().toLowerCase();
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$wardrobeModelUrl$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resolveWardrobeModelUrl"])(item) || READY_STATUSES.has(normalized)) return 'ready';
    if (FAILED_STATUSES.has(normalized)) return 'failed';
    if (QUEUE_STATUSES.has(normalized)) return 'queued';
    if (PROGRESS_STATUSES.has(normalized)) return 'generating';
    return 'not_started';
}
function stateLabel(state, status, item) {
    const normalizedError = String(item?.model_generation_error ?? '').trim().toLowerCase();
    const fitReady = String(item?.fitProfile?.preparationStatus ?? '').trim().toLowerCase() === 'ready';
    if (state === 'ready') return 'Ready for 3D Viewer';
    if (state === 'failed' && fitReady && (normalizedError.includes('low_quality') || normalizedError.includes('too dark') || normalizedError.includes('low contrast'))) {
        return 'Ready for 2D try-on · 3D generation failed: cleaned garment too dark/low contrast';
    }
    if (state === 'queued') return 'Queue pending';
    if (state === 'generating') return 'Generating asset';
    if (state === 'failed') return 'Failed (tap to retry)';
    return `Not started${status ? ` • ${status}` : ''}`;
}
function MyWardrobeView() {
    _s();
    const [items, setItems] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [cursor, setCursor] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [cursorCache, setCursorCache] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        0: null
    });
    const [page, setPage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [isInitialLoading, setIsInitialLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isLoadingMore, setIsLoadingMore] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [hasMore, setHasMore] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [selectedSection, setSelectedSection] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(sections[0]?.toLowerCase() ?? 'available');
    const [availability, setAvailability] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [favorites, setFavorites] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [viewerItem, setViewerItem] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [modalItem, setModalItem] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [viewerUrl, setViewerUrl] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [progressItem, setProgressItem] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [searchQuery, setSearchQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [isSearching, setIsSearching] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [searchIntent, setSearchIntent] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const assetJob = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$hooks$2f$use3dAssetJob$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["use3dAssetJob"])({
        pollIntervalMs: 1200,
        timeoutMs: 90000,
        onCompleted: {
            "MyWardrobeView.use3dAssetJob[assetJob]": (artifactUrl)=>{
                if (!progressItem) return;
                setViewerItem(progressItem);
                setViewerUrl(artifactUrl);
                setProgressItem(null);
            }
        }["MyWardrobeView.use3dAssetJob[assetJob]"]
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MyWardrobeView.useEffect": ()=>{
            const loadWardrobeData = {
                "MyWardrobeView.useEffect.loadWardrobeData": async ()=>{
                    setIsInitialLoading(true);
                    const localProfile = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$authSession$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAuthSessionProfile"])();
                    let userId = localProfile.user_id?.trim() || '';
                    if (!userId) {
                        const serverProfile = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$clientSession$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getServerSession"])();
                        userId = serverProfile?.user_id?.trim() || '';
                    }
                    if (!userId) {
                        setItems([]);
                        setHasMore(false);
                        setIsInitialLoading(false);
                        return;
                    }
                    const wardrobeResponse = await fetch(`/api/wardrobe-items/user/${userId}?status=active&limit=24`);
                    const wardrobePayload = await wardrobeResponse.json().catch({
                        "MyWardrobeView.useEffect.loadWardrobeData": ()=>({
                                items: [],
                                nextCursor: null
                            })
                    }["MyWardrobeView.useEffect.loadWardrobeData"]);
                    const nextItems = wardrobeResponse.ok && Array.isArray(wardrobePayload?.items) ? wardrobePayload.items : [];
                    setItems(nextItems);
                    setCursor(typeof wardrobePayload?.nextCursor === 'string' ? wardrobePayload.nextCursor : null);
                    setCursorCache({
                        0: null,
                        1: typeof wardrobePayload?.nextCursor === 'string' ? wardrobePayload.nextCursor : null
                    });
                    setPage(0);
                    setHasMore(Boolean(wardrobePayload?.nextCursor));
                    setIsInitialLoading(false);
                }
            }["MyWardrobeView.useEffect.loadWardrobeData"];
            void loadWardrobeData().catch({
                "MyWardrobeView.useEffect": ()=>{
                    setItems([]);
                    setHasMore(false);
                    setIsInitialLoading(false);
                }
            }["MyWardrobeView.useEffect"]);
        }
    }["MyWardrobeView.useEffect"], []);
    const loadMore = async ()=>{
        if (isLoadingMore || !hasMore || !cursor) return;
        setIsLoadingMore(true);
        try {
            const localProfile = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$authSession$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAuthSessionProfile"])();
            const userId = localProfile.user_id?.trim() || '';
            if (!userId) return;
            const wardrobeResponse = await fetch(`/api/wardrobe-items/user/${userId}?status=active&limit=24&cursor=${encodeURIComponent(cursor)}`);
            const wardrobePayload = await wardrobeResponse.json().catch(()=>({
                    items: [],
                    nextCursor: null
                }));
            const nextItems = wardrobeResponse.ok && Array.isArray(wardrobePayload?.items) ? wardrobePayload.items : [];
            setItems((prev)=>[
                    ...prev,
                    ...nextItems
                ]);
            setCursor(typeof wardrobePayload?.nextCursor === 'string' ? wardrobePayload.nextCursor : null);
            setHasMore(Boolean(wardrobePayload?.nextCursor));
            setPage((prev)=>{
                const nextPage = prev + 1;
                setCursorCache((current)=>({
                        ...current,
                        [nextPage + 1]: wardrobePayload?.nextCursor ?? null
                    }));
                return nextPage;
            });
        } finally{
            setIsLoadingMore(false);
        }
    };
    const grouped = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "MyWardrobeView.useMemo[grouped]": ()=>{
            const available = items.filter({
                "MyWardrobeView.useMemo[grouped].available": (item)=>(availability[item.wardrobe_item_id] ?? 'available') === 'available'
            }["MyWardrobeView.useMemo[grouped].available"]);
            const unavailable = items.filter({
                "MyWardrobeView.useMemo[grouped].unavailable": (item)=>(availability[item.wardrobe_item_id] ?? 'available') === 'unavailable'
            }["MyWardrobeView.useMemo[grouped].unavailable"]);
            const favorite = items.filter({
                "MyWardrobeView.useMemo[grouped].favorite": (item)=>favorites[item.wardrobe_item_id]
            }["MyWardrobeView.useMemo[grouped].favorite"]);
            return {
                available,
                unavailable,
                favorite
            };
        }
    }["MyWardrobeView.useMemo[grouped]"], [
        availability,
        favorites,
        items
    ]);
    const activeGroups = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "MyWardrobeView.useMemo[activeGroups]": ()=>{
            const groups = [
                {
                    key: 'available',
                    title: 'Available Pieces',
                    data: grouped.available
                },
                {
                    key: 'unavailable',
                    title: 'Unavailable Pieces',
                    data: grouped.unavailable
                },
                {
                    key: 'favorite',
                    title: 'Favorite Pieces',
                    data: grouped.favorite
                }
            ];
            const sectionToGroupKey = {
                available: 'available',
                unavailable: 'unavailable',
                favorites: 'favorite'
            };
            let selectedGroupData = groups.find({
                "MyWardrobeView.useMemo[activeGroups]": (group)=>group.key === (sectionToGroupKey[selectedSection] ?? 'available')
            }["MyWardrobeView.useMemo[activeGroups]"])?.data || [];
            if (searchIntent) {
                selectedGroupData = selectedGroupData.map({
                    "MyWardrobeView.useMemo[activeGroups]": (item)=>{
                        let score = 0;
                        const text = `${item.name} ${item.brand} ${item.season} ${item.gender} ${item.piece_type}`.toLowerCase();
                        const match = {
                            "MyWardrobeView.useMemo[activeGroups].match": (arr, weight)=>{
                                if (arr && arr.length) {
                                    arr.forEach({
                                        "MyWardrobeView.useMemo[activeGroups].match": (term)=>{
                                            if (text.includes(term.toLowerCase())) score += weight;
                                        }
                                    }["MyWardrobeView.useMemo[activeGroups].match"]);
                                }
                            }
                        }["MyWardrobeView.useMemo[activeGroups].match"];
                        match(searchIntent.piece_item, 3);
                        match(searchIntent.brand, 3);
                        match(searchIntent.colors, 2);
                        match(searchIntent.season, 2);
                        match(searchIntent.style, 1);
                        match(searchIntent.occasion, 1);
                        match(searchIntent.semanticTags, 1);
                        return {
                            item,
                            score
                        };
                    }
                }["MyWardrobeView.useMemo[activeGroups]"]).filter({
                    "MyWardrobeView.useMemo[activeGroups]": (x)=>x.score > 0
                }["MyWardrobeView.useMemo[activeGroups]"]).sort({
                    "MyWardrobeView.useMemo[activeGroups]": (a, b)=>b.score - a.score
                }["MyWardrobeView.useMemo[activeGroups]"]).map({
                    "MyWardrobeView.useMemo[activeGroups]": (x)=>x.item
                }["MyWardrobeView.useMemo[activeGroups]"]);
            } else if (searchQuery.trim().length > 0) {
                // Simple text fallback if AI intent not present
                const query = searchQuery.toLowerCase();
                selectedGroupData = selectedGroupData.filter({
                    "MyWardrobeView.useMemo[activeGroups]": (item)=>`${item.name} ${item.brand} ${item.piece_type}`.toLowerCase().includes(query)
                }["MyWardrobeView.useMemo[activeGroups]"]);
            }
            const selectedGroup = groups.find({
                "MyWardrobeView.useMemo[activeGroups].selectedGroup": (group)=>group.key === (sectionToGroupKey[selectedSection] ?? 'available')
            }["MyWardrobeView.useMemo[activeGroups].selectedGroup"]);
            return selectedGroup ? [
                {
                    ...selectedGroup,
                    data: selectedGroupData
                }
            ] : [
                {
                    ...groups[0],
                    data: selectedGroupData
                }
            ];
        }
    }["MyWardrobeView.useMemo[activeGroups]"], [
        grouped,
        selectedSection,
        searchIntent,
        searchQuery
    ]);
    const handleSearch = async (e)=>{
        if (e) e.preventDefault();
        if (!searchQuery.trim()) {
            setSearchIntent(null);
            return;
        }
        setIsSearching(true);
        setSearchIntent(null);
        try {
            const response = await fetch('/api/ai/fashion/search-intent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    query: searchQuery
                })
            });
            const result = await response.json();
            if (result.ok && result.data) {
                setSearchIntent(result.data);
            }
        } catch (err) {
            console.error('Search failed', err);
        } finally{
            setIsSearching(false);
        }
    };
    const handleOpenViewerIntent = async (item)=>{
        const existingModel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$wardrobeModelUrl$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resolveWardrobeModelUrl"])(item);
        if (existingModel) {
            setViewerItem(item);
            setViewerUrl(existingModel);
            return;
        }
        setProgressItem(item);
        await assetJob.startJob({
            createJob: async ()=>{
                const payload = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$blenderWorkerClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildBlenderWorkerSubmitPayload"])(item);
                console.log('[3d-worker] submit:start', {
                    pieceId: item.wardrobe_item_id,
                    pieceName: item.name,
                    imageUrl: payload.imageUrl,
                    payload
                });
                const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$blenderWorkerClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["submitBlenderWorkerJob"])(payload);
                console.log('[3d-worker] submit:done', {
                    pieceId: item.wardrobe_item_id,
                    pieceName: item.name,
                    jobId: response.jobId ?? response.job_id ?? response.id ?? null
                });
                return response;
            },
            pollJob: async (jobId)=>{
                const payload = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$blenderWorkerClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pollBlenderWorkerJob"])(jobId);
                console.log('[3d-worker] poll', {
                    pieceId: item.wardrobe_item_id,
                    pieceName: item.name,
                    jobId,
                    status: payload.status ?? null
                });
                return payload;
            }
        });
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid gap-6 lg:grid-cols-[280px_1fr]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$navigation$2f$ContextSectionMenu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        title: "Virtual Wardrobe",
                        sections: sections,
                        selectedSection: sections.find((section)=>section.toLowerCase() === selectedSection) ?? sections[0],
                        onSelectSection: (section)=>setSelectedSection(section.toLowerCase())
                    }, void 0, false, {
                        fileName: "[project]/app/views/MyWardrobeView.tsx",
                        lineNumber: 293,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shell$2f$PageHeader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                title: "Virtual Wardrobe",
                                subtitle: "Classify pieces as available, unavailable, and favorites."
                            }, void 0, false, {
                                fileName: "[project]/app/views/MyWardrobeView.tsx",
                                lineNumber: 300,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "rounded-2xl border border-white/10 bg-white/5 p-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                                        onSubmit: handleSearch,
                                        className: "flex flex-col gap-2 md:flex-row",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "text",
                                                placeholder: "✨ Semantic search (e.g. roupas de inverno pretas)",
                                                className: "flex-1 rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm text-white placeholder-white/50",
                                                value: searchQuery,
                                                onChange: (e)=>{
                                                    setSearchQuery(e.target.value);
                                                    if (e.target.value === '') setSearchIntent(null);
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/app/views/MyWardrobeView.tsx",
                                                lineNumber: 304,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "submit",
                                                disabled: isSearching,
                                                className: "rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-2 font-semibold text-white shadow-lg transition hover:scale-[1.02] disabled:opacity-50",
                                                children: isSearching ? 'Searching...' : 'AI Search'
                                            }, void 0, false, {
                                                fileName: "[project]/app/views/MyWardrobeView.tsx",
                                                lineNumber: 314,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/views/MyWardrobeView.tsx",
                                        lineNumber: 303,
                                        columnNumber: 13
                                    }, this),
                                    searchIntent && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-3 flex flex-wrap gap-2 text-[10px] text-white/70",
                                        children: [
                                            searchIntent.colors.map((c)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "rounded border border-white/20 bg-white/10 px-1 py-0.5",
                                                    children: [
                                                        "🎨 ",
                                                        c
                                                    ]
                                                }, c, true, {
                                                    fileName: "[project]/app/views/MyWardrobeView.tsx",
                                                    lineNumber: 324,
                                                    columnNumber: 48
                                                }, this)),
                                            searchIntent.season.map((s)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "rounded border border-white/20 bg-white/10 px-1 py-0.5",
                                                    children: [
                                                        "❄️ ",
                                                        s
                                                    ]
                                                }, s, true, {
                                                    fileName: "[project]/app/views/MyWardrobeView.tsx",
                                                    lineNumber: 325,
                                                    columnNumber: 48
                                                }, this)),
                                            searchIntent.piece_item.map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "rounded border border-white/20 bg-white/10 px-1 py-0.5",
                                                    children: [
                                                        "👕 ",
                                                        p
                                                    ]
                                                }, p, true, {
                                                    fileName: "[project]/app/views/MyWardrobeView.tsx",
                                                    lineNumber: 326,
                                                    columnNumber: 52
                                                }, this)),
                                            searchIntent.style.map((s)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "rounded border border-white/20 bg-white/10 px-1 py-0.5",
                                                    children: [
                                                        "✨ ",
                                                        s
                                                    ]
                                                }, s, true, {
                                                    fileName: "[project]/app/views/MyWardrobeView.tsx",
                                                    lineNumber: 327,
                                                    columnNumber: 47
                                                }, this)),
                                            searchIntent.brand.map((b)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "rounded border border-white/20 bg-white/10 px-1 py-0.5",
                                                    children: [
                                                        "🏷️ ",
                                                        b
                                                    ]
                                                }, b, true, {
                                                    fileName: "[project]/app/views/MyWardrobeView.tsx",
                                                    lineNumber: 328,
                                                    columnNumber: 47
                                                }, this))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/views/MyWardrobeView.tsx",
                                        lineNumber: 323,
                                        columnNumber: 16
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/views/MyWardrobeView.tsx",
                                lineNumber: 302,
                                columnNumber: 11
                            }, this),
                            activeGroups.map((group)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shared$2f$SectionBlock$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    title: group.title,
                                    subtitle: "Manage list status for each wardrobe item.",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3",
                                            children: [
                                                isInitialLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm text-white/70",
                                                    children: "Loading wardrobe items…"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/views/MyWardrobeView.tsx",
                                                    lineNumber: 336,
                                                    columnNumber: 37
                                                }, this) : null,
                                                group.data.map((item)=>{
                                                    const cardState = mapItemState(item);
                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$wardrobe$2f$WardrobeItemCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                        name: item.name,
                                                        imageUrl: item.image_url,
                                                        imageAssets: item.image_assets,
                                                        brand: item.brand,
                                                        pieceType: item.piece_type,
                                                        state: cardState,
                                                        statusLabel: stateLabel(cardState, item.model_status, item),
                                                        onClick: ()=>setModalItem(item),
                                                        onAvailable: ()=>setAvailability((prev)=>({
                                                                    ...prev,
                                                                    [item.wardrobe_item_id]: 'available'
                                                                })),
                                                        onUnavailable: ()=>setAvailability((prev)=>({
                                                                    ...prev,
                                                                    [item.wardrobe_item_id]: 'unavailable'
                                                                })),
                                                        onToggleFavorite: ()=>setFavorites((prev)=>({
                                                                    ...prev,
                                                                    [item.wardrobe_item_id]: !prev[item.wardrobe_item_id]
                                                                }))
                                                    }, item.wardrobe_item_id, false, {
                                                        fileName: "[project]/app/views/MyWardrobeView.tsx",
                                                        lineNumber: 340,
                                                        columnNumber: 21
                                                    }, this);
                                                }),
                                                !group.data.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm text-white/70",
                                                    children: "No pieces in this list."
                                                }, void 0, false, {
                                                    fileName: "[project]/app/views/MyWardrobeView.tsx",
                                                    lineNumber: 356,
                                                    columnNumber: 39
                                                }, this) : null
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/views/MyWardrobeView.tsx",
                                            lineNumber: 335,
                                            columnNumber: 15
                                        }, this),
                                        group.key === 'available' && hasMore ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-4 flex items-center justify-between",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs text-white/60",
                                                    children: [
                                                        "Page ",
                                                        page + 1,
                                                        " · Cached cursors: ",
                                                        Object.keys(cursorCache).length
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/views/MyWardrobeView.tsx",
                                                    lineNumber: 360,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    onClick: ()=>void loadMore(),
                                                    disabled: isLoadingMore,
                                                    className: "rounded-full border border-white/25 px-3 py-1 text-xs text-white disabled:opacity-60",
                                                    children: isLoadingMore ? 'Loading…' : 'Load more'
                                                }, void 0, false, {
                                                    fileName: "[project]/app/views/MyWardrobeView.tsx",
                                                    lineNumber: 361,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/views/MyWardrobeView.tsx",
                                            lineNumber: 359,
                                            columnNumber: 17
                                        }, this) : null
                                    ]
                                }, group.key, true, {
                                    fileName: "[project]/app/views/MyWardrobeView.tsx",
                                    lineNumber: 334,
                                    columnNumber: 13
                                }, this))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/views/MyWardrobeView.tsx",
                        lineNumber: 299,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/views/MyWardrobeView.tsx",
                lineNumber: 292,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$wardrobe$2f$WardrobeItemViewerModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                open: Boolean(modalItem),
                item: modalItem,
                onClose: ()=>setModalItem(null),
                onOpen3D: ()=>{
                    if (!modalItem) return;
                    setModalItem(null);
                    void handleOpenViewerIntent(modalItem);
                }
            }, void 0, false, {
                fileName: "[project]/app/views/MyWardrobeView.tsx",
                lineNumber: 377,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$wardrobe$2f$ThreeDGenerationProgressModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                open: Boolean(progressItem) && !viewerUrl,
                status: assetJob.status,
                progressPercent: assetJob.progressPercent,
                pollAttempts: assetJob.pollAttempts,
                error: assetJob.error,
                onClose: ()=>{
                    assetJob.cancelPolling();
                    setProgressItem(null);
                },
                onRetry: ()=>{
                    if (!progressItem) return;
                    assetJob.retry();
                }
            }, void 0, false, {
                fileName: "[project]/app/views/MyWardrobeView.tsx",
                lineNumber: 388,
                columnNumber: 7
            }, this),
            viewerItem && viewerUrl ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$wardrobe$2f$ThreeDViewerModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                open: true,
                title: `${viewerItem.name} • 3D Viewer`,
                modelUrl: viewerUrl,
                posterUrl: viewerItem.model_preview_url ?? undefined,
                onClose: ()=>{
                    setViewerItem(null);
                    setViewerUrl(null);
                }
            }, void 0, false, {
                fileName: "[project]/app/views/MyWardrobeView.tsx",
                lineNumber: 405,
                columnNumber: 9
            }, this) : null
        ]
    }, void 0, true);
}
_s(MyWardrobeView, "y4WLHdH/r+CjisCflYQXvaH8vSM=");
_c = MyWardrobeView;
var _c;
__turbopack_context__.k.register(_c, "MyWardrobeView");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/views/SearchItemsView.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SearchItemsView
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shell$2f$PageHeader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/shell/PageHeader.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shared$2f$SectionBlock$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/shared/SectionBlock.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$search$2f$OutfitDetailModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/search/OutfitDetailModal.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$search$2f$SearchOutfitCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/search/SearchOutfitCard.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$search$2f$SearchUserCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/search/SearchUserCard.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shell$2f$DiscoverySearchContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/shell/DiscoverySearchContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$outfit$2d$card$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/outfit-card.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
;
;
const SLOT_PREVIEW_DEFAULTS = {
    upper: {
        pieceType: 'Jacket',
        category: 'Premium',
        wearstyles: [
            'Statement Piece',
            'Visual Anchor'
        ]
    },
    lower: {
        pieceType: 'Pants',
        category: 'Standard',
        wearstyles: [
            'Base Structure',
            'Balanced Fit'
        ]
    },
    shoes: {
        pieceType: 'Footwear',
        category: 'Rare',
        wearstyles: [
            'Trend Driver',
            'Street Energy'
        ]
    },
    accessory: {
        pieceType: 'Accessory',
        category: 'Limited Edition',
        wearstyles: [
            'Style Accent',
            'Attention Grabber'
        ]
    }
};
function SearchItemsView() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const { query, debouncedQuery, setQuery } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shell$2f$DiscoverySearchContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDiscoverySearch"])();
    const [schemes, setSchemes] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [users, setUsers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selectedOutfit, setSelectedOutfit] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SearchItemsView.useEffect": ()=>{
            fetch('/api/schemes/public').then({
                "SearchItemsView.useEffect": (res)=>res.json()
            }["SearchItemsView.useEffect"]).then({
                "SearchItemsView.useEffect": (data)=>setSchemes(Array.isArray(data) ? data : [])
            }["SearchItemsView.useEffect"]).catch({
                "SearchItemsView.useEffect": ()=>setSchemes([])
            }["SearchItemsView.useEffect"]);
            fetch('/api/users/public').then({
                "SearchItemsView.useEffect": (res)=>res.json()
            }["SearchItemsView.useEffect"]).then({
                "SearchItemsView.useEffect": (payload)=>setUsers(Array.isArray(payload?.users) ? payload.users : [])
            }["SearchItemsView.useEffect"]).catch({
                "SearchItemsView.useEffect": ()=>setUsers([])
            }["SearchItemsView.useEffect"]);
        }
    }["SearchItemsView.useEffect"], []);
    const queryNorm = debouncedQuery.trim().toLowerCase();
    const outfitsById = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "SearchItemsView.useMemo[outfitsById]": ()=>{
            const map = {};
            schemes.forEach({
                "SearchItemsView.useMemo[outfitsById]": (scheme)=>{
                    const pieces = (scheme.pieces ?? []).map({
                        "SearchItemsView.useMemo[outfitsById].pieces": (piece)=>({
                                id: piece.id,
                                name: piece.name || 'Selected piece',
                                brand: piece.brand || 'Selection Brand',
                                pieceType: piece.pieceType || SLOT_PREVIEW_DEFAULTS[piece.slot].pieceType,
                                category: piece.category || SLOT_PREVIEW_DEFAULTS[piece.slot].category,
                                wearstyles: piece.wearstyles?.length ? piece.wearstyles : SLOT_PREVIEW_DEFAULTS[piece.slot].wearstyles
                            })
                    }["SearchItemsView.useMemo[outfitsById].pieces"]);
                    const brands = [
                        ...new Set(pieces.map({
                            "SearchItemsView.useMemo[outfitsById].brands": (piece)=>piece.brand
                        }["SearchItemsView.useMemo[outfitsById].brands"]).filter(Boolean))
                    ].slice(0, 4);
                    map[scheme.scheme_id] = {
                        outfitName: scheme.title || 'Untitled Outfit',
                        outfitStyleLine: `${scheme.style || 'Streetwear'} • ${scheme.occasion || 'General'}`,
                        outfitDescription: scheme.description ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$outfit$2d$card$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildOutfitDescriptionRich"])({
                            outfitName: scheme.title,
                            style: scheme.style,
                            occasion: scheme.occasion,
                            pieces
                        }) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$outfit$2d$card$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildOutfitDescriptionFallback"])({
                            pieces,
                            outfitStyleLine: `${scheme.style || 'Streetwear'} ${scheme.occasion || 'General'}`,
                            outfitName: scheme.title || 'Untitled Outfit'
                        }),
                        heroImageUrl: scheme.cover_image_url || '/welcome-newcomers.png',
                        pieces,
                        brands,
                        schemeId: scheme.scheme_id,
                        creatorId: scheme.user_id,
                        metaBadges: [
                            {
                                label: scheme.style || 'Style',
                                icon: '🎯'
                            },
                            {
                                label: scheme.occasion || 'Occasion',
                                icon: '📍'
                            },
                            {
                                label: `${pieces.length} pieces`,
                                icon: '🧩'
                            }
                        ]
                    };
                }
            }["SearchItemsView.useMemo[outfitsById]"]);
            return map;
        }
    }["SearchItemsView.useMemo[outfitsById]"], [
        schemes
    ]);
    const groupedSearch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "SearchItemsView.useMemo[groupedSearch]": ()=>{
            const filteredUsers = users.filter({
                "SearchItemsView.useMemo[groupedSearch].filteredUsers": (user)=>{
                    if (!queryNorm) return true;
                    const blob = `${user.name} ${user.username} ${user.descriptor}`.toLowerCase();
                    return blob.includes(queryNorm);
                }
            }["SearchItemsView.useMemo[groupedSearch].filteredUsers"]);
            const outfits = schemes.filter({
                "SearchItemsView.useMemo[groupedSearch].outfits": (scheme)=>{
                    if (!queryNorm) return true;
                    const card = outfitsById[scheme.scheme_id];
                    const brands = card?.brands?.join(' ') ?? '';
                    const pieceNames = card?.pieces?.map({
                        "SearchItemsView.useMemo[groupedSearch].outfits": (piece)=>`${piece.name} ${piece.pieceType}`
                    }["SearchItemsView.useMemo[groupedSearch].outfits"]).join(' ') ?? '';
                    const blob = `${scheme.title} ${scheme.style} ${scheme.occasion} ${scheme.description ?? ''} ${brands} ${pieceNames}`.toLowerCase();
                    return blob.includes(queryNorm);
                }
            }["SearchItemsView.useMemo[groupedSearch].outfits"]);
            return {
                users: filteredUsers,
                outfits,
                brands: [],
                wardrobeItems: [],
                styles: []
            };
        }
    }["SearchItemsView.useMemo[groupedSearch]"], [
        outfitsById,
        queryNorm,
        schemes,
        users
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shell$2f$PageHeader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                title: "Search",
                subtitle: "Interactive discovery hub for users, outfits, brands, styles, and wardrobe items."
            }, void 0, false, {
                fileName: "[project]/app/views/SearchItemsView.tsx",
                lineNumber: 137,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shared$2f$SectionBlock$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                title: "Global Search",
                subtitle: "Search users, outfits, brands, styles, wearstyles, and wardrobe items.",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                    className: "mt-4 flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-4 py-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            viewBox: "0 0 24 24",
                            className: "h-5 w-5 text-white",
                            fill: "none",
                            stroke: "currentColor",
                            strokeWidth: "1.8",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                    cx: "11",
                                    cy: "11",
                                    r: "6"
                                }, void 0, false, {
                                    fileName: "[project]/app/views/SearchItemsView.tsx",
                                    lineNumber: 142,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    d: "m20 20-4.2-4.2"
                                }, void 0, false, {
                                    fileName: "[project]/app/views/SearchItemsView.tsx",
                                    lineNumber: 143,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/views/SearchItemsView.tsx",
                            lineNumber: 141,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            type: "search",
                            value: query,
                            onChange: (event)=>setQuery(event.target.value),
                            placeholder: "Search outfits, brands, styles, or wardrobe items",
                            className: "w-full bg-transparent text-white placeholder:text-white/60 focus:outline-none"
                        }, void 0, false, {
                            fileName: "[project]/app/views/SearchItemsView.tsx",
                            lineNumber: 145,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/views/SearchItemsView.tsx",
                    lineNumber: 140,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/views/SearchItemsView.tsx",
                lineNumber: 139,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shared$2f$SectionBlock$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                title: `Users (${groupedSearch.users.length})`,
                subtitle: "Profiles matching the search.",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mt-4 grid gap-3 md:grid-cols-2",
                    children: [
                        groupedSearch.users.map((user)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$search$2f$SearchUserCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                name: user.name,
                                username: user.username,
                                descriptor: user.descriptor,
                                avatarUrl: user.avatarUrl,
                                onOpenProfile: ()=>router.push(`/profile/${user.user_id}?section=user-info`)
                            }, user.user_id, false, {
                                fileName: "[project]/app/views/SearchItemsView.tsx",
                                lineNumber: 158,
                                columnNumber: 13
                            }, this)),
                        !groupedSearch.users.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm text-white/70",
                            children: "No users found."
                        }, void 0, false, {
                            fileName: "[project]/app/views/SearchItemsView.tsx",
                            lineNumber: 167,
                            columnNumber: 42
                        }, this) : null
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/views/SearchItemsView.tsx",
                    lineNumber: 156,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/views/SearchItemsView.tsx",
                lineNumber: 155,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shared$2f$SectionBlock$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                title: `Outfits (${groupedSearch.outfits.length})`,
                subtitle: "Public outfits in compact Saved Outfit Cards card mode.",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3",
                    children: [
                        groupedSearch.outfits.map((scheme)=>{
                            const cardData = outfitsById[scheme.scheme_id];
                            if (!cardData) return null;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$search$2f$SearchOutfitCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                data: cardData,
                                onOpenDetail: ()=>setSelectedOutfit(cardData)
                            }, scheme.scheme_id, false, {
                                fileName: "[project]/app/views/SearchItemsView.tsx",
                                lineNumber: 177,
                                columnNumber: 20
                            }, this);
                        }),
                        !groupedSearch.outfits.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm text-white/70",
                            children: "No outfits found."
                        }, void 0, false, {
                            fileName: "[project]/app/views/SearchItemsView.tsx",
                            lineNumber: 179,
                            columnNumber: 44
                        }, this) : null
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/views/SearchItemsView.tsx",
                    lineNumber: 172,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/views/SearchItemsView.tsx",
                lineNumber: 171,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shared$2f$SectionBlock$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                title: "Expandable Discovery Groups",
                subtitle: "Structured results model is ready for Brands, Wardrobe Items, and Styles.",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mt-3 flex flex-wrap gap-2 text-xs text-white/75",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "rounded-full border border-white/25 px-2 py-1",
                            children: [
                                "Brands: ",
                                groupedSearch.brands.length
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/views/SearchItemsView.tsx",
                            lineNumber: 185,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "rounded-full border border-white/25 px-2 py-1",
                            children: [
                                "Wardrobe Items: ",
                                groupedSearch.wardrobeItems.length
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/views/SearchItemsView.tsx",
                            lineNumber: 186,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "rounded-full border border-white/25 px-2 py-1",
                            children: [
                                "Styles: ",
                                groupedSearch.styles.length
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/views/SearchItemsView.tsx",
                            lineNumber: 187,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/views/SearchItemsView.tsx",
                    lineNumber: 184,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/views/SearchItemsView.tsx",
                lineNumber: 183,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$search$2f$OutfitDetailModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                open: Boolean(selectedOutfit),
                data: selectedOutfit,
                onClose: ()=>setSelectedOutfit(null)
            }, void 0, false, {
                fileName: "[project]/app/views/SearchItemsView.tsx",
                lineNumber: 191,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/views/SearchItemsView.tsx",
        lineNumber: 136,
        columnNumber: 5
    }, this);
}
_s(SearchItemsView, "MMD0uWfot5yvNdqrzvzEQ+keKQU=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shell$2f$DiscoverySearchContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDiscoverySearch"]
    ];
});
_c = SearchItemsView;
var _c;
__turbopack_context__.k.register(_c, "SearchItemsView");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/views/DressTesterView.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DressTesterView
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shell$2f$PageHeader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/shell/PageHeader.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shared$2f$SectionBlock$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/shared/SectionBlock.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$tester2d$2f$Tester2DControls$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/tester2d/Tester2DControls.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$tester2d$2f$Tester2DMannequinSelector$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/tester2d/Tester2DMannequinSelector.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$tester2d$2f$Tester2DStage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/tester2d/Tester2DStage.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$tester2d$2f$Tester2DWardrobePanel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/tester2d/Tester2DWardrobePanel.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$fashion$2d$ai$2f$services$2f$Tester2DRenderService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/fashion-ai/services/Tester2DRenderService.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$fashion$2d$ai$2f$utils$2f$garment$2d$compatibility$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/fashion-ai/utils/garment-compatibility.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$devSession$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/devSession.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$dress$2d$tester$2f$AdminAssetStudio$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/dress-tester/AdminAssetStudio.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
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
const renderService = new __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$fashion$2d$ai$2f$services$2f$Tester2DRenderService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Tester2DRenderService"]();
function DressTesterView() {
    _s();
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [message, setMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [pieces, setPieces] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [mannequins, setMannequins] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selectedMannequin, setSelectedMannequin] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('female_v1');
    const [equipped, setEquipped] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [zoom, setZoom] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(1);
    const [showDebug, setShowDebug] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [selectedCategory, setSelectedCategory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [backfillRunning, setBackfillRunning] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [backfillSummary, setBackfillSummary] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [hasDevSession] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "DressTesterView.useState": ()=>Boolean((0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$devSession$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDevSessionToken"])())
    }["DressTesterView.useState"]);
    const [aiInstructions, setAiInstructions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const isDevToolsEnabled = ("TURBOPACK compile-time value", "development") !== 'production' || hasDevSession;
    const mannequin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "DressTesterView.useMemo[mannequin]": ()=>mannequins.find({
                "DressTesterView.useMemo[mannequin]": (item)=>item.id === selectedMannequin
            }["DressTesterView.useMemo[mannequin]"]) ?? mannequins[0]
    }["DressTesterView.useMemo[mannequin]"], [
        mannequins,
        selectedMannequin
    ]);
    const refreshData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "DressTesterView.useCallback[refreshData]": async ()=>{
            setLoading(true);
            console.debug('[dress-tester] bootstrap fetch:start');
            const response = await fetch('/api/dress-tester/bootstrap');
            const payload = await response.json();
            console.debug('[dress-tester] bootstrap fetch:done', {
                status: response.status,
                mannequins: payload.mannequins?.length ?? 0,
                pieces: payload.pieces?.length ?? 0
            });
            setMannequins(payload.mannequins ?? []);
            setPieces((payload.pieces ?? []).map({
                "DressTesterView.useCallback[refreshData]": (piece)=>{
                    const fitProfile = piece.fitProfile ?? null;
                    const labelReason = !fitProfile ? 'fitProfile_missing' : fitProfile.preparationStatus === 'pending' ? 'fitProfile_pending' : fitProfile.preparationStatus === 'processing' ? 'fitProfile_processing' : fitProfile.preparationStatus === 'ready' ? 'fitProfile_ready' : fitProfile.preparationStatus;
                    console.debug('[dress-tester] item mapping', {
                        pieceId: piece.pieceId,
                        name: piece.name,
                        hasFitProfile: Boolean(fitProfile),
                        fitProfileStatus: fitProfile?.preparationStatus ?? 'missing',
                        targetGender: fitProfile?.targetGender ?? 'fallback-unisex',
                        labelReason
                    });
                    return {
                        pieceId: piece.pieceId,
                        name: piece.name,
                        imageUrl: piece.imageUrl,
                        fitProfile
                    };
                }
            }["DressTesterView.useCallback[refreshData]"]));
            setLoading(false);
        }
    }["DressTesterView.useCallback[refreshData]"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DressTesterView.useEffect": ()=>{
            const timer = window.setTimeout({
                "DressTesterView.useEffect.timer": ()=>{
                    void refreshData().catch({
                        "DressTesterView.useEffect.timer": ()=>{
                            setMessage('Could not load wardrobe assets for Tester 2D.');
                            setLoading(false);
                        }
                    }["DressTesterView.useEffect.timer"]);
                }
            }["DressTesterView.useEffect.timer"], 0);
            return ({
                "DressTesterView.useEffect": ()=>window.clearTimeout(timer)
            })["DressTesterView.useEffect"];
        }
    }["DressTesterView.useEffect"], [
        refreshData
    ]);
    const layers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "DressTesterView.useMemo[layers]": ()=>{
            if (!mannequin) return [];
            return renderService.composeLayers({
                mannequin,
                appliedPieces: Object.values(equipped)
            });
        }
    }["DressTesterView.useMemo[layers]"], [
        mannequin,
        equipped
    ]);
    const PREVIEW_BBOX = {
        top: {
            x: 0.10,
            y: 0.08,
            w: 0.80,
            h: 0.84
        },
        bottom: {
            x: 0.12,
            y: 0.06,
            w: 0.76,
            h: 0.88
        },
        shoes: {
            x: 0.10,
            y: 0.10,
            w: 0.80,
            h: 0.80
        },
        full_body: {
            x: 0.10,
            y: 0.04,
            w: 0.80,
            h: 0.92
        },
        accessory: {
            x: 0.15,
            y: 0.12,
            w: 0.70,
            h: 0.76
        }
    };
    const applyPiece = async (piece)=>{
        if (!mannequin) return;
        const rawFitProfile = piece.fitProfile;
        let effectiveFitProfile;
        const isFullyCompatible = rawFitProfile?.preparationStatus === 'ready' && Boolean(rawFitProfile.preparedAssetUrl) && (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$fashion$2d$ai$2f$utils$2f$garment$2d$compatibility$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isPieceCompatibleWithMannequin"])(rawFitProfile, mannequin.id, mannequin);
        if (isFullyCompatible && rawFitProfile) {
            effectiveFitProfile = rawFitProfile;
        } else if (piece.imageUrl) {
            const pieceType = rawFitProfile?.pieceType ?? 'top';
            effectiveFitProfile = {
                pieceType,
                targetGender: 'unisex',
                preparationStatus: 'ready',
                originalImageUrl: piece.imageUrl,
                preparedAssetUrl: piece.imageUrl,
                preparedMaskUrl: null,
                compatibleMannequins: [
                    'male_v1',
                    'female_v1'
                ],
                fitMode: 'overlay',
                normalizedBBox: PREVIEW_BBOX[pieceType],
                garmentAnchors: null,
                validationWarnings: [
                    'preview_mode'
                ],
                preparationError: null,
                preparedAt: null,
                updatedAt: new Date().toISOString()
            };
            setMessage('Preview mode: showing approximate fit. Run "Process Missing Pieces" for precision.');
        } else {
            setMessage('This piece has no image available.');
            return;
        }
        setSelectedCategory(effectiveFitProfile.pieceType);
        if (!effectiveFitProfile.validationWarnings?.includes('preview_mode')) setMessage(null);
        setEquipped((prev)=>({
                ...prev,
                [effectiveFitProfile.pieceType]: effectiveFitProfile
            }));
        if (!aiInstructions[piece.pieceId]) {
            fetch('/api/ai/fashion/tester-fit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    pieceName: piece.name,
                    category: effectiveFitProfile.pieceType,
                    bodyRegion: effectiveFitProfile.pieceType
                })
            }).then((res)=>res.json()).then((payload)=>{
                if (payload.ok && payload.data) {
                    setAiInstructions((prev)=>({
                            ...prev,
                            [piece.pieceId]: payload.data
                        }));
                }
            }).catch((err)=>console.error('AI Fit Error', err));
        }
    };
    const processMissingPieces = async ()=>{
        setBackfillRunning(true);
        setBackfillSummary(null);
        console.info('[dress-tester] process-missing:start');
        const response = await fetch('/api/wardrobe/process-missing', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                limit: 50,
                dryRun: false,
                onlyMissing: false
            })
        });
        const payload = await response.json().catch(()=>null);
        console.info('[dress-tester] process-missing:done', {
            status: response.status,
            payload
        });
        setBackfillRunning(false);
        if (!response.ok || !payload?.ok) {
            setBackfillSummary('Process Missing Pieces failed. Check console logs for details.');
            return;
        }
        setBackfillSummary(`Processed ${payload.processed} · failed ${payload.failed} · matched ${payload.matched}.`);
        await refreshData();
    };
    if (loading) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "p-6 text-sm uppercase tracking-[0.2em] text-white/70",
        children: "Loading Tester 2D..."
    }, void 0, false, {
        fileName: "[project]/app/views/DressTesterView.tsx",
        lineNumber: 197,
        columnNumber: 23
    }, this);
    if (!mannequin) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "p-6 text-sm text-white/70",
        children: "No mannequin profiles found."
    }, void 0, false, {
        fileName: "[project]/app/views/DressTesterView.tsx",
        lineNumber: 198,
        columnNumber: 26
    }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shell$2f$PageHeader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                title: "Tester 2D",
                subtitle: "Production-oriented mannequin composition with prepared garment assets"
            }, void 0, false, {
                fileName: "[project]/app/views/DressTesterView.tsx",
                lineNumber: 202,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shared$2f$SectionBlock$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                title: "Controls",
                subtitle: "Select mannequin, adjust stage, and reset safely when switching avatars",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$tester2d$2f$Tester2DMannequinSelector$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            mannequins: mannequins,
                            selectedId: selectedMannequin,
                            onChange: (id)=>{
                                setSelectedMannequin(id);
                                setEquipped({});
                                setMessage('Outfit reset after mannequin switch (safe MVP behavior).');
                            }
                        }, void 0, false, {
                            fileName: "[project]/app/views/DressTesterView.tsx",
                            lineNumber: 206,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$tester2d$2f$Tester2DControls$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            zoom: zoom,
                            onZoomIn: ()=>setZoom((prev)=>Math.min(1.2, prev + 0.04)),
                            onZoomOut: ()=>setZoom((prev)=>Math.max(0.86, prev - 0.04)),
                            onReset: ()=>{
                                setEquipped({});
                                setZoom(1);
                            },
                            showDebug: showDebug,
                            onToggleDebug: ()=>setShowDebug((prev)=>!prev)
                        }, void 0, false, {
                            fileName: "[project]/app/views/DressTesterView.tsx",
                            lineNumber: 215,
                            columnNumber: 11
                        }, this),
                        ("TURBOPACK compile-time truthy", 1) ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-wrap gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    className: "rounded-lg border border-amber-300/60 bg-amber-400/20 px-3 py-2 text-xs font-semibold text-amber-50 disabled:opacity-60",
                                    onClick: ()=>void processMissingPieces(),
                                    disabled: backfillRunning,
                                    children: backfillRunning ? 'Processing Missing Pieces...' : 'Process Missing Pieces'
                                }, void 0, false, {
                                    fileName: "[project]/app/views/DressTesterView.tsx",
                                    lineNumber: 228,
                                    columnNumber: 15
                                }, this),
                                backfillSummary ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs text-amber-100",
                                    children: backfillSummary
                                }, void 0, false, {
                                    fileName: "[project]/app/views/DressTesterView.tsx",
                                    lineNumber: 236,
                                    columnNumber: 34
                                }, this) : null
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/views/DressTesterView.tsx",
                            lineNumber: 227,
                            columnNumber: 13
                        }, this) : "TURBOPACK unreachable",
                        message ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-xs text-white/70",
                            children: message
                        }, void 0, false, {
                            fileName: "[project]/app/views/DressTesterView.tsx",
                            lineNumber: 239,
                            columnNumber: 22
                        }, this) : null
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/views/DressTesterView.tsx",
                    lineNumber: 205,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/views/DressTesterView.tsx",
                lineNumber: 204,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shared$2f$SectionBlock$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                title: "AI Fit Instructions",
                subtitle: "AI-generated suggestions for placement and fit",
                children: [
                    Object.entries(equipped).map(([slot, profile])=>{
                        if (!profile) return null;
                        const pieceId = pieces.find((p)=>p.fitProfile === profile)?.pieceId;
                        const instructions = pieceId ? aiInstructions[pieceId] : null;
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-2 text-sm text-white/80 bg-white/10 p-3 rounded-lg border border-white/20",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "font-bold text-white mb-2 uppercase tracking-wide text-[11px]",
                                    children: [
                                        slot,
                                        " SLOT"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/views/DressTesterView.tsx",
                                    lineNumber: 251,
                                    columnNumber: 15
                                }, this),
                                instructions ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                    className: "list-disc pl-4 space-y-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-semibold text-fuchsia-300",
                                                    children: "Target Region:"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/views/DressTesterView.tsx",
                                                    lineNumber: 254,
                                                    columnNumber: 23
                                                }, this),
                                                " ",
                                                instructions.targetBodyRegion
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/views/DressTesterView.tsx",
                                            lineNumber: 254,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-semibold text-fuchsia-300",
                                                    children: "Suggested Layer:"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/views/DressTesterView.tsx",
                                                    lineNumber: 255,
                                                    columnNumber: 23
                                                }, this),
                                                " ",
                                                instructions.suggestedLayer
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/views/DressTesterView.tsx",
                                            lineNumber: 255,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-semibold text-fuchsia-300",
                                                    children: "Fit Type:"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/views/DressTesterView.tsx",
                                                    lineNumber: 256,
                                                    columnNumber: 23
                                                }, this),
                                                " ",
                                                instructions.fitType
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/views/DressTesterView.tsx",
                                            lineNumber: 256,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-semibold text-fuchsia-300",
                                                    children: "Alignment:"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/views/DressTesterView.tsx",
                                                    lineNumber: 257,
                                                    columnNumber: 23
                                                }, this),
                                                " ",
                                                instructions.alignmentHint
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/views/DressTesterView.tsx",
                                            lineNumber: 257,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-semibold text-fuchsia-300",
                                                    children: "Scale:"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/views/DressTesterView.tsx",
                                                    lineNumber: 258,
                                                    columnNumber: 23
                                                }, this),
                                                " ",
                                                instructions.scaleHint
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/views/DressTesterView.tsx",
                                            lineNumber: 258,
                                            columnNumber: 19
                                        }, this),
                                        instructions.warnings && instructions.warnings.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            className: "text-amber-400",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-semibold",
                                                    children: "Warnings:"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/views/DressTesterView.tsx",
                                                    lineNumber: 261,
                                                    columnNumber: 23
                                                }, this),
                                                " ",
                                                instructions.warnings.join(', ')
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/views/DressTesterView.tsx",
                                            lineNumber: 260,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/views/DressTesterView.tsx",
                                    lineNumber: 253,
                                    columnNumber: 17
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-white/50 italic text-xs",
                                    children: "Generating AI Fit instructions..."
                                }, void 0, false, {
                                    fileName: "[project]/app/views/DressTesterView.tsx",
                                    lineNumber: 266,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, slot, true, {
                            fileName: "[project]/app/views/DressTesterView.tsx",
                            lineNumber: 250,
                            columnNumber: 13
                        }, this);
                    }),
                    Object.values(equipped).length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-white/50 text-xs",
                        children: "Equip a piece to see AI fit instructions."
                    }, void 0, false, {
                        fileName: "[project]/app/views/DressTesterView.tsx",
                        lineNumber: 272,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/views/DressTesterView.tsx",
                lineNumber: 243,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid gap-4 xl:grid-cols-[minmax(0,1fr)_380px]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shared$2f$SectionBlock$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        title: "Editing Stage",
                        subtitle: "Stable, centered, geometry-aware fitting stage",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$tester2d$2f$Tester2DStage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            mannequin: mannequin,
                            layers: layers,
                            zoom: zoom,
                            showDebug: showDebug,
                            selectedSlot: selectedCategory
                        }, void 0, false, {
                            fileName: "[project]/app/views/DressTesterView.tsx",
                            lineNumber: 278,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/views/DressTesterView.tsx",
                        lineNumber: 277,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shared$2f$SectionBlock$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        title: "Wardrobe 2D Library",
                        subtitle: "Prepared pipeline status and mannequin-compatible fitting",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$tester2d$2f$Tester2DWardrobePanel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            items: pieces,
                            onApply: applyPiece
                        }, void 0, false, {
                            fileName: "[project]/app/views/DressTesterView.tsx",
                            lineNumber: 282,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/views/DressTesterView.tsx",
                        lineNumber: 281,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/views/DressTesterView.tsx",
                lineNumber: 276,
                columnNumber: 7
            }, this),
            ("TURBOPACK compile-time truthy", 1) ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shared$2f$SectionBlock$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                title: "Admin Asset Studio",
                subtitle: "Create mannequins, upload piece metadata, and calibrate torso quads",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$dress$2d$tester$2f$AdminAssetStudio$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    onCreated: refreshData,
                    wardrobeItems: pieces.map((p)=>({
                            pieceId: p.pieceId,
                            name: p.name,
                            imageUrl: p.imageUrl
                        }))
                }, void 0, false, {
                    fileName: "[project]/app/views/DressTesterView.tsx",
                    lineNumber: 288,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/views/DressTesterView.tsx",
                lineNumber: 287,
                columnNumber: 9
            }, this) : "TURBOPACK unreachable"
        ]
    }, void 0, true, {
        fileName: "[project]/app/views/DressTesterView.tsx",
        lineNumber: 201,
        columnNumber: 5
    }, this);
}
_s(DressTesterView, "KE6jtjwjfn/lbP9oLDlwIzrjWM0=");
_c = DressTesterView;
var _c;
__turbopack_context__.k.register(_c, "DressTesterView");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/views/SearchPiecesView.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SearchPiecesView
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shell$2f$PageHeader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/shell/PageHeader.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shared$2f$SectionBlock$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/shared/SectionBlock.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$pieces$2f$PieceSearchInput$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/pieces/PieceSearchInput.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$pieces$2f$PieceFilterBar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/pieces/PieceFilterBar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$pieces$2f$PieceDiscoveryCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/pieces/PieceDiscoveryCard.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$pieces$2f$PieceDetailModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/pieces/PieceDetailModal.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
function SearchPiecesView() {
    _s();
    const [pieces, setPieces] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [query, setQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [pieceType, setPieceType] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [brand, setBrand] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [rarity, setRarity] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [selectedPiece, setSelectedPiece] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SearchPiecesView.useEffect": ()=>{
            const params = new URLSearchParams();
            if (query.trim()) params.set('query', query.trim());
            if (pieceType) params.set('piece_type', pieceType);
            if (brand.trim()) params.set('brand', brand.trim());
            if (rarity) params.set('rarity', rarity);
            fetch(`/api/wardrobe-items?${params.toString()}`).then({
                "SearchPiecesView.useEffect": (response)=>response.json()
            }["SearchPiecesView.useEffect"]).then({
                "SearchPiecesView.useEffect": (data)=>setPieces(Array.isArray(data) ? data : [])
            }["SearchPiecesView.useEffect"]).catch({
                "SearchPiecesView.useEffect": ()=>setPieces([])
            }["SearchPiecesView.useEffect"]);
        }
    }["SearchPiecesView.useEffect"], [
        query,
        pieceType,
        brand,
        rarity
    ]);
    const trendingPieces = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "SearchPiecesView.useMemo[trendingPieces]": ()=>pieces.slice(0, 4)
    }["SearchPiecesView.useMemo[trendingPieces]"], [
        pieces
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shell$2f$PageHeader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                title: "Search Pieces",
                subtitle: "Global discovery feed of public wardrobe pieces from creators across the platform."
            }, void 0, false, {
                fileName: "[project]/app/views/SearchPiecesView.tsx",
                lineNumber: 36,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shared$2f$SectionBlock$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                title: "Discover Pieces",
                subtitle: "Search, filter, and open premium details with 3D preview when available.",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mt-4 space-y-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$pieces$2f$PieceSearchInput$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            value: query,
                            onChange: setQuery
                        }, void 0, false, {
                            fileName: "[project]/app/views/SearchPiecesView.tsx",
                            lineNumber: 40,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$pieces$2f$PieceFilterBar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            pieceType: pieceType,
                            brand: brand,
                            rarity: rarity,
                            onPieceTypeChange: setPieceType,
                            onBrandChange: setBrand,
                            onRarityChange: setRarity
                        }, void 0, false, {
                            fileName: "[project]/app/views/SearchPiecesView.tsx",
                            lineNumber: 41,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-xs text-white/70",
                            children: [
                                pieces.length,
                                " discoverable pieces found."
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/views/SearchPiecesView.tsx",
                            lineNumber: 49,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/views/SearchPiecesView.tsx",
                    lineNumber: 39,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/views/SearchPiecesView.tsx",
                lineNumber: 38,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shared$2f$SectionBlock$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                title: "Trending Pieces",
                subtitle: "Quick visual picks from the live global feed.",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4",
                    children: [
                        trendingPieces.map((piece)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$pieces$2f$PieceDiscoveryCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                piece: piece,
                                onOpen: setSelectedPiece
                            }, `trend-${piece.wardrobe_item_id}`, false, {
                                fileName: "[project]/app/views/SearchPiecesView.tsx",
                                lineNumber: 56,
                                columnNumber: 13
                            }, this)),
                        !trendingPieces.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm text-white/70",
                            children: "No trending pieces yet."
                        }, void 0, false, {
                            fileName: "[project]/app/views/SearchPiecesView.tsx",
                            lineNumber: 58,
                            columnNumber: 37
                        }, this) : null
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/views/SearchPiecesView.tsx",
                    lineNumber: 54,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/views/SearchPiecesView.tsx",
                lineNumber: 53,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shared$2f$SectionBlock$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                title: "All Discoverable Pieces",
                subtitle: "Premium fashion-tech feed with creator context and quick 3D access.",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3",
                    children: [
                        pieces.map((piece)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$pieces$2f$PieceDiscoveryCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                piece: piece,
                                onOpen: setSelectedPiece
                            }, piece.wardrobe_item_id, false, {
                                fileName: "[project]/app/views/SearchPiecesView.tsx",
                                lineNumber: 65,
                                columnNumber: 13
                            }, this)),
                        !pieces.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm text-white/70",
                            children: "No pieces matched your current filters."
                        }, void 0, false, {
                            fileName: "[project]/app/views/SearchPiecesView.tsx",
                            lineNumber: 67,
                            columnNumber: 29
                        }, this) : null
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/views/SearchPiecesView.tsx",
                    lineNumber: 63,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/views/SearchPiecesView.tsx",
                lineNumber: 62,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$pieces$2f$PieceDetailModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                open: Boolean(selectedPiece),
                piece: selectedPiece,
                onClose: ()=>setSelectedPiece(null)
            }, void 0, false, {
                fileName: "[project]/app/views/SearchPiecesView.tsx",
                lineNumber: 71,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/views/SearchPiecesView.tsx",
        lineNumber: 35,
        columnNumber: 5
    }, this);
}
_s(SearchPiecesView, "U+bqXcLj/KunrsfuFB8mGn6LeRM=");
_c = SearchPiecesView;
var _c;
__turbopack_context__.k.register(_c, "SearchPiecesView");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/views/AddWardrobeItemView.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AddWardrobeItemView
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shell$2f$PageHeader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/shell/PageHeader.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shared$2f$SectionBlock$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/shared/SectionBlock.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shared$2f$SaiModalAlert$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/shared/SaiModalAlert.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ui$2f$fancy$2d$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/ui/fancy-select.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$authSession$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/authSession.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$clientSession$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/clientSession.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$blenderWorkerClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/services/blenderWorkerClient.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
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
const FALLBACK_BRANDS = [
    {
        brand_id: 'lacoste',
        name: 'Lacoste',
        logo_url: '/lacoste.jpg'
    }
];
const BRAND_LOGO_FALLBACKS = {
    adidas: '/adidas.png',
    nike: '/nike.png',
    zara: '/zara.jpg',
    puma: '/puma.jpg',
    lacoste: '/lacoste.jpg',
    levis: '/levis.jpg',
    'c&a': '/cea.jpg',
    cea: '/cea.jpg'
};
const COLOR_OPTIONS = [
    'Blue',
    'Red',
    'Green',
    'Yellow',
    'Black',
    'White',
    'Gray',
    'Brown',
    'Beige',
    'Purple'
];
const MATERIAL_OPTIONS = [
    'Leather',
    'Cotton',
    'Denim',
    'Wool',
    'Linen',
    'Polyester',
    'Silk',
    'Nylon'
];
const STYLE_TAG_OPTIONS = [
    'Urban',
    'day',
    'night',
    'outdoors'
];
const OCCASION_TAG_OPTIONS = [
    'Party',
    'Formal',
    'Casual',
    'Work'
];
const GENDER_OPTIONS = [
    {
        value: 'masculino',
        label: 'Masculino'
    },
    {
        value: 'feminino',
        label: 'Feminino'
    }
];
function resolveBrandLogoUrl(brand) {
    if (brand.logo_url?.trim()) {
        return brand.logo_url;
    }
    const normalizedName = brand.name.trim().toLowerCase();
    const compactName = normalizedName.replace(/[^a-z0-9&]/g, '');
    const normalizedId = brand.brand_id.trim().toLowerCase().replace(/^brand_/, '');
    return BRAND_LOGO_FALLBACKS[normalizedName] ?? BRAND_LOGO_FALLBACKS[compactName] ?? BRAND_LOGO_FALLBACKS[normalizedId] ?? null;
}
function AddWardrobeItemView({ mode = 'page', onPieceCreated }) {
    _s();
    const [brands, setBrands] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [markets, setMarkets] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [alertMessage, setAlertMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [userId, setUserId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [submitting, setSubmitting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [uvJobId, setUvJobId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [uvJobStatus, setUvJobStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [selectedImageName, setSelectedImageName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [imagePreview, setImagePreview] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [uploadingImage, setUploadingImage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [submitProgress, setSubmitProgress] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [selectedFile, setSelectedFile] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isAnalyzing, setIsAnalyzing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [form, setForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        name: '',
        image_url: '',
        gender: 'masculino',
        piece_type: 'upper_piece',
        color: '',
        material: '',
        style_tags: '',
        occasion_tags: '',
        market_id: '',
        brand_id: DEFAULT_BRAND_ID
    });
    const inputClassName = 'w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.12)] backdrop-blur-md transition focus:border-violet-400/70 focus:outline-none focus:ring-2 focus:ring-violet-500/40';
    const fileInputClassName = 'w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm text-white shadow-[0_8px_30px_rgba(0,0,0,0.12)] backdrop-blur-md file:mr-3 file:rounded-lg file:border-0 file:bg-gradient-to-r file:from-violet-600 file:to-fuchsia-600 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white hover:file:brightness-110';
    const fileWrapperClassName = 'flex items-center rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-white shadow-[0_8px_30px_rgba(0,0,0,0.12)] backdrop-blur-md';
    const infoBoxClassName = 'w-full rounded-xl border border-white/20 bg-white/10 px-3 py-3 text-sm text-white/90 shadow-[0_8px_30px_rgba(0,0,0,0.12)] backdrop-blur-md';
    const submitButtonClassName = 'w-full rounded-xl border border-white/20 bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(139,92,246,0.35)] transition hover:scale-[1.01] hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60';
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AddWardrobeItemView.useEffect": ()=>{
            const loadDependencies = {
                "AddWardrobeItemView.useEffect.loadDependencies": async ()=>{
                    const localProfile = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$authSession$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAuthSessionProfile"])();
                    let resolvedUserId = localProfile.user_id?.trim() || '';
                    if (!resolvedUserId) {
                        const serverProfile = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$clientSession$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getServerSession"])();
                        resolvedUserId = serverProfile?.user_id?.trim() || '';
                    }
                    if (!resolvedUserId) {
                        setAlertMessage('User session not found. Please sign in again.');
                        return;
                    }
                    setUserId(resolvedUserId);
                    const [brandsResponse, marketsResponse] = await Promise.all([
                        fetch('/api/brands'),
                        fetch('/api/markets')
                    ]);
                    const brandsData = await brandsResponse.json().catch({
                        "AddWardrobeItemView.useEffect.loadDependencies": ()=>[]
                    }["AddWardrobeItemView.useEffect.loadDependencies"]);
                    const marketsData = await marketsResponse.json().catch({
                        "AddWardrobeItemView.useEffect.loadDependencies": ()=>[]
                    }["AddWardrobeItemView.useEffect.loadDependencies"]);
                    const apiBrands = Array.isArray(brandsData) ? brandsData : [];
                    const mergedBrands = [
                        ...FALLBACK_BRANDS.filter({
                            "AddWardrobeItemView.useEffect.loadDependencies": (fallback)=>!apiBrands.some({
                                    "AddWardrobeItemView.useEffect.loadDependencies": (brand)=>brand.brand_id === fallback.brand_id
                                }["AddWardrobeItemView.useEffect.loadDependencies"])
                        }["AddWardrobeItemView.useEffect.loadDependencies"]),
                        ...apiBrands
                    ];
                    setBrands(mergedBrands);
                    setMarkets(Array.isArray(marketsData) ? marketsData : []);
                    setForm({
                        "AddWardrobeItemView.useEffect.loadDependencies": (prev)=>({
                                ...prev,
                                market_id: Array.isArray(marketsData) && marketsData[0]?.market_id ? marketsData[0].market_id : ''
                            })
                    }["AddWardrobeItemView.useEffect.loadDependencies"]);
                }
            }["AddWardrobeItemView.useEffect.loadDependencies"];
            loadDependencies().catch({
                "AddWardrobeItemView.useEffect": ()=>setAlertMessage('Unable to load form data. Please try again.')
            }["AddWardrobeItemView.useEffect"]);
        }
    }["AddWardrobeItemView.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AddWardrobeItemView.useEffect": ()=>{
            return ({
                "AddWardrobeItemView.useEffect": ()=>{
                    if (imagePreview.startsWith('blob:')) {
                        URL.revokeObjectURL(imagePreview);
                    }
                }
            })["AddWardrobeItemView.useEffect"];
        }
    }["AddWardrobeItemView.useEffect"], [
        imagePreview
    ]);
    const marketLabel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "AddWardrobeItemView.useMemo[marketLabel]": ()=>new Map(markets.map({
                "AddWardrobeItemView.useMemo[marketLabel]": (market)=>[
                        market.market_id,
                        `${market.season} • ${market.gender}`
                    ]
            }["AddWardrobeItemView.useMemo[marketLabel]"]))
    }["AddWardrobeItemView.useMemo[marketLabel]"], [
        markets
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AddWardrobeItemView.useEffect": ()=>{
            if (!submitting) {
                setSubmitProgress(0);
                return;
            }
            setSubmitProgress(12);
            const progressTimer = window.setInterval({
                "AddWardrobeItemView.useEffect.progressTimer": ()=>{
                    setSubmitProgress({
                        "AddWardrobeItemView.useEffect.progressTimer": (current)=>{
                            if (current >= 90) return current;
                            return Math.min(90, current + Math.ceil((100 - current) * 0.12));
                        }
                    }["AddWardrobeItemView.useEffect.progressTimer"]);
                }
            }["AddWardrobeItemView.useEffect.progressTimer"], 180);
            return ({
                "AddWardrobeItemView.useEffect": ()=>window.clearInterval(progressTimer)
            })["AddWardrobeItemView.useEffect"];
        }
    }["AddWardrobeItemView.useEffect"], [
        submitting
    ]);
    const handleSubmit = async (event)=>{
        event.preventDefault();
        if (!userId || !form.market_id || !form.name.trim() || !form.image_url.trim()) {
            setAlertMessage('Please fill name, image file and market before saving.');
            return;
        }
        setSubmitting(true);
        try {
            let workerSubmitError = null;
            let localFitPreparationStatus = null;
            console.debug('[add-piece] create start', {
                name: form.name,
                piece_type: form.piece_type,
                gender: form.gender,
                hasImageUrl: Boolean(form.image_url)
            });
            const response = await fetch('/api/add-piece', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_id: userId,
                    ...form,
                    brand_id: form.brand_id || DEFAULT_BRAND_ID,
                    style_tags: form.style_tags.split(',').map((tag)=>tag.trim()).filter(Boolean),
                    occasion_tags: form.occasion_tags.split(',').map((tag)=>tag.trim()).filter(Boolean)
                })
            });
            if (!response.ok) {
                const payload = await response.json().catch(()=>null);
                setAlertMessage(payload?.error || 'Could not add the wardrobe piece.');
                return;
            }
            const createdPiece = await response.json().catch(()=>null);
            const createdWardrobeItemId = createdPiece?.wardrobe_item_id?.trim();
            console.debug('[add-piece] create success', {
                createdWardrobeItemId
            });
            if (createdWardrobeItemId) {
                console.debug('[add-piece] process-piece call', {
                    pieceId: createdWardrobeItemId
                });
                const processResponse = await fetch('/api/wardrobe/process-piece', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        pieceId: createdWardrobeItemId
                    })
                });
                const processPayload = await processResponse.json().catch(()=>null);
                console.debug('[add-piece] process-piece response', {
                    pieceId: createdWardrobeItemId,
                    status: processResponse.status,
                    body: processPayload
                });
                if (!processResponse.ok) {
                    setAlertMessage(`Piece created, but 2D processing failed (${processPayload?.error ?? 'unknown_error'}).`);
                }
                localFitPreparationStatus = processPayload?.preparationStatus ?? 'failed';
            }
            if (createdWardrobeItemId && form.piece_type === 'upper_piece') {
                try {
                    const submitPayload = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$blenderWorkerClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildBlenderWorkerSubmitPayload"])({
                        wardrobe_item_id: createdWardrobeItemId,
                        name: form.name,
                        piece_type: form.piece_type,
                        image_url: form.image_url
                    });
                    console.log('[3d-worker] submit:start', {
                        pieceId: createdWardrobeItemId,
                        pieceName: form.name,
                        imageUrl: submitPayload.imageUrl,
                        payload: submitPayload
                    });
                    const submitResponse = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$blenderWorkerClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["submitBlenderWorkerJob"])(submitPayload);
                    const cloudJobId = String(submitResponse.jobId ?? submitResponse.job_id ?? submitResponse.id ?? '').trim();
                    console.log('[3d-worker] submit:done', {
                        pieceId: createdWardrobeItemId,
                        pieceName: form.name,
                        jobId: cloudJobId || null
                    });
                    if (!cloudJobId) {
                        setUvJobId(null);
                        setUvJobStatus('failed_to_schedule');
                        setAlertMessage('3D worker did not return a valid job id.');
                    } else {
                        setUvJobId(cloudJobId);
                        setUvJobStatus(String(submitResponse.status ?? 'queued'));
                    }
                } catch (workerError) {
                    setUvJobId(null);
                    setUvJobStatus('failed_to_schedule');
                    workerSubmitError = workerError instanceof Error ? workerError.message : 'Could not submit 3D worker job.';
                }
            }
            setSubmitProgress(100);
            setAlertMessage(workerSubmitError ?? `Piece added to your wardrobe successfully. 2D prep status: ${localFitPreparationStatus ?? 'unknown'}.`);
            console.debug('[add-piece] ui refresh requested', {
                hasOnPieceCreated: Boolean(onPieceCreated)
            });
            onPieceCreated?.();
            setForm((prev)=>({
                    ...prev,
                    name: '',
                    image_url: '',
                    color: '',
                    material: '',
                    style_tags: '',
                    occasion_tags: ''
                }));
            setSelectedImageName('');
            setImagePreview('');
        } finally{
            setSubmitting(false);
        }
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AddWardrobeItemView.useEffect": ()=>{
            if (!uvJobId) return;
            let cancelled = false;
            let attempts = 0;
            let consecutiveErrors = 0;
            const MAX_ATTEMPTS = 120;
            const MAX_CONSECUTIVE_ERRORS = 3;
            const timer = window.setInterval({
                "AddWardrobeItemView.useEffect.timer": async ()=>{
                    if (cancelled) return;
                    attempts += 1;
                    if (attempts > MAX_ATTEMPTS) {
                        window.clearInterval(timer);
                        setUvJobStatus('failed');
                        setAlertMessage('3D generation timed out. Please retry.');
                        return;
                    }
                    try {
                        const payload = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$blenderWorkerClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pollBlenderWorkerJob"])(uvJobId);
                        if (cancelled) return;
                        consecutiveErrors = 0;
                        if (!payload?.status) return;
                        const nextStatus = String(payload.status);
                        console.log('[3d-worker] poll', {
                            jobId: uvJobId,
                            status: nextStatus
                        });
                        setUvJobStatus(nextStatus);
                        if (nextStatus === 'completed' || nextStatus === 'failed' || nextStatus === 'cancelled') {
                            window.clearInterval(timer);
                        }
                    } catch (pollError) {
                        consecutiveErrors += 1;
                        if (!cancelled && consecutiveErrors >= MAX_CONSECUTIVE_ERRORS) {
                            setUvJobStatus('failed');
                            setAlertMessage(pollError instanceof Error ? pollError.message : 'Could not poll 3D job status.');
                            window.clearInterval(timer);
                        }
                    }
                }
            }["AddWardrobeItemView.useEffect.timer"], 2500);
            return ({
                "AddWardrobeItemView.useEffect": ()=>{
                    cancelled = true;
                    window.clearInterval(timer);
                }
            })["AddWardrobeItemView.useEffect"];
        }
    }["AddWardrobeItemView.useEffect"], [
        uvJobId
    ]);
    const handleImageFileChange = async (event)=>{
        const file = event.target.files?.[0];
        if (!file) {
            if (imagePreview.startsWith('blob:')) {
                URL.revokeObjectURL(imagePreview);
            }
            setForm((prev)=>({
                    ...prev,
                    image_url: ''
                }));
            setSelectedImageName('');
            setImagePreview('');
            setSelectedFile(null);
            return;
        }
        const isImage = file.type.startsWith('image/');
        if (!isImage) {
            event.target.value = '';
            setAlertMessage('Please select a valid image file.');
            return;
        }
        const nextPreview = URL.createObjectURL(file);
        if (imagePreview.startsWith('blob:')) {
            URL.revokeObjectURL(imagePreview);
        }
        setImagePreview(nextPreview);
        setSelectedImageName(file.name);
        setSelectedFile(file);
        setUploadingImage(true);
        const payload = new FormData();
        payload.append('image', file);
        try {
            const uploadResponse = await fetch('/api/upload-image', {
                method: 'POST',
                body: payload
            }).catch(()=>null);
            if (!uploadResponse?.ok) {
                const uploadError = await uploadResponse?.json().catch(()=>null);
                setAlertMessage(uploadError?.error || 'Unable to upload selected image. Please try another file.');
                setForm((prev)=>({
                        ...prev,
                        image_url: ''
                    }));
                setSelectedImageName('');
                setImagePreview('');
                return;
            }
            const uploadBody = await uploadResponse.json().catch(()=>null);
            if (!uploadBody?.image_url) {
                setAlertMessage('Upload succeeded but image URL is missing. Please try again.');
                setForm((prev)=>({
                        ...prev,
                        image_url: ''
                    }));
                return;
            }
            setForm((prev)=>({
                    ...prev,
                    image_url: uploadBody.image_url ?? ''
                }));
        } finally{
            setUploadingImage(false);
        }
    };
    const handleAnalyzeWithAI = async ()=>{
        if (!selectedFile && !form.image_url) {
            setAlertMessage('Please select an image first.');
            return;
        }
        setIsAnalyzing(true);
        try {
            let base64Image;
            let mimeType;
            if (selectedFile) {
                base64Image = await new Promise((resolve, reject)=>{
                    const reader = new FileReader();
                    reader.onload = ()=>resolve(reader.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(selectedFile);
                });
                mimeType = selectedFile.type;
            }
            const response = await fetch('/api/ai/fashion/analyze-piece', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    base64Image,
                    imageUrl: form.image_url,
                    mimeType
                })
            });
            const payload = await response.json();
            if (!response.ok || !payload.ok) {
                setAlertMessage(payload.message || 'Error analyzing image');
                return;
            }
            const data = payload.data;
            let mappedPieceType = form.piece_type;
            if (form.piece_type === 'upper_piece') {
                if (data.bodyRegion === 'lower') mappedPieceType = 'lower_piece';
                else if (data.bodyRegion === 'shoes') mappedPieceType = 'shoes_piece';
                else if (data.bodyRegion === 'accessory') mappedPieceType = 'accessory_piece';
            }
            setForm((prev)=>({
                    ...prev,
                    name: prev.name || data.pieceName || '',
                    color: prev.color || data.primaryColor || '',
                    material: prev.material || data.materials && data.materials[0] || '',
                    style_tags: prev.style_tags || (data.styles ? data.styles.join(', ') : ''),
                    occasion_tags: prev.occasion_tags || '',
                    gender: prev.gender || (data.gender === 'male' ? 'masculino' : data.gender === 'female' ? 'feminino' : prev.gender),
                    piece_type: mappedPieceType
                }));
            setAlertMessage('AI Analysis complete! Suggestions applied to empty fields.');
        } catch (err) {
            setAlertMessage(err.message || 'Error during AI analysis.');
        } finally{
            setIsAnalyzing(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-6",
                children: [
                    mode === 'page' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shell$2f$PageHeader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        title: "Adicionar peça",
                        subtitle: "Adicione novas peças ao seu guarda-roupa. A marca pode ser mantida como padrão."
                    }, void 0, false, {
                        fileName: "[project]/app/views/AddWardrobeItemView.tsx",
                        lineNumber: 511,
                        columnNumber: 11
                    }, this) : null,
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shared$2f$SectionBlock$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        title: "Formulário de peça de guarda-roupa",
                        subtitle: "Register a piece and classify it with tags and metadata.",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                            className: "mt-4 grid gap-3 md:grid-cols-2",
                            onSubmit: handleSubmit,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    value: form.name,
                                    onChange: (e)=>setForm((prev)=>({
                                                ...prev,
                                                name: e.target.value
                                            })),
                                    placeholder: "Piece name",
                                    className: inputClassName
                                }, void 0, false, {
                                    fileName: "[project]/app/views/AddWardrobeItemView.tsx",
                                    lineNumber: 522,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: fileWrapperClassName,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "file",
                                        accept: "image/*",
                                        onChange: handleImageFileChange,
                                        className: fileInputClassName
                                    }, void 0, false, {
                                        fileName: "[project]/app/views/AddWardrobeItemView.tsx",
                                        lineNumber: 530,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/views/AddWardrobeItemView.tsx",
                                    lineNumber: 529,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ui$2f$fancy$2d$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    value: form.gender,
                                    onChange: (gender)=>setForm((prev)=>({
                                                ...prev,
                                                gender
                                            })),
                                    placeholder: "Gênero",
                                    options: GENDER_OPTIONS.map((gender)=>({
                                            value: gender.value,
                                            label: gender.label,
                                            group: 'Gênero da peça'
                                        }))
                                }, void 0, false, {
                                    fileName: "[project]/app/views/AddWardrobeItemView.tsx",
                                    lineNumber: 538,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ui$2f$fancy$2d$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    value: form.piece_type,
                                    onChange: (pieceType)=>setForm((prev)=>({
                                                ...prev,
                                                piece_type: pieceType
                                            })),
                                    options: [
                                        {
                                            value: 'upper_piece',
                                            label: 'Upper piece',
                                            icon: {
                                                type: 'emoji',
                                                value: '👕',
                                                alt: 'T-shirt'
                                            }
                                        },
                                        {
                                            value: 'lower_piece',
                                            label: 'Lower piece',
                                            icon: {
                                                type: 'emoji',
                                                value: '👖',
                                                alt: 'Pants'
                                            }
                                        },
                                        {
                                            value: 'shoes_piece',
                                            label: 'Shoes',
                                            icon: {
                                                type: 'emoji',
                                                value: '👟',
                                                alt: 'Shoes'
                                            }
                                        },
                                        {
                                            value: 'accessory_piece',
                                            label: 'Accessory',
                                            icon: {
                                                type: 'emoji',
                                                value: '🧢',
                                                alt: 'Accessory'
                                            }
                                        }
                                    ]
                                }, void 0, false, {
                                    fileName: "[project]/app/views/AddWardrobeItemView.tsx",
                                    lineNumber: 549,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ui$2f$fancy$2d$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    value: form.market_id,
                                    onChange: (marketId)=>setForm((prev)=>({
                                                ...prev,
                                                market_id: marketId
                                            })),
                                    placeholder: "Select market",
                                    options: markets.map((market)=>({
                                            value: market.market_id,
                                            label: marketLabel.get(market.market_id) ?? market.market_id
                                        }))
                                }, void 0, false, {
                                    fileName: "[project]/app/views/AddWardrobeItemView.tsx",
                                    lineNumber: 560,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ui$2f$fancy$2d$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    value: form.brand_id,
                                    onChange: (brandId)=>setForm((prev)=>({
                                                ...prev,
                                                brand_id: brandId
                                            })),
                                    options: [
                                        {
                                            value: DEFAULT_BRAND_ID,
                                            label: 'Default brand',
                                            icon: {
                                                type: 'emoji',
                                                value: '🏷️',
                                                alt: 'Default brand'
                                            }
                                        },
                                        ...brands.map((brand)=>{
                                            const logoUrl = resolveBrandLogoUrl(brand);
                                            return {
                                                value: brand.brand_id,
                                                label: brand.name,
                                                icon: logoUrl ? {
                                                    type: 'image',
                                                    value: logoUrl,
                                                    alt: `${brand.name} logo`
                                                } : {
                                                    type: 'emoji',
                                                    value: '🏷️',
                                                    alt: `${brand.name} brand`
                                                }
                                            };
                                        })
                                    ]
                                }, void 0, false, {
                                    fileName: "[project]/app/views/AddWardrobeItemView.tsx",
                                    lineNumber: 570,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ui$2f$fancy$2d$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    value: form.color,
                                    onChange: (color)=>setForm((prev)=>({
                                                ...prev,
                                                color
                                            })),
                                    placeholder: "Color",
                                    options: COLOR_OPTIONS.map((color)=>({
                                            value: color,
                                            label: color,
                                            group: 'Color'
                                        }))
                                }, void 0, false, {
                                    fileName: "[project]/app/views/AddWardrobeItemView.tsx",
                                    lineNumber: 588,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ui$2f$fancy$2d$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    value: form.material,
                                    onChange: (material)=>setForm((prev)=>({
                                                ...prev,
                                                material
                                            })),
                                    placeholder: "Material",
                                    options: MATERIAL_OPTIONS.map((material)=>({
                                            value: material,
                                            label: material,
                                            group: 'Material'
                                        }))
                                }, void 0, false, {
                                    fileName: "[project]/app/views/AddWardrobeItemView.tsx",
                                    lineNumber: 595,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ui$2f$fancy$2d$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    value: form.style_tags,
                                    onChange: (styleTag)=>setForm((prev)=>({
                                                ...prev,
                                                style_tags: styleTag
                                            })),
                                    placeholder: "Style tag",
                                    options: STYLE_TAG_OPTIONS.map((styleTag)=>({
                                            value: styleTag,
                                            label: styleTag,
                                            group: 'Style Tags'
                                        }))
                                }, void 0, false, {
                                    fileName: "[project]/app/views/AddWardrobeItemView.tsx",
                                    lineNumber: 606,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ui$2f$fancy$2d$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    value: form.occasion_tags,
                                    onChange: (occasionTag)=>setForm((prev)=>({
                                                ...prev,
                                                occasion_tags: occasionTag
                                            })),
                                    placeholder: "Occasion tag",
                                    options: OCCASION_TAG_OPTIONS.map((occasionTag)=>({
                                            value: occasionTag,
                                            label: occasionTag,
                                            group: 'Occasion Tags'
                                        }))
                                }, void 0, false, {
                                    fileName: "[project]/app/views/AddWardrobeItemView.tsx",
                                    lineNumber: 617,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: `${infoBoxClassName} md:col-span-2`,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm text-white/80",
                                            children: selectedImageName ? `Selected file: ${selectedImageName}` : 'Select an image file to continue.'
                                        }, void 0, false, {
                                            fileName: "[project]/app/views/AddWardrobeItemView.tsx",
                                            lineNumber: 629,
                                            columnNumber: 15
                                        }, this),
                                        imagePreview ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-3 flex flex-col items-start gap-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                    src: imagePreview,
                                                    alt: "Selected clothing piece preview",
                                                    width: 512,
                                                    height: 320,
                                                    className: "h-40 w-auto rounded-xl border border-white/20 object-cover",
                                                    unoptimized: true
                                                }, void 0, false, {
                                                    fileName: "[project]/app/views/AddWardrobeItemView.tsx",
                                                    lineNumber: 637,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    onClick: handleAnalyzeWithAI,
                                                    disabled: isAnalyzing || uploadingImage,
                                                    className: "flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:scale-105 hover:brightness-110 disabled:opacity-50",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: "✨"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/views/AddWardrobeItemView.tsx",
                                                            lineNumber: 651,
                                                            columnNumber: 21
                                                        }, this),
                                                        isAnalyzing ? 'Analyzing with Google AI...' : 'Analyze with Google AI'
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/views/AddWardrobeItemView.tsx",
                                                    lineNumber: 645,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/views/AddWardrobeItemView.tsx",
                                            lineNumber: 636,
                                            columnNumber: 17
                                        }, this) : null
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/views/AddWardrobeItemView.tsx",
                                    lineNumber: 628,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "submit",
                                    disabled: submitting || uploadingImage,
                                    className: `${submitButtonClassName} md:col-span-2`,
                                    children: uploadingImage ? 'Uploading image...' : submitting ? 'Saving...' : 'Add piece'
                                }, void 0, false, {
                                    fileName: "[project]/app/views/AddWardrobeItemView.tsx",
                                    lineNumber: 658,
                                    columnNumber: 13
                                }, this),
                                submitting ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "md:col-span-2 space-y-1",
                                    role: "status",
                                    "aria-live": "polite",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "h-2 w-full overflow-hidden rounded-full bg-white/20",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "h-full rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 transition-[width] duration-200",
                                                style: {
                                                    width: `${submitProgress}%`
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/app/views/AddWardrobeItemView.tsx",
                                                lineNumber: 669,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/views/AddWardrobeItemView.tsx",
                                            lineNumber: 668,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs text-white/80",
                                            children: [
                                                "Adicionando peça... ",
                                                submitProgress,
                                                "%"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/views/AddWardrobeItemView.tsx",
                                            lineNumber: 674,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/views/AddWardrobeItemView.tsx",
                                    lineNumber: 667,
                                    columnNumber: 15
                                }, this) : null,
                                uvJobId ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "md:col-span-2 text-xs text-white/80",
                                    children: [
                                        "UV job ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "font-mono",
                                            children: uvJobId
                                        }, void 0, false, {
                                            fileName: "[project]/app/views/AddWardrobeItemView.tsx",
                                            lineNumber: 680,
                                            columnNumber: 24
                                        }, this),
                                        " status: ",
                                        uvJobStatus ?? 'pending'
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/views/AddWardrobeItemView.tsx",
                                    lineNumber: 679,
                                    columnNumber: 15
                                }, this) : null
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/views/AddWardrobeItemView.tsx",
                            lineNumber: 521,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/views/AddWardrobeItemView.tsx",
                        lineNumber: 517,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/views/AddWardrobeItemView.tsx",
                lineNumber: 509,
                columnNumber: 7
            }, this),
            alertMessage ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shared$2f$SaiModalAlert$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                message: alertMessage,
                onConfirm: ()=>setAlertMessage(null)
            }, void 0, false, {
                fileName: "[project]/app/views/AddWardrobeItemView.tsx",
                lineNumber: 688,
                columnNumber: 9
            }, this) : null
        ]
    }, void 0, true);
}
_s(AddWardrobeItemView, "9q/GjC0sdyY9MhxNSigAUE3fgwk=");
_c = AddWardrobeItemView;
var _c;
__turbopack_context__.k.register(_c, "AddWardrobeItemView");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=app_views_c22cc993._.js.map