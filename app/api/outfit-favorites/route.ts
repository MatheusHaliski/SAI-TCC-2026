import { getAdminFirestore } from '@/app/lib/firebaseAdmin';
import { NextRequest, NextResponse } from 'next/server';

const COLLECTION = 'outfit_favorites';

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { userId?: string; schemeId?: string; favorite?: boolean };
    if (!body.schemeId) return NextResponse.json({ error: 'schemeId is required' }, { status: 400 });

    const userId = body.userId || request.headers.get('x-user-id') || 'anonymous';
    const favorite = Boolean(body.favorite);
    const docId = `${userId}_${body.schemeId}`;
    const db = getAdminFirestore();

    if (!favorite) {
      await db.collection(COLLECTION).doc(docId).delete();
      return NextResponse.json({ ok: true, favorite: false });
    }

    await db.collection(COLLECTION).doc(docId).set({
      userId,
      schemeId: body.schemeId,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ ok: true, favorite: true });
  } catch {
    return NextResponse.json({ error: 'Unable to update favorites' }, { status: 500 });
  }
}
