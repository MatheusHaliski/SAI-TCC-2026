'use client';

import ContextSectionMenu from '@/app/components/navigation/ContextSectionMenu';
import { ProfileSectionKey } from '@/app/components/profile/types';
import { useEffect, useState } from 'react';

interface ProfileContextMenuProps {
  selectedSection: ProfileSectionKey;
  onSelectSection: (section: ProfileSectionKey) => void;
  allowedSections?: ProfileSectionKey[];
  /** RF6.CA01 — contadores exibidos ao lado do nome de cada aba. */
  counts?: Partial<Record<ProfileSectionKey, number>>;
}

const sectionConfig: Array<{ key: ProfileSectionKey; label: string }> = [
  { key: 'wardrobe', label: 'Digital Closet' },
  { key: 'user-info', label: 'User Info' },
  { key: 'style-dna', label: 'Style DNA' },
  { key: 'my-schemes', label: 'My Schemes' },
  { key: 'saved-schemes', label: 'Saved Looks' },
  { key: 'my-posts', label: 'My Posts' },
  { key: 'settings', label: 'Settings' },
];

export default function ProfileContextMenu({ selectedSection, onSelectSection, allowedSections, counts }: ProfileContextMenuProps) {
  const [isPortuguese, setIsPortuguese] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const refresh = () => setIsPortuguese(window.localStorage.getItem('sai-site-language') !== 'en');
    refresh();
    window.addEventListener('storage', refresh);
    window.addEventListener('sai-language-change', refresh as EventListener);
    return () => {
      window.removeEventListener('storage', refresh);
      window.removeEventListener('sai-language-change', refresh as EventListener);
    };
  }, []);

  const localizedConfig = sectionConfig.map((item) => ({
    ...item,
    label: isPortuguese
      ? ({ wardrobe: 'Closet Digital', 'user-info': 'Informações do usuário', 'style-dna': 'DNA de Estilo', 'my-schemes': 'Meus Esquemas', 'saved-schemes': 'Looks Salvos', 'my-posts': 'Minhas postagens', settings: 'Configurações' }[item.key])
      : item.label,
  })).map((item) => {
    const count = counts?.[item.key];
    return { ...item, label: typeof count === 'number' ? `${item.label} (${count})` : item.label };
  });
  const filteredConfig = allowedSections?.length
    ? localizedConfig.filter((item) => allowedSections.includes(item.key))
    : localizedConfig;

  const selectedLabel = filteredConfig.find((item) => item.key === selectedSection)?.label ?? filteredConfig[0]?.label ?? 'User Info';

  return (
    <ContextSectionMenu
      title={isPortuguese ? 'Menu do perfil' : 'Profile Menu'}
      sections={filteredConfig.map((item) => item.label)}
      selectedSection={selectedLabel}
      onSelectSection={(label) => {
        const section = filteredConfig.find((item) => item.label === label);
        if (section) onSelectSection(section.key);
      }}
    />
  );
}
