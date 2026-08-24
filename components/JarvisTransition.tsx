'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

interface JarvisContextType {
  openCaseStudy: (slug: string, projectName: string, accentColor?: string) => void;
}

const JarvisContext = createContext<JarvisContextType>({
  openCaseStudy: () => {},
});

export function JarvisProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isDeploying, setIsDeploying] = useState(false);
  const [activeProject, setActiveProject] = useState<{ name: string; slug: string; color: string } | null>(null);

  // Automatically reset transition state whenever pathname changes
  useEffect(() => {
    setIsDeploying(false);
    setActiveProject(null);
  }, [pathname]);

  const openCaseStudy = (slug: string, projectName: string, accentColor = '#C6A15B') => {
    setActiveProject({ name: projectName, slug, color: accentColor });
    setIsDeploying(true);

    // Fast, responsive sci-fi transition sequence
    setTimeout(() => {
      router.push(`/work/${slug}`);
      setTimeout(() => {
        setIsDeploying(false);
        setActiveProject(null);
      }, 400);
    }, 280);
  };

  return (
    <JarvisContext.Provider value={{ openCaseStudy }}>
      {children}

      <AnimatePresence>
        {isDeploying && activeProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.04 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center bg-black/90 backdrop-blur-xl overflow-hidden select-none"
          >
            {/* Holographic Visor Grid & Scanlines */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,240,255,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(0,240,255,0.07)_1px,transparent_1px)] bg-[size:28px_28px] opacity-75" />
            
            {/* Radial Quantum Field */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.18)_0%,rgba(198,161,91,0.1)_40%,transparent_75%)]" />

            {/* Top Left HUD Corner: System Protocol */}
            <div className="absolute top-8 left-8 font-mono text-xs text-cyan-400 flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span className="tracking-widest">SYSTEM // OPTICAL RETICLE LOCK</span>
            </div>

            {/* Top Right HUD Corner: Target Dossier */}
            <div className="absolute top-8 right-8 font-mono text-xs text-brass tracking-wider">
              <span>TARGET_ID: {activeProject.slug.toUpperCase()}</span>
            </div>

            {/* Bottom Left HUD Corner: Quantum Frequency */}
            <div className="absolute bottom-8 left-8 font-mono text-xs text-cyan-400/80 tracking-wider">
              <span>FREQUENCY: 98.4 GHz // ARCHIVE SYNCHRONIZED</span>
            </div>

            {/* Bottom Right HUD Corner: Verification */}
            <div className="absolute bottom-8 right-8 font-mono text-xs text-brass/80 tracking-wider">
              <span>CLEARANCE: LEVEL-1 GRANTED</span>
            </div>

            {/* 4 Outer Corner Reticle Brackets */}
            <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-cyan-400/70" />
            <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-cyan-400/70" />
            <div className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-cyan-400/70" />
            <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-cyan-400/70" />

            {/* Center Holographic Aperture Reticle */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0, rotate: -30 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 1.8, opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex flex-col items-center justify-center text-center"
            >
              {/* Concentric Rotating Cyber HUD Rings */}
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center">
                {/* Outer Cyan Dashed Caliper Ring */}
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-cyan-400/70 animate-spin-slow shadow-[0_0_30px_rgba(0,240,255,0.4)]" />
                
                {/* Inner Counter-Rotating Brass Ring */}
                <div className="absolute inset-5 rounded-full border border-dotted border-brass/90 animate-[spin-slow_8s_linear_infinite_reverse]" />
                
                {/* Segmented HUD Reticle Arcs */}
                <div className="absolute inset-10 rounded-full border-4 border-t-cyan-400 border-r-transparent border-b-brass border-l-transparent animate-[spin-slow_4s_linear_infinite]" />

                {/* Pulsing Central Target Core */}
                <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-cyan-950/80 border-2 border-cyan-400 flex flex-col items-center justify-center shadow-[0_0_50px_#00f0ff] backdrop-blur-md px-3 text-center">
                  <span className="font-mono text-[10px] text-cyan-300 font-bold tracking-widest animate-pulse">
                    ACCESSING DOSSIER
                  </span>
                  <span className="font-display italic text-lg sm:text-xl text-brass font-medium mt-1 truncate max-w-[130px]">
                    {activeProject.name}
                  </span>
                </div>
              </div>

              {/* Holographic Laser Crosshairs */}
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#00f0ff]" />
              <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[1px] bg-gradient-to-b from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#00f0ff]" />

              {/* Status Banner */}
              <motion.div
                initial={{ y: 15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="mt-6 font-mono text-xs tracking-[0.25em] text-cyan-300 uppercase bg-cyan-950/90 border border-cyan-400/50 px-4 py-1.5 rounded-pill shadow-glow"
              >
                DECRYPTING ARCHIVAL DOSSIER...
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </JarvisContext.Provider>
  );
}

export function useJarvis() {
  return useContext(JarvisContext);
}

