import { NextRequest, NextResponse } from 'next/server';
import { MannequinRepository } from '@/app/lib/fashion-ai/repositories/MannequinRepository';

const repo = new MannequinRepository();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const force = Boolean(body?.force);
    await repo.seedDefaults({ force });
    const profiles = await repo.list();
    return NextResponse.json({ ok: true, force, profiles });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : 'reseed_error' }, { status: 500 });
  }
}
