import ContextSectionItem from './ContextSectionItem';

interface ContextSectionMenuProps {
  title: string;
  sections: string[];
}

export default function ContextSectionMenu({ title, sections }: ContextSectionMenuProps) {
  return (
    <aside className="bg-blue-400 rounded-2xl border border-black shadow-lg backdrop-blur-sm lg:sticky lg:top-15 lg:h-fit">
      <p className="mt-5 text-xl font-semibold uppercase tracking-[0.2em] text-white">{title}</p>
      <ul className="space-y-2">
        {sections.map((section, index) => (
          <ContextSectionItem key={section} label={section} isActive={index === 0} />
        ))}
      </ul>
    </aside>
  );
}
