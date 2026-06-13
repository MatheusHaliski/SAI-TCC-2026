import { NextRequest, NextResponse } from 'next/server';

import { COLLECTIONS } from '@/app/lib/collections';
import { getAdminFirestore } from '@/app/lib/firebaseAdmin';
import { getConsagrationStatus, normalizeTributeType, type TributeType } from '@/app/lib/artCelebrity';

function toTributeType(value: unknown): TributeType {
  return normalizeTributeType(typeof value === 'string' ? value : undefined);
}

export async function GET(request: NextRequest) {
  try {
    const targetId = request.nextUrl.searchParams.get('targetId')?.trim();
    const targetType = request.nextUrl.searchParams.get('targetType')?.trim() || 'creator';

    if (!targetId) {
      return NextResponse.json({ ok: false, error: 'targetId is required' }, { status: 400 });
    }

    const db = getAdminFirestore();

    const [tributeSnap, arenaSnap] = await Promise.all([
      db.collection(COLLECTIONS.ART_CELEBRITY_TRIBUTES).where('target_id', '==', targetId).get(),
      db.collection(COLLECTIONS.ART_CELEBRITY_ARENA).where('target_id', '==', targetId).get(),
    ]);

    const tributes = tributeSnap.docs.map((doc) => {
      const data = doc.data() as { tribute_type?: string; user_id?: string; createdAt?: string };
      return {
        id: doc.id,
        tributeType: toTributeType(data.tribute_type),
        userId: data.user_id ?? null,
        createdAt: data.createdAt ?? null,
      };
    });

    const arenaVotes = arenaSnap.docs.map((doc) => {
      const data = doc.data() as { votes?: number; user_id?: string; arena_id?: string; createdAt?: string };
      return {
        id: doc.id,
        votes: Number(data.votes ?? 1),
        userId: data.user_id ?? null,
        arenaId: data.arena_id ?? 'main',
        createdAt: data.createdAt ?? null,
      };
    });

    const tributeCount = tributes.length;
    const voteCount = arenaVotes.reduce((sum, vote) => sum + vote.votes, 0);
    const status = getConsagrationStatus(voteCount, tributeCount);

    const byType = tributes.reduce<Record<TributeType, number>>(
      (acc, tribute) => {
        acc[tribute.tributeType] += 1;
        return acc;
      },
      { look: 0, creator: 0, brand: 0 },
    );

    return NextResponse.json({
      ok: true,
      targetId,
      targetType,
      tributeCount,
      voteCount,
      byType,
      status,
      tributes,
      arenaVotes,
    });
  } catch (error) {
    console.error('[art-celebrity] GET failed', error);
    return NextResponse.json({ ok: false, error: 'Unable to load art celebrity metrics.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      action?: 'tribute' | 'vote';
      targetId?: string;
      targetType?: string;
      userId?: string;
      tributeType?: string;
      votes?: number;
      arenaId?: string;
    };

    const action = body.action ?? 'tribute';
    const targetId = body.targetId?.trim();
    const userId = body.userId?.trim();

    if (!targetId || !userId) {
      return NextResponse.json({ ok: false, error: 'targetId and userId are required' }, { status: 400 });
    }

    const db = getAdminFirestore();
    const now = new Date().toISOString();

    if (action === 'vote') {
      const votePayload = {
        target_id: targetId,
        target_type: body.targetType ?? 'creator',
        user_id: userId,
        arena_id: body.arenaId ?? 'main',
        votes: Math.max(1, Number(body.votes ?? 1)),
        createdAt: now,
        updatedAt: now,
      };

      await db.collection(COLLECTIONS.ART_CELEBRITY_ARENA).add(votePayload);
      return NextResponse.json({ ok: true, action, vote: votePayload });
    }

    const tributePayload = {
      target_id: targetId,
      target_type: body.targetType ?? 'creator',
      tribute_type: normalizeTributeType(body.tributeType),
      user_id: userId,
      createdAt: now,
      updatedAt: now,
    };

    await db.collection(COLLECTIONS.ART_CELEBRITY_TRIBUTES).add(tributePayload);

    return NextResponse.json({ ok: true, action, tribute: tributePayload });
  } catch (error) {
    console.error('[art-celebrity] POST failed', error);
    return NextResponse.json({ ok: false, error: 'Unable to save art celebrity action.' }, { status: 500 });
  }
}
