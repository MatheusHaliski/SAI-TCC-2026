import { getAdminFirestore } from '@/app/lib/firebaseAdmin';
import { COLLECTIONS } from '@/app/lib/collections';
import { NextRequest, NextResponse } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';

export async function GET(request: NextRequest) {
  const originalSchemeId = request.nextUrl.searchParams.get('originalSchemeId')?.trim();
  if (!originalSchemeId) return NextResponse.json({ error: 'originalSchemeId required' }, { status: 400 });

  const db = getAdminFirestore();
  const snap = await db
    .collection(COLLECTIONS.REMIXES)
    .where('original_scheme_id', '==', originalSchemeId)
    .orderBy('createdAt', 'desc')
    .limit(50)
    .get();

  const remixes = snap.docs.map((doc: { id: string; data(): Record<string, unknown> }) => ({ remix_id: doc.id, ...doc.data() }));
  return NextResponse.json({ count: remixes.length, remixes });
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      userId?: string;
      originalSchemeId?: string;
      newSchemeId?: string;
      originalAuthorId?: string;
    };

    const { userId, originalSchemeId, newSchemeId, originalAuthorId } = body;
    if (!userId || !originalSchemeId || !newSchemeId) {
      return NextResponse.json({ error: 'userId, originalSchemeId and newSchemeId are required' }, { status: 400 });
    }

    const db = getAdminFirestore();
    const now = new Date().toISOString();

    const record = {
      user_id: userId,
      original_scheme_id: originalSchemeId,
      new_scheme_id: newSchemeId,
      original_author_id: originalAuthorId || '',
      createdAt: now,
    };

    const created = await db.collection(COLLECTIONS.REMIXES).add(record);

    // Increment remix_count on the original scheme
    await db
      .collection(COLLECTIONS.SCHEMES)
      .doc(originalSchemeId)
      .set({ remix_count: FieldValue.increment(1), updatedAt: now }, { merge: true });

    // Notify original author
    if (originalAuthorId && originalAuthorId !== userId) {
      await db.collection(COLLECTIONS.NOTIFICATIONS).add({
        user_id: originalAuthorId,
        actor_id: userId,
        type: 'remix',
        scheme_id: originalSchemeId,
        new_scheme_id: newSchemeId,
        is_read: false,
        createdAt: now,
      });
    }

    return NextResponse.json({ remix_id: created.id, ...record }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Unable to create remix' }, { status: 500 });
  }
}
