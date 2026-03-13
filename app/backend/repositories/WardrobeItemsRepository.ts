import { WardrobeAnalysis, WardrobeViewItem } from '@/app/backend/types/entities';
import { BaseRepository } from './BaseRepository';
import { BrandsRepository } from './BrandsRepository';
import { MarketsRepository } from './MarketsRepository';

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

    if (this.useFirestore) {
      const snapshot = await this.db!.collection('wardrobe_items').where('user_id', '==', userId).get();
      return snapshot.docs.map((doc) => {
        const item = doc.data() as Record<string, string>;
        const market = marketsMap.get(item.market_id);
        return {
          wardrobe_item_id: doc.id,
          name: item.name,
          image_url: item.image_url,
          brand: brandMap.get(item.brand_id) ?? 'Unknown',
          season: market?.season ?? 'Unknown',
          gender: market?.gender ?? 'Unknown',
          piece_type: item.piece_type,
        };
      });
    }

    const { wardrobeItems } = this.getMockData();
    return wardrobeItems
      .filter((item) => item.user_id === userId)
      .map((item) => {
        const market = marketsMap.get(item.market_id);
        return {
          wardrobe_item_id: item.wardrobe_item_id,
          name: item.name,
          image_url: item.image_url,
          brand: brandMap.get(item.brand_id) ?? 'Unknown',
          season: market?.season ?? 'Unknown',
          gender: market?.gender ?? 'Unknown',
          piece_type: item.piece_type,
        };
      });
  }

  async existsById(wardrobeItemId: string): Promise<boolean> {
    if (this.useFirestore) {
      const snap = await this.db!.collection('wardrobe_items').doc(wardrobeItemId).get();
      return snap.exists;
    }
    return this.getMockData().wardrobeItems.some((item) => item.wardrobe_item_id === wardrobeItemId);
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
