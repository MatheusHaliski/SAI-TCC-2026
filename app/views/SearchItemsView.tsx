'use client';

import { useEffect, useMemo, useState } from 'react';
import PageHeader from '@/app/components/shell/PageHeader';
import SectionBlock from '@/app/components/shared/SectionBlock';

type PublicScheme = {
  scheme_id: string;
  title: string;
  style: string;
  occasion: string;
  user_id: string;
  cover_image_url: string | null;
};

type UserPreview = { user_id: string; name: string; handle: string };

const mockUsers: UserPreview[] = [
  { user_id: 'u1', name: 'Alice Couto', handle: '@alicefits' },
  { user_id: 'u2', name: 'Bruno Lima', handle: '@brunowear' },
  { user_id: 'u3', name: 'Camila Voss', handle: '@camila.styles' },
];

export default function SearchItemsView() {
  const [query, setQuery] = useState('');
  const [schemes, setSchemes] = useState<PublicScheme[]>([]);

  useEffect(() => {
    fetch('/api/schemes/public').then((res) => res.json()).then((data) => setSchemes(Array.isArray(data) ? data : []));
  }, []);

  const queryNorm = query.trim().toLowerCase();

  const users = useMemo(
    () => mockUsers.filter((user) => !queryNorm || `${user.name} ${user.handle}`.toLowerCase().includes(queryNorm)),
    [queryNorm],
  );

  const outfits = useMemo(
    () =>
      schemes.filter(
        (scheme) =>
          !queryNorm || `${scheme.title} ${scheme.style} ${scheme.occasion} ${scheme.user_id}`.toLowerCase().includes(queryNorm),
      ),
    [queryNorm, schemes],
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Search" subtitle="Find users and outfits (Instagram-style discovery)." />

      <SectionBlock title="Magnifying Glass Search" subtitle="Search by username, outfit title, occasion, or style.">
        <label className="mt-4 flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-4 py-3">
          <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="11" cy="11" r="6" />
            <path d="m20 20-4.2-4.2" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search users and outfits..."
            className="w-full bg-transparent text-white placeholder:text-white/60 focus:outline-none"
          />
        </label>
      </SectionBlock>

      <SectionBlock title="Users" subtitle="Profiles matching the search.">
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {users.map((user) => (
            <article key={user.user_id} className="rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white">
              <p className="font-semibold">{user.name}</p>
              <p className="text-sm text-white/70">{user.handle}</p>
            </article>
          ))}
          {!users.length ? <p className="text-sm text-white/70">No users found.</p> : null}
        </div>
      </SectionBlock>

      <SectionBlock title="Outfits" subtitle="Public outfits matching your search.">
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {outfits.map((scheme) => (
            <article key={scheme.scheme_id} className="rounded-2xl border border-white/20 bg-white/10 p-3 text-white">
              <div className="h-32 rounded-lg bg-black/30" style={{ backgroundImage: scheme.cover_image_url ? `url(${scheme.cover_image_url})` : undefined, backgroundSize: 'cover' }} />
              <p className="mt-2 font-semibold">{scheme.title}</p>
              <p className="text-sm text-white/75">{scheme.style} • {scheme.occasion}</p>
            </article>
          ))}
          {!outfits.length ? <p className="text-sm text-white/70">No outfits found.</p> : null}
        </div>
      </SectionBlock>
    </div>
  );
}
