interface PageHeaderProps {
  title: string;
  subtitle: string;
}

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className="mt-0 bg-lime-500  w-[1000px] h-[80px] rounded-2xl border border-black">
      <h2 className="relative left-3 text-2xl font-semibold text-white">{title}</h2>
      <p className="relative left-3 text-sm text-white/60">{subtitle}</p>
    </div>
  );
}
