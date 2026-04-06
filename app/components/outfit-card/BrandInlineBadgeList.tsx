interface BrandInlineBadgeListProps {
  brands: string[];
}

export default function BrandInlineBadgeList({ brands }: BrandInlineBadgeListProps) {
  if (!brands.length) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {brands.slice(0, 4).map((brand) => (
        <span
          key={brand}
          className="inline-flex items-center rounded-full border border-violet-200/45 bg-white/70 px-2.5 py-1 text-[11px] font-semibold text-slate-700 shadow-[0_0_24px_rgba(139,92,246,0.16)] backdrop-blur-md"
        >
          {brand}
        </span>
      ))}
    </div>
  );
}
