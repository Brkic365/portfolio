'use client';

import Image from 'next/image';
import { ExternalLink, Github } from 'lucide-react';
import { Project, LabItem } from '@/data/projects';
import Window from '../ui/Window';

interface OSWindowProps {
  item: Project | LabItem;
  isOpen: boolean;
  onClose: () => void;
}

const OSWindow = ({ item, isOpen, onClose }: OSWindowProps) => {
  const isProject = 'coverImage' in item;

  return (
    <Window
      title={isProject ? (item as Project).name : (item as LabItem).name}
      isOpen={isOpen}
      onClose={onClose}
      initialSize={{ width: 900, height: 700 }}
      center
    >
      <div className="h-full flex flex-col overflow-y-auto">
        {/* Hero Image/Icon */}
        {/* Hero Image/Icon */}
        <div className="shrink-0 aspect-video bg-slate-800/50 flex items-center justify-center text-8xl border-b border-white/5 relative overflow-hidden">
          {item.previewVideo ? (
            <video
              src={item.previewVideo}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            />
          ) : item.coverImage?.startsWith('/') ? (
            <Image
              src={item.coverImage}
              alt={`${item.name} cover`}
              fill
              sizes="(max-width: 900px) 100vw, 900px"
              className="object-cover"
            />
          ) : (
            <span>{item.coverImage || (isProject ? '📦' : '💻')}</span>
          )}
        </div>

        {/* Body */}
        <div className="p-8 lg:p-10 bg-slate-900/50">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-100 mb-8" style={{ marginBottom: '1rem' }}>
            {isProject ? (item as Project).name : (item as LabItem).name}
          </h2>
          <p className="text-slate-300 leading-relaxed mb-10">{item.description}</p>

          {/* Tech Stack */}
          <div className="mb-8">
            <h3
              className="text-lg font-semibold text-slate-100"
              style={{ marginBottom: '1rem', marginTop: '1rem' }} // Force spacing
            >
              Tech Stack
            </h3>
            <div className="flex flex-wrap gap-4" style={{ marginBottom: '1rem' }}>
              {item.techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm text-slate-300 font-[family-name:var(--font-jetbrains-mono)]"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-white/10">
            {isProject && (item as Project).liveUrl && (
              <a
                href={(item as Project).liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium"
              >
                <ExternalLink size={18} />
                Launch App
              </a>
            )}
            {!isProject && (item as LabItem).liveUrl && (
              <a
                href={(item as LabItem).liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium"
              >
                <ExternalLink size={18} />
                Launch App
              </a>
            )}
            {item.githubUrl && item.githubUrl !== '' && (
              <a
                href={item.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 rounded-lg transition-colors font-medium"
              >
                <Github size={18} />
                View Code
              </a>
            )}
            {!isProject && (item as LabItem).demoUrl && (
              <a
                href={(item as LabItem).demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium"
              >
                <ExternalLink size={18} />
                View Demo
              </a>
            )}
          </div>
        </div>
      </div>
    </Window>
  );
};

export default OSWindow;
