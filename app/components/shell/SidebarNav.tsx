'use client';

import { AppRoute, NAV_ITEMS } from '@/app/lib/stylist-shell';
import SidebarNavItem from './SidebarNavItem';

interface SidebarNavProps {
  activeRoute: AppRoute;
  onRouteChange: (route: AppRoute) => void;
  isCompact: boolean;
  onToggleCompact: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

function NavContent({
  activeRoute,
  onRouteChange,
  isCompact,
  onToggleCompact,
}: Pick<SidebarNavProps, 'activeRoute' | 'onRouteChange' | 'isCompact' | 'onToggleCompact'>) {
  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        {!isCompact ? (
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-white/50">StylistAI</p>
            <h1 className="text-lg font-semibold text-white">Fashion Dashboard</h1>
          </div>
        ) : (
          <div className="text-xl text-white">✶</div>
        )}
        <button
          type="button"
          onClick={onToggleCompact}
          className="rounded-lg border border-white/20 bg-black/30 px-2 py-1 text-xs text-white/80 hover:bg-black/50"
        >
          {isCompact ? '→' : '←'}
        </button>
      </div>

      <nav className="space-y-2">
        {NAV_ITEMS.map((item) => (
          <SidebarNavItem
            key={item.route}
            route={item.route}
            icon={item.icon}
            label={item.label}
            helperText={item.helperText}
            active={activeRoute === item.route}
            compact={isCompact}
            onSelect={onRouteChange}
          />
        ))}
      </nav>
    </div>
  );
}

export default function SidebarNav({
  activeRoute,
  onRouteChange,
  isCompact,
  onToggleCompact,
  mobileOpen,
  onCloseMobile,
}: SidebarNavProps) {
  return (
    <>
      <aside
        className={`hidden h-screen border-r border-white/10 bg-black/70 backdrop-blur lg:block ${
          isCompact ? 'w-24' : 'w-72'
        }`}
      >
        <NavContent
          activeRoute={activeRoute}
          onRouteChange={onRouteChange}
          isCompact={isCompact}
          onToggleCompact={onToggleCompact}
        />
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={onCloseMobile}>
          <aside
            className="h-full w-72 border-r border-white/20 bg-black/85 backdrop-blur"
            onClick={(event) => event.stopPropagation()}
          >
            <NavContent
              activeRoute={activeRoute}
              onRouteChange={(route) => {
                onRouteChange(route);
                onCloseMobile();
              }}
              isCompact={false}
              onToggleCompact={onToggleCompact}
            />
          </aside>
        </div>
      ) : null}
    </>
  );
}
