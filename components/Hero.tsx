'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import KineticMarquee from './KineticMarquee';
import TextScramble from './TextScramble';

gsap.registerPlugin(ScrollTrigger);

interface HeroProps {
  caseStudyCount: number;
}

export default function Hero({ caseStudyCount }: HeroProps) {
  const heroRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !eyebrowRef.current || !heroRef.current) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.to(eyebrowRef.current, {
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'bottom 85%',
          end: 'bottom 40%',
          scrub: true,
        },
        opacity: 0.15,
        y: -15,
        scale: 0.95,
        ease: 'power1.out',
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  // Words array for masked staggered reveal
  const headlineWords = [
    { text: 'We', isItalic: false },
    { text: 'engineer', isItalic: false },
    { text: 'definitive', isItalic: true },
    { text: 'visual', isItalic: false },
    { text: 'identities', isItalic: false },
    { text: 'for', isItalic: false },
    { text: 'the', isItalic: false },
    { text: "world's", isItalic: false },
    { text: 'most', isItalic: false },
    { text: 'ambitious', isItalic: false },
    { text: 'ventures.', isItalic: false },
  ];

  return (
    <section
      ref={heroRef}
      onMouseMove={handleMouseMove}
      className="relative pt-16 pb-0 sm:pt-24 border-b border-ink-border/40 overflow-hidden"
    >
      {/* Dynamic Specular Light Glow */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-500 opacity-60"
        style={{
          background: `radial-gradient(circle 380px at ${mousePos.x}% ${mousePos.y}%, rgba(198,161,91,0.08), transparent 75%)`,
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 sm:pb-16 relative z-10">
        {/* Mono Eyebrow with smooth TextScramble */}
        <div ref={eyebrowRef}>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="w-8 h-[1px] bg-brass/70" />
            <span className="font-mono text-xs text-brass uppercase tracking-[0.2em] font-medium">
              <TextScramble
                text={`SELECTED WORK — ${caseStudyCount} DOSSIERS`}
                triggerOnMount={true}
                triggerOnHover={true}
                speed={45}
              />
            </span>
          </motion.div>
        </div>

        {/* Large Fraunces Headline with Masked Word Stagger & Luxury Shimmer */}
        <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-medium tracking-tight text-ivory max-w-5xl leading-[1.15] mb-8 flex flex-wrap gap-x-3.5 sm:gap-x-5 gap-y-2 sm:gap-y-3.5">
          {headlineWords.map((word, idx) => (
            <span key={idx} className="overflow-hidden inline-block pt-1 pb-4 -mb-3.5 px-0.5">
              <motion.span
                initial={{ y: '120%', opacity: 0, rotate: 2 }}
                animate={{ y: '0%', opacity: 1, rotate: 0 }}
                transition={{
                  duration: 0.85,
                  delay: 0.08 + idx * 0.045,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={`inline-block origin-bottom-left ${
                  word.isItalic
                    ? 'italic shimmer-brass font-normal pr-2'
                    : 'text-ivory'
                }`}
              >
                {word.text}
              </motion.span>
            </span>
          ))}
        </h1>

        {/* Supporting Paragraph */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-6"
        >
          <p className="text-base sm:text-lg text-ivory-muted max-w-[46ch] leading-relaxed font-body font-normal">
            A curated portfolio of brand architectures, editorial systems, and digital dossiers crafted for breakthrough pioneers.
          </p>

          <div className="hidden lg:flex items-center gap-6 font-mono text-xs text-ivory-muted border-l border-ink-border pl-6 py-1">
            <div>
              <span className="block text-ivory font-medium">INDEX 2023–2025</span>
              <span className="text-ivory-subtle">EDITION IV</span>
            </div>
            <div>
              <span className="block text-ivory font-medium">DISCIPLINE</span>
              <span className="text-ivory-subtle">IDENTITY / 3D / SPATIAL</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Velocity-Driven Kinetic Marquee Ticker */}
      <KineticMarquee
        items={[
          'STRATEGIC BRANDING',
          'EDITORIAL IDENTITY',
          'SPATIAL DESIGN',
          'QUANTUM DOSSIERS',
          'TYPOGRAPHIC DISCIPLINE',
          'HIGH-GROWTH ARCHITECTURE',
        ]}
      />
    </section>
  );
}


