interface OutfitMetaBadgeProps {
  icon?: string;
  label: string;
}

export default function OutfitMetaBadge({ icon, label }: OutfitMetaBadgeProps) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-200/45 bg-white/70 px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-[0_0_24px_rgba(139,92,246,0.18)] backdrop-blur-md">
      {icon ? <span aria-hidden className="text-sm leading-none">{icon}</span> : null}
      <span>{label}</span>
    </span>
  );
}
