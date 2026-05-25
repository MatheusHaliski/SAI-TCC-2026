import { NextResponse } from 'next/server';
import { getAdminFirestore } from '@/app/lib/firebaseAdmin';
import { MannequinRepository } from '@/app/lib/fashion-ai/repositories/MannequinRepository';

const mannequinRepository = new MannequinRepository();

type OutfitSlot = 'upper' | 'lower' | 'shoes' | 'accessory';
type GarmentCategory = 'tops' | 'bottoms' | 'full-body' | 'shoes' | 'accessory';

function getPieceSlotType(pieceType: string): OutfitSlot {
  const t = pieceType.toLowerCase();
  if (t.includes('lower') || t.includes('bottom') || t.includes('pant') || t.includes('jean') || t.includes('short') || t.includes('skirt') || t.includes('trouser')) return 'lower';
  if (t.includes('shoe') || t.includes('sneaker') || t.includes('boot') || t.includes('heel') || t.includes('loafer') || t.includes('sandal')) return 'shoes';
  if (t.includes('bag') || t.includes('accessory') || t.includes('hat') || t.includes('cap') || t.includes('scarf') || t.includes('belt') || t.includes('sunglass') || t.includes('watch') || t.includes('jewelry') || t.includes('necklace')) return 'accessory';
  return 'upper';
}

function getPieceCategory(pieceType: string, slotType: OutfitSlot): GarmentCategory {
  const t = pieceType.toLowerCase();
  if (slotType === 'lower') return 'bottoms';
  if (slotType === 'shoes') return 'shoes';
  if (slotType === 'accessory') return 'accessory';
  if (t.includes('full') || t.includes('dress') || t.includes('jumpsuit') || t.includes('romper')) return 'full-body';
  return 'tops';
}

export async function GET() {
  try {
    const db = getAdminFirestore();
    const [mannequins, wardrobeSnap] = await Promise.all([
      mannequinRepository.list(),
      db.collection('saiWardrobeItems').orderBy('updatedAt', 'desc').limit(300).get(),
    ]);

    const pieces = wardrobeSnap.docs.map((doc) => {
      const data = doc.data() as Record<string, unknown>;
      const pieceType = String(data.piece_type ?? '');
      const slotType = getPieceSlotType(pieceType);
      const category = getPieceCategory(pieceType, slotType);
      return {
        pieceId: doc.id,
        name: String(data.name ?? 'Wardrobe piece'),
        imageUrl: String(data.image_url ?? ''),
        pieceType,
        category,
        slotType,
        gender: String(data.gender ?? 'unisex'),
        fitProfile: data.fitProfile ?? null,
        tryOn2dResultUrl: typeof data.tryOn2dResultUrl === 'string' ? data.tryOn2dResultUrl : null,
      };
    });

    return NextResponse.json({ mannequins, pieces });
  } catch (error) {
    return NextResponse.json({ mannequins: [], pieces: [], error: error instanceof Error ? error.message : 'bootstrap_error' }, { status: 200 });
  }
}
