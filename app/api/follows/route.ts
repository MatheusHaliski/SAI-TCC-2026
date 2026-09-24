import { getAdminFirestore } from '@/app/lib/firebaseAdmin';
import { COLLECTIONS } from '@/app/lib/collections';
import { NextRequest, NextResponse } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';

export async function GET(request: NextRequest) {
  const followerId = request.nextUrl.searchParams.get('followerId')?.trim();
  const followingId = request.nextUrl.searchParams.get('followingId')?.trim();
  const userId = request.nextUrl.searchParams.get('userId')?.trim();
  const type = request.nextUrl.searchParams.get('type')?.trim(); // 'followers' | 'following' | 'check'

  const db = getAdminFirestore();

  if (type === 'check' && followerId && followingId) {
    const docId = `${followerId}_${followingId}`;
    const snap = await db.collection(COLLECTIONS.FOLLOWS).doc(docId).get();
    return NextResponse.json({ is_following: snap.exists });
  }

  if (type === 'followers' && userId) {
    const snap = await db.collection(COLLECTIONS.FOLLOWS).where('following_id', '==', userId).get();
    return NextResponse.json({ count: snap.size, followers: snap.docs.map((d) => (d.data() as { follower_id: string }).follower_id) });
  }

  if (type === 'following' && userId) {
    const snap = await db.collection(COLLECTIONS.FOLLOWS).where('follower_id', '==', userId).get();
    return NextResponse.json({ count: snap.size, following: snap.docs.map((d) => (d.data() as { following_id: string }).following_id) });
  }

  return NextResponse.json({ error: 'Invalid query params' }, { status: 400 });
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { followerId?: string; followingId?: string; follow?: boolean };
    const { followerId, followingId, follow } = body;

    if (!followerId || !followingId) {
      return NextResponse.json({ error: 'followerId and followingId are required' }, { status: 400 });
    }
    if (followerId === followingId) {
      return NextResponse.json({ error: 'Cannot follow yourself' }, { status: 400 });
    }

    const db = getAdminFirestore();
    const docId = `${followerId}_${followingId}`;
    const ref = db.collection(COLLECTIONS.FOLLOWS).doc(docId);
    const followerStatsRef = db.collection(COLLECTIONS.USERS).doc(followerId);
    const followingStatsRef = db.collection(COLLECTIONS.USERS).doc(followingId);

    if (!follow) {
      const snap = await ref.get();
      if (snap.exists) {
        await ref.delete();
        await followerStatsRef.set({ following_count: FieldValue.increment(-1) }, { merge: true });
        await followingStatsRef.set({ follower_count: FieldValue.increment(-1) }, { merge: true });
      }
      return NextResponse.json({ ok: true, following: false });
    }

    const snap = await ref.get();
    if (!snap.exists) {
      await ref.set({ follower_id: followerId, following_id: followingId, createdAt: new Date().toISOString() });
      await followerStatsRef.set({ following_count: FieldValue.increment(1) }, { merge: true });
      await followingStatsRef.set({ follower_count: FieldValue.increment(1) }, { merge: true });

      // Create notification for the user being followed
      await db.collection(COLLECTIONS.NOTIFICATIONS).add({
        user_id: followingId,
        actor_id: followerId,
        type: 'new_follower',
        is_read: false,
        createdAt: new Date().toISOString(),
      });
    }

    return NextResponse.json({ ok: true, following: true });
  } catch {
    return NextResponse.json({ error: 'Unable to update follow' }, { status: 500 });
  }
}
