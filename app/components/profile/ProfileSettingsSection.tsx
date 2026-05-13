'use client';

import { useEffect, useMemo, useState } from 'react';
import SectionBlock from '@/app/components/shared/SectionBlock';
import DangerZoneCard from '@/app/components/profile/DangerZoneCard';
import { applyTheme, readSavedTheme, type SaiTheme } from '@/app/lib/theme';

const LEGACY_DARK_MODE_STORAGE_KEY = 'sai-dark-mode-enabled';
const SITE_LANGUAGE_STORAGE_KEY = 'sai-site-language';

type SiteLanguage = 'en' | 'pt-BR';

const TRANSLATIONS = {
  en: {
    sectionTitle: 'Settings',
    sectionSubtitle: 'Manage account, security, privacy, and preference controls.',
    changePassword: 'Change Password',
    currentPassword: 'Current',
    newPassword: 'New',
    confirm: 'Confirm',
    theme: 'Theme',
    darkEnabled: 'Dark enabled',
    darkDisabled: 'Dark disabled',
    privacy: 'Privacy',
    privacyPublic: 'Public',
    privacyPrivate: 'Private',
    siteLanguage: 'Site language',
    siteLanguageHint: '(new) Choose the interface language.',
    exportData: 'Export account data',
    logout: 'Logout',
  },
  'pt-BR': {
    sectionTitle: 'Configurações',
    sectionSubtitle: 'Gerencie conta, segurança, privacidade e preferências.',
    changePassword: 'Alterar senha',
    currentPassword: 'Atual',
    newPassword: 'Nova',
    confirm: 'Confirmar',
    theme: 'Tema',
    darkEnabled: 'Escuro ativado',
    darkDisabled: 'Escuro desativado',
    privacy: 'Privacidade',
    privacyPublic: 'Público',
    privacyPrivate: 'Privado',
    siteLanguage: 'Idioma do site',
    siteLanguageHint: '(novo) Escolha o idioma da interface.',
    exportData: 'Exportar dados da conta',
    logout: 'Sair',
  },
} as const;

const applySiteLanguage = (language: SiteLanguage): void => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(SITE_LANGUAGE_STORAGE_KEY, language);
  document.documentElement.setAttribute('lang', language);
};

const readSavedSiteLanguage = (): SiteLanguage => {
  if (typeof window === 'undefined') return 'pt-BR';
  const storedLanguage = window.localStorage.getItem(SITE_LANGUAGE_STORAGE_KEY);
  return storedLanguage === 'en' ? 'en' : 'pt-BR';
};

export default function ProfileSettingsSection() {
  const [theme, setTheme] = useState<SaiTheme>(() => {
    if (typeof window === 'undefined') return 'dark';
    const legacyDarkModeEnabled = window.localStorage.getItem(LEGACY_DARK_MODE_STORAGE_KEY) === 'true';
    if (legacyDarkModeEnabled) return 'dark';
    return readSavedTheme();
  });
  const [privacy, setPrivacy] = useState<'public' | 'private'>('public');
  const [siteLanguage, setSiteLanguage] = useState<SiteLanguage>(readSavedSiteLanguage);
  const darkMode = theme === 'dark';
  const t = useMemo(() => TRANSLATIONS[siteLanguage], [siteLanguage]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const legacyDarkModeEnabled = window.localStorage.getItem(LEGACY_DARK_MODE_STORAGE_KEY) === 'true';
    if (legacyDarkModeEnabled) {
      applyTheme('dark');
    }
    document.documentElement.classList.remove('dark-mode');
    window.localStorage.removeItem(LEGACY_DARK_MODE_STORAGE_KEY);
  }, []);

  useEffect(() => {
    applySiteLanguage(siteLanguage);
  }, [siteLanguage]);

  const toggleDarkMode = () => {
    const nextTheme: SaiTheme = darkMode ? 'light' : 'dark';
    setTheme(nextTheme);
    applyTheme(nextTheme);
  };

  return (
    <SectionBlock title={t.sectionTitle} subtitle={t.sectionSubtitle}>
      <div className="mt-4 space-y-3 rounded-2xl border border-white/20 bg-white/10 p-4">
        <h4 className="text-sm font-semibold text-white">{t.changePassword}</h4>
        <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
          <input type="password" placeholder={t.currentPassword} className="rounded-xl border border-white/25 bg-black/20 px-3 py-2 text-sm text-white" />
          <input type="password" placeholder={t.newPassword} className="rounded-xl border border-white/25 bg-black/20 px-3 py-2 text-sm text-white" />
          <button type="button" className="rounded-xl border border-emerald-200/70 bg-gradient-to-r from-emerald-500/45 to-cyan-500/45 px-4 py-2 text-sm font-semibold text-white shadow-[0_0_20px_rgba(16,185,129,0.35)]">
            {t.confirm}
          </button>
        </div>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <label className="rounded-2xl border border-white/20 bg-white/10 p-3 text-sm text-white">{t.theme}
          <button type="button" onClick={toggleDarkMode} className="ml-2 rounded-lg border border-white/30 px-2 py-1 text-xs">{darkMode ? t.darkEnabled : t.darkDisabled}</button>
        </label>
        <label className="rounded-2xl border border-white/20 bg-white/10 p-3 text-sm text-white">{t.privacy}
          <select value={privacy} onChange={(e) => setPrivacy(e.target.value as 'public' | 'private')} className="ml-2 rounded-lg border border-white/30 bg-black/20 px-2 py-1 text-xs">
            <option value="public">{t.privacyPublic}</option>
            <option value="private">{t.privacyPrivate}</option>
          </select>
        </label>
      </div>
      <div className="mt-3 rounded-2xl border border-emerald-200/45 bg-emerald-500/10 p-3 text-sm text-white">
        <label className="flex flex-wrap items-center gap-2 font-medium">{t.siteLanguage}
          <select value={siteLanguage} onChange={(e) => setSiteLanguage(e.target.value as SiteLanguage)} className="rounded-lg border border-white/30 bg-black/20 px-2 py-1 text-xs">
            <option value="pt-BR">Português (Brasil)</option>
            <option value="en">English</option>
          </select>
          <span className="text-xs font-normal text-white/75">{t.siteLanguageHint}</span>
        </label>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" className="rounded-lg border border-white/30 px-3 py-1.5 text-sm text-white">{t.exportData}</button>
      </div>
      <div className="mt-4">
        <DangerZoneCard />
      </div>
    </SectionBlock>
  );
}
