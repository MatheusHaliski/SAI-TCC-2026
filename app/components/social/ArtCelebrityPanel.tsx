'use client';

import { useEffect, useMemo, useState } from 'react';
import { getConsagrationGoal, getConsagrationLabel, getConsagrationProgressPercent } from '@/app/lib/artCelebrity';

interface ArtCelebrityPanelProps {
  viewerId?: string;
  viewerName?: string;
  targetId?: string;
  title?: string;
  subtitle?: string;
}

interface ArtCelebrityStatus {
  level: 'em-formacao' | 'arena' | 'consagrado';
  score: number;
}

export default function ArtCelebrityPanel({ viewerId, viewerName, targetId, title = 'Art Celebrity · Tributo & Arena', subtitle = 'Consagração, votos e reconhecimento comunitário começam aqui.' }: ArtCelebrityPanelProps) {
  const [status, setStatus] = useState<ArtCelebrityStatus | null>(null);
  const [voteCount, setVoteCount] = useState(0);
  const [tributeCount, setTributeCount] = useState(0);
  const [recentActions, setRecentActions] = useState<Array<{ id: string; kind: 'tribute' | 'vote'; label: string; meta: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const resolvedTargetId = targetId?.trim() || viewerId?.trim();
  const safeTargetId = resolvedTargetId ?? '';
  const canAct = Boolean(viewerId && safeTargetId);

  useEffect(() => {
    if (!safeTargetId) return;

    let isMounted = true;

    const load = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/art-celebrity?targetId=${encodeURIComponent(safeTargetId)}`);
        const data = await response.json() as {
          ok?: boolean;
          status?: ArtCelebrityStatus;
          voteCount?: number;
          tributeCount?: number;
          tributes?: Array<{ id: string; tributeType?: string; createdAt?: string | null }>;
          arenaVotes?: Array<{ id: string; votes?: number; arenaId?: string; createdAt?: string | null }>;
        };
        if (isMounted && data.ok) {
          setStatus(data.status ?? null);
          setVoteCount(Number(data.voteCount ?? 0));
          setTributeCount(Number(data.tributeCount ?? 0));

          const history = [
            ...(data.tributes ?? []).map((item) => ({
              id: item.id,
              kind: 'tribute' as const,
              label: `Tributo · ${item.tributeType ?? 'creator'}`,
              meta: item.createdAt ? new Date(item.createdAt).toLocaleDateString('pt-BR') : 'Recente',
            })),
            ...(data.arenaVotes ?? []).map((item) => ({
              id: item.id,
              kind: 'vote' as const,
              label: `Arena · ${item.arenaId ?? 'main'} (${item.votes ?? 1} voto${(item.votes ?? 1) > 1 ? 's' : ''})`,
              meta: item.createdAt ? new Date(item.createdAt).toLocaleDateString('pt-BR') : 'Recente',
            })),
          ].slice(0, 6);

          setRecentActions(history);
        }
      } catch {
        if (isMounted) {
          setStatus(null);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    void load();
    return () => { isMounted = false; };
  }, [resolvedTargetId]);

  const statusLabel = useMemo(() => {
    if (!status) return 'Em formação';
    return getConsagrationLabel(status.level);
  }, [status]);

  const progressPercent = useMemo(() => {
    return getConsagrationProgressPercent(voteCount, tributeCount);
  }, [voteCount, tributeCount]);

  const nextGoal = useMemo(() => {
    return getConsagrationGoal(voteCount, tributeCount);
  }, [voteCount, tributeCount]);

  const handleAction = async (action: 'tribute' | 'vote') => {
    if (!viewerId || !safeTargetId) return;

    setMessage('');
    try {
      const response = await fetch('/api/art-celebrity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          targetId: safeTargetId,
          targetType: 'creator',
          userId: viewerId,
          tributeType: 'creator',
          votes: action === 'vote' ? 1 : undefined,
          arenaId: 'main',
        }),
      });
      const data = await response.json() as { ok?: boolean; error?: string };
      if (!response.ok || !data.ok) throw new Error(data.error || 'Falha ao registrar ação');
      setMessage(action === 'vote' ? 'Voto registrado na arena.' : 'Tributo registrado com sucesso.');
      const nextStatusResponse = await fetch(`/api/art-celebrity?targetId=${encodeURIComponent(safeTargetId)}`);
      const nextData = await nextStatusResponse.json() as { ok?: boolean; status?: ArtCelebrityStatus; voteCount?: number; tributeCount?: number };
      if (nextStatusResponse.ok && nextData.ok) {
        setStatus(nextData.status ?? null);
        setVoteCount(Number(nextData.voteCount ?? 0));
        setTributeCount(Number(nextData.tributeCount ?? 0));
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Não foi possível registrar a ação.');
    }
  };

  return (
    <section className="mb-4 rounded-3xl border border-violet-400/20 bg-[linear-gradient(135deg,rgba(124,58,237,0.12),rgba(17,24,39,0.96))] p-4 shadow-[0_18px_50px_rgba(15,23,42,0.35)]">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.28em] text-violet-100/80">Plano 3</p>
          <h2 className="text-sm font-semibold text-white">{title}</h2>
          <p className="text-xs text-white/60">{subtitle}</p>
        </div>
        <span className="rounded-full border border-violet-400/25 bg-violet-400/10 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-violet-100">{statusLabel}</span>
      </div>

      <div className="mt-3 rounded-2xl border border-white/10 bg-black/30 p-3 text-white/85">
        <div className="flex items-center justify-between gap-3 text-[10px] uppercase tracking-[0.22em] text-white/45">
          <span>Consagração</span>
          <span>{statusLabel}</span>
        </div>
        <div className="mt-2 h-2 rounded-full bg-white/10 overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-violet-400 via-fuchsia-400 to-amber-300" style={{ width: `${Math.min(100, progressPercent)}%` }} />
        </div>
        <p className="mt-2 text-xs text-white/60">Score atual: {status?.score ?? (voteCount + tributeCount * 2)} pontos · faltam {nextGoal} pontos para o próximo marco.</p>
      </div>

      <div className="mt-3 rounded-2xl border border-white/10 bg-black/30 p-3 text-white/85">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[10px] uppercase tracking-[0.22em] text-white/45">Histórico recente</p>
          <span className="text-[10px] uppercase tracking-[0.22em] text-white/35">{recentActions.length} registros</span>
        </div>
        {recentActions.length > 0 ? (
          <div className="mt-2 flex flex-col gap-2">
            {recentActions.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/75">
                <span className="font-medium text-white/90">{item.label}</span>
                <span className="text-white/45">{item.meta}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-2 text-xs text-white/55">Ainda não há tributos ou votos registrados para esse criador.</p>
        )}
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <article className="rounded-2xl border border-white/10 bg-black/30 p-3 text-white/85">
          <p className="text-[10px] uppercase tracking-[0.22em] text-white/45">Status</p>
          <p className="mt-2 text-lg font-semibold text-white">{status ? `${status.level} · ${status.score}` : 'Aguardando'}</p>
          <p className="mt-1 text-xs text-white/60">Nível de consagração calculado a partir de tributos e votos.</p>
        </article>
        <article className="rounded-2xl border border-white/10 bg-black/30 p-3 text-white/85">
          <p className="text-[10px] uppercase tracking-[0.22em] text-white/45">Tributos</p>
          <p className="mt-2 text-lg font-semibold text-white">{tributeCount}</p>
          <p className="mt-1 text-xs text-white/60">Reconhecimento público recebido pela comunidade.</p>
        </article>
        <article className="rounded-2xl border border-white/10 bg-black/30 p-3 text-white/85">
          <p className="text-[10px] uppercase tracking-[0.22em] text-white/45">Arena</p>
          <p className="mt-2 text-lg font-semibold text-white">{voteCount}</p>
          <p className="mt-1 text-xs text-white/60">Total de votos acumulados na disputa de popularidade.</p>
        </article>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => void handleAction('tribute')}
          disabled={!canAct || loading}
          className="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Enviar tributo
        </button>
        <button
          type="button"
          onClick={() => void handleAction('vote')}
          disabled={!canAct || loading}
          className="rounded-full border border-amber-400/25 bg-amber-400/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Votar na arena
        </button>
        <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-white/70">{viewerName ? `Ativo para ${viewerName}` : 'Ação pública'}</span>
      </div>

      {message ? <p className="mt-3 text-xs text-emerald-100/90">{message}</p> : null}
    </section>
  );
}
