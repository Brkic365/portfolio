import { projects, labItems, Project, LabItem } from './projects';

// File system data structure
export type ItemType = 'file' | 'folder' | 'app';

export interface FileItem {
    id: string;
    name: string;
    type: ItemType;
    extension?: string;
    path: string;
    description?: string;
    techStack?: string[];
    size?: string;
    liveUrl?: string;
    githubUrl?: string;
    coverImage?: string; // Unified image property
    icon?: 'game' | 'python' | 'web'; // Specific for lab items
    demoUrl?: string;
    previewVideo?: string;
    client?: boolean;
}

export interface Directory {
    path: string;
    items: FileItem[];
}

// Helper to convert Project to FileItem
const mapProjectToFileItem = (p: Project): FileItem => ({
    id: p.id,
    name: p.name,
    type: 'app',
    path: `/projects/${p.id}`,
    description: p.description,
    techStack: p.techStack,
    liveUrl: p.liveUrl,
    githubUrl: p.githubUrl,
    coverImage: p.coverImage,
    previewVideo: p.previewVideo,
    client: p.client,
});

// Helper to convert LabItem to FileItem
const mapLabItemToFileItem = (l: LabItem): FileItem => ({
    id: l.id,
    name: l.name,
    type: 'file',
    path: `/prototypes/${l.id}`,
    description: l.description,
    techStack: l.techStack,
    githubUrl: l.githubUrl,
    demoUrl: l.demoUrl,
    liveUrl: l.liveUrl,
    previewVideo: l.previewVideo,
    icon: l.icon,
    coverImage: l.coverImage,
    extension: l.icon === 'python' ? 'py' : l.icon === 'web' ? 'app' : 'exe'
});

// File system structure
export const filesystem: Directory[] = [
    {
        path: '/',
        items: [
            { id: 'home', name: 'Home', type: 'folder', path: '/home' },
            { id: 'projects', name: 'Workspace', type: 'folder', path: '/projects' },
            { id: 'prototypes', name: 'Prototypes', type: 'folder', path: '/prototypes' },
            { id: 'bio', name: 'Bio', type: 'folder', path: '/bio' },
        ],
    },
    {
        path: '/home',
        items: [
            {
                id: 'welcome',
                name: 'WELCOME.md',
                type: 'file',
                extension: 'md',
                path: '/home/welcome',
                description: 'Welcome to my digital workspace. Navigate through the folders to explore my work.',
            },
        ],
    },
    {
        path: '/projects',
        items: projects.map(mapProjectToFileItem),
    },
    {
        path: '/prototypes',
        items: labItems.map(mapLabItemToFileItem),
    },
    {
        path: '/bio',
        items: [
            {
                id: 'readme',
                name: 'README.md',
                type: 'file',
                extension: 'md',
                path: '/bio/readme',
                description: `> **Header:** About Me
>
> **Bio:**
> I am a 3rd-year Computer Science student at **TVZ (Zagreb)** bridging the gap between robust software engineering and interactive 3D web experiences.
>
> While my academic focus is Computer Science, my passion lies in building production-ready SaaS applications using the **Next.js** ecosystem. I specialize in architecting complex digital products with a focus on performance, scalability, and modern UI patterns.
>
> **Current Focus:**
> 🚀 **Full-Stack Architecture:** Expert in React, Next.js, TypeScript, and Postgres.
>
> **Status:**
> 🟢 Available for freelance & collaborations.`,
                size: '2.1 KB',
            },
        ],
    },
];

export const getDirectoryContents = (path: string): FileItem[] => {
    const dir = filesystem.find((d) => d.path === path);
    return dir?.items || [];
};

export const getFileById = (id: string): FileItem | undefined => {
    for (const dir of filesystem) {
        const file = dir.items.find((item) => item.id === id);
        if (file) return file;
    }
    return undefined;
};
