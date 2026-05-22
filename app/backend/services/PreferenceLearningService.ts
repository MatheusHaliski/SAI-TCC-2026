import { AutopilotWardrobeItem, DailyLook, DailyLookFeedback, OutfitPreferences } from '@/app/backend/types/entities';
import { OutfitPreferencesRepository } from '@/app/backend/repositories/OutfitPreferencesRepository';

const FEEDBACK_DELTA: Record<DailyLookFeedback, number> = {
  loved: 1.0,
  used: 0.5,
  skipped: -0.25,
};

const SCORE_CEILING = 10.0;

export class PreferenceLearningService {
  constructor(private readonly prefsRepo = new OutfitPreferencesRepository()) {}

  async applyFeedback(
    userId: string,
    dailyLook: DailyLook,
    feedback: DailyLookFeedback,
    items: AutopilotWardrobeItem[],
  ): Promise<void> {
    const prefs = await this.prefsRepo.findOrCreate(userId);
    const delta = FEEDBACK_DELTA[feedback];

    prefs.occasion_scores[dailyLook.occasion] =
      (prefs.occasion_scores[dailyLook.occasion] ?? 0) + delta;

    for (const item of items) {
      prefs.piece_weights[item.wardrobe_item_id] =
        (prefs.piece_weights[item.wardrobe_item_id] ?? 0) + delta;

      if (feedback === 'loved' && item.color) {
        if (!prefs.color_affinities.includes(item.color)) {
          prefs.color_affinities = [...prefs.color_affinities, item.color].slice(0, 20);
        }
      }

      for (const style of item.style_tags) {
        prefs.style_scores[style] = (prefs.style_scores[style] ?? 0) + delta;
      }
    }

    this.clampScores(prefs);
    await this.prefsRepo.save(prefs);
  }

  private clampScores(prefs: OutfitPreferences): void {
    for (const key of Object.keys(prefs.piece_weights)) {
      prefs.piece_weights[key] = Math.max(0, Math.min(SCORE_CEILING, prefs.piece_weights[key]));
    }
    for (const key of Object.keys(prefs.occasion_scores)) {
      prefs.occasion_scores[key] = Math.max(0, Math.min(SCORE_CEILING, prefs.occasion_scores[key]));
    }
    for (const key of Object.keys(prefs.style_scores)) {
      prefs.style_scores[key] = Math.max(0, Math.min(SCORE_CEILING, prefs.style_scores[key]));
    }
  }
}
