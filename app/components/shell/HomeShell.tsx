'use client';

import { useEffect, useState } from 'react';
import SidebarNav from './SidebarNav';
import TopBar from './TopBar';
import ContentRouter from './ContentRouter';
import { AppRoute, NAV_ITEMS, PATH_TO_ROUTE, ROUTE_TITLES } from '@/app/lib/stylist-shell';
import { ensureSharedAccessToken } from '@/app/lib/accessTokenShare';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { getAuthSessionToken } from '@/app/lib/authSession';

export default function HomeShell() {
  const pathname = usePathname();
  const currentRoute = PATH_TO_ROUTE[pathname] ?? 'my-wardrobe';
  const [activeRoute, setActiveRoute] = useState<AppRoute>(currentRoute);
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const hasAccess = Boolean(ensureSharedAccessToken());

  useEffect(() => {
    setActiveRoute(currentRoute);
  }, [currentRoute]);

  useEffect(() => {
    const token = getAuthSessionToken();
    if (!token) {
      router.replace('/authview');
    }
  }, [hasAccess, router]);

  const token1 = getAuthSessionToken();
  if (!token1) {
    return <div className="flex min-h-screen items-center justify-center text-sm font-semibold uppercase tracking-[0.2em] text-white/80">Checking access...</div>;
  }

  return (
    <div className="sa-home-shell flex min-h-screen text-white">
      <SidebarNav
        activeRoute={activeRoute}
        onRouteChange={(route) => {
          setActiveRoute(route);
          const path = NAV_ITEMS.find((item) => item.route === route)?.path;
          if (path) router.push(path);
        }}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <main className="flex min-w-0 min-h-[600px] flex-1 flex-col p-2">
        <div className="sticky top-0 z-30 flex w-full items-stretch gap-2">
          <div className="flex h-full w-24 shrink-0 items-center justify-center rounded-2xl border-8 border-orange-500 bg-white p-2 shadow-[0_18px_60px_rgba(0,0,0,0.25)] sm:w-28 lg:w-32">
            <Image src="/80A950EF-F93D-4C1B-89B8-17490D321F97_1_105_c.jpeg" alt="SAI" width={160} height={72} className="h-full w-full object-contain" priority />
          </div>

          <div className="min-w-0 flex-1">
            <TopBar pageTitle={ROUTE_TITLES[activeRoute]} navOpen={mobileOpen} onToggleNav={() => setMobileOpen((prev) => !prev)} />
          </div>
        </div>

        <section className="flex-1 overflow-y-auto p-4 lg:p-6">
          <ContentRouter route={activeRoute} />
        </section>
      </main>
    </div>
  );
}
