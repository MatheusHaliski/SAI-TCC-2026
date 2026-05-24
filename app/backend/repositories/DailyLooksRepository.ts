import { DailyLook, DailyLookFeedback } from '@/app/backend/types/entities';
import { BaseRepository } from './BaseRepository';

const COLLECTION = 'saiDailyLooks';

export class DailyLooksRepository extends BaseRepository {
  async create(input: Omit<DailyLook, 'daily_look_id'>): Promise<DailyLook> {
    const ref = await this.db.collection(COLLECTION).add(input);
    return { daily_look_id: ref.id, ...input };
  }

  async findById(id: string): Promise<DailyLook | null> {
    const doc = await this.db.collection(COLLECTION).doc(id).get();
    if (!doc.exists) return null;
    return { daily_look_id: doc.id, ...(doc.data() as Omit<DailyLook, 'daily_look_id'>) };
  }

  async findByUserAndDate(userId: string, date: string): Promise<DailyLook[]> {
    const snapshot = await this.db
      .collection(COLLECTION)
      .where('user_id', '==', userId)
      .where('date', '==', date)
      .get();
    return snapshot.docs.map((doc) => ({ daily_look_id: doc.id, ...(doc.data() as Omit<DailyLook, 'daily_look_id'>) }));
  }

  async findByUser(userId: string, limit = 30): Promise<DailyLook[]> {
    const snapshot = await this.db
      .collection(COLLECTION)
      .where('user_id', '==', userId)
      .orderBy('created_at', 'desc')
      .limit(limit)
      .get();
    return snapshot.docs.map((doc) => ({ daily_look_id: doc.id, ...(doc.data() as Omit<DailyLook, 'daily_look_id'>) }));
  }

  async updateFeedback(id: string, feedback: DailyLookFeedback): Promise<void> {
    await this.db.collection(COLLECTION).doc(id).update({
      feedback,
      feedback_at: new Date().toISOString(),
    });
  }
}
