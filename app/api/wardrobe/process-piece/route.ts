import { NextResponse } from 'next/server';
import { WardrobeImagePreparationService } from '@/app/lib/fashion-ai/services/WardrobeImagePreparationService';

const preparationService = new WardrobeImagePreparationService();

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as { pieceId?: string };
    const pieceId = String(body.pieceId ?? '').trim();

    if (!pieceId) {
      return NextResponse.json({ ok: false, error: 'pieceId is required.' }, { status: 400 });
    }

    const fitProfile = await preparationService.processPieceForTester2D(pieceId);

    return NextResponse.json({
      ok: true,
      pieceId,
      preparationStatus: fitProfile.preparationStatus,
      validationWarnings: fitProfile.validationWarnings ?? [],
      fitProfile,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : 'Unexpected preparation error',
      },
      { status: 500 },
    );
  }
}
