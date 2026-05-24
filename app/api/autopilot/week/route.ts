import { AutopilotController } from '@/app/backend/controllers/AutopilotController';
import { ServiceError } from '@/app/backend/services/errors';
import { NextRequest, NextResponse } from 'next/server';
import { readSession } from '@/app/lib/serverSession';

const controller = new AutopilotController();

export async function POST(request: NextRequest) {
  try {
    const session = readSession(request);
    if (!session?.sub) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const week_start = String(body.week_start ?? '').trim();
    const city = String(body.city ?? '').trim();

    if (!week_start || !/^\d{4}-\d{2}-\d{2}$/.test(week_start)) {
      return NextResponse.json({ error: 'week_start must be a date in YYYY-MM-DD format' }, { status: 400 });
    }

    if (!Array.isArray(body.days) || !body.days.length) {
      return NextResponse.json({ error: 'days array is required and must not be empty' }, { status: 400 });
    }

    const result = await controller.generateWeekPlan(
      session.sub,
      { week_start, days: body.days },
      city || 'São Paulo',
    );

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    if (error instanceof ServiceError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error('[autopilot/week] unexpected error', error);
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}
