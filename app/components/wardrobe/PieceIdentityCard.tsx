'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { getBest2DAssetForWardrobeItem } from '@/app/services/Tester2DAssetResolver';
import VisualToken from '@/app/components/outfit-card/VisualToken';
import { RARITY_TONE_MAP, PIECE_TYPE_TONE_MAP, resolveSemanticTone } from '@/app/lib/semantic-badge-tokens';

export interface PieceCardItem {
  wardrobe_item_id: string;
  name: string;
  brand: string;
  piece_type: string;
  color?: string;
  material?: string;
  style_tags?: string[];
  occasion_tags?: string[];
  is_favorite?: boolean;
  image_url: string;
  isolated_piece_image_url?: string | null;
  image_assets?: {
    raw_upload_image_url?: string | null;
    normalized_2d_preview_url?: string | null;
    approved_catalog_2d_url?: string | null;
  };
}

interface PieceStats {
  like_count: number;
  avg_rating: number;
  rating_count: number;
  owner_count: number;
  user_has_liked: boolean;
  user_rating: number | null;
}

interface PieceIdentityCardProps {
  item: PieceCardItem;
  userId?: string;
}

type PieceCategory = 'Standard' | 'Premium' | 'Limited Edition' | 'Rare';

const OCCASION_ICONS: Record<string, string> = {
  trabalho: '💼',
  casual: '👕',
  balada: '🎉',
  academia: '🏋️',
  evento: '✨',
};

const XP_THRESHOLDS: Record<PieceCategory, number> = {
  Standard: 5,
  Premium: 15,
  'Limited Edition': 30,
  Rare: 50,
};

const NEXT_TIER: Partial<Record<PieceCategory, PieceCategory>> = {
  Standard: 'Premium',
  Premium: 'Limited Edition',
  'Limited Edition': 'Rare',
};

function deriveCategory(wearCount: number, isFavorite: boolean, styleTags: string[]): PieceCategory {
  if (wearCount >= 30 || (isFavorite && wearCount >= 20 && styleTags.length >= 3)) return 'Rare';
  if (wearCount >= 15) return 'Limited Edition';
  if (wearCount >= 5 || (isFavorite && wearCount >= 3)) return 'Premium';
  return 'Standard';
}

function deriveAttributes(item: PieceCardItem, aiAffinity: number) {
  const versatility = Math.min(5, (item.occasion_tags?.length ?? 0));
  const stylePower = Math.min(5, (item.style_tags?.length ?? 0));
  const categoryMap: Record<PieceCategory, number> = { Standard: 1, Premium: 2, 'Limited Edition': 3, Rare: 4 };
  const presence = categoryMap[deriveCategory(0, item.is_favorite ?? false, item.style_tags ?? [])];
  const affinity = Math.round(Math.min(5, aiAffinity * 5));
  return { versatility, stylePower, presence, affinity };
}

function StatBar({ label, value, max = 5 }: { label: string; value: number; max?: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-[88px] shrink-0 font-mono text-[10px] uppercase tracking-[0.12em] text-neutral-400">{label}</span>
      <div className="flex flex-1 gap-[3px]">
        {Array.from({ length: max }).map((_, i) => (
          <div
            key={i}
            className={`h-[6px] flex-1 rounded-sm transition-all ${i < value ? 'bg-indigo-400' : 'bg-neutral-700'}`}
          />
        ))}
      </div>
      <span className="w-6 text-right font-mono text-[10px] text-neutral-400">{value}/{max}</span>
    </div>
  );
}

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(star)}
          className="text-base leading-none transition-transform hover:scale-125"
        >
          <span className={(hovered || value) >= star ? 'text-amber-400' : 'text-neutral-600'}>★</span>
        </button>
      ))}
    </div>
  );
}

const CATEGORY_BORDER_STYLE: Record<PieceCategory, string> = {
  Standard: 'border-slate-500/60',
  Premium: 'border-amber-500/70',
  'Limited Edition': 'border-purple-500/70',
  Rare: 'border-cyan-400/80',
};

const CATEGORY_GLOW: Record<PieceCategory, string> = {
  Standard: '',
  Premium: 'shadow-[0_0_28px_rgba(251,191,36,0.28)]',
  'Limited Edition': 'shadow-[0_0_28px_rgba(168,85,247,0.32)]',
  Rare: 'shadow-[0_0_32px_rgba(34,211,238,0.38)]',
};

const CATEGORY_LABEL_STYLE: Record<PieceCategory, string> = {
  Standard: 'text-slate-400 border-slate-600',
  Premium: 'text-amber-400 border-amber-700',
  'Limited Edition': 'text-purple-400 border-purple-700',
  Rare: 'text-cyan-400 border-cyan-700',
};

export default function PieceIdentityCard({ item, userId }: PieceIdentityCardProps) {
  const [stats, setStats] = useState<PieceStats>({
    like_count: 0,
    avg_rating: 0,
    rating_count: 0,
    owner_count: 1,
    user_has_liked: false,
    user_rating: null,
  });
  const [loadingStats, setLoadingStats] = useState(true);
  const [likeLoading, setLikeLoading] = useState(false);
  const [ratingLoading, setRatingLoading] = useState(false);

  const wearCount: number = 0; // TODO: wire to DailyLooks API when available
  const aiAffinity = 0.5; // TODO: wire to OutfitPreferences.piece_weights

  const category = deriveCategory(wearCount, item.is_favorite ?? false, item.style_tags ?? []);
  const attrs = deriveAttributes(item, aiAffinity);
  const nextTier = NEXT_TIER[category];
  const xpNeeded = XP_THRESHOLDS[category];
  const xpPct = nextTier ? Math.min(100, Math.round((wearCount / xpNeeded) * 100)) : 100;

  const image2d = getBest2DAssetForWardrobeItem(item);
  const pieceId = `SAI-${item.wardrobe_item_id.slice(-4).toUpperCase()}`;
  const rarityTone = resolveSemanticTone(category, RARITY_TONE_MAP);
  const pieceTypeTone = resolveSemanticTone(item.piece_type, PIECE_TYPE_TONE_MAP);

  useEffect(() => {
    const qs = userId ? `?userId=${encodeURIComponent(userId)}` : '';
    fetch(`/api/piece-stats/${item.wardrobe_item_id}${qs}`)
      .then((r) => r.json())
      .then((data: Partial<PieceStats> & { ok?: boolean }) => {
        if (data.ok) {
          setStats({
            like_count: data.like_count ?? 0,
            avg_rating: data.avg_rating ?? 0,
            rating_count: data.rating_count ?? 0,
            owner_count: data.owner_count ?? 1,
            user_has_liked: data.user_has_liked ?? false,
            user_rating: data.user_rating ?? null,
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoadingStats(false));
  }, [item.wardrobe_item_id, userId]);

  const handleToggleLike = useCallback(async () => {
    if (!userId || likeLoading) return;
    const newLiked = !stats.user_has_liked;
    setLikeLoading(true);
    setStats((prev: PieceStats) => ({
      ...prev,
      user_has_liked: newLiked,
      like_count: prev.like_count + (newLiked ? 1 : -1),
    }));
    try {
      await fetch(`/api/piece-likes/${item.wardrobe_item_id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, liked: newLiked }),
      });
    } catch {
      setStats((prev: PieceStats) => ({
        ...prev,
        user_has_liked: !newLiked,
        like_count: prev.like_count + (newLiked ? -1 : 1),
      }));
    } finally {
      setLikeLoading(false);
    }
  }, [userId, likeLoading, stats.user_has_liked, item.wardrobe_item_id]);

  const handleRate = useCallback(async (stars: number) => {
    if (!userId || ratingLoading) return;
    setRatingLoading(true);
    const prevRating = stats.user_rating;
    setStats((prev: PieceStats) => ({ ...prev, user_rating: stars }));
    try {
      const res = await fetch(`/api/piece-ratings/${item.wardrobe_item_id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, stars }),
      });
      const data = (await res.json()) as { avg_rating?: number; rating_count?: number };
      if (data.avg_rating !== undefined) {
        setStats((prev: PieceStats) => ({
          ...prev,
          avg_rating: data.avg_rating ?? prev.avg_rating,
          rating_count: data.rating_count ?? prev.rating_count,
        }));
      }
    } catch {
      setStats((prev: PieceStats) => ({ ...prev, user_rating: prevRating }));
    } finally {
      setRatingLoading(false);
    }
  }, [userId, ratingLoading, stats.user_rating, item.wardrobe_item_id]);

  const achievements: Array<{ icon: string; label: string }> = [];
  if (wearCount >= 10) achievements.push({ icon: '🏆', label: 'Veteran' });
  if (item.is_favorite) achievements.push({ icon: '⭐', label: 'Collection Star' });
  if ((item.occasion_tags?.length ?? 0) >= 3) achievements.push({ icon: '🎯', label: 'Versatile' });
  if (stats.user_has_liked) achievements.push({ icon: '❤️', label: 'Liked' });

  return (
    <div
      className={`relative mx-auto flex w-full max-w-[340px] flex-col overflow-hidden rounded-2xl border bg-neutral-950 ${CATEGORY_BORDER_STYLE[category]} ${CATEGORY_GLOW[category]}`}
      style={{ fontFamily: 'Inter, "Segoe UI", Arial, sans-serif' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-800 bg-neutral-900 px-4 py-2.5">
        <span
          className={`rounded border px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-widest ${CATEGORY_LABEL_STYLE[category]}`}
        >
          ▲ {category}
        </span>
        <span className="font-mono text-[9px] text-neutral-500 tracking-widest">{pieceId}</span>
        <span
          className="rounded border px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest"
          style={{ backgroundImage: pieceTypeTone.gradient, color: 'white', borderColor: 'rgba(255,255,255,0.2)' }}
        >
          ■ {item.piece_type}
        </span>
      </div>

      {/* Card art */}
      <div
        className={`relative mx-3 mt-3 overflow-hidden rounded-xl border ${CATEGORY_BORDER_STYLE[category]}`}
        style={{ aspectRatio: '3/4' }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: rarityTone.gradient,
            opacity: 0.18,
          }}
        />
        <Image
          src={image2d}
          alt={item.name}
          fill
          className="object-contain"
          unoptimized
        />
        {category === 'Rare' && (
          <div className="pointer-events-none absolute inset-0 rounded-xl" style={{ boxShadow: 'inset 0 0 24px rgba(34,211,238,0.18)' }} />
        )}
        {category === 'Limited Edition' && (
          <div className="pointer-events-none absolute inset-0 rounded-xl" style={{ boxShadow: 'inset 0 0 24px rgba(168,85,247,0.18)' }} />
        )}
      </div>

      {/* Name + meta */}
      <div className="border-b border-neutral-800 bg-neutral-900 px-4 py-3">
        <p className="truncate text-[15px] font-black leading-tight tracking-tight text-white">{item.name}</p>
        <p className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-neutral-500">
          {[item.brand, item.color, item.material].filter(Boolean).join(' · ')}
        </p>
      </div>

      {/* Attributes */}
      <div className="border-b border-neutral-800 px-4 py-3">
        <p className="mb-2 font-mono text-[9px] uppercase tracking-widest text-neutral-500">— Atributos —</p>
        <div className="space-y-1.5">
          <StatBar label="Versatility" value={attrs.versatility} />
          <StatBar label="Style Power" value={attrs.stylePower} />
          <StatBar label="Presence" value={attrs.presence} />
          <StatBar label="AI Affinity" value={attrs.affinity} />
        </div>
      </div>

      {/* Wearstyle abilities */}
      {(item.style_tags?.length ?? 0) > 0 && (
        <div className="border-b border-neutral-800 px-4 py-3">
          <p className="mb-2 font-mono text-[9px] uppercase tracking-widest text-neutral-500">— Abilities —</p>
          <div className="flex flex-wrap gap-1.5">
            {(item.style_tags ?? []).slice(0, 4).map((tag) => (
              <VisualToken key={tag} type="wearstyle" value={tag} compact />
            ))}
          </div>
        </div>
      )}

      {/* Occasion tags */}
      {(item.occasion_tags?.length ?? 0) > 0 && (
        <div className="border-b border-neutral-800 px-4 py-3">
          <p className="mb-2 font-mono text-[9px] uppercase tracking-widest text-neutral-500">— Ocasiões —</p>
          <div className="flex flex-wrap gap-1.5">
            {(item.occasion_tags ?? []).map((tag) => (
              <span
                key={tag}
                className="rounded border border-neutral-700 bg-neutral-800 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-neutral-300"
              >
                {OCCASION_ICONS[tag] ?? '📌'} {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* XP + Achievements */}
      <div className="border-b border-neutral-800 px-4 py-3">
        <div className="mb-2 flex items-center justify-between">
          <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-500">
            ⚡ {wearCount} {wearCount === 1 ? 'uso' : 'usos'}
          </span>
          {nextTier ? (
            <span className="font-mono text-[9px] text-neutral-600">
              {wearCount}/{xpNeeded} → {nextTier}
            </span>
          ) : (
            <span className="font-mono text-[9px] text-cyan-500">MAX TIER</span>
          )}
        </div>
        {/* XP bar */}
        <div className="h-[5px] w-full overflow-hidden rounded-full bg-neutral-800">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${xpPct}%`,
              backgroundImage: rarityTone.gradient,
            }}
          />
        </div>
        {achievements.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {achievements.map((a) => (
              <span
                key={a.label}
                className="rounded border border-neutral-700 bg-neutral-800/80 px-2 py-0.5 font-mono text-[9px] text-neutral-300"
              >
                {a.icon} {a.label}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Community stats */}
      <div className="border-b border-neutral-800 px-4 py-3">
        <p className="mb-2 font-mono text-[9px] uppercase tracking-widest text-neutral-500">— Community —</p>
        {loadingStats ? (
          <div className="h-8 animate-pulse rounded-lg bg-neutral-800" />
        ) : (
          <div className="space-y-3">
            {/* Stat row */}
            <div className="flex items-center gap-4 text-neutral-300">
              <div className="flex items-center gap-1.5">
                <span className="text-sm">👥</span>
                <span className="font-mono text-[11px] font-bold text-white">{stats.owner_count}</span>
                <span className="font-mono text-[9px] text-neutral-500">owners</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm">❤️</span>
                <span className="font-mono text-[11px] font-bold text-white">{stats.like_count}</span>
                <span className="font-mono text-[9px] text-neutral-500">curtidas</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm">⭐</span>
                <span className="font-mono text-[11px] font-bold text-white">
                  {stats.rating_count > 0 ? stats.avg_rating.toFixed(1) : '—'}
                </span>
                {stats.rating_count > 0 && (
                  <span className="font-mono text-[9px] text-neutral-500">({stats.rating_count})</span>
                )}
              </div>
            </div>

            {/* Interactive row */}
            {userId && (
              <div className="flex items-center gap-3">
                {/* Like button */}
                <button
                  type="button"
                  onClick={handleToggleLike}
                  disabled={likeLoading}
                  className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-wider transition-all ${
                    stats.user_has_liked
                      ? 'border-rose-500/60 bg-rose-950/40 text-rose-400'
                      : 'border-neutral-700 bg-neutral-800/60 text-neutral-400 hover:border-rose-600/50 hover:text-rose-400'
                  }`}
                >
                  {stats.user_has_liked ? '❤️ Curtido' : '♡ Curtir'}
                </button>

                {/* Star rating */}
                <div className="flex flex-col gap-0.5">
                  <StarRating
                    value={stats.user_rating ?? 0}
                    onChange={handleRate}
                  />
                  <span className="font-mono text-[8px] text-neutral-600">
                    {ratingLoading ? 'Salvando...' : stats.user_rating ? `Sua nota: ${stats.user_rating}★` : 'Avaliar'}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 text-center">
        <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-neutral-700">
          SAI · Piece Identity Card · {item.wardrobe_item_id.slice(-8).toUpperCase()}
        </p>
      </div>
    </div>
  );
}
