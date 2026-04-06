import { NextRequest, NextResponse } from 'next/server';
import { getAdminFirestore } from '@/app/lib/firebaseAdmin';
import { DRESS_TESTER_CATEGORIES } from '@/app/lib/dress-tester-models';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const pieceType = String(body?.piece_type ?? '');
    if (!body?.name || !body?.image_url || !DRESS_TESTER_CATEGORIES.includes(pieceType as (typeof DRESS_TESTER_CATEGORIES)[number])) {
      return NextResponse.json({ error: 'name, image_url and valid piece_type are required.' }, { status: 400 });
    }

    const db = getAdminFirestore();
    const now = new Date().toISOString();
    const ref = db.collection('wardrobe_piece_2d').doc();

    const payload = {
      piece_id: ref.id,
      name: String(body.name),
      brand_id: String(body.brand_id ?? 'brand_1'),
      market_id: String(body.market_id ?? 'market_1'),
      piece_type: pieceType,
      category_tier: String(body.category_tier ?? 'premium'),
      mannequin_type: String(body.mannequin_type ?? 'female_editorial'),
      pose_code: String(body.pose_code ?? 'pose_a'),
      render_layer: Number(body.render_layer ?? 20),
      image_url: String(body.image_url),
      thumbnail_url: String(body.thumbnail_url ?? body.image_url),
      hide_layers: Array.isArray(body.hide_layers) ? body.hide_layers.map((item: unknown) => String(item)) : [],
      hides_piece_types: Array.isArray(body.hides_piece_types) ? body.hides_piece_types.map((item: unknown) => String(item)) : [],
      conflicts_with: Array.isArray(body.conflicts_with) ? body.conflicts_with.map((item: unknown) => String(item)) : [],
      compatible_piece_types: Array.isArray(body.compatible_piece_types) ? body.compatible_piece_types.map((item: unknown) => String(item)) : [],
      anchor: body.anchor && typeof body.anchor === 'object'
        ? {
            x: Number((body.anchor as { x?: number }).x ?? 0),
            y: Number((body.anchor as { y?: number }).y ?? 0),
            scale: Number((body.anchor as { scale?: number }).scale ?? 1),
          }
        : { x: 0, y: 0, scale: 1 },
      wearstyles: Array.isArray(body.wearstyles) ? body.wearstyles.map((item: unknown) => String(item)) : [],
      colors: Array.isArray(body.colors) ? body.colors.map((item: unknown) => String(item)) : [],
      materials: Array.isArray(body.materials) ? body.materials.map((item: unknown) => String(item)) : [],
      season: String(body.season ?? 'all'),
      gender: String(body.gender ?? 'female'),
      asset_status: String(body.asset_status ?? 'draft'),
      active: true,
      created_at: now,
      updated_at: now,
    };

    await ref.set(payload);
    return NextResponse.json(payload, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Unable to create wardrobe piece.' }, { status: 500 });
  }
}
