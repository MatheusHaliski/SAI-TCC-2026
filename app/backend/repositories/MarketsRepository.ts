<<<<<<< HEAD
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
=======
import { BaseRepository } from './BaseRepository';

export class MarketsRepository extends BaseRepository {
  async listAll() {
    if (this.useMysql) {
      const { getMysqlPool } = await import('@/app/lib/db/mysql');
      const pool = getMysqlPool();
      const [rows] = await pool!.query('SELECT * FROM markets ORDER BY season, gender');
      return rows as Array<Record<string, unknown>>;
    }

    return this.getMockData().markets;
>>>>>>> 86fb19f (Refatora telas filhas e adiciona backend multilayer com APIs)
  }
}
