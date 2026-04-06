import { OutfitMetaBadge as OutfitMetaBadgeType } from '@/app/lib/outfit-card';
import OutfitMetaBadge from '@/app/components/outfit-card/OutfitMetaBadge';
import BrandInlineBadgeList from '@/app/components/outfit-card/BrandInlineBadgeList';

interface OutfitHeaderProps {
  outfitName: string;
  outfitStyleLine: string;
  description?: string;
  badges?: OutfitMetaBadgeType[];
  compact?: boolean;
}

export default function OutfitHeader({ outfitName, outfitStyleLine, description, badges = [], compact = false }: OutfitHeaderProps) {
  return (
    <header className={`space-y-2 rounded-2xl border border-slate-200/80 bg-white/90 shadow-sm ${compact ? 'p-3' : 'p-4'}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h3 className={`truncate font-semibold text-slate-900 ${compact ? 'text-base' : 'text-xl sm:text-2xl'}`}>{outfitName}</h3>
        <div className="flex flex-wrap justify-end gap-2">
          {badges.map((badge) => (
            <OutfitMetaBadge key={`${badge.label}-${badge.icon || 'plain'}`} icon={badge.icon} label={badge.label} />
          ))}
        </div>
      </div>
      <p className="text-sm font-medium text-slate-600">{outfitStyleLine}</p>
      {description ? <p className={`leading-relaxed text-slate-700 ${compact ? 'line-clamp-2 text-xs' : 'text-sm'}`}>{description}</p> : null}
    </header>
  );
}
