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
      className="sa-home-shell bg-gradient-to-r from-[#2563eb] via-[#22c55e] to-[#38bdf8] shadow-lg shadow-cyan-500/20 hover:brightness-110 flex min-h-screen bg-cover bg-fixed bg-center text-white"
    >
      {/* Left badge */}
      <div className="absolute left-0 top-0 z-120 sm:left-0 lg:left-0 hidden lg:block">
        <div
            className={[
              "flex h-24 w-44 items-center justify-center rounded-2xl border-8 border-orange-500 bg-white px-3 py-2 text-amber-500 sm:h-28 sm:w-52",
              "shadow-[0_18px_60px_rgba(0,0,0,0.25)]",
            ].join(" ")}
        >
          <div className="flex h-full w-full items-center justify-center">
            <img
                src="/F4D37961-8CCF-4B15-8F4F-122C32FFF90F.jpeg"
                alt="SAI"
                className="h-full w-full object-contain"
            />
          </div>
        </div>
      </div>
      <SidebarNav
        activeRoute={activeRoute}
        onRouteChange={setActiveRoute}
        isCompact={isCompactSidebar}
        onToggleCompact={() => setIsCompactSidebar((prev) => !prev)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <main className="flex min-w-0 relative left-40 min-h-[600px] flex-1 flex-col">
        <TopBar pageTitle={ROUTE_TITLES[activeRoute]} onOpenMobileNav={() => setMobileOpen(true)} />

        <section className="flex-1 overflow-y-auto p-4 lg:p-6">
          <ContentRouter route={activeRoute} />
        </section>
      </main>
    </div>
  );
}
