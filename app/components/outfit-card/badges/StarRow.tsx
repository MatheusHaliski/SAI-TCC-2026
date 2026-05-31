'use client';

import { useId } from 'react';

interface StarRowProps {
  value: number; // 0–5, half-star precision
  size?: number;
}

export default function StarRow({ value, size = 14 }: StarRowProps) {
  const uid = useId();

  return (
    <span
      role="img"
      aria-label={`Quality ${value.toFixed(1)} of 5`}
      className="inline-flex items-center gap-[2px]"
    >
      {Array.from({ length: 5 }, (_, i) => {
        const fill = Math.min(1, Math.max(0, value - i));
        const pct = `${Math.round(fill * 100)}%`;
        const gId = `${uid}s${i}`;
        return (
          <svg
            key={i}
            width={size}
            height={size}
            viewBox="0 0 14 14"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
          >
            <defs>
              <linearGradient id={gId} x1="0%" x2="100%" y1="0%" y2="0%">
                {/* Two stops at the same offset = hard edge, no blur — the half-fill trick */}
                <stop offset={pct} stopColor="#fbbf24" />
                <stop offset={pct} stopColor="rgba(255,255,255,0.18)" />
              </linearGradient>
            </defs>
            <polygon
              points="7,0.5 8.85,5 13.5,5.4 10,8.5 11.1,13 7,10.4 2.9,13 4,8.5 0.5,5.4 5.15,5"
              fill={`url(#${gId})`}
            />
          </svg>
        );
      })}
    </span>
  );
}
