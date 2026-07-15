'use client';

import { useState, useSyncExternalStore } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Briefcase, FlaskConical, Mail } from 'lucide-react';
import Breadcrumbs from './Breadcrumbs';
import MobileDock from './MobileDock';
import Wallpaper from '../Wallpaper';
import ContactWindow from '../modals/ContactWindow';

interface ShellProps {
  children: React.ReactNode;
}

// Subscribe to viewport width changes the React-idiomatic way (SSR-safe).
const subscribeToResize = (callback: () => void) => {
  window.addEventListener('resize', callback);
  return () => window.removeEventListener('resize', callback);
};

const Shell = ({ children }: ShellProps) => {
  const router = useRouter();
  const currentPath = usePathname();
  const [isContactOpen, setIsContactOpen] = useState(false);

  const isDesktop = useSyncExternalStore(
    subscribeToResize,
    () => window.innerWidth >= 1024, // client value
    () => false, // server fallback
  );

  const navItems = [
    { name: 'Home', path: '/', icon: Home, action: () => router.push('/') },
    { name: 'Projects', path: '/projects', icon: Briefcase, action: () => router.push('/projects') },
    { name: 'Prototypes', path: '/prototypes', icon: FlaskConical, action: () => router.push('/prototypes') },
    { name: 'Contact', path: '#contact', icon: Mail, action: () => setIsContactOpen(true) }, // Special action for Contact
  ];

  return (
    <div className="flex h-screen overflow-hidden relative">
      {/* Animated Wallpaper */}
      <Wallpaper />

      {/* Desktop Bottom Dock */}
      <aside className="hidden lg:flex fixed bottom-6 left-1/2 -translate-x-1/2 z-50 h-16 px-6 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl">
        {/* Navigation - Horizontal Icons */}
        <nav className="flex items-center gap-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            // Active if path matches OR if contact window is open and this is the contact item
            const isActive = currentPath === item.path || (item.name === 'Contact' && isContactOpen);

            return (
              <button
                key={item.name}
                onClick={item.action}
                className={`flex items-center justify-center p-3 rounded-xl transition-all cursor-pointer ${isActive
                  ? 'bg-blue-500/30 text-blue-400'
                  : 'text-slate-400 hover:bg-white/10 hover:text-slate-200'
                  }`}
                title={item.name}
                aria-label={item.name}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon size={24} aria-hidden="true" />
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Top Bar with Breadcrumbs */}
        <div className="glass-panel border-b border-white/10 px-6 lg:px-12 py-5">
          <Breadcrumbs path={currentPath} />
        </div>

        {/* Content Stage */}
        <div
          className="flex-1 overflow-y-auto relative z-10"
          style={{
            padding: isDesktop ? '48px' : '24px',
            paddingBottom: isDesktop ? '48px' : '80px'
          }}
        >
          {children}
        </div>
      </main>

      {/* Mobile Dock */}
      <MobileDock
        currentPath={currentPath}
        onContactClick={() => setIsContactOpen(true)}
      />

      {/* Global Contact Window */}
      <ContactWindow
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />
    </div>
  );
};

export default Shell;

