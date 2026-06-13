import { NextRequest, NextResponse } from 'next/server';

import { COLLECTIONS } from '@/app/lib/collections';
import { getAdminFirestore } from '@/app/lib/firebaseAdmin';

const normalizeSealStatus = (tier: string, status: string, officialFeedUntil?: string | null) => {
  const expiresAt = officialFeedUntil ? new Date(officialFeedUntil).getTime() : null;
  const now = Date.now();
  const isExpired = Boolean(expiresAt && expiresAt <= now);

  if (tier === 'none') {
    return {
      seal_tier: 'none',
      status: 'inactive',
      official_feed_eligible: false,
      official_feed_until: officialFeedUntil ?? null,
    };
  }

  if (status === 'expired' || isExpired) {
    return {
      seal_tier: tier,
      status: 'expired',
      official_feed_eligible: false,
      official_feed_until: officialFeedUntil ?? null,
    };
  }

  if (status === 'active' || status === 'pending') {
    return {
      seal_tier: tier,
      status,
      official_feed_eligible: status === 'active' && !isExpired,
      official_feed_until: officialFeedUntil ?? null,
    };
  }

  return {
    seal_tier: tier,
    status: 'inactive',
    official_feed_eligible: false,
    official_feed_until: officialFeedUntil ?? null,
  };
};

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId')?.trim();

    const db = getAdminFirestore();

    if (!userId) {
      return NextResponse.json({ ok: true, seal: null, user: null });
    }

    const [userSnap, sealSnap] = await Promise.all([
      db.collection(COLLECTIONS.USERS).doc(userId).get(),
      db.collection(COLLECTIONS.BRAND_SEALS).doc(userId).get(),
    ]);

    const profile = userSnap.exists ? (userSnap.data() ?? {}) : {};
    const seal = sealSnap.exists ? (sealSnap.data() ?? {}) : {};

    const tier = (seal.seal_tier ?? profile.brandSealTier ?? 'none') as 'free' | 'premium' | 'none';
    const status = (seal.status ?? profile.brandSealStatus ?? (tier === 'none' ? 'inactive' : 'pending')) as string;
    const officialFeedUntil = (seal.official_feed_until ?? profile.officialFeedUntil ?? null) as string | null;
    const normalized = normalizeSealStatus(tier, status, officialFeedUntil);

    return NextResponse.json({
      ok: true,
      seal: {
        user_id: userId,
        seal_tier: normalized.seal_tier,
        status: normalized.status,
        label: seal.label ?? (tier === 'premium' ? 'Selo Premium' : tier === 'free' ? 'Selo Gratuito' : 'Sem selo'),
        official_feed_eligible: normalized.official_feed_eligible,
        official_feed_until: normalized.official_feed_until,
        notes: seal.notes ?? null,
      },
      user: profile,
    });
  } catch (error) {
    console.error('[brand-seals] GET failed', error);
    return NextResponse.json({ ok: false, seal: null, user: null }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      userId?: string;
      tier?: 'free' | 'premium' | 'none';
      status?: 'pending' | 'active' | 'expired' | 'inactive';
      label?: string;
      officialFeedEligible?: boolean;
      officialFeedUntil?: string | null;
      notes?: string | null;
    };

    const userId = body.userId?.trim();
    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const db = getAdminFirestore();
    const now = new Date().toISOString();
    const tier = body.tier ?? 'none';
    const officialFeedUntil = body.officialFeedUntil ?? null;
    const normalized = normalizeSealStatus(tier, body.status ?? (tier === 'none' ? 'inactive' : 'pending'), officialFeedUntil);
    const status = normalized.status;

    const sealPayload = {
      user_id: userId,
      seal_tier: tier,
      status,
      label: body.label ?? (tier === 'premium' ? 'Selo Premium' : tier === 'free' ? 'Selo Gratuito' : 'Sem selo'),
      official_feed_eligible: normalized.official_feed_eligible,
      official_feed_until: normalized.official_feed_until,
      notes: body.notes ?? null,
      updatedAt: now,
      createdAt: now,
    };

    await db.collection(COLLECTIONS.BRAND_SEALS).doc(userId).set(sealPayload, { merge: true });

    await db.collection(COLLECTIONS.USERS).doc(userId).set(
      {
        brandSealTier: tier,
        brandSealStatus: status,
        officialFeedEligible: normalized.official_feed_eligible,
        officialFeedUntil: normalized.official_feed_until,
        updatedAt: now,
      },
      { merge: true },
    );

    return NextResponse.json({ ok: true, seal: sealPayload });
  } catch (error) {
    console.error('[brand-seals] POST failed', error);
    return NextResponse.json({ ok: false, error: 'Unable to save seal.' }, { status: 500 });
  }
}
