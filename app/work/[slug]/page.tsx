import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CaseStudyScrollytelling from '@/components/CaseStudyScrollytelling';
import { getCaseStudyBySlug, getAdjacentCaseStudies, getCaseStudies } from '@/lib/supabase/service';

interface CaseStudyPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const caseStudies = await getCaseStudies(false);
  return caseStudies.map((cs) => ({
    slug: cs.slug,
  }));
}

export async function generateMetadata({ params }: CaseStudyPageProps): Promise<Metadata> {
  const project = await getCaseStudyBySlug(params.slug);
  if (!project) {
    return {
      title: 'Dossier Not Found — StudioFlag®',
    };
  }

  return {
    title: `${project.name} — StudioFlag® Case Study`,
    description: project.one_liner,
    openGraph: {
      title: `${project.name} — ${project.category} Branding Case Study | StudioFlag®`,
      description: project.one_liner,
      images: project.hero_image ? [{ url: project.hero_image }] : [],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${project.name} — StudioFlag®`,
      description: project.one_liner,
    },
  };
}

export default async function CaseStudyDetailPage({ params }: CaseStudyPageProps) {
  const project = await getCaseStudyBySlug(params.slug);

  if (!project) {
    notFound();
  }

  const { next: nextProject } = await getAdjacentCaseStudies(project.sort_order);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pb-20">
        <CaseStudyScrollytelling
          project={project}
          nextProject={nextProject}
        />
      </main>
      <Footer />
    </div>
  );
}
