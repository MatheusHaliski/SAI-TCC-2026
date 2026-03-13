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
