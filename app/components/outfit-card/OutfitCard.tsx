'use client';

import { useMemo } from 'react';
import OutfitHeroImage from '@/app/components/outfit-card/OutfitHeroImage';
import OutfitHeader from '@/app/components/outfit-card/OutfitHeader';
import OutfitPieceList from '@/app/components/outfit-card/OutfitPieceList';
import CompactCardActionBar from '@/app/components/profile/CompactCardActionBar';
import {
  OutfitCardData,
  buildBackgroundCssStyle,
  buildOutfitDescriptionFallback,
  resolveBrandLogoUrlByName,
  resolveOutfitBackgroundForRender,
} from '@/app/lib/outfit-card';
import { buildFabricScopeStyle, renderFabricTextureToCanvas } from '@/app/lib/fabricTextureRenderer';
import { buildFabricPresetConfig } from '@/app/lib/materialPresets';
import { getAuraLevel, buildAuraCardStyle, buildAuraBackgroundOverride } from '@/app/lib/aura-system';

interface GeneratedOutfitCardProps {
  data: OutfitCardData;
  variant?: 'default' | 'compact';
  actions?: Array<{
    label: string;
    onClick?: () => void;
    tone?: 'default' | 'danger' | 'accent';
  }>;
  onOpenInDressTester?: (wardrobeItemId: string) => void;
  onOpenOutfitInDressTester?: () => void;
}

export default function OutfitCard({ data, variant = 'default', actions = [], onOpenInDressTester, onOpenOutfitInDressTester }: GeneratedOutfitCardProps) {
  const description =
    data.outfitDescription === undefined
      ? buildOutfitDescriptionFallback({ pieces: data.pieces, outfitStyleLine: data.outfitStyleLine })
      : data.outfitDescription?.trim() || undefined;

  const isDynamicBg = Boolean(data.outfitBackground && 'dynamicBackground' in data.outfitBackground && (data.outfitBackground as { dynamicBackground?: boolean }).dynamicBackground);
  const auraLevel = isDynamicBg ? getAuraLevel(data.likes ?? 0) : null;
  const auraBackgroundOverride = auraLevel ? buildAuraBackgroundOverride(auraLevel) : null;
  const resolvedBackground = resolveOutfitBackgroundForRender(auraBackgroundOverride ?? data.outfitBackground);
  const backgroundStyle = buildBackgroundCssStyle(resolvedBackground);
  const auraCardStyle = auraLevel ? buildAuraCardStyle(auraLevel) : {};
  const materialLayer = resolvedBackground.materialLayer;
  const decorativeLayer = resolvedBackground.decorativeOverlayLayer;

  const materialRender = useMemo(() => {
    if (!materialLayer || materialLayer.type === 'none') return { textureDataUrl: null, decorativeDataUrl: null };
    return renderFabricTextureToCanvas({
      width: variant === 'compact' ? 540 : 820,
      height: variant === 'compact' ? 700 : 980,
      color: materialLayer.color || resolvedBackground.solid_color || resolvedBackground.gradient?.stops?.[0]?.color || '#374151',
      material: buildFabricPresetConfig(
        materialLayer.color || resolvedBackground.solid_color || '#334155',
        {
          type: materialLayer.type,
          density: materialLayer.density,
          threadDirection: materialLayer.threadDirection,
          threadThickness: materialLayer.threadThickness,
          embossIntensity: materialLayer.embossIntensity,
          surfaceContrast: materialLayer.surfaceContrast,
          finish: materialLayer.finish,
          scope: materialLayer.scope,
          stitchBorder: decorativeLayer?.stitchBorder,
          stitchColor: decorativeLayer?.stitchColor,
        },
      ),
    });
  }, [decorativeLayer?.stitchBorder, decorativeLayer?.stitchColor, materialLayer, resolvedBackground.gradient?.stops, resolvedBackground.solid_color, variant]);

  const brandBadges = data.pieces
    .map((piece) => ({
      name: piece.brand,
      logoUrl: piece.brandLogoUrl || resolveBrandLogoUrlByName(piece.brand) || undefined,
    }))
    .filter((brand) => Boolean(brand.name?.trim()))
    .filter((brand, index, arr) => arr.findIndex((item) => item.name.toLowerCase() === brand.name.toLowerCase()) === index)
    .slice(0, 4);

  const currentShape = resolvedBackground.shape ?? 'none';
  const shapeSvg = (svg: string) => `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
  const shapeOverlayStyle =
    currentShape === 'none' ? null
    : currentShape === 'orb' ? {
        backgroundImage: 'radial-gradient(circle at 78% 14%, rgba(129,140,248,0.58), transparent 32%), radial-gradient(circle at 18% 80%, rgba(56,189,248,0.48), transparent 34%), radial-gradient(circle at 52% 48%, rgba(244,114,182,0.22), transparent 42%), radial-gradient(circle at 88% 72%, rgba(167,139,250,0.34), transparent 28%), radial-gradient(circle at 12% 22%, rgba(34,211,238,0.30), transparent 30%)',
      }
    : currentShape === 'diamond' ? {
        backgroundImage: shapeSvg("<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80'><line x1='0' y1='40' x2='40' y2='0' stroke='rgba(15,23,42,0.18)' stroke-width='1'/><line x1='40' y1='0' x2='80' y2='40' stroke='rgba(15,23,42,0.18)' stroke-width='1'/><line x1='80' y1='40' x2='40' y2='80' stroke='rgba(15,23,42,0.18)' stroke-width='1'/><line x1='40' y1='80' x2='0' y2='40' stroke='rgba(15,23,42,0.18)' stroke-width='1'/><polygon points='40,0 80,40 40,80 0,40' fill='none' stroke='rgba(15,23,42,0.20)' stroke-width='1.5'/><polygon points='40,10 68,40 40,70 12,40' fill='rgba(15,23,42,0.46)'/><polygon points='40,10 68,40 40,70 12,40' fill='none' stroke='rgba(255,255,255,0.13)' stroke-width='1'/><polygon points='40,22 56,40 40,58 24,40' fill='rgba(15,23,42,0.30)' stroke='rgba(255,255,255,0.10)' stroke-width='0.8'/><polygon points='40,32 47,40 40,48 33,40' fill='rgba(15,23,42,0.62)'/><circle cx='40' cy='40' r='2.5' fill='rgba(255,255,255,0.18)'/></svg>"),
        backgroundSize: '40px 40px',
      }
    : currentShape === 'mesh' ? {
        backgroundImage: shapeSvg("<svg xmlns='http://www.w3.org/2000/svg' width='96' height='96'><line x1='0' y1='0' x2='96' y2='96' stroke='rgba(255,255,255,0.11)' stroke-width='0.8'/><line x1='96' y1='0' x2='0' y2='96' stroke='rgba(255,255,255,0.11)' stroke-width='0.8'/><line x1='0' y1='48' x2='96' y2='48' stroke='rgba(255,255,255,0.20)' stroke-width='1.3'/><line x1='48' y1='0' x2='48' y2='96' stroke='rgba(255,255,255,0.20)' stroke-width='1.3'/><circle cx='48' cy='48' r='4.5' fill='rgba(255,255,255,0.24)'/></svg>"),
        backgroundSize: '48px 48px',
      }
    : currentShape === 'stars' ? {
        backgroundImage: shapeSvg("<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80'><polygon points='40,6 48,29 72,30 53,44 60,68 40,54 20,68 27,44 8,30 32,29' fill='rgba(15,23,42,0.56)'/><polygon points='40,6 48,29 72,30 53,44 60,68 40,54 20,68 27,44 8,30 32,29' fill='none' stroke='rgba(255,255,255,0.14)' stroke-width='1'/><circle cx='40' cy='40' r='3.5' fill='rgba(255,255,255,0.22)'/></svg>"),
        backgroundSize: '40px 40px',
      }
    : currentShape === 'circles' ? {
        backgroundImage: shapeSvg("<svg xmlns='http://www.w3.org/2000/svg' width='96' height='96'><circle cx='48' cy='48' r='44' fill='none' stroke='rgba(2,6,23,0.16)' stroke-width='1'/><circle cx='48' cy='48' r='36' fill='none' stroke='rgba(2,6,23,0.26)' stroke-width='1.5'/><circle cx='48' cy='48' r='26' fill='none' stroke='rgba(2,6,23,0.36)' stroke-width='1.6'/><circle cx='48' cy='48' r='16' fill='none' stroke='rgba(2,6,23,0.44)' stroke-width='1.8'/><circle cx='48' cy='48' r='8' fill='rgba(2,6,23,0.54)'/></svg>"),
        backgroundSize: '48px 48px',
      }
    : currentShape === 'triangles' ? {
        backgroundImage: shapeSvg("<svg xmlns='http://www.w3.org/2000/svg' width='96' height='84'><polygon points='48,4 92,80 4,80' fill='rgba(2,6,23,0.48)'/><polygon points='48,4 92,80 4,80' fill='none' stroke='rgba(255,255,255,0.14)' stroke-width='1.2'/><circle cx='48' cy='56' r='3.5' fill='rgba(255,255,255,0.18)'/></svg>"),
        backgroundSize: '48px 42px',
      }
    : currentShape === 'waves' ? {
        backgroundImage: shapeSvg("<svg xmlns='http://www.w3.org/2000/svg' width='240' height='120'><path d='M0,60 C20,32 60,32 80,60 C100,88 140,88 160,60 C180,32 220,32 240,60' stroke='rgba(2,6,23,0.48)' stroke-width='3.5' fill='none'/><path d='M0,60 C20,88 60,88 80,60 C100,32 140,32 160,60 C180,88 220,88 240,60' stroke='rgba(2,6,23,0.40)' stroke-width='3.0' fill='none'/></svg>"),
        backgroundSize: '120px 60px',
      }
    : currentShape === 'beams' ? {
        backgroundImage: 'repeating-linear-gradient(112deg, rgba(255,255,255,0.22) 0 3px, transparent 3px 14px, rgba(255,255,255,0.14) 14px 22px, transparent 22px 34px, rgba(255,255,255,0.09) 34px 38px, transparent 38px 60px),linear-gradient(112deg, rgba(2,6,23,0.42) 0%, rgba(2,6,23,0) 52%),linear-gradient(292deg, rgba(2,6,23,0.24) 0%, rgba(2,6,23,0) 50%)',
        backgroundSize: '100% 100%,100% 100%,100% 100%',
      }
    : currentShape === 'flowers' ? {
        backgroundImage: shapeSvg("<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><path d='M80,80 C66,62 62,44 80,32 C98,44 94,62 80,80' fill='rgba(17,24,39,0.50)'/><path d='M80,80 C66,62 62,44 80,32 C98,44 94,62 80,80' fill='rgba(17,24,39,0.50)' transform='rotate(90,80,80)'/><path d='M80,80 C66,62 62,44 80,32 C98,44 94,62 80,80' fill='rgba(17,24,39,0.50)' transform='rotate(180,80,80)'/><path d='M80,80 C66,62 62,44 80,32 C98,44 94,62 80,80' fill='rgba(17,24,39,0.50)' transform='rotate(270,80,80)'/><circle cx='80' cy='80' r='10' fill='rgba(17,24,39,0.88)'/><circle cx='80' cy='80' r='3.5' fill='rgba(251,191,36,0.52)'/></svg>"),
        backgroundSize: '80px 80px',
      }
    : currentShape === 'arrows' ? {
        backgroundImage: shapeSvg("<svg xmlns='http://www.w3.org/2000/svg' width='160' height='96'><path d='M0,48 L40,0 L80,48 L120,0 L160,48' stroke='rgba(2,6,23,0.44)' stroke-width='3.5' fill='none' stroke-linejoin='miter'/><path d='M0,48 L40,96 L80,48 L120,96 L160,48' stroke='rgba(2,6,23,0.40)' stroke-width='3.5' fill='none' stroke-linejoin='miter'/></svg>"),
        backgroundSize: '80px 48px',
      }
    : null;

  return (
    <section
      className={`relative overflow-hidden rounded-2xl border border-white/15 shadow-[0_8px_24px_rgba(15,23,42,0.18)] ${variant === 'compact' ? 'space-y-2 p-2.5' : 'space-y-3 p-3 sm:p-4'}`}
      style={{ ...backgroundStyle, ...auraCardStyle }}
    >
      {/* Aura badge */}
      {auraLevel && auraLevel.id !== 'raw' ? (
        <div
          aria-label={`Aura level: ${auraLevel.name}`}
          className="pointer-events-none absolute right-2 top-2 z-10 flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-mono font-semibold uppercase tracking-widest"
          style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)', border: `1px solid ${auraLevel.badgeColor}44`, color: auraLevel.badgeColor }}
        >
          <span>{auraLevel.badge}</span>
          <span>{auraLevel.name}</span>
        </div>
      ) : null}

      {/* Fabric texture */}
      {materialRender.textureDataUrl ? (
        <div
          aria-hidden
          className="pointer-events-none absolute z-0 rounded-[inherit]"
          style={{ ...buildFabricScopeStyle(materialLayer?.scope || 'card'), backgroundImage: `url(${materialRender.textureDataUrl})`, backgroundSize: 'cover', opacity: 0.38 }}
        />
      ) : null}

      {/* Shape overlay */}
      {shapeOverlayStyle ? (
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-95" style={shapeOverlayStyle} />
      ) : null}

      {/* Decorative overlay */}
      {materialRender.decorativeDataUrl ? (
        <div
          aria-hidden
          className="pointer-events-none absolute z-0 rounded-[inherit]"
          style={{ ...buildFabricScopeStyle(materialLayer?.scope || 'card'), backgroundImage: `url(${materialRender.decorativeDataUrl})`, backgroundSize: 'cover', opacity: decorativeLayer?.opacity ?? 0.72 }}
        />
      ) : null}

      {/* Content */}
      <div className={`relative z-[1] ${variant === 'compact' ? 'space-y-3' : 'space-y-4'}`}>
        <OutfitHeroImage
          src={data.heroImageUrl}
          alt={`${data.outfitName} hero preview`}
          className={variant === 'compact' ? 'h-24 rounded-xl' : 'h-44 rounded-xl'}
        />
        <OutfitHeader
          outfitName={data.outfitName}
          outfitStyleLine={data.outfitStyleLine}
          description={description}
          badges={data.metaBadges}
          compact={variant === 'compact'}
          brandBadges={brandBadges}
          titleFontFamily={data.titleFontFamily}
          creatorName={data.creatorName}
          ratingStars={data.ratingStars}
          ownersCount={data.ownersCount}
          outfitLikes={data.outfitLikes}
          occasion={data.occasion}
        />

        {/* ── OutfitPieceList — single instance, no onViewPieceCard ── */}
        <OutfitPieceList
          pieces={data.pieces}
          compact={variant === 'compact'}
          schemeId={data.schemeId}
          onOpenInDressTester={onOpenInDressTester}
        />

        {onOpenOutfitInDressTester && variant !== 'compact' ? (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onOpenOutfitInDressTester(); }}
            className="w-full rounded-xl py-2.5 text-[12px] font-bold uppercase tracking-[0.15em] text-white transition"
            style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.8), rgba(219,39,119,0.75))', boxShadow: '0 4px 20px rgba(124,58,237,0.25)' }}
          >
            ✦ Montar Look no Provador
          </button>
        ) : null}

        {actions.length ? <CompactCardActionBar actions={actions} /> : null}
      </div>
    </section>
  );
}