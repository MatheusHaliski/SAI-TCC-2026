interface PageHeaderProps {
  title: string;
  subtitle: string;
}

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className="mt-0 w-full rounded-2xl border border-black bg-lime-500 px-4 py-3">
      <h2 className="text-2xl font-semibold text-white">{title}</h2>
      <p className="text-sm text-white/60">{subtitle}</p>
    </div>
  );
}
