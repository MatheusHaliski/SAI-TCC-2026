interface CategoryCardProps {
  name: string;
  description: string;
  onExplore: () => void;
}

export default function CategoryCard({ name, description, onExplore }: CategoryCardProps) {
  return (
    <article className="space-y-3 rounded-2xl border border-white/15 bg-black/40 p-4 shadow-md">
      <div className="h-28 rounded-xl bg-gradient-to-br from-neutral-400/45 to-neutral-900/85" />
      <h3 className="text-base font-semibold text-white">{name}</h3>
      <p className="text-sm text-white/65">{description}</p>
      <button
        type="button"
        onClick={onExplore}
        className="rounded-lg border border-white/30 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-white hover:text-black"
      >
        Explore Looks
      </button>
    </article>
  );
}
