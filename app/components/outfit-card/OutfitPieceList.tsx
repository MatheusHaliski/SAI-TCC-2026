import { OutfitPiece } from '@/app/lib/outfit-card';
import OutfitPieceCard from '@/app/components/outfit-card/OutfitPieceCard';

interface OutfitPieceListProps {
  pieces: OutfitPiece[];
  compact?: boolean;
  onOpenInDressTester?: (wardrobeItemId: string) => void;
}

export default function OutfitPieceList({ pieces, compact = false, onOpenInDressTester }: OutfitPieceListProps) {
  const visiblePieces = compact ? pieces.slice(0, 2) : pieces;

  return (
    <section className={`grid gap-3 ${compact ? 'grid-cols-1' : 'sm:grid-cols-2'}`}>
      {visiblePieces.map((piece) => (
        <OutfitPieceCard
          key={piece.id}
          piece={piece}
          compact={compact}
          onOpenInDressTester={piece.wardrobeItemId && onOpenInDressTester ? () => onOpenInDressTester(piece.wardrobeItemId!) : undefined}
        />
      ))}
    </section>
  );
}
