'use client';

import { useMemo, useState } from 'react';
import SectionBlock from '@/app/components/shared/SectionBlock';
import OutfitCard from '@/app/components/outfit-card/OutfitCard';
import OutfitExportModal from '@/app/components/profile/OutfitExportModal';
import { OutfitCardData } from '@/app/lib/outfit-card';

interface Scheme {
  scheme_id: string;
  title: string;
  style: string;
  occasion: string;
  description?: string | null;
  cover_image_url?: string | null;
  visibility: 'public' | 'private';
  creation_mode?: 'manual' | 'ai';
  updated_at?: string;
}

interface ProfileMySchemesSectionProps {
  userId: string;
  schemes: Scheme[];
}

const buildData = (scheme: Scheme): OutfitCardData => ({
  outfitName: scheme.title,
  outfitStyleLine: `${scheme.style} · ${scheme.occasion}`,
  outfitDescription: scheme.description || 'Creator scheme ready for editing and publishing.',
  heroImageUrl: scheme.cover_image_url || '/welcome-newcomers.png',
  metaBadges: [
    { icon: scheme.creation_mode === 'ai' ? '✨' : '✍️', label: scheme.creation_mode === 'ai' ? 'AI' : 'Manual' },
    { icon: scheme.visibility === 'public' ? '🌐' : '🔒', label: scheme.visibility === 'public' ? 'Public' : 'Private' },
    { icon: '🕒', label: scheme.updated_at ? new Date(scheme.updated_at).toLocaleDateString() : 'recent' },
  ],
  pieces: [],
});

export default function ProfileMySchemesSection({ userId, schemes }: ProfileMySchemesSectionProps) {
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);
  const [exportingScheme, setExportingScheme] = useState<Scheme | null>(null);

  const cards = useMemo(() => schemes.map((scheme) => ({ scheme, data: buildData(scheme) })), [schemes]);

  return (
    <>
      <SectionBlock title="My Schemes" subtitle="Authored creative assets with compact premium outfit cards.">
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          {cards.map(({ scheme, data }) => (
            <OutfitCard
              key={scheme.scheme_id}
              data={data}
              variant="compact"
              actions={[
                { label: 'Open', onClick: () => setSelectedScheme(scheme), tone: 'accent' },
                { label: 'Edit' },
                { label: 'Export', onClick: () => setExportingScheme(scheme), tone: 'accent' },
                { label: scheme.visibility === 'public' ? 'Unpublish' : 'Publish' },
                { label: 'Delete', tone: 'danger' },
              ]}
            />
          ))}
          {!cards.length ? <p className="text-sm text-white/80">No authored schemes yet.</p> : null}
        </div>
      </SectionBlock>

      {selectedScheme ? (
        <div className="fixed inset-0 z-[55] flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-2xl rounded-3xl border border-white/20 bg-slate-950 p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-white">{selectedScheme.title}</h3>
              <div className="flex gap-2">
                <button type="button" onClick={() => setExportingScheme(selectedScheme)} className="rounded-lg border border-cyan-300/50 px-2 py-1 text-xs text-cyan-100">Export to Social</button>
                <button type="button" onClick={() => setSelectedScheme(null)} className="rounded-lg border border-white/30 px-2 py-1 text-xs text-white">Close</button>
              </div>
            </div>
            <p className="mt-2 text-sm text-white/75">View creator profile • Save/Favorite • Open in Dress Tester (next phase integration).</p>
            <div className="mt-4">
              <OutfitCard data={buildData(selectedScheme)} />
            </div>
          </div>
        </div>
      ) : null}

      {exportingScheme ? (
        <OutfitExportModal
          open={Boolean(exportingScheme)}
          onClose={() => setExportingScheme(null)}
          userId={userId}
          outfitId={exportingScheme.scheme_id}
          schemeId={exportingScheme.scheme_id}
          title={exportingScheme.title}
          sourceImageUrl={exportingScheme.cover_image_url || '/welcome-newcomers.png'}
          defaultCaption={`${exportingScheme.title} • ${exportingScheme.style} look built in SAI`}
        />
      ) : null}
    </>
  );
}
