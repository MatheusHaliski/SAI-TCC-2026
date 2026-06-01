'use client';

import { useState } from 'react';

interface Payload {
  userId: string;
  displayName: string;
  username: string;
  email: string;
  bio: string;
  avatarUrl?: string;
}

interface ProfileResponse {
  name?: string;
  username?: string;
  email?: string;
  bio?: string;
  photo_url?: string;
}

export function useProfileUpdate() {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProfile = async (payload: Payload): Promise<ProfileResponse | null> => {
    setSaving(true);
    setError(null);
    try {
      const response = await fetch('/api/users/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({ error: 'Não foi possível atualizar o perfil.' }));
        setError(data.error || 'Não foi possível atualizar o perfil.');
        return null;
      }

      const data = (await response.json().catch(() => null)) as { profile?: ProfileResponse } | null;
      return data?.profile ?? null;
    } catch {
      setError('Erro de conexão. Verifique sua internet e tente novamente.');
      return null;
    } finally {
      setSaving(false);
    }
  };

  return { saving, error, updateProfile };
}
