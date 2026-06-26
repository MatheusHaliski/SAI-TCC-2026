'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getBest2DAssetForWardrobeItem } from '@/app/services/Tester2DAssetResolver';
import { resolveBrandLogoUrlByName } from '@/app/lib/outfit-card';

export interface PieceCardItem {
  wardrobe_item_id: string;
  name: string;
  brand: string;
  piece_type: string;
  color?: string;
  material?: string;
  size?: string;
  style_tags?: string[];
  occasion_tags?: string[];
  is_favorite?: boolean;
  image_url: string;
  isolated_piece_image_url?: string | null;
  description?: string | null;
  image_assets?: {
    raw_upload_image_url?: string | null;
    segmented_png_url?: string | null;
    normalized_2d_preview_url?: string | null;
    approved_catalog_2d_url?: string | null;
  };
}

interface PieceStats {
  like_count: number;
  user_has_liked: boolean;
}

interface PieceIdentityCardProps {
  item: PieceCardItem;
  userId?: string;
}

function buildPersonalDescription(item: PieceCardItem): string {
  const explicit = item.description?.trim();
  if (explicit) return explicit;

  const style = item.style_tags?.[0]?.trim();
  const occasion = item.occasion_tags?.[0]?.trim();
  const material = item.material && item.material !== 'unspecified' ? item.material : '';
  const color = item.color && item.color !== 'unspecified' ? item.color : '';
  const details = [color, material, style, occasion].filter(Boolean);

  if (details.length) {
    return `Expressão pessoal em ${details.join(', ')}, criada para traduzir identidade e intenção no guarda-roupa digital.`;
  }

  return 'Uma peça escolhida como assinatura visual: simples, reconhecível e pronta para representar estilo próprio no Fashion AI.';
}

function resolvePieceImage(item: PieceCardItem): string {
  return (
    item.isolated_piece_image_url?.trim()
    || getBest2DAssetForWardrobeItem(item)
    || item.image_url
    || '/welcome-newcomers.png'
  );
}

export default function PieceIdentityCard({ item, userId }: PieceIdentityCardProps) {
  const router = useRouter();
  const [stats, setStats] = useState<PieceStats>({ like_count: 0, user_has_liked: false });
  const [likeLoading, setLikeLoading] = useState(false);
  const [shareStatus, setShareStatus] = useState('');

  const imageUrl = resolvePieceImage(item);
  const brandLogoUrl = resolveBrandLogoUrlByName(item.brand);
  const personalDescription = useMemo(() => buildPersonalDescription(item), [item]);
  const brandLabel = item.brand?.trim() && item.brand !== 'Default brand' ? item.brand : 'Fashion AI';
  const categoryLabel = item.piece_type?.replaceAll('_', ' ') || 'Peca';
  const metadataItems = useMemo(() => {
    const type = item.piece_type?.replaceAll('_', ' ') || 'Peca';
    const creation = item.style_tags?.[0]?.trim() || item.occasion_tags?.[0]?.trim() || 'Autoral';
    const attributes = [item.color, item.material]
      .filter((value) => value && value !== 'unspecified')
      .join(' / ') || 'Essencial';
    const ability = item.occasion_tags?.[0]?.trim() || item.style_tags?.[1]?.trim() || 'Identidade';
    const size = item.size && item.size !== 'unspecified' ? item.size : 'Não informado';

    return [
      { label: 'Tipo', value: type },
      { label: 'Criacao', value: creation },
      { label: 'Atributos', value: attributes },
      { label: 'Tamanho', value: size },
      { label: 'Expressao', value: ability },
    ];
  }, [item.color, item.material, item.size, item.occasion_tags, item.piece_type, item.style_tags]);

  useEffect(() => {
    const qs = userId ? `?userId=${encodeURIComponent(userId)}` : '';
    fetch(`/api/piece-stats/${item.wardrobe_item_id}${qs}`)
      .then((r) => r.json())
      .then((data: Partial<PieceStats> & { ok?: boolean }) => {
        if (!data.ok) return;
        setStats({
          like_count: data.like_count ?? 0,
          user_has_liked: data.user_has_liked ?? false,
        });
      })
      .catch(() => {});
  }, [item.wardrobe_item_id, userId]);

  const handleToggleLike = useCallback(async () => {
    if (!userId || likeLoading) return;
    const nextLiked = !stats.user_has_liked;
    setLikeLoading(true);
    setStats((prev) => ({
      user_has_liked: nextLiked,
      like_count: Math.max(0, prev.like_count + (nextLiked ? 1 : -1)),
    }));

    try {
      await fetch(`/api/piece-likes/${item.wardrobe_item_id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, liked: nextLiked }),
      });
    } catch {
      setStats((prev) => ({
        user_has_liked: !nextLiked,
        like_count: Math.max(0, prev.like_count + (nextLiked ? -1 : 1)),
      }));
    } finally {
      setLikeLoading(false);
    }
  }, [item.wardrobe_item_id, likeLoading, stats.user_has_liked, userId]);

  const handleShare = useCallback(async () => {
    const text = `${item.name} — ${personalDescription}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: item.name, text });
      } else {
        await navigator.clipboard.writeText(text);
        setShareStatus('Texto copiado.');
        window.setTimeout(() => setShareStatus(''), 1800);
      }
    } catch {
      setShareStatus('Não foi possível compartilhar.');
      window.setTimeout(() => setShareStatus(''), 1800);
    }
  }, [item.name, personalDescription]);

  const handleRemix = useCallback(() => {
    window.sessionStorage.setItem('fai-remix-piece', JSON.stringify({
      wardrobeItemId: item.wardrobe_item_id,
      name: item.name,
      brand: item.brand,
      imageUrl,
      description: personalDescription,
    }));
    router.push('/create-my-scheme');
  }, [imageUrl, item.brand, item.name, item.wardrobe_item_id, personalDescription, router]);

  return (
    <article
      className="relative mx-auto flex w-full max-w-[440px] flex-col overflow-hidden rounded-[28px] border border-white/18"
      style={{
        backgroundColor: 'var(--piece-scheme-surface, #1e293b)',
        backgroundImage: 'var(--piece-scheme-gradient)',
        boxShadow: '0 24px 56px rgba(0,0,0,0.32)',
        fontFamily: 'Inter, "Segoe UI", Arial, sans-serif',
      }}
    >
      <div className="p-4">
        <div className="relative flex h-[330px] items-center justify-center overflow-hidden rounded-[24px] bg-black/12">
          <Image
            src={imageUrl}
            alt={item.name}
            fill
            className="object-contain p-3"
            unoptimized
          />
          <span className="absolute left-3 top-3 rounded-full border border-white/20 bg-black/22 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-white/82">
            {categoryLabel}
          </span>
        </div>
      </div>

      <div className="px-5 pb-4">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/25 bg-white/16">
            {brandLogoUrl ? (
              <Image src={brandLogoUrl} alt={`${brandLabel} logo`} width={32} height={32} className="h-7 w-7 object-contain" unoptimized />
            ) : (
              <span className="text-sm font-black uppercase text-white">{brandLabel.slice(0, 2)}</span>
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate text-xl font-black leading-tight text-white">{item.name}</p>
            <p className="truncate text-xs font-bold uppercase tracking-[0.18em] text-white/58">{brandLabel}</p>
          </div>
        </div>

        <p className="text-sm leading-relaxed text-white/82">{personalDescription}</p>

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
          disabled={!userId || likeLoading}
          className="rounded-2xl border border-white/18 bg-white/12 px-2.5 py-2 text-xs font-bold text-white transition hover:bg-white/18 disabled:opacity-50"
        >
          {stats.user_has_liked ? 'Curtido' : 'Curtir'} {stats.like_count ? stats.like_count : ''}
        </button>
        <button
          type="button"
          onClick={handleShare}
          className="rounded-2xl border border-white/18 bg-white/12 px-2.5 py-2 text-xs font-bold text-white transition hover:bg-white/18"
        >
          Compartilhar
        </button>
        <button
          type="button"
          onClick={handleRemix}
          className="rounded-2xl border border-white/18 bg-white/12 px-2.5 py-2 text-xs font-bold text-white transition hover:bg-white/18"
        >
          Remixar
        </button>
      </div>
      {shareStatus ? <p className="px-4 pb-3 text-center text-xs text-white/70">{shareStatus}</p> : null}
    </article>
  );
}
