'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuraLevel, getNextAuraLevel, getAuraProgressPercent, buildAuraCardStyle } from '@/app/lib/aura-system';
import type { FeedCardScheme } from './RunwayFeedCard';

type Comment = {
  comment_id: string;
  user_id: string;
  user_name: string;
  user_photo_url: string;
  content: string;
  createdAt: string;
};

interface LookDetailViewProps {
  schemeId: string;
  viewerId?: string;
  viewerName?: string;
  viewerPhotoUrl?: string;
}

export default function LookDetailView({ schemeId, viewerId, viewerName, viewerPhotoUrl }: LookDetailViewProps) {
  const router = useRouter();
  const [scheme, setScheme] = useState<FeedCardScheme | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [remixCount, setRemixCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [saved, setSaved] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [loadingScheme, setLoadingScheme] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    Promise.all([
      fetch(`/api/schemes/${schemeId}`, { signal: controller.signal }),
      fetch(`/api/outfit-comments/${schemeId}`, { signal: controller.signal }),
      fetch(`/api/outfit-likes/${schemeId}?userId=${viewerId || ''}`, { signal: controller.signal }),
      fetch(`/api/remixes?originalSchemeId=${schemeId}`, { signal: controller.signal }),
    ]).then(async ([sRes, cRes, lRes, rRes]) => {
      if (!sRes.ok) return;

      const sData = await sRes.json() as Record<string, unknown>;
      const cData = cRes.ok ? (await cRes.json() as { comments?: Comment[] }) : { comments: [] };
      const lData = lRes.ok ? (await lRes.json() as { like_count?: number; user_liked?: boolean }) : {};
      const rData = rRes.ok ? (await rRes.json() as { count?: number }) : {};

      const mapped: FeedCardScheme = {
        scheme_id: schemeId,
        title: String(sData.title || ''),
        style: sData.style ? String(sData.style) : undefined,
        occasion: sData.occasion ? String(sData.occasion) : undefined,
        cover_image_url: sData.cover_image_url ? String(sData.cover_image_url) : undefined,
        user_id: String(sData.user_id || ''),
        author_name: sData.author_name ? String(sData.author_name) : undefined,
        author_photo_url: sData.author_photo_url ? String(sData.author_photo_url) : undefined,
        like_count: lData.like_count ?? 0,
        comment_count: cData.comments?.length ?? 0,
        remix_count: rData.count ?? 0,
        remix_of: sData.remix_of ? String(sData.remix_of) : undefined,
      };
      setScheme(mapped);
      setLikeCount(lData.like_count ?? 0);
      setLiked(lData.user_liked ?? false);
      setComments(cData.comments ?? []);
      setRemixCount(rData.count ?? 0);
    }).catch(() => null).finally(() => setLoadingScheme(false));

    return () => controller.abort();
  }, [schemeId, viewerId]);

  const handleLike = useCallback(async () => {
    if (!viewerId) return;
    const nextLiked = !liked;
    setLiked(nextLiked);
    setLikeCount((prev: number) => Math.max(0, prev + (nextLiked ? 1 : -1)));
    await fetch(`/api/outfit-likes/${schemeId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: viewerId, liked: nextLiked }),
    }).catch(() => {
      setLiked(!nextLiked);
      setLikeCount((prev: number) => Math.max(0, prev + (nextLiked ? -1 : 1)));
    });
  }, [liked, schemeId, viewerId]);

  const handleSendComment = useCallback(async (e: { preventDefault(): void }) => {
    e.preventDefault();
    if (!viewerId || !commentText.trim()) return;
    const res = await fetch(`/api/outfit-comments/${schemeId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: viewerId, userName: viewerName, userPhotoUrl: viewerPhotoUrl, content: commentText.trim() }),
    });
    if (res.ok) {
      const created = await res.json() as Comment;
      setComments((prev: Comment[]) => [...prev, created]);
      setCommentText('');
    }
  }, [viewerId, viewerName, viewerPhotoUrl, commentText, schemeId]);

  const handleRemix = useCallback(() => {
    if (!scheme) return;
    window.sessionStorage.setItem('fai-remix-outfit', JSON.stringify({
      remix_of: scheme.scheme_id,
      remix_of_author: scheme.user_id,
      title: scheme.title,
      cover_image_url: scheme.cover_image_url,
    }));
    router.push('/create-my-scheme?mode=remix');
  }, [router, scheme]);

  const handleSave = useCallback(async () => {
    if (!viewerId) return;
    const nextSaved = !saved;
    setSaved(nextSaved);
    await fetch('/api/outfit-favorites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: viewerId, schemeId, favorite: nextSaved }),
    }).catch(() => setSaved(!nextSaved));
  }, [saved, schemeId, viewerId]);

  if (loadingScheme) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border border-white/20 border-t-white/60 animate-spin" />
      </div>
    );
  }

  if (!scheme) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-8">
        <span className="text-4xl text-white/10">✦</span>
        <p className="text-sm text-white/30">Look não encontrado.</p>
        <button onClick={() => router.push('/feed')} className="text-xs text-white/40 hover:text-white/60 underline underline-offset-2">
          Voltar ao feed
        </button>
      </div>
    );
  }

  const auraLevel = getAuraLevel(likeCount);
  const nextLevel = getNextAuraLevel(likeCount);
  const progress = getAuraProgressPercent(likeCount);
  const auraCardStyle = buildAuraCardStyle(auraLevel);

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Back */}
      <div className="flex items-center gap-2 px-4 pt-4 pb-3 flex-shrink-0">
        <button onClick={() => router.back()} className="flex items-center gap-1 text-xs text-white/40 hover:text-white/70 transition-colors">
          ← Voltar
        </button>
      </div>

      {/* Cover */}
      <div
        className="relative mx-4 rounded-2xl overflow-hidden bg-[#12121A] border border-white/[0.06]"
        style={auraLevel.id !== 'raw' ? auraCardStyle : undefined}
      >
        {/* Aura badge */}
        {auraLevel.id !== 'raw' && (
          <div
            className="absolute top-3 right-3 z-10 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold tracking-widest"
            style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)', border: `1px solid ${auraLevel.badgeColor}55`, color: auraLevel.badgeColor }}
          >
            {auraLevel.badge} {auraLevel.name}
          </div>
        )}

        {scheme.cover_image_url ? (
          <img src={scheme.cover_image_url} alt={scheme.title} className="w-full aspect-[4/3] object-cover" />
        ) : (
          <div className="w-full aspect-[4/3] flex items-center justify-center text-white/10 text-5xl">✦</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-[#0A0A0F]/30 to-transparent" />

        {/* Info overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h1 className="text-xl font-bold text-white">{scheme.title}</h1>
          {(scheme.style || scheme.occasion) && (
            <p className="text-sm text-white/50 mt-0.5">{[scheme.style, scheme.occasion].filter(Boolean).join(' · ')}</p>
          )}
          <div className="flex items-center gap-2 mt-2">
            <div className="w-6 h-6 rounded-full bg-white/10 overflow-hidden">
              {scheme.author_photo_url
                ? <img src={scheme.author_photo_url} alt={scheme.author_name} className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center text-white/30 text-xs">◉</div>
              }
            </div>
            <span className="text-xs text-white/50">{scheme.author_name || 'Usuário'}</span>
          </div>
        </div>
      </div>

      {/* Aura Progress */}
      {auraLevel.id !== 'legendary' && nextLevel && (
        <div className="mx-4 mt-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
          <div className="flex justify-between text-[11px] text-white/40 mb-1.5">
            <span style={{ color: auraLevel.badgeColor }}>{auraLevel.badge} {auraLevel.name}</span>
            <span>{likeCount} · próximo: {nextLevel.name} em {nextLevel.minLikes - likeCount} likes</span>
          </div>
          <div className="h-1 w-full rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${auraLevel.badgeColor}, ${nextLevel.badgeColor})` }}
            />
          </div>
        </div>
      )}

      {/* Action bar */}
      <div className="flex items-center gap-4 px-4 py-4">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${liked ? 'text-pink-400' : 'text-white/40 hover:text-white/70'}`}
        >
          <span className="text-base">{liked ? '♥' : '♡'}</span>
          <span>{likeCount}</span>
        </button>
        <span className="flex items-center gap-1.5 text-sm text-white/40">
          <span className="text-base">💬</span>
          <span>{comments.length}</span>
        </span>
        <button
          onClick={handleRemix}
          className="flex items-center gap-1.5 text-sm text-white/40 hover:text-white/70 transition-colors"
        >
          <span className="text-base">🔁</span>
          <span>{remixCount}</span>
        </button>
        <button
          onClick={handleSave}
          className={`ml-auto flex items-center gap-1.5 text-sm transition-colors ${saved ? 'text-amber-400' : 'text-white/40 hover:text-white/70'}`}
        >
          <span className="text-base">{saved ? '◆' : '◇'}</span>
          <span className="text-xs">{saved ? 'Salvo' : 'Salvar'}</span>
        </button>
      </div>

      {/* Comments */}
      <div className="mx-4 mb-4 flex flex-col gap-3">
        <h2 className="text-xs font-semibold text-white/40 tracking-widest uppercase">Comentários ({comments.length})</h2>

        {comments.length === 0 ? (
          <p className="text-xs text-white/20 py-4 text-center">Seja o primeiro a comentar.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {comments.map((c: Comment) => (
              <div key={c.comment_id} className="flex gap-2">
                <div className="w-7 h-7 rounded-full bg-white/10 flex-shrink-0 overflow-hidden">
                  {c.user_photo_url
                    ? <img src={c.user_photo_url} alt={c.user_name} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-white/30 text-xs">◉</div>
                  }
                </div>
                <div className="flex-1 bg-white/[0.03] rounded-xl px-3 py-2">
                  <p className="text-[11px] font-semibold text-white/60 mb-0.5">{c.user_name}</p>
                  <p className="text-xs text-white/80">{c.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Comment input */}
        {viewerId && (
          <form onSubmit={handleSendComment} className="flex gap-2 mt-2">
            <div className="w-7 h-7 rounded-full bg-white/10 flex-shrink-0 overflow-hidden">
              {viewerPhotoUrl
                ? <img src={viewerPhotoUrl} alt={viewerName} className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center text-white/30 text-xs">◉</div>
              }
            </div>
            <input
              type="text"
              value={commentText}
              onChange={(e: { target: { value: string } }) => setCommentText(e.target.value)}
              placeholder="Adicione um comentário..."
              maxLength={500}
              className="flex-1 bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-xs text-white/80 placeholder:text-white/30 outline-none focus:border-white/20"
            />
            <button
              type="submit"
              disabled={!commentText.trim()}
              className="px-3 py-2 rounded-xl bg-white/10 text-xs text-white/70 hover:bg-white/15 disabled:opacity-30 transition-colors"
            >
              ✓
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
