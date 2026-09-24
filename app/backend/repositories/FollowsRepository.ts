import { COLLECTIONS } from '@/app/lib/collections';
import { BaseRepository } from './BaseRepository';

export class FollowsRepository extends BaseRepository {
  /** Whether `followerId` currently follows `followingId`. */
  async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    if (!followerId || !followingId) return false;
    const docId = `${followerId}_${followingId}`;
    const snap = await this.db.collection(COLLECTIONS.FOLLOWS).doc(docId).get();
    return snap.exists;
  }
}
