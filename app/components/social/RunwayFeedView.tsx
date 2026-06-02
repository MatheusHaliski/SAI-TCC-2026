'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import RunwayFeedCard, { type FeedCardScheme } from './RunwayFeedCard';

type FeedMode = 'magazine' | 'runway' | 'grid';
type FeedFilter = 'all' | 'following' | 'trending';

interface RunwayFeedViewProps {
  viewerId?: string;
  viewerName?: string;
  viewerPhotoUrl?: string;
}

const SKELETON_COUNT = 6;

function FeedSkeleton({ mode }: { mode: FeedMode }) {
  return (
    <div className={`${mode === 'grid' ? 'grid grid-cols-3 gap-2' : mode === 'magazine' ? 'columns-2 gap-3 space-y-3' : 'flex flex-col gap-0'}`}>
      {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
        <div key={i} className={`runway-skeleton ${mode === 'grid' ? 'aspect-square' : mode === 'runway' ? 'h-screen' : 'h-[400px] break-inside-avoid mb-3'}`} />
      ))}
    </div>
  );
}

const MODE_ICONS: Record<FeedMode, string> = { magazine: '⊞', runway: '⊡', grid: '⊟' };
const MODE_LABELS: Record<FeedMode, string> = { magazine: 'Magazine', runway: 'Runway', grid: 'Grade' };
const FILTER_LABELS: Record<FeedFilter, string> = { all: 'Todos', following: 'Seguindo', trending: 'Em alta' };

export default function RunwayFeedView({ viewerId, viewerName, viewerPhotoUrl }: RunwayFeedViewProps) {
  const [mode, setMode] = useState<FeedMode>('magazine');
  const [filter, setFilter] = useState<FeedFilter>('all');
  const [schemes, setSchemes] = useState<FeedCardScheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement>(null);

  const loadSchemes = useCallback(async (pageIndex: number, currentFilter: FeedFilter) => {
    setLoading(true);
    try {
      const url = new URL('/api/schemes/public', window.location.origin);
      url.searchParams.set('page', String(pageIndex));
      url.searchParams.set('limit', '12');
      if (currentFilter === 'following' && viewerId) url.searchParams.set('viewerId', viewerId);
      if (currentFilter === 'trending') url.searchParams.set('sort', 'trending');

      const res = await fetch(url.toString());
      if (!res.ok) throw new Error('Failed to fetch');
      const data = (await res.json()) as { schemes?: FeedCardScheme[]; hasMore?: boolean } | FeedCardScheme[];

      const list: FeedCardScheme[] = Array.isArray(data) ? data : (data.schemes ?? []);
      const more = Array.isArray(data) ? list.length === 12 : (data.hasMore ?? list.length === 12);

      setSchemes((prev: FeedCardScheme[]) => pageIndex === 0 ? list : [...prev, ...list]);
      setHasMore(more);
    } catch {
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [viewerId]);

  useEffect(() => {
    setPage(0);
    setSchemes([]);
    loadSchemes(0, filter);
  }, [filter, loadSchemes]);

  // Infinite scroll
  useEffect(() => {
    const el = loaderRef.current;
    if (!el || !hasMore) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting && !loading) {
        const next = page + 1;
        setPage(next);
        loadSchemes(next, filter);
      }
    }, { threshold: 0.1 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [filter, hasMore, loading, loadSchemes, page]);

  const GRID_CLASS: Record<FeedMode, string> = {
    magazine: 'columns-2 gap-3',
    runway: 'flex flex-col snap-y snap-mandatory overflow-y-scroll h-screen',
    grid: 'grid grid-cols-3 gap-1.5',
  };
  const gridClass = GRID_CLASS[mode as FeedMode];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex flex-col gap-3 px-4 pt-4 pb-3 border-b border-white/[0.06] flex-shrink-0">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold text-white tracking-tight">
            <span className="text-white/40 font-light">The</span> Runway
          </h1>
          {/* Mode toggle */}
          <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
            {(Object.keys(MODE_ICONS) as FeedMode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                title={MODE_LABELS[m]}
                className={`flex items-center justify-center w-7 h-7 rounded-md text-sm transition-all ${mode === m ? 'bg-white/15 text-white' : 'text-white/30 hover:text-white/60'}`}
              >
                {MODE_ICONS[m]}
              </button>
            ))}
          </div>
        </div>

        {/* Filter chips */}
        <div className="flex gap-2">
          {(Object.keys(FILTER_LABELS) as FeedFilter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                filter === f
                  ? 'bg-white/15 text-white border border-white/20'
                  : 'text-white/40 hover:text-white/60 border border-white/[0.06]'
              }`}
            >
              {FILTER_LABELS[f]}
            </button>
          ))}
        </div>
      </div>

      {/* Feed */}
      <div className={`flex-1 overflow-y-auto px-4 py-4 ${mode === 'runway' ? 'px-0 py-0' : ''}`}>
        {loading && page === 0 ? (
          <FeedSkeleton mode={mode} />
        ) : schemes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center gap-3">
            <span className="text-5xl text-white/10">✦</span>
            <p className="text-sm text-white/30">Nenhum look publicado ainda.</p>
            <p className="text-xs text-white/20">Seja o primeiro a compartilhar um look!</p>
          </div>
        ) : (
          <div className={`${gridClass} ${mode === 'magazine' ? 'space-y-0' : ''}`}>
            {schemes.map((scheme: FeedCardScheme, i: number) => (
              <div key={scheme.scheme_id} className={mode === 'magazine' ? 'break-inside-avoid mb-3' : ''}>
                <RunwayFeedCard
                  scheme={scheme}
                  viewerId={viewerId}
                  viewerName={viewerName}
                  viewerPhotoUrl={viewerPhotoUrl}
                  mode={mode}
                  style={{ animationDelay: `${(i % 6) * 0.06}s` }}
                />
              </div>
            ))}
          </div>
        )}

        {/* Infinite scroll trigger */}
        {hasMore && (
          <div ref={loaderRef} className="h-16 flex items-center justify-center">
            {loading && page > 0 && (
              <div className="w-6 h-6 rounded-full border border-white/20 border-t-white/60 animate-spin" />
            )}
          </div>
        )}

        {!hasMore && schemes.length > 0 && (
          <p className="text-center text-xs text-white/20 py-8">Você chegou ao fim do feed ✦</p>
        )}
      </div>
    </div>
  );
}
