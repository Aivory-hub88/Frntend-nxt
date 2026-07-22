'use client';

import { useState, useEffect } from 'react';

export default function BastionVisualHero() {
  const [isGlitching, setIsGlitching] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsGlitching(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex items-end justify-center bg-transparent overflow-hidden pt-20 pb-16 md:pb-24">
      <div className="w-full max-w-[1600px] mx-auto px-6 md:px-12 flex justify-center items-center">
        <div className="w-full flex justify-center items-center">
          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes imageGlitch {
              0% { clip-path: inset(20% 0 80% 0); transform: translate(-2px, 2px); filter: drop-shadow(-2px 0 cyan) drop-shadow(2px 0 red); }
              10% { clip-path: inset(60% 0 10% 0); transform: translate(2px, -2px); filter: drop-shadow(2px 0 red) drop-shadow(-2px 0 cyan); }
              20% { clip-path: inset(40% 0 50% 0); transform: translate(-2px, 2px); filter: drop-shadow(-2px 0 red) drop-shadow(2px 0 cyan); }
              30% { clip-path: inset(80% 0 5% 0); transform: translate(2px, -2px); filter: drop-shadow(2px 0 cyan) drop-shadow(-2px 0 red); }
              40% { clip-path: inset(10% 0 70% 0); transform: translate(-2px, 2px); filter: drop-shadow(-2px 0 red) drop-shadow(2px 0 cyan); }
              50% { clip-path: inset(30% 0 40% 0); transform: translate(2px, -2px); filter: drop-shadow(2px 0 cyan) drop-shadow(-2px 0 red); }
              60% { clip-path: inset(70% 0 20% 0); transform: translate(-2px, 2px); filter: drop-shadow(-2px 0 red) drop-shadow(2px 0 cyan); }
              70% { clip-path: inset(5% 0 90% 0); transform: translate(2px, -2px); filter: drop-shadow(2px 0 red) drop-shadow(-2px 0 cyan); }
              80% { clip-path: inset(50% 0 30% 0); transform: translate(-2px, 2px); filter: drop-shadow(-2px 0 cyan) drop-shadow(2px 0 red); }
              90% { clip-path: inset(90% 0 5% 0); transform: translate(2px, -2px); filter: drop-shadow(2px 0 red) drop-shadow(-2px 0 cyan); }
              100% { clip-path: inset(0 0 0 0); transform: translate(0); filter: none; }
            }
            .glitch-anim {
              animation: imageGlitch 0.2s cubic-bezier(.25, .46, .45, .94) both infinite;
              opacity: 0.8;
            }
          `}} />
          <img
            src="/Bastion_2_copy.svg"
            alt="Bastion"
            className={`w-[100%] md:w-[110%] h-auto object-contain transition-opacity duration-300 ${isGlitching ? 'glitch-anim' : 'opacity-100'}`}
          />
        </div>
      </div>
    </section>
  );
}
