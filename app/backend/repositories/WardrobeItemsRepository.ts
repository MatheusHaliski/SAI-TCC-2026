import { WardrobeAnalysis, WardrobeViewItem } from '@/app/backend/types/entities';
import { BaseRepository } from './BaseRepository';
import { BrandsRepository } from './BrandsRepository';
import { MarketsRepository } from './MarketsRepository';

const WARDROBE_ITEMS_COLLECTION = 'sai-wardrobeItems';

function aggregate(items: WardrobeViewItem[], key: keyof Pick<WardrobeViewItem, 'brand' | 'season' | 'gender' | 'piece_type'>) {
  return items.reduce<Record<string, number>>((acc, item) => {
    acc[item[key]] = (acc[item[key]] ?? 0) + 1;
    return acc;
  }, {});
}

export class WardrobeItemsRepository extends BaseRepository {
  constructor(
    private readonly brandsRepository = new BrandsRepository(),
    private readonly marketsRepository = new MarketsRepository(),
  ) {
    super();
  }

  async findByUser(userId: string): Promise<WardrobeViewItem[]> {
    const brandMap = await this.brandsRepository.getNameMap();
    const marketsMap = await this.marketsRepository.getByIdMap();

    const snapshot = await this.db.collection(WARDROBE_ITEMS_COLLECTION).where('user_id', '==', userId).get();
    return snapshot.docs.map((doc) => {
      const item = doc.data() as Record<string, string>;
      const market = marketsMap.get(item.market_id);
      return {
        wardrobe_item_id: doc.id,
        name: item.name,
        image_url: item.image_url,
        model_3d_url: item.model_3d_url ?? null,
        model_preview_url: item.model_preview_url ?? null,
        brand: brandMap.get(item.brand_id) ?? (item.brand_id === 'default' ? 'Default brand' : 'Unknown'),
        season: market?.season ?? 'Unknown',
        gender: market?.gender ?? 'Unknown',
        piece_type: item.piece_type,
      };
    });
  }



  async create(input: {
    user_id: string;
    brand_id: string;
    market_id: string;
    name: string;
    image_url: string;
    model_3d_url: string | null;
    model_preview_url: string | null;
    piece_type: string;
    color: string;
    material: string;
    style_tags: string[];
    occasion_tags: string[];
  }): Promise<{ wardrobe_item_id: string }> {
    const now = new Date().toISOString();
    const payload = {
      ...input,
      is_favorite: false,
      created_at: now,
      updated_at: now,
    };
    const ref = await this.db.collection(WARDROBE_ITEMS_COLLECTION).add(payload);
    return { wardrobe_item_id: ref.id };
  }

  async existsById(wardrobeItemId: string): Promise<boolean> {
    const snap = await this.db.collection(WARDROBE_ITEMS_COLLECTION).doc(wardrobeItemId).get();
    return snap.exists;
  }

  async updateModelAssets(
    wardrobeItemId: string,
    input: {
      model_3d_url: string;
      model_preview_url: string | null;
    },
  ): Promise<void> {
    await this.db.collection(WARDROBE_ITEMS_COLLECTION).doc(wardrobeItemId).update({
      ...input,
      updated_at: new Date().toISOString(),
    });
  }

  async getAnalysisByUser(userId: string): Promise<WardrobeAnalysis> {
    const items = await this.findByUser(userId);
    return {
      total_items: items.length,
      by_brand: aggregate(items, 'brand'),
      by_season: aggregate(items, 'season'),
      by_gender: aggregate(items, 'gender'),
      by_piece_type: aggregate(items, 'piece_type'),
    };
  }
}
