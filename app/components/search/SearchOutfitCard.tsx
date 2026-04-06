import OutfitCard from '@/app/components/outfit-card/OutfitCard';
import { OutfitCardData } from '@/app/lib/outfit-card';

interface SearchOutfitCardProps {
  data: OutfitCardData;
  onOpenDetail: () => void;
}

export default function SearchOutfitCard({ data, onOpenDetail }: SearchOutfitCardProps) {
  return <OutfitCard data={data} variant="compact" onClick={onOpenDetail} />;
}
