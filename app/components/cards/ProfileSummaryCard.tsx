import StatBadge from '../shared/StatBadge';

interface ProfileSummaryCardProps {
  username: string;
  displayName: string;
  bio: string;
  loginEmail: string;
  loginStatus: string;
  authSource: string;
  brandSealTier?: string;
  brandSealStatus?: string;
  officialFeedEligible?: boolean;
  officialFeedUntil?: string | null;
}

export default function ProfileSummaryCard({
  username,
  displayName,
  bio,
  loginEmail,
  loginStatus,
  authSource,
  brandSealTier = 'none',
  brandSealStatus = 'inactive',
  officialFeedEligible = false,
  officialFeedUntil = null,
}: ProfileSummaryCardProps) {
  return (
    <article
      className="rounded-2xl border border-white/20 p-5 shadow-lg"
      style={{
        backgroundColor: '#0f172a',
        backgroundImage: 'var(--sidebar-gradient)',
        boxShadow: 'var(--drawer-surface-shadow)',
      }}
    >
      <div className="mb-4 flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/30 bg-white/10 text-xl text-white">
          {username.charAt(0).toUpperCase()}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">{displayName || `@${username}`}</h3>
          <p className="text-sm font-medium text-white/85">{bio || `@${username}`}</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <StatBadge label="Login" value={loginEmail} />
        <StatBadge label="Status" value={loginStatus} />
        <StatBadge label="Source" value={authSource} />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-100">
          {brandSealTier === 'premium' ? 'Selo Premium' : brandSealTier === 'free' ? 'Selo Gratuito' : 'Sem selo'}
        </span>
        <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-100">
          {brandSealStatus === 'active' ? 'Selo ativo' : brandSealStatus === 'pending' ? 'Aguardando validação' : brandSealStatus === 'expired' ? 'Selo expirado' : 'Selo inativo'}
        </span>
        <span className="rounded-full border border-violet-400/30 bg-violet-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-violet-100">
          {officialFeedEligible ? 'Feed oficial habilitado' : 'Feed oficial indisponível'}
        </span>
        {officialFeedUntil ? (
          <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-100">
            Destaque até {new Date(officialFeedUntil).toLocaleDateString('pt-BR')}
          </span>
        ) : null}
      </div>
    </article>
  );
}
