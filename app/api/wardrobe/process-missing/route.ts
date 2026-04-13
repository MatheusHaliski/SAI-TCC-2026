import { NextResponse } from 'next/server';
import { WardrobeImagePreparationService } from '@/app/lib/fashion-ai/services/WardrobeImagePreparationService';
import { WardrobeRepository } from '@/app/lib/fashion-ai/repositories/WardrobeRepository';
import { WardrobeFitProfile } from '@/app/lib/fashion-ai/types/wardrobe-fit';

type ProcessMissingRequest = {
  limit?: number;
  dryRun?: boolean;
  onlyMissing?: boolean;
};

type ProcessMissingItemResult = {
  pieceId: string;
  name: string;
  hadFitProfile: boolean;
  matchReason: string[];
  result: 'dry_run' | 'processed' | 'failed';
  inferredPieceType: WardrobeFitProfile['pieceType'] | null;
  inferredTargetGender: WardrobeFitProfile['targetGender'] | null;
  newPreparationStatus: WardrobeFitProfile['preparationStatus'] | null;
  error?: string;
};

const wardrobeRepository = new WardrobeRepository();
const preparationService = new WardrobeImagePreparationService();

function evaluateMatchReasons(fitProfile?: WardrobeFitProfile, onlyMissing?: boolean): string[] {
  if (!fitProfile) return ['fitProfile_missing'];
  if (onlyMissing) return [];

  const reasons: string[] = [];
  if (!fitProfile.preparationStatus) reasons.push('preparationStatus_missing');
  if (!fitProfile.targetGender) reasons.push('targetGender_missing');
  if (!fitProfile.pieceType) reasons.push('pieceType_missing');
  return reasons;
}

export async function POST(request: Request) {
  console.info('[process-missing] request received');

  try {
    const body = (await request.json().catch(() => ({}))) as ProcessMissingRequest;
    const limit = Number.isFinite(body.limit) ? Math.max(1, Number(body.limit)) : undefined;
    const dryRun = Boolean(body.dryRun);
    const onlyMissing = Boolean(body.onlyMissing);

    console.info('[process-missing] loading wardrobe items', { limit: limit ?? null, dryRun, onlyMissing });
    const allItems = await wardrobeRepository.listAll();

    const matchedItems = allItems
      .map((item) => ({
        item,
        reasons: evaluateMatchReasons(item.fitProfile, onlyMissing),
      }))
      .filter((entry) => entry.reasons.length > 0);

    const limited = typeof limit === 'number' ? matchedItems.slice(0, limit) : matchedItems;

    console.info('[process-missing] found missing fitProfile items', {
      scanned: allItems.length,
      matched: matchedItems.length,
      selected: limited.length,
      dryRun,
    });

    const results: ProcessMissingItemResult[] = [];
    let processed = 0;
    let failed = 0;

    for (const { item, reasons } of limited) {
      console.info('[process-missing] processing item', {
        pieceId: item.id,
        name: item.name,
        reason: reasons.join(','),
      });

      if (dryRun) {
        results.push({
          pieceId: item.id,
          name: item.name,
          hadFitProfile: Boolean(item.fitProfile),
          matchReason: reasons,
          result: 'dry_run',
          inferredPieceType: item.fitProfile?.pieceType ?? null,
          inferredTargetGender: item.fitProfile?.targetGender ?? null,
          newPreparationStatus: item.fitProfile?.preparationStatus ?? null,
        });
        continue;
      }

      try {
        const { debug } = await preparationService.preparePieceForTester2D(item.id);
        processed += 1;
        console.info('[process-missing] success', {
          pieceId: item.id,
          name: item.name,
          reason: reasons.join(','),
          resultingStatus: debug.newPreparationStatus,
        });

        results.push({
          pieceId: item.id,
          name: item.name,
          hadFitProfile: Boolean(item.fitProfile),
          matchReason: reasons,
          result: 'processed',
          inferredPieceType: debug.inferredPieceType,
          inferredTargetGender: debug.inferredTargetGender,
          newPreparationStatus: debug.newPreparationStatus,
        });
      } catch (error) {
        failed += 1;
        const message = error instanceof Error ? error.message : 'unknown_error';
        console.error('[process-missing] failed', {
          pieceId: item.id,
          name: item.name,
          reason: reasons.join(','),
          resultingStatus: 'failed',
          error: message,
        });

        results.push({
          pieceId: item.id,
          name: item.name,
          hadFitProfile: Boolean(item.fitProfile),
          matchReason: reasons,
          result: 'failed',
          inferredPieceType: null,
          inferredTargetGender: null,
          newPreparationStatus: null,
          error: message,
        });
      }
    }

    return NextResponse.json({
      ok: true,
      scanned: allItems.length,
      matched: matchedItems.length,
      processed,
      failed,
      dryRun,
      items: results,
    });
  } catch (error) {
    console.error('[process-missing] failed', {
      error: error instanceof Error ? error.message : 'unknown_error',
    });

    return NextResponse.json({ ok: false, error: 'PROCESS_MISSING_UNEXPECTED_ERROR' }, { status: 500 });
  }
}
