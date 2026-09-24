'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuraLevel, getNextAuraLevel, getAuraProgressPercent, buildAuraCardStyle } from '@/app/lib/aura-system';

export type FeedCardScheme = {
  scheme_id: string;
  title: string;
  style?: string;
  occasion?: string;
  cover_image_url?: string;
  user_id: string;
  author_name?: string;
  author_photo_url?: string;
  like_count?: number;
  comment_count?: number;
  remix_count?: number;
  is_liked_by_viewer?: boolean;
  is_saved_by_viewer?: boolean;
  remix_of?: string;
  remix_of_author?: string;
  createdAt?: string;
};

interface RunwayFeedCardProps {
  scheme: FeedCardScheme;
  viewerId?: string;
  viewerName?: string;
  viewerPhotoUrl?: string;
  mode?: 'magazine' | 'runway' | 'grid';
  style?: React.CSSProperties;
  className?: string;
}

export default function RunwayFeedCard({ scheme, viewerId, viewerName, viewerPhotoUrl, mode = 'magazine', style, className = '' }: RunwayFeedCardProps) {
  const router = useRouter();
  const [liked, setLiked] = useState(scheme.is_liked_by_viewer ?? false);
  const [likeCount, setLikeCount] = useState(scheme.like_count ?? 0);
  const [saved, setSaved] = useState(scheme.is_saved_by_viewer ?? false);
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [loadingLike, setLoadingLike] = useState(false);

  const auraLevel = getAuraLevel(likeCount);
  const nextLevel = getNextAuraLevel(likeCount);
  const progress = getAuraProgressPercent(likeCount);
  const auraStyle = buildAuraCardStyle(auraLevel);

  const handleLike = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!viewerId || loadingLike) return;
    setLoadingLike(true);
    const nextLiked = !liked;
    setLiked(nextLiked);
    setLikeCount((prev: number) => Math.max(0, prev + (nextLiked ? 1 : -1)));
    try {
      await fetch(`/api/outfit-likes/${scheme.scheme_id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: viewerId, liked: nextLiked }),
      });
    } catch {
      setLiked(!nextLiked);
      setLikeCount((prev: number) => Math.max(0, prev + (nextLiked ? -1 : 1)));
    } finally {
      setLoadingLike(false);
    }
  }, [liked, loadingLike, scheme.scheme_id, viewerId]);

  const handleSave = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!viewerId) return;
    const nextSaved = !saved;
    setSaved(nextSaved);
    await fetch('/api/outfit-favorites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: viewerId, schemeId: scheme.scheme_id, favorite: nextSaved }),
    }).catch(() => setSaved(!nextSaved));
  }, [saved, scheme.scheme_id, viewerId]);

  const handleRemix = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    window.sessionStorage.setItem('fai-remix-outfit', JSON.stringify({
      remix_of: scheme.scheme_id,
      remix_of_author: scheme.user_id,
      title: scheme.title,
      cover_image_url: scheme.cover_image_url,
    }));
    router.push('/create-my-scheme?mode=remix');
  }, [router, scheme]);

  const handleSendComment = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!viewerId || !commentText.trim()) return;
    await fetch(`/api/outfit-comments/${scheme.scheme_id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: viewerId,
        userName: viewerName,
        userPhotoUrl: viewerPhotoUrl,
        content: commentText.trim(),
      }),
    });
    setCommentText('');
    setShowComments(false);
  }, [viewerId, viewerName, viewerPhotoUrl, commentText, scheme.scheme_id]);

  const isGrid = mode === 'grid';
  const isRunway = mode === 'runway';

  return (
    <article
      className={`runway-card-enter relative overflow-hidden rounded-2xl bg-[#12121A] border border-white/[0.06] transition-transform duration-200 hover:scale-[1.01] cursor-pointer ${isRunway ? 'h-screen w-full snap-start' : ''} ${className}`}
      style={{ ...style, ...(auraLevel.id !== 'raw' ? auraStyle : {}) }}
      onClick={() => router.push(`/look/${scheme.scheme_id}`)}
    >
      {/* Cover image */}
      <div className={`relative w-full overflow-hidden bg-[#0d0d14] ${isGrid ? 'aspect-square' : 'aspect-[3/4]'}`}>
        {scheme.cover_image_url ? (
          <img
            src={scheme.cover_image_url}
            alt={scheme.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/20 text-4xl">✦</div>
        )}

        {/* Aura badge */}
        {auraLevel.id !== 'raw' && (
          <div
            className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-widest z-10"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', border: `1px solid ${auraLevel.badgeColor}55`, color: auraLevel.badgeColor }}
          >
            <span>{auraLevel.badge}</span>
            <span>{auraLevel.name}</span>
          </div>
        )}

        {/* Remix label */}
        {scheme.remix_of && (
          <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 text-[10px] text-white/70 z-10">
            🔁 Remix
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className={`p-3 ${isGrid ? 'p-2' : 'p-4'}`}>

        {/* Author row */}
        <div className="mb-2 flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-full bg-white/10 overflow-hidden flex-shrink-0">
              {scheme.author_photo_url ? (
                <img src={scheme.author_photo_url} alt={scheme.author_name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/40 text-xs">◉</div>
              )}
            </div>
            <div className="min-w-0">
              <span className="block truncate text-xs text-white/70">
                {scheme.author_name || 'Usuário'}
              </span>
            </div>
          </div>
        </div>

        {/* Title */}
        {!isGrid && (
          <h3 className="text-sm font-semibold text-white/90 truncate mb-1">{scheme.title}</h3>
        )}
        {!isGrid && (scheme.style || scheme.occasion) && (
          <p className="text-xs text-white/40 mb-3">
            {[scheme.style, scheme.occasion].filter(Boolean).join(' · ')}
          </p>
        )}

        {/* Aura progress bar */}
        {!isGrid && auraLevel.id !== 'legendary' && nextLevel && (
          <div className="mb-3">
            <div className="flex justify-between text-[10px] text-white/30 mb-1">
              <span>{likeCount} likes</span>
              <span>→ {nextLevel.name} em {nextLevel.minLikes - likeCount}</span>
            </div>
            <div className="h-0.5 w-full rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${auraLevel.badgeColor}, ${nextLevel.badgeColor})` }}
              />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Like */}
          <button
            onClick={handleLike}
            className={`flex items-center gap-1 text-xs transition-colors ${liked ? 'text-pink-400' : 'text-white/40 hover:text-white/70'}`}
            disabled={!viewerId}
            title={viewerId ? undefined : 'Faça login para curtir'}
          >
            <span className="text-sm">{liked ? '♥' : '♡'}</span>
            <span>{likeCount}</span>
          </button>

          {/* Comment toggle */}
          <button
            onClick={(e: { stopPropagation(): void }) => { e.stopPropagation(); setShowComments((v: boolean) => !v); }}
            className="flex items-center gap-1 text-xs text-white/40 hover:text-white/70 transition-colors"
          >
            <span className="text-sm">💬</span>
            <span>{scheme.comment_count ?? 0}</span>
          </button>

          {/* Remix */}
          <button
            onClick={handleRemix}
            className="flex items-center gap-1 text-xs text-white/40 hover:text-white/70 transition-colors"
          >
            <span className="text-sm">🔁</span>
            {!isGrid && <span>{scheme.remix_count ?? 0}</span>}
          </button>

          {/* Save */}
          <button
            onClick={handleSave}
            className={`ml-auto flex items-center gap-1 text-xs transition-colors ${saved ? 'text-amber-400' : 'text-white/40 hover:text-white/70'}`}
          >
            <span className="text-sm">{saved ? '◆' : '◇'}</span>
          </button>
        </div>

        {/* Inline comment form */}
        {showComments && viewerId && (
          <form onSubmit={handleSendComment} className="mt-3 flex gap-2" onClick={(e: { stopPropagation(): void }) => e.stopPropagation()}>
            <input
              type="text"
              value={commentText}
              onChange={(e: { target: { value: string } }) => setCommentText(e.target.value)}
              placeholder="Adicione um comentário..."
              maxLength={500}
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white/80 placeholder:text-white/30 outline-none focus:border-white/20"
            />
            <button
              type="submit"
              disabled={!commentText.trim()}
              className="px-3 py-1.5 rounded-lg bg-white/10 text-xs text-white/70 hover:bg-white/15 disabled:opacity-30 transition-colors"
            >
              ✓
            </button>
          </form>
        )}
      </div>
    </article>
  );
}
