'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import PageHeader from '@/app/components/shell/PageHeader';
import SectionBlock from '@/app/components/shared/SectionBlock';
import Tester2DControls from '@/app/components/tester2d/Tester2DControls';
import Tester2DMannequinSelector from '@/app/components/tester2d/Tester2DMannequinSelector';
import Tester2DStage from '@/app/components/tester2d/Tester2DStage';
import Tester2DWardrobePanel, { Tester2DWardrobeItem } from '@/app/components/tester2d/Tester2DWardrobePanel';
import { Tester2DRenderService } from '@/app/lib/fashion-ai/services/Tester2DRenderService';
import { MannequinProfile } from '@/app/lib/fashion-ai/types/mannequin';
import { WardrobeFitProfile } from '@/app/lib/fashion-ai/types/wardrobe-fit';
import { isPieceCompatibleWithMannequin } from '@/app/lib/fashion-ai/utils/garment-compatibility';
import { getDevSessionToken } from '@/app/lib/devSession';

interface BootstrapPayload {
  mannequins: MannequinProfile[];
  pieces: Array<{ pieceId: string; name: string; imageUrl: string; fitProfile?: WardrobeFitProfile | null }>;
}

const renderService = new Tester2DRenderService();

export default function DressTesterView() {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [pieces, setPieces] = useState<Tester2DWardrobeItem[]>([]);
  const [mannequins, setMannequins] = useState<MannequinProfile[]>([]);
  const [selectedMannequin, setSelectedMannequin] = useState<'male_v1' | 'female_v1'>('female_v1');
  const [equipped, setEquipped] = useState<Partial<Record<WardrobeFitProfile['pieceType'], WardrobeFitProfile>>>({});
  const [zoom, setZoom] = useState(1);
  const [showDebug, setShowDebug] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [backfillRunning, setBackfillRunning] = useState(false);
  const [backfillSummary, setBackfillSummary] = useState<string | null>(null);
  const [hasDevSession] = useState(() => Boolean(getDevSessionToken()));
  const isDevToolsEnabled = process.env.NODE_ENV !== 'production' || hasDevSession;

  const mannequin = useMemo(
    () => mannequins.find((item) => item.id === selectedMannequin) ?? mannequins[0],
    [mannequins, selectedMannequin],
  );

  const refreshData = useCallback(async () => {
    setLoading(true);
    console.debug('[dress-tester] bootstrap fetch:start');
    const response = await fetch('/api/dress-tester/bootstrap');
    const payload = (await response.json()) as BootstrapPayload;
    console.debug('[dress-tester] bootstrap fetch:done', {
      status: response.status,
      mannequins: payload.mannequins?.length ?? 0,
      pieces: payload.pieces?.length ?? 0,
    });

    setMannequins(payload.mannequins ?? []);
    setPieces(
      (payload.pieces ?? []).map((piece) => {
        const fitProfile = piece.fitProfile ?? null;
        const labelReason = !fitProfile
          ? 'fitProfile_missing'
          : fitProfile.preparationStatus === 'pending'
            ? 'fitProfile_pending'
            : fitProfile.preparationStatus === 'processing'
              ? 'fitProfile_processing'
              : fitProfile.preparationStatus === 'ready'
                ? 'fitProfile_ready'
                : fitProfile.preparationStatus;

        console.debug('[dress-tester] item mapping', {
          pieceId: piece.pieceId,
          name: piece.name,
          hasFitProfile: Boolean(fitProfile),
          fitProfileStatus: fitProfile?.preparationStatus ?? 'missing',
          targetGender: fitProfile?.targetGender ?? 'fallback-unisex',
          labelReason,
        });

        return {
          pieceId: piece.pieceId,
          name: piece.name,
          imageUrl: piece.imageUrl,
          fitProfile,
        };
      }),
    );
    setLoading(false);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void refreshData().catch(() => {
        setMessage('Could not load wardrobe assets for Tester 2D.');
        setLoading(false);
      });
    }, 0);
    return () => window.clearTimeout(timer);
  }, [refreshData]);

  const layers = useMemo(() => {
    if (!mannequin) return [];
    return renderService.composeLayers({ mannequin, appliedPieces: Object.values(equipped) as WardrobeFitProfile[] });
  }, [mannequin, equipped]);

  const applyPiece = async (piece: Tester2DWardrobeItem) => {
    const fitProfile = piece.fitProfile;

    if (!fitProfile) {
      setMessage('This piece has no 2D preparation data yet.');
      return;
    }

    if (fitProfile.preparationStatus !== 'ready') {
      if (fitProfile.preparationStatus === 'preview_only') {
        setMessage('This piece is preview only and cannot be fitted yet.');
        return;
      }
      if (fitProfile.preparationStatus === 'processing' || fitProfile.preparationStatus === 'pending') {
        setMessage('This piece is still being prepared for 2D fitting.');
        return;
      }
      setMessage('This piece failed preparation and cannot be applied.');
      return;
    }

    if (!mannequin) return;
    if (!isPieceCompatibleWithMannequin(fitProfile, mannequin.id, mannequin)) {
      setMessage('This piece is not compatible with the selected mannequin.');
      return;
    }

    setSelectedCategory(fitProfile.pieceType);
    setMessage(null);
    setEquipped((prev) => ({ ...prev, [fitProfile.pieceType]: fitProfile }));
  };

  const processPieceNow = async (pieceId: string) => {
    console.debug('[dress-tester] process-now:start', { pieceId });
    const response = await fetch('/api/wardrobe/process-piece', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pieceId }),
    });
    const payload = await response.json().catch(() => null);
    console.debug('[dress-tester] process-now:done', {
      pieceId,
      status: response.status,
      payload,
    });
    if (!response.ok) {
      setMessage(`Process piece failed for ${pieceId}.`);
      return;
    }
    await refreshData();
  };

  const processMissingPieces = async () => {
    setBackfillRunning(true);
    setBackfillSummary(null);
    console.info('[dress-tester] process-missing:start');
    const response = await fetch('/api/wardrobe/process-missing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ limit: 50, dryRun: false, onlyMissing: false }),
    });
    const payload = await response.json().catch(() => null);
    console.info('[dress-tester] process-missing:done', { status: response.status, payload });
    setBackfillRunning(false);
    if (!response.ok || !payload?.ok) {
      setBackfillSummary('Process Missing Pieces failed. Check console logs for details.');
      return;
    }
    setBackfillSummary(`Processed ${payload.processed} · failed ${payload.failed} · matched ${payload.matched}.`);
    await refreshData();
  };

  if (loading) return <div className="p-6 text-sm uppercase tracking-[0.2em] text-white/70">Loading Tester 2D...</div>;
  if (!mannequin) return <div className="p-6 text-sm text-white/70">No mannequin profiles found.</div>;

  return (
    <div className="space-y-4">
      <PageHeader title="Tester 2D" subtitle="Production-oriented mannequin composition with prepared garment assets" />

      <SectionBlock title="Controls" subtitle="Select mannequin, adjust stage, and reset safely when switching avatars">
        <div className="space-y-3">
          <Tester2DMannequinSelector
            mannequins={mannequins}
            selectedId={selectedMannequin}
            onChange={(id) => {
              setSelectedMannequin(id);
              setEquipped({});
              setMessage('Outfit reset after mannequin switch (safe MVP behavior).');
            }}
          />
          <Tester2DControls
            zoom={zoom}
            onZoomIn={() => setZoom((prev) => Math.min(1.2, prev + 0.04))}
            onZoomOut={() => setZoom((prev) => Math.max(0.86, prev - 0.04))}
            onReset={() => {
              setEquipped({});
              setZoom(1);
            }}
            showDebug={showDebug}
            onToggleDebug={() => setShowDebug((prev) => !prev)}
          />
          {isDevToolsEnabled ? (
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="rounded-lg border border-amber-300/60 bg-amber-400/20 px-3 py-2 text-xs font-semibold text-amber-50 disabled:opacity-60"
                onClick={() => void processMissingPieces()}
                disabled={backfillRunning}
              >
                {backfillRunning ? 'Processing Missing Pieces...' : 'Process Missing Pieces'}
              </button>
              {backfillSummary ? <p className="text-xs text-amber-100">{backfillSummary}</p> : null}
            </div>
          ) : null}
          {message ? <p className="text-xs text-white/70">{message}</p> : null}
        </div>
      </SectionBlock>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
        <SectionBlock title="Editing Stage" subtitle="Stable, centered, geometry-aware fitting stage">
          <Tester2DStage mannequin={mannequin} layers={layers} zoom={zoom} showDebug={showDebug} selectedSlot={selectedCategory} />
        </SectionBlock>

        <SectionBlock title="Wardrobe 2D Library" subtitle="Prepared pipeline status and mannequin-compatible fitting">
          <Tester2DWardrobePanel items={pieces} onApply={applyPiece} onProcessNow={processPieceNow} showProcessingActions={isDevToolsEnabled} />
        </SectionBlock>
      </div>
    </div>
  );
}
