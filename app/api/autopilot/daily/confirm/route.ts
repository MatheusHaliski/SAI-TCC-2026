import { AutopilotController } from '@/app/backend/controllers/AutopilotController';
import { ServiceError } from '@/app/backend/services/errors';
import { Mood, Occasion } from '@/app/backend/types/entities';
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
    const scheme_id = String(body.scheme_id ?? '').trim();
    const occasion = String(body.occasion ?? '').trim() as Occasion;
    const mood = String(body.mood ?? '').trim() as Mood;
    const weather = body.weather;

    if (!scheme_id || !occasion || !mood) {
      return NextResponse.json({ error: 'scheme_id, occasion, and mood are required' }, { status: 400 });
    }

    if (!weather || weather.temp_c == null || !weather.condition) {
      return NextResponse.json({ error: 'weather with temp_c and condition is required' }, { status: 400 });
    }

    const result = await controller.confirmDailyLook(session.sub, {
      scheme_id,
      occasion,
      mood,
      weather: {
        temp_c: Number(weather.temp_c),
        condition: String(weather.condition),
        city: String(weather.city ?? ''),
      },
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    if (error instanceof ServiceError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error('[autopilot/daily/confirm] unexpected error', error);
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}
