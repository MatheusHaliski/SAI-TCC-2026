import { PieceItem } from '@/app/backend/types/entities';
import { BaseRepository } from './BaseRepository';

interface PieceItemFilters {
  season?: string;
  gender?: string;
  brand?: string;
  piece_type?: string;
}

export class PieceItemsRepository extends BaseRepository {
  async findAllActive(): Promise<PieceItem[]> {
    const query = await this.db().collection('piece_items').where('is_active', '==', true).get();
    return query.docs.map((doc) => ({ piece_item_id: doc.id, ...(doc.data() as Omit<PieceItem, 'piece_item_id'>) }));
  }

  async searchByBaseFilter(filters: PieceItemFilters): Promise<PieceItem[]> {
    let ref: FirebaseFirestore.Query<FirebaseFirestore.DocumentData> = this.db()
      .collection('piece_items')
      .where('is_active', '==', true);

    if (filters.piece_type) {
      ref = ref.where('piece_type', '==', filters.piece_type);
    }

    const query = await ref.get();
    return query.docs.map((doc) => ({ piece_item_id: doc.id, ...(doc.data() as Omit<PieceItem, 'piece_item_id'>) }));
  }
}
