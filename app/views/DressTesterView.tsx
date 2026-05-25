'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import PageHeader from '@/app/components/shell/PageHeader';
import SectionBlock from '@/app/components/shared/SectionBlock';
import Tester2DMannequinSelector from '@/app/components/tester2d/Tester2DMannequinSelector';
import OutfitSlotsPanel from '@/app/components/tester2d/OutfitSlotsPanel';
import Image from 'next/image';
import Tester2DWardrobePanel, { type OutfitSlot, type Tester2DWardrobeItem } from '@/app/components/tester2d/Tester2DWardrobePanel';
import { MannequinProfile } from '@/app/lib/fashion-ai/types/mannequin';

interface BootstrapPayload {
  mannequins: MannequinProfile[];
  pieces: Array<{
    pieceId: string;
    name: string;
    imageUrl: string;
    category?: 'tops' | 'bottoms' | 'full-body' | 'shoes' | 'accessory';
    slotType?: OutfitSlot;
    tryOn2dResultUrl?: string | null;
  }>;
}

type Outfit = Partial<Record<OutfitSlot, Tester2DWardrobeItem>>;

const SLOT_ORDER: OutfitSlot[] = ['upper', 'lower', 'shoes', 'accessory'];

function buildOutfitCacheKey(mannequinId: string, outfit: Outfit): string {
  return mannequinId + ':' + SLOT_ORDER.map((s) => outfit[s]?.pieceId ?? '').join('|');
}

export default function DressTesterView() {
  const [loading, setLoading] = useState(true);
  const [pieces, setPieces] = useState<Tester2DWardrobeItem[]>([]);
  const [mannequins, setMannequins] = useState<MannequinProfile[]>([]);
  const [selectedMannequin, setSelectedMannequin] = useState<'male_v1' | 'female_v1'>('female_v1');
  const [outfit, setOutfit] = useState<Outfit>({});
  const [activeSlot, setActiveSlot] = useState<OutfitSlot>('upper');
  const [processing, setProcessing] = useState(false);
  const [stageImageUrl, setStageImageUrl] = useState('');
  const [stageError, setStageError] = useState<string | null>(null);
  const [outfitCache, setOutfitCache] = useState<Record<string, string>>({});

  const searchParams = useSearchParams();

  const mannequin = useMemo(() => mannequins.find((m) => m.id === selectedMannequin) ?? mannequins[0], [mannequins, selectedMannequin]);

  const mannequinImageAbsoluteUrl = useMemo(() => {
    if (!mannequin?.baseImageUrl) return '';
    if (/^https?:\/\//i.test(mannequin.baseImageUrl)) return mannequin.baseImageUrl;
    if (typeof window === 'undefined') return mannequin.baseImageUrl;
    return new URL(mannequin.baseImageUrl, window.location.origin).toString();
  }, [mannequin]);

  const refreshData = useCallback(async () => {
    setLoading(true);
    const response = await fetch('/api/dress-tester/bootstrap');
    const payload = (await response.json()) as BootstrapPayload;
    setMannequins(payload.mannequins ?? []);
    const mapped = (payload.pieces ?? []).map((piece) => ({
      pieceId: piece.pieceId,
      name: piece.name,
      imageUrl: piece.imageUrl,
      garmentCategory: piece.category ?? 'tops',
      slotType: piece.slotType ?? 'upper',
      tryOn2dImageUrl: piece.tryOn2dResultUrl ?? null,
    }));
    setPieces(mapped);
    setLoading(false);
  }, []);

  useEffect(() => { void refreshData(); }, [refreshData]);

  useEffect(() => {
    const pieceId = searchParams.get('pieceId');
    if (!pieceId || !pieces.length) return;
    const piece = pieces.find((p) => p.pieceId === pieceId);
    if (!piece) return;
    setOutfit((prev) => ({ ...prev, [piece.slotType]: piece }));
    setActiveSlot(piece.slotType as OutfitSlot);
  }, [pieces, searchParams]);

  useEffect(() => {
    setStageError(null);
    setOutfit({});
    setActiveSlot('upper');
    setStageImageUrl('');
  }, [selectedMannequin]);

  const runOutfitTryOn = useCallback(async () => {
    if (!mannequin || !mannequinImageAbsoluteUrl) return;

    const aiSlots: OutfitSlot[] = ['upper', 'lower', 'shoes'];
    const items = aiSlots
      .filter((slot) => outfit[slot])
      .map((slot) => ({
        garmentId: outfit[slot]!.pieceId,
        garmentImageUrl: outfit[slot]!.imageUrl,
        slotType: slot,
      }));

    if (items.length === 0) return;

    setStageError(null);
    const cacheKey = buildOutfitCacheKey(selectedMannequin, outfit);
    const cached = outfitCache[cacheKey];
    if (cached) {
      setStageImageUrl(cached);
      return;
    }

    setProcessing(true);
    try {
      const response = await fetch('/api/dress-tester/try-on-2d-multi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mannequinImageUrl: mannequinImageAbsoluteUrl, items }),
      });
      const payload = await response.json() as { status: string; resultImageUrl: string | null; error?: string };
      if (!response.ok || payload.status !== 'completed' || !payload.resultImageUrl) {
        const errRaw = payload.error;
        setStageError(typeof errRaw === 'string' ? errRaw : 'Could not fit outfit right now.');
        return;
      }
      setStageImageUrl(payload.resultImageUrl);
      setOutfitCache((prev) => ({ ...prev, [cacheKey]: payload.resultImageUrl as string }));
    } finally {
      setProcessing(false);
    }
  }, [mannequin, mannequinImageAbsoluteUrl, outfit, selectedMannequin, outfitCache]);

  const handleApplyPiece = useCallback((item: Tester2DWardrobeItem) => {
    setOutfit((prev) => ({ ...prev, [activeSlot]: item }));
    // Auto-advance to the next empty AI slot
    const nextEmpty = (['upper', 'lower', 'shoes'] as OutfitSlot[]).find((s) => s !== activeSlot && !outfit[s]);
    if (nextEmpty) setActiveSlot(nextEmpty);
  }, [activeSlot, outfit]);

  const handleRemovePiece = useCallback((slot: OutfitSlot) => {
    setOutfit((prev) => {
      const next = { ...prev };
      delete next[slot];
      return next;
    });
    setStageImageUrl('');
    setStageError(null);
  }, []);

  if (loading) return <div className="p-6 text-sm uppercase tracking-[0.2em] text-white/70">Loading Tester 2D...</div>;
  if (!mannequin) return <div className="p-6 text-sm text-white/70">No mannequin profiles found.</div>;

  const activePieceId = outfit[activeSlot]?.pieceId ?? null;

  return (
    <div className="space-y-4">
      <PageHeader title="Tester 2D" subtitle="Multi-piece 2D try-on powered by Fashn.ai — up to 4 slots (upper, lower, shoes, accessory)" />
      <SectionBlock title="Controls" subtitle="Choose the mannequin and build your outfit">
        <Tester2DMannequinSelector mannequins={mannequins} selectedId={selectedMannequin} onChange={setSelectedMannequin} />
      </SectionBlock>

      <div className="grid gap-4 xl:grid-cols-[280px_minmax(0,1fr)_360px]">
        <SectionBlock title="Outfit Builder" subtitle="Select a slot, then pick a piece from the wardrobe">
          <OutfitSlotsPanel
            outfit={outfit}
            activeSlot={activeSlot}
            onSelectSlot={setActiveSlot}
            onRemovePiece={handleRemovePiece}
            onTryOn={runOutfitTryOn}
            processing={processing}
          />
        </SectionBlock>

        <SectionBlock title="Editing Stage" subtitle="AI-fitted outfit render — Fashn.ai chains each garment sequentially">
          <div className="rounded-3xl border border-white/20 bg-black/35 p-4">
            <div className="relative mx-auto aspect-[2/3] w-full max-w-[420px] overflow-hidden rounded-2xl bg-gradient-to-b from-black/30 to-black/65">
              <Image
                src={stageImageUrl || mannequin.baseImageUrl}
                alt="Try-on stage"
                fill
                className="object-contain transition-opacity duration-400 ease-in"
                unoptimized
                priority
              />
              {processing ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/50 text-white">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  <div className="text-center">
                    <p className="text-sm font-medium">Fitting outfit...</p>
                    <p className="mt-1 text-xs text-white/60">Fashn.ai is processing each piece sequentially</p>
                  </div>
                </div>
              ) : null}
              {stageError ? (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 p-4">
                  <div className="rounded-xl border border-rose-300/40 bg-rose-950/70 p-4 text-center text-rose-100">
                    <p className="text-sm">⚠️ {stageError}</p>
                    <button
                      type="button"
                      className="mt-3 rounded-lg border border-rose-200/60 px-3 py-1 text-xs"
                      onClick={() => { setStageError(null); void runOutfitTryOn(); }}
                    >
                      Try again
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </SectionBlock>

        <SectionBlock title="Wardrobe 2D Library" subtitle={`Browsing ${activeSlot} — click to assign to slot`}>
          <Tester2DWardrobePanel
            items={pieces}
            activePieceId={activePieceId}
            processingPieceId={null}
            activeSlot={activeSlot}
            onSlotChange={setActiveSlot}
            onApply={handleApplyPiece}
          />
        </SectionBlock>
      </div>
    </div>
  );
}
