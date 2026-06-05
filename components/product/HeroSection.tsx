'use client';

import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface HeroSectionProps {
  title: string;
  subtitle: string;
}

export function HeroSection({ title, subtitle }: HeroSectionProps) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  return (
    <section
      ref={ref}
      className={`animate-on-scroll ${isVisible ? 'is-visible' : ''} relative min-h-screen flex items-center justify-center overflow-hidden`}
      style={{ background: '#030408' }}
    >
      {/* Subtle radial gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% 40%, rgba(10,232,175,0.04) 0%, transparent 70%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <p className="text-accent uppercase tracking-widest text-xs md:text-sm font-medium mb-6">
          AI-Powered Solutions
        </p>
        <h1
          className="text-4xl md:text-5xl lg:text-6xl font-light text-white mb-6 leading-tight"
          style={{ fontFamily: "'Manrope', sans-serif" }}
        >
          {title}
        </h1>
        <p
          className="text-lg text-white/70 max-w-2xl mx-auto mb-8 font-light leading-relaxed"
          style={{ fontFamily: "'Manrope', sans-serif" }}
        >
          {subtitle}
        </p>
        
        {/* Arrow Icon - matches landing page hero */}
        <a
          href="#featured"
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
        </a>
      </div>

      {/* Scroll-down arrow */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-white/40"
        >
          <path d="M12 5v14M5 12l7 7 7-7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </section>
  );
}
