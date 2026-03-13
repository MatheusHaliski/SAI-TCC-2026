import { BaseRepository } from './BaseRepository';

export class UsersRepository extends BaseRepository {
  async getById(userId: number) {
    if (this.useMysql) {
      const { getMysqlPool } = await import('@/app/lib/db/mysql');
      const pool = getMysqlPool();
      const [rows] = await pool!.query('SELECT * FROM users WHERE user_id = ? LIMIT 1', [userId]);
      return (rows as Array<Record<string, unknown>>)[0] ?? null;
    }

    return this.getMockData().users.find((user) => user.user_id === userId) ?? null;
  }
}
