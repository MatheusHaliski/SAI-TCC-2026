'use client';

import { useEffect, useState } from 'react';
import SectionBlock from '@/app/components/shared/SectionBlock';
import DangerZoneCard from '@/app/components/profile/DangerZoneCard';

const DARK_MODE_STORAGE_KEY = 'sai-dark-mode-enabled';

export default function ProfileSettingsSection() {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem(DARK_MODE_STORAGE_KEY) === 'true';
  });
  const [privacy, setPrivacy] = useState<'public' | 'private'>('public');

  useEffect(() => {
    document.documentElement.classList.toggle('dark-mode', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    const nextValue = !darkMode;
    setDarkMode(nextValue);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(DARK_MODE_STORAGE_KEY, String(nextValue));
    }
    document.documentElement.classList.toggle('dark-mode', nextValue);
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
