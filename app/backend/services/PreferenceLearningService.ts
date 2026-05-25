import { DailyLooksRepository, FeedbackValue } from '@/app/backend/repositories/DailyLooksRepository';
import { OutfitPreferencesRepository } from '@/app/backend/repositories/OutfitPreferencesRepository';
import { SchemeItemsRepository } from '@/app/backend/repositories/SchemeItemsRepository';
import { ServiceError } from './errors';

const FEEDBACK_DELTAS: Record<FeedbackValue, { style: number; occasion: number; piece: number }> = {
  loved:   { style:  1.0, occasion:  1.0, piece:  1.0 },
  used:    { style:  0.4, occasion:  0.4, piece:  0.4 },
  skipped: { style: -0.3, occasion: -0.3, piece: -0.3 },
};

const SCORE_MIN = -10;
const SCORE_MAX = 10;

function clamp(v: number): number {
  return Math.max(SCORE_MIN, Math.min(SCORE_MAX, v));
}

export class PreferenceLearningService {
  constructor(
    private readonly dailyLooksRepo = new DailyLooksRepository(),
    private readonly preferencesRepo = new OutfitPreferencesRepository(),
    private readonly schemeItemsRepo = new SchemeItemsRepository(),
  ) {}

  /**
   * Records feedback for a daily look and updates the user's learned preferences.
   *
   * Bug 1 fix — confirmed look items only:
   *   piece_weights are updated exclusively for the wardrobe items that are part
   *   of the confirmed look (resolved via scheme_id → saiSchemeItems). The old
   *   pattern `item.wardrobe_item_id.length > 0` was true for every wardrobe
   *   record and would corrupt weights across the entire closet.
   *
   * Bug 2 fix — idempotent per look:
   *   setFeedbackIfPending() writes the feedback field inside a Firestore
   *   transaction and returns false if feedback was already set. When it returns
   *   false the preference delta is skipped, so repeated PATCH calls for the same
   *   dailyLookId accumulate no additional weight.
   */
  async applyFeedback(
    userId: string,
    dailyLookId: string,
    feedback: FeedbackValue,
  ): Promise<{ applied: boolean }> {
    // Bug 2: transactional guard — writes feedback only if currently null.
    const written = await this.dailyLooksRepo.setFeedbackIfPending(dailyLookId, feedback);
    if (!written) {
      return { applied: false };
    }

    const dailyLook = await this.dailyLooksRepo.findById(dailyLookId);
    if (!dailyLook || dailyLook.user_id !== userId) {
      throw new ServiceError('Daily look not found', 404);
    }

    // Bug 1: resolve only the wardrobe items in the confirmed look.
    const schemeItems = await this.schemeItemsRepo.findBySchemeId(dailyLook.scheme_id);
    const lookItemIds = schemeItems
      .map((si) => si.wardrobe_item_id)
      .filter((id) => id.length > 0);

    const prefs = await this.preferencesRepo.findByUser(userId);
    const delta = FEEDBACK_DELTAS[feedback];

    prefs.style_scores[dailyLook.occasion] = clamp(
      (prefs.style_scores[dailyLook.occasion] ?? 0) + delta.style,
    );
    prefs.occasion_scores[dailyLook.occasion] = clamp(
      (prefs.occasion_scores[dailyLook.occasion] ?? 0) + delta.occasion,
    );

    for (const itemId of lookItemIds) {
      prefs.piece_weights[itemId] = clamp(
        (prefs.piece_weights[itemId] ?? 0) + delta.piece,
      );
    }

    await this.preferencesRepo.save(prefs);
    return { applied: true };
  }
}
