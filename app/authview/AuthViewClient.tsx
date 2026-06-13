"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { VSModalPaged } from "@/app/lib/authAlerts";
import { clearAuthSessionToken, setAuthSessionProfile, setAuthSessionToken } from "@/app/lib/authSession";
import { setDevSessionToken } from "@/app/lib/devSession";
import { clearSharedAccessToken, ensureSharedAccessToken, setSharedAccessData } from "@/app/lib/accessTokenShare";
import {
    extractOAuthErrorDetails,
    resolveOAuthUserMessage,
    signInWithFacebook,
    signInWithGoogle,
    signInWithGoogleRedirect,
} from "@/app/auth";
import { ensureSavedPageBackgroundConfig } from "@/app/lib/pageBackground";
import { firebaseAuthGate } from "@/app/gate/firebaseClient";
import {
    browserLocalPersistence,
    browserSessionPersistence,
    fetchSignInMethodsForEmail,
    getAuth,
    setPersistence,
    signInWithEmailAndPassword,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";

const REMEMBERED_EMAIL_KEY = "rememberedEmail";
const SKIPPABLE_FIREBASE_ERROR_CODES = new Set([
    "auth/api-key-not-valid.-please-pass-a-valid-api-key.",
    "auth/invalid-api-key",
    "auth/network-request-failed",
    "auth/configuration-not-found",
    "auth/app-deleted",
    "auth/app-not-authorized",
]);
const BRAND_LOGO_SRC = "/80A950EF-F93D-4C1B-89B8-17490D321F97_1_105_c.jpeg";

const normalizeFirebaseErrorCode = (error: unknown): string => {
    const maybeAuthError = error as Partial<FirebaseError> | null;
    return (maybeAuthError?.code ?? "").trim().toLowerCase();
};

const shouldSkipFirebaseSignIn = (error: unknown): boolean => {
    const normalizedCode = normalizeFirebaseErrorCode(error);
    return SKIPPABLE_FIREBASE_ERROR_CODES.has(normalizedCode);
};

/* ── Inline SVG Icons ── */
const EyeOpen = () => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
);
const EyeClosed = () => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
        <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
);
const SparklesIcon = () => (
    <Image src={BRAND_LOGO_SRC} alt="Fashion AI" width={768} height={768} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '0.75rem' }} />
);
const MailIcon = () => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/>
    </svg>
);
const LockIcon = () => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
);
const GoogleIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
);

export default function AuthViewClient() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [showForgotModal, setShowForgotModal] = useState(false);
    const [forgotEmail, setForgotEmail] = useState("");
    const [submittingForgot, setSubmittingForgot] = useState(false);
    const [socialSubmitting, setSocialSubmitting] = useState<"google" | "facebook" | null>(null);
    const [socialErrorMessage, setSocialErrorMessage] = useState("");
    const [emailLoginErrorMessage, setEmailLoginErrorMessage] = useState("");
    const { firebaseApp, hasFirebaseConfig } = firebaseAuthGate();

    useEffect(() => { ensureSharedAccessToken(); }, [router]);

    const didClearOnMount = useRef(false);
    useEffect(() => {
        if (didClearOnMount.current) return;
        didClearOnMount.current = true;
        clearAuthSessionToken();
        clearSharedAccessToken();
    }, []);

    useEffect(() => {
        if (typeof window === "undefined") return;
        const savedEmail = window.localStorage.getItem(REMEMBERED_EMAIL_KEY);
        if (!savedEmail) return;
        setEmail(savedEmail);
        setRememberMe(true);
    }, []);

    const setFirebasePersistenceMode = async (): Promise<"LOCAL" | "SESSION"> => {
        if (!firebaseApp || !hasFirebaseConfig) return "SESSION";
        const auth = getAuth(firebaseApp);
        try {
            if (rememberMe) { await setPersistence(auth, browserLocalPersistence); return "LOCAL"; }
            await setPersistence(auth, browserSessionPersistence);
            return "SESSION";
        } catch { return "SESSION"; }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (submitting) return;
        setSubmitting(true);
        setEmailLoginErrorMessage("");
        const normalizedEmail = email.trim().toLowerCase();
        const normalizedPassword = password;
        if (!normalizedEmail || !normalizedPassword) {
            setSubmitting(false);
            setEmailLoginErrorMessage("E-mail e senha são obrigatórios.");
            void VSModalPaged({ title: "Dados obrigatórios", messages: ["Informe seu e-mail e sua senha para continuar."], tone: "error" });
            return;
        }
        try {
            await setFirebasePersistenceMode();
            let firebaseIdToken = "";
            if (firebaseApp && hasFirebaseConfig) {
                const auth = getAuth(firebaseApp);
                try {
                    const credential = await signInWithEmailAndPassword(auth, normalizedEmail, normalizedPassword);
                    firebaseIdToken = await credential.user.getIdToken(true);
                } catch (error: unknown) {
                    const firebaseError = error instanceof FirebaseError ? error : null;
                    const errorCode = firebaseError?.code ?? "auth/unknown";
                    let signInMethods: string[] = [];
                    try { signInMethods = await fetchSignInMethodsForEmail(getAuth(firebaseApp), normalizedEmail); } catch {}
                    const invalidCreds = new Set(["auth/invalid-credential","auth/wrong-password","auth/user-not-found","auth/invalid-login-credentials"]);
                    const hasPasswordProvider = signInMethods.includes("password");
                    const hasSocialOnly = signInMethods.some(m => m !== "password") && !hasPasswordProvider;
                    let userMessage = "Não foi possível autenticar no momento.";
                    if (invalidCreds.has(errorCode)) {
                        userMessage = hasSocialOnly ? "Esta conta foi criada com login social. Use Google ou redefina sua senha." : "E-mail ou senha inválidos.";
                    }
                    setEmailLoginErrorMessage(userMessage);
                    void VSModalPaged({ title: "Falha no login", messages: [userMessage], tone: "error" });
                    setSubmitting(false);
                    return;
                }
            }
            const response = await fetch("/api/auth/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: normalizedEmail, password: normalizedPassword, idToken: firebaseIdToken }),
            });
            if (!response.ok) {
                const data = (await response.json().catch(() => null)) as { error?: string } | null;
                const userMessage = response.status === 401 ? "E-mail ou senha inválidos." : (data?.error ?? "Não foi possível validar suas credenciais agora.");
                setEmailLoginErrorMessage(userMessage);
                void VSModalPaged({ title: "Acesso negado", messages: [userMessage], tone: "error" });
                setSubmitting(false);
                return;
            }
            const payload = (await response.json().catch(() => null)) as { profile?: { user_id?: string; name?: string; email?: string } } | null;
            const token = crypto.randomUUID();
            const profile = {
                user_id: payload?.profile?.user_id?.trim() || "",
                name: payload?.profile?.name?.trim() || "",
                email: payload?.profile?.email?.trim().toLowerCase() || normalizedEmail,
            };
            setAuthSessionToken(token);
            setAuthSessionProfile(profile);
            setDevSessionToken(token);
            setSharedAccessData({ token, profile });
            if (rememberMe) window.localStorage.setItem(REMEMBERED_EMAIL_KEY, normalizedEmail);
            else window.localStorage.removeItem(REMEMBERED_EMAIL_KEY);
            ensureSavedPageBackgroundConfig();
            router.replace("/home");
        } catch {
            setEmailLoginErrorMessage("Não foi possível validar suas credenciais agora.");
            void VSModalPaged({ title: "Erro inesperado", messages: ["Não foi possível validar suas credenciais agora."], tone: "error" });
            setSubmitting(false);
        }
    };

    const handleForgotSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (submittingForgot) return;
        const normalizedEmail = forgotEmail.trim().toLowerCase();
        if (!normalizedEmail) {
            void VSModalPaged({ title: "E-mail obrigatório", messages: ["Informe seu e-mail para continuar."], tone: "error" });
            return;
        }
        setSubmittingForgot(true);
        try {
            const response = await fetch("/api/auth/reset", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: normalizedEmail }) });
            if (!response.ok) {
                const data = (await response.json().catch(() => null)) as { error?: string } | null;
                void VSModalPaged({ title: "Erro no reset", messages: [data?.error ?? "Não foi possível enviar o link agora."], tone: "error" });
                return;
            }
            void VSModalPaged({ title: "Verifique seu e-mail", messages: ["Enviamos um link de redefinição para o seu e-mail."], tone: "success" });
            setShowForgotModal(false);
            setForgotEmail("");
        } catch {
            void VSModalPaged({ title: "Erro inesperado", messages: ["Não foi possível enviar o e-mail de redefinição agora."], tone: "error" });
        } finally { setSubmittingForgot(false); }
    };

    const handleSocialSignIn = async (provider: "google" | "facebook") => {
        if (socialSubmitting) return;
        setSocialSubmitting(provider);
        setSocialErrorMessage("");
        try {
            await setFirebasePersistenceMode();
            const credential = provider === "google" ? await signInWithGoogle() : await signInWithFacebook();
            const user = credential.user;
            const uid = user.uid;
            const normalizedEmail = user.email?.trim().toLowerCase() || "";
            const normalizedName = user.displayName?.trim() || "Usuário";
            const idToken = await user.getIdToken(true);
            const syncResponse = await fetch("/api/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ uid, email: normalizedEmail, name: normalizedName, provider, idToken }),
            });
            const syncPayload = (await syncResponse.json().catch(() => null)) as { ok?: boolean; profile?: { user_id?: string; name?: string; email?: string }; error?: string } | null;
            if (!syncResponse.ok || !syncPayload?.ok) throw new Error(syncPayload?.error ?? "Social profile sync failed.");
            const token = crypto.randomUUID();
            const profile = {
                user_id: syncPayload.profile?.user_id?.trim() || uid,
                name: syncPayload.profile?.name?.trim() || normalizedName,
                email: syncPayload.profile?.email?.trim().toLowerCase() || normalizedEmail,
            };
            setAuthSessionToken(token);
            setAuthSessionProfile(profile);
            setDevSessionToken(token);
            setSharedAccessData({ token, profile });
            ensureSavedPageBackgroundConfig();
            router.replace("/home");
        } catch (error: unknown) {
            const oauthError = extractOAuthErrorDetails(error);
            if (provider === "google" && oauthError.code === "auth/popup-blocked") {
                try { await signInWithGoogleRedirect(); return; } catch {}
            }
            if (shouldSkipFirebaseSignIn(error)) { setSocialSubmitting(null); return; }
            const userMessage = resolveOAuthUserMessage(error, "Não foi possível entrar com Google.");
            setSocialErrorMessage(userMessage);
            void VSModalPaged({ title: "Falha no login social", messages: [userMessage], tone: "error" });
        } finally { setSocialSubmitting(null); }
    };

    /* ── Styles ── */
    const s = {
        page: { display:"flex", minHeight:"100vh", fontFamily:"'Inter','Segoe UI',Arial,sans-serif" } as React.CSSProperties,
        left: {
            display:"flex", flexDirection:"column" as const, justifyContent:"space-between",
            width:"50%", padding:"3rem", background:"linear-gradient(135deg,#7c3aed 0%,#9333ea 40%,#db2777 100%)",
            color:"#fff"
        } as React.CSSProperties,
        right: { flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:"2rem", background:"var(--background)" } as React.CSSProperties,
        card: { width:"100%", maxWidth:"28rem" } as React.CSSProperties,
        input: { width:"100%", padding:"0.875rem 1rem 0.875rem 3rem", backgroundColor:"var(--input-background)", borderRadius:"0.625rem", border:"1px solid var(--border)", outline:"none", color:"var(--foreground)", fontSize:"1rem", boxSizing:"border-box" as const },
        btn: { width:"100%", padding:"0.875rem", borderRadius:"0.625rem", border:"none", background:"linear-gradient(135deg,#7c3aed,#db2777)", color:"#fff", fontWeight:700, fontSize:"1rem", cursor:"pointer", transition:"opacity .15s" } as React.CSSProperties,
        socialBtn: { flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:"0.5rem", padding:"0.75rem 1rem", borderRadius:"0.625rem", border:"1px solid var(--border)", background:"var(--card)", color:"var(--foreground)", cursor:"pointer", fontSize:"0.875rem", fontWeight:600, transition:"background .15s" } as React.CSSProperties,
    };

    return (
        <div style={s.page}>
            {/* ── Left branding panel (desktop only) ── */}
            <div style={{ ...s.left, display: undefined }} className="hidden lg:flex" >
                {/* Logo */}
                <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"1rem", textAlign:"center" }}>
                    {/* 250px → 750px (3×) */}
                    <div style={{ width:"750px", height:"750px", borderRadius:"1rem", background:"rgba(255,255,255,0.2)", backdropFilter:"blur(8px)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, overflow:"hidden" }}>
                        <SparklesIcon />
                    </div>
                    <div>
                        <div style={{ fontSize:"1.5rem", fontWeight:800, lineHeight:1.1 }}>Fashion AI</div>
                        <div style={{ fontSize:"0.875rem", color:"rgba(255,255,255,0.8)" }}>Seu estilista pessoal</div>
                    </div>
                </div>

                {/* Hero text */}
                <div>
                    <h2 style={{ fontSize:"2.5rem", fontWeight:800, lineHeight:1.15, marginBottom:"1.5rem", color:"#fff" }}>
                        Organize seu estilo<br />com inteligência artificial
                    </h2>
                    <p style={{ fontSize:"1.1rem", color:"rgba(255,255,255,0.85)", marginBottom:"2rem" }}>
                        Crie combinações perfeitas, gerencie seu guarda-roupa e descubra seu estilo único com a ajuda da IA.
                    </p>
                    <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
                        {[
                            { emoji:"✨", text:"Sugestões inteligentes de looks" },
                            { emoji:"👔", text:"Guarda-roupa digital organizado" },
                            { emoji:"🎨", text:"Visualização em manequim 3D" },
                        ].map(item => (
                            <div key={item.text} style={{ display:"flex", alignItems:"center", gap:"0.875rem" }}>
                                <div style={{ width:"2.5rem", height:"2.5rem", borderRadius:"0.625rem", background:"rgba(255,255,255,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.25rem", flexShrink:0 }}>{item.emoji}</div>
                                <span style={{ color:"rgba(255,255,255,0.9)", fontSize:"0.95rem" }}>{item.text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ color:"rgba(255,255,255,0.5)", fontSize:"0.75rem" }}>© 2026 Fashion AI. Todos os direitos reservados.</div>
            </div>

            {/* ── Right form panel ── */}
            <div style={s.right}>
                <div style={s.card}>
                    {/* Brand header */}
                    <div style={{ display:"flex", alignItems:"center", gap:"0.875rem", marginBottom:"1.5rem" }}>
                        {/* 3.5rem → 10.5rem (3×) */}
                        <div style={{ width:"10.5rem", height:"10.5rem", borderRadius:"1rem", background:"linear-gradient(135deg,#7c3aed,#db2777)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, overflow:"hidden" }}>
                            <Image src={BRAND_LOGO_SRC} alt="Fashion AI" width={168} height={168} style={{ width:"100%", height:"100%", objectFit:"cover", borderRadius:"1rem" }} />
                        </div>
                        <div>
                            <div style={{ fontSize:"1.25rem", fontWeight:800, lineHeight:1.1, color:"var(--foreground)" }}>Fashion AI</div>
                            <div style={{ fontSize:"0.8125rem", color:"var(--muted-foreground)" }}>Seu estilista pessoal</div>
                        </div>
                    </div>
                    <div style={{ marginBottom:"2rem" }}>
                        <h2 style={{ fontSize:"1.75rem", fontWeight:800, marginBottom:"0.5rem" }}>Bem-vindo de volta</h2>
                        <p style={{ color:"var(--muted-foreground)", fontSize:"0.9375rem" }}>Entre com suas credenciais para acessar sua conta</p>
                    </div>

                    {/* Error message */}
                    {emailLoginErrorMessage && (
                        <div style={{ marginBottom:"1rem", padding:"0.75rem 1rem", borderRadius:"0.625rem", background:"#fef2f2", border:"1px solid #fecaca", color:"#dc2626", fontSize:"0.875rem" }}>
                            {emailLoginErrorMessage}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:"1.25rem" }}>
                        {/* Email */}
                        <div>
                            <label style={{ display:"block", fontSize:"0.875rem", fontWeight:600, marginBottom:"0.5rem", color:"var(--foreground)" }}>E-mail</label>
                            <div style={{ position:"relative" }}>
                                <span style={{ position:"absolute", left:"1rem", top:"50%", transform:"translateY(-50%)", color:"var(--muted-foreground)", pointerEvents:"none" }}><MailIcon /></span>
                                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="seu@email.com" required style={s.input} />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label style={{ display:"block", fontSize:"0.875rem", fontWeight:600, marginBottom:"0.5rem", color:"var(--foreground)" }}>Senha</label>
                            <div style={{ position:"relative" }}>
                                <span style={{ position:"absolute", left:"1rem", top:"50%", transform:"translateY(-50%)", color:"var(--muted-foreground)", pointerEvents:"none" }}><LockIcon /></span>
                                <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required style={{ ...s.input, paddingRight:"3rem" }} />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position:"absolute", right:"1rem", top:"50%", transform:"translateY(-50%)", background:"none", border:"none", color:"var(--muted-foreground)", cursor:"pointer", padding:0 }}>
                                    {showPassword ? <EyeClosed /> : <EyeOpen />}
                                </button>
                            </div>
                        </div>

                        {/* Remember me + forgot */}
                        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                            <label style={{ display:"flex", alignItems:"center", gap:"0.5rem", cursor:"pointer", fontSize:"0.875rem" }}>
                                <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} style={{ width:"1rem", height:"1rem" }} />
                                Lembrar de mim
                            </label>
                            <button type="button" onClick={() => setShowForgotModal(true)} style={{ background:"none", border:"none", color:"#7c3aed", fontSize:"0.875rem", fontWeight:600, cursor:"pointer" }}>
                                Esqueceu a senha?
                            </button>
                        </div>

                        {/* Submit */}
                        <button type="submit" disabled={submitting} style={{ ...s.btn, opacity: submitting ? 0.7 : 1 }}>
                            {submitting ? "Entrando..." : "Entrar"}
                        </button>

                        {/* Divider */}
                        <div style={{ position:"relative", display:"flex", alignItems:"center", gap:"1rem" }}>
                            <div style={{ flex:1, height:"1px", background:"var(--border)" }} />
                            <span style={{ fontSize:"0.8125rem", color:"var(--muted-foreground)", whiteSpace:"nowrap" }}>Ou continue com</span>
                            <div style={{ flex:1, height:"1px", background:"var(--border)" }} />
                        </div>

                        {/* Social */}
                        {socialErrorMessage && (
                            <div style={{ padding:"0.75rem", borderRadius:"0.5rem", background:"#fef2f2", border:"1px solid #fecaca", color:"#dc2626", fontSize:"0.8125rem" }}>{socialErrorMessage}</div>
                        )}
                        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.75rem" }}>
                            <button type="button" onClick={() => handleSocialSignIn("google")} disabled={!!socialSubmitting} style={{ ...s.socialBtn, opacity: socialSubmitting === "google" ? 0.7 : 1 }}>
                                <GoogleIcon />
                                {socialSubmitting === "google" ? "..." : "Google"}
                            </button>
                            <button type="button" onClick={() => handleSocialSignIn("facebook")} disabled={!!socialSubmitting} style={{ ...s.socialBtn, opacity: socialSubmitting === "facebook" ? 0.7 : 1 }}>
                                <svg width="18" height="18" fill="#1877f2" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                                {socialSubmitting === "facebook" ? "..." : "Facebook"}
                            </button>
                        </div>
                    </form>

                    {/* Sign up link */}
                    <p style={{ textAlign:"center", fontSize:"0.875rem", color:"var(--muted-foreground)", marginTop:"2rem" }}>
                        Não tem uma conta?{" "}
                        <a href="/signupview" style={{ color:"#7c3aed", fontWeight:700, textDecoration:"none" }}>Criar conta</a>
                    </p>
                </div>
            </div>

            {/* ── Forgot password modal ── */}
            {showForgotModal && (
                <div style={{ position:"fixed", inset:0, zIndex:100, background:"rgba(0,0,0,0.5)", backdropFilter:"blur(6px)", display:"flex", alignItems:"center", justifyContent:"center", padding:"1rem" }}>
                    <div style={{ background:"var(--card)", borderRadius:"1rem", border:"1px solid var(--border)", padding:"2rem", maxWidth:"26rem", width:"100%", boxShadow:"0 20px 60px rgba(0,0,0,0.2)" }}>
                        <h3 style={{ marginBottom:"0.5rem", fontSize:"1.25rem", fontWeight:700 }}>Redefinir senha</h3>
                        <p style={{ color:"var(--muted-foreground)", fontSize:"0.875rem", marginBottom:"1.5rem" }}>Informe seu e-mail e enviaremos um link de redefinição.</p>
                        <form onSubmit={handleForgotSubmit} style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
                            <input type="email" value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} placeholder="seu@email.com" required style={{ width:"100%", padding:"0.875rem 1rem", backgroundColor:"var(--input-background)", borderRadius:"0.625rem", border:"1px solid var(--border)", outline:"none", color:"var(--foreground)", fontSize:"1rem", boxSizing:"border-box" as const }} />
                            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.75rem" }}>
                                <button type="button" onClick={() => setShowForgotModal(false)} style={{ padding:"0.75rem", borderRadius:"0.625rem", border:"1px solid var(--border)", background:"var(--accent)", color:"var(--foreground)", cursor:"pointer", fontWeight:600 }}>
                                    Cancelar
                                </button>
                                <button type="submit" disabled={submittingForgot} style={{ padding:"0.75rem", borderRadius:"0.625rem", border:"none", background:"linear-gradient(135deg,#7c3aed,#db2777)", color:"#fff", cursor:"pointer", fontWeight:700, opacity: submittingForgot ? 0.7 : 1 }}>
                                    {submittingForgot ? "Enviando..." : "Enviar link"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
