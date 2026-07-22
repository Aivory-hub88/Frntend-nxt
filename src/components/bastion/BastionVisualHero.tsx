'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789XØ▲█░▒▓#$&@_';

function ScrambleText({ text = 'BASTION' }: { text?: string }) {
  const [displayText, setDisplayText] = useState(text);
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    let iteration = 0;
    let interval: NodeJS.Timeout;

    const startScramble = () => {
      iteration = 0;
      clearInterval(interval);
      interval = setInterval(() => {
        setDisplayText(
          text
            .split('')
            .map((char, index) => {
              if (index < iteration) {
                return text[index];
              }
              return CHARS[Math.floor(Math.random() * CHARS.length)];
            })
            .join('')
        );

        if (iteration >= text.length) {
          clearInterval(interval);
        }
        iteration += 1 / 3;
      }, 35);
    };

    startScramble();

    // Trigger subtle glitch effect periodically
    const glitchInterval = setInterval(() => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 220);
    }, 4000);

    return () => {
      clearInterval(interval);
      clearInterval(glitchInterval);
    };
  }, [text]);

  return (
    <div className="relative inline-block select-none">
      <span
        className={`font-light tracking-[0.18em] text-white uppercase text-6xl sm:text-8xl md:text-9xl lg:text-[11rem] leading-none ${
          isGlitching ? 'opacity-90 blur-[0.5px]' : ''
        }`}
        style={{
          fontFamily: 'var(--font-geist-sans), Inter, sans-serif',
          textShadow: isGlitching
            ? '3px 0 #00ffff, -3px 0 #ff0055, 0 0 20px rgba(255,255,255,0.4)'
            : '0 0 35px rgba(255, 255, 255, 0.15)',
        }}
      >
        {displayText}
      </span>
      {isGlitching && (
        <>
          <span
            className="absolute top-0 left-0 text-white uppercase text-6xl sm:text-8xl md:text-9xl lg:text-[11rem] leading-none font-light tracking-[0.18em] pointer-events-none opacity-80"
            style={{
              clipPath: 'polygon(0 0, 100% 0, 100% 45%, 0 45%)',
              transform: 'translate(-4px, -1px)',
              color: '#00f0ff',
            }}
          >
            {displayText}
          </span>
          <span
            className="absolute top-0 left-0 text-white uppercase text-6xl sm:text-8xl md:text-9xl lg:text-[11rem] leading-none font-light tracking-[0.18em] pointer-events-none opacity-80"
            style={{
              clipPath: 'polygon(0 55%, 100% 55%, 100% 100%, 0 100%)',
              transform: 'translate(4px, 1px)',
              color: '#ff0055',
            }}
          >
            {displayText}
          </span>
        </>
      )}
    </div>
  );
}

export default function BastionVisualHero() {
  return (
    <section className="relative min-h-[80vh] flex flex-col items-center justify-center bg-transparent overflow-hidden pt-28 pb-16">
      <div className="w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col items-center text-center relative z-10">
        
        {/* Status Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1 }}
          className="mb-8 flex items-center gap-3 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-md"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs md:text-sm font-mono tracking-[0.25em] text-[#B3B3B3] uppercase">
            Enterprise Security &bull; Assurance Platform
          </span>
        </motion.div>

        {/* Main Scramble Glitch Title */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="my-4"
        >
          <ScrambleText text="BASTION" />
        </motion.div>

        {/* Subheadline */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="mt-6 max-w-2xl"
        >
          <h2 className="text-sm sm:text-base md:text-lg font-mono tracking-[0.3em] uppercase text-[#A0A0A0] leading-relaxed">
            Enterprise AI Assurance &bull; Operational Governance
          </h2>
        </motion.div>

      </div>
    </section>
  );
}
