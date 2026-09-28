"use client";

import { type ReactNode, useReducer, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import DevAuthGatePanel from "@/app/gate/DevAuthGatePanel";
import { DEV_SESSION_TOKEN_KEY, getDevSessionToken } from "@/app/lib/devSession";
import styles from "./DevAuthGate.module.css";

// A rota dedicada já renderiza o painel e limpa a sessão ao entrar.
const DEV_AUTH_GATE_ROUTE = "/devauthgate";

// Token criado/removido em outra aba.
const subscribeToOtherTabs = (onChange: () => void) => {
    const handleStorage = (event: StorageEvent) => {
        if (event.key === null || event.key === DEV_SESSION_TOKEN_KEY) onChange();
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
};
const hasDevSession = () => Boolean(getDevSessionToken());
// No servidor não há localStorage: o estado só é conhecido após a hidratação.
const hasDevSessionOnServer = () => null;

/**
 * Bloqueia todas as páginas do projeto (inclusive RF1 /authview e RF2 /signupview)
 * até que o desenvolvedor passe pelo login Google + PIN. A página pedida é exibida
 * na mesma URL assim que o gate é liberado.
 */
export default function DevAuthGateBoundary({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    // Relido a cada render (inclusive a cada navegação), então o TTL do token é respeitado.
    const unlocked = useSyncExternalStore(subscribeToOtherTabs, hasDevSession, hasDevSessionOnServer);
    // setDevSessionToken na mesma aba não dispara "storage": força a releitura após o gate.
    const [, recheck] = useReducer((count: number) => count + 1, 0);

    if (pathname === DEV_AUTH_GATE_ROUTE || unlocked) return <>{children}</>;
    if (unlocked === false) return <DevAuthGatePanel onUnlocked={recheck} />;
    return <div className={styles.checking} aria-busy="true" />;
}
