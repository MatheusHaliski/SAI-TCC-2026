import ProfileSummaryCard from '@/app/components/cards/ProfileSummaryCard';
import ContextSectionMenu from '@/app/components/navigation/ContextSectionMenu';
import PageHeader from '@/app/components/shell/PageHeader';
import SectionBlock from '@/app/components/shared/SectionBlock';

const sections = ['User Info', 'My Schemes', 'My Wardrobe', 'Saved Schemes', 'My Posts', 'Settings'];

const schemes = ['Noir Utility Capsule', 'Weekend Sport Luxe', 'Monochrome Essentials'];

export default function ProfileView() {
  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <ContextSectionMenu title="Profile Menu" sections={sections} />
      <div className="space-y-6">
        <PageHeader title="Profile" subtitle="Manage your style identity, collections, and saved scheme assets." />

        <ProfileSummaryCard username="stylist_aria" followers="12.4K" following="914" score="9.6" />

        <SectionBlock title="My Schemes" subtitle="Recently edited outfit schemes.">
          <ul className="space-y-2">
            {schemes.map((scheme) => (
              <li key={scheme} className="sa-premium-gradient-surface-soft rounded-xl border border-white/25 px-4 py-3 text-sm text-white/90">
                {scheme}
              </li>
            ))}
          </ul>
        </SectionBlock>
      </div>
    </div>
  );
}
