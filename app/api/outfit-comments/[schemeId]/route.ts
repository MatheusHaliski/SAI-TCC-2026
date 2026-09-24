import { getAdminFirestore } from '@/app/lib/firebaseAdmin';
import { COLLECTIONS } from '@/app/lib/collections';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ schemeId: string }> },
) {
  const { schemeId } = await params;
  if (!schemeId) return NextResponse.json({ error: 'schemeId required' }, { status: 400 });

  const db = getAdminFirestore();
  const snap = await db
    .collection(COLLECTIONS.OUTFIT_COMMENTS)
    .where('scheme_id', '==', schemeId)
    .where('is_active', '==', true)
    .orderBy('createdAt', 'asc')
    .limit(100)
    .get();

  const comments = snap.docs.map((doc: { id: string; data(): Record<string, unknown> }) => ({ comment_id: doc.id, ...doc.data() }));
  return NextResponse.json({ comments });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ schemeId: string }> },
) {
  const { schemeId } = await params;

  try {
    const body = (await request.json()) as { userId?: string; userName?: string; userPhotoUrl?: string; content?: string };
    const { userId, userName, userPhotoUrl, content } = body;

    if (!schemeId || !userId || !content?.trim()) {
      return NextResponse.json({ error: 'schemeId, userId and content are required' }, { status: 400 });
    }
    if (content.trim().length > 500) {
      return NextResponse.json({ error: 'Comment must be 500 characters or less' }, { status: 400 });
    }

    const db = getAdminFirestore();
    const now = new Date().toISOString();
    const record = {
      scheme_id: schemeId,
      user_id: userId,
      user_name: userName || 'Usuário',
      user_photo_url: userPhotoUrl || '',
      content: content.trim(),
      is_active: true,
      createdAt: now,
    };

    const created = await db.collection(COLLECTIONS.OUTFIT_COMMENTS).add(record);
    return NextResponse.json({ comment_id: created.id, ...record }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Unable to post comment' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ schemeId: string }> },
) {
  const { schemeId } = await params;
  const commentId = request.nextUrl.searchParams.get('commentId')?.trim();
  const userId = request.nextUrl.searchParams.get('userId')?.trim()
    || request.headers.get('x-user-id') || '';

  if (!commentId) return NextResponse.json({ error: 'commentId required' }, { status: 400 });

  const db = getAdminFirestore();
  const ref = db.collection(COLLECTIONS.OUTFIT_COMMENTS).doc(commentId);
  const snap = await ref.get();
  if (!snap.exists) return NextResponse.json({ error: 'Comment not found' }, { status: 404 });

  const data = snap.data() as { scheme_id?: string; user_id?: string };
  if (data.scheme_id !== schemeId || (userId && data.user_id !== userId)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  await ref.update({ is_active: false, deletedAt: new Date().toISOString() });
  return NextResponse.json({ ok: true });
}
