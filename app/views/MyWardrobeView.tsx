'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { getAuthSessionProfile } from '@/app/lib/authSession';
import { getServerSession } from '@/app/lib/clientSession';
import ContextSectionMenu from '@/app/components/navigation/ContextSectionMenu';
import PageHeader from '@/app/components/shell/PageHeader';
import SectionBlock from '@/app/components/shared/SectionBlock';
import { resolveWardrobeModelUrl } from '@/app/lib/wardrobeModelUrl';
import ThreeDViewerModal from '@/app/components/wardrobe/ThreeDViewerModal';
import WardrobeItemViewerModal from '@/app/components/wardrobe/WardrobeItemViewerModal';
import ThreeDGenerationProgressModal from '@/app/components/wardrobe/ThreeDGenerationProgressModal';
import WardrobeItemCard from '@/app/components/wardrobe/WardrobeItemCard';
import EditPieceModal from '@/app/components/pieces/EditPieceModal';
import { use3dAssetJob } from '@/app/hooks/use3dAssetJob';
import {
  buildBlenderWorkerSubmitPayload,
  reconcileBlenderWorkerJob,
  submitBlenderWorkerJob,
} from '@/app/services/blenderWorkerClient';
import type { SearchIntentOutput } from '@/app/lib/ai/providers/types';
import { pushSystemInboxMessage } from '@/app/lib/systemInboxNotifications';

interface WardrobeItem {
  wardrobe_item_id: string;
  name: string;
  image_url: string;
  image_assets?: {
    raw_upload_image_url?: string | null;
    segmented_png_url?: string | null;
    cleaned_png_url?: string | null;
    normalized_2d_preview_url?: string | null;
    approved_catalog_2d_url?: string | null;
    model_3d_url?: string | null;
  };
  image_analysis?: { catalog_readiness_score?: number; recommended_action?: string };
  model_3d_url?: string | null;
  model_preview_url?: string | null;
  model_base_3d_url?: string | null;
  model_branded_3d_url?: string | null;
  isolated_piece_image_url?: string | null;
  model_status?: string;
  model_generation_error?: string | null;
  processingStartedAt?: string | null;
  cloud_job_id?: string | null;
  brand_applied?: boolean;
  fitProfile?: { preparationStatus?: string };
  brand: string;
  season: string;
  gender: string;
  piece_type: string;
  for_sale?: boolean;
  listing_price?: number;
}

const sections = ['Disponíveis', 'Indisponíveis', 'Favoritos', 'Para vender'];

const READY_STATUSES    = new Set(['done', 'ready', 'completed', 'asset_available']);
const FAILED_STATUSES   = new Set(['failed', 'failed_geometry_scope']);
const QUEUE_STATUSES    = new Set(['queued_segmentation', 'queued_base', 'queued_branding', 'queued_geometry_qa', 'segmentation_done']);
const PROGRESS_STATUSES = new Set(['generating_base', 'branding_in_progress', 'base_done', 'retrying_generation', 'in_progress']);

function mapItemState(item: WardrobeItem): 'ready' | 'failed' | 'queued' | 'generating' | 'not_started' {
  const normalized = String(item.model_status ?? '').trim().toLowerCase();
  if (resolveWardrobeModelUrl(item) || READY_STATUSES.has(normalized)) return 'ready';
  if (FAILED_STATUSES.has(normalized))   return 'failed';
  if (QUEUE_STATUSES.has(normalized))    return 'queued';
  if (PROGRESS_STATUSES.has(normalized)) return 'generating';
  return 'not_started';
}

function stateLabel(state: ReturnType<typeof mapItemState>, status?: string, item?: WardrobeItem) {
  const normalizedError = String(item?.model_generation_error ?? '').trim().toLowerCase();
  const fitReady = String(item?.fitProfile?.preparationStatus ?? '').trim().toLowerCase() === 'ready';
  if (state === 'ready') return 'Pronto para visualização 3D';
  if (state === 'failed' && fitReady && (normalizedError.includes('low_quality') || normalizedError.includes('too dark') || normalizedError.includes('low contrast')))
    return 'Pronto para provador 2D · Geração 3D falhou: imagem muito escura/baixo contraste';
  if (state === 'queued')     return 'Na fila de processamento';
  if (state === 'generating') return 'Gerando modelo...';
  if (state === 'failed')     return 'Falhou (toque para tentar novamente)';
  return `Não iniciado${status ? ` • ${status}` : ''}`;
}

export default function MyWardrobeView() {
  const [items,            setItems]            = useState<WardrobeItem[]>([]);
  const [cursor,           setCursor]           = useState<string | null>(null);
  const [cursorCache,      setCursorCache]      = useState<Record<number, string | null>>({ 0: null });
  const [page,             setPage]             = useState(0);
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [isLoadingMore,    setIsLoadingMore]    = useState(false);
  const [hasMore,          setHasMore]          = useState(true);
  const [selectedSection,  setSelectedSection]  = useState(sections[0]?.toLowerCase() ?? 'disponíveis');
  const [availability,     setAvailability]     = useState<Record<string, 'available' | 'unavailable'>>({});
  const [favorites,        setFavorites]        = useState<Record<string, boolean>>({});
  const [viewerItem,       setViewerItem]       = useState<WardrobeItem | null>(null);
  const [modalItem,        setModalItem]        = useState<WardrobeItem | null>(null);
  const [viewerUrl,        setViewerUrl]        = useState<string | null>(null);
  const [progressItem,     setProgressItem]     = useState<WardrobeItem | null>(null);
  const [editItemId,       setEditItemId]       = useState<string | null>(null);
  const [currentUserId,    setCurrentUserId]    = useState<string>('');
  const [searchQuery,      setSearchQuery]      = useState('');
  const [isSearching,      setIsSearching]      = useState(false);
  const [searchIntent,     setSearchIntent]     = useState<SearchIntentOutput | null>(null);

  const assetJob              = use3dAssetJob({ timeoutMs: 12 * 60 * 1000, maxPollAttempts: 200 });
  const stalledItemIdRef      = useRef<string | null>(null);
  const completionNotifiedRef = useRef<string | null>(null);
  const STALL_TTL_MS          = 10 * 60 * 1000;

  useEffect(() => {
    const load = async () => {
      setIsInitialLoading(true);
      const localProfile = getAuthSessionProfile();
      let userId = localProfile.user_id?.trim() || '';
      if (!userId) { const sp = await getServerSession(); userId = sp?.user_id?.trim() || ''; }
      if (!userId) { setItems([]); setHasMore(false); setIsInitialLoading(false); return; }
      setCurrentUserId(userId);
      const res     = await fetch(`/api/wardrobe-items/user/${userId}?status=active&limit=24`);
      const payload = await res.json().catch(() => ({ items: [], nextCursor: null }));
      const next    = res.ok && Array.isArray(payload?.items) ? payload.items : [];
      setItems(next);
      setCursor(typeof payload?.nextCursor === 'string' ? payload.nextCursor : null);
      setCursorCache({ 0: null, 1: typeof payload?.nextCursor === 'string' ? payload.nextCursor : null });
      setPage(0);
      setHasMore(Boolean(payload?.nextCursor));
      setIsInitialLoading(false);
    };
    void load().catch(() => { setItems([]); setHasMore(false); setIsInitialLoading(false); });
  }, []);

  const loadMore = async () => {
    if (isLoadingMore || !hasMore || !cursor) return;
    setIsLoadingMore(true);
    try {
      const userId = getAuthSessionProfile().user_id?.trim() || '';
      if (!userId) return;
      const res     = await fetch(`/api/wardrobe-items/user/${userId}?status=active&limit=24&cursor=${encodeURIComponent(cursor)}`);
      const payload = await res.json().catch(() => ({ items: [], nextCursor: null }));
      const next    = res.ok && Array.isArray(payload?.items) ? payload.items : [];
      setItems((prev) => [...prev, ...next]);
      setCursor(typeof payload?.nextCursor === 'string' ? payload.nextCursor : null);
      setHasMore(Boolean(payload?.nextCursor));
      setPage((prev) => { const np = prev + 1; setCursorCache((c) => ({ ...c, [np + 1]: payload?.nextCursor ?? null })); return np; });
    } finally { setIsLoadingMore(false); }
  };

  useEffect(() => {
    if (!progressItem || assetJob.status !== 'completed') return;
    const key = `${progressItem.wardrobe_item_id}:${assetJob.jobId ?? 'no-job'}`;
    if (completionNotifiedRef.current === key) return;
    pushSystemInboxMessage({ title: 'Modelo 3D pronto', summary: `"${progressItem.name}" foi gerado e está pronto para visualização.`, level: 'success' });
    completionNotifiedRef.current = key;
  }, [assetJob.jobId, assetJob.status, progressItem]);

  const grouped = useMemo(() => ({
    available:   items.filter((i) => (availability[i.wardrobe_item_id] ?? 'available') === 'available'),
    unavailable: items.filter((i) => (availability[i.wardrobe_item_id] ?? 'available') === 'unavailable'),
    favorite:    items.filter((i) => favorites[i.wardrobe_item_id]),
    forsale:     items.filter((i) => i.for_sale),
  }), [availability, favorites, items]);

  const activeGroups = useMemo(() => {
    const groups = [
      { key: 'available',   title: 'Peças Disponíveis',  data: grouped.available   },
      { key: 'unavailable', title: 'Peças Indisponíveis', data: grouped.unavailable },
      { key: 'favorite',    title: 'Peças Favoritas',     data: grouped.favorite    },
      { key: 'forsale',     title: 'Peças Para Vender',   data: grouped.forsale     },
    ] as const;

    const sectionToKey: Record<string, (typeof groups)[number]['key']> = {
      'disponíveis': 'available', 'indisponíveis': 'unavailable',
      'favoritos': 'favorite',    'para vender': 'forsale',
    };

    let data = groups.find((g) => g.key === (sectionToKey[selectedSection] ?? 'available'))?.data ?? [];

    if (searchIntent) {
      data = data.map((item) => {
        let score = 0;
        const text = `${item.name} ${item.brand} ${item.season} ${item.gender} ${item.piece_type}`.toLowerCase();
        const match = (arr: string[], w: number) => arr?.forEach((t) => { if (text.includes(t.toLowerCase())) score += w; });
        match(searchIntent.piece_item, 3); match(searchIntent.brand, 3);
        match(searchIntent.colors, 2);     match(searchIntent.season, 2);
        match(searchIntent.style, 1);      match(searchIntent.occasion, 1);
        match(searchIntent.semanticTags, 1);
        return { item, score };
      }).filter((x) => x.score > 0).sort((a, b) => b.score - a.score).map((x) => x.item);
    } else if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      data = data.filter((i) => `${i.name} ${i.brand} ${i.piece_type}`.toLowerCase().includes(q));
    }

    const sel = groups.find((g) => g.key === (sectionToKey[selectedSection] ?? 'available'));
    return sel ? [{ ...sel, data }] : [{ ...groups[0], data }];
  }, [grouped, selectedSection, searchIntent, searchQuery]);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) { setSearchIntent(null); return; }
    setIsSearching(true); setSearchIntent(null);
    try {
      const res    = await fetch('/api/ai/fashion/search-intent', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query: searchQuery }) });
      const result = await res.json();
      if (result.ok && result.data) setSearchIntent(result.data);
    } catch (err) { console.error('Search failed', err); }
    finally { setIsSearching(false); }
  };

  const handleOpenViewerIntent = async (item: WardrobeItem) => {
    if (progressItem && !['completed','failed','timed_out','cancelled','idle'].includes(assetJob.status)) return;
    const existingModel = resolveWardrobeModelUrl(item);
    if (existingModel) { setViewerItem(item); setViewerUrl(existingModel); return; }
    const modelStatus = String(item.model_status ?? '').trim().toLowerCase();
    const cloudJobId  = item.cloud_job_id?.trim() ?? '';
    const isInFlight  = (modelStatus === 'processing' || modelStatus === 'processing_timeout') && Boolean(cloudJobId);
    setProgressItem(item);
    if (modelStatus === 'processing' && stalledItemIdRef.current !== item.wardrobe_item_id && item.processingStartedAt && Date.now() - new Date(item.processingStartedAt).getTime() > STALL_TTL_MS) {
      stalledItemIdRef.current = item.wardrobe_item_id;
      assetJob.setStatus('failed');
      assetJob.setError('Geração travada: o worker pode ter reiniciado. Clique em Tentar novamente.');
      return;
    }
    stalledItemIdRef.current = null;
    if (isInFlight) {
      try {
        const result = await reconcileBlenderWorkerJob(item.wardrobe_item_id, cloudJobId);
        const rs  = String(result.status ?? '').toLowerCase();
        const url = typeof result.model_3d_url === 'string' ? result.model_3d_url.trim() : '';
        if (rs === 'completed' && url) { setProgressItem(null); setViewerItem(item); setViewerUrl(url); return; }
        if (rs === 'processing') {
          await assetJob.startJob({ existingJobId: cloudJobId, pollJob: async (jobId) => {
            const p = await reconcileBlenderWorkerJob(item.wardrobe_item_id, jobId);
            if (String(p.status ?? '').toLowerCase() === 'job_not_found') throw new Error('Job não encontrado. Clique em Tentar novamente.');
            return p;
          }});
          return;
        }
      } catch (err) { console.warn('[3d-worker] reconcile:error-fallback', err); }
    }
    await assetJob.startJob({
      createJob: async () => {
        const p = buildBlenderWorkerSubmitPayload(item as unknown as Record<string, unknown>);
        return submitBlenderWorkerJob(p);
      },
      pollJob: async (jobId) => {
        const p = await reconcileBlenderWorkerJob(item.wardrobe_item_id, jobId);
        if (String(p.status ?? '').toLowerCase() === 'job_not_found') throw new Error('Job não encontrado. Clique em Tentar novamente.');
        return p;
      },
    });
  };

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <ContextSectionMenu
          title="Guarda-Roupa"
          sections={sections}
          selectedSection={sections.find((s) => s.toLowerCase() === selectedSection) ?? sections[0]}
          onSelectSection={(s) => setSelectedSection(s.toLowerCase())}
        />

        <div className="space-y-6">
          <PageHeader title="Guarda-Roupa Virtual" subtitle="Classifique peças como disponíveis, indisponíveis e favoritas." />

          <div style={{ borderRadius: '1rem', border: '1px solid var(--border)', background: 'var(--accent)', padding: '1rem' }}>
            <form onSubmit={handleSearch} className="flex flex-col gap-2 md:flex-row">
              <input
                type="text"
                placeholder="✨ Busca semântica (ex: roupas de inverno pretas)"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); if (!e.target.value) setSearchIntent(null); }}
                style={{ flex: 1, borderRadius: '0.75rem', border: '1px solid var(--border)', background: 'var(--input-background)', padding: '0.5rem 1rem', fontSize: '0.875rem', color: 'var(--foreground)', outline: 'none', width: '100%' }}
              />
              <button type="submit" disabled={isSearching}
                style={{ borderRadius: '0.75rem', background: 'linear-gradient(135deg,#7c3aed,#db2777)', padding: '0.5rem 1.5rem', fontWeight: 700, color: '#fff', border: 'none', cursor: 'pointer', opacity: isSearching ? 0.7 : 1, fontFamily: 'inherit' }}>
                {isSearching ? 'Buscando...' : 'Busca IA'}
              </button>
            </form>
            {searchIntent && (
              <div style={{ marginTop: '0.75rem', display: 'flex', flexWrap: 'wrap' as const, gap: '0.5rem', fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
                {searchIntent.colors.map(c     => <span key={c} style={{ borderRadius: '0.25rem', border: '1px solid var(--border)', background: 'var(--muted)', padding: '0.125rem 0.375rem' }}>🎨 {c}</span>)}
                {searchIntent.season.map(s     => <span key={s} style={{ borderRadius: '0.25rem', border: '1px solid var(--border)', background: 'var(--muted)', padding: '0.125rem 0.375rem' }}>❄️ {s}</span>)}
                {searchIntent.piece_item.map(p => <span key={p} style={{ borderRadius: '0.25rem', border: '1px solid var(--border)', background: 'var(--muted)', padding: '0.125rem 0.375rem' }}>👕 {p}</span>)}
                {searchIntent.style.map(s      => <span key={s} style={{ borderRadius: '0.25rem', border: '1px solid var(--border)', background: 'var(--muted)', padding: '0.125rem 0.375rem' }}>✨ {s}</span>)}
                {searchIntent.brand.map(b      => <span key={b} style={{ borderRadius: '0.25rem', border: '1px solid var(--border)', background: 'var(--muted)', padding: '0.125rem 0.375rem' }}>🏷️ {b}</span>)}
              </div>
            )}
          </div>

          {activeGroups.map((group) => (
            <SectionBlock key={group.key} title={group.title} subtitle="Gerencie o status de cada peça do guarda-roupa.">
              <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {isInitialLoading && <p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>Carregando peças...</p>}
                {group.data.map((item) => {
                  const cardState = mapItemState(item);
                  return (
                    <WardrobeItemCard
                      key={item.wardrobe_item_id}
                      name={item.name}
                      imageUrl={item.image_url}
                      imageAssets={item.image_assets}
                      brand={item.brand}
                      pieceType={item.piece_type}
                      state={cardState}
                      statusLabel={stateLabel(cardState, item.model_status, item)}
                      forSale={item.for_sale}
                      listingPrice={item.listing_price}
                      onClick={() => setModalItem(item)}
                      onAvailable={() => setAvailability((prev) => ({ ...prev, [item.wardrobe_item_id]: 'available' }))}
                      onUnavailable={() => setAvailability((prev) => ({ ...prev, [item.wardrobe_item_id]: 'unavailable' }))}
                      onToggleFavorite={() => setFavorites((prev) => ({ ...prev, [item.wardrobe_item_id]: !prev[item.wardrobe_item_id] }))}
                      onEdit={() => setEditItemId(item.wardrobe_item_id)}
                    />
                  );
                })}
                {!isInitialLoading && !group.data.length && (
                  <p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
                    {group.key === 'forsale' ? 'Nenhuma peça para venda no momento.' : 'Nenhuma peça nesta lista.'}
                  </p>
                )}
              </div>
              {group.key === 'available' && hasMore && (
                <div className="mt-4 flex items-center justify-between">
                  <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>Página {page + 1} · {Object.keys(cursorCache).length} cursores em cache</p>
                  <button type="button" onClick={() => void loadMore()} disabled={isLoadingMore}
                    style={{ borderRadius: '9999px', border: '1px solid var(--border)', padding: '0.25rem 0.75rem', fontSize: '0.75rem', color: 'var(--foreground)', background: 'var(--card)', cursor: 'pointer', opacity: isLoadingMore ? 0.6 : 1, fontFamily: 'inherit' }}>
                    {isLoadingMore ? 'Carregando...' : 'Carregar mais'}
                  </button>
                </div>
              )}
            </SectionBlock>
          ))}
        </div>
      </div>

      <WardrobeItemViewerModal
        open={Boolean(modalItem)}
        item={modalItem}
        onClose={() => setModalItem(null)}
        userId={currentUserId || undefined}
      />

      <ThreeDGenerationProgressModal
        open={Boolean(progressItem) && !viewerUrl}
        status={assetJob.status}
        progressPercent={assetJob.progressPercent}
        pollAttempts={assetJob.pollAttempts}
        error={assetJob.error}
        onClose={() => { assetJob.cancelPolling(); setProgressItem(null); }}
        onRetry={() => { if (!progressItem) return; assetJob.cancelPolling(); void handleOpenViewerIntent(progressItem); }}
      />

      {viewerItem && viewerUrl && (
        <ThreeDViewerModal
          open
          title={`${viewerItem.name} • Visualizador 3D`}
          modelUrl={viewerUrl}
          posterUrl={viewerItem.model_preview_url ?? undefined}
          onClose={() => { setViewerItem(null); setViewerUrl(null); }}
        />
      )}

      <EditPieceModal
        open={Boolean(editItemId)}
        itemId={editItemId}
        onClose={() => setEditItemId(null)}
        onSaved={() => { setItems((prev) => prev.map((i) => i.wardrobe_item_id === editItemId ? { ...i } : i)); setEditItemId(null); }}
        onDeleted={() => { setItems((prev) => prev.filter((i) => i.wardrobe_item_id !== editItemId)); setEditItemId(null); }}
      />
    </>
  );
}