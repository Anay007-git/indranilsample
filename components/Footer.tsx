'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Globe2, Shield } from 'lucide-react';
import BookCallModal from './BookCallModal';

export default function Footer() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <footer className="relative bg-ink-surface border-t border-ink-border mt-24 pt-20 pb-12 overflow-hidden">
        {/* Ambient background glow in footer */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-brass/5 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main CTA Section */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 pb-16 border-b border-ink-border/70">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-brass" />
                <span className="font-mono text-xs text-brass uppercase tracking-widest font-medium">
                  PARTNERSHIP & COMMISSIONS
                </span>
              </div>
              <h2 className="font-display text-4xl sm:text-6xl font-medium tracking-tight text-ivory leading-[1.1]">
                Have a vision that demands <span className="italic text-brass font-normal">distinction</span>?
              </h2>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <button
                onClick={() => setIsModalOpen(true)}
                className="group inline-flex items-center gap-3 px-8 py-4 rounded-pill bg-brass hover:bg-brass-hover text-ink font-mono text-xs uppercase tracking-widest font-semibold transition-all duration-300 shadow-glow hover:scale-[1.02]"
              >
                <span>Start a Project</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>

              <Link
                href="/admin/case-studies"
                className="inline-flex items-center gap-2 px-5 py-4 rounded-pill border border-ink-border hover:border-brass text-ivory-muted hover:text-brass font-mono text-xs uppercase tracking-wider transition-all"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin CMS</span>
              </Link>
            </div>
          </div>

          {/* Quick links & Locations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-12 border-b border-ink-border/50 text-sm">
            <div>
              <div className="font-display text-lg text-ivory font-medium mb-3">
                StudioFlag<span className="text-brass text-xs align-super font-mono ml-0.5">®</span>
              </div>
              <p className="text-xs text-ivory-muted leading-relaxed font-body max-w-xs">
                A specialized creative brand consultancy engineering definitive visual identities, bespoke design systems, and digital flagships.
              </p>
            </div>

            <div>
              <span className="block font-mono text-xs text-brass uppercase tracking-wider mb-3">
                LOCATIONS
              </span>
              <ul className="space-y-1.5 font-mono text-xs text-ivory-muted">
                <li>LONDON — 24 Berkeley Sq.</li>
                <li>ZURICH — Talstrasse 14</li>
                <li>NEW YORK — 84 Wooster St.</li>
                <li>TOKYO — Minami-Aoyama</li>
              </ul>
            </div>

            <div>
              <span className="block font-mono text-xs text-brass uppercase tracking-wider mb-3">
                DIRECT INQUIRIES
              </span>
              <ul className="space-y-1.5 font-mono text-xs text-ivory-muted">
                <li>commissions@studioflag.agency</li>
                <li>press@studioflag.agency</li>
                <li>PGP Fingerprint: 4E91 B210</li>
              </ul>
            </div>

            <div>
              <span className="block font-mono text-xs text-brass uppercase tracking-wider mb-3">
                LEGAL & ARCHIVE
              </span>
              <ul className="space-y-1.5 font-mono text-xs text-ivory-muted">
                <li>Registered Creative Protocol</li>
                <li>All Rights Reserved © {new Date().getFullYear()}</li>
                <li>Private Dossier Standard 2.4</li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar in Mono Type */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-ivory-subtle">
            <div className="flex items-center gap-2">
              <Globe2 className="w-3.5 h-3.5 text-brass/70" />
              <span>GLOBAL BRAND DOSSIER ARCHIVE — EDITION 2025</span>
            </div>

            <div className="flex items-center gap-6">
              <span>DESIGNED WITH RESTRAINT</span>
              <span className="text-brass">EST. MMXXII</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Consultation Modal */}
      <BookCallModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
