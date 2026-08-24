import type { Metadata } from 'next';
import { Fraunces, Inter, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';
import CursorGlow from '@/components/CursorGlow';
import InteractiveCursor from '@/components/InteractiveCursor';
import QuantumParticles from '@/components/QuantumParticles';
import { ThemeProvider } from '@/components/ThemeProvider';
import SmoothScroll from '@/components/SmoothScroll';
import ScrollProgress from '@/components/ScrollProgress';
import SciFiLoader from '@/components/SciFiLoader';
import { JarvisProvider } from '@/components/JarvisTransition';

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-ibm-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'StudioFlag® — Strategic Branding & Editorial Identity',
  description:
    'StudioFlag is a high-end creative branding studio engineering definitive identities, bespoke typography, and digital dossiers for ambitious founders and institutions.',
  keywords: [
    'Branding Agency',
    'Brand Identity',
    'Creative Studio',
    'Design System',
    'Editorial Design',
    'StudioFlag',
  ],
  authors: [{ name: 'StudioFlag Creative' }],
  openGraph: {
    title: 'StudioFlag® — Selected Work & Case Studies',
    description:
      'Explore case studies across AI, Fintech, Climate, Architecture, and Deep Tech by StudioFlag.',
    url: 'https://studioflag.agency',
    siteName: 'StudioFlag®',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StudioFlag® — Selected Work',
    description: 'Strategic branding and editorial identity for the new vanguard.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} ${ibmPlexMono.variable}`}
      data-theme="dark"
    >
      <body className="bg-ink text-ivory min-h-screen selection:bg-brass selection:text-ink font-body antialiased relative dossier-grid-bg">
        <ThemeProvider>
          <JarvisProvider>
            <SciFiLoader />
            <QuantumParticles />
            <InteractiveCursor />
            <SmoothScroll>
              <ScrollProgress />
              <CursorGlow />
              {children}
            </SmoothScroll>
          </JarvisProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

