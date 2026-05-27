'use client';

import { useState, useTransition } from 'react';
import { OutfitPiece, resolveBrandLogoUrlByName } from '@/app/lib/outfit-card';
import { computeQualityStars } from '@/app/lib/pieces/quality';
import BrandBadge from '@/app/components/outfit-card/BrandBadge';
import TierChip from '@/app/components/outfit-card/badges/TierChip';
import LikesBadge from '@/app/components/outfit-card/badges/LikesBadge';
import QualityBadge from '@/app/components/outfit-card/badges/QualityBadge';
import QualityRail from '@/app/components/outfit-card/badges/QualityRail';
import { FILTER_GLOW_LINE, GLOW_LINE, TEXT_GLOW } from '@/app/lib/uiToken';

interface OutfitPieceCardProps {
  piece: OutfitPiece;
  compact?: boolean;
  /** Called when the user clicks "Visualizar card da peça". */
  onViewPieceCard?: () => void;
  /** schemeId needed to persist like toggles. Omit to run optimistic-only. */
  schemeId?: string;
}

export default function OutfitPieceCard({ piece, compact = false, onViewPieceCard, schemeId }: OutfitPieceCardProps) {
  const pieceName   = piece.name?.trim()  || 'Unnamed Piece';
  const brandName   = piece.brand?.trim() || 'Brand not specified';
  const brandLogoUrl = piece.brandLogoUrl || resolveBrandLogoUrlByName(brandName) || undefined;
  const tier        = piece.category ?? 'Standard';
  const pieceType   = piece.pieceType || 'Garment';
  const baseQuality = piece.baseQuality ?? 2.5;

  // Optimistic like state — initialised from Firestore snapshot on the piece.
  const [likes, setLikes]   = useState(piece.likes ?? 0);
  const [liked, setLiked]   = useState(false);
  const [pending, startToggle] = useTransition();

  const handleToggleLike = () => {
    const nextLiked = !liked;
    const nextLikes = Math.max(0, likes + (nextLiked ? 1 : -1));

    // Optimistic update first.
    setLiked(nextLiked);
    setLikes(nextLikes);

    if (!schemeId || !piece.id) return;

    startToggle(async () => {
      try {
        const { toggleLikePiece } = await import('@/app/lib/pieces/likes');
        // Requires auth — import lazily to avoid breaking SSR.
        const { getAuth } = await import('firebase/auth');
        const user = getAuth().currentUser;
        if (!user) return;
        await toggleLikePiece(schemeId, piece.id, user.uid);
      } catch {
        // Rollback on failure.
        setLiked(liked);
        setLikes(likes);
      }
    });
  };

  const computed = computeQualityStars(baseQuality, likes);

  return (
    <article
      className={`group relative overflow-hidden rounded-2xl border border-cyan-200/45 bg-[linear-gradient(145deg,rgba(59,130,246,0.34)_0%,rgba(20,184,166,0.3)_52%,rgba(6,182,212,0.26)_100%)] ${compact ? 'p-3' : 'p-4'} backdrop-blur-[14px] shadow-[0_10px_30px_rgba(2,6,23,0.36)] transition duration-300 hover:scale-[1.02] hover:border-cyan-100/70 hover:shadow-[0_16px_42px_rgba(34,211,238,0.24)] ${FILTER_GLOW_LINE} ${GLOW_LINE}`}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(255,255,255,0.28)_0%,rgba(255,255,255,0)_44%),linear-gradient(130deg,rgba(255,255,255,0.14)_0%,rgba(255,255,255,0)_48%,rgba(14,116,144,0.2)_100%)] opacity-90" />
      <div aria-hidden className="pointer-events-none absolute inset-[1px] rounded-2xl border border-cyan-100/35 shadow-[inset_0_1px_0_rgba(255,255,255,0.28),inset_0_0_38px_rgba(8,145,178,0.2)]" />

      <div className="relative z-[1] space-y-3">
        {/* Header row — name + tier */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 space-y-0.5">
            <p className={`truncate text-sm font-semibold ${TEXT_GLOW}`}>{pieceName}</p>
            <p className="font-mono text-[9px] uppercase tracking-[0.20em] text-white/55">{pieceType}</p>
          </div>
          <TierChip tier={tier} />
        </div>

        {/* Brand */}
        <BrandBadge brandName={brandName} brandLogoUrl={brandLogoUrl} variant="compact" />

        {/* Community signal section */}
        {!compact ? (
          <div className="space-y-2 pt-1">
            <p className="font-mono text-[9px] uppercase tracking-[0.20em] text-white/50">
              Community Signal
              <span className="ml-2 text-white/35">
                base {baseQuality.toFixed(1)} · {computed > baseQuality ? `+${(computed - baseQuality).toFixed(1)} likes` : 'no boost yet'}
              </span>
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <LikesBadge
                likes={likes}
                liked={liked}
                onToggle={handleToggleLike}
                disabled={pending}
              />
              <QualityBadge baseQuality={baseQuality} likes={likes} />
            </div>

            <div className="pb-3">
              <QualityRail baseQuality={baseQuality} likes={likes} />
            </div>
          </div>
        ) : null}

        {/* Action button */}
        {onViewPieceCard ? (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onViewPieceCard(); }}
            className="mt-1 w-full rounded-lg border border-cyan-300/50 bg-cyan-500/15 px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-cyan-100 transition hover:bg-cyan-500/30 hover:border-cyan-200/70"
          >
            Visualizar card da peça
          </button>
        ) : null}
      </div>
    </article>
  );
}
