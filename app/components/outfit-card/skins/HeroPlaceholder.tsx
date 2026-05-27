interface HeroPlaceholderProps {
  mode: 'soft' | 'hard' | 'frame' | 'speckle' | 'window';
  label?: string;
  className?: string;
}

export default function HeroPlaceholder({ mode, label = 'HERO PREVIEW', className = '' }: HeroPlaceholderProps) {
  if (mode === 'hard') {
    return (
      <div className={`relative flex items-end bg-neutral-800 ${className}`}>
        <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
          <line x1="0" y1="0" x2="100%" y2="100%" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
          <line x1="100%" y1="0" x2="0" y2="100%" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
        </svg>
        <span className="relative z-10 px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-white/40">{label}</span>
      </div>
    );
  }

  if (mode === 'frame') {
    return (
      <div className={`relative flex items-end bg-neutral-900 ${className}`}>
        <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
          <line x1="0" y1="0" x2="100%" y2="100%" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
          <line x1="100%" y1="0" x2="0" y2="100%" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
          {/* Registration corner marks */}
          <line x1="8" y1="0" x2="8" y2="20" stroke="rgba(255,255,255,0.55)" strokeWidth="1.5" />
          <line x1="0" y1="8" x2="20" y2="8" stroke="rgba(255,255,255,0.55)" strokeWidth="1.5" />
          <line x1="calc(100% - 8px)" y1="0" x2="calc(100% - 8px)" y2="20" stroke="rgba(255,255,255,0.55)" strokeWidth="1.5" />
          <line x1="calc(100% - 20px)" y1="8" x2="100%" y2="8" stroke="rgba(255,255,255,0.55)" strokeWidth="1.5" />
          <line x1="8" y1="100%" x2="8" y2="calc(100% - 20px)" stroke="rgba(255,255,255,0.55)" strokeWidth="1.5" />
          <line x1="0" y1="calc(100% - 8px)" x2="20" y2="calc(100% - 8px)" stroke="rgba(255,255,255,0.55)" strokeWidth="1.5" />
          <line x1="calc(100% - 8px)" y1="100%" x2="calc(100% - 8px)" y2="calc(100% - 20px)" stroke="rgba(255,255,255,0.55)" strokeWidth="1.5" />
          <line x1="calc(100% - 20px)" y1="calc(100% - 8px)" x2="100%" y2="calc(100% - 8px)" stroke="rgba(255,255,255,0.55)" strokeWidth="1.5" />
        </svg>
        <span className="relative z-10 px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-white/35">{label}</span>
      </div>
    );
  }

  if (mode === 'speckle') {
    return (
      <div className={`relative flex items-end overflow-hidden bg-neutral-100 ${className}`}>
        <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
          <pattern id="speckle" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
            <circle cx="4" cy="4" r="1" fill="rgba(0,0,0,0.15)" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#speckle)" />
          <line x1="0" y1="0" x2="100%" y2="100%" stroke="rgba(0,0,0,0.12)" strokeWidth="1" />
          <line x1="100%" y1="0" x2="0" y2="100%" stroke="rgba(0,0,0,0.12)" strokeWidth="1" />
        </svg>
        <span className="relative z-10 px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-black/35">{label}</span>
      </div>
    );
  }

  if (mode === 'window') {
    return (
      <div className={`relative flex items-end bg-[#1a1a1a] ${className}`}>
        <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
          <line x1="0" y1="0" x2="100%" y2="100%" stroke="rgba(249,115,22,0.25)" strokeWidth="1" />
          <line x1="100%" y1="0" x2="0" y2="100%" stroke="rgba(249,115,22,0.25)" strokeWidth="1" />
        </svg>
        <span className="relative z-10 px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-orange-500/60">{label}</span>
      </div>
    );
  }

  // soft (default)
  return (
    <div className={`relative flex items-end bg-neutral-100 ${className}`}>
      <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
        <line x1="0" y1="0" x2="100%" y2="100%" stroke="rgba(0,0,0,0.10)" strokeWidth="1" />
        <line x1="100%" y1="0" x2="0" y2="100%" stroke="rgba(0,0,0,0.10)" strokeWidth="1" />
      </svg>
      <span className="relative z-10 px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-black/30">{label}</span>
    </div>
  );
}
