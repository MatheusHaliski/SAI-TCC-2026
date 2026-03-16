import { getAdminFirestore } from '@/app/lib/firebaseAdmin';

const BRAND_NAMES = ['Adidas', 'Nike', 'Zara', 'C&A', 'Puma', 'Levis'];
const SEASONS = ['winter', 'summer', 'autumn', 'spring'];
const GENDERS = ['male', 'female'];
const PIECE_TYPES = ['upper_piece', 'shoes_piece', 'lower_piece', 'accessory_piece'];

const ITEM_NAMES_BY_TYPE: Record<string, string[]> = {
  upper_piece: ['Classic Hoodie', 'Urban Jacket', 'Cotton T-Shirt', 'Zip Sweatshirt'],
  shoes_piece: ['Runner Sneaker', 'Street Boot', 'Canvas Trainer', 'Daily Slip-On'],
  lower_piece: ['Relaxed Jeans', 'Chino Pants', 'Cargo Pants', 'Tailored Shorts'],
  accessory_piece: ['Leather Belt', 'Sport Cap', 'Crossbody Bag', 'Wool Scarf'],
};

const IMAGE_POOL = [
  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1200',
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200',
  'https://images.unsplash.com/photo-1514996937319-344454492b37?w=1200',
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200',
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200',
  'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=1200',
  'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=1200',
  'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=1200',
];

function randomFrom<T>(values: T[]): T {
  return values[Math.floor(Math.random() * values.length)];
}

export async function ensureSaiCatalogSeeded() {
  const db = getAdminFirestore();

  const [brandsSnap, marketsSnap, pieceItemsSnap] = await Promise.all([
    db.collection('sai-brands').limit(1).get(),
    db.collection('sai-markets').limit(1).get(),
    db.collection('sai-pieceItems').limit(1).get(),
  ]);

  const now = new Date().toISOString();

  if (brandsSnap.empty) {
    await Promise.all(
      BRAND_NAMES.map((brandName, index) =>
        db
          .collection('sai-brands')
          .doc(`brand_${index + 1}`)
          .set({
            name: brandName,
            logo_url: null,
            is_active: true,
            created_at: now,
            updated_at: now,
          }),
      ),
    );
  }

  if (marketsSnap.empty) {
    const marketRows = SEASONS.flatMap((season) => GENDERS.map((gender) => ({ season, gender })));
    await Promise.all(
      marketRows.map((market, index) =>
        db
          .collection('sai-markets')
          .doc(`market_${index + 1}`)
          .set({
            season: market.season,
            gender: market.gender,
            created_at: now,
            updated_at: now,
          }),
      ),
    );
  }

  if (!pieceItemsSnap.empty) return;

  const [brandsAll, marketsAll] = await Promise.all([db.collection('sai-brands').get(), db.collection('sai-markets').get()]);
  const brandIds = brandsAll.docs.map((doc) => doc.id);
  const marketIds = marketsAll.docs.map((doc) => doc.id);

  const writes = Array.from({ length: 18 }, (_, index) => {
    const pieceType = randomFrom(PIECE_TYPES);
    const pieceName = randomFrom(ITEM_NAMES_BY_TYPE[pieceType]);
    const photo = randomFrom(IMAGE_POOL);

    return db
      .collection('sai-pieceItems')
      .doc(`piece_${index + 1}`)
      .set({
        brand_id: randomFrom(brandIds),
        market_id: randomFrom(marketIds),
        name: `${pieceName} ${index + 1}`,
        image_url: photo,
        photo,
        piece_type: pieceType,
        color: randomFrom(['black', 'white', 'blue', 'olive', 'grey', 'beige']),
        material: randomFrom(['cotton', 'denim', 'polyester', 'leather', 'wool']),
        store_url: null,
        price_range: randomFrom(['$', '$$', '$$$']),
        is_active: true,
        created_at: now,
        updated_at: now,
      });
  });

  await Promise.all(writes);
}
