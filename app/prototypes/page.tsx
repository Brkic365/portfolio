import type { Metadata } from 'next';
import DirectoryScreen from '@/components/views/DirectoryScreen';

export const metadata: Metadata = {
  title: 'Prototypes',
  description:
    'Experimental prototypes and lab work by Antonio Brkić — including a Python traffic-simulation engine and a real-time computer-vision fitness tracker built with TensorFlow.js.',
  alternates: { canonical: '/prototypes' },
  openGraph: {
    title: 'Prototypes | Antonio Brkić',
    description:
      'Experimental prototypes and lab work by Antonio Brkić.',
    url: 'https://antoniobrkic.com/prototypes',
  },
};

export default function PrototypesPage() {
  return <DirectoryScreen type="prototypes" />;
}
