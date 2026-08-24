'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Shield, ArrowUpRight, Sun, Moon, Volume2, VolumeX } from 'lucide-react';
import BookCallModal from './BookCallModal';
import { useTheme } from './ThemeProvider';
import { useSafePathname } from '@/lib/useSafePathname';
import { soundEffects } from '@/lib/soundEffects';
import TextScramble from './TextScramble';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const pathname = useSafePathname();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    setIsMuted(soundEffects.getMutedState());
    const handleAudioChange = (e: CustomEvent) => {
      setIsMuted(e.detail.isMuted);
    };
    window.addEventListener('studioflag_audio_state_change' as any, handleAudioChange);
    return () => {
      window.removeEventListener('studioflag_audio_state_change' as any, handleAudioChange);
    };
  }, []);

  const toggleAudio = () => {
    const next = soundEffects.toggleMute();
    setIsMuted(next);
    if (!next) soundEffects.playClick();
  };

  const navLinks = [
    { label: 'Work', href: '/' },
    { label: 'Services', href: '/#services' },
    { label: 'Method', href: '/#method' },
    { label: 'About', href: '/#about' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-ink-border/60 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Wordmark */}
          <Link
            href="/"
            onClick={() => soundEffects.playClick()}
            className="flex items-center gap-2 group text-ivory hover:text-brass transition-colors"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-brass group-hover:scale-125 transition-transform" />
            <span className="font-display text-xl sm:text-2xl font-semibold tracking-tight text-ivory">
              <TextScramble text="StudioFlag" triggerOnHover={true} speed={30} />
              <span className="text-brass text-sm align-super font-mono ml-0.5">®</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => soundEffects.playClick()}
                  className={`text-sm tracking-wide transition-colors ${
                    isActive
                      ? 'text-ivory font-medium'
                      : 'text-ivory-muted hover:text-ivory'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Area */}
          <div className="hidden md:flex items-center space-x-3.5">
            {/* Tactical Audio FX Mute / Unmute Toggle */}
            <button
              suppressHydrationWarning
              onClick={toggleAudio}
              className="p-2 rounded-full border border-ink-border hover:border-cyan-400/50 text-ivory-muted hover:text-cyan-300 transition-colors relative group"
              title={isMuted ? 'Unmute Audio Haptics' : 'Mute Audio Haptics'}
              aria-label="Toggle Tactical Audio"
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-ivory-subtle" />
              ) : (
                <Volume2 className="w-4 h-4 text-cyan-400 animate-pulse" />
              )}
            </button>

            {/* Dark / Light Theme Toggle */}
            <button
              suppressHydrationWarning
              onClick={() => {
                soundEffects.playClick();
                toggleTheme();
              }}
              className="p-2 rounded-full border border-ink-border hover:border-brass/50 text-ivory-muted hover:text-brass transition-colors"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-brass animate-fadeIn" />
              ) : (
                <Moon className="w-4 h-4 text-brass animate-fadeIn" />
              )}
            </button>

            {/* Admin CMS Access */}
            <Link
              href="/admin/case-studies"
              onClick={() => soundEffects.playClick()}
              className="px-3.5 py-1.5 rounded-pill border border-ink-border hover:border-brass/40 text-ivory-muted hover:text-brass text-xs font-mono tracking-wider flex items-center gap-1.5 transition-all group"
              title="Admin CMS Portal"
            >
              <Shield className="w-3.5 h-3.5 text-brass/80 group-hover:rotate-12 transition-transform" />
              <span>ADMIN</span>
            </Link>

            {/* Pill CTA: inverts to filled brass on hover */}
            <button
              suppressHydrationWarning
              onClick={() => {
                soundEffects.playClick();
                setIsBookModalOpen(true);
              }}
              className="group relative inline-flex items-center justify-center px-5 py-2 rounded-pill text-xs font-mono uppercase tracking-widest border border-brass text-ivory overflow-hidden transition-all duration-300 hover:text-ink hover:border-brass"
            >
              <span className="absolute inset-0 w-full h-full bg-brass transition-transform duration-300 transform -translate-x-full group-hover:translate-x-0 ease-out -z-10" />
              <span className="flex items-center gap-1.5 z-10 font-medium">
                Book a call
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2.5">
            <button
              suppressHydrationWarning
              onClick={toggleAudio}
              className="p-1.5 rounded-full border border-ink-border text-ivory-muted hover:text-cyan-300"
              aria-label="Toggle Audio"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
            </button>
            <button
              suppressHydrationWarning
              onClick={toggleTheme}
              className="p-1.5 rounded-full border border-ink-border text-ivory-muted hover:text-brass"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              suppressHydrationWarning
              onClick={() => setIsBookModalOpen(true)}
              className="px-3 py-1.5 rounded-pill border border-brass text-ivory text-xs font-mono"
            >
              Book
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-ivory-muted hover:text-ivory focus:outline-none"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-ink-surface border-b border-ink-border px-6 py-6 space-y-4 animate-fadeIn">
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base text-ivory py-2 border-b border-ink-border/40 font-medium"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/admin/case-studies"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 text-sm text-brass font-mono py-2"
              >
                <Shield className="w-4 h-4" />
                <span>Admin CMS Portal</span>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Consultation Modal */}
      <BookCallModal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
      />
    </>
  );
}
