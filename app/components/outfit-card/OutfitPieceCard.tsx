import { OutfitPiece, resolveBrandLogoUrlByName } from '@/app/lib/outfit-card';
import WearstyleChips from '@/app/components/outfit-card/WearstyleChips';
import VisualToken from '@/app/components/outfit-card/VisualToken';
import BrandBadge from '@/app/components/outfit-card/BrandBadge';
import {
  FILTER_GLOW_LINE,
  GLOW_LINE,
  TEXT_GLOW,
} from '@/app/lib/uiToken';

interface OutfitPieceCardProps {
  piece: OutfitPiece;
  compact?: boolean;
  onOpenInDressTester?: () => void;
}

export default function OutfitPieceCard({
  piece,
  compact = false,
  onOpenInDressTester,
}: OutfitPieceCardProps) {
  const pieceName = piece.name?.trim() || 'Unnamed Piece';

  const brandName =
    piece.brand?.trim() || 'Brand not specified';

  const brandLogoUrl =
    piece.brandLogoUrl ||
    resolveBrandLogoUrlByName(brandName) ||
    undefined;

  const categoryLabel =
    piece.category ?? 'Standard';

  const pieceTypeLabel =
    piece.pieceType || 'Garment';

  return (
    <article
      className={`
        group relative overflow-hidden rounded-2xl border
        backdrop-blur-xl transition-all duration-300
        shadow-[0_10px_30px_rgba(15,23,42,0.32)]
        hover:scale-[1.02]
        hover:shadow-[0_18px_42px_rgba(124,58,237,0.28)]
        ${compact ? 'p-3' : 'p-4'}
        ${FILTER_GLOW_LINE}
        ${GLOW_LINE}
      `}
      style={{
        borderColor: 'rgba(255,255,255,0.16)',
        background:
          'linear-gradient(145deg, rgba(124,58,237,0.22) 0%, rgba(219,39,119,0.14) 100%)',
      }}
    >
      {/* Outer premium glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-90"
        style={{
          background: `
            radial-gradient(
              circle at 18% 20%,
              rgba(255,255,255,0.18) 0%,
              transparent 42%
            ),
            linear-gradient(
              130deg,
              rgba(255,255,255,0.08) 0%,
              rgba(255,255,255,0) 48%,
              rgba(124,58,237,0.16) 100%
            )
          `,
        }}
      />

      {/* Inner border glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-[1px] rounded-2xl"
        style={{
          border:
            '1px solid rgba(255,255,255,0.14)',
          boxShadow:
            'inset 0 1px 0 rgba(255,255,255,0.14), inset 0 0 28px rgba(124,58,237,0.12)',
        }}
      />

      <div className="relative z-[1] space-y-3">
        {/* Name + Type */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex items-center gap-2">
            <p
              className={`
                truncate pr-1 text-sm
                font-semibold text-white
                ${TEXT_GLOW}
              `}
            >
              {pieceName}
            </p>
          </div>

          <VisualToken
            type="category"
            value={pieceTypeLabel}
            compact
          />
        </div>

        {/* Brand + rarity */}
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <BrandBadge
              brandName={brandName}
              brandLogoUrl={brandLogoUrl}
              variant="compact"
            />
          </div>

          <VisualToken
            type="rarity"
            value={categoryLabel}
            compact
          />
        </div>

        {/* Wearstyle */}
        {!compact ? (
          <WearstyleChips
            wearstyles={piece.wearstyles}
            pieceType={piece.pieceType}
          />
        ) : null}

        {/* Dress tester */}
        {onOpenInDressTester ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenInDressTester();
            }}
            className="
              mt-2 w-full rounded-lg border
              px-2 py-1.5 text-[11px]
              font-semibold uppercase
              tracking-wide text-white
              transition-all duration-200
              hover:scale-[1.01]
            "
            style={{
              borderColor:
                'rgba(196,181,253,0.45)',
              background:
                'linear-gradient(135deg, rgba(124,58,237,0.24), rgba(219,39,119,0.18))',
            }}
          >
            Abrir no Provador
          </button>
        ) : null}
      </div>
    </article>
  );
}
