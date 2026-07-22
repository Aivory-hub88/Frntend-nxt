'use client';

import { useState, useEffect } from 'react';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789XØ▲█░▒▓#$&@_';

function ScrambleOverlay({ onComplete }: { onComplete: () => void }) {
  const [text, setText] = useState('');
  const targetText = 'BASTION';

  useEffect(() => {
    let iteration = 0;
    let maxIterations = 20;
    
    const interval = setInterval(() => {
      setText(
        targetText
          .split('')
          .map((letter, index) => {
            if (index < iteration) {
              return targetText[index];
            }
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join('')
      );
      
      iteration += 1/3;
      
      if (iteration >= targetText.length) {
        clearInterval(interval);
        setTimeout(onComplete, 300);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a0a] z-50">
      <h1 className="text-6xl md:text-8xl lg:text-[12rem] font-bold tracking-[0.2em] text-white/90 font-mono filter drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
        {text}
      </h1>
    </div>
  );
}

export default function BastionVisualHero() {
  const [scrambleComplete, setScrambleComplete] = useState(false);

  return (
    <section className="relative min-h-screen flex items-end justify-center bg-transparent overflow-hidden pt-20 pb-16 md:pb-24">
      {!scrambleComplete && <ScrambleOverlay onComplete={() => setScrambleComplete(true)} />}
      <div 
        className={`w-full max-w-[1600px] mx-auto px-6 md:px-12 flex justify-center items-center transition-opacity duration-1000 ${scrambleComplete ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="w-full flex justify-center" style={{ transform: 'scale(1.265) translateY(5%)' }}>
          <img
            src="/Bastion_2_copy.svg"
            alt="Bastion"
            className="w-full h-auto object-contain"
          />
        </div>
      </div>
    </section>
  );
}
