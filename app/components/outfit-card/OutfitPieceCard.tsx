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
    setLikes(nextLikes);

    if (!schemeId || !piece.id) return;

    startToggle(async () => {
      try {
        const { toggleLikePiece } = await import('@/app/lib/pieces/likes');
        // Requires auth — import lazily to avoid breaking SSR.
        const { getAuth } = await import('firebase/auth');
        const user = getAuth().currentUser;
        if (!user) return;
        const result = await toggleLikePiece(schemeId, piece.id, user.uid);
        // Reconcile with the authoritative Firestore result (handles the case
        // where the user already liked this piece in a previous session).
        setLiked(result.liked);
        setLikes(result.likes);
      } catch {
        // Rollback on failure.
        setLiked(liked);
        setLikes(likes);
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
        className={`group relative min-w-0 max-w-full overflow-hidden rounded-2xl transition duration-300 hover:scale-[1.02] ${compact ? 'p-3' : 'p-4'}`}
        style={{
          border: '1px solid rgba(124,58,237,0.35)',
          background: 'linear-gradient(145deg, rgba(124,58,237,0.28) 0%, rgba(219,39,119,0.22) 52%, rgba(109,40,217,0.20) 100%)',
          backdropFilter: 'blur(14px)',
          boxShadow: '0 10px 30px rgba(2,6,23,0.36)',
        }}
      >
        <div className="pointer-events-none absolute inset-0 rounded-[inherit] border border-white/10" />

        <div className="relative z-[1] space-y-3">
          {/* Header — name + tier */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 space-y-0.5">
              <p className="truncate text-sm font-semibold text-white">{pieceName}</p>
              <p className="truncate font-mono text-[9px] uppercase tracking-[0.20em] text-white/55">
                {pieceTypeLabel}
              </p>
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
        ) : null}

        {/* Action button */}
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); setModalOpen(true); }}
          className="mt-1 w-full rounded-lg border border-cyan-300/50 bg-cyan-500/15 px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-cyan-100 transition hover:bg-cyan-500/30 hover:border-cyan-200/70"
        >
          Visualizar card da peça
        </button>
      </div>

      {modalOpen ? (
        <PieceCardModal piece={piece} onClose={() => setModalOpen(false)} />
      ) : null}
    </article>
  );
}
