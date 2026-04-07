'use client';

import { ChangeEvent, useState } from 'react';
import SectionBlock from '@/app/components/shared/SectionBlock';
import { useProfileUpdate } from '@/app/hooks/useProfileUpdate';

interface ProfileUserInfoSectionProps {
  userId: string;
  displayName: string;
  username: string;
  email: string;
}

export default function ProfileUserInfoSection({ userId, displayName, username, email }: ProfileUserInfoSectionProps) {
  const initial = {
    displayName,
    username,
    email,
    bio: 'Fashion-tech creator focused on premium essentials and elevated streetwear.',
    avatarUrl: '',
  };

  const [form, setForm] = useState(initial);
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
            const ok = await updateProfile({ userId, ...form });
            setToast(ok ? 'Profile updated successfully.' : 'Unable to save profile.');
          }}
        >
          {saving ? 'Saving...' : 'Save Changes'}
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
