'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { CaseStudy } from '@/types/database';
import { formatIndex } from '@/lib/utils';
import { useJarvis } from './JarvisTransition';

interface ProjectListProps {
  projects: CaseStudy[];
}

export default function ProjectList({ projects }: ProjectListProps) {
  const { openCaseStudy } = useJarvis();

  const handleLinkClick = (e: React.MouseEvent, slug: string, name: string, color: string) => {
    if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
      e.preventDefault();
      openCaseStudy(slug, name, color);
    }
  };

  return (
    <div className="border-t border-b border-ink-border divide-y divide-ink-border bg-ink-surface/40 rounded-card overflow-hidden">
      {projects.map((project, index) => {
        const accentColor = project.accent_color || '#C6A15B';

        return (
          <motion.div
            key={project.id || project.slug}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: (index % 6) * 0.05 }}
            className="group cursor-pointer"
          >
            <Link
              href={`/work/${project.slug}`}
              prefetch={true}
              onClick={(e) => handleLinkClick(e, project.slug, project.name, accentColor)}
              className="flex items-center justify-between p-4 sm:p-6 hover:bg-ink-surface transition-all duration-200 focus:outline-none focus-visible:bg-ink-surface block"
            >
              {/* Left Group: Index, Color Swatch & Title/Desc */}
              <div className="flex items-center gap-4 sm:gap-6 min-w-0 flex-1 pr-4">
                {/* Mono Index */}
                <span className="font-mono text-xs text-ivory-subtle w-8 sm:w-10 flex-shrink-0 group-hover:text-cyan-400 transition-colors">
                  {formatIndex(project.sort_order || index + 1)}
                </span>

                {/* Color Swatch / Dot */}
                <div
                  className="w-3.5 h-3.5 rounded-full flex-shrink-0 border border-white/20 transition-transform duration-300 group-hover:scale-125 shadow-sm"
                  style={{ backgroundColor: accentColor }}
                />

                {/* Name & One-Liner */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-3 flex-wrap">
                    <h2 className="font-display text-lg sm:text-xl font-medium text-ivory group-hover:text-cyan-400 transition-colors truncate">
                      {project.name}
                    </h2>
                    {project.featured && (
                      <span className="font-mono text-[9px] uppercase tracking-widest text-brass bg-brass/10 border border-brass/30 px-1.5 py-0.5 rounded-pill hidden sm:inline-block">
                        FEATURED
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-ivory-muted line-clamp-1 mt-0.5 max-w-xl">
                    {project.one_liner}
                  </p>
                </div>
              </div>

              {/* Right Group: Category, Year & Action Arrow */}
              <div className="flex items-center gap-4 sm:gap-8 flex-shrink-0">
                {/* Category Tag */}
                <span className="hidden sm:inline-block px-3 py-1 rounded-pill text-xs font-mono tracking-wider bg-sage-muted text-sage border border-sage-border">
                  {project.category}
                </span>

                {/* Year */}
                <span className="font-mono text-xs text-ivory-muted hidden md:inline-block">
                  {project.year}
                </span>

                {/* Action Arrow (shifts up-right on hover) */}
                <div className="w-8 h-8 rounded-full border border-ink-border flex items-center justify-center text-ivory-muted group-hover:text-cyan-400 group-hover:border-cyan-400/50 transition-all duration-200 shadow-sm">
                  <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}

