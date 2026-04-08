import OutfitHeroImage from '@/app/components/outfit-card/OutfitHeroImage';
import OutfitHeader from '@/app/components/outfit-card/OutfitHeader';
import OutfitPieceList from '@/app/components/outfit-card/OutfitPieceList';
import CompactCardActionBar from '@/app/components/profile/CompactCardActionBar';
import {
  OutfitCardData,
  buildBackgroundCssStyle,
  buildOutfitDescriptionFallback,
  resolveBrandLogoUrlByName,
  resolveOutfitBackgroundForRender,
} from '@/app/lib/outfit-card';

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

  const resolvedBackground = resolveOutfitBackgroundForRender(data.outfitBackground);
  const backgroundStyle = buildBackgroundCssStyle(resolvedBackground);

  const brandBadges = data.pieces
    .map((piece) => ({
      name: piece.brand,
      logoUrl: piece.brandLogoUrl || resolveBrandLogoUrlByName(piece.brand) || undefined,
    }))
    .filter((brand) => Boolean(brand.name?.trim()))
    .filter((brand, index, arr) => arr.findIndex((item) => item.name.toLowerCase() === brand.name.toLowerCase()) === index)
    .slice(0, 4);

  const shapeOverlayClassName =
    (resolvedBackground.shape ?? 'none') === 'orb'
      ? 'bg-[radial-gradient(circle_at_80%_12%,rgba(99,102,241,0.38),transparent_58%),radial-gradient(circle_at_15%_78%,rgba(56,189,248,0.28),transparent_52%)]'
      : (resolvedBackground.shape ?? 'none') === 'diamond'
        ? 'bg-[linear-gradient(135deg,rgba(59,130,246,0.28)_0%,transparent_45%,rgba(168,85,247,0.24)_100%),repeating-linear-gradient(45deg,rgba(255,255,255,0.13)_0px,rgba(255,255,255,0.13)_2px,transparent_2px,transparent_14px)]'
        : (resolvedBackground.shape ?? 'none') === 'mesh'
          ? 'bg-[linear-gradient(120deg,rgba(15,23,42,0.16)_25%,transparent_25%),linear-gradient(240deg,rgba(15,23,42,0.16)_25%,transparent_25%)] bg-[size:20px_20px]'
          : (resolvedBackground.shape ?? 'none') === 'stars'
            ? "bg-[url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='84' height='84' viewBox='0 0 84 84'%3E%3Cpolygon points='42,8 49,29 71,29 53,42 60,64 42,51 24,64 31,42 13,29 35,29' fill='rgba(15,23,42,0.62)'/%3E%3C/svg%3E\"),linear-gradient(145deg,rgba(255,255,255,0.12),rgba(15,23,42,0.12))] bg-[size:40px_40px,100%_100%] opacity-95"
            : (resolvedBackground.shape ?? 'none') === 'circles'
              ? 'bg-[radial-gradient(circle,rgba(2,6,23,0.42)_40%,transparent_42%)] bg-[size:24px_24px]'
              : (resolvedBackground.shape ?? 'none') === 'triangles'
                ? "bg-[url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Cpolygon points='32,8 56,52 8,52' fill='rgba(2,6,23,0.44)'/%3E%3C/svg%3E\")] bg-[size:32px_32px]"
                : (resolvedBackground.shape ?? 'none') === 'waves'
                  ? 'bg-[repeating-linear-gradient(165deg,rgba(2,6,23,0.36)_0px,rgba(2,6,23,0.36)_4px,transparent_4px,transparent_12px)]'
                  : (resolvedBackground.shape ?? 'none') === 'beams'
                    ? 'bg-[repeating-linear-gradient(90deg,rgba(2,6,23,0.34)_0px,rgba(2,6,23,0.34)_8px,transparent_8px,transparent_26px)]'
                    : (resolvedBackground.shape ?? 'none') === 'flowers'
                      ? "bg-[url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='92' height='92' viewBox='0 0 92 92'%3E%3Cellipse cx='46' cy='23' rx='12' ry='19' fill='rgba(11,12,13,0.72)'/%3E%3Cellipse cx='62' cy='37' rx='12' ry='19' transform='rotate(48 62 37)' fill='rgba(11,12,13,0.72)'/%3E%3Cellipse cx='56' cy='57' rx='12' ry='19' transform='rotate(102 56 57)' fill='rgba(11,12,13,0.72)'/%3E%3Cellipse cx='36' cy='57' rx='12' ry='19' transform='rotate(152 36 57)' fill='rgba(11,12,13,0.72)'/%3E%3Cellipse cx='30' cy='37' rx='12' ry='19' transform='rotate(206 30 37)' fill='rgba(11,12,13,0.72)'/%3E%3Ccircle cx='46' cy='40' r='9' fill='rgba(243,244,246,0.88)'/%3E%3C/svg%3E\")] bg-[size:46px_46px]"
                      : (resolvedBackground.shape ?? 'none') === 'arrows'
                        ? 'bg-[repeating-linear-gradient(145deg,rgba(2,6,23,0.58)_0px,rgba(2,6,23,0.58)_6px,transparent_6px,transparent_20px)]'
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
          brandBadges={brandBadges}
          titleFontFamily={data.titleFontFamily}
        />
        <OutfitPieceList pieces={data.pieces} compact={variant === 'compact'} />
        {actions.length ? <CompactCardActionBar actions={actions} /> : null}
      </div>
    </section>
  );
}
