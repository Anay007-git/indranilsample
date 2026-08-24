'use client';

import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export default function InteractiveCursor() {
  const [cursorType, setCursorType] = useState<'default' | 'card' | 'link' | 'hidden'>('default');
  const [cursorLabel, setCursorLabel] = useState<string>('');
  const [isVisible, setIsVisible] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { damping: 28, stiffness: 380, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const dotConfig = { damping: 40, stiffness: 600 };
  const dotX = useSpring(mouseX, dotConfig);
  const dotY = useSpring(mouseY, dotConfig);

  useEffect(() => {
    // Disable on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isVisible) setIsVisible(true);
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      const target = e.target as HTMLElement | null;
      if (!target) return;

      const cardElem = target.closest('[data-cursor="dossier"]');
      const linkElem = target.closest('a, button, [role="button"]');

      if (cardElem) {
        setCursorType('card');
        setCursorLabel('VIEW DOSSIER');
      } else if (linkElem) {
        setCursorType('link');
        setCursorLabel('');
      } else {
        setCursorType('default');
        setCursorLabel('');
      }
    };

    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isVisible, mouseX, mouseY]);

  if (!isVisible) return null;

  return (
    <>
      {/* Central Precision Point */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00f0ff]"
        style={{ x: dotX, y: dotY }}
      />

      {/* Dynamic Context HUD Reticle */}
      <motion.div
        className={`fixed top-0 left-0 pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center transition-colors duration-200 ${
          cursorType === 'card'
            ? 'w-24 h-24 rounded-full border border-cyan-400/80 bg-black/60 backdrop-blur-sm shadow-[0_0_20px_rgba(0,240,255,0.3)]'
            : cursorType === 'link'
            ? 'w-10 h-10 rounded-full border border-brass bg-brass/10'
            : 'w-7 h-7 rounded-full border border-ivory-subtle/30'
        }`}
        style={{ x: smoothX, y: smoothY }}
      >
        {cursorType === 'card' && (
          <div className="flex flex-col items-center justify-center text-center p-1">
            <span className="font-mono text-[8px] tracking-widest text-cyan-300 font-bold uppercase animate-pulse">
              {cursorLabel}
            </span>
            {/* 4 micro reticle ticks */}
            <div className="absolute top-1 left-1/2 -translate-x-1/2 w-1.5 h-[1px] bg-cyan-400" />
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-[1px] bg-cyan-400" />
            <div className="absolute left-1 top-1/2 -translate-y-1/2 h-1.5 w-[1px] bg-cyan-400" />
            <div className="absolute right-1 top-1/2 -translate-y-1/2 h-1.5 w-[1px] bg-cyan-400" />
          </div>
        )}
      </motion.div>
    </>
  );
}
