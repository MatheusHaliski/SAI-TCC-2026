"use client";

import { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import DevAuthGatePanel from "@/app/gate/DevAuthGatePanel";
import { clearDevSessionToken } from "@/app/lib/devSession";
import { clearAuthSessionProfile, clearAuthSessionToken } from "@/app/lib/authSession";
import { clearSharedAccessToken } from "@/app/lib/accessTokenShare";

export default function DevAuthGate() {
    const router = useRouter();

    useEffect(() => {
        clearDevSessionToken(); clearAuthSessionToken(); clearAuthSessionProfile(); clearSharedAccessToken();
    }, []);

    const handleUnlocked = useCallback(() => router.replace("/authview"), [router]);

    return <DevAuthGatePanel onUnlocked={handleUnlocked} />;
}
