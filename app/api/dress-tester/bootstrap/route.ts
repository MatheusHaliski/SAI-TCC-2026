import { NextResponse } from 'next/server';
import { getAdminFirestore } from '@/app/lib/firebaseAdmin';
import { DRESS_TESTER_SEED_MANNEQUINS, DRESS_TESTER_SEED_PIECES } from '@/app/lib/dress-tester-seed';

export async function GET() {
  try {
    const db = getAdminFirestore();
    const [mannequinSnap, piecesSnap] = await Promise.all([
      db.collection('mannequin_2d').where('active', '==', true).get(),
      db.collection('wardrobe_piece_2d').where('active', '==', true).get(),
    ]);

    const mannequins = mannequinSnap.docs.map((doc) => doc.data());
    const pieces = piecesSnap.docs.map((doc) => doc.data());

    return NextResponse.json({
      mannequins: mannequins.length ? mannequins : DRESS_TESTER_SEED_MANNEQUINS,
      pieces: pieces.length ? pieces : DRESS_TESTER_SEED_PIECES,
    });
  } catch {
    return NextResponse.json({ mannequins: DRESS_TESTER_SEED_MANNEQUINS, pieces: DRESS_TESTER_SEED_PIECES });
  }
}
