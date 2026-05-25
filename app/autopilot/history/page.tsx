'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthSessionToken } from '@/app/lib/authSession';
import PageHeader from '@/app/components/shell/PageHeader';

type Feedback = 'loved' | 'used' | 'skipped';

interface DailyLook {
  daily_look_id: string;
  date: string;
  occasion: string;
  mood: string;
  weather_c: number;
  city: string;
  feedback: Feedback | null;
  created_at: string;
}

const FEEDBACK_LABELS: Record<Feedback, string> = {
  loved: '❤️ Amei',
  used: '👍 Usei',
  skipped: '⏭️ Pulei',
};

const OCCASION_LABELS: Record<string, string> = {
  trabalho: 'Trabalho',
  casual: 'Casual',
  balada: 'Balada',
  academia: 'Academia',
  evento: 'Evento',
};

const MOOD_LABELS: Record<string, string> = {
  disposto: 'Disposto',
  cansado: 'Cansado',
  confiante: 'Confiante',
  criativo: 'Criativo',
};

export default function HistoryPage() {
  const router = useRouter();
  const [looks, setLooks] = useState<DailyLook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!getAuthSessionToken()) {
      router.replace('/authview');
      return;
    }
    loadHistory();
  }, [router]);

  async function loadHistory() {
    setLoading(true);
    try {
      const response = await fetch('/api/autopilot/daily?history=true', {
        credentials: 'include',
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? 'Erro ao carregar histórico.');
        return;
      }
      setLooks(Array.isArray(data.looks) ? data.looks : []);
    } catch {
      setError('Erro de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  async function sendFeedback(lookId: string, feedback: Feedback) {
    try {
      const response = await fetch(`/api/autopilot/daily/${lookId}/feedback`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ feedback }),
      });
      if (response.ok) {
        setLooks((prev) =>
          prev.map((look) =>
            look.daily_look_id === lookId ? { ...look, feedback } : look,
          ),
        );
      }
    } catch {
      // silently ignore
    }
  }

  const groupedByDate = looks.reduce<Record<string, DailyLook[]>>((acc, look) => {
    const key = look.date;
    acc[key] = [...(acc[key] ?? []), look];
    return acc;
  }, {});

  const stats = {
    total: looks.length,
    loved: looks.filter((l) => l.feedback === 'loved').length,
    used: looks.filter((l) => l.feedback === 'used').length,
    skipped: looks.filter((l) => l.feedback === 'skipped').length,
    pending: looks.filter((l) => l.feedback === null).length,
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <PageHeader title="Histórico de Looks" subtitle="Avaliações e feedback dos seus looks" />

      <div className="mx-auto max-w-3xl px-4 py-6 space-y-6">
        {/* Stats */}
        {!loading && looks.length > 0 && (
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: 'Total', value: stats.total, color: 'text-white' },
              { label: '❤️ Amei', value: stats.loved, color: 'text-pink-400' },
              { label: '👍 Usei', value: stats.used, color: 'text-blue-400' },
              { label: '⏭️ Pulei', value: stats.skipped, color: 'text-white/40' },
            ].map(({ label, value, color }) => (
              <div key={label} className="rounded-xl border border-white/10 bg-white/5 p-3 text-center">
                <p className={`text-2xl font-bold ${color}`}>{value}</p>
                <p className="text-xs text-white/40 mt-1">{label}</p>
              </div>
            ))}
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-16">
            <p className="text-sm text-white/40">Carregando histórico...</p>
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {!loading && !error && looks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 space-y-3">
            <p className="text-white/40">Nenhum look registrado ainda.</p>
            <button
              onClick={() => router.push('/autopilot')}
              className="text-sm text-white/60 border border-white/20 rounded-lg px-4 py-2 hover:bg-white/10 transition-colors"
            >
              Gerar meu primeiro look
            </button>
          </div>
        )}

        {/* History list */}
        {Object.entries(groupedByDate)
          .sort(([a], [b]) => b.localeCompare(a))
          .map(([date, dateLooks]) => (
            <div key={date} className="space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-white/40">{date}</h3>
              {dateLooks.map((look) => (
                <div key={look.daily_look_id} className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {OCCASION_LABELS[look.occasion] ?? look.occasion}
                      </span>
                      <span className="text-xs text-white/30">·</span>
                      <span className="text-xs text-white/50">
                        {MOOD_LABELS[look.mood] ?? look.mood}
                      </span>
                    </div>
                    <span className="text-xs text-white/30">
                      {look.weather_c.toFixed(0)}°C — {look.city}
                    </span>
                  </div>

                  {look.feedback ? (
                    <span className="inline-block text-xs rounded-full bg-white/10 px-3 py-0.5 text-white/70">
                      {FEEDBACK_LABELS[look.feedback]}
                    </span>
                  ) : (
                    <div className="flex gap-2">
                      {(['loved', 'used', 'skipped'] as Feedback[]).map((fb) => (
                        <button
                          key={fb}
                          onClick={() => sendFeedback(look.daily_look_id, fb)}
                          className="flex-1 rounded-lg border border-white/15 py-1.5 text-xs hover:bg-white/10 transition-colors"
                        >
                          {FEEDBACK_LABELS[fb]}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}

        <button
          onClick={() => router.push('/autopilot')}
          className="text-sm text-white/40 hover:text-white/70 transition-colors"
        >
          ← Voltar ao Autopiloto
        </button>
      </div>
    </div>
  );
}
