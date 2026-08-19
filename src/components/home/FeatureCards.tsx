'use client';

import { useRef, useState, useEffect } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { InteractiveShowcase } from '@/components/product/InteractiveShowcase';
import { InteractiveGridShowcase } from '@/components/product/InteractiveGridShowcase';
import { InteractiveGrid } from '@/components/product/InteractiveGrid';

/* ─── Helpers for Diagnostic Stats ─── */
function useCountUp(target: number, active: boolean, duration = 2000) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;
    let start: number | null = null;
    let raf: number;

    function easeOutExpo(t: number) {
      return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    }

    function step(timestamp: number) {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      setValue(Math.round(easeOutExpo(progress) * target));
      if (progress < 1) raf = requestAnimationFrame(step);
    }

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, active, duration]);

  return value;
}

function DiagnosticStatItem({
  target, prefix, suffix, title, subtitle, active, delay
}: {
  target: number; prefix: string; suffix: string; title: string; subtitle: string; active: boolean; delay: number
}) {
  const value = useCountUp(target, active);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animationFrameId: number;
    let startTime = Math.random() * 10000;

    const animate = (time: number) => {
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const radiusX = rect.width / 2;
        const radiusY = rect.height / 2;
        const speed = 0.004; 
        const angle = (time + startTime) * speed;
        
        const x = centerX + radiusX * Math.cos(angle);
        const y = centerY - radiusY * Math.sin(angle);
        
        cardRef.current.style.setProperty('--mouse-x', `${x}px`);
        cardRef.current.style.setProperty('--mouse-y', `${y}px`);
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div
      ref={cardRef}
      className="group relative spotlight-card auto-spotlight flex min-w-0 flex-col items-center justify-center overflow-hidden rounded-[20px] border border-white/[0.09] bg-white/[0.035] px-4 py-6 text-center backdrop-blur-md transition-[background-color,border-color,box-shadow,opacity,transform] duration-[800ms] ease-out md:min-h-[190px] md:px-5 md:py-7 hover:border-white/[0.16] hover:bg-white/[0.055]"
      style={{
        opacity: active ? 1 : 0,
        transform: active ? 'translateY(0)' : 'translateY(24px)',
        transitionDelay: `${delay}ms`,
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.07), 0 18px 50px rgba(0,0,0,0.2)',
      }}
    >
      <div
        className="mb-3 flex items-baseline justify-center font-light leading-none text-[#f5f5f3] [font-variant-numeric:tabular-nums]"
        style={{
          fontFamily: "'Manrope', sans-serif",
          fontSize: 'clamp(2.7rem, 4.5vw, 3.85rem)',
          letterSpacing: '-0.055em',
        }}
      >
        {prefix}{value}
        {suffix && (
          <span
            className="font-light text-white/55"
            style={{
              fontSize: 'clamp(1.05rem, 1.8vw, 1.45rem)',
              letterSpacing: '-0.025em',
              marginLeft: '0.3em',
            }}
          >
            {suffix}
          </span>
        )}
      </div>
      <div className="flex min-h-[2.5rem] max-w-[220px] items-center justify-center text-[12px] font-light leading-snug tracking-[0.01em] text-[#e7e7e5] md:text-[13px]">
        {title}
      </div>
      <div className="mt-1.5 text-[10px] font-light uppercase tracking-[0.13em] text-white/40 md:text-[11px]">
        {subtitle}
      </div>
    </div>
  );
}

/* ─── Main Component ─── */
export default function FeatureCards() {
  const { ref: animRef, isVisible } = useScrollAnimation();
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsActive, setStatsActive] = useState(false);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Both showcases used to mount on every device (CSS `hidden` only hides them — the
  // component still mounts and keeps ~20 setInterval animation loops running off-screen).
  // We render BOTH until mounted (so the SSR HTML keeps the marketing copy for SEO and
  // there's no hydration mismatch), then unmount the one for the other breakpoint. Since
  // it was already display:none, dropping it is invisible — but its timers/DOM go away.
  const [isLg, setIsLg] = useState<boolean | null>(null);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const update = () => setIsLg(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  return (
    <>
      <div ref={animRef} className={`animate-on-scroll ${isVisible ? 'is-visible' : ''} w-full pt-4 md:pt-6 pb-12 relative overflow-hidden`} id="features" style={{ zIndex: 1 }}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24 relative z-[1]">
          <div className="text-center flex flex-col justify-center items-center">
            {/* Diagnostic Stats Section */}
            <div className="w-full max-w-[850px] mx-auto flex flex-col items-center">
              <div ref={statsRef} className="relative grid w-full max-w-[720px] grid-cols-1 items-stretch gap-3 sm:grid-cols-3 md:gap-4">
                <DiagnosticStatItem target={10} prefix="" suffix="min" title="Business Operations Assessment" subtitle="not days of sessions" active={statsActive} delay={0} />
                <DiagnosticStatItem target={5} prefix="<" suffix="min" title="Transformation Blueprint" subtitle="not weeks of decks" active={statsActive} delay={100} />
                <DiagnosticStatItem target={0} prefix="" suffix="" title="False Starts" subtitle="one clear starting point" active={statsActive} delay={200} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Replaced GSAP Cards with Product Page Components */}
      <div className="relative w-full">
        <div className="hidden lg:block">
          {(isLg === null || isLg) && <InteractiveShowcase containedDashboard />}
        </div>
        <div className="block lg:hidden">
          {(isLg === null || !isLg) && <InteractiveGridShowcase />}
        </div>
        <InteractiveGrid />
      </div>
    </>
  );
}
