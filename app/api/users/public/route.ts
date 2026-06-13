import { getAdminFirestore } from '@/app/lib/firebaseAdmin';
import { COLLECTIONS } from '@/app/lib/collections';
import { NextResponse } from 'next/server';

const USERS_COLLECTION = 'saiUsers';

export async function GET() {
  try {
    const db = getAdminFirestore();
    const [snapshot, sealSnapshot] = await Promise.all([
      db.collection(USERS_COLLECTION).limit(50).get(),
      db.collection(COLLECTIONS.BRAND_SEALS).get(),
    ]);

    const sealByUserId = Object.fromEntries(
      sealSnapshot.docs.map((doc) => {
        const data = doc.data() as {
          seal_tier?: string;
          status?: string;
          official_feed_eligible?: boolean;
          official_feed_until?: string | null;
        };
        const tier = (data.seal_tier ?? 'none') as string;
        return [doc.id, {
          brandSealTier: tier,
          brandSealStatus: data.status ?? (tier === 'none' ? 'inactive' : 'pending'),
          officialFeedEligible: Boolean(data.official_feed_eligible),
          officialFeedUntil: data.official_feed_until ?? null,
        }];
      })
    );

    const users = snapshot.docs
      .map((doc) => {
        const data = doc.data() as {
          name?: string;
          username?: string;
          bio?: string;
          photo_url?: string;
        };
        const seal = sealByUserId[doc.id] ?? {
          brandSealTier: 'none',
          brandSealStatus: 'inactive',
          officialFeedEligible: false,
          officialFeedUntil: null,
        };

        return {
          user_id: doc.id,
          name: data.name?.trim() || 'SAI User',
          username: data.username?.trim() || data.name?.trim() || 'user',
          descriptor: data.bio?.trim() || 'Fashion creator',
          avatarUrl: data.photo_url?.trim() || '',
          ...seal,
        };
      })
      .filter((user) => Boolean(user.user_id));

    return NextResponse.json({ ok: true, users });
  } catch {
    return NextResponse.json({ ok: false, users: [] }, { status: 500 });
  }
}
