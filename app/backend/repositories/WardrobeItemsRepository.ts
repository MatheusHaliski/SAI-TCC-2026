import { BaseRepository } from './BaseRepository';
import { WardrobeAnalysis, WardrobeViewItem } from '@/app/backend/types/entities';

function aggregate(items: WardrobeViewItem[], key: keyof Pick<WardrobeViewItem, 'brand' | 'season' | 'gender' | 'piece_type'>) {
  return items.reduce<Record<string, number>>((acc, item) => {
    acc[item[key]] = (acc[item[key]] ?? 0) + 1;
    return acc;
  }, {});
}

export class WardrobeItemsRepository extends BaseRepository {
  async findByUser(userId: number): Promise<WardrobeViewItem[]> {
    if (this.useMysql) {
      const { getMysqlPool } = await import('@/app/lib/db/mysql');
      const pool = getMysqlPool();
      const [rows] = await pool!.query(
        `SELECT wi.wardrobe_item_id, wi.name, wi.image_url, b.name AS brand, m.season, m.gender, wi.piece_type
         FROM wardrobe_items wi
         INNER JOIN brands b ON b.brand_id = wi.brand_id
         INNER JOIN markets m ON m.market_id = wi.market_id
         WHERE wi.user_id = ?
         ORDER BY wi.created_at DESC`,
        [userId],
      );
      return rows as WardrobeViewItem[];
    }

    const { wardrobeItems, brands, markets } = this.getMockData();
    return wardrobeItems
      .filter((item) => item.user_id === userId)
      .map((item) => ({
        wardrobe_item_id: item.wardrobe_item_id,
        name: item.name,
        image_url: item.image_url,
        brand: brands.find((brand) => brand.brand_id === item.brand_id)?.name ?? 'Unknown',
        season: markets.find((market) => market.market_id === item.market_id)?.season ?? 'Unknown',
        gender: markets.find((market) => market.market_id === item.market_id)?.gender ?? 'Unknown',
        piece_type: item.piece_type,
      }));
  }

  async getAnalysisByUser(userId: number): Promise<WardrobeAnalysis> {
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
