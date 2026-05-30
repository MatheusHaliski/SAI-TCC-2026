import { getAdminFirestore } from '@/app/lib/firebaseAdmin';
import { COLLECTIONS } from '@/app/lib/collections';
import { NextRequest, NextResponse } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ wardrobeItemId: string }> },
) {
  const { wardrobeItemId } = await params;

  try {
    const body = (await request.json()) as { userId?: string; liked?: boolean };
    const userId = body.userId || request.headers.get('x-user-id') || '';
    const liked = Boolean(body.liked);

    if (!wardrobeItemId || !userId) {
      return NextResponse.json({ error: 'wardrobeItemId and userId are required' }, { status: 400 });
    }

    const db = getAdminFirestore();
    const docId = `${userId}_${wardrobeItemId}`;
    const likeRef = db.collection(COLLECTIONS.PIECE_LIKES).doc(docId);
    const statsRef = db.collection(COLLECTIONS.PIECE_STATS).doc(wardrobeItemId);

    if (!liked) {
      const snap = await likeRef.get();
      if (snap.exists) {
        await likeRef.delete();
        await statsRef.set(
          { like_count: FieldValue.increment(-1), updatedAt: new Date().toISOString() },
          { merge: true },
        );
      }
      return NextResponse.json({ ok: true, liked: false });
    }

    const snap = await likeRef.get();
    if (!snap.exists) {
      await likeRef.set({ wardrobe_item_id: wardrobeItemId, user_id: userId, createdAt: new Date().toISOString() });
      await statsRef.set(
        { wardrobe_item_id: wardrobeItemId, like_count: FieldValue.increment(1), updatedAt: new Date().toISOString() },
        { merge: true },
      );
    }

    return NextResponse.json({ ok: true, liked: true });
  } catch {
    return NextResponse.json({ error: 'Unable to update like' }, { status: 500 });
  }
}
