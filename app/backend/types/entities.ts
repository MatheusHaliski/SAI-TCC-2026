export type EntityId = string;

export type ModelGenerationStatus =
  | 'queued_base'
  | 'base_done'
  | 'queued_branding'
  | 'done'
  | 'failed'
  | 'needs_brand_review';

export type BrandDetectionSource = 'manual' | 'ocr' | 'vision' | 'hybrid';

export interface PlacementProfile {
  profile_id: string;
  piece_type: 'upper_piece' | 'lower_piece' | 'shoes_piece' | 'accessory_piece';
  anchor: string;
  offset: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  scale: number;
}

export interface BrandLogoCatalog {
  brand_logo_catalog_id: EntityId;
  brand_id: EntityId;
  logo_image_url: string | null;
  logo_glb_url: string | null;
  placement_profiles: PlacementProfile[];
  detection_aliases: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

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
  model_3d_url: string | null;
  model_preview_url: string | null;
  model_base_3d_url: string | null;
  model_branded_3d_url: string | null;
  model_status: ModelGenerationStatus;
  model_generation_error: string | null;
  brand_id_selected: string;
  brand_id_detected: string | null;
  brand_detection_confidence: number | null;
  brand_detection_source: BrandDetectionSource | null;
  brand_applied: boolean;
  placement_profile_id: string | null;
  branding_pass_version: string | null;
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
  model_3d_url?: string | null;
  model_preview_url?: string | null;
  model_base_3d_url?: string | null;
  model_branded_3d_url?: string | null;
  model_status?: ModelGenerationStatus;
  model_generation_error?: string | null;
  brand: string;
  brand_detection_confidence?: number | null;
  brand_detection_source?: BrandDetectionSource | null;
  brand_applied?: boolean;
  placement_profile_id?: string | null;
  branding_pass_version?: string | null;
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
    slot: 'upper' | 'lower' | 'shoes' | 'accessory';
    sort_order: number;
  }>;
}

export interface SchemeWithItems {
  scheme: Scheme;
  items: Array<SchemeItem & { wardrobe_name: string; image_url: string }>;
  author: string;
}
