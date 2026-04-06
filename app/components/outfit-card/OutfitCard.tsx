import OutfitHeroImage from '@/app/components/outfit-card/OutfitHeroImage';
import OutfitHeader from '@/app/components/outfit-card/OutfitHeader';
import OutfitPieceList from '@/app/components/outfit-card/OutfitPieceList';
import CompactCardActionBar from '@/app/components/profile/CompactCardActionBar';
import { OutfitCardData, buildOutfitDescriptionFallback } from '@/app/lib/outfit-card';

interface GeneratedOutfitCardProps {
  data: OutfitCardData;
  variant?: 'default' | 'compact';
  actions?: Array<{
    label: string;
    onClick?: () => void;
    tone?: 'default' | 'danger' | 'accent';
  }>;
}

export default function OutfitCard({ data, variant = 'default', actions = [] }: GeneratedOutfitCardProps) {
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

  return (
    <section
      className={`relative overflow-hidden rounded-3xl border border-slate-200/70 shadow-[0_12px_45px_rgba(15,23,42,0.08)] ${variant === 'compact' ? 'space-y-3 p-3' : 'space-y-4 p-4 sm:p-6'}`}
      style={backgroundStyle}
    >
      {shapeOverlayClassName ? (
        <div aria-hidden className={`pointer-events-none absolute inset-0 opacity-95 ${shapeOverlayClassName}`} />
      ) : null}
      <div className={`relative z-[1] ${variant === 'compact' ? 'space-y-3' : 'space-y-4'}`}>
        <OutfitHeroImage src={data.heroImageUrl} alt={`${data.outfitName} hero preview`} className={variant === 'compact' ? 'h-32 rounded-2xl' : ''} />
        <OutfitHeader
          outfitName={data.outfitName}
          outfitStyleLine={data.outfitStyleLine}
          description={description}
          badges={data.metaBadges}
          compact={variant === 'compact'}
        />
        <OutfitPieceList pieces={data.pieces} compact={variant === 'compact'} />
        {actions.length ? <CompactCardActionBar actions={actions} /> : null}
      </div>
    </section>
  );
}
