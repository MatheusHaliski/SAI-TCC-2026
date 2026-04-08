'use client';

import { ReactNode, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  applyPageBackgroundConfig,
  OFFICIAL_WEBSITE_BACKGROUND_GRADIENT,
  PageBackgroundConfig,
  PageBackgroundShape,
  readPageBackgroundConfig,
  savePageBackgroundConfig,
} from '@/app/lib/pageBackground';
import { clearAuthSessionProfile, clearAuthSessionToken, getAuthSessionProfile } from '@/app/lib/authSession';
import { clearSharedAccessToken } from '@/app/lib/accessTokenShare';
import { applyTheme, readSavedTheme } from '@/app/lib/theme';

function Overlay({ onClose }: { onClose: () => void }) {
  return <button type="button" aria-label="Close panel" className="fixed inset-0 z-[70] bg-black/40 backdrop-blur-sm" onClick={onClose} />;
}

function RightDrawer({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  return (
    <>
      <Overlay onClose={onClose} />
      <aside className="sa-right-drawer fixed right-0 top-0 z-[80] h-full w-full max-w-sm border-l border-emerald-100/30 bg-gradient-to-b from-emerald-700/95 via-emerald-800/95 to-emerald-950/95 p-4 text-white shadow-2xl">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-semibold uppercase tracking-[0.15em] text-white/70">{title}</p>
          <button type="button" onClick={onClose} className="rounded-lg border border-white/30 px-2 py-1 text-xs">✕</button>
        </div>
        <div className="space-y-2">{children}</div>
      </aside>
    </>
  );
}

function PageBackgroundStudio({
  draft,
  onChange,
  onApply,
}: {
  draft: PageBackgroundConfig;
  onChange: (next: PageBackgroundConfig) => void;
  onApply: (next: PageBackgroundConfig) => void;
}) {
  const gradients = [
    'linear-gradient(135deg, #0b7a4a 0%, #075e39 45%, #05311f 100%)',
    'linear-gradient(145deg, #0f9f67 0%, #0b6147 55%, #022c22 100%)',
    'linear-gradient(130deg, #1d976c 0%, #0f7a52 50%, #023326 100%)',
    'linear-gradient(135deg, #4338ca 0%, #1d4ed8 48%, #0891b2 100%)',
    'linear-gradient(140deg, #be185d 0%, #9333ea 45%, #4f46e5 100%)',
    'linear-gradient(130deg, #ea580c 0%, #f59e0b 42%, #facc15 100%)',
  ];
  const shapes: PageBackgroundShape[] = ['none', 'orb', 'diamond', 'mesh'];
  const officialConfig: PageBackgroundConfig = {
    gradient: OFFICIAL_WEBSITE_BACKGROUND_GRADIENT,
    shape: 'orb',
  };
  return (
    <div className="sa-page-studio space-y-3 rounded-xl border border-emerald-100/30 bg-emerald-950/40 p-3">
      <p className="text-xs uppercase tracking-[0.12em] text-emerald-100/80">Page Background Studio</p>
      <div className="grid grid-cols-3 gap-2">
        {gradients.map((gradient) => (
          <button
            key={gradient}
            type="button"
            onClick={() => onChange({ ...draft, gradient })}
            className={`h-14 rounded-lg border ${draft.gradient === gradient ? 'border-emerald-200' : 'border-white/20'}`}
            style={{ background: gradient }}
          />
        ))}
      </div>
      <div className="grid grid-cols-4 gap-2">
        {shapes.map((shape) => (
          <button
            key={shape}
            type="button"
            onClick={() => onChange({ ...draft, shape })}
            className={`sa-shape-chip rounded-lg border px-2 py-1 text-xs uppercase ${draft.shape === shape ? 'border-emerald-200 bg-emerald-500/30' : 'border-white/20 bg-white/10'}`}
          >
            {shape}
          </button>
        ))}
      </div>
      <button
        type="button"
        className="sa-apply-background w-full rounded-lg border border-emerald-200/70 bg-emerald-400/20 px-3 py-2 text-sm font-semibold"
        onClick={() => {
          onChange(officialConfig);
          onApply(officialConfig);
        }}
      >
        Apply website background
      </button>
    </div>
  );
}

export function NotificationsPanel({ onClose }: { onClose: () => void }) {
  const notifications = [
    'Outfit liked by @alicefits',
    'AI generation completed for “Urban Layers”',
    'Wardrobe item processed successfully',
  ];

  return (
    <RightDrawer title="Notifications" onClose={onClose}>
      {notifications.map((item) => (
        <article key={item} className="rounded-xl border border-white/15 bg-white/10 p-3 text-sm">{item}</article>
      ))}
    </RightDrawer>
  );
}

export function SystemInboxPanel({ onClose }: { onClose: () => void }) {
  const updates = [
    { title: 'AI-generated outfit ready', summary: 'Your “Night Neon” render is now available.', level: 'info' },
    { title: 'Asset validation complete', summary: '2D mannequin asset passed quality validation.', level: 'success' },
  ];

  return (
    <RightDrawer title="System Inbox" onClose={onClose}>
      {updates.map((item) => (
        <article key={item.title} className="rounded-xl border border-white/15 bg-white/10 p-3">
          <div className="mb-1 flex items-center justify-between gap-2">
            <p className="text-sm font-semibold">{item.title}</p>
            <span className="rounded-full border border-white/25 px-2 py-0.5 text-[10px] uppercase">{item.level}</span>
          </div>
          <p className="text-xs text-white/70">{item.summary}</p>
        </article>
      ))}
    </RightDrawer>
  );
}

export function QuickNavDrawer({ onClose, activePath }: { onClose: () => void; activePath: string }) {
  const links = [
    { href: '/explore-scheme', label: 'Saved Outfits' },
    { href: '/create-my-scheme', label: 'Create My Scheme' },
    { href: '/dress-tester', label: 'Dress Tester' },
    { href: '/search-items', label: 'Search' },
    { href: '/search-pieces', label: 'Search Pieces' },
    { href: '/my-wardrobe', label: 'My Wardrobe' },
    { href: '/profile', label: 'Settings' },
  ];

  return (
    <RightDrawer title="Quick Navigation" onClose={onClose}>
      {links.map((link) => (
        <Link
          key={`${link.href}-${link.label}`}
          href={link.href}
          onClick={onClose}
          className={`block rounded-xl border px-3 py-2 text-sm transition ${activePath === link.href ? 'border-cyan-300/60 bg-cyan-400/15' : 'border-white/15 bg-white/8 hover:bg-white/15'}`}
        >
          {link.label}
        </Link>
      ))}
    </RightDrawer>
  );
}

export function UserAccountDrawer({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState<boolean>(readSavedTheme() === 'dark');
  const [backgroundDraft, setBackgroundDraft] = useState<PageBackgroundConfig>(() => readPageBackgroundConfig());

  const profile = useMemo(() => getAuthSessionProfile(), []);
  const userId = profile.user_id?.trim() || '';
  const username = profile.name?.trim() || 'SAI User';
  const email = profile.email?.trim() || 'user@sai.app';

  const setTheme = (isDark: boolean) => {
    setDarkMode(isDark);
    applyTheme(isDark ? 'dark' : 'light');
  };

  const handleLogout = () => {
    clearSharedAccessToken();
    clearAuthSessionToken();
    clearAuthSessionProfile();
    onClose();
    router.replace('/authview');
  };

  const actionItems = [
    { label: 'View Profile', icon: '👤', onClick: () => { onClose(); router.push(userId ? `/profile/${userId}` : '/profile'); } },
    { label: darkMode ? 'Dark Mode: On' : 'Dark Mode: Off', icon: '🌗', onClick: () => setTheme(!darkMode) },
    { label: 'Account Settings', icon: '⚙️', onClick: () => { onClose(); router.push('/profile?section=settings'); } },
    { label: 'Logout', icon: '🚪', onClick: handleLogout },
  ];

  return (
    <RightDrawer title="Account" onClose={onClose}>
      <article className="sa-drawer-card rounded-xl border border-emerald-100/30 bg-white/10 p-3">
        <p className="text-sm font-semibold">{username}</p>
        <p className="text-xs text-emerald-50/80">@{email.split('@')[0]} · {email}</p>
      </article>
      <div className="space-y-2">
        {actionItems.map((action) => (
          <button key={action.label} type="button" onClick={action.onClick} className="sa-drawer-action w-full rounded-xl border border-emerald-100/30 bg-white/10 px-3 py-2 text-left text-sm">
            <span className="flex items-center gap-2">
              <span>{action.icon}</span>
              <span>{action.label}</span>
            </span>
          </button>
        ))}
      </div>
      <PageBackgroundStudio
        draft={backgroundDraft}
        onChange={(next) => {
          setBackgroundDraft(next);
          applyPageBackgroundConfig(next);
        }}
        onApply={(next) => {
          setBackgroundDraft(next);
          savePageBackgroundConfig(next);
        }}
      />
    </RightDrawer>
  );
}
