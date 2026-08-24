'use client';

import React, { useEffect, useState } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { Crosshair, Activity, Compass, Shield } from 'lucide-react';

export default function SciFiHudRail() {
  const [scrollYValue, setScrollYValue] = useState(0);
  const [azimuth, setAzimuth] = useState(0);
  const { scrollY, scrollYProgress } = useScroll();

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 280,
    damping: 30,
  });

  const altitude = useTransform(smoothProgress, [0, 1], [0, 9840]);
  const dialRotation = useTransform(smoothProgress, [0, 1], [0, 360]);

  useEffect(() => {
    const updateScroll = () => {
      const current = window.scrollY;
      setScrollYValue(Math.round(current));
      setAzimuth(Math.round((current * 0.45) % 360));
    };

    window.addEventListener('scroll', updateScroll, { passive: true });
    return () => window.removeEventListener('scroll', updateScroll);
  }, []);

  return (
    <aside className="fixed right-5 top-1/2 -translate-y-1/2 z-30 hidden xl:flex flex-col items-center gap-6 pointer-events-none select-none">
      {/* Top Gyro Compass Indicator */}
      <div className="flex flex-col items-center gap-1.5 font-mono text-[9px] text-cyan-400/80 bg-ink/75 border border-cyan-500/30 px-2 py-2 rounded-xl backdrop-blur-md shadow-glow-sm">
        <motion.div style={{ rotate: dialRotation }} className="w-5 h-5 relative flex items-center justify-center">
          <Compass className="w-4 h-4 text-cyan-300" />
          <div className="absolute inset-0 rounded-full border border-dashed border-cyan-400/40" />
        </motion.div>
        <span className="tracking-widest font-semibold">{azimuth}° AZM</span>
      </div>

      {/* Vertical Telemetry Track */}
      <div className="relative w-1.5 h-48 bg-ink-border/60 rounded-pill overflow-hidden p-0.5 border border-cyan-500/20 shadow-sm">
        <motion.div
          className="w-full bg-gradient-to-b from-cyan-400 via-brass to-cyan-300 rounded-pill origin-top shadow-[0_0_12px_#00f0ff]"
          style={{ height: useTransform(smoothProgress, (v) => `${Math.max(v * 100, 6)}%`) }}
        />
      </div>

      {/* Tactical Readout Module */}
      <div className="bg-ink/80 border border-ink-border rounded-xl p-2.5 font-mono text-[9px] text-ivory-muted space-y-2 backdrop-blur-md w-28 text-left shadow-lg">
        <div className="flex items-center justify-between border-b border-ink-border/60 pb-1 text-brass">
          <span className="font-semibold tracking-wider">HUD // GRID</span>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
        </div>

        <div className="space-y-0.5 text-[8.5px]">
          <div className="flex justify-between">
            <span className="text-ivory-subtle">ALT:</span>
            <span className="text-ivory font-medium font-mono">{scrollYValue} PX</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ivory-subtle">SYS:</span>
            <span className="text-cyan-300 font-medium">ONLINE</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ivory-subtle">BAND:</span>
            <span className="text-brass font-medium">98.4 GHz</span>
          </div>
        </div>

        {/* Mini Frequency Waveform */}
        <div className="flex items-end justify-between h-3 pt-1 border-t border-ink-border/40">
          <span className="w-1 bg-cyan-400/90 h-2 animate-pulse" />
          <span className="w-1 bg-cyan-400/90 h-3 animate-bounce" />
          <span className="w-1 bg-cyan-400/90 h-1 animate-pulse" />
          <span className="w-1 bg-brass/90 h-2.5 animate-bounce" />
          <span className="w-1 bg-cyan-400/90 h-1.5 animate-pulse" />
          <span className="w-1 bg-brass/90 h-3 animate-pulse" />
        </div>
      </div>
    </aside>
  );
}
