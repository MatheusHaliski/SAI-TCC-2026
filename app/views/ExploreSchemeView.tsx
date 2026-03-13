'use client';

import { useEffect, useState } from 'react';
import PageHeader from '@/app/components/shell/PageHeader';
import SectionBlock from '@/app/components/shared/SectionBlock';

type Scheme = {
  scheme_id: string;
  title: string;
  style: string;
  occasion: string;
  cover_image_url: string | null;
  user_id: string;
};

export default function ExploreSchemeView() {
  const [schemes, setSchemes] = useState<Scheme[]>([]);

  useEffect(() => {
    fetch('/api/schemes/public').then((res) => res.json()).then((data) => setSchemes(data));
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader title="Explore Scheme" subtitle="Discover community public schemes." />
      <SectionBlock title="Public Schemes" subtitle="Community-indexed outfit schemes.">
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {schemes.map((scheme) => (
            <article key={scheme.scheme_id} className="sa-premium-gradient-surface-soft rounded-2xl border border-white/25 p-4">
              <div className="h-32 rounded-xl bg-black/20" style={{ backgroundImage: scheme.cover_image_url ? `url(${scheme.cover_image_url})` : undefined, backgroundSize: 'cover' }} />
              <h3 className="mt-3 text-white font-semibold">{scheme.title}</h3>
              <p className="text-sm text-white/70">Author #{scheme.user_id}</p>
              <p className="text-sm text-white/70">Style: {scheme.style}</p>
              <p className="text-sm text-white/70">Occasion: {scheme.occasion}</p>
            </article>
          ))}
        </div>
      </SectionBlock>
    </div>
  );
}
