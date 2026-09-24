import type {
  FlairQuest,
  QuestReward,
  QuestCondition,
  QuestConditionType,
  FlairProfile,
  FlairRank,
} from './types';

// ─── Quest templates ──────────────────────────────────────────────────────────

export interface QuestTemplate {
  templateId: string;
  title: string;
  description: string;
  category: FlairQuest['category'];
  difficulty: FlairQuest['difficulty'];
  brandId: string | null;
  conditions: Omit<QuestCondition, 'currentValue'>[];
  reward: QuestReward;
  ttlHours: number;
}

export const DAILY_QUEST_TEMPLATES: QuestTemplate[] = [
  {
    templateId: 'daily_seasonal_look',
    title: 'Seasonal Look',
    description: 'Monte um outfit com pelo menos 3 peças da estação atual',
    category: 'daily',
    difficulty: 'easy',
    brandId: null,
    conditions: [{ type: 'season_outfit', targetValue: 3 }],
    reward: {
      type: 'flair_coins', value: 50,
      label: '50 FLAIR Coins',
      description: 'Seasonal style mastery reward',
      brandId: null,
    },
    ttlHours: 24,
  },
  {
    templateId: 'daily_brand_collector',
    title: 'Brand Collector',
    description: 'Use 3 ou mais peças da mesma marca em um outfit',
    category: 'daily',
    difficulty: 'easy',
    brandId: null,
    conditions: [{ type: 'brand_outfit', targetValue: 3 }],
    reward: {
      type: 'flair_coins', value: 30,
      label: '30 FLAIR Coins',
      description: 'Brand loyalty reward',
      brandId: null,
    },
    ttlHours: 24,
  },
  {
    templateId: 'daily_versatile_master',
    title: 'Versatile Master',
    description: 'Crie um outfit com média de RANGE acima de 70',
    category: 'daily',
    difficulty: 'medium',
    brandId: null,
    conditions: [{ type: 'glow_threshold', targetValue: 70, metadata: { stat: 'range' } }],
    reward: {
      type: 'flair_coins', value: 40,
      label: '40 FLAIR Coins',
      description: 'Versatility champion reward',
      brandId: null,
    },
    ttlHours: 24,
  },
  {
    templateId: 'daily_glow_master',
    title: 'Glow Up',
    description: 'Monte um outfit com média de GLOW acima de 65',
    category: 'daily',
    difficulty: 'medium',
    brandId: null,
    conditions: [{ type: 'glow_threshold', targetValue: 65 }],
    reward: {
      type: 'flair_coins', value: 45,
      label: '45 FLAIR Coins',
      description: 'Visual presence mastery',
      brandId: null,
    },
    ttlHours: 24,
  },
];

export const WEEKLY_QUEST_TEMPLATES: QuestTemplate[] = [
  {
    templateId: 'weekly_curator',
    title: 'Style Curator',
    description: 'Avalie 10 outfits da comunidade esta semana',
    category: 'weekly',
    difficulty: 'easy',
    brandId: null,
    conditions: [{ type: 'outfit_rate', targetValue: 10 }],
    reward: {
      type: 'flair_coins', value: 200,
      label: '200 FLAIR Coins',
      description: 'Community curator reward',
      brandId: null,
    },
    ttlHours: 168,
  },
  {
    templateId: 'weekly_wardrobe_maven',
    title: 'Wardrobe Maven',
    description: 'Adicione 3 novas peças ao seu guarda-roupa esta semana',
    category: 'weekly',
    difficulty: 'medium',
    brandId: null,
    conditions: [{ type: 'wardrobe_add', targetValue: 3 }],
    reward: {
      type: 'flair_coins', value: 150,
      label: '150 FLAIR Coins',
      description: 'Wardrobe expansion reward',
      brandId: null,
    },
    ttlHours: 168,
  },
  {
    templateId: 'weekly_card_artisan',
    title: 'Card Artisan',
    description: 'Aplique arte gerada por IA como fundo em 2 peças',
    category: 'weekly',
    difficulty: 'hard',
    brandId: null,
    conditions: [{ type: 'ai_artwork_set', targetValue: 2 }],
    reward: {
      type: 'background_pack', value: 1,
      label: 'Premium Background Pack',
      description: 'Unlock exclusive background presets',
      brandId: null,
      metadata: { packId: 'editorial_luxury_pack' },
    },
    ttlHours: 168,
  },
  {
    templateId: 'weekly_duel_champion',
    title: 'Duel Champion',
    description: 'Vença 5 duelos de estilo esta semana',
    category: 'weekly',
    difficulty: 'hard',
    brandId: null,
    conditions: [{ type: 'duel_win', targetValue: 5 }],
    reward: {
      type: 'card_skin', value: 1,
      label: 'Champion Card Skin',
      description: 'Exclusive holographic champion skin',
      brandId: null,
      metadata: { skinId: 'champion_holographic' },
    },
    ttlHours: 168,
  },
  {
    templateId: 'weekly_power_deck',
    title: 'Power Deck',
    description: 'Monte um outfit com poder total acima de 350',
    category: 'weekly',
    difficulty: 'legendary',
    brandId: null,
    conditions: [{ type: 'power_threshold', targetValue: 350 }],
    reward: {
      type: 'store_voucher', value: 30,
      label: 'R$30 de desconto',
      description: 'Vale desconto em lojas parceiras',
      brandId: null,
      metadata: { expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() },
    },
    ttlHours: 168,
  },
];

export const BRAND_QUEST_TEMPLATES: QuestTemplate[] = [
  {
    templateId: 'brand_collect_5',
    title: 'Colecionador de Marca',
    description: 'Tenha 5 peças desta marca no seu guarda-roupa',
    category: 'brand_quest',
    difficulty: 'medium',
    brandId: '__BRAND_ID__',
    conditions: [{ type: 'brand_collect', targetValue: 5 }],
    reward: {
      type: 'store_voucher', value: 10,
      label: 'R$10 na loja da marca',
      description: 'Desconto exclusivo para colecionadores',
      brandId: '__BRAND_ID__',
      metadata: { expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString() },
    },
    ttlHours: 720,
  },
  {
    templateId: 'brand_outfit_veteran',
    title: 'Veteran da Marca',
    description: 'Use peças desta marca em 10 outfits diferentes',
    category: 'brand_quest',
    difficulty: 'hard',
    brandId: '__BRAND_ID__',
    conditions: [{ type: 'brand_outfit', targetValue: 10, metadata: { brand: '__BRAND_NAME__' } }],
    reward: {
      type: 'brand_access', value: 1,
      label: 'Acesso VIP',
      description: 'Acesso antecipado a lançamentos e eventos exclusivos',
      brandId: '__BRAND_ID__',
    },
    ttlHours: 720,
  },
];

// ─── Quest progress computation ───────────────────────────────────────────────

export function computeQuestProgress(conditions: QuestCondition[]): number {
  if (conditions.length === 0) return 0;
  const total = conditions.reduce((sum, c) => {
    return sum + Math.min(1, c.currentValue / c.targetValue);
  }, 0);
  return Math.round((total / conditions.length) * 100);
}

export function isQuestComplete(quest: FlairQuest): boolean {
  return quest.conditions.every((c) => c.currentValue >= c.targetValue);
}

export function isQuestExpired(quest: FlairQuest): boolean {
  return new Date(quest.expiresAt) < new Date();
}

// ─── Rank progression ─────────────────────────────────────────────────────────

const RANK_THRESHOLDS: Record<FlairRank, number> = {
  Rookie: 0,
  Trendsetter: 500,
  'Style Maven': 1500,
  'Fashion Architect': 4000,
  Iconic: 8000,
  Legend: 15000,
};

export function computeRank(rankPoints: number): FlairRank {
  const ranks = Object.entries(RANK_THRESHOLDS) as [FlairRank, number][];
  let current: FlairRank = 'Rookie';
  for (const [rank, threshold] of ranks) {
    if (rankPoints >= threshold) current = rank;
  }
  return current;
}

export function computeRankProgress(rankPoints: number): {
  rank: FlairRank;
  nextRank: FlairRank | null;
  progress: number;
  pointsToNext: number;
} {
  const rank = computeRank(rankPoints);
  const entries = Object.entries(RANK_THRESHOLDS) as [FlairRank, number][];
  const idx = entries.findIndex(([r]) => r === rank);
  const nextEntry = entries[idx + 1];

  if (!nextEntry) return { rank, nextRank: null, progress: 100, pointsToNext: 0 };

  const [nextRank, nextThreshold] = nextEntry;
  const currentThreshold = entries[idx][1];
  const progress = Math.round(
    ((rankPoints - currentThreshold) / (nextThreshold - currentThreshold)) * 100
  );
  return { rank, nextRank, progress, pointsToNext: nextThreshold - rankPoints };
}

// ─── Reward value for coin spending ──────────────────────────────────────────

export const COIN_VOUCHER_RATE = 50; // 50 FLAIR Coins = R$1 in vouchers

export function coinsToVoucherBRL(coins: number): number {
  return Math.floor(coins / COIN_VOUCHER_RATE);
}

export function voucherBRLToCoins(brl: number): number {
  return brl * COIN_VOUCHER_RATE;
}

// ─── Condition label helpers ──────────────────────────────────────────────────

export function conditionLabel(type: QuestConditionType, value: number): string {
  const labels: Record<QuestConditionType, string> = {
    wear_count: `Use itens ${value}×`,
    brand_collect: `Colete ${value} peças da marca`,
    brand_outfit: `Monte ${value} outfits com a marca`,
    season_outfit: `${value} peças da estação`,
    occasion_outfit: `Outfit para ocasião`,
    rare_collect: `Tenha ${value} cartas Raras`,
    ai_artwork_set: `Arte IA em ${value} peças`,
    gradient_set: `Gradiente em ${value} peças`,
    outfit_rate: `Avalie ${value} outfits`,
    wardrobe_add: `Adicione ${value} peças`,
    duel_win: `Vença ${value} duelos`,
    combo_achieve: `Ative ${value} combos`,
    glow_threshold: `GLOW > ${value}`,
    power_threshold: `Poder > ${value}`,
  };
  return labels[type] ?? `${type}: ${value}`;
}
