interface StatBadgeProps {
  label: string;
  value: string;
}

export default function StatBadge({ label, value }: StatBadgeProps) {
  return (
    <div
      className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-center"
      style={{ color: '#ffffff' }}
    >
      <p className="text-xs uppercase tracking-wide" style={{ color: 'rgba(255,255,255,0.6)' }}>
        {label}
      </p>
      <p className="text-sm font-semibold" style={{ color: '#ffffff' }}>
        {value}
      </p>
    </div>
  );
}