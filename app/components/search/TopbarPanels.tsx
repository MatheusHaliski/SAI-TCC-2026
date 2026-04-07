import { ReactNode } from 'react';
import Link from 'next/link';

function Overlay({ onClose }: { onClose: () => void }) {
  return <button type="button" aria-label="Close panel" className="fixed inset-0 z-[70] bg-black/40 backdrop-blur-sm" onClick={onClose} />;
}

function RightDrawer({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  return (
    <>
      <Overlay onClose={onClose} />
      <aside className="fixed right-0 top-0 z-[80] h-full w-full max-w-sm border-l border-white/20 bg-slate-950/90 p-4 text-white shadow-2xl">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-semibold uppercase tracking-[0.15em] text-white/70">{title}</p>
          <button type="button" onClick={onClose} className="rounded-lg border border-white/30 px-2 py-1 text-xs">✕</button>
        </div>
        <div className="space-y-2">{children}</div>
      </aside>
    </>
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
  return (
    <RightDrawer title="Account" onClose={onClose}>
      <article className="rounded-xl border border-white/20 bg-white/10 p-3">
        <p className="text-sm font-semibold">SAI User</p>
        <p className="text-xs text-white/70">@sai.user · user@sai.app</p>
      </article>
      {['View Profile', 'Dark Mode Toggle', 'Change Password', 'Account Settings', 'Logout'].map((action) => (
        <button key={action} type="button" className="w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-left text-sm">
          {action}
        </button>
      ))}
    </RightDrawer>
  );
}
