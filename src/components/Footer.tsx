'use client';

import Link from 'next/link';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { AmbientBackground } from '@/components/ui/AmbientBackground';
import { HalftoneWaveWrapper } from '@/components/ui/HalftoneWaveWrapper';

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

  return (
    <footer
      className={
        landingAmbient
          ? 'relative isolate w-full overflow-hidden bg-[#191919] text-white pt-24 pb-12 font-sans'
          : 'relative isolate w-full overflow-hidden bg-[#03141b] text-white pt-24 pb-12 font-sans'
      }
    >
      {!landingAmbient && (
        <AmbientBackground
          className="absolute inset-0 z-0"
          variant="legacy-footer"
        />
      )}

      {/* The flower remains footer-only and interactive on every route. The
          homepage uses its original warm charcoal surface; other routes keep
          the currently deployed ambient footer treatment. */}
      <div className="absolute inset-0 z-[1]">
        <HalftoneWaveWrapper />
      </div>

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
                  src="/Aivory_logo_2_2026.svg?v=7f58ef01"
                  alt="Aivory Logo"
                  className="h-[29px] md:h-[37px] w-auto shrink-0 opacity-90"
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
    </footer>
  );
}
