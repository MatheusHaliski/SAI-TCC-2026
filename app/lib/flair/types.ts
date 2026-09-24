import type { PieceCategory, OutfitBackgroundConfig } from '@/app/lib/outfit-card';

// ─── Card Stats ─────────────────────────────────────────────────────────────

/**
 * EDGE: style power derived from style_tags + wearstyle archetypes
 * RANGE: versatility derived from occasion_tags breadth
 * CLOUT: brand prestige from brand_detection_confidence + tier
 * GLOW: visual presence from catalog_readiness_score + front_view_score
 * ART: background sophistication from OutfitBackgroundConfig
 * SYNC: season harmony bonus (binary 0|100 against current season)
 */
export interface CardStats {
  edge: number;   // 0–100
  range: number;  // 0–100
  clout: number;  // 0–100
  glow: number;   // 0–100
  art: number;    // 0–100
  sync: number;   // 0 | 100
}

export interface CardStatsBreakdown {
  stats: CardStats;
  totalPower: number;
  synergies: string[];
  specialAbility: string | null;
}

// ─── Flair Card (a wardrobe item in game context) ────────────────────────────

export interface FlairCard {
  cardId: string;
  wardrobeItemId: string;
  userId: string;

  // Display
  title: string;
  brand: string;
  brandLogoUrl: string | null;
  pieceType: string;
  imageUrl: string;
  color: string;
  material: string;
  season: string;
  gender: string;

  // Metadata used for stat computation
  styleTags: string[];
  occasionTags: string[];
  brandDetectionConfidence: number;
  catalogReadinessScore: number;
  frontViewScore: number;
  backgroundConfig: OutfitBackgroundConfig | null;
  isFavorite: boolean;

  // Computed game attributes
  category: PieceCategory;
  stats: CardStats;
  totalPower: number;
  specialAbility: string | null;

  // Lifecycle
  wearCount: number;
  createdAt: string;
  evolvedAt: string | null;
}

// ─── Outfit Deck (Scheme in game context) ────────────────────────────────────

export interface FlairDeck {
  deckId: string;
  schemeId: string;
  userId: string;
  title: string;
  cards: FlairCard[];

  // Computed deck power
  deckPower: number;
  comboBonuses: ComboBonus[];
  brandSynergy: BrandSynergyBonus | null;
  seasonBonus: number;

  backgroundConfig: OutfitBackgroundConfig | null;
  createdAt: string;
}

export interface ComboBonus {
  type: 'style_synergy' | 'occasion_synergy' | 'full_brand' | 'season_sweep' | 'material_contrast';
  label: string;
  bonusPoints: number;
  involvedCardIds: string[];
}

export interface BrandSynergyBonus {
  brand: string;
  cardCount: number;
  multiplier: number;
  label: string;
}

// ─── Quests ──────────────────────────────────────────────────────────────────

export type QuestDifficulty = 'easy' | 'medium' | 'hard' | 'legendary';
export type QuestCategory =
  | 'daily'
  | 'weekly'
  | 'brand_quest'
  | 'seasonal_event'
  | 'community';

export type QuestConditionType =
  | 'wear_count'          // Use items N times
  | 'brand_collect'       // Own N items from a brand
  | 'brand_outfit'        // Build outfit with N same-brand items
  | 'season_outfit'       // Build outfit matching season
  | 'occasion_outfit'     // Build outfit matching occasion
  | 'rare_collect'        // Own N Rare cards
  | 'ai_artwork_set'      // Apply AI artwork background to N items
  | 'gradient_set'        // Apply gradient background to N items
  | 'outfit_rate'         // Rate N community outfits
  | 'wardrobe_add'        // Add N new wardrobe items
  | 'duel_win'            // Win N duels
  | 'combo_achieve'       // Achieve a specific combo bonus
  | 'glow_threshold'      // Build outfit with avg GLOW > threshold
  | 'power_threshold';    // Build outfit with total power > threshold

export interface QuestCondition {
  type: QuestConditionType;
  targetValue: number;
  currentValue: number;
  metadata?: Record<string, string | number>;
}

export interface FlairQuest {
  questId: string;
  userId: string;
  templateId: string;

  title: string;
  description: string;
  category: QuestCategory;
  difficulty: QuestDifficulty;
  brandId: string | null;    // Set for brand_quest category

  conditions: QuestCondition[];
  reward: QuestReward;

  status: 'active' | 'completed' | 'claimed' | 'expired';
  progress: number;          // 0–100 (%)
  expiresAt: string;
  completedAt: string | null;
  claimedAt: string | null;
  createdAt: string;
}

// ─── Rewards ─────────────────────────────────────────────────────────────────

export type RewardType =
  | 'flair_coins'     // In-app currency
  | 'store_voucher'   // Real-world discount voucher
  | 'card_skin'       // Cosmetic card skin unlock
  | 'background_pack' // BackgroundConfig preset pack
  | 'exclusive_piece' // Digital collectible piece
  | 'brand_access'    // VIP access to partner brand store
  | 'trophy';         // Achievement trophy

export interface QuestReward {
  type: RewardType;
  value: number;           // Coins amount OR voucher BRL value
  label: string;
  description: string;
  brandId: string | null;
  metadata?: {
    skinId?: string;
    packId?: string;
    trophyId?: string;
    voucherCode?: string;
    expiresAt?: string;
  };
}

export interface FlairReward {
  rewardId: string;
  userId: string;
  questId: string;
  type: RewardType;
  value: number;
  label: string;
  brandId: string | null;
  redeemed: boolean;
  redeemedAt: string | null;
  expiresAt: string | null;
  metadata?: Record<string, string | number>;
  createdAt: string;
}

// ─── Store Voucher ────────────────────────────────────────────────────────────

export interface StoreVoucher {
  voucherId: string;
  userId: string;
  brandId: string;
  brandName: string;
  brandLogoUrl: string | null;
  code: string;             // QR-scannable at store checkout
  discountBRL: number;      // e.g. 10 = R$10 off
  discountPct: number | null; // e.g. 15 = 15% off (either or)
  minPurchaseBRL: number | null;
  redeemed: boolean;
  redeemedAt: string | null;
  expiresAt: string;
  createdAt: string;
}

// ─── Duels ────────────────────────────────────────────────────────────────────

export type DuelStat = 'edge' | 'range' | 'clout' | 'glow' | 'art';
export type DuelStatus = 'pending' | 'active' | 'completed' | 'forfeit';

export interface DuelRound {
  round: number;
  stat: DuelStat;
  challengerScore: number;
  opponentScore: number;
  winner: 'challenger' | 'opponent' | 'draw';
}

export interface FlairDuel {
  duelId: string;
  challengerId: string;
  opponentId: string;
  challengerDeckId: string;
  opponentDeckId: string;

  rounds: DuelRound[];
  finalScore: { challenger: number; opponent: number };
  winner: string | null;        // userId of winner
  status: DuelStatus;

  coinsWagered: number;
  reward: QuestReward | null;

  createdAt: string;
  resolvedAt: string | null;
}

// ─── Player Profile ───────────────────────────────────────────────────────────

export type FlairRank =
  | 'Rookie'
  | 'Trendsetter'
  | 'Style Maven'
  | 'Fashion Architect'
  | 'Iconic'
  | 'Legend';

export interface FlairProfile {
  profileId: string;
  userId: string;

  // Currency & progress
  flairCoins: number;
  totalCoinsEarned: number;
  rank: FlairRank;
  rankPoints: number;             // Points toward next rank
  level: number;                  // 1–50

  // Card collection stats
  totalCards: number;
  cardsByCategory: Record<PieceCategory, number>;
  totalDecks: number;
  highestDeckPower: number;

  // Battle record
  duelsPlayed: number;
  duelsWon: number;
  winStreak: number;
  bestWinStreak: number;

  // Quests
  questsCompleted: number;
  dailyQuestStreak: number;

  // Rewards
  vouchersEarned: number;
  vouchersRedeemed: number;
  totalBRLEarned: number;         // Sum of all vouchers earned

  // Trophies
  trophyIds: string[];

  // Brand relations
  brandAffinities: Record<string, number>;  // brand_id → affinity score 0–100

  createdAt: string;
  updatedAt: string;
}

// ─── Season Event ─────────────────────────────────────────────────────────────

export interface SeasonEvent {
  eventId: string;
  title: string;
  description: string;
  theme: string;           // e.g. "Verão Urbano", "Fashion Week SP"
  season: string;          // 'summer' | 'winter' | 'spring' | 'fall'
  requiredOccasion: string | null;
  scoringStat: DuelStat;

  startAt: string;
  endAt: string;
  status: 'upcoming' | 'active' | 'ended';

  prizePool: QuestReward[];
  leaderboard: Array<{ userId: string; score: number; rank: number }>;
}
