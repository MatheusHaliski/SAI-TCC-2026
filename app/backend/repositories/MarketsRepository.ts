import { BaseRepository } from './BaseRepository';

export class MarketsRepository extends BaseRepository {
  async listAll(): Promise<Market[]> {
    if (this.useFirestore) {
      const snapshot = await this.db!.collection('markets').get();
      return snapshot.docs.map((doc) => ({ market_id: doc.id, ...(doc.data() as Omit<Market, 'market_id'>) }));
    }

    return this.getMockData().markets;
  }

  async existsById(marketId: string): Promise<boolean> {
    if (this.useFirestore) {
      const snap = await this.db!.collection('markets').doc(marketId).get();
      return snap.exists;
    }
    return this.getMockData().markets.some((market) => market.market_id === marketId);
  }

  async getByIdMap(): Promise<Map<string, Market>> {
    const markets = await this.listAll();
    return new Map(markets.map((market) => [market.market_id, market]));
  }
}
