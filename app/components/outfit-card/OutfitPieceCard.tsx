import { OutfitPiece, resolveBrandLogoUrlByName } from '@/app/lib/outfit-card';
import WearstyleChips from '@/app/components/outfit-card/WearstyleChips';
import VisualToken from '@/app/components/outfit-card/VisualToken';
import BrandBadge from '@/app/components/outfit-card/BrandBadge';
import { FILTER_GLOW_LINE, GLOW_LINE, TEXT_GLOW } from '@/app/lib/uiToken';

interface OutfitPieceCardProps {
  piece: OutfitPiece;
  compact?: boolean;
}

export default function OutfitPieceCard({ piece, compact = false }: OutfitPieceCardProps) {
  const pieceName = piece.name?.trim() || 'Unnamed Piece';
  const brandName = piece.brand?.trim() || 'Brand not specified';
  const brandLogoUrl = piece.brandLogoUrl || resolveBrandLogoUrlByName(brandName) || undefined;
  const categoryLabel = piece.category ?? 'Standard';
  const pieceTypeLabel = piece.pieceType || 'Garment';
  
  return (
    <article
      className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] ${compact ? 'p-3' : 'p-4'} backdrop-blur-[12px] shadow-[0_8px_28px_rgba(2,6,23,0.32)] transition duration-300 hover:scale-[1.02] hover:border-white/25 hover:shadow-[0_14px_40px_rgba(34,211,238,0.18)] ${FILTER_GLOW_LINE} ${GLOW_LINE}`}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(130deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0)_45%,rgba(56,189,248,0.08)_100%)] opacity-70" />
      <div aria-hidden className="pointer-events-none absolute inset-[1px] rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.16),inset_0_0_35px_rgba(59,130,246,0.06)]" />

      <div className="relative z-[1] space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex items-center gap-2">
            <p className={`truncate pr-1 text-sm font-semibold ${TEXT_GLOW}`}>{pieceName}</p>
          </div>
          <VisualToken type="category" value={pieceTypeLabel} compact />
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <BrandBadge brandName={brandName} brandLogoUrl={brandLogoUrl} variant="compact" />
          </div>
          <VisualToken type="rarity" value={categoryLabel} compact />
        </div>

        {!compact ? <WearstyleChips wearstyles={piece.wearstyles} pieceType={piece.pieceType} /> : null}
      </div>
    </article>
  );
}
