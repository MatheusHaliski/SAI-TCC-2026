import type { OutfitCardData } from '@/app/lib/outfit-card';
import HeroPlaceholder from './HeroPlaceholder';

interface CardFAIMaxProps {
  data: OutfitCardData;
  showHero?: boolean;
}

export default function CardFAIMax({ data, showHero = true }: CardFAIMaxProps) {
  const { outfitName, outfitStyleLine, heroImageUrl, creatorName, brands = [], pieces } = data;
  const leadPiece = pieces[0];

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

        {/* Radar summary + pieces */}
        <div className="mx-4 mt-4 grid grid-cols-[92px_1fr] gap-3">
          <div className="flex aspect-square flex-col items-center justify-center rounded-full border border-orange-500 text-center">
            <p className="font-mono text-[8px] uppercase tracking-widest text-orange-500">Lead</p>
            <p className="mt-1 max-w-[64px] truncate font-mono text-[10px] font-bold uppercase text-white">{leadPiece?.name ?? 'Core'}</p>
            <p className="font-mono text-[8px] uppercase text-neutral-500">{pieces.length} slots</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {pieces.slice(0, 4).map((piece, i) => (
              <div
                key={piece.id}
                className="min-h-[52px] px-2 py-2"
                style={{ border: '1px solid #f97316' }}
              >
                <p className="font-mono text-[8px] text-orange-500">{String(i + 1).padStart(2, '0')} / {piece.pieceType}</p>
                <p className="truncate font-mono text-[10px] font-bold uppercase text-white">{piece.name}</p>
                <p className="truncate font-mono text-[8px] uppercase text-neutral-500">{piece.brand}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mx-4 mb-4 mt-auto border-t border-orange-500/70 pt-3">
          <p className="font-mono text-[9px] uppercase tracking-widest text-orange-500">
            {brands.length ? brands.slice(0, 4).join(' + ') : 'FAI composition locked'}
          </p>
        </div>
      </div>
    </div>
  );
}
