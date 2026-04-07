import { getAdminFirestore } from '@/app/lib/firebaseAdmin';
import { NextRequest, NextResponse } from 'next/server';

const USERS_COLLECTION = 'users';

export async function PATCH(request: NextRequest) {
  try {
    const body = (await request.json()) as { userId?: string; displayName?: string; username?: string; email?: string; bio?: string; avatarUrl?: string };
    if (!body.userId) return NextResponse.json({ error: 'userId is required' }, { status: 400 });

    const payload = {
      name: body.displayName?.trim() || '',
      username: body.username?.trim() || '',
      email: body.email?.trim() || '',
      bio: body.bio?.trim() || '',
      photo_url: body.avatarUrl || '',
      updated_at: new Date().toISOString(),
    };

    const db = getAdminFirestore();
    await db.collection(USERS_COLLECTION).doc(body.userId).set(payload, { merge: true });

    return NextResponse.json({ ok: true, profile: payload });
  } catch {
    return NextResponse.json({ error: 'Unable to update profile.' }, { status: 500 });
  }
}
