import { AppRoute } from '@/app/lib/stylist-shell';

interface SidebarNavItemProps {
  route: AppRoute;
  icon: string;
  label: string;
  helperText: string;
  active: boolean;
  compact: boolean;
  onSelect: (route: AppRoute) => void;
}

export default function SidebarNavItem({ route, icon, label, helperText, active, compact, onSelect }: SidebarNavItemProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(route)}
      className={`group flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left transition ${
        active
          ? 'border-white/40 bg-white text-black shadow'
          : 'border-transparent bg-black/20 text-white/75 hover:border-white/20 hover:bg-white/10 hover:text-white'
      }`}
    >
      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-black/10 text-sm">{icon}</span>
      {!compact ? (
        <span className="min-w-0">
          <span className="block truncate text-sm font-semibold">{label}</span>
          <span className={`block truncate text-xs ${active ? 'text-black/70' : 'text-white/55'}`}>{helperText}</span>
        </span>
      ) : null}
    </button>
  );
}
