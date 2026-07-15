export interface Project {
    id: string;
    name: string;
    description: string;
    coverImage?: string;
    techStack: string[];
    liveUrl?: string;
    githubUrl?: string;
    category: 'web' | 'game' | 'python';
    previewVideo?: string;
    /** true = built for a real client / freelance engagement, false = personal project */
    client?: boolean;
}

export interface LabItem {
    id: string;
    name: string;
    description: string;
    icon: 'game' | 'python' | 'web';
    coverImage?: string;
    techStack: string[];
    githubUrl?: string;
    demoUrl?: string;
    liveUrl?: string;
    previewVideo?: string;
}

// Ordered by impact — client work and technically strongest projects first.
export const projects: Project[] = [
    {
        id: 'stolarija-bm',
        name: 'Stolarija-BM',
        description: 'Full-stack web platform for a custom furniture manufacturer, combining a product catalog and web shop with a complete admin dashboard for managing inventory, orders, and customer messages. Built with Next.js, TypeScript, and Supabase.',
        coverImage: '/projects/stolarija-bm.png',
        techStack: ['Next.js', 'TypeScript', 'Supabase'],
        liveUrl: 'https://stolarijabm.vercel.app',
        githubUrl: 'https://github.com/Brkic365/Stolarija-BM',
        category: 'web',
        client: true,
    },
    {
        id: 'pentix',
        name: 'Pentix',
        description: 'A gamified web app that turns World Cup 2026 goals into push-up "debts" among friend groups. Players film their reps and in-browser computer vision (MediaPipe pose tracking) counts them automatically. Includes live leaderboards, a configurable goals-to-push-ups formula with compounding interest, and 1-on-1 match bets. Live in production at pentix.eu.',
        coverImage: '/projects/pentix.png',
        techStack: ['Next.js', 'MediaPipe', 'Computer Vision', 'Supabase', 'Sass'],
        liveUrl: 'https://pentix.eu/',
        githubUrl: '',
        category: 'web',
    },
    {
        id: 'stocks-royale',
        name: 'Stocks Royale',
        description: 'A real-time, gamified stock-trading platform that blends real market mechanics with competitive play. Streams live price data over WebSockets and renders interactive candlestick charts, backed by a Node/Express and PostgreSQL API.',
        coverImage: '/projects/stocks-royale.png',
        techStack: ['Next.js', 'Node.js', 'Express.js', 'PostgreSQL', 'Socket.io', 'Lightweight Charts', 'Recharts'],
        liveUrl: 'https://stocks-royale.vercel.app/',
        githubUrl: 'https://github.com/Brkic365/Stocks-Royale',
        category: 'web',
    },
    {
        id: 'runtime',
        name: 'Runtime',
        description: 'A real-time API monitoring and analytics dashboard built with Next.js and TypeScript. Surfaces performance, security, and usage insights through live charts and authenticated user sessions powered by NextAuth.js.',
        coverImage: '/projects/runtime.png',
        techStack: ['Next.js', 'TypeScript', 'NextAuth.js', 'Framer Motion', 'Recharts', 'Ark UI', 'SWR'],
        liveUrl: 'https://runtime-rust.vercel.app/',
        githubUrl: 'https://github.com/Brkic365/RuntimeFrontend',
        category: 'web',
    },
    {
        id: 'digital-era',
        name: 'Digital Era',
        description: 'A freelance marketing site for a business-consulting company that helps clients establish and grow their online presence. Built in Next.js with a Resend-powered contact pipeline.',
        coverImage: '/projects/digital-era.png',
        techStack: ['Next.js', 'TypeScript', 'Resend'],
        liveUrl: 'https://www.the-digital-era.com/',
        githubUrl: '',
        category: 'web',
        client: true,
    },
    {
        id: 'eBankc',
        name: 'EBankc',
        description: 'Frontend for a decentralized-finance (DeFi) banking concept, letting users explore crypto assets, simulate earning and borrowing, and read an educational blog and FAQ. Built with Next.js, TypeScript, and Framer Motion.',
        coverImage: '/projects/ebankc.png',
        techStack: ['Next.js', 'TypeScript', 'Sass', 'Framer Motion'],
        liveUrl: 'https://ebankc.vercel.app/',
        githubUrl: 'https://github.com/Brkic365/EBankc-Website',
        category: 'web',
    },
    {
        id: 'rocketwizard',
        name: 'RocketWizard',
        description: 'A subscription SaaS concept for copy-trading, where users follow traders and manage plans through integrated crypto payments (NowPayments). Built with a Next.js frontend and an Express/Node.js backend.',
        coverImage: '/projects/rocketwizard.png',
        techStack: ['Next.js', 'JavaScript', 'Node.js', 'Express.js', 'NowPayments'],
        liveUrl: 'https://rocket-wizard.vercel.app/',
        githubUrl: 'https://github.com/Brkic365/RocketWizard',
        category: 'web',
    },
    {
        id: 'marro',
        name: 'by Marro',
        description: 'A clean, image-first portfolio site for a local freelance photographer, built with Next.js and Sass.',
        coverImage: '/projects/marro.png',
        techStack: ['Next.js', 'Sass'],
        liveUrl: 'https://bymarro.vercel.app/',
        githubUrl: 'https://github.com/Brkic365/marro',
        category: 'web',
        client: true,
    },
    {
        id: 'siteboost',
        name: 'SiteBoost',
        description: 'A lead-generation landing page offering website audits, designed to convert visitors into consultation requests. Built with Next.js and Sass.',
        coverImage: '/projects/siteboost.png',
        techStack: ['Next.js', 'Sass'],
        liveUrl: 'https://site-boost.vercel.app/',
        githubUrl: 'https://github.com/Brkic365/SiteBoost',
        category: 'web',
    },
    {
        id: 'luxury-perspective',
        name: 'LuxuryPerspective',
        description: 'A personal project mocking a premium real-estate app: a dark, elegant UI with video backgrounds and smooth animations for showcasing high-end properties. Built with Next.js and Sass.',
        coverImage: '/projects/luxury-perspective.png',
        techStack: ['Next.js', 'Sass'],
        liveUrl: 'https://luxury-perspective.vercel.app/',
        githubUrl: 'https://github.com/Brkic365/LuxuryPersective',
        category: 'web',
    },
    {
        id: 'dreamfinders',
        name: 'DreamFinders',
        description: 'A concept real-estate search app for browsing properties worldwide, built as a personal project to practice search-driven UIs and filtering in Next.js.',
        coverImage: '/projects/dreamfinders.png',
        techStack: ['Next.js', 'Sass'],
        liveUrl: 'https://dream-finders.vercel.app/',
        githubUrl: 'https://github.com/Brkic365/DreamFinders',
        category: 'web',
    },
    {
        id: 'codeforgood',
        name: 'Code For Good',
        description: 'A personal landing-page project promoting coding for social good, encouraging developers to build projects that benefit their communities. Built with Next.js.',
        coverImage: '/projects/codeforgood.png',
        techStack: ['Next.js', 'Sass'],
        liveUrl: 'https://codeforgood-hackathon.vercel.app/',
        githubUrl: 'https://github.com/Brkic365/CodeForGood',
        category: 'web',
    }
];

export const labItems: LabItem[] = [
    {
        id: 'route-master',
        name: 'RouteMaster.py',
        description: 'RouteMaster is a high-performance Python-based traffic simulation and navigation system designed for real-time pathfinding on OpenStreetMap (OSM) data. It features a custom Spatial Hashing engine for O(1) queries, dynamic A* rerouting, and an interactive visualizations dashboard.',
        icon: 'python',
        coverImage: '/projects/route-master.png',
        techStack: ['Python', 'Tkinter', 'NumPy', 'OpenStreetMap', 'A*'],
        githubUrl: 'https://github.com/Brkic365/routeMaster'
    },
    {
        id: 'ai-motion-metrics',
        name: 'AI_MotionMetrics.exe',
        description: 'Real-time computer vision application using TensorFlow.js (MoveNet). Implements geometric vector analysis to calculate joint angles and track fitness reps client-side.',
        icon: 'web',
        previewVideo: '/videos/motion-metrics-preview.mp4',
        techStack: ['Next.js', 'TensorFlow.js', 'MoveNet', 'Tailwind CSS'],
        liveUrl: 'https://ai-motion-metrics.vercel.app/',
        githubUrl: 'https://github.com/Brkic365/ai-motion-metrics'
    }
];
