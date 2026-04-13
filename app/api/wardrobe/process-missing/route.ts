import { NextRequest, NextResponse } from 'next/server';
import { WardrobeImagePreparationService } from '@/app/lib/fashion-ai/services/WardrobeImagePreparationService';
import { WardrobeRepository } from '@/app/lib/fashion-ai/repositories/WardrobeRepository';
import { WardrobeFitProfile } from '@/app/lib/fashion-ai/types/wardrobe-fit';
import { readSession } from '@/app/lib/serverSession';

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
const MAX_LIMIT = 500;
const PAGE_SIZE = 200;

function evaluateMatchReasons(fitProfile?: WardrobeFitProfile, onlyMissing?: boolean): string[] {
  if (!fitProfile) return ['fitProfile_missing'];
  if (onlyMissing) return [];

  const reasons: string[] = [];
  if (!fitProfile.preparationStatus) reasons.push('preparationStatus_missing');
  if (!fitProfile.targetGender) reasons.push('targetGender_missing');
  if (!fitProfile.pieceType) reasons.push('pieceType_missing');
  return reasons;
}

function isAuthorized(request: NextRequest): boolean {
  const session = readSession(request);
  if (session?.sub?.trim()) return true;

  const configuredToken = process.env.WARDROBE_PROCESS_MISSING_TOKEN?.trim();
  if (!configuredToken) return false;

  const bearer = request.headers.get('authorization');
  const bearerPrefix = 'Bearer ';
  if (!bearer?.startsWith(bearerPrefix)) return false;
  return bearer.slice(bearerPrefix.length).trim() === configuredToken;
}

export async function POST(request: NextRequest) {
  console.info('[process-missing] request received');

  try {
    if (!isAuthorized(request)) {
      return NextResponse.json({ ok: false, error: 'UNAUTHORIZED' }, { status: 401 });
    }

    const body = (await request.json().catch(() => ({}))) as ProcessMissingRequest;
    const limit = Number.isFinite(body.limit)
      ? Math.min(MAX_LIMIT, Math.max(1, Number(body.limit)))
      : undefined;
    const dryRun = Boolean(body.dryRun);
    const onlyMissing = Boolean(body.onlyMissing);

    const selectedItems: Array<{ item: Awaited<ReturnType<typeof wardrobeRepository.listPage>>[number]; reasons: string[] }> = [];
    let scanned = 0;
    let matched = 0;
    let cursor: string | undefined;
    let hasMore = true;

    while (hasMore && (typeof limit !== 'number' || selectedItems.length < limit)) {
      const batchSize = typeof limit === 'number'
        ? Math.max(1, Math.min(PAGE_SIZE, limit - selectedItems.length))
        : PAGE_SIZE;
      const page = await wardrobeRepository.listPage({ limit: batchSize, startAfterId: cursor });
      if (!page.length) {
        hasMore = false;
        break;
      }
      cursor = page[page.length - 1].id;
      scanned += page.length;

      for (const item of page) {
        const reasons = evaluateMatchReasons(item.fitProfile, onlyMissing);
        if (!reasons.length) continue;
        matched += 1;
        selectedItems.push({ item, reasons });
        if (typeof limit === 'number' && selectedItems.length >= limit) break;
      }
    }

    console.info('[process-missing] found missing fitProfile items', {
      scanned,
      matched,
      selected: selectedItems.length,
      dryRun,
    });

    const results: ProcessMissingItemResult[] = [];
    let processed = 0;
    let failed = 0;

    for (const { item, reasons } of selectedItems) {
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
      scanned,
      matched,
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
