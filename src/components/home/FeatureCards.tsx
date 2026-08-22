'use client';

import { useRef, useState, useEffect, type ReactNode } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
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

const STAT_EASE_OUT = 'cubic-bezier(0.23, 1, 0.32, 1)';

function StatCardIcon({ path }: { path: ReactNode }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-white/45"
    >
      {path}
    </svg>
  );
}

const STAT_ICONS = {
  assessment: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5v5l3.2 1.9" />
    </>
  ),
  blueprint: (
    <>
      <path d="M7 3.5h7.5L19 8v12.5a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1Z" />
      <path d="M14 3.5V8h5" />
      <path d="m9 14 2 2 4-4.5" />
    </>
  ),
  automation: (
    <path d="M12.5 3 5 13.5h5.5L11 21l7.5-10.5H13l-.5-7.5Z" />
  ),
  connect: (
    <>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
      <path d="M10.5 7h3a3 3 0 0 1 3 3v3.5" />
    </>
  ),
} as const;

function DiagnosticStatItem({
  target, prefix, suffix, staticValue, title, description, icon, active, delay
}: {
  target?: number; prefix?: string; suffix?: string; staticValue?: string; title: string; description: string; icon: keyof typeof STAT_ICONS; active: boolean; delay: number
}) {
  const value = useCountUp(target ?? 0, active && staticValue === undefined);
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
      className="group relative spotlight-card auto-spotlight flex min-w-0 flex-col items-center overflow-hidden rounded-[20px] border border-white/[0.09] bg-white/[0.035] px-5 py-7 text-center backdrop-blur-md transition-[background-color,border-color,box-shadow,opacity,transform] duration-[700ms] hover:border-white/[0.16] hover:bg-white/[0.055] hover:-translate-y-[2px]"
      style={{
        opacity: active ? 1 : 0,
        transform: active ? 'translateY(0)' : 'translateY(24px)',
        transitionTimingFunction: STAT_EASE_OUT,
        transitionDelay: `${delay}ms`,
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.07), 0 18px 50px rgba(0,0,0,0.2)',
      }}
    >
      <div className="mb-3 flex h-[108px] w-full flex-col items-center justify-center">
        {staticValue === undefined ? (
          <>
            <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.1] bg-white/[0.04]">
              <StatCardIcon path={STAT_ICONS[icon]} />
            </div>
            <div
              className="flex items-baseline justify-center font-light leading-none text-[#f5f5f3] [font-variant-numeric:tabular-nums]"
              style={{
                fontFamily: "'Manrope', sans-serif",
                fontSize: 'clamp(2.5rem, 4vw, 3.4rem)',
                letterSpacing: '-0.05em',
              }}
            >
              {prefix}{value}
              {suffix && (
                <span
                  className="font-light text-white/55"
                  style={{
                    fontSize: 'clamp(1rem, 1.7vw, 1.35rem)',
                    letterSpacing: '-0.025em',
                    marginLeft: '0.3em',
                  }}
                >
                  {suffix}
                </span>
              )}
            </div>
          </>
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/[0.1] bg-white/[0.04]">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="text-white/55">
              {STAT_ICONS[icon]}
            </svg>
          </div>
        )}
      </div>
      <div className="mb-2 text-[13px] font-medium leading-snug tracking-[0.01em] text-[#f0f0ee] md:text-[14px]">
        {title}
      </div>
      <div className="max-w-[210px] text-[12px] font-normal leading-relaxed text-white/65 md:text-[12.5px]">
        {description}
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

  return (
    <>
      <div ref={animRef} className={`animate-on-scroll ${isVisible ? 'is-visible' : ''} w-full pt-4 md:pt-6 pb-12 relative overflow-hidden`} id="features" style={{ zIndex: 1 }}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24 relative z-[1]">
          <div className="text-center flex flex-col justify-center items-center">
            {/* Diagnostic Stats Section */}
            <div className="w-full max-w-[1040px] mx-auto flex flex-col items-center">
              <div ref={statsRef} className="relative grid w-full max-w-[960px] grid-cols-1 items-stretch gap-3 sm:grid-cols-2 lg:grid-cols-4 md:gap-4">
                <DiagnosticStatItem
                  target={10} prefix="" suffix="min" icon="assessment"
                  title="Faster decision-making"
                  description="A self-guided operations assessment maps every process, bottleneck, and cost in one sitting — not weeks of stakeholder interviews."
                  active={statsActive} delay={0}
                />
                <DiagnosticStatItem
                  target={5} prefix="<" suffix="min" icon="blueprint"
                  title="Deployment-ready blueprint"
                  description="A concrete automation plan generated straight from your diagnostic, not a slide deck."
                  active={statsActive} delay={90}
                />
                <DiagnosticStatItem
                  target={90} prefix="" suffix="%" icon="automation"
                  title="Repetitive work automated"
                  description="Up to 90% of ticket routing, reporting, and data entry — handled by agents, not headcount."
                  active={statsActive} delay={180}
                />
                <DiagnosticStatItem
                  staticValue="" icon="connect"
                  title="Connects to your stack"
                  description="Works with your ERP, CRM, and helpdesk — no rip-and-replace, no new systems to learn."
                  active={statsActive} delay={270}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bento grid framework showcase (replaces the archived sticky-scroll version) */}
      <div className="relative w-full">
        <InteractiveGridShowcase />
        <InteractiveGrid />
      </div>
    </>
  );
}
