'use client';

import { ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface BreadcrumbsProps {
  path: string;
}

const Breadcrumbs = ({ path }: BreadcrumbsProps) => {
  const router = useRouter();

  const segments = ['root', 'users', 'antonio', ...path.split('/').filter(Boolean)];

  const handleNavigate = (index: number) => {
    if (index < 3) return; // Don't navigate on root/users/antonio
    const newPath = '/' + segments.slice(3, index + 1).join('/');
    router.push(newPath);
  };

  const isActive = (index: number) => index === segments.length - 1;

  return (
    <div className="overflow-x-auto scrollbar-hide">
      <div className="flex items-center gap-3 text-sm font-[family-name:var(--font-jetbrains-mono)] min-w-max">
        {segments.map((segment, index) => (
          <div key={index} className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={() => handleNavigate(index)}
              className={`
                transition-colors duration-200
                ${
                  index < 3
                    ? 'text-slate-500 cursor-default'
                    : isActive(index)
                    ? 'text-white font-medium'
                    : 'text-slate-400 hover:text-slate-200 cursor-pointer'
                }
              `}
              disabled={index < 3}
            >
              {segment}
            </button>
            {index < segments.length - 1 && (
              <ChevronRight size={14} className="text-slate-500 flex-shrink-0" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Breadcrumbs;
