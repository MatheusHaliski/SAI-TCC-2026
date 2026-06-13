import { NextRequest, NextResponse } from 'next/server';
import { getAdminFirestore } from '@/app/lib/firebaseAdmin';
import { COLLECTIONS } from '@/app/lib/collections';
import { SchemesRepository } from '@/app/backend/repositories/SchemesRepository';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const action = body?.action === 'accept' || body?.action === 'reject' ? body.action : null;

  if (!action) {
    return NextResponse.json({ error: 'action must be "accept" or "reject"' }, { status: 400 });
  }

  const db = getAdminFirestore();
  const ref = db.collection(COLLECTIONS.CELEBRITY_TRIBUTE_REQUESTS).doc(id);
  const snap = await ref.get();
  if (!snap.exists) {
    return NextResponse.json({ error: 'Tribute request not found' }, { status: 404 });
  }

  const tributeRequest = snap.data() as {
    user_id: string;
    celebrity_name: string;
    scheme_id: string;
    scheme_title: string;
    status: string;
  };

  if (tributeRequest.status !== 'pending') {
    return NextResponse.json({ error: 'Tribute request already decided' }, { status: 409 });
  }

  const now = new Date().toISOString();
  const status = action === 'accept' ? 'accepted' : 'rejected';
  await ref.set({ status, decided_at: now }, { merge: true });

  if (action === 'accept') {
    const schemesRepo = new SchemesRepository();
    await schemesRepo.assignCelebrityTribute(tributeRequest.scheme_id, tributeRequest.celebrity_name);

    await db.collection(COLLECTIONS.NOTIFICATIONS).add({
      user_id: tributeRequest.user_id,
      actor_id: 'sai-tributos',
      type: 'tribute_accepted',
      title: `Tributo de ${tributeRequest.celebrity_name} aceito!`,
      body: `Seu esquema "${tributeRequest.scheme_title}" recebeu o selo de tributo de ${tributeRequest.celebrity_name} e entrou no feed de celebridades deste mês.`,
      is_read: false,
      createdAt: now,
    });
  } else {
    await db.collection(COLLECTIONS.NOTIFICATIONS).add({
      user_id: tributeRequest.user_id,
      actor_id: 'sai-tributos',
      type: 'tribute_rejected',
      title: `Tributo de ${tributeRequest.celebrity_name} não aprovado`,
      body: `Sua solicitação de tributo para "${tributeRequest.scheme_title}" não foi aceita desta vez.`,
      is_read: false,
      createdAt: now,
    });
  }

  return NextResponse.json({ ok: true, request_id: id, status });
}
