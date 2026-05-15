'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import SectionBlock from '@/app/components/shared/SectionBlock';
import WardrobeCompactCard from '@/app/components/profile/WardrobeCompactCard';
import OutfitCard from '@/app/components/outfit-card/OutfitCard';
import { OutfitCardData } from '@/app/lib/outfit-card';

type WardrobeViewItem = { wardrobe_item_id: string; name: string; image_url: string; brand: string; piece_type: string; gender?: string; tags?: string[]; background_style?: { colors?: string[] } };
interface Props { items: WardrobeViewItem[] }

export default function ProfileWardrobeSection({ items }: Props) {
  const router = useRouter();
  const [selected, setSelected] = useState<WardrobeViewItem | null>(null);
  const pt = typeof window !== 'undefined' && (window.localStorage.getItem('sai-site-language') ?? 'pt').startsWith('pt');

  const makeFallbackBg = (seed: string) => {
    const palette = [
      ['#16a34a', '#0f766e', '#1d4ed8'],
      ['#22c55e', '#0284c7', '#6366f1'],
      ['#14b8a6', '#22c55e', '#65a30d'],
      ['#0ea5e9', '#2563eb', '#7c3aed'],
    ] as const;
    const idx = Math.abs(Array.from(seed).reduce((acc, ch) => acc + ch.charCodeAt(0), 0)) % palette.length;
    return { backgroundImage: `linear-gradient(130deg, ${palette[idx].join(', ')})` };
  };

  const selectedCardData = useMemo<OutfitCardData | null>(() => {
    if (!selected) return null;
    return {
      outfitName: selected.name,
      outfitStyleLine: `${selected.brand || 'Unknown'} • ${selected.piece_type}`,
      outfitDescription: `${pt ? 'Peça do guarda-roupa' : 'Wardrobe item'} • ${selected.tags?.join(' · ') || 'Street · Essential'}`,
      heroImageUrl: selected.image_url,
      outfitBackground: selected.background_style?.colors?.length
        ? { type: 'gradient', value: selected.background_style.colors[0], shape: 'orb' }
        : { type: 'gradient', value: '#16a34a', shape: 'orb' },
      pieces: [{ id: selected.wardrobe_item_id, name: selected.name, brand: selected.brand || 'Unknown', pieceType: selected.piece_type || 'piece' }],
    };
  }, [pt, selected]);

  return (
    <SectionBlock title={pt ? 'Meu Guarda-roupa' : 'My Wardrobe Pieces'} subtitle={pt ? 'Gerencie suas peças com ações rápidas.' : 'Scan and manage your pieces with premium compact cards.'}>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {items.map((item) => (
          <WardrobeCompactCard key={item.wardrobe_item_id} imageUrl={item.image_url} name={item.name} brand={item.brand} pieceType={item.piece_type} rarity="Premium" wearstyles={item.tags ?? ['Street', 'Essential']}
            backgroundStyle={item.background_style?.colors?.length ? { backgroundImage: `linear-gradient(130deg, ${item.background_style.colors.join(', ')})` } : makeFallbackBg(item.wardrobe_item_id)}
            onViewDetails={() => setSelected(item)} onEdit={() => setSelected(item)} onDelete={() => window.alert(pt ? 'Fluxo de exclusão depende da API DELETE para wardrobe item.' : 'Delete flow depends on wardrobe item DELETE API.')} onUseInTester={() => router.push(`/dress-tester?itemId=${encodeURIComponent(item.wardrobe_item_id)}&gender=${encodeURIComponent(item.gender || 'female')}`)} />
        ))}
        {!items.length ? <p className="text-sm text-white/80">{pt ? 'Nenhuma peça encontrada.' : 'No wardrobe items found yet.'}</p> : null}
      </div>
      {selected && selectedCardData ? <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/65 p-4"><div className="w-full max-w-5xl rounded-3xl border border-white/20 bg-slate-950/90 p-4"><div className="mb-3 flex items-center justify-between"><h3 className="text-lg font-semibold text-white">{pt ? 'Ver detalhes' : 'View details'}</h3><button onClick={() => setSelected(null)} className="rounded-lg border border-white/30 px-3 py-1 text-sm text-white">{pt ? 'Fechar' : 'Close'}</button></div><OutfitCard data={selectedCardData} variant="default" /><p className="mt-3 text-sm text-white/80">{pt ? 'Gênero' : 'Gender'}: {selected.gender || (pt ? 'não definido' : 'undefined')}</p></div></div> : null}
    </SectionBlock>
  );
}
