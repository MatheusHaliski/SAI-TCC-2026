import { WeekPlan } from '@/app/backend/types/entities';
import { BaseRepository } from './BaseRepository';

const COLLECTION = 'saiWeekPlans';

export class WeekPlansRepository extends BaseRepository {
  async create(input: Omit<WeekPlan, 'week_plan_id'>): Promise<WeekPlan> {
    const ref = await this.db.collection(COLLECTION).add(input);
    return { week_plan_id: ref.id, ...input };
  }

  async findByUser(userId: string, limit = 10): Promise<WeekPlan[]> {
    const snapshot = await this.db
      .collection(COLLECTION)
      .where('user_id', '==', userId)
      .orderBy('created_at', 'desc')
      .limit(limit)
      .get();
    return snapshot.docs.map((doc) => ({ week_plan_id: doc.id, ...(doc.data() as Omit<WeekPlan, 'week_plan_id'>) }));
  }

  async findById(id: string): Promise<WeekPlan | null> {
    const doc = await this.db.collection(COLLECTION).doc(id).get();
    if (!doc.exists) return null;
    return { week_plan_id: doc.id, ...(doc.data() as Omit<WeekPlan, 'week_plan_id'>) };
  }
}
