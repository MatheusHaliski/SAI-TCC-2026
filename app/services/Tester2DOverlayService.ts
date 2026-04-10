import { Tester2DMannequin, Tester2DSlot } from '@/app/config/tester2dMannequins';

export type Tester2DSlotCategory = Tester2DSlot;

export type Tester2DOverlayPiece = {
  piece_id: string;
  name: string;
  piece_type: string;
  image_url: string;
  render_layer?: number;
  adjustment?: {
    x?: number;
    y?: number;
    scale?: number;
    rotation?: number;
    zIndex?: number;
  };
};

export type Tester2DOverlayLayer = {
  pieceId: string;
  slot: Tester2DSlot;
  imageUrl: string;
  style: {
    left: number;
    top: number;
    width: number;
    height: number;
    zIndex: number;
    rotate: number;
  };
};

export const resolveSlotFromPieceType = (pieceType: string): Tester2DSlot => {
  const type = pieceType.toLowerCase();
  if (type.includes('upper') || type.includes('top') || type.includes('shirt') || type.includes('hoodie') || type.includes('jacket')) return 'upper';
  if (type.includes('lower') || type.includes('bottom') || type.includes('pant') || type.includes('short')) return 'lower';
  if (type.includes('shoe') || type.includes('sneaker') || type.includes('boot')) return 'shoes';
  return 'accessory';
};

export function resolveOverlayLayers(
  mannequin: Tester2DMannequin,
  equippedBySlot: Partial<Record<Tester2DSlot, Tester2DOverlayPiece>>,
): Tester2DOverlayLayer[] {
  const baseLayer: Record<Tester2DSlot, number> = { upper: 30, lower: 20, shoes: 10, accessory: 40 };

  return (Object.keys(equippedBySlot) as Tester2DSlot[])
    .flatMap((slot) => {
      const piece = equippedBySlot[slot];
      if (!piece) return [];
      const anchor = mannequin.anchors[slot];
      const scale = piece.adjustment?.scale ?? 1;
      return [{
        pieceId: piece.piece_id,
        slot,
        imageUrl: piece.image_url,
        style: {
          left: anchor.x + (piece.adjustment?.x ?? 0),
          top: anchor.y + (piece.adjustment?.y ?? 0),
          width: anchor.width * scale,
          height: anchor.height * scale,
          zIndex: piece.adjustment?.zIndex ?? piece.render_layer ?? baseLayer[slot],
          rotate: piece.adjustment?.rotation ?? 0,
        },
      }];
    })
    .sort((a, b) => a.style.zIndex - b.style.zIndex);
}
