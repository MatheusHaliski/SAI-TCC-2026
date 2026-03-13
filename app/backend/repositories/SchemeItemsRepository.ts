import { SchemeItem } from '@/app/backend/types/entities';
import { BaseRepository } from './BaseRepository';

interface CreateSchemeItemInput {
  scheme_id: string;
  wardrobe_item_id: string;
  slot: 'upper' | 'lower' | 'shoes' | 'accessory';
  sort_order: number;
}

export class SchemeItemsRepository extends BaseRepository {
  async createMany(items: CreateSchemeItemInput[]): Promise<SchemeItem[]> {
    if (!items.length) return [];

    if (this.useFirestore) {
      const created: SchemeItem[] = [];
      for (const item of items) {
        const now = new Date().toISOString();
        const ref = await this.db!.collection('schemes').doc(item.scheme_id).collection('items').add({
          wardrobe_item_id: item.wardrobe_item_id,
          slot: item.slot,
          sort_order: item.sort_order,
          created_at: now,
        });
        created.push({ scheme_item_id: ref.id, ...item, created_at: now });
      }
      return created;
    }

    const { schemeItems } = this.getMockData();
    const now = new Date().toISOString();
    const created = items.map((item, index) => ({
      scheme_item_id: String(schemeItems.length + index + 1),
      scheme_id: item.scheme_id,
      wardrobe_item_id: item.wardrobe_item_id,
      slot: item.slot,
      sort_order: item.sort_order,
      created_at: now,
    }));

  async findBySchemeId(schemeId: string): Promise<SchemeItem[]> {
    const query = await this.db().collection('schemes').doc(schemeId).collection('items').orderBy('sort_order', 'asc').get();
    return query.docs.map((doc) => ({ scheme_item_id: doc.id, ...(doc.data() as Omit<SchemeItem, 'scheme_item_id'>) }));
  }
}
