'use client';

import { useState } from 'react';
import SectionBlock from '@/app/components/shared/SectionBlock';

interface ProfileUserInfoSectionProps {
  displayName: string;
  username: string;
  email: string;
}

export default function ProfileUserInfoSection({ displayName, username, email }: ProfileUserInfoSectionProps) {
  const [form, setForm] = useState({
    displayName,
    username,
    email,
    bio: 'Fashion-tech creator focused on premium essentials and elevated streetwear.',
    socialHandle: '@sai_creator',
  });

  const inputClassName = 'w-full rounded-xl border border-white/25 bg-white/10 px-3 py-2 text-sm text-white';

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
          <input type="file" className={`${inputClassName} file:mr-3 file:rounded-md file:border-0 file:bg-white/20 file:px-2 file:py-1 file:text-xs file:text-white`} />
        </label>
        <label className="text-xs text-white/80 md:col-span-2">Bio
          <textarea rows={3} className={inputClassName} value={form.bio} onChange={(e) => setForm((prev) => ({ ...prev, bio: e.target.value }))} />
        </label>
      </div>
      <div className="mt-4 rounded-2xl border border-white/25 bg-black/20 p-3 text-sm text-white/85">
        <p>Auth status: Authenticated</p>
        <p>Provider: sai-usercontrol</p>
        <p>Plan: Creator Premium</p>
      </div>
    </SectionBlock>
  );
}
