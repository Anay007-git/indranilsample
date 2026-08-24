'use client';

import React, { useState, useEffect, useRef } from 'react';

interface TextScrambleProps {
  text: string;
  className?: string;
  triggerOnHover?: boolean;
  triggerOnMount?: boolean;
  speed?: number;
  as?: 'span' | 'h1' | 'h2' | 'h3' | 'p' | 'div';
}

const GLYPHS = '01#&_[]—=+*^?\\$<>§∆∑λψ';

export default function TextScramble({
  text,
  className = '',
  triggerOnHover = true,
  triggerOnMount = false,
  speed = 50,
  as: Component = 'span',
}: TextScrambleProps) {
  const [displayText, setDisplayText] = useState(text);
  const isScramblingRef = useRef(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const scramble = () => {
    if (isScramblingRef.current) return;
    isScramblingRef.current = true;

    if (intervalRef.current) clearInterval(intervalRef.current);

    const length = text.length;
    // Each character has a target frame to resolve
    let frame = 0;
    const totalFrames = length + 8;

    intervalRef.current = setInterval(() => {
      let output = '';
      let completed = 0;

      for (let i = 0; i < length; i++) {
        if (text[i] === ' ') {
          output += ' ';
          completed++;
          continue;
        }

        // Left-to-right staggered smooth resolve
        if (frame >= i + 6) {
          output += text[i];
          completed++;
        } else if (frame >= i) {
          // In resolving state: cycle through glyphs with calm frequency
          output += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        } else {
          // Not yet resolving: keep original character or space
          output += text[i];
        }
      }

      setDisplayText(output);
      frame += 0.85;

      if (completed >= length || frame >= totalFrames + 4) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setDisplayText(text);
        isScramblingRef.current = false;
      }
    }, speed);
  };

  useEffect(() => {
    setDisplayText(text);
    if (triggerOnMount) {
      const timer = setTimeout(() => {
        scramble();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [text, triggerOnMount]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <Component
      className={`inline-block font-inherit will-change-contents ${className}`}
      onMouseEnter={() => {
        if (triggerOnHover) scramble();
      }}
    >
      {displayText}
    </Component>
  );
}
