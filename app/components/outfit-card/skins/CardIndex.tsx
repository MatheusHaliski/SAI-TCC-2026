import type { OutfitCardData } from '@/app/lib/outfit-card';
import HeroPlaceholder from './HeroPlaceholder';

interface CardIndexProps {
  data: OutfitCardData;
  showHero?: boolean;
}

function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between py-1.5">
      <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-neutral-400">{label}</span>
      <span
        className="mx-2 flex-1 border-b border-dashed border-neutral-200"
        style={{ marginBottom: 3 }}
      />
      <span className="text-[11px] font-semibold text-neutral-800">{value}</span>
    </div>
  );
}

export default function CardIndex({ data, showHero = true }: CardIndexProps) {
  const { outfitName, outfitStyleLine, heroImageUrl, creatorName, brands = [], pieces } = data;

  return (
    <div
      className="relative flex flex-col overflow-hidden border border-neutral-300 bg-white"
      style={{ width: 360, minHeight: 560, fontFamily: 'Inter, "Segoe UI", Arial, sans-serif' }}
    >
      {/* Badge header */}
      <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-3">
        <span className="rounded border border-neutral-800 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-neutral-800">
          OC №{data.schemeId?.slice(-4) ?? '0001'}
        </span>
        <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-neutral-400">{outfitStyleLine}</span>
      </div>

      {/* Hero */}
      {showHero && (
        heroImageUrl ? (
          <img src={heroImageUrl} alt={outfitName} className="h-[180px] w-full object-cover" />
        ) : (
          <HeroPlaceholder mode="speckle" className="h-[180px] w-full" />
        )
      )}

      {/* Title */}
      <div className="px-5 pt-4">
        <p className="text-[20px] font-bold leading-tight text-neutral-900">{outfitName}</p>
      </div>

      {/* Data rows */}
      <div className="flex-1 px-5 pt-3 pb-4">
        <DataRow label="Author" value={creatorName ?? '—'} />
        <DataRow label="Category" value={outfitStyleLine} />
        <DataRow label="Brands" value={brands.join(' / ') || '—'} />
        {data.score !== undefined && <DataRow label="Score" value={`★ ${data.score} / 10`} />}

        <div className="mt-4 border-t border-neutral-100 pt-3">
          <p className="mb-2 font-mono text-[9px] uppercase tracking-widest text-neutral-400">Pieces</p>
          {pieces.slice(0, 5).map((piece, i) => (
            <div key={piece.id} className="flex items-center justify-between py-1 border-b border-dashed border-neutral-100">
              <span className="font-mono text-[9px] uppercase tracking-wide text-neutral-400">
                {String(i + 1).padStart(2, '0')} {piece.name}
              </span>
              <span className="text-[11px] font-semibold text-neutral-700">{piece.brand}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
