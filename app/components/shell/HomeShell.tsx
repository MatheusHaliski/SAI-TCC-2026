'use client';

import { useEffect, useState } from 'react';
import SidebarNav from './SidebarNav';
import TopBar from './TopBar';
import ContentRouter from './ContentRouter';
import { AppRoute, ROUTE_TITLES } from '@/app/lib/stylist-shell';
import { ensureSharedAccessToken } from '@/app/lib/accessTokenShare';
import { useRouter } from 'next/navigation';

export default function HomeShell() {
  const [activeRoute, setActiveRoute] = useState<AppRoute>('home');
  const [isCompactSidebar, setIsCompactSidebar] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const hasAccess = Boolean(ensureSharedAccessToken());

  useEffect(() => {
    if (!hasAccess) {
      router.replace('/authview');
    }
  }, [hasAccess, router]);

  if (!hasAccess) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm font-semibold uppercase tracking-[0.2em] text-white/80">
        Checking access...
      </div>
    );
  }

  return (
    <div
      className="flex min-h-screen bg-cover bg-fixed bg-center text-white"
      style={{
        backgroundImage:
          "linear-gradient(180deg, rgba(6,182,212,0.45), rgba(45,212,191,0.5), rgba(16,185,129,0.5)), url('/F7B8D2E0-9994-4BFC-8D62-0206D32198DA.png')",
      }}
    >
      <SidebarNav
        activeRoute={activeRoute}
        onRouteChange={setActiveRoute}
        isCompact={isCompactSidebar}
        onToggleCompact={() => setIsCompactSidebar((prev) => !prev)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <main className="flex min-w-0 flex-1 flex-col">
        <TopBar pageTitle={ROUTE_TITLES[activeRoute]} onOpenMobileNav={() => setMobileOpen(true)} />

        <section className="flex-1 overflow-y-auto p-4 lg:p-6">
          <ContentRouter route={activeRoute} />
        </section>
      </main>
    </div>
  );
}
