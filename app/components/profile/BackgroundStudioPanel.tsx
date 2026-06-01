'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  SHAPE_SEGMENT_OPTIONS,
  GRADIENT_PRESETS,
  COLOR_SWATCHES,
  GEOMETRY_DESCRIPTION_MAP,
} from '@/app/lib/fashion-ai/background-studio/constants';
import { buildGeometryPreviewSvg } from '@/app/lib/fashion-ai/background-studio/procedural';
import {
  applyPageBackgroundConfig,
  applySurfaceColorConfig,
  readSurfaceColorConfig,
  savePageBackgroundConfig,
  saveSurfaceColorConfig,
  ensureSavedPageBackgroundConfig,
  type PageBackgroundConfig,
  type PageBackgroundShape,
} from '@/app/lib/pageBackground';
import { getLS, setLS } from '@/app/lib/SafeStorage';

/* ── helpers ── */
const ACTIVE_BG_KEY = 'sai_active_bg_studio';
const ACTIVE_TAB_KEY = 'sai_active_bg_tab';

function buildGradientCss(stops: { color: string; position: number }[], type: string, angle: number) {
  const s = stops.map((s) => `${s.color} ${s.position}%`).join(', ');
  if (type === 'radial') return `radial-gradient(circle, ${s})`;
  return `linear-gradient(${angle}deg, ${s})`;
}

function buildShapeOverlaySvg(shape: PageBackgroundShape, color: string): string {
  if (shape === 'none') return '';
  const geomMap: Record<string, string> = {
    orb: `<radialGradient id='o' cx='30%' cy='25%' r='55%'><stop offset='0%' stop-color='${color}' stop-opacity='.55'/><stop offset='100%' stop-color='${color}' stop-opacity='0'/></radialGradient><rect width='100%' height='100%' fill='url(#o)'/>`,
    diamond: `<path d='M600,60 L1100,400 L600,740 L100,400 Z' fill='none' stroke='${color}' stroke-opacity='.35' stroke-width='2'/>`,
    mesh: Array.from({length:8},(_,i)=>`<line x1='${i*160}' y1='0' x2='${i*160+120}' y2='800' stroke='${color}' stroke-opacity='.22' stroke-width='1'/>`).join('')+Array.from({length:6},(_,i)=>`<line x1='0' y1='${i*135}' x2='1200' y2='${i*135}' stroke='${color}' stroke-opacity='.18' stroke-width='1'/>`).join(''),
    stars: Array.from({length:18},(_,i)=>`<path d='M${80+(i%6)*190},${70+Math.floor(i/6)*230} l10,28h28l-22,16 8,28-24-18-24,18 8-28-22-16h28Z' fill='${color}' opacity='.32'/>`).join(''),
    circles: Array.from({length:12},(_,i)=>`<circle cx='${100+(i%4)*300}' cy='${120+Math.floor(i/4)*250}' r='${40+(i%3)*15}' fill='none' stroke='${color}' stroke-opacity='.38' stroke-width='2'/>`).join(''),
    triangles: Array.from({length:5},(_,row)=>Array.from({length:7},(__,col)=>`<path d='M${50+col*170},${180+row*130} L${135+col*170},${50+row*130} L${220+col*170},${180+row*130} Z' fill='${color}' opacity='.22'/>`).join('')).join(''),
    waves: Array.from({length:6},(_,i)=>`<path d='M-40,${110+i*120} C200,${70+i*120} 400,${155+i*120} 620,${115+i*120} C840,${75+i*120} 1020,${160+i*120} 1240,${120+i*120}' stroke='${color}' stroke-opacity='.35' stroke-width='10' fill='none'/>`).join(''),
    beams: Array.from({length:10},(_,i)=>`<rect x='${i*130}' y='0' width='18' height='800' fill='${color}' opacity='.2' transform='rotate(12 ${i*130} 0)'/>`).join(''),
    arrows: Array.from({length:6},(_,i)=>`<path d='M${60+i*180},100 L${145+i*180},220 L${60+i*180},340' stroke='${color}' stroke-opacity='.35' stroke-width='16' fill='none' stroke-linejoin='round'/>`).join(''),
    flowers: Array.from({length:9},(_,i)=>`<g transform='translate(${80+(i%3)*380} ${80+Math.floor(i/3)*250})'><circle cx='55' cy='55' r='14' fill='#fde68a' opacity='.8'/><ellipse cx='55' cy='25' rx='13' ry='22' fill='${color}' opacity='.4'/><ellipse cx='55' cy='85' rx='13' ry='22' fill='${color}' opacity='.4'/><ellipse cx='25' cy='55' rx='22' ry='13' fill='${color}' opacity='.4'/><ellipse cx='85' cy='55' rx='22' ry='13' fill='${color}' opacity='.4'/></g>`).join(''),
  };
  const inner = (geomMap as Record<string, string>)[shape] ?? '';
  return `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' width='1200' height='800'><defs>${inner.includes('radialGradient') ? inner.match(/<radialGradient[^>]*>.*?<\/radialGradient>/s)?.[0] ?? '' : ''}</defs>${inner}</svg>`)}`;
}

const SHAPE_LABELS: Record<string, string> = {
  none:'Nenhum', orb:'Orbe', diamond:'Diamante', mesh:'Malha',
  stars:'Estrelas', circles:'Círculos', triangles:'Triângulos',
  waves:'Ondas', beams:'Raios', arrows:'Setas', flowers:'Flores',
};
const SHAPE_EMOJIS: Record<string, string> = {
  none:'✕', orb:'🔮', diamond:'💎', mesh:'🕸️',
  stars:'⭐', circles:'⭕', triangles:'🔺', waves:'🌊',
  beams:'✨', arrows:'➡️', flowers:'🌸',
};

type StudioTab = 'presets' | 'gradiente' | 'geometria' | 'cor';

interface BackgroundStudioPanelProps {
  onSaved?: () => void;
}

export default function BackgroundStudioPanel({ onSaved }: BackgroundStudioPanelProps) {
  /* ── Tab state — restored from localStorage ── */
  const [tab, setTab] = useState<StudioTab>('presets');

  /* ── Gradient state ── */
  const [gradAngle, setGradAngle] = useState(135);
  const [gradType,  setGradType]  = useState<'linear' | 'radial'>('linear');
  const [gradStops, setGradStops] = useState([
    { color: '#0f172a', position: 0   },
    { color: '#7c3aed', position: 50  },
    { color: '#db2777', position: 100 },
  ]);

  /* ── Shape state ── */
  const [shape,      setShape]      = useState<PageBackgroundShape>('orb');
  const [shapeColor, setShapeColor] = useState('#a78bfa');

  /* ── Solid color state ── */
  const [solidColor, setSolidColor] = useState('#1e293b');

  /* ── Preset state — stores the full gradient string so save always works ── */
  const [activePresetId,       setActivePresetId]       = useState<string | null>(null);
  const [activePresetGradient, setActivePresetGradient] = useState<string>('');

  /* ── Save feedback ── */
  const [saveMsg, setSaveMsg] = useState('');

  /* skip live-preview on first render */
  const mounted = useRef(false);

  /* ── Restore state from localStorage on mount ── */
  useEffect(() => {
    const savedTab = getLS(ACTIVE_TAB_KEY) as StudioTab | null;
    if (savedTab) setTab(savedTab);

    const savedPresetId = getLS(ACTIVE_BG_KEY);
    if (savedPresetId) setActivePresetId(savedPresetId);
    setSolidColor(readSurfaceColorConfig().color);

    /* restore gradient stops if saved */
    try {
      const raw = getLS('sai_page_background_config');
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<PageBackgroundConfig>;
        if (parsed.gradient) {
          /* try to re-match a preset */
          const match = GRADIENT_PRESETS.find((p) =>
            buildGradientCss(p.config.gradient?.stops ?? [], p.config.gradient?.type ?? 'linear', p.config.gradient?.angle ?? 135) === parsed.gradient
          );
          if (match) {
            setGradStops(match.config.gradient?.stops ?? gradStops);
            setGradAngle(match.config.gradient?.angle ?? gradAngle);
            setGradType((match.config.gradient?.type as 'linear' | 'radial') ?? gradType);
            setActivePresetGradient(parsed.gradient);
          }
        }
      }
    } catch {}

    mounted.current = true;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Build current CSS gradient from active tab ── */
  const buildCurrentBackground = useCallback((): string => {
    switch (tab) {
      case 'cor':       return solidColor;
      case 'gradiente': return buildGradientCss(gradStops, gradType, gradAngle);
      case 'geometria': {
        const base = `linear-gradient(135deg, #0f172a 0%, #1e0a3c 100%)`;
        const svg  = buildShapeOverlaySvg(shape, shapeColor);
        return svg ? `url("${svg}"), ${base}` : base;
      }
      case 'presets':
        return activePresetGradient;
      default:
        return '';
    }
  }, [tab, solidColor, gradStops, gradType, gradAngle, shape, shapeColor, activePresetGradient]);

  /* ── Live preview on state change (skip first render) ── */
  useEffect(() => {
    if (!mounted.current) return;
    if (tab === 'presets') return; // presets apply immediately on click
    if (tab === 'cor') {
      applySurfaceColorConfig({ color: solidColor });
      return;
    }
    const bg = buildCurrentBackground();
    if (bg) document.documentElement.style.setProperty('--home-shell-bg', bg);
  }, [tab, buildCurrentBackground]);

  /* ── Apply + save ── */
  const applyAndSave = () => {
    if (tab === 'cor') {
      saveSurfaceColorConfig({ color: solidColor });
      setLS(ACTIVE_TAB_KEY, tab);
      setSaveMsg('✓ Cor dos elementos salva com sucesso!');
      setTimeout(() => setSaveMsg(''), 3000);
      onSaved?.();
      return;
    }

    const gradient = buildCurrentBackground();
    if (!gradient) {
      setSaveMsg('⚠️ Selecione uma opção antes de salvar.');
      setTimeout(() => setSaveMsg(''), 3000);
      return;
    }
    const config: PageBackgroundConfig = {
      gradient,
      shape: tab === 'geometria' ? shape : 'none',
    };
    applyPageBackgroundConfig(config);
    savePageBackgroundConfig(config);          /* ← uses the lib's own save fn */
    setLS(ACTIVE_TAB_KEY, tab);
    if (activePresetId) setLS(ACTIVE_BG_KEY, activePresetId);

    setSaveMsg('✓ Fundo salvo com sucesso!');
    setTimeout(() => setSaveMsg(''), 3000);
    onSaved?.();
  };

  /* ── Preset click ── */
  const applyGradientPreset = (preset: typeof GRADIENT_PRESETS[0]) => {
    const stops  = preset.config.gradient?.stops ?? [{ color: '#0f172a', position: 0 }, { color: '#7c3aed', position: 100 }];
    const angle  = preset.config.gradient?.angle ?? 135;
    const type   = (preset.config.gradient?.type as 'linear' | 'radial') ?? 'linear';
    const bg     = buildGradientCss(stops, type, angle);

    setGradStops(stops);
    setGradAngle(angle);
    setGradType(type);
    setActivePresetId(preset.label);
    setActivePresetGradient(bg);

    /* apply live */
    document.documentElement.style.setProperty('--home-shell-bg', bg);
  };

  /* ── Reset ── */
  const handleReset = () => {
    const defaultCfg = ensureSavedPageBackgroundConfig();
    applyPageBackgroundConfig(defaultCfg);
    setActivePresetId(null);
    setActivePresetGradient('');
    setTab('presets');
    setSaveMsg('Fundo restaurado para o padrão.');
    setTimeout(() => setSaveMsg(''), 2500);
  };

  /* ── Shared UI helpers ── */
  const sectionTitle = (t: string) => (
    <p style={{ fontSize:'0.8125rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', color:'var(--muted-foreground)', margin:'0 0 0.75rem' }}>{t}</p>
  );
  const tabBtnStyle = (active: boolean): React.CSSProperties => ({
    flex:1, padding:'0.5rem 0.25rem', borderRadius:'0.5rem', border:'none',
    fontSize:'0.8125rem', fontWeight:600, cursor:'pointer', fontFamily:'inherit',
    background: active ? 'linear-gradient(135deg,rgba(124,58,237,0.25),rgba(219,39,119,0.15))' : 'transparent',
    color: active ? 'var(--primary)' : 'var(--muted-foreground)',
    borderBottom: active ? '2px solid var(--primary)' : '2px solid transparent',
    transition: 'all 0.15s',
  });

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>

      {/* Tab bar */}
      <div style={{ display:'flex', gap:'0.25rem', background:'var(--accent)', borderRadius:'0.75rem', padding:'0.25rem' }}>
        {([
          { id:'presets',   label:'⚡ Presets'    },
          { id:'gradiente', label:'🌈 Gradiente'  },
          { id:'geometria', label:'🔷 Geometria'  },
          { id:'cor',       label:'🎨 Cor dos elementos' },
        ] as const).map((t) => (
          <button key={t.id} type="button" onClick={() => setTab(t.id)} style={tabBtnStyle(tab === t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── PRESETS ── */}
      {tab === 'presets' && (
        <div>
          {sectionTitle('Gradientes pré-definidos')}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(155px,1fr))', gap:'0.75rem' }}>
            {GRADIENT_PRESETS.map((preset) => {
              const bg       = buildGradientCss(preset.config.gradient?.stops ?? [], preset.config.gradient?.type ?? 'linear', preset.config.gradient?.angle ?? 135);
              const isActive = activePresetId === preset.label;
              return (
                <button key={preset.label} type="button" onClick={() => applyGradientPreset(preset)}
                  style={{ border: isActive ? '2px solid var(--primary)' : '2px solid var(--border)', borderRadius:'0.875rem', overflow:'hidden', cursor:'pointer', background:'none', padding:0, transition:'all 0.15s', boxShadow: isActive ? '0 0 0 3px rgba(124,58,237,0.25)' : 'none' }}>
                  <div style={{ height:'3.5rem', background:bg }} />
                  <div style={{ padding:'0.5rem 0.625rem', background:'var(--accent)', borderTop:'1px solid var(--border)', textAlign:'left' }}>
                    <p style={{ fontSize:'0.75rem', fontWeight: isActive ? 700 : 500, color: isActive ? 'var(--primary)' : 'var(--foreground)', margin:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                      {isActive ? '✓ ' : ''}{preset.label}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
          {activePresetId && (
            <p style={{ marginTop:'0.75rem', fontSize:'0.8125rem', color:'var(--muted-foreground)' }}>
              Preset selecionado: <strong style={{ color:'var(--primary)' }}>{activePresetId}</strong>. Clique em <strong>Salvar fundo</strong> para persistir.
            </p>
          )}
        </div>
      )}

      {/* ── GRADIENTE ── */}
      {tab === 'gradiente' && (
        <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
          <div style={{ height:'6rem', borderRadius:'0.875rem', border:'1px solid var(--border)', background:buildGradientCss(gradStops, gradType, gradAngle), transition:'background 0.3s' }} />

          {sectionTitle('Tipo')}
          <div style={{ display:'flex', gap:'0.5rem' }}>
            {(['linear','radial'] as const).map((t) => (
              <button key={t} type="button" onClick={() => setGradType(t)}
                style={{ flex:1, padding:'0.5rem', borderRadius:'0.5rem', border:`1px solid ${gradType===t ? 'var(--primary)' : 'var(--border)'}`, background: gradType===t ? 'rgba(124,58,237,0.12)' : 'var(--accent)', color: gradType===t ? 'var(--primary)' : 'var(--foreground)', fontWeight:600, fontSize:'0.875rem', cursor:'pointer', fontFamily:'inherit' }}>
                {t === 'linear' ? '↗ Linear' : '◉ Radial'}
              </button>
            ))}
          </div>

          {gradType === 'linear' && (
            <>
              {sectionTitle(`Ângulo: ${gradAngle}°`)}
              <input type="range" min={0} max={360} value={gradAngle} onChange={(e) => setGradAngle(+e.target.value)} style={{ width:'100%', accentColor:'var(--primary)' }} />
            </>
          )}

          {sectionTitle('Cores')}
          <div style={{ display:'flex', flexDirection:'column', gap:'0.5rem' }}>
            {gradStops.map((stop, i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
                <input type="color" value={stop.color}
                  onChange={(e) => { const s=[...gradStops]; s[i]={...s[i],color:e.target.value}; setGradStops(s); }}
                  style={{ width:'2.5rem', height:'2.5rem', borderRadius:'0.5rem', border:'1px solid var(--border)', cursor:'pointer', padding:'2px' }} />
                <input type="range" min={0} max={100} value={stop.position}
                  onChange={(e) => { const s=[...gradStops]; s[i]={...s[i],position:+e.target.value}; setGradStops(s); }}
                  style={{ flex:1, accentColor:'var(--primary)' }} />
                <span style={{ fontSize:'0.75rem', color:'var(--muted-foreground)', minWidth:'2.5rem', textAlign:'right' }}>{stop.position}%</span>
                {gradStops.length > 2 && (
                  <button type="button" onClick={() => setGradStops(gradStops.filter((_,j) => j!==i))}
                    style={{ border:'none', background:'none', color:'#ef4444', cursor:'pointer', fontSize:'1rem', padding:'0.25rem' }}>✕</button>
                )}
              </div>
            ))}
            {gradStops.length < 5 && (
              <button type="button" onClick={() => setGradStops([...gradStops,{color:'#ffffff',position:100}])}
                style={{ alignSelf:'flex-start', border:'1px dashed var(--border)', background:'var(--accent)', color:'var(--muted-foreground)', borderRadius:'0.5rem', padding:'0.375rem 0.875rem', fontSize:'0.8125rem', cursor:'pointer', fontFamily:'inherit' }}>
                + Adicionar cor
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── GEOMETRIA ── */}
      {tab === 'geometria' && (
        <div style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>
          <div style={{ height:'7rem', borderRadius:'0.875rem', border:'1px solid var(--border)', overflow:'hidden', position:'relative', background:'linear-gradient(135deg,#0f172a,#1e0a3c)' }}>
            {shape !== 'none' && (
              <img src={buildGeometryPreviewSvg(shape as Parameters<typeof buildGeometryPreviewSvg>[0], shapeColor)}
                alt="preview" style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', opacity:0.85 }} />
            )}
            <div style={{ position:'absolute', bottom:'0.5rem', right:'0.75rem', fontSize:'0.75rem', color:'rgba(255,255,255,0.7)', fontWeight:600 }}>
              {SHAPE_EMOJIS[shape]} {SHAPE_LABELS[shape]}
            </div>
          </div>

          {sectionTitle('Cor das formas')}
          <div style={{ display:'flex', flexWrap:'wrap', gap:'0.5rem', alignItems:'center' }}>
            {[...COLOR_SWATCHES,'#7c3aed','#db2777','#10b981','#f59e0b'].map((c) => (
              <button key={c} type="button" onClick={() => setShapeColor(c)}
                style={{ width:'2rem', height:'2rem', borderRadius:'50%', background:c, border: shapeColor===c ? '3px solid white' : '2px solid var(--border)', cursor:'pointer', outline: shapeColor===c ? '2px solid var(--primary)' : 'none', transition:'all 0.1s' }} />
            ))}
            <input type="color" value={shapeColor} onChange={(e) => setShapeColor(e.target.value)}
              style={{ width:'2rem', height:'2rem', borderRadius:'50%', border:'1px solid var(--border)', cursor:'pointer', padding:'2px' }} />
          </div>

          {sectionTitle('Tipo de geometria')}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(110px,1fr))', gap:'0.625rem' }}>
            {SHAPE_SEGMENT_OPTIONS.map((s) => {
              const isActive = shape === s;
              return (
                <button key={s} type="button" onClick={() => setShape(s as PageBackgroundShape)}
                  style={{ borderRadius:'0.75rem', border: isActive ? '2px solid var(--primary)' : '2px solid var(--border)', background: isActive ? 'rgba(124,58,237,0.1)' : 'var(--accent)', overflow:'hidden', cursor:'pointer', padding:0, transition:'all 0.15s', boxShadow: isActive ? '0 0 0 3px rgba(124,58,237,0.2)' : 'none' }}>
                  <div style={{ height:'3rem', overflow:'hidden', background:'linear-gradient(135deg,#0f172a,#1e1040)', position:'relative' }}>
                    {s !== 'none' && (
                      <img src={buildGeometryPreviewSvg(s as Parameters<typeof buildGeometryPreviewSvg>[0], shapeColor)}
                        alt={s} style={{ width:'100%', height:'100%', objectFit:'cover', opacity:0.9 }} />
                    )}
                  </div>
                  <div style={{ padding:'0.375rem 0.5rem', background:'var(--accent)', borderTop:'1px solid var(--border)' }}>
                    <p style={{ fontSize:'0.6875rem', fontWeight: isActive ? 700 : 500, color: isActive ? 'var(--primary)' : 'var(--foreground)', margin:0, textAlign:'center' }}>
                      {SHAPE_EMOJIS[s]} {SHAPE_LABELS[s]}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          <p style={{ fontSize:'0.75rem', color:'var(--muted-foreground)', background:'var(--accent)', borderRadius:'0.625rem', padding:'0.625rem 0.875rem', border:'1px solid var(--border)' }}>
            💡 <strong>{SHAPE_LABELS[shape]}:</strong> {(GEOMETRY_DESCRIPTION_MAP as Record<string,string>)[shape] ?? 'Sem shapes adicionais.'}
          </p>
        </div>
      )}

      {/* ── COR DOS ELEMENTOS ── */}
      {tab === 'cor' && (
        <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
          <div style={{ height:'5rem', borderRadius:'0.875rem', border:'1px solid var(--border)', background:solidColor, transition:'background 0.2s' }} />
          {sectionTitle('Escolha a cor dos elementos')}
          <p style={{ fontSize:'0.75rem', color:'var(--muted-foreground)', background:'var(--accent)', borderRadius:'0.625rem', padding:'0.625rem 0.875rem', border:'1px solid var(--border)', margin:0 }}>
            Esta cor altera superfícies menores do app, como cards, divisórias e painéis. O fundo da página permanece separado nas abas de fundo.
          </p>
          <div style={{ display:'flex', flexWrap:'wrap', gap:'0.5rem', alignItems:'center' }}>
            {['#0d0b18','#0f172a','#111111','#1a1a2e','#0a0f1e','#f8f7ff','#ffffff','#f3f4f6','#fdf4ff','#fff0f6','#7c3aed','#4c1d95','#db2777','#0ea5e9','#10b981'].map((c) => (
              <button key={c} type="button" onClick={() => setSolidColor(c)}
                style={{ width:'2.25rem', height:'2.25rem', borderRadius:'0.5rem', background:c, border: solidColor===c ? '3px solid white' : '1px solid var(--border)', cursor:'pointer', outline: solidColor===c ? '2px solid var(--primary)' : 'none', transition:'all 0.1s', boxShadow:'0 1px 3px rgba(0,0,0,0.15)' }} />
            ))}
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
            <input type="color" value={solidColor} onChange={(e) => setSolidColor(e.target.value)}
              style={{ width:'3rem', height:'3rem', borderRadius:'0.75rem', border:'1px solid var(--border)', cursor:'pointer', padding:'3px' }} />
            <div>
              <p style={{ fontWeight:600, fontSize:'0.875rem', margin:0 }}>Cor personalizada</p>
              <p style={{ fontSize:'0.8125rem', color:'var(--muted-foreground)', margin:0 }}>{solidColor}</p>
            </div>
          </div>
        </div>
      )}

      {/* ── Save bar ── */}
      <div style={{ borderTop:'1px solid var(--border)', paddingTop:'1rem', display:'flex', alignItems:'center', gap:'0.75rem', flexWrap:'wrap' }}>
        <button type="button" onClick={applyAndSave}
          style={{ borderRadius:'0.625rem', border:'none', background:'linear-gradient(135deg,#7c3aed,#db2777)', color:'#fff', padding:'0.6875rem 1.5rem', fontWeight:700, fontSize:'0.875rem', cursor:'pointer', fontFamily:'inherit', boxShadow:'0 4px 12px rgba(124,58,237,0.3)' }}>
          💾 {tab === 'cor' ? 'Salvar cor dos elementos' : 'Salvar fundo'}
        </button>
        <button type="button" onClick={handleReset}
          style={{ borderRadius:'0.625rem', border:'1px solid var(--border)', background:'var(--accent)', color:'var(--muted-foreground)', padding:'0.6875rem 1rem', fontWeight:600, fontSize:'0.875rem', cursor:'pointer', fontFamily:'inherit' }}>
          ↺ Restaurar padrão
        </button>
        {saveMsg && (
          <span style={{ fontSize:'0.875rem', color: saveMsg.startsWith('⚠') ? '#f59e0b' : '#10b981', fontWeight:600 }}>
            {saveMsg}
          </span>
        )}
      </div>
    </div>
  );
}
