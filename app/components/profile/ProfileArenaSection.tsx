'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import SectionBlock from '@/app/components/shared/SectionBlock';

const ARENA_CELEBRITIES = [
  {
    name: 'Taylor Swift',
    field: 'Cantora e compositora',
    team: 'Equipe editorial pop narrativa',
    available: true,
    tone: '#7dd3fc',
    requests: 128,
  },
  {
    name: 'Beyonce',
    field: 'Cantora, compositora e performer',
    team: 'Equipe palco e performance',
    available: true,
    tone: '#f59e0b',
    requests: 154,
  },
  {
    name: 'Lady Gaga',
    field: 'Artista e atriz',
    team: 'Equipe avant-garde e cinema',
    available: true,
    tone: '#c084fc',
    requests: 96,
  },
  {
    name: 'Rihanna',
    field: 'Cantora, empresaria e icone fashion',
    team: 'Equipe street luxe',
    available: true,
    tone: '#fb7185',
    requests: 112,
  },
  {
    name: 'Zendaya',
    field: 'Atriz e celebridade fashion',
    team: 'Equipe red carpet',
    available: true,
    tone: '#34d399',
    requests: 88,
  },
  {
    name: 'Billie Eilish',
    field: 'Cantora e compositora',
    team: 'Equipe oversized experimental',
    available: true,
    tone: '#a3e635',
    requests: 74,
  },
  {
    name: 'Ariana Grande',
    field: 'Cantora e atriz',
    team: 'Equipe pop glam',
    available: true,
    tone: '#f9a8d4',
    requests: 91,
  },
  {
    name: 'Madonna',
    field: 'Artista e referencia cultural',
    team: 'Equipe arquivo e consagracao',
    available: true,
    tone: '#f97316',
    requests: 67,
  },
];

export default function ProfileArenaSection() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const requestTribute = (celebrity: string) => {
    window.localStorage.setItem('sai_profile_prefill_tribute_celebrity', celebrity);
    const query = new URLSearchParams(searchParams.toString());
    query.set('section', 'tribute');
    router.replace(`${pathname}?${query.toString()}`);
  };

  return (
    <SectionBlock
      title="Arena"
      subtitle="Celebridades disponíveis para solicitar revisão de tributo pelo formulário do perfil."
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {ARENA_CELEBRITIES.map((celebrity) => (
          <article
            key={celebrity.name}
            className="overflow-hidden rounded-3xl border border-slate-200 bg-white text-slate-950 shadow-[0_18px_46px_rgba(15,23,42,0.08)]"
          >
            <div className="h-2" style={{ background: celebrity.tone }} />
            <div className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="break-words text-lg font-black leading-tight">{celebrity.name}</p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">{celebrity.field}</p>
                </div>
                <span className="shrink-0 rounded-full border border-emerald-700/20 bg-emerald-50 px-2 py-1 text-[10px] font-black uppercase text-emerald-800">
                  Aberta
                </span>
              </div>

              <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">Equipe</p>
                <p className="mt-1 text-sm font-semibold text-slate-700">{celebrity.team}</p>
              </div>

              <div className="mt-3 flex items-center justify-between gap-3 text-sm">
                <span className="font-semibold text-slate-500">Pedidos ativos</span>
                <span className="font-black">{celebrity.requests}</span>
              </div>

              <button
                type="button"
                onClick={() => requestTribute(celebrity.name)}
                className="mt-4 w-full rounded-2xl border border-slate-900/10 bg-slate-950 px-4 py-2.5 text-xs font-black uppercase tracking-[0.14em] text-white transition hover:bg-slate-800"
              >
                Solicitar pelo formulário
              </button>
            </div>
          </article>
        ))}
      </div>
    </SectionBlock>
  );
}
