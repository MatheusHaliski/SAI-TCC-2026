import { WardrobeItem } from '@/app/backend/types/entities';
import { BaseRepository } from './BaseRepository';

export class WardrobeItemsRepository extends BaseRepository {
  async getById(wardrobeItemId: string): Promise<WardrobeItem | null> {
    const snap = await this.db().collection('wardrobe_items').doc(wardrobeItemId).get();
    if (!snap.exists) return null;
    return { wardrobe_item_id: snap.id, ...(snap.data() as Omit<WardrobeItem, 'wardrobe_item_id'>) };
  }

  async findByUser(userId: string): Promise<WardrobeItem[]> {
    const query = await this.db().collection('wardrobe_items').where('user_id', '==', userId).get();
    return query.docs.map((doc) => ({ wardrobe_item_id: doc.id, ...(doc.data() as Omit<WardrobeItem, 'wardrobe_item_id'>) }));
  }
}
