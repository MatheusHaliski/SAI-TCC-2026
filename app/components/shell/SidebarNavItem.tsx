import { AppRoute } from '@/app/lib/stylist-shell';

interface SidebarNavItemProps {
  route: AppRoute;
  label: string;
  helperText: string;
  active: boolean;
  compact: boolean;
  onSelect: (route: AppRoute) => void;
}

const RouteIcon = ({ route }: { route: AppRoute }) => {
  if (route === 'my-wardrobe') {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1z" />
      </svg>
    );
  }
  if (route === 'create-my-scheme') {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 5v14M5 12h14" />
      </svg>
    );
  }
  if (route === 'explore-scheme') {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="3" width="7" height="9" rx="1.5" />
        <rect x="14" y="3" width="7" height="5" rx="1.5" />
        <rect x="14" y="12" width="7" height="9" rx="1.5" />
        <rect x="3" y="16" width="7" height="5" rx="1.5" />
      </svg>
    );
  }
  if (route === 'autopilot') {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="2.5" />
        <path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21" />
        <path d="M8.5 8.5l2.2 2.2M13.3 13.3l2.2 2.2" strokeLinecap="round" />
      </svg>
    );
  }
  if (route === 'dress-tester') {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="5" r="2" />
        <path d="M8 9c1 1 2.5 1.5 4 1.5S15 10 16 9" />
        <path d="M8 9l-2 12h12L16 9" />
        <path d="M10 14h4" strokeLinecap="round" />
      </svg>
    );
  }
  if (route === 'search-items') {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="11" cy="11" r="6" />
        <path d="m20 20-4.2-4.2" />
      </svg>
    );
  }
  if (route === 'search-pieces') {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 3L4 9v12h16V9z" />
        <path d="M9 21V12h6v9" />
        <path d="M4 9l8-6 8 6" />
      </svg>
    );
  }
  if (route === 'profile') {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="8" r="3.5" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
      </svg>
    );
  }
  if (route === 'profile-settings') {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.93 4.93l1.77 1.77M17.3 17.3l1.77 1.77M4.93 19.07l1.77-1.77M17.3 6.7l1.77-1.77" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="8" r="3" />
      <path d="M5 19a7 7 0 0 1 14 0" />
    </svg>
  );
};

export default function SidebarNavItem({ route, label, helperText, active, compact, onSelect }: SidebarNavItemProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(route)}
      className={`sa-sidebar-nav-item group flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left transition ${
        active
          ? 'border-emerald-100/70 bg-[linear-gradient(120deg,rgba(34,197,94,0.7),rgba(250,204,21,0.7))] text-slate-900 shadow-[0_0_28px_rgba(250,204,21,0.35)]'
          : 'sa-premium-gradient-surface-soft border-transparent text-white/85 hover:border-white/30 hover:text-white'
      }`}
    >
      <span className="sa-premium-gradient-surface-soft inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm">
        <RouteIcon route={route} />
      </span>
      {!compact ? (
        <span className="min-w-0">
          <span className="block truncate text-sm font-semibold">{label}</span>
          <span className={`sa-sidebar-nav-helper block truncate text-xs ${active ? 'text-black/70' : 'text-white/55'}`}>{helperText}</span>
        </span>
      ) : null}
    </button>
  );
}
