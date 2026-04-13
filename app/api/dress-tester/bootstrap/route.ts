import { NextResponse } from 'next/server';
import { getAdminFirestore } from '@/app/lib/firebaseAdmin';
import { MannequinRepository } from '@/app/lib/fashion-ai/repositories/MannequinRepository';

const mannequinRepository = new MannequinRepository();

export async function GET() {
  try {
    const db = getAdminFirestore();
    const [mannequins, wardrobeSnap] = await Promise.all([
      mannequinRepository.list(),
      db.collection('sai-wardrobeItems').orderBy('updated_at', 'desc').limit(300).get(),
    ]);

    const pieces = wardrobeSnap.docs.map((doc) => {
      const data = doc.data() as Record<string, unknown>;
      return {
        pieceId: doc.id,
        name: String(data.name ?? 'Wardrobe piece'),
        imageUrl: String(data.image_url ?? ''),
        pieceType: String(data.piece_type ?? ''),
        gender: String(data.gender ?? 'unisex'),
        fitProfile: data.fitProfile ?? null,
      };
    });

    return NextResponse.json({ mannequins, pieces });
  } catch (error) {
    return NextResponse.json({ mannequins: [], pieces: [], error: error instanceof Error ? error.message : 'bootstrap_error' }, { status: 200 });
  }
}
