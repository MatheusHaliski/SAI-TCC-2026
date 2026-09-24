import type { OutfitBackgroundConfig } from '@/app/lib/outfit-card';

export type AuraLevelId = 'raw' | 'noticed' | 'rising' | 'heat' | 'vibrant' | 'iconic' | 'legendary';

export type AuraLevel = {
  id: AuraLevelId;
  name: string;
  minLikes: number;
  badge: string;
  badgeColor: string;
};

export const AURA_LEVELS: AuraLevel[] = [
  { id: 'raw',       name: 'RAW',       minLikes: 0,    badge: '',    badgeColor: 'rgba(148,163,184,0.6)' },
  { id: 'noticed',   name: 'NOTICED',   minLikes: 10,   badge: '✦',   badgeColor: 'rgba(226,232,240,0.85)' },
  { id: 'rising',    name: 'RISING',    minLikes: 50,   badge: '◈',   badgeColor: '#38bdf8' },
  { id: 'heat',      name: 'HEAT',      minLikes: 100,  badge: '🔥',   badgeColor: '#f97316' },
  { id: 'vibrant',   name: 'VIBRANT',   minLikes: 300,  badge: '✦',   badgeColor: '#a855f7' },
  { id: 'iconic',    name: 'ICONIC',    minLikes: 1000, badge: '★',   badgeColor: '#fbbf24' },
  { id: 'legendary', name: 'LEGENDARY', minLikes: 5000, badge: '👑',   badgeColor: '#d4af37' },
];

export function getAuraLevel(likes: number): AuraLevel {
  let current = AURA_LEVELS[0]!;
  for (const level of AURA_LEVELS) {
    if (likes >= level.minLikes) current = level;
  }
  return current;
}

export function getNextAuraLevel(likes: number): AuraLevel | null {
  const currentIndex = AURA_LEVELS.findIndex((l) => l.id === getAuraLevel(likes).id);
  return AURA_LEVELS[currentIndex + 1] ?? null;
}

export function getAuraProgressPercent(likes: number): number {
  const current = getAuraLevel(likes);
  const next = getNextAuraLevel(likes);
  if (!next) return 100;
  const range = next.minLikes - current.minLikes;
  const progress = likes - current.minLikes;
  return Math.round((progress / range) * 100);
}

type CSSProperties = Record<string, string | number>;

export function buildAuraCardStyle(level: AuraLevel): CSSProperties {
  switch (level.id) {
    case 'raw':
      return {};

    case 'noticed':
      return {
        boxShadow: '0 0 0 1px rgba(226,232,240,0.22), 0 4px 16px rgba(226,232,240,0.08)',
      };

    case 'rising':
      return {
        boxShadow: '0 0 0 1.5px rgba(56,189,248,0.45), 0 4px 20px rgba(56,189,248,0.15)',
      };

    case 'heat':
      return {
        boxShadow: '0 0 0 2px rgba(249,115,22,0.70), 0 6px 28px rgba(239,68,68,0.30)',
        animation: 'aura-heat-pulse 3s ease-in-out infinite',
      };

    case 'vibrant':
      return {
        boxShadow: '0 0 0 2px transparent, 0 8px 32px rgba(168,85,247,0.35)',
        backgroundOrigin: 'border-box',
        animation: 'aura-vibrant-rotate 6s linear infinite',
        outline: '2px solid transparent',
        outlineOffset: '2px',
      };

    case 'iconic':
      return {
        boxShadow: '0 0 0 2px rgba(251,191,36,0.60), 0 8px 40px rgba(251,191,36,0.25), 0 0 60px rgba(251,191,36,0.10)',
        animation: 'aura-iconic-shimmer 4s ease-in-out infinite',
      };

    case 'legendary':
      return {
        boxShadow: '0 0 0 2px rgba(212,175,55,0.70), 0 12px 48px rgba(212,175,55,0.30)',
        animation: 'aura-legendary-holo 3s linear infinite',
      };

    default:
      return {};
  }
}

export function buildAuraBackgroundOverride(level: AuraLevel): OutfitBackgroundConfig | null {
  switch (level.id) {
    case 'heat':
      return {
        background_mode: 'gradient',
        gradient: {
          type: 'linear',
          angle: 145,
          intensity: 110,
          stops: [
            { color: '#431407', position: 0 },
            { color: '#9a3412', position: 40 },
            { color: '#f97316', position: 75 },
            { color: '#fbbf24', position: 100 },
          ],
        },
        shape: 'beams',
      };

    case 'vibrant':
      return {
        background_mode: 'gradient',
        gradient: {
          type: 'conic',
          angle: 0,
          intensity: 110,
          stops: [
            { color: '#7c3aed', position: 0 },
            { color: '#ec4899', position: 50 },
            { color: '#f59e0b', position: 100 },
          ],
        },
        shape: 'orb',
      };

    case 'iconic':
      return {
        background_mode: 'gradient',
        gradient: {
          type: 'radial',
          angle: 0,
          intensity: 115,
          stops: [
            { color: '#451a03', position: 0 },
            { color: '#78350f', position: 40 },
            { color: '#d97706', position: 75 },
            { color: '#fbbf24', position: 100 },
          ],
        },
        shape: 'stars',
      };

    case 'legendary':
      return {
        background_mode: 'gradient',
        gradient: {
          type: 'linear',
          angle: 135,
          intensity: 115,
          stops: [
            { color: '#1c1400', position: 0 },
            { color: '#3d2e00', position: 35 },
            { color: '#d4af37', position: 70 },
            { color: '#fef3c7', position: 100 },
          ],
        },
        shape: 'diamonds' as never,
      };

    default:
      return null;
  }
}

export const AURA_CSS_KEYFRAMES = `
@keyframes aura-heat-pulse {
  0%, 100% { box-shadow: 0 0 0 2px rgba(249,115,22,0.70), 0 6px 28px rgba(239,68,68,0.30); }
  50%       { box-shadow: 0 0 0 3px rgba(249,115,22,0.90), 0 8px 40px rgba(239,68,68,0.55); }
}

@keyframes aura-vibrant-rotate {
  0%   { filter: hue-rotate(0deg)   saturate(1.2); }
  100% { filter: hue-rotate(360deg) saturate(1.4); }
}

@keyframes aura-iconic-shimmer {
  0%, 100% { filter: brightness(1.0) saturate(1.1); }
  50%       { filter: brightness(1.15) saturate(1.3); }
}

@keyframes aura-legendary-holo {
  0%   { filter: hue-rotate(0deg)   brightness(1.0) saturate(1.2); }
  33%  { filter: hue-rotate(30deg)  brightness(1.12) saturate(1.4); }
  66%  { filter: hue-rotate(-20deg) brightness(1.06) saturate(1.3); }
  100% { filter: hue-rotate(0deg)   brightness(1.0) saturate(1.2); }
}

@keyframes aura-particle-float {
  0%        { transform: translateY(0px)   opacity(0.6); }
  50%       { transform: translateY(-12px) opacity(1.0); }
  100%      { transform: translateY(-24px) opacity(0);   }
}

@keyframes aura-level-up {
  0%   { transform: scale(1);    opacity: 1; }
  50%  { transform: scale(1.04); opacity: 0.9; }
  100% { transform: scale(1);    opacity: 1; }
}
`;
