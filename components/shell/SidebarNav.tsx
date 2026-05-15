'use client';

import { AppRoute, NAV_ITEMS } from '@/app/lib/stylist-shell';
import SidebarNavItem from './SidebarNavItem';
import { applyDivTint, readSavedDivTint } from '@/app/lib/theme';
import { useState } from 'react';

interface SidebarNavProps {
  activeRoute: AppRoute;
  onRouteChange: (route: AppRoute) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

function NavContent({
  activeRoute,
  onRouteChange,
}: Pick<SidebarNavProps, 'activeRoute' | 'onRouteChange'>) {
  const [divTint, setDivTint] = useState(readSavedDivTint());
  return (
    <div className="flex h-full flex-col gap-4 p-4 pt-4">
      <div className="flex items-center justify-between">
        <h1 className="sa-sidebar-heading text-lg font-semibold text-white">Fashion Dashboard</h1>
      </div>

      <nav className="space-y-2">
        {NAV_ITEMS.map((item) => (
          <SidebarNavItem
            key={item.route}
            route={item.route}
            label={item.label}
            helperText={item.helperText}
            active={activeRoute === item.route}
            compact={false}
            onSelect={onRouteChange}
          />
        ))}
      </nav>

      <div className="rounded-xl border border-white/20 bg-white/10 p-2">
        <p className="text-[10px] uppercase tracking-[0.15em] text-white/70">Cor das divs</p>
        <input type="color" value={divTint.slice(0,7)} onChange={(e)=>{ const next=`${e.target.value}33`; setDivTint(next); applyDivTint(next); }} className="mt-2 h-8 w-full rounded" />
      </div>

    </div>
  );
}

export default function SidebarNav({
  activeRoute,
  onRouteChange,
  mobileOpen,
  onCloseMobile,
}: SidebarNavProps) {
  return mobileOpen ? (
    <div className="fixed inset-0 z-40 bg-black/60" onClick={onCloseMobile}>
      <aside
        className="sa-premium-gradient-surface sa-surface-sidebar h-full w-72 border-r border-white/25 backdrop-blur"
        onClick={(event) => event.stopPropagation()}
      >
        <NavContent
          activeRoute={activeRoute}
          onRouteChange={(route) => {
            onRouteChange(route);
            onCloseMobile();
          }}
        />
      </aside>
    </div>
  ) : null;
}
