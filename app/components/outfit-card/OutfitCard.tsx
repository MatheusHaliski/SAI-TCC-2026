import OutfitHeroImage from '@/app/components/outfit-card/OutfitHeroImage';
import OutfitHeader from '@/app/components/outfit-card/OutfitHeader';
import OutfitPieceList from '@/app/components/outfit-card/OutfitPieceList';
import { OutfitCardData, buildOutfitDescriptionFallback } from '@/app/lib/outfit-card';

interface GeneratedOutfitCardProps {
  data: OutfitCardData;
}

export default function OutfitCard({ data }: GeneratedOutfitCardProps) {
  const description = data.outfitDescription?.trim() || buildOutfitDescriptionFallback({
    pieces: data.pieces,
    outfitStyleLine: data.outfitStyleLine,
  });

  return (
    <section className="space-y-4 rounded-3xl border border-slate-200/70 bg-gradient-to-b from-slate-50 to-white p-4 shadow-[0_12px_45px_rgba(15,23,42,0.08)] sm:p-6">
      <OutfitHeroImage src={data.heroImageUrl} alt={`${data.outfitName} hero preview`} />
      <OutfitHeader
        outfitName={data.outfitName}
        outfitStyleLine={data.outfitStyleLine}
        description={description}
      />
      <OutfitPieceList pieces={data.pieces} />
    </section>
  );
}
