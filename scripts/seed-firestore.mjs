import { config } from 'dotenv';
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

config();

const projectId = process.env.NEXT_FIREBASE_ADMIN_PROJECT_ID;
const clientEmail = process.env.NEXT_FIREBASE_ADMIN_CLIENT_EMAIL;
const privateKey = process.env.NEXT_FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n');

if (!projectId || !clientEmail || !privateKey) {
  throw new Error('Missing Firebase admin envs');
}

if (!getApps().length) {
  initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
}

const db = getFirestore();
const now = new Date().toISOString();

await db.collection('users').doc('user_1').set({
  name: 'Aria Style',
  email: 'aria@sai.dev',
  photo_url: null,
  role: 'user',
  preferred_styles: ['minimal', 'street'],
  created_at: now,
  updated_at: now,
});

await db.collection('brands').doc('brand_1').set({ name: 'Maison Noire', logo_url: null, is_active: true, created_at: now, updated_at: now });
await db.collection('brands').doc('brand_2').set({ name: 'Archetype', logo_url: null, is_active: true, created_at: now, updated_at: now });
await db.collection('markets').doc('market_1').set({ season: 'Winter', gender: 'Unisex', created_at: now, updated_at: now });
await db.collection('markets').doc('market_2').set({ season: 'Summer', gender: 'Female', created_at: now, updated_at: now });

await db.collection('piece_items').doc('piece_1').set({
  brand_id: 'brand_1', market_id: 'market_1', name: 'Obsidian Tailored Blazer', image_url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800',
  piece_type: 'upper', color: 'Black', material: 'Wool', store_url: '#', price_range: '$$$', is_active: true, created_at: now, updated_at: now,
});

await db.collection('wardrobe_items').doc('wardrobe_1').set({
  user_id: 'user_1', brand_id: 'brand_1', market_id: 'market_1', name: 'Midnight Blazer', image_url: 'https://images.unsplash.com/photo-1593032465171-8bd2f0cf7f85?w=800',
  piece_type: 'upper', color: 'Black', material: 'Wool', style_tags: ['formal'], occasion_tags: ['work'], is_favorite: true, created_at: now, updated_at: now,
});

await db.collection('schemes').doc('scheme_1').set({
  user_id: 'user_1', title: 'Noir Utility Capsule', description: 'Balanced city formal look.', creation_mode: 'manual', style: 'Minimal', occasion: 'Work',
  visibility: 'public', community_indexed: true, cover_image_url: null, created_at: now, updated_at: now,
});

await db.collection('schemes').doc('scheme_1').collection('items').doc('scheme_item_1').set({
  scheme_id: 'scheme_1', wardrobe_item_id: 'wardrobe_1', slot: 'upper', sort_order: 1, created_at: now,
});

console.log('Firestore seed completed');

const mannequinRef = db.collection('mannequin_2d').doc('mannequin_editorial_01');
await mannequinRef.set({
  mannequin_id: 'mannequin_editorial_01',
  name: 'Editorial Muse 01',
  gender: 'female',
  body_type: 'balanced',
  pose_code: 'pose_a',
  canvas_width: 1200,
  canvas_height: 1800,
  preview_width: 560,
  preview_height: 840,
  base_image_url: '/dress-tester/muse/base.png',
  shadow_image_url: '/dress-tester/muse/shadow.png',
  hair_back_url: '/dress-tester/muse/hair-back.png',
  hair_front_url: '/dress-tester/muse/hair-front.png',
  face_layer_url: '/dress-tester/muse/face.png',
  active: true,
  created_at: now,
  updated_at: now,
});

const seedPieces2D = [
  ['top_1', 'top', 'Silk Column Top', 20],
  ['top_2', 'top', 'Noir Tucked Tee', 20],
  ['top_3', 'top', 'Silver Satin Blouse', 20],
  ['bottom_1', 'bottom', 'Tailored Trousers', 25],
  ['bottom_2', 'bottom', 'Pleated Midi Skirt', 25],
  ['bottom_3', 'bottom', 'Leather Pencil Skirt', 25],
  ['dress_1', 'dress', 'Floorline Slip Dress', 24],
  ['dress_2', 'dress', 'Structured Evening Dress', 24],
  ['shoes_1', 'shoes', 'Pointed Heel', 30],
  ['shoes_2', 'shoes', 'Minimal Sneaker', 30],
  ['bag_1', 'bag', 'Silver Clutch', 35],
  ['bag_2', 'bag', 'Leather Shoulder Bag', 35],
  ['outerwear_1', 'outerwear', 'Longline Coat', 40],
  ['outerwear_2', 'outerwear', 'Cropped Blazer', 40],
  ['accessory_1', 'accessory', 'Pearl Necklace', 50],
  ['accessory_2', 'accessory', 'Sculptural Earrings', 50],
];

for (const [pieceId, pieceType, name, layer] of seedPieces2D) {
  await db.collection('wardrobe_piece_2d').doc(pieceId).set({
    piece_id: pieceId,
    name,
    brand_id: 'brand_1',
    market_id: 'market_1',
    piece_type: pieceType,
    category_tier: 'premium',
    mannequin_type: 'female_editorial',
    pose_code: 'pose_a',
    render_layer: layer,
    image_url: `/dress-tester/pieces/${pieceId.replace('_', '-')}.png`,
    thumbnail_url: `/dress-tester/thumbs/${pieceId.replace('_', '-')}.png`,
    hide_layers: [],
    hides_piece_types: pieceType === 'dress' ? ['top', 'bottom'] : [],
    conflicts_with: [],
    compatible_piece_types: [],
    anchor: { x: 0, y: 0, scale: 1 },
    wearstyles: ['editorial'],
    colors: ['black'],
    materials: ['cotton'],
    season: 'all',
    gender: 'female',
    asset_status: 'published',
    active: true,
    created_at: now,
    updated_at: now,
  });
}
