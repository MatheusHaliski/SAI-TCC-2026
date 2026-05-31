import { ReactNode } from 'react';

interface SectionBlockProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

export default function SectionBlock({ title, subtitle, action, children, className }: SectionBlockProps) {
  return (
    <section
      className={className ?? ''}
      style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: "1rem",
        padding: "1.5rem",
        boxShadow: "var(--shadow-sm)",
        marginBottom: "1.25rem",
      }}
    >
      <header style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.75rem", marginBottom: "1rem" }}>
        <div>
          <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--foreground)", margin: 0 }}>{title}</h2>
          {subtitle ? <p style={{ fontSize: "0.875rem", color: "var(--muted-foreground)", marginTop: "0.25rem" }}>{subtitle}</p> : null}
        </div>
        {action}
      </header>
      {children}
    </section>
  );
}
