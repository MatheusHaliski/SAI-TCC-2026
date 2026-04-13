"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import SignupForm from "./SignupForm";
import { getDevSessionToken } from "@/app/lib/devSession";
import { clearSharedAccessToken, ensureSharedAccessToken } from "@/app/lib/accessTokenShare";
import { clearAuthSessionToken } from "@/app/lib/authSession";

const ff = "'Inter', 'Segoe UI', Arial, sans-serif";

export default function SignupViewPage() {
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // TODO: reativar verificação do devauthgate em produção
        // const t = getDevSessionToken();
        // if (!t) router.replace("/devauthgate");
        ensureSharedAccessToken();
    }, [router]);

    useEffect(() => {
        if (pathname !== "/signupview") return;
        clearAuthSessionToken();
        clearSharedAccessToken();
    }, [pathname]);

    return (
        <div style={{ fontFamily: ff, minHeight: "100vh", display: "flex", backgroundImage: "none", backgroundColor: "#fff" }}>
            {/* Left Side */}
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
                    <div style={{ fontSize: "2.25rem", fontWeight: 600, color: "#fff", marginBottom: "1.5rem", lineHeight: 1.3, fontFamily: ff }}>Comece sua jornada<br />de estilo hoje</div>
                    <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "1.125rem", marginBottom: "2rem", fontFamily: ff }}>Junte-se a milhares de usuários que transformaram sua forma de se vestir com a ajuda da IA.</p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", textAlign: "center" }}>
                        {[["10k+", "Usuários"], ["50k+", "Looks Criados"], ["4.9", "Avaliação"]].map(([num, label]) => (
                            <div key={label}>
                                <div style={{ fontSize: "1.875rem", fontWeight: 600, color: "#fff", fontFamily: ff }}>{num}</div>
                                <div style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.875rem", fontFamily: ff }}>{label}</div>
                            </div>
                        ))}
                    </div>
                </div>
                <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.875rem", fontFamily: ff }}>© 2026 Fashion AI. Todos os direitos reservados.</div>
            </div>

            {/* Right Side */}
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", backgroundColor: "#fff", overflowY: "auto" }}>
                <div style={{ width: "100%", maxWidth: 448 }}>
                    <button onClick={() => router.push("/authview")} style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#6b7280", background: "none", border: "none", cursor: "pointer", marginBottom: "2rem", fontSize: "0.875rem", fontFamily: ff }}>
                        ← Voltar para login
                    </button>
                    <div style={{ marginBottom: "2rem" }}>
                        <h2 style={{ fontSize: "1.5rem", fontWeight: 600, color: "#111827", marginBottom: "0.5rem", fontFamily: ff }}>Criar sua conta</h2>
                        <p style={{ color: "#6b7280", fontFamily: ff }}>Preencha os dados abaixo para começar</p>
                    </div>
                    <SignupForm />
                    <p style={{ textAlign: "center", fontSize: "0.875rem", color: "#6b7280", marginTop: "2rem", fontFamily: ff }}>
                        Já tem uma conta?{" "}
                        <button onClick={() => router.push("/authview")} style={{ color: "#7c3aed", background: "none", border: "none", cursor: "pointer", fontWeight: 500, fontFamily: ff }}>
                            Fazer login
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
