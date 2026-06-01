import { OutfitPiece } from '@/app/lib/outfit-card';
import OutfitPieceCard from '@/app/components/outfit-card/OutfitPieceCard';

interface OutfitPieceListProps {
  pieces: OutfitPiece[];
  compact?: boolean;
  schemeId?: string;
  /** Called when the user clicks "Visualizar card da peça" on a piece tile. */
  onViewPieceCard?: (wardrobeItemId: string) => void;
  /** @deprecated Pass onViewPieceCard instead. Kept for callers not yet migrated. */
  onOpenInDressTester?: (wardrobeItemId: string) => void;
}

export default function OutfitPieceList({
  pieces,
  compact = false,
  schemeId,
  onViewPieceCard,
  onOpenInDressTester,
}: OutfitPieceListProps) {
  const visiblePieces = compact ? pieces.slice(0, 2) : pieces;
  const resolveCallback = (piece: OutfitPiece) => {
    if (!piece.wardrobeItemId) return undefined;
    if (onViewPieceCard) return () => onViewPieceCard(piece.wardrobeItemId!);
    if (onOpenInDressTester) return () => onOpenInDressTester(piece.wardrobeItemId!);
    return undefined;
  };

  return (
    <section className={`grid w-full min-w-0 gap-3 ${compact ? 'grid-cols-1' : 'sm:grid-cols-2'}`}>
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
