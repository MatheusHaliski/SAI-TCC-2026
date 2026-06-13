'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import PageHeader from '@/app/components/shell/PageHeader';
import SectionBlock from '@/app/components/shared/SectionBlock';
import FancySelect from '@/app/components/ui/fancy-select';

type TributeRequest = {
  id: string;
  celebrity: string;
  requester: string;
  schemeTitle: string;
  note: string;
  status: 'accepted';
  createdAt: string;
};

const CELEBRITIES = [
  'Taylor Swift',
  'Beyonce',
  'Lady Gaga',
  'Ariana Grande',
  'Billie Eilish',
  'Rihanna',
  'Madonna',
  'Dolly Parton',
  'Olivia Rodrigo',
  'Zendaya',
  'Miley Cyrus',
  'Sabrina Carpenter',
];

const FEATURED_TRIBUTES: TributeRequest[] = [
  {
    id: 'seed-1',
    celebrity: 'Taylor Swift',
    requester: 'Luna Atelier',
    schemeTitle: 'Red Carpet Folklore Tailoring',
    note: 'Camadas romanticas, alfaiataria leve e paleta de palco.',
    status: 'accepted',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'seed-2',
    celebrity: 'Beyonce',
    requester: 'Studio Halo',
    schemeTitle: 'Chrome Renaissance Suit',
    note: 'Brilho metalizado, presenca de palco e recortes editoriais.',
    status: 'accepted',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'seed-3',
    celebrity: 'Rihanna',
    requester: 'Night Market',
    schemeTitle: 'Fenty Street Luxe',
    note: 'Streetwear premium com acessorios fortes e atitude noturna.',
    status: 'accepted',
    createdAt: new Date().toISOString(),
  },
];

const STORAGE_KEY = 'sai_accepted_tribute_requests';

export default function TributesView() {
  const [activeTab, setActiveTab] = useState<'feed' | 'request'>('feed');
  const [search, setSearch] = useState('');
  const [celebrity, setCelebrity] = useState(CELEBRITIES[0]);
  const [schemeTitle, setSchemeTitle] = useState('');
  const [requester, setRequester] = useState('');
  const [note, setNote] = useState('');
  const [requests, setRequests] = useState<TributeRequest[]>([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    try {
      const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]') as TributeRequest[];
      setRequests(Array.isArray(parsed) ? parsed : []);
    } catch {
      setRequests([]);
    }
  }, []);

  const currentMonthLabel = useMemo(() => {
    return new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(new Date());
  }, []);

  const monthlyFeed = useMemo(() => {
    const q = search.trim().toLowerCase();
    return [...requests, ...FEATURED_TRIBUTES].filter((item) => {
      if (!q) return true;
      return item.celebrity.toLowerCase().includes(q) || item.schemeTitle.toLowerCase().includes(q);
    });
  }, [requests, search]);

  const submitTribute = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next: TributeRequest = {
      id: `tribute-${Date.now()}`,
      celebrity,
      requester: requester.trim() || 'Criador Fashion AI',
      schemeTitle: schemeTitle.trim() || `Tributo a ${celebrity}`,
      note: note.trim() || 'Pedido aceito pelo grupo da artista e selo aplicado automaticamente ao esquema.',
      status: 'accepted',
      createdAt: new Date().toISOString(),
    };
    const updated = [next, ...requests];
    setRequests(updated);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setMessage(`Solicitacao aceita: o grupo de ${celebrity} recebeu o pedido, o selo foi aplicado e o esquema entrou no feed mensal.`);
    setActiveTab('feed');
    setSchemeTitle('');
    setRequester('');
    setNote('');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tributos"
        subtitle="Busque esquemas associados a celebridades americanas e solicite tributos para looks aprovados."
      />

      <div className="flex flex-wrap gap-2">
        {[
          { id: 'feed', label: 'Tributos do mes' },
          { id: 'request', label: 'Solicitar Tributo' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as 'feed' | 'request')}
            className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${activeTab === tab.id ? 'border-cyan-200/55 bg-cyan-400/18 text-cyan-50' : 'border-white/15 bg-white/8 text-white/70 hover:bg-white/12'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {message ? (
        <div className="rounded-2xl border border-emerald-200/30 bg-emerald-400/12 p-4 text-sm font-semibold text-emerald-50">
          {message}
        </div>
      ) : null}

      {activeTab === 'feed' ? (
        <SectionBlock title="Feed mensal de tributos" subtitle={`Esquemas aceitos e destacados em ${currentMonthLabel}.`}>
          <label className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-4 py-3">
            <span className="text-white/70">⌕</span>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por celebridade ou esquema..."
              className="w-full bg-transparent text-white placeholder:text-white/55 focus:outline-none"
            />
          </label>

          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {monthlyFeed.map((item) => (
              <article key={item.id} className="rounded-2xl border border-white/15 bg-white/8 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-black text-white">{item.schemeTitle}</p>
                    <p className="mt-1 text-xs font-semibold text-cyan-100">{item.celebrity}</p>
                  </div>
                  <span className="shrink-0 rounded-full border border-amber-200/35 bg-amber-300/12 px-2 py-1 text-[10px] font-black uppercase text-amber-100">
                    Tributo
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-white/70">{item.note}</p>
                <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/42">
                  por {item.requester}
                </p>
              </article>
            ))}
          </div>
        </SectionBlock>
      ) : null}

      {activeTab === 'request' ? (
        <SectionBlock title="Solicitar Tributo" subtitle="Envie um pedido ao grupo da artista, cantora, compositora ou celebridade selecionada.">
          <form className="grid gap-3 md:grid-cols-2" onSubmit={submitTribute}>
            <FancySelect
              value={celebrity}
              onChange={setCelebrity}
              label="Celebridade americana"
              options={CELEBRITIES.map((name) => ({ value: name, label: name }))}
            />
            <input
              value={requester}
              onChange={(event) => setRequester(event.target.value)}
              placeholder="Nome do criador"
              className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/50 focus:outline-none"
            />
            <input
              value={schemeTitle}
              onChange={(event) => setSchemeTitle(event.target.value)}
              placeholder="Nome do esquema"
              className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/50 focus:outline-none md:col-span-2"
            />
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Explique a referencia visual do tributo"
              className="min-h-28 rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/50 focus:outline-none md:col-span-2"
            />
            <button
              type="submit"
              className="rounded-xl border border-cyan-200/35 bg-cyan-500/20 px-4 py-2 text-sm font-black uppercase tracking-[0.12em] text-cyan-50 transition hover:bg-cyan-500/28 md:col-span-2"
            >
              Enviar pedido ao grupo da celebridade
            </button>
          </form>
        </SectionBlock>
      ) : null}
    </div>
  );
}
