'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/app/components/shell/PageHeader';
import SectionBlock from '@/app/components/shared/SectionBlock';
import OutfitDetailModal from '@/app/components/search/OutfitDetailModal';
import SearchOutfitCard from '@/app/components/search/SearchOutfitCard';
import SearchUserCard from '@/app/components/search/SearchUserCard';
import { useDiscoverySearch } from '@/app/components/shell/DiscoverySearchContext';
import { OutfitCardData, buildOutfitDescriptionFallback, buildOutfitDescriptionRich } from '@/app/lib/outfit-card';

type SlotKey = 'upper' | 'lower' | 'shoes' | 'accessory';
type PublicScheme = {
  scheme_id: string;
  title: string;
  style: string;
  occasion: string;
  user_id: string;
  cover_image_url: string | null;
  description?: string | null;
  pieces?: SchemePieceSnapshot[];
};

type SchemePieceSnapshot = {
  id: string;
  slot: SlotKey;
  sourceType: 'wardrobe' | 'suggested';
  sourceId: string;
  name: string;
  brand: string;
  category: 'Premium' | 'Standard' | 'Limited Edition' | 'Rare';
  pieceType: string;
  wearstyles: string[];
};

type UserPreview = { user_id: string; name: string; username: string; descriptor: string; avatarUrl?: string };

const mockUsers: UserPreview[] = [
  { user_id: 'u1', name: 'Alice Couto', username: 'alicefits', descriptor: 'Editorial streetwear curator' },
  { user_id: 'u2', name: 'Bruno Lima', username: 'brunowear', descriptor: 'Tailored casual and monochrome looks' },
  { user_id: 'u3', name: 'Camila Voss', username: 'camila.styles', descriptor: 'Daily luxe + sporty layering' },
];

const SLOT_PREVIEW_DEFAULTS: Record<
  SlotKey,
  { pieceType: string; category: 'Premium' | 'Standard' | 'Limited Edition' | 'Rare'; wearstyles: string[] }
> = {
  upper: { pieceType: 'Jacket', category: 'Premium', wearstyles: ['Statement Piece', 'Visual Anchor'] },
  lower: { pieceType: 'Pants', category: 'Standard', wearstyles: ['Base Structure', 'Balanced Fit'] },
  shoes: { pieceType: 'Footwear', category: 'Rare', wearstyles: ['Trend Driver', 'Street Energy'] },
  accessory: { pieceType: 'Accessory', category: 'Limited Edition', wearstyles: ['Style Accent', 'Attention Grabber'] },
};

export default function SearchItemsView() {
  const router = useRouter();
  const { query, debouncedQuery, setQuery } = useDiscoverySearch();
  const [schemes, setSchemes] = useState<PublicScheme[]>([]);
  const [selectedOutfit, setSelectedOutfit] = useState<OutfitCardData | null>(null);

  useEffect(() => {
    fetch('/api/schemes/public')
      .then((res) => res.json())
      .then((data) => setSchemes(Array.isArray(data) ? data : []))
      .catch(() => setSchemes([]));
  }, []);

  const queryNorm = debouncedQuery.trim().toLowerCase();

  const outfitsById = useMemo(() => {
    const map: Record<string, OutfitCardData> = {};

    schemes.forEach((scheme) => {
      const pieces = (scheme.pieces ?? []).map((piece) => ({
        id: piece.id,
        name: piece.name || 'Selected piece',
        brand: piece.brand || 'Selection Brand',
        pieceType: piece.pieceType || SLOT_PREVIEW_DEFAULTS[piece.slot].pieceType,
        category: piece.category || SLOT_PREVIEW_DEFAULTS[piece.slot].category,
        wearstyles: piece.wearstyles?.length ? piece.wearstyles : SLOT_PREVIEW_DEFAULTS[piece.slot].wearstyles,
      }));

      const brands = [...new Set(pieces.map((piece) => piece.brand).filter(Boolean))].slice(0, 4);

      map[scheme.scheme_id] = {
        outfitName: scheme.title || 'Untitled Outfit',
        outfitStyleLine: `${scheme.style || 'Streetwear'} • ${scheme.occasion || 'General'}`,
        outfitDescription: scheme.description
          ? buildOutfitDescriptionRich({
              outfitName: scheme.title,
              style: scheme.style,
              occasion: scheme.occasion,
              pieces,
            })
          : buildOutfitDescriptionFallback({
              pieces,
              outfitStyleLine: `${scheme.style || 'Streetwear'} ${scheme.occasion || 'General'}`,
              outfitName: scheme.title || 'Untitled Outfit',
            }),
        heroImageUrl: scheme.cover_image_url || '/welcome-newcomers.png',
        pieces,
        brands,
        schemeId: scheme.scheme_id,
        creatorId: scheme.user_id,
        metaBadges: [
          { label: scheme.style || 'Style', icon: '🎯' },
          { label: scheme.occasion || 'Occasion', icon: '📍' },
          { label: `${pieces.length} pieces`, icon: '🧩' },
        ],
      };
    });

    return map;
  }, [schemes]);

  const groupedSearch = useMemo(() => {
    const users = mockUsers.filter((user) => {
      if (!queryNorm) return true;
      const blob = `${user.name} ${user.username} ${user.descriptor}`.toLowerCase();
      return blob.includes(queryNorm);
    });

    const outfits = schemes.filter((scheme) => {
      if (!queryNorm) return true;
      const card = outfitsById[scheme.scheme_id];
      const brands = card?.brands?.join(' ') ?? '';
      const pieceNames = card?.pieces?.map((piece) => `${piece.name} ${piece.pieceType}`).join(' ') ?? '';
      const blob = `${scheme.title} ${scheme.style} ${scheme.occasion} ${scheme.description ?? ''} ${brands} ${pieceNames}`.toLowerCase();
      return blob.includes(queryNorm);
    });

    return { users, outfits, brands: [], wardrobeItems: [], styles: [] };
  }, [outfitsById, queryNorm, schemes]);

  return (
    <div className="space-y-6">
      <PageHeader title="Search" subtitle="Interactive discovery hub for users, outfits, brands, styles, and wardrobe items." />

      <SectionBlock title="Global Search" subtitle="Search users, outfits, brands, styles, wearstyles, and wardrobe items.">
        <label className="mt-4 flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-4 py-3">
          <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="11" cy="11" r="6" />
            <path d="m20 20-4.2-4.2" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search outfits, brands, styles, or wardrobe items"
            className="w-full bg-transparent text-white placeholder:text-white/60 focus:outline-none"
          />
        </label>
      </SectionBlock>

      <SectionBlock title={`Users (${groupedSearch.users.length})`} subtitle="Profiles matching the search.">
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {groupedSearch.users.map((user) => (
            <SearchUserCard
              key={user.user_id}
              name={user.name}
              username={user.username}
              descriptor={user.descriptor}
              avatarUrl={user.avatarUrl}
              onOpenProfile={() => router.push(`/profile?username=${user.username}`)}
            />
          ))}
          {!groupedSearch.users.length ? <p className="text-sm text-white/70">No users found.</p> : null}
        </div>
      </SectionBlock>

      <SectionBlock title={`Outfits (${groupedSearch.outfits.length})`} subtitle="Public outfits in compact Saved Outfit Cards card mode.">
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {groupedSearch.outfits.map((scheme) => {
            const cardData = outfitsById[scheme.scheme_id];
            if (!cardData) return null;

            return <SearchOutfitCard key={scheme.scheme_id} data={cardData} onOpenDetail={() => setSelectedOutfit(cardData)} />;
          })}
          {!groupedSearch.outfits.length ? <p className="text-sm text-white/70">No outfits found.</p> : null}
        </div>
      </SectionBlock>

      <SectionBlock title="Expandable Discovery Groups" subtitle="Structured results model is ready for Brands, Wardrobe Items, and Styles.">
        <div className="mt-3 flex flex-wrap gap-2 text-xs text-white/75">
          <span className="rounded-full border border-white/25 px-2 py-1">Brands: {groupedSearch.brands.length}</span>
          <span className="rounded-full border border-white/25 px-2 py-1">Wardrobe Items: {groupedSearch.wardrobeItems.length}</span>
          <span className="rounded-full border border-white/25 px-2 py-1">Styles: {groupedSearch.styles.length}</span>
        </div>
      </SectionBlock>

      <OutfitDetailModal open={Boolean(selectedOutfit)} data={selectedOutfit} onClose={() => setSelectedOutfit(null)} />
    </div>
  );
}
