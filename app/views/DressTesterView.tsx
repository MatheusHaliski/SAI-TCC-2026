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
import { WardrobeFitProfile, WardrobePieceType } from '@/app/lib/fashion-ai/types/wardrobe-fit';
import { isPieceCompatibleWithMannequin } from '@/app/lib/fashion-ai/utils/garment-compatibility';
import { getDevSessionToken } from '@/app/lib/devSession';
import AdminAssetStudio from '@/app/components/dress-tester/AdminAssetStudio';
import { TesterFitOutput } from '@/app/lib/ai/providers/types';

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
  const [aiInstructions, setAiInstructions] = useState<Record<string, TesterFitOutput>>({});
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

  const PREVIEW_BBOX: Record<WardrobePieceType, { x: number; y: number; w: number; h: number }> = {
    top: { x: 0.10, y: 0.08, w: 0.80, h: 0.84 },
    bottom: { x: 0.12, y: 0.06, w: 0.76, h: 0.88 },
    shoes: { x: 0.10, y: 0.10, w: 0.80, h: 0.80 },
    full_body: { x: 0.10, y: 0.04, w: 0.80, h: 0.92 },
    accessory: { x: 0.15, y: 0.12, w: 0.70, h: 0.76 },
  };

  const applyPiece = async (piece: Tester2DWardrobeItem) => {
    if (!mannequin) return;

    const rawFitProfile = piece.fitProfile;
    let effectiveFitProfile: WardrobeFitProfile;

    const isFullyCompatible =
      rawFitProfile?.preparationStatus === 'ready' &&
      Boolean(rawFitProfile.preparedAssetUrl) &&
      isPieceCompatibleWithMannequin(rawFitProfile, mannequin.id, mannequin);

    if (isFullyCompatible && rawFitProfile) {
      effectiveFitProfile = rawFitProfile;
    } else if (piece.imageUrl) {
      const pieceType: WardrobePieceType = rawFitProfile?.pieceType ?? 'top';

      effectiveFitProfile = {
        pieceType,
        targetGender: 'unisex',
        preparationStatus: 'ready',
        originalImageUrl: piece.imageUrl,
        preparedAssetUrl: piece.imageUrl,
        preparedMaskUrl: null,
        compatibleMannequins: ['male_v1', 'female_v1'],
        fitMode: 'overlay',
        normalizedBBox: PREVIEW_BBOX[pieceType],
        garmentAnchors: null,
        validationWarnings: ['preview_mode'],
        preparationError: null,
        preparedAt: null,
        updatedAt: new Date().toISOString(),
      };
      setMessage('Preview mode: showing approximate fit. Run "Process Missing Pieces" for precision.');
    } else {
      setMessage('This piece has no image available.');
      return;
    }

    setSelectedCategory(effectiveFitProfile.pieceType);
    if (!effectiveFitProfile.validationWarnings?.includes('preview_mode')) setMessage(null);
    setEquipped((prev) => ({ ...prev, [effectiveFitProfile.pieceType]: effectiveFitProfile }));

    if (!aiInstructions[piece.pieceId]) {
      fetch('/api/ai/fashion/tester-fit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pieceName: piece.name,
          category: effectiveFitProfile.pieceType,
          bodyRegion: effectiveFitProfile.pieceType,
        }),
      })
        .then((res) => res.json())
        .then((payload) => {
          if (payload.ok && payload.data) {
            setAiInstructions((prev) => ({ ...prev, [piece.pieceId]: payload.data }));
          }
        })
        .catch((err) => console.error('AI Fit Error', err));
    }
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

      <SectionBlock title="AI Fit Instructions" subtitle="AI-generated suggestions for placement and fit">
        {Object.entries(equipped).map(([slot, profile]) => {
          if (!profile) return null;
          const pieceId = pieces.find((p) => p.fitProfile === profile)?.pieceId;
          const instructions = pieceId ? aiInstructions[pieceId] : null;

          return (
            <div key={slot} className="mb-2 text-sm text-white/80 bg-white/10 p-3 rounded-lg border border-white/20">
              <p className="font-bold text-white mb-2 uppercase tracking-wide text-[11px]">{slot} SLOT</p>
              {instructions ? (
                <ul className="list-disc pl-4 space-y-1">
                  <li><span className="font-semibold text-fuchsia-300">Target Region:</span> {instructions.targetBodyRegion}</li>
                  <li><span className="font-semibold text-fuchsia-300">Suggested Layer:</span> {instructions.suggestedLayer}</li>
                  <li><span className="font-semibold text-fuchsia-300">Fit Type:</span> {instructions.fitType}</li>
                  <li><span className="font-semibold text-fuchsia-300">Alignment:</span> {instructions.alignmentHint}</li>
                  <li><span className="font-semibold text-fuchsia-300">Scale:</span> {instructions.scaleHint}</li>
                  {instructions.warnings && instructions.warnings.length > 0 && (
                    <li className="text-amber-400">
                      <span className="font-semibold">Warnings:</span> {instructions.warnings.join(', ')}
                    </li>
                  )}
                </ul>
              ) : (
                <p className="text-white/50 italic text-xs">Generating AI Fit instructions...</p>
              )}
            </div>
          );
        })}
        {Object.values(equipped).length === 0 && (
          <p className="text-white/50 text-xs">Equip a piece to see AI fit instructions.</p>
        )}
      </SectionBlock>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
        <SectionBlock title="Editing Stage" subtitle="Stable, centered, geometry-aware fitting stage">
          <Tester2DStage mannequin={mannequin} layers={layers} zoom={zoom} showDebug={showDebug} selectedSlot={selectedCategory} />
        </SectionBlock>

        <SectionBlock title="Wardrobe 2D Library" subtitle="Prepared pipeline status and mannequin-compatible fitting">
          <Tester2DWardrobePanel items={pieces} onApply={applyPiece} />
        </SectionBlock>
      </div>

      {isDevToolsEnabled ? (
        <SectionBlock title="Admin Asset Studio" subtitle="Create mannequins, upload piece metadata, and calibrate torso quads">
          <AdminAssetStudio
            onCreated={refreshData}
            wardrobeItems={pieces.map((p) => ({ pieceId: p.pieceId, name: p.name, imageUrl: p.imageUrl }))}
          />
        </SectionBlock>
      ) : null}
    </div>
  );
}
