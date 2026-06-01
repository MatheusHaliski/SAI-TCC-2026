'use client';

import ContextSectionMenu from '@/app/components/navigation/ContextSectionMenu';
import { ProfileSectionKey } from '@/app/components/profile/types';
import { useEffect, useState } from 'react';

interface ProfileContextMenuProps {
  selectedSection: ProfileSectionKey;
  onSelectSection: (section: ProfileSectionKey) => void;
  allowedSections?: ProfileSectionKey[];
}

const sectionConfig: Array<{ key: ProfileSectionKey; label: string }> = [
  { key: 'wardrobe', label: 'Meu Guarda-roupa' },
  { key: 'user-info', label: 'Informações do usuário' },
  { key: 'my-schemes', label: 'Meus esquemas' },
  { key: 'saved-schemes', label: 'Esquemas salvos' },
  { key: 'my-posts', label: 'Minhas postagens' },
  { key: 'settings', label: 'Configurações' },
];

export default function ProfileContextMenu({ selectedSection, onSelectSection, allowedSections }: ProfileContextMenuProps) {
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
      ? item.label
      : ({ wardrobe: 'My Wardrobe', 'user-info': 'User Info', 'my-schemes': 'My Schemes', 'saved-schemes': 'Saved Schemes', 'my-posts': 'My Posts', settings: 'Settings' }[item.key] ?? item.label),
  }));
  const filteredConfig = allowedSections?.length
    ? localizedConfig.filter((item) => allowedSections.includes(item.key))
    : localizedConfig;

  const selectedLabel = filteredConfig.find((item) => item.key === selectedSection)?.label ?? filteredConfig[0]?.label ?? 'User Info';

  return (
    <ContextSectionMenu
      title="Menu do perfil"
      sections={filteredConfig.map((item) => item.label)}
      selectedSection={selectedLabel}
      onSelectSection={(label) => {
        const section = filteredConfig.find((item) => item.label === label);
        if (section) onSelectSection(section.key);
      }}
    />
  );
}
