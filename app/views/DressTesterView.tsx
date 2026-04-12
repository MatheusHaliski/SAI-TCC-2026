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

  const mannequin = useMemo(
    () => mannequins.find((item) => item.id === selectedMannequin) ?? mannequins[0],
    [mannequins, selectedMannequin],
  );

  const refreshData = useCallback(async () => {
    setLoading(true);
    const response = await fetch('/api/dress-tester/bootstrap');
    const payload = (await response.json()) as BootstrapPayload;

    setMannequins(payload.mannequins ?? []);
    setPieces(
      (payload.pieces ?? []).map((piece) => ({
        pieceId: piece.pieceId,
        name: piece.name,
        imageUrl: piece.imageUrl,
        fitProfile: piece.fitProfile ?? null,
      })),
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
          {message ? <p className="text-xs text-white/70">{message}</p> : null}
        </div>
      </SectionBlock>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
        <SectionBlock title="Editing Stage" subtitle="Stable, centered, geometry-aware fitting stage">
          <Tester2DStage mannequin={mannequin} layers={layers} zoom={zoom} showDebug={showDebug} selectedSlot={selectedCategory} />
        </SectionBlock>

        <SectionBlock title="Wardrobe 2D Library" subtitle="Prepared pipeline status and mannequin-compatible fitting">
          <Tester2DWardrobePanel items={pieces} onApply={applyPiece} />
        </SectionBlock>
      </div>
    </div>
  );
}
