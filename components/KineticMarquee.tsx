'use client';

import React, { useRef, useState } from 'react';
import { useScroll, useVelocity, useSpring, useTransform, useAnimationFrame } from 'framer-motion';

interface KineticMarqueeProps {
  items?: string[];
  baseVelocity?: number;
  className?: string;
}

export default function KineticMarquee({
  items = [
    'STRATEGIC BRANDING',
    'EDITORIAL ARCHITECTURE',
    '3D SPATIAL SYSTEMS',
    'QUANTUM DOSSIERS',
    'TYPOGRAPHIC DISCIPLINE',
    'VENTURE IDENTITY',
  ],
  baseVelocity = 0.035,
  className = '',
}: KineticMarqueeProps) {
  const baseX = useRef(0);
  const [isHovered, setIsHovered] = useState(false);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 60,
    stiffness: 200,
  });

  const velocityFactor = useTransform(smoothVelocity, [0, 800], [0, 0.08], {
    clamp: true,
  });

  const containerRef = useRef<HTMLDivElement>(null);

  useAnimationFrame((t, delta) => {
    // If user hovers, gently slow to a near-stop for effortless reading
    const speedMultiplier = isHovered ? 0.2 : 1;
    const deltaNormalized = Math.min(delta, 32);

    let moveBy = (baseVelocity * deltaNormalized) / 16 * speedMultiplier;

    // Modest, subtle scroll boost (clamped so it remains 100% legible)
    const currentVelocity = velocityFactor.get();
    if (currentVelocity) {
      moveBy += Math.min(Math.abs(currentVelocity), 0.05) * speedMultiplier;
    }

    baseX.current -= moveBy;

    if (baseX.current <= -50) {
      baseX.current = 0;
    }

    if (containerRef.current) {
      containerRef.current.style.transform = `translateX(${baseX.current}%)`;
    }
  });

  // Duplicate items 4 times to ensure seamless infinite loop
  const repeatedItems = [...items, ...items, ...items, ...items];

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`w-full overflow-hidden whitespace-nowrap select-none py-3.5 border-y border-ink-border/50 bg-ink-surface/50 backdrop-blur-sm ${className}`}
    >
      <div
        ref={containerRef}
        className="inline-flex items-center gap-10 w-max will-change-transform"
      >
        {repeatedItems.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-10 font-mono text-xs uppercase tracking-[0.22em] text-ivory-subtle"
          >
            <span className="text-ivory-muted hover:text-brass transition-colors cursor-default font-medium">
              {item}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-brass/60 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
