'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SectionBlock from '@/app/components/shared/SectionBlock';
import WardrobeCompactCard from '@/app/components/profile/WardrobeCompactCard';

type WardrobeViewItem = { wardrobe_item_id: string; name: string; image_url: string; brand: string; piece_type: string; gender?: string; tags?: string[]; background_style?: { colors?: string[] } };
interface Props { items: WardrobeViewItem[] }

export default function ProfileWardrobeSection({ items }: Props) {
  const router = useRouter();
  const [selected, setSelected] = useState<WardrobeViewItem | null>(null);
  const pt = typeof window !== 'undefined' && (window.localStorage.getItem('sai-site-language') ?? 'pt').startsWith('pt');

  return (
    <SectionBlock title={pt ? 'Meu Guarda-roupa' : 'My Wardrobe Pieces'} subtitle={pt ? 'Gerencie suas peças com ações rápidas.' : 'Scan and manage your pieces with premium compact cards.'}>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {items.map((item) => (
          <WardrobeCompactCard key={item.wardrobe_item_id} imageUrl={item.image_url} name={item.name} brand={item.brand} pieceType={item.piece_type} rarity="Premium" wearstyles={item.tags ?? ['Street', 'Essential']}
            backgroundStyle={item.background_style?.colors?.length ? { backgroundImage: `linear-gradient(130deg, ${item.background_style.colors.join(', ')})` } : undefined}
            onViewDetails={() => setSelected(item)} onEdit={() => setSelected(item)} onDelete={() => window.alert(pt ? 'Fluxo de exclusão depende da API DELETE para wardrobe item.' : 'Delete flow depends on wardrobe item DELETE API.')} onUseInTester={() => router.push(`/dress-tester?itemId=${encodeURIComponent(item.wardrobe_item_id)}&gender=${encodeURIComponent(item.gender || 'female')}`)} />
        ))}
        {!items.length ? <p className="text-sm text-white/80">{pt ? 'Nenhuma peça encontrada.' : 'No wardrobe items found yet.'}</p> : null}
      </div>
      {selected ? <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-4"><div className="w-full max-w-xl rounded-3xl border border-white/20 bg-slate-950 p-4"><h3 className="text-lg font-semibold text-white">{selected.name}</h3><p className="text-sm text-white/80">{selected.brand} • {selected.piece_type}</p><img src={selected.image_url} alt={selected.name} className="mt-3 h-64 w-full rounded-xl object-cover" /><p className="mt-3 text-sm text-white/80">{pt ? 'Gênero' : 'Gender'}: {selected.gender || (pt ? 'não definido' : 'undefined')}</p><div className="mt-4 flex justify-end"><button onClick={() => setSelected(null)} className="rounded-lg border border-white/30 px-3 py-1 text-sm text-white">{pt ? 'Fechar' : 'Close'}</button></div></div></div> : null}
    </SectionBlock>
  );
}
