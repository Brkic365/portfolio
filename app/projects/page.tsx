import type { Metadata } from 'next';
import DirectoryScreen from '@/components/views/DirectoryScreen';

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'Full-stack web applications by Antonio Brkić — client work and personal builds spanning SaaS platforms, real-time apps, and computer-vision experiments, built with Next.js, TypeScript, and PostgreSQL.',
  alternates: { canonical: '/projects' },
  openGraph: {
    title: 'Projects | Antonio Brkić',
    description:
      'Full-stack web applications by Antonio Brkić — client work and personal builds.',
    url: 'https://antoniobrkic.com/projects',
  },
};

export default function ProjectsPage() {
  return <DirectoryScreen type="projects" />;
}
