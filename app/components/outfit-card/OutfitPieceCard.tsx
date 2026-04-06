import { OutfitPiece, getCategoryFallbackIcon, getPieceTypeFallbackIcon, resolveBrandLogoUrlByName } from '@/app/lib/outfit-card';
import WearstyleChips from '@/app/components/outfit-card/WearstyleChips';
import { FILTER_GLOW_LINE, GLASS_INPUT, GLOW_LINE, TEXT_GLOW } from '@/app/lib/uiToken';

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
  const glassInputSurface = GLASS_INPUT.replace('h-12 w-full', '').trim();

  const rarityBadgeStyles: Record<typeof categoryLabel, string> = {
    Premium: 'border-amber-300/40 bg-amber-400/15 text-amber-100 shadow-[0_0_20px_rgba(251,191,36,0.22)]',
    Standard: 'border-slate-200/35 bg-white/10 text-white/90 shadow-[0_0_15px_rgba(148,163,184,0.20)]',
    'Limited Edition': 'border-violet-300/45 bg-violet-400/15 text-violet-100 shadow-[0_0_20px_rgba(167,139,250,0.24)]',
    Rare: 'border-cyan-300/45 bg-cyan-400/15 text-cyan-100 shadow-[0_0_20px_rgba(34,211,238,0.24)]',
  };

  return (
    <article
      className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] ${compact ? 'p-3' : 'p-4'} backdrop-blur-[12px] shadow-[0_8px_28px_rgba(2,6,23,0.32)] transition duration-300 hover:scale-[1.02] hover:border-white/25 hover:shadow-[0_14px_40px_rgba(34,211,238,0.18)] ${FILTER_GLOW_LINE} ${GLOW_LINE}`}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(130deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0)_45%,rgba(56,189,248,0.08)_100%)] opacity-70" />
      <div aria-hidden className="pointer-events-none absolute inset-[1px] rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.16),inset_0_0_35px_rgba(59,130,246,0.06)]" />

      <div className="relative z-[1] space-y-3">
        <div className="flex items-start justify-between gap-3">
          <p className={`truncate pr-1 text-sm font-semibold ${TEXT_GLOW}`}>
            <span aria-hidden>{getPieceTypeFallbackIcon(piece.pieceType)} </span>
            {pieceName}
          </p>
          <span className={`relative inline-flex items-center rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-cyan-100 ${FILTER_GLOW_LINE}`}>
            {pieceTypeLabel}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0 flex items-center gap-2">
            {brandLogoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={brandLogoUrl} alt={`${brandName} logo`} className="h-4 w-4 object-contain opacity-90" />
            ) : null}
            <p className="truncate text-xs text-white/70">{brandName}</p>
          </div>
          <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold tracking-wide ${rarityBadgeStyles[categoryLabel]}`}>
            {categoryLabel}
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className={`inline-flex items-center gap-1 rounded-xl border border-white/15 bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-white/85 ${glassInputSurface}`}>
            <span aria-hidden>{getCategoryFallbackIcon(piece.category)}</span>
            Rarity
          </span>
          <span className="inline-flex items-center gap-1 rounded-xl border border-white/15 bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-white/85">
            <span aria-hidden>{getPieceTypeFallbackIcon(piece.pieceType)}</span>
            {pieceTypeLabel}
          </span>
        </div>

        {!compact ? <WearstyleChips wearstyles={piece.wearstyles} pieceType={piece.pieceType} /> : null}
      </div>
    </article>
  );
}
