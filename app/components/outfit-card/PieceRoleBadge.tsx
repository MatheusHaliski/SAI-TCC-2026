import type { PieceRole } from '@/app/lib/outfit-card';

export const PAPEL_CONFIG: Record<
  PieceRole,
  { label: string; icon: string; pill: string; glow: string; description: string }
> = {
  ancora: {
    label: 'Âncora',
    icon: '◉',
    pill: 'border-blue-400/50 bg-blue-500/15 text-blue-200',
    glow: 'shadow-[0_0_10px_rgba(59,130,246,0.25)]',
    description: 'Define e segura o visual do look',
  },
  destaque: {
    label: 'Destaque',
    icon: '✦',
    pill: 'border-amber-400/50 bg-amber-500/15 text-amber-200',
    glow: 'shadow-[0_0_10px_rgba(245,158,11,0.25)]',
    description: 'O elemento que chama toda a atenção',
  },
  base: {
    label: 'Base',
    icon: '◻',
    pill: 'border-white/35 bg-white/10 text-white/75',
    glow: '',
    description: 'O alicerce discreto da composição',
  },
  contraste: {
    label: 'Contraste',
    icon: '◐',
    pill: 'border-fuchsia-400/50 bg-fuchsia-500/15 text-fuchsia-200',
    glow: 'shadow-[0_0_10px_rgba(217,70,239,0.25)]',
    description: 'Quebra a harmonia com intenção',
  },
  acento: {
    label: 'Acento',
    icon: '◆',
    pill: 'border-emerald-400/50 bg-emerald-500/15 text-emerald-200',
    glow: 'shadow-[0_0_10px_rgba(52,211,153,0.2)]',
    description: 'O detalhe final que assina o look',
  },
};

interface PieceRoleBadgeProps {
  papel: PieceRole;
  nota?: string;
}

export default function PieceRoleBadge({ papel, nota }: PieceRoleBadgeProps) {
  const config = PAPEL_CONFIG[papel];
  if (!config) return null;

  return (
    <div className="space-y-1">
      <span
        className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-wide ${config.pill} ${config.glow}`}
        title={config.description}
      >
        <span className="text-[9px]">{config.icon}</span>
        {config.label}
      </span>
      {nota?.trim() && (
        <p className="text-[10px] italic leading-snug text-white/55">"{nota.trim()}"</p>
      )}
    </div>
  );
}
