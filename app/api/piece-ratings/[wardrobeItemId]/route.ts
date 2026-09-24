import { getAdminFirestore } from '@/app/lib/firebaseAdmin';
import { COLLECTIONS } from '@/app/lib/collections';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ wardrobeItemId: string }> },
) {
  const { wardrobeItemId } = await params;

  try {
    const body = (await request.json()) as { userId?: string; stars?: number };
    const userId = body.userId || request.headers.get('x-user-id') || '';
    const stars = Number(body.stars);

    if (!wardrobeItemId || !userId) {
      return NextResponse.json({ error: 'wardrobeItemId and userId are required' }, { status: 400 });
    }
    if (!Number.isInteger(stars) || stars < 1 || stars > 5) {
      return NextResponse.json({ error: 'stars must be an integer between 1 and 5' }, { status: 400 });
    }

    const db = getAdminFirestore();
    const docId = `${userId}_${wardrobeItemId}`;
    const ratingRef = db.collection(COLLECTIONS.PIECE_RATINGS).doc(docId);
    const statsRef = db.collection(COLLECTIONS.PIECE_STATS).doc(wardrobeItemId);
    const now = new Date().toISOString();

    await ratingRef.set(
      { wardrobe_item_id: wardrobeItemId, user_id: userId, stars, updatedAt: now, createdAt: now },
      { merge: true },
    );

    // Recalculate aggregate rating from all ratings for this piece
    const allRatingsSnap = await db
      .collection(COLLECTIONS.PIECE_RATINGS)
      .where('wardrobe_item_id', '==', wardrobeItemId)
      .get();

    const allStars = allRatingsSnap.docs
      .map((d) => Number((d.data() as { stars?: number }).stars ?? 0))
      .filter((n): n is number => n > 0);
    const rating_count = allStars.length;
    const avg_rating = rating_count > 0 ? allStars.reduce((a: number, b: number) => a + b, 0) / rating_count : 0;

    await statsRef.set(
      { wardrobe_item_id: wardrobeItemId, avg_rating: Math.round(avg_rating * 10) / 10, rating_count, updatedAt: now },
      { merge: true },
    );

    return NextResponse.json({ ok: true, stars, avg_rating: Math.round(avg_rating * 10) / 10, rating_count });
  } catch {
    return NextResponse.json({ error: 'Unable to save rating' }, { status: 500 });
  }
}
