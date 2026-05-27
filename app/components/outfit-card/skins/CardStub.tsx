import type { OutfitCardData } from '@/app/lib/outfit-card';
import HeroPlaceholder from './HeroPlaceholder';

interface CardStubProps {
  data: OutfitCardData;
  showHero?: boolean;
}

const ZIGZAG_HEIGHT = 10;

function ZigzagDivider({ fill = '#faf7f0' }: { fill?: string }) {
  return (
    <svg width="100%" height={ZIGZAG_HEIGHT * 2} style={{ display: 'block', overflow: 'hidden' }} preserveAspectRatio="none">
      <polyline
        points="0,0 10,10 20,0 30,10 40,0 50,10 60,0 70,10 80,0 90,10 100,0 110,10 120,0 130,10 140,0 150,10 160,0 170,10 180,0 190,10 200,0 210,10 220,0 230,10 240,0 250,10 260,0 270,10 280,0 290,10 300,0 310,10 320,0 330,10 340,0 350,10 360,0"
        fill="none"
        stroke="#d1cbbf"
        strokeWidth="1.5"
      />
      <polyline
        points="0,20 10,10 20,20 30,10 40,20 50,10 60,20 70,10 80,20 90,10 100,20 110,10 120,20 130,10 140,20 150,10 160,20 170,10 180,20 190,10 200,20 210,10 220,20 230,10 240,20 250,10 260,20 270,10 280,20 290,10 300,20 310,10 320,20 330,10 340,20 350,10 360,20"
        fill={fill}
        stroke="#d1cbbf"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function DashedDivider() {
  return <div className="border-t border-dashed border-neutral-300 my-2" />;
}

function StubRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between py-0.5">
      <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-neutral-400">{label}</span>
      <span className="font-mono text-[11px] font-semibold text-neutral-800">{value}</span>
    </div>
  );
}

export default function CardStub({ data, showHero = true }: CardStubProps) {
  const { outfitName, outfitStyleLine, heroImageUrl, creatorName, brands = [], pieces } = data;

  return (
    <div
      className="relative flex flex-col overflow-hidden"
      style={{
        width: 360,
        minHeight: 560,
        backgroundColor: '#faf7f0',
        fontFamily: 'var(--font-sharetech), "Share Tech Mono", monospace',
      }}
    >
      {/* Top zigzag (decorative) */}
      <ZigzagDivider fill="#faf7f0" />

      {/* Header */}
      <div className="px-6 pt-3 pb-2 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-neutral-500">FAI · Outfit</p>
        <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-neutral-400 mt-0.5">
          No. {data.schemeId?.slice(-4) ?? '1123'} / Ed. 01
        </p>
      </div>

      <DashedDivider />

      {/* Hero */}
      {showHero && (
        <>
          <div className="mx-6">
            {heroImageUrl ? (
              <img src={heroImageUrl} alt={outfitName} className="h-[160px] w-full object-cover border border-neutral-300" />
            ) : (
              <HeroPlaceholder mode="speckle" className="h-[160px] w-full border border-neutral-300" />
            )}
          </div>
          <DashedDivider />
        </>
      )}

      {/* Data rows */}
      <div className="flex-1 px-6">
        <StubRow label="Item" value={outfitName} />
        <StubRow label="By" value={creatorName ?? '—'} />
        <StubRow label="Category" value={outfitStyleLine} />
        <StubRow label="Brands" value={brands.join(' / ') || '—'} />
        {data.score !== undefined && <StubRow label="Score" value={`★ ${data.score} / 10`} />}
      </div>

      <DashedDivider />

      {/* Pieces */}
      <div className="px-6 pb-2">
        <p className="font-mono text-[9px] uppercase tracking-widest text-neutral-400 mb-1">-- Pieces --</p>
        {pieces.slice(0, 5).map((piece, i) => (
          <div key={piece.id} className="flex items-baseline justify-between py-0.5">
            <span className="font-mono text-[10px] font-bold uppercase text-neutral-800">
              {String(i + 1).padStart(2, '0')} {piece.name} · {piece.brand}
            </span>
            <span className="font-mono text-[9px] uppercase text-neutral-400">{piece.category ?? 'Std'}</span>
          </div>
        ))}
      </div>

      <DashedDivider />

      {/* Footer */}
      <div className="py-3 text-center">
        <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-400">
          Thank You · Keep This Stub
        </p>
      </div>

      {/* Bottom zigzag */}
      <ZigzagDivider fill="#faf7f0" />
    </div>
  );
}
