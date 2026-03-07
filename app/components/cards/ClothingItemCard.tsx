interface ClothingItemCardProps {
  itemName: string;
  brand: string;
  price: string;
}

export default function ClothingItemCard({ itemName, brand, price }: ClothingItemCardProps) {
  return (
    <article className="rounded-2xl border border-white/15 bg-black/40 p-4 shadow-md">
      <div className="mb-3 h-28 rounded-xl bg-gradient-to-br from-zinc-300/40 via-zinc-700/70 to-black/90" />
      <h3 className="text-base font-semibold text-white">{itemName}</h3>
      <p className="text-sm text-white/65">{brand}</p>
      <div className="mt-3 flex items-center justify-between">
        <span className="text-sm font-medium text-white">{price}</span>
        <button className="rounded-lg border border-white/30 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-white hover:text-black">
          View Item
        </button>
      </div>
    </article>
  );
}
