export type EntityId = string;

export interface User {
  user_id: EntityId;
  name: string;
  email: string;
  photo_url: string | null;
  role: string;
  preferred_styles: string[];
  created_at: string;
  updated_at: string;
}

export interface Brand {
  brand_id: EntityId;
  name: string;
  logo_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Market {
  market_id: EntityId;
  season: string;
  gender: string;
  created_at: string;
  updated_at: string;
}

export interface PieceItem {
  piece_item_id: EntityId;
  brand_id: EntityId;
  market_id: EntityId;
  name: string;
  image_url: string;
  piece_type: string;
  color: string;
  material: string;
  store_url: string | null;
  price_range: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface WardrobeItem {
  wardrobe_item_id: EntityId;
  user_id: EntityId;
  brand_id: EntityId;
  market_id: EntityId;
  name: string;
  image_url: string;
  piece_type: string;
  color: string;
  material: string;
  style_tags: string[];
  occasion_tags: string[];
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
}

export interface Scheme {
  scheme_id: EntityId;
  user_id: EntityId;
  title: string;
  description: string | null;
  creation_mode: 'manual' | 'ai';
  style: string;
  occasion: string;
  visibility: 'private' | 'public';
  community_indexed: boolean;
  cover_image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface SchemeItem {
  scheme_item_id: EntityId;
  scheme_id: EntityId;
  wardrobe_item_id: EntityId;
  slot: 'upper' | 'lower' | 'shoes' | 'accessory';
  sort_order: number;
  created_at: string;
}

export interface WardrobeViewItem {
  wardrobe_item_id: EntityId;
  name: string;
  image_url: string;
  brand: string;
  season: string;
  gender: string;
  piece_type: string;
}

export interface PieceItemSearchResult {
  piece_item_id: EntityId;
  image_url: string;
  gender: string;
  brand: string;
  name: string;
  season: string;
  piece_type: string;
}

export interface WardrobeAnalysis {
  total_items: number;
  by_brand: Record<string, number>;
  by_season: Record<string, number>;
  by_gender: Record<string, number>;
  by_piece_type: Record<string, number>;
}

export interface CreateSchemeInput {
  user_id: EntityId;
  title: string;
  description?: string;
  creation_mode: 'manual' | 'ai';
  style: string;
  occasion: string;
  visibility: 'private' | 'public';
  community_indexed?: boolean;
  cover_image_url?: string;
  items: Array<{
    wardrobe_item_id: EntityId;
    wardrobe_item_id: string;
    slot: 'upper' | 'lower' | 'shoes' | 'accessory';
    sort_order: number;
  }>;
}

export interface SchemeWithItems {
  scheme: Scheme;
  items: Array<SchemeItem & { wardrobe_name: string; image_url: string }>;
  author: string;
}
