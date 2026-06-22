'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import SectionBlock from '@/app/components/shared/SectionBlock';
import type { StyleDna, StyleDnaLife, StyleDnaMarker } from '@/app/lib/style-dna';

interface StyleDnaResponse {
  ok: boolean;
  prerequisitesMet: boolean;
  progress: { pieces: number; looks: number; neededPieces: number; neededLooks: number; minPieces: number; minLooks: number };
  dna: StyleDna;
}

interface StyleDnaSectionProps {
  userId: string;
  canEdit: boolean;
}

type LifeCategory = 'lugares' | 'pessoas' | 'animais' | 'objetos';

const MARKER_TIER_META: Record<StyleDnaMarker['tier'], { size: string; opacity: string; ring: string }> = {
  dominante: { size: 'h-12 w-12', opacity: 'opacity-100', ring: 'ring-2 ring-fuchsia-400/70' },
  recorrente: { size: 'h-9 w-9', opacity: 'opacity-90', ring: 'ring-1 ring-violet-400/50' },
  recessivo: { size: 'h-6 w-6', opacity: 'opacity-60', ring: 'ring-1 ring-white/20' },
};

const CATEGORY_META: Array<{ key: LifeCategory; label: string; limit: number; placeholder: string }> = [
  { key: 'lugares', label: 'Lugares', limit: 3, placeholder: 'cidade natal, destino dos sonhos…' },
  { key: 'pessoas', label: 'Pessoas', limit: 3, placeholder: 'quem importa (apelidos)…' },
  { key: 'animais', label: 'Animais', limit: 2, placeholder: 'seu pet, animal favorito…' },
  { key: 'objetos', label: 'Objetos / Itens', limit: 4, placeholder: 'instrumento, livro, hobby, esporte…' },
];

export default function StyleDnaSection({ userId, canEdit }: StyleDnaSectionProps) {
  const [data, setData] = useState<StyleDnaResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Record<LifeCategory, string>>({ lugares: '', pessoas: '', animais: '', objetos: '' });
  const [hidden, setHidden] = useState<Set<LifeCategory>>(new Set());
  const [activeMarkerId, setActiveMarkerId] = useState<string | null>(null);

  const hydrateForm = useCallback((life: StyleDnaLife) => {
    setForm({
      lugares: (life.lugares ?? []).join(', '),
      pessoas: (life.pessoas ?? []).join(', '),
      animais: (life.animais ?? []).join(', '),
      objetos: (life.objetos ?? []).join(', '),
    });
    setHidden(new Set((life.hidden ?? []) as LifeCategory[]));
  }, []);

  const load = useCallback(async () => {
    if (!userId) { setLoading(false); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/style-dna/${encodeURIComponent(userId)}`);
      const payload = await res.json().catch(() => null);
      if (res.ok && payload?.ok) {
        setData(payload as StyleDnaResponse);
        hydrateForm((payload as StyleDnaResponse).dna.life);
      }
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, [userId, hydrateForm]);

  useEffect(() => { void load(); }, [load]);

  const splitToList = (value: string, limit: number) =>
    value.split(',').map((v) => v.trim().slice(0, 30)).filter(Boolean).slice(0, limit);

  const handleSave = async () => {
    if (!canEdit || saving) return;
    setSaving(true);
    const life: StyleDnaLife = {
      lugares: splitToList(form.lugares, 3),
      pessoas: splitToList(form.pessoas, 3),
      animais: splitToList(form.animais, 2),
      objetos: splitToList(form.objetos, 4),
      hidden: Array.from(hidden),
    };
    try {
      const res = await fetch(`/api/style-dna/${encodeURIComponent(userId)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ life }),
      });
      if (res.ok) await load();
    } catch { /* ignore */ }
    finally { setSaving(false); }
  };

  const camada1 = data?.dna.camada1;
  const boldness = camada1?.boldnessIndex ?? 0;

  const progressLabel = useMemo(() => {
    if (!data) return '';
    const { neededPieces, neededLooks } = data.progress;
    const bits: string[] = [];
    if (neededPieces > 0) bits.push(`${neededPieces} peça${neededPieces > 1 ? 's' : ''}`);
    if (neededLooks > 0) bits.push(`${neededLooks} look${neededLooks > 1 ? 's' : ''}`);
    return bits.join(' e ');
  }, [data]);

  if (loading) {
    return <SectionBlock title="DNA de Estilo" subtitle="Sua identidade visual gerada pela IA."><p className="mt-4 text-sm text-white/60">Calculando seu DNA…</p></SectionBlock>;
  }

  if (!data) {
    return <SectionBlock title="DNA de Estilo" subtitle="Sua identidade visual gerada pela IA."><p className="mt-4 text-sm text-white/60">Não foi possível carregar o DNA de Estilo.</p></SectionBlock>;
  }

  // Critério 3 — dados insuficientes.
  if (!data.prerequisitesMet) {
    const piecesPct = Math.min(100, Math.round((data.progress.pieces / data.progress.minPieces) * 100));
    const looksPct = Math.min(100, Math.round((data.progress.looks / data.progress.minLooks) * 100));
    return (
      <SectionBlock title="DNA de Estilo" subtitle="Sua identidade visual gerada pela IA.">
        <div className="mt-4 rounded-2xl border border-white/15 bg-white/5 p-5">
          <p className="text-sm text-white/80">Seu DNA de Estilo ainda está bloqueado. Faltam {progressLabel || 'alguns itens'} para destravá-lo.</p>
          <div className="mt-4 space-y-3">
            <div>
              <div className="flex justify-between text-xs text-white/60"><span>Peças no guarda-roupa</span><span>{data.progress.pieces}/{data.progress.minPieces}</span></div>
              <div className="mt-1 h-2 rounded-full bg-white/10"><div className="h-2 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500" style={{ width: `${piecesPct}%` }} /></div>
            </div>
            <div>
              <div className="flex justify-between text-xs text-white/60"><span>Looks criados</span><span>{data.progress.looks}/{data.progress.minLooks}</span></div>
              <div className="mt-1 h-2 rounded-full bg-white/10"><div className="h-2 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500" style={{ width: `${looksPct}%` }} /></div>
            </div>
          </div>
          <p className="mt-4 text-xs text-white/45">Cadastre mais peças e monte mais looks — quanto mais você usa o SAI, mais autêntico fica o seu DNA.</p>
        </div>
      </SectionBlock>
    );
  }

  return (
    <SectionBlock title="DNA de Estilo" subtitle="Sua identidade visual única, gerada pela IA a partir do seu guarda-roupa e da sua vida.">
      {/* Card Visual */}
      <div className="mt-4 overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-br from-violet-900/30 via-fuchsia-900/15 to-slate-950 p-5">
        <p className="text-[10px] uppercase tracking-[0.2em] text-fuchsia-300/70">Arquétipo de Estilo</p>
        <h3 className="text-2xl font-black text-white">{camada1?.archetype}</h3>

        <p className="mt-4 text-sm italic leading-relaxed text-white/85">“{data.dna.identityPhrase}”</p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-[10px] uppercase tracking-[0.16em] text-white/45">Paleta cromática</p>
            <div className="mt-2 flex gap-1.5">
              {camada1?.palette.length ? camada1.palette.map((c) => (
                <span key={c.name} title={c.name} className="h-7 w-7 rounded-full border border-white/25" style={{ background: c.hex }} />
              )) : <span className="text-xs text-white/50">Sem cores suficientes ainda.</span>}
            </div>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-[0.16em] text-white/45">Índice de ousadia</p>
            <div className="mt-2 flex items-center gap-2">
              <div className="h-2 flex-1 rounded-full bg-white/10"><div className="h-2 rounded-full bg-gradient-to-r from-emerald-400 to-fuchsia-500" style={{ width: `${boldness}%` }} /></div>
              <span className="text-sm font-bold text-white tabular-nums">{boldness}</span>
            </div>
            <p className="mt-1 text-[10px] text-white/40">Silhueta: {camada1?.silhouette}</p>
          </div>
        </div>

        {camada1?.iconPiece ? (
          <div className="mt-5 flex items-center gap-3 rounded-2xl border border-white/12 bg-black/20 p-3">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-black/30">
              {camada1.iconPiece.imageUrl ? (
                <Image src={camada1.iconPiece.imageUrl} alt={camada1.iconPiece.name} width={56} height={56} className="h-full w-full object-cover" unoptimized />
              ) : null}
            </div>
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-[0.16em] text-white/45">Peça ícone</p>
              <p className="truncate text-sm font-semibold text-white">{camada1.iconPiece.name}</p>
              <p className="truncate text-xs text-white/50">{camada1.iconPiece.pieceType}</p>
            </div>
          </div>
        ) : null}
      </div>

      {/* Marcadores de DNA — hélice de marcas/peças recorrentes */}
      {data.dna.markers.length ? (
        <div className="mt-4 rounded-2xl border border-white/15 bg-white/5 p-4">
          <p className="text-sm font-semibold text-white">Marcadores de DNA</p>
          <p className="mt-0.5 text-xs text-white/55">Marcas e peças que se repetem na sua história — genes dominantes aparecem maiores.</p>

          <div className="mt-4 flex flex-col items-stretch gap-2">
            {data.dna.markers.map((marker, idx) => {
              const meta = MARKER_TIER_META[marker.tier];
              const isActive = activeMarkerId === marker.id;
              const align = idx % 2 === 0 ? 'self-start' : 'self-end';
              return (
                <div key={marker.id} className={`flex max-w-[85%] items-center gap-3 ${align}`}>
                  {idx % 2 !== 0 ? (
                    <button
                      type="button"
                      onClick={() => setActiveMarkerId(isActive ? null : marker.id)}
                      className="text-right text-xs text-white/70"
                    >
                      <span className="block font-medium text-white">{marker.label}</span>
                      <span className="text-white/40">{marker.tier}</span>
                    </button>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => setActiveMarkerId(isActive ? null : marker.id)}
                    className={`relative shrink-0 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 ${meta.size} ${meta.opacity} ${meta.ring}`}
                    title={`${marker.label} — ${marker.tier}`}
                  />
                  {idx % 2 === 0 ? (
                    <button
                      type="button"
                      onClick={() => setActiveMarkerId(isActive ? null : marker.id)}
                      className="text-left text-xs text-white/70"
                    >
                      <span className="block font-medium text-white">{marker.label}</span>
                      <span className="text-white/40">{marker.tier}</span>
                    </button>
                  ) : null}
                </div>
              );
            })}
          </div>

          {activeMarkerId ? (() => {
            const marker = data.dna.markers.find((m) => m.id === activeMarkerId);
            if (!marker) return null;
            return (
              <div className="mt-4 rounded-xl border border-white/12 bg-black/25 p-3 text-xs text-white/70">
                <p className="font-semibold text-white">{marker.label}</p>
                <p className="mt-1">{marker.pieceCount} peça{marker.pieceCount > 1 ? 's' : ''} no guarda-roupa · usada{marker.usageCount === 1 ? '' : 's'} em {marker.usageCount} look{marker.usageCount === 1 ? '' : 's'}</p>
                {marker.lastUsedAt ? <p className="mt-1 text-white/45">Último uso: {new Date(marker.lastUsedAt).toLocaleDateString('pt-BR')}</p> : null}
              </div>
            );
          })() : null}
        </div>
      ) : null}

      {/* Camada 2 — Identidade de Vida */}
      <div className="mt-4 rounded-2xl border border-white/15 bg-white/5 p-4">
        <p className="text-sm font-semibold text-white">Identidade de Vida</p>
        <p className="mt-0.5 text-xs text-white/55">{canEdit ? 'Enriqueça seu DNA com marcos da sua vida. Separe por vírgulas.' : 'Marcos de vida declarados por este criador.'}</p>

        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {CATEGORY_META.map((cat) => (
            <div key={cat.key}>
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-white/70">{cat.label} <span className="text-white/35">(até {cat.limit})</span></label>
                {canEdit ? (
                  <button
                    type="button"
                    onClick={() => setHidden((prev) => { const next = new Set(prev); if (next.has(cat.key)) next.delete(cat.key); else next.add(cat.key); return next; })}
                    className={`text-[10px] ${hidden.has(cat.key) ? 'text-amber-300' : 'text-white/40 hover:text-white/70'}`}
                    title="Ocultar este campo do card compartilhado"
                  >
                    {hidden.has(cat.key) ? '🔒 privado' : '👁 visível'}
                  </button>
                ) : null}
              </div>
              <input
                type="text"
                value={form[cat.key]}
                disabled={!canEdit}
                placeholder={cat.placeholder}
                onChange={(e) => setForm((prev) => ({ ...prev, [cat.key]: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-white/15 bg-black/20 px-2.5 py-1.5 text-sm text-white outline-none placeholder:text-white/30 disabled:opacity-60"
              />
            </div>
          ))}
        </div>

        {canEdit ? (
          <button
            type="button"
            onClick={() => void handleSave()}
            disabled={saving}
            className="mt-4 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            {saving ? 'Salvando…' : 'Salvar e regenerar frase'}
          </button>
        ) : null}
      </div>
    </SectionBlock>
  );
}
