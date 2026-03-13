import { BaseRepository } from './BaseRepository';
import { SchemeItem } from '@/app/backend/types/entities';

interface CreateSchemeItemInput {
  scheme_id: number;
  wardrobe_item_id: number;
  slot: 'upper' | 'lower' | 'shoes' | 'accessory';
  sort_order: number;
}

export class SchemeItemsRepository extends BaseRepository {
  async createMany(items: CreateSchemeItemInput[]): Promise<SchemeItem[]> {
    if (!items.length) return [];

    if (this.useMysql) {
      const { getMysqlPool } = await import('@/app/lib/db/mysql');
      const pool = getMysqlPool();
      const values = items.map((item) => [item.scheme_id, item.wardrobe_item_id, item.slot, item.sort_order]);
      await pool!.query(
        `INSERT INTO scheme_items (scheme_id, wardrobe_item_id, slot, sort_order, created_at) VALUES ?`,
        [values.map((value) => [...value, new Date()])],
      );
      const [rows] = await pool!.query('SELECT * FROM scheme_items WHERE scheme_id = ? ORDER BY sort_order', [items[0].scheme_id]);
      return rows as SchemeItem[];
    }

    const { schemeItems } = this.getMockData();
    const maxId = Math.max(...schemeItems.map((item) => item.scheme_item_id), 0);
    const now = new Date().toISOString();

    const created = items.map((item, index) => ({
      scheme_item_id: maxId + index + 1,
      scheme_id: item.scheme_id,
      wardrobe_item_id: item.wardrobe_item_id,
      slot: item.slot,
      sort_order: item.sort_order,
      created_at: now,
    }));

    schemeItems.push(...created);
    return created;
  }
}
