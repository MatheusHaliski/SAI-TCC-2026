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
    <div className="flex h-full flex-col gap-4 p-4 pt-4">
      <div className="flex items-center justify-between">
        {!isCompact ? (
          <div>
            <h1 className="text-lg font-semibold text-white">Fashion Dashboard</h1>
          </div>
        ) : (
          <div className="text-xl text-white">✶</div>
        )}
        <button
          type="button"
          onClick={onToggleCompact}
          className="sa-premium-gradient-surface-soft rounded-lg border border-white/30 px-2 py-1 text-xs text-white/90"
        >
          {isCompact ? '→' : '←'}
        </button>
      </div>

      <nav className="space-y-2">
        {NAV_ITEMS.map((item) => (
          <SidebarNavItem
            key={item.route}
            route={item.route}
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
            className={`sa-surface-sidebar hidden rounded-xl rounded-t-none border-4 border-orange-500 backdrop-blur-3xl lg:block ${
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
            className="sa-premium-gradient-surface h-full w-72 border-r border-white/25 backdrop-blur"
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
