'use client';

import { useEffect, useState } from 'react';

const Wallpaper = () => {
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      className="fixed inset-0 -z-10 transition-all duration-1000 ease-out"
      style={{
        backgroundImage: `
          radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(30, 41, 59, 0.4) 0%, transparent 50%),
          radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
          radial-gradient(circle at 80% 70%, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
          radial-gradient(circle at 50% 50%, rgba(15, 23, 42, 0.3) 0%, transparent 70%),
          linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #0f172a 50%, #1e293b 75%, #0f172a 100%)
        `,
        backgroundSize: '400% 400%',
        animation: 'gradientShift 20s ease infinite',
      }}
    >
      {/* Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden select-none z-[-1]">
        <h1 className="text-[10vw] font-bold text-white/[0.03] whitespace-nowrap blur-sm tracking-tighter mix-blend-overlay">
          PORTFOLIO / {new Date().getFullYear()}
        </h1>
      </div>

      {/* Dot Grid Overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)', // Optional fade out at bottom or just full
          WebkitMaskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)'
        }}
      />

      <style jsx>{`
        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </div>
  );
};

export default Wallpaper;

