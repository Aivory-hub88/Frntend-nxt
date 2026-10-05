'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useLanguage } from '@/components/context/LanguageContext';
import SignInModal from '@/components/auth/SignInModal';
import { isAuthenticated, getUser, logout } from '@/lib/auth';
import { TechnicalFrameButton } from '@/components/ui/TechnicalFrameButton';

/* ─── Arrow Icon ─── */
function ArrowIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 7v10H7" />
      <path d="M7 7l10 10" />
    </svg>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const { language, setLanguage } = useLanguage();
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [userName, setUserName] = useState('');
  const [accountType, setAccountType] = useState('free');
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Fixed nav needs to escape whatever stacking context the host page wraps
  // it in — several pages nest it inside a `relative z-10` hero wrapper that
  // sits before an equally-`z-10` sibling further down the page, which wins
  // paint order by DOM position and buries the nav under later sections once
  // scrolled past the hero. Portaling to <body> after mount sidesteps that
  // entirely; the pre-mount render (SSR + first paint) stays in place so the
  // logo still lands in the initial HTML for LCP.
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const updateScrollState = () => setIsScrolled(window.scrollY > 8);
    updateScrollState();
    window.addEventListener('scroll', updateScrollState, { passive: true });
    return () => window.removeEventListener('scroll', updateScrollState);
  }, []);

  useEffect(() => {
    const check = () => {
      const a = isAuthenticated();
      setAuthed(a);
      if (a) {
        const u = getUser();
        setUserName(u?.email?.split('@')[0] || u?.email || '');
        setAccountType(u?.account_type || 'free');
      } else {
        setUserName('');
        setAccountType('free');
      }
    };
    check();
    window.addEventListener('authManager:login', check);
    window.addEventListener('authManager:logout', check);
    return () => {
      window.removeEventListener('authManager:login', check);
      window.removeEventListener('authManager:logout', check);
    };
  }, []);

  // Navigate only — auth cookies are written exclusively at login time
  // (setAuthCookies in lib/auth.ts). Re-stamping them here from localStorage
  // resurrected stale tokens as domain-wide duplicates and poisoned the
  // dashboards' sessions; if the cookie is missing/expired the dashboard
  // redirects to login, which is the correct behavior.
  const handleDashboard = (target: 'user' | 'admin' = 'user') => {
    if (!authed) { setIsSignInModalOpen(true); return; }
    const dashUrl = target === 'admin'
      ? (process.env.NEXT_PUBLIC_ADMIN_DASHBOARD_URL || '/admin')
      : (process.env.NEXT_PUBLIC_DASHBOARD_URL || '/dashboard');
    window.location.href = dashUrl;
  };

  const lightFromTop =
    pathname === '/ai-workflow-automation' || pathname.startsWith('/templates/');

  // The home hero is a light card whose top strip is the nav's own ground —
  // the nav sits *inside* that strip rather than as a bar floating above it.
  // So at rest on `/` the bar drops its dark wash, aligns its content to the
  // card's 1200px column, and switches to black type. Scrolling past the hero
  // hands it back to the standard dark treatment, which is what keeps the
  // links readable over the dark sections below.
  // Ignyte-style bar: logo left, plain sentence-case links centred, outlined
  // "Sign in" + solid "Dashboard" on the right. Light pages (home, templates)
  // get dark type and, once scrolled, a frosted white bar; dark pages keep
  // white type over a dark wash.
  const lightPage = pathname === '/' || lightFromTop;
  const onCard = lightPage; // dark type (kept for the mobile hamburger below)
  const ink = lightPage ? 'text-[#0f1f26]' : 'text-white';
  const navLinkClass = `${ink} px-2.5 py-2 text-[14px] font-normal no-underline opacity-90 hover:opacity-100 transition-opacity duration-200`;
  const outlineBtn = `${lightPage ? 'border-[#0f1f26] text-[#0f1f26] hover:bg-[#0f1f26]/[0.06]' : 'border-white/80 text-white hover:bg-white/10'} inline-flex items-center rounded-md border px-4 py-2 text-[14px] font-medium transition-colors duration-200 cursor-pointer bg-transparent`;
  const solidBtn = `${lightPage ? 'bg-[#0f1f26] border-[#0f1f26] text-white hover:bg-[#23343b]' : 'bg-white border-white text-[#0f1f26] hover:bg-white/90'} inline-flex items-center rounded-md border px-4 py-2 text-[14px] font-medium transition-colors duration-200 cursor-pointer`;
  const manrope = { fontFamily: "var(--font-manrope), 'Manrope', sans-serif" };

  const NAV_LINKS = [
    { href: '/product', label: 'Product' },
    { href: '/company', label: 'Company' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/blog', label: 'Blog' },
    { href: '/careers', label: 'Careers' },
  ];

  const nav = (
    <nav className="fixed top-0 inset-x-0 z-[1000]">
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-0 top-0 h-20 transition-[background-color,backdrop-filter] duration-300 ease-out ${
          !isScrolled && !lightFromTop
            ? 'bg-transparent'
            : lightPage
              ? 'bg-white/80 backdrop-blur-md'
              : 'bg-[rgba(5,5,5,0.78)] backdrop-blur-sm'
        }`}
      />
      <div
        className="relative z-10 h-20 w-full flex justify-between items-center"
        style={{ padding: '0 clamp(1rem, 4.4vw, 4rem)' }}
      >
        {/* Left: Aivory logo */}
        <Link href="/" className="flex items-center shrink-0">
          {/* Measured as the page's LCP element, so it keeps explicit priority.
              White over the hero's blue wash; turns dark with the frosted bar. */}
          <img
            src="/aivory-wordmark.svg"
            alt="Aivory Logo"
            width={205}
            height={30}
            fetchPriority="high"
            decoding="sync"
            className={`h-[20px] w-auto object-contain transition-[filter] duration-300 ${lightPage && isScrolled ? 'brightness-0' : ''}`}
          />
        </Link>

        {/* Centre: links */}
        <div className="hidden lg:flex flex-1 justify-center items-center gap-1 px-6" style={manrope}>
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className={navLinkClass}>
              {l.label}
            </Link>
          ))}
        </div>

        {/* Right: language, sign in / out, dashboard */}
        <div className="hidden lg:flex items-center gap-3 shrink-0" style={manrope}>
          <div className="flex items-center gap-2 mr-1">
            <button
              onClick={() => setLanguage('en')}
              className={`flex items-center gap-1.5 text-[12px] transition-all duration-300 ${ink} ${
                language === 'en' ? 'opacity-100 grayscale-0' : 'opacity-40 grayscale hover:opacity-70'
              }`}
            >
              <Image src="/uk-flag.svg" alt="EN" width={14} height={10} className="rounded-[2px] object-cover h-[10px] w-[14px]" />
              EN
            </button>
            <span className={`${lightPage ? 'text-black/25' : 'text-white/30'} text-[12px]`}>|</span>
            <button
              onClick={() => setLanguage('id')}
              className={`flex items-center gap-1.5 text-[12px] transition-all duration-300 ${ink} ${
                language === 'id' ? 'opacity-100 grayscale-0' : 'opacity-40 grayscale hover:opacity-70'
              }`}
            >
              <Image src="/id-flag.svg" alt="ID" width={14} height={10} className="rounded-[2px] object-cover h-[10px] w-[14px]" />
              ID
            </button>
          </div>
          {authed ? (
            <>
              <span className={`${ink} text-[13px] opacity-80`}>Welcome, {userName}</span>
              <button onClick={() => logout()} className={outlineBtn}>
                Sign out
              </button>
            </>
          ) : (
            <button onClick={() => setIsSignInModalOpen(true)} className={outlineBtn}>
              Sign in
            </button>
          )}
          <button onClick={() => handleDashboard('user')} className={solidBtn}>
            Dashboard
          </button>
          {authed && (accountType === 'superadmin' || accountType === 'admin') && (
            <button onClick={() => handleDashboard('admin')} className={outlineBtn}>
              Admin
            </button>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="lg:hidden flex flex-col items-center justify-center w-10 h-10 bg-transparent border-none cursor-pointer gap-[5px]"
          aria-label="Open menu"
        >
          <span className={`block w-5 h-[1px] ${onCard ? 'bg-black' : 'bg-white'}`} />
          <span className={`block w-5 h-[1px] ${onCard ? 'bg-black' : 'bg-white'}`} />
        </button>
      </div>

      {/* Mobile Fullscreen Overlay Menu */}
      <div
        className={`fixed inset-0 z-[9999] bg-background flex flex-col transition-all duration-300 lg:hidden ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Top bar: Logo + Close */}
        <div className="h-16 flex justify-between items-center px-4">
          <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
            <img
              src="/aivory-wordmark.svg"
              alt="Aivory Logo"
              width={205}
              height={30}
              className="h-[18px] w-auto object-contain"
            />
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center justify-center w-10 h-10 bg-transparent border-none cursor-pointer text-white"
            aria-label="Close menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18" />
              <path d="M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 flex flex-col justify-center px-8 gap-8">
          <Link
            href="/product"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-white text-3xl font-light tracking-tight no-underline hover:text-white/70 transition-colors"
            style={{ fontFamily: "var(--font-manrope), 'Manrope', sans-serif" }}
          >
            Product
          </Link>
          <Link
            href="/company"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-white text-3xl font-light tracking-tight no-underline hover:text-white/70 transition-colors"
            style={{ fontFamily: "var(--font-manrope), 'Manrope', sans-serif" }}
          >
            Company
          </Link>
          <Link
            href="/pricing"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-white text-3xl font-light tracking-tight no-underline hover:text-white/70 transition-colors"
            style={{ fontFamily: "var(--font-manrope), 'Manrope', sans-serif" }}
          >
            Pricing
          </Link>
          <Link
            href="/blog"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-white text-3xl font-light tracking-tight no-underline hover:text-white/70 transition-colors"
            style={{ fontFamily: "var(--font-manrope), 'Manrope', sans-serif" }}
          >
            Blog
          </Link>
          <Link
            href="/careers"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-white text-3xl font-light tracking-tight no-underline hover:text-white/70 transition-colors"
            style={{ fontFamily: "var(--font-manrope), 'Manrope', sans-serif" }}
          >
            Careers
          </Link>
          {authed ? (
            <button
              onClick={() => { setIsMobileMenuOpen(false); logout(); }}
              className="text-white text-3xl font-light tracking-tight no-underline hover:text-white/70 transition-colors bg-transparent border-none cursor-pointer text-left"
              style={{ fontFamily: "var(--font-manrope), 'Manrope', sans-serif" }}
            >
              Sign Out
            </button>
          ) : (
            <button
              onClick={() => { setIsMobileMenuOpen(false); setIsSignInModalOpen(true); }}
              className="text-white text-3xl font-light tracking-tight no-underline hover:text-white/70 transition-colors bg-transparent border-none cursor-pointer text-left"
              style={{ fontFamily: "var(--font-manrope), 'Manrope', sans-serif" }}
            >
              Sign In
            </button>
          )}
          <TechnicalFrameButton
            onClick={() => { setIsMobileMenuOpen(false); handleDashboard('user'); }}
            size="compact"
          >
            Dashboard
          </TechnicalFrameButton>
          {authed && (accountType === 'superadmin' || accountType === 'admin') && (
            <TechnicalFrameButton
              onClick={() => { setIsMobileMenuOpen(false); handleDashboard('admin'); }}
              size="compact"
            >
              Admin
            </TechnicalFrameButton>
          )}
        </div>

        {/* Bottom: Language Toggle */}
        <div className="px-8 pb-10 flex items-center gap-4">
          <button
            onClick={() => { setLanguage('en'); setIsMobileMenuOpen(false); }}
            className={`flex items-center gap-2 transition-all duration-300 ${
              language === 'en' ? 'opacity-100 grayscale-0' : 'opacity-40 grayscale hover:opacity-70'
            }`}
            style={{ fontFamily: "var(--font-manrope), 'Manrope', sans-serif", fontSize: '12px' }}
          >
            <Image src="/uk-flag.svg" alt="EN" width={18} height={12} className="rounded-[2px] object-cover h-[12px] w-[18px]" />
            EN
          </button>
          <span className="text-white/30 text-xs">|</span>
          <button
            onClick={() => { setLanguage('id'); setIsMobileMenuOpen(false); }}
            className={`flex items-center gap-2 transition-all duration-300 ${
              language === 'id' ? 'opacity-100 grayscale-0' : 'opacity-40 grayscale hover:opacity-70'
            }`}
            style={{ fontFamily: "var(--font-manrope), 'Manrope', sans-serif", fontSize: '12px' }}
          >
            <Image src="/id-flag.svg" alt="ID" width={18} height={12} className="rounded-[2px] object-cover h-[12px] w-[18px]" />
            ID
          </button>
        </div>
      </div>

      {/* Sign In Modal */}
      <SignInModal
        isOpen={isSignInModalOpen}
        onClose={() => setIsSignInModalOpen(false)}
      />
    </nav>
  );

  return mounted ? createPortal(nav, document.body) : nav;
}
