'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, Sparkles, TrendingUp, Award, Layers } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CaseStudy } from '@/types/database';
import { formatIndex } from '@/lib/utils';
import TextScramble from './TextScramble';

gsap.registerPlugin(ScrollTrigger);

interface CaseStudyScrollytellingProps {
  project: CaseStudy;
  nextProject: CaseStudy | null;
}

export default function CaseStudyScrollytelling({
  project,
  nextProject,
}: CaseStudyScrollytellingProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroPinRef = useRef<HTMLDivElement>(null);
  const heroMediaRef = useRef<HTMLDivElement>(null);
  const heroTitleRef = useRef<HTMLDivElement>(null);
  const pullQuoteRef = useRef<HTMLDivElement>(null);
  const galleryTrackRef = useRef<HTMLDivElement>(null);
  const galleryPinRef = useRef<HTMLDivElement>(null);
  const nextProjectRef = useRef<HTMLDivElement>(null);

  const [counterValues, setCounterValues] = useState({
    stat1: 0,
    stat2: 0,
    stat3: 0,
  });

  const accentColor = project.accent_color || '#C6A15B';
  const galleryList = project.gallery_images && project.gallery_images.length > 0
    ? project.gallery_images
    : [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80',
      ];

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !containerRef.current) {
      setCounterValues({ stat1: 140, stat2: 98, stat3: 42 });
      return;
    }

    const ctx = gsap.context(() => {
      // 1. Pinned Hero Animation: image scales and desaturates while title fades out
      if (heroPinRef.current && heroMediaRef.current && heroTitleRef.current) {
        const heroTl = gsap.timeline({
          scrollTrigger: {
            trigger: heroPinRef.current,
            start: 'top top',
            end: '+=80%',
            pin: true,
            scrub: 0.6,
          },
        });

        heroTl.to(heroMediaRef.current, {
          scale: 1.08,
          filter: 'grayscale(25%) brightness(0.75)',
          ease: 'none',
        }, 0);

        heroTl.to(heroTitleRef.current, {
          opacity: 0.1,
          y: -40,
          ease: 'none',
        }, 0);
      }

      // 2. Section Numbers Slide-In on Scroll
      const sectionNumbers = gsap.utils.toArray<HTMLElement>('.dossier-section-num');
      sectionNumbers.forEach((elem) => {
        gsap.fromTo(
          elem,
          { x: -60, opacity: 0.2 },
          {
            x: 0,
            opacity: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: elem,
              start: 'top 85%',
              end: 'top 45%',
              scrub: true,
            },
          }
        );
      });

      // 3. Pull Quote Scrub: scale from 0.90 to 1 with opacity transition
      if (pullQuoteRef.current) {
        gsap.fromTo(
          pullQuoteRef.current,
          { scale: 0.9, opacity: 0.35 },
          {
            scale: 1,
            opacity: 1,
            ease: 'power1.out',
            scrollTrigger: {
              trigger: pullQuoteRef.current,
              start: 'top 85%',
              end: 'center center',
              scrub: true,
            },
          }
        );
      }

      // 4. Horizontal Scroll Gallery Section (Pinned)
      if (galleryPinRef.current && galleryTrackRef.current && galleryList.length >= 4) {
        const totalWidth = galleryTrackRef.current.scrollWidth;
        const viewportWidth = window.innerWidth;
        const distanceToScroll = totalWidth - viewportWidth + 120;

        if (distanceToScroll > 0) {
          gsap.to(galleryTrackRef.current, {
            x: -distanceToScroll,
            ease: 'none',
            scrollTrigger: {
              trigger: galleryPinRef.current,
              start: 'top 12%',
              end: () => `+=${distanceToScroll * 1.1}`,
              pin: true,
              scrub: 0.8,
              invalidateOnRefresh: true,
            },
          });
        }
      }

      // 5. Stats / Results Count-Up Trigger
      ScrollTrigger.create({
        trigger: '.stats-counter-section',
        start: 'top 80%',
        once: true,
        onEnter: () => {
          gsap.to(
            { val1: 0, val2: 0, val3: 0 },
            {
              val1: 140,
              val2: 98,
              val3: 42,
              duration: 2,
              ease: 'power2.out',
              onUpdate: function () {
                setCounterValues({
                  stat1: Math.round(this.targets()[0].val1),
                  stat2: Math.round(this.targets()[0].val2),
                  stat3: Math.round(this.targets()[0].val3),
                });
              },
            }
          );
        },
      });

      // 6. Next Project Footer Background Cross-fade
      if (nextProjectRef.current) {
        gsap.fromTo(
          '.next-project-ambient-bg',
          { opacity: 0, scale: 0.95 },
          {
            opacity: 0.25,
            scale: 1,
            scrollTrigger: {
              trigger: nextProjectRef.current,
              start: 'top 90%',
              end: 'bottom bottom',
              scrub: true,
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [galleryList.length]);

  return (
    <div ref={containerRef} className="relative">
      {/* Top Back Navigation & Eyebrow */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 pt-8">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono text-ivory-muted hover:text-brass transition-colors py-1.5 px-3 rounded-pill border border-ink-border hover:border-brass/40 bg-ink-surface/50"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>RETURN TO WORK</span>
          </Link>

          <div className="font-mono text-xs text-brass tracking-widest uppercase flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-brass animate-pulse" />
            <span>DOSSIER ARCHIVE № {formatIndex(project.sort_order || 1)}</span>
          </div>
        </div>
      </div>

      {/* Pinned Hero Section with GSAP Scrollytelling */}
      <section ref={heroPinRef} className="relative min-h-[90vh] flex flex-col justify-between mb-16 overflow-hidden">
        {/* Hero Header Details */}
        <div ref={heroTitleRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-4 pb-8 z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8">
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <span className="px-3 py-1 rounded-pill text-xs font-mono tracking-wider bg-sage-muted text-sage border border-sage-border">
                  {project.category}
                </span>
                <span className="font-mono text-xs text-ivory-muted">
                  EST. {project.year}
                </span>
                {project.featured && (
                  <span className="font-mono text-xs text-brass uppercase tracking-widest flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> FEATURED COMMISSION
                  </span>
                )}
              </div>

              <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-medium tracking-tight text-ivory leading-[1.08] mb-4">
                <TextScramble text={project.name} triggerOnMount={true} triggerOnHover={true} speed={24} />
              </h1>

              <p className="text-lg sm:text-xl text-ivory-muted max-w-2xl leading-relaxed font-normal">
                {project.one_liner}
              </p>
            </div>

            {/* Sidebar scope specs */}
            <div className="lg:col-span-4 bg-ink-surface border border-ink-border rounded-card p-5 space-y-3">
              {project.client_name && (
                <div className="border-b border-ink-border/50 pb-2.5">
                  <span className="block font-mono text-[10px] text-ivory-subtle uppercase tracking-wider mb-0.5">
                    Client Attribution
                  </span>
                  <span className="text-sm font-medium text-ivory">
                    {project.client_name}
                  </span>
                </div>
              )}

              <div>
                <span className="block font-mono text-[10px] text-ivory-subtle uppercase tracking-wider mb-1.5">
                  Scope Disciplines
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(project.services && project.services.length > 0
                    ? project.services
                    : ['Brand Architecture', 'Visual Identity System', 'Interactive Dossier']
                  ).map((service) => (
                    <span
                      key={service}
                      className="px-2.5 py-0.5 rounded-pill text-[10px] font-mono bg-ink border border-ink-border text-ivory-muted"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Visual Media Layer (Scaled by ScrollTrigger) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-6 z-10">
          <div
            ref={heroMediaRef}
            className="relative w-full h-[400px] sm:h-[540px] rounded-card overflow-hidden border border-ink-border shadow-editorial flex items-center justify-center p-8 text-center origin-center transition-all"
            style={{
              background: project.hero_image
                ? `linear-gradient(to bottom, rgba(13,12,11,0.25), rgba(13,12,11,0.85)), url(${project.hero_image}) center/cover no-repeat`
                : `radial-gradient(circle at 50% 30%, ${accentColor}44 0%, #151310 60%, #0D0C0B 100%)`,
            }}
          >
            {!project.hero_image && (
              <div className="relative z-10 max-w-lg">
                <div className="w-20 h-20 rounded-full border border-brass/40 flex items-center justify-center mx-auto mb-4 bg-ink/70 backdrop-blur-md">
                  <span className="font-display italic text-3xl text-brass">
                    {project.name.charAt(0)}
                  </span>
                </div>
                <h3 className="font-display text-2xl text-ivory font-medium">
                  {project.name} Archive Dossier
                </h3>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Pull Quote Callout (Scrubbed with GSAP) */}
      {project.pull_quote && (
        <section ref={pullQuoteRef} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 my-20 sm:my-28 text-center">
          <blockquote className="relative bg-ink-surface/50 border border-ink-border p-8 sm:p-12 rounded-card shadow-editorial">
            <span className="font-display text-5xl sm:text-6xl text-brass/40 block mb-2 font-serif">
              “
            </span>
            <p className="font-display italic text-2xl sm:text-3xl text-ivory leading-relaxed font-normal">
              {project.pull_quote}
            </p>
            <div className="mt-6 flex items-center justify-center gap-2 font-mono text-xs text-brass uppercase tracking-widest">
              <span className="w-4 h-[1px] bg-brass/60" />
              <span>EXECUTIVE TESTIMONY — {project.client_name || project.name}</span>
              <span className="w-4 h-[1px] bg-brass/60" />
            </div>
          </blockquote>
        </section>
      )}

      {/* Editorial Long-form Sections with Slide-in Numbers */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 my-24">
        {/* Phase 01: Challenge */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-10 border-t border-ink-border pt-12">
          <div className="md:col-span-5">
            <div className="dossier-section-num flex items-center gap-2 font-mono text-xs text-brass uppercase tracking-widest mb-2 font-semibold">
              <span className="w-2 h-2 rounded-full bg-brass" />
              <span>01 — THE CHALLENGE</span>
            </div>
            <h2 className="font-display text-3xl font-medium text-ivory">
              Problem & Positioning
            </h2>
          </div>
          <div className="md:col-span-7 space-y-4 text-base sm:text-lg text-ivory-muted leading-relaxed font-body">
            <p>
              {project.challenge ||
                `${project.name} required a radical positioning paradigm that could communicate technical breakthroughs to institutional stakeholders without diluting core identity.`}
            </p>
          </div>
        </div>

        {/* Phase 02: Approach */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-10 border-t border-ink-border pt-12">
          <div className="md:col-span-5">
            <div className="dossier-section-num flex items-center gap-2 font-mono text-xs text-brass uppercase tracking-widest mb-2 font-semibold">
              <span className="w-2 h-2 rounded-full bg-brass" />
              <span>02 — STRATEGIC APPROACH</span>
            </div>
            <h2 className="font-display text-3xl font-medium text-ivory">
              Design Architecture
            </h2>
          </div>
          <div className="md:col-span-7 space-y-4 text-base sm:text-lg text-ivory-muted leading-relaxed font-body">
            <p>
              {project.approach ||
                `We architected an uncompromising design system combining bespoke typography, precision grid geometry, and tactile material treatments that evoke lasting permanence.`}
            </p>
          </div>
        </div>

        {/* Phase 03: Outcome */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-10 border-t border-ink-border pt-12">
          <div className="md:col-span-5">
            <div className="dossier-section-num flex items-center gap-2 font-mono text-xs text-brass uppercase tracking-widest mb-2 font-semibold">
              <span className="w-2 h-2 rounded-full bg-brass" />
              <span>03 — MARKET OUTCOME</span>
            </div>
            <h2 className="font-display text-3xl font-medium text-ivory">
              Commercial Impact
            </h2>
          </div>
          <div className="md:col-span-7 space-y-4 text-base sm:text-lg text-ivory-muted leading-relaxed font-body">
            <p>
              {project.outcome ||
                `The redesigned identity unlocked substantial institutional trust, accelerated customer acquisition, and established ${project.name} as the undisputed category vanguard.`}
            </p>
          </div>
        </div>
      </section>

      {/* Stats / Results Count-Up Section */}
      <section className="stats-counter-section max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 my-20">
        <div className="bg-ink-surface border border-ink-border rounded-card p-8 sm:p-10 shadow-editorial grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-ink-border">
          <div className="pt-4 md:pt-0">
            <span className="block font-display text-4xl sm:text-5xl font-medium text-brass mb-1">
              +{counterValues.stat1}%
            </span>
            <span className="font-mono text-xs text-ivory-muted uppercase tracking-wider">
              Institutional Conversion
            </span>
          </div>
          <div className="pt-4 md:pt-0">
            <span className="block font-display text-4xl sm:text-5xl font-medium text-ivory mb-1">
              {counterValues.stat2}.8%
            </span>
            <span className="font-mono text-xs text-ivory-muted uppercase tracking-wider">
              Stakeholder Conviction
            </span>
          </div>
          <div className="pt-4 md:pt-0">
            <span className="block font-display text-4xl sm:text-5xl font-medium text-brass mb-1">
              ${counterValues.stat3}M+
            </span>
            <span className="font-mono text-xs text-ivory-muted uppercase tracking-wider">
              Capital Unlocked Post-Launch
            </span>
          </div>
        </div>
      </section>

      {/* Horizontal Scroll Gallery Section (Pinned) */}
      <section ref={galleryPinRef} className="my-28 overflow-hidden py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 flex items-center justify-between font-mono text-xs text-ivory-muted uppercase tracking-widest border-b border-ink-border pb-4">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-brass" />
            <span>HORIZONTAL DOSSIER ARTIFACTS — {galleryList.length} PLATES</span>
          </div>
          <span className="text-brass hidden sm:inline-block">SCROLL TO PAN →</span>
        </div>

        <div
          ref={galleryTrackRef}
          className="flex gap-6 sm:gap-8 px-4 sm:px-8 items-center w-max"
        >
          {galleryList.map((imgUrl, idx) => (
            <div
              key={idx}
              className="relative w-[340px] sm:w-[480px] h-[320px] sm:h-[400px] rounded-card overflow-hidden border border-ink-border flex-shrink-0 shadow-editorial group"
            >
              <div
                className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url(${imgUrl})` }}
              />
              <div className="absolute top-4 left-4 bg-ink/80 backdrop-blur-md px-3 py-1 rounded-pill border border-ink-border font-mono text-xs text-ivory">
                PLATE {formatIndex(idx + 1)}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Next Project Footer Card with Background Crossfade */}
      {nextProject && (
        <section ref={nextProjectRef} className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 border-t border-ink-border">
          {/* Ambient Crossfade Background */}
          <div
            className="next-project-ambient-bg absolute inset-0 -top-12 rounded-card blur-3xl pointer-events-none -z-10 transition-all"
            style={{
              background: `radial-gradient(circle at 70% 50%, ${nextProject.accent_color || '#C6A15B'}55 0%, transparent 70%)`,
            }}
          />

          <div className="flex items-center justify-between mb-4">
            <span className="font-mono text-xs text-brass uppercase tracking-widest font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-brass" />
              ADVANCE TO NEXT DOSSIER
            </span>
            <span className="font-mono text-xs text-ivory-subtle">
              INDEX № {formatIndex(nextProject.sort_order)}
            </span>
          </div>

          <Link
            href={`/work/${nextProject.slug}`}
            className="group block bg-ink-surface hover:bg-ink-surface/85 border border-ink-border hover:border-brass/50 rounded-card p-8 sm:p-12 transition-all duration-300 shadow-editorial"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <span className="inline-block px-3 py-1 rounded-pill text-xs font-mono tracking-wider bg-sage-muted text-sage border border-sage-border mb-3">
                  {nextProject.category}
                </span>
                <h3 className="font-display text-3xl sm:text-5xl font-medium text-ivory group-hover:text-brass transition-colors tracking-tight">
                  {nextProject.name}
                </h3>
                <p className="text-sm text-ivory-muted mt-2 max-w-xl line-clamp-1 font-normal">
                  {nextProject.one_liner}
                </p>
              </div>

              <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-brass self-start md:self-auto">
                <span>OPEN CASE STUDY</span>
                <div className="w-11 h-11 rounded-full border border-brass/40 flex items-center justify-center group-hover:bg-brass group-hover:text-ink transition-all">
                  <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
            </div>
          </Link>
        </section>
      )}
    </div>
  );
}
