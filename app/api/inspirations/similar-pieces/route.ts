import { SchemesRepository } from '@/app/backend/repositories/SchemesRepository';
import { WardrobeItemsRepository } from '@/app/backend/repositories/WardrobeItemsRepository';
import { NextResponse } from 'next/server';

const schemesRepository = new SchemesRepository();
const wardrobeRepository = new WardrobeItemsRepository();

// RF26 (Salvar → Inspirações): map a saved look to pieces the viewer already
// owns, instead of copying the original pieces into their wardrobe.
type Slot = 'upper' | 'lower' | 'shoes' | 'accessory';

function classifySlot(pieceType: string | undefined): Slot {
  const t = (pieceType ?? '').toLowerCase();
  if (/shoe|sneaker|boot|t[êe]nis|sapato|sandal/.test(t)) return 'shoes';
  if (/pant|trouser|short|skirt|jean|cal[çc]a|bermuda|saia|lower/.test(t)) return 'lower';
  if (/shirt|jacket|coat|top|blaz|sweater|camis|casaco|hood|upper|vestido|dress/.test(t)) return 'upper';
  return 'accessory';
}

const tokenize = (value: string) => value.toLowerCase().split(/[^a-zà-ú0-9]+/i).filter((tok) => tok.length > 2);

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const userId = String(body?.userId ?? '').trim();
    const schemeId = String(body?.schemeId ?? '').trim();
    if (!userId || !schemeId) {
      return NextResponse.json({ error: 'userId and schemeId are required' }, { status: 400 });
    }

    const scheme = await schemesRepository.findById(schemeId);
    if (!scheme) return NextResponse.json({ error: 'Scheme not found' }, { status: 404 });

    const lookPieces = Array.isArray(scheme.pieces) ? scheme.pieces : [];
    const wardrobe = await wardrobeRepository.findRichForAutopilot(userId);

    const results = lookPieces.map((piece) => {
      const lookType = piece.pieceType ?? '';
      const lookSlot = classifySlot(lookType);
      const lookTokens = new Set([...tokenize(lookType), ...tokenize(piece.name ?? '')]);

      const matches = wardrobe
        .map((item) => {
          let score = 0;
          if (classifySlot(item.piece_type) === lookSlot) score += 2;
          const itemTokens = new Set([...tokenize(item.piece_type), ...tokenize(item.name)]);
          for (const tok of lookTokens) if (itemTokens.has(tok)) score += 1;
          return { item, score };
        })
        .filter((m) => m.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 4)
        .map((m) => ({
          wardrobe_item_id: m.item.wardrobe_item_id,
          name: m.item.name,
          piece_type: m.item.piece_type,
          color: m.item.color,
          image_url: m.item.image_url,
          score: m.score,
        }));

      return {
        look_piece: {
          name: piece.name ?? 'Peça',
          pieceType: lookType,
          slot: lookSlot,
        },
        matches,
      };
    });

    return NextResponse.json({ ok: true, results });
  } catch {
    return NextResponse.json({ error: 'Unable to map similar pieces' }, { status: 500 });
  }
}
