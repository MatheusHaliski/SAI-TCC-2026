import { NextResponse } from 'next/server';
import { getAdminFirestore } from '@/app/lib/firebaseAdmin';
import { DRESS_TESTER_SEED_MANNEQUINS, DRESS_TESTER_SEED_PIECES } from '@/app/lib/dress-tester-seed';

const mapWardrobeTypeToSlot = (pieceType: string) => {
  if (pieceType.includes('upper') || pieceType.includes('top')) return 'top';
  if (pieceType.includes('lower') || pieceType.includes('bottom') || pieceType.includes('pants')) return 'bottom';
  if (pieceType.includes('shoe')) return 'shoes';
  if (pieceType.includes('dress')) return 'dress';
  if (pieceType.includes('outer')) return 'outerwear';
  if (pieceType.includes('bag')) return 'bag';
  return 'accessory';
};

const resolve2DImage = (item: Record<string, unknown>) =>
  String(item.approved_catalog_2d_url ?? item.normalized_2d_preview_url ?? item.raw_upload_image_url ?? item.image_url ?? '');

export async function GET() {
  try {
    const db = getAdminFirestore();
    const [mannequinSnap, piecesSnap, wardrobeSnap] = await Promise.all([
      db.collection('mannequin_2d').where('active', '==', true).get(),
      db.collection('wardrobe_piece_2d').where('active', '==', true).get(),
      db.collection('sai-wardrobeItems').get(),
    ]);

    const mannequins = mannequinSnap.docs.map((doc) => doc.data());
    const seededPieces = piecesSnap.docs.map((doc) => doc.data());

    const wardrobeDerivedPieces = wardrobeSnap.docs
      .map((doc) => ({ id: doc.id, ...(doc.data() as Record<string, unknown>) }))
      .filter((item) => Boolean(resolve2DImage(item)))
      .map((item, index) => ({
        piece_id: String(item.id),
        name: String(item.name ?? 'Wardrobe piece'),
        brand_id: String(item.brand_id ?? 'default'),
        market_id: String(item.market_id ?? 'default'),
        piece_type: mapWardrobeTypeToSlot(String(item.piece_type ?? 'accessory')),
        category_tier: 'user',
        mannequin_type: 'default',
        pose_code: 'default_front',
        render_layer: 20 + index,
        image_url: resolve2DImage(item),
        thumbnail_url: resolve2DImage(item),
        hide_layers: [],
        hides_piece_types: [],
        conflicts_with: [],
        compatible_piece_types: ['top', 'bottom', 'dress', 'shoes', 'bag', 'outerwear', 'accessory'],
        compatible_gender: ['female', 'male'],
        anchor: { x: 0, y: 0, scale: 1 },
        anchor_points: {
          default_front: { x: 0, y: 0, scale: 1 },
        },
        wearstyles: [],
        colors: [],
        materials: [],
        season: String(item.season ?? 'all'),
        gender: String(item.gender ?? 'unisex'),
        asset_status: 'ready_for_tester',
        active: true,
        created_at: String(item.created_at ?? new Date().toISOString()),
        updated_at: String(item.updated_at ?? new Date().toISOString()),
      }));

    return NextResponse.json({
      mannequins: mannequins.length ? mannequins : DRESS_TESTER_SEED_MANNEQUINS,
      pieces: [...seededPieces, ...wardrobeDerivedPieces].length ? [...seededPieces, ...wardrobeDerivedPieces] : DRESS_TESTER_SEED_PIECES,
    });
  } catch {
    return NextResponse.json({ mannequins: DRESS_TESTER_SEED_MANNEQUINS, pieces: DRESS_TESTER_SEED_PIECES });
  }
}
