import { OutfitPiece, OutfitPieceListFormat } from '@/app/lib/outfit-card';
import OutfitPieceCard from '@/app/components/outfit-card/OutfitPieceCard';

interface OutfitPieceListProps {
  pieces: OutfitPiece[];
  compact?: boolean;
  schemeId?: string;
  /** Visual layout used to arrange the pieces. Defaults to 'grid-2'. */
  format?: OutfitPieceListFormat;
  /** Called when the user clicks "Visualizar card da peça" on a piece tile. */
  onViewPieceCard?: (wardrobeItemId: string) => void;
  /** @deprecated Pass onViewPieceCard instead. Kept for callers not yet migrated. */
  onOpenInDressTester?: (wardrobeItemId: string) => void;
}

type LayoutProps = {
  pieces: OutfitPiece[];
  compact?: boolean;
  schemeId?: string;
  onTileClick?: (piece: OutfitPiece) => void;
};

export default function OutfitPieceList({
  pieces,
  compact = false,
  schemeId,
  format = 'grid-2',
  onViewPieceCard,
  onOpenInDressTester,
}: OutfitPieceListProps) {
  const resolveCallback = (piece: OutfitPiece) => {
    if (!piece.wardrobeItemId) return undefined;
    if (onViewPieceCard) return () => onViewPieceCard(piece.wardrobeItemId!);
    if (onOpenInDressTester) return () => onOpenInDressTester(piece.wardrobeItemId!);
    return undefined;
  };

  if (format === 'stack') return <StackLayout pieces={pieces} compact={compact} onTileClick={(piece) => resolveCallback(piece)?.()} />;
  if (format === 'plate') return <PlateLayout pieces={pieces} onTileClick={(piece) => resolveCallback(piece)?.()} />;
  if (format === 'magazine') return <MagazineLayout pieces={pieces} onTileClick={(piece) => resolveCallback(piece)?.()} />;
  if (format === 'row') return <RowLayout pieces={pieces} onTileClick={(piece) => resolveCallback(piece)?.()} />;

  const visiblePieces = compact ? pieces.slice(0, 2) : pieces;
  const columns = format === 'grid-3' ? 3 : 2;
  return (
    <section className={`grid w-full min-w-0 gap-3 ${compact ? 'grid-cols-1' : columns === 3 ? 'grid-cols-1 sm:grid-cols-3' : 'sm:grid-cols-2'}`}>
      {visiblePieces.map((piece) => (
        <OutfitPieceCard
          key={piece.id}
          piece={piece}
          compact={compact}
          schemeId={schemeId}
          onViewPieceCard={resolveCallback(piece)}
        />
      ))}
    </section>
  );
}

function PieceTile({ piece, onClick, height }: { piece: OutfitPiece; onClick?: () => void; height: number }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full overflow-hidden rounded-xl border border-white/12 bg-white/8 text-left text-white transition hover:border-white/25"
    >
      <div style={{ height }} className="flex items-center justify-center overflow-hidden bg-black/25">
        {piece.imageUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={piece.imageUrl} alt={piece.name} className="h-full w-full object-cover" />
        ) : (
          <span className="text-[10px] uppercase tracking-[0.12em] text-white/50">{piece.pieceType || 'vazio'}</span>
        )}
      </div>
      <div className="space-y-0.5 p-2">
        <p className="truncate text-[9px] uppercase tracking-[0.12em] text-white/55">{piece.pieceType || 'Peça'}</p>
        <p className="truncate text-sm font-bold">{piece.name || '—'}</p>
        {piece.brand ? <p className="truncate text-[10px] text-white/65">🏷️ {piece.brand}</p> : null}
      </div>
    </button>
  );
}

function StackLayout({ pieces, onTileClick, compact }: LayoutProps) {
  return (
    <div className="flex w-full min-w-0 flex-col gap-2">
      {pieces.map((piece, idx) => (
        <button
          key={piece.id}
          type="button"
          onClick={() => onTileClick?.(piece)}
          className="flex w-full min-w-0 items-center gap-3 rounded-xl border border-white/12 bg-white/8 px-3 py-2 text-left text-white transition hover:border-white/25"
        >
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-black/35 text-[11px] font-extrabold">{idx + 1}</span>
          <span className={`shrink-0 overflow-hidden rounded-lg bg-black/30 ${compact ? 'h-10 w-10' : 'h-14 w-14'}`}>
            {piece.imageUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={piece.imageUrl} alt={piece.name} className="h-full w-full object-cover" />
            ) : null}
          </span>
          <span className="min-w-0 flex-1">
            <p className="truncate text-[10px] uppercase tracking-[0.1em] text-white/55">{piece.pieceType || 'Peça'}</p>
            <p className="truncate text-sm font-bold">{piece.name || '—'}</p>
            {piece.brand ? <p className="truncate text-[10px] text-white/65">🏷️ {piece.brand}</p> : null}
          </span>
        </button>
      ))}
    </div>
  );
}

function PlateLayout({ pieces, onTileClick }: LayoutProps) {
  const radius = 110;
  const center = 140;
  const angleStep = (2 * Math.PI) / Math.max(pieces.length, 1);

  return (
    <div className="relative mx-auto" style={{ width: 280, height: 280 }}>
      <div
        className="absolute rounded-full"
        style={{ inset: '18%', background: 'radial-gradient(circle, rgba(255,255,255,0.18), rgba(255,255,255,0.02))', boxShadow: '0 12px 40px rgba(0,0,0,0.4)' }}
      />
      <div className="absolute rounded-full border border-dashed border-white/20" style={{ inset: '27%' }} />
      {pieces.map((piece, idx) => {
        const angle = idx * angleStep - Math.PI / 2;
        const x = center + radius * Math.cos(angle) - 32;
        const y = center + radius * Math.sin(angle) - 32;
        return (
          <button
            key={piece.id}
            type="button"
            onClick={() => onTileClick?.(piece)}
            title={`${piece.pieceType || 'Peça'}: ${piece.name || 'vazio'}`}
            className="absolute overflow-hidden rounded-full border border-white/40 bg-black/30 text-white shadow-[0_6px_18px_rgba(0,0,0,0.4)]"
            style={{ left: x, top: y, width: 64, height: 64 }}
          >
            {piece.imageUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={piece.imageUrl} alt={piece.name} className="h-full w-full object-cover" />
            ) : (
              <span className="flex h-full w-full items-center justify-center px-1 text-center text-[9px]">{piece.pieceType || '—'}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

function MagazineLayout({ pieces, onTileClick }: LayoutProps) {
  const [hero, ...rest] = pieces;
  if (!hero) return null;
  return (
    <div className="grid w-full min-w-0 grid-cols-[1.6fr_1fr] gap-2">
      <PieceTile piece={hero} onClick={() => onTileClick?.(hero)} height={180} />
      <div className="flex min-w-0 flex-col gap-2">
        {rest.map((piece) => (
          <PieceTile key={piece.id} piece={piece} onClick={() => onTileClick?.(piece)} height={84} />
        ))}
      </div>
    </div>
  );
}

function RowLayout({ pieces, onTileClick }: LayoutProps) {
  return (
    <div className="flex w-full gap-2 overflow-x-auto pb-1">
      {pieces.map((piece) => (
        <div key={piece.id} className="min-w-[150px]">
          <PieceTile piece={piece} onClick={() => onTileClick?.(piece)} height={120} />
        </div>
      ))}
    </div>
  );
}
