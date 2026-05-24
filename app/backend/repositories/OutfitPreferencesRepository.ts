import { OutfitPreferences } from '@/app/backend/types/entities';
import { BaseRepository } from './BaseRepository';

const COLLECTION = 'saiOutfitPreferences';

export class OutfitPreferencesRepository extends BaseRepository {
  async findByUser(userId: string): Promise<OutfitPreferences | null> {
    const doc = await this.db.collection(COLLECTION).doc(userId).get();
    if (!doc.exists) return null;
    return doc.data() as OutfitPreferences;
  }

  async findOrCreate(userId: string): Promise<OutfitPreferences> {
    const existing = await this.findByUser(userId);
    if (existing) return existing;

    const fresh: OutfitPreferences = {
      user_id: userId,
      style_scores: {},
      occasion_scores: {},
      piece_weights: {},
      color_affinities: [],
      updated_at: new Date().toISOString(),
    };
    await this.db.collection(COLLECTION).doc(userId).set(fresh);
    return fresh;
  }

  async save(prefs: OutfitPreferences): Promise<void> {
    await this.db.collection(COLLECTION).doc(prefs.user_id).set({
      ...prefs,
      updated_at: new Date().toISOString(),
    });
  }
}
