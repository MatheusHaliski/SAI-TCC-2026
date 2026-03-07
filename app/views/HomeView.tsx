import OutfitCard from '@/app/components/cards/OutfitCard';
import ContextSectionMenu from '@/app/components/navigation/ContextSectionMenu';
import PageHeader from '@/app/components/shell/PageHeader';
import SectionBlock from '@/app/components/shared/SectionBlock';

const sections = ['Trending Outfits', 'Recommended Looks', 'Friends Looks', 'Seasonal Trends', 'Brand Promotions'];

const outfits = [
  { title: 'Monochrome Velocity', category: 'Minimal Street Luxe', rating: '9.4', username: 'mia_runway' },
  { title: 'Evening Metallic Drift', category: 'Luxury Night Edit', rating: '9.7', username: 'kai_studio' },
  { title: 'Soft Winter Layers', category: 'Seasonal Essentials', rating: '9.2', username: 'noa_wardrobe' },
  { title: 'Neo Tailored Urban', category: 'Contemporary Formal', rating: '9.5', username: 'aria_vogue' },
];

export default function HomeView() {
  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <ContextSectionMenu title="Home Overview" sections={sections} />
      <div className="space-y-6">
        <PageHeader title="Fashion Pulse" subtitle="Track what is trending and what your style circle is wearing today." />
        <SectionBlock title="Trending Outfits" subtitle="Freshly ranked looks from the StylistAI community.">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {outfits.map((outfit) => (
              <OutfitCard key={outfit.title} {...outfit} />
            ))}
          </div>
        </SectionBlock>
      </div>
    </div>
  );
}
