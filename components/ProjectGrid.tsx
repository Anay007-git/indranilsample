'use client';

import React from 'react';
import { CaseStudy } from '@/types/database';
import ProjectCard from './ProjectCard';

interface ProjectGridProps {
  projects: CaseStudy[];
}

export default function ProjectGrid({ projects }: ProjectGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
      {projects.map((project, index) => (
        <ProjectCard
          key={project.id || project.slug}
          project={project}
          index={index}
        />
      ))}
    </div>
  );
}
