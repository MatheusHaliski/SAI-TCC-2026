import { PieceItemSearchResult } from '@/app/backend/types/entities';
import { BaseRepository } from './BaseRepository';
import { BrandsRepository } from './BrandsRepository';
import { MarketsRepository } from './MarketsRepository';

const PIECE_ITEMS_COLLECTION = 'sai-pieceItems';

interface PieceItemFilters {
  season?: string;
  gender?: string;
  brand?: string;
  piece_type?: string;
}

export class PieceItemsRepository extends BaseRepository {
  constructor(
    private readonly brandsRepository = new BrandsRepository(),
    private readonly marketsRepository = new MarketsRepository(),
  ) {
    super();
  }

  async search(filters: PieceItemFilters): Promise<PieceItemSearchResult[]> {
    const brandMap = await this.brandsRepository.getNameMap();
    const marketsMap = await this.marketsRepository.getByIdMap();

    let query: FirebaseFirestore.Query = this.db.collection(PIECE_ITEMS_COLLECTION).where('is_active', '==', true);
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
}
