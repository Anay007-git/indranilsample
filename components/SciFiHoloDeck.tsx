'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Crosshair, Activity, Sparkles, ArrowUpRight, Compass } from 'lucide-react';
import TextScramble from './TextScramble';

gsap.registerPlugin(ScrollTrigger);

const PHASES = [
  {
    tag: 'STAGE // 01',
    code: 'TOPOLOGY_MATRIX',
    title: 'Precision Vector Topology',
    projectName: 'Aethelgard AI',
    projectCategory: 'AI & Neural Systems',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=85',
    accentColor: '#00F0FF',
    description:
      'We formulate bespoke mathematical geometries and sculptural letterforms built to scale seamlessly across digital and physical dimensions.',
    metrics: [
      { label: 'RESOLUTION', value: '8K VECTORS' },
      { label: 'TOLERANCE', value: '0.001 MM' },
      { label: 'GRID SYSTEM', value: 'GOLDEN RATIO' },
    ],
  },
  {
    tag: 'STAGE // 02',
    code: 'EDITORIAL_SYSTEM',
    title: 'Adaptive Editorial Architecture',
    projectName: 'Vanguard Capital',
    projectCategory: 'Fintech & Capital Architecture',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=85',
    accentColor: '#C6A15B',
    description:
      'Comprehensive design frameworks that unite high-contrast serif typography with tactical mono readouts for uncompromising brand authority.',
    metrics: [
      { label: 'CONTRAST', value: 'EDITORIAL IV' },
      { label: 'TYPE SYSTEM', value: 'FRAUNCES + IBM' },
      { label: 'COHESION', value: '100% UNIFIED' },
    ],
  },
  {
    tag: 'STAGE // 03',
    code: 'DEPLOYMENT_ENGINE',
    title: 'Interactive Dossier Deployment',
    projectName: 'Terraform Oceanic',
    projectCategory: 'Climate & Deep Tech',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    accentColor: '#5E8B7E',
    description:
      'Definitive digital dossiers, pitch architectures, and interactive artifacts engineered to unlock institutional trust and capital conviction.',
    metrics: [
      { label: 'LATENCY', value: '0.04 MS' },
      { label: 'CLEARANCE', value: 'INSTITUTIONAL' },
      { label: 'CONVERSION', value: '+140% AVERAGE' },
    ],
  },
];

export default function SciFiHoloDeck() {
  const pinSectionRef = useRef<HTMLDivElement>(null);
  const holoStageRef = useRef<HTMLDivElement>(null);
  const [activeStage, setActiveStage] = useState(0);
  const [scrollPct, setScrollPct] = useState(0);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !pinSectionRef.current) {
      return;
    }

    const ctx = gsap.context(() => {
      // Pinned Holo-Deck Scrollytelling Timeline with Smooth Damped Scrub
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinSectionRef.current,
          start: 'top top',
          end: '+=300%',
          pin: true,
          scrub: 0.8,
          onUpdate: (self) => {
            const p = self.progress;
            setScrollPct(Math.round(p * 100));
            if (p < 0.35) {
              setActiveStage(0);
            } else if (p < 0.70) {
              setActiveStage(1);
            } else {
              setActiveStage(2);
            }
          },
        },
      });

      // Silky smooth rotation of the outer calipers
      if (holoStageRef.current) {
        tl.to('.holo-outer-ring', {
          rotate: 360,
          ease: 'none',
        }, 0);
        tl.to('.holo-inner-ring', {
          rotate: -360,
          ease: 'none',
        }, 0);
      }
    }, pinSectionRef);

    return () => ctx.revert();
  }, []);

  const currentPhase = PHASES[activeStage];

  return (
    <section
      ref={pinSectionRef}
      className="relative min-h-screen bg-ink text-ivory flex items-center justify-center overflow-hidden border-b border-ink-border select-none py-12 sm:py-16 lg:py-20"
    >
      {/* Background Holographic Cyber Grid Matrix */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,240,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(0,240,255,0.035)_1px,transparent_1px)] bg-[size:28px_28px] sm:bg-[size:36px_36px] pointer-events-none opacity-80" />

      {/* Ambient Central Quantum Flare */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[500px] lg:w-[700px] h-[350px] sm:h-[500px] lg:h-[700px] bg-radial-gradient from-cyan-500/10 via-brass/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* 4 Master HUD Corner Brackets */}
      <div className="absolute top-4 left-4 sm:top-8 sm:left-8 w-5 h-5 sm:w-8 sm:h-8 border-t-2 border-l-2 border-cyan-400/60" />
      <div className="absolute top-4 right-4 sm:top-8 sm:right-8 w-5 h-5 sm:w-8 sm:h-8 border-t-2 border-r-2 border-cyan-400/60" />
      <div className="absolute bottom-4 left-4 sm:bottom-8 sm:left-8 w-5 h-5 sm:w-8 sm:h-8 border-b-2 border-l-2 border-cyan-400/60" />
      <div className="absolute bottom-4 right-4 sm:bottom-8 sm:right-8 w-5 h-5 sm:w-8 sm:h-8 border-b-2 border-r-2 border-cyan-400/60" />

      {/* Top HUD Telemetry Bar */}
      <div className="absolute top-4 sm:top-8 inset-x-4 sm:inset-x-8 lg:inset-x-16 flex items-center justify-between font-mono text-xs text-ivory-subtle border-b border-ink-border pb-2.5 z-20">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-cyan-300 font-semibold tracking-widest text-[10px] sm:text-[11px]">
            HOLOGRAPHIC BLUEPRINT // v3.4
          </span>
        </div>
        <div className="flex items-center gap-3 text-[9px] sm:text-[10px] text-brass">
          <span>PROGRESS: {scrollPct}%</span>
          <span className="hidden sm:inline">•</span>
          <span className="hidden sm:inline">CALIBRATION: ACTIVE</span>
        </div>
      </div>

      {/* Main Center Scrollytelling Stage */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-10 sm:pt-14 pb-6 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-center relative z-10">
        
        {/* Left Column: Holographic 3D Circular Iris Lens */}
        <div className="lg:col-span-6 flex items-center justify-center relative">
          <div
            ref={holoStageRef}
            className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-[420px] lg:h-[420px] flex items-center justify-center"
          >
            {/* Outer Cyan Caliper Ring */}
            <div className="holo-outer-ring absolute inset-0 rounded-full border border-dashed border-cyan-400/60 shadow-[0_0_35px_rgba(0,240,255,0.2)] pointer-events-none" />
            
            {/* Counter-Rotating Brass Ring with Degree Markings */}
            <div className="holo-inner-ring absolute inset-3 sm:inset-4 rounded-full border border-dotted border-brass/70 pointer-events-none" />

            {/* Segmented Reticle Arcs */}
            <div className="absolute inset-6 sm:inset-8 rounded-full border-2 border-t-cyan-400 border-r-transparent border-b-brass border-l-transparent animate-[spin-slow_8s_linear_infinite] pointer-events-none" />

            {/* Center Perfectly Masked Circular Holographic Iris Viewport */}
            <div className="relative w-52 h-52 sm:w-64 sm:h-64 lg:w-76 lg:h-76 rounded-full overflow-hidden border-2 border-cyan-400/90 shadow-[0_0_45px_rgba(0,240,255,0.35)] bg-black/90 backdrop-blur-xl flex items-center justify-center">
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPhase.image}
                  initial={{ opacity: 0, scale: 0.92, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, scale: 1.08, filter: 'blur(4px)' }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 w-full h-full rounded-full overflow-hidden"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={currentPhase.image}
                    alt={currentPhase.projectName}
                    className="w-full h-full object-cover brightness-90 contrast-110 saturate-110"
                  />
                  {/* Radial Lens Darkening / Vignette Mask */}
                  <div className="absolute inset-0 rounded-full bg-radial-gradient from-transparent via-black/40 to-black/90 pointer-events-none" />

                  {/* Circular Visor HUD Grid */}
                  <div className="absolute inset-0 rounded-full bg-[linear-gradient(rgba(0,240,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(0,240,255,0.08)_1px,transparent_1px)] bg-[size:14px_14px] opacity-75 pointer-events-none" />

                  {/* Laser Scan Beam */}
                  <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#00f0ff] animate-[scan_2.4s_ease-in-out_infinite]" />
                </motion.div>
              </AnimatePresence>

              {/* Crosshair Center Reticle */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <Crosshair className="w-8 h-8 sm:w-12 sm:h-12 text-cyan-400/50 animate-pulse" />
              </div>

              {/* Circular Top HUD Badge */}
              <div className="absolute top-2.5 sm:top-4 inset-x-0 flex justify-center z-10 pointer-events-none">
                <span className="font-mono text-[8px] sm:text-[9px] text-cyan-300 font-bold bg-black/85 border border-cyan-500/60 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-pill uppercase tracking-widest backdrop-blur-md shadow-sm">
                  {currentPhase.code}
                </span>
              </div>

              {/* Circular Bottom HUD Readout Plate */}
              <div className="absolute bottom-2.5 sm:bottom-4 inset-x-3 sm:inset-x-4 z-10">
                <div className="bg-black/90 border border-ink-border rounded-xl p-1.5 sm:p-2.5 backdrop-blur-md text-center shadow-lg">
                  <span className="block font-mono text-[7px] sm:text-[8px] text-cyan-400 uppercase tracking-widest mb-0.5">
                    {currentPhase.projectCategory}
                  </span>
                  <h3 className="font-display text-xs sm:text-sm font-medium text-ivory truncate">
                    {currentPhase.projectName}
                  </h3>
                </div>
              </div>
            </div>
          </div>

          {/* Micro Telemetry Ticks */}
          <div className="hidden sm:block absolute -bottom-5 left-4 font-mono text-[8.5px] text-cyan-400/80">
            [SYS_LATENCY: 0.02MS]
          </div>
          <div className="hidden sm:block absolute -bottom-5 right-4 font-mono text-brass/80 text-[8.5px]">
            [GRID_SECURITY: VERIFIED]
          </div>
        </div>

        {/* Right Column: Dynamic Stage Content with Smooth Decryption */}
        <div className="lg:col-span-6 space-y-4 sm:space-y-6 text-left">
          {/* Stage Pill Indicator */}
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-pill bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono text-[11px] tracking-widest uppercase shadow-glow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>{currentPhase.tag}</span>
          </div>

          {/* Phase Title with Text Scramble */}
          <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-ivory leading-[1.12]">
            <TextScramble
              key={currentPhase.title}
              text={currentPhase.title}
              triggerOnMount={true}
              speed={35}
            />
          </h2>

          {/* Phase Description */}
          <p className="text-sm sm:text-base text-ivory-muted leading-relaxed font-body max-w-xl">
            {currentPhase.description}
          </p>

          {/* Metrics Telemetry Grid */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-3 sm:pt-4 border-t border-ink-border">
            {currentPhase.metrics.map((metric, i) => (
              <div key={i} className="bg-ink-surface/80 border border-ink-border rounded-xl p-2.5 sm:p-3.5 backdrop-blur-sm">
                <span className="block font-mono text-[8px] sm:text-[9px] text-ivory-subtle uppercase tracking-wider mb-0.5 sm:mb-1">
                  {metric.label}
                </span>
                <span className="font-mono text-[11px] sm:text-xs lg:text-sm font-semibold text-brass truncate block">
                  {metric.value}
                </span>
              </div>
            ))}
          </div>

          {/* Scroll Down Progress Track */}
          <div className="pt-2 flex items-center justify-between font-mono text-[10px] sm:text-[11px] text-ivory-subtle border-t border-ink-border/50">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brass/60 animate-ping" />
              <span>SCROLL: {scrollPct}%</span>
            </div>
            <div className="flex gap-1.5">
              {[0, 1, 2].map((idx) => (
                <span
                  key={idx}
                  className={`w-5 sm:w-6 h-1 sm:h-1.5 rounded-full transition-all duration-500 ${
                    activeStage === idx
                      ? 'bg-cyan-400 shadow-[0_0_8px_#00f0ff]'
                      : 'bg-ink-border'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
