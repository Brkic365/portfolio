'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import StackWindow from '@/components/modals/StackWindow';
import TextEditorWindow from '@/components/modals/TextEditorWindow';
import DesktopItem from '../DesktopItem';
import DesktopClock from '../widgets/DesktopClock';
import { getFileById } from '@/data/filesystem';

// Module-level variable to track if README has been shown in this session
let hasShownReadme = false;

const HomeView = () => {
  const router = useRouter();
  const [isReadmeOpen, setIsReadmeOpen] = useState(false);
  const [isStackOpen, setIsStackOpen] = useState(false);

  const readmeFile = getFileById('readme');
  const readmeContent = readmeFile?.description || "";

  useEffect(() => {
    // Open on first load (refresh), but not on subsequent navigations back to home
    if (!hasShownReadme) {
      setIsReadmeOpen(true);
      hasShownReadme = true;
    }
  }, []);

  return (
    <>
      <div className="relative grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-12 md:gap-16 lg:gap-20 auto-rows-min">
        <DesktopClock />

        <DesktopItem
          icon="📝"
          label="README.md"
          onClick={() => setIsReadmeOpen(true)}
        />

        <DesktopItem
          icon="⚙️"
          label="System"
          onClick={() => setIsStackOpen(true)}
        />

        <DesktopItem
          icon="💾"
          label="Workspace"
          onClick={() => router.push('/projects')}
        />
      </div>

      <TextEditorWindow
        isOpen={isReadmeOpen}
        onClose={() => setIsReadmeOpen(false)}
        content={readmeContent}
      />

      <StackWindow
        isOpen={isStackOpen}
        onClose={() => setIsStackOpen(false)}
      />
    </>
  );
};

export default HomeView;
