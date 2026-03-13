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
  }
}
