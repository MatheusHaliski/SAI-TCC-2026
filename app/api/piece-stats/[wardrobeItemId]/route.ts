import { getAdminFirestore } from '@/app/lib/firebaseAdmin';
import { COLLECTIONS } from '@/app/lib/collections';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ wardrobeItemId: string }> },
) {
  const { wardrobeItemId } = await params;
  const userId = request.nextUrl.searchParams.get('userId')?.trim() || request.headers.get('x-user-id') || '';

  if (!wardrobeItemId) return NextResponse.json({ error: 'wardrobeItemId is required' }, { status: 400 });

  try {
    const db = getAdminFirestore();

    const [statsSnap, likeSnap, ratingSnap] = await Promise.all([
      db.collection(COLLECTIONS.PIECE_STATS).doc(wardrobeItemId).get(),
      userId ? db.collection(COLLECTIONS.PIECE_LIKES).doc(`${userId}_${wardrobeItemId}`).get() : Promise.resolve(null),
      userId ? db.collection(COLLECTIONS.PIECE_RATINGS).doc(`${userId}_${wardrobeItemId}`).get() : Promise.resolve(null),
    ]);

    const stats = statsSnap.exists
      ? (statsSnap.data() as { like_count?: number; avg_rating?: number; rating_count?: number; owner_count?: number })
      : { like_count: 0, avg_rating: 0, rating_count: 0, owner_count: 1 };

    return NextResponse.json({
      ok: true,
      like_count: stats.like_count ?? 0,
      avg_rating: stats.avg_rating ?? 0,
      rating_count: stats.rating_count ?? 0,
      owner_count: stats.owner_count ?? 1,
      user_has_liked: likeSnap?.exists ?? false,
      user_rating: ratingSnap?.exists ? ((ratingSnap.data() as { stars?: number })?.stars ?? null) : null,
    });
  } catch {
    return NextResponse.json({ error: 'Unable to fetch piece stats' }, { status: 500 });
  }
}
