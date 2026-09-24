import { AutopilotController } from '@/app/backend/controllers/AutopilotController';
import { ServiceError } from '@/app/backend/services/errors';
import { Occasion, Mood } from '@/app/backend/types/entities';
import { NextRequest, NextResponse } from 'next/server';
import { readSession } from '@/app/lib/serverSession';

export async function GET(request: NextRequest) {
  try {
    const session = readSession(request);
    if (!session?.sub) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const limitParam = request.nextUrl.searchParams.get('limit');
    const limit = limitParam ? Math.min(100, Math.max(1, parseInt(limitParam, 10))) : 30;
    const controller = new AutopilotController();
    const looks = await controller.getHistory(session.sub, limit);
    return NextResponse.json({ looks }, { status: 200 });
  } catch (error) {
    if (error instanceof ServiceError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}

const controller = new AutopilotController();

const VALID_OCCASIONS = new Set<Occasion>(['trabalho', 'casual', 'festa', 'academia', 'evento']);
const VALID_MOODS = new Set<Mood>(['disposto', 'cansado', 'confiante', 'criativo']);

export async function POST(request: NextRequest) {
  try {
    const session = readSession(request);
    if (!session?.sub) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const occasion = String(body.occasion ?? '').trim() as Occasion;
    const mood = String(body.mood ?? '').trim() as Mood;
    const city = String(body.city ?? '').trim();

    if (!VALID_OCCASIONS.has(occasion)) {
      return NextResponse.json(
        { error: `Invalid occasion. Must be one of: ${[...VALID_OCCASIONS].join(', ')}` },
        { status: 400 },
      );
    }

    if (!VALID_MOODS.has(mood)) {
      return NextResponse.json(
        { error: `Invalid mood. Must be one of: ${[...VALID_MOODS].join(', ')}` },
        { status: 400 },
      );
    }

    if (!city) {
      return NextResponse.json({ error: 'city is required' }, { status: 400 });
    }

    const excludeSchemeIds = Array.isArray(body.exclude_scheme_ids)
      ? body.exclude_scheme_ids.map(String)
      : [];

    const result = await controller.generateDaily(session.sub, {
      occasion,
      mood,
      city,
      exclude_scheme_ids: excludeSchemeIds,
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    if (error instanceof ServiceError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error('[autopilot/daily] unexpected error', error);
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}
