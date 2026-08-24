'use client';

import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  originX: number;
  originY: number;
  colorDark: string;
  colorLight: string;
}

export default function QuantumParticles() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let isLight = document.documentElement.getAttribute('data-theme') === 'light';

    // Watch for theme changes
    const observer = new MutationObserver(() => {
      isLight = document.documentElement.getAttribute('data-theme') === 'light';
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'class'],
    });

    const particles: Particle[] = [];
    const particleCount = Math.min(Math.floor((width * height) / 32000), 50);
    const mouse = { x: -1000, y: -1000, radius: 130 };

    const darkPalette = [
      'rgba(198, 161, 91, 0.7)',
      'rgba(0, 240, 255, 0.6)',
      'rgba(235, 232, 225, 0.5)',
    ];

    const lightPalette = [
      'rgba(150, 105, 30, 0.75)',
      'rgba(15, 115, 140, 0.7)',
      'rgba(45, 50, 60, 0.65)',
    ];

    for (let i = 0; i < particleCount; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const paletteIndex = Math.floor(Math.random() * darkPalette.length);

      particles.push({
        x,
        y,
        originX: x,
        originY: y,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 1.8 + 1.2,
        colorDark: darkPalette[paletteIndex],
        colorLight: lightPalette[paletteIndex],
      });
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('resize', handleResize);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Smooth drift
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around viewport edges
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Mouse repulsion physics
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          const angle = Math.atan2(dy, dx);
          p.x -= Math.cos(angle) * force * 2.5;
          p.y -= Math.sin(angle) * force * 2.5;
        }

        // Draw particle node with theme color
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = isLight ? p.colorLight : p.colorDark;
        ctx.fill();

        // Connect nearby nodes with theme-aware telemetry lines
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const distNodes = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (distNodes < 115) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);

            const alpha = 1 - distNodes / 115;
            ctx.strokeStyle = isLight
              ? `rgba(150, 105, 30, ${0.28 * alpha})`
              : `rgba(198, 161, 91, ${0.2 * alpha})`;
            ctx.lineWidth = isLight ? 0.9 : 0.6;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-80"
    />
  );
}
