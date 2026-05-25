"use client";

import { type FormEvent, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { clearSharedAccessToken, ensureSharedAccessToken } from "@/app/lib/accessTokenShare";
import { clearAuthSessionToken } from "@/app/lib/authSession";
import { VSModalPaged } from "@/app/lib/authAlerts";

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const pathname = usePathname();

    useEffect(() => { ensureSharedAccessToken(); }, [router]);

    useEffect(() => {
        if (pathname !== "/forgetpasswordview") return;
        clearAuthSessionToken();
        clearSharedAccessToken();
    }, [pathname]);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (submitting) return;
        const normalizedEmail = email.trim().toLowerCase();
        if (!normalizedEmail) {
            void VSModalPaged({ title: "E-mail obrigatório", messages: ["Informe seu e-mail para continuar."], tone: "error" });
            return;
        }
        setSubmitting(true);
        try {
            const response = await fetch("/api/auth/reset", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: normalizedEmail }),
            });
            if (!response.ok) {
                const data = (await response.json().catch(() => null)) as { error?: string } | null;
                void VSModalPaged({ title: "Erro", messages: [data?.error ?? "Não foi possível enviar o e-mail de redefinição."], tone: "error" });
                return;
            }
            void VSModalPaged({ title: "E-mail enviado", messages: ["Verifique sua caixa de entrada para o link de redefinição."], tone: "success" });
            router.replace("/authview");
        } catch {
            void VSModalPaged({ title: "Erro inesperado", messages: ["Não foi possível enviar o e-mail agora."], tone: "error" });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div style={{
            minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center",
            background:"var(--background)", fontFamily:"'Inter','Segoe UI',Arial,sans-serif", padding:"1.5rem"
        }}>
            <div style={{ width:"100%", maxWidth:"26rem" }}>
                {/* Logo */}
                <div style={{ display:"flex", alignItems:"center", gap:"0.75rem", marginBottom:"2rem", justifyContent:"center" }}>
                    <div style={{ width:"3rem", height:"3rem", borderRadius:"0.875rem", background:"linear-gradient(135deg,#7c3aed,#db2777)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="white" strokeWidth="1.8">
                            <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z"/>
                        </svg>
                    </div>
                    <div>
                        <div style={{ fontSize:"1.25rem", fontWeight:800 }}>Fashion AI</div>
                        <div style={{ fontSize:"0.75rem", color:"var(--muted-foreground)" }}>Seu estilista pessoal</div>
                    </div>
                </div>

                <div style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:"1rem", padding:"2rem", boxShadow:"0 4px 20px rgba(0,0,0,0.08)" }}>
                    {/* Email icon */}
                    <div style={{ width:"4rem", height:"4rem", borderRadius:"1rem", background:"linear-gradient(135deg,rgba(124,58,237,0.12),rgba(219,39,119,0.10))", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 1.5rem" }}>
                        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#7c3aed" strokeWidth="1.8">
                            <rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/>
                        </svg>
                    </div>

                    <h2 style={{ fontSize:"1.5rem", fontWeight:800, textAlign:"center", marginBottom:"0.5rem" }}>Esqueceu sua senha?</h2>
                    <p style={{ color:"var(--muted-foreground)", textAlign:"center", fontSize:"0.9rem", marginBottom:"1.75rem" }}>
                        Informe seu e-mail e enviaremos um link para redefinir sua senha.
                    </p>

                    <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:"1.25rem" }}>
                        <div>
                            <label style={{ display:"block", fontSize:"0.875rem", fontWeight:600, marginBottom:"0.5rem", color:"var(--foreground)" }}>
                                E-mail
                            </label>
                            <div style={{ position:"relative" }}>
                                <span style={{ position:"absolute", left:"1rem", top:"50%", transform:"translateY(-50%)", color:"var(--muted-foreground)", pointerEvents:"none" }}>
                                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
                                        <rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/>
                                    </svg>
                                </span>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="seu@email.com"
                                    required
                                    style={{ width:"100%", padding:"0.875rem 1rem 0.875rem 3rem", backgroundColor:"var(--input-background)", borderRadius:"0.625rem", border:"1px solid var(--border)", outline:"none", color:"var(--foreground)", fontSize:"1rem", boxSizing:"border-box" }}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            style={{ width:"100%", padding:"0.875rem", borderRadius:"0.625rem", border:"none", background:"linear-gradient(135deg,#7c3aed,#db2777)", color:"#fff", fontWeight:700, fontSize:"1rem", cursor:"pointer", opacity: submitting ? 0.7 : 1, transition:"opacity .15s" }}
                        >
                            {submitting ? "Enviando..." : "Enviar link de redefinição"}
                        </button>
                    </form>

                    <div style={{ marginTop:"1.5rem", textAlign:"center" }}>
                        <button
                            onClick={() => router.push("/authview")}
                            style={{ color:"#7c3aed", background:"none", border:"none", cursor:"pointer", fontWeight:700, fontSize:"0.875rem", display:"inline-flex", alignItems:"center", gap:"0.375rem" }}
                        >
                            ← Voltar para login
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
