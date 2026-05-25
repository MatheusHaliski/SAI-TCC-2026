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
  onOpenInDressTester?: (wardrobeItemId: string) => void;
}

export default function OutfitCard({ data, variant = 'default', actions = [], onOpenInDressTester }: GeneratedOutfitCardProps) {
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
              'radial-gradient(circle at 78% 14%, rgba(129,140,248,0.58), transparent 32%), radial-gradient(circle at 18% 80%, rgba(56,189,248,0.48), transparent 34%), radial-gradient(circle at 52% 48%, rgba(244,114,182,0.22), transparent 42%), radial-gradient(circle at 88% 72%, rgba(167,139,250,0.34), transparent 28%), radial-gradient(circle at 12% 22%, rgba(34,211,238,0.30), transparent 30%)',
          }
        : currentShape === 'diamond'
          ? {
              backgroundImage: shapeSvg("<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80'><line x1='0' y1='40' x2='40' y2='0' stroke='rgba(15,23,42,0.18)' stroke-width='1'/><line x1='40' y1='0' x2='80' y2='40' stroke='rgba(15,23,42,0.18)' stroke-width='1'/><line x1='80' y1='40' x2='40' y2='80' stroke='rgba(15,23,42,0.18)' stroke-width='1'/><line x1='40' y1='80' x2='0' y2='40' stroke='rgba(15,23,42,0.18)' stroke-width='1'/><polygon points='40,0 80,40 40,80 0,40' fill='none' stroke='rgba(15,23,42,0.20)' stroke-width='1.5'/><polygon points='40,10 68,40 40,70 12,40' fill='rgba(15,23,42,0.46)'/><polygon points='40,10 68,40 40,70 12,40' fill='none' stroke='rgba(255,255,255,0.13)' stroke-width='1'/><polygon points='40,22 56,40 40,58 24,40' fill='rgba(15,23,42,0.30)' stroke='rgba(255,255,255,0.10)' stroke-width='0.8'/><polygon points='40,32 47,40 40,48 33,40' fill='rgba(15,23,42,0.62)'/><circle cx='40' cy='40' r='2.5' fill='rgba(255,255,255,0.18)'/></svg>"),
              backgroundSize: '40px 40px',
            }
          : currentShape === 'mesh'
            ? {
                backgroundImage: shapeSvg("<svg xmlns='http://www.w3.org/2000/svg' width='96' height='96'><line x1='0' y1='0' x2='96' y2='96' stroke='rgba(255,255,255,0.11)' stroke-width='0.8'/><line x1='96' y1='0' x2='0' y2='96' stroke='rgba(255,255,255,0.11)' stroke-width='0.8'/><line x1='0' y1='48' x2='48' y2='0' stroke='rgba(255,255,255,0.08)' stroke-width='0.6'/><line x1='48' y1='0' x2='96' y2='48' stroke='rgba(255,255,255,0.08)' stroke-width='0.6'/><line x1='96' y1='48' x2='48' y2='96' stroke='rgba(255,255,255,0.08)' stroke-width='0.6'/><line x1='48' y1='96' x2='0' y2='48' stroke='rgba(255,255,255,0.08)' stroke-width='0.6'/><line x1='0' y1='48' x2='96' y2='48' stroke='rgba(255,255,255,0.20)' stroke-width='1.3'/><line x1='48' y1='0' x2='48' y2='96' stroke='rgba(255,255,255,0.20)' stroke-width='1.3'/><line x1='0' y1='24' x2='96' y2='24' stroke='rgba(255,255,255,0.10)' stroke-width='0.8'/><line x1='0' y1='72' x2='96' y2='72' stroke='rgba(255,255,255,0.10)' stroke-width='0.8'/><line x1='24' y1='0' x2='24' y2='96' stroke='rgba(255,255,255,0.10)' stroke-width='0.8'/><line x1='72' y1='0' x2='72' y2='96' stroke='rgba(255,255,255,0.10)' stroke-width='0.8'/><polygon points='48,38 58,48 48,58 38,48' fill='none' stroke='rgba(255,255,255,0.18)' stroke-width='1.2'/><circle cx='48' cy='48' r='4.5' fill='rgba(255,255,255,0.24)'/><circle cx='0' cy='0' r='3' fill='rgba(255,255,255,0.17)'/><circle cx='96' cy='0' r='3' fill='rgba(255,255,255,0.17)'/><circle cx='0' cy='96' r='3' fill='rgba(255,255,255,0.17)'/><circle cx='96' cy='96' r='3' fill='rgba(255,255,255,0.17)'/><circle cx='48' cy='0' r='2.5' fill='rgba(255,255,255,0.13)'/><circle cx='48' cy='96' r='2.5' fill='rgba(255,255,255,0.13)'/><circle cx='0' cy='48' r='2.5' fill='rgba(255,255,255,0.13)'/><circle cx='96' cy='48' r='2.5' fill='rgba(255,255,255,0.13)'/><circle cx='24' cy='24' r='2' fill='rgba(255,255,255,0.10)'/><circle cx='72' cy='24' r='2' fill='rgba(255,255,255,0.10)'/><circle cx='24' cy='72' r='2' fill='rgba(255,255,255,0.10)'/><circle cx='72' cy='72' r='2' fill='rgba(255,255,255,0.10)'/></svg>"),
                backgroundSize: '48px 48px',
              }
            : currentShape === 'stars'
              ? {
                  backgroundImage: shapeSvg("<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80'><polygon points='40,2 49,27 75,28 55,44 63,70 40,54 17,70 25,44 5,28 31,27' fill='rgba(15,23,42,0.18)'/><polygon points='40,6 48,29 72,30 53,44 60,68 40,54 20,68 27,44 8,30 32,29' fill='rgba(15,23,42,0.56)'/><polygon points='40,6 48,29 72,30 53,44 60,68 40,54 20,68 27,44 8,30 32,29' fill='none' stroke='rgba(255,255,255,0.14)' stroke-width='1'/><polygon points='40,21 44,34 58,34 47,42 51,55 40,48 29,55 33,42 22,34 36,34' fill='rgba(15,23,42,0.36)'/><polygon points='40,31 42,37 48,37 43,40 45,46 40,43 35,46 37,40 32,37 38,37' fill='rgba(15,23,42,0.58)'/><circle cx='40' cy='40' r='3.5' fill='rgba(255,255,255,0.22)'/><line x1='0' y1='4' x2='4' y2='0' stroke='rgba(15,23,42,0.30)' stroke-width='1.8'/><line x1='80' y1='4' x2='76' y2='0' stroke='rgba(15,23,42,0.30)' stroke-width='1.8'/><line x1='0' y1='76' x2='4' y2='80' stroke='rgba(15,23,42,0.30)' stroke-width='1.8'/><line x1='76' y1='80' x2='80' y2='76' stroke='rgba(15,23,42,0.30)' stroke-width='1.8'/></svg>"),
                  backgroundSize: '40px 40px',
                }
              : currentShape === 'circles'
                ? {
                    backgroundImage: shapeSvg("<svg xmlns='http://www.w3.org/2000/svg' width='96' height='96'><circle cx='48' cy='48' r='44' fill='none' stroke='rgba(2,6,23,0.16)' stroke-width='1'/><circle cx='48' cy='48' r='36' fill='none' stroke='rgba(2,6,23,0.26)' stroke-width='1.5'/><circle cx='48' cy='48' r='26' fill='none' stroke='rgba(2,6,23,0.36)' stroke-width='1.6'/><circle cx='48' cy='48' r='16' fill='none' stroke='rgba(2,6,23,0.44)' stroke-width='1.8'/><circle cx='48' cy='48' r='8' fill='rgba(2,6,23,0.54)'/><line x1='48' y1='4' x2='48' y2='11' stroke='rgba(2,6,23,0.28)' stroke-width='1.5'/><line x1='48' y1='85' x2='48' y2='92' stroke='rgba(2,6,23,0.28)' stroke-width='1.5'/><line x1='4' y1='48' x2='11' y2='48' stroke='rgba(2,6,23,0.28)' stroke-width='1.5'/><line x1='85' y1='48' x2='92' y2='48' stroke='rgba(2,6,23,0.28)' stroke-width='1.5'/><line x1='16' y1='16' x2='21' y2='21' stroke='rgba(2,6,23,0.20)' stroke-width='1.2'/><line x1='80' y1='16' x2='75' y2='21' stroke='rgba(2,6,23,0.20)' stroke-width='1.2'/><line x1='16' y1='80' x2='21' y2='75' stroke='rgba(2,6,23,0.20)' stroke-width='1.2'/><line x1='80' y1='80' x2='75' y2='75' stroke='rgba(2,6,23,0.20)' stroke-width='1.2'/><circle cx='0' cy='0' r='5' fill='rgba(2,6,23,0.28)'/><circle cx='96' cy='0' r='5' fill='rgba(2,6,23,0.28)'/><circle cx='0' cy='96' r='5' fill='rgba(2,6,23,0.28)'/><circle cx='96' cy='96' r='5' fill='rgba(2,6,23,0.28)'/><circle cx='48' cy='0' r='3' fill='rgba(2,6,23,0.22)'/><circle cx='48' cy='96' r='3' fill='rgba(2,6,23,0.22)'/><circle cx='0' cy='48' r='3' fill='rgba(2,6,23,0.22)'/><circle cx='96' cy='48' r='3' fill='rgba(2,6,23,0.22)'/></svg>"),
                    backgroundSize: '48px 48px',
                  }
                : currentShape === 'triangles'
                  ? {
                      backgroundImage: shapeSvg("<svg xmlns='http://www.w3.org/2000/svg' width='96' height='84'><polygon points='4,4 92,4 48,80' fill='rgba(2,6,23,0.22)' stroke='rgba(255,255,255,0.10)' stroke-width='0.8'/><polygon points='48,4 92,80 4,80' fill='rgba(2,6,23,0.48)'/><polygon points='48,4 92,80 4,80' fill='none' stroke='rgba(255,255,255,0.14)' stroke-width='1.2'/><polygon points='48,20 78,68 18,68' fill='rgba(2,6,23,0.30)' stroke='rgba(255,255,255,0.10)' stroke-width='0.8'/><polygon points='48,36 66,62 30,62' fill='rgba(2,6,23,0.56)'/><line x1='48' y1='4' x2='48' y2='80' stroke='rgba(255,255,255,0.09)' stroke-width='0.8'/><line x1='4' y1='80' x2='70' y2='42' stroke='rgba(255,255,255,0.07)' stroke-width='0.6'/><line x1='92' y1='80' x2='26' y2='42' stroke='rgba(255,255,255,0.07)' stroke-width='0.6'/><circle cx='48' cy='56' r='3.5' fill='rgba(255,255,255,0.18)'/></svg>"),
                      backgroundSize: '48px 42px',
                    }
                  : currentShape === 'waves'
                    ? {
                        backgroundImage: shapeSvg("<svg xmlns='http://www.w3.org/2000/svg' width='240' height='120'><path d='M0,60 C20,32 60,32 80,60 C100,88 140,88 160,60 C180,32 220,32 240,60' stroke='rgba(2,6,23,0.48)' stroke-width='3.5' fill='none'/><path d='M0,60 C20,88 60,88 80,60 C100,32 140,32 160,60 C180,88 220,88 240,60' stroke='rgba(2,6,23,0.40)' stroke-width='3.0' fill='none'/><path d='M0,35 C15,13 45,13 60,35 C75,57 105,57 120,35 C135,13 165,13 180,35 C195,57 225,57 240,35' stroke='rgba(2,6,23,0.28)' stroke-width='2.2' fill='none'/><path d='M0,85 C15,63 45,63 60,85 C75,107 105,107 120,85 C135,63 165,63 180,85 C195,107 225,107 240,85' stroke='rgba(2,6,23,0.24)' stroke-width='2.0' fill='none'/><path d='M0,18 C10,6 30,6 40,18 C50,30 70,30 80,18 C90,6 110,6 120,18 C130,30 150,30 160,18 C170,6 190,6 200,18 C210,30 230,30 240,18' stroke='rgba(2,6,23,0.16)' stroke-width='1.4' fill='none'/><path d='M0,102 C10,90 30,90 40,102 C50,114 70,114 80,102 C90,90 110,90 120,102 C130,114 150,114 160,102 C170,90 190,90 200,102 C210,114 230,114 240,102' stroke='rgba(2,6,23,0.16)' stroke-width='1.4' fill='none'/><path d='M0,60 C20,88 60,88 80,60 C100,32 140,32 160,60 C180,88 220,88 240,60 L240,120 L0,120 Z' fill='rgba(2,6,23,0.07)'/></svg>"),
                        backgroundSize: '120px 60px',
                      }
                    : currentShape === 'beams'
                      ? {
                          backgroundImage:
                            'repeating-linear-gradient(112deg, rgba(255,255,255,0.22) 0 3px, transparent 3px 14px, rgba(255,255,255,0.14) 14px 22px, transparent 22px 34px, rgba(255,255,255,0.09) 34px 38px, transparent 38px 60px),linear-gradient(112deg, rgba(2,6,23,0.42) 0%, rgba(2,6,23,0) 52%),linear-gradient(292deg, rgba(2,6,23,0.24) 0%, rgba(2,6,23,0) 50%)',
                          backgroundSize: '100% 100%,100% 100%,100% 100%',
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
            opacity: 0.38,
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
        <OutfitPieceList pieces={data.pieces} compact={variant === 'compact'} onOpenInDressTester={onOpenInDressTester} />
        {actions.length ? <CompactCardActionBar actions={actions} /> : null}
      </div>
    </section>
  );
}
