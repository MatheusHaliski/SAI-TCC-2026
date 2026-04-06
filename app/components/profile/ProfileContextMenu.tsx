'use client';

import ContextSectionMenu from '@/app/components/navigation/ContextSectionMenu';
import { ProfileSectionKey } from '@/app/components/profile/types';

interface ProfileContextMenuProps {
  selectedSection: ProfileSectionKey;
  onSelectSection: (section: ProfileSectionKey) => void;
}

const sectionConfig: Array<{ key: ProfileSectionKey; label: string }> = [
  { key: 'wardrobe', label: 'My Wardrobe' },
  { key: 'user-info', label: 'User Info' },
  { key: 'my-schemes', label: 'My Schemes' },
  { key: 'saved-schemes', label: 'Saved Schemes' },
  { key: 'my-posts', label: 'My Posts' },
  { key: 'settings', label: 'Settings' },
];

export default function ProfileContextMenu({ selectedSection, onSelectSection }: ProfileContextMenuProps) {
  const selectedLabel = sectionConfig.find((item) => item.key === selectedSection)?.label ?? sectionConfig[0].label;

  return (
    <ContextSectionMenu
      title="Profile Menu"
      sections={sectionConfig.map((item) => item.label)}
      selectedSection={selectedLabel}
      onSelectSection={(label) => {
        const section = sectionConfig.find((item) => item.label === label);
        if (section) onSelectSection(section.key);
      }}
    />
  );
}
