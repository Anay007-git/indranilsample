'use client';

import React from 'react';
import { Search, X, LayoutGrid, List } from 'lucide-react';
import { ViewMode } from '@/types/database';
import { soundEffects } from '@/lib/soundEffects';

interface CategoryItem {
  name: string;
  count: number;
}

interface FilterBarProps {
  categories: CategoryItem[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  totalFilteredCount: number;
  totalCount: number;
}

export default function FilterBar({
  categories,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  totalFilteredCount,
  totalCount,
}: FilterBarProps) {
  const handleCategoryClick = (catName: string) => {
    soundEffects.playClick();
    onSelectCategory(catName);
  };

  const handleModeClick = (mode: ViewMode) => {
    soundEffects.playClick();
    onViewModeChange(mode);
  };

  return (
    <div className="sticky top-20 z-30 w-full glass-panel border-b border-ink-border/80 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Categories Horizontal Scroll Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.name;
              return (
                <button
                  key={cat.name}
                  onClick={() => handleCategoryClick(cat.name)}
                  className={`group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-pill text-xs font-mono tracking-wider whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? 'bg-ivory text-ink font-semibold shadow-sm'
                      : 'bg-ink-surface/90 text-ivory-muted hover:text-ivory hover:bg-ink-border/70 border border-ink-border'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-ink/15 text-ink'
                        : 'bg-ink border border-ink-border text-ivory-subtle group-hover:text-ivory-muted'
                    }`}

                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Input & View Mode Controls */}
          <div className="flex items-center justify-between lg:justify-end gap-3">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ivory-subtle pointer-events-none" />
              <input
                type="text"
                placeholder="Search projects…"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full bg-ink-surface border border-ink-border rounded-pill pl-9 pr-8 py-1.5 text-xs font-mono text-ivory placeholder:text-ivory-subtle focus:border-brass focus:outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-ivory-subtle hover:text-ivory rounded-full"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Grid / List View Toggle */}
            <div className="flex items-center p-0.5 bg-ink-surface border border-ink-border rounded-pill">
              <button
                onClick={() => handleModeClick('grid')}
                className={`p-1.5 rounded-pill transition-all ${
                  viewMode === 'grid'
                    ? 'bg-ivory text-ink shadow-sm'
                    : 'text-ivory-muted hover:text-ivory'
                }`}
                title="Grid View"
                aria-label="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleModeClick('list')}
                className={`p-1.5 rounded-pill transition-all ${
                  viewMode === 'list'
                    ? 'bg-ivory text-ink shadow-sm'
                    : 'text-ivory-muted hover:text-ivory'
                }`}
                title="List View"
                aria-label="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
