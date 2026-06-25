'use client';

import { useCallback, useEffect, useState } from 'react';

interface FollowControlProps {
  /** The profile being viewed. */
  targetUserId: string;
  /** The currently authenticated viewer (empty when logged out). */
  viewerId: string;
  /** True when the viewer is looking at their own profile. */
  isOwnerView: boolean;
}

/**
 * Header control for every network profile: shows live follower/following counts
 * and a Follow / Unfollow button (hidden on the viewer's own profile).
 * Counts come from /api/follows so they stay authoritative across sessions, and the
 * follower counter increments optimistically on toggle.
 */
export default function FollowControl({ targetUserId, viewerId, isOwnerView }: FollowControlProps) {
  const [followerCount, setFollowerCount] = useState<number | null>(null);
  const [followingCount, setFollowingCount] = useState<number | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [pending, setPending] = useState(false);

  const canFollow = Boolean(viewerId) && !isOwnerView && viewerId !== targetUserId;

  const loadStats = useCallback(async () => {
    if (!targetUserId) return;
    try {
      const requests: Promise<Response>[] = [
        fetch(`/api/follows?type=followers&userId=${encodeURIComponent(targetUserId)}`),
        fetch(`/api/follows?type=following&userId=${encodeURIComponent(targetUserId)}`),
      ];
      if (canFollow) {
        requests.push(
          fetch(`/api/follows?type=check&followerId=${encodeURIComponent(viewerId)}&followingId=${encodeURIComponent(targetUserId)}`),
        );
      }
      const [followersRes, followingRes, checkRes] = await Promise.all(requests);
      const followers = (await followersRes.json().catch(() => null)) as { count?: number } | null;
      const following = (await followingRes.json().catch(() => null)) as { count?: number } | null;
      setFollowerCount(typeof followers?.count === 'number' ? followers.count : 0);
      setFollowingCount(typeof following?.count === 'number' ? following.count : 0);
      if (checkRes) {
        const check = (await checkRes.json().catch(() => null)) as { is_following?: boolean } | null;
        setIsFollowing(Boolean(check?.is_following));
      }
    } catch {
      setFollowerCount((prev) => prev ?? 0);
      setFollowingCount((prev) => prev ?? 0);
    }
  }, [targetUserId, viewerId, canFollow]);

  useEffect(() => {
    void loadStats();
  }, [loadStats]);

  const toggleFollow = async () => {
    if (!canFollow || pending) return;
    const nextFollow = !isFollowing;
    setPending(true);
    // Optimistic update of the follower counter (the "incrementador").
    setIsFollowing(nextFollow);
    setFollowerCount((prev) => Math.max(0, (prev ?? 0) + (nextFollow ? 1 : -1)));
    try {
      const res = await fetch('/api/follows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ followerId: viewerId, followingId: targetUserId, follow: nextFollow }),
      });
      if (!res.ok) throw new Error('follow failed');
      const data = (await res.json().catch(() => null)) as { following?: boolean } | null;
      if (data && typeof data.following === 'boolean') {
        setIsFollowing(data.following);
      }
    } catch {
      // Roll back optimistic update on failure.
      setIsFollowing(!nextFollow);
      setFollowerCount((prev) => Math.max(0, (prev ?? 0) + (nextFollow ? -1 : 1)));
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-4 text-white">
        <div className="flex flex-col">
          <span className="text-lg font-bold leading-none">{followerCount ?? '—'}</span>
          <span className="text-[11px] uppercase tracking-wide text-white/55">Seguidores</span>
        </div>
        <div className="h-8 w-px bg-white/15" />
        <div className="flex flex-col">
          <span className="text-lg font-bold leading-none">{followingCount ?? '—'}</span>
          <span className="text-[11px] uppercase tracking-wide text-white/55">Seguindo</span>
        </div>
      </div>

      {canFollow && (
        <button
          type="button"
          onClick={toggleFollow}
          disabled={pending}
          className={`rounded-full px-4 py-1.5 text-sm font-semibold transition disabled:opacity-50 ${
            isFollowing
              ? 'border border-white/30 bg-white/5 text-white/80 hover:bg-white/10'
              : 'border border-fuchsia-300/70 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white hover:brightness-110'
          }`}
        >
          {pending ? '...' : isFollowing ? 'Deixar de seguir' : 'Seguir'}
        </button>
      )}
    </div>
  );
}
