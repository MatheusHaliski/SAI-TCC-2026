import OutfitHeroImage from '@/app/components/outfit-card/OutfitHeroImage';
import OutfitHeader from '@/app/components/outfit-card/OutfitHeader';
import OutfitPieceList from '@/app/components/outfit-card/OutfitPieceList';
import OutfitMetaBadge from '@/app/components/outfit-card/OutfitMetaBadge';
import BrandInlineBadgeList from '@/app/components/outfit-card/BrandInlineBadgeList';
import { OutfitCardData, buildOutfitDescriptionFallback } from '@/app/lib/outfit-card';

interface GeneratedOutfitCardProps {
  data: OutfitCardData;
  variant?: 'compact' | 'full';
  onClick?: () => void;
}

export default function OutfitCard({ data, variant = 'full', onClick }: GeneratedOutfitCardProps) {
  const description =
    data.outfitDescription === undefined
      ? buildOutfitDescriptionFallback({
          pieces: data.pieces,
          outfitStyleLine: data.outfitStyleLine,
        })
      : data.outfitDescription?.trim() || undefined;

  const resolvedBackground = data.outfitBackground ?? {
    type: 'gradient' as const,
    value: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)',
    shape: 'none' as const,
  };

  const backgroundStyle =
    resolvedBackground.type === 'solid'
      ? { background: resolvedBackground.value }
      : resolvedBackground.type === 'gradient'
        ? { backgroundImage: resolvedBackground.value }
        : {
            backgroundImage: `url(${resolvedBackground.value})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          };

  const shapeOverlayClassName =
    resolvedBackground.shape === 'orb'
      ? 'bg-[radial-gradient(circle_at_80%_12%,rgba(99,102,241,0.22),transparent_55%)]'
      : resolvedBackground.shape === 'diamond'
        ? 'bg-[linear-gradient(135deg,rgba(59,130,246,0.16)_0%,transparent_40%,rgba(168,85,247,0.14)_100%)]'
        : resolvedBackground.shape === 'mesh'
          ? 'bg-[linear-gradient(120deg,rgba(15,23,42,0.08)_25%,transparent_25%),linear-gradient(240deg,rgba(15,23,42,0.08)_25%,transparent_25%)] bg-[size:24px_24px]'
          : '';

  const compactPieceSummary = data.pieces.slice(0, 2).map((piece) => piece.name).join(' · ');

  return (
    <section
      onClick={onClick}
      className={`relative overflow-hidden rounded-3xl border border-slate-200/70 p-4 shadow-[0_12px_45px_rgba(15,23,42,0.08)] sm:p-6 ${onClick ? 'cursor-pointer transition hover:-translate-y-0.5 hover:shadow-[0_18px_50px_rgba(79,70,229,0.2)]' : ''}`}
      style={backgroundStyle}
    >
      {shapeOverlayClassName ? (
        <div aria-hidden className={`pointer-events-none absolute inset-0 opacity-95 ${shapeOverlayClassName}`} />
      ) : null}
      <div className="relative z-[1] space-y-4">
        <OutfitHeroImage src={data.heroImageUrl} alt={`${data.outfitName} hero preview`} className={variant === 'compact' ? 'h-36 sm:h-40' : undefined} />

        {variant === 'compact' ? (
          <div className="space-y-3 rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-sm">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-semibold text-slate-900">{data.outfitName}</h3>
              <BrandInlineBadgeList brands={data.brands ?? []} />
            </div>
            <div className="flex flex-wrap gap-2">
              {(data.metaBadges ?? []).map((badge) => (
                <OutfitMetaBadge key={`${badge.label}-${badge.icon || 'plain'}`} icon={badge.icon} label={badge.label} />
              ))}
            </div>
            <p className="text-sm font-medium text-slate-600">{data.outfitStyleLine}</p>
            {description ? <p className="line-clamp-2 text-sm text-slate-700">{description}</p> : null}
            <p className="text-xs font-medium text-slate-600">
              {data.pieces.length} pieces{compactPieceSummary ? ` · ${compactPieceSummary}` : ''}
            </p>
          </div>
        ) : (
          <>
            <OutfitHeader
              outfitName={data.outfitName}
              outfitStyleLine={data.outfitStyleLine}
              description={description}
              badges={data.metaBadges}
              brands={data.brands}
            />
            <OutfitPieceList pieces={data.pieces} />
          </>
        )}
      </div>
    </section>
  );
}
