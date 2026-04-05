import { OutfitPiece, getCategoryFallbackIcon, getPieceTypeFallbackIcon } from '@/app/lib/outfit-card';
import WearstyleChips from '@/app/components/outfit-card/WearstyleChips';

interface OutfitPieceCardProps {
  piece: OutfitPiece;
}

export default function OutfitPieceCard({ piece }: OutfitPieceCardProps) {
  const pieceName = piece.name?.trim() || 'Unnamed Piece';
  const brandName = piece.brand?.trim() || 'Brand not specified';
  const categoryLabel = piece.category ?? 'Standard';
  const pieceTypeLabel = piece.pieceType || 'Garment';

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="space-y-1">
        <p className="truncate text-sm font-semibold text-slate-900">
          <span aria-hidden>{getPieceTypeFallbackIcon(piece.pieceType)} </span>
          {pieceName}
        </p>
        <div className="flex items-center gap-2">
          {piece.brandLogoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={piece.brandLogoUrl} alt={`${brandName} logo`} className="h-4 w-4 object-contain" />
          ) : null}
          <p className="truncate text-xs text-slate-600">{brandName}</p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700">
          <span aria-hidden>{getCategoryFallbackIcon(piece.category)}</span>
          {categoryLabel}
        </span>
        <span className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700">
          <span aria-hidden>{getPieceTypeFallbackIcon(piece.pieceType)}</span>
          {pieceTypeLabel}
        </span>
      </div>

      <div className="mt-3">
        <WearstyleChips wearstyles={piece.wearstyles} />
      </div>
    </article>
  );
}
