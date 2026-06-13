import { SchemeItem } from '@/app/backend/types/entities';
import { BaseRepository } from './BaseRepository';

const SCHEME_ITEMS_COLLECTION = 'saiSchemeItems';

interface CreateSchemeItemInput {
  scheme_id: string;
  wardrobe_item_id: string;
  slot: 'upper' | 'lower' | 'shoes' | 'accessory';
  sort_order: number;
}

export class SchemeItemsRepository extends BaseRepository {
  async createMany(items: CreateSchemeItemInput[]): Promise<SchemeItem[]> {
    if (!items.length) return [];

    const created: SchemeItem[] = [];
    for (const item of items) {
      const now = new Date().toISOString();
      const ref = await this.db.collection(SCHEME_ITEMS_COLLECTION).add({
        scheme_id: item.scheme_id,
        wardrobe_item_id: item.wardrobe_item_id,
        slot: item.slot,
        sort_order: item.sort_order,
        createdAt: now,
      });

      created.push({ scheme_item_id: ref.id, ...item, createdAt: now });
    }

    return created;
  }

  async findBySchemeId(schemeId: string): Promise<SchemeItem[]> {
    const query = await this.db
      .collection(SCHEME_ITEMS_COLLECTION)
      .where('scheme_id', '==', schemeId)
      .orderBy('sort_order', 'asc')
      .get();

    return query.docs.map((doc) => ({
      scheme_item_id: doc.id,
      ...(doc.data() as Omit<SchemeItem, 'scheme_item_id'>),
    }));
  }

  /**
   * Closet Inteligente: for each wardrobe item id, how many schemes use it and
   * when it was last used. Drives the "usada em N looks" / "esquecidas" insights.
   */
  async getUsageByWardrobeItemIds(
    wardrobeItemIds: string[],
  ): Promise<Record<string, { count: number; lastUsedAt: string | null }>> {
    const usage: Record<string, { count: number; lastUsedAt: string | null }> = {};
    for (const id of wardrobeItemIds) usage[id] = { count: 0, lastUsedAt: null };
    if (!wardrobeItemIds.length) return usage;

    // Firestore `in` queries accept up to 30 values per call — chunk accordingly.
    const CHUNK_SIZE = 30;
    for (let i = 0; i < wardrobeItemIds.length; i += CHUNK_SIZE) {
      const chunk = wardrobeItemIds.slice(i, i + CHUNK_SIZE);
      const snapshot = await this.db
        .collection(SCHEME_ITEMS_COLLECTION)
        .where('wardrobe_item_id', 'in', chunk)
        .get();

      snapshot.docs.forEach((doc) => {
        const data = doc.data() as { wardrobe_item_id?: string; createdAt?: string };
        const wid = data.wardrobe_item_id;
        if (!wid || !(wid in usage)) return;
        usage[wid].count += 1;
        const createdAt = typeof data.createdAt === 'string' ? data.createdAt : null;
        if (createdAt && (!usage[wid].lastUsedAt || createdAt > (usage[wid].lastUsedAt as string))) {
          usage[wid].lastUsedAt = createdAt;
        }
      });
    }

    return usage;
  }
}
