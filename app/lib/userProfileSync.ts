import { FieldValue, type Firestore } from "firebase-admin/firestore";

const USER_COLLECTION = "saiUsers";

export type SyncUserProfileInput = {
    uid: string;
    email: string;
    displayName?: string;
    provider: "password" | "google" | "facebook" | "unknown";
    role?: string;
    status?: string;
    db: Firestore;
};

export const syncUserProfileFromAuth = async ({
    uid,
    email,
    displayName,
    provider,
    role = "user",
    status = "active",
    db,
}: SyncUserProfileInput) => {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedDisplayName = (displayName ?? "").trim();
    const userRef = db.collection(USER_COLLECTION).doc(uid);

    const existing = await userRef.get();

    const payload: Record<string, unknown> = {
        uid,
        user_id: uid,
        email: normalizedEmail,
        displayName: normalizedDisplayName,
        name: normalizedDisplayName,
        provider,
        role,
        status,
        updatedAt: FieldValue.serverTimestamp(),
    };

    // Only set createdAt on first write so the registration date is preserved
    // across subsequent logins.
    if (!existing.exists || !existing.data()?.createdAt) {
        payload.createdAt = FieldValue.serverTimestamp();
    }

    await userRef.set(payload, { merge: true });

    const snapshot = await userRef.get();
    return snapshot.data() ?? null;
};
