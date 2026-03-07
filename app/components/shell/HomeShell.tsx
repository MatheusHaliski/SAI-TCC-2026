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
      className="sa-home-shell flex min-h-screen bg-gradient-to-r from-[#2563eb] via-[#22c55e] to-[#38bdf8] bg-cover bg-fixed bg-center text-white"
    >
      <div className="hidden shrink-0 lg:flex lg:flex-col lg:gap-0 lg:p-2">
        <div
          className={[
            "flex items-center justify-center rounded-2xl border-8 border-orange-500 bg-white px-3 py-2 text-amber-500",
            "shadow-[0_18px_60px_rgba(0,0,0,0.25)]",
            isCompactSidebar ? "h-24 w-24 rounded-b-none" : "h-28 w-72 rounded-b-none",
          ].join(" ")}
        >
          <img
            src="/F4D37961-8CCF-4B15-8F4F-122C32FFF90F.jpeg"
            alt="SAI"
            className="h-full w-full object-contain"
          />
        </div>

        <SidebarNav
        activeRoute={activeRoute}
        onRouteChange={setActiveRoute}
        isCompact={isCompactSidebar}
        onToggleCompact={() => setIsCompactSidebar((prev) => !prev)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />
      </div>

      <main className="flex min-w-0 min-h-[600px] flex-1 flex-col p-2">
        <TopBar pageTitle={ROUTE_TITLES[activeRoute]} onOpenMobileNav={() => setMobileOpen(true)} />

        <section className="flex-1 overflow-y-auto p-4 lg:p-6">
          <ContentRouter route={activeRoute} />
        </section>
      </main>
    </div>
  );
}
