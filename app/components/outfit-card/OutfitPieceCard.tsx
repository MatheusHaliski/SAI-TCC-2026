'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { OutfitPiece, resolveBrandLogoUrlByName } from '@/app/lib/outfit-card';
import BrandBadge from '@/app/components/outfit-card/BrandBadge';
import TierChip from '@/app/components/outfit-card/badges/TierChip';
import LikesBadge from '@/app/components/outfit-card/badges/LikesBadge';
import QualityBadge from '@/app/components/outfit-card/badges/QualityBadge';
import PieceCardModal from '@/app/components/outfit-card/PieceCardModal';

interface OutfitPieceCardProps {
  piece: OutfitPiece;
  compact?: boolean;
  schemeId?: string;
  /** @deprecated Use the built-in modal instead. Kept for callers not yet migrated. */
  onViewPieceCard?: () => void;
  onOpenInDressTester?: () => void;
}

export default function OutfitPieceCard({
  piece,
  compact = false,
  onViewPieceCard,
  onOpenInDressTester,
}: OutfitPieceCardProps) {
  const router = useRouter();
  const [modalOpen,  setModalOpen]  = useState(false);
  const [launching,  setLaunching]  = useState(false);
  const [liked,      setLiked]      = useState(false);
  const [likes,      setLikes]      = useState<number>(piece.likes ?? 0);
  const [pending,    setPending]    = useState(false);

  const pieceName      = piece.name?.trim()  || 'Unnamed Piece';
  const brandName      = piece.brand?.trim() || 'Brand not specified';
  const brandLogoUrl   = piece.brandLogoUrl || resolveBrandLogoUrlByName(brandName) || undefined;
  const imageUrl       = piece.imageUrl || brandLogoUrl;
  const categoryLabel  = piece.category  ?? 'Standard';
  const pieceTypeLabel = piece.pieceType || 'Garment';
  const baseQuality    = (piece as { baseQuality?: number }).baseQuality ?? 3.0;
  const computed       = Math.min(5, baseQuality + likes * 0.01);
  const description    = piece.description?.trim()
    || `${pieceTypeLabel} da marca ${brandName}, escolhida para compor a identidade visual do look.`;

  const handleToggleLike = async () => {
    if (pending) return;
    setPending(true);
    const newLiked = !liked;
    setLiked(newLiked);
    setLikes((prev) => prev + (newLiked ? 1 : -1));
    setPending(false);
  };

  const handleExperiment = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (launching || !onOpenInDressTester) return;
    setLaunching(true);
    setTimeout(() => { setLaunching(false); onOpenInDressTester(); }, 400);
  };

  const handleRemix = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    window.sessionStorage.setItem('fai-remix-piece', JSON.stringify({
      wardrobeItemId: piece.wardrobeItemId,
      name: pieceName,
      brand: brandName,
      imageUrl,
      pieceType: piece.pieceType,
      description,
    }));
    router.push('/create-my-scheme');
  }, [brandName, description, imageUrl, piece.pieceType, piece.wardrobeItemId, pieceName, router]);

  return (
    <>
      <article
        className={`group relative min-w-0 max-w-full overflow-hidden rounded-2xl transition duration-300 hover:scale-[1.02] ${compact ? 'p-3.5' : 'p-4'}`}
        style={{
          border: '1px solid rgba(124,58,237,0.35)',
          background: 'linear-gradient(145deg, rgba(124,58,237,0.28) 0%, rgba(219,39,119,0.22) 52%, rgba(109,40,217,0.20) 100%)',
          backdropFilter: 'blur(14px)',
          boxShadow: '0 10px 30px rgba(2,6,23,0.36)',
        }}
      >
        {/* Inner glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background: 'radial-gradient(circle at 20% 18%, rgba(255,255,255,0.18) 0%, transparent 44%), linear-gradient(130deg, rgba(255,255,255,0.10) 0%, transparent 48%)',
            borderRadius: 'inherit',
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-[1px] rounded-2xl"
          style={{ border: '1px solid rgba(255,255,255,0.15)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2)' }}
        />

        {/* Launch flash */}
        {launching && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-[2] animate-ping rounded-2xl"
            style={{ background: 'rgba(219,39,119,0.2)', animationDuration: '0.35s', animationIterationCount: '1' }}
          />
        )}

        <div className="relative z-[1] space-y-3">
          {/* Header — name + tier */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 space-y-1">
              <p className="break-words text-sm font-semibold leading-snug text-white">{pieceName}</p>
              <p className="truncate font-mono text-[9px] uppercase tracking-[0.20em] text-white/55">
                {pieceTypeLabel}
              </p>
            </div>
            <TierChip tier={categoryLabel} />
          </div>

          {/* Remix flag — piece must be swapped for one the user owns */}
          {piece.needsReplacement && (
            <div
              className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-[10px] font-semibold uppercase tracking-wide"
              style={{ border: '1px solid rgba(251,191,36,0.45)', background: 'rgba(251,191,36,0.14)', color: '#fcd34d' }}
            >
              <span>↺</span>
              <span className="truncate">Substituir por peça sua</span>
            </div>
          )}

          {/* Brand */}
          <BrandBadge brandName={brandName} brandLogoUrl={brandLogoUrl} variant="compact" />

          {/* Community signal */}
          {!compact && (
            <div className="space-y-2 pt-1">
              <p className="font-mono text-[9px] uppercase tracking-[0.20em] text-white/50">
                Community Signal
                <span className="ml-2 text-white/35">
                  base {baseQuality.toFixed(1)}
                  {computed > baseQuality
                    ? ` · +${(computed - baseQuality).toFixed(1)} likes`
                    : ' · no boost yet'}
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
            </div>
          )}

          {/* Dress tester button */}
          {onOpenInDressTester && (
            <button
              type="button"
              onClick={handleExperiment}
              disabled={launching}
              className={`w-full rounded-xl py-2 text-[11px] font-semibold uppercase tracking-wide transition-all duration-300 ${
                launching
                  ? 'scale-95 border border-pink-300/50 bg-pink-500/25 text-pink-100'
                  : 'border border-pink-400/45 bg-pink-500/15 text-pink-100 hover:scale-[1.02] hover:border-pink-300/65 hover:bg-pink-500/28'
              }`}
            >
              {launching ? '✦ Abrindo Provador...' : '✦ Experimentar'}
            </button>
          )}

          {/* Remix button */}
          <button
            type="button"
            onClick={handleRemix}
            className="w-full rounded-xl border border-yellow-400/45 bg-yellow-500/12 py-2 text-[11px] font-semibold uppercase tracking-wide text-yellow-200 transition-all duration-300 hover:scale-[1.02] hover:border-yellow-300/65 hover:bg-yellow-500/22"
          >
            ↺ Remixar
          </button>

          {/* View piece card button */}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setModalOpen(true); onViewPieceCard?.(); }}
            className="w-full rounded-lg border px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wide transition"
            style={{
              borderColor: 'rgba(124,58,237,0.5)',
              background: 'rgba(124,58,237,0.15)',
              color: '#c4b5fd',
            }}
          >
            Visualizar card da peça
          </button>
        </div>
      </article>

      {modalOpen && (
        <PieceCardModal piece={piece} onClose={() => setModalOpen(false)} />
      )}
    </>
  );
}
