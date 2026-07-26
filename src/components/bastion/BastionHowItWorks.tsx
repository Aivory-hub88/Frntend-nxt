'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { MetallicBorder } from './MetallicBorder';
import { 
  Globe, Target, Network, Radar, Shield, BrainCircuit, Layers,
  CheckCircle2, AlertTriangle, XCircle, ChevronDown, ShieldAlert,
  ChevronLeft, ChevronRight
} from 'lucide-react';

/* ── data ──────────────────────────────────────────────────────────── */
const steps1 = [
  {
    num: '01', title: 'OBSERVE',
    desc: 'AI-powered monitoring captures and normalizes all interactions in real time.',
    icon: Target,
  },
  {
    num: '02', title: 'ANALYZE',
    desc: 'Behavioral analysis and correlation identify patterns, anomalies and emerging threats.',
    icon: Network,
  },
  {
    num: '03', title: 'CLASSIFY',
    desc: 'Traffic is classified based on risk scores and threat confidence in real time.',
    icon: Radar,
  },
];

const steps2 = [
  {
    num: '04', title: 'RESPOND',
    desc: 'Adaptive response engine contains, mitigates and neutralizes threats using progressive challenge without disrupting legitimate users.',
    icon: Shield,
  },
  {
    num: '05', title: 'LEARN',
    desc: 'Every interaction is turned into operational intelligence to improve detection and response.',
    icon: BrainCircuit,
  },
  {
    num: '06', title: 'STRENGTHEN',
    desc: 'Intelligence drives policy updates, defense hardening and continuous posture improvement.',
    icon: Layers,
  },
];

const classifications = [
  { label: 'LEGITIMATE', sub: 'LOW RISK', icon: CheckCircle2, color: 'text-emerald-400', border: 'border-emerald-500/40', gradient: 'from-emerald-500/15 to-transparent' },
  { label: 'SUSPICIOUS', sub: 'MEDIUM RISK', icon: AlertTriangle, color: 'text-amber-400', border: 'border-amber-500/40', gradient: 'from-amber-500/15 to-transparent' },
  { label: 'MALICIOUS', sub: 'HIGH RISK', icon: XCircle, color: 'text-red-400', border: 'border-red-500/40', gradient: 'from-red-500/15 to-transparent' },
];

const sources = [
  'WEB TRAFFIC', 'API REQUESTS', 'USERS', 'DEVICES', 'SYSTEMS', 'IOT / OT'
];

const continuousItems = [
  '24/7 MONITORING', 'ADAPTIVE RESPONSE', '100% VISIBILITY',
  'CONTINUOUS INTELLIGENCE', 'ZERO TRUST ACCESS', 'AUTONOMOUS DEFENSE'
];

const intelItems = [
  'Threat Indicators', 'Attack Patterns', 'Behavioural Signatures',
  'Campaign Intelligence', 'Tactics & Techniques', 'Zero-Day Insight'
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
  transition: { duration: 0.5, delay, ease: 'easeOut' },
});

const scaleIn = (delay: number) => ({
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5, delay, ease: 'easeOut' },
});

const slideLeft = (delay: number) => ({
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.5, delay, ease: 'easeOut' },
});

const slideRight = (delay: number) => ({
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.5, delay, ease: 'easeOut' },
});

/* ── animated connector lines ─────────────────────────────────────── */
const FlowArrow = ({ delay = 0, height = 24 }: { delay?: number, height?: number }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });
  return (
    <motion.div ref={ref} className="flex flex-col items-center py-1 overflow-hidden"
      initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.3, delay }}>
      <svg width="2" height={height} className="overflow-visible">
        <motion.line 
          x1="1" y1="0" x2="1" y2={height} 
          stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeDasharray="3 3"
          initial={{ strokeDashoffset: 6 }}
          animate={{ strokeDashoffset: 0 }}
          transition={{ duration: 0.6, repeat: Infinity, ease: 'linear' }}
        />
      </svg>
      <ChevronDown className="w-4 h-4 text-white/30 -mt-1.5" />
    </motion.div>
  );
};

const HorizontalFlow = ({ direction = 'right', delay = 0, width = 48 }: { direction?: 'left'|'right', delay?: number, width?: number }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });
  
  return (
    <motion.div ref={ref} className={`absolute top-1/2 -translate-y-1/2 flex items-center z-0 hidden lg:flex ${direction === 'right' ? '-right-12' : '-left-12'}`}
      style={{ width: `${width}px` }}
      initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.3, delay }}>
      {direction === 'left' && <ChevronLeft className="w-4 h-4 text-white/30 -mr-1 z-10 shrink-0" />}
      <svg width="100%" height="2" className="overflow-visible grow">
        <motion.line 
          x1="0" y1="1" x2="100%" y2="1" 
          stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeDasharray="3 3"
          initial={{ strokeDashoffset: direction === 'right' ? 6 : -6 }}
          animate={{ strokeDashoffset: 0 }}
          transition={{ duration: 0.6, repeat: Infinity, ease: 'linear' }}
        />
      </svg>
      {direction === 'right' && <ChevronRight className="w-4 h-4 text-white/30 -ml-1 z-10 shrink-0" />}
    </motion.div>
  );
};

/* ── continuous pulse wrapper ─────────────────────────────────────── */
const PulseSequence = ({ children, index }: { children: React.ReactNode, index: number }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-5% 0px' });
  
  return (
    <motion.div
      ref={ref}
      animate={inView ? { scale: [1, 1.025, 1, 1] } : { scale: 1 }}
      transition={{
        duration: 4,
        repeat: Infinity,
        delay: index * 0.5 + 2, // wait for entry animations to finish
        times: [0, 0.05, 0.15, 1], // quick pop up, ease down, then wait
        ease: "easeInOut"
      }}
      className="w-full h-full"
    >
      {children}
    </motion.div>
  );
};

/* ── main component ───────────────────────────────────────────────── */
import { AnimatedHeadline } from '../ui/AnimatedHeadline';

export default function BastionHowItWorks() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-5% 0px' });

  return (
    <section ref={sectionRef} className="bg-transparent text-white py-24 md:py-32 overflow-hidden selection:bg-white/20">
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* ── Header ────────────────────────────────────────────── */}
        <motion.div className="mb-16 md:mb-20 text-center" {...fadeUp(0)} animate={isInView ? fadeUp(0).animate : fadeUp(0).initial}>
          <AnimatedHeadline
            text="HOW BASTION WORKS"
            as="h2"
            className="text-3xl md:text-5xl lg:text-5xl font-manrope font-light leading-tight text-white mb-4 tracking-tight uppercase"
          />
          <p className="text-sm md:text-sm text-white/50 font-manrope font-light tracking-widest uppercase">
            ADAPTIVE DEFENSE THAT EVOLVES WITH EVERY INTERACTION.
          </p>
        </motion.div>

        {/* ── Internet Top Center ───────────────────────────────── */}
        <div className="flex justify-center mb-8">
          <motion.div className="flex flex-col items-center" {...fadeUp(0.1)} animate={isInView ? fadeUp(0.1).animate : fadeUp(0.1).initial}>
            <div className="flex items-center gap-2 text-white/50 mb-2">
              <Globe className="w-5 h-5" />
              <span className="text-xs font-mono tracking-widest">INTERNET</span>
            </div>
            <FlowArrow delay={0.2} height={16} />
            <div className="border border-white/20 rounded px-6 py-2 mt-2">
              <span className="text-xs font-mono text-white/80 tracking-widest">INCOMING TRAFFIC</span>
            </div>
            <FlowArrow delay={0.3} height={24} />
          </motion.div>
        </div>

        {/* ── Main 3-column layout ──────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr_260px] gap-8 lg:gap-12 relative">
          
          {/* ─── LEFT COLUMN ────────────────────────────────────── */}
          <div className="space-y-8 flex flex-col justify-between">
            <motion.div className="w-full relative" {...slideLeft(0.3)} animate={isInView ? slideLeft(0.3).animate : slideLeft(0.3).initial}>
              <HorizontalFlow direction="right" delay={0.4} />
              <PulseSequence index={0}>
                <MetallicBorder borderRadius="8px" className="w-full block">
                  <div className="border border-transparent bg-transparent rounded-lg p-5 w-full h-full">
                    <span className="text-[11px] font-mono text-white/40 tracking-widest block mb-4">1. SOURCES</span>
                    <div className="space-y-2">
                      {sources.map((s) => (
                        <div key={s} className="border border-white/10 rounded px-3 py-2 text-[10px] font-mono tracking-wider text-white/70 text-center">
                          {s}
                        </div>
                      ))}
                    </div>
                  </div>
                </MetallicBorder>
              </PulseSequence>
            </motion.div>

            <motion.div className="w-full relative" {...slideLeft(0.4)} animate={isInView ? slideLeft(0.4).animate : slideLeft(0.4).initial}>
              <HorizontalFlow direction="right" delay={0.5} />
              <PulseSequence index={4}>
                <MetallicBorder borderRadius="8px" className="w-full block">
                  <div className="border border-transparent bg-transparent rounded-lg p-5 w-full h-full">
                    <span className="text-[11px] font-mono text-white/40 tracking-widest block mb-4">2. CONTINUOUS BY DESIGN</span>
                    <div className="grid grid-cols-2 gap-2">
                      {continuousItems.map((c) => (
                        <div key={c} className="border border-white/10 rounded px-2 py-3 text-center flex items-center justify-center min-h-[60px]">
                          <span className="text-[9px] font-mono tracking-wider text-white/60 leading-tight">{c}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </MetallicBorder>
              </PulseSequence>
            </motion.div>
          </div>

          {/* ─── CENTER COLUMN (Flow) ───────────────────────────── */}
          <div className="flex flex-col items-center w-full">
            
            {/* Steps 1-3 */}
            {steps1.map((step, i) => (
              <div key={step.num} className="w-full">
                <motion.div {...scaleIn(0.4 + i * 0.1)} animate={isInView ? scaleIn(0.4 + i * 0.1).animate : scaleIn(0.4 + i * 0.1).initial} className="w-full">
                  <PulseSequence index={i}>
                    <MetallicBorder borderRadius="8px" className="w-full block">
                      <div className="w-full border border-transparent rounded-lg p-5 bg-transparent flex items-start gap-4">
                        <step.icon className="w-6 h-6 text-white/50 shrink-0 mt-0.5" strokeWidth={1.5} />
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-white/30 font-mono text-xs">{step.num}</span>
                            <span className="text-white font-mono text-sm tracking-wider">{step.title}</span>
                          </div>
                          <p className="text-[11px] text-white/50 font-light leading-relaxed">{step.desc}</p>
                        </div>
                      </div>
                    </MetallicBorder>
                  </PulseSequence>
                </motion.div>
                <FlowArrow delay={0.5 + i * 0.1} height={20} />
              </div>
            ))}

            {/* Risk Boxes */}
            <motion.div className="w-full" {...scaleIn(0.7)} animate={isInView ? scaleIn(0.7).animate : scaleIn(0.7).initial}>
              <PulseSequence index={3}>
                <div className="grid grid-cols-3 gap-3 w-full">
                  {classifications.map((c) => (
                    <MetallicBorder key={c.label} borderRadius="8px" className="w-full">
                      <div className={`w-full bg-transparent rounded-lg p-4 flex flex-col items-center justify-center text-center gap-3 relative bg-gradient-to-b ${c.gradient} border-t ${c.border}`}>
                        <c.icon className={`w-6 h-6 ${c.color} drop-shadow-[0_0_8px_currentColor]`} strokeWidth={1.5} />
                        <div>
                          <span className={`text-[10px] font-mono font-medium tracking-widest block ${c.color} mb-1 drop-shadow-sm`}>{c.label}</span>
                          <span className={`text-[8px] font-mono opacity-50 block text-white tracking-widest`}>{c.sub}</span>
                        </div>
                      </div>
                    </MetallicBorder>
                  ))}
                </div>
              </PulseSequence>
            </motion.div>
            
            <div className="grid grid-cols-3 w-full gap-3">
              <div className="flex justify-center"><FlowArrow delay={0.8} height={20} /></div>
              <div className="flex justify-center"><FlowArrow delay={0.8} height={20} /></div>
              <div className="flex justify-center"><FlowArrow delay={0.8} height={20} /></div>
            </div>

            {/* Steps 4-6 */}
            {steps2.map((step, i) => (
              <div key={step.num} className="w-full">
                <motion.div {...scaleIn(0.9 + i * 0.1)} animate={isInView ? scaleIn(0.9 + i * 0.1).animate : scaleIn(0.9 + i * 0.1).initial} className="w-full">
                  <PulseSequence index={i + 4}>
                    <MetallicBorder borderRadius="8px" className="w-full block">
                      <div className="w-full border border-transparent rounded-lg p-5 bg-transparent flex items-start gap-4">
                        <step.icon className="w-6 h-6 text-white/50 shrink-0 mt-0.5" strokeWidth={1.5} />
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-white/30 font-mono text-xs">{step.num}</span>
                            <span className="text-white font-mono text-sm tracking-wider">{step.title}</span>
                          </div>
                          <p className="text-[11px] text-white/50 font-light leading-relaxed">{step.desc}</p>
                        </div>
                      </div>
                    </MetallicBorder>
                  </PulseSequence>
                </motion.div>
                {i < 2 && <FlowArrow delay={1.0 + i * 0.1} height={20} />}
              </div>
            ))}
          </div>

          {/* ─── RIGHT COLUMN ───────────────────────────────────── */}
          <div className="space-y-6 flex flex-col justify-start mt-8 lg:mt-0">
            <motion.div className="w-full relative" {...slideRight(0.3)} animate={isInView ? slideRight(0.3).animate : slideRight(0.3).initial}>
              <HorizontalFlow direction="left" delay={0.4} />
              <PulseSequence index={0}>
                <MetallicBorder borderRadius="8px" className="w-full block">
                  <div className="border border-transparent bg-transparent rounded-lg p-5 w-full">
                    <span className="text-[11px] font-mono text-white/40 tracking-widest block mb-4">1. OPERATIONAL INTELLIGENCE</span>
                    <div className="space-y-1.5">
                      {intelItems.map((item) => (
                        <div key={item} className="flex items-center gap-2 py-1">
                          <span className="w-1 h-1 rounded-full bg-white/20" />
                          <span className="text-[10px] font-mono text-white/60 tracking-wide">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </MetallicBorder>
              </PulseSequence>
            </motion.div>

            {rightCards.map((card, i) => (
              <motion.div key={card.title} className="w-full relative" {...slideRight(0.4 + i * 0.1)} animate={isInView ? slideRight(0.4 + i * 0.1).animate : slideRight(0.4 + i * 0.1).initial}>
                <HorizontalFlow direction="left" delay={0.5 + i * 0.1} />
                <PulseSequence index={i + 4}>
                  <MetallicBorder borderRadius="8px" className="w-full block">
                    <div className="border border-transparent bg-transparent rounded-lg p-4 w-full">
                      <span className="text-[10px] font-mono text-white/80 tracking-widest block mb-2">{i+2}. {card.title}</span>
                      <p className="text-[10px] text-white/40 leading-relaxed">{card.desc}</p>
                    </div>
                  </MetallicBorder>
                </PulseSequence>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Bottom Status Bar ─────────────────────────────────── */}
        <motion.div
          className="mt-20 border-t border-white/10 pt-6 flex flex-wrap items-center justify-between gap-4"
          {...fadeIn(1.2)}
          animate={isInView ? fadeIn(1.2).animate : fadeIn(1.2).initial}
        >
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-white/40">SYSTEM STATUS:</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse ml-1" />
              <span className="text-[10px] font-mono text-emerald-500">OPERATIONAL</span>
            </div>
            <span className="text-[10px] font-mono text-white/30 hidden md:block">BASTION ENGINE v2.0</span>
          </div>

          <div className="flex items-center gap-2 text-white/50">
            <ShieldAlert className="w-4 h-4" />
            <span className="text-[10px] font-mono tracking-widest hidden md:block">BASTION ADAPTIVE ENTERPRISE DEFENSE</span>
          </div>

          <div className="flex items-center gap-6">
            <span className="text-[10px] font-mono text-white/30">SCHEMATIC ID: BSTN-ARCH-001</span>
            <span className="text-[10px] font-mono text-white/30 hidden md:block">DATE: 2024</span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
