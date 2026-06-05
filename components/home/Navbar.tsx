'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="absolute top-0 left-0 right-0 z-[1000]" style={{ background: 'transparent' }}>
      <div className="max-w-[1400px] mx-auto flex justify-between items-center" style={{ padding: '1.5rem 2rem' }}>
        {/* Left: Aivory logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/aivory-logo.svg"
            alt="Aivory Logo"
            width={78}
            height={26}
            className="h-[26px] w-auto object-contain"
            priority
          />
        </Link>

        {/* Right: Auth actions */}
        <div className="flex items-center gap-7">
          <a
            href="#"
            className="text-white font-normal uppercase tracking-normal no-underline hover:underline transition-all duration-200"
            style={{ fontFamily: "'Manrope', sans-serif", fontSize: '10px' }}
          >
            SIGN IN
          </a>
          <Link
            href="/product"
            className="text-white font-normal uppercase tracking-normal no-underline hover:underline transition-all duration-200"
            style={{ fontFamily: "'Manrope', sans-serif", fontSize: '10px' }}
          >
            PRODUCT
          </Link>
          <button
            className="h-[29px] px-[18px] font-normal text-white bg-transparent inline-flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-white/[0.08] hover:border-white/40"
            style={{
              border: '1px solid rgba(255, 255, 255, 0.25)',
              borderRadius: 0,
              fontFamily: "'Manrope', sans-serif",
              fontSize: '10px',
              letterSpacing: '-0.01em',
              textTransform: 'uppercase',
            }}
          >
            DASHBOARD
          </button>
        </div>
      </div>
    </nav>
  );
}
