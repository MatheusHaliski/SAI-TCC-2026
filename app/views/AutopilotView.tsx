'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import PageHeader from '@/app/components/shell/PageHeader';
import ContextSectionMenu from '@/app/components/navigation/ContextSectionMenu';
import SectionBlock from '@/app/components/shared/SectionBlock';

// ─── Shared types ────────────────────────────────────────────────────────────

type Occasion = 'trabalho' | 'casual' | 'festa' | 'academia' | 'evento';
type Mood = 'disposto' | 'cansado' | 'confiante' | 'criativo';
type FeedbackValue = 'loved' | 'used' | 'skipped';

const OCCASIONS: { value: Occasion; label: string }[] = [
  { value: 'trabalho', label: 'Trabalho' },
  { value: 'casual', label: 'Casual' },
  { value: 'festa', label: 'Festa' },
  { value: 'academia', label: 'Academia' },
  { value: 'evento', label: 'Evento' },
];

const MOODS: { value: Mood; label: string }[] = [
  { value: 'disposto', label: 'Disposto' },
  { value: 'cansado', label: 'Cansado' },
  { value: 'confiante', label: 'Confiante' },
  { value: 'criativo', label: 'Criativo' },
];

const FEEDBACK_LABELS: Record<FeedbackValue, string> = {
  loved: '❤️ Amei',
  used: '👍 Usei',
  skipped: '⏭️ Pulei',
};

const OCCASION_LABELS: Record<string, string> = {
  trabalho: 'Trabalho',
  formal: 'Formal',
  casual: 'Casual',
  festa: 'Festa',
  academia: 'Academia',
  evento: 'Evento',
};

const MOOD_LABELS: Record<string, string> = {
  disposto: 'Disposto',
  cansado: 'Cansado',
  confiante: 'Confiante',
  criativo: 'Criativo',
};

const DAY_LABELS = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

// ─── DailyLookPanel ──────────────────────────────────────────────────────────

interface AutopilotItem {
  wardrobe_item_id: string;
  piece_type: string;
  name: string;
  image_url: string;
}

interface Suggestion {
  scheme_id: string;
  title: string;
  items: AutopilotItem[];
  score: number;
}

function DailyLookPanel() {
  const [occasion, setOccasion] = useState<Occasion>('casual');
  const [mood, setMood] = useState<Mood>('disposto');
  const [city, setCity] = useState('São Paulo');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [confirmedId, setConfirmedId] = useState<string | null>(null);
  const [feedbackSent, setFeedbackSent] = useState<Record<string, FeedbackValue>>({});
  const [dailyLookId, setDailyLookId] = useState<string | null>(null);

  async function generateLooks() {
    setLoading(true);
    setError(null);
    setSuggestions([]);
    setConfirmedId(null);
    setDailyLookId(null);
    try {
      const response = await fetch('/api/autopilot/daily', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ occasion, mood, city }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? 'Erro ao gerar looks.');
        return;
      }
      setSuggestions(data.suggestions ?? []);
    } catch {
      setError('Erro de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  async function confirmLook(suggestion: Suggestion) {
    try {
      const response = await fetch('/api/autopilot/daily/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          scheme_id: suggestion.scheme_id,
          title: suggestion.title,
          occasion,
          mood,
          weather: { temp_c: 20, condition: 'partly_cloudy', city },
          items: suggestion.items.map((item) => ({
            wardrobe_item_id: item.wardrobe_item_id,
            name: item.name,
            image_url: item.image_url,
            piece_type: item.piece_type,
          })),
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setConfirmedId(suggestion.scheme_id);
        setDailyLookId(data.daily_look_id ?? null);
      }
    } catch {
      // silently ignore
    }
  }

  async function sendFeedback(feedback: FeedbackValue) {
    if (!dailyLookId) return;
    try {
      const response = await fetch(`/api/autopilot/daily/${dailyLookId}/feedback`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ feedback }),
      });
      if (response.ok) {
        setFeedbackSent((prev) => ({ ...prev, [dailyLookId]: feedback }));
      }
    } catch {
      // silently ignore
    }
  }

  const existingFeedback = dailyLookId ? feedbackSent[dailyLookId] : undefined;

  return (
    <div className="space-y-4">
      <SectionBlock title="Configurar Look" subtitle="Escolha a ocasião e humor para gerar looks do seu guarda-roupa">
        <div className="mt-4 space-y-4">
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Ocasião</label>
            <div className="flex flex-wrap gap-2">
              {OCCASIONS.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setOccasion(value)}
                  className="rounded-full px-4 py-1.5 text-sm transition-colors"
                  style={{
                    background: occasion === value ? '#ffffff' : 'transparent',
                    color: occasion === value ? '#0f172a' : 'var(--muted-foreground)',
                    border: occasion === value ? 'none' : '1px solid var(--border)',
                    fontWeight: occasion === value ? 600 : 400,
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Humor</label>
            <div className="flex flex-wrap gap-2">
              {MOODS.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setMood(value)}
                  className="rounded-full px-4 py-1.5 text-sm transition-colors"
                  style={{
                    background: mood === value ? '#ffffff' : 'transparent',
                    color: mood === value ? '#0f172a' : 'var(--muted-foreground)',
                    border: mood === value ? 'none' : '1px solid var(--border)',
                    fontWeight: mood === value ? 600 : 400,
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Cidade (opcional)</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Ex: São Paulo"
              className="w-full rounded-lg border border-border bg-accent px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-white/30" style={{ color: "var(--foreground)" }}
            />
          </div>

          <button
            onClick={generateLooks}
            disabled={loading}
            className="w-full rounded-lg py-2.5 text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-50" style={{ background: "linear-gradient(135deg,#7c3aed,#db2777)", color: "#ffffff" }}
          >
            {loading ? 'Gerando looks...' : 'Gerar Looks'}
          </button>
        </div>
      </SectionBlock>

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {suggestions.length > 0 && (
        <SectionBlock title={`${suggestions.length} Looks Gerados`} subtitle="Selecione o look que mais combina com o seu dia — os looks foram salvos automaticamente em Looks Salvos">
          <div className="mt-4 space-y-4">
            {suggestions.map((suggestion) => {
              const isConfirmed = confirmedId === suggestion.scheme_id;
              return (
                <div
                  key={suggestion.scheme_id}
                  className={`rounded-xl border p-4 space-y-3 transition-colors ${
                    isConfirmed ? 'border-white/40 bg-accent' : 'border-border bg-accent'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{suggestion.title}</h3>
                    {isConfirmed && (
                      <span className="text-xs rounded-full bg-white/20 px-3 py-1 text-foreground">
                        Look do Dia ✓
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2 overflow-x-auto">
                    {suggestion.items.map((item) => (
                      <div key={item.wardrobe_item_id} className="flex-shrink-0 space-y-1">
                        <div className="relative h-20 w-20 rounded-lg overflow-hidden bg-accent">
                          {item.image_url ? (
                            <Image src={item.image_url} alt={item.name} fill className="object-cover" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-white/20 text-xs">
                              {item.piece_type}
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground text-center w-20 truncate">{item.name}</p>
                      </div>
                    ))}
                  </div>

                  {!isConfirmed && (
                    <button
                      onClick={() => confirmLook(suggestion)}
                      className="w-full rounded-lg border border-border py-2 text-sm text-foreground hover:bg-accent transition-colors"
                    >
                      Usar este look hoje
                    </button>
                  )}

                  {isConfirmed && !existingFeedback && (
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground">Como foi este look?</p>
                      <div className="flex gap-2">
                        {(['loved', 'used', 'skipped'] as FeedbackValue[]).map((fb) => (
                          <button
                            key={fb}
                            onClick={() => sendFeedback(fb)}
                            className="flex-1 rounded-lg border border-border py-2 text-xs hover:bg-accent transition-colors"
                          >
                            {FEEDBACK_LABELS[fb]}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {isConfirmed && existingFeedback && (
                    <p className="text-xs text-white/40">
                      Avaliado: {FEEDBACK_LABELS[existingFeedback]}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </SectionBlock>
      )}
    </div>
  );
}

// ─── WeekPlanPanel ────────────────────────────────────────────────────────────

interface DayInput {
  date: string;
  occasion: Occasion;
}

interface WeekPlanDayResult {
  date: string;
  occasion: Occasion;
  scheme_id: string | null;
  gap_hints: string[];
  scheme_title?: string;
  scheme_items?: AutopilotItem[];
}

interface WeekPlanResult {
  week_plan_id: string;
  week_start: string;
  days: WeekPlanDayResult[];
}

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

function WeekPlanPanel() {
  const [weekStart, setWeekStart] = useState(getNextMonday);
  const [city, setCity] = useState('São Paulo');
  const [days, setDays] = useState<DayInput[]>(() => buildDefaultDays(getNextMonday()));
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<WeekPlanResult | null>(null);
  const [error, setError] = useState<string | null>(null);

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
    <div className="space-y-4">
      <SectionBlock title="Configurar Semana" subtitle="Defina a data de início e a ocasião para cada dia — os looks serão vinculados à sua agenda semanal">
        <div className="mt-4 space-y-4">
          <div className="flex gap-4 flex-wrap">
            <div className="space-y-1 flex-1 min-w-[160px]">
              <label className="text-xs text-muted-foreground">Início da semana</label>
              <input
                type="date"
                value={weekStart}
                onChange={(e) => setWeekStart(e.target.value)}
                className="w-full rounded-lg border border-border bg-accent px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white/30"
              />
            </div>
            <div className="space-y-1 flex-1 min-w-[160px]">
              <label className="text-xs text-muted-foreground">Cidade (opcional)</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Ex: São Paulo"
                className="w-full rounded-lg border border-border bg-accent px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-white/30" style={{ color: "var(--foreground)" }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Ocasião por dia</p>
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
                          : 'border border-white/15 text-muted-foreground hover:border-white/40'
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
            className="w-full rounded-lg py-2.5 text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-50" style={{ background: "linear-gradient(135deg,#7c3aed,#db2777)", color: "#ffffff" }}
          >
            {loading ? 'Gerando plano...' : 'Gerar Planejamento Semanal'}
          </button>
        </div>
      </SectionBlock>

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {plan && (
        <SectionBlock title={`Plano — Semana de ${plan.week_start}`} subtitle="Looks gerados para cada dia — todos salvos automaticamente em Looks Salvos">
          <div className="mt-4 space-y-3">
            {plan.days.map((day, index) => (
              <div
                key={day.date}
                className={`rounded-xl border p-4 ${
                  day.scheme_id ? 'border-border bg-accent' : 'border-amber-500/20 bg-amber-500/5'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <p className="text-sm font-semibold">
                      {DAY_LABELS[index]} <span className="text-white/40 font-normal">— {day.date}</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {OCCASIONS.find((o) => o.value === day.occasion)?.label ?? day.occasion}
                    </p>
                    {day.scheme_title && (
                      <p className="text-xs text-white/40 mt-0.5 italic">{day.scheme_title}</p>
                    )}
                  </div>
                  {day.scheme_id ? (
                    <span className="text-xs rounded-full bg-accent px-2 py-0.5 text-muted-foreground flex-shrink-0">Look gerado ✓</span>
                  ) : (
                    <span className="text-xs rounded-full bg-amber-500/20 px-2 py-0.5 text-amber-400 flex-shrink-0">Lacuna</span>
                  )}
                </div>

                {day.scheme_items && day.scheme_items.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto">
                    {day.scheme_items.map((item) => (
                      <div key={item.wardrobe_item_id} className="flex-shrink-0 space-y-1">
                        <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-accent">
                          {item.image_url ? (
                            <Image src={item.image_url} alt={item.name} fill className="object-cover" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-white/20 text-xs">
                              {item.piece_type}
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-white/40 text-center w-16 truncate">{item.name}</p>
                      </div>
                    ))}
                  </div>
                )}

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
        </SectionBlock>
      )}
    </div>
  );
}

// ─── HistoryPanel ─────────────────────────────────────────────────────────────

interface DailyLook {
  daily_look_id: string;
  scheme_id?: string;
  date: string;
  occasion: string;
  mood: string;
  weather_c: number | null;
  city: string;
  feedback: FeedbackValue | null;
  created_at: string;
  scheme_items?: AutopilotItem[];
  title?: string;
}

function HistoryPanel() {
  const [looks, setLooks] = useState<DailyLook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadHistory();
  }, []);

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
      const rawLooks: DailyLook[] = Array.isArray(data.looks) ? data.looks : [];

      // Items already come from the API if stored in the daily look
      setLooks(rawLooks);
    } catch {
      setError('Erro de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  async function sendFeedback(lookId: string, feedback: FeedbackValue) {
    try {
      const response = await fetch(`/api/autopilot/daily/${lookId}/feedback`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ feedback }),
      });
      if (response.ok) {
        setLooks((prev) =>
          prev.map((look) => (look.daily_look_id === lookId ? { ...look, feedback } : look)),
        );
      }
    } catch {
      // silently ignore
    }
  }

  const groupedByDate = looks.reduce<Record<string, DailyLook[]>>((acc, look) => {
    acc[look.date] = [...(acc[look.date] ?? []), look];
    return acc;
  }, {});

  const stats = {
    total: looks.length,
    loved: looks.filter((l) => l.feedback === 'loved').length,
    used: looks.filter((l) => l.feedback === 'used').length,
    skipped: looks.filter((l) => l.feedback === 'skipped').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-sm text-white/40">Carregando histórico...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
        {error}
      </div>
    );
  }

  if (looks.length === 0) {
    return (
      <SectionBlock title="Histórico Vazio" subtitle="Você ainda não registrou nenhum look">
        <p className="mt-4 text-sm text-white/40">
          Gere seu primeiro look na aba <strong className="text-muted-foreground">Looks Diários</strong> para começar o histórico.
        </p>
      </SectionBlock>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total', value: stats.total, color: 'text-white' },
          { label: '❤️ Amei', value: stats.loved, color: 'text-pink-400' },
          { label: '👍 Usei', value: stats.used, color: 'text-blue-400' },
          { label: '⏭️ Pulei', value: stats.skipped, color: 'text-white/40' },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-xl border border-border bg-accent p-3 text-center">
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-white/40 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {Object.entries(groupedByDate)
        .sort(([a], [b]) => b.localeCompare(a))
        .map(([date, dateLooks]) => (
          <SectionBlock key={date} title={date} subtitle={`${dateLooks.length} look${dateLooks.length !== 1 ? 's' : ''} neste dia`}>
            <div className="mt-3 space-y-3">
              {dateLooks.map((look) => (
                <div key={look.daily_look_id} className="rounded-xl border border-border bg-accent p-4 space-y-3">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {look.title ?? OCCASION_LABELS[look.occasion] ?? look.occasion}
                      </span>
                      <span className="text-xs text-white/30">·</span>
                      <span className="text-xs text-muted-foreground">
                        {MOOD_LABELS[look.mood] ?? look.mood}
                      </span>
                    </div>
                    <span className="text-xs text-white/30">{look.city}</span>
                  </div>

                  {/* Peças da combinação */}
                  {look.scheme_items && look.scheme_items.length > 0 ? (
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {look.scheme_items.map((item) => (
                        <div key={item.wardrobe_item_id} className="flex-shrink-0 space-y-1">
                          <div className="relative h-20 w-20 overflow-hidden rounded-xl border border-border bg-white/5">
                            {item.image_url ? (
                              <img
                                src={item.image_url}
                                alt={item.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-white/20 text-xs">
                                📷
                              </div>
                            )}
                          </div>
                          <p className="text-center text-[9px] text-white/50 w-20 truncate">{item.name}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-white/30 italic">Peças não disponíveis</p>
                  )}

                  {/* Feedback */}
                  {look.feedback ? (
                    <span className="inline-block text-xs rounded-full bg-accent px-3 py-0.5 text-muted-foreground">
                      {FEEDBACK_LABELS[look.feedback]}
                    </span>
                  ) : (
                    <div className="flex gap-2">
                      {(['loved', 'used', 'skipped'] as FeedbackValue[]).map((fb) => (
                        <button
                          key={fb}
                          onClick={() => sendFeedback(look.daily_look_id, fb)}
                          className="flex-1 rounded-lg border border-white/15 py-1.5 text-xs hover:bg-accent transition-colors"
                        >
                          {FEEDBACK_LABELS[fb]}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </SectionBlock>
        ))}
    </div>
  );
}

// ─── AutopilotView ────────────────────────────────────────────────────────────

const SECTIONS = ['Looks Diários', 'Semana', 'Histórico'];

const SECTION_META: Record<string, { title: string; subtitle: string }> = {
  'Looks Diários': {
    title: 'Autopiloto de Looks',
    subtitle: 'Gera esquemas de moda do seu guarda-roupa com base na ocasião e humor',
  },
  'Semana': {
    title: 'Planejamento Semanal',
    subtitle: 'Gera looks para cada dia da semana vinculados à sua agenda',
  },
  'Histórico': {
    title: 'Histórico de Looks',
    subtitle: 'Avaliações e feedback dos looks confirmados',
  },
};

function pathnameToSection(pathname: string): string {
  if (pathname.includes('/week')) return 'Semana';
  if (pathname.includes('/history')) return 'Histórico';
  return 'Looks Diários';
}

export default function AutopilotView() {
  const pathname = usePathname();
  const router = useRouter();
  const [selectedSection, setSelectedSection] = useState(() => pathnameToSection(pathname));

  useEffect(() => {
    setSelectedSection(pathnameToSection(pathname));
  }, [pathname]);

  function handleSectionChange(section: string) {
    setSelectedSection(section);
    if (section === 'Semana') router.push('/autopilot/week');
    else if (section === 'Histórico') router.push('/autopilot/history');
    else router.push('/autopilot');
  }

  const meta = SECTION_META[selectedSection] ?? SECTION_META['Looks Diários'];

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <ContextSectionMenu
        title="Autopiloto"
        sections={SECTIONS}
        selectedSection={selectedSection}
        onSelectSection={handleSectionChange}
      />

      <div className="space-y-6">
        <PageHeader title={meta.title} subtitle={meta.subtitle} />

        {selectedSection === 'Looks Diários' && <DailyLookPanel />}
        {selectedSection === 'Semana' && <WeekPlanPanel />}
        {selectedSection === 'Histórico' && <HistoryPanel />}
      </div>
    </div>
  );
}