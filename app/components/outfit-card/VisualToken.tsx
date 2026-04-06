import { PieceCategory } from '@/app/lib/outfit-card';

type VisualTokenType = 'wearstyle' | 'category' | 'rarity';

interface VisualTokenProps {
  type: VisualTokenType;
  value: string;
  compact?: boolean;
  showLabel?: boolean;
}

type ToneConfig = {
  container: string;
  glow: string;
  border: string;
  label: string;
};

function getWearstyleTone(value: string): ToneConfig {
  const normalized = value.trim().toLowerCase();

  if (normalized.includes('statement')) {
    return {
      container: 'bg-amber-500/15',
      glow: 'shadow-[0_0_22px_rgba(251,146,60,0.35)]',
      border: 'border-amber-300/60',
      label: 'text-amber-100',
    };
  }

  if (normalized.includes('visual anchor')) {
    return {
      container: 'bg-blue-500/15',
      glow: 'shadow-[0_0_20px_rgba(59,130,246,0.33)]',
      border: 'border-blue-300/60',
      label: 'text-blue-100',
    };
  }

  if (normalized.includes('street energy')) {
    return {
      container: 'bg-fuchsia-500/16',
      glow: 'shadow-[0_0_22px_rgba(236,72,153,0.38)]',
      border: 'border-rose-300/60',
      label: 'text-fuchsia-100',
    };
  }

  if (normalized.includes('style accent')) {
    return {
      container: 'bg-cyan-500/14',
      glow: 'shadow-[0_0_18px_rgba(34,211,238,0.34)]',
      border: 'border-cyan-300/65',
      label: 'text-cyan-100',
    };
  }

  return {
    container: 'bg-slate-400/10',
    glow: 'shadow-[0_0_14px_rgba(148,163,184,0.25)]',
    border: 'border-white/35',
    label: 'text-white/90',
  };
}

function getRarityTone(value: string): ToneConfig {
  const normalized = value.trim().toLowerCase() as Lowercase<PieceCategory>;

  if (normalized === 'premium') {
    return {
      container: 'bg-amber-500/15',
      glow: 'shadow-[0_0_24px_rgba(251,191,36,0.34)]',
      border: 'border-amber-300/60',
      label: 'text-amber-100',
    };
  }

  if (normalized.includes('limited')) {
    return {
      container: 'bg-violet-500/15',
      glow: 'shadow-[0_0_24px_rgba(168,85,247,0.34)]',
      border: 'border-violet-300/60',
      label: 'text-violet-100',
    };
  }

  if (normalized === 'rare') {
    return {
      container: 'bg-cyan-500/15',
      glow: 'shadow-[0_0_22px_rgba(34,211,238,0.32)]',
      border: 'border-cyan-300/60',
      label: 'text-cyan-100',
    };
  }

  return {
    container: 'bg-slate-400/10',
    glow: 'shadow-[0_0_14px_rgba(148,163,184,0.22)]',
    border: 'border-slate-200/55',
    label: 'text-slate-100',
  };
}

function ToneShape({ type, value }: { type: VisualTokenType; value: string }) {
  const normalized = value.trim().toLowerCase();

  if (type === 'category') {
    return <span className="h-2.5 w-6 rounded-full border border-white/45 bg-white/60" aria-hidden />;
  }

  if (type === 'rarity') {
    return (
      <span className="relative h-4 w-4" aria-hidden>
        <span className="absolute inset-0 rotate-45 rounded-[3px] border border-white/65 bg-white/35" />
        <span className="absolute inset-[3px] rotate-45 rounded-[2px] bg-white/85" />
      </span>
    );
  }

  if (normalized.includes('statement')) {
    return (
      <span className="relative h-4 w-4" aria-hidden>
        <span className="absolute inset-0 rotate-45 rounded-[3px] border border-white/75 bg-white/45" />
        <span className="absolute left-1/2 top-0 h-full w-[2px] -translate-x-1/2 bg-white/90" />
        <span className="absolute left-0 top-1/2 h-[2px] w-full -translate-y-1/2 bg-white/90" />
      </span>
    );
  }

  if (normalized.includes('visual anchor')) {
    return (
      <span className="relative h-4 w-4" aria-hidden>
        <span className="absolute inset-0 rotate-45 rounded-[3px] border border-white/80 bg-white/25" />
        <span className="absolute inset-[4px] rotate-45 rounded-[2px] bg-white/90" />
      </span>
    );
  }

  if (normalized.includes('street energy')) {
    return (
      <span className="relative h-4 w-4" aria-hidden>
        <span className="absolute left-[1px] top-[1px] h-[8px] w-[6px] -skew-x-12 rounded-[2px] bg-white/90" />
        <span className="absolute bottom-[1px] right-[1px] h-[8px] w-[6px] skew-x-12 rounded-[2px] bg-white/80" />
      </span>
    );
  }

  if (normalized.includes('style accent')) {
    return (
      <span className="relative h-4 w-4" aria-hidden>
        <span className="absolute left-1/2 top-[1px] h-[12px] w-[2px] -translate-x-1/2 bg-white/90" />
        <span className="absolute left-[1px] top-1/2 h-[2px] w-[12px] -translate-y-1/2 bg-white/90" />
        <span className="absolute inset-[4px] rounded-full bg-white/95" />
      </span>
    );
  }

  return <span className="h-2.5 w-2.5 rounded-full bg-white/85" aria-hidden />;
}

export default function VisualToken({ type, value, compact = false, showLabel = true }: VisualTokenProps) {
  const tone = type === 'wearstyle' ? getWearstyleTone(value) : getRarityTone(value);

  return (
    <span
      className={`group inline-flex items-center ${compact ? 'gap-1.5 rounded-lg px-1.5 py-1 text-[10px]' : 'gap-2 rounded-xl px-2.5 py-1.5 text-xs'} border backdrop-blur-md transition duration-300 hover:scale-[1.03] hover:saturate-125 ${tone.container} ${tone.border} ${tone.glow}`}
    >
      <span
        className={`relative inline-flex items-center justify-center rounded-md border border-white/35 bg-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.35)] ${compact ? 'h-5 w-5' : 'h-6 w-6'}`}
      >
        <ToneShape type={type} value={value} />
      </span>
      {showLabel ? <span className={`font-semibold tracking-wide ${tone.label}`}>{value}</span> : null}
    </span>
  );
}
