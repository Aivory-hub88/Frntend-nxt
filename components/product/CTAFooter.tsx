'use client';

import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import Link from 'next/link';

interface CTAFooterProps {
  title: string;
  subtitle: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
}

export function CTAFooter({ title, subtitle, primaryCta, secondaryCta }: CTAFooterProps) {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section
      ref={ref}
      className={`animate-on-scroll ${isVisible ? 'is-visible' : ''} w-full pt-12 pb-24`}
      style={{ background: '#050505' }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <h2
          className="text-5xl md:text-6xl font-normal tracking-tight mb-6 text-white"
          style={{ fontFamily: "'Manrope', sans-serif" }}
        >
          {title}
        </h2>
        <p
          className="text-white/70 text-lg md:text-xl font-light mb-10 max-w-4xl"
          style={{ fontFamily: "'Manrope', sans-serif" }}
        >
          {subtitle}
        </p>

        <div className="flex flex-wrap gap-6">
          <Link
            href={primaryCta.href}
            className="inline-flex items-center gap-2 text-white cursor-pointer transition-all duration-[250ms] border border-white/60 bg-black/60 hover:bg-white hover:text-black hover:border-white px-8 py-4"
            style={{
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
            {primaryCta.label}
          </Link>
          {secondaryCta && (
            <Link
              href={secondaryCta.href}
              className="px-8 py-4 bg-white text-black font-semibold hover:bg-gray-200 transition-colors text-lg"
              style={{ fontFamily: "'Manrope', sans-serif" }}
            >
              {secondaryCta.label}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
