import { NextRequest, NextResponse } from 'next/server';
import { getAdminFirestore } from '@/app/lib/firebaseAdmin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body?.mannequin_id || !body?.pose_code || !body?.selection) {
      return NextResponse.json({ error: 'Missing outfit payload.' }, { status: 400 });
    }

    const db = getAdminFirestore();
    const now = new Date().toISOString();

    const payload = {
      mannequin_id: String(body.mannequin_id),
      pose_code: String(body.pose_code),
      selection: body.selection,
      createdAt: now,
      updatedAt: now,
    };

    const ref = await db.collection('outfitSelections').add(payload);
    return NextResponse.json({ outfit_id: ref.id, ...payload }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Unable to save outfit.' }, { status: 500 });
  }
}
