'use client';

import React, { useState, useMemo, useEffect, useTransition } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { CaseStudy, ViewMode } from '@/types/database';
import Hero from './Hero';
import SciFiHoloDeck from './SciFiHoloDeck';
import SciFiHudRail from './SciFiHudRail';
import FilterBar from './FilterBar';
import ProjectGrid from './ProjectGrid';
import ProjectList from './ProjectList';
import EmptyState from './EmptyState';
import { getCaseStudies } from '@/lib/supabase/service';


interface WorkPageClientProps {
  initialCaseStudies: CaseStudy[];
}

export default function WorkPageClient({ initialCaseStudies }: WorkPageClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>(initialCaseStudies);

  // Read initial states from URL params
  const paramCategory = searchParams?.get('category') || 'All';
  const paramView = (searchParams?.get('view') as ViewMode) || 'grid';

  const [selectedCategory, setSelectedCategory] = useState<string>(paramCategory);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');
  const [viewMode, setViewMode] = useState<ViewMode>(paramView === 'list' ? 'list' : 'grid');

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 180);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Sync state if URL changes externally
  useEffect(() => {
    if (paramCategory && paramCategory !== selectedCategory) {
      setSelectedCategory(paramCategory);
    }
    if (paramView && (paramView === 'grid' || paramView === 'list') && paramView !== viewMode) {
      setViewMode(paramView);
    }
  }, [paramCategory, paramView]);

  // Listen for local updates from admin or reload
  useEffect(() => {
    const handleStorageUpdate = async () => {
      const fresh = await getCaseStudies(false);
      setCaseStudies(fresh);
    };

    window.addEventListener('studioflag_storage_update', handleStorageUpdate);
    return () => {
      window.removeEventListener('studioflag_storage_update', handleStorageUpdate);
    };
  }, []);

  // Update URL helper
  const updateUrlParams = (newCat: string, newView: ViewMode) => {
    const params = new URLSearchParams(searchParams ? searchParams.toString() : '');
    if (newCat && newCat !== 'All') {
      params.set('category', newCat);
    } else {
      params.delete('category');
    }

    if (newView && newView !== 'grid') {
      params.set('view', newView);
    } else {
      params.delete('view');
    }

    startTransition(() => {
      const queryString = params.toString();
      router.replace(queryString ? `${pathname || '/'}?${queryString}` : (pathname || '/'), {
        scroll: false,
      });
    });
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    updateUrlParams(category, viewMode);
  };

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    updateUrlParams(selectedCategory, mode);
  };

  // Dynamic Categories calculation
  const dynamicCategories = useMemo(() => {
    const countsMap: Record<string, number> = {};
    caseStudies.forEach((cs) => {
      if (cs.category) {
        countsMap[cs.category] = (countsMap[cs.category] || 0) + 1;
      }
    });

    const categoryList = [
      { name: 'All', count: caseStudies.length },
      ...Object.entries(countsMap).map(([name, count]) => ({ name, count })),
    ];

    return categoryList;
  }, [caseStudies]);

  // Filtered Case Studies
  const filteredProjects = useMemo(() => {
    return caseStudies.filter((project) => {
      const matchesCategory =
        selectedCategory === 'All' ||
        project.category?.toLowerCase() === selectedCategory.toLowerCase();

      const q = debouncedSearch.toLowerCase().trim();
      if (!q) return matchesCategory;

      const matchesSearch =
        project.name.toLowerCase().includes(q) ||
        project.one_liner.toLowerCase().includes(q) ||
        project.category?.toLowerCase().includes(q) ||
        project.client_name?.toLowerCase().includes(q) ||
        project.challenge?.toLowerCase().includes(q) ||
        project.services?.some((s) => s.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [caseStudies, selectedCategory, debouncedSearch]);

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setDebouncedSearch('');
    updateUrlParams('All', viewMode);
  };

  return (
    <main className="min-h-screen relative">
      {/* Sci-Fi Tactical Telemetry HUD Rail */}
      <SciFiHudRail />

      {/* Editorial Hero Header */}
      <Hero caseStudyCount={caseStudies.length} />

      {/* Pinned Sci-Fi Scrollytelling Holo-Deck */}
      <SciFiHoloDeck />

      {/* Sticky Glassmorphic Filter Bar */}
      <FilterBar
        categories={dynamicCategories}
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategorySelect}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        totalFilteredCount={filteredProjects.length}
        totalCount={caseStudies.length}
      />

      {/* Main Content Area */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        {/* Results Count Line in Mono Type */}
        <div className="flex items-center justify-between gap-4 pb-6 mb-8 border-b border-ink-border/40 font-mono text-xs text-ivory-muted">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-brass" />
            <span>
              Showing <strong className="text-ivory font-medium">{filteredProjects.length}</strong> of{' '}
              <strong className="text-ivory font-medium">{caseStudies.length}</strong> projects
            </span>
          </div>

          {(selectedCategory !== 'All' || debouncedSearch) && (
            <button
              onClick={handleResetFilters}
              className="text-brass hover:underline uppercase tracking-wider text-[11px]"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Dynamic View: Grid vs List vs Empty State */}
        {filteredProjects.length > 0 ? (
          viewMode === 'grid' ? (
            <ProjectGrid projects={filteredProjects} />
          ) : (
            <ProjectList projects={filteredProjects} />
          )
        ) : (
          <EmptyState
            onReset={handleResetFilters}
            isFiltered={selectedCategory !== 'All' || Boolean(debouncedSearch)}
          />
        )}
      </section>
    </main>
  );
}
