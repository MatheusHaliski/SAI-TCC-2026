import { AutopilotWardrobeItem, Occasion, Mood, OutfitPreferences, SchemeSuggestion, WeatherInfo } from '@/app/backend/types/entities';
import { WeatherService } from './WeatherService';

const UPPER_TYPES = new Set(['upper_piece', 'top', 'blouse', 'shirt', 'jacket', 'coat', 'outerwear', 'sweater', 'hoodie', 'camiseta', 'blusão', 'camisa']);
const LOWER_TYPES = new Set(['lower_piece', 'bottom', 'pants', 'jeans', 'skirt', 'shorts', 'trousers', 'calça', 'saia', 'bermuda']);
const DRESS_TYPES = new Set(['dress', 'jumpsuit', 'romper', 'vestido', 'macacão']);
const SHOES_TYPES = new Set(['shoes_piece', 'shoes', 'boots', 'sneakers', 'sandals', 'heels', 'sapatos', 'tênis', 'bota', 'sandália']);
const ACCESSORY_TYPES = new Set(['accessory_piece', 'accessory', 'bag', 'hat', 'belt', 'bolsa', 'acessório', 'chapéu', 'cinto']);

const OCCASION_WEIGHTS: Record<Occasion, string[]> = {
  trabalho: ['formal', 'trabalho', 'social', 'casual'],
  formal: ['formal', 'gala', 'cerimônia', 'social', 'chic', 'evento'],
  casual: ['casual', 'street', 'day', 'relax'],
  festa: ['party', 'night', 'festa', 'festivo', 'chic'],
  academia: ['sport', 'academia', 'fitness', 'esportivo'],
  evento: ['event', 'formal', 'gala', 'evento', 'social'],
};

/* ── Títulos variados por ocasião + humor ── */
const LOOK_TITLES: Record<Occasion, Record<Mood, string[]>> = {
  formal: {
    disposto: ['Look Formal Elegante', 'Visual de Cerimônia', 'Conjunto Sofisticado'],
    cansado: ['Elegância Confortável', 'Look Formal Leve', 'Visual Sofisticado Prático'],
    confiante: ['Look de Gala', 'Visual Premium', 'Conjunto Impactante'],
    criativo: ['Look Formal Autoral', 'Visual Único', 'Combinação Exclusiva'],
  },
  trabalho: {
    disposto: ['Look Executivo', 'Visual Profissional', 'Conjunto de Escritório'],
    cansado: ['Conforto no Trabalho', 'Visual Prático', 'Look Descomplicado'],
    confiante: ['Look Power', 'Visual de Destaque', 'Conjunto Marcante'],
    criativo: ['Look Criativo', 'Visual Autoral', 'Combinação Inovadora'],
  },
  casual: {
    disposto: ['Look Casual Animado', 'Visual Dia a Dia', 'Combinação Leve'],
    cansado: ['Conforto Total', 'Look Relaxado', 'Visual Fácil'],
    confiante: ['Look Casual Chic', 'Visual com Personalidade', 'Conjunto Estiloso'],
    criativo: ['Look Descolado', 'Visual Criativo', 'Combinação Diferente'],
  },
  festa: {
    disposto: ['Look de Festa', 'Visual Animado', 'Conjunto Festivo'],
    cansado: ['Look Confortável para Sair', 'Visual Descontraído', 'Combinação Fácil'],
    confiante: ['Look Poderoso', 'Visual de Impacto', 'Conjunto Marcante'],
    criativo: ['Look Ousado', 'Visual Único', 'Combinação Autoral'],
  },
  academia: {
    disposto: ['Look Fitness Animado', 'Visual Esportivo', 'Conjunto Ativo'],
    cansado: ['Conforto no Treino', 'Look Leve', 'Visual Prático'],
    confiante: ['Look Atlético', 'Visual de Performance', 'Conjunto Poderoso'],
    criativo: ['Look Sport Criativo', 'Visual Diferente', 'Combinação Moderna'],
  },
  evento: {
    disposto: ['Look de Evento', 'Visual Social', 'Conjunto Elegante'],
    cansado: ['Elegância Confortável', 'Look Sofisticado Leve', 'Visual Prático Elegante'],
    confiante: ['Look de Destaque', 'Visual Impactante', 'Conjunto Premium'],
    criativo: ['Look Autoral', 'Visual Único', 'Combinação Exclusiva'],
  },
};

const CLIMATE_PIECE_SCORES: Record<string, Record<string, number>> = {
  summer: {
    top: 1.0, blouse: 1.0, shirt: 0.9, upper_piece: 0.8,
    skirt: 1.0, shorts: 1.0, lower_piece: 0.7,
    dress: 1.0, jumpsuit: 0.8,
    sandals: 1.0, sneakers: 0.8, shoes: 0.7, shoes_piece: 0.7,
    jacket: 0.2, coat: 0.0, sweater: 0.1, boots: 0.2,
  },
  spring_fall: {
    top: 0.9, blouse: 0.9, shirt: 1.0, upper_piece: 0.9,
    pants: 1.0, jeans: 1.0, skirt: 0.7, lower_piece: 0.9,
    dress: 0.7, jumpsuit: 0.7,
    sneakers: 1.0, shoes: 1.0, boots: 0.8, sandals: 0.4, shoes_piece: 0.9,
    jacket: 0.9, sweater: 0.9, coat: 0.5,
  },
  fall_layers: {
    top: 0.7, blouse: 0.7, shirt: 0.8, upper_piece: 0.7,
    pants: 1.0, jeans: 1.0, skirt: 0.4, lower_piece: 0.9,
    dress: 0.3, jumpsuit: 0.4,
    sneakers: 0.9, boots: 1.0, shoes: 0.8, sandals: 0.1, shoes_piece: 0.8,
    jacket: 1.0, sweater: 1.0, coat: 0.9,
  },
  winter: {
    top: 0.4, blouse: 0.3, shirt: 0.5, upper_piece: 0.5,
    pants: 1.0, jeans: 1.0, skirt: 0.2, shorts: 0.0, lower_piece: 0.9,
    dress: 0.2, jumpsuit: 0.3,
    sneakers: 0.6, boots: 1.0, shoes: 0.7, sandals: 0.0, shoes_piece: 0.7,
    jacket: 1.0, coat: 1.0, sweater: 1.0,
  },
};

/* ── Influência do humor nas peças ── */
const MOOD_OCCASION_TAGS: Record<Mood, string[]> = {
  disposto: ['sport', 'casual', 'festivo', 'animado', 'colorido'],
  cansado: ['casual', 'conforto', 'básico', 'relax', 'soft'],
  confiante: ['formal', 'social', 'chic', 'premium', 'marcante'],
  criativo: ['street', 'autoral', 'diferente', 'criativo', 'inovador'],
};

const MAX_WEIGHT = 10;
const WEIGHTS = { occasion: 0.35, climate: 0.25, preference: 0.20, diversity: 0.10, mood: 0.10 };

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

/* Fisher-Yates shuffle */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
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
    excludeSchemeIds: string[] = [],
  ): SchemeSuggestion[] {
    /* 1. Pré-filtra peças por ocasião (prefere peças compatíveis, mas não exclui as demais) */
    const occasionTags = OCCASION_WEIGHTS[context.occasion] ?? [];
    const moodTags = MOOD_OCCASION_TAGS[context.mood] ?? [];

    const sortByRelevance = (items: AutopilotWardrobeItem[]) => {
      return [...items].sort((a, b) => {
        const scoreA = this.relevanceScore(a, occasionTags, moodTags);
        const scoreB = this.relevanceScore(b, occasionTags, moodTags);
        /* Adiciona ruído aleatório para variar entre chamadas */
        return (scoreB + Math.random() * 0.1) - (scoreA + Math.random() * 0.1);
      });
    };

    const uppers = sortByRelevance(wardrobe.filter((i) => this.classifyItem(i) === 'upper'));
    const lowers = sortByRelevance(wardrobe.filter((i) => this.classifyItem(i) === 'lower'));
    const dresses = sortByRelevance(wardrobe.filter((i) => this.classifyItem(i) === 'dress'));
    const shoes = sortByRelevance(wardrobe.filter((i) => this.classifyItem(i) === 'shoes'));

    const tempCategory = this.weatherService.getTemperatureCategory(context.weather.temp_c);
    const candidates = this.buildCandidates(uppers, lowers, dresses, shoes, tempCategory);

    const excludeSet = new Set(excludeSchemeIds);

    const scored = candidates
      .map((combo) => ({ combo, score: this.scoreCombo(combo, context, tempCategory) }))
      .sort((a, b) => b.score - a.score)
      .filter(({ combo }) => !excludeSet.has(this.comboSchemeId(combo)));

    /* Garante diversidade: top 3 não podem repetir a mesma peça upper/lower */
    const selected: typeof scored = [];
    const usedUpperIds = new Set<string>();
    const usedLowerIds = new Set<string>();

    for (const entry of scored) {
      if (selected.length >= this.topN) break;
      const upperId = entry.combo.upper?.wardrobe_item_id ?? entry.combo.dress?.wardrobe_item_id ?? '';
      const lowerId = entry.combo.lower?.wardrobe_item_id ?? '';
      if (usedUpperIds.has(upperId) && usedLowerIds.has(lowerId)) continue;
      selected.push(entry);
      if (upperId) usedUpperIds.add(upperId);
      if (lowerId) usedLowerIds.add(lowerId);
    }

    /* Se não tiver 3 diversas, completa com os melhores restantes */
    if (selected.length < this.topN) {
      for (const entry of scored) {
        if (selected.length >= this.topN) break;
        if (!selected.includes(entry)) selected.push(entry);
      }
    }

    const titles = shuffle(LOOK_TITLES[context.occasion]?.[context.mood] ?? ['Look do Dia']);

    return selected.map(({ combo, score }, index) => {
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
        title: titles[index % titles.length] ?? `Look do Dia #${index + 1}`,
        items,
        weather_fit_note: this.weatherService.buildWeatherFitNote(context.weather.temp_c, context.weather.condition),
        score,
      };
    });
  }

  /* Relevância de uma peça para a ocasião + humor */
  private relevanceScore(item: AutopilotWardrobeItem, occasionTags: string[], moodTags: string[]): number {
    const allTags = [...item.occasion_tags, ...item.style_tags].map((t) => t.toLowerCase());
    const occasionMatches = occasionTags.filter((t) => allTags.some((tag) => tag.includes(t))).length;
    const moodMatches = moodTags.filter((t) => allTags.some((tag) => tag.includes(t))).length;
    return occasionMatches * 2 + moodMatches;
  }

  private comboSchemeId(combo: Combination): string {
    const key = [combo.upper, combo.lower, combo.dress, combo.shoes]
      .filter((i): i is AutopilotWardrobeItem => i !== null)
      .map((i) => i.wardrobe_item_id)
      .sort()
      .join('|');
    let h1 = 0x811c9dc5, h2 = 0xc4ceb9fe;
    for (let i = 0; i < key.length; i++) {
      const c = key.charCodeAt(i);
      h1 = (Math.imul(h1 ^ c, 0x01000193)) >>> 0;
      h2 = (Math.imul(h2 ^ c, 0x01000193)) >>> 0;
    }
    return `autopilot-${h1.toString(16).padStart(8, '0')}${h2.toString(16).padStart(8, '0')}`;
  }

  private classifyItem(item: AutopilotWardrobeItem): 'upper' | 'lower' | 'dress' | 'shoes' | 'accessory' | 'unknown' {
    const t = item.piece_type.toLowerCase();
    if (UPPER_TYPES.has(t) || t.includes('upper')) return 'upper';
    if (LOWER_TYPES.has(t) || t.includes('lower')) return 'lower';
    if (DRESS_TYPES.has(t) || t.includes('dress')) return 'dress';
    if (SHOES_TYPES.has(t) || t.includes('shoes') || t.includes('shoe')) return 'shoes';
    if (ACCESSORY_TYPES.has(t)) return 'accessory';
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

    /* upper + lower — varia o sapato por combinação */
    for (const upper of uppers) {
      for (const lower of lowers) {
        /* Escolhe sapato diferente para cada combinação */
        const shoe = this.pickShoeForCombo(shoesList, tempCategory, candidates.length);
        candidates.push({ upper, lower, dress: null, shoes: shoe });
        if (candidates.length >= this.maxCandidates) break;
      }
      if (candidates.length >= this.maxCandidates) break;
    }

    /* dress combinations */
    for (const dress of dresses) {
      if (candidates.length >= this.maxCandidates) break;
      const shoe = this.pickShoeForCombo(shoesList, tempCategory, candidates.length);
      candidates.push({ upper: null, lower: null, dress, shoes: shoe });
    }

    return candidates;
  }

  /* Varia o sapato por índice para criar diversidade */
  private pickShoeForCombo(
    shoesList: AutopilotWardrobeItem[],
    tempCategory: string,
    index: number,
  ): AutopilotWardrobeItem | null {
    if (!shoesList.length) return null;
    const climateMap = CLIMATE_PIECE_SCORES[tempCategory] ?? {};

    /* Ordena por clima e rotaciona pelo índice para variar */
    const sorted = [...shoesList].sort((a, b) => {
      const sa = climateMap[a.piece_type.toLowerCase()] ?? 0.5;
      const sb = climateMap[b.piece_type.toLowerCase()] ?? 0.5;
      return sb - sa;
    });

    return sorted[index % sorted.length] ?? sorted[0];
  }

  private scoreCombo(combo: Combination, context: RankingContext, tempCategory: string): number {
    const items = [combo.upper, combo.lower, combo.dress, combo.shoes]
      .filter((i): i is AutopilotWardrobeItem => i !== null);

    const occasionScore = this.scoreOccasion(items, context.occasion);
    const climateScore = this.scoreClimate(items, tempCategory);
    const preferenceScore = this.scorePreference(items, context.preferences);
    const diversityScore = this.scoreDiversity(items, context.preferences);
    const moodScore = this.scoreMood(items, context.mood);

    return (
      WEIGHTS.occasion * occasionScore +
      WEIGHTS.climate * climateScore +
      WEIGHTS.preference * preferenceScore +
      WEIGHTS.diversity * diversityScore +
      WEIGHTS.mood * moodScore
    );
  }

  private scoreOccasion(items: AutopilotWardrobeItem[], occasion: Occasion): number {
    const targetTags = OCCASION_WEIGHTS[occasion] ?? [];
    if (!targetTags.length || !items.length) return 0.5;

    const total = items.reduce((sum, item) => {
      const allTags = [...item.occasion_tags, ...item.style_tags].map((t) => t.toLowerCase());
      const matches = targetTags.filter((t) => allTags.some((tag) => tag.includes(t))).length;
      const score = allTags.length > 0 ? matches / Math.max(targetTags.length, 1) : 0.3;
      return sum + Math.min(score, 1.0);
    }, 0);

    return total / items.length;
  }

  private scoreMood(items: AutopilotWardrobeItem[], mood: Mood): number {
    const moodTags = MOOD_OCCASION_TAGS[mood] ?? [];
    if (!moodTags.length || !items.length) return 0.5;

    const total = items.reduce((sum, item) => {
      const allTags = [...item.occasion_tags, ...item.style_tags].map((t) => t.toLowerCase());
      const matches = moodTags.filter((t) => allTags.some((tag) => tag.includes(t))).length;
      const score = allTags.length > 0 ? matches / Math.max(moodTags.length, 1) : 0.3;
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