import { AutopilotWardrobeItem, Occasion, Mood, OutfitPreferences, SchemeSuggestion, WeatherInfo } from '@/app/backend/types/entities';
import { WeatherService } from './WeatherService';

const UPPER_TYPES = new Set(['upper_piece', 'top', 'blouse', 'shirt', 'jacket', 'coat', 'outerwear', 'sweater', 'hoodie', 'camiseta', 'blusão', 'camisa']);
const LOWER_TYPES = new Set(['lower_piece', 'bottom', 'pants', 'jeans', 'skirt', 'shorts', 'trousers', 'calça', 'saia', 'bermuda']);
const DRESS_TYPES = new Set(['dress', 'jumpsuit', 'romper', 'vestido', 'macacão']);
const SHOES_TYPES = new Set(['shoes_piece', 'shoes', 'boots', 'sneakers', 'sandals', 'heels', 'sapatos', 'tênis', 'bota', 'sandália']);
const ACCESSORY_TYPES = new Set(['accessory_piece', 'accessory', 'bag', 'hat', 'belt', 'bolsa', 'acessório', 'chapéu', 'cinto']);

const OCCASION_WEIGHTS: Record<Occasion, string[]> = {
  trabalho: ['formal', 'trabalho', 'social', 'casual'],
  casual: ['casual', 'street', 'day', 'relax'],
  balada: ['party', 'night', 'balada', 'festivo', 'chic'],
  academia: ['sport', 'academia', 'fitness', 'esportivo'],
  evento: ['event', 'formal', 'gala', 'evento', 'social'],
};

const CLIMATE_PIECE_SCORES: Record<string, Record<string, number>> = {
  summer: {
    top: 1.0, blouse: 1.0, shirt: 0.9, 'upper_piece': 0.8,
    skirt: 1.0, shorts: 1.0, 'lower_piece': 0.7,
    dress: 1.0, jumpsuit: 0.8,
    sandals: 1.0, sneakers: 0.8, shoes: 0.7, 'shoes_piece': 0.7,
    jacket: 0.2, coat: 0.0, sweater: 0.1, boots: 0.2,
  },
  spring_fall: {
    top: 0.9, blouse: 0.9, shirt: 1.0, 'upper_piece': 0.9,
    pants: 1.0, jeans: 1.0, skirt: 0.7, 'lower_piece': 0.9,
    dress: 0.7, jumpsuit: 0.7,
    sneakers: 1.0, shoes: 1.0, boots: 0.8, sandals: 0.4, 'shoes_piece': 0.9,
    jacket: 0.9, sweater: 0.9, coat: 0.5,
  },
  fall_layers: {
    top: 0.7, blouse: 0.7, shirt: 0.8, 'upper_piece': 0.7,
    pants: 1.0, jeans: 1.0, skirt: 0.4, 'lower_piece': 0.9,
    dress: 0.3, jumpsuit: 0.4,
    sneakers: 0.9, boots: 1.0, shoes: 0.8, sandals: 0.1, 'shoes_piece': 0.8,
    jacket: 1.0, sweater: 1.0, coat: 0.9,
  },
  winter: {
    top: 0.4, blouse: 0.3, shirt: 0.5, 'upper_piece': 0.5,
    pants: 1.0, jeans: 1.0, skirt: 0.2, shorts: 0.0, 'lower_piece': 0.9,
    dress: 0.2, jumpsuit: 0.3,
    sneakers: 0.6, boots: 1.0, shoes: 0.7, sandals: 0.0, 'shoes_piece': 0.7,
    jacket: 1.0, coat: 1.0, sweater: 1.0,
  },
};

const MAX_WEIGHT = 10;
const WEIGHTS = { occasion: 0.35, climate: 0.25, preference: 0.25, diversity: 0.15 };

interface RankingContext {
  occasion: Occasion;
  mood: Mood;
  weather: WeatherInfo;
  preferences: OutfitPreferences | null;
}

interface Combination {
  upper: AutopilotWardrobeItem | null;
  lower: AutopilotWardrobeItem | null;
  dress: AutopilotWardrobeItem | null;
  shoes: AutopilotWardrobeItem | null;
}

export class OutfitRankingService {
  private readonly maxCandidates: number;
  private readonly topN: number;
  private readonly weatherService: WeatherService;

  constructor(weatherService = new WeatherService()) {
    this.maxCandidates = Number(process.env.AUTOPILOT_MAX_CANDIDATES ?? 50);
    this.topN = Number(process.env.AUTOPILOT_TOP_N ?? 3);
    this.weatherService = weatherService;
  }

  generateTop3(
    wardrobe: AutopilotWardrobeItem[],
    context: RankingContext,
  ): SchemeSuggestion[] {
    const uppers = wardrobe.filter((i) => this.classifyItem(i) === 'upper');
    const lowers = wardrobe.filter((i) => this.classifyItem(i) === 'lower');
    const dresses = wardrobe.filter((i) => this.classifyItem(i) === 'dress');
    const shoes = wardrobe.filter((i) => this.classifyItem(i) === 'shoes');

    const tempCategory = this.weatherService.getTemperatureCategory(context.weather.temp_c);
    const candidates = this.buildCandidates(uppers, lowers, dresses, shoes, tempCategory);

    const scored = candidates
      .map((combo) => ({ combo, score: this.scoreCombo(combo, context, tempCategory) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, this.topN);

    return scored.map(({ combo, score }, index) => {
      const items: AutopilotWardrobeItem[] = [
        combo.dress ?? combo.upper,
        combo.lower,
        combo.shoes,
      ].filter((item): item is AutopilotWardrobeItem => item !== null);

      const scheme_id = items
        .map((i) => i.wardrobe_item_id)
        .sort()
        .join('_');

      return {
        scheme_id,
        title: `Look do Dia #${index + 1}`,
        items,
        weather_fit_note: this.weatherService.buildWeatherFitNote(context.weather.temp_c, context.weather.condition),
        score,
      };
    });
  }

  private classifyItem(item: AutopilotWardrobeItem): 'upper' | 'lower' | 'dress' | 'shoes' | 'accessory' | 'unknown' {
    const t = item.piece_type.toLowerCase();
    if (UPPER_TYPES.has(t)) return 'upper';
    if (LOWER_TYPES.has(t)) return 'lower';
    if (DRESS_TYPES.has(t)) return 'dress';
    if (SHOES_TYPES.has(t)) return 'shoes';
    if (ACCESSORY_TYPES.has(t)) return 'accessory';
    if (t.includes('upper')) return 'upper';
    if (t.includes('lower')) return 'lower';
    if (t.includes('dress')) return 'dress';
    if (t.includes('shoes') || t.includes('shoe')) return 'shoes';
    return 'unknown';
  }

  private buildCandidates(
    uppers: AutopilotWardrobeItem[],
    lowers: AutopilotWardrobeItem[],
    dresses: AutopilotWardrobeItem[],
    shoesList: AutopilotWardrobeItem[],
    tempCategory: string,
  ): Combination[] {
    const candidates: Combination[] = [];

    // upper + lower combinations
    for (const upper of uppers) {
      for (const lower of lowers) {
        const shoe = this.pickBestShoe(shoesList, tempCategory);
        candidates.push({ upper, lower, dress: null, shoes: shoe });
        if (candidates.length >= this.maxCandidates) break;
      }
      if (candidates.length >= this.maxCandidates) break;
    }

    // dress combinations
    for (const dress of dresses) {
      if (candidates.length >= this.maxCandidates) break;
      const shoe = this.pickBestShoe(shoesList, tempCategory);
      candidates.push({ upper: null, lower: null, dress, shoes: shoe });
    }

    return candidates;
  }

  private pickBestShoe(
    shoesList: AutopilotWardrobeItem[],
    tempCategory: string,
  ): AutopilotWardrobeItem | null {
    if (!shoesList.length) return null;
    const climateMap = CLIMATE_PIECE_SCORES[tempCategory] ?? {};
    return shoesList.reduce((best, shoe) => {
      const bestScore = climateMap[best.piece_type.toLowerCase()] ?? 0.5;
      const currentScore = climateMap[shoe.piece_type.toLowerCase()] ?? 0.5;
      return currentScore > bestScore ? shoe : best;
    });
  }

  private scoreCombo(
    combo: Combination,
    context: RankingContext,
    tempCategory: string,
  ): number {
    const items = [combo.upper, combo.lower, combo.dress, combo.shoes].filter((i): i is AutopilotWardrobeItem => i !== null);

    const occasionScore = this.scoreOccasion(items, context.occasion);
    const climateScore = this.scoreClimate(items, tempCategory);
    const preferenceScore = this.scorePreference(items, context.preferences);
    const diversityScore = this.scoreDiversity(items, context.preferences);

    return (
      WEIGHTS.occasion * occasionScore +
      WEIGHTS.climate * climateScore +
      WEIGHTS.preference * preferenceScore +
      WEIGHTS.diversity * diversityScore
    );
  }

  private scoreOccasion(items: AutopilotWardrobeItem[], occasion: Occasion): number {
    const targetTags = OCCASION_WEIGHTS[occasion] ?? [];
    if (!targetTags.length || !items.length) return 0.5;

    const total = items.reduce((sum, item) => {
      const matches = item.occasion_tags.filter((tag) =>
        targetTags.some((t) => tag.toLowerCase().includes(t)),
      ).length;
      const score = item.occasion_tags.length > 0 ? matches / item.occasion_tags.length : 0.3;
      return sum + Math.min(score, 1.0);
    }, 0);

    return total / items.length;
  }

  private scoreClimate(items: AutopilotWardrobeItem[], tempCategory: string): number {
    const climateMap = CLIMATE_PIECE_SCORES[tempCategory] ?? {};
    if (!items.length) return 0.5;

    const total = items.reduce((sum, item) => {
      const score = climateMap[item.piece_type.toLowerCase()] ?? 0.5;
      return sum + score;
    }, 0);

    return total / items.length;
  }

  private scorePreference(items: AutopilotWardrobeItem[], prefs: OutfitPreferences | null): number {
    if (!prefs || !items.length) return 0.5;
    const total = items.reduce((sum, item) => {
      const weight = prefs.piece_weights[item.wardrobe_item_id] ?? 0;
      return sum + Math.min(weight / MAX_WEIGHT, 1.0);
    }, 0);
    return total / items.length;
  }

  private scoreDiversity(items: AutopilotWardrobeItem[], prefs: OutfitPreferences | null): number {
    if (!prefs || !items.length) return 0.7;
    const total = items.reduce((sum, item) => {
      const weight = prefs.piece_weights[item.wardrobe_item_id] ?? 0;
      return sum + (1.0 - Math.min(weight / MAX_WEIGHT, 1.0));
    }, 0);
    return total / items.length;
  }
}
