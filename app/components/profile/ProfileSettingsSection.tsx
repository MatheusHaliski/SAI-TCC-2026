'use client';

import { useEffect, useState } from 'react';
import SectionBlock from '@/app/components/shared/SectionBlock';
import DangerZoneCard from '@/app/components/profile/DangerZoneCard';
import { applyTheme, readSavedTheme, type SaiTheme } from '@/app/lib/theme';

const LEGACY_DARK_MODE_STORAGE_KEY = 'sai-dark-mode-enabled';

export default function ProfileSettingsSection() {
  const [theme, setTheme] = useState<SaiTheme>(() => {
    if (typeof window === 'undefined') return 'dark';
    const legacyDarkModeEnabled = window.localStorage.getItem(LEGACY_DARK_MODE_STORAGE_KEY) === 'true';
    if (legacyDarkModeEnabled) return 'dark';
    return readSavedTheme();
  });
  const [privacy, setPrivacy] = useState<'public' | 'private'>('public');
  const darkMode = theme === 'dark';

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const legacyDarkModeEnabled = window.localStorage.getItem(LEGACY_DARK_MODE_STORAGE_KEY) === 'true';
    if (legacyDarkModeEnabled) {
      applyTheme('dark');
    }
    document.documentElement.classList.remove('dark-mode');
    window.localStorage.removeItem(LEGACY_DARK_MODE_STORAGE_KEY);
  }, []);

  const toggleDarkMode = () => {
    const nextTheme: SaiTheme = darkMode ? 'light' : 'dark';
    setTheme(nextTheme);
    applyTheme(nextTheme);
  };

  return (
    <SectionBlock title="Settings" subtitle="Manage account, security, privacy, and preference controls.">
      <div className="mt-4 space-y-3 rounded-2xl border border-white/20 bg-white/10 p-4">
        <h4 className="text-sm font-semibold text-white">Change Password</h4>
        <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
          <input type="password" placeholder="Current" className="rounded-xl border border-white/25 bg-black/20 px-3 py-2 text-sm text-white" />
          <input type="password" placeholder="New" className="rounded-xl border border-white/25 bg-black/20 px-3 py-2 text-sm text-white" />
          <button type="button" className="rounded-xl border border-emerald-200/70 bg-gradient-to-r from-emerald-500/45 to-cyan-500/45 px-4 py-2 text-sm font-semibold text-white shadow-[0_0_20px_rgba(16,185,129,0.35)]">
            Confirm
          </button>
        </div>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <label className="rounded-2xl border border-white/20 bg-white/10 p-3 text-sm text-white">Theme
          <button type="button" onClick={toggleDarkMode} className="ml-2 rounded-lg border border-white/30 px-2 py-1 text-xs">{darkMode ? 'Dark enabled' : 'Dark disabled'}</button>
        </label>
        <label className="rounded-2xl border border-white/20 bg-white/10 p-3 text-sm text-white">Privacy
          <select value={privacy} onChange={(e) => setPrivacy(e.target.value as 'public' | 'private')} className="ml-2 rounded-lg border border-white/30 bg-black/20 px-2 py-1 text-xs">
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </label>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" className="rounded-lg border border-white/30 px-3 py-1.5 text-sm text-white">Export account data</button>
        <button type="button" className="rounded-lg border border-white/30 px-3 py-1.5 text-sm text-white">Logout</button>
      </div>
      <div className="mt-4">
        <DangerZoneCard />
      </div>
    </SectionBlock>
  );
}
