import { OutfitMetaBadge as OutfitMetaBadgeType } from '@/app/lib/outfit-card';
import OutfitMetaBadge from '@/app/components/outfit-card/OutfitMetaBadge';
import BrandBadge from '@/app/components/outfit-card/BrandBadge';
import StarRow from '@/app/components/outfit-card/badges/StarRow';

interface OutfitHeaderProps {
  outfitName: string;
  outfitStyleLine: string;
  description?: string;
  badges?: OutfitMetaBadgeType[];
  compact?: boolean;
  brandBadges?: Array<{ name: string; logoUrl?: string }>;
  titleFontFamily?: string;
  creatorName?: string;
  ratingStars?: number;
  ownersCount?: number;
  outfitLikes?: number;
  occasion?: string;
}

export default function OutfitHeader({
  outfitName,
  outfitStyleLine,
  description,
  badges = [],
  compact = false,
  brandBadges = [],
  titleFontFamily,
  creatorName,
  ratingStars,
  ownersCount,
  outfitLikes,
  occasion,
}: OutfitHeaderProps) {
  return (
    <header
      className={`space-y-2 rounded-2xl border shadow-[0_8px_24px_rgba(15,23,42,0.22)] backdrop-blur-xl transition-all ${compact ? 'p-3' : 'p-4'}`}
      style={{
        borderColor: 'rgba(255,255,255,0.18)',
        background: 'linear-gradient(135deg, rgba(124,58,237,0.55), rgba(219,39,119,0.40))',
      }}
    >
      {/* Header row */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        {/* Left */}
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h3
              className={`truncate font-bold text-white ${compact ? 'text-base' : 'text-xl sm:text-2xl'}`}
              style={titleFontFamily ? { fontFamily: titleFontFamily } : undefined}
            >
              {outfitName}
            </h3>
            {creatorName ? (
              <span className="text-xs text-white/70">por @{creatorName}</span>
            ) : null}
          </div>

          {brandBadges.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              {brandBadges.slice(0, 4).map((brand) => (
                <BrandBadge
                  key={`${brand.name}-${brand.logoUrl || 'no-logo'}`}
                  brandName={brand.name}
                  brandLogoUrl={brand.logoUrl}
                  variant="compact"
                />
              ))}
            </div>
          )}
        </div>

        {/* Right — meta badges */}
        {badges.length > 0 && (
          <div className="flex flex-wrap justify-end gap-2">
            {badges.map((badge) => (
              <OutfitMetaBadge
                key={`${badge.label}-${badge.icon || 'plain'}`}
                icon={badge.icon}
                label={badge.label}
              />
            ))}
          </div>
        )}
      </div>

      {/* Style line + occasion */}
      <p className="text-sm font-medium text-cyan-100">
        {outfitStyleLine}
        {occasion ? (
          <span className="ml-2 text-white/55">· {occasion}</span>
        ) : null}
      </p>

      {/* Community stats — stars · owners · likes */}
      {(ratingStars !== undefined || ownersCount !== undefined || outfitLikes !== undefined) && !compact ? (
        <div className="flex flex-wrap items-center gap-3">
          {ratingStars !== undefined ? (
            <span className="inline-flex items-center gap-1">
              <StarRow value={ratingStars} size={13} />
              <span className="font-mono text-[10px] text-white/70">
                {ratingStars.toFixed(1)}
              </span>
            </span>
          ) : null}

          {ownersCount !== undefined ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-2 py-0.5 font-mono text-[10px] text-white/75">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              {ownersCount.toLocaleString('pt-BR')} donos
            </span>
          ) : null}

          {outfitLikes !== undefined ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-rose-300/35 bg-rose-500/10 px-2 py-0.5 font-mono text-[10px] text-rose-200">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              {outfitLikes.toLocaleString('pt-BR')}
            </span>
          ) : null}
        </div>
      ) : null}

      {/* Description */}
      {description ? (
        <p className={`leading-relaxed text-white/90 ${compact ? 'line-clamp-2 text-xs' : 'text-sm'}`}>
          {description}
        </p>
      ) : null}
    </header>
  );
}