'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { OutfitPiece, resolveBrandLogoUrlByName } from '@/app/lib/outfit-card';
import PieceCardModal from '@/app/components/outfit-card/PieceCardModal';

interface OutfitPieceCardProps {
  piece: OutfitPiece;
  compact?: boolean;
  schemeId?: string;
  /** @deprecated Use the built-in modal instead. Kept for callers not yet migrated. */
  onViewPieceCard?: () => void;
  onOpenInDressTester?: () => void;
}

function normalizeLabel(value?: string, fallback = 'Peca'): string {
  return (value?.trim() || fallback).replaceAll('_', ' ');
}

export default function OutfitPieceCard({
  piece,
  compact = false,
  onViewPieceCard,
  onOpenInDressTester,
}: OutfitPieceCardProps) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [launching, setLaunching] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState<number>(piece.likes ?? 0);
  const [shareStatus, setShareStatus] = useState('');

  const pieceName = piece.name?.trim() || 'Peca sem titulo';
  const brandName = piece.brand?.trim() || 'Fashion AI';
  const brandLogoUrl = piece.brandLogoUrl || resolveBrandLogoUrlByName(brandName) || undefined;
  const imageUrl = piece.imageUrl || brandLogoUrl;
  const categoryLabel = normalizeLabel(piece.category, 'Standard');
  const pieceTypeLabel = normalizeLabel(piece.pieceType, 'Peca');
  const statusLabel = piece.wardrobeItemId ? 'No guarda-roupa' : 'Referencia visual';
  const description =
    piece.description?.trim()
    || `${pieceTypeLabel} da marca ${brandName}, escolhida para compor a identidade visual do look.`;

  const handleToggleLike = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const nextLiked = !liked;
    setLiked(nextLiked);
    setLikes((prev) => Math.max(0, prev + (nextLiked ? 1 : -1)));
  }, [liked]);

  const handleExperiment = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (launching || !onOpenInDressTester) return;
    setLaunching(true);
    window.setTimeout(() => {
      setLaunching(false);
      onOpenInDressTester();
    }, 300);
  }, [launching, onOpenInDressTester]);

  const handleShare = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    const text = `${pieceName} - ${description}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: pieceName, text });
      } else {
        await navigator.clipboard.writeText(text);
        setShareStatus('Copiado');
        window.setTimeout(() => setShareStatus(''), 1600);
      }
    } catch {
      setShareStatus('Falhou');
      window.setTimeout(() => setShareStatus(''), 1600);
    }
  }, [description, pieceName]);

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
        className={`group relative overflow-hidden rounded-2xl border border-white/18 bg-black/18 transition duration-300 hover:-translate-y-0.5 hover:bg-black/24 ${compact ? 'p-3' : 'p-4'}`}
        style={{ boxShadow: '0 16px 34px rgba(2,6,23,0.22)' }}
      >
        <div className="pointer-events-none absolute inset-0 rounded-[inherit] border border-white/10" />

        <div className="relative z-[1] grid gap-3">
          <div className="flex items-start gap-3">
            <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/18 bg-white/10">
              {imageUrl ? (
                <Image src={imageUrl} alt={pieceName} fill className="object-contain p-1.5" unoptimized />
              ) : (
                <span className="text-xl font-black uppercase text-white/55">{pieceTypeLabel.slice(0, 1)}</span>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-base font-black leading-tight text-white">{pieceName}</p>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white/55">{pieceTypeLabel}</p>
                </div>
                <span className="shrink-0 rounded-full border border-white/20 bg-white/12 px-2 py-1 text-[9px] font-black uppercase tracking-[0.12em] text-white/72">
                  {categoryLabel}
                </span>
              </div>

              <div className="mt-3 flex items-center gap-2">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/20 bg-white/12">
                  {brandLogoUrl ? (
                    <Image src={brandLogoUrl} alt={`${brandName} logo`} width={24} height={24} className="h-6 w-6 object-contain" unoptimized />
                  ) : (
                    <span className="text-[10px] font-black uppercase text-white">{brandName.slice(0, 2)}</span>
                  )}
                </span>
                <span className="min-w-0 truncate text-sm font-bold text-white/84">{brandName}</span>
              </div>
            </div>
          </div>

          {!compact ? (
            <p className="line-clamp-3 text-sm leading-relaxed text-white/74">{description}</p>
          ) : null}

          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-cyan-200/20 bg-cyan-300/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-cyan-100">
              {statusLabel}
            </span>
            <span className="rounded-full border border-white/16 bg-white/8 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white/62">
              {pieceTypeLabel}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleToggleLike}
              className="rounded-xl border border-white/18 bg-white/12 px-3 py-2 text-xs font-black text-white transition hover:bg-white/18"
            >
              {liked ? 'Curtido' : 'Curtir'} {likes ? likes : ''}
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="rounded-xl border border-white/18 bg-white/12 px-3 py-2 text-xs font-black text-white transition hover:bg-white/18"
            >
              {shareStatus || 'Compartilhar'}
            </button>
            {onOpenInDressTester ? (
              <button
                type="button"
                onClick={handleExperiment}
                disabled={launching}
                className="rounded-xl border border-pink-300/35 bg-pink-500/18 px-3 py-2 text-xs font-black text-pink-50 transition hover:bg-pink-500/26 disabled:opacity-70"
              >
                {launching ? 'Abrindo...' : 'Experimentar'}
              </button>
            ) : null}
            <button
              type="button"
              onClick={handleRemix}
              className="rounded-xl border border-violet-200/25 bg-violet-500/20 px-3 py-2 text-xs font-black text-violet-50 transition hover:bg-violet-500/28"
            >
              Remixar
            </button>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setModalOpen(true);
              onViewPieceCard?.();
            }}
            className="w-full rounded-xl border border-white/18 bg-black/20 px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-white/86 transition hover:bg-black/28"
          >
            Visualizar card da peca
          </button>
        </div>
      </article>

      {modalOpen ? <PieceCardModal piece={piece} onClose={() => setModalOpen(false)} /> : null}
    </>
  );
}
