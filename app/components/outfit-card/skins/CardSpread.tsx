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

        <div className="mt-auto pt-4">
          <div className="rounded-2xl border border-neutral-200 bg-white p-3 shadow-sm">
            <div className="mb-2 flex items-center justify-between">
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-400">Stack list</p>
              {data.score !== undefined ? <span className="font-mono text-[10px] text-neutral-400">★ {data.score}</span> : null}
            </div>
            <div className="space-y-1.5">
              {pieces.slice(0, 5).map((piece, i) => (
                <div key={piece.id} className="grid grid-cols-[22px_1fr_auto] items-center gap-2 rounded-lg bg-neutral-50 px-2 py-1.5">
                  <span className="font-mono text-[8px] font-bold text-neutral-400">{String(i + 1).padStart(2, '0')}</span>
                  <div className="min-w-0">
                    <p className="truncate text-[11px] font-bold leading-tight text-neutral-900">{piece.name}</p>
                    <p className="truncate font-mono text-[8px] uppercase tracking-wide text-neutral-400">{piece.pieceType}</p>
                  </div>
                  <span className="max-w-[72px] truncate text-[10px] font-semibold text-neutral-600">{piece.brand}</span>
                </div>
              ))}
            </div>
            {brands.length > 0 ? (
              <p className="mt-2 truncate font-mono text-[8px] uppercase tracking-widest text-neutral-400">
                {brands.slice(0, 4).join(' / ')}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
