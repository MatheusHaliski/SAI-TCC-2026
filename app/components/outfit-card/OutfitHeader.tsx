interface OutfitHeaderProps {
  outfitName: string;
  outfitStyleLine: string;
  description: string;
}

export default function OutfitHeader({ outfitName, outfitStyleLine, description }: OutfitHeaderProps) {
  return (
    <header className="space-y-2 rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-sm">
      <h3 className="truncate text-xl font-semibold text-slate-900 sm:text-2xl">{outfitName}</h3>
      <p className="text-sm font-medium text-slate-600">{outfitStyleLine}</p>
      <p className="text-sm leading-relaxed text-slate-700">{description}</p>
    </header>
  );
}
