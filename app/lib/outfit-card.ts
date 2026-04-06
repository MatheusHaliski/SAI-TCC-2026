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

export type OutfitMetaBadge = {
  label: string;
  icon?: string;
};

export type OutfitCardData = {
  outfitName: string;
  outfitStyleLine: string;
  outfitDescription?: string;
  heroImageUrl: string;
  outfitBackground?: {
    type: 'solid' | 'gradient' | 'image';
    value: string;
    shape?: 'none' | 'orb' | 'diamond' | 'mesh';
  };
  metaBadges?: OutfitMetaBadge[];
  brands?: string[];
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

const BRAND_LOGO_BY_NAME: Record<string, string> = {
  adidas: '/adidas.png',
  nike: '/nike.png',
  zara: '/zara.jpg',
  puma: '/puma.jpg',
  lacoste: '/lacoste.jpg',
  levis: '/levis.jpg',
  'c&a': '/cea.jpg',
  cea: '/cea.jpg',
};

const DESCRIPTION_FALLBACKS = [
  'Balanced outfit with clean visual composition.',
  'Strong style identity with curated piece selection.',
  'Clean structure with a clear visual anchor.',
  'Refined mix of essentials shaped for confident everyday wear.',
  'Intentional layering creates a polished and expressive silhouette.',
  'Versatile combination tuned for comfort, impact, and flow.',
];

const CATEGORY_FALLBACK_ICON: Record<PieceCategory, string> = {
  Premium: '💎',
  Standard: '✨',
  'Limited Edition': '🪄',
  Rare: '⭐',
};

const DESCRIPTION_TEMPLATES = [
  ({ mood, styleLine, heroPiece, slotCount }: DescriptionGeneratorInput) =>
    `This composition explores a ${mood} mood with ${styleLine.toLowerCase()} direction, anchored by ${heroPiece} and balanced across ${slotCount} curated slots.`,
  ({ occasion, palette, styleLine, heroPiece }: DescriptionGeneratorInput) =>
    `Built for ${occasion.toLowerCase()} use, this ${styleLine.toLowerCase()} look pairs ${palette} tones with ${heroPiece} as the visual lead.`,
  ({ styleLine, piecesSummary, mood }: DescriptionGeneratorInput) =>
    `A ${styleLine.toLowerCase()} outfit with ${piecesSummary}, delivering a ${mood} aesthetic and a polished premium feel.`,
  ({ heroPiece, palette, occasion }: DescriptionGeneratorInput) =>
    `${heroPiece} drives the statement while ${palette} accents keep the silhouette cohesive for ${occasion.toLowerCase()} moments.`,
  ({ styleLine, piecesSummary, mood, occasion }: DescriptionGeneratorInput) =>
    `Curated for ${occasion.toLowerCase()}, this ${styleLine.toLowerCase()} composition combines ${piecesSummary} to create a ${mood} identity.`,
  ({ styleLine, heroPiece, palette }: DescriptionGeneratorInput) =>
    `Editorial-inspired and ${styleLine.toLowerCase()}, this outfit positions ${heroPiece} against ${palette} accents for refined visual rhythm.`,
];

type DescriptionGeneratorInput = {
  outfitName?: string;
  style?: string;
  occasion?: string;
  visibility?: 'private' | 'public';
  brand?: string;
  palette?: string;
  mood?: string;
  pieces: OutfitPiece[];
};

export function getCategoryBadgeStyle(category?: PieceCategory) {
  return CATEGORY_STYLES[category ?? 'Standard'];
}

export function normalizeWearstyles(wearstyles?: string[]) {
  if (!wearstyles?.length) return [];
  return wearstyles.filter(Boolean).slice(0, 3);
}

const PIECE_TYPE_WEARSTYLE_FALLBACKS: Array<{ matchers: string[]; wearstyles: string[] }> = [
  { matchers: ['jacket', 'coat', 'blazer'], wearstyles: ['Statement Piece', 'Visual Anchor'] },
  { matchers: ['hoodie', 'sweatshirt', 'sweater'], wearstyles: ['Street Core', 'Balanced Fit'] },
  { matchers: ['shirt', 'tee', 'top', 'blouse'], wearstyles: ['Visual Anchor', 'Balanced Fit'] },
  { matchers: ['dress'], wearstyles: ['Visual Highlight', 'Statement Piece'] },
  { matchers: ['pants', 'trouser', 'jeans', 'skirt', 'shorts', 'lower', 'bottom'], wearstyles: ['Base Structure', 'Balanced Fit'] },
  { matchers: ['shoes', 'shoe', 'footwear', 'boots', 'sneakers', 'heels', 'loafers'], wearstyles: ['Trend Driver', 'Street Energy'] },
  { matchers: ['accessory', 'bag', 'watch', 'belt', 'hat', 'jewelry', 'jewellery'], wearstyles: ['Style Accent', 'Attention Grabber'] },
];

export function inferWearstylesByPieceType(pieceType?: string) {
  const normalizedType = pieceType?.trim().toLowerCase() ?? '';
  if (!normalizedType) return ['Style Accent'];

  const matchedFallback = PIECE_TYPE_WEARSTYLE_FALLBACKS.find(({ matchers }) =>
    matchers.some((matcher) => normalizedType.includes(matcher)),
  );

  return matchedFallback?.wearstyles ?? ['Style Accent'];
}

const WEARSTYLE_ICON_FILE_MAP: Record<string, string> = {
  'statement piece': '/statementpiece.png',
  'street core': '/streetcore.png',
  'visual anchor': '/visualanchor.png',
  'base structure': '/basestructure.png',
  'balanced fit': '/balancedfit.png',
  'trend driver': '/trenddriver.png',
  'street energy': '/streetenergy.png',
  'visual highlight': '/visualhighlight.png',
  'style accent': '/styleaccent.png',
  'attention grabber': '/attentiongrabber.png',
};

export function getWearstyleIconPath(wearstyle: string) {
  const mapped = WEARSTYLE_ICON_FILE_MAP[wearstyle.trim().toLowerCase()];
  if (mapped) return mapped;

  const normalizedFileName = wearstyle
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '');

  return `/${normalizedFileName}.png`;
}

export function getDefaultWearstyleIconDataUri() {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 18 18'><rect x='1.5' y='1.5' width='15' height='15' rx='4' fill='#EEF2FF' stroke='#CBD5E1'/><circle cx='9' cy='9' r='3.25' fill='#6366F1'/></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export function getPieceTypeFallbackIcon(pieceType?: string) {
  if (!pieceType) return '👗';
  const normalized = pieceType.trim().toLowerCase();
  const matchedKey = Object.keys(PIECE_TYPE_FALLBACK_ICON).find((key) => normalized.includes(key));
  return matchedKey ? PIECE_TYPE_FALLBACK_ICON[matchedKey] : '👗';
}

export function getCategoryFallbackIcon(category?: PieceCategory) {
  return CATEGORY_FALLBACK_ICON[category ?? 'Standard'];
}

export function resolveBrandLogoUrlByName(brandName?: string) {
  if (!brandName?.trim()) return null;
  const normalizedName = brandName.trim().toLowerCase();
  const compactName = normalizedName.replace(/[^a-z0-9&]/g, '');
  return BRAND_LOGO_BY_NAME[normalizedName] ?? BRAND_LOGO_BY_NAME[compactName] ?? null;
}

export function buildOutfitDescriptionRich(input: DescriptionGeneratorInput) {
  const style = input.style?.trim() || 'casual';
  const occasion = input.occasion?.trim() || 'daily';
  const styleLine = `${style} ${occasion}`;
  const mood = input.mood?.trim() || 'refined urban';
  const palette = input.palette?.trim() || 'balanced neutral';
  const heroPiece = input.pieces[0]?.name || 'the selected hero piece';
  const piecesSummary = input.pieces
    .slice(0, 3)
    .map((piece) => piece.name)
    .join(', ') || 'curated essentials';

  const seedSource = `${input.outfitName || ''}|${style}|${occasion}|${input.brand || ''}|${input.visibility || ''}|${input.pieces
    .map((piece) => piece.id)
    .join('|')}`;
  const seed = seedSource.length % DESCRIPTION_TEMPLATES.length;

  return DESCRIPTION_TEMPLATES[seed]({
    ...input,
    style,
    occasion,
    mood,
    palette,
    heroPiece,
    styleLine,
    piecesSummary,
    slotCount: input.pieces.length || 1,
  } as DescriptionGeneratorInput & {
    heroPiece: string;
    styleLine: string;
    piecesSummary: string;
    slotCount: number;
  });
}

export function buildOutfitDescriptionFallback(input: {
  pieces: OutfitPiece[];
  outfitStyleLine?: string;
  outfitName?: string;
}) {
  const firstPiece = input.pieces[0];
  const normalizedWearstyles = normalizeWearstyles(firstPiece?.wearstyles);
  const dominantWearstyle = normalizedWearstyles[0];
  const styleLine = input.outfitStyleLine?.trim();

  if (dominantWearstyle && firstPiece?.name) {
    return `${firstPiece.name} leads this composition with ${dominantWearstyle.toLowerCase()} influence.`;
  }

  if (styleLine && input.pieces.length >= 3) {
    return `Curated ${styleLine.toLowerCase()} direction with layered balance across ${input.pieces.length} key pieces.`;
  }

  if (styleLine && input.outfitName?.trim()) {
    return `${input.outfitName.trim()} explores a ${styleLine.toLowerCase()} mood with clean, intentional styling.`;
  }

  if (styleLine) {
    return `Curated ${styleLine.toLowerCase()} direction with cohesive piece harmony.`;
  }

  const seed = input.pieces
    .map((piece) => `${piece.name}|${piece.pieceType}|${piece.category ?? 'standard'}`)
    .join('|')
    .length;

  return DESCRIPTION_FALLBACKS[seed % DESCRIPTION_FALLBACKS.length];
}
