import { ReactNode } from 'react';

interface IconButtonProps {
  label: string;
  icon: ReactNode;
}

export default function IconButton({ label, icon }: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-black/45 text-white/90 shadow-sm transition hover:border-white/40 hover:bg-black/60"
    >
      <span className="text-sm">{icon}</span>
    </button>
  );
}
