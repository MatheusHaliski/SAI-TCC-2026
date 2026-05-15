import CollapsibleOutfitCard from '@/app/components/outfit-card/CollapsibleOutfitCard';
import { OutfitCardData } from '@/app/lib/outfit-card';

interface SearchOutfitCardProps {
  data: OutfitCardData;
  onOpenDetail: () => void;
}

export default function SearchOutfitCard({ data, onOpenDetail }: SearchOutfitCardProps) {
  return <CollapsibleOutfitCard card={data} showActions onViewDetails={onOpenDetail} />;
}
