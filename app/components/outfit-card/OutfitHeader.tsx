import { OutfitMetaBadge as OutfitMetaBadgeType } from '@/app/lib/outfit-card';
import OutfitMetaBadge from '@/app/components/outfit-card/OutfitMetaBadge';
import BrandInlineBadgeList from '@/app/components/outfit-card/BrandInlineBadgeList';

interface OutfitHeaderProps {
  outfitName: string;
  outfitStyleLine: string;
  description?: string;
  badges?: OutfitMetaBadgeType[];
  brands?: string[];
}

export default function OutfitHeader({ outfitName, outfitStyleLine, description, badges = [], brands = [] }: OutfitHeaderProps) {
  return (
    <header className="space-y-2 rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-sm">
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-xl font-semibold text-slate-900 sm:text-2xl">{outfitName}</h3>
          <BrandInlineBadgeList brands={brands} />
        </div>
        <div className="flex flex-wrap gap-2">
          {badges.map((badge) => (
            <OutfitMetaBadge key={`${badge.label}-${badge.icon || 'plain'}`} icon={badge.icon} label={badge.label} />
          ))}
        </div>
      </div>
      <p className="text-sm font-medium text-slate-600">{outfitStyleLine}</p>
      {description ? <p className="text-sm leading-relaxed text-slate-700">{description}</p> : null}
    </header>
  );
}
