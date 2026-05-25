'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { getAuthSessionToken } from '@/app/lib/authSession';
import PageHeader from '@/app/components/shell/PageHeader';

type Occasion = 'trabalho' | 'casual' | 'balada' | 'academia' | 'evento';
type Mood = 'disposto' | 'cansado' | 'confiante' | 'criativo';
type Feedback = 'loved' | 'used' | 'skipped';

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
  weather_fit_note: string;
  score: number;
}

interface WeatherInfo {
  temp_c: number;
  condition: string;
  city: string;
}

const OCCASIONS: { value: Occasion; label: string }[] = [
  { value: 'trabalho', label: 'Trabalho' },
  { value: 'casual', label: 'Casual' },
  { value: 'balada', label: 'Balada' },
  { value: 'academia', label: 'Academia' },
  { value: 'evento', label: 'Evento' },
];

const MOODS: { value: Mood; label: string }[] = [
  { value: 'disposto', label: 'Disposto' },
  { value: 'cansado', label: 'Cansado' },
  { value: 'confiante', label: 'Confiante' },
  { value: 'criativo', label: 'Criativo' },
];

const WEATHER_CONDITION_LABELS: Record<string, string> = {
  clear: '☀️ Limpo',
  partly_cloudy: '⛅ Nublado',
  fog: '🌫️ Neblina',
  drizzle: '🌦️ Garoa',
  rain: '🌧️ Chuva',
  snow: '❄️ Neve',
  thunderstorm: '⛈️ Tempestade',
};

export default function AutopilotPage() {
  const router = useRouter();
  const [occasion, setOccasion] = useState<Occasion>('casual');
  const [mood, setMood] = useState<Mood>('disposto');
  const [city, setCity] = useState('São Paulo');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [weather, setWeather] = useState<WeatherInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirmedId, setConfirmedId] = useState<string | null>(null);
  const [feedbackSent, setFeedbackSent] = useState<Record<string, Feedback>>({});
  const [dailyLookId, setDailyLookId] = useState<string | null>(null);

  useEffect(() => {
    if (!getAuthSessionToken()) router.replace('/authview');
  }, [router]);

  async function generateLooks() {
    setLoading(true);
    setError(null);
    setSuggestions([]);
    setWeather(null);
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
      setWeather(data.weather ?? null);
    } catch {
      setError('Erro de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  async function confirmLook(suggestion: Suggestion) {
    if (!weather) return;
    try {
      const response = await fetch('/api/autopilot/daily/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ scheme_id: suggestion.scheme_id, occasion, mood, weather }),
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

  async function sendFeedback(feedback: Feedback) {
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
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <PageHeader title="Autopiloto de Looks" subtitle="Looks diários personalizados" />

      <div className="mx-auto max-w-3xl px-4 py-6 space-y-6">
        {/* Controls */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-5 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-white/60">Configurar Look</h2>

          <div className="space-y-1">
            <label className="text-xs text-white/50">Ocasião</label>
            <div className="flex flex-wrap gap-2">
              {OCCASIONS.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setOccasion(value)}
                  className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
                    occasion === value
                      ? 'bg-white text-black font-semibold'
                      : 'border border-white/20 text-white/70 hover:border-white/50'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-white/50">Humor</label>
            <div className="flex flex-wrap gap-2">
              {MOODS.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setMood(value)}
                  className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
                    mood === value
                      ? 'bg-white text-black font-semibold'
                      : 'border border-white/20 text-white/70 hover:border-white/50'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-white/50">Cidade</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Ex: São Paulo"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-white/30"
            />
          </div>

          <button
            onClick={generateLooks}
            disabled={loading}
            className="w-full rounded-lg bg-white py-2.5 text-sm font-semibold text-black transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? 'Gerando...' : 'Gerar Looks'}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Weather */}
        {weather && (
          <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm">
            <span className="text-white/60">
              {WEATHER_CONDITION_LABELS[weather.condition] ?? weather.condition}
            </span>
            <span className="font-semibold">{weather.temp_c.toFixed(0)}°C</span>
            <span className="text-white/40">{weather.city}</span>
          </div>
        )}

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-white/60">
              {suggestions.length} Sugestões
            </h2>

            {suggestions.map((suggestion) => {
              const isConfirmed = confirmedId === suggestion.scheme_id;
              return (
                <div
                  key={suggestion.scheme_id}
                  className={`rounded-xl border p-4 space-y-3 transition-colors ${
                    isConfirmed ? 'border-white/40 bg-white/10' : 'border-white/10 bg-white/5'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{suggestion.title}</h3>
                    {isConfirmed && (
                      <span className="text-xs rounded-full bg-white/20 px-3 py-1 text-white/80">
                        Look do Dia ✓
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-white/50">{suggestion.weather_fit_note}</p>

                  <div className="flex gap-2 overflow-x-auto">
                    {suggestion.items.map((item) => (
                      <div key={item.wardrobe_item_id} className="flex-shrink-0 space-y-1">
                        <div className="relative h-20 w-20 rounded-lg overflow-hidden bg-white/5">
                          {item.image_url ? (
                            <Image
                              src={item.image_url}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-white/20 text-xs">
                              {item.piece_type}
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-white/50 text-center w-20 truncate">{item.name}</p>
                      </div>
                    ))}
                  </div>

                  {!isConfirmed && (
                    <button
                      onClick={() => confirmLook(suggestion)}
                      className="w-full rounded-lg border border-white/20 py-2 text-sm text-white/80 hover:bg-white/10 transition-colors"
                    >
                      Usar este look hoje
                    </button>
                  )}

                  {isConfirmed && !existingFeedback && (
                    <div className="space-y-2">
                      <p className="text-xs text-white/50">Como foi este look?</p>
                      <div className="flex gap-2">
                        {([['loved', '❤️ Amei'], ['used', '👍 Usei'], ['skipped', '⏭️ Pulei']] as [Feedback, string][]).map(([fb, label]) => (
                          <button
                            key={fb}
                            onClick={() => sendFeedback(fb)}
                            className="flex-1 rounded-lg border border-white/20 py-2 text-xs hover:bg-white/10 transition-colors"
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {isConfirmed && existingFeedback && (
                    <p className="text-xs text-white/40">
                      Avaliado: {existingFeedback === 'loved' ? '❤️ Amei' : existingFeedback === 'used' ? '👍 Usei' : '⏭️ Pulei'}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Week planner link */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold">Planejamento Semanal</p>
            <p className="text-xs text-white/50">Planejar looks para a semana inteira</p>
          </div>
          <button
            onClick={() => router.push('/autopilot/week')}
            className="rounded-lg border border-white/20 px-4 py-2 text-sm hover:bg-white/10 transition-colors"
          >
            Planejar →
          </button>
        </div>

        {/* History link */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold">Histórico de Looks</p>
            <p className="text-xs text-white/50">Ver avaliações anteriores</p>
          </div>
          <button
            onClick={() => router.push('/autopilot/history')}
            className="rounded-lg border border-white/20 px-4 py-2 text-sm hover:bg-white/10 transition-colors"
          >
            Ver histórico →
          </button>
        </div>
      </div>
    </div>
  );
}
