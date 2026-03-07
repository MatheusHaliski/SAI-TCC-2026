import ContextSectionItem from './ContextSectionItem';

interface ContextSectionMenuProps {
  title: string;
  sections: string[];
}

export default function ContextSectionMenu({ title, sections }: ContextSectionMenuProps) {
  return (
    <aside className="sa-premium-gradient-surface-soft rounded-2xl border border-white/20 p-4 shadow-lg backdrop-blur-sm lg:sticky lg:top-24 lg:h-fit">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/60">{title}</p>
      <ul className="space-y-2">
        {sections.map((section, index) => (
          <ContextSectionItem key={section} label={section} isActive={index === 0} />
        ))}
      </ul>
    </aside>
  );
}
