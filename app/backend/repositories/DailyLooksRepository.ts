import { BaseRepository } from './BaseRepository';

export type FeedbackValue = 'loved' | 'used' | 'skipped';

export interface DailyLookItem {
  wardrobe_item_id: string;
  name: string;
  image_url?: string;
  piece_type?: string;
}

export interface DailyLook {
  daily_look_id: string;
  user_id: string;
  date: string;
  scheme_id: string;
  title?: string;
  occasion: string;
  mood: string;
  weather_c: number | null;
  city: string;
  feedback: FeedbackValue | null;
  feedback_at: string | null;
  created_at: string;
  scheme_items?: DailyLookItem[];
}

const DAILY_LOOKS_COLLECTION = 'saiDailyLooks';

/**
 * Deterministic per-user/date document id. Firestore has no equivalent to a
 * SQL (user_id, look_date) unique constraint, so the id itself is what
 * prevents two concurrent writes from creating duplicate documents for the
 * same user on the same day.
 */
function buildDailyLookId(userId: string, date: string): string {
  return `${userId}_${date}`;
}

export class DailyLooksRepository extends BaseRepository {
  /**
   * Upserts the daily look for (user_id, date) using a deterministic
   * document id instead of Firestore's random-id .add(). Two concurrent
   * calls for the same user/date converge on the same document — one
   * write wins, but no duplicate "current look" or history row is ever
   * created (the race that .add() with random ids could not prevent).
   */
  async create(
    input: Omit<DailyLook, 'daily_look_id' | 'feedback' | 'feedback_at' | 'created_at'> & { title?: string; scheme_items?: DailyLookItem[] },
  ): Promise<DailyLook> {
    const now = new Date().toISOString();
    const payload = { ...input, feedback: null, feedback_at: null, created_at: now };
    const id = buildDailyLookId(input.user_id, input.date);
    await this.db.collection(DAILY_LOOKS_COLLECTION).doc(id).set(payload);
    return { daily_look_id: id, ...payload };
  }

  async findById(dailyLookId: string): Promise<DailyLook | null> {
    const doc = await this.db.collection(DAILY_LOOKS_COLLECTION).doc(dailyLookId).get();
    if (!doc.exists) return null;
    return this.toEntity(doc.id, doc.data() as Record<string, unknown>);
  }

  async findByUser(userId: string, limit = 30): Promise<DailyLook[]> {
    const snap = await this.db
      .collection(DAILY_LOOKS_COLLECTION)
      .where('user_id', '==', userId)
      .orderBy('created_at', 'desc')
      .limit(limit)
      .get();
    return snap.docs.map((d) =>
      this.toEntity(d.id, d.data() as Record<string, unknown>),
    );
  }

  /**
   * Atomically sets feedback only when the current value is null.
   * Returns true if the write happened, false if feedback was already recorded.
   * This is the idempotency guard for Bug 2: repeated PATCH calls to the same
   * dailyLookId will not accumulate extra preference deltas.
   */
  async setFeedbackIfPending(dailyLookId: string, feedback: FeedbackValue): Promise<boolean> {
    const ref = this.db.collection(DAILY_LOOKS_COLLECTION).doc(dailyLookId);
    let written = false;

    await this.db.runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      if (!snap.exists) throw new Error(`Daily look ${dailyLookId} not found`);

      const current = (snap.data() as Record<string, unknown>).feedback;
      if (current !== null && current !== undefined) {
        written = false;
        return;
      }

      tx.update(ref, { feedback, feedback_at: new Date().toISOString() });
      written = true;
    });

    return written;
  }

  private toEntity(id: string, data: Record<string, unknown>): DailyLook {
    return {
      daily_look_id: id,
      user_id: String(data.user_id ?? ''),
      date: String(data.date ?? ''),
      scheme_id: String(data.scheme_id ?? ''),
      title: String(data.title ?? ''),
      occasion: String(data.occasion ?? ''),
      mood: String(data.mood ?? ''),
      weather_c: typeof data.weather_c === 'number' ? data.weather_c : null,
      city: String(data.city ?? ''),
      feedback: (data.feedback as FeedbackValue | null) ?? null,
      feedback_at: (data.feedback_at as string | null) ?? null,
      created_at: String(data.created_at ?? ''),
      scheme_items: Array.isArray(data.scheme_items) ? data.scheme_items as DailyLookItem[] : [],
    };
  }
}