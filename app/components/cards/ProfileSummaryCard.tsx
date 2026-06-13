import StatBadge from '../shared/StatBadge';
import FollowControl from '../profile/FollowControl';

interface ProfileSummaryCardProps {
  username: string;
  displayName: string;
  bio: string;
  loginEmail: string;
  loginStatus: string;
  authSource: string;
  /** Viewed profile id — enables the follower counter / follow button when provided. */
  targetUserId?: string;
  /** Authenticated viewer id. */
  viewerId?: string;
  /** True when the viewer is looking at their own profile. */
  isOwnerView?: boolean;
}

export default function ProfileSummaryCard({
  username,
  displayName,
  bio,
  loginEmail,
  loginStatus,
  authSource,
  targetUserId,
  viewerId,
  isOwnerView,
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
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-white/30 bg-white/10 text-xl text-white">
            {username.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-lg font-semibold text-white">{displayName || `@${username}`}</h3>
            <p className="truncate text-sm font-medium text-white/85">{bio || `@${username}`}</p>
          </div>
        </div>

        {targetUserId ? (
          <FollowControl
            targetUserId={targetUserId}
            viewerId={viewerId ?? ''}
            isOwnerView={Boolean(isOwnerView)}
          />
        ) : null}
      </div>
      <div className="grid grid-cols-3 gap-3">
        <StatBadge label="Login" value={loginEmail} />
        <StatBadge label="Status" value={loginStatus} />
        <StatBadge label="Source" value={authSource} />
      </div>
    </article>
  );
}
