'use client';

import { AppRoute, NAV_ITEMS } from '@/app/lib/stylist-shell';
import SidebarNavItem from './SidebarNavItem';

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
  const primary = NAV_ITEMS.slice(0, 5);
  const secondary = NAV_ITEMS.slice(5);

  return (
    <div className="flex h-full flex-col gap-3 overflow-y-auto p-4">
      <div className="flex items-center justify-between pb-1">
        <h1 className="sa-sidebar-heading text-base font-semibold tracking-wide text-white/90">
          Fashion Dashboard
        </h1>
      </div>

      <nav className="space-y-1.5">
        {primary.map((item) => (
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

      <div className="my-1 border-t border-white/10" />

      <nav className="space-y-1.5">
        {secondary.map((item) => (
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
    </div>
  );
}

export default function SidebarNav({
  activeRoute,
  onRouteChange,
  mobileOpen,
  onCloseMobile,
}: SidebarNavProps) {
  return (
    <>
      {/* Desktop persistent sidebar */}
      <aside className="sa-premium-gradient-surface sa-surface-sidebar hidden h-screen w-64 shrink-0 flex-col border-r border-white/20 lg:flex">
        <NavContent activeRoute={activeRoute} onRouteChange={onRouteChange} />
      </aside>

      {/* Mobile overlay sidebar */}
      {mobileOpen ? (
        <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={onCloseMobile}>
          <aside
            className="sa-premium-gradient-surface sa-surface-sidebar h-full w-72 border-r border-white/20 backdrop-blur"
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
      ) : null}
    </>
  );
}
