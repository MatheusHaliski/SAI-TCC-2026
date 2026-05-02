import Image from 'next/image';
import CompactCardActionBar from '@/app/components/profile/CompactCardActionBar';

interface WardrobeCompactCardProps {
  imageUrl: string;
  name: string;
  brand: string;
  pieceType: string;
  rarity: string;
  wearstyles: string[];
  visibility?: 'public' | 'private';
  onUseInTester?: () => void;
}

export default function WardrobeCompactCard({
  imageUrl,
  name,
  brand,
  pieceType,
  rarity,
  wearstyles,
  visibility = 'private',
  onUseInTester,
}: WardrobeCompactCardProps) {
  return (
    <article className="rounded-2xl border border-white/20 bg-gradient-to-br from-white/20 via-white/10 to-transparent p-3 shadow-[0_10px_35px_rgba(15,23,42,0.35)] backdrop-blur-md">
      <div className="flex gap-3">
        <Image src={imageUrl} alt={name} width={180} height={180} className="h-24 w-24 rounded-xl object-cover" unoptimized />
        <div className="min-w-0 flex-1">
          <h4 className="truncate text-sm font-semibold text-white">{name}</h4>
          <p className="text-xs text-cyan-100/90">{brand}</p>
          <div className="mt-2 flex flex-wrap gap-1.5 text-[11px]">
            <span className="rounded-full border border-white/30 px-2 py-0.5 text-white/90">{pieceType}</span>
            <span className="rounded-full border border-fuchsia-300/40 bg-fuchsia-500/20 px-2 py-0.5 text-fuchsia-100">{rarity}</span>
            <span className="rounded-full border border-emerald-300/40 bg-emerald-500/20 px-2 py-0.5 text-emerald-100">{visibility}</span>
          </div>
          {wearstyles.length ? <p className="mt-2 text-xs text-white/75">Wearstyles: {wearstyles.join(' · ')}</p> : null}
        </div>
      </div>
      <CompactCardActionBar
        actions={[
          { label: 'View details' },
          { label: 'Edit' },
          { label: 'Use in Dress Tester', onClick: onUseInTester, tone: 'accent' },
          { label: 'Add to Scheme' },
          { label: 'Delete', tone: 'danger' },
        ]}
      />
    </article>
  );
}
