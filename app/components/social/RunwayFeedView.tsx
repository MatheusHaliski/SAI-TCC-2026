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
  const [officialPosts, setOfficialPosts] = useState<Array<{ id: string; title: string; body: string; image_url?: string | null; tag?: string | null; featured_until?: string | null; is_official?: boolean }>>([]);
  const [loading, setLoading] = useState(true);
  const [loadingOfficial, setLoadingOfficial] = useState(true);
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

  useEffect(() => {
    let isMounted = true;

    const loadOfficialPosts = async () => {
      setLoadingOfficial(true);
      try {
        const res = await fetch('/api/brand-feed');
        if (!res.ok) throw new Error('Failed to fetch official feed');
        const data = await res.json() as { posts?: typeof officialPosts };
        if (isMounted) {
          setOfficialPosts(Array.isArray(data.posts) ? data.posts : []);
        }
      } catch {
        if (isMounted) setOfficialPosts([]);
      } finally {
        if (isMounted) setLoadingOfficial(false);
      }
    };

    loadOfficialPosts();
    return () => {
      isMounted = false;
    };
  }, []);

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
        <ArtCelebrityPanel viewerId={viewerId} viewerName={viewerName} />

        {officialPosts.length > 0 && (
          <section className="mb-4 rounded-3xl border border-amber-400/25 bg-[linear-gradient(135deg,rgba(251,191,36,0.12),rgba(124,58,237,0.12))] p-4 shadow-[0_18px_50px_rgba(15,23,42,0.35)]">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-[0.28em] text-amber-100/80">Plano 2</p>
                <h2 className="text-sm font-semibold text-white">Feed oficial · 30 dias</h2>
                <p className="text-xs text-white/60">Destaques curados, selos e presença premium para marcas e criadores.</p>
              </div>
              <span className="rounded-full border border-white/15 bg-black/30 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-white/70">{viewerSeal?.status === 'active' ? 'Selo ativo' : viewerSeal?.status === 'pending' ? 'Validando' : 'Em teste'}</span>
            </div>

            {viewerSeal && (
              <div className="mb-3 rounded-2xl border border-white/10 bg-black/30 p-3 text-xs text-white/80">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-amber-400/25 bg-amber-400/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.22em] text-amber-100">{viewerSeal.seal_tier ?? 'none'}</span>
                  <span className="text-white/60">Status: {viewerSeal.status ?? 'inactive'}</span>
                  <span className="text-white/60">Feed oficial: {viewerSeal.official_feed_eligible ? 'habilitado' : 'não habilitado'}</span>
                </div>
              </div>
            )}

            <div className="grid gap-2">
              {officialPosts.slice(0, 3).map((post) => (
                <article key={post.id} className="rounded-2xl border border-white/10 bg-black/30 p-3 text-white/85">
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <span className="rounded-full border border-amber-400/25 bg-amber-400/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.22em] text-amber-100">Selo oficial</span>
                    {post.featured_until ? <span className="text-[10px] text-white/45">até {new Date(post.featured_until).toLocaleDateString('pt-BR')}</span> : null}
                  </div>
                  <h3 className="text-sm font-semibold text-white">{post.title}</h3>
                  <p className="mt-1 text-xs text-white/70">{post.body}</p>
                  {post.tag ? <span className="mt-2 inline-flex text-[10px] uppercase tracking-[0.18em] text-violet-100/90">{post.tag}</span> : null}
                </article>
              ))}
            </div>
          </section>
        )}

        {loadingOfficial && officialPosts.length === 0 && (
          <div className="mb-4 rounded-3xl border border-white/10 bg-white/5 p-4 text-xs text-white/45">Carregando destaques oficiais…</div>
        )}
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
