'use client';

import { useEffect, useState } from 'react';
import SidebarNav from './SidebarNav';
import TopBar from './TopBar';
import ContentRouter from './ContentRouter';
import { AppRoute, ROUTE_TITLES } from '@/app/lib/stylist-shell';
import { ensureSharedAccessToken } from '@/app/lib/accessTokenShare';
import { useRouter } from 'next/navigation';
import {getAuthSessionToken} from "@/app/lib/authSession";

export default function HomeShell() {
  const [activeRoute, setActiveRoute] = useState<AppRoute>('home');
  const [isCompactSidebar, setIsCompactSidebar] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const hasAccess = Boolean(ensureSharedAccessToken());

  useEffect(() => {
    const token = getAuthSessionToken();
    if (!token) {
      router.replace('/authview');
    } else {
      console.log("Token is:",token);
    }
  }, [hasAccess, router]);

  const token1 = getAuthSessionToken();
  if (!token1) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm font-semibold uppercase tracking-[0.2em] text-white/80">
        Checking access...
      </div>
    );
  }

  return (
    <div
      className="sa-home-shell flex min-h-screen bg-cover bg-fixed bg-center text-white bg-green-800"
    >
      <SidebarNav
        activeRoute={activeRoute}
        onRouteChange={setActiveRoute}
        isCompact={isCompactSidebar}
        onToggleCompact={() => setIsCompactSidebar((prev) => !prev)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <main className="flex min-w-0 min-h-[600px] flex-1 flex-col">
        <TopBar pageTitle={ROUTE_TITLES[activeRoute]} onOpenMobileNav={() => setMobileOpen(true)} />

        <section className="flex-1 overflow-y-auto p-4 lg:p-6">
          <ContentRouter route={activeRoute} />
        </section>
      </main>
    </div>
  );
}
