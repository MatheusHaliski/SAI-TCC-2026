'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import OutfitCard from '@/app/components/outfit-card/OutfitCard';
import PageHeader from '@/app/components/shell/PageHeader';
import SectionBlock from '@/app/components/shared/SectionBlock';
import { OutfitCardData, buildOutfitDescriptionFallback } from '@/app/lib/outfit-card';
import { getLS, setLS } from '@/app/lib/SafeStorage';
import OutfitDetailModal from '@/app/components/search/OutfitDetailModal';
import { getAuthSessionProfile } from '@/app/lib/authSession';
import { getSharedAccessData } from '@/app/lib/accessTokenShare';

/* ── Types ── */
type SlotKey = 'upper' | 'lower' | 'shoes' | 'accessory';
type Scheme = {
  scheme_id: string; title: string; description?: string | null;
  style: string; occasion: string; cover_image_url: string | null;
  user_id: string; pieces?: SchemePieceSnapshot[];
};
type SchemePieceSnapshot = {
  id: string; slot: SlotKey; sourceType: 'wardrobe' | 'suggested';
  sourceId: string; name: string; brand: string; brandLogoUrl?: string;
  category: 'Premium' | 'Standard' | 'Limited Edition' | 'Rare';
  pieceType: string; wearstyles: string[];
};
type SchemeDetailItem = {
  scheme_item_id: string; wardrobe_item_id: string;
  slot: SlotKey; wardrobe_name: string; image_url: string;
};
type SchemeDetailsResponse = { scheme: Scheme; items: SchemeDetailItem[] };
type FilterTab = 'all' | 'favorites' | 'available' | 'unavailable';

const SLOT_DEFAULTS: Record<SlotKey, { pieceType: string; category: 'Premium' | 'Standard' | 'Limited Edition' | 'Rare'; wearstyles: string[] }> = {
  upper:     { pieceType: 'Jacket',    category: 'Premium',         wearstyles: ['Statement Piece', 'Visual Anchor'] },
  lower:     { pieceType: 'Pants',     category: 'Standard',        wearstyles: ['Base Structure', 'Balanced Fit'] },
  shoes:     { pieceType: 'Footwear',  category: 'Rare',            wearstyles: ['Trend Driver', 'Street Energy'] },
  accessory: { pieceType: 'Accessory', category: 'Limited Edition', wearstyles: ['Style Accent', 'Attention Grabber'] },
};

const toReadableSuggestedName = (value: string) => {
  const [,, slug = 'selected-piece'] = value.split(':');
  return slug.replaceAll('-', ' ').split(' ').filter(Boolean)
    .map((t) => `${t[0]?.toUpperCase() ?? ''}${t.slice(1)}`).join(' ');
};

const FILTER_TABS: Array<{ key: FilterTab; label: string }> = [
  { key: 'all',         label: 'Todos'        },
  { key: 'favorites',   label: 'Favoritos'    },
  { key: 'available',   label: 'Disponíveis'  },
  { key: 'unavailable', label: 'Indisponíveis'},
];

const LS_FAVORITES    = 'sai_explore_favorites';
const LS_AVAILABILITY = 'sai_explore_availability';

function resolveUserId(): string {
  const profile = getAuthSessionProfile();
  if (profile.user_id?.trim()) return profile.user_id.trim();
  const shared = getSharedAccessData();
  if (shared?.profile?.user_id?.trim()) return shared.profile.user_id.trim();
  const keys = ['restaurantcards_auth_profile', 'stylistai_content_access_data', 'sai_auth_profile'];
  for (const key of keys) {
    try {
      const raw = getLS(key);
      if (!raw) continue;
      const parsed = JSON.parse(raw) as Record<string, unknown>;
      const uid = (parsed.user_id ?? parsed.uid ?? (parsed.profile as Record<string,unknown>)?.user_id ?? (parsed.profile as Record<string,unknown>)?.uid) as string | undefined;
      if (uid?.trim()) return uid.trim();
    } catch {}
  }
  return '';
}

export default function ExploreSchemeView() {
  const [schemes,         setSchemes]         = useState<Scheme[]>([]);
  const [favorites,       setFavorites]       = useState<Record<string, boolean>>({});
  const [availability,    setAvailability]    = useState<Record<string, 'available' | 'unavailable'>>({});
  const [itemsBySchemeId, setItemsBySchemeId] = useState<Record<string, SchemeDetailItem[]>>({});
  const [activeFilter,    setActiveFilter]    = useState<FilterTab>('all');
  const [togglingId,      setTogglingId]      = useState<string | null>(null);
  const [selectedCard,    setSelectedCard]    = useState<OutfitCardData | null>(null);
  const [modalOpen,       setModalOpen]       = useState(false);
  const [sealByUserId,    setSealByUserId]    = useState<Record<string, { seal_tier?: string; status?: string; official_feed_eligible?: boolean }>>({});

  const resolvedUserId = useRef<string>('');

  useEffect(() => {
    const uid = resolveUserId();
    resolvedUserId.current = uid;
    try { const s = getLS(LS_FAVORITES);    if (s) setFavorites(JSON.parse(s));    } catch {}
    try { const s = getLS(LS_AVAILABILITY); if (s) setAvailability(JSON.parse(s)); } catch {}
    if (uid) {
      fetch(`/api/outfit-favorites?userId=${encodeURIComponent(uid)}`)
        .then((r) => r.json())
        .then((data: unknown) => {
          const d = data as { ok?: boolean; favorites?: Array<{ schemeId: string }> };
          if (d.ok && Array.isArray(d.favorites)) {
            const map: Record<string, boolean> = {};
            d.favorites.forEach((f) => { if (f.schemeId) map[f.schemeId] = true; });
            setFavorites(map);
            setLS(LS_FAVORITES, JSON.stringify(map));
          }
        }).catch(() => {});
    }
  }, []);

  useEffect(() => { setLS(LS_AVAILABILITY, JSON.stringify(availability)); }, [availability]);

  useEffect(() => {
    const load = async () => {
      const res  = await fetch('/api/schemes/public');
      const data = await res.json();
      const safe = Array.isArray(data) ? (data as Scheme[]) : [];
      setSchemes(safe);
      const details = await Promise.all(
        safe.map((s) => fetch(`/api/schemes/${s.scheme_id}`).then((r) => r.ok ? r.json() : null).catch(() => null))
      );
      const map: Record<string, SchemeDetailItem[]> = {};
      details.forEach((d, i) => { map[safe[i].scheme_id] = (d as SchemeDetailsResponse | null)?.items ?? []; });
      setItemsBySchemeId(map);

      const uniqueUserIds = Array.from(new Set(safe.map((scheme) => scheme.user_id).filter(Boolean)));
      if (uniqueUserIds.length > 0) {
        const responses = await Promise.all(
          uniqueUserIds.map((userId) => fetch(`/api/brand-seals?userId=${encodeURIComponent(userId)}`).then((res) => (res.ok ? res.json() : null)).catch(() => null))
        );
        const nextSealMap: Record<string, { seal_tier?: string; status?: string; official_feed_eligible?: boolean }> = {};
        responses.forEach((payload, index) => {
          const userId = uniqueUserIds[index];
          if (userId && payload?.seal) nextSealMap[userId] = payload.seal;
        });
        setSealByUserId(nextSealMap);
      } else {
        setSealByUserId({});
      }
    };
    load().catch(() => { setSchemes([]); setItemsBySchemeId({}); setSealByUserId({}); });
  }, []);

  const toggleFavorite = async (schemeId: string) => {
    if (togglingId === schemeId) return;
    setTogglingId(schemeId);
    const uid    = resolvedUserId.current;
    const newVal = !favorites[schemeId];
    setFavorites((prev) => { const next = { ...prev, [schemeId]: newVal }; setLS(LS_FAVORITES, JSON.stringify(next)); return next; });
    if (!uid) { setTogglingId(null); return; }
    try {
      const res = await fetch('/api/outfit-favorites', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: uid, schemeId, favorite: newVal }),
      });
      if (!res.ok) throw new Error('API error');
    } catch {
      setFavorites((prev) => { const r = { ...prev, [schemeId]: !newVal }; setLS(LS_FAVORITES, JSON.stringify(r)); return r; });
    } finally { setTogglingId(null); }
  };

  const setAvail = (id: string, val: 'available' | 'unavailable') =>
    setAvailability((prev) => ({ ...prev, [id]: val }));

  const buildOutfitPreviewData = (scheme: Scheme): OutfitCardData => {
    const styleLine    = `${scheme.style || 'Streetwear'} • ${scheme.occasion || 'General'}`;
    const relatedItems = itemsBySchemeId[scheme.scheme_id] ?? [];
    const savedPieces  = Array.isArray(scheme.pieces) ? scheme.pieces : [];
    let parsedBackground: OutfitCardData['outfitBackground'] = undefined;
    try { const p = scheme.description ? JSON.parse(scheme.description) : null; if (p?.outfitBackground) parsedBackground = p.outfitBackground; } catch {}

    const pieces = savedPieces.length
      ? savedPieces.map((piece, i) => ({
          id: (piece as { id?: string; piece_id?: string }).id || (piece as { id?: string; piece_id?: string }).piece_id || `${scheme.scheme_id}-${i}`,
          name: (piece as { name?: string; piece_name?: string }).name || (piece as { name?: string; piece_name?: string }).piece_name || 'Selected piece',
          brand: (piece as { brand?: string; brand_name?: string }).brand || (piece as { brand?: string; brand_name?: string }).brand_name || 'Default Brand',
          brandLogoUrl: (piece as { brandLogoUrl?: string; brand_logo_url?: string }).brandLogoUrl || (piece as { brandLogoUrl?: string; brand_logo_url?: string }).brand_logo_url,
          pieceType: (piece as { pieceType?: string; piece_type?: string }).pieceType || (piece as { pieceType?: string; piece_type?: string }).piece_type || 'Garment',
          category: piece.category, wearstyles: piece.wearstyles,
        }))
      : relatedItems.map((item) => ({
          id: item.scheme_item_id,
          name: item.wardrobe_name?.trim() || (item.wardrobe_item_id.startsWith('suggested:') ? toReadableSuggestedName(item.wardrobe_item_id) : 'Selected piece'),
          brand: 'Default Brand',
          pieceType: SLOT_DEFAULTS[item.slot].pieceType,
          category:  SLOT_DEFAULTS[item.slot].category,
          wearstyles: SLOT_DEFAULTS[item.slot].wearstyles,
          pieceTypeIconUrl: item.image_url || undefined,
        }));

    return {
      outfitName: scheme.title || 'Untitled Outfit',
      outfitStyleLine: styleLine,
      outfitDescription: buildOutfitDescriptionFallback({ pieces, outfitStyleLine: `${scheme.style || 'Minimal'} ${scheme.occasion || 'General'}`, outfitName: scheme.title || 'Untitled Outfit' }),
      heroImageUrl: scheme.cover_image_url || '/welcome-newcomers.png',
      outfitBackground: parsedBackground,
      pieces,
    };
  };

  const filteredSchemes = useMemo(() => {
    switch (activeFilter) {
      case 'favorites':   return schemes.filter((s) =>  favorites[s.scheme_id]);
      case 'available':   return schemes.filter((s) => (availability[s.scheme_id] ?? 'available') === 'available');
      case 'unavailable': return schemes.filter((s) =>  availability[s.scheme_id] === 'unavailable');
      default:            return schemes;
    }
  }, [activeFilter, favorites, availability, schemes]);

  const grouped = useMemo(() => {
    const map = new Map<string, Scheme[]>();
    filteredSchemes.forEach((s) => { const k = s.occasion || 'Geral'; map.set(k, [...(map.get(k) ?? []), s]); });
    return Array.from(map.entries());
  }, [filteredSchemes]);

  const favCount = Object.values(favorites).filter(Boolean).length;
  const emptyMsg: Record<FilterTab, string> = {
    all: 'Nenhum card de look disponível.',
    favorites: 'Nenhum look favoritado ainda. Clique em ☆ Favoritar nos cards abaixo.',
    available: 'Nenhum card disponível.',
    unavailable: 'Nenhum card indisponível.',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <PageHeader title="Cards de Look Salvos" subtitle="Gerencie looks por ocasião, preferência, favoritos e disponibilidade." />

      {/* Filter pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', borderRadius: '1rem', border: '1px solid var(--border)', background: 'var(--accent)', padding: '0.75rem', alignItems: 'center' }}>
        {FILTER_TABS.map((tab) => {
          const isActive = activeFilter === tab.key;
          return (
            <button key={tab.key} type="button" onClick={() => setActiveFilter(tab.key)}
              style={{ borderRadius: '9999px', border: isActive ? '1px solid rgba(124,58,237,0.6)' : '1px solid var(--border)', padding: '0.375rem 1rem', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', background: isActive ? 'rgba(124,58,237,0.18)' : 'transparent', color: isActive ? '#c4b5fd' : 'var(--muted-foreground)', transition: 'all 0.15s', fontFamily: 'inherit' }}>
              {tab.label}
              {tab.key === 'favorites' && favCount > 0 && (
                <span style={{ marginLeft: '0.375rem', background: 'rgba(124,58,237,0.4)', borderRadius: '9999px', padding: '0.1rem 0.45rem', fontSize: '0.7rem', fontWeight: 700 }}>{favCount}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Content */}
      {grouped.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--muted-foreground)' }}>
          <p style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{activeFilter === 'favorites' ? '★' : '🔍'}</p>
          <p style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--foreground)' }}>{emptyMsg[activeFilter]}</p>
        </div>
      ) : (
        grouped.map(([occasion, occasionSchemes]) => (
          <SectionBlock key={occasion} title={`Ocasião: ${occasion}`} subtitle="Looks agrupados por ocasião.">
            <div style={{ marginTop: '1rem', display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))' }}>
              {occasionSchemes.map((scheme) => {
                const isFav    = !!favorites[scheme.scheme_id];
                const avail    = availability[scheme.scheme_id] ?? 'available';
                const toggling = togglingId === scheme.scheme_id;
                const seal     = sealByUserId[scheme.user_id];
                const sealLabel = seal?.seal_tier === 'premium'
                  ? 'Selo Premium'
                  : seal?.seal_tier === 'free'
                    ? 'Selo Gratuito'
                    : 'Selo sem destaque';
                return (
                  <article key={scheme.scheme_id}
                    style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', borderRadius: '1rem', border: `1px solid ${isFav ? 'rgba(245,158,11,0.4)' : 'var(--border)'}`, background: 'var(--card)', padding: '0.75rem', boxShadow: isFav ? '0 0 0 2px rgba(245,158,11,0.12)' : 'var(--shadow-sm)', transition: 'all 0.2s' }}>
                    <OutfitCard data={buildOutfitPreviewData(scheme)} />
                    <div style={{ borderRadius: '0.75rem', border: '1px solid var(--border)', background: 'var(--accent)', padding: '0.75rem' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.625rem' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', fontSize: '0.75rem', fontWeight: 600, padding: '0.2rem 0.625rem', borderRadius: '9999px', background: 'rgba(251,191,36,0.10)', color: '#fde68a', border: '1px solid rgba(251,191,36,0.35)' }}>
                          {sealLabel}
                        </span>
                        {seal?.official_feed_eligible ? (
                          <span style={{ display: 'inline-flex', alignItems: 'center', fontSize: '0.75rem', fontWeight: 600, padding: '0.2rem 0.625rem', borderRadius: '9999px', background: 'rgba(124,58,237,0.14)', color: '#ddd6fe', border: '1px solid rgba(124,58,237,0.35)' }}>
                            Feed oficial
                          </span>
                        ) : null}
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.625rem', flexWrap: 'wrap' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', fontSize: '0.75rem', fontWeight: 600, padding: '0.2rem 0.625rem', borderRadius: '9999px', background: isFav ? 'rgba(245,158,11,0.15)' : 'var(--muted)', color: isFav ? '#fcd34d' : 'var(--muted-foreground)', border: isFav ? '1px solid rgba(245,158,11,0.4)' : '1px solid var(--border)' }}>
                          {isFav ? '★ Favoritado' : '☆ Não favoritado'}
                        </span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', fontSize: '0.75rem', fontWeight: 600, padding: '0.2rem 0.625rem', borderRadius: '9999px', background: avail === 'available' ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)', color: avail === 'available' ? '#6ee7b7' : '#fca5a5', border: `1px solid ${avail === 'available' ? 'rgba(16,185,129,0.4)' : 'rgba(239,68,68,0.4)'}` }}>
                          {avail === 'available' ? '● Disponível' : '● Indisponível'}
                        </span>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <button type="button" onClick={() => toggleFavorite(scheme.scheme_id)} disabled={toggling}
                          style={{ flex: 1, borderRadius: '0.5rem', border: isFav ? '1px solid rgba(245,158,11,0.5)' : '1px solid var(--border)', padding: '0.4rem 0.5rem', fontSize: '0.8125rem', fontWeight: 700, cursor: toggling ? 'wait' : 'pointer', background: isFav ? 'rgba(245,158,11,0.15)' : 'var(--card)', color: isFav ? '#fcd34d' : 'var(--muted-foreground)', fontFamily: 'inherit', transition: 'all 0.15s', opacity: toggling ? 0.6 : 1, whiteSpace: 'nowrap' }}>
                          {toggling ? '...' : isFav ? '★ Favoritado' : '☆ Favoritar'}
                        </button>
                        <button type="button" onClick={() => setAvail(scheme.scheme_id, 'available')}
                          style={{ flex: 1, borderRadius: '0.5rem', border: avail === 'available' ? '1px solid rgba(16,185,129,0.5)' : '1px solid var(--border)', padding: '0.4rem 0.5rem', fontSize: '0.8125rem', fontWeight: 700, cursor: 'pointer', background: avail === 'available' ? 'rgba(16,185,129,0.15)' : 'var(--card)', color: avail === 'available' ? '#6ee7b7' : 'var(--muted-foreground)', fontFamily: 'inherit', transition: 'all 0.15s', whiteSpace: 'nowrap' }}>
                          ✓ Disponível
                        </button>
                        <button type="button" onClick={() => setAvail(scheme.scheme_id, 'unavailable')}
                          style={{ flex: 1, borderRadius: '0.5rem', border: avail === 'unavailable' ? '1px solid rgba(239,68,68,0.5)' : '1px solid var(--border)', padding: '0.4rem 0.5rem', fontSize: '0.8125rem', fontWeight: 700, cursor: 'pointer', background: avail === 'unavailable' ? 'rgba(239,68,68,0.15)' : 'var(--card)', color: avail === 'unavailable' ? '#fca5a5' : 'var(--muted-foreground)', fontFamily: 'inherit', transition: 'all 0.15s', whiteSpace: 'nowrap' }}>
                          ✕ Indisponível
                        </button>
                        <button type="button"
                          onClick={() => { setSelectedCard(buildOutfitPreviewData(scheme)); setModalOpen(true); }}
                          style={{ flex: 1, borderRadius: '0.5rem', border: '1px solid rgba(124,58,237,0.4)', padding: '0.4rem 0.5rem', fontSize: '0.8125rem', fontWeight: 700, cursor: 'pointer', background: 'rgba(124,58,237,0.12)', color: '#c4b5fd', fontFamily: 'inherit', transition: 'all 0.15s', whiteSpace: 'nowrap' }}>
                          🔍 Ver Card
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </SectionBlock>
        ))
      )}

      <OutfitDetailModal
        open={modalOpen}
        data={selectedCard}
        onClose={() => { setModalOpen(false); setSelectedCard(null); }}
      />
    </div>
  );
}
