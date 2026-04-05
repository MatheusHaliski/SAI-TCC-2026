import { OutfitPiece } from '@/app/lib/outfit-card';
import OutfitPieceCard from '@/app/components/outfit-card/OutfitPieceCard';

interface OutfitPieceListProps {
  pieces: OutfitPiece[];
}

export default function OutfitPieceList({ pieces }: OutfitPieceListProps) {
  return (
    <section className="grid gap-3 sm:grid-cols-2">
      {pieces.map((piece) => (
        <OutfitPieceCard key={piece.id} piece={piece} />
      ))}
    </section>
  );
}
