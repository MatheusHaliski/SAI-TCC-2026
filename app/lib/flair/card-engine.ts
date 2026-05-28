import type { WardrobeItem, WardrobeImageAnalysis } from '@/app/backend/types/entities';
import type { OutfitBackgroundConfig, PieceCategory } from '@/app/lib/outfit-card';
import type {
  CardStats,
  CardStatsBreakdown,
  FlairCard,
  FlairDeck,
  ComboBonus,
  BrandSynergyBonus,
} from './types';

// ─── Wearstyle edge bonuses ──────────────────────────────────────────────────

const WEARSTYLE_EDGE_BONUS: Record<string, number> = {
  'statement piece': 22,
  'visual anchor': 18,
  'street energy': 16,
  'style accent': 12,
  'tonal layer': 10,
  'texture play': 10,
  'proportion play': 8,
  'pattern mix': 8,
  'monochrome anchor': 12,
  'contrast pop': 14,
};

// ─── BackgroundConfig art score ──────────────────────────────────────────────

const BACKGROUND_MATERIAL_BONUS: Record<string, number> = {
  embroidered_fabric: 12,
  lego_material: 10,
  glass_material: 15,
  water_material: 12,
  none: 0,
};

export function computeArtScore(bg: OutfitBackgroundConfig | null): number {
  if (!bg) return 10;

  let score = 10;

  if (bg.background_mode === 'gradient') score += 35;
  else if (bg.background_mode === 'ai_artwork') score += 65;

  const materialType = bg.materialLayer?.type ?? 'none';
  score += BACKGROUND_MATERIAL_BONUS[materialType] ?? 0;

  if (bg.ai_artwork?.generation_status === 'done') score += 15;

  const moodKeywords = ['editorial', 'luxury', 'vibrant', 'dark', 'ethereal'];
  const mood = (bg.ai_artwork?.mood ?? '').toLowerCase();
  moodKeywords.forEach((kw) => { if (mood.includes(kw)) score += 5; });

  if (bg.decorativeOverlayLayer?.stitchBorder) score += 5;

  return Math.min(100, score);
}

// ─── Primary stat computation ─────────────────────────────────────────────────

export function computeCardStats(
  item: Pick<
    WardrobeItem,
    | 'style_tags'
    | 'occasion_tags'
    | 'brand_detection_confidence'
    | 'season'
  > & {
    image_analysis?: Pick<
      WardrobeImageAnalysis,
      'catalog_readiness_score' | 'front_view_score'
    >;
    backgroundConfig?: OutfitBackgroundConfig | null;
    isFavorite?: boolean;
    currentSeason?: string;
  }
): CardStats {
  // EDGE — style power
  const styleTags: string[] = item.style_tags ?? [];
  const baseEdge = Math.min(60, styleTags.length * 12);
  const wearstyleBonus = styleTags.reduce(
    (sum, tag) => sum + (WEARSTYLE_EDGE_BONUS[tag.toLowerCase()] ?? 4),
    0
  );
  const edge = Math.min(100, baseEdge + wearstyleBonus);

  // RANGE — versatility
  const occasionTags: string[] = item.occasion_tags ?? [];
  const range = Math.min(100, occasionTags.length * 20);

  // CLOUT — brand prestige
  const confidence = item.brand_detection_confidence ?? 0;
  const clout = Math.min(100, Math.round(confidence * 80) + 20);

  // GLOW — visual presence
  const readiness = item.image_analysis?.catalog_readiness_score ?? 0;
  const frontView = item.image_analysis?.front_view_score ?? 0;
  const glow = Math.min(100, Math.round((readiness * 0.6 + frontView * 0.4) * 100));

  // ART — background sophistication
  const art = computeArtScore(item.backgroundConfig ?? null);

  // SYNC — season harmony
  const sync = item.currentSeason && item.season === item.currentSeason ? 100 : 0;

  return { edge, range, clout, glow, art, sync };
}

// ─── Total power ─────────────────────────────────────────────────────────────

const CATEGORY_MULTIPLIER: Record<PieceCategory, number> = {
  Standard: 1.0,
  Premium: 1.15,
  'Limited Edition': 1.30,
  Rare: 1.50,
};

export function computeTotalPower(stats: CardStats, category: PieceCategory): number {
  const base = (stats.edge + stats.range + stats.clout + stats.glow + stats.art) / 5;
  const syncBonus = stats.sync > 0 ? 8 : 0;
  return Math.round((base + syncBonus) * CATEGORY_MULTIPLIER[category]);
}

// ─── Special abilities ────────────────────────────────────────────────────────

export function deriveSpecialAbility(
  stats: CardStats,
  category: PieceCategory,
  styleTags: string[]
): string | null {
  if (category === 'Rare') {
    if (stats.edge >= 80) return 'TRENDSETTER — Doubles EDGE in outfit duels';
    if (stats.glow >= 80) return 'SPOTLIGHT — +30 GLOW to entire deck';
    return 'ICON — +20% total deck power when played as anchor';
  }
  if (category === 'Limited Edition') {
    if (styleTags.includes('statement piece')) return 'STATEMENT LOCK — Locks opponent\'s highest card';
    if (styleTags.includes('street energy')) return 'HYPE BOOST — +15 EDGE to adjacent street-energy cards';
    return 'EDITION BONUS — +10 to weakest stat in deck';
  }
  if (category === 'Premium') {
    if (stats.range >= 60) return 'CROSSOVER — Counts for any occasion in quests';
    return 'PREMIUM SHIELD — Resists one CLOUT debuff per duel';
  }
  return null;
}

// ─── Combo detection for decks ────────────────────────────────────────────────

export function computeComboBonuses(cards: FlairCard[]): ComboBonus[] {
  const combos: ComboBonus[] = [];

  // Style synergy: 2+ cards share a style_tag
  const styleTagCounts = new Map<string, string[]>();
  cards.forEach((card) => {
    card.styleTags.forEach((tag) => {
      const existing = styleTagCounts.get(tag) ?? [];
      styleTagCounts.set(tag, [...existing, card.cardId]);
    });
  });
  styleTagCounts.forEach((cardIds, tag) => {
    if (cardIds.length >= 2) {
      combos.push({
        type: 'style_synergy',
        label: `${tag} synergy (×${cardIds.length})`,
        bonusPoints: cardIds.length * 8,
        involvedCardIds: cardIds,
      });
    }
  });

  // Occasion synergy: all cards share at least one occasion_tag
  if (cards.length >= 2) {
    const sharedOccasions = cards[0].occasionTags.filter((occ) =>
      cards.slice(1).every((c) => c.occasionTags.includes(occ))
    );
    if (sharedOccasions.length > 0) {
      combos.push({
        type: 'occasion_synergy',
        label: `All-occasion: ${sharedOccasions[0]}`,
        bonusPoints: sharedOccasions.length * 12,
        involvedCardIds: cards.map((c) => c.cardId),
      });
    }
  }

  // Season sweep: all cards share the same season
  const seasons = cards.map((c) => c.season);
  const allSameSeason = seasons.every((s) => s === seasons[0]);
  if (allSameSeason && cards.length >= 3) {
    combos.push({
      type: 'season_sweep',
      label: `Season sweep: ${seasons[0]}`,
      bonusPoints: 25,
      involvedCardIds: cards.map((c) => c.cardId),
    });
  }

  // Material contrast: 2+ cards with different materials
  const uniqueMaterials = new Set(cards.map((c) => c.material).filter(Boolean));
  if (uniqueMaterials.size >= 3) {
    combos.push({
      type: 'material_contrast',
      label: `Material contrast (${uniqueMaterials.size} materials)`,
      bonusPoints: uniqueMaterials.size * 6,
      involvedCardIds: cards.map((c) => c.cardId),
    });
  }

  return combos;
}

export function computeBrandSynergy(cards: FlairCard[]): BrandSynergyBonus | null {
  const brandCounts = new Map<string, number>();
  cards.forEach((c) => {
    if (c.brand) brandCounts.set(c.brand, (brandCounts.get(c.brand) ?? 0) + 1);
  });

  let topBrand = '';
  let topCount = 0;
  brandCounts.forEach((count, brand) => {
    if (count > topCount) { topBrand = brand; topCount = count; }
  });

  if (topCount < 2) return null;

  const multiplier = topCount === 2 ? 1.1 : topCount === 3 ? 1.2 : topCount >= 4 ? 1.35 : 1.0;
  return {
    brand: topBrand,
    cardCount: topCount,
    multiplier,
    label: `${topBrand} ×${topCount} — ${Math.round((multiplier - 1) * 100)}% power boost`,
  };
}

// ─── Deck power aggregation ───────────────────────────────────────────────────

export function computeDeckPower(cards: FlairCard[]): {
  deckPower: number;
  comboBonuses: ComboBonus[];
  brandSynergy: BrandSynergyBonus | null;
  seasonBonus: number;
} {
  if (cards.length === 0) return { deckPower: 0, comboBonuses: [], brandSynergy: null, seasonBonus: 0 };

  const basePower = cards.reduce((sum, c) => sum + c.totalPower, 0) / cards.length;
  const comboBonuses = computeComboBonuses(cards);
  const comboBonus = comboBonuses.reduce((sum, c) => sum + c.bonusPoints, 0);
  const brandSynergy = computeBrandSynergy(cards);
  const brandMultiplier = brandSynergy?.multiplier ?? 1.0;
  const seasonBonus = cards.filter((c) => c.stats.sync > 0).length * 5;

  const deckPower = Math.round((basePower + comboBonus + seasonBonus) * brandMultiplier);
  return { deckPower, comboBonuses, brandSynergy, seasonBonus };
}

// ─── Full breakdown ───────────────────────────────────────────────────────────

export function computeCardStatsBreakdown(
  stats: CardStats,
  category: PieceCategory,
  styleTags: string[]
): CardStatsBreakdown {
  const totalPower = computeTotalPower(stats, category);
  const specialAbility = deriveSpecialAbility(stats, category, styleTags);

  const synergies: string[] = [];
  if (stats.edge >= 70 && stats.art >= 70) synergies.push('Visual Dominator');
  if (stats.range >= 80) synergies.push('All-rounder');
  if (stats.sync > 0) synergies.push('Season in Sync');
  if (stats.clout >= 80) synergies.push('Brand Icon');

  return { stats, totalPower, synergies, specialAbility };
}
