export interface User {
<<<<<<< HEAD
  user_id: string;
  name: string;
  email: string;
  photo_url: string | null;
  role: string;
  preferred_styles: string[];
=======
  user_id: number;
  name: string;
  email: string;
  password_hash: string;
  photo_url: string | null;
  role: string;
  preferred_styles: string | null;
>>>>>>> 86fb19f (Refatora telas filhas e adiciona backend multilayer com APIs)
  created_at: string;
  updated_at: string;
}

export interface Brand {
<<<<<<< HEAD
  brand_id: string;
=======
  brand_id: number;
>>>>>>> 86fb19f (Refatora telas filhas e adiciona backend multilayer com APIs)
  name: string;
  logo_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Market {
<<<<<<< HEAD
  market_id: string;
=======
  market_id: number;
>>>>>>> 86fb19f (Refatora telas filhas e adiciona backend multilayer com APIs)
  season: string;
  gender: string;
  created_at: string;
  updated_at: string;
}

export interface PieceItem {
<<<<<<< HEAD
  piece_item_id: string;
  brand_id: string;
  market_id: string;
=======
  piece_item_id: number;
  brand_id: number;
  market_id: number;
>>>>>>> 86fb19f (Refatora telas filhas e adiciona backend multilayer com APIs)
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
<<<<<<< HEAD
  wardrobe_item_id: string;
  user_id: string;
  brand_id: string;
  market_id: string;
=======
  wardrobe_item_id: number;
  user_id: number;
  brand_id: number;
  market_id: number;
>>>>>>> 86fb19f (Refatora telas filhas e adiciona backend multilayer com APIs)
  name: string;
  image_url: string;
  piece_type: string;
  color: string;
  material: string;
<<<<<<< HEAD
  style_tags: string[];
  occasion_tags: string[];
=======
  style_tags: string | null;
  occasion_tags: string | null;
>>>>>>> 86fb19f (Refatora telas filhas e adiciona backend multilayer com APIs)
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
}

export interface Scheme {
<<<<<<< HEAD
  scheme_id: string;
  user_id: string;
=======
  scheme_id: number;
  user_id: number;
>>>>>>> 86fb19f (Refatora telas filhas e adiciona backend multilayer com APIs)
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
<<<<<<< HEAD
  scheme_item_id: string;
  scheme_id: string;
  wardrobe_item_id: string;
=======
  scheme_item_id: number;
  scheme_id: number;
  wardrobe_item_id: number;
>>>>>>> 86fb19f (Refatora telas filhas e adiciona backend multilayer com APIs)
  slot: 'upper' | 'lower' | 'shoes' | 'accessory';
  sort_order: number;
  created_at: string;
}

export interface WardrobeViewItem {
<<<<<<< HEAD
  wardrobe_item_id: string;
=======
  wardrobe_item_id: number;
>>>>>>> 86fb19f (Refatora telas filhas e adiciona backend multilayer com APIs)
  name: string;
  image_url: string;
  brand: string;
  season: string;
  gender: string;
  piece_type: string;
}

export interface PieceItemSearchResult {
<<<<<<< HEAD
  piece_item_id: string;
=======
  piece_item_id: number;
>>>>>>> 86fb19f (Refatora telas filhas e adiciona backend multilayer com APIs)
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
<<<<<<< HEAD
  user_id: string;
=======
  user_id: number;
>>>>>>> 86fb19f (Refatora telas filhas e adiciona backend multilayer com APIs)
  title: string;
  description?: string;
  creation_mode: 'manual' | 'ai';
  style: string;
  occasion: string;
  visibility: 'private' | 'public';
  community_indexed?: boolean;
  cover_image_url?: string;
  items: Array<{
<<<<<<< HEAD
    wardrobe_item_id: string;
=======
    wardrobe_item_id: number;
>>>>>>> 86fb19f (Refatora telas filhas e adiciona backend multilayer com APIs)
    slot: 'upper' | 'lower' | 'shoes' | 'accessory';
    sort_order: number;
  }>;
}

export interface SchemeWithItems {
  scheme: Scheme;
  items: Array<SchemeItem & { wardrobe_name: string; image_url: string }>;
  author: string;
}
