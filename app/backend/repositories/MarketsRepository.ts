import { Market } from '@/app/backend/types/entities';
import { BaseRepository } from './BaseRepository';

export class MarketsRepository extends BaseRepository {
  async getById(marketId: string): Promise<Market | null> {
    const snap = await this.db().collection('markets').doc(marketId).get();
    if (!snap.exists) return null;
    return { market_id: snap.id, ...(snap.data() as Omit<Market, 'market_id'>) };
  }

  async listAll(): Promise<Market[]> {
    const query = await this.db().collection('markets').get();
    return query.docs.map((doc) => ({ market_id: doc.id, ...(doc.data() as Omit<Market, 'market_id'>) }));
  }
}
