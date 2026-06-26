'use client';

import { useMemo, useState } from 'react';
import ContextSectionItem from './ContextSectionItem';

interface ContextSectionMenuProps {
  title: string;
  sections: string[];
  selectedSection?: string;
  onSelectSection?: (section: string) => void;
}

export default function ContextSectionMenu({ title, sections, selectedSection, onSelectSection }: ContextSectionMenuProps) {
    const [internalSelectedSection, setInternalSelectedSection] = useState(sections[0] ?? '');
    const activeSection = selectedSection ?? internalSelectedSection;

    const orderedSections = useMemo(() => {
        if (!activeSection) return sections;
        return [
            activeSection,
            ...sections.filter((section) => section !== activeSection),
        ];
    }, [activeSection, sections]);

    return (
        <aside style={{ background:"var(--element-surface, var(--card))", border:"1px solid var(--element-surface-border, var(--border))", borderRadius:"1rem", padding:"1rem", boxShadow:"var(--shadow-sm)" }} className="lg:sticky lg:top-0 lg:h-fit">
            <p style={{ marginBottom:"1rem", fontSize:"0.8125rem", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.12em", color:"var(--muted-foreground)" }}>
                {title}
            </p>
            <ul className="space-y-2">
                {orderedSections.map((section, index) => (
                    <ContextSectionItem
                        key={section}
                        label={section}
                        isActive={index === 0}
                        onSelect={() => {
                            onSelectSection?.(section);
                            if (!onSelectSection) {
                                setInternalSelectedSection(section);
                            }
                        }}
                    />
                ))}
            </ul>
        </aside>
    );
}
