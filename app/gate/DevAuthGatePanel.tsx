"use client";

import { type FormEvent, useEffect } from "react";
import { useAuthGate } from "@/app/gate/auth";
import { getDevSessionToken, setDevSessionToken } from "@/app/lib/devSession";
import styles from "./DevAuthGate.module.css";

type DevAuthGatePanelProps = {
    onUnlocked: () => void;
};

export default function DevAuthGatePanel({ onUnlocked }: DevAuthGatePanelProps) {
    const { googleAuthed, googleUserId, googleError, pinInput, setPinInput, pinVerified, pinError, pinLocked, verifyPin } = useAuthGate();
    const canVerify = Boolean(pinInput.trim()) && !pinLocked;

    useEffect(() => {
        if (!googleAuthed || !pinVerified) return;
        if (!getDevSessionToken()) setDevSessionToken(crypto.randomUUID());
        onUnlocked();
    }, [googleAuthed, pinVerified, onUnlocked]);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (canVerify) void verifyPin();
    };

    return (
        <div className={styles.page}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <p className={styles.eyebrow}>/gate</p>
                    <h1 className={styles.title}>Sign in with Google and enter your PIN</h1>
                </div>

                <div className={styles.sections}>
                    <div className={styles.field}>
                        <p className={styles.label}>Google sign-in</p>
                        <div id="google-signin" className={styles.googleSlot} />
                        {googleError && <p className={styles.error}>{googleError}</p>}
                        {googleAuthed && <div className={styles.signedIn}>Signed in as {googleUserId}</div>}
                    </div>

                    <form className={styles.field} onSubmit={handleSubmit}>
                        <label htmlFor="dev-gate-pin" className={styles.label}>PIN password</label>
                        <input
                            id="dev-gate-pin"
                            type="password"
                            autoComplete="current-password"
                            value={pinInput}
                            onChange={(e) => setPinInput(e.target.value)}
                            placeholder="Enter your PIN"
                            className={styles.pinInput}
                        />
                        {pinError && <p className={styles.error}>{pinError}</p>}
                        {pinVerified && <p className={styles.verified}>PIN verified.</p>}
                        <button type="submit" disabled={!canVerify} className={styles.button}>
                            Verify PIN
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
