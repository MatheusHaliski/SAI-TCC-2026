'use client';

import ContextSectionMenu from '@/app/components/navigation/ContextSectionMenu';
import { ProfileSectionKey } from '@/app/components/profile/types';

interface ProfileContextMenuProps {
  selectedSection: ProfileSectionKey;
  onSelectSection: (section: ProfileSectionKey) => void;
  allowedSections?: ProfileSectionKey[];
}

const sectionConfig: Array<{ key: ProfileSectionKey; label: string }> = [
  { key: 'wardrobe', label: 'My Wardrobe Pieces' },
  { key: 'user-info', label: 'User Info' },
  { key: 'my-schemes', label: 'My Schemes' },
  { key: 'saved-schemes', label: 'Saved Schemes' },
  { key: 'my-posts', label: 'My Posts' },
  { key: 'settings', label: 'Settings' },
];

export default function ProfileContextMenu({ selectedSection, onSelectSection, allowedSections }: ProfileContextMenuProps) {
  const filteredConfig = allowedSections?.length
    ? sectionConfig.filter((item) => allowedSections.includes(item.key))
    : sectionConfig;

  const selectedLabel = filteredConfig.find((item) => item.key === selectedSection)?.label ?? filteredConfig[0]?.label ?? 'User Info';

  return (
    <ContextSectionMenu
      title="Profile Menu"
      sections={filteredConfig.map((item) => item.label)}
      selectedSection={selectedLabel}
      onSelectSection={(label) => {
        const section = filteredConfig.find((item) => item.label === label);
        if (section) onSelectSection(section.key);
      }}
    />
  );
}
