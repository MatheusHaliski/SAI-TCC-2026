interface OutfitCardProps {
  title: string;
  category: string;
  rating: string;
  username: string;
}

export default function OutfitCard({ title, category, rating, username }: OutfitCardProps) {
  return (
    <article className="overflow-hidden rounded-2xl border border-white/15 bg-black/35 shadow-md">
      <div className="h-36 bg-gradient-to-br from-zinc-500/50 via-zinc-700/60 to-black/90" />
      <div className="space-y-2 p-4">
        <h3 className="font-semibold text-white">{title}</h3>
        <p className="text-sm text-white/65">{category}</p>
        <div className="flex items-center justify-between text-xs text-white/70">
          <span>Score {rating}</span>
          <span>@{username}</span>
        </div>
      </div>
    </article>
  );
}
