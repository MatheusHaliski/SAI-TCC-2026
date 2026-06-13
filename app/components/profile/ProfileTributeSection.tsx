'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import SectionBlock from '@/app/components/shared/SectionBlock';
import FancySelect from '@/app/components/ui/fancy-select';

interface SchemeItem {
  scheme_id: string;
  title: string;
  style: string;
  occasion: string;
}

interface ProfileTributeSectionProps {
  userId: string;
  viewerName: string;
  schemes: SchemeItem[];
  brandSealTier?: string;
  brandSealStatus?: string;
  officialFeedEligible?: boolean;
  officialFeedUntil?: string | null;
}

type TributeReviewStatus = 'reviewing' | 'approved';

type TributeReviewRequest = {
  id: string;
  celebrity: string;
  schemeId: string;
  schemeTitle: string;
  requester: string;
  message: string;
  status: TributeReviewStatus;
  createdAt: string;
  approvedAt?: string;
};

const CELEBRITY_OPTIONS = [
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

const seedHistory = (viewerName: string): TributeReviewRequest[] => [
  {
    id: 'accepted-rihanna',
    celebrity: 'Rihanna',
    schemeId: 'seed-fenty',
    schemeTitle: 'Fenty Street Luxe',
    requester: viewerName || 'Criador Fashion AI',
    message: 'A equipe aprovou o uso do selo por coerencia visual e referencia editorial.',
    status: 'approved',
    createdAt: new Date().toISOString(),
    approvedAt: new Date().toISOString(),
  },
  {
    id: 'accepted-zendaya',
    celebrity: 'Zendaya',
    schemeId: 'seed-zendaya',
    schemeTitle: 'Tailored Future Gala',
    requester: viewerName || 'Criador Fashion AI',
    message: 'Tributo aceito para esquema de gala contemporaneo.',
    status: 'approved',
    createdAt: new Date().toISOString(),
    approvedAt: new Date().toISOString(),
  },
];

const formatDate = (value?: string) => {
  if (!value) return 'Recente';
  return new Date(value).toLocaleDateString('pt-BR');
};

export default function ProfileTributeSection({
  userId,
  viewerName,
  schemes,
  brandSealTier,
  brandSealStatus,
  officialFeedEligible,
  officialFeedUntil,
}: ProfileTributeSectionProps) {
  const storageKey = `sai_profile_tribute_reviews_${userId || 'guest'}`;
  const [celebrity, setCelebrity] = useState(CELEBRITY_OPTIONS[0]);
  const [schemeId, setSchemeId] = useState('');
  const [message, setMessage] = useState('');
  const [requests, setRequests] = useState<TributeReviewRequest[]>([]);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem(storageKey) || '[]') as TributeReviewRequest[];
      setRequests(Array.isArray(saved) ? saved : []);
    } catch {
      setRequests([]);
    }
  }, [storageKey]);

  useEffect(() => {
    const preferred = window.localStorage.getItem('sai_profile_prefill_tribute_celebrity');
    if (preferred && CELEBRITY_OPTIONS.includes(preferred)) {
      setCelebrity(preferred);
      window.localStorage.removeItem('sai_profile_prefill_tribute_celebrity');
    }
  }, []);

  useEffect(() => {
    if (!schemeId && schemes[0]?.scheme_id) setSchemeId(schemes[0].scheme_id);
  }, [schemeId, schemes]);

  const history = useMemo(() => {
    return [...requests, ...seedHistory(viewerName)]
      .filter((item) => item.status === 'approved')
      .slice(0, 6);
  }, [requests, viewerName]);

  const reviewingCount = requests.filter((item) => item.status === 'reviewing').length;
  const approvedCount = history.length;
  const progressPercent = Math.min(100, approvedCount * 25 + reviewingCount * 10);
  const selectedScheme = schemes.find((scheme) => scheme.scheme_id === schemeId);
  const sealTierLabel = brandSealTier === 'premium' ? 'Premium' : brandSealTier === 'free' ? 'Gratuito' : 'Celebridade';
  const sealStatusLabel = brandSealStatus === 'active' ? 'Ativo' : brandSealStatus === 'pending' ? 'Em validacao' : 'Disponivel apos aprovacao';
  const feedUntilLabel = officialFeedUntil ? new Date(officialFeedUntil).toLocaleDateString('pt-BR') : 'Sem vigencia ativa';

  const persist = (next: TributeReviewRequest[]) => {
    setRequests(next);
    window.localStorage.setItem(storageKey, JSON.stringify(next));
  };

  const submitReview = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const schemeTitle = selectedScheme?.title || 'Esquema em analise';
    const nextRequest: TributeReviewRequest = {
      id: `tribute-review-${Date.now()}`,
      celebrity,
      schemeId: schemeId || 'manual',
      schemeTitle,
      requester: viewerName || 'Criador Fashion AI',
      message: message.trim() || `Solicito revisao do esquema "${schemeTitle}" para uso do selo de ${celebrity}.`,
      status: 'reviewing',
      createdAt: new Date().toISOString(),
    };
    persist([nextRequest, ...requests]);
    setMessage('');
    setNotice(`Pedido enviado para a equipe de ${celebrity}. Apos aprovacao, o selo sera liberado para o esquema "${schemeTitle}".`);
  };

  const approveRequest = (requestId: string) => {
    const next = requests.map((item) => item.id === requestId ? { ...item, status: 'approved' as const, approvedAt: new Date().toISOString() } : item);
    const approved = next.find((item) => item.id === requestId);
    persist(next);
    if (approved) {
      setNotice(`Tributo aprovado por ${approved.celebrity}. O esquema "${approved.schemeTitle}" ganhou direito ao selo da celebridade.`);
    }
  };

  return (
    <SectionBlock
      title="Tributo & Consagração"
      subtitle="Solicite a revisão da equipe de uma celebridade para liberar o selo dela em um esquema específico."
    >
      <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <form onSubmit={submitReview} className="rounded-3xl border border-cyan-200/25 bg-cyan-50/95 p-5 text-slate-950 shadow-[0_16px_42px_rgba(8,47,73,0.14)]">
          <p className="text-[10px] font-black uppercase tracking-[0.20em] text-cyan-800">Solicitação de revisão</p>
          <h2 className="mt-1 text-xl font-black">Pedir selo de celebridade para um esquema</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Se a equipe aprovar a análise, o esquema selecionado ganha direito ao selo da celebridade e passa a aparecer como tributo aceito.
          </p>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <FancySelect
              value={celebrity}
              onChange={setCelebrity}
              label="Celebridade"
              options={CELEBRITY_OPTIONS.map((name) => ({ value: name, label: name }))}
            />
            <FancySelect
              value={schemeId}
              onChange={setSchemeId}
              label="Esquema em análise"
              options={(schemes.length ? schemes : [{ scheme_id: 'manual', title: 'Esquema atual', style: 'Autoral', occasion: 'Tributo' }]).map((scheme) => ({
                value: scheme.scheme_id,
                label: scheme.title,
                hint: `${scheme.style} · ${scheme.occasion}`,
              }))}
            />
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Descreva a referência visual, a intenção do tributo e por que este esquema deve receber o selo."
              className="min-h-32 rounded-2xl border border-cyan-900/15 bg-white px-4 py-3 text-sm text-slate-950 placeholder:text-slate-400 focus:border-cyan-500 focus:outline-none md:col-span-2"
            />
          </div>

          <button
            type="submit"
            className="mt-4 rounded-2xl border border-cyan-700/25 bg-cyan-700 px-5 py-3 text-sm font-black uppercase tracking-[0.14em] text-white transition hover:bg-cyan-800"
          >
            Enviar para revisão da equipe
          </button>
        </form>

        <section className="rounded-3xl border border-amber-200/45 bg-amber-50 p-5 text-slate-950 shadow-[0_16px_42px_rgba(120,53,15,0.12)]">
          <p className="text-[10px] font-black uppercase tracking-[0.20em] text-amber-800">Consagração do Criador</p>
          <h2 className="mt-1 text-xl font-black">Progresso por tributos aceitos</h2>
          <div className="mt-4 rounded-2xl border border-amber-900/10 bg-white p-4">
            <div className="flex items-center justify-between gap-3 text-xs font-black uppercase tracking-[0.14em] text-slate-500">
              <span>Consagração</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-200">
              <div className="h-full rounded-full bg-[linear-gradient(90deg,#0891b2,#f59e0b)]" style={{ width: `${progressPercent}%` }} />
            </div>
            <p className="mt-3 text-sm text-slate-600">
              {approvedCount} tributo{approvedCount === 1 ? '' : 's'} aceito{approvedCount === 1 ? '' : 's'} e {reviewingCount} em revisão.
            </p>
          </div>

          <div className="mt-4 grid gap-2 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-3">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Selo</p>
              <p className="mt-1 text-sm font-black">{sealTierLabel}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-3">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Status</p>
              <p className="mt-1 text-sm font-black">{sealStatusLabel}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-3">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Feed</p>
              <p className="mt-1 text-sm font-black">{officialFeedEligible ? 'Elegivel' : feedUntilLabel}</p>
            </div>
          </div>
        </section>
      </div>

      {notice ? (
        <div className="mt-4 rounded-2xl border border-emerald-200/55 bg-emerald-50 p-4 text-sm font-semibold text-emerald-950">
          {notice}
        </div>
      ) : null}

      <section className="mt-4 rounded-3xl border border-slate-200 bg-white p-5 text-slate-950 shadow-[0_16px_42px_rgba(15,23,42,0.08)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.20em] text-slate-400">Histórico recente</p>
            <h2 className="text-lg font-black">Quem aceitou tributo</h2>
          </div>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">
            {history.length} aceitos
          </span>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {history.map((item) => (
            <article key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-black text-slate-950">{item.celebrity}</p>
                  <p className="mt-1 text-xs font-semibold text-slate-500">aceitou tributo em {formatDate(item.approvedAt)}</p>
                </div>
                <span className="shrink-0 rounded-full border border-cyan-700/20 bg-cyan-100 px-2 py-1 text-[10px] font-black uppercase text-cyan-900">
                  Selo liberado
                </span>
              </div>
              <p className="mt-3 text-sm font-semibold text-slate-700">{item.schemeTitle}</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-500">{item.message}</p>
            </article>
          ))}
        </div>

        {requests.some((item) => item.status === 'reviewing') ? (
          <div className="mt-5">
            <p className="text-[10px] font-black uppercase tracking-[0.20em] text-slate-400">Em revisão</p>
            <div className="mt-2 grid gap-2">
              {requests.filter((item) => item.status === 'reviewing').map((item) => (
                <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
                  <div>
                    <p className="text-sm font-black text-slate-950">{item.celebrity}</p>
                    <p className="text-xs text-slate-500">{item.schemeTitle} · enviado em {formatDate(item.createdAt)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => approveRequest(item.id)}
                    className="rounded-xl border border-emerald-700/20 bg-emerald-600 px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-white"
                  >
                    Registrar aprovação
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </section>
    </SectionBlock>
  );
}
