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

interface PublicProfile {
  name?: string;
  username?: string;
  email?: string;
  bio?: string;
  photo_url?: string;
}

const parseSectionFromQuery = (value: string | null): ProfileSectionKey => {
  if (!value) return 'wardrobe';
  const normalized = value.trim().toLowerCase() as ProfileSectionKey;
  return ALLOWED_SECTIONS.includes(normalized) ? normalized : 'wardrobe';
};

export default function ProfileView() {
  const authProfile = getAuthSessionProfile();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const pathSegments = pathname.split('/').filter(Boolean);
  const publicUserFromPath = pathSegments[0] === 'profile' && pathSegments[1] && pathSegments[1] !== 'settings' ? pathSegments[1] : '';

  const [authUserId, setAuthUserId] = useState(authProfile.user_id?.trim() || '');
  const [userId, setUserId] = useState(publicUserFromPath || authProfile.user_id?.trim() || '');
  const [viewedProfile, setViewedProfile] = useState<PublicProfile>({
    name: authProfile.name?.trim() || '',
    email: authProfile.email?.trim() || '',
  });
  const [wardrobeItems, setWardrobeItems] = useState<WardrobeItem[]>([]);
  const [schemes, setSchemes] = useState<SchemeItem[]>([]);
  const [posts, setPosts] = useState<UserPostRecord[]>([]);

  const isOwnerView = Boolean(authUserId) && Boolean(userId) && authUserId === userId;
  const forcedPublicSection = publicUserFromPath && !isOwnerView ? 'user-info' : null;
  const selectedSection = forcedPublicSection ?? (pathname.endsWith('/settings') ? 'settings' : parseSectionFromQuery(searchParams.get('section')));
  const allowedSections: ProfileSectionKey[] = isOwnerView || !publicUserFromPath
    ? ALLOWED_SECTIONS
    : ['user-info'];

  useEffect(() => {
    const loadProfileHubData = async () => {
      const localProfile = getAuthSessionProfile();
      let resolvedAuthUserId = localProfile.user_id?.trim() || '';

      if (!resolvedAuthUserId) {
        const serverProfile = await getServerSession();
        resolvedAuthUserId = serverProfile?.user_id?.trim() || '';
      }

      const resolvedViewedUserId = publicUserFromPath || resolvedAuthUserId;
      setAuthUserId(resolvedAuthUserId);
      setUserId(resolvedViewedUserId);

      if (!resolvedViewedUserId) {
        setWardrobeItems([]);
        setSchemes([]);
        setPosts([]);
        setViewedProfile({});
        return;
      }

      const profileResponse = await fetch(`/api/users/me?userId=${encodeURIComponent(resolvedViewedUserId)}`);
      const profileData = (await profileResponse.json().catch(() => null)) as { profile?: PublicProfile } | null;
      const loadedProfile = profileData?.profile ?? {};
      setViewedProfile(loadedProfile);

      if (resolvedViewedUserId !== resolvedAuthUserId) {
        setWardrobeItems([]);
        setSchemes([]);
        setPosts([]);
        return;
      }

      const [wardrobeResponse, schemesResponse, postsResponse] = await Promise.all([
        fetch(`/api/wardrobe-items/user/${resolvedViewedUserId}`),
        fetch(`/api/schemes/user/${resolvedViewedUserId}`),
        fetch(`/api/user-posts?user_id=${encodeURIComponent(resolvedViewedUserId)}`),
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
  }, [publicUserFromPath]);

  const email = viewedProfile.email?.trim() || authProfile.email?.trim() || 'not-available@user.local';
  const username = viewedProfile.username?.trim() || viewedProfile.name?.trim() || email.split('@')[0] || 'user';
  const displayName = viewedProfile.name?.trim() || username;

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
    const normalized = allowedSections.includes(section) ? section : allowedSections[0];
    const query = new URLSearchParams(searchParams.toString());
    query.set('section', normalized);
    router.replace(`${pathname}?${query.toString()}`);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <ProfileContextMenu selectedSection={selectedSection} onSelectSection={updateSection} allowedSections={allowedSections} />

      <div className="space-y-6">
        <PageHeader title={isOwnerView ? 'Profile' : `Creator Profile`} subtitle={isOwnerView ? 'Premium creator hub for wardrobe, schemes, publishing, and account controls.' : 'Public creator profile view.'} />

        <ProfileSummaryCard
          username={username}
          loginEmail={email}
          loginStatus={isOwnerView ? 'Authenticated' : 'Public Profile'}
          authSource="sai-usercontrol"
        />

        <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-2 text-sm text-white/85 backdrop-blur-md">
          Active section: <span className="font-semibold text-cyan-100">{activeSectionLabel}</span>
        </div>

        <ProfileSectionRenderer
          section={selectedSection}
          userId={userId}
          username={username}
          displayName={displayName}
          email={email}
          canEdit={isOwnerView}
          wardrobeItems={wardrobeItems}
          schemes={schemes}
          posts={posts}
        />
      </div>
    </div>
  );
}
