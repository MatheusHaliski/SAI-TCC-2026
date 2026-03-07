import SearchInput from '../shared/SearchInput';
import IconButton from '../shared/IconButton';

interface TopBarProps {
  pageTitle: string;
  onOpenMobileNav: () => void;
}

export default function TopBar({ pageTitle, onOpenMobileNav }: TopBarProps) {
  return (
    <header className="sa-premium-gradient-surface sticky top-0 z-30 border-b border-white/20 px-4 py-3 backdrop-blur-md lg:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileNav}
          className="sa-premium-gradient-surface-soft rounded-lg border border-white/30 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-white lg:hidden"
        >
          Menu
        </button>

        <div className="min-w-0 flex-1">
          <p className="truncate text-lg font-semibold text-white">{pageTitle}</p>
        </div>

        <div className="hidden w-full max-w-xl lg:block">
          <SearchInput placeholder="Search outfits, brands, styles, or wardrobe items" />
        </div>

        <div className="flex items-center gap-2">
          <IconButton label="Notifications" icon="🔔" />
          <IconButton label="Messages" icon="✉" />
          <button className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-sm font-semibold text-white transition hover:bg-white/20">
            SA
          </button>
        </div>
      </div>

      <div className="mt-3 lg:hidden">
        <SearchInput placeholder="Search outfits, brands, styles, or wardrobe items" />
      </div>
    </header>
  );
}
