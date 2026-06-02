'use client';

import { useEffect, useState } from 'react';
import RunwayFeedView from '@/app/components/social/RunwayFeedView';
import { getAuthSessionProfile } from '@/app/lib/authSession';

type SessionProfile = { userId?: string; name?: string; photoUrl?: string };

export default function RunwayFeedViewWrapper() {
  const [profile, setProfile] = useState<SessionProfile>({});

  useEffect(() => {
    const p = getAuthSessionProfile();
    if (p) setProfile({ userId: p.user_id, name: p.name, photoUrl: p.photo_url });
  }, []);

  return (
    <RunwayFeedView
      viewerId={profile.userId}
      viewerName={profile.name}
      viewerPhotoUrl={profile.photoUrl}
    />
  );
}
