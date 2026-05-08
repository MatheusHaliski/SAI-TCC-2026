(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/app/lib/utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-client] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/components/ui/form.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Form",
    ()=>Form,
    "FormControl",
    ()=>FormControl,
    "FormDescription",
    ()=>FormDescription,
    "FormField",
    ()=>FormField,
    "FormItem",
    ()=>FormItem,
    "FormLabel",
    ()=>FormLabel,
    "FormMessage",
    ()=>FormMessage,
    "useFormField",
    ()=>useFormField
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$label$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-label/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hook$2d$form$2f$dist$2f$index$2e$esm$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-hook-form/dist/index.esm.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/utils.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature(), _s4 = __turbopack_context__.k.signature(), _s5 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
const Form = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hook$2d$form$2f$dist$2f$index$2e$esm$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FormProvider"];
const FormFieldContext = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"]({});
const FormField = (props)=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FormFieldContext.Provider, {
        value: {
            name: props.name
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hook$2d$form$2f$dist$2f$index$2e$esm$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Controller"], {
            ...props
        }, void 0, false, {
            fileName: "[project]/app/components/ui/form.tsx",
            lineNumber: 37,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/app/components/ui/form.tsx",
        lineNumber: 36,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c = FormField;
const useFormField = ()=>{
    _s();
    const fieldContext = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"](FormFieldContext);
    const itemContext = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"](FormItemContext);
    const { getFieldState, formState } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hook$2d$form$2f$dist$2f$index$2e$esm$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFormContext"])();
    const fieldState = getFieldState(fieldContext.name, formState);
    if (!fieldContext) {
        throw new Error("useFormField should be used within <FormField>");
    }
    const { id } = itemContext;
    return {
        id,
        name: fieldContext.name,
        formItemId: `${id}-form-item`,
        formDescriptionId: `${id}-form-item-description`,
        formMessageId: `${id}-form-item-message`,
        ...fieldState
    };
};
_s(useFormField, "eRzki+X5SldVDcAh3BokmSZW9NU=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hook$2d$form$2f$dist$2f$index$2e$esm$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFormContext"]
    ];
});
const FormItemContext = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"]({});
const FormItem = /*#__PURE__*/ _s1(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c1 = _s1(({ className, ...props }, ref)=>{
    _s1();
    const id = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"]();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FormItemContext.Provider, {
        value: {
            id
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            ref: ref,
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("space-y-2", className),
            ...props
        }, void 0, false, {
            fileName: "[project]/app/components/ui/form.tsx",
            lineNumber: 81,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/app/components/ui/form.tsx",
        lineNumber: 80,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
}, "WhsuKpSQZEWeFcB7gWlfDRQktoQ=")), "WhsuKpSQZEWeFcB7gWlfDRQktoQ=");
_c2 = FormItem;
FormItem.displayName = "FormItem";
const FormLabel = /*#__PURE__*/ _s2(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c3 = _s2(({ className, ...props }, ref)=>{
    _s2();
    const { error, formItemId } = useFormField();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$label$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-xs font-medium text-white/70", error && "text-red-400/90", className),
        htmlFor: formItemId,
        ...props
    }, void 0, false, {
        fileName: "[project]/app/components/ui/form.tsx",
        lineNumber: 94,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
}, "Z4R+rKjylfAcqmbRnqWEg1TfTcg=", false, function() {
    return [
        useFormField
    ];
})), "Z4R+rKjylfAcqmbRnqWEg1TfTcg=", false, function() {
    return [
        useFormField
    ];
});
_c4 = FormLabel;
FormLabel.displayName = "FormLabel";
const FormControl = /*#__PURE__*/ _s3(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c5 = _s3(({ className, ...props }, ref)=>{
    _s3();
    const { error, formItemId, formDescriptionId, formMessageId } = useFormField();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        id: formItemId,
        "aria-describedby": !error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`,
        "aria-invalid": !!error,
        className: className,
        ...props
    }, void 0, false, {
        fileName: "[project]/app/components/ui/form.tsx",
        lineNumber: 116,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
}, "mI3rlmONcPPBVtOc6UefMrXAJ6w=", false, function() {
    return [
        useFormField
    ];
})), "mI3rlmONcPPBVtOc6UefMrXAJ6w=", false, function() {
    return [
        useFormField
    ];
});
_c6 = FormControl;
FormControl.displayName = "FormControl";
const FormDescription = /*#__PURE__*/ _s4(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c7 = _s4(({ className, ...props }, ref)=>{
    _s4();
    const { formDescriptionId } = useFormField();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
        ref: ref,
        id: formDescriptionId,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-xs text-white/50", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/app/components/ui/form.tsx",
        lineNumber: 137,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
}, "573aRXA8dloSrMaQM9SdAF4A9NI=", false, function() {
    return [
        useFormField
    ];
})), "573aRXA8dloSrMaQM9SdAF4A9NI=", false, function() {
    return [
        useFormField
    ];
});
_c8 = FormDescription;
FormDescription.displayName = "FormDescription";
const FormMessage = /*#__PURE__*/ _s5(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c9 = _s5(({ className, children, ...props }, ref)=>{
    _s5();
    const { error, formMessageId } = useFormField();
    const body = error ? String(error?.message ?? "") : children;
    if (!body) {
        return null;
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
        ref: ref,
        id: formMessageId,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-xs font-medium text-red-400/90 mt-1", className),
        ...props,
        children: body
    }, void 0, false, {
        fileName: "[project]/app/components/ui/form.tsx",
        lineNumber: 159,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
}, "WONNS8VCMr8LShuUovb8QgOmMVY=", false, function() {
    return [
        useFormField
    ];
})), "WONNS8VCMr8LShuUovb8QgOmMVY=", false, function() {
    return [
        useFormField
    ];
});
_c10 = FormMessage;
FormMessage.displayName = "FormMessage";
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9, _c10;
__turbopack_context__.k.register(_c, "FormField");
__turbopack_context__.k.register(_c1, "FormItem$React.forwardRef");
__turbopack_context__.k.register(_c2, "FormItem");
__turbopack_context__.k.register(_c3, "FormLabel$React.forwardRef");
__turbopack_context__.k.register(_c4, "FormLabel");
__turbopack_context__.k.register(_c5, "FormControl$React.forwardRef");
__turbopack_context__.k.register(_c6, "FormControl");
__turbopack_context__.k.register(_c7, "FormDescription$React.forwardRef");
__turbopack_context__.k.register(_c8, "FormDescription");
__turbopack_context__.k.register(_c9, "FormMessage$React.forwardRef");
__turbopack_context__.k.register(_c10, "FormMessage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/signupview/schema.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "signupPayloadSchema",
    ()=>signupPayloadSchema,
    "signupSchema",
    ()=>signupSchema
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v4/classic/external.js [app-client] (ecmascript) <export * as z>");
;
const nameRegex = /^(?!.*\b([A-Za-z]+)\b(?:[ '-]+\1\b)+)[A-Za-z]+(?:[ '-][A-Za-z]+)*$/i;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
const signupBaseSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    name: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().trim().min(3, "Name must be at least 3 characters.").regex(nameRegex, "Name can only include letters, spaces, apostrophes, or hyphens, and cannot repeat the same word."),
    email: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().email("Enter a valid email address."),
    password: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(8, "Password must be at least 8 characters.").regex(passwordRegex, "Password must include a letter, a number, and a symbol."),
    confirmPassword: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, "Please re-enter your password."),
    dataPolicyAccepted: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().refine((value)=>value, "Please accept the data policy to continue.")
});
const signupSchema = signupBaseSchema.refine((values)=>values.password === values.confirmPassword, {
    message: "Passwords do not match.",
    path: [
        "confirmPassword"
    ]
});
const signupPayloadSchema = signupBaseSchema.omit({
    confirmPassword: true,
    dataPolicyAccepted: true
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/lib/authAlerts.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "VSModalPaged",
    ()=>VSModalPaged
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sweetalert2$2f$dist$2f$sweetalert2$2e$all$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sweetalert2/dist/sweetalert2.all.js [app-client] (ecmascript)");
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
    const base = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sweetalert2$2f$dist$2f$sweetalert2$2e$all$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].mixin({
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
_c = VSModalPaged;
var _c;
__turbopack_context__.k.register(_c, "VSModalPaged");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/lib/SafeStorage.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        return window.localStorage.getItem(key);
    } catch  {
        return null;
    }
}
function setLS(key, value) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        window.localStorage.setItem(key, value);
    } catch  {}
}
function removeLS(key) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        window.localStorage.removeItem(key);
    } catch  {}
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/lib/authSession.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$SafeStorage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/SafeStorage.ts [app-client] (ecmascript)");
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
    const parsed = parseExpiringToken((0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$SafeStorage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getLS"])(AUTH_SESSION_TOKEN_KEY));
    if (!parsed) return "";
    if (parsed.expiresAt <= Date.now()) {
        clearAuthSessionToken();
        return "";
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$SafeStorage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setLS"])(AUTH_SESSION_TOKEN_KEY, JSON.stringify(parsed));
    return parsed.token;
};
const setAuthSessionToken = (token)=>{
    const payload = {
        token,
        expiresAt: Date.now() + AUTH_SESSION_TOKEN_TTL_MS
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$SafeStorage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setLS"])(AUTH_SESSION_TOKEN_KEY, JSON.stringify(payload));
};
const clearAuthSessionToken = ()=>{
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$SafeStorage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["removeLS"])(AUTH_SESSION_TOKEN_KEY);
};
const getAuthSessionProfile = ()=>{
    const raw = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$SafeStorage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getLS"])(AUTH_SESSION_PROFILE_KEY);
    if (!raw) return {};
    try {
        return JSON.parse(raw);
    } catch  {
        return {};
    }
};
const setAuthSessionProfile = (profile)=>{
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$SafeStorage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setLS"])(AUTH_SESSION_PROFILE_KEY, JSON.stringify(profile));
};
const clearAuthSessionProfile = ()=>{
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$SafeStorage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["removeLS"])(AUTH_SESSION_PROFILE_KEY);
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/gate/firebaseClient.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "firebaseAuthGate",
    ()=>firebaseAuthGate
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/app/dist/esm/index.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/app/dist/esm/index.esm.js [app-client] (ecmascript)");
"use client";
;
function firebaseAuthGate() {
    // blindagem extra (caso algum import aconteça fora do client)
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const firebaseConfig = {
        apiKey: ("TURBOPACK compile-time value", "AIzaSyBYhPAVFzUbdYEn7YC8EbvXKqunboVKjb4") ?? "",
        authDomain: ("TURBOPACK compile-time value", "funcionarioslistaapp2025.firebaseapp.com") ?? "",
        projectId: ("TURBOPACK compile-time value", "funcionarioslistaapp2025") ?? "",
        storageBucket: ("TURBOPACK compile-time value", "funcionarioslistaapp2025.firebasestorage.app") ?? "",
        messagingSenderId: ("TURBOPACK compile-time value", "457209482063") ?? "",
        appId: ("TURBOPACK compile-time value", "1:457209482063:web:a08af8568993f6f9be133a") ?? "",
        measurementId: ("TURBOPACK compile-time value", "G-Y2BYBQDF55") ?? ""
    };
    const hasFirebaseConfig = Boolean(firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId);
    const firebaseApp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getApps"])().length > 0 ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getApps"])()[0] : hasFirebaseConfig ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["initializeApp"])(firebaseConfig) : null;
    return {
        firebaseApp,
        hasFirebaseConfig
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/auth.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/auth/dist/esm/index.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/auth/dist/esm/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$gate$2f$firebaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/gate/firebaseClient.ts [app-client] (ecmascript)");
"use client";
;
;
const provider = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GoogleAuthProvider"]();
const facebookProvider = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FacebookAuthProvider"]();
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
    const { firebaseApp, hasFirebaseConfig } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$gate$2f$firebaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["firebaseAuthGate"])();
    if (!firebaseApp || !hasFirebaseConfig) {
        throw new Error("Firebase auth is not configured.");
    }
    const auth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAuth"])(firebaseApp);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["signInWithPopup"])(auth, provider);
}
async function signInWithGoogleRedirect() {
    const { firebaseApp, hasFirebaseConfig } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$gate$2f$firebaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["firebaseAuthGate"])();
    if (!firebaseApp || !hasFirebaseConfig) {
        throw new Error("Firebase auth is not configured.");
    }
    const auth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAuth"])(firebaseApp);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["signInWithRedirect"])(auth, provider);
}
async function signInWithFacebook() {
    const { firebaseApp, hasFirebaseConfig } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$gate$2f$firebaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["firebaseAuthGate"])();
    if (!firebaseApp || !hasFirebaseConfig) {
        throw new Error("Firebase auth is not configured.");
    }
    const auth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAuth"])(firebaseApp);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["signInWithPopup"])(auth, facebookProvider);
}
async function signOutUser() {
    const { firebaseApp, hasFirebaseConfig } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$gate$2f$firebaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["firebaseAuthGate"])();
    if (!firebaseApp || !hasFirebaseConfig) return;
    const auth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAuth"])(firebaseApp);
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["signOut"])(auth);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/signupview/SignupForm.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SignupForm
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$hookform$2f$resolvers$2f$zod$2f$dist$2f$zod$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@hookform/resolvers/zod/dist/zod.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hook$2d$form$2f$dist$2f$index$2e$esm$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-hook-form/dist/index.esm.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ui$2f$form$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/ui/form.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$signupview$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/signupview/schema.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$authAlerts$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/authAlerts.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$authSession$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/authSession.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/auth.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$gate$2f$firebaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/gate/firebaseClient.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/auth/dist/esm/index.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/auth/dist/esm/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
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
const ff = "'Inter', 'Segoe UI', Arial, sans-serif";
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
const labelStyle = {
    display: "block",
    fontSize: "0.875rem",
    fontWeight: 500,
    color: "#374151",
    marginBottom: "0.5rem",
    fontFamily: ff
};
const EyeIcon = ({ open })=>open ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        width: "18",
        height: "18",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
            }, void 0, false, {
                fileName: "[project]/app/signupview/SignupForm.tsx",
                lineNumber: 26,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: "1",
                y1: "1",
                x2: "23",
                y2: "23"
            }, void 0, false, {
                fileName: "[project]/app/signupview/SignupForm.tsx",
                lineNumber: 26,
                columnNumber: 201
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/app/signupview/SignupForm.tsx",
        lineNumber: 25,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        width: "18",
        height: "18",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
            }, void 0, false, {
                fileName: "[project]/app/signupview/SignupForm.tsx",
                lineNumber: 30,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "12",
                cy: "12",
                r: "3"
            }, void 0, false, {
                fileName: "[project]/app/signupview/SignupForm.tsx",
                lineNumber: 30,
                columnNumber: 65
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/app/signupview/SignupForm.tsx",
        lineNumber: 29,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
_c = EyeIcon;
const signupErrorMessageByCode = {
    "auth/email-already-in-use": "Este e-mail já está em uso.",
    "auth/weak-password": "A senha é muito fraca. Use ao menos 8 caracteres com letra, número e símbolo.",
    "auth/invalid-email": "Informe um e-mail válido."
};
const resolveSignupErrorMessage = (error)=>{
    const authError = error;
    const code = authError?.code ?? "";
    return signupErrorMessageByCode[code] ?? "Não foi possível criar sua conta agora.";
};
function SignupForm() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const { firebaseApp, hasFirebaseConfig } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$gate$2f$firebaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["firebaseAuthGate"])();
    const [isPending, startTransition] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTransition"])();
    const [showPassword, setShowPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showConfirmPassword, setShowConfirmPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const form = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hook$2d$form$2f$dist$2f$index$2e$esm$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useForm"])({
        resolver: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$hookform$2f$resolvers$2f$zod$2f$dist$2f$zod$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["zodResolver"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$signupview$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["signupSchema"]),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            dataPolicyAccepted: false
        },
        mode: "onTouched"
    });
    const password = form.watch("password");
    const handleInvalid = ()=>{
        const errors = form.formState.errors;
        const msgs = [
            errors.name?.message,
            errors.email?.message,
            errors.password?.message,
            errors.confirmPassword?.message,
            errors.dataPolicyAccepted?.message
        ].filter(Boolean).map(String);
        void (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$authAlerts$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["VSModalPaged"])({
            title: "Verifique seus dados",
            messages: Array.from(new Set(msgs)),
            tone: "error"
        });
    };
    const handleGoogleSignup = async ()=>{
        if (isPending) return;
        if (!firebaseApp || !hasFirebaseConfig) {
            void (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$authAlerts$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["VSModalPaged"])({
                title: "Cadastro indisponível",
                messages: [
                    "Firebase Auth não está configurado para este ambiente."
                ],
                tone: "error"
            });
            return;
        }
        startTransition(async ()=>{
            try {
                console.info("[SignupView] signup started", {
                    route: "/signupview",
                    provider: "google"
                });
                const credential = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["signInWithGoogle"])();
                const user = credential.user;
                const uid = user.uid;
                const normalizedEmail = user.email?.trim().toLowerCase() ?? "";
                const normalizedName = user.displayName?.trim() ?? "";
                const idToken = await user.getIdToken(true);
                console.info("[SignupView] Firebase Auth user created", {
                    provider: "google"
                });
                console.info("[SignupView] uid returned", {
                    uid
                });
                const response = await fetch("/api/signup", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        uid,
                        name: normalizedName,
                        email: normalizedEmail,
                        provider: "google",
                        idToken
                    })
                });
                const payload = await response.json().catch(()=>null);
                if (!response.ok || !payload?.ok) {
                    console.error("[SignupView] Firestore profile sync failed", {
                        uid,
                        normalizedEmail,
                        status: response.status,
                        error: payload?.error
                    });
                    void (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$authAlerts$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["VSModalPaged"])({
                        title: "Cadastro incompleto",
                        messages: [
                            payload?.error ?? "Conta Google criada, mas falhou ao sincronizar seu perfil."
                        ],
                        tone: "error"
                    });
                    return;
                }
                console.info("[SignupView] Firestore profile created", {
                    uid,
                    normalizedEmail
                });
                console.info("[SignupView] final signup success", {
                    uid,
                    normalizedEmail
                });
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$authSession$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setAuthSessionProfile"])({
                    user_id: payload.profile?.user_id?.trim() || uid,
                    name: payload.profile?.name?.trim() || normalizedName || "Usuário",
                    email: payload.profile?.email?.trim().toLowerCase() || normalizedEmail
                });
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$authAlerts$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["VSModalPaged"])({
                    title: "Conta criada",
                    messages: [
                        "Cadastro com Google concluído com sucesso."
                    ],
                    tone: "success"
                });
                form.reset();
                router.replace("/authview");
            } catch (error) {
                const authError = error;
                console.error("[SignupView] signup failed", {
                    code: authError?.code ?? "unknown",
                    message: authError?.message ?? "Unexpected signup error."
                });
                void (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$authAlerts$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["VSModalPaged"])({
                    title: "Cadastro falhou",
                    messages: [
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resolveOAuthUserMessage"])(error, "Não foi possível concluir o cadastro com Google.")
                    ],
                    tone: "error"
                });
            }
        });
    };
    const handleSubmit = (values)=>{
        startTransition(async ()=>{
            const parsed = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$signupview$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["signupSchema"].safeParse(values);
            if (!parsed.success) {
                void (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$authAlerts$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["VSModalPaged"])({
                    title: "Verifique seus dados",
                    messages: Array.from(new Set(parsed.error.issues.map((i)=>i.message))),
                    tone: "error"
                });
                return;
            }
            if (!firebaseApp || !hasFirebaseConfig) {
                void (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$authAlerts$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["VSModalPaged"])({
                    title: "Cadastro indisponível",
                    messages: [
                        "Firebase Auth não está configurado para este ambiente."
                    ],
                    tone: "error"
                });
                return;
            }
            const normalizedEmail = parsed.data.email.trim().toLowerCase();
            const normalizedName = parsed.data.name.trim();
            console.info("[SignupView] signup started", {
                route: "/signupview",
                provider: "password"
            });
            console.info("[SignupView] normalized email", {
                normalizedEmail
            });
            try {
                const auth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAuth"])(firebaseApp);
                const userCredential = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createUserWithEmailAndPassword"])(auth, normalizedEmail, parsed.data.password);
                const uid = userCredential.user.uid;
                console.info("[SignupView] Firebase Auth user created", {
                    provider: "password"
                });
                console.info("[SignupView] uid returned", {
                    uid
                });
                if (normalizedName) {
                    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateProfile"])(userCredential.user, {
                        displayName: normalizedName
                    });
                }
                const idToken = await userCredential.user.getIdToken(true);
                const response = await fetch("/api/signup", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        uid,
                        name: normalizedName,
                        email: normalizedEmail,
                        provider: "password",
                        idToken
                    })
                });
                const payload = await response.json().catch(()=>null);
                if (!response.ok || !payload?.ok) {
                    console.error("[SignupView] Firestore profile sync failed", {
                        uid,
                        normalizedEmail,
                        status: response.status,
                        error: payload?.error
                    });
                    void (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$authAlerts$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["VSModalPaged"])({
                        title: "Cadastro incompleto",
                        messages: [
                            payload?.error ?? "Conta criada no Auth, mas não foi possível sincronizar seu perfil. Tente novamente."
                        ],
                        tone: "error"
                    });
                    return;
                }
                console.info("[SignupView] Firestore profile created", {
                    uid,
                    normalizedEmail
                });
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$authSession$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setAuthSessionProfile"])({
                    user_id: payload.profile?.user_id?.trim() || uid,
                    name: payload.profile?.name?.trim() || normalizedName,
                    email: payload.profile?.email?.trim().toLowerCase() || normalizedEmail
                });
                console.info("[SignupView] final signup success", {
                    uid,
                    normalizedEmail
                });
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$authAlerts$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["VSModalPaged"])({
                    title: "Conta criada",
                    messages: [
                        `Bem-vindo(a), ${normalizedName}.`
                    ],
                    tone: "success"
                });
                form.reset();
                router.replace("/authview");
            } catch (error) {
                const authError = error;
                console.error("[SignupView] signup failed", {
                    code: authError?.code ?? "unknown",
                    message: authError?.message ?? "Unexpected signup error."
                });
                void (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$authAlerts$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["VSModalPaged"])({
                    title: "Cadastro falhou",
                    messages: [
                        resolveSignupErrorMessage(error)
                    ],
                    tone: "error"
                });
            }
        });
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ui$2f$form$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Form"], {
        ...form,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
            onSubmit: form.handleSubmit(handleSubmit, handleInvalid),
            style: {
                display: "flex",
                flexDirection: "column",
                gap: "1rem"
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ui$2f$form$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FormField"], {
                    control: form.control,
                    name: "name",
                    render: ({ field })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ui$2f$form$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FormItem"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    style: labelStyle,
                                    children: "Nome completo"
                                }, void 0, false, {
                                    fileName: "[project]/app/signupview/SignupForm.tsx",
                                    lineNumber: 214,
                                    columnNumber: 25
                                }, void 0),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ui$2f$form$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FormControl"], {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        placeholder: "Seu nome",
                                        ...field,
                                        style: inputStyle
                                    }, void 0, false, {
                                        fileName: "[project]/app/signupview/SignupForm.tsx",
                                        lineNumber: 215,
                                        columnNumber: 38
                                    }, void 0)
                                }, void 0, false, {
                                    fileName: "[project]/app/signupview/SignupForm.tsx",
                                    lineNumber: 215,
                                    columnNumber: 25
                                }, void 0),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ui$2f$form$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FormMessage"], {}, void 0, false, {
                                    fileName: "[project]/app/signupview/SignupForm.tsx",
                                    lineNumber: 216,
                                    columnNumber: 25
                                }, void 0)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/signupview/SignupForm.tsx",
                            lineNumber: 213,
                            columnNumber: 21
                        }, void 0)
                }, void 0, false, {
                    fileName: "[project]/app/signupview/SignupForm.tsx",
                    lineNumber: 212,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ui$2f$form$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FormField"], {
                    control: form.control,
                    name: "email",
                    render: ({ field })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ui$2f$form$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FormItem"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    style: labelStyle,
                                    children: "E-mail"
                                }, void 0, false, {
                                    fileName: "[project]/app/signupview/SignupForm.tsx",
                                    lineNumber: 222,
                                    columnNumber: 25
                                }, void 0),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ui$2f$form$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FormControl"], {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "email",
                                        placeholder: "seu@email.com",
                                        ...field,
                                        style: inputStyle
                                    }, void 0, false, {
                                        fileName: "[project]/app/signupview/SignupForm.tsx",
                                        lineNumber: 223,
                                        columnNumber: 38
                                    }, void 0)
                                }, void 0, false, {
                                    fileName: "[project]/app/signupview/SignupForm.tsx",
                                    lineNumber: 223,
                                    columnNumber: 25
                                }, void 0),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ui$2f$form$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FormMessage"], {}, void 0, false, {
                                    fileName: "[project]/app/signupview/SignupForm.tsx",
                                    lineNumber: 224,
                                    columnNumber: 25
                                }, void 0)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/signupview/SignupForm.tsx",
                            lineNumber: 221,
                            columnNumber: 21
                        }, void 0)
                }, void 0, false, {
                    fileName: "[project]/app/signupview/SignupForm.tsx",
                    lineNumber: 220,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ui$2f$form$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FormField"], {
                    control: form.control,
                    name: "password",
                    render: ({ field })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ui$2f$form$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FormItem"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    style: labelStyle,
                                    children: "Senha"
                                }, void 0, false, {
                                    fileName: "[project]/app/signupview/SignupForm.tsx",
                                    lineNumber: 230,
                                    columnNumber: 25
                                }, void 0),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ui$2f$form$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FormControl"], {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            position: "relative"
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: showPassword ? "text" : "password",
                                                placeholder: "Mínimo 8 caracteres",
                                                ...field,
                                                style: {
                                                    ...inputStyle,
                                                    paddingRight: 44
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/app/signupview/SignupForm.tsx",
                                                lineNumber: 233,
                                                columnNumber: 33
                                            }, void 0),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(EyeIcon, {
                                                    open: showPassword
                                                }, void 0, false, {
                                                    fileName: "[project]/app/signupview/SignupForm.tsx",
                                                    lineNumber: 235,
                                                    columnNumber: 37
                                                }, void 0)
                                            }, void 0, false, {
                                                fileName: "[project]/app/signupview/SignupForm.tsx",
                                                lineNumber: 234,
                                                columnNumber: 33
                                            }, void 0)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/signupview/SignupForm.tsx",
                                        lineNumber: 232,
                                        columnNumber: 29
                                    }, void 0)
                                }, void 0, false, {
                                    fileName: "[project]/app/signupview/SignupForm.tsx",
                                    lineNumber: 231,
                                    columnNumber: 25
                                }, void 0),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ui$2f$form$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FormMessage"], {}, void 0, false, {
                                    fileName: "[project]/app/signupview/SignupForm.tsx",
                                    lineNumber: 239,
                                    columnNumber: 25
                                }, void 0)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/signupview/SignupForm.tsx",
                            lineNumber: 229,
                            columnNumber: 21
                        }, void 0)
                }, void 0, false, {
                    fileName: "[project]/app/signupview/SignupForm.tsx",
                    lineNumber: 228,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ui$2f$form$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FormField"], {
                    control: form.control,
                    name: "confirmPassword",
                    render: ({ field })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ui$2f$form$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FormItem"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    style: labelStyle,
                                    children: "Confirmar senha"
                                }, void 0, false, {
                                    fileName: "[project]/app/signupview/SignupForm.tsx",
                                    lineNumber: 245,
                                    columnNumber: 25
                                }, void 0),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ui$2f$form$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FormControl"], {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            position: "relative"
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: showConfirmPassword ? "text" : "password",
                                                placeholder: "Digite a senha novamente",
                                                ...field,
                                                style: {
                                                    ...inputStyle,
                                                    paddingRight: 44
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/app/signupview/SignupForm.tsx",
                                                lineNumber: 248,
                                                columnNumber: 33
                                            }, void 0),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: ()=>setShowConfirmPassword(!showConfirmPassword),
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
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(EyeIcon, {
                                                    open: showConfirmPassword
                                                }, void 0, false, {
                                                    fileName: "[project]/app/signupview/SignupForm.tsx",
                                                    lineNumber: 250,
                                                    columnNumber: 37
                                                }, void 0)
                                            }, void 0, false, {
                                                fileName: "[project]/app/signupview/SignupForm.tsx",
                                                lineNumber: 249,
                                                columnNumber: 33
                                            }, void 0)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/signupview/SignupForm.tsx",
                                        lineNumber: 247,
                                        columnNumber: 29
                                    }, void 0)
                                }, void 0, false, {
                                    fileName: "[project]/app/signupview/SignupForm.tsx",
                                    lineNumber: 246,
                                    columnNumber: 25
                                }, void 0),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ui$2f$form$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FormMessage"], {}, void 0, false, {
                                    fileName: "[project]/app/signupview/SignupForm.tsx",
                                    lineNumber: 254,
                                    columnNumber: 25
                                }, void 0)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/signupview/SignupForm.tsx",
                            lineNumber: 244,
                            columnNumber: 21
                        }, void 0)
                }, void 0, false, {
                    fileName: "[project]/app/signupview/SignupForm.tsx",
                    lineNumber: 243,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        backgroundColor: "#faf5ff",
                        borderRadius: 8,
                        padding: "1rem"
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            style: {
                                fontSize: "0.75rem",
                                color: "#6b7280",
                                marginBottom: "0.5rem",
                                fontFamily: ff
                            },
                            children: "Sua senha deve conter:"
                        }, void 0, false, {
                            fileName: "[project]/app/signupview/SignupForm.tsx",
                            lineNumber: 260,
                            columnNumber: 21
                        }, this),
                        [
                            {
                                test: password.length >= 8,
                                label: "Mínimo 8 caracteres"
                            },
                            {
                                test: /[A-Z]/.test(password),
                                label: "Uma letra maiúscula"
                            },
                            {
                                test: /[0-9]/.test(password),
                                label: "Um número"
                            }
                        ].map(({ test, label })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.5rem",
                                    fontSize: "0.75rem",
                                    color: test ? "#22c55e" : "#9ca3af",
                                    fontFamily: ff,
                                    marginBottom: "0.25rem"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: test ? "✓" : "○"
                                    }, void 0, false, {
                                        fileName: "[project]/app/signupview/SignupForm.tsx",
                                        lineNumber: 263,
                                        columnNumber: 29
                                    }, this),
                                    " ",
                                    label
                                ]
                            }, label, true, {
                                fileName: "[project]/app/signupview/SignupForm.tsx",
                                lineNumber: 262,
                                columnNumber: 25
                            }, this))
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/signupview/SignupForm.tsx",
                    lineNumber: 259,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ui$2f$form$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FormField"], {
                    control: form.control,
                    name: "dataPolicyAccepted",
                    render: ({ field })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ui$2f$form$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FormItem"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ui$2f$form$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FormControl"], {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        style: {
                                            display: "flex",
                                            alignItems: "flex-start",
                                            gap: "0.75rem",
                                            cursor: "pointer"
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "checkbox",
                                                checked: field.value,
                                                onChange: (e)=>field.onChange(e.target.checked),
                                                style: {
                                                    width: 16,
                                                    height: 16,
                                                    marginTop: 2,
                                                    accentColor: "#7c3aed"
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/app/signupview/SignupForm.tsx",
                                                lineNumber: 272,
                                                columnNumber: 33
                                            }, void 0),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    fontSize: "0.875rem",
                                                    color: "#6b7280",
                                                    fontFamily: ff
                                                },
                                                children: [
                                                    "Eu aceito os ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                        href: "#",
                                                        style: {
                                                            color: "#7c3aed",
                                                            textDecoration: "none"
                                                        },
                                                        children: "Termos de Uso"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/signupview/SignupForm.tsx",
                                                        lineNumber: 274,
                                                        columnNumber: 50
                                                    }, void 0),
                                                    " e a ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                        href: "#",
                                                        style: {
                                                            color: "#7c3aed",
                                                            textDecoration: "none"
                                                        },
                                                        children: "Política de Privacidade"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/signupview/SignupForm.tsx",
                                                        lineNumber: 274,
                                                        columnNumber: 137
                                                    }, void 0)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/signupview/SignupForm.tsx",
                                                lineNumber: 273,
                                                columnNumber: 33
                                            }, void 0)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/signupview/SignupForm.tsx",
                                        lineNumber: 271,
                                        columnNumber: 29
                                    }, void 0)
                                }, void 0, false, {
                                    fileName: "[project]/app/signupview/SignupForm.tsx",
                                    lineNumber: 270,
                                    columnNumber: 25
                                }, void 0),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ui$2f$form$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FormMessage"], {}, void 0, false, {
                                    fileName: "[project]/app/signupview/SignupForm.tsx",
                                    lineNumber: 278,
                                    columnNumber: 25
                                }, void 0)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/signupview/SignupForm.tsx",
                            lineNumber: 269,
                            columnNumber: 21
                        }, void 0)
                }, void 0, false, {
                    fileName: "[project]/app/signupview/SignupForm.tsx",
                    lineNumber: 268,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    type: "submit",
                    disabled: isPending,
                    style: {
                        width: "100%",
                        background: "linear-gradient(to right, #7c3aed, #ec4899)",
                        color: "#fff",
                        padding: "12px",
                        borderRadius: 8,
                        border: "none",
                        cursor: isPending ? "not-allowed" : "pointer",
                        fontSize: "1rem",
                        fontWeight: 500,
                        opacity: isPending ? 0.6 : 1,
                        fontFamily: ff
                    },
                    children: isPending ? "Criando sua conta..." : "Criar conta"
                }, void 0, false, {
                    fileName: "[project]/app/signupview/SignupForm.tsx",
                    lineNumber: 282,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        position: "relative",
                        textAlign: "center",
                        margin: "0.25rem 0"
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                borderTop: "1px solid #e5e7eb",
                                position: "absolute",
                                inset: 0,
                                top: "50%"
                            }
                        }, void 0, false, {
                            fileName: "[project]/app/signupview/SignupForm.tsx",
                            lineNumber: 287,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            style: {
                                position: "relative",
                                background: "#fff",
                                padding: "0 1rem",
                                color: "#6b7280",
                                fontSize: "0.875rem",
                                fontFamily: ff
                            },
                            children: "Ou cadastre-se com"
                        }, void 0, false, {
                            fileName: "[project]/app/signupview/SignupForm.tsx",
                            lineNumber: 288,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/signupview/SignupForm.tsx",
                    lineNumber: 286,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "1rem"
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            disabled: isPending,
                            onClick: handleGoogleSignup,
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
                                cursor: isPending ? "not-allowed" : "pointer",
                                opacity: isPending ? 0.6 : 1,
                                fontFamily: ff
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    style: {
                                        width: 20,
                                        height: 20
                                    },
                                    viewBox: "0 0 24 24",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            fill: "#4285F4",
                                            d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        }, void 0, false, {
                                            fileName: "[project]/app/signupview/SignupForm.tsx",
                                            lineNumber: 293,
                                            columnNumber: 84
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            fill: "#34A853",
                                            d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        }, void 0, false, {
                                            fileName: "[project]/app/signupview/SignupForm.tsx",
                                            lineNumber: 293,
                                            columnNumber: 230
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            fill: "#FBBC05",
                                            d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        }, void 0, false, {
                                            fileName: "[project]/app/signupview/SignupForm.tsx",
                                            lineNumber: 293,
                                            columnNumber: 390
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            fill: "#EA4335",
                                            d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        }, void 0, false, {
                                            fileName: "[project]/app/signupview/SignupForm.tsx",
                                            lineNumber: 293,
                                            columnNumber: 542
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/signupview/SignupForm.tsx",
                                    lineNumber: 293,
                                    columnNumber: 25
                                }, this),
                                "Google"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/signupview/SignupForm.tsx",
                            lineNumber: 292,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
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
                                cursor: "pointer",
                                fontFamily: ff
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    style: {
                                        width: 20,
                                        height: 20
                                    },
                                    fill: "currentColor",
                                    viewBox: "0 0 24 24",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        d: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                                    }, void 0, false, {
                                        fileName: "[project]/app/signupview/SignupForm.tsx",
                                        lineNumber: 297,
                                        columnNumber: 104
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/signupview/SignupForm.tsx",
                                    lineNumber: 297,
                                    columnNumber: 25
                                }, this),
                                "Facebook"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/signupview/SignupForm.tsx",
                            lineNumber: 296,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/signupview/SignupForm.tsx",
                    lineNumber: 291,
                    columnNumber: 17
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/signupview/SignupForm.tsx",
            lineNumber: 211,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/signupview/SignupForm.tsx",
        lineNumber: 210,
        columnNumber: 9
    }, this);
}
_s(SignupForm, "QXvg0jS6UEuXimSrpRs384rIcEY=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTransition"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hook$2d$form$2f$dist$2f$index$2e$esm$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useForm"]
    ];
});
_c1 = SignupForm;
var _c, _c1;
__turbopack_context__.k.register(_c, "EyeIcon");
__turbopack_context__.k.register(_c1, "SignupForm");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/lib/accessTokenShare.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$SafeStorage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/SafeStorage.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$authSession$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/authSession.ts [app-client] (ecmascript)");
;
;
const STYLISTAI_ACCESS_TOKEN_KEY = 'stylistai_content_access_token';
const STYLISTAI_ACCESS_DATA_KEY = 'stylistai_content_access_data';
const getSharedAccessToken = ()=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$SafeStorage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getLS"])(STYLISTAI_ACCESS_TOKEN_KEY) ?? '';
};
const setSharedAccessToken = (token)=>{
    if (!token) return;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$SafeStorage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setLS"])(STYLISTAI_ACCESS_TOKEN_KEY, token);
};
const getSharedAccessData = ()=>{
    const raw = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$SafeStorage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getLS"])(STYLISTAI_ACCESS_DATA_KEY);
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
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$SafeStorage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setLS"])(STYLISTAI_ACCESS_DATA_KEY, JSON.stringify(data));
    setSharedAccessToken(data.token);
};
const clearSharedAccessToken = ()=>{
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$SafeStorage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["removeLS"])(STYLISTAI_ACCESS_TOKEN_KEY);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$SafeStorage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["removeLS"])(STYLISTAI_ACCESS_DATA_KEY);
};
const resolveAnyAccessToken = ()=>{
    return getSharedAccessData()?.token || getSharedAccessToken() || (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$authSession$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAuthSessionToken"])();
};
const ensureSharedAccessToken = ()=>{
    const resolved = resolveAnyAccessToken();
    if (resolved) {
        setSharedAccessData({
            token: resolved,
            profile: getSharedAccessData()?.profile ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$authSession$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAuthSessionProfile"])()
        });
    }
    return resolved;
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/signupview/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SignupViewPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$signupview$2f$SignupForm$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/signupview/SignupForm.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$accessTokenShare$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/accessTokenShare.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$authSession$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/authSession.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
const ff = "'Inter', 'Segoe UI', Arial, sans-serif";
const metallicGradient = "linear-gradient(135deg, #f7e7b2 0%, #d4af37 28%, #f4f4f5 52%, #a3a3a3 74%, #fff5cf 100%)";
function SignupViewPage() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SignupViewPage.useEffect": ()=>{
            // TODO: reativar verificação do devauthgate em produção
            // const t = getDevSessionToken();
            // if (!t) router.replace("/devauthgate");
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$accessTokenShare$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ensureSharedAccessToken"])();
        }
    }["SignupViewPage.useEffect"], [
        router
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SignupViewPage.useEffect": ()=>{
            if (pathname !== "/signupview") return;
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$authSession$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clearAuthSessionToken"])();
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$accessTokenShare$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clearSharedAccessToken"])();
        }
    }["SignupViewPage.useEffect"], [
        pathname
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            fontFamily: ff,
            minHeight: "100vh",
            display: "flex",
            backgroundImage: "none",
            backgroundColor: "#fff"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    background: metallicGradient,
                    padding: "3rem",
                    width: "50%",
                    flexDirection: "column",
                    justifyContent: "space-between"
                },
                className: "hidden lg:flex",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            border: "2px solid rgba(255,255,255,0.92)",
                            borderRadius: 24,
                            background: "rgba(255,255,255,0.06)",
                            padding: "2rem",
                            display: "flex",
                            flexDirection: "column",
                            gap: "2rem"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexDirection: "column",
                                    gap: "1rem",
                                    textAlign: "center"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            width: 168,
                                            height: 168,
                                            borderRadius: 24,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            overflow: "hidden",
                                            boxShadow: "0 18px 40px rgba(15, 23, 42, 0.4)",
                                            border: "1px solid rgba(255,255,255,0.35)"
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            src: "/Firefly_Gemini Flash_Consegue melhorar o logo da bolsa FAI para que fique com gradiente metalico do logo S 3787887.png",
                                            alt: "Logo metálico oficial da FAI",
                                            width: 168,
                                            height: 168,
                                            style: {
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "cover"
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/app/signupview/page.tsx",
                                            lineNumber: 37,
                                            columnNumber: 29
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/signupview/page.tsx",
                                        lineNumber: 36,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                color: "#fff",
                                                fontSize: "1.5rem",
                                                fontWeight: 600,
                                                fontFamily: ff
                                            },
                                            children: "Create a new account in minutes!"
                                        }, void 0, false, {
                                            fileName: "[project]/app/signupview/page.tsx",
                                            lineNumber: 46,
                                            columnNumber: 29
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/signupview/page.tsx",
                                        lineNumber: 45,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/signupview/page.tsx",
                                lineNumber: 35,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: "2.25rem",
                                            fontWeight: 600,
                                            color: "#fff",
                                            marginBottom: "1.5rem",
                                            lineHeight: 1.3,
                                            fontFamily: ff
                                        },
                                        children: [
                                            "Comece sua jornada",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                                fileName: "[project]/app/signupview/page.tsx",
                                                lineNumber: 50,
                                                columnNumber: 169
                                            }, this),
                                            "de estilo hoje"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/signupview/page.tsx",
                                        lineNumber: 50,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        style: {
                                            color: "rgba(255,255,255,0.85)",
                                            fontSize: "1.125rem",
                                            marginBottom: "2rem",
                                            fontFamily: ff
                                        },
                                        children: "Junte-se a milhares de usuários que transformaram sua forma de se vestir com a ajuda da IA."
                                    }, void 0, false, {
                                        fileName: "[project]/app/signupview/page.tsx",
                                        lineNumber: 51,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: "grid",
                                            gridTemplateColumns: "1fr 1fr 1fr",
                                            gap: "1rem",
                                            textAlign: "center"
                                        },
                                        children: [
                                            [
                                                "10k+",
                                                "Usuários"
                                            ],
                                            [
                                                "50k+",
                                                "Looks Criados"
                                            ],
                                            [
                                                "4.9",
                                                "Avaliação"
                                            ]
                                        ].map(([num, label])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            fontSize: "1.875rem",
                                                            fontWeight: 600,
                                                            color: "#fff",
                                                            fontFamily: ff
                                                        },
                                                        children: num
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/signupview/page.tsx",
                                                        lineNumber: 55,
                                                        columnNumber: 37
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            color: "rgba(255,255,255,0.75)",
                                                            fontSize: "0.875rem",
                                                            fontFamily: ff
                                                        },
                                                        children: label
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/signupview/page.tsx",
                                                        lineNumber: 56,
                                                        columnNumber: 37
                                                    }, this)
                                                ]
                                            }, label, true, {
                                                fileName: "[project]/app/signupview/page.tsx",
                                                lineNumber: 54,
                                                columnNumber: 33
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/app/signupview/page.tsx",
                                        lineNumber: 52,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/signupview/page.tsx",
                                lineNumber: 49,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/signupview/page.tsx",
                        lineNumber: 34,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            color: "rgba(255,255,255,0.5)",
                            fontSize: "0.875rem",
                            fontFamily: ff
                        },
                        children: "© 2026 Fashion AI. Todos os direitos reservados."
                    }, void 0, false, {
                        fileName: "[project]/app/signupview/page.tsx",
                        lineNumber: 62,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/signupview/page.tsx",
                lineNumber: 33,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    flex: 1,
                    backgroundColor: "#f8fafc",
                    position: "relative",
                    overflow: "hidden",
                    backgroundImage: "url(/Firefly_Gemini Flash_Crie ideias de background muito bons para um novo website de moda, usando uma rede de 3787887.png)",
                    backgroundSize: "cover",
                    backgroundPosition: "center"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        src: "/Fart.png",
                        alt: "Fashion AI network background",
                        fill: true,
                        priority: true,
                        style: {
                            objectFit: "cover"
                        }
                    }, void 0, false, {
                        fileName: "[project]/app/signupview/page.tsx",
                        lineNumber: 67,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            position: "relative",
                            zIndex: 1,
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "2rem",
                            overflowY: "auto",
                            overflowX: "hidden"
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                width: "100%",
                                maxWidth: 448
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>router.push("/authview"),
                                    style: {
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "0.5rem",
                                        color: "#6b7280",
                                        background: "none",
                                        border: "none",
                                        cursor: "pointer",
                                        marginBottom: "2rem",
                                        fontSize: "0.875rem",
                                        fontFamily: ff
                                    },
                                    children: "← Voltar para login"
                                }, void 0, false, {
                                    fileName: "[project]/app/signupview/page.tsx",
                                    lineNumber: 89,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        background: "#fff",
                                        border: "2px solid #000",
                                        borderRadius: 24,
                                        padding: "2rem"
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                marginBottom: "2rem"
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                    style: {
                                                        fontSize: "1.5rem",
                                                        fontWeight: 600,
                                                        color: "#111827",
                                                        marginBottom: "0.5rem",
                                                        fontFamily: ff
                                                    },
                                                    children: "Criar sua conta"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/signupview/page.tsx",
                                                    lineNumber: 94,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    style: {
                                                        color: "#6b7280",
                                                        fontFamily: ff
                                                    },
                                                    children: "Preencha os dados abaixo para começar"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/signupview/page.tsx",
                                                    lineNumber: 95,
                                                    columnNumber: 33
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/signupview/page.tsx",
                                            lineNumber: 93,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$signupview$2f$SignupForm$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                            fileName: "[project]/app/signupview/page.tsx",
                                            lineNumber: 97,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            style: {
                                                textAlign: "center",
                                                fontSize: "0.875rem",
                                                color: "#6b7280",
                                                marginTop: "2rem",
                                                fontFamily: ff
                                            },
                                            children: [
                                                "Já tem uma conta?",
                                                " ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>router.push("/authview"),
                                                    style: {
                                                        color: "#7c3aed",
                                                        background: "none",
                                                        border: "none",
                                                        cursor: "pointer",
                                                        fontWeight: 500,
                                                        fontFamily: ff
                                                    },
                                                    children: "Fazer login"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/signupview/page.tsx",
                                                    lineNumber: 100,
                                                    columnNumber: 33
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/signupview/page.tsx",
                                            lineNumber: 98,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/signupview/page.tsx",
                                    lineNumber: 92,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/signupview/page.tsx",
                            lineNumber: 88,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/signupview/page.tsx",
                        lineNumber: 74,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/signupview/page.tsx",
                lineNumber: 66,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/signupview/page.tsx",
        lineNumber: 31,
        columnNumber: 9
    }, this);
}
_s(SignupViewPage, "XUemiwTtrXE7KsB9rwseGqqgusE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c = SignupViewPage;
var _c;
__turbopack_context__.k.register(_c, "SignupViewPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=app_7036685c._.js.map