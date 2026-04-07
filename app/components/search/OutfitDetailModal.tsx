import OutfitCard from '@/app/components/outfit-card/OutfitCard';
import { OutfitCardData } from '@/app/lib/outfit-card';

interface OutfitDetailModalProps {
  open: boolean;
  data: OutfitCardData | null;
  onClose: () => void;
}

export default function OutfitDetailModal({ open, data, onClose }: OutfitDetailModalProps) {
  if (!open || !data) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl" onClick={(event) => event.stopPropagation()}>
        <div className="mb-3 flex justify-end">
          <button type="button" onClick={onClose} className="rounded-xl border border-white/30 bg-white/15 px-3 py-2 text-xs font-semibold text-white">
            Close ✕
          </button>
        </div>
        <OutfitCard data={data} variant="default" />
        <div className="mt-3 grid gap-2 rounded-2xl border border-white/20 bg-white/10 p-3 text-xs text-white/90 sm:grid-cols-2">
          <button type="button" className="rounded-xl border border-white/30 bg-white/10 px-3 py-2">Save to favorites</button>
          <button type="button" className="rounded-xl border border-white/30 bg-white/10 px-3 py-2">View creator profile</button>
          <button type="button" className="rounded-xl border border-white/30 bg-white/10 px-3 py-2">Use as inspiration</button>
          <button type="button" className="rounded-xl border border-white/30 bg-white/10 px-3 py-2">Open in Dress Tester</button>
        </div>
      </div>
    </div>
  );
}
