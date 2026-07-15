'use client';

import { useState } from 'react';
import DirectoryView from '@/components/views/DirectoryView';
import OSWindow from '@/components/modals/OSWindow';
import { FileItem, getDirectoryContents } from '@/data/filesystem';
import { Project, LabItem } from '@/data/projects';

interface DirectoryScreenProps {
  type: 'projects' | 'prototypes';
}

const DirectoryScreen = ({ type }: DirectoryScreenProps) => {
  const items = getDirectoryContents(type === 'projects' ? '/projects' : '/prototypes');
  const [selectedItem, setSelectedItem] = useState<FileItem | null>(null);

  return (
    <>
      <DirectoryView items={items} type={type} onItemClick={setSelectedItem} />
      {selectedItem && (
        <OSWindow
          item={selectedItem as unknown as Project | LabItem}
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </>
  );
};

export default DirectoryScreen;
