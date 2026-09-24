import { getAdminFirestore } from '@/app/lib/firebaseAdmin';
import { COLLECTIONS } from '@/app/lib/collections';
import { emptyReactionCounts, isReactionKey, ReactionKey } from '@/app/lib/reactions';
import { NextRequest, NextResponse } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';

type ReactionStats = { like_count?: number; reactions?: Partial<Record<ReactionKey, number>> };

function readReactionCounts(data: ReactionStats | undefined) {
  const counts = emptyReactionCounts();
  const stored = data?.reactions ?? {};
  (Object.keys(counts) as ReactionKey[]).forEach((key) => {
    counts[key] = Number(stored[key] ?? 0);
  });
  return counts;
}

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
  const statsData = snap.data() as ReactionStats | undefined;
  const likeCount = (statsData?.like_count as number) ?? 0;

  let userLiked = false;
  let userReaction: ReactionKey | null = null;
  if (userId) {
    const likeSnap = await db.collection(COLLECTIONS.OUTFIT_LIKES).doc(`${userId}_${schemeId}`).get();
    userLiked = likeSnap.exists;
    const stored = likeSnap.data()?.reaction;
    userReaction = isReactionKey(stored) ? stored : userLiked ? 'fire' : null;
  }

  return NextResponse.json({
    like_count: likeCount,
    user_liked: userLiked,
    user_reaction: userReaction,
    reactions: readReactionCounts(statsData),
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ schemeId: string }> },
) {
  const { schemeId } = await params;

  try {
    const body = (await request.json()) as { userId?: string; liked?: boolean; reaction?: string | null };
    const userId = body.userId || request.headers.get('x-user-id') || '';

    if (!schemeId || !userId) {
      return NextResponse.json({ error: 'schemeId and userId are required' }, { status: 400 });
    }

    // Resolve the desired reaction. Backward compatible with the old { liked }
    // payload: liked:true with no reaction defaults to 🔥; liked:false removes it.
    let desired: ReactionKey | null;
    if (body.reaction === null) desired = null;
    else if (isReactionKey(body.reaction)) desired = body.reaction;
    else if (body.liked === false) desired = null;
    else desired = 'fire';

    const db = getAdminFirestore();
    const likeRef = db.collection(COLLECTIONS.OUTFIT_LIKES).doc(`${userId}_${schemeId}`);
    const statsRef = db.collection(COLLECTIONS.OUTFIT_LIKES).doc(`stats_${schemeId}`);

    const existing = await likeRef.get();
    const prev: ReactionKey | null = existing.exists
      ? (isReactionKey(existing.data()?.reaction) ? (existing.data()?.reaction as ReactionKey) : 'fire')
      : null;

    // Clicking the same reaction again toggles it off.
    const next = prev && desired === prev ? null : desired;

    const now = new Date().toISOString();
    const statsPatch: Record<string, unknown> = { scheme_id: schemeId, updatedAt: now };

    if (next === null) {
      if (prev) {
        await likeRef.delete();
        statsPatch.like_count = FieldValue.increment(-1);
        statsPatch.reactions = { [prev]: FieldValue.increment(-1) };
        await statsRef.set(statsPatch, { merge: true });
      }
    } else {
      await likeRef.set({ scheme_id: schemeId, user_id: userId, reaction: next, createdAt: now }, { merge: true });
      if (!prev) {
        statsPatch.like_count = FieldValue.increment(1);
        statsPatch.reactions = { [next]: FieldValue.increment(1) };
        await statsRef.set(statsPatch, { merge: true });
      } else if (prev !== next) {
        // Switching reaction: total unchanged, move the count between buckets.
        statsPatch.reactions = { [prev]: FieldValue.increment(-1), [next]: FieldValue.increment(1) };
        await statsRef.set(statsPatch, { merge: true });
      }
    }

    const updated = await statsRef.get();
    const updatedData = updated.data() as ReactionStats | undefined;
    return NextResponse.json({
      ok: true,
      liked: next !== null,
      user_reaction: next,
      like_count: (updatedData?.like_count as number) ?? 0,
      reactions: readReactionCounts(updatedData),
    });
  } catch {
    return NextResponse.json({ error: 'Unable to update reaction' }, { status: 500 });
  }
}
