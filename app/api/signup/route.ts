import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { getAdminFirestore } from "@/app/lib/firebaseAdmin";
import { signupPayloadSchema } from "@/app/signupview/schema";
import { createSessionToken, setSessionCookie } from "@/app/lib/serverSession";

export const runtime = "nodejs";

type SignupPayload = {
    name?: string;
    email?: string;
    password?: string;
};

const HASH_ALGORITHM = "SHA-256";
const HASH_ITERATIONS = 310000;
const APP_PEPPER = "sai-usercontrol-v1";
const USER_COLLECTION = "sai-usercontrol";

const generateSalt = () => crypto.randomBytes(16).toString("base64");

const buildSalt = (saltBase64: string) =>
    Buffer.concat([
        Buffer.from(saltBase64, "base64"),
        Buffer.from(APP_PEPPER),
    ]);

const hashPassword = (
    password: string,
    saltBase64: string,
    iterations: number
): Promise<string> =>
    new Promise((resolve, reject) => {
        crypto.pbkdf2(
            password,
            buildSalt(saltBase64),
            iterations,
            32,
            "sha256",
            (error, derivedKey) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(derivedKey.toString("base64"));
            }
        );
    });

export async function POST(request: NextRequest): Promise<Response> {
    let body: SignupPayload = {};
    try {
        body = (await request.json()) as SignupPayload;
    } catch {
        body = {};
    }

    const parsed = signupPayloadSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json(
            { error: "Invalid signup payload." },
            { status: 400 }
        );
    }

    try {
        const db = getAdminFirestore();
        const normalizedEmail = parsed.data.email.trim().toLowerCase();
        const normalizedName = parsed.data.name.trim();
        const existingSnapshot = await db
            .collection(USER_COLLECTION)
            .where("email", "==", normalizedEmail)
            .limit(1)
            .get();

        if (!existingSnapshot.empty) {
            return NextResponse.json(
                { error: "An account already exists with that email address." },
                { status: 409 }
            );
        }

        const existingNameSnapshot = await db
            .collection(USER_COLLECTION)
            .where("name", "==", normalizedName)
            .limit(1)
            .get();

        if (!existingNameSnapshot.empty) {
            return NextResponse.json(
                { error: "An account already exists with that name." },
                { status: 409 }
            );
        }

        const passwordSalt = generateSalt();
        const passwordHash = await hashPassword(
            parsed.data.password,
            passwordSalt,
            HASH_ITERATIONS
        );

        const createdUser = await db.collection(USER_COLLECTION).add({
            name: normalizedName,
            email: normalizedEmail,
            passwordHash,
            passwordSalt,
            passwordIterations: HASH_ITERATIONS,
            passwordHashAlgorithm: HASH_ALGORITHM,
            createdAt: new Date().toISOString(),
        });

        const userId = createdUser.id;
        const sessionToken = createSessionToken({
            sub: userId,
            email: normalizedEmail,
        });

        const response = NextResponse.json({
            ok: true,
            profile: {
                user_id: userId,
                name: normalizedName,
                email: normalizedEmail,
            },
        });
        setSessionCookie(response, sessionToken);

        return response;
    } catch (error) {
        console.error("[Signup API] failed to create account:", error);
        return NextResponse.json(
            { error: "Unable to create your account right now." },
            { status: 500 }
        );
    }
}
