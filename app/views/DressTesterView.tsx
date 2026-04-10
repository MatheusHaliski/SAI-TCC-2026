'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import PageHeader from '@/app/components/shell/PageHeader';
import SectionBlock from '@/app/components/shared/SectionBlock';
import MannequinStage from '@/app/components/dress-tester/MannequinStage';
import PieceGrid from '@/app/components/dress-tester/PieceGrid';
import MannequinSelector from '@/app/components/dress-tester/MannequinSelector';
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
      void refreshData().catch(() => {
        setMessage('Unable to load tester assets.');
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
    setActiveCategory,
    wearPiece,
  } = useOutfitStateManager({ mannequin, pieces });

  const saveOutfit = async () => {
    if (!mannequin) return;
    setSaving(true);
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

  if (loading) return <div className="p-6 text-sm uppercase tracking-[0.2em] text-white/70">Loading dress tester...</div>;
  if (!mannequin) return <div className="p-6 text-sm uppercase tracking-[0.2em] text-white/70">Select a mannequin to start.</div>;

  return (
    <div className="space-y-4">
      <PageHeader title="Tester 2D" subtitle="Unified outfit editor powered by transparent clothing overlays" />

      <SectionBlock title="Mannequin Selector" subtitle="Toggle male/female mannequins sourced from external assets">
        <MannequinSelector
          mannequins={mannequins}
          selectedMannequinId={mannequin.mannequin_id}
          selectedGender={selectedGender}
          resetOnSwitch={resetOnSwitch}
          onGenderChange={setSelectedGender}
          onSelectMannequin={(item) => {
            setSelectedGender(item.gender as DressTesterGender);
            setSelectedMannequinId(item.mannequin_id);
            if (resetOnSwitch) resetLook(item);
          }}
          onToggleReset={() => setResetOnSwitch((prev) => !prev)}
        />
      </SectionBlock>

      <SectionBlock title="Outfit Editor" subtitle="Single composition view with category slots and layering controls">
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
          <MannequinStage mannequin={mannequin} layers={resolvedLayers} highlightedType={activeCategory} />

          <div className="space-y-3 rounded-2xl border border-white/20 bg-black/20 p-3">
            <div className="flex flex-wrap gap-2">
              {DRESS_TESTER_CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category as DressTesterCategory)}
                  className={`rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.18em] ${activeCategory === category ? 'border-white bg-white text-black' : 'border-white/25 text-white'}`}
                >
                  {category}
                </button>
              ))}
            </div>

            <PieceGrid pieces={availablePieces} selectedPieceId={selection[activeCategory]} onSelect={wearPiece} />

            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => removeFromCategory(activeCategory)} className="rounded-xl border border-white/30 bg-black/25 px-3 py-2 text-xs uppercase tracking-[0.2em] text-white">Remove slot</button>
              <button onClick={() => resetLook()} className="rounded-xl border border-white/30 bg-black/25 px-3 py-2 text-xs uppercase tracking-[0.2em] text-white">Reset outfit</button>
              <button onClick={saveOutfit} disabled={saving} className="col-span-2 rounded-xl border border-white bg-white px-3 py-2 text-xs uppercase tracking-[0.2em] text-black disabled:opacity-60">{saving ? 'Saving...' : 'Save look'}</button>
            </div>

            {message ? <p className="text-xs text-white/70">{message}</p> : null}
          </div>
        </div>
      </SectionBlock>
    </div>
  );
}
