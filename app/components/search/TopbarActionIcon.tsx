import { ReactNode } from 'react';

interface TopbarActionIconProps {
  label: string;
  icon: ReactNode;
  onClick: () => void;
  badgeCount?: number;
}

export default function TopbarActionIcon({ label, icon, onClick, badgeCount = 0 }: TopbarActionIconProps) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="sa-premium-gradient-surface-soft sa-topbar-action relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/30 text-white shadow-sm transition hover:border-white/50"
    >
      <span className="text-sm">{icon}</span>
      {badgeCount > 0 ? (
        <span className="absolute -right-1 -top-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
          {badgeCount > 99 ? '99+' : badgeCount}
        </span>
      ) : null}
    </button>
  );
}
