'use client';

import { useRouter } from 'next/navigation';
import SectionBlock from '@/app/components/shared/SectionBlock';
import WardrobeCompactCard from '@/app/components/profile/WardrobeCompactCard';

type WardrobeViewItem = {
  wardrobe_item_id: string;
  name: string;
  image_url: string;
  brand: string;
  piece_type: string;
};

interface ProfileWardrobeSectionProps {
  items: WardrobeViewItem[];
}

export default function ProfileWardrobeSection({ items }: ProfileWardrobeSectionProps) {
  const router = useRouter();

  return (
    <SectionBlock title="My Wardrobe" subtitle="Scan and manage your pieces with premium compact cards.">
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {items.map((item) => (
          <WardrobeCompactCard
            key={item.wardrobe_item_id}
            imageUrl={item.image_url}
            name={item.name}
            brand={item.brand}
            pieceType={item.piece_type}
            rarity="Premium"
            wearstyles={['Street', 'Essential']}
            onUseInTester={() => router.push('/dress-tester')}
          />
        ))}
        {!items.length ? <p className="text-sm text-white/80">No wardrobe items found yet.</p> : null}
      </div>
    </SectionBlock>
  );
}
