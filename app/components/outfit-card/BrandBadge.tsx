'use client';

import { useState } from 'react';

const BRAND_COLORS: Record<string, { bg: string; border: string }> = {
  adidas:  { bg: 'rgba(148,163,184,0.25)', border: 'rgba(148,163,184,0.6)' },
  nike:    { bg: 'rgba(239,68,68,0.2)',    border: 'rgba(239,68,68,0.6)' },
  lacoste: { bg: 'rgba(16,185,129,0.2)',   border: 'rgba(16,185,129,0.6)' },
  puma:    { bg: 'rgba(249,115,22,0.2)',   border: 'rgba(249,115,22,0.6)' },
  zara:    { bg: 'rgba(124,58,237,0.2)',   border: 'rgba(124,58,237,0.6)' },
  hm:      { bg: 'rgba(219,39,119,0.2)',   border: 'rgba(219,39,119,0.6)' },
  'h&m':   { bg: 'rgba(219,39,119,0.2)',   border: 'rgba(219,39,119,0.6)' },
};

function fallbackColor(name: string): { bg: string; border: string } {
  const hash = name.toLowerCase().split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const hue = hash % 360;
  return {
    bg: `hsla(${hue},60%,60%,0.18)`,
    border: `hsla(${hue},70%,65%,0.55)`,
  };
}

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
    .map(w => w[0]?.toUpperCase())
    .join('') || 'BR';

  const colors = BRAND_COLORS[brandName.toLowerCase()] ?? fallbackColor(brandName);
  const isCompact = variant === 'compact';

  const avatarSize = isCompact ? '1.25rem' : '1.5rem';
  const fontSize = isCompact ? '0.6875rem' : '0.75rem';
  const padding = isCompact ? '0.2rem 0.5rem' : '0.3rem 0.75rem';

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.375rem',
        borderRadius: '9999px',
        border: `1.5px solid ${colors.border}`,
        background: colors.bg,
        padding,
        fontSize,
        fontWeight: 600,
        color: '#fff',
        backdropFilter: 'blur(6px)',
        maxWidth: '9rem',
        overflow: 'hidden',
      }}
    >
      {brandLogoUrl && !logoFailed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={brandLogoUrl}
          alt={`${brandName} logo`}
          style={{ width: avatarSize, height: avatarSize, borderRadius: '50%', objectFit: 'contain', flexShrink: 0 }}
          onError={() => setLogoFailed(true)}
        />
      ) : (
        <span
          style={{
            width: avatarSize, height: avatarSize,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.3)',
            background: 'rgba(255,255,255,0.15)',
            fontSize: '0.625rem', fontWeight: 700,
            flexShrink: 0,
          }}
        >
          {initials}
        </span>
      )}
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{brandName}</span>
    </span>
  );
}
