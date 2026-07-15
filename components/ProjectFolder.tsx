'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Project } from '@/data/projects';

interface ProjectFolderProps {
  project: Project;
  onClick: () => void;
}

const ProjectFolder = ({ project, onClick }: ProjectFolderProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="glass-panel rounded-2xl overflow-hidden cursor-pointer group flex flex-col"
    >
      {/* Cover Image - 16:9 Aspect Ratio */}
      <div className="w-full aspect-video bg-gradient-to-br from-slate-800/50 via-slate-900/50 to-blue-950/30 flex items-center justify-center text-7xl border-b border-white/5 relative overflow-hidden">
        {/* Client / Personal badge */}
        <span
          className={`absolute top-3 left-3 z-10 px-2 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider backdrop-blur-md border ${
            project.client
              ? 'bg-emerald-500/20 border-emerald-400/30 text-emerald-200'
              : 'bg-white/10 border-white/20 text-slate-200'
          }`}
        >
          {project.client ? 'Client' : 'Personal'}
        </span>
        {project.previewVideo ? (
          <video
            src={project.previewVideo}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          />
        ) : project.coverImage?.startsWith('/') ? (
          <Image
            src={project.coverImage}
            alt={`${project.name} project cover`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <span>{project.coverImage || '📦'}</span>
        )}
      </div>

      {/* Glass Footer Strip */}
      <div className="p-4 flex items-center justify-between gap-3 bg-black/20 backdrop-blur-sm">
        <h3 className="text-base font-semibold text-slate-100 truncate flex-1">{project.name}</h3>
        {project.techStack.length > 0 && (
          <span className="px-2 py-1 bg-white/5 border border-white/10 rounded text-xs text-slate-300 font-[family-name:var(--font-jetbrains-mono)] whitespace-nowrap">
            {project.techStack[0]}
          </span>
        )}
      </div>
    </motion.div>
  );
};

export default ProjectFolder;

