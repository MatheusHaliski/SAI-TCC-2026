'use client';

import { useMemo, useState } from 'react';
import SectionBlock from '@/app/components/shared/SectionBlock';
import OutfitCard from '@/app/components/outfit-card/OutfitCard';
import OutfitExportModal from '@/app/components/profile/OutfitExportModal';
import { OutfitCardData } from '@/app/lib/outfit-card';

interface SavedScheme {
  scheme_id: string;
  title: string;
  style: string;
  occasion: string;
  description?: string | null;
  cover_image_url?: string | null;
  visibility: 'public' | 'private';
}

interface ProfileSavedSchemesSectionProps {
  userId: string;
  schemes: SavedScheme[];
}

const toData = (scheme: SavedScheme): OutfitCardData => ({
  outfitName: scheme.title,
  outfitStyleLine: `${scheme.style} · ${scheme.occasion}`,
  outfitDescription: scheme.description || 'Saved outfit card with editable social-ready metadata.',
  heroImageUrl: scheme.cover_image_url || '/welcome-newcomers.png',
  metaBadges: [
    { icon: '💾', label: 'Saved' },
    { icon: scheme.visibility === 'public' ? '🌐' : '🔒', label: scheme.visibility === 'public' ? 'Public' : 'Private' },
  ],
  pieces: [],
});

export default function ProfileSavedSchemesSection({ userId, schemes }: ProfileSavedSchemesSectionProps) {
  const [exportingScheme, setExportingScheme] = useState<SavedScheme | null>(null);
  const cards = useMemo(() => schemes.map((scheme) => ({ scheme, data: toData(scheme) })), [schemes]);

  return (
    <>
      <SectionBlock title="Saved Schemes" subtitle="Compact Saved Outfit Cards card family with premium visual continuity.">
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          {cards.map(({ scheme, data }) => (
            <OutfitCard
              key={scheme.scheme_id}
              data={data}
              variant="compact"
              actions={[
                { label: 'Open', tone: 'accent' },
                { label: 'Edit' },
                { label: 'Export to Social', onClick: () => setExportingScheme(scheme), tone: 'accent' },
                { label: 'Duplicate' },
                { label: 'Remove', tone: 'danger' },
              ]}
            />
          ))}
          {!cards.length ? <p className="text-sm text-white/80">No saved schemes available.</p> : null}
        </div>
      </SectionBlock>

      {exportingScheme ? (
        <OutfitExportModal
          open={Boolean(exportingScheme)}
          onClose={() => setExportingScheme(null)}
          userId={userId}
          outfitId={exportingScheme.scheme_id}
          schemeId={exportingScheme.scheme_id}
          title={exportingScheme.title}
          sourceImageUrl={exportingScheme.cover_image_url || '/welcome-newcomers.png'}
          defaultCaption={`${exportingScheme.title} from my Saved Looks in SAI`}
        />
      ) : null}
    </>
  );
}
