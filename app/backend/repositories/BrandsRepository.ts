<<<<<<< HEAD
import { Brand } from '@/app/backend/types/entities';
import { BaseRepository } from './BaseRepository';

export class BrandsRepository extends BaseRepository {
  async getById(brandId: string): Promise<Brand | null> {
    const snap = await this.db().collection('brands').doc(brandId).get();
    if (!snap.exists) return null;
    return { brand_id: snap.id, ...(snap.data() as Omit<Brand, 'brand_id'>) };
  }

  async listActive(): Promise<Brand[]> {
    const query = await this.db().collection('brands').where('is_active', '==', true).get();
    return query.docs.map((doc) => ({ brand_id: doc.id, ...(doc.data() as Omit<Brand, 'brand_id'>) }));
=======
import { BaseRepository } from './BaseRepository';

export class BrandsRepository extends BaseRepository {
  async listActive() {
    if (this.useMysql) {
      const { getMysqlPool } = await import('@/app/lib/db/mysql');
      const pool = getMysqlPool();
      const [rows] = await pool!.query('SELECT * FROM brands WHERE is_active = 1 ORDER BY name');
      return rows as Array<Record<string, unknown>>;
    }

    return this.getMockData().brands.filter((brand) => brand.is_active);
>>>>>>> 86fb19f (Refatora telas filhas e adiciona backend multilayer com APIs)
  }
}
