import { resolveBrandLogoUrlByName, type OutfitCardData, type OutfitPiece } from '@/app/lib/outfit-card';
import HeroPlaceholder from './HeroPlaceholder';

interface CardAtelierProps {
  data: OutfitCardData;
  showHero?: boolean;
}

export default function CardAtelier({ data, showHero = true }: CardAtelierProps) {
  const { outfitName, outfitStyleLine, outfitDescription, heroImageUrl, creatorName, brands = [], pieces } = data;
  const pieceTiles = pieces.slice(0, 6);

  const resolveLogo = (piece: OutfitPiece) => piece.brandLogoUrl || resolveBrandLogoUrlByName(piece.brand);

  return (
    <div
      className="relative flex flex-col overflow-hidden bg-white"
      style={{ width: 360, minHeight: 560, fontFamily: 'Inter, "Segoe UI", Arial, sans-serif' }}
    >
      {/* Eyebrow */}
      <div className="flex items-center justify-between border-b border-neutral-100 px-6 pt-5 pb-3">
        <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-neutral-400">Outfit Card</span>
        {data.score !== undefined && (
          <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-neutral-400">★ {data.score}</span>
        )}
      </div>

      {/* Hero */}
      {showHero && (
        heroImageUrl ? (
          <img src={heroImageUrl} alt={outfitName} className="h-[200px] w-full object-cover" />
        ) : (
          <HeroPlaceholder mode="soft" className="h-[200px] w-full" />
        )
      )}

      {/* Content */}
      <div className="flex flex-1 flex-col px-6 pt-5 pb-6">
        <p className="text-[22px] font-bold leading-tight tracking-tight text-neutral-900">{outfitName}</p>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-400">
          {creatorName ? `${creatorName} · ` : ''}{outfitStyleLine}
        </p>

        {outfitDescription && (
          <p className="mt-4 text-[12px] leading-relaxed text-neutral-500">{outfitDescription}</p>
        )}

        {brands.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {brands.map((brand) => (
              <span key={brand} className="rounded-sm border border-neutral-200 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-neutral-500">
                {brand}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto pt-5">
          <div className="grid grid-cols-2 gap-2 border-t border-neutral-100 pt-4">
            {pieceTiles.map((piece, i) => {
              const logoUrl = resolveLogo(piece);
              return (
                <div key={piece.id} className="flex min-h-[54px] items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-2.5 py-2">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-neutral-200 bg-white">
                    {logoUrl ? (
                      <img src={logoUrl} alt={`${piece.brand} logo`} className="h-5 w-5 object-contain" />
                    ) : (
                      <span className="font-mono text-[9px] font-bold uppercase text-neutral-500">{piece.brand.slice(0, 2)}</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-[11px] font-bold leading-tight text-neutral-900">{piece.name}</p>
                    <p className="mt-0.5 font-mono text-[8px] uppercase tracking-wider text-neutral-400">
                      {String(i + 1).padStart(2, '0')} · {piece.pieceType}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
