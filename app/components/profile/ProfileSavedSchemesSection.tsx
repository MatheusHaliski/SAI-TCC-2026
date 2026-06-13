'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import SectionBlock from '@/app/components/shared/SectionBlock';
import OutfitCard from '@/app/components/outfit-card/OutfitCard';
import OutfitExportModal from '@/app/components/profile/OutfitExportModal';
import { OutfitCardData, OutfitBackgroundConfig } from '@/app/lib/outfit-card';

type SimilarMatch = { wardrobe_item_id: string; name: string; piece_type: string; color: string; image_url: string; score: number };
type SimilarResult = { look_piece: { name: string; pieceType: string; slot: string }; matches: SimilarMatch[] };

type SchemeSlot = 'upper' | 'lower' | 'shoes' | 'accessory';

interface SchemePieceSnapshot {
  id?: string;
  piece_id?: string;
  sourceId?: string;
  slot?: SchemeSlot;
  name?: string;
  piece_name?: string;
  brand?: string;
  brand_name?: string;
  brandLogoUrl?: string;
  brand_logo_url?: string;
  pieceType?: string;
  piece_type?: string;
  category?: 'Premium' | 'Standard' | 'Limited Edition' | 'Rare';
  wearstyles?: string[];
}

interface SavedScheme {
  scheme_id: string;
  title: string;
  style: string;
  occasion: string;
  description?: string | null;
  cover_image_url?: string | null;
  visibility: 'public' | 'followers' | 'private';
  user_id?: string;
  author_name?: string;
  pieces?: SchemePieceSnapshot[];
}

interface ProfileSavedSchemesSectionProps {
  userId: string;
}

// Parses outfitBackground from the scheme.description JSON field (same logic as ExploreSchemeView)
function parseBackground(description?: string | null): OutfitBackgroundConfig | undefined {
  if (!description) return undefined;
  try {
    const parsed = JSON.parse(description) as { outfitBackground?: OutfitBackgroundConfig };
    return parsed?.outfitBackground ?? undefined;
  } catch {
    return undefined;
  }
}

// Derives the scheme slot for a piece, falling back to a heuristic on its type.
function deriveSlot(pieceType: string | undefined, explicit?: SchemeSlot): SchemeSlot {
  if (explicit) return explicit;
  const type = (pieceType ?? '').toLowerCase();
  if (/shoe|sneaker|boot|t[êe]nis|sapato|sandal/.test(type)) return 'shoes';
  if (/pant|trouser|short|skirt|jean|cal[çc]a|bermuda|saia|lower/.test(type)) return 'lower';
  if (/shirt|jacket|coat|top|blaz|sweater|camis|casaco|hood|upper|vestido|dress/.test(type)) return 'upper';
  return 'accessory';
}

const slugify = (value: string) =>
  value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'selected-piece';

// flagReplacement marks every piece as "needs swap" — used when previewing a fresh remix.
const toData = (scheme: SavedScheme, seal?: { seal_tier?: string; status?: string; official_feed_eligible?: boolean }, flagReplacement = false): OutfitCardData => {
  const pieces = Array.isArray(scheme.pieces)
    ? scheme.pieces.map((piece, index) => ({
        id: piece.id ?? piece.piece_id ?? `${scheme.scheme_id}-piece-${index}`,
        name: piece.name ?? piece.piece_name ?? 'Selected piece',
        brand: piece.brand ?? piece.brand_name ?? 'Brand',
        brandLogoUrl: piece.brandLogoUrl ?? piece.brand_logo_url,
        pieceType: piece.pieceType ?? piece.piece_type ?? 'Garment',
        category: piece.category,
        wearstyles: piece.wearstyles,
        needsReplacement: flagReplacement,
      }))
    : [];

  const metaBadges = [
    { icon: '💡', label: 'Inspiração' },
    { icon: scheme.visibility === 'public' ? '🌐' : scheme.visibility === 'followers' ? '👥' : '🔒', label: scheme.visibility === 'public' ? 'Público' : scheme.visibility === 'followers' ? 'Seguidores' : 'Privado' },
  ];

  if (seal?.seal_tier === 'premium') metaBadges.unshift({ icon: '🏅', label: 'Selo Premium' });
  else if (seal?.seal_tier === 'free') metaBadges.unshift({ icon: '✦', label: 'Selo Gratuito' });
  if (seal?.official_feed_eligible) metaBadges.unshift({ icon: '⭐', label: 'Feed oficial' });

  return {
    outfitName: scheme.title,
    outfitStyleLine: `${scheme.style} · ${scheme.occasion}`,
    outfitDescription: undefined, // let OutfitCard build fallback from pieces
    heroImageUrl: scheme.cover_image_url || '/welcome-newcomers.png',
    outfitBackground: parseBackground(scheme.description),
    metaBadges,
    pieces,
  };
};

// Builds the POST body that forks a saved scheme into the current user's account (Option B:
// pieces are carried as references — prefixed `suggested:` so they are NOT pulled into the
// user's wardrobe and are flagged to be swapped for pieces the user actually owns).
function buildRemixBody(scheme: SavedScheme, userId: string) {
  const snapshots = Array.isArray(scheme.pieces) ? scheme.pieces : [];

  const pieces = snapshots.map((piece, index) => {
    const originalId = piece.sourceId ?? piece.id ?? piece.piece_id ?? `piece-${index}`;
    const name = piece.name ?? piece.piece_name ?? 'Selected piece';
    const slot = deriveSlot(piece.pieceType ?? piece.piece_type, piece.slot);
    return {
      id: `remix-${scheme.scheme_id}-${index}`,
      slot,
      sourceType: 'suggested' as const,
      sourceId: `suggested:${originalId}:${slugify(name)}`,
      name,
      brand: piece.brand ?? piece.brand_name ?? 'Brand',
      brandLogoUrl: piece.brandLogoUrl ?? piece.brand_logo_url,
      category: piece.category ?? 'Standard',
      pieceType: piece.pieceType ?? piece.piece_type ?? 'Garment',
      wearstyles: piece.wearstyles ?? [],
      needsReplacement: true,
    };
  });

  const items = pieces.map((piece, index) => ({
    wardrobe_item_id: piece.sourceId, // `suggested:` prefix → skipped by wardrobe validation
    slot: piece.slot,
    sort_order: index + 1,
  }));

  return {
    user_id: userId,
    title: `${scheme.title} (Remix)`,
    description: scheme.description ?? undefined, // preserves background studio config
    creation_mode: 'manual' as const,
    style: scheme.style,
    occasion: scheme.occasion,
    visibility: 'private' as const, // remix always starts as a private draft
    cover_image_url: scheme.cover_image_url ?? undefined,
    pieces,
    items,
  };
}

export default function ProfileSavedSchemesSection({ userId }: ProfileSavedSchemesSectionProps) {
  const [exportingScheme, setExportingScheme] = useState<SavedScheme | null>(null);
  // Schemes favorited from other users' public cards, fetched via the outfit_favorites collection
  const [favoriteSchemes, setFavoriteSchemes] = useState<SavedScheme[] | null>(null);
  // Remix flow: the scheme currently previewed in the light modal, plus loading/error state.
  const [remixedScheme, setRemixedScheme] = useState<SavedScheme | null>(null);
  const [remixingId, setRemixingId] = useState<string | null>(null);
  const [remixError, setRemixError] = useState<string | null>(null);
  const [sealByUserId, setSealByUserId] = useState<Record<string, { seal_tier?: string; status?: string; official_feed_eligible?: boolean }>>({});
  // "Tenho peças parecidas" — maps a saved look to the viewer's own closet items.
  const [similarScheme, setSimilarScheme] = useState<SavedScheme | null>(null);
  const [similarLoading, setSimilarLoading] = useState(false);
  const [similarResults, setSimilarResults] = useState<SimilarResult[] | null>(null);

  useEffect(() => {
    const loadFavorites = async () => {
      if (!userId) {
        setFavoriteSchemes([]);
        return;
      }
      const favoritesResponse = await fetch(`/api/outfit-favorites?userId=${encodeURIComponent(userId)}`);
      const favoritesPayload = await favoritesResponse.json().catch(() => ({ favorites: [] }));
      const favoriteIds = Array.isArray(favoritesPayload?.favorites)
        ? (favoritesPayload.favorites as { schemeId?: string }[]).map((entry) => entry.schemeId).filter(Boolean)
        : [];
      if (!favoriteIds.length) {
        setFavoriteSchemes([]);
        return;
      }

      const publicResponse = await fetch('/api/schemes/public');
      const publicSchemes = await publicResponse.json().catch(() => []);
      const onlyFavorites = Array.isArray(publicSchemes)
        ? (publicSchemes as SavedScheme[]).filter((scheme) => (favoriteIds as string[]).includes(scheme.scheme_id))
        : [];
      setFavoriteSchemes(onlyFavorites);
    };

    loadFavorites().catch(() => setFavoriteSchemes([]));
  }, [userId]);

  useEffect(() => {
    if (!favoriteSchemes?.length) {
      setSealByUserId({});
      return;
    }

    const uniqueUserIds = Array.from(new Set(favoriteSchemes.map((scheme) => scheme.user_id).filter(Boolean) as string[]));
    if (!uniqueUserIds.length) {
      setSealByUserId({});
      return;
    }

    let cancelled = false;
    Promise.all(uniqueUserIds.map((userId) => fetch(`/api/brand-seals?userId=${encodeURIComponent(userId)}`).then((res) => (res.ok ? res.json() : null)).catch(() => null)))
      .then((responses) => {
        if (cancelled) return;
        const nextMap: Record<string, { seal_tier?: string; status?: string; official_feed_eligible?: boolean }> = {};
        responses.forEach((payload, index) => {
          const userId = uniqueUserIds[index];
          if (userId && payload?.seal) nextMap[userId] = payload.seal;
        });
        setSealByUserId(nextMap);
      })
      .catch(() => {
        if (!cancelled) setSealByUserId({});
      });

    return () => { cancelled = true; };
  }, [favoriteSchemes]);

  // Forks a saved scheme into the current user's account, then opens the preview modal.
  const handleRemix = async (scheme: SavedScheme) => {
    if (!userId || remixingId) return;
    setRemixingId(scheme.scheme_id);
    setRemixError(null);
    try {
      const response = await fetch('/api/schemes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildRemixBody(scheme, userId)),
      });
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload?.error || 'Não foi possível remixar este esquema.');
      }
      const created = await response.json().catch(() => null);
      const newSchemeId = created?.scheme?.scheme_id ?? `${scheme.scheme_id}-remix`;
      // Preview the fresh remix as a private draft with every piece flagged for swap.
      setRemixedScheme({
        ...scheme,
        scheme_id: newSchemeId,
        title: `${scheme.title} (Remix)`,
        visibility: 'private',
      });
    } catch (error) {
      setRemixError(error instanceof Error ? error.message : 'Erro inesperado ao remixar.');
    } finally {
      setRemixingId(null);
    }
  };

  // Maps the saved look to pieces the viewer already owns (no piece is copied).
  const handleSimilar = async (scheme: SavedScheme) => {
    if (!userId) return;
    setSimilarScheme(scheme);
    setSimilarLoading(true);
    setSimilarResults(null);
    try {
      const res = await fetch('/api/inspirations/similar-pieces', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, schemeId: scheme.scheme_id }),
      });
      const payload = await res.json().catch(() => ({}));
      setSimilarResults(res.ok && Array.isArray(payload?.results) ? (payload.results as SimilarResult[]) : []);
    } catch {
      setSimilarResults([]);
    } finally {
      setSimilarLoading(false);
    }
  };

  // Show loading state until favorites are resolved; then show only actual saved (favorited) cards
  const cards = useMemo(() => {
    if (favoriteSchemes === null) return null; // still loading
    return favoriteSchemes.map((scheme) => ({ scheme, data: toData(scheme, sealByUserId[scheme.user_id || '']) }));
  }, [favoriteSchemes, sealByUserId]);

  return (
    <>
      <SectionBlock title="Inspirações" subtitle="Looks de outros criadores que você salvou. As peças NÃO são copiadas para o seu guarda-roupa — use “Tenho peças parecidas” para encontrar itens equivalentes no seu closet.">
        {remixError ? (
          <p className="mt-3 rounded-lg border border-red-400/40 bg-red-500/10 px-3 py-2 text-xs text-red-200">{remixError}</p>
        ) : null}
        <div className="mt-4 grid justify-items-center gap-6 [grid-template-columns:repeat(auto-fit,minmax(min(100%,900px),1fr))]">
          {cards === null ? (
            <p className="text-sm text-white/60">Carregando esquemas salvos…</p>
          ) : cards.length ? (
            cards.map(({ scheme, data }) => (
              <div key={scheme.scheme_id} className="w-full max-w-[980px]">
                <OutfitCard
                  data={data}
                  variant="default"
                  actions={[
                    { label: 'Abrir', onClick: () => setRemixedScheme(scheme), tone: 'accent' },
                    { label: '🔎 Tenho peças parecidas', onClick: () => void handleSimilar(scheme), tone: 'accent' },
                    { label: 'Exportar', onClick: () => setExportingScheme(scheme), tone: 'accent' },
                    {
                      label: remixingId === scheme.scheme_id ? 'Remixando…' : 'Remixar',
                      onClick: () => handleRemix(scheme),
                      tone: 'accent',
                    },
                    { label: 'Remover', tone: 'danger' },
                  ]}
                />
              </div>
            ))
          ) : (
            <p className="text-sm text-white/80">Nenhuma inspiração salva ainda. Favorite looks públicos da comunidade para guardá-los aqui.</p>
          )}
        </div>
      </SectionBlock>

      {/* Light preview modal — renders the (remixed) scheme with a ~30% wider card so the full
          piece list fits inside the scheme borders instead of overflowing the compact grid cell. */}
      {remixedScheme ? (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4"
          onClick={() => setRemixedScheme(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/15 bg-slate-950/95 p-4 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <h3 className="truncate text-base font-semibold text-white">{remixedScheme.title}</h3>
                <p className="text-xs text-amber-200/80">Rascunho privado · troque as peças marcadas por peças do seu guarda-roupa.</p>
              </div>
              <button
                type="button"
                onClick={() => setRemixedScheme(null)}
                className="shrink-0 rounded-lg border border-white/30 px-2.5 py-1 text-xs font-semibold text-white"
              >
                Fechar
              </button>
            </div>
            <OutfitCard data={toData(remixedScheme, sealByUserId[remixedScheme.user_id || ''], true)} variant="default" />
          </div>
        </div>
      ) : null}

      {similarScheme ? (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4"
          onClick={() => setSimilarScheme(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-white/15 bg-slate-950/95 p-4 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <h3 className="truncate text-base font-semibold text-white">Peças parecidas no seu closet</h3>
                <p className="text-xs text-white/55">Mapeamento de “{similarScheme.title}” para itens que você já possui.</p>
              </div>
              <button
                type="button"
                onClick={() => setSimilarScheme(null)}
                className="shrink-0 rounded-lg border border-white/30 px-2.5 py-1 text-xs font-semibold text-white"
              >
                Fechar
              </button>
            </div>

            {similarLoading ? (
              <p className="py-6 text-center text-sm text-white/60">Procurando peças parecidas…</p>
            ) : !similarResults || !similarResults.length ? (
              <p className="py-6 text-center text-sm text-white/60">Não encontramos peças correspondentes no seu guarda-roupa.</p>
            ) : (
              <div className="flex flex-col gap-4">
                {similarResults.map((result, idx) => (
                  <div key={`${result.look_piece.name}-${idx}`} className="rounded-2xl border border-white/12 bg-white/5 p-3">
                    <p className="text-[11px] uppercase tracking-[0.12em] text-white/45">{result.look_piece.slot}</p>
                    <p className="text-sm font-semibold text-white">{result.look_piece.name}</p>
                    {result.matches.length ? (
                      <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                        {result.matches.map((match) => (
                          <div key={match.wardrobe_item_id} className="rounded-xl border border-white/12 bg-black/20 p-1.5">
                            <div className="relative h-16 w-full overflow-hidden rounded-lg bg-black/30">
                              {match.image_url ? (
                                <Image src={match.image_url} alt={match.name} width={120} height={64} className="h-full w-full object-cover" unoptimized />
                              ) : null}
                            </div>
                            <p className="mt-1 truncate text-[11px] font-medium text-white/90">{match.name}</p>
                            <p className="truncate text-[10px] text-white/45">{match.piece_type}{match.color ? ` · ${match.color}` : ''}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-1 text-xs text-amber-200/80">Nenhuma peça parecida — talvez uma oportunidade para adicionar ao closet.</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : null}

      {exportingScheme ? (
        <OutfitExportModal
          open={Boolean(exportingScheme)}
          onClose={() => setExportingScheme(null)}
          userId={userId}
          outfitId={exportingScheme.scheme_id}
          schemeId={exportingScheme.scheme_id}
          title={exportingScheme.title}
          sourceImageUrl={exportingScheme.cover_image_url || '/welcome-newcomers.png'}
          defaultCaption={`${exportingScheme.title} from my Saved Looks in SAI`}
        />
      ) : null}
    </>
  );
}
