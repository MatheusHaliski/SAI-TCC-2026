export type PieceCategory = 'Premium' | 'Standard' | 'Limited Edition' | 'Rare';

export type OutfitPiece = {
  id: string;
  name: string;
  brand: string;
  brandLogoUrl?: string;
  pieceType: string;
  pieceTypeIconUrl?: string;
  category?: PieceCategory;
  wearstyles?: string[];
};

export type OutfitCardData = {
  outfitName: string;
  outfitStyleLine: string;
  outfitDescription?: string;
  heroImageUrl: string;
  pieces: OutfitPiece[];
};

const CATEGORY_STYLES: Record<PieceCategory, string> = {
  Premium: 'border-amber-300/40 bg-amber-100 text-amber-900',
  Standard: 'border-slate-300/40 bg-slate-200 text-slate-800',
  'Limited Edition': 'border-violet-300/40 bg-violet-100 text-violet-900',
  Rare: 'border-cyan-300/40 bg-cyan-100 text-cyan-900',
};

const PIECE_TYPE_FALLBACK_ICON: Record<string, string> = {
  jacket: '🧥',
  shirt: '👕',
  top: '👕',
  pants: '👖',
  trouser: '👖',
  bottoms: '👖',
  shoes: '👟',
  footwear: '👟',
  accessory: '👜',
  bag: '👜',
  watch: '⌚',
};

const DESCRIPTION_FALLBACKS = [
  'Balanced outfit with clean visual composition.',
  'Strong style identity with curated piece selection.',
  'Clean structure with a clear visual anchor.',
];

export function getCategoryBadgeStyle(category?: PieceCategory) {
  return CATEGORY_STYLES[category ?? 'Standard'];
}

export function normalizeWearstyles(wearstyles?: string[]) {
  if (!wearstyles?.length) return [];
  return wearstyles.filter(Boolean).slice(0, 3);
}

export function getPieceTypeFallbackIcon(pieceType?: string) {
  if (!pieceType) return '👗';
  const normalized = pieceType.trim().toLowerCase();
  const matchedKey = Object.keys(PIECE_TYPE_FALLBACK_ICON).find((key) => normalized.includes(key));
  return matchedKey ? PIECE_TYPE_FALLBACK_ICON[matchedKey] : '👗';
}

export function buildOutfitDescriptionFallback(input: {
  pieces: OutfitPiece[];
  outfitStyleLine?: string;
}) {
  const firstPiece = input.pieces[0];
  const dominantWearstyle = normalizeWearstyles(firstPiece?.wearstyles)[0];

  if (dominantWearstyle && firstPiece?.name) {
    return `${firstPiece.name} leads this composition with ${dominantWearstyle.toLowerCase()} influence.`;
  }

  if (input.outfitStyleLine) {
    return `Curated ${input.outfitStyleLine.toLowerCase()} direction with cohesive piece harmony.`;
  }

  return DESCRIPTION_FALLBACKS[0];
}
