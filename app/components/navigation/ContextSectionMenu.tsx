import ContextSectionItem from './ContextSectionItem';

interface ContextSectionMenuProps {
  title: string;
  sections: string[];
}

export default function ContextSectionMenu({ title, sections }: ContextSectionMenuProps) {
    return (
        <aside className="sa-surface-context rounded-2xl border-8 border-orange-500 p-4 backdrop-blur-sm lg:sticky lg:top-16 lg:h-fit">
            <p className="mb-4 text-xl font-semibold uppercase tracking-[0.2em] text-white">
                {title}
            </p>
            <ul className="space-y-2">
                {sections.map((section, index) => (
                    <ContextSectionItem key={section} label={section} isActive={index === 0} />
                ))}
            </ul>
        </aside>
    );
}