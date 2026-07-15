'use client';

import { Home, Briefcase, FlaskConical, User } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface MobileDockProps {
  currentPath: string;
  onContactClick: () => void;
}

const MobileDock = ({ currentPath, onContactClick }: MobileDockProps) => {
  const router = useRouter();

  const navItems = [
    { name: 'Home', path: '/', icon: Home, action: () => router.push('/') },
    { name: 'Projects', path: '/projects', icon: Briefcase, action: () => router.push('/projects') },
    { name: 'Prototypes', path: '/prototypes', icon: FlaskConical, action: () => router.push('/prototypes') },
    { name: 'Contact', path: '#contact', icon: User, action: onContactClick },
  ];

  const handleNavigate = (action: () => void) => {
    action();
  };

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 glass-panel border-t border-white/10 safe-area-bottom">
      <div className="flex items-center justify-around px-6 py-4 gap-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path;

          return (
            <button
              key={item.name}
              onClick={() => handleNavigate(item.action)}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all ${isActive ? 'text-blue-400' : 'text-slate-400'
                }`}
            >
              <Icon size={24} />
              <span className="text-xs font-medium">{item.name}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileDock;

