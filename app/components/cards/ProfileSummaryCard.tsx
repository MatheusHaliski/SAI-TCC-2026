import StatBadge from '../shared/StatBadge';

interface ProfileSummaryCardProps {
  username: string;
  loginEmail: string;
  loginStatus: string;
  authSource: string;
}

export default function ProfileSummaryCard({ username, loginEmail, loginStatus, authSource }: ProfileSummaryCardProps) {
  return (
    <article className="bg-orange-600 rounded-2xl border border-white/20 p-5 shadow-lg">
      <div className="mb-4 flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/30 bg-white/10 text-xl text-white">
          {username.charAt(0).toUpperCase()}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">@{username}</h3>
          <p className="text-sm text-white/60">StylistAI Creator</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <StatBadge label="Login" value={loginEmail} />
        <StatBadge label="Status" value={loginStatus} />
        <StatBadge label="Source" value={authSource} />
      </div>
    </article>
  );
}
