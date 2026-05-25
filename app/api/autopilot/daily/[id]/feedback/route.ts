import { PreferenceLearningService } from '@/app/backend/services/PreferenceLearningService';
import { DailyLooksRepository } from '@/app/backend/repositories/DailyLooksRepository';
import { ServiceError } from '@/app/backend/services/errors';
import { readSession } from '@/app/lib/serverSession';
import { NextRequest, NextResponse } from 'next/server';

const VALID_FEEDBACK = new Set(['loved', 'used', 'skipped']);

const preferenceLearningService = new PreferenceLearningService();
const dailyLooksRepo = new DailyLooksRepository();

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = readSession(request);
    if (!session?.sub) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = session.sub.trim();

    const { id: dailyLookId } = await params;
    if (!dailyLookId) {
      return NextResponse.json({ error: 'Missing daily look id' }, { status: 400 });
    }

    const body = await request.json();
    const feedback = String(body?.feedback ?? '').trim();
    if (!VALID_FEEDBACK.has(feedback)) {
      return NextResponse.json(
        { error: 'feedback must be one of: loved, used, skipped' },
        { status: 400 },
      );
    }

    // Verify the look belongs to the session user before touching preferences.
    const look = await dailyLooksRepo.findById(dailyLookId);
    if (!look) {
      return NextResponse.json({ error: 'Daily look not found' }, { status: 404 });
    }
    if (look.user_id !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const result = await preferenceLearningService.applyFeedback(
      userId,
      dailyLookId,
      feedback as 'loved' | 'used' | 'skipped',
    );

    if (!result.applied) {
      return NextResponse.json(
        { message: 'Feedback already recorded for this look', applied: false },
        { status: 200 },
      );
    }

    return NextResponse.json({ applied: true }, { status: 200 });
  } catch (error) {
    if (error instanceof ServiceError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error('[autopilot/feedback] unexpected error', error);
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}
