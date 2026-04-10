'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import PageHeader from '@/app/components/shell/PageHeader';
import SectionBlock from '@/app/components/shared/SectionBlock';
import Tester2DControls from '@/app/components/tester2d/Tester2DControls';
import Tester2DMannequinSelector from '@/app/components/tester2d/Tester2DMannequinSelector';
import Tester2DStage from '@/app/components/tester2d/Tester2DStage';
import Tester2DWardrobePanel, { Tester2DWardrobeItem } from '@/app/components/tester2d/Tester2DWardrobePanel';
import { getTester2DMannequinById, Tester2DMannequin } from '@/app/config/tester2dMannequins';
import { resolveOverlayLayers, resolveSlotFromPieceType } from '@/app/services/Tester2DOverlayService';
import { getBestTester2DAssetForWardrobeItem } from '@/app/services/Tester2DAssetResolver';

interface BootstrapPiece {
  piece_id: string;
  name: string;
  piece_type: string;
  image_url?: string;
  approved_catalog_2d_url?: string | null;
  normalized_2d_preview_url?: string | null;
  raw_upload_image_url?: string | null;
  segmented_png_url?: string | null;
  image_assets?: {
    approved_catalog_2d_url?: string | null;
    normalized_2d_preview_url?: string | null;
    raw_upload_image_url?: string | null;
    segmented_png_url?: string | null;
  };
  render_layer?: number;
}

interface BootstrapPayload {
  pieces: BootstrapPiece[];
}

export default function DressTesterView() {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [pieces, setPieces] = useState<Tester2DWardrobeItem[]>([]);
  const [selectedMannequin, setSelectedMannequin] = useState<Tester2DMannequin['id']>('female');
  const [equipped, setEquipped] = useState<Partial<Record<'upper' | 'lower' | 'shoes' | 'accessory', Tester2DWardrobeItem & { render_layer?: number }>>>({});
  const [zoom, setZoom] = useState(1);
  const [showDebug, setShowDebug] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const mannequin = useMemo(() => getTester2DMannequinById(selectedMannequin), [selectedMannequin]);

  const refreshData = useCallback(async () => {
    setLoading(true);
    const response = await fetch('/api/dress-tester/bootstrap');
    const payload = (await response.json()) as BootstrapPayload;

    let unreliableCount = 0;
    const resolved = (payload.pieces || [])
      .map((piece) => {
        const resolvedAsset = getBestTester2DAssetForWardrobeItem(piece);
        if (!resolvedAsset.geometryReliable) unreliableCount += 1;

        return {
          piece_id: piece.piece_id,
          name: piece.name,
          piece_type: piece.piece_type,
          image_url: resolvedAsset.url,
          render_layer: piece.render_layer,
          assetSource: resolvedAsset.source,
          geometryReliable: resolvedAsset.geometryReliable,
        };
      })
      .filter((piece) => Boolean(piece.image_url));

    if (unreliableCount > 0) {
      setMessage(`${unreliableCount} peça(s) usam fallback sem preparo 2D; o fit pode ser limitado.`);
    } else {
      setMessage(null);
    }

    setPieces(resolved);
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

  const layers = useMemo(() => resolveOverlayLayers(mannequin, equipped), [mannequin, equipped]);

  const applyPiece = (piece: Tester2DWardrobeItem) => {
    if (!piece.geometryReliable) {
      setMessage('Essa peça não possui asset 2D aprovado/normalizado. Aplicação bloqueada para evitar fitting incorreto.');
      return;
    }

    const slot = resolveSlotFromPieceType(piece.piece_type);
    setSelectedCategory(slot);
    setMessage(null);
    setEquipped((prev) => ({ ...prev, [slot]: piece }));
  };

  if (loading) return <div className="p-6 text-sm uppercase tracking-[0.2em] text-white/70">Loading Tester 2D...</div>;

  return (
    <div className="space-y-4">
      <PageHeader title="Tester 2D" subtitle="Single studio workspace for mannequin-based outfit editing" />

      <SectionBlock title="Controls" subtitle="Select mannequin, adjust stage, and reset safely when switching avatars">
        <div className="space-y-3">
          <Tester2DMannequinSelector
            selectedId={selectedMannequin}
            onChange={(id) => {
              setSelectedMannequin(id);
              setEquipped({});
              setMessage('Outfit reset after mannequin switch (safe MVP behavior).');
            }}
          />
          <Tester2DControls
            zoom={zoom}
            onZoomIn={() => setZoom((prev) => Math.min(1.18, prev + 0.04))}
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

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <SectionBlock title="Editing Stage" subtitle="Centralized mannequin-first composition surface">
          <Tester2DStage mannequin={mannequin} layers={layers} zoom={zoom} showDebug={showDebug} selectedSlot={selectedCategory} />
        </SectionBlock>

        <SectionBlock title="Wardrobe 2D Library" subtitle="Click a piece to apply/replace its target slot immediately">
          <Tester2DWardrobePanel items={pieces} onApply={applyPiece} />
        </SectionBlock>
      </div>
    </div>
  );
}
