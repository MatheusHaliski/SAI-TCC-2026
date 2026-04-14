'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import ProfileSummaryCard from '@/app/components/cards/ProfileSummaryCard';
import PageHeader from '@/app/components/shell/PageHeader';
import { getAuthSessionProfile } from '@/app/lib/authSession';
import { getServerSession } from '@/app/lib/clientSession';
import ProfileContextMenu from '@/app/components/profile/ProfileContextMenu';
import ProfileSectionRenderer from '@/app/components/profile/ProfileSectionRenderer';
import { ProfileSectionKey, UserPostRecord } from '@/app/components/profile/types';

const ALLOWED_SECTIONS: ProfileSectionKey[] = ['wardrobe', 'user-info', 'my-schemes', 'saved-schemes', 'my-posts', 'settings'];

interface WardrobeItem {
  wardrobe_item_id: string;
  name: string;
  image_url: string;
  brand: string;
  piece_type: string;
}

interface SchemeItem {
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

const parseSectionFromQuery = (value: string | null): ProfileSectionKey => {
  if (!value) return 'wardrobe';
  const normalized = value.trim().toLowerCase() as ProfileSectionKey;
  return ALLOWED_SECTIONS.includes(normalized) ? normalized : 'wardrobe';
};

export default function ProfileView() {
  const profile = getAuthSessionProfile();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [userId, setUserId] = useState(profile.user_id?.trim() || '');
  const [wardrobeItems, setWardrobeItems] = useState<WardrobeItem[]>([]);
  const [schemes, setSchemes] = useState<SchemeItem[]>([]);
  const [posts, setPosts] = useState<UserPostRecord[]>([]);

  const selectedSection = pathname.endsWith('/settings') ? 'settings' : parseSectionFromQuery(searchParams.get('section'));

  useEffect(() => {
    const loadProfileHubData = async () => {
      const localProfile = getAuthSessionProfile();
      let resolvedUserId = localProfile.user_id?.trim() || '';

      if (!resolvedUserId) {
        const serverProfile = await getServerSession();
        resolvedUserId = serverProfile?.user_id?.trim() || '';
      }

      if (!resolvedUserId) {
        setWardrobeItems([]);
        setSchemes([]);
        setPosts([]);
        return;
      }

      setUserId(resolvedUserId);
      const [wardrobeResponse, schemesResponse, postsResponse] = await Promise.all([
        fetch(`/api/wardrobe-items/user/${resolvedUserId}`),
        fetch(`/api/schemes/user/${resolvedUserId}`),
        fetch(`/api/user-posts?user_id=${encodeURIComponent(resolvedUserId)}`),
      ]);

      const wardrobeData = await wardrobeResponse.json().catch(() => []);
      const schemesData = await schemesResponse.json().catch(() => []);
      const postsData = await postsResponse.json().catch(() => []);

      setWardrobeItems(Array.isArray(wardrobeData) ? (wardrobeData as WardrobeItem[]) : []);
      setSchemes(Array.isArray(schemesData) ? (schemesData as SchemeItem[]) : []);
      setPosts(Array.isArray(postsData) ? (postsData as UserPostRecord[]) : []);
    };

    loadProfileHubData().catch(() => {
      setWardrobeItems([]);
      setSchemes([]);
      setPosts([]);
    });
  }, []);

  const email = profile.email?.trim() || 'not-available@user.local';
  const username = profile.name?.trim() || email.split('@')[0] || 'user';

  const activeSectionLabel = useMemo(() => {
    const map: Record<ProfileSectionKey, string> = {
      wardrobe: 'My Wardrobe Pieces',
      'user-info': 'User Info',
      'my-schemes': 'My Schemes',
      'saved-schemes': 'Saved Schemes',
      'my-posts': 'My Posts',
      settings: 'Settings',
    };
    return map[selectedSection];
  }, [selectedSection]);

  const updateSection = (section: ProfileSectionKey) => {
    const query = new URLSearchParams(searchParams.toString());
    query.set('section', section);
    router.replace(`${pathname}?${query.toString()}`);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <ProfileContextMenu selectedSection={selectedSection} onSelectSection={updateSection} />

      <div className="space-y-6">
        <PageHeader title="Profile" subtitle="Premium creator hub for wardrobe, schemes, publishing, and account controls." />

        <ProfileSummaryCard
          username={username}
          loginEmail={email}
          loginStatus="Authenticated"
          authSource="sai-usercontrol"
        />

        <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-2 text-sm text-white/85 backdrop-blur-md">
          Active section: <span className="font-semibold text-cyan-100">{activeSectionLabel}</span>
        </div>

        <ProfileSectionRenderer
          section={selectedSection}
          userId={userId}
          username={username}
          displayName={profile.name?.trim() || username}
          email={email}
          wardrobeItems={wardrobeItems}
          schemes={schemes}
          posts={posts}
        />
      </div>
    </div>
  );
}
