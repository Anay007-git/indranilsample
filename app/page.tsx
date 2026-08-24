import React, { Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WorkPageClient from '@/components/WorkPageClient';
import { getCaseStudies } from '@/lib/supabase/service';

export const revalidate = 60;

export default async function HomePage() {
  const initialCaseStudies = await getCaseStudies(false);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow">
        <Suspense
          fallback={
            <div className="min-h-[60vh] flex items-center justify-center font-mono text-xs text-brass tracking-widest uppercase animate-pulse">
              LOADING ARCHIVE DOSSIERS…
            </div>
          }
        >
          <WorkPageClient initialCaseStudies={initialCaseStudies} />
        </Suspense>
      </div>
      <Footer />
    </div>
  );
}
