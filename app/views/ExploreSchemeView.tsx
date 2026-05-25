'use client';

import { useEffect, useMemo, useState } from 'react';
import OutfitCard from '@/app/components/outfit-card/OutfitCard';
import PageHeader from '@/app/components/shell/PageHeader';
import SectionBlock from '@/app/components/shared/SectionBlock';
import { OutfitCardData, buildOutfitDescriptionFallback } from '@/app/lib/outfit-card';

type SlotKey = 'upper' | 'lower' | 'shoes' | 'accessory';
type Scheme = {
  scheme_id: string;
  title: string;
  description?: string | null;
  style: string;
  occasion: string;
  cover_image_url: string | null;
  user_id: string;
  pieces?: SchemePieceSnapshot[];
};
type SchemePieceSnapshot = {
  id: string;
  slot: SlotKey;
  sourceType: 'wardrobe' | 'suggested';
  sourceId: string;
  name: string;
  brand: string;
  brandLogoUrl?: string;
  category: 'Premium' | 'Standard' | 'Limited Edition' | 'Rare';
  pieceType: string;
  wearstyles: string[];
};
type SchemeDetailItem = {
  scheme_item_id: string;
  wardrobe_item_id: string;
  slot: SlotKey;
  wardrobe_name: string;
  image_url: string;
};
type SchemeDetailsResponse = {
  scheme: Scheme;
  items: SchemeDetailItem[];
};

type FilterTab = 'all' | 'favorites' | 'available' | 'unavailable';

const SLOT_PREVIEW_DEFAULTS: Record<
  SlotKey,
  { pieceType: string; category: 'Premium' | 'Standard' | 'Limited Edition' | 'Rare'; wearstyles: string[] }
> = {
  upper: { pieceType: 'Jacket', category: 'Premium', wearstyles: ['Statement Piece', 'Visual Anchor'] },
  lower: { pieceType: 'Pants', category: 'Standard', wearstyles: ['Base Structure', 'Balanced Fit'] },
  shoes: { pieceType: 'Footwear', category: 'Rare', wearstyles: ['Trend Driver', 'Street Energy'] },
  accessory: { pieceType: 'Accessory', category: 'Limited Edition', wearstyles: ['Style Accent', 'Attention Grabber'] },
};

const toReadableSuggestedName = (value: string) => {
  const [, , slug = 'selected-piece'] = value.split(':');
  return slug
    .replaceAll('-', ' ')
    .split(' ')
    .filter(Boolean)
    .map((token) => `${token[0]?.toUpperCase() ?? ''}${token.slice(1)}`)
    .join(' ');
};

const FILTER_TABS: Array<{ key: FilterTab; label: string }> = [
  { key: 'all', label: 'Todos' },
  { key: 'favorites', label: 'Favoritos' },
  { key: 'available', label: 'Disponíveis' },
  { key: 'unavailable', label: 'Indisponíveis' },
];

export default function ExploreSchemeView() {
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [availability, setAvailability] = useState<Record<string, 'available' | 'unavailable'>>({});
  const [itemsBySchemeId, setItemsBySchemeId] = useState<Record<string, SchemeDetailItem[]>>({});
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');

  useEffect(() => {
    const loadSchemesWithItems = async () => {
      const response = await fetch('/api/schemes/public');
      const data = await response.json();
      const safeSchemes = Array.isArray(data) ? (data as Scheme[]) : [];
      setSchemes(safeSchemes);

      const detailResponses = await Promise.all(
        safeSchemes.map((scheme) =>
          fetch(`/api/schemes/${scheme.scheme_id}`)
            .then((res) => (res.ok ? res.json() : null))
            .catch(() => null),
        ),
      );

      const nextItemsBySchemeId: Record<string, SchemeDetailItem[]> = {};

      detailResponses.forEach((details, index) => {
        const currentScheme = safeSchemes[index];
        const detailPayload = details as SchemeDetailsResponse | null;
        nextItemsBySchemeId[currentScheme.scheme_id] = detailPayload?.items ?? [];
      });

      setItemsBySchemeId(nextItemsBySchemeId);
    };

    loadSchemesWithItems().catch(() => {
      setSchemes([]);
      setItemsBySchemeId({});
    });
  }, []);

  const buildOutfitPreviewData = (scheme: Scheme): OutfitCardData => {
    const styleLine = `${scheme.style || 'Streetwear'} • ${scheme.occasion || 'General'}`;
    const relatedItems = itemsBySchemeId[scheme.scheme_id] ?? [];
    const savedPieces = Array.isArray(scheme.pieces) ? scheme.pieces : [];
    let parsedBackground: OutfitCardData['outfitBackground'] = undefined;

    try {
      const parsedDescription = scheme.description ? JSON.parse(scheme.description) : null;
      if (parsedDescription?.outfitBackground) {
        parsedBackground = parsedDescription.outfitBackground;
      }
    } catch {
      parsedBackground = undefined;
    }

    const normalizedPieces = savedPieces.length
      ? savedPieces.map((piece, index) => ({
          id: (piece as { id?: string; piece_id?: string }).id
            || (piece as { id?: string; piece_id?: string }).piece_id
            || `${scheme.scheme_id}-piece-${index}`,
          name: (piece as { name?: string; piece_name?: string }).name
            || (piece as { name?: string; piece_name?: string }).piece_name
            || 'Selected piece',
          brand: (piece as { brand?: string; brand_name?: string }).brand
            || (piece as { brand?: string; brand_name?: string }).brand_name
            || 'Selection Default Brand',
          brandLogoUrl: (piece as { brandLogoUrl?: string; brand_logo_url?: string }).brandLogoUrl
            || (piece as { brandLogoUrl?: string; brand_logo_url?: string }).brand_logo_url,
          pieceType: (piece as { pieceType?: string; piece_type?: string }).pieceType
            || (piece as { pieceType?: string; piece_type?: string }).piece_type
            || 'Garment',
          category: piece.category,
          wearstyles: piece.wearstyles,
        }))
      : relatedItems.length
        ? relatedItems.map((item) => {
            const derivedName = item.wardrobe_name?.trim()
              || (item.wardrobe_item_id.startsWith('suggested:')
                ? toReadableSuggestedName(item.wardrobe_item_id)
                : 'Selected piece');
            return {
              id: item.scheme_item_id,
              name: derivedName,
              brand: 'Selection Default Brand',
              pieceType: SLOT_PREVIEW_DEFAULTS[item.slot].pieceType,
              category: SLOT_PREVIEW_DEFAULTS[item.slot].category,
              wearstyles: SLOT_PREVIEW_DEFAULTS[item.slot].wearstyles,
              pieceTypeIconUrl: item.image_url || undefined,
            };
          })
        : [];

    return {
      outfitName: scheme.title || 'Untitled Outfit',
      outfitStyleLine: styleLine,
      outfitDescription: buildOutfitDescriptionFallback({
        pieces: normalizedPieces,
        outfitStyleLine: `${scheme.style || 'Minimal'} ${scheme.occasion || 'General'}`,
        outfitName: scheme.title || 'Untitled Outfit',
      }),
      heroImageUrl: scheme.cover_image_url || '/welcome-newcomers.png',
      outfitBackground: parsedBackground,
      pieces: normalizedPieces,
    };
  };

  const filteredSchemes = useMemo(() => {
    switch (activeFilter) {
      case 'favorites':
        return schemes.filter((s) => favorites[s.scheme_id]);
      case 'available':
        return schemes.filter((s) => (availability[s.scheme_id] ?? 'available') === 'available');
      case 'unavailable':
        return schemes.filter((s) => availability[s.scheme_id] === 'unavailable');
      default:
        return schemes;
    }
  }, [activeFilter, favorites, availability, schemes]);

  const grouped = useMemo(() => {
    const byOccasion = new Map<string, Scheme[]>();
    filteredSchemes.forEach((scheme) => {
      const key = scheme.occasion || 'Geral';
      byOccasion.set(key, [...(byOccasion.get(key) ?? []), scheme]);
    });
    return Array.from(byOccasion.entries());
  }, [filteredSchemes]);

  const emptyMessage: Record<FilterTab, string> = {
    all: 'Nenhum card de look disponível.',
    favorites: 'Nenhum card favoritado ainda.',
    available: 'Nenhum card disponível.',
    unavailable: 'Nenhum card indisponível.',
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"1.5rem" }}>
      <PageHeader title="Cards de Look Salvos" subtitle="Gerencie looks por ocasião, preferência, favoritos e disponibilidade." />

      {/* Filter pills */}
      <div style={{ display:"flex", flexWrap:"wrap", gap:"0.5rem", borderRadius:"1rem", border:"1px solid var(--border)", background:"var(--accent)", padding:"0.75rem" }}>
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveFilter(tab.key)}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
              activeFilter === tab.key
                ? 'border-cyan-400/70 bg-cyan-500/20 text-cyan-100 shadow-[0_0_12px_rgba(34,211,238,0.2)]'
                : 'border-border bg-accent text-muted-foreground hover:border-white/35 hover:bg-accent hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {grouped.length === 0 ? (
        <p style={{ fontSize:"0.875rem", color:"var(--muted-foreground)", padding:"2rem", textAlign:"center" }}>{emptyMessage[activeFilter]}</p>
      ) : (
        grouped.map(([occasion, occasionSchemes]) => (
          <SectionBlock key={occasion} title={`Ocasião: ${occasion}`} subtitle="Looks agrupados por ocasião.">
            <div style={{ marginTop:"1rem", display:"grid", gap:"1rem", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))" }}>
              {occasionSchemes.map((scheme) => (
                <article key={scheme.scheme_id} style={{ display:"flex", flexDirection:"column", gap:"0.75rem", borderRadius:"1rem", border:"1px solid var(--border)", background:"var(--card)", padding:"0.75rem", boxShadow:"var(--shadow-sm)" }}>
                  <OutfitCard data={buildOutfitPreviewData(scheme)} />
                  <div style={{ borderRadius:"0.75rem", border:"1px solid var(--border)", background:"var(--accent)", padding:"0.75rem", fontSize:"0.75rem", color:"var(--foreground)" }}>
                    <p>Status: {availability[scheme.scheme_id] === 'unavailable' ? 'indisponível' : 'disponível'}</p>
                    <p>Favorito: {favorites[scheme.scheme_id] ? 'sim' : 'não'}</p>
                    <div style={{ marginTop:"0.5rem", display:"flex", flexWrap:"wrap", gap:"0.5rem" }}>
                      <button
                        type="button"
                        onClick={() => setFavorites((prev) => ({ ...prev, [scheme.scheme_id]: !prev[scheme.scheme_id] }))}
                        style={{ borderRadius:"0.5rem", border: favorites[scheme.scheme_id] ? "1px solid rgba(245,158,11,0.5)" : "1px solid var(--border)", padding:"0.25rem 0.5rem", fontSize:"0.75rem", fontWeight:600, cursor:"pointer", background: favorites[scheme.scheme_id] ? "rgba(245,158,11,0.15)" : "var(--accent)", color: favorites[scheme.scheme_id] ? "#fcd34d" : "var(--foreground)", fontFamily:"inherit" }}
                      >
                        ★ Favorito
                      </button>
                      <button
                        type="button"
                        onClick={() => setAvailability((prev) => ({ ...prev, [scheme.scheme_id]: 'available' }))}
                        style={{ borderRadius:"0.5rem", border: (availability[scheme.scheme_id] ?? 'available') === 'available' ? "1px solid rgba(16,185,129,0.5)" : "1px solid var(--border)", padding:"0.25rem 0.5rem", fontSize:"0.75rem", fontWeight:600, cursor:"pointer", background: (availability[scheme.scheme_id] ?? 'available') === 'available' ? "rgba(16,185,129,0.15)" : "var(--accent)", color: (availability[scheme.scheme_id] ?? 'available') === 'available' ? "#6ee7b7" : "var(--foreground)", fontFamily:"inherit" }}
                      >
                        Disponível
                      </button>
                      <button
                        type="button"
                        onClick={() => setAvailability((prev) => ({ ...prev, [scheme.scheme_id]: 'unavailable' }))}
                        style={{ borderRadius:"0.5rem", border: availability[scheme.scheme_id] === 'unavailable' ? "1px solid rgba(239,68,68,0.5)" : "1px solid var(--border)", padding:"0.25rem 0.5rem", fontSize:"0.75rem", fontWeight:600, cursor:"pointer", background: availability[scheme.scheme_id] === 'unavailable' ? "rgba(239,68,68,0.15)" : "var(--accent)", color: availability[scheme.scheme_id] === 'unavailable' ? "#fca5a5" : "var(--foreground)", fontFamily:"inherit" }}
                      >
                        Indisponível
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </SectionBlock>
        ))
      )}
    </div>
  );
}
