import { Tester2DMannequin, Tester2DSlot } from '@/app/config/tester2dMannequins';

export type Tester2DSlotCategory = Tester2DSlot;
export type Tester2DFitMode = 'contain' | 'cover' | 'stretch-width' | 'stretch-height';

export type Tester2DOverlayPiece = {
  piece_id: string;
  name: string;
  piece_type: string;
  image_url: string;
  category?: string;
  render_layer?: number;
  assetSource?: string;
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
  pieceName: string;
  pieceType: string;
  slot: Tester2DSlot;
  imageUrl: string;
  fitMode: Tester2DFitMode;
  scale: number;
  style: {
    left: number;
    top: number;
    width: number;
    height: number;
    zIndex: number;
    rotate: number;
  };
};

export type Tester2DOverlayPreset = {
  slot: Tester2DSlot;
  fitMode: Tester2DFitMode;
  scaleMultiplier: number;
  offsetX: number;
  offsetY: number;
  zIndex: number;
};

export const resolveSlotFromPieceType = (pieceType: string): Tester2DSlot => {
  const type = pieceType.toLowerCase();
  if (type.includes('upper') || type.includes('top') || type.includes('shirt') || type.includes('hoodie') || type.includes('jacket')) return 'upper';
  if (type.includes('lower') || type.includes('bottom') || type.includes('pant') || type.includes('short')) return 'lower';
  if (type.includes('shoe') || type.includes('sneaker') || type.includes('boot')) return 'shoes';
  return 'accessory';
};

export const DEFAULT_OVERLAY_PRESETS: Record<string, Tester2DOverlayPreset> = {
  't-shirt': { slot: 'upper', fitMode: 'contain', scaleMultiplier: 0.98, offsetX: 0, offsetY: 0, zIndex: 35 },
  hoodie: { slot: 'upper', fitMode: 'contain', scaleMultiplier: 1.02, offsetX: 0, offsetY: -8, zIndex: 36 },
  jacket: { slot: 'upper', fitMode: 'contain', scaleMultiplier: 1.04, offsetX: 0, offsetY: -4, zIndex: 37 },
  top: { slot: 'upper', fitMode: 'contain', scaleMultiplier: 1, offsetX: 0, offsetY: 0, zIndex: 35 },
  pants: { slot: 'lower', fitMode: 'contain', scaleMultiplier: 1, offsetX: 0, offsetY: 0, zIndex: 25 },
  shorts: { slot: 'lower', fitMode: 'contain', scaleMultiplier: 0.84, offsetX: 0, offsetY: -45, zIndex: 26 },
  skirt: { slot: 'lower', fitMode: 'contain', scaleMultiplier: 0.9, offsetX: 0, offsetY: -18, zIndex: 26 },
  sneakers: { slot: 'shoes', fitMode: 'contain', scaleMultiplier: 0.95, offsetX: 0, offsetY: 5, zIndex: 15 },
  shoes: { slot: 'shoes', fitMode: 'contain', scaleMultiplier: 0.95, offsetX: 0, offsetY: 5, zIndex: 15 },
  accessory: { slot: 'accessory', fitMode: 'contain', scaleMultiplier: 1, offsetX: 0, offsetY: 0, zIndex: 45 },
};

export function resolveOverlayPreset(pieceType: string): Tester2DOverlayPreset {
  const type = pieceType.toLowerCase();
  if (type.includes('shirt')) return DEFAULT_OVERLAY_PRESETS['t-shirt'];
  if (type.includes('hoodie')) return DEFAULT_OVERLAY_PRESETS.hoodie;
  if (type.includes('jacket') || type.includes('coat') || type.includes('outer')) return DEFAULT_OVERLAY_PRESETS.jacket;
  if (type.includes('short')) return DEFAULT_OVERLAY_PRESETS.shorts;
  if (type.includes('pant') || type.includes('jean') || type.includes('trouser')) return DEFAULT_OVERLAY_PRESETS.pants;
  if (type.includes('skirt')) return DEFAULT_OVERLAY_PRESETS.skirt;
  if (type.includes('sneaker') || type.includes('shoe') || type.includes('boot')) return DEFAULT_OVERLAY_PRESETS.sneakers;
  if (type.includes('upper') || type.includes('top')) return DEFAULT_OVERLAY_PRESETS.top;
  if (type.includes('lower') || type.includes('bottom')) return DEFAULT_OVERLAY_PRESETS.pants;
  return DEFAULT_OVERLAY_PRESETS.accessory;
}

export function resolveOverlayLayers(
  mannequin: Tester2DMannequin,
  equippedBySlot: Partial<Record<Tester2DSlot, Tester2DOverlayPiece>>,
): Tester2DOverlayLayer[] {
  return (Object.keys(equippedBySlot) as Tester2DSlot[])
    .flatMap((slot) => {
      const piece = equippedBySlot[slot];
      if (!piece) return [];
      const preset = resolveOverlayPreset(piece.piece_type);
      const resolvedSlot = preset.slot ?? slot;
      const anchor = mannequin.slots[resolvedSlot];
      if (!anchor) return [];
      const scale = (piece.adjustment?.scale ?? 1) * preset.scaleMultiplier;
      return [{
        pieceId: piece.piece_id,
        pieceName: piece.name,
        pieceType: piece.piece_type,
        slot: resolvedSlot,
        imageUrl: piece.image_url,
        fitMode: preset.fitMode,
        scale,
        style: {
          left: anchor.x + preset.offsetX + (piece.adjustment?.x ?? 0),
          top: anchor.y + preset.offsetY + (piece.adjustment?.y ?? 0),
          width: anchor.width * scale,
          height: anchor.height * scale,
          zIndex: piece.adjustment?.zIndex ?? piece.render_layer ?? preset.zIndex,
          rotate: piece.adjustment?.rotation ?? 0,
        },
      }];
    })
    .sort((a, b) => a.style.zIndex - b.style.zIndex);
}
