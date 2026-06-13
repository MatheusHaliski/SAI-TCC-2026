export type PieceCategory = 'Premium' | 'Standard' | 'Limited Edition' | 'Rare';

export type OutfitPiece = {
  id: string;
  wardrobeItemId?: string;
  name: string;
  brand: string;
  brandLogoUrl?: string;
  /** Direct 2D image URL for piece card modal visualization. */
  imageUrl?: string;
  pieceType: string;
  pieceTypeIconUrl?: string;
  category?: PieceCategory;
  wearstyles?: string[];
  /** Remix flag: piece comes from another user's scheme and must be swapped for one the user owns. */
  needsReplacement?: boolean;
  description?: string;
  creatorName?: string;
  occasion?: string;
  /** Community-quality base, 0–5. Default by tier: Premium→3.5, Rare→3.0, LimitedEdition→3.2, Standard→2.5 */
  baseQuality?: number;
  /** Aggregated like count, maintained via pieceLikes subcollection. */
  likes?: number;
  /** How many users own this piece. */
  ownersCount?: number;
  /** 0–5 explicit rating (distinct from computed quality stars). */
  ratingStars?: number;
};

export type OutfitMetaBadge = {
  label: string;
  icon?: string;
};

export type OutfitBackgroundMode = 'solid' | 'gradient' | 'ai_artwork';
export type OutfitGradientType = 'linear' | 'radial' | 'conic';
export type BackgroundStudioFamily = 'pattern_surface' | 'minimal_luxury' | 'editorial_branding' | 'geometry' | 'custom';
export type BackgroundStudioOverlayType = 'monogram' | 'glass_reflection' | 'linework' | 'glow' | 'gradient_sweep';
export type BackgroundMaterialType = 'none' | 'embroidered_fabric' | 'lego_material' | 'glass_material' | 'water_material';
export type BackgroundThreadDirection = 'diagonal' | 'cross' | 'horizontal' | 'vertical';
export type BackgroundMaterialFinish = 'matte' | 'satin';
export type BackgroundMaterialScope = 'card' | 'hero_block' | 'content_block';

export type BackgroundStudioStyleConfig = {
  presetId?: string | null;
  family?: BackgroundStudioFamily;
  styleMode?: string | null;
  material?: string | null;
  paletteMode?: string | null;
  gradient?: {
    colors: string[];
    angle?: number;
  } | null;
  overlays?: Array<{
    type: BackgroundStudioOverlayType;
    opacity?: number;
    density?: string;
    blendMode?: string;
  }>;
  referenceImageUrl?: string | null;
  shapeMode?: string | null;
  metadata?: Record<string, unknown>;
};

export type OutfitBackgroundConfig = {
  background_mode: OutfitBackgroundMode;
  solid_color?: string;
  opacity?: number;
  gradient?: {
    type: OutfitGradientType;
    angle?: number;
    intensity?: number;
    stops: Array<{
      color: string;
      position: number;
    }>;
  };
  ai_artwork?: {
    prompt: string;
    style?: string;
    mood?: string;
    palette?: string;
    image_url?: string;
    generation_status?: 'idle' | 'loading' | 'done' | 'failed';
  };
  texture_overlay?: boolean;
  materialLayer?: {
    type: BackgroundMaterialType;
    color?: string;
    density?: number;
    threadDirection?: BackgroundThreadDirection;
    threadThickness?: number;
    embossIntensity?: number;
    surfaceContrast?: number;
    finish?: BackgroundMaterialFinish;
    scope?: BackgroundMaterialScope;
    premium?: boolean;
  };
  decorativeOverlayLayer?: {
    stitchBorder?: boolean;
    stitchColor?: string;
    opacity?: number;
  };
  shape?: 'none' | 'orb' | 'diamond' | 'mesh' | 'stars' | 'circles' | 'triangles' | 'waves' | 'beams' | 'flowers' | 'arrows';
  studioStyleConfig?: BackgroundStudioStyleConfig;
  /** When true the card background is driven by the Aura system (based on like count) instead of the static config set in Studio. */
  dynamicBackground?: boolean;
};

export type CardSkinId = 'atelier' | 'spread' | 'index' | 'trading' | 'fai_max' | 'stub' | 'specimen';

/** Layout used to render the outfit's piece list on the card. */
export type OutfitPieceListFormat = 'grid-2' | 'grid-3' | 'stack' | 'plate' | 'magazine' | 'row';

export type OutfitCardDisplayMode = 'complete' | 'hide-hero' | 'hide-pieces' | 'pieces-only';
export type OutfitBrandSealTier = 'none' | 'free' | 'premium';

export type OutfitCardDisplayOptions = {
  /** Background used only behind the readable internal content, helpful over busy AI artwork. */
  contentPanelColor?: string;
  /** Controls which card sections stay visible in the final composition. */
  displayMode?: OutfitCardDisplayMode;
  /** Brand seal chosen during look creation. */
  brandSealTier?: OutfitBrandSealTier;
};

export type OutfitCardData = {
  outfitName: string;
  outfitStyleLine: string;
  outfitDescription?: string;
  heroImageUrl: string;
  outfitBackground?: OutfitBackgroundConfig | {
    type: 'solid' | 'gradient' | 'image';
    value: string;
    shape?: 'none' | 'orb' | 'diamond' | 'mesh' | 'stars' | 'circles' | 'triangles' | 'waves' | 'beams' | 'flowers' | 'arrows';
  };
  metaBadges?: OutfitMetaBadge[];
  brands?: string[];
  pieces: OutfitPiece[];
  schemeId?: string;
  creatorId?: string;
  creatorName?: string;
  titleFontFamily?: string;
  score?: number;
  /** 0–5 star rating rendered in the outfit header. */
  ratingStars?: number;
  /** How many users have saved/own this outfit. */
  ownersCount?: number;
  /** Outfit-level like count (distinct from individual piece likes). */
  outfitLikes?: number;
  /** Occasion label rendered alongside the style line. */
  occasion?: string;
  cardSkin?: CardSkinId;
  /** Aggregated like count used by the Aura system when dynamicBackground is enabled. */
  likes?: number;
  /** Layout used to render the piece list. Defaults to 'grid-2'. */
  pieceListFormat?: OutfitPieceListFormat;
  /** Readability and section visibility options for the outfit card. */
  displayOptions?: OutfitCardDisplayOptions;
};

const FALLBACK_BACKGROUND: OutfitBackgroundConfig = {
  background_mode: 'gradient',
  gradient: {
    type: 'linear',
    angle: 145,
    intensity: 110,
    stops: [
      { color: '#0f172a', position: 0 },
      { color: '#312e81', position: 100 },
    ],
  },
  shape: 'none',
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const hexToRgba = (hex: string, alpha: number) => {
  const normalized = /^#([0-9A-F]{6})$/i.test(hex) ? hex : '#111827';
  const r = parseInt(normalized.slice(1, 3), 16);
  const g = parseInt(normalized.slice(3, 5), 16);
  const b = parseInt(normalized.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export function resolveOutfitBackgroundForRender(input?: OutfitCardData['outfitBackground']): OutfitBackgroundConfig {
  if (!input) return FALLBACK_BACKGROUND;
  if ('background_mode' in input) return input;

  if (input.type === 'solid') {
    return { background_mode: 'solid', solid_color: input.value, shape: input.shape };
  }

  if (input.type === 'gradient') {
    return {
      background_mode: 'gradient',
      gradient: {
        type: 'linear',
        angle: 140,
        intensity: 100,
        stops: [
          { color: '#0f172a', position: 0 },
          { color: '#334155', position: 100 },
        ],
      },
      shape: input.shape,
    } as OutfitBackgroundConfig;
  }

  return {
    background_mode: 'ai_artwork',
    ai_artwork: {
      prompt: 'Legacy imported background',
      image_url: input.value,
      generation_status: 'done',
    },
    shape: input.shape,
  };
}

export function buildBackgroundCssStyle(background: OutfitBackgroundConfig) {
  if (background.background_mode === 'solid') {
    return { background: background.solid_color || '#111827' };
  }

  if (background.background_mode === 'gradient' && background.gradient?.stops?.length) {
    const stops = background.gradient.stops
      .slice(0, 3)
      .map((stop) => `${stop.color} ${clamp(stop.position, 0, 100)}%`)
      .join(', ');
    const gradientType = background.gradient.type || 'linear';
    const intensity = clamp(background.gradient.intensity ?? 100, 20, 120) / 100;

    const gradientValue =
      gradientType === 'radial'
        ? `radial-gradient(circle at center, ${stops})`
        : gradientType === 'conic'
          ? `conic-gradient(from ${background.gradient.angle ?? 180}deg at 50% 50%, ${stops})`
          : `linear-gradient(${background.gradient.angle ?? 135}deg, ${stops})`;

    return {
      backgroundImage: gradientValue,
      filter: `saturate(${intensity})`,
    };
  }

  if (background.background_mode === 'ai_artwork' && background.ai_artwork?.image_url) {
    return {
      backgroundImage: `url(${background.ai_artwork.image_url})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    };
  }

  return { background: '#111827' };
}

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

type DescriptionTemplateInput = Omit<DescriptionGeneratorInput, 'mood' | 'palette' | 'occasion'> & {
  mood: string;
  palette: string;
  occasion: string;
  styleLine: string;
  heroPiece: string;
  piecesSummary: string;
  slotCount: number;
};

const DESCRIPTION_TEMPLATES = [
  ({ mood, styleLine, heroPiece, slotCount }: DescriptionTemplateInput) =>
    `This composition explores a ${mood} mood with ${styleLine.toLowerCase()} direction, anchored by ${heroPiece} and balanced across ${slotCount} curated slots.`,
  ({ occasion, palette, styleLine, heroPiece }: DescriptionTemplateInput) =>
    `Built for ${occasion.toLowerCase()} use, this ${styleLine.toLowerCase()} look pairs ${palette} tones with ${heroPiece} as the visual lead.`,
  ({ styleLine, piecesSummary, mood }: DescriptionTemplateInput) =>
    `A ${styleLine.toLowerCase()} outfit with ${piecesSummary}, delivering a ${mood} aesthetic and a polished premium feel.`,
  ({ heroPiece, palette, occasion }: DescriptionTemplateInput) =>
    `${heroPiece} drives the statement while ${palette} accents keep the silhouette cohesive for ${occasion.toLowerCase()} moments.`,
  ({ styleLine, piecesSummary, mood, occasion }: DescriptionTemplateInput) =>
    `Curated for ${occasion.toLowerCase()}, this ${styleLine.toLowerCase()} composition combines ${piecesSummary} to create a ${mood} identity.`,
  ({ styleLine, heroPiece, palette }: DescriptionTemplateInput) =>
    `Editorial-inspired and ${styleLine.toLowerCase()}, this outfit positions ${heroPiece} against ${palette} accents for refined visual rhythm.`,
];

type DescriptionGeneratorInput = {
  outfitName?: string;
  style?: string;
  occasion?: string;
  visibility?: 'private' | 'followers' | 'public';
  brand?: string;
  palette?: string;
  mood?: string;
  pieces: OutfitPiece[];
  schemeId?: string;
  creatorId?: string;
  creatorName?: string;
  titleFontFamily?: string;
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
  } as DescriptionTemplateInput);
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
