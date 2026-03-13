<<<<<<< HEAD
import { PieceItem } from '@/app/backend/types/entities';
=======
import { PieceItemSearchResult } from '@/app/backend/types/entities';
>>>>>>> 86fb19f (Refatora telas filhas e adiciona backend multilayer com APIs)
import { BaseRepository } from './BaseRepository';

interface PieceItemFilters {
  season?: string;
  gender?: string;
  brand?: string;
  piece_type?: string;
}

export class PieceItemsRepository extends BaseRepository {
<<<<<<< HEAD
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
=======
  async search(filters: PieceItemFilters): Promise<PieceItemSearchResult[]> {
    if (this.useMysql) {
      const { getMysqlPool } = await import('@/app/lib/db/mysql');
      const pool = getMysqlPool();
      const clauses: string[] = [];
      const params: string[] = [];

      if (filters.season) {
        clauses.push('m.season = ?');
        params.push(filters.season);
      }
      if (filters.gender) {
        clauses.push('m.gender = ?');
        params.push(filters.gender);
      }
      if (filters.brand) {
        clauses.push('b.name = ?');
        params.push(filters.brand);
      }
      if (filters.piece_type) {
        clauses.push('pi.piece_type = ?');
        params.push(filters.piece_type);
      }

      const whereClauses = ['pi.is_active = 1', ...clauses];
      const where = `WHERE ${whereClauses.join(' AND ')}`;
      const [rows] = await pool!.query(
        `SELECT pi.piece_item_id, pi.image_url, m.gender, b.name AS brand, pi.name, m.season, pi.piece_type
         FROM piece_items pi
         INNER JOIN brands b ON b.brand_id = pi.brand_id
         INNER JOIN markets m ON m.market_id = pi.market_id
         ${where}
         ORDER BY pi.created_at DESC`,
        params,
      );
      return rows as PieceItemSearchResult[];
    }

    const { pieceItems, brands, markets } = this.getMockData();
    return pieceItems
      .filter((item) => item.is_active)
      .map((item) => ({
        piece_item_id: item.piece_item_id,
        image_url: item.image_url,
        gender: markets.find((market) => market.market_id === item.market_id)?.gender ?? 'Unknown',
        brand: brands.find((brand) => brand.brand_id === item.brand_id)?.name ?? 'Unknown',
        name: item.name,
        season: markets.find((market) => market.market_id === item.market_id)?.season ?? 'Unknown',
        piece_type: item.piece_type,
      }))
      .filter((item) => !filters.season || item.season === filters.season)
      .filter((item) => !filters.gender || item.gender === filters.gender)
      .filter((item) => !filters.brand || item.brand === filters.brand)
      .filter((item) => !filters.piece_type || item.piece_type === filters.piece_type);
>>>>>>> 86fb19f (Refatora telas filhas e adiciona backend multilayer com APIs)
  }
}
