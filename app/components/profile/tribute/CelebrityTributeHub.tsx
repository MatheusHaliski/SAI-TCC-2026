'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { AMERICAN_CELEBRITIES } from '@/app/lib/celebrities';
import FancySelect from '@/app/components/ui/fancy-select';

interface SchemeOption {
  scheme_id: string;
  title: string;
  style: string;
  occasion: string;
  visibility: 'public' | 'private';
}

interface CelebritySchemeItem {
  scheme_id: string;
  title: string;
  style: string;
  occasion: string;
  author: string;
  celebrity_tribute?: { celebrity_name: string; awarded_at: string } | null;
}

interface TributeRequestItem {
  request_id: string;
  user_id: string;
  user_name: string;
  celebrity_name: string;
  scheme_id: string;
  scheme_title: string;
  message?: string | null;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

interface CelebrityTributeHubProps {
  userId: string;
  viewerId: string;
  viewerName: string;
  canEdit: boolean;
  schemes: SchemeOption[];
}

type HubTab = 'buscar' | 'solicitar' | 'aprovacoes';

export default function CelebrityTributeHub({ userId, viewerId, viewerName, canEdit, schemes }: CelebrityTributeHubProps) {
  const [activeTab, setActiveTab] = useState<HubTab>('buscar');

  return (
    <section className="rounded-3xl border border-white/10 bg-[linear-gradient(135deg,rgba(15,23,42,0.98),rgba(17,24,39,0.98))] p-5 shadow-[0_25px_60px_rgba(15,23,42,0.35)]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.28em] text-amber-100/80">Tributos</p>
          <h2 className="text-lg font-semibold text-white">Esquemas de Celebridades</h2>
          <p className="mt-1 text-sm text-white/65">Busque esquemas tributados por celebridades, solicite um tributo ou avalie pedidos pendentes.</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <TabButton label="Buscar" active={activeTab === 'buscar'} onClick={() => setActiveTab('buscar')} />
        {canEdit ? <TabButton label="Solicitar Tributo" active={activeTab === 'solicitar'} onClick={() => setActiveTab('solicitar')} /> : null}
        {canEdit ? <TabButton label="Aprovações" active={activeTab === 'aprovacoes'} onClick={() => setActiveTab('aprovacoes')} /> : null}
      </div>

      <div className="mt-4">
        {activeTab === 'buscar' ? <BuscarTab /> : null}
        {activeTab === 'solicitar' && canEdit ? (
          <SolicitarTab userId={userId} viewerId={viewerId} viewerName={viewerName} schemes={schemes} />
        ) : null}
        {activeTab === 'aprovacoes' && canEdit ? <AprovacoesTab /> : null}
      </div>
    </section>
  );
}

function TabButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] transition ${
        active
          ? 'border-amber-300/70 bg-amber-400/15 text-amber-100'
          : 'border-white/15 bg-white/5 text-white/60 hover:border-white/30 hover:text-white'
      }`}
    >
      {label}
    </button>
  );
}

function BuscarTab() {
  const [query, setQuery] = useState('');
  const [allSchemes, setAllSchemes] = useState<CelebritySchemeItem[]>([]);
  const [monthlyFeed, setMonthlyFeed] = useState<CelebritySchemeItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/schemes/celebrity-tributes').then((res) => (res.ok ? res.json() : [])),
      fetch('/api/schemes/celebrity-feed').then((res) => (res.ok ? res.json() : [])),
    ])
      .then(([all, monthly]) => {
        setAllSchemes(Array.isArray(all) ? all : []);
        setMonthlyFeed(Array.isArray(monthly) ? monthly : []);
      })
      .catch(() => {
        setAllSchemes([]);
        setMonthlyFeed([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allSchemes;
    return allSchemes.filter((scheme) =>
      scheme.celebrity_tribute?.celebrity_name?.toLowerCase().includes(q)
      || scheme.title.toLowerCase().includes(q)
      || scheme.author.toLowerCase().includes(q));
  }, [allSchemes, query]);

  return (
    <div className="space-y-5">
      <label className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-4 py-3">
        <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-white" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="11" cy="11" r="6" />
          <path d="m20 20-4.2-4.2" />
        </svg>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por celebridade, esquema ou criador..."
          className="w-full bg-transparent text-white placeholder:text-white/60 focus:outline-none"
        />
      </label>

      {monthlyFeed.length > 0 ? (
        <div>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-100/70">Feed do mês — tributos aceitos</p>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {monthlyFeed.map((scheme) => <CelebritySchemeCard key={`feed-${scheme.scheme_id}`} scheme={scheme} highlight />)}
          </div>
        </div>
      ) : null}

      <div>
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">Todos os esquemas com tributo</p>
        {loading ? (
          <p className="text-sm text-white/60">Carregando esquemas...</p>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-white/60">Nenhum esquema de celebridade encontrado.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((scheme) => <CelebritySchemeCard key={scheme.scheme_id} scheme={scheme} />)}
          </div>
        )}
      </div>
    </div>
  );
}

function CelebritySchemeCard({ scheme, highlight }: { scheme: CelebritySchemeItem; highlight?: boolean }) {
  return (
    <article
      className={`flex flex-col gap-2 rounded-2xl border p-4 ${highlight ? 'border-amber-400/40' : 'border-white/15'}`}
      style={{
        background: highlight
          ? 'linear-gradient(135deg, rgba(245,158,11,0.18) 0%, rgba(15,23,42,0.8) 60%, rgba(124,58,237,0.26) 100%)'
          : 'rgba(255,255,255,0.05)',
      }}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="rounded-full border border-violet-400/40 bg-violet-400/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-violet-100">
          ✦ {scheme.celebrity_tribute?.celebrity_name}
        </span>
        <span className="text-[10px] text-white/45">@{scheme.author}</span>
      </div>
      <p className="break-words text-sm font-bold leading-snug text-white">{scheme.title}</p>
      <p className="text-xs text-white/60">{scheme.style} · {scheme.occasion}</p>
    </article>
  );
}

function SolicitarTab({ userId, viewerId, viewerName, schemes }: { userId: string; viewerId: string; viewerName: string; schemes: SchemeOption[] }) {
  const publicSchemes = useMemo(() => schemes.filter((scheme) => scheme.visibility === 'public'), [schemes]);
  const [selectedSchemeId, setSelectedSchemeId] = useState(publicSchemes[0]?.scheme_id ?? '');
  const [selectedCelebrity, setSelectedCelebrity] = useState(AMERICAN_CELEBRITIES[0]);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [myRequests, setMyRequests] = useState<TributeRequestItem[]>([]);

  const loadMyRequests = useCallback(() => {
    fetch(`/api/tributes?user_id=${encodeURIComponent(userId)}`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setMyRequests(Array.isArray(data) ? data : []))
      .catch(() => setMyRequests([]));
  }, [userId]);

  useEffect(() => {
    loadMyRequests();
  }, [loadMyRequests]);

  const handleSubmit = async () => {
    if (!selectedSchemeId) {
      setFeedback('Selecione um esquema público para tributar.');
      return;
    }
    const scheme = publicSchemes.find((item) => item.scheme_id === selectedSchemeId);
    setSubmitting(true);
    setFeedback(null);
    try {
      const response = await fetch('/api/tributes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: viewerId || userId,
          user_name: viewerName,
          celebrity_name: selectedCelebrity,
          scheme_id: selectedSchemeId,
          scheme_title: scheme?.title || '',
          message: message.trim() || undefined,
        }),
      });
      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        setFeedback(payload?.error || 'Não foi possível enviar a solicitação.');
        return;
      }
      setFeedback(`Solicitação enviada ao grupo de ${selectedCelebrity}. Você será notificado quando houver uma resposta.`);
      setMessage('');
      loadMyRequests();
    } catch {
      setFeedback('Não foi possível enviar a solicitação.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-white/15 bg-white/5 p-4 space-y-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">Solicitar Tributo</p>
        <p className="text-xs text-white/60">
          Escolha um dos seus esquemas públicos e a celebridade que deseja homenagear. O pedido é enviado ao grupo dela para avaliação.
        </p>

        {publicSchemes.length === 0 ? (
          <p className="rounded-xl border border-amber-300/30 bg-amber-400/10 p-3 text-xs text-amber-100">
            Você precisa de pelo menos um esquema público em &quot;Meus Esquemas&quot; para solicitar um tributo.
          </p>
        ) : (
          <>
            <FancySelect
              value={selectedSchemeId}
              onChange={setSelectedSchemeId}
              placeholder="Esquema"
              options={publicSchemes.map((scheme) => ({ value: scheme.scheme_id, label: scheme.title }))}
            />
            <FancySelect
              value={selectedCelebrity}
              onChange={setSelectedCelebrity}
              placeholder="Celebridade"
              options={AMERICAN_CELEBRITIES.map((name) => ({ value: name, label: name }))}
            />
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Mensagem opcional para o grupo da celebridade"
              className="w-full rounded-xl border border-border bg-accent px-3 py-2 text-sm text-white placeholder:text-muted-foreground focus:border-violet-400/70 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
            />
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="rounded-xl border border-border bg-gradient-to-r from-purple-600 to-pink-500 px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(139,92,246,0.35)] transition hover:scale-[1.01] hover:brightness-110 disabled:opacity-60"
            >
              {submitting ? 'Enviando...' : 'Enviar solicitação'}
            </button>
          </>
        )}

        {feedback ? <p className="text-xs text-cyan-200">{feedback}</p> : null}
      </div>

      {myRequests.length > 0 ? (
        <div>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">Minhas solicitações</p>
          <div className="space-y-2">
            {myRequests.map((request) => (
              <div key={request.request_id} className="flex items-center justify-between gap-3 rounded-xl border border-white/15 bg-white/5 p-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">{request.scheme_title} · {request.celebrity_name}</p>
                  <p className="text-[10px] text-white/45">{new Date(request.createdAt).toLocaleDateString('pt-BR')}</p>
                </div>
                <StatusBadge status={request.status} />
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function StatusBadge({ status }: { status: TributeRequestItem['status'] }) {
  const map = {
    pending: { label: 'Pendente', className: 'border-amber-300/40 bg-amber-400/10 text-amber-100' },
    accepted: { label: 'Aceito', className: 'border-emerald-300/40 bg-emerald-400/10 text-emerald-100' },
    rejected: { label: 'Recusado', className: 'border-rose-300/40 bg-rose-400/10 text-rose-100' },
  } as const;
  const meta = map[status];
  return (
    <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${meta.className}`}>
      {meta.label}
    </span>
  );
}

function AprovacoesTab() {
  const [requests, setRequests] = useState<TributeRequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const loadPending = useCallback(() => {
    fetch('/api/tributes?status=pending')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setRequests(Array.isArray(data) ? data : []))
      .catch(() => setRequests([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadPending();
  }, [loadPending]);

  const decide = async (requestId: string, action: 'accept' | 'reject') => {
    setBusyId(requestId);
    try {
      await fetch(`/api/tributes/${requestId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      setRequests((prev) => prev.filter((item) => item.request_id !== requestId));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-3">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">Painel de aprovação de tributos</p>
      <p className="text-xs text-white/60">
        Ao aceitar, o selo de tributo é atribuído automaticamente ao esquema e o criador é notificado.
      </p>
      {loading ? (
        <p className="text-sm text-white/60">Carregando solicitações...</p>
      ) : requests.length === 0 ? (
        <p className="text-sm text-white/60">Nenhuma solicitação pendente.</p>
      ) : (
        requests.map((request) => (
          <div key={request.request_id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/15 bg-white/5 p-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">{request.scheme_title}</p>
              <p className="text-xs text-white/55">por @{request.user_name} · tributo para {request.celebrity_name}</p>
              {request.message ? <p className="mt-1 text-[11px] italic text-white/50">&quot;{request.message}&quot;</p> : null}
            </div>
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                disabled={busyId === request.request_id}
                onClick={() => decide(request.request_id, 'accept')}
                className="rounded-lg border border-emerald-300/40 bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-100 transition hover:bg-emerald-400/20 disabled:opacity-60"
              >
                Aceitar
              </button>
              <button
                type="button"
                disabled={busyId === request.request_id}
                onClick={() => decide(request.request_id, 'reject')}
                className="rounded-lg border border-rose-300/40 bg-rose-400/10 px-3 py-1.5 text-xs font-semibold text-rose-100 transition hover:bg-rose-400/20 disabled:opacity-60"
              >
                Rejeitar
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
