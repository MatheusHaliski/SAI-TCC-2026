import { OutfitPiece, resolveBrandLogoUrlByName } from '@/app/lib/outfit-card';
import WearstyleChips from '@/app/components/outfit-card/WearstyleChips';
import VisualToken from '@/app/components/outfit-card/VisualToken';
import { FILTER_GLOW_LINE, GLOW_LINE, TEXT_GLOW } from '@/app/lib/uiToken';

interface OutfitPieceCardProps {
  piece: OutfitPiece;
  compact?: boolean;
}

const PIECE_TYPE_TONES: Record<string, string> = {
  jacket: 'border-sky-300/45 bg-sky-400/12 text-sky-100 shadow-[0_0_18px_rgba(56,189,248,0.22)]',
  shirt: 'border-cyan-300/45 bg-cyan-400/12 text-cyan-100 shadow-[0_0_18px_rgba(34,211,238,0.22)]',
  top: 'border-cyan-300/45 bg-cyan-400/12 text-cyan-100 shadow-[0_0_18px_rgba(34,211,238,0.22)]',
  pants: 'border-indigo-300/45 bg-indigo-400/12 text-indigo-100 shadow-[0_0_18px_rgba(129,140,248,0.24)]',
  trouser: 'border-indigo-300/45 bg-indigo-400/12 text-indigo-100 shadow-[0_0_18px_rgba(129,140,248,0.24)]',
  footwear: 'border-fuchsia-300/45 bg-fuchsia-400/12 text-fuchsia-100 shadow-[0_0_18px_rgba(217,70,239,0.24)]',
  shoes: 'border-fuchsia-300/45 bg-fuchsia-400/12 text-fuchsia-100 shadow-[0_0_18px_rgba(217,70,239,0.24)]',
  accessory: 'border-amber-300/45 bg-amber-400/12 text-amber-100 shadow-[0_0_18px_rgba(251,191,36,0.24)]',
};

function getPieceTypeTone(pieceType?: string) {
  if (!pieceType?.trim()) return 'border-white/25 bg-white/10 text-white/90 shadow-[0_0_14px_rgba(148,163,184,0.2)]';
  const normalized = pieceType.trim().toLowerCase();
  const matched = Object.keys(PIECE_TYPE_TONES).find((key) => normalized.includes(key));
  return matched ? PIECE_TYPE_TONES[matched] : 'border-white/25 bg-white/10 text-white/90 shadow-[0_0_14px_rgba(148,163,184,0.2)]';
}

export default function OutfitPieceCard({ piece, compact = false }: OutfitPieceCardProps) {
  const pieceName = piece.name?.trim() || 'Unnamed Piece';
  const brandName = piece.brand?.trim() || 'Brand not specified';
  const brandLogoUrl = piece.brandLogoUrl || resolveBrandLogoUrlByName(brandName) || undefined;
  const categoryLabel = piece.category ?? 'Standard';
  const pieceTypeLabel = piece.pieceType || 'Garment';
  const pieceTypeMonogram = pieceTypeLabel.slice(0, 2).toUpperCase();

  return (
    <article
      className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] ${compact ? 'p-3' : 'p-4'} backdrop-blur-[12px] shadow-[0_8px_28px_rgba(2,6,23,0.32)] transition duration-300 hover:scale-[1.02] hover:border-white/25 hover:shadow-[0_14px_40px_rgba(34,211,238,0.18)] ${FILTER_GLOW_LINE} ${GLOW_LINE}`}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(130deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0)_45%,rgba(56,189,248,0.08)_100%)] opacity-70" />
      <div aria-hidden className="pointer-events-none absolute inset-[1px] rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.16),inset_0_0_35px_rgba(59,130,246,0.06)]" />

      <div className="relative z-[1] space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex items-center gap-2">
            <span
              className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border text-[10px] font-bold tracking-[0.1em] ${getPieceTypeTone(
                piece.pieceType,
              )}`}
              aria-hidden
            >
              {pieceTypeMonogram}
            </span>
            <p className={`truncate pr-1 text-sm font-semibold ${TEXT_GLOW}`}>{pieceName}</p>
          </div>
          <span className={`relative inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${getPieceTypeTone(piece.pieceType)} ${FILTER_GLOW_LINE}`}>
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
          <VisualToken type="rarity" value={categoryLabel} compact />
        </div>

        <div className="flex flex-wrap gap-2">
          <VisualToken type="category" value="Piece Type" compact />
          <span className={`inline-flex items-center rounded-lg border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${getPieceTypeTone(piece.pieceType)}`}>
            {pieceTypeLabel}
          </span>
        </div>

        {!compact ? <WearstyleChips wearstyles={piece.wearstyles} pieceType={piece.pieceType} /> : null}
      </div>
    </article>
  );
}
