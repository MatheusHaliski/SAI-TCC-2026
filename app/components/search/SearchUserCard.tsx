interface SearchUserCardProps {
  name: string;
  username: string;
  descriptor?: string;
  avatarUrl?: string;
  brandSealTier?: string;
  brandSealStatus?: string;
  officialFeedEligible?: boolean;
  onOpenProfile: () => void;
}

export default function SearchUserCard({ name, username, descriptor, avatarUrl, brandSealTier, brandSealStatus, officialFeedEligible, onOpenProfile }: SearchUserCardProps) {
  return (
    <article
      role="button"
      tabIndex={0}
      onClick={onOpenProfile}
      onKeyDown={(event) => {
        if (event.key === 'Enter') onOpenProfile();
      }}
      className="cursor-pointer rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white transition hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/15"
    >
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 overflow-hidden rounded-full border border-white/30 bg-white/10">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatarUrl} alt={name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm font-semibold">{name.slice(0, 1)}</div>
          )}
        </div>
        <div className="min-w-0">
          <p className="truncate font-semibold">{name}</p>
          <p className="truncate text-sm text-white/70">@{username}</p>
        </div>
      </div>
      {descriptor ? <p className="mt-2 text-xs text-white/70">{descriptor}</p> : null}
      <div className="mt-2 flex flex-wrap gap-1.5">
        {brandSealTier && brandSealTier !== 'none' ? (
          <span className="rounded-full border border-amber-400/25 bg-amber-400/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-amber-100">
            {brandSealTier === 'premium' ? 'Selo Premium' : 'Selo Gratuito'}
          </span>
        ) : null}
        {officialFeedEligible ? (
          <span className="rounded-full border border-violet-400/25 bg-violet-400/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-violet-100">Feed oficial</span>
        ) : null}
        {brandSealStatus && brandSealStatus !== 'inactive' ? (
          <span className="rounded-full border border-cyan-400/25 bg-cyan-400/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-cyan-100">
            {brandSealStatus === 'active' ? 'Ativo' : brandSealStatus === 'pending' ? 'Validando' : 'Expirado'}
          </span>
        ) : null}
      </div>
    </article>
  );
}
