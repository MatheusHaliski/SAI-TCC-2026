import { PieceItemSearchResult } from '@/app/backend/types/entities';
import { BaseRepository } from './BaseRepository';
import { BrandsRepository } from './BrandsRepository';
import { MarketsRepository } from './MarketsRepository';

interface PieceItemFilters {
  season?: string;
  gender?: string;
  brand?: string;
  piece_type?: string;
}

export class PieceItemsRepository extends BaseRepository {
  async search(filters: PieceItemFilters): Promise<PieceItemSearchResult[]> {
    const brandMap = await this.brandsRepository.getNameMap();
    const marketsMap = await this.marketsRepository.getByIdMap();

    if (this.useFirestore) {
      let query: FirebaseFirestore.Query = this.db!.collection('piece_items').where('is_active', '==', true);
      if (filters.piece_type) {
        query = query.where('piece_type', '==', filters.piece_type);
      }

      const snapshot = await query.get();
      const results = snapshot.docs.map((doc) => {
        const data = doc.data() as Record<string, string>;
        const market = marketsMap.get(data.market_id);
        return {
          piece_item_id: doc.id,
          image_url: data.image_url,
          gender: market?.gender ?? 'Unknown',
          brand: brandMap.get(data.brand_id) ?? 'Unknown',
          name: data.name,
          season: market?.season ?? 'Unknown',
          piece_type: data.piece_type,
        };
      });

      return results
        .filter((item) => !filters.season || item.season === filters.season)
        .filter((item) => !filters.gender || item.gender === filters.gender)
        .filter((item) => !filters.brand || item.brand === filters.brand);
    }

    const { pieceItems } = this.getMockData();
    return pieceItems
      .filter((item) => item.is_active)
      .map((item) => {
        const market = marketsMap.get(item.market_id);
        return {
          piece_item_id: item.piece_item_id,
          image_url: item.image_url,
          gender: market?.gender ?? 'Unknown',
          brand: brandMap.get(item.brand_id) ?? 'Unknown',
          name: item.name,
          season: market?.season ?? 'Unknown',
          piece_type: item.piece_type,
        };
      })
      .filter((item) => !filters.season || item.season === filters.season)
      .filter((item) => !filters.gender || item.gender === filters.gender)
      .filter((item) => !filters.brand || item.brand === filters.brand)
      .filter((item) => !filters.piece_type || item.piece_type === filters.piece_type);
  }
}
