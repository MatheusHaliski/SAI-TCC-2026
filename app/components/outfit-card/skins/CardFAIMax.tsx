import type { OutfitCardData } from '@/app/lib/outfit-card';
import HeroPlaceholder from './HeroPlaceholder';

interface CardFAIMaxProps {
  data: OutfitCardData;
  showHero?: boolean;
}

export default function CardFAIMax({ data, showHero = true }: CardFAIMaxProps) {
  const { outfitName, outfitStyleLine, heroImageUrl, creatorName, brands = [], pieces } = data;

  return (
    <div
      className="relative flex flex-col overflow-hidden bg-black"
      style={{
        width: 360,
        minHeight: 560,
        border: '8px solid #f97316',
        boxSizing: 'border-box',
        fontFamily: 'var(--font-sharetech), "Share Tech Mono", monospace',
      }}
    >
      {/* Inner orange border */}
      <div
        className="flex flex-1 flex-col"
        style={{ border: '1px solid #f97316', margin: 4, padding: 0 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-3 pb-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-orange-500">
            FAI / OC №{data.schemeId?.slice(-4) ?? '0001'}
          </span>
          {data.score !== undefined && (
            <span className="font-mono text-[10px] text-orange-500">★ {data.score}</span>
          )}
        </div>

        {/* Hero */}
        {showHero && (
          <div className="mx-4 mb-3" style={{ border: '1px solid #f97316' }}>
            {heroImageUrl ? (
              <img src={heroImageUrl} alt={outfitName} className="h-[170px] w-full object-cover" />
            ) : (
              <HeroPlaceholder mode="window" className="h-[170px] w-full" />
            )}
          </div>
        )}

        {/* Title */}
        <div className="px-4">
          <p className="font-mono text-[26px] font-bold uppercase leading-tight tracking-wide text-white">
            {outfitName}
          </p>
        </div>

        {/* Category + author chips */}
        <div className="mt-3 flex flex-wrap gap-2 px-4">
          {outfitStyleLine && (
            <span
              className="font-mono text-[9px] uppercase tracking-widest text-orange-500 px-2 py-1"
              style={{ border: '2px solid #f97316' }}
            >
              {outfitStyleLine}
            </span>
          )}
          {creatorName && (
            <span
              className="font-mono text-[9px] uppercase tracking-widest text-orange-500 px-2 py-1"
              style={{ border: '2px solid #f97316' }}
            >
              {creatorName}
            </span>
          )}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Pieces */}
        <div className="mx-4 mb-4 mt-4 space-y-2">
          {pieces.slice(0, 4).map((piece, i) => (
            <div
              key={piece.id}
              className="flex items-center justify-between px-3 py-2"
              style={{ border: '1px solid #f97316' }}
            >
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-orange-500">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <p className="font-mono text-[11px] font-bold uppercase text-white">
                    {piece.name} · {piece.brand}
                  </p>
                  <p className="font-mono text-[9px] uppercase text-neutral-500">
                    {piece.pieceType} / {piece.category ?? 'Standard'}
                  </p>
                </div>
              </div>
              <span className="font-mono text-[12px] text-orange-500">→</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
