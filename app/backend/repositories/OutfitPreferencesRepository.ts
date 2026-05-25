import { BaseRepository } from './BaseRepository';

export interface OutfitPreferences {
  user_id: string;
  style_scores: Record<string, number>;
  occasion_scores: Record<string, number>;
  piece_weights: Record<string, number>;
  color_affinities: string[];
  updated_at: string;
}

const OUTFIT_PREFERENCES_COLLECTION = 'saiOutfitPreferences';

const empty = (): Omit<OutfitPreferences, 'user_id' | 'updated_at'> => ({
  style_scores: {},
  occasion_scores: {},
  piece_weights: {},
  color_affinities: [],
});

export class OutfitPreferencesRepository extends BaseRepository {
  async findByUser(userId: string): Promise<OutfitPreferences> {
    const doc = await this.db.collection(OUTFIT_PREFERENCES_COLLECTION).doc(userId).get();
    if (!doc.exists) {
      return { user_id: userId, ...empty(), updated_at: new Date().toISOString() };
    }
    const data = doc.data() as Record<string, unknown>;
    return {
      user_id: userId,
      style_scores: (data.style_scores as Record<string, number>) ?? {},
      occasion_scores: (data.occasion_scores as Record<string, number>) ?? {},
      piece_weights: (data.piece_weights as Record<string, number>) ?? {},
      color_affinities: Array.isArray(data.color_affinities)
        ? data.color_affinities.map(String)
        : [],
      updated_at: String(data.updated_at ?? ''),
    };
  }

  async save(prefs: OutfitPreferences): Promise<void> {
    await this.db
      .collection(OUTFIT_PREFERENCES_COLLECTION)
      .doc(prefs.user_id)
      .set({ ...prefs, updated_at: new Date().toISOString() }, { merge: true });
  }
}
