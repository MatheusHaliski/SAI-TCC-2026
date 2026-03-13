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
  }
}
