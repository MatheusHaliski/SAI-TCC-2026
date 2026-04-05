import { OutfitPiece, getPieceTypeFallbackIcon } from '@/app/lib/outfit-card';
import CategoryBadge from '@/app/components/outfit-card/CategoryBadge';
import WearstyleChips from '@/app/components/outfit-card/WearstyleChips';

interface OutfitPieceCardProps {
  piece: OutfitPiece;
}

export default function OutfitPieceCard({ piece }: OutfitPieceCardProps) {
  const pieceName = piece.name?.trim() || 'Unnamed Piece';
  const brandName = piece.brand?.trim() || 'Brand not specified';

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-sm">
          {piece.pieceTypeIconUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={piece.pieceTypeIconUrl} alt={`${piece.pieceType} icon`} className="h-5 w-5 object-contain" />
          ) : (
            <span aria-hidden>{getPieceTypeFallbackIcon(piece.pieceType)}</span>
          )}
        </span>

        <p className="truncate text-sm font-semibold text-slate-900">{pieceName}</p>
      </div>

      <div className="mt-2 flex items-center gap-2">
        <span className="inline-flex h-7 min-w-7 items-center justify-center overflow-hidden rounded-md border border-slate-200 bg-slate-100 px-1 text-[10px] font-semibold text-slate-600">
          {piece.brandLogoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={piece.brandLogoUrl} alt={`${brandName} logo`} className="h-4 w-4 object-contain" />
          ) : (
            brandName.slice(0, 2).toUpperCase()
          )}
        </span>
        <p className="truncate text-xs text-slate-600">{brandName}</p>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <CategoryBadge category={piece.category} />
        <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-700">
          {piece.pieceType || 'Garment'}
        </span>
      </div>

      <div className="mt-3">
        <WearstyleChips wearstyles={piece.wearstyles} />
      </div>
    </article>
  );
}
