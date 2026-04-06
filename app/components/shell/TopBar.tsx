'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import SearchInput from '../shared/SearchInput';
import TopbarActionIcon from '@/app/components/search/TopbarActionIcon';
import { NotificationsPanel, QuickNavDrawer, SystemInboxPanel, UserAccountDrawer } from '@/app/components/search/TopbarPanels';
import { useDiscoverySearch } from '@/app/components/shell/DiscoverySearchContext';

interface TopBarProps {
  pageTitle: string;
}

const BellIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5" />
    <path d="M10 19a2 2 0 0 0 4 0" />
  </svg>
);

const MailIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m4 7 8 6 8-6" />
  </svg>
);

const UserIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="12" cy="8" r="3.2" />
    <path d="M5 19a7 7 0 0 1 14 0" />
  </svg>
);

const MenuIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);

export default function TopBar({ pageTitle }: TopBarProps) {
  const pathname = usePathname();
  const { query, setQuery } = useDiscoverySearch();
  const [panel, setPanel] = useState<'notifications' | 'inbox' | 'menu' | 'account' | null>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setPanel(null);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <>
      <header className="sa-surface-topbar h-full w-full rounded-2xl border-8 border-orange-500 px-4 py-3 backdrop-blur-md lg:px-6">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-lg font-semibold text-white">{pageTitle}</p>
          </div>

          <div className="hidden w-full max-w-xl lg:block">
            <SearchInput
              placeholder="Search outfits, brands, styles, or wardrobe items"
              value={query}
              onChange={setQuery}
            />
          </div>

          <div className="flex items-center gap-2">
            <TopbarActionIcon label="Notifications" icon={<BellIcon />} onClick={() => setPanel('notifications')} />
            <TopbarActionIcon label="System Inbox" icon={<MailIcon />} onClick={() => setPanel('inbox')} />
            <TopbarActionIcon label="Quick Navigation" icon={<MenuIcon />} onClick={() => setPanel('menu')} />
            <TopbarActionIcon label="Account" icon={<UserIcon />} onClick={() => setPanel('account')} />
          </div>
        </div>

        <div className="mt-3 lg:hidden">
          <SearchInput
            placeholder="Search outfits, brands, styles, or wardrobe items"
            value={query}
            onChange={setQuery}
          />
        </div>
      </header>

      {panel === 'notifications' ? <NotificationsPanel onClose={() => setPanel(null)} /> : null}
      {panel === 'inbox' ? <SystemInboxPanel onClose={() => setPanel(null)} /> : null}
      {panel === 'menu' ? <QuickNavDrawer onClose={() => setPanel(null)} activePath={pathname} /> : null}
      {panel === 'account' ? <UserAccountDrawer onClose={() => setPanel(null)} /> : null}
    </>
  );
}
