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

interface GeneratedOutfitCardProps {
  data: OutfitCardData;
  variant?: 'default' | 'compact';
  actions?: Array<{
    label: string;
    onClick?: () => void;
    tone?: 'default' | 'danger' | 'accent';
  }>;
}

export default function OutfitCard({ data, variant = 'default', actions = [] }: GeneratedOutfitCardProps) {
  const description =
    data.outfitDescription === undefined
      ? buildOutfitDescriptionFallback({
          pieces: data.pieces,
          outfitStyleLine: data.outfitStyleLine,
        })
      : data.outfitDescription?.trim() || undefined;

  const resolvedBackground = resolveOutfitBackgroundForRender(data.outfitBackground);
  const backgroundStyle = buildBackgroundCssStyle(resolvedBackground);
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
    currentShape === 'none'
      ? null
      : currentShape === 'orb'
        ? {
            backgroundImage:
              'radial-gradient(circle at 78% 16%, rgba(129,140,248,0.48), transparent 34%), radial-gradient(circle at 18% 82%, rgba(56,189,248,0.38), transparent 36%), radial-gradient(circle at 58% 50%, rgba(244,114,182,0.16), transparent 44%)',
          }
        : currentShape === 'diamond'
          ? {
              backgroundImage: `${shapeSvg("<svg xmlns='http://www.w3.org/2000/svg' width='72' height='72'><rect x='23' y='23' width='26' height='26' transform='rotate(45 36 36)' fill='rgba(15,23,42,0.48)'/></svg>")},linear-gradient(140deg,rgba(255,255,255,0.08),rgba(15,23,42,0.18))`,
              backgroundSize: '24px 24px,100% 100%',
            }
          : currentShape === 'mesh'
            ? {
                backgroundImage:
                  'linear-gradient(120deg, rgba(15,23,42,0.22) 0%, rgba(15,23,42,0) 42%),linear-gradient(320deg, rgba(15,23,42,0.18) 0%, rgba(15,23,42,0) 42%),repeating-linear-gradient(0deg, rgba(255,255,255,0.14) 0 1px, transparent 1px 24px),repeating-linear-gradient(90deg, rgba(255,255,255,0.12) 0 1px, transparent 1px 24px)',
              backgroundSize: '100% 100%,100% 100%,24px 24px,24px 24px',
            }
            : currentShape === 'stars'
              ? {
                  backgroundImage: shapeSvg("<svg xmlns='http://www.w3.org/2000/svg' width='72' height='72' viewBox='0 0 72 72'><polygon points='36,8 42,24 59,24 45,35 50,52 36,42 22,52 27,35 13,24 30,24' fill='rgba(15,23,42,0.58)'/></svg>"),
                  backgroundSize: '36px 36px',
                }
              : currentShape === 'circles'
                ? {
                    backgroundImage: 'radial-gradient(circle, rgba(2,6,23,0.42) 42%, transparent 44%)',
                    backgroundSize: '22px 22px',
                  }
                : currentShape === 'triangles'
                  ? {
                      backgroundImage: shapeSvg("<svg xmlns='http://www.w3.org/2000/svg' width='68' height='68' viewBox='0 0 68 68'><polygon points='34,8 60,56 8,56' fill='rgba(2,6,23,0.44)'/></svg>"),
                      backgroundSize: '32px 32px',
                    }
                  : currentShape === 'waves'
                    ? {
                        backgroundImage: shapeSvg("<svg xmlns='http://www.w3.org/2000/svg' width='140' height='80' viewBox='0 0 140 80'><path d='M0 40 C20 12 50 12 70 40 C90 68 120 68 140 40' stroke='rgba(2,6,23,0.45)' stroke-width='6' fill='none'/></svg>"),
                        backgroundSize: '120px 52px',
                      }
                    : currentShape === 'beams'
                      ? {
                          backgroundImage: 'repeating-linear-gradient(112deg, rgba(255,255,255,0.15) 0 4px, transparent 4px 28px),linear-gradient(112deg, rgba(2,6,23,0.32), transparent 62%)',
                          backgroundSize: '100% 100%,100% 100%',
                        }
                      : currentShape === 'flowers'
                        ? {
                            backgroundImage: shapeSvg("<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><path d='M60,0 Q54,40 80,80 Q106,40 100,0' stroke='rgba(17,24,39,0.22)' stroke-width='2' fill='none'/><path d='M60,160 Q54,120 80,80 Q106,120 100,160' stroke='rgba(17,24,39,0.22)' stroke-width='2' fill='none'/><path d='M0,60 Q40,54 80,80 Q40,106 0,100' stroke='rgba(17,24,39,0.22)' stroke-width='2' fill='none'/><path d='M160,60 Q120,54 80,80 Q120,106 160,100' stroke='rgba(17,24,39,0.22)' stroke-width='2' fill='none'/><path d='M80,80 C66,62 62,44 80,32 C98,44 94,62 80,80' fill='rgba(17,24,39,0.50)'/><path d='M80,80 C66,62 62,44 80,32 C98,44 94,62 80,80' fill='rgba(17,24,39,0.50)' transform='rotate(45,80,80)'/><path d='M80,80 C66,62 62,44 80,32 C98,44 94,62 80,80' fill='rgba(17,24,39,0.50)' transform='rotate(90,80,80)'/><path d='M80,80 C66,62 62,44 80,32 C98,44 94,62 80,80' fill='rgba(17,24,39,0.50)' transform='rotate(135,80,80)'/><path d='M80,80 C66,62 62,44 80,32 C98,44 94,62 80,80' fill='rgba(17,24,39,0.50)' transform='rotate(180,80,80)'/><path d='M80,80 C66,62 62,44 80,32 C98,44 94,62 80,80' fill='rgba(17,24,39,0.50)' transform='rotate(225,80,80)'/><path d='M80,80 C66,62 62,44 80,32 C98,44 94,62 80,80' fill='rgba(17,24,39,0.50)' transform='rotate(270,80,80)'/><path d='M80,80 C66,62 62,44 80,32 C98,44 94,62 80,80' fill='rgba(17,24,39,0.50)' transform='rotate(315,80,80)'/><path d='M80,80 C72,68 70,58 80,50 C90,58 88,68 80,80' fill='rgba(17,24,39,0.72)' transform='rotate(22.5,80,80)'/><path d='M80,80 C72,68 70,58 80,50 C90,58 88,68 80,80' fill='rgba(17,24,39,0.72)' transform='rotate(67.5,80,80)'/><path d='M80,80 C72,68 70,58 80,50 C90,58 88,68 80,80' fill='rgba(17,24,39,0.72)' transform='rotate(112.5,80,80)'/><path d='M80,80 C72,68 70,58 80,50 C90,58 88,68 80,80' fill='rgba(17,24,39,0.72)' transform='rotate(157.5,80,80)'/><path d='M80,80 C72,68 70,58 80,50 C90,58 88,68 80,80' fill='rgba(17,24,39,0.72)' transform='rotate(202.5,80,80)'/><path d='M80,80 C72,68 70,58 80,50 C90,58 88,68 80,80' fill='rgba(17,24,39,0.72)' transform='rotate(247.5,80,80)'/><path d='M80,80 C72,68 70,58 80,50 C90,58 88,68 80,80' fill='rgba(17,24,39,0.72)' transform='rotate(292.5,80,80)'/><path d='M80,80 C72,68 70,58 80,50 C90,58 88,68 80,80' fill='rgba(17,24,39,0.72)' transform='rotate(337.5,80,80)'/><path d='M80,80 C66,62 62,44 80,32 C98,44 94,62 80,80' fill='none' stroke='rgba(255,255,255,0.09)' stroke-width='0.8'/><path d='M80,80 C66,62 62,44 80,32 C98,44 94,62 80,80' fill='none' stroke='rgba(255,255,255,0.09)' stroke-width='0.8' transform='rotate(90,80,80)'/><circle cx='80' cy='80' r='10' fill='rgba(17,24,39,0.88)'/><circle cx='80' cy='80' r='3.5' fill='rgba(251,191,36,0.52)'/><circle cx='0' cy='0' r='13' fill='rgba(17,24,39,0.26)'/><circle cx='160' cy='0' r='13' fill='rgba(17,24,39,0.26)'/><circle cx='0' cy='160' r='13' fill='rgba(17,24,39,0.26)'/><circle cx='160' cy='160' r='13' fill='rgba(17,24,39,0.26)'/></svg>"),
                            backgroundSize: '80px 80px',
                          }
                        : currentShape === 'arrows'
                          ? {
                              backgroundImage: shapeSvg("<svg xmlns='http://www.w3.org/2000/svg' width='160' height='96'><path d='M0,48 L40,0 L80,48 L120,0 L160,48' stroke='rgba(2,6,23,0.44)' stroke-width='3.5' fill='none' stroke-linejoin='miter'/><path d='M0,48 L40,96 L80,48 L120,96 L160,48' stroke='rgba(2,6,23,0.40)' stroke-width='3.5' fill='none' stroke-linejoin='miter'/><path d='M0,0 L40,48 L80,0 L120,48 L160,0' stroke='rgba(2,6,23,0.28)' stroke-width='2.5' fill='none' stroke-linejoin='miter'/><path d='M0,96 L40,48 L80,96 L120,48 L160,96' stroke='rgba(2,6,23,0.28)' stroke-width='2.5' fill='none' stroke-linejoin='miter'/><path d='M0,24 L40,72 L80,24 L120,72 L160,24' stroke='rgba(2,6,23,0.18)' stroke-width='1.8' fill='none' stroke-linejoin='miter'/><path d='M0,72 L40,24 L80,72 L120,24 L160,72' stroke='rgba(2,6,23,0.18)' stroke-width='1.8' fill='none' stroke-linejoin='miter'/><path d='M0,12 L40,60 L80,12 L120,60 L160,12' stroke='rgba(2,6,23,0.11)' stroke-width='1.2' fill='none' stroke-linejoin='miter'/><path d='M0,84 L40,36 L80,84 L120,36 L160,84' stroke='rgba(2,6,23,0.11)' stroke-width='1.2' fill='none' stroke-linejoin='miter'/></svg>"),
                              backgroundSize: '80px 48px',
                            }
                          : null;

  return (
    <section
      className={`relative overflow-hidden rounded-2xl border border-slate-200/60 shadow-[0_8px_24px_rgba(15,23,42,0.08)] ${variant === 'compact' ? 'space-y-2 p-2.5' : 'space-y-3 p-3 sm:p-4'}`}
      style={backgroundStyle}
    >
      {materialRender.textureDataUrl ? (
        <div
          aria-hidden
          className="pointer-events-none absolute z-0 rounded-[inherit]"
          style={{
            ...buildFabricScopeStyle(materialLayer?.scope || 'card'),
            backgroundImage: `url(${materialRender.textureDataUrl})`,
            backgroundSize: 'cover',
            backgroundBlendMode: 'multiply',
            opacity: 0.84,
          }}
        />
      ) : null}
      {shapeOverlayStyle ? (
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-95" style={shapeOverlayStyle} />
      ) : null}
      {materialRender.decorativeDataUrl ? (
        <div
          aria-hidden
          className="pointer-events-none absolute z-0 rounded-[inherit]"
          style={{
            ...buildFabricScopeStyle(materialLayer?.scope || 'card'),
            backgroundImage: `url(${materialRender.decorativeDataUrl})`,
            backgroundSize: 'cover',
            opacity: decorativeLayer?.opacity ?? 0.72,
          }}
        />
      ) : null}
      <div className={`relative z-[1] ${variant === 'compact' ? 'space-y-3' : 'space-y-4'}`}>
        <OutfitHeroImage src={data.heroImageUrl} alt={`${data.outfitName} hero preview`} className={variant === 'compact' ? 'h-24 rounded-xl' : 'h-44 rounded-xl'} />
        <OutfitHeader
          outfitName={data.outfitName}
          outfitStyleLine={data.outfitStyleLine}
          description={description}
          badges={data.metaBadges}
          compact={variant === 'compact'}
          brandBadges={brandBadges}
          titleFontFamily={data.titleFontFamily}
          creatorName={data.creatorName}
        />
        <OutfitPieceList pieces={data.pieces} compact={variant === 'compact'} />
        {actions.length ? <CompactCardActionBar actions={actions} /> : null}
      </div>
    </section>
  );
}
