interface CompactCardActionBarProps {
  actions: Array<{
    label: string;
    onClick?: () => void;
    tone?: 'default' | 'danger' | 'accent';
  }>;
}

const TONE_STYLES: Record<'default' | 'danger' | 'accent', React.CSSProperties> = {
  default: {
    border: '1px solid rgba(255,255,255,0.25)',
    background: 'rgba(255,255,255,0.1)',
    color: '#fff',
  },
  danger: {
    border: '1px solid rgba(239,68,68,0.4)',
    background: 'rgba(239,68,68,0.12)',
    color: '#fca5a5',
  },
  accent: {
    border: '1px solid rgba(124,58,237,0.4)',
    background: 'rgba(124,58,237,0.15)',
    color: '#c4b5fd',
  },
};

export default function CompactCardActionBar({ actions }: CompactCardActionBarProps) {
  return (
    <div style={{ marginTop: '0.75rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
      {actions.map(action => (
        <button
          key={action.label}
          type="button"
          onClick={action.onClick}
          style={{
            borderRadius: '0.5rem',
            padding: '0.3125rem 0.625rem',
            fontSize: '0.75rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'opacity 0.15s',
            fontFamily: 'inherit',
            ...TONE_STYLES[action.tone ?? 'default'],
          }}
        >
          {action.label}
        </button>
      ))}
    </div>
  );
}
