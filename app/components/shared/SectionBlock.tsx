import { ReactNode } from 'react';

interface SectionBlockProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
}

export default function SectionBlock({ title, subtitle, action, children }: SectionBlockProps) {
  return (
    <section className="sa-premium-gradient-surface-soft space-y-4 rounded-2xl border border-white/20 p-5 shadow-lg backdrop-blur-sm">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          {subtitle ? <p className="text-sm text-white/60">{subtitle}</p> : null}
        </div>
        {action}
      </header>
      {children}
    </section>
  );
}
