'use client';

import { ChangeEvent, useEffect, useState } from 'react';
import SectionBlock from '@/app/components/shared/SectionBlock';
import { useProfileUpdate } from '@/app/hooks/useProfileUpdate';
import { getAuthSessionProfile, setAuthSessionProfile } from '@/app/lib/authSession';

interface ProfileUserInfoSectionProps {
  userId: string;
  displayName: string;
  username: string;
  email: string;
}

export default function ProfileUserInfoSection({ userId, displayName, username, email }: ProfileUserInfoSectionProps) {
  const defaultBio = 'Fashion-tech creator focused on premium essentials and elevated streetwear.';
  const defaultForm = {
    displayName,
    username,
    email,
    bio: defaultBio,
    avatarUrl: '',
  };

  const [initial, setInitial] = useState(defaultForm);
  const [form, setForm] = useState(defaultForm);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const { saving, error, updateProfile } = useProfileUpdate();

  const dirty = JSON.stringify(form) !== JSON.stringify(initial);

  const inputClassName = 'w-full rounded-xl border border-white/25 bg-white/10 px-3 py-2 text-sm text-white';

  const onAvatarUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm((prev) => ({ ...prev, avatarUrl: typeof reader.result === 'string' ? reader.result : prev.avatarUrl }));
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    const loadCurrentUser = async () => {
      if (!userId) return;
      setLoadingProfile(true);
      try {
        const response = await fetch(`/api/users/me?userId=${encodeURIComponent(userId)}`);
        if (!response.ok) return;
        const data = (await response.json().catch(() => null)) as { profile?: { name?: string; username?: string; email?: string; bio?: string; photo_url?: string } } | null;
        const profile = data?.profile;
        if (!profile) return;
        const loaded = {
          displayName: profile.name?.trim() || displayName,
          username: profile.username?.trim() || username,
          email: profile.email?.trim() || email,
          bio: profile.bio?.trim() || defaultBio,
          avatarUrl: profile.photo_url?.trim() || '',
        };
        setInitial(loaded);
        setForm(loaded);
      } finally {
        setLoadingProfile(false);
      }
    };

    loadCurrentUser().catch(() => {
      setLoadingProfile(false);
    });
  }, [defaultBio, displayName, email, userId, username]);

  return (
    <SectionBlock title="User Info" subtitle="Edit your profile identity and public creator metadata.">
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <label className="text-xs text-white/80">Display name
          <input className={inputClassName} value={form.displayName} onChange={(e) => setForm((prev) => ({ ...prev, displayName: e.target.value }))} />
        </label>
        <label className="text-xs text-white/80">Username
          <input className={inputClassName} value={form.username} onChange={(e) => setForm((prev) => ({ ...prev, username: e.target.value }))} />
        </label>
        <label className="text-xs text-white/80">Email
          <input className={inputClassName} value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} />
        </label>
        <label className="text-xs text-white/80">Avatar
          <input type="file" onChange={onAvatarUpload} className={`${inputClassName} file:mr-3 file:rounded-md file:border-0 file:bg-white/20 file:px-2 file:py-1 file:text-xs file:text-white`} />
        </label>
        <label className="text-xs text-white/80 md:col-span-2">Bio
          <textarea rows={3} className={inputClassName} value={form.bio} onChange={(e) => setForm((prev) => ({ ...prev, bio: e.target.value }))} />
        </label>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          className="rounded-xl border border-violet-300/70 bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          disabled={!dirty || saving || !userId}
          onClick={async () => {
            const profile = await updateProfile({ userId, ...form });
            if (!profile) {
              setToast('Unable to save profile.');
              return;
            }

            const synced = {
              displayName: profile.name?.trim() || form.displayName,
              username: profile.username?.trim() || form.username,
              email: profile.email?.trim() || form.email,
              bio: profile.bio?.trim() || form.bio,
              avatarUrl: profile.photo_url?.trim() || form.avatarUrl,
            };

            setInitial(synced);
            setForm(synced);

            const authProfile = getAuthSessionProfile();
            setAuthSessionProfile({
              ...authProfile,
              name: synced.displayName,
              email: synced.email,
            });

            setToast('Profile updated successfully.');
          }}
        >
          {saving ? 'Saving...' : loadingProfile ? 'Loading...' : 'Save Changes'}
        </button>
        <button type="button" className="rounded-xl border border-white/25 bg-white/10 px-4 py-2 text-sm" disabled={!dirty || saving} onClick={() => setForm(initial)}>
          Cancel
        </button>
      </div>

      {toast ? <p className="mt-3 text-xs text-cyan-200">{toast}</p> : null}
      {error ? <p className="mt-1 text-xs text-rose-200">{error}</p> : null}
    </SectionBlock>
  );
}
