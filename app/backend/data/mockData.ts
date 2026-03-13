import { Brand, Market, PieceItem, Scheme, SchemeItem, User, WardrobeItem } from '@/app/backend/types/entities';

const now = new Date().toISOString();

export const users: User[] = [
  { user_id: 1, name: 'Aria Style', email: 'aria@sai.dev', password_hash: 'hash', photo_url: null, role: 'user', preferred_styles: 'minimal,street', created_at: now, updated_at: now },
];

export const brands: Brand[] = [
  { brand_id: 1, name: 'Maison Noire', logo_url: null, is_active: true, created_at: now, updated_at: now },
  { brand_id: 2, name: 'Archetype', logo_url: null, is_active: true, created_at: now, updated_at: now },
  { brand_id: 3, name: 'North Atelier', logo_url: null, is_active: true, created_at: now, updated_at: now },
];

export const markets: Market[] = [
  { market_id: 1, season: 'Winter', gender: 'Unisex', created_at: now, updated_at: now },
  { market_id: 2, season: 'Summer', gender: 'Female', created_at: now, updated_at: now },
  { market_id: 3, season: 'Fall', gender: 'Male', created_at: now, updated_at: now },
];

export const pieceItems: PieceItem[] = [
  { piece_item_id: 1, brand_id: 1, market_id: 1, name: 'Obsidian Tailored Blazer', image_url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800', piece_type: 'upper', color: 'Black', material: 'Wool', store_url: '#', price_range: '$$$', is_active: true, created_at: now, updated_at: now },
  { piece_item_id: 2, brand_id: 2, market_id: 2, name: 'Luxe Knit Polo', image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800', piece_type: 'upper', color: 'White', material: 'Cotton', store_url: '#', price_range: '$$', is_active: true, created_at: now, updated_at: now },
  { piece_item_id: 3, brand_id: 3, market_id: 3, name: 'Textured Wide-Leg Pants', image_url: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800', piece_type: 'lower', color: 'Khaki', material: 'Linen', store_url: '#', price_range: '$$', is_active: true, created_at: now, updated_at: now },
  { piece_item_id: 4, brand_id: 1, market_id: 1, name: 'Urban Leather Boots', image_url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800', piece_type: 'shoes', color: 'Brown', material: 'Leather', store_url: '#', price_range: '$$$', is_active: true, created_at: now, updated_at: now },
];

export const wardrobeItems: WardrobeItem[] = [
  { wardrobe_item_id: 1, user_id: 1, brand_id: 1, market_id: 1, name: 'Midnight Blazer', image_url: 'https://images.unsplash.com/photo-1593032465171-8bd2f0cf7f85?w=800', piece_type: 'upper', color: 'Black', material: 'Wool', style_tags: 'formal,minimal', occasion_tags: 'work,event', is_favorite: true, created_at: now, updated_at: now },
  { wardrobe_item_id: 2, user_id: 1, brand_id: 2, market_id: 2, name: 'Ivory Polo', image_url: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800', piece_type: 'upper', color: 'Ivory', material: 'Cotton', style_tags: 'casual', occasion_tags: 'daily', is_favorite: false, created_at: now, updated_at: now },
  { wardrobe_item_id: 3, user_id: 1, brand_id: 3, market_id: 3, name: 'Charcoal Trousers', image_url: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800', piece_type: 'lower', color: 'Charcoal', material: 'Linen', style_tags: 'smart', occasion_tags: 'work', is_favorite: false, created_at: now, updated_at: now },
  { wardrobe_item_id: 4, user_id: 1, brand_id: 1, market_id: 1, name: 'Leather Boots', image_url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800', piece_type: 'shoes', color: 'Brown', material: 'Leather', style_tags: 'street', occasion_tags: 'night', is_favorite: true, created_at: now, updated_at: now },
];

export const schemes: Scheme[] = [
  { scheme_id: 1, user_id: 1, title: 'Noir Utility Capsule', description: 'Balanced city formal look.', creation_mode: 'manual', style: 'Minimal', occasion: 'Work', visibility: 'public', community_indexed: true, cover_image_url: null, created_at: now, updated_at: now },
];

export const schemeItems: SchemeItem[] = [
  { scheme_item_id: 1, scheme_id: 1, wardrobe_item_id: 1, slot: 'upper', sort_order: 1, created_at: now },
  { scheme_item_id: 2, scheme_id: 1, wardrobe_item_id: 3, slot: 'lower', sort_order: 2, created_at: now },
  { scheme_item_id: 3, scheme_id: 1, wardrobe_item_id: 4, slot: 'shoes', sort_order: 3, created_at: now },
];
