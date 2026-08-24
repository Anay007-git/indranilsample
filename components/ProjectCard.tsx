'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowUpRight, Sparkles, Activity, Crosshair } from 'lucide-react';
import { CaseStudy } from '@/types/database';
import { formatIndex } from '@/lib/utils';
import { useJarvis } from './JarvisTransition';
import TextScramble from './TextScramble';
import { soundEffects } from '@/lib/soundEffects';

interface ProjectCardProps {
  project: CaseStudy;
  index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const { openCaseStudy } = useJarvis();

  // 3D Gyroscopic Perspective Tilt Values
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 140, damping: 28 });
  const mouseYSpring = useSpring(y, { stiffness: 140, damping: 28 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['5deg', '-5deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-5deg', '5deg']);

  const initial = project.name.charAt(0);
  const accentColor = project.accent_color || '#C6A15B';
  const heroImage = project.hero_image || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=85';

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);

    setMousePos({ x: (mouseX / width) * 100, y: (mouseY / height) * 100 });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    soundEffects.playHoverChirp();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    soundEffects.playWarp();
    if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
      e.preventDefault();
      openCaseStudy(project.slug, project.name, accentColor);
    }
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 28, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay: (index % 3) * 0.09, ease: [0.16, 1, 0.3, 1] }}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      className="group relative h-full cursor-pointer perspective-1000"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        href={`/work/${project.slug}`}
        prefetch={true}
        onClick={handleCardClick}
        data-cursor="dossier"
        className="relative block h-full bg-ink-surface border border-ink-border rounded-card overflow-hidden transition-all duration-300 hover:border-cyan-500/60 hover:shadow-[0_20px_45px_-12px_rgba(0,240,255,0.3)] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 flex flex-col will-change-transform"
      >
        {/* Holographic Surface Glare Beam */}
        <div
          className="absolute inset-0 pointer-events-none z-30 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
          style={{
            background: `radial-gradient(circle 280px at ${mousePos.x}% ${mousePos.y}%, rgba(255,255,255,0.12), rgba(0,240,255,0.06) 40%, transparent 80%)`,
          }}
        />

        {/* Prominent High-Impact Visual Area with Futuristic Sci-Fi HUD Holographic Overlay */}
        <div className="relative h-64 sm:h-72 w-full overflow-hidden border-b border-ink-border flex flex-col justify-between p-5 bg-black">
          {/* Prominently Rendered High-Resolution Image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={heroImage}
            alt={project.name}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out"
            style={{
              transform: isHovered ? 'scale(1.12)' : 'scale(1)',
              filter: isHovered
                ? 'brightness(1.04) contrast(1.18) saturate(1.2)'
                : 'brightness(0.9) contrast(1.05)',
            }}
          />

          {/* Vignette Gradient for Badge & Label Legibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/15 to-black/85 pointer-events-none" />

          {/* Holographic Visor Grid & HUD Scanlines on Hover */}
          <div
            className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Holographic Cyber Matrix */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,240,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(0,240,255,0.08)_1px,transparent_1px)] bg-[size:18px_18px] opacity-75" />

            {/* 4 Outer Corner Reticle Brackets */}
            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-cyan-400/80" />
            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-cyan-400/80" />
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-cyan-400/80" />
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-cyan-400/80" />

            {/* Glowing Laser Scanner Beam */}
            <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#00f0ff] animate-[scan_2s_ease-in-out_infinite]" />

            {/* Center Holographic HUD Aperture */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-36 h-36 flex items-center justify-center">
                {/* Outer Rotating Cyan HUD Ring */}
                <div className="absolute inset-0 rounded-full border border-dashed border-cyan-400/80 animate-spin-slow shadow-[0_0_20px_rgba(0,240,255,0.3)]" />
                {/* Inner Counter-Rotating Brass Ring */}
                <div className="absolute inset-3 rounded-full border border-dotted border-brass/90 animate-[spin-slow_6s_linear_infinite_reverse]" />
                {/* Segmented Arc Reticle */}
                <div className="absolute inset-6 rounded-full border-2 border-t-cyan-300 border-r-transparent border-b-brass border-l-transparent animate-[spin-slow_3s_linear_infinite]" />
                
                {/* Center Core HUD Readout */}
                <div className="w-16 h-16 rounded-full bg-black/80 border border-cyan-400/80 flex flex-col items-center justify-center backdrop-blur-md shadow-glow">
                  <Crosshair className="w-4 h-4 text-cyan-300 animate-pulse" />
                  <span className="font-mono text-[8px] text-cyan-300 font-bold uppercase tracking-widest mt-0.5">
                    LOCK_ON
                  </span>
                </div>
              </div>
            </div>

            {/* Audio Waveform / Telemetry Visualizer */}
            <div className="absolute top-14 left-5 flex items-end gap-1 font-mono text-[9px] text-cyan-400/90 bg-black/75 px-2 py-1 rounded border border-cyan-500/30 backdrop-blur-sm shadow-sm">
              <Activity className="w-3 h-3 text-cyan-300 animate-pulse" />
              <span>SPECTRA //</span>
              <div className="flex items-end gap-0.5 h-3 ml-1">
                <span className="w-1 bg-cyan-400 h-2 animate-bounce" />
                <span className="w-1 bg-cyan-400 h-3 animate-pulse" />
                <span className="w-1 bg-cyan-400 h-1 animate-bounce" />
                <span className="w-1 bg-cyan-400 h-2.5 animate-pulse" />
              </div>
            </div>

            {/* Telemetry Vector Coordinates (Bottom Right of Image) */}
            <div className="absolute bottom-14 right-5 font-mono text-[9px] text-brass/90 bg-black/75 px-2 py-0.5 rounded border border-brass/30 backdrop-blur-sm hidden sm:block">
              <span>SYS_COORDS: {index + 1}.0 // 100%</span>
            </div>
          </div>

          {/* Top Row: Index Badge & Holographic Seal */}
          <div className="relative z-10 flex items-start justify-between">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold text-white bg-black/85 backdrop-blur-md px-2.5 py-1 rounded-pill border border-white/20 shadow-md flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                № {formatIndex(project.sort_order || index + 1)}
              </span>

              {/* Sci-Fi Status Tag */}
              <span
                className={`font-mono text-[10px] text-cyan-300 bg-black/90 backdrop-blur-md px-2 py-0.5 rounded-pill border border-cyan-400/50 uppercase tracking-widest hidden sm:inline-block transition-all duration-300 ${
                  isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
                }`}
              >
                TARGET_LOCK
              </span>
            </div>

            {/* Holographic Seal Mark with Counter-Rotating Rings */}
            <div className="relative w-12 h-12 rounded-full border border-white/30 flex items-center justify-center bg-black/75 backdrop-blur-md transition-all duration-500 group-hover:border-cyan-400 group-hover:bg-black group-hover:scale-110 shadow-lg">
              <span className="font-display italic text-base text-white group-hover:text-cyan-300 transition-colors font-medium">
                {initial}
              </span>
              <div className="absolute inset-0 rounded-full border border-dashed border-cyan-400/40 group-hover:border-cyan-400 animate-spin-slow transition-all" />
              <div className="absolute -inset-1 rounded-full border border-dotted border-brass/30 group-hover:border-brass animate-[spin-slow_10s_linear_infinite_reverse] transition-all" />
            </div>
          </div>

          {/* Bottom Row in Art Area: Interactive Deploy CTA */}
          <div className="relative z-10 flex items-end justify-between">
            <div className="transform translate-y-1 group-hover:translate-y-0 transition-all duration-300 ease-out flex items-center gap-2 text-xs font-mono tracking-wider text-black font-bold bg-cyan-400 hover:bg-cyan-300 px-3.5 py-1.5 rounded-pill shadow-[0_0_20px_rgba(0,240,255,0.6)]">
              <span>EXPLORE DOSSIER</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>

            {project.featured && (
              <span className="font-mono text-[10px] tracking-widest text-brass bg-black/90 backdrop-blur-md border border-brass/50 px-2.5 py-1 rounded-pill uppercase flex items-center gap-1.5 font-medium shadow-md">
                <Sparkles className="w-3 h-3 text-brass animate-pulse" />
                <span>FEATURED</span>
              </span>
            )}
          </div>
        </div>

        {/* Card Body Information */}
        <div className="p-6 flex flex-col flex-grow justify-between bg-ink-surface">
          <div>
            {/* Header: Name and Year with Text Scramble */}
            <div className="flex items-baseline justify-between gap-2 mb-2.5">
              <h2 className="font-display text-xl sm:text-2xl font-medium tracking-tight text-ivory group-hover:text-cyan-400 transition-colors">
                <TextScramble text={project.name} triggerOnHover={true} speed={25} />
              </h2>
              <span className="font-mono text-xs text-ivory-muted font-normal">
                {project.year}
              </span>
            </div>

            {/* One-Liner Description */}
            <p className="text-sm text-ivory-muted leading-relaxed line-clamp-2 mb-5 font-normal">
              {project.one_liner}
            </p>
          </div>

          {/* Category Pill Tag */}
          <div className="pt-3 border-t border-ink-border/50 flex items-center justify-between">
            <span className="inline-block px-3 py-1 rounded-pill text-xs font-mono tracking-wider bg-sage-muted text-sage border border-sage-border font-medium">
              {project.category}
            </span>

            {project.client_name && (
              <span className="text-[11px] font-mono text-ivory-subtle truncate max-w-[140px]">
                {project.client_name}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}


