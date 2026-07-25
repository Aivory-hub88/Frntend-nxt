'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { MetalFx } from 'metal-fx';

/* ── tiny reusable pieces ─────────────────────────────────────────── */
const Dot = ({ className = '' }: { className?: string }) => (
  <span className={`inline-block w-1.5 h-1.5 rounded-full bg-white/30 ${className}`} />
);

const StepIcon = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg border border-white/20 flex items-center justify-center text-white/50 ${className}`}>
    {children}
  </div>
);

/* ── data ──────────────────────────────────────────────────────────── */
const steps = [
  {
    num: '01',
    title: 'OBSERVE',
    desc: 'AI-powered monitoring captures and normalizes all interactions in real time.',
    icon: '⊕',
  },
  {
    num: '02',
    title: 'ANALYZE',
    desc: 'Behavioral analysis and correlation identify patterns, anomalies and emerging threats.',
    icon: '⊞',
  },
  {
    num: '03',
    title: 'CLASSIFY',
    desc: 'Traffic is classified based on risk scores and threat confidence in real time.',
    icon: '◎',
  },
  {
    num: '04',
    title: 'RESPOND',
    desc: 'Adaptive response engine contains, mitigates and neutralizes threats without disrupting legitimate users.',
    icon: '⛊',
  },
  {
    num: '05',
    title: 'LEARN',
    desc: 'Every interaction is turned into operational intelligence to improve detection and response.',
    icon: '⚙',
  },
  {
    num: '06',
    title: 'STRENGTHEN',
    desc: 'Intelligence drives policy updates, defense hardening and continuous posture improvement.',
    icon: '◇',
  },
];

const sources = [
  { icon: '🌐', label: 'WEB TRAFFIC' },
  { icon: '</>', label: 'API REQUESTS' },
  { icon: '👤', label: 'USERS' },
  { icon: '▢', label: 'DEVICES' },
  { icon: '⬡', label: 'SYSTEMS' },
  { icon: '📡', label: 'IOT / OT' },
];

const classifications = [
  { label: 'LEGITIMATE', sub: 'LOW RISK', icon: '✓', color: 'border-emerald-500/40 text-emerald-400' },
  { label: 'SUSPICIOUS', sub: 'MEDIUM RISK', icon: '⚠', color: 'border-amber-500/40 text-amber-400' },
  { label: 'MALICIOUS', sub: 'HIGH RISK', icon: '✕', color: 'border-red-500/40 text-red-400' },
];

const intelItems = [
  'THREAT INDICATORS',
  'ATTACK PATTERNS',
  'BEHAVIOURAL SIGNATURES',
  'CAMPAIGN INTELLIGENCE',
  'TACTICS & TECHNIQUES',
  'ZERO-DAY INSIGHT',
];

const continuousItems = [
  { icon: '◷', label: '24/7', sub: 'MONITORING' },
  { icon: '⟳', label: 'ADAPTIVE', sub: 'RESPONSE' },
  { icon: '◉', label: '100%', sub: 'VISIBILITY' },
  { icon: '🔗', label: 'CONTINUOUS', sub: 'INTELLIGENCE' },
  { icon: '🔒', label: 'ZERO TRUST', sub: 'ACCESS' },
  { icon: '⚡', label: 'AUTONOMOUS', sub: 'DEFENSE' },
];

const rightCards = [
  { title: 'POLICY EVOLUTION', desc: 'Policies adapt based on the latest intelligence and risk landscape.' },
  { title: 'DEFENSE HARDENING', desc: 'Security posture is strengthened across the entire environment continuously.' },
  { title: 'ENTERPRISE INFRASTRUCTURE', desc: 'Applications, assets and data remain protected and available.' },
];

/* ── animation helpers ────────────────────────────────────────────── */
const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: 'easeOut' },
});

const fadeIn = (delay: number) => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.6, delay, ease: 'easeOut' },
});

const scaleIn = (delay: number) => ({
  initial: { opacity: 0, scale: 0.85 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5, delay, ease: 'easeOut' },
});

const slideLeft = (delay: number) => ({
  initial: { opacity: 0, x: -30 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.5, delay, ease: 'easeOut' },
});

const slideRight = (delay: number) => ({
  initial: { opacity: 0, x: 30 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.5, delay, ease: 'easeOut' },
});

/* ── animated connector line (vertical) ───────────────────────────── */
function ConnectorLine({ delay = 0 }: { delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });
  return (
    <motion.div
      ref={ref}
      className="flex justify-center py-1"
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.3, delay }}
    >
      <motion.div
        className="w-px bg-gradient-to-b from-white/30 to-white/10"
        initial={{ height: 0 }}
        animate={inView ? { height: 24 } : {}}
        transition={{ duration: 0.4, delay: delay + 0.1 }}
      />
    </motion.div>
  );
}

/* ── main component ───────────────────────────────────────────────── */
export default function BastionHowItWorks() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-5% 0px' });

  return (
    <section ref={sectionRef} className="bg-transparent text-white py-24 md:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* ── Header ────────────────────────────────────────────── */}
        <motion.div
          className="mb-16 md:mb-20"
          {...fadeUp(0)}
          animate={isInView ? fadeUp(0).animate : fadeUp(0).initial}
        >
          {/* Grid markers */}
          <div className="flex justify-between text-[10px] text-white/20 font-mono mb-6 tracking-widest">
            {['01', '02', '03', '04', '05', '06'].map((n) => (
              <span key={n}>{n}</span>
            ))}
          </div>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-light leading-tight text-white mb-6 tracking-tight">
            How Bastion Works.
          </h2>
          <p className="text-sm md:text-base text-white/40 font-mono uppercase tracking-[0.2em]">
            Adaptive defense that evolves with every interaction.
          </p>
        </motion.div>

        {/* ── Main 3-column layout ──────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr_280px] gap-8 lg:gap-6">

          {/* ─── LEFT COLUMN: Sources + Continuous ──────────────── */}
          <div className="space-y-8 hidden lg:block">
            {/* Sources panel */}
            <motion.div
              className="border border-white/10 rounded-lg p-4"
              {...slideLeft(0.2)}
              animate={isInView ? slideLeft(0.2).animate : slideLeft(0.2).initial}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono text-white/60 tracking-wider">SOURCES</span>
                <span className="text-white/20 text-[10px]">⊘</span>
              </div>
              <div className="space-y-2">
                {sources.map((s, i) => (
                  <motion.div
                    key={s.label}
                    className="flex items-center gap-3 py-2 px-3 border border-white/5 rounded-md hover:border-white/15 transition-colors"
                    {...fadeIn(0.3 + i * 0.08)}
                    animate={isInView ? fadeIn(0.3 + i * 0.08).animate : fadeIn(0.3 + i * 0.08).initial}
                  >
                    <span className="text-xs text-white/30 w-5 text-center">{s.icon}</span>
                    <span className="text-[11px] font-mono text-white/70 tracking-wider">{s.label}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Continuous By Design */}
            <motion.div
              className="border border-white/10 rounded-lg p-4"
              {...slideLeft(0.6)}
              animate={isInView ? slideLeft(0.6).animate : slideLeft(0.6).initial}
            >
              <span className="text-xs font-mono text-white/60 tracking-wider block mb-4">CONTINUOUS BY DESIGN</span>
              <div className="grid grid-cols-2 gap-2">
                {continuousItems.map((c, i) => (
                  <motion.div
                    key={c.label}
                    className="text-center py-2 px-1 border border-white/5 rounded-md"
                    {...fadeIn(0.7 + i * 0.06)}
                    animate={isInView ? fadeIn(0.7 + i * 0.06).animate : fadeIn(0.7 + i * 0.06).initial}
                  >
                    <span className="text-xs text-white/30 block">{c.icon}</span>
                    <span className="text-[10px] font-mono text-white/70 font-semibold block">{c.label}</span>
                    <span className="text-[9px] font-mono text-white/40 block">{c.sub}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* ─── CENTER COLUMN: Flow ────────────────────────────── */}
          <div className="flex flex-col items-center">
            {/* Internet → Incoming Traffic */}
            <motion.div
              className="flex flex-col items-center mb-2"
              {...fadeUp(0.15)}
              animate={isInView ? fadeUp(0.15).animate : fadeUp(0.15).initial}
            >
              <span className="text-[11px] font-mono text-white/40 tracking-wider mb-1">INTERNET</span>
              <span className="text-white/30 text-lg">⊕</span>
            </motion.div>

            <ConnectorLine delay={0.2} />

            <motion.div
              className="border border-white/20 rounded-md px-6 py-2.5 mb-1"
              {...scaleIn(0.25)}
              animate={isInView ? scaleIn(0.25).animate : scaleIn(0.25).initial}
            >
              <span className="text-xs font-mono text-white/80 tracking-widest">INCOMING TRAFFIC</span>
            </motion.div>

            <ConnectorLine delay={0.3} />

            {/* Steps 01 → 03 */}
            {steps.slice(0, 3).map((step, i) => (
              <div key={step.num} className="w-full max-w-md">
                <motion.div
                  {...scaleIn(0.35 + i * 0.15)}
                  animate={isInView ? scaleIn(0.35 + i * 0.15).animate : scaleIn(0.35 + i * 0.15).initial}
                  className="w-full"
                >
                  <MetalFx preset="silver" strength={0.90} style={{ width: '100%', display: 'flex' }}>
                    <div className="w-full border border-white/15 rounded-xl p-5 md:p-6 bg-[#0a0a0a] backdrop-blur-sm hover:border-white/25 transition-all group">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className="text-lg md:text-xl font-mono text-white/25 font-light">{step.num}</span>
                          <span className="text-sm md:text-base font-mono text-white font-semibold tracking-wider">{step.title}</span>
                        </div>
                        <div className="flex gap-1 opacity-30">
                          <Dot /><Dot /><Dot />
                        </div>
                      </div>
                      <p className="text-xs md:text-sm text-white/50 font-light leading-relaxed pl-9">{step.desc}</p>
                    </div>
                  </MetalFx>
                </motion.div>
                {i < 2 && <ConnectorLine delay={0.35 + (i + 1) * 0.15} />}
              </div>
            ))}

            <ConnectorLine delay={0.7} />

            {/* Classification cards */}
            <motion.div
              className="grid grid-cols-3 gap-2 md:gap-3 w-full max-w-md mb-1"
              {...fadeUp(0.75)}
              animate={isInView ? fadeUp(0.75).animate : fadeUp(0.75).initial}
            >
              {classifications.map((c, i) => (
                <motion.div
                  key={c.label}
                  className={`border rounded-lg p-3 text-center ${c.color} bg-white/[0.02]`}
                  {...scaleIn(0.8 + i * 0.1)}
                  animate={isInView ? scaleIn(0.8 + i * 0.1).animate : scaleIn(0.8 + i * 0.1).initial}
                >
                  <span className="text-lg block mb-1">{c.icon}</span>
                  <span className="text-[10px] font-mono font-semibold block tracking-wider">{c.label}</span>
                  <span className="text-[9px] font-mono opacity-60 block">{c.sub}</span>
                </motion.div>
              ))}
            </motion.div>

            <ConnectorLine delay={0.95} />

            {/* Steps 04 → 06 */}
            {steps.slice(3).map((step, i) => (
              <div key={step.num} className="w-full max-w-md">
                <motion.div
                  {...scaleIn(1.0 + i * 0.15)}
                  animate={isInView ? scaleIn(1.0 + i * 0.15).animate : scaleIn(1.0 + i * 0.15).initial}
                  className="w-full"
                >
                  <MetalFx preset="silver" strength={0.90} style={{ width: '100%', display: 'flex' }}>
                    <div className="w-full border border-white/15 rounded-xl p-5 md:p-6 bg-[#0a0a0a] backdrop-blur-sm hover:border-white/25 transition-all group">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className="text-lg md:text-xl font-mono text-white/25 font-light">{step.num}</span>
                          <span className="text-sm md:text-base font-mono text-white font-semibold tracking-wider">{step.title}</span>
                        </div>
                        <div className="flex gap-1 opacity-30">
                          <Dot /><Dot /><Dot />
                        </div>
                      </div>
                      <p className="text-xs md:text-sm text-white/50 font-light leading-relaxed pl-9">{step.desc}</p>
                    </div>
                  </MetalFx>
                </motion.div>
                {i < 2 && <ConnectorLine delay={1.0 + (i + 1) * 0.15} />}
              </div>
            ))}
          </div>

          {/* ─── RIGHT COLUMN: Intelligence + Outcomes ──────────── */}
          <div className="space-y-6 hidden lg:block">
            {/* Operational Intelligence */}
            <motion.div
              className="border border-white/10 rounded-lg p-4"
              {...slideRight(0.4)}
              animate={isInView ? slideRight(0.4).animate : slideRight(0.4).initial}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono text-white/60 tracking-wider">OPERATIONAL INTELLIGENCE</span>
                <span className="text-white/20 text-[10px]">⊘</span>
              </div>
              <div className="space-y-2">
                {intelItems.map((item, i) => (
                  <motion.div
                    key={item}
                    className="flex items-center gap-3 py-1.5"
                    {...fadeIn(0.5 + i * 0.06)}
                    animate={isInView ? fadeIn(0.5 + i * 0.06).animate : fadeIn(0.5 + i * 0.06).initial}
                  >
                    <span className="text-white/20 text-[10px]">◈</span>
                    <span className="text-[11px] font-mono text-white/60 tracking-wider">{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right-side outcome cards */}
            {rightCards.map((card, i) => (
              <motion.div
                key={card.title}
                className="border border-white/10 rounded-lg p-4"
                {...slideRight(0.8 + i * 0.15)}
                animate={isInView ? slideRight(0.8 + i * 0.15).animate : slideRight(0.8 + i * 0.15).initial}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-white/80 tracking-wider font-semibold">{card.title}</span>
                  <span className="text-white/20 text-[10px]">⊘</span>
                </div>
                <p className="text-[11px] text-white/40 font-light leading-relaxed">{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Mobile: Sources + Continuous + Intelligence (stacked) ── */}
        <div className="lg:hidden mt-12 space-y-6">
          {/* Sources */}
          <motion.div
            className="border border-white/10 rounded-lg p-4"
            {...fadeUp(1.2)}
            animate={isInView ? fadeUp(1.2).animate : fadeUp(1.2).initial}
          >
            <span className="text-xs font-mono text-white/60 tracking-wider block mb-3">SOURCES</span>
            <div className="grid grid-cols-2 gap-2">
              {sources.map((s) => (
                <div key={s.label} className="flex items-center gap-2 py-1.5 px-2 border border-white/5 rounded-md">
                  <span className="text-xs text-white/30">{s.icon}</span>
                  <span className="text-[10px] font-mono text-white/60">{s.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Continuous */}
          <motion.div
            className="border border-white/10 rounded-lg p-4"
            {...fadeUp(1.3)}
            animate={isInView ? fadeUp(1.3).animate : fadeUp(1.3).initial}
          >
            <span className="text-xs font-mono text-white/60 tracking-wider block mb-3">CONTINUOUS BY DESIGN</span>
            <div className="grid grid-cols-3 gap-2">
              {continuousItems.map((c) => (
                <div key={c.label} className="text-center py-2 border border-white/5 rounded-md">
                  <span className="text-[10px] font-mono text-white/70 font-semibold block">{c.label}</span>
                  <span className="text-[9px] font-mono text-white/40 block">{c.sub}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Operational Intelligence */}
          <motion.div
            className="border border-white/10 rounded-lg p-4"
            {...fadeUp(1.4)}
            animate={isInView ? fadeUp(1.4).animate : fadeUp(1.4).initial}
          >
            <span className="text-xs font-mono text-white/60 tracking-wider block mb-3">OPERATIONAL INTELLIGENCE</span>
            <div className="grid grid-cols-2 gap-1">
              {intelItems.map((item) => (
                <div key={item} className="flex items-center gap-2 py-1">
                  <span className="text-white/20 text-[8px]">◈</span>
                  <span className="text-[10px] font-mono text-white/50">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Outcome cards */}
          {rightCards.map((card, i) => (
            <motion.div
              key={card.title}
              className="border border-white/10 rounded-lg p-4"
              {...fadeUp(1.5 + i * 0.1)}
              animate={isInView ? fadeUp(1.5 + i * 0.1).animate : fadeUp(1.5 + i * 0.1).initial}
            >
              <span className="text-xs font-mono text-white/80 tracking-wider font-semibold block mb-1">{card.title}</span>
              <p className="text-[11px] text-white/40 font-light leading-relaxed">{card.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* ── Footer Status Bar ─────────────────────────────────── */}
        <motion.div
          className="mt-16 md:mt-20 border-t border-white/5 pt-6 flex flex-wrap items-center justify-between gap-4"
          {...fadeIn(1.5)}
          animate={isInView ? fadeIn(1.5).animate : fadeIn(1.5).initial}
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-mono text-white/40">SYSTEM STATUS</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-[10px] font-mono text-white/40">OPERATIONAL</span>
            </div>
          </div>
          <span className="text-[10px] font-mono text-white/30">BASTION ENGINE v2.0</span>
          <div className="hidden md:flex items-center gap-6 text-[10px] font-mono text-white/25">
            <div className="flex items-center gap-2">
              <span className="w-8 h-px bg-white/30" />
              <span>DATA FLOW</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-px border-t border-dashed border-white/30" />
              <span>INTELLIGENCE FLOW</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-px border-t border-dotted border-white/30" />
              <span>FEEDBACK LOOP</span>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
