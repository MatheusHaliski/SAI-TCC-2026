'use client';

import { useEffect, useMemo, useState } from 'react';
import SectionBlock from '@/app/components/shared/SectionBlock';
import CollapsibleOutfitCard from '@/app/components/outfit-card/CollapsibleOutfitCard';
import { OutfitCardData } from '@/app/lib/outfit-card';

interface SavedScheme { scheme_id: string; title: string; style: string; occasion: string; description?: string | null; cover_image_url?: string | null; visibility: 'public' | 'private'; user_id?: string }
interface Props { userId: string; schemes: SavedScheme[] }

const toData = (scheme: SavedScheme): OutfitCardData => ({ outfitName: scheme.title, outfitStyleLine: `${scheme.style} · ${scheme.occasion}`, outfitDescription: scheme.description || '', heroImageUrl: scheme.cover_image_url || '/welcome-newcomers.png', schemeId: scheme.scheme_id, creatorId: scheme.user_id, pieces: [] });

export default function ProfileSavedSchemesSection({ userId, schemes }: Props) {
  const [savedSchemes, setSavedSchemes] = useState<SavedScheme[]>([]);

  useEffect(() => {
    const load = async () => {
      const favoritesResponse = await fetch(`/api/outfit-favorites?userId=${encodeURIComponent(userId)}`);
      const favoritesPayload = await favoritesResponse.json().catch(() => ({ favorites: [] }));
      const favoriteIds = Array.isArray(favoritesPayload?.favorites) ? favoritesPayload.favorites.map((entry: { schemeId?: string }) => entry.schemeId).filter(Boolean) : [];
      if (!favoriteIds.length) return setSavedSchemes([]);
      const publicResponse = await fetch('/api/schemes/public');
      const publicSchemes = await publicResponse.json().catch(() => []);
      const onlyFavorites = Array.isArray(publicSchemes) ? publicSchemes.filter((scheme: SavedScheme) => favoriteIds.includes(scheme.scheme_id)) : [];
      setSavedSchemes(onlyFavorites);
    };
    load().catch(() => setSavedSchemes([]));
  }, [userId]);

  const cards = useMemo(() => (savedSchemes.length ? savedSchemes : schemes).map((s) => ({ scheme: s, data: toData(s) })), [savedSchemes, schemes]);
  const pt = typeof window !== 'undefined' && (window.localStorage.getItem('sai-site-language') ?? 'pt').startsWith('pt');

  return <SectionBlock title={pt ? 'Esquemas Salvos' : 'Saved Schemes'} subtitle={pt ? 'Mesmos cards salvos da tela principal de cards.' : 'Same saved outfit cards from the main saved outfit cards view.'}><div className="mt-4 grid gap-3 lg:grid-cols-2">{cards.map(({scheme,data}) => <CollapsibleOutfitCard key={scheme.scheme_id} card={data} showActions />)}{!cards.length ? <p className="text-sm text-white/80">{pt ? 'Nenhum esquema salvo encontrado.' : 'No saved schemes available.'}</p> : null}</div></SectionBlock>;
}
