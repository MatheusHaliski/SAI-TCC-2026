'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthSessionToken } from '@/app/lib/authSession';
import PageHeader from '@/app/components/shell/PageHeader';

type Occasion = 'trabalho' | 'casual' | 'balada' | 'academia' | 'evento';

interface DayInput {
  date: string;
  occasion: Occasion;
}

interface WeekPlanDay {
  date: string;
  occasion: Occasion;
  scheme_id: string | null;
  gap_hints: string[];
}

interface WeekPlan {
  week_plan_id: string;
  week_start: string;
  days: WeekPlanDay[];
}

const OCCASIONS: { value: Occasion; label: string }[] = [
  { value: 'trabalho', label: 'Trabalho' },
  { value: 'casual', label: 'Casual' },
  { value: 'balada', label: 'Balada' },
  { value: 'academia', label: 'Academia' },
  { value: 'evento', label: 'Evento' },
];

const DAY_LABELS = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

function getNextMonday(): string {
  const today = new Date();
  const day = today.getDay();
  const diff = day === 0 ? 1 : 8 - day;
  const monday = new Date(today);
  monday.setDate(today.getDate() + diff);
  return monday.toISOString().slice(0, 10);
}

function buildDefaultDays(weekStart: string): DayInput[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return { date: d.toISOString().slice(0, 10), occasion: 'casual' };
  });
}

export default function WeekPlanPage() {
  const router = useRouter();
  const [weekStart, setWeekStart] = useState(getNextMonday);
  const [city, setCity] = useState('São Paulo');
  const [days, setDays] = useState<DayInput[]>(() => buildDefaultDays(getNextMonday()));
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<WeekPlan | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!getAuthSessionToken()) router.replace('/authview');
  }, [router]);

  useEffect(() => {
    setDays(buildDefaultDays(weekStart));
  }, [weekStart]);

  function updateDayOccasion(index: number, occasion: Occasion) {
    setDays((prev) => prev.map((d, i) => (i === index ? { ...d, occasion } : d)));
  }

  async function generatePlan() {
    setLoading(true);
    setError(null);
    setPlan(null);
    try {
      const response = await fetch('/api/autopilot/week', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ week_start: weekStart, city, days }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? 'Erro ao gerar planejamento.');
        return;
      }
      setPlan(data);
    } catch {
      setError('Erro de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <PageHeader title="Semana Planejada" subtitle="Planejamento semanal de looks" />

      <div className="mx-auto max-w-3xl px-4 py-6 space-y-6">
        {/* Config */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-5 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-white/60">Configurar Semana</h2>

          <div className="flex gap-4 flex-wrap">
            <div className="space-y-1 flex-1 min-w-[160px]">
              <label className="text-xs text-white/50">Início da semana</label>
              <input
                type="date"
                value={weekStart}
                onChange={(e) => setWeekStart(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white/30"
              />
            </div>
            <div className="space-y-1 flex-1 min-w-[160px]">
              <label className="text-xs text-white/50">Cidade</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Ex: São Paulo"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-white/30"
              />
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs text-white/50">Ocasião por dia</p>
            {days.map((day, index) => (
              <div key={day.date} className="flex items-center gap-3">
                <span className="w-16 text-xs text-white/40 flex-shrink-0">{DAY_LABELS[index]}</span>
                <span className="text-xs text-white/30 w-24 flex-shrink-0">{day.date}</span>
                <div className="flex gap-1 flex-wrap">
                  {OCCASIONS.map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => updateDayOccasion(index, value)}
                      className={`rounded-full px-2.5 py-0.5 text-xs transition-colors ${
                        day.occasion === value
                          ? 'bg-white text-black font-semibold'
                          : 'border border-white/15 text-white/50 hover:border-white/40'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={generatePlan}
            disabled={loading}
            className="w-full rounded-lg bg-white py-2.5 text-sm font-semibold text-black transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? 'Gerando plano...' : 'Gerar Planejamento Semanal'}
          </button>
        </div>

        {error && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Plan result */}
        {plan && (
          <div className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-white/60">
              Plano — Semana de {plan.week_start}
            </h2>
            {plan.days.map((day, index) => (
              <div
                key={day.date}
                className={`rounded-xl border p-4 ${
                  day.scheme_id ? 'border-white/10 bg-white/5' : 'border-amber-500/20 bg-amber-500/5'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold">
                      {DAY_LABELS[index]} <span className="text-white/40 font-normal">— {day.date}</span>
                    </p>
                    <p className="text-xs text-white/50 mt-0.5">
                      {OCCASIONS.find((o) => o.value === day.occasion)?.label ?? day.occasion}
                    </p>
                  </div>
                  {day.scheme_id ? (
                    <span className="text-xs rounded-full bg-white/10 px-2 py-0.5 text-white/60">Look gerado ✓</span>
                  ) : (
                    <span className="text-xs rounded-full bg-amber-500/20 px-2 py-0.5 text-amber-400">Lacuna</span>
                  )}
                </div>

                {day.gap_hints.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <p className="text-xs text-amber-400/70">Peças sugeridas para completar o look:</p>
                    {day.gap_hints.map((hint, i) => (
                      <p key={i} className="text-xs text-white/40">• {hint}</p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

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
