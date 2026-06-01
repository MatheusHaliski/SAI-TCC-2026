'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import type { OutfitPiece } from '@/app/lib/outfit-card';
import { resolveBrandLogoUrlByName } from '@/app/lib/outfit-card';

interface PieceCardModalProps {
  piece: OutfitPiece;
  onClose: () => void;
}

type ActiveView = '2d' | 'card';

function normalizeLabel(value?: string, fallback = 'Peca'): string {
  return (value?.trim() || fallback).replaceAll('_', ' ');
}

export default function PieceCardModal({ piece, onClose }: PieceCardModalProps) {
  const router = useRouter();
  const [view, setView] = useState<ActiveView>('2d');
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(piece.likes ?? 0);
  const [shareStatus, setShareStatus] = useState('');

  const pieceName = piece.name?.trim() || 'Peca sem titulo';
  const brandName = piece.brand?.trim() || 'Fashion AI';
  const brandLogoUrl = piece.brandLogoUrl || resolveBrandLogoUrlByName(brandName) || undefined;
  const imageUrl = piece.imageUrl || brandLogoUrl;
  const pieceType = normalizeLabel(piece.pieceType, 'Peca');
  const category = normalizeLabel(piece.category, 'Standard');
  const occasion = piece.occasion ?? piece.wearstyles?.join(' / ') ?? 'Look autoral';
  const description =
    piece.description?.trim()
    || `${pieceType} da marca ${brandName}, organizada como expressao de identidade dentro do Fashion AI.`;

  const metadataItems = useMemo(() => [
    { label: 'Tipo', value: pieceType },
    { label: 'Marca', value: brandName },
    { label: 'Criacao', value: occasion },
    { label: 'Estado', value: piece.wardrobeItemId ? 'No guarda-roupa' : 'Referencia visual' },
  ], [brandName, occasion, piece.wardrobeItemId, pieceType]);

  const handleToggleLike = useCallback(() => {
    const nextLiked = !liked;
    setLiked(nextLiked);
    setLikes((prev) => Math.max(0, prev + (nextLiked ? 1 : -1)));
  }, [liked]);

  const handleShare = useCallback(async () => {
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

  const handleRemix = useCallback(() => {
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
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl overflow-hidden rounded-3xl border border-white/18 bg-[#101827] shadow-[0_32px_80px_rgba(0,0,0,0.6)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/45">Peca de roupa</p>
            <h3 className="mt-0.5 text-lg font-black text-white">{pieceName}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold text-white/80 transition hover:bg-white/15"
          >
            Fechar
          </button>
        </div>

        <div className="flex border-b border-white/10">
          {(['2d', 'card'] as ActiveView[]).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setView(tab)}
              className={`flex-1 py-3 text-xs font-black uppercase tracking-[0.16em] transition ${
                view === tab
                  ? 'border-b-2 border-violet-300 text-violet-200'
                  : 'text-white/50 hover:text-white/80'
              }`}
            >
              {tab === '2d' ? 'Visualizacao 2D' : 'Card da Peca'}
            </button>
          ))}
        </div>

        {view === '2d' ? (
          <div className="flex min-h-[420px] items-center justify-center p-5">
            <div className="relative flex h-[64vh] max-h-[620px] w-full items-center justify-center overflow-hidden rounded-3xl border border-white/12 bg-black/18">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={`${pieceName} visualizacao 2D`}
                  fill
                  className="object-contain p-4"
                  unoptimized
                />
              ) : (
                <div className="text-center">
                  <p className="text-3xl font-black uppercase text-white/28">{pieceType}</p>
                  <p className="mt-2 text-sm text-white/45">Previa 2D indisponivel</p>
                </div>
              )}
            </div>
          </div>
        ) : null}

        {view === 'card' ? (
          <div className="max-h-[76vh] overflow-y-auto p-5">
            <article
              className="mx-auto flex w-full max-w-[420px] flex-col overflow-hidden rounded-[28px] border border-white/18"
              style={{
                backgroundColor: 'var(--user-surface-solid, #1e293b)',
                backgroundImage: 'var(--liquid-glass-gradient)',
                boxShadow: '0 24px 56px rgba(0,0,0,0.32)',
              }}
            >
              <div className="p-4">
                <div className="relative h-[330px] overflow-hidden rounded-[24px] bg-black/12">
                  {imageUrl ? (
                    <Image src={imageUrl} alt={pieceName} fill className="object-contain p-3" unoptimized />
                  ) : null}
                  <span className="absolute left-3 top-3 rounded-full border border-white/20 bg-black/22 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-white/82">
                    {category}
                  </span>
                </div>
              </div>

              <div className="px-5 pb-4">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/25 bg-white/16">
                    {brandLogoUrl ? (
                      <Image src={brandLogoUrl} alt={`${brandName} logo`} width={32} height={32} className="h-7 w-7 object-contain" unoptimized />
                    ) : (
                      <span className="text-sm font-black uppercase text-white">{brandName.slice(0, 2)}</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-xl font-black leading-tight text-white">{pieceName}</p>
                    <p className="truncate text-xs font-bold uppercase tracking-[0.18em] text-white/58">{brandName}</p>
                  </div>
                </div>

                <p className="text-sm leading-relaxed text-white/82">{description}</p>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  {metadataItems.map((meta) => (
                    <div key={meta.label} className="rounded-2xl border border-white/16 bg-black/12 px-3 py-2">
                      <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/45">{meta.label}</p>
                      <p className="mt-1 truncate text-xs font-black capitalize text-white/86">{meta.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-auto grid grid-cols-3 gap-2 border-t border-white/16 p-3">
                <button
                  type="button"
                  onClick={handleToggleLike}
                  className="rounded-2xl border border-white/18 bg-white/12 px-2.5 py-2 text-xs font-bold text-white transition hover:bg-white/18"
                >
                  {liked ? 'Curtido' : 'Curtir'} {likes ? likes : ''}
                </button>
                <button
                  type="button"
                  onClick={handleShare}
                  className="rounded-2xl border border-white/18 bg-white/12 px-2.5 py-2 text-xs font-bold text-white transition hover:bg-white/18"
                >
                  {shareStatus || 'Compartilhar'}
                </button>
                <button
                  type="button"
                  onClick={handleRemix}
                  className="rounded-2xl border border-white/18 bg-white/12 px-2.5 py-2 text-xs font-bold text-white transition hover:bg-white/18"
                >
                  Remixar
                </button>
              </div>
            </article>
          </div>
        ) : null}
      </div>
    </div>
  );
}
