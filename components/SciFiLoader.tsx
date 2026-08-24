'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Terminal, ShieldCheck, Zap } from 'lucide-react';

const LOG_MESSAGES = [
  'INITIALIZING QUANTUM NEURAL DOSSIER...',
  'SYNCHRONIZING BESPOKE BRAND SYSTEMS [16/16]',
  'CALIBRATING EDITORIAL TYPOGRAPHY & GRIDS',
  'COMPUTING TOPOLOGY VECTORS & 3D ASSETS',
  'STUDIOFLAG® KERNEL v2.4 LOADED // ACCESS GRANTED',
];

export default function SciFiLoader() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [logIndex, setLogIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if already shown in this session
    const hasSeenLoader = sessionStorage.getItem('studioflag_loader_seen');
    if (hasSeenLoader === 'true') {
      setLoading(false);
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setLoading(false);
            sessionStorage.setItem('studioflag_loader_seen', 'true');
          }, 450);
          return 100;
        }
        const increment = Math.floor(Math.random() * 8) + 4;
        return Math.min(100, prev + increment);
      });
    }, 65);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress < 25) setLogIndex(0);
    else if (progress < 50) setLogIndex(1);
    else if (progress < 75) setLogIndex(2);
    else if (progress < 95) setLogIndex(3);
    else setLogIndex(4);
  }, [progress]);

  const handleSkip = () => {
    setLoading(false);
    sessionStorage.setItem('studioflag_loader_seen', 'true');
  };

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.05,
            filter: 'blur(10px)',
            transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
          }}
          className="fixed inset-0 z-50 bg-[#070706] text-ivory flex flex-col items-center justify-between p-6 sm:p-12 overflow-hidden select-none"
        >
          {/* Cybernetic Matrix Grid & Scanlines */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(198,161,91,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(198,161,91,0.04)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none opacity-60" />
          
          {/* Ambient Radial Reactor Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brass/10 rounded-full blur-[100px] pointer-events-none" />

          {/* Top Header HUD Bar */}
          <div className="w-full max-w-5xl flex items-center justify-between z-10 border-b border-ink-border/80 pb-4 font-mono text-xs text-ivory-subtle">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-brass animate-pulse" />
              <span className="text-ivory font-semibold tracking-widest text-sm">
                STUDIOFLAG<span className="text-brass">®</span>
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-pill bg-ink border border-ink-border text-[10px] text-brass">
                AI / SYSTEM PROTOCOL
              </span>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-[11px] text-ivory-muted hidden md:inline-block">
                SYS_CLOCK: {new Date().toLocaleTimeString()}
              </span>
              <button
                onClick={handleSkip}
                className="px-3 py-1 rounded-pill border border-ink-border hover:border-brass text-ivory-muted hover:text-brass text-[10px] uppercase tracking-wider transition-colors"
              >
                SKIP INTRO [ESC]
              </button>
            </div>
          </div>

          {/* Center Sci-Fi Concentric HUD Aperture & Neural Core */}
          <div className="relative flex flex-col items-center justify-center my-auto z-10">
            {/* Outer Rotating HUD Rings */}
            <div className="relative w-56 h-56 sm:w-72 sm:h-72 flex items-center justify-center">
              {/* Outer Dashed Compass Ring */}
              <div className="absolute inset-0 rounded-full border border-dashed border-brass/40 animate-spin-slow" />
              
              {/* Counter-rotating Angle Ring */}
              <div className="absolute inset-4 rounded-full border border-dotted border-brass/25 animate-[spin-slow_10s_linear_infinite_reverse]" />
              
              {/* Glowing Segmented Ring */}
              <div className="absolute inset-8 rounded-full border-2 border-t-brass border-r-transparent border-b-brass border-l-transparent animate-[spin-slow_6s_linear_infinite]" />

              {/* Laser Sweep Scanner Line */}
              <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
                <div className="w-full h-1/2 bg-gradient-to-b from-brass/20 to-transparent animate-[radar-sweep_3s_linear_infinite] origin-bottom" />
              </div>

              {/* Center Hologram Core */}
              <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-ink/90 border border-brass/60 flex flex-col items-center justify-center shadow-glow backdrop-blur-md">
                <span className="font-display italic text-2xl sm:text-3xl text-brass font-medium tracking-tight">
                  {progress}%
                </span>
                <span className="font-mono text-[9px] text-ivory-muted uppercase tracking-widest mt-0.5">
                  INITIALIZING
                </span>
              </div>
            </div>

            {/* Micro Cybernetic Reticle Brackets */}
            <div className="absolute -top-4 -left-4 font-mono text-[10px] text-brass/70">[00:SYS]</div>
            <div className="absolute -bottom-4 -right-4 font-mono text-[10px] text-brass/70">[AI:RDY]</div>
          </div>

          {/* Bottom Telemetry Console & Progress Bar */}
          <div className="w-full max-w-2xl z-10 space-y-4">
            {/* Real-time Telemetry Terminal Log */}
            <div className="bg-ink/80 border border-ink-border rounded-lg p-3.5 font-mono text-xs backdrop-blur-md">
              <div className="flex items-center gap-2 text-brass mb-1.5 text-[11px]">
                <Terminal className="w-3.5 h-3.5" />
                <span className="uppercase tracking-wider">SYSTEM LOG FEED</span>
              </div>
              <div className="text-ivory-muted text-[11px] truncate flex items-center gap-2">
                <span className="text-brass">›</span>
                <span className="text-ivory font-medium animate-pulse">
                  {LOG_MESSAGES[logIndex]}
                </span>
              </div>
            </div>

            {/* Glowing Linear Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] font-mono text-ivory-subtle">
                <span>NEURAL CALIBRATION</span>
                <span className="text-brass font-semibold">{progress} / 100</span>
              </div>
              <div className="w-full h-1.5 bg-ink border border-ink-border rounded-pill overflow-hidden p-0.5">
                <motion.div
                  className="h-full bg-brass rounded-pill shadow-glow-sm"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
