'use client';

import { Cpu, Database, Server, LayoutDashboard, Code, Terminal, Layers, Box, Zap } from 'lucide-react';
import Window from '../ui/Window';

interface StackWindowProps {
    isOpen: boolean;
    onClose: () => void;
}

function Atom({ size = 24, ...props }: { size?: number } & React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="3" />
            <path d="M7 12a5 5 0 0 1 5-5 5 5 0 0 1 5 5" />
            <path d="M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5" />
            <path d="M12 17a5 5 0 0 1-5-5 5 5 0 0 1 5-5" />
        </svg>
    );
}

const StackWindow = ({ isOpen, onClose }: StackWindowProps) => {
    const categories = [
        {
            title: 'Core & Languages',
            icon: <Cpu className="text-blue-400" size={18} />,
            skills: [
                { name: 'TypeScript', icon: <Code size={16} /> },
                { name: 'JavaScript', icon: <Terminal size={16} /> },
                { name: 'Python', icon: <Terminal size={16} /> },
            ]
        },
        {
            title: 'Frontend',
            icon: <LayoutDashboard className="text-pink-400" size={18} />,
            skills: [
                { name: 'React.js', icon: <Atom size={16} /> },
                { name: 'Next.js', icon: <Zap size={16} /> },
                { name: 'TailwindCSS', icon: <LayoutDashboard size={16} /> },
                { name: 'Three.js', icon: <Box size={16} /> },
                { name: 'Framer Motion', icon: <Layers size={16} /> },
            ]
        },
        {
            title: 'Backend & Tools',
            icon: <Server className="text-green-400" size={18} />,
            skills: [
                { name: 'Node.js', icon: <Server size={16} /> },
                { name: 'PostgreSQL', icon: <Database size={16} /> },
                { name: 'Git', icon: <Terminal size={16} /> },
            ]
        }
    ];

    return (
        <Window
            title="Library / System"
            isOpen={isOpen}
            onClose={onClose}
            initialSize={{ width: 800, height: 600 }}
            center
        >
            <div className="h-full bg-slate-900/50 overflow-y-auto p-6 md:p-8 space-y-8">
                {categories.map((category) => (
                    <div key={category.title} style={{ marginBottom: '1rem' }}>
                        <div
                            className="flex items-center gap-3 text-slate-200"
                            style={{ marginBottom: '0.5rem' }} // Force spacing
                        >
                            {category.icon}
                            <h3 className="font-semibold text-lg">{category.title}</h3>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {category.skills.map((skill) => (
                                <div
                                    key={skill.name}
                                    className="group flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all duration-300 cursor-default relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-white/5 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                                    <div className="text-slate-400 group-hover:text-blue-400 transition-colors">
                                        {skill.icon}
                                    </div>
                                    <span className="text-sm text-slate-300 group-hover:text-white transition-colors font-[family-name:var(--font-jetbrains-mono)]">
                                        {skill.name}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </Window>
    );
};

export default StackWindow;
