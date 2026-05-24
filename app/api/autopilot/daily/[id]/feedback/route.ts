import { AutopilotController } from '@/app/backend/controllers/AutopilotController';
import { ServiceError } from '@/app/backend/services/errors';
import { DailyLookFeedback } from '@/app/backend/types/entities';
import { NextRequest, NextResponse } from 'next/server';
import { readSession } from '@/app/lib/serverSession';

const controller = new AutopilotController();
const VALID_FEEDBACKS = new Set<DailyLookFeedback>(['loved', 'used', 'skipped']);

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = readSession(request);
    if (!session?.sub) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'Daily look ID is required' }, { status: 400 });
    }

    const body = await request.json();
    const feedback = String(body.feedback ?? '').trim() as DailyLookFeedback;

    if (!VALID_FEEDBACKS.has(feedback)) {
      return NextResponse.json(
        { error: `Invalid feedback. Must be one of: ${[...VALID_FEEDBACKS].join(', ')}` },
        { status: 400 },
      );
    }

    const result = await controller.applyFeedback(session.sub, id, feedback);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    if (error instanceof ServiceError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error('[autopilot/daily/feedback] unexpected error', error);
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}
