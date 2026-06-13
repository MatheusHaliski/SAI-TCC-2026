'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import SectionBlock from '@/app/components/shared/SectionBlock';
import ArtCelebrityPanel from '@/app/components/social/ArtCelebrityPanel';
import CelebrityTributeHub from '@/app/components/profile/tribute/CelebrityTributeHub';

interface SchemeOption {
  scheme_id: string;
  title: string;
  style: string;
  occasion: string;
  visibility: 'public' | 'private';
}

interface ProfileTributeSectionProps {
  userId: string;
  viewerId?: string;
  viewerName: string;
  canEdit?: boolean;
  schemes?: SchemeOption[];
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

const seedHistory = (
  viewerName: string,
): TributeReviewRequest[] => [
  {
    id: 'accepted-rihanna',
    celebrity: 'Rihanna',
    schemeId: 'seed-fenty',
    schemeTitle: 'Fenty Street Luxe',
    requester: viewerName || 'Criador Fashion AI',
    message:
      'A equipe aprovou o uso do selo por coerência visual e referência editorial.',
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
    message:
      'Tributo aceito para esquema de gala contemporâneo.',
    status: 'approved',
    createdAt: new Date().toISOString(),
    approvedAt: new Date().toISOString(),
  },
];

const formatDate = (value?: string) => {
  if (!value) return 'Recente';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Recente';
  }

  return date.toLocaleDateString('pt-BR');
};

export default function ProfileTributeSection({
  userId,
  viewerId,
  viewerName,
  canEdit = false,
  schemes = [],
  brandSealTier,
  brandSealStatus,
  officialFeedEligible = false,
  officialFeedUntil,
}: ProfileTributeSectionProps) {
  const resolvedViewerId = viewerId || userId;
  const storageKey = `sai_profile_tribute_reviews_${userId || 'guest'}`;

  const [celebrity, setCelebrity] = useState(
    CELEBRITY_OPTIONS[0],
  );
  const [schemeId, setSchemeId] = useState('');
  const [message, setMessage] = useState('');
  const [requests, setRequests] = useState<
    TributeReviewRequest[]
  >([]);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    try {
      const storedValue =
        window.localStorage.getItem(storageKey);

      const saved = JSON.parse(
        storedValue || '[]',
      ) as TributeReviewRequest[];

      setRequests(Array.isArray(saved) ? saved : []);
    } catch {
      setRequests([]);
    }
  }, [storageKey]);

  useEffect(() => {
    try {
      const preferred = window.localStorage.getItem(
        'sai_profile_prefill_tribute_celebrity',
      );

      if (
        preferred &&
        CELEBRITY_OPTIONS.includes(preferred)
      ) {
        setCelebrity(preferred);

        window.localStorage.removeItem(
          'sai_profile_prefill_tribute_celebrity',
        );
      }
    } catch {
      // O formulário continua funcionando mesmo que o localStorage
      // não esteja disponível.
    }
  }, []);

  useEffect(() => {
    if (!schemeId && schemes[0]?.scheme_id) {
      setSchemeId(schemes[0].scheme_id);
    }
  }, [schemeId, schemes]);

  const history = useMemo(() => {
    return [...requests, ...seedHistory(viewerName)]
      .filter((item) => item.status === 'approved')
      .slice(0, 6);
  }, [requests, viewerName]);

  const reviewingRequests = useMemo(
    () =>
      requests.filter(
        (item) => item.status === 'reviewing',
      ),
    [requests],
  );

  const reviewingCount = reviewingRequests.length;
  const approvedCount = history.length;

  const progressPercent = Math.min(
    100,
    approvedCount * 25 + reviewingCount * 10,
  );

  const selectedScheme = schemes.find(
    (scheme) => scheme.scheme_id === schemeId,
  );

  const sealTierLabel =
    brandSealTier === 'premium'
      ? 'Premium'
      : brandSealTier === 'free'
        ? 'Gratuito'
        : 'Celebridade';

  const sealStatusLabel =
    brandSealStatus === 'active'
      ? 'Ativo'
      : brandSealStatus === 'pending'
        ? 'Em validação'
        : 'Disponível após aprovação';

  const feedUntilLabel = officialFeedUntil
    ? formatDate(officialFeedUntil)
    : 'Sem vigência ativa';

  const persist = (next: TributeReviewRequest[]) => {
    setRequests(next);

    try {
      window.localStorage.setItem(
        storageKey,
        JSON.stringify(next),
      );
    } catch {
      setNotice(
        'A solicitação foi registrada nesta sessão, mas não foi possível salvá-la no navegador.',
      );
    }
  };

  const submitReview = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const schemeTitle =
      selectedScheme?.title || 'Esquema em análise';

    const nextRequest: TributeReviewRequest = {
      id: `tribute-review-${Date.now()}`,
      celebrity,
      schemeId: schemeId || 'manual',
      schemeTitle,
      requester: viewerName || 'Criador Fashion AI',
      message:
        message.trim() ||
        `Solicito revisão do esquema "${schemeTitle}" para uso do selo de ${celebrity}.`,
      status: 'reviewing',
      createdAt: new Date().toISOString(),
    };

    persist([nextRequest, ...requests]);
    setMessage('');

    setNotice(
      `Pedido enviado para a equipe de ${celebrity}. Após a aprovação, o selo será liberado para o esquema "${schemeTitle}".`,
    );
  };

  const approveRequest = (requestId: string) => {
    const next = requests.map((item) =>
      item.id === requestId
        ? {
            ...item,
            status: 'approved' as const,
            approvedAt: new Date().toISOString(),
          }
        : item,
    );

    const approved = next.find(
      (item) => item.id === requestId,
    );

    persist(next);

    if (approved) {
      setNotice(
        `Tributo aprovado por ${approved.celebrity}. O esquema "${approved.schemeTitle}" ganhou direito ao selo da celebridade.`,
      );
    }
  };

  return (
    <SectionBlock
      title="Tributo & Consagração"
      subtitle="Solicite a revisão da equipe de uma celebridade para liberar o selo dela em um esquema específico."
    >
      <ArtCelebrityPanel
        viewerId={resolvedViewerId}
        viewerName={viewerName}
        targetId={userId}
        title="Consagração do criador"
        subtitle="Tributos, arena e status de destaque para o perfil publicamente reconhecido."
      />

      <CelebrityTributeHub
        userId={userId}
        viewerId={resolvedViewerId}
        viewerName={viewerName}
        canEdit={canEdit}
        schemes={schemes}
      />

      <section className="rounded-3xl border border-white/10 bg-[linear-gradient(135deg,rgba(15,23,42,0.98),rgba(17,24,39,0.98))] p-5 shadow-[0_25px_60px_rgba(15,23,42,0.35)]">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-amber-100/80">
              Selo de marca
            </p>

            <h2 className="text-lg font-semibold text-white">
              Painel de selo e feed oficial
            </h2>

            <p className="mt-1 text-sm text-white/65">
              Visibilidade, vigência e status do selo
              aparecem em um painel público para marcas e
              criadores.
            </p>
          </div>

          <div className="grid gap-2 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/45">
                Selo
              </p>

              <p className="mt-1 text-sm font-black text-white">
                {sealTierLabel}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/45">
                Status
              </p>

              <p className="mt-1 text-sm font-black text-white">
                {sealStatusLabel}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/45">
                Feed
              </p>

              <p className="mt-1 text-sm font-black text-white">
                {officialFeedEligible
                  ? 'Elegível'
                  : feedUntilLabel}
              </p>
            </div>
          </div>
        </div>

        {canEdit ? (
          <form
            onSubmit={submitReview}
            className="mt-5 rounded-3xl border border-white/10 bg-white/5 p-4"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="text-[10px] font-black uppercase tracking-[0.16em] text-white/55">
                  Celebridade
                </span>

                <select
                  value={celebrity}
                  onChange={(event) =>
                    setCelebrity(event.target.value)
                  }
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm font-semibold text-white outline-none transition focus:border-cyan-400"
                >
                  {CELEBRITY_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="text-[10px] font-black uppercase tracking-[0.16em] text-white/55">
                  Esquema de vestimenta
                </span>

                <select
                  value={schemeId}
                  onChange={(event) =>
                    setSchemeId(event.target.value)
                  }
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm font-semibold text-white outline-none transition focus:border-cyan-400"
                >
                  {schemes.length === 0 ? (
                    <option value="">
                      Esquema em análise
                    </option>
                  ) : null}

                  {schemes.map((scheme) => (
                    <option
                      key={scheme.scheme_id}
                      value={scheme.scheme_id}
                    >
                      {scheme.title}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {selectedScheme ? (
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/70">
                  {selectedScheme.style}
                </span>

                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/70">
                  {selectedScheme.occasion}
                </span>

                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/70">
                  {selectedScheme.visibility === 'public'
                    ? 'Público'
                    : 'Privado'}
                </span>
              </div>
            ) : null}

            <label className="mt-4 block">
              <span className="text-[10px] font-black uppercase tracking-[0.16em] text-white/55">
                Justificativa do tributo
              </span>

              <textarea
                value={message}
                onChange={(event) =>
                  setMessage(event.target.value)
                }
                rows={4}
                placeholder={`Explique por que o esquema representa uma homenagem relevante a ${celebrity}.`}
                className="mt-2 w-full resize-none rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-cyan-400"
              />
            </label>

            <button
              type="submit"
              className="mt-4 rounded-2xl border border-cyan-700/25 bg-cyan-700 px-5 py-3 text-sm font-black uppercase tracking-[0.14em] text-white transition hover:bg-cyan-800"
            >
              Enviar para revisão da equipe
            </button>
          </form>
        ) : (
          <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/65">
            Apenas o proprietário deste perfil pode enviar
            esquemas para revisão.
          </div>
        )}
      </section>

      {notice ? (
        <div className="mt-4 rounded-2xl border border-emerald-200/55 bg-emerald-50 p-4 text-sm font-semibold text-emerald-950">
          {notice}
        </div>
      ) : null}

      <section className="mt-4 rounded-3xl border border-amber-200/45 bg-amber-50 p-5 text-slate-950 shadow-[0_16px_42px_rgba(120,53,15,0.12)]">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-800">
          Consagração do Criador
        </p>

        <h2 className="mt-1 text-xl font-black">
          Progresso por tributos aceitos
        </h2>

        <div className="mt-4 rounded-2xl border border-amber-900/10 bg-white p-4">
          <div className="flex items-center justify-between gap-3 text-xs font-black uppercase tracking-[0.14em] text-slate-500">
            <span>Consagração</span>
            <span>{progressPercent}%</span>
          </div>

          <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-[linear-gradient(90deg,#0891b2,#f59e0b)]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <p className="mt-3 text-sm text-slate-600">
            {approvedCount}{' '}
            {approvedCount === 1
              ? 'tributo aceito'
              : 'tributos aceitos'}{' '}
            e {reviewingCount}{' '}
            {reviewingCount === 1
              ? 'em revisão'
              : 'em revisão'}.
          </p>
        </div>

        <div className="mt-4 grid gap-2 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-3">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
              Selo
            </p>

            <p className="mt-1 text-sm font-black">
              {sealTierLabel}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-3">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
              Status
            </p>

            <p className="mt-1 text-sm font-black">
              {sealStatusLabel}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-3">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
              Feed
            </p>

            <p className="mt-1 text-sm font-black">
              {officialFeedEligible
                ? 'Elegível'
                : feedUntilLabel}
            </p>
          </div>
        </div>
      </section>

      <section className="mt-4 rounded-3xl border border-slate-200 bg-white p-5 text-slate-950 shadow-[0_16px_42px_rgba(15,23,42,0.08)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              Histórico recente
            </p>

            <h2 className="text-lg font-black">
              Quem aceitou tributo
            </h2>
          </div>

          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">
            {history.length} aceitos
          </span>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {history.map((item) => (
            <article
              key={item.id}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-black text-slate-950">
                    {item.celebrity}
                  </p>

                  <p className="mt-1 text-xs font-semibold text-slate-500">
                    aceitou tributo em{' '}
                    {formatDate(item.approvedAt)}
                  </p>
                </div>

                <span className="shrink-0 rounded-full border border-cyan-700/20 bg-cyan-100 px-2 py-1 text-[10px] font-black uppercase text-cyan-900">
                  Selo liberado
                </span>
              </div>

              <p className="mt-3 text-sm font-semibold text-slate-700">
                {item.schemeTitle}
              </p>

              <p className="mt-1 text-sm leading-relaxed text-slate-500">
                {item.message}
              </p>
            </article>
          ))}
        </div>

        {reviewingRequests.length > 0 ? (
          <div className="mt-5">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              Em revisão
            </p>

            <div className="mt-2 grid gap-2">
              {reviewingRequests.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-black text-slate-950">
                      {item.celebrity}
                    </p>

                    <p className="text-xs text-slate-500">
                      {item.schemeTitle} · enviado em{' '}
                      {formatDate(item.createdAt)}
                    </p>
                  </div>

                  {canEdit ? (
                    <button
                      type="button"
                      onClick={() =>
                        approveRequest(item.id)
                      }
                      className="rounded-xl border border-emerald-700/20 bg-emerald-600 px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-white transition hover:bg-emerald-700"
                    >
                      Registrar aprovação
                    </button>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </section>
    </SectionBlock>
  );
}
