import OutfitCard from '@/app/components/outfit-card/OutfitCard';
import { OutfitCardData } from '@/app/lib/outfit-card';

interface SearchOutfitCardProps {
  data: OutfitCardData;
  onOpenDetail: () => void;
  onOpenPieceInDressTester?: (wardrobeItemId: string) => void;
}

export default function SearchOutfitCard({ data, onOpenDetail, onOpenPieceInDressTester }: SearchOutfitCardProps) {
  return (
    <button type="button" className="w-full text-left" onClick={onOpenDetail}>
      <OutfitCard data={data} variant="compact" onOpenInDressTester={onOpenPieceInDressTester} />
    </button>
  );
}
