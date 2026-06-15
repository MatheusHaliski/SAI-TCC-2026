'use client';

import BackgroundStudioPanel from '@/app/components/profile/BackgroundStudioPanel';

import { useEffect, useState } from 'react';
import SectionBlock from '@/app/components/shared/SectionBlock';
import DangerZoneCard from '@/app/components/profile/DangerZoneCard';
import { applyTheme, readSavedTheme, type SaiTheme } from '@/app/lib/theme';
import FancySelect from '@/app/components/ui/fancy-select';
import {
  applyPageBackgroundConfig,
  type PageBackgroundConfig,
  type PageBackgroundShape,
  OFFICIAL_WEBSITE_BACKGROUND_GRADIENT,
} from '@/app/lib/pageBackground';

const LEGACY_DARK_MODE_STORAGE_KEY = 'sai-dark-mode-enabled';
const SITE_LANGUAGE_STORAGE_KEY = 'sai-site-language';

type SiteLanguage = 'en' | 'pt-BR';

const applySiteLanguage = (language: SiteLanguage): void => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(SITE_LANGUAGE_STORAGE_KEY, language);
  document.documentElement.setAttribute('lang', language);
  window.dispatchEvent(new Event('sai-language-change'));
};

const readSavedSiteLanguage = (): SiteLanguage => {
  if (typeof window === 'undefined') return 'pt-BR';
  const s = window.localStorage.getItem(SITE_LANGUAGE_STORAGE_KEY);
  return s === 'en' ? 'en' : 'pt-BR';
};

/* ── Preset backgrounds ── */
const BG_PRESETS: Array<{ id: string; label: string; emoji: string; gradient: string; shape: PageBackgroundShape }> = [
  {
    id: 'default-purple',
    label: 'Roxo padrão',
    emoji: '💜',
    gradient: [
      'radial-gradient(circle at 14% 14%, rgba(124,58,237,0.35) 0%, rgba(124,58,237,0.04) 44%)',
      'radial-gradient(circle at 84% 10%, rgba(219,39,119,0.24) 0%, rgba(219,39,119,0) 45%)',
      'linear-gradient(130deg, #f8f7ff 0%, #fdf4ff 50%, #fff0f6 100%)',
    ].join(', '),
    shape: 'orb',
  },
  {
    id: 'midnight',
    label: 'Meia-noite',
    emoji: '🌑',
    gradient: 'linear-gradient(135deg, #0d0b18 0%, #160f2e 50%, #1a0d20 100%)',
    shape: 'none',
  },
  {
    id: 'ocean',
    label: 'Oceano',
    emoji: '🌊',
    gradient: [
      'radial-gradient(circle at 20% 30%, rgba(59,130,246,0.4) 0%, transparent 50%)',
      'radial-gradient(circle at 80% 70%, rgba(16,185,129,0.3) 0%, transparent 50%)',
      'linear-gradient(135deg, #0c1a2e 0%, #0f2744 50%, #0a1f35 100%)',
    ].join(', '),
    shape: 'orb',
  },
  {
    id: 'rose-gold',
    label: 'Rose Gold',
    emoji: '🌸',
    gradient: [
      'radial-gradient(circle at 25% 25%, rgba(251,113,133,0.35) 0%, transparent 50%)',
      'radial-gradient(circle at 75% 75%, rgba(249,168,212,0.3) 0%, transparent 50%)',
      'linear-gradient(135deg, #fff1f2 0%, #fce7f3 50%, #fdf4ff 100%)',
    ].join(', '),
    shape: 'mesh',
  },
  {
    id: 'forest',
    label: 'Floresta',
    emoji: '🌿',
    gradient: [
      'radial-gradient(circle at 30% 40%, rgba(16,185,129,0.3) 0%, transparent 50%)',
      'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #f0fdf4 100%)',
    ].join(', '),
    shape: 'orb',
  },
  {
    id: 'sunset',
    label: 'Pôr do sol',
    emoji: '🌅',
    gradient: [
      'radial-gradient(circle at 50% 0%, rgba(251,146,60,0.5) 0%, transparent 55%)',
      'radial-gradient(circle at 80% 50%, rgba(239,68,68,0.3) 0%, transparent 45%)',
      'linear-gradient(180deg, #fff7ed 0%, #fef3c7 50%, #fff1f2 100%)',
    ].join(', '),
    shape: 'diamond',
  },
  {
    id: 'galaxy',
    label: 'Galáxia',
    emoji: '🔮',
    gradient: OFFICIAL_WEBSITE_BACKGROUND_GRADIENT,
    shape: 'mesh',
  },
  {
    id: 'charcoal',
    label: 'Carvão',
    emoji: '🖤',
    gradient: 'linear-gradient(135deg, #111111 0%, #1a1a1a 50%, #0f0f0f 100%)',
    shape: 'none',
  },
];

/* ── Sub-component: Setting Row ── */
function SettingRow({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '1rem', borderRadius: '0.875rem',
      border: '1px solid var(--border)', background: 'var(--accent)', gap: '1rem',
    }}>
      <div style={{ minWidth: 0 }}>
        <p style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--foreground)', margin: 0 }}>{label}</p>
        {hint && <p style={{ fontSize: '0.8125rem', color: 'var(--muted-foreground)', margin: '0.2rem 0 0' }}>{hint}</p>}
      </div>
      {children}
    </div>
  );
}

/* ── Toggle switch ── */
function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      style={{
        width: '3rem', height: '1.625rem', borderRadius: '9999px', border: 'none',
        background: checked ? 'linear-gradient(135deg,#7c3aed,#db2777)' : 'var(--muted)',
        position: 'relative', cursor: 'pointer', flexShrink: 0, transition: 'background 0.2s',
      }}
    >
      <span style={{
        position: 'absolute', top: '0.1875rem',
        left: checked ? '1.5rem' : '0.1875rem',
        width: '1.25rem', height: '1.25rem',
        borderRadius: '50%', background: '#fff',
        boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
        transition: 'left 0.2s',
      }} />
    </button>
  );
}

export default function ProfileSettingsSection() {
  const [theme, setTheme] = useState<SaiTheme>(() => (typeof window === 'undefined' ? 'dark' : readSavedTheme()));
  const [privacy, setPrivacy] = useState<'public' | 'private'>('public');
  const [siteLanguage, setSiteLanguage] = useState<SiteLanguage>(() => readSavedSiteLanguage());
  const [savedLanguage, setSavedLanguage] = useState<SiteLanguage>(() => readSavedSiteLanguage());
  const [languageStatus, setLanguageStatus] = useState('');
  const [activeBgId, setActiveBgId] = useState(() => (typeof window === 'undefined' ? 'default-purple' : window.localStorage.getItem('sai_active_bg_preset') || 'default-purple'));
  const [bgSaveStatus, setBgSaveStatus] = useState('');
  const [activeTab, setActiveTab] = useState<'geral' | 'aparencia' | 'privacidade' | 'conta'>('geral');

  const darkMode = theme === 'dark';

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const legacyDark = window.localStorage.getItem(LEGACY_DARK_MODE_STORAGE_KEY) === 'true';
    if (legacyDark) applyTheme('dark');
    document.documentElement.classList.remove('dark-mode');
    window.localStorage.removeItem(LEGACY_DARK_MODE_STORAGE_KEY);
  }, []);

  const toggleDarkMode = () => {
    const next: SaiTheme = darkMode ? 'light' : 'dark';
    setTheme(next);
    applyTheme(next);
  };

  const saveLanguagePreference = () => {
    applySiteLanguage(siteLanguage);
    setSavedLanguage(siteLanguage);
    setLanguageStatus(siteLanguage === 'pt-BR' ? 'Idioma salvo: Português (Brasil).' : 'Language saved: English.');
  };

  const applyBgPreset = (preset: typeof BG_PRESETS[0]) => {
    setActiveBgId(preset.id);
    setBgSaveStatus('');
    const config: PageBackgroundConfig = { gradient: preset.gradient, shape: preset.shape };
    applyPageBackgroundConfig(config);
    document.documentElement.style.setProperty('--home-shell-bg', preset.gradient);
    document.documentElement.style.setProperty('--background', '');
  };

  const saveBgPreset = () => {
    if (typeof window === 'undefined') return;
    const preset = BG_PRESETS.find(p => p.id === activeBgId);
    if (!preset) return;
    const config: PageBackgroundConfig = { gradient: preset.gradient, shape: preset.shape };
    applyPageBackgroundConfig(config);
    window.localStorage.setItem('sai_page_background_config', JSON.stringify(config));
    window.localStorage.setItem('sai_active_bg_preset', activeBgId);
    setBgSaveStatus('✓ Fundo salvo com sucesso!');
    setTimeout(() => setBgSaveStatus(''), 3000);
  };

  const tabs: Array<{ id: typeof activeTab; label: string; emoji: string }> = [
    { id: 'geral',       label: 'Geral',       emoji: '⚙️' },
    { id: 'aparencia',   label: 'Aparência',   emoji: '🎨' },
    { id: 'privacidade', label: 'Privacidade', emoji: '🔒' },
    { id: 'conta',       label: 'Conta',       emoji: '👤' },
  ];

  return (
    <SectionBlock title="Configurações" subtitle="Personalize sua experiência no Fashion AI">

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.375rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            style={{
              borderRadius: '0.625rem',
              border: activeTab === tab.id ? '1px solid rgba(124,58,237,0.5)' : '1px solid var(--border)',
              padding: '0.5rem 1rem',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s',
              fontFamily: 'inherit',
              background: activeTab === tab.id
                ? 'linear-gradient(135deg,rgba(124,58,237,0.18),rgba(219,39,119,0.12))'
                : 'var(--accent)',
              color: activeTab === tab.id ? 'var(--primary)' : 'var(--muted-foreground)',
            }}
          >
            {tab.emoji} {tab.label}
          </button>
        ))}
      </div>

      {/* ── Tab: Geral ── */}
      {activeTab === 'geral' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <SettingRow label="Modo escuro" hint="Alterna entre o tema claro e escuro">
            <Toggle checked={darkMode} onChange={toggleDarkMode} />
          </SettingRow>

          <SettingRow label="Idioma da interface" hint={`Atual: ${savedLanguage === 'pt-BR' ? 'Português (Brasil)' : 'English'}`}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: '14rem' }}>
              <div style={{ flex: 1 }}>
                <FancySelect
                  value={siteLanguage}
                  onChange={v => setSiteLanguage(v as SiteLanguage)}
                  options={[
                    { value: 'pt-BR', label: 'Português (Brasil)', hint: 'Interface em português', icon: { type: 'emoji', value: '🇧🇷' } },
                    { value: 'en',    label: 'English',            hint: 'English interface',      icon: { type: 'emoji', value: '🇺🇸' } },
                  ]}
                />
              </div>
              <button
                type="button"
                onClick={saveLanguagePreference}
                style={{ borderRadius: '0.5rem', border: 'none', background: 'linear-gradient(135deg,#7c3aed,#db2777)', color: '#fff', padding: '0.5rem 0.875rem', fontWeight: 700, fontSize: '0.8125rem', cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit' }}
              >
                Salvar
              </button>
            </div>
          </SettingRow>
          {languageStatus && (
            <p style={{ fontSize: '0.8125rem', color: '#10b981', padding: '0.5rem 1rem', borderRadius: '0.5rem', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)' }}>
              {languageStatus}
            </p>
          )}
        </div>
      )}

      {/* ── Tab: Aparência ── */}
      {activeTab === 'aparencia' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <h4 style={{ fontWeight: 700, fontSize: '1rem', margin: '0 0 0.25rem' }}>🎨 Estúdio de Fundo</h4>
            <p style={{ fontSize: '0.8125rem', color: 'var(--muted-foreground)', margin: '0 0 1rem' }}>
              Personalize o fundo da interface com gradientes, geometrias, cores e presets.
            </p>
          </div>
          <BackgroundStudioPanel />
        </div>
      )}

      {/* ── Tab: Privacidade ── */}
      {activeTab === 'privacidade' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <SettingRow label="Visibilidade do perfil" hint="Controle quem pode ver seu perfil e looks">
            <div style={{ minWidth: '12rem' }}>
              <FancySelect
                value={privacy}
                onChange={v => setPrivacy(v as 'public' | 'private')}
                options={[
                  { value: 'public',  label: 'Público',  hint: 'Visível para todos',   icon: { type: 'emoji', value: '🌍' } },
                  { value: 'private', label: 'Privado',  hint: 'Somente você',          icon: { type: 'emoji', value: '🔒' } },
                ]}
              />
            </div>
          </SettingRow>

          <SettingRow label="Compartilhar looks" hint="Permite que seus looks apareçam na seção Explorar">
            <Toggle checked={privacy === 'public'} onChange={() => setPrivacy(p => p === 'public' ? 'private' : 'public')} />
          </SettingRow>

          <div style={{ padding: '0.875rem 1rem', borderRadius: '0.75rem', background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', fontSize: '0.8125rem', color: 'var(--foreground)' }}>
            <strong>ℹ️ Sobre seus dados:</strong> O Fashion AI armazena apenas as informações necessárias para o funcionamento do seu guarda-roupa virtual. Nunca compartilhamos seus dados com terceiros sem sua autorização.
          </div>
        </div>
      )}

      {/* ── Tab: Conta ── */}
      {activeTab === 'conta' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          {/* Change password */}
          <div style={{ padding: '1rem', borderRadius: '0.875rem', border: '1px solid var(--border)', background: 'var(--accent)' }}>
            <h4 style={{ fontWeight: 700, fontSize: '0.9375rem', marginBottom: '0.875rem', color: 'var(--foreground)' }}>
              🔑 Alterar senha
            </h4>
            <div style={{ display: 'grid', gap: '0.625rem', gridTemplateColumns: '1fr 1fr auto' }}>
              <input type="password" placeholder="Senha atual" className="fai-input" style={{ padding: '0.625rem 0.875rem' }} />
              <input type="password" placeholder="Nova senha" className="fai-input" style={{ padding: '0.625rem 0.875rem' }} />
              <button
                type="button"
                style={{ borderRadius: '0.625rem', border: 'none', background: 'linear-gradient(135deg,#7c3aed,#db2777)', color: '#fff', padding: '0.625rem 1rem', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit' }}
              >
                Confirmar
              </button>
            </div>
          </div>

          {/* Export / Logout */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.625rem' }}>
            <button
              type="button"
              style={{ borderRadius: '0.625rem', border: '1px solid var(--border)', background: 'var(--accent)', color: 'var(--foreground)', padding: '0.625rem 1.25rem', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', fontFamily: 'inherit' }}
            >
              📤 Exportar dados
            </button>
          </div>

          {/* Danger zone */}
          <DangerZoneCard />
        </div>
      )}

    </SectionBlock>
  );
}
