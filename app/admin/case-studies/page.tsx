'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Shield,
  Plus,
  ArrowLeft,
  MoveUp,
  MoveDown,
  Trash2,
  Edit3,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  ExternalLink,
  Sparkles,
  Lock,
  LogOut,
  RefreshCw,
  X,
} from 'lucide-react';
import { CaseStudy, CaseStudyInput } from '@/types/database';
import {
  getCaseStudies,
  createCaseStudy,
  updateCaseStudy,
  deleteCaseStudy,
  reorderCaseStudies,
  resetToSampleData,
  clearAllData,
} from '@/lib/supabase/service';
import { isSupabaseConfigured } from '@/lib/supabase/client';
import { slugify, formatIndex } from '@/lib/utils';

const COLOR_PRESETS = [
  { name: 'Studio Brass', hex: '#C6A15B' },
  { name: 'Sage Green', hex: '#8A9A87' },
  { name: 'Oceanic Teal', hex: '#5E8B7E' },
  { name: 'Cognac Leather', hex: '#A08060' },
  { name: 'Raw Ochre', hex: '#D4A373' },
  { name: 'Velodrome Amber', hex: '#E06D53' },
  { name: 'Photon Blue', hex: '#6C8EA4' },
  { name: 'Binaural Purple', hex: '#B288C0' },
];

const DEFAULT_CATEGORIES = [
  'AI',
  'Fintech',
  'Climate',
  'Legal',
  'Crypto',
  'Wellness',
  'Architecture',
  'Pets',
  'Sports',
  'SaaS',
  'Tech',
];

export default function AdminCaseStudiesPage() {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Data state
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal / Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Form Fields
  const [formData, setFormData] = useState<CaseStudyInput>({
    name: '',
    slug: '',
    one_liner: '',
    category: 'AI',
    year: '2024',
    accent_color: '#C6A15B',
    featured: false,
    sort_order: 1,
    status: 'published',
    client_name: '',
    services: ['Brand Architecture', 'Visual Identity System'],
    hero_image: '',
    challenge: '',
    approach: '',
    outcome: '',
    pull_quote: '',
    gallery_images: [],
  });

  const [newServiceInput, setNewServiceInput] = useState('');
  const [newGalleryInput, setNewGalleryInput] = useState('');
  const [customCategoryInput, setCustomCategoryInput] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  // Check auth session
  useEffect(() => {
    const session = sessionStorage.getItem('studioflag_admin_auth');
    if (session === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const loadData = async () => {
    setLoading(true);
    const data = await getCaseStudies(true);
    setCaseStudies(data);
    setLoading(false);
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (authPassword === 'studioflag' || authPassword === 'admin' || authPassword.length >= 4) {
      setIsAuthenticated(true);
      sessionStorage.setItem('studioflag_admin_auth', 'true');
      setAuthError('');
    } else {
      setAuthError('Invalid credentials. (Hint: enter "studioflag" or any key)');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('studioflag_admin_auth');
  };

  // Open Form for Create
  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      name: '',
      slug: '',
      one_liner: '',
      category: 'AI',
      year: new Date().getFullYear().toString(),
      accent_color: '#C6A15B',
      featured: false,
      sort_order: caseStudies.length + 1,
      status: 'published',
      client_name: '',
      services: ['Brand Architecture', 'Visual Identity System'],
      hero_image: '',
      challenge: '',
      approach: '',
      outcome: '',
      pull_quote: '',
      gallery_images: [],
    });
    setFormErrors({});
    setIsFormOpen(true);
  };

  // Open Form for Edit
  const handleOpenEdit = (study: CaseStudy) => {
    setEditingId(study.id);
    setFormData({
      name: study.name,
      slug: study.slug,
      one_liner: study.one_liner,
      category: study.category,
      year: study.year,
      accent_color: study.accent_color || '#C6A15B',
      featured: Boolean(study.featured),
      sort_order: study.sort_order,
      status: study.status || 'published',
      client_name: study.client_name || '',
      services: study.services || [],
      hero_image: study.hero_image || '',
      challenge: study.challenge || '',
      approach: study.approach || '',
      outcome: study.outcome || '',
      pull_quote: study.pull_quote || '',
      gallery_images: study.gallery_images || [],
    });
    setFormErrors({});
    setIsFormOpen(true);
  };

  // Name change auto-slugify
  const handleNameChange = (val: string) => {
    const updated = { ...formData, name: val };
    if (!editingId || !formData.slug) {
      updated.slug = slugify(val);
    }
    setFormData(updated);
    if (formErrors.name) setFormErrors({ ...formErrors, name: '' });
  };

  // Form submit validation & persistence
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) errors.name = 'Project name is required';
    if (!formData.slug.trim()) errors.slug = 'Slug identifier is required';
    if (!formData.one_liner.trim()) errors.one_liner = 'One-line description is required';
    if (!formData.category.trim()) errors.category = 'Category is required';
    if (!formData.year.trim()) errors.year = 'Year is required';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      showToast('Please resolve required empty fields.');
      return;
    }

    try {
      if (editingId) {
        await updateCaseStudy(editingId, formData);
        showToast(`Updated dossier "${formData.name}"`);
      } else {
        await createCaseStudy(formData);
        showToast(`Created new dossier "${formData.name}"`);
      }
      setIsFormOpen(false);
      await loadData();
    } catch (err) {
      showToast('Error saving record. Please check parameters.');
    }
  };

  // Delete Action
  const handleDelete = async (id: string) => {
    await deleteCaseStudy(id);
    setDeleteConfirmId(null);
    showToast('Case study dossier deleted.');
    await loadData();
  };

  // Reorder Handlers (Drag / Move)
  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= caseStudies.length) return;

    const updated = [...caseStudies];
    const [movedItem] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, movedItem);

    setCaseStudies(updated);
    await reorderCaseStudies(updated);
    showToast('Sort order updated.');
  };

  // Add Service Tag
  const handleAddService = () => {
    if (!newServiceInput.trim()) return;
    setFormData({
      ...formData,
      services: [...(formData.services || []), newServiceInput.trim()],
    });
    setNewServiceInput('');
  };

  const handleRemoveService = (idx: number) => {
    const filtered = (formData.services || []).filter((_, i) => i !== idx);
    setFormData({ ...formData, services: filtered });
  };

  // Add Gallery Image URL
  const handleAddGalleryImage = () => {
    if (!newGalleryInput.trim()) return;
    setFormData({
      ...formData,
      gallery_images: [...(formData.gallery_images || []), newGalleryInput.trim()],
    });
    setNewGalleryInput('');
  };

  const handleRemoveGalleryImage = (idx: number) => {
    const filtered = (formData.gallery_images || []).filter((_, i) => i !== idx);
    setFormData({ ...formData, gallery_images: filtered });
  };

  // Categories list
  const existingCategories = Array.from(
    new Set([...DEFAULT_CATEGORIES, ...caseStudies.map((c) => c.category).filter(Boolean)])
  );

  // Filtered List for Table
  const displayStudies = caseStudies.filter((cs) => {
    const matchesCat = filterCategory === 'All' || cs.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || cs.status === filterStatus;
    const q = searchQuery.toLowerCase().trim();
    const matchesQ =
      !q ||
      cs.name.toLowerCase().includes(q) ||
      cs.one_liner.toLowerCase().includes(q) ||
      cs.category.toLowerCase().includes(q);

    return matchesCat && matchesStatus && matchesQ;
  });

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-ink-surface border border-ink-border rounded-card p-8 shadow-editorial">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-3 h-3 rounded-full bg-brass" />
            <span className="font-mono text-xs text-brass uppercase tracking-widest font-semibold">
              STUDIOFLAG® CMS PORTAL
            </span>
          </div>

          <h1 className="font-display text-3xl font-medium text-ivory mb-2">
            Archival <span className="italic text-brass font-normal">Security</span> Gate
          </h1>
          <p className="text-sm text-ivory-muted mb-6 leading-relaxed">
            Authorized partner access for managing case study dossiers, sorting indices, and publication states.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block font-mono text-xs text-ivory-muted uppercase tracking-wider mb-2">
                Curator Passphrase / Passkey
              </label>
              <input
                type="password"
                placeholder="Enter passphrase (e.g. studioflag)"
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                className="w-full bg-ink border border-ink-border rounded-lg px-4 py-2.5 text-sm text-ivory placeholder:text-ivory-subtle focus:border-brass focus:outline-none transition-colors"
                autoFocus
              />
              {authError && (
                <p className="text-xs font-mono text-rose-400 mt-2 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{authError}</span>
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-pill bg-brass hover:bg-brass-hover text-ink font-mono text-xs uppercase tracking-widest font-medium transition-all flex items-center justify-center gap-2"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Authenticate Session</span>
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-ink-border/60 flex items-center justify-between text-xs font-mono text-ivory-subtle">
            <Link href="/" className="hover:text-brass transition-colors">
              ← Return to public site
            </Link>
            <span className="text-brass/80">Default: studioflag</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink text-ivory pb-20">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-ink-surface border border-brass text-ivory px-4 py-3 rounded-card shadow-editorial flex items-center gap-2.5 font-mono text-xs animate-fadeIn">
          <Check className="w-4 h-4 text-brass" />
          <span>{notification}</span>
        </div>
      )}

      {/* Admin Top Navigation */}
      <header className="sticky top-0 z-40 bg-ink-surface/90 backdrop-blur-md border-b border-ink-border px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-ivory-muted hover:text-ivory text-xs font-mono py-1 px-3 rounded-pill border border-ink-border hover:border-brass transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>PUBLIC WORK</span>
            </Link>

            <div className="hidden sm:flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brass animate-pulse" />
              <span className="font-mono text-xs text-ivory uppercase tracking-wider font-semibold">
                STUDIOFLAG CMS
              </span>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded-pill bg-ink border border-ink-border text-ivory-subtle">
                {isSupabaseConfigured ? 'Supabase Connected' : 'Local Persistence Active'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-pill bg-brass hover:bg-brass-hover text-ink font-mono text-xs uppercase tracking-wider font-semibold transition-all shadow-glow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Dossier</span>
            </button>

            <button
              onClick={handleLogout}
              className="p-2 rounded-full text-ivory-muted hover:text-rose-400 hover:bg-ink-border transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Header summary & quick actions */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-ink-border mb-8">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-medium text-ivory tracking-tight">
              Case Study Dossiers
            </h1>
            <p className="text-sm font-mono text-ivory-muted mt-1">
              Manage live case studies, reorder catalog hierarchy, and publish editorial spreads.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={async () => {
                await resetToSampleData();
                await loadData();
                showToast('Sample dataset restored.');
              }}
              className="px-3 py-1.5 rounded-pill border border-ink-border hover:border-brass text-[11px] font-mono text-ivory-muted hover:text-brass transition-all flex items-center gap-1.5"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Load 16 Sample Records</span>
            </button>

            <button
              onClick={async () => {
                if (confirm('Clear all case study records from archive?')) {
                  await clearAllData();
                  await loadData();
                  showToast('Archive cleared.');
                }
              }}
              className="px-3 py-1.5 rounded-pill border border-ink-border hover:border-rose-500/50 text-[11px] font-mono text-ivory-subtle hover:text-rose-400 transition-all"
            >
              Clear Archive
            </button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-ink-surface border border-ink-border rounded-card p-4 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
            {/* Search */}
            <input
              type="text"
              placeholder="Search case studies…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-ink border border-ink-border rounded-pill px-3.5 py-1.5 text-xs font-mono text-ivory placeholder:text-ivory-subtle focus:border-brass focus:outline-none w-full sm:w-56"
            />

            {/* Category Filter */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-ink border border-ink-border rounded-pill px-3 py-1.5 text-xs font-mono text-ivory focus:border-brass focus:outline-none"
            >
              <option value="All">All Categories</option>
              {existingCategories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <div className="flex items-center p-0.5 bg-ink border border-ink-border rounded-pill">
              {(['all', 'published', 'draft'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-3 py-1 rounded-pill text-[11px] font-mono capitalize transition-all ${
                    filterStatus === st
                      ? 'bg-ivory text-ink font-semibold'
                      : 'text-ivory-muted hover:text-ivory'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div className="font-mono text-xs text-ivory-subtle self-end md:self-auto">
            Total Dossiers: <strong className="text-brass">{displayStudies.length}</strong>
          </div>
        </div>

        {/* Dossier Table / List */}
        {loading ? (
          <div className="py-20 text-center font-mono text-xs text-brass uppercase tracking-widest animate-pulse">
            Loading Catalog Records…
          </div>
        ) : displayStudies.length === 0 ? (
          <div className="py-16 text-center bg-ink-surface border border-ink-border rounded-card p-8">
            <h3 className="font-display text-xl text-ivory mb-2">No Records Found</h3>
            <p className="text-sm font-mono text-ivory-muted mb-6">
              Create your first project dossier or adjust your active search filters.
            </p>
            <button
              onClick={handleOpenCreate}
              className="px-5 py-2.5 rounded-pill bg-brass text-ink font-mono text-xs uppercase tracking-wider font-semibold"
            >
              Create First Case Study
            </button>
          </div>
        ) : (
          <div className="bg-ink-surface border border-ink-border rounded-card overflow-hidden shadow-editorial">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-ink-border bg-ink/60 text-ivory-subtle uppercase tracking-wider">
                    <th className="py-3.5 px-4 w-16 text-center">Order</th>
                    <th className="py-3.5 px-4">Project / One-Liner</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Year</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Featured</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-border">
                  {displayStudies.map((study, idx) => (
                    <tr
                      key={study.id}
                      className="hover:bg-ink/40 transition-colors group"
                    >
                      {/* Sort Order & Move Controls */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <span className="text-brass font-semibold">
                            {formatIndex(study.sort_order || idx + 1)}
                          </span>
                          <div className="flex flex-col opacity-60 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleMove(idx, 'up')}
                              disabled={idx === 0}
                              className="p-0.5 hover:text-brass disabled:opacity-20"
                              title="Move Up"
                            >
                              <MoveUp className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleMove(idx, 'down')}
                              disabled={idx === displayStudies.length - 1}
                              className="p-0.5 hover:text-brass disabled:opacity-20"
                              title="Move Down"
                            >
                              <MoveDown className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </td>

                      {/* Name & One Liner */}
                      <td className="py-3.5 px-4 max-w-xs sm:max-w-md">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-3 h-3 rounded-full flex-shrink-0"
                            style={{ backgroundColor: study.accent_color || '#C6A15B' }}
                          />
                          <div>
                            <div className="font-display font-medium text-sm text-ivory group-hover:text-brass transition-colors">
                              {study.name}
                            </div>
                            <div className="text-ivory-muted text-[11px] line-clamp-1 font-body">
                              {study.one_liner}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-pill text-[10px] bg-sage-muted text-sage border border-sage-border">
                          {study.category}
                        </span>
                      </td>

                      {/* Year */}
                      <td className="py-3.5 px-4 text-ivory-muted">{study.year}</td>

                      {/* Status: Published vs Draft */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-pill text-[10px] uppercase font-semibold ${
                            study.status === 'published'
                              ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/60'
                              : 'bg-amber-950/60 text-amber-400 border border-amber-800/60'
                          }`}
                        >
                          {study.status === 'published' ? (
                            <Eye className="w-3 h-3" />
                          ) : (
                            <EyeOff className="w-3 h-3" />
                          )}
                          {study.status}
                        </span>
                      </td>

                      {/* Featured */}
                      <td className="py-3.5 px-4">
                        {study.featured ? (
                          <span className="text-brass flex items-center gap-1 text-[11px]">
                            <Sparkles className="w-3.5 h-3.5" /> Yes
                          </span>
                        ) : (
                          <span className="text-ivory-subtle">—</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right space-x-1">
                        <Link
                          href={`/work/${study.slug}`}
                          target="_blank"
                          className="p-1.5 rounded-full inline-flex text-ivory-subtle hover:text-ivory hover:bg-ink"
                          title="View Public Page"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleOpenEdit(study)}
                          className="p-1.5 rounded-full inline-flex text-ivory-muted hover:text-brass hover:bg-ink"
                          title="Edit Case Study"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(study.id)}
                          className="p-1.5 rounded-full inline-flex text-ivory-subtle hover:text-rose-400 hover:bg-ink"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-ink-surface border border-ink-border rounded-card p-6 shadow-editorial text-center">
            <div className="w-12 h-12 rounded-full bg-rose-950/60 border border-rose-800/60 text-rose-400 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-display text-xl text-ivory font-medium mb-2">
              Confirm Dossier Deletion
            </h3>
            <p className="text-xs font-mono text-ivory-muted mb-6 leading-relaxed">
              This action permanently removes the case study record and cannot be reversed.
            </p>
            <div className="flex items-center justify-center gap-3 font-mono text-xs">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-pill border border-ink-border hover:bg-ink text-ivory-muted hover:text-ivory"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 rounded-pill bg-rose-600 hover:bg-rose-700 text-white font-medium"
              >
                Delete Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Form Modal / Drawer with Fixed Size */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-ink/85 backdrop-blur-md">
          <div className="relative w-full max-w-4xl h-[90vh] max-h-[860px] bg-ink-surface border border-ink-border rounded-card shadow-editorial flex flex-col overflow-hidden animate-fadeIn">
            {/* Fixed Sticky Modal Header */}
            <div className="px-6 py-4 sm:py-5 border-b border-ink-border bg-ink-surface flex items-center justify-between flex-shrink-0 z-10">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-brass animate-pulse" />
                  <span className="font-mono text-xs text-brass uppercase tracking-widest">
                    {editingId ? 'EDIT CASE STUDY DOSSIER' : 'NEW CASE STUDY DOSSIER'}
                  </span>
                </div>
                <h2 className="font-display text-xl sm:text-2xl font-medium text-ivory truncate max-w-lg">
                  {editingId ? `Update: ${formData.name}` : 'Compose Project Dossier'}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="p-2 text-ivory-muted hover:text-ivory rounded-full hover:bg-ink-border transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form id="dossier-form" onSubmit={handleSubmitForm} className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
              {/* Row 1: Name & Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-xs text-ivory-muted uppercase tracking-wider mb-1.5">
                    Project Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aethelgard AI"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="w-full bg-ink border border-ink-border rounded-lg px-3.5 py-2.5 text-sm text-ivory focus:border-brass focus:outline-none font-display font-medium"
                  />
                  {formErrors.name && (
                    <p className="text-[11px] font-mono text-rose-400 mt-1">{formErrors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block font-mono text-xs text-ivory-muted uppercase tracking-wider mb-1.5">
                    URL Slug Identifier *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. aethelgard-ai"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: slugify(e.target.value) })}
                    className="w-full bg-ink border border-ink-border rounded-lg px-3.5 py-2.5 text-xs font-mono text-brass focus:border-brass focus:outline-none"
                  />
                  {formErrors.slug && (
                    <p className="text-[11px] font-mono text-rose-400 mt-1">{formErrors.slug}</p>
                  )}
                </div>
              </div>

              {/* One-Liner Description */}
              <div>
                <label className="block font-mono text-xs text-ivory-muted uppercase tracking-wider mb-1.5">
                  One-Line Architectural Statement *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Autonomous neural consensus infrastructure for next-gen synthetic research networks."
                  value={formData.one_liner}
                  onChange={(e) => setFormData({ ...formData, one_liner: e.target.value })}
                  className="w-full bg-ink border border-ink-border rounded-lg px-3.5 py-2.5 text-sm text-ivory focus:border-brass focus:outline-none"
                />
                {formErrors.one_liner && (
                  <p className="text-[11px] font-mono text-rose-400 mt-1">{formErrors.one_liner}</p>
                )}
              </div>

              {/* Row 2: Category, Year, Status, Featured */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                {/* Category */}
                <div className="sm:col-span-1">
                  <label className="block font-mono text-xs text-ivory-muted uppercase tracking-wider mb-1.5">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-ink border border-ink-border rounded-lg px-3 py-2.5 text-xs font-mono text-ivory focus:border-brass focus:outline-none"
                  >
                    {existingCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Year */}
                <div className="sm:col-span-1">
                  <label className="block font-mono text-xs text-ivory-muted uppercase tracking-wider mb-1.5">
                    Year *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="w-full bg-ink border border-ink-border rounded-lg px-3 py-2.5 text-xs font-mono text-ivory focus:border-brass focus:outline-none"
                  />
                </div>

                {/* Status */}
                <div className="sm:col-span-1">
                  <label className="block font-mono text-xs text-ivory-muted uppercase tracking-wider mb-1.5">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value as 'published' | 'draft' })
                    }
                    className="w-full bg-ink border border-ink-border rounded-lg px-3 py-2.5 text-xs font-mono text-ivory focus:border-brass focus:outline-none"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>

                {/* Featured Toggle */}
                <div className="sm:col-span-1 flex flex-col justify-end">
                  <label className="flex items-center gap-2 cursor-pointer py-2.5 px-3 bg-ink border border-ink-border rounded-lg">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="accent-brass w-4 h-4 rounded"
                    />
                    <span className="font-mono text-xs text-ivory">Featured</span>
                  </label>
                </div>
              </div>

              {/* Accent Color Picker & Presets */}
              <div>
                <label className="block font-mono text-xs text-ivory-muted uppercase tracking-wider mb-1.5">
                  Accent Dossier Tone (Hex)
                </label>
                <div className="flex items-center gap-3 flex-wrap">
                  <input
                    type="color"
                    value={formData.accent_color}
                    onChange={(e) => setFormData({ ...formData, accent_color: e.target.value })}
                    className="w-10 h-10 rounded border border-ink-border cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    value={formData.accent_color}
                    onChange={(e) => setFormData({ ...formData, accent_color: e.target.value })}
                    className="w-28 bg-ink border border-ink-border rounded-lg px-3 py-2 text-xs font-mono text-ivory focus:border-brass focus:outline-none"
                  />
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {COLOR_PRESETS.map((preset) => (
                      <button
                        type="button"
                        key={preset.hex}
                        onClick={() => setFormData({ ...formData, accent_color: preset.hex })}
                        className={`w-6 h-6 rounded-full border transition-all ${
                          formData.accent_color === preset.hex
                            ? 'scale-125 border-ivory'
                            : 'border-transparent hover:scale-110'
                        }`}
                        style={{ backgroundColor: preset.hex }}
                        title={preset.name}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Client Name & Hero Image URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-xs text-ivory-muted uppercase tracking-wider mb-1.5">
                    Client Attribution / Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Aethelgard Labs (Zurich)"
                    value={formData.client_name || ''}
                    onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                    className="w-full bg-ink border border-ink-border rounded-lg px-3.5 py-2 text-sm text-ivory focus:border-brass focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs text-ivory-muted uppercase tracking-wider mb-1.5">
                    Hero Banner Image URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={formData.hero_image || ''}
                    onChange={(e) => setFormData({ ...formData, hero_image: e.target.value })}
                    className="w-full bg-ink border border-ink-border rounded-lg px-3.5 py-2 text-xs font-mono text-ivory focus:border-brass focus:outline-none"
                  />
                </div>
              </div>

              {/* Scope & Services Tags */}
              <div>
                <label className="block font-mono text-xs text-ivory-muted uppercase tracking-wider mb-1.5">
                  Delivered Services Tags
                </label>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Add scope item (e.g. 3D Motion Design)"
                    value={newServiceInput}
                    onChange={(e) => setNewServiceInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddService();
                      }
                    }}
                    className="flex-1 bg-ink border border-ink-border rounded-lg px-3 py-1.5 text-xs text-ivory focus:border-brass focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddService}
                    className="px-3 py-1.5 rounded-lg bg-ink-border hover:bg-brass hover:text-ink text-xs font-mono text-ivory transition-colors"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(formData.services || []).map((srv, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-pill bg-ink border border-ink-border text-xs font-mono text-ivory-muted"
                    >
                      <span>{srv}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveService(idx)}
                        className="hover:text-rose-400"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Editorial Sections */}
              <div className="space-y-4 pt-2 border-t border-ink-border/60">
                <h4 className="font-mono text-xs text-brass uppercase tracking-widest">
                  Long-form Editorial Content
                </h4>

                <div>
                  <label className="block font-mono text-xs text-ivory-muted uppercase tracking-wider mb-1">
                    Executive Pull Quote
                  </label>
                  <input
                    type="text"
                    placeholder="StudioFlag transformed our esoteric mathematical thesis into a visceral visual language..."
                    value={formData.pull_quote || ''}
                    onChange={(e) => setFormData({ ...formData, pull_quote: e.target.value })}
                    className="w-full bg-ink border border-ink-border rounded-lg px-3.5 py-2 text-sm text-ivory font-display italic focus:border-brass focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-mono text-xs text-ivory-muted uppercase tracking-wider mb-1">
                      Phase 01: Challenge
                    </label>
                    <textarea
                      rows={4}
                      value={formData.challenge || ''}
                      onChange={(e) => setFormData({ ...formData, challenge: e.target.value })}
                      className="w-full bg-ink border border-ink-border rounded-lg p-2.5 text-xs text-ivory leading-relaxed focus:border-brass focus:outline-none resize-none font-body"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-xs text-ivory-muted uppercase tracking-wider mb-1">
                      Phase 02: Approach
                    </label>
                    <textarea
                      rows={4}
                      value={formData.approach || ''}
                      onChange={(e) => setFormData({ ...formData, approach: e.target.value })}
                      className="w-full bg-ink border border-ink-border rounded-lg p-2.5 text-xs text-ivory leading-relaxed focus:border-brass focus:outline-none resize-none font-body"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-xs text-ivory-muted uppercase tracking-wider mb-1">
                      Phase 03: Outcome
                    </label>
                    <textarea
                      rows={4}
                      value={formData.outcome || ''}
                      onChange={(e) => setFormData({ ...formData, outcome: e.target.value })}
                      className="w-full bg-ink border border-ink-border rounded-lg p-2.5 text-xs text-ivory leading-relaxed focus:border-brass focus:outline-none resize-none font-body"
                    />
                  </div>
                </div>
              </div>

            </form>

            {/* Fixed Sticky Footer */}
            <div className="px-6 py-4 border-t border-ink-border bg-ink-surface/95 backdrop-blur-md flex items-center justify-between flex-shrink-0 font-mono text-xs z-10">
              <span className="text-ivory-subtle text-[11px] hidden sm:inline">
                {editingId ? `RECORD ID: ${editingId.slice(0, 8)}...` : 'CREATING NEW ARCHIVAL DOSSIER'}
              </span>
              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-5 py-2.5 rounded-pill border border-ink-border hover:bg-ink text-ivory-muted hover:text-ivory transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="dossier-form"
                  className="px-6 py-2.5 rounded-pill bg-brass hover:bg-brass-hover text-ink font-semibold uppercase tracking-wider shadow-glow-sm transition-all flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{editingId ? 'Update Dossier' : 'Publish to Catalog'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


