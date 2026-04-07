'use client';

import { useState } from 'react';

interface BrandBadgeProps {
  brandName: string;
  brandLogoUrl?: string;
  variant?: 'default' | 'compact';
}

export default function BrandBadge({ brandName, brandLogoUrl, variant = 'default' }: BrandBadgeProps) {
  const [logoFailed, setLogoFailed] = useState(false);
  const initials = brandName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((chunk) => chunk[0]?.toUpperCase())
    .join('') || 'BR';

  const pillClass = variant === 'compact' ? 'px-2 py-1 text-[10px]' : 'px-2.5 py-1.5 text-xs';
  const imageClass = variant === 'compact' ? 'h-5 w-5' : 'h-6 w-6';

  return (
    <span className={`inline-flex items-center gap-2 rounded-full border border-white/30 bg-[linear-gradient(120deg,rgba(6,182,212,0.25),rgba(139,92,246,0.2),rgba(250,204,21,0.2))] ${pillClass} text-white shadow-[0_0_24px_rgba(139,92,246,0.28)]`}>
      {brandLogoUrl && !logoFailed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={brandLogoUrl} alt={`${brandName} logo`} className={`${imageClass} rounded-full object-contain`} onError={() => setLogoFailed(true)} />
      ) : (
        <span className={`${imageClass} inline-flex items-center justify-center rounded-full border border-white/35 bg-white/15 text-[11px] font-bold`}>
          {initials}
        </span>
      )}
      <span className="max-w-28 truncate font-semibold">{brandName}</span>
    </span>
  );
}
