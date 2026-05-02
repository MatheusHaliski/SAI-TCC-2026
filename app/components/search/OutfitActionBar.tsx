'use client';

interface OutfitActionBarProps {
  isFavorite: boolean;
  loadingFavorite: boolean;
  onToggleFavorite: () => void;
  onUseAsInspiration: () => void;
  onViewCreatorProfile: () => void;
  onOpenDressTester: () => void;
}

const btn = 'rounded-xl border border-white/25 bg-[linear-gradient(120deg,rgba(14,116,144,0.2),rgba(168,85,247,0.2))] px-3 py-2 text-xs font-semibold text-white shadow-[0_0_20px_rgba(34,211,238,0.22)] transition hover:-translate-y-[1px] hover:brightness-110 disabled:opacity-60';

export default function OutfitActionBar(props: OutfitActionBarProps) {
  return (
    <div className="mt-3 grid gap-2 rounded-2xl border border-white/20 bg-black/35 p-3 text-xs text-white/90 sm:grid-cols-2">
      <button type="button" className={btn} onClick={props.onToggleFavorite} disabled={props.loadingFavorite}>
        {props.loadingFavorite ? 'Saving...' : props.isFavorite ? 'Remove Favorite' : 'Save to Favorites'}
      </button>
      <button type="button" className={btn} onClick={props.onUseAsInspiration}>Use as Inspiration</button>
      <button type="button" className={btn} onClick={props.onViewCreatorProfile}>View Creator Profile</button>
      <button type="button" className={btn} onClick={props.onOpenDressTester}>Open in Dress Tester</button>
    </div>
  );
}
