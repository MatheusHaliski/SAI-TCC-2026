import type { OutfitCardData } from '@/app/lib/outfit-card';
import HeroPlaceholder from './HeroPlaceholder';

interface CardSpecimenProps {
  data: OutfitCardData;
  showHero?: boolean;
}

function FieldCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between border-b border-dashed border-neutral-300 py-1.5">
      <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-neutral-400">{label}</span>
      <span className="text-[11px] font-bold text-neutral-800">{value}</span>
    </div>
  );
}

export default function CardSpecimen({ data, showHero = true }: CardSpecimenProps) {
  const { outfitName, outfitStyleLine, heroImageUrl, creatorName, brands = [], pieces } = data;

  const graphPaperBg = `
    repeating-linear-gradient(
      rgba(180,180,200,0.18) 0px,
      rgba(180,180,200,0.18) 1px,
      transparent 1px,
      transparent 24px
    ),
    repeating-linear-gradient(
      90deg,
      rgba(180,180,200,0.18) 0px,
      rgba(180,180,200,0.18) 1px,
      transparent 1px,
      transparent 24px
    ),
    #f8f6f2
  `;

  return (
    <div
      className="relative flex flex-col overflow-hidden"
      style={{
        width: 360,
        minHeight: 560,
        background: graphPaperBg,
        fontFamily: 'var(--font-sharetech), "Share Tech Mono", monospace',
      }}
    >
      {/* Header bar */}
      <div className="flex items-start justify-between border-b border-neutral-300 px-5 pt-4 pb-3">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-400">FAI · Field Card</p>
          <p className="font-mono text-[18px] font-bold uppercase tracking-wide text-neutral-800 leading-tight">
            Specimen №{data.schemeId?.slice(-4) ?? '0001'}
          </p>
        </div>
        <div className="text-right">
          <p className="font-mono text-[8px] uppercase tracking-widest text-neutral-400">Filed</p>
          <p className="font-mono text-[10px] text-neutral-600">
            {new Date().toISOString().slice(0, 10).replaceAll('-', '·')}
          </p>
        </div>
      </div>

      {/* Hero with registration marks */}
      {showHero && (
        <div className="relative mx-4 mt-3" style={{ border: '1px solid #c4c4c4' }}>
          {heroImageUrl ? (
            <img src={heroImageUrl} alt={outfitName} className="h-[168px] w-full object-cover" />
          ) : (
            <HeroPlaceholder mode="soft" className="h-[168px] w-full" />
          )}
          {/* Corner registration marks */}
          {[
            { top: 0, left: 0 },
            { top: 0, right: 0 },
            { bottom: 0, left: 0 },
            { bottom: 0, right: 0 },
          ].map((pos, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                ...pos,
                width: 14,
                height: 14,
                borderTop: i < 2 ? '1.5px solid #555' : undefined,
                borderBottom: i >= 2 ? '1.5px solid #555' : undefined,
                borderLeft: i % 2 === 0 ? '1.5px solid #555' : undefined,
                borderRight: i % 2 === 1 ? '1.5px solid #555' : undefined,
              }}
            />
          ))}
        </div>
      )}

      {/* Outfit title */}
      <div className="px-5 pt-3">
        <p className="text-[20px] font-bold leading-tight text-neutral-900">{outfitName}</p>
        <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-neutral-400 mt-0.5">
          By {creatorName ?? '—'} · {outfitStyleLine}
        </p>
      </div>

      {/* Piece cards */}
      <div className="mx-4 mt-3 grid grid-cols-2 gap-2 pb-4">
        {pieces.slice(0, 4).map((piece, i) => (
          <div key={piece.id} className="border border-neutral-300 bg-white/60 p-2">
            <div className="flex items-baseline justify-between mb-1">
              <p className="font-mono text-[11px] font-bold uppercase text-neutral-800">{piece.name}</p>
              <span className="font-mono text-[9px] text-neutral-400">{String(i + 1).padStart(2, '0')}</span>
            </div>
            <FieldCard label="Brand" value={piece.brand} />
            <FieldCard label="Form" value={piece.pieceType} />
            <FieldCard label="Tier" value={piece.category ?? 'Standard'} />
          </div>
        ))}
      </div>

      {/* Notes footer */}
      <div className="mt-auto border-t border-neutral-300 px-5 py-3">
        <div className="flex items-baseline justify-between">
          <p className="font-mono text-[9px] uppercase tracking-widest text-neutral-400">
            Notes: {brands.join(', ') ? `${brands[0]} leads this composition…` : 'Specimen filed.'}
          </p>
          {data.score !== undefined && (
            <p className="font-mono text-[11px] font-bold text-neutral-700">★ {data.score}</p>
          )}
        </div>
      </div>
    </div>
  );
}
