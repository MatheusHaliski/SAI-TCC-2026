<<<<<<< HEAD
import { getAdminFirestore } from '@/app/lib/firebaseAdmin';

export class BaseRepository {
  protected db() {
    return getAdminFirestore();
  }

  protected nowIso() {
    return new Date().toISOString();
=======
import { brands, markets, pieceItems, schemeItems, schemes, users, wardrobeItems } from '@/app/backend/data/mockData';
import { Brand, Market, PieceItem, Scheme, SchemeItem, User, WardrobeItem } from '@/app/backend/types/entities';
import { getMysqlPool } from '@/app/lib/db/mysql';

export class BaseRepository {
  protected get useMysql() {
    return Boolean(getMysqlPool());
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
>>>>>>> 86fb19f (Refatora telas filhas e adiciona backend multilayer com APIs)
  }
}
