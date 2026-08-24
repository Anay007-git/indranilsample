'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, Calendar, Mail, ArrowRight } from 'lucide-react';

interface BookCallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BookCallModal({ isOpen, onClose }: BookCallModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    budget: '$30k - $60k',
    scope: 'Full Identity System',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormData({
      name: '',
      email: '',
      company: '',
      budget: '$30k - $60k',
      scope: 'Full Identity System',
      notes: '',
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-ink/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-xl bg-ink-surface border border-ink-border rounded-card p-6 sm:p-8 shadow-editorial z-10 text-ivory"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 text-ivory-muted hover:text-ivory rounded-full hover:bg-ink-border transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {!submitted ? (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brass animate-pulse" />
                  <span className="font-mono text-xs text-brass uppercase tracking-widest">
                    Direct Consultation
                  </span>
                </div>
                <h3 className="font-display text-2xl sm:text-3xl font-medium tracking-tight text-ivory mb-2">
                  Initiate a <span className="italic text-brass font-normal">briefing</span> call.
                </h3>
                <p className="text-sm text-ivory-muted mb-6 leading-relaxed">
                  We take on 4 bespoke identity commissions per quarter. Share your project parameters to schedule an introductory strategy session.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-mono text-xs text-ivory-muted uppercase tracking-wider mb-1.5">
                        Your Name *
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="Elena Vance"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-ink border border-ink-border rounded-lg px-3.5 py-2.5 text-sm text-ivory placeholder:text-ivory-subtle focus:border-brass focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-xs text-ivory-muted uppercase tracking-wider mb-1.5">
                        Work Email *
                      </label>
                      <input
                        required
                        type="email"
                        placeholder="elena@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-ink border border-ink-border rounded-lg px-3.5 py-2.5 text-sm text-ivory placeholder:text-ivory-subtle focus:border-brass focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-mono text-xs text-ivory-muted uppercase tracking-wider mb-1.5">
                        Organization / Venture
                      </label>
                      <input
                        type="text"
                        placeholder="Aethelgard Labs"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="w-full bg-ink border border-ink-border rounded-lg px-3.5 py-2.5 text-sm text-ivory placeholder:text-ivory-subtle focus:border-brass focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-xs text-ivory-muted uppercase tracking-wider mb-1.5">
                        Anticipated Capital
                      </label>
                      <select
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        className="w-full bg-ink border border-ink-border rounded-lg px-3.5 py-2.5 text-sm text-ivory focus:border-brass focus:outline-none transition-colors"
                      >
                        <option value="$30k - $60k">$30k – $60k</option>
                        <option value="$60k - $120k">$60k – $120k</option>
                        <option value="$120k+">$120k+ (Enterprise/Global)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-mono text-xs text-ivory-muted uppercase tracking-wider mb-1.5">
                      Scope of Engagement
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {['Full Identity System', 'Digital Dossier', 'Packaging & 3D'].map((sc) => (
                        <button
                          type="button"
                          key={sc}
                          onClick={() => setFormData({ ...formData, scope: sc })}
                          className={`px-2.5 py-2 text-xs rounded-lg border text-center transition-all ${
                            formData.scope === sc
                              ? 'bg-brass/10 border-brass text-brass font-medium'
                              : 'border-ink-border text-ivory-muted hover:border-ink-borderLight hover:text-ivory'
                          }`}
                        >
                          {sc}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block font-mono text-xs text-ivory-muted uppercase tracking-wider mb-1.5">
                      Project Notes / Timeline
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Briefly describe the product, timeline, or key milestones..."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full bg-ink border border-ink-border rounded-lg px-3.5 py-2 text-sm text-ivory placeholder:text-ivory-subtle focus:border-brass focus:outline-none transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-2 py-3 px-6 rounded-pill bg-brass hover:bg-brass-hover text-ink font-medium text-sm flex items-center justify-center gap-2 transition-all group font-mono tracking-wide"
                  >
                    <span>REQUEST BRIEFING SESSION</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-12 h-12 rounded-full bg-brass/15 border border-brass/40 flex items-center justify-center mx-auto mb-4 text-brass">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="font-display text-2xl font-medium text-ivory mb-2">
                  Dossier Received.
                </h3>
                <p className="text-sm text-ivory-muted max-w-sm mx-auto mb-6">
                  Thank you, <span className="text-ivory font-medium">{formData.name}</span>. Partner director will review your project parameters and respond within 24 hours.
                </p>
                <button
                  onClick={handleReset}
                  className="px-6 py-2.5 rounded-pill border border-ink-border hover:border-brass text-xs font-mono uppercase tracking-wider text-ivory-muted hover:text-brass transition-all"
                >
                  Close Dossier
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
