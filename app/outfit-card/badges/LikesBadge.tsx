'use client';

import { formatLikes } from '@/app/lib/pieces/format';

interface LikesBadgeProps {
  likes: number;
  liked: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export default function LikesBadge({ likes, liked, onToggle, disabled }: LikesBadgeProps) {
  return (
    <button
      type="button"
      aria-pressed={liked}
      aria-label={liked ? 'Remover curtida desta peça' : 'Curtir esta peça'}
      disabled={disabled}
      onClick={onToggle}
      className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300/50 disabled:opacity-50"
      style={{
        border: `1px solid ${liked ? 'rgba(244,63,94,0.65)' : 'rgba(244,63,94,0.38)'}`,
        background: liked ? 'rgba(244,63,94,0.22)' : 'rgba(244,63,94,0.09)',
        color: liked ? '#be123c' : '#e11d48',
      }}
    >
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill={liked ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
      {formatLikes(likes)}
    </button>
  );
}
