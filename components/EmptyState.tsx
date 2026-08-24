'use client';

import React from 'react';
import { SearchX, RotateCcw, Plus } from 'lucide-react';
import Link from 'next/link';

interface EmptyStateProps {
  onReset: () => void;
  isFiltered: boolean;
}

export default function EmptyState({ onReset, isFiltered }: EmptyStateProps) {
  return (
    <div className="py-20 px-4 text-center max-w-lg mx-auto bg-ink-surface border border-ink-border rounded-card p-8 sm:p-12">
      <div className="w-12 h-12 rounded-full border border-ink-borderLight bg-ink flex items-center justify-center mx-auto mb-5 text-brass">
        <SearchX className="w-6 h-6" />
      </div>

      <h3 className="font-display text-2xl font-medium text-ivory mb-2">
        {isFiltered ? 'No dossier records match your criteria' : 'Dossier Archive Empty'}
      </h3>

      <p className="text-sm font-mono text-ivory-muted mb-8 leading-relaxed">
        {isFiltered
          ? 'Try adjusting your search keywords or switching category filters to view available case studies.'
          : 'No published case studies found in the archive. Use the Admin CMS to compose your first project dossier.'}
      </p>

      <div className="flex items-center justify-center gap-3 flex-wrap">
        {isFiltered ? (
          <button
            onClick={onReset}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-pill bg-brass hover:bg-brass-hover text-ink font-mono text-xs font-medium uppercase tracking-wider transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Search & Filters</span>
          </button>
        ) : (
          <Link
            href="/admin/case-studies"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-pill bg-brass hover:bg-brass-hover text-ink font-mono text-xs font-medium uppercase tracking-wider transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create New Case Study</span>
          </Link>
        )}
      </div>
    </div>
  );
}
