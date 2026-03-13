import { User } from '@/app/backend/types/entities';
import { BaseRepository } from './BaseRepository';

export class UsersRepository extends BaseRepository {
  async getById(userId: string): Promise<User | null> {
    const snap = await this.db().collection('users').doc(userId).get();
    if (!snap.exists) return null;
    return { user_id: snap.id, ...(snap.data() as Omit<User, 'user_id'>) };
  }
}
