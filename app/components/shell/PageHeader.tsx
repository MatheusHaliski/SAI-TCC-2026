interface PageHeaderProps {
  title: string;
  subtitle: string;
  className?: string;
}

export default function PageHeader({ title, subtitle, className }: PageHeaderProps) {
  return (
      <div className={`rounded-2xl px-6 py-4 shadow-lg ${className ?? ''}`} style={{ background: "var(--brand-gradient)", color: "#fff", marginBottom: "1rem" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#fff" }}>{title}</h2>
          <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.8)", marginTop: "0.25rem" }}>{subtitle}</p>
      </div>
  );
}
