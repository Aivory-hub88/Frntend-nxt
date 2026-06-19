'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/components/context/LanguageContext';
import SignInModal from '@/components/auth/SignInModal';
import { isAuthenticated, getUser, logout } from '@/lib/auth';

export default function Navbar() {
  const { language, setLanguage } = useLanguage();
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [userName, setUserName] = useState('');
  const [accountType, setAccountType] = useState('free');

  useEffect(() => {
    const check = () => {
      const a = isAuthenticated();
      setAuthed(a);
      if (a) {
        const u = getUser();
        setUserName(u?.email?.split('@')[0] || u?.email || '');
        setAccountType(u?.user_metadata?.account_type || 'free');
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

  const handleDashboard = (target: 'user' | 'admin' = 'user') => {
    if (!authed) { setIsSignInModalOpen(true); return; }
    // Set auth cookie so dashboard middleware recognizes the session
    try {
      const raw = localStorage.getItem('aivory_auth');
      if (raw) {
        const s = JSON.parse(raw);
        if (s?.access_token) {
          document.cookie = `aivory_access_token=${encodeURIComponent(s.access_token)}; path=/; SameSite=Lax; max-age=3600`;
        }
        if (s?.refresh_token) {
          document.cookie = `aivory_refresh_token=${encodeURIComponent(s.refresh_token)}; path=/; SameSite=Lax; max-age=604800`;
        }
      }
    } catch {}
    const dashUrl = target === 'admin'
      ? (process.env.NEXT_PUBLIC_ADMIN_DASHBOARD_URL || '/admin')
      : (process.env.NEXT_PUBLIC_USER_DASHBOARD_URL || '/dashboard');
    window.location.href = dashUrl;
  };

  return (
    <nav className="absolute top-0 left-0 right-0 z-[1000]" style={{ background: 'transparent' }}>
      <div className="max-w-[1400px] mx-auto flex justify-between items-center" style={{ padding: '1.5rem clamp(1rem, 4vw, 2rem)' }}>
        <Link href="/" className="flex items-center">
          <Image src="/Aivory_logo_2_2026.svg" alt="Aivory Logo" width={140} height={30} className="h-[30px] w-auto object-contain" priority />
        </Link>

        <div className="hidden md:flex items-center gap-7">
          <div className="flex items-center gap-2">
            <button onClick={() => setLanguage('en')} className={`flex items-center gap-1.5 transition-all duration-300 ${language === 'en' ? 'opacity-100 grayscale-0' : 'opacity-40 grayscale hover:opacity-70'}`} style={{ fontFamily: "'Manrope', sans-serif", fontSize: '10px' }}>
              <Image src="/uk-flag.svg" alt="EN" width={14} height={10} className="rounded-[2px] object-cover h-[10px] w-[14px]" /> EN
            </button>
            <span className="text-white/30 text-[10px]">|</span>
            <button onClick={() => setLanguage('id')} className={`flex items-center gap-1.5 transition-all duration-300 ${language === 'id' ? 'opacity-100 grayscale-0' : 'opacity-40 grayscale hover:opacity-70'}`} style={{ fontFamily: "'Manrope', sans-serif", fontSize: '10px' }}>
              <Image src="/id-flag.svg" alt="ID" width={14} height={10} className="rounded-[2px] object-cover h-[10px] w-[14px]" /> ID
            </button>
          </div>
          <Link href="/product" className="text-white font-normal uppercase tracking-normal no-underline hover:underline transition-all duration-200" style={{ fontFamily: "'Manrope', sans-serif", fontSize: '10px' }}>PRODUCT</Link>
          <Link href="/company" className="text-white font-normal uppercase tracking-normal no-underline hover:underline transition-all duration-200" style={{ fontFamily: "'Manrope', sans-serif", fontSize: '10px' }}>COMPANY</Link>
          <Link href="/pricing" className="text-white font-normal uppercase tracking-normal no-underline hover:underline transition-all duration-200" style={{ fontFamily: "'Manrope', sans-serif", fontSize: '10px' }}>PRICING</Link>
          <Link href="/blog" className="text-white font-normal uppercase tracking-normal no-underline hover:underline transition-all duration-200" style={{ fontFamily: "'Manrope', sans-serif", fontSize: '10px' }}>BLOG</Link>
          <Link href="/careers" className="text-white font-normal uppercase tracking-normal no-underline hover:underline transition-all duration-200" style={{ fontFamily: "'Manrope', sans-serif", fontSize: '10px' }}>CAREERS</Link>

          {authed ? (
            <>
              <span className="text-white text-sm" style={{ fontFamily: "'Manrope', sans-serif" }}>Welcome, {userName}</span>
              <button onClick={logout} className="text-white/70 font-normal uppercase tracking-normal hover:text-white transition-all duration-200 bg-transparent border-none cursor-pointer" style={{ fontFamily: "'Manrope', sans-serif", fontSize: '10px' }}>SIGN OUT</button>
            </>
          ) : (
            <button onClick={() => setIsSignInModalOpen(true)} className="text-white font-normal uppercase tracking-normal no-underline hover:underline transition-all duration-200 bg-transparent border-none cursor-pointer" style={{ fontFamily: "'Manrope', sans-serif", fontSize: '10px' }}>SIGN IN</button>
          )}

          <button onClick={() => handleDashboard('user')}
            className="h-[29px] px-[18px] font-normal text-white bg-transparent inline-flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-white/[0.08] hover:border-white/40"
            style={{ border: '1px solid rgba(255, 255, 255, 0.25)', borderRadius: 0, fontFamily: "'Manrope', sans-serif", fontSize: '10px', letterSpacing: '-0.01em', textTransform: 'uppercase' }}>
            DASHBOARD
          </button>
          {authed && (accountType === 'superadmin' || accountType === 'admin') && (
            <button onClick={() => handleDashboard('admin')}
              className="h-[29px] px-[18px] font-normal text-black bg-white inline-flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-white/80"
              style={{ borderRadius: 0, fontFamily: "'Manrope', sans-serif", fontSize: '10px', letterSpacing: '-0.01em', textTransform: 'uppercase' }}>
              ADMIN
            </button>
          )}
        </div>

        <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden flex flex-col items-center justify-center w-10 h-10 bg-transparent border-none cursor-pointer gap-[5px]" aria-label="Open menu">
          <span className="block w-5 h-[1px] bg-white" /><span className="block w-5 h-[1px] bg-white" />
        </button>
      </div>

      {/* Mobile Menu (simplified) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[9999] bg-black flex flex-col md:hidden">
          <div className="flex justify-between items-center px-4 py-6">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)}><Image src="/Aivory_logo_2_2026.svg" alt="Aivory" width={140} height={30} className="h-[30px] w-auto object-contain" /></Link>
            <button onClick={() => setIsMobileMenuOpen(false)} className="text-white w-10 h-10" aria-label="Close">✕</button>
          </div>
          <div className="flex-1 flex flex-col justify-center px-8 gap-8">
            <Link href="/product" onClick={() => setIsMobileMenuOpen(false)} className="text-white text-3xl font-light">Product</Link>
            <Link href="/blog" onClick={() => setIsMobileMenuOpen(false)} className="text-white text-3xl font-light">Blog</Link>
            <Link href="/careers" onClick={() => setIsMobileMenuOpen(false)} className="text-white text-3xl font-light">Careers</Link>
            {authed ? (
              <><span className="text-[#b2cca2] text-xl">Welcome, {userName}</span>
              <button onClick={() => { setIsMobileMenuOpen(false); handleDashboard('user'); }} className="text-white text-3xl font-light bg-transparent border-none text-left cursor-pointer">Dashboard</button>
              {(accountType === 'superadmin' || accountType === 'admin') && (
                <button onClick={() => { setIsMobileMenuOpen(false); handleDashboard('admin'); }} className="text-[#b2cca2] text-3xl font-light bg-transparent border-none text-left cursor-pointer">Admin Dashboard</button>
              )}
              <button onClick={() => { setIsMobileMenuOpen(false); logout(); }} className="text-white/60 text-xl bg-transparent border-none text-left cursor-pointer">Sign Out</button></>
            ) : (
              <button onClick={() => { setIsMobileMenuOpen(false); setIsSignInModalOpen(true); }} className="text-white text-3xl font-light bg-transparent border-none text-left cursor-pointer">Sign In</button>
            )}
          </div>
        </div>
      )}

      <SignInModal isOpen={isSignInModalOpen} onClose={() => setIsSignInModalOpen(false)} />
    </nav>
  );
}
