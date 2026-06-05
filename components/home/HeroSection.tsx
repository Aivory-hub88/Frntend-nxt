'use client';

import { useEffect, useRef } from 'react';
import GridOverlay from './GridOverlay';
import RotatingText from './RotatingText';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

export default function HeroSection() {
  const { ref: animRef, isVisible } = useScrollAnimation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const y = window.scrollY;
          if (videoRef.current) {
            videoRef.current.style.transform = `translateY(${y * 0.3}px)`;
          }
          if (contentRef.current) {
            contentRef.current.style.transform = `translateY(${y * -0.1}px)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div
      ref={animRef}
      className={`animate-on-scroll ${isVisible ? 'is-visible' : ''} relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden`}
      style={{ background: '#030408' }}
    >
      {/* Background Video */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover z-0"
        style={{ willChange: 'transform' }}
      >
        <source src="/hero-video/Hero_Video.mp4" type="video/mp4" />
      </video>

      {/* Grid Overlay with random fade (hero only) */}
      <GridOverlay animated />

      {/* Content */}
      <div
        ref={contentRef}
        className="relative z-10 flex flex-col items-center justify-center text-center w-full max-w-4xl"
        style={{ padding: '6rem 2rem', willChange: 'transform' }}
      >
        <h1
          className="text-[36px] md:text-[56px] font-light mb-2 tracking-tight text-white/90 text-center leading-[1.1]"
          style={{ fontFamily: "'Manrope', sans-serif" }}
        >
          Make AI make sense
          <span
            style={{
              fontSize: '0.35em',
              verticalAlign: 'middle',
              position: 'relative',
              top: '-0.3em',
            }}
          >
            ®
          </span>
          <br />
          for your business
        </h1>

        {/* Rotating subtitle */}
        <RotatingText />

        {/* CTA Button */}
        <a
          href="/free-diagnostic"
          className="inline-flex items-center gap-3 text-white no-underline uppercase cursor-pointer transition-all duration-[250ms] border border-white/60 bg-black/60 hover:bg-white hover:text-black hover:border-white"
          style={{
            padding: '0.75rem 1.5rem',
            fontFamily: "'Manrope', sans-serif",
            fontWeight: 400,
            fontSize: '0.75rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}
        >
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M17 7v10H7" />
            <path d="M7 7l10 10" />
          </svg>
          START WITH FREE DIAGNOSTIC
        </a>
      </div>
    </div>
  );
}
