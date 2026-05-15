'use client';

import { useMemo } from 'react';
import SectionBlock from '@/app/components/shared/SectionBlock';
import CollapsibleOutfitCard from '@/app/components/outfit-card/CollapsibleOutfitCard';
import { OutfitCardData } from '@/app/lib/outfit-card';

interface Scheme { scheme_id: string; title: string; style: string; occasion: string; description?: string | null; cover_image_url?: string | null; visibility: 'public' | 'private'; user_id?: string }
interface Props { userId: string; schemes: Scheme[] }

const toData = (scheme: Scheme): OutfitCardData => ({ outfitName: scheme.title, outfitStyleLine: `${scheme.style} · ${scheme.occasion}`, outfitDescription: scheme.description || '', heroImageUrl: scheme.cover_image_url || '/welcome-newcomers.png', schemeId: scheme.scheme_id, creatorId: scheme.user_id, pieces: [] });

export default function ProfileMySchemesSection({ userId, schemes }: Props) {
  // My Schemes = esquemas cujo owner/creator é o próprio user autenticado.
  const mySchemes = useMemo(() => schemes.filter((s) => !s.user_id || s.user_id === userId), [schemes, userId]);
  const cards = useMemo(() => mySchemes.map((s) => ({ scheme: s, data: toData(s) })), [mySchemes]);
  const pt = typeof window !== 'undefined' && (window.localStorage.getItem('sai-site-language') ?? 'pt').startsWith('pt');

  return <SectionBlock title={pt ? 'Meus Esquemas' : 'My Schemes'} subtitle={pt ? 'Cards de look criados por você.' : 'Outfit cards authored by you.'}><div className="mt-4 grid gap-3 lg:grid-cols-2">{cards.map(({scheme,data}) => <CollapsibleOutfitCard key={scheme.scheme_id} card={data} showActions />)}{!cards.length ? <p className="text-sm text-white/80">{pt ? 'Nenhum esquema criado ainda.' : 'No authored schemes yet.'}</p> : null}</div></SectionBlock>;
}
