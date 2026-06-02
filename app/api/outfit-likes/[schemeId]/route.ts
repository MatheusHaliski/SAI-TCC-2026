import { getAdminFirestore } from '@/app/lib/firebaseAdmin';
import { COLLECTIONS } from '@/app/lib/collections';
import { NextRequest, NextResponse } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ schemeId: string }> },
) {
  const { schemeId } = await params;
  const userId = request.nextUrl.searchParams.get('userId')?.trim() || '';

  if (!schemeId) return NextResponse.json({ error: 'schemeId required' }, { status: 400 });

  const db = getAdminFirestore();
  const statsRef = db.collection(COLLECTIONS.OUTFIT_LIKES).doc(`stats_${schemeId}`);
  const snap = await statsRef.get();
  const likeCount = (snap.data()?.like_count as number) ?? 0;

  let userLiked = false;
  if (userId) {
    const likeSnap = await db.collection(COLLECTIONS.OUTFIT_LIKES).doc(`${userId}_${schemeId}`).get();
    userLiked = likeSnap.exists;
  }

  return NextResponse.json({ like_count: likeCount, user_liked: userLiked });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ schemeId: string }> },
) {
  const { schemeId } = await params;

  try {
    const body = (await request.json()) as { userId?: string; liked?: boolean };
    const userId = body.userId || request.headers.get('x-user-id') || '';
    const liked = Boolean(body.liked);

    if (!schemeId || !userId) {
      return NextResponse.json({ error: 'schemeId and userId are required' }, { status: 400 });
    }

    const db = getAdminFirestore();
    const docId = `${userId}_${schemeId}`;
    const likeRef = db.collection(COLLECTIONS.OUTFIT_LIKES).doc(docId);
    const statsRef = db.collection(COLLECTIONS.OUTFIT_LIKES).doc(`stats_${schemeId}`);

    if (!liked) {
      const snap = await likeRef.get();
      if (snap.exists) {
        await likeRef.delete();
        await statsRef.set(
          { scheme_id: schemeId, like_count: FieldValue.increment(-1), updatedAt: new Date().toISOString() },
          { merge: true },
        );
      }
      const updated = await statsRef.get();
      return NextResponse.json({ ok: true, liked: false, like_count: (updated.data()?.like_count as number) ?? 0 });
    }

    const snap = await likeRef.get();
    if (!snap.exists) {
      await likeRef.set({ scheme_id: schemeId, user_id: userId, createdAt: new Date().toISOString() });
      await statsRef.set(
        { scheme_id: schemeId, like_count: FieldValue.increment(1), updatedAt: new Date().toISOString() },
        { merge: true },
      );
    }

    const updated = await statsRef.get();
    return NextResponse.json({ ok: true, liked: true, like_count: (updated.data()?.like_count as number) ?? 0 });
  } catch {
    return NextResponse.json({ error: 'Unable to update like' }, { status: 500 });
  }
}
