import type { OutfitCardData } from '@/app/lib/outfit-card';
import HeroPlaceholder from './HeroPlaceholder';

interface CardSpreadProps {
  data: OutfitCardData;
  showHero?: boolean;
}

export default function CardSpread({ data, showHero = true }: CardSpreadProps) {
  const { outfitName, outfitStyleLine, outfitDescription, heroImageUrl, creatorName, brands = [], pieces } = data;

  const titleWords = outfitName.split(' ');
  const titleFirstHalf = titleWords.slice(0, Math.ceil(titleWords.length / 2)).join(' ');
  const titleSecondHalf = titleWords.slice(Math.ceil(titleWords.length / 2)).join(' ');
  const descFirstChar = outfitDescription?.[0] ?? '';
  const descRest = outfitDescription?.slice(1) ?? '';

  return (
    <div
      className="relative flex flex-col overflow-hidden bg-neutral-50"
      style={{ width: 360, minHeight: 560, fontFamily: 'Inter, "Segoe UI", Arial, sans-serif' }}
    >
      {/* Hero 16:9 full-bleed */}
      {showHero && (
        heroImageUrl ? (
          <img src={heroImageUrl} alt={outfitName} className="h-[202px] w-full object-cover" />
        ) : (
          <HeroPlaceholder mode="hard" className="h-[202px] w-full" />
        )
      )}

      <div className="flex flex-1 flex-col px-5 pt-4 pb-5">
        {/* Category */}
        <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-neutral-400">
          {outfitStyleLine}
        </p>

        {/* Stacked display title */}
        <div className="mt-2">
          <p className="text-[30px] font-black leading-none tracking-tight text-neutral-900">{titleFirstHalf}</p>
          {titleSecondHalf && (
            <p className="text-[30px] font-black leading-none tracking-tight text-neutral-900">{titleSecondHalf}.</p>
          )}
        </div>

        {/* Author */}
        {creatorName && (
          <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.18em] text-neutral-400">{creatorName}</p>
        )}

        {/* Drop cap description */}
        {outfitDescription && (
          <p className="mt-4 text-[12px] leading-relaxed text-neutral-600">
            <span className="float-left mr-1 text-[42px] font-bold leading-none text-neutral-900">{descFirstChar}</span>
            {descRest}
          </p>
        )}

        <div className="mt-auto">
          <div className="border-t border-neutral-200 pt-3">
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-1">
                {brands.slice(0, 3).map((brand) => (
                  <span key={brand} className="font-mono text-[9px] uppercase tracking-wide text-neutral-500">{brand}</span>
                ))}
              </div>
              {data.score !== undefined && (
                <span className="font-mono text-[10px] text-neutral-400">★ {data.score}</span>
              )}
            </div>
            <div className="mt-2 space-y-1">
              {pieces.slice(0, 3).map((piece, i) => (
                <p key={piece.id} className="font-mono text-[9px] uppercase tracking-wide text-neutral-400">
                  {String(i + 1).padStart(2, '0')} {piece.name} · {piece.brand}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
