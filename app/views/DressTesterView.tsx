'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import PageHeader from '@/app/components/shell/PageHeader';
import SectionBlock from '@/app/components/shared/SectionBlock';
import Tester2DMannequinSelector from '@/app/components/tester2d/Tester2DMannequinSelector';
import OutfitSlotsPanel from '@/app/components/tester2d/OutfitSlotsPanel';
import FitScorePanel, { type FitScoreResult } from '@/app/components/tester2d/FitScorePanel';
import SaveLookCard from '@/app/components/tester2d/SaveLookCard';
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
type ShoesOverlayPayload = {
  imageUrl: string;
  bgRemovedUrl?: string | null;
  bbox: { x: number; y: number; w: number; h: number };
  canvas: { width: number; height: number };
};

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
  const [fitScore, setFitScore] = useState<FitScoreResult | null>(null);
  const [shoesBgRemovedUrl, setShoesBgRemovedUrl] = useState<string | null>(null);
  const [shoesBgProcessing, setShoesBgProcessing] = useState(false);

  const sessionPayloadApplied = useRef(false);
  const searchParams = useSearchParams();

  const mannequin = useMemo(() => mannequins.find((m) => m.id === selectedMannequin) ?? mannequins[0], [mannequins, selectedMannequin]);

  const mannequinImageAbsoluteUrl = useMemo(() => {
    if (!mannequin?.baseImageUrl) return '';
    if (/^https?:\/\//i.test(mannequin.baseImageUrl)) return mannequin.baseImageUrl;
    if (typeof window === 'undefined') return mannequin.baseImageUrl;
    return new URL(mannequin.baseImageUrl, window.location.origin).toString();
  }, [mannequin]);

  // Derived: pieces in outfit formatted for FitScorePanel
  const fitScorePieces = useMemo(
    () =>
      SLOT_ORDER.filter((s) => outfit[s]).map((s) => ({
        name: outfit[s]!.name,
        brand: '',
        pieceType: outfit[s]!.garmentCategory,
        slotType: s,
      })),
    [outfit],
  );

  const filledSlots = useMemo(() => SLOT_ORDER.filter((s) => outfit[s]), [outfit]);

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

  // Load single piece from ?pieceId= query param
  useEffect(() => {
    const pieceId = searchParams.get('pieceId');
    if (!pieceId || !pieces.length) return;
    const piece = pieces.find((p) => p.pieceId === pieceId);
    if (!piece) return;
    setOutfit((prev) => ({ ...prev, [piece.slotType]: piece }));
    setActiveSlot(piece.slotType as OutfitSlot);
  }, [pieces, searchParams]);

  // Load full outfit from sessionStorage when ?source=outfit
  useEffect(() => {
    if (sessionPayloadApplied.current || !pieces.length) return;
    const source = searchParams.get('source');
    if (source !== 'outfit') return;
    const raw = sessionStorage.getItem('sai_dress_tester_payload');
    if (!raw) return;
    sessionPayloadApplied.current = true;
    try {
      const data = JSON.parse(raw) as { pieces?: Array<{ wardrobeItemId?: string }> };
      const newOutfit: Outfit = {};
      for (const p of data.pieces ?? []) {
        if (!p.wardrobeItemId) continue;
        const item = pieces.find((w) => w.pieceId === p.wardrobeItemId);
        if (!item || newOutfit[item.slotType]) continue;
        newOutfit[item.slotType] = item;
      }
      if (Object.keys(newOutfit).length > 0) {
        setOutfit(newOutfit);
      }
    } catch { /* malformed session payload — ignore */ }
  }, [pieces, searchParams]);

  // Reset stage + score when mannequin changes
  useEffect(() => {
    setStageError(null);
    setOutfit({});
    setActiveSlot('upper');
    setStageImageUrl('');
    setFitScore(null);
    sessionPayloadApplied.current = false;
  }, [selectedMannequin]);

  // Reset score when outfit changes (new stage needed)
  useEffect(() => {
    setFitScore(null);
  }, [outfit]);

  // Trigger background removal for shoes when they change
  useEffect(() => {
    const shoes = outfit.shoes;
    if (!shoes) { setShoesBgRemovedUrl(null); return; }
    // Use existing tryOn2dImageUrl if it was processed as a bg-removed overlay
    if (shoes.tryOn2dImageUrl) { setShoesBgRemovedUrl(shoes.tryOn2dImageUrl); return; }
    let cancelled = false;
    setShoesBgProcessing(true);
    setShoesBgRemovedUrl(null);
    fetch('/api/dress-tester/remove-bg', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pieceId: shoes.pieceId, imageUrl: shoes.imageUrl }),
    })
      .then((r) => r.json() as Promise<{ bgRemovedUrl: string | null; error: string | null }>)
      .then(({ bgRemovedUrl }) => { if (!cancelled && bgRemovedUrl) setShoesBgRemovedUrl(bgRemovedUrl); })
      .catch(() => { /* fall back to raw image */ })
      .finally(() => { if (!cancelled) setShoesBgProcessing(false); });
    return () => { cancelled = true; };
  }, [outfit.shoes]);

  const runOutfitTryOn = useCallback(async () => {
    if (!mannequin || !mannequinImageAbsoluteUrl) return;

    const aiSlots: OutfitSlot[] = ['upper', 'lower'];
    const items = aiSlots
      .filter((slot) => outfit[slot])
      .map((slot) => ({
        garmentId: outfit[slot]!.pieceId,
        garmentImageUrl: outfit[slot]!.imageUrl,
        slotType: slot,
      }));

    const shoesBbox = mannequin.slots.shoes?.bbox;
    const shoesOverlay: ShoesOverlayPayload | undefined = outfit.shoes && shoesBbox
      ? {
          imageUrl: outfit.shoes.imageUrl,
          bgRemovedUrl: shoesBgRemovedUrl,
          bbox: shoesBbox,
          canvas: { width: mannequin.canvasWidth, height: mannequin.canvasHeight },
        }
      : undefined;

    if (items.length === 0 && !shoesOverlay) return;

    setStageError(null);
    setStageImageUrl('');
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
        body: JSON.stringify({ mannequinImageUrl: mannequinImageAbsoluteUrl, items, shoesOverlay }),
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
  }, [mannequin, mannequinImageAbsoluteUrl, outfit, shoesBgRemovedUrl, selectedMannequin, outfitCache]);

  const handleApplyPiece = useCallback((item: Tester2DWardrobeItem) => {
    setOutfit((prev) => ({ ...prev, [activeSlot]: item }));
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
    setFitScore(null);
  }, []);

  if (loading) return <div className="p-6 text-sm uppercase tracking-[0.2em] text-white/70">Carregando Provador 2D...</div>;
  if (!mannequin) return <div className="p-6 text-sm text-white/70">Nenhum manequim encontrado.</div>;

  const activePieceId = outfit[activeSlot]?.pieceId ?? null;

  return (
    <div className="space-y-4">
      <PageHeader title="Provador 2D" subtitle="Monte seu look com até 4 peças" />
      <SectionBlock title="Manequim" subtitle="Escolha o manequim e monte seu look">
        <Tester2DMannequinSelector mannequins={mannequins} selectedId={selectedMannequin} onChange={setSelectedMannequin} />
      </SectionBlock>

      <div className="grid gap-4 xl:grid-cols-[300px_minmax(0,1fr)_360px]">
        {/* ── Left: Outfit Builder + Fit Score ── */}
        <SectionBlock title="Outfit Builder" subtitle="Selecione um slot e escolha a peça">
          <div className="mt-4 space-y-3">
            <OutfitSlotsPanel
              outfit={outfit}
              activeSlot={activeSlot}
              onSelectSlot={setActiveSlot}
              onRemovePiece={handleRemovePiece}
              onTryOn={runOutfitTryOn}
              processing={processing}
            />
            {stageImageUrl && (
              <FitScorePanel
                key={stageImageUrl + '|' + SLOT_ORDER.map((s) => outfit[s]?.pieceId ?? '').join(',')}
                pieces={fitScorePieces}
                filledSlots={filledSlots}
                mannequin={selectedMannequin}
                onScoreReady={setFitScore}
              />
            )}
          </div>
        </SectionBlock>

        {/* ── Center: Stage + Save Look ── */}
        <SectionBlock title="Provador">
          <div className="mt-4 space-y-4">
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
                {/* Shoes preview overlay — shown on mannequin base only (before try-on).
                    After try-on, shoes are baked into stageImageUrl by the server. */}
                {outfit.shoes && !processing && !stageImageUrl && (() => {
                  const bbox = mannequin.slots.shoes?.bbox;
                  if (!bbox) return null;
                  const cw = mannequin.canvasWidth;
                  const ch = mannequin.canvasHeight;
                  return (
                    <div
                      className="absolute pointer-events-none"
                      style={{
                        left: `${(bbox.x / cw) * 100}%`,
                        top: `${(bbox.y / ch) * 100}%`,
                        width: `${(bbox.w / cw) * 100}%`,
                        height: `${(bbox.h / ch) * 100}%`,
                      }}
                    >
                      {shoesBgProcessing ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        </div>
                      ) : (
                        <Image
                          src={shoesBgRemovedUrl ?? outfit.shoes.imageUrl}
                          alt={outfit.shoes.name}
                          fill
                          className="object-contain opacity-70"
                          unoptimized
                        />
                      )}
                    </div>
                  );
                })()}
                {processing ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/55 text-white">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-fuchsia-400/30 border-t-fuchsia-400" />
                    <div className="text-center">
                      <p className="text-sm font-medium">Encaixando o look...</p>

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
                        Tentar novamente
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            {/* Save Look — appears after AI analysis is ready */}
            {stageImageUrl && fitScore && (
              <SaveLookCard
                key={stageImageUrl}
                stageImageUrl={stageImageUrl}
                outfit={outfit}
                fitScore={fitScore}
              />
            )}
          </div>
        </SectionBlock>

        {/* ── Right: Wardrobe ── */}
        <SectionBlock title="Guarda-roupa" subtitle={`Navegando: ${activeSlot} — clique para atribuir ao slot`}>
          <div className="mt-4">
            <Tester2DWardrobePanel
              items={pieces}
              activePieceId={activePieceId}
              processingPieceId={null}
              activeSlot={activeSlot}
              onSlotChange={setActiveSlot}
              onApply={handleApplyPiece}
            />
          </div>
        </SectionBlock>
      </div>
    </div>
  );
}
