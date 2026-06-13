import { NextRequest, NextResponse } from 'next/server';
import { getAdminFirestore } from '@/app/lib/firebaseAdmin';
import { COLLECTIONS } from '@/app/lib/collections';
import { AMERICAN_CELEBRITIES } from '@/app/lib/celebrities';

export async function GET(request: NextRequest) {
  const status = request.nextUrl.searchParams.get('status')?.trim();
  const userId = request.nextUrl.searchParams.get('user_id')?.trim();

  const db = getAdminFirestore();
  let query: FirebaseFirestore.Query = db.collection(COLLECTIONS.CELEBRITY_TRIBUTE_REQUESTS);

  if (status) query = query.where('status', '==', status);
  if (userId) query = query.where('user_id', '==', userId);

  const snapshot = await query.get();
  const requests = snapshot.docs
    .map((doc) => ({ request_id: doc.id, ...doc.data() }))
    .sort((a, b) => {
      const aTime = Date.parse((a as { createdAt?: string }).createdAt ?? '') || 0;
      const bTime = Date.parse((b as { createdAt?: string }).createdAt ?? '') || 0;
      return bTime - aTime;
    });

  return NextResponse.json(requests);
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);

  const userId = body?.user_id ? String(body.user_id).trim() : '';
  const userName = body?.user_name ? String(body.user_name).trim() : '';
  const celebrityName = body?.celebrity_name ? String(body.celebrity_name).trim() : '';
  const schemeId = body?.scheme_id ? String(body.scheme_id).trim() : '';
  const schemeTitle = body?.scheme_title ? String(body.scheme_title).trim() : '';
  const message = body?.message ? String(body.message).trim() : '';

  if (!userId || !celebrityName || !schemeId) {
    return NextResponse.json({ error: 'user_id, celebrity_name and scheme_id are required' }, { status: 400 });
  }

  if (!AMERICAN_CELEBRITIES.includes(celebrityName)) {
    return NextResponse.json({ error: 'Unknown celebrity selection' }, { status: 400 });
  }

  const db = getAdminFirestore();
  const now = new Date().toISOString();
  const record = {
    user_id: userId,
    user_name: userName || 'Usuário',
    celebrity_name: celebrityName,
    scheme_id: schemeId,
    scheme_title: schemeTitle || 'Esquema sem título',
    message: message || null,
    status: 'pending' as const,
    createdAt: now,
    decided_at: null,
  };

  const created = await db.collection(COLLECTIONS.CELEBRITY_TRIBUTE_REQUESTS).add(record);
  return NextResponse.json({ request_id: created.id, ...record }, { status: 201 });
}
