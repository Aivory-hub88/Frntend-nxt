'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { VibrationField, type LightPoint, type VibrationLines } from '@/components/ui/VibrationField';

// Footer surface: the Enterprise card's teal · ember · amber world as a lit dusk
// (dusty teal sky, amber from the left, burnt orange low, night in the corners)
// with the dome lattice (interlocking cells on crossing log spirals, after the
// Isfahan domes) centred behind the logo, in 1px lines.
const FOOTER_LIGHT: LightPoint[] = [
  { x: 0.78, y: 0.05, color: '#6e8d99', r: 0.75 },
  { x: 0.25, y: 0.02, color: '#8f9a96', r: 0.5 },
  { x: 0.02, y: 0.45, color: '#e9a650', r: 0.42 },
  { x: 0.45, y: 0.72, color: '#c4562a', r: 0.5 },
  { x: 0.9, y: 0.82, color: '#9c3a1c', r: 0.45 },
  { x: 0.05, y: 1.02, color: '#1a0d0a', r: 0.45 },
  { x: 0.7, y: 0.45, color: '#5b3a35', r: 0.28 },
];
const FOOTER_LINES: VibrationLines = {
  // Round Chladni plate in extreme close-up: centred past the bottom-right corner, so only a
  // slice of its few, widely spaced nodal lines crosses the footer.
  kind: 'round',
  count: 1,
  radius: 1.3,
  n: 6,
  waves: 6,
  levels: 4,
  center: { x: 1.04, y: 1.0 },
  opacity: 0.5,
  weight: 0.75,
  clear: { x: 0.36, y: 0.42, rx: 0.34, ry: 0.42 },
  // Behind the wordmark and the NVIDIA badge the lines step back so both stay crisp.
  quiet: { x: 0.86, y: 0.2, rx: 0.17, ry: 0.2, level: 0.25 },
};
// On a phone the links fill the whole footer, so the figure steps back.
const FOOTER_LINES_NARROW: VibrationLines = { ...FOOTER_LINES, center: { x: 1.15, y: 0.35 }, opacity: 0.3, clear: { x: 0.5, y: 0.5, rx: 0.0001, ry: 0.0001 } };

const productLinks = [
  { label: 'Deep Assessment', href: '/product' },
  { label: 'AI Blueprint', href: '/product' },
  { label: 'AI Roadmap', href: '/product' },
  { label: 'Workflow Builder', href: '/product' },
  { label: 'AI Agents', href: '/product' },
  { label: 'Template Library', href: '/product' },
  { label: 'Bastion', href: '/bastion' },
];

const companyLinks = [
  { label: 'About', href: '/about' },
  { label: 'Company', href: '/company' },
  { label: 'Blog', href: '/blog' },
  { label: 'Glossary', href: '/glossary' },
  { label: 'Careers', href: '/careers' },
  { label: 'Investor Relations', href: '/investor-relations' },
  { label: 'Contact', href: '/contact' },
];

const legalLinks = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Cookie Policy', href: '/cookie-policy' },
];

interface FooterProps {
  landingAmbient?: boolean;
}

export default function Footer({ landingAmbient = false }: FooterProps) {
  const { ref, isVisible } = useScrollAnimation();
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const on = () => setNarrow(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);

  return (
    <footer data-landing-ambient={landingAmbient || undefined} className="relative w-full font-sans">
      <VibrationField
        base="#4a3a36"
        points={FOOTER_LIGHT}
        lines={narrow ? FOOTER_LINES_NARROW : FOOTER_LINES}
        vignette={0.5}
        className="w-full pt-24 pb-12 text-white"
      >
      <div
        ref={ref}
        className={`relative z-10 animate-on-scroll ${isVisible ? 'is-visible' : ''}`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-12 md:gap-8 mb-16 md:mb-32">
            <div className="col-span-1">
              <h4 className="text-gray-300 text-sm font-normal mb-4">Product</h4>
              <ul className="space-y-3 text-sm">
                {productLinks.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-white/90 hover:text-[#c9c9c9] transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-1">
              <h4 className="text-gray-300 text-sm font-normal mb-4">Company</h4>
              <ul className="space-y-3 text-sm">
                {companyLinks.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-white/90 hover:text-[#c9c9c9] transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-1">
              <h4 className="text-gray-300 text-sm font-normal mb-4">Legal</h4>
              <ul className="space-y-3 text-sm">
                {legalLinks.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-white/90 hover:text-[#c9c9c9] transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-1">
              <h4 className="text-gray-300 text-sm font-normal mb-4">Get in touch</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href="mailto:hello@aivory.uk" className="text-white/90 hover:text-[#c9c9c9] transition-colors">
                    hello@aivory.uk
                  </a>
                </li>
              </ul>
            </div>

            <div className="col-span-2 md:col-span-1 flex items-start mt-8 md:mt-0">
              <div className="flex flex-row items-center gap-4">
                <img
                  src="/aivory-wordmark.svg"
                  alt="Aivory Logo"
                  className="h-[20px] md:h-[26px] w-auto shrink-0 opacity-90"
                />
                <Link
                  href="/nvidia-inception"
                  className="flex shrink-0 items-center transition-opacity hover:opacity-70"
                  aria-label="Aivory AI is a member of the NVIDIA Inception Program (2026 cohort)"
                  title="NVIDIA Inception Program — 2026 cohort"
                >
                  <img
                    src="/images/nvidia-inception/nvidia-inception-program-badge-rgb-for-screen-negative.svg"
                    alt="NVIDIA Inception Program — Aivory AI is a member (2026 cohort)"
                    className="h-[34px] md:h-[40px] w-auto shrink-0"
                  />
                </Link>
              </div>
            </div>
          </div>

          <div className="pb-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-5 text-sm text-white/80">
            <span>&copy; 2026 Aivory. All rights reserved.</span>
            <a
              href="https://www.producthunt.com/products/aivory-ai?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-aivory-ai"
              target="_blank"
              rel="noopener noreferrer"
              className="flex shrink-0 items-center transition-opacity hover:opacity-70"
              aria-label="Aivory AI on Product Hunt"
              title="Aivory AI — Make AI Make Sense® on Product Hunt"
            >
              <img
                src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1224888&theme=dark&t=1786964875314"
                alt="Aivory AI — Make AI Make Sense® | Product Hunt"
                width={250}
                height={54}
                loading="lazy"
                className="h-[34px] md:h-[38px] w-auto shrink-0"
              />
            </a>
            <a
              href="https://www.instagram.com/aivorylab.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/80 hover:text-white transition-colors text-sm"
              aria-label="Follow Aivory AI on Instagram"
            >
              Instagram
            </a>
            <a
              href="https://www.linkedin.com/company/aivoryai/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/80 hover:text-white transition-colors text-sm"
              aria-label="Connect with Aivory AI on LinkedIn"
            >
              LinkedIn
            </a>
          </div>

          <a
            href="/api/internal/trap"
            style={{ display: 'none', visibility: 'hidden', position: 'absolute', left: '-9999px' }}
            aria-hidden="true"
            rel="nofollow"
          >
            System Configuration
          </a>
        </div>
      </div>
      </VibrationField>
    </footer>
  );
}
