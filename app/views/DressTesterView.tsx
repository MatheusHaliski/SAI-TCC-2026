'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import PageHeader from '@/app/components/shell/PageHeader';
import SectionBlock from '@/app/components/shared/SectionBlock';
import CategorySelector from '@/app/components/dress-tester/CategorySelector';
import MannequinStage from '@/app/components/dress-tester/MannequinStage';
import PieceGrid from '@/app/components/dress-tester/PieceGrid';
import AdminAssetStudio from '@/app/components/dress-tester/AdminAssetStudio';
import MannequinSelector from '@/app/components/dress-tester/MannequinSelector';
import CurrentLookPanel from '@/app/components/dress-tester/CurrentLookPanel';
import {
  createEmptySelection,
  DRESS_TESTER_CATEGORIES,
  DressTesterCategory,
  DressTesterGender,
  Mannequin2D,
  WardrobePiece2D,
} from '@/app/lib/dress-tester-models';
import { useOutfitStateManager } from '@/app/hooks/useOutfitStateManager';

interface BootstrapPayload {
  mannequins: Mannequin2D[];
  pieces: WardrobePiece2D[];
}

export default function DressTesterView() {
  const [loading, setLoading] = useState(true);
  const [mannequins, setMannequins] = useState<Mannequin2D[]>([]);
  const [pieces, setPieces] = useState<WardrobePiece2D[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [selectedGender, setSelectedGender] = useState<DressTesterGender>('female');
  const [selectedMannequinId, setSelectedMannequinId] = useState<string | null>(null);
  const [resetOnSwitch, setResetOnSwitch] = useState(true);
  const [showGrid, setShowGrid] = useState(false);

  const mannequin = useMemo(
    () => mannequins.find((item) => item.mannequin_id === selectedMannequinId) ?? mannequins.find((item) => item.gender === selectedGender) ?? mannequins[0] ?? null,
    [mannequins, selectedGender, selectedMannequinId],
  );

  const refreshData = useCallback(async () => {
    setLoading(true);
    const response = await fetch('/api/dress-tester/bootstrap');
    const payload = (await response.json()) as BootstrapPayload;
    setMannequins(payload.mannequins || []);
    setPieces(payload.pieces || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      refreshData().catch(() => {
        setMessage('Unable to load dress tester assets.');
        setLoading(false);
      });
    }, 0);

    return () => window.clearTimeout(timer);
  }, [refreshData]);

  const {
    activeCategory,
    availablePieces,
    removeFromCategory,
    resetLook,
    resolvedLayers,
    selection,
    selectedPieces,
    setActiveCategory,
    wearPiece,
  } = useOutfitStateManager({ mannequin, pieces });

  const saveOutfit = async () => {
    if (!mannequin) return;
    setSaving(true);
    setMessage(null);
    const response = await fetch('/api/dress-tester/outfits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mannequin_id: mannequin.mannequin_id,
        pose_code: mannequin.pose_code,
        selection: { ...createEmptySelection(mannequin.mannequin_id, mannequin.pose_code), ...selection },
      }),
    });
    setSaving(false);
    setMessage(response.ok ? 'Outfit saved.' : 'Unable to save outfit.');
  };

  const selectedPiecesByCategory = useMemo(
    () =>
      DRESS_TESTER_CATEGORIES.reduce<Partial<Record<DressTesterCategory, WardrobePiece2D>>>((acc, category) => {
        const selectedId = selection[category];
        if (!selectedId) return acc;
        const piece = selectedPieces.find((item) => item.piece_id === selectedId);
        if (piece) acc[category] = piece;
        return acc;
      }, {}),
    [selection, selectedPieces],
  );

  if (loading) {
    return <div className="p-6 text-sm uppercase tracking-[0.2em] text-white/70">Loading dress tester...</div>;
  }

  if (!mannequin) {
    return <div className="p-6 text-sm uppercase tracking-[0.2em] text-white/70">Select a mannequin to start.</div>;
  }

  return (
    <div className="space-y-4 pb-72 xl:pb-0">
      <PageHeader title="Dress Tester" subtitle="Premium 2D mannequin layering studio" />

      <SectionBlock title="Mannequin Selector" subtitle="Choose your base model and pose before styling">
        <MannequinSelector
          mannequins={mannequins}
          selectedMannequinId={mannequin.mannequin_id}
          selectedGender={selectedGender}
          resetOnSwitch={resetOnSwitch}
          onGenderChange={setSelectedGender}
          onSelectMannequin={(item) => {
            setSelectedGender(item.gender as DressTesterGender);
            setSelectedMannequinId(item.mannequin_id);
            if (resetOnSwitch) {
              resetLook(item);
            }
          }}
          onToggleReset={() => setResetOnSwitch((prev) => !prev)}
        />
      </SectionBlock>

      <div className="grid gap-4 xl:grid-cols-[220px_minmax(0,1fr)_360px]">
        <SectionBlock title="Categories" subtitle="Tap to style instantly" className="h-fit">
          <CategorySelector activeCategory={activeCategory} onSelect={setActiveCategory} />
          <div className="mt-3 grid gap-2">
            <button onClick={() => removeFromCategory(activeCategory)} className="rounded-xl border border-white/30 bg-black/25 px-3 py-2 text-xs uppercase tracking-[0.2em] text-white">
              Remove from category
            </button>
            <button onClick={resetLook} className="rounded-xl border border-white/30 bg-black/25 px-3 py-2 text-xs uppercase tracking-[0.2em] text-white">
              Reset look
            </button>
            <button onClick={saveOutfit} disabled={saving} className="rounded-xl border border-white bg-white px-3 py-2 text-xs uppercase tracking-[0.2em] text-black disabled:opacity-60">
              {saving ? 'Saving...' : 'Save outfit'}
            </button>
            <button onClick={() => setMessage('Layers already arranged from render_layer metadata.')} className="rounded-xl border border-white/30 bg-black/25 px-3 py-2 text-xs uppercase tracking-[0.2em] text-white">
              Auto arrange layers
            </button>
            <button onClick={() => setShowGrid((prev) => !prev)} className="rounded-xl border border-white/30 bg-black/25 px-3 py-2 text-xs uppercase tracking-[0.2em] text-white">
              Toggle fit preview grid
            </button>
          </div>
          {message ? <p className="mt-3 text-xs text-white/70">{message}</p> : null}
        </SectionBlock>

        <SectionBlock title={mannequin.name} subtitle="Layered transparent PNG renderer">
          <MannequinStage mannequin={mannequin} layers={resolvedLayers} showGrid={showGrid} highlightedType={activeCategory} />
        </SectionBlock>

        <SectionBlock title="Current Look" subtitle="Interactive slot management" className="hidden xl:block">
          <CurrentLookPanel selectedPiecesByCategory={selectedPiecesByCategory} onRemove={removeFromCategory} />
        </SectionBlock>
      </div>

      <SectionBlock title="Your Wardrobe" subtitle={`Category: ${activeCategory}`}>
        <PieceGrid pieces={availablePieces} selectedPieceId={selection[activeCategory]} onSelect={wearPiece} />
      </SectionBlock>

      <div className="fixed inset-x-2 bottom-2 z-40 rounded-2xl border border-white/25 bg-black/85 p-3 shadow-2xl xl:hidden">
        <p className="mb-2 text-xs uppercase tracking-[0.2em] text-white/60">{activeCategory} pieces</p>
        <div className="max-h-56 overflow-y-auto">
          <PieceGrid pieces={availablePieces} selectedPieceId={selection[activeCategory]} onSelect={wearPiece} />
        </div>
      </div>

      <SectionBlock
        title="Backoffice · Premium asset pipeline"
        subtitle="Create mannequin entries, register aligned PNG assets, set render order + compatibility, and validate before publish."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <AdminAssetStudio onCreated={refreshData} />
          <div className="rounded-3xl border border-white/20 bg-black/25 p-4 text-sm text-white/75">
            <p className="mb-2 text-xs uppercase tracking-[0.2em] text-white/60">Asset standards</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>Use one fixed mannequin template, canvas size, and pose.</li>
              <li>Export every item as transparent PNG with identical dimensions.</li>
              <li>Assign render_layer for deterministic compositing.</li>
              <li>Use lifecycle: draft → asset_pending → asset_review → ready_for_tester → published.</li>
              <li>Preview before publishing to ensure body alignment and lighting coherence.</li>
            </ul>
          </div>
        </div>
      </SectionBlock>
    </div>
  );
}
