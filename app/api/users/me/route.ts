import { getAdminAuth, getAdminFirestore } from '@/app/lib/firebaseAdmin';
import { NextRequest, NextResponse } from 'next/server';

const USERS_COLLECTION = 'saiUsers';
const LEGACY_USERS_COLLECTION = 'users';

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId')?.trim();
    if (!userId) return NextResponse.json({ error: 'userId is required' }, { status: 400 });

    const db = getAdminFirestore();
    let snapshot = await db.collection(USERS_COLLECTION).doc(userId).get();
    if (!snapshot.exists) snapshot = await db.collection(LEGACY_USERS_COLLECTION).doc(userId).get();

    if (!snapshot.exists) return NextResponse.json({ ok: true, profile: null });

    return NextResponse.json({ ok: true, profile: snapshot.data() ?? null });
  } catch {
    return NextResponse.json({ error: 'Unable to load profile.' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = (await request.json()) as { userId?: string; displayName?: string; username?: string; email?: string; bio?: string; avatarUrl?: string };
    if (!body.userId) return NextResponse.json({ error: 'userId is required' }, { status: 400 });

    const payload = {
      uid: body.userId,
      user_id: body.userId,
      name: body.displayName?.trim() || '',
      displayName: body.displayName?.trim() || '',
      username: body.username?.trim() || '',
      email: body.email?.trim() || '',
      bio: body.bio?.trim() || '',
      photo_url: body.avatarUrl || '',
      updatedAt: new Date().toISOString(),
    };

    const db = getAdminFirestore();
    await db.collection(USERS_COLLECTION).doc(body.userId).set(payload, { merge: true });

    return NextResponse.json({ ok: true, profile: payload });
  } catch {
    return NextResponse.json({ error: 'Unable to update profile.' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId')?.trim();
    if (!userId) return NextResponse.json({ error: 'userId is required' }, { status: 400 });

    const adminAuth = getAdminAuth();
    const db = getAdminFirestore();

    // Delete Firebase Auth user first to immediately prevent re-login.
    try {
      await adminAuth.deleteUser(userId);
    } catch (authErr) {
      const code = (authErr as { code?: string }).code;
      if (code !== 'auth/user-not-found') {
        throw authErr;
      }
      // User already absent from Auth — still clean up Firestore below.
    }

    await db.collection(USERS_COLLECTION).doc(userId).delete();
    await db.collection(LEGACY_USERS_COLLECTION).doc(userId).delete().catch(() => undefined);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Unable to delete account.' }, { status: 500 });
  }
}
