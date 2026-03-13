import { brands, markets, pieceItems, schemeItems, schemes, users, wardrobeItems } from '@/app/backend/data/mockData';
import { Brand, Market, PieceItem, Scheme, SchemeItem, User, WardrobeItem } from '@/app/backend/types/entities';
import { getAdminFirestore } from '@/app/lib/firebaseAdmin';

export class BaseRepository {
  protected get db() {
    try {
      return getAdminFirestore();
    } catch {
      return null;
    }
  }

  protected get useFirestore() {
    return Boolean(this.db);
  }

  protected getMockData() {
    return {
      users,
      brands,
      markets,
      pieceItems,
      wardrobeItems,
      schemes,
      schemeItems,
    } as {
      users: User[];
      brands: Brand[];
      markets: Market[];
      pieceItems: PieceItem[];
      wardrobeItems: WardrobeItem[];
      schemes: Scheme[];
      schemeItems: SchemeItem[];
    };
  }
}
