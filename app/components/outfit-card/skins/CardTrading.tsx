import type { OutfitCardData } from '@/app/lib/outfit-card';
import HeroPlaceholder from './HeroPlaceholder';

interface CardTradingProps {
  data: OutfitCardData;
  showHero?: boolean;
}

export default function CardTrading({ data, showHero = true }: CardTradingProps) {
  const { outfitName, outfitStyleLine, heroImageUrl, creatorName, brands = [], pieces } = data;

  return (
    <div
      className="relative flex flex-col overflow-hidden bg-neutral-900"
      style={{
        width: 360,
        minHeight: 560,
        padding: 6,
        fontFamily: 'Inter, "Segoe UI", Arial, sans-serif',
        border: '2px solid #e5e7eb',
        boxSizing: 'border-box',
      }}
    >
      {/* Inner frame */}
      <div
        className="flex flex-1 flex-col overflow-hidden"
        style={{ border: '4px solid white', padding: 0 }}
      >
        {/* OC badge + score header */}
        <div className="flex items-center justify-between bg-neutral-900 px-4 py-2">
          <span className="rounded border border-neutral-400 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-neutral-300">
            OC №{data.schemeId?.slice(-4) ?? '0001'}
          </span>
          {data.score !== undefined && (
            <span className="text-[22px] font-black leading-none text-white">
              {data.score}<span className="text-[12px] text-neutral-400">/10</span>
            </span>
          )}
        </div>

        {/* Hero */}
        {showHero && (
          heroImageUrl ? (
            <img src={heroImageUrl} alt={outfitName} className="h-[170px] w-full object-cover" />
          ) : (
            <HeroPlaceholder mode="hard" className="h-[170px] w-full" />
          )
        )}

        {/* Inverted name bar */}
        <div className="bg-white px-4 py-3">
          <p className="text-[18px] font-black leading-tight tracking-tight text-neutral-900">{outfitName}</p>
          <p className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-neutral-500">
            {creatorName ? `${creatorName} · ` : ''}{outfitStyleLine}
          </p>
        </div>

        {/* Moves / pieces */}
        <div className="flex flex-1 flex-col bg-neutral-900 px-4 pt-3 pb-4">
          <p className="font-mono text-[9px] uppercase tracking-widest text-neutral-500 mb-2">— Moves —</p>
          {pieces.slice(0, 4).map((piece, i) => (
            <div
              key={piece.id}
              className="mb-1.5 flex items-center justify-between border border-neutral-700 px-3 py-2"
            >
              <div>
                <span className="font-mono text-[8px] uppercase tracking-widest text-neutral-500">{String(i + 1).padStart(2, '0')} </span>
                <span className="text-[11px] font-bold text-white">{piece.name}</span>
                <span className="ml-1 text-[10px] text-neutral-400">· {piece.brand}</span>
              </div>
              <span className="font-mono text-[8px] uppercase tracking-widest text-neutral-500">
                {piece.category ?? 'Std'}
              </span>
            </div>
          ))}

          {brands.length > 0 && (
            <div className="mt-auto pt-3 border-t border-neutral-800">
              <p className="font-mono text-[9px] uppercase tracking-widest text-neutral-600">
                {brands.join(' / ')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
