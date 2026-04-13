"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { VSModalPaged } from "@/app/lib/authAlerts";
import { clearAuthSessionToken, setAuthSessionProfile, setAuthSessionToken } from "@/app/lib/authSession";
import { getDevSessionToken, setDevSessionToken } from "@/app/lib/devSession";
import { clearSharedAccessToken, ensureSharedAccessToken, setSharedAccessData } from "@/app/lib/accessTokenShare";

const ff = "'Inter', 'Segoe UI', Arial, sans-serif";

const EyeIcon = ({ open }: { open: boolean }) => open ? (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
) : (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
);

export default function AuthViewClient() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        // TODO: reativar verificação do devauthgate em produção
        // const t = getDevSessionToken();
        // if (!t) router.replace("/devauthgate");
        ensureSharedAccessToken();
    }, [router]);

    useEffect(() => {
        if (pathname !== "/authview") return;
        clearAuthSessionToken();
        clearSharedAccessToken();
    }, [pathname]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (submitting) return;
        setSubmitting(true);
        const normalizedEmail = email.trim().toLowerCase();
        const normalizedPassword = password.trim();
        if (!normalizedEmail || !normalizedPassword) {
            setSubmitting(false);
            void VSModalPaged({ title: "Missing credentials", messages: ["Please enter your email and password."], tone: "error" });
            return;
        }
        try {
            const response = await fetch("/api/auth/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: normalizedEmail, password: normalizedPassword }),
            });
            if (!response.ok) {
                const data = (await response.json().catch(() => null)) as { error?: string } | null;
                void VSModalPaged({ title: "Access denied", messages: [data?.error ?? "No account was found with these credentials."], tone: "error" });
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
            router.replace("/home");
        } catch {
            void VSModalPaged({ title: "Unexpected error", messages: ["Unable to verify credentials right now."], tone: "error" });
            setSubmitting(false);
        }
    };

    const inputStyle: React.CSSProperties = {
        width: "100%", padding: "12px 16px", backgroundColor: "#f9fafb", borderRadius: 8,
        border: "1px solid #e5e7eb", outline: "none", color: "#111827", fontSize: "1rem",
        fontFamily: ff, boxSizing: "border-box",
    };

    return (
        <div style={{ fontFamily: ff, minHeight: "100vh", display: "flex", backgroundImage: "none", backgroundColor: "#fff" }}>
            {/* Left - Branding */}
            <div style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7, #ec4899)", padding: "3rem", width: "50%", flexDirection: "column", justifyContent: "space-between" }} className="hidden lg:flex">
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <div style={{ width: 48, height: 48, background: "rgba(255,255,255,0.2)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontSize: "1.5rem" }}>✨</span>
                    </div>
                    <div>
                        <div style={{ color: "#fff", fontSize: "1.5rem", fontWeight: 600, fontFamily: ff }}>Fashion AI</div>
                        <div style={{ color: "rgba(255,255,255,0.85)", fontSize: "0.875rem", fontFamily: ff }}>Seu estilista pessoal</div>
                    </div>
                </div>
                <div>
                    <div style={{ fontSize: "2.25rem", fontWeight: 600, color: "#fff", marginBottom: "1.5rem", lineHeight: 1.3, fontFamily: ff }}>Organize seu estilo<br />com inteligência artificial</div>
                    <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "1.125rem", marginBottom: "2rem", fontFamily: ff }}>Crie combinações perfeitas, gerencie seu guarda-roupa e descubra seu estilo único com a ajuda da IA.</p>
                    {[["✨", "Sugestões inteligentes de looks"], ["👔", "Guarda-roupa digital organizado"], ["🎨", "Visualização em manequim 3D"]].map(([icon, text]) => (
                        <div key={text} style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                            <div style={{ width: 40, height: 40, background: "rgba(255,255,255,0.2)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                <span style={{ fontSize: "1.25rem" }}>{icon}</span>
                            </div>
                            <p style={{ color: "rgba(255,255,255,0.9)", fontFamily: ff }}>{text}</p>
                        </div>
                    ))}
                </div>
                <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.875rem", fontFamily: ff }}>© 2026 Fashion AI. Todos os direitos reservados.</div>
            </div>

            {/* Right - Form */}
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", backgroundColor: "#fff" }}>
                <div style={{ width: "100%", maxWidth: 448 }}>
                    <div style={{ marginBottom: "2rem" }}>
                        <h2 style={{ fontSize: "1.5rem", fontWeight: 600, color: "#111827", marginBottom: "0.5rem", fontFamily: ff }}>Bem-vindo de volta</h2>
                        <p style={{ color: "#6b7280", fontFamily: ff }}>Entre com suas credenciais para acessar sua conta</p>
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                        <div>
                            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, color: "#374151", marginBottom: "0.5rem", fontFamily: ff }}>E-mail</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" required style={{ ...inputStyle, paddingLeft: 16 }} />
                        </div>

                        <div>
                            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, color: "#374151", marginBottom: "0.5rem", fontFamily: ff }}>Senha</label>
                            <div style={{ position: "relative" }}>
                                <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required style={{ ...inputStyle, paddingRight: 48 }} />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: 0, display: "flex" }}>
                                    <EyeIcon open={showPassword} />
                                </button>
                            </div>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontFamily: ff }}>
                                <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} style={{ width: 16, height: 16 }} />
                                <span style={{ fontSize: "0.875rem", color: "#4b5563", fontFamily: ff }}>Lembrar de mim</span>
                            </label>
                            <button type="button" onClick={() => router.push("/forgetpasswordview")} style={{ fontSize: "0.875rem", color: "#7c3aed", background: "none", border: "none", cursor: "pointer", fontWeight: 500, fontFamily: ff }}>
                                Esqueceu a senha?
                            </button>
                        </div>

                        <button type="submit" disabled={submitting} style={{ width: "100%", background: "linear-gradient(to right, #7c3aed, #ec4899)", color: "#fff", padding: "12px", borderRadius: 8, border: "none", cursor: submitting ? "not-allowed" : "pointer", fontSize: "1rem", fontWeight: 500, opacity: submitting ? 0.6 : 1, fontFamily: ff }}>
                            {submitting ? "Entrando..." : "Entrar"}
                        </button>

                        <div style={{ position: "relative", textAlign: "center" }}>
                            <div style={{ borderTop: "1px solid #e5e7eb", position: "absolute", inset: 0, top: "50%" }} />
                            <span style={{ position: "relative", background: "#fff", padding: "0 1rem", color: "#6b7280", fontSize: "0.875rem", fontFamily: ff }}>Ou continue com</span>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                            <button type="button" style={{ padding: "12px 16px", backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", color: "#374151", fontSize: "1rem", fontWeight: 500, cursor: "pointer", fontFamily: ff }}>
                                <svg style={{ width: 20, height: 20 }} viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                                Google
                            </button>
                            <button type="button" style={{ padding: "12px 16px", backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", color: "#1877F2", fontSize: "1rem", fontWeight: 500, cursor: "pointer", fontFamily: ff }}>
                                <svg style={{ width: 20, height: 20 }} fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                                Facebook
                            </button>
                        </div>
                    </form>

                    <p style={{ textAlign: "center", fontSize: "0.875rem", color: "#6b7280", marginTop: "2rem", fontFamily: ff }}>
                        Não tem uma conta?{" "}
                        <button onClick={() => router.push("/signupview")} style={{ color: "#7c3aed", background: "none", border: "none", cursor: "pointer", fontWeight: 500, fontFamily: ff }}>
                            Criar conta
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
