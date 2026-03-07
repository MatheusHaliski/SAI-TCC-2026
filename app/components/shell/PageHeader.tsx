interface PageHeaderProps {
  title: string;
  subtitle: string;
}

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className="mb-5">
      <h2 className="text-2xl font-semibold text-white">{title}</h2>
      <p className="text-sm text-white/60">{subtitle}</p>
    </div>
  );
}
