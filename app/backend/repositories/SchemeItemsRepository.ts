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

    const now = this.nowIso();
    const created: SchemeItem[] = [];

    await Promise.all(
      items.map(async (item) => {
        const ref = this.db().collection('schemes').doc(item.scheme_id).collection('items').doc();
        const payload: Omit<SchemeItem, 'scheme_item_id'> = {
          scheme_id: item.scheme_id,
          wardrobe_item_id: item.wardrobe_item_id,
          slot: item.slot,
          sort_order: item.sort_order,
          created_at: now,
        };
        await ref.set(payload);
        created.push({ scheme_item_id: ref.id, ...payload });
      }),
    );

    return created.sort((a, b) => a.sort_order - b.sort_order);
  }

  async findBySchemeId(schemeId: string): Promise<SchemeItem[]> {
    const query = await this.db().collection('schemes').doc(schemeId).collection('items').orderBy('sort_order', 'asc').get();
    return query.docs.map((doc) => ({ scheme_item_id: doc.id, ...(doc.data() as Omit<SchemeItem, 'scheme_item_id'>) }));
  }
}
