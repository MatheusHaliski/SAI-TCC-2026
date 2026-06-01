'use client';

import { useEffect, useMemo, useState } from 'react';
import SectionBlock from '@/app/components/shared/SectionBlock';
import OutfitCard from '@/app/components/outfit-card/OutfitCard';
import OutfitExportModal from '@/app/components/profile/OutfitExportModal';
import { OutfitCardData, OutfitBackgroundConfig } from '@/app/lib/outfit-card';

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
  visibility: 'public' | 'private';
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
const toData = (scheme: SavedScheme, flagReplacement = false): OutfitCardData => {
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

  return {
    outfitName: scheme.title,
    outfitStyleLine: `${scheme.style} · ${scheme.occasion}`,
    outfitDescription: undefined, // let OutfitCard build fallback from pieces
    heroImageUrl: scheme.cover_image_url || '/welcome-newcomers.png',
    outfitBackground: parseBackground(scheme.description),
    metaBadges: [
      { icon: '💾', label: 'Salvo' },
      { icon: scheme.visibility === 'public' ? '🌐' : '🔒', label: scheme.visibility === 'public' ? 'Público' : 'Privado' },
    ],
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

  // Show loading state until favorites are resolved; then show only actual saved (favorited) cards
  const cards = useMemo(() => {
    if (favoriteSchemes === null) return null; // still loading
    return favoriteSchemes.map((scheme) => ({ scheme, data: toData(scheme) }));
  }, [favoriteSchemes]);

  return (
    <>
      <SectionBlock title="Esquemas Salvos" subtitle="Cards de look salvos dos outros criadores da comunidade.">
        {remixError ? (
          <p className="mt-3 rounded-lg border border-red-400/40 bg-red-500/10 px-3 py-2 text-xs text-red-200">{remixError}</p>
        ) : null}
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          {cards === null ? (
            <p className="text-sm text-white/60">Carregando esquemas salvos…</p>
          ) : cards.length ? (
            cards.map(({ scheme, data }) => (
              <OutfitCard
                key={scheme.scheme_id}
                data={data}
                variant="compact"
                actions={[
                  { label: 'Abrir', onClick: () => setRemixedScheme(scheme), tone: 'accent' },
                  { label: 'Editar', onClick: () => setRemixedScheme(scheme) },
                  { label: 'Exportar', onClick: () => setExportingScheme(scheme), tone: 'accent' },
                  {
                    label: remixingId === scheme.scheme_id ? 'Remixando…' : 'Remixar',
                    onClick: () => handleRemix(scheme),
                    tone: 'accent',
                  },
                  { label: 'Remover', tone: 'danger' },
                ]}
              />
            ))
          ) : (
            <p className="text-sm text-white/80">Nenhum esquema salvo ainda. Favorite cards públicos para vê-los aqui.</p>
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
            <OutfitCard data={toData(remixedScheme, true)} variant="default" />
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
