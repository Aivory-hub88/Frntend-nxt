'use client';

import { useState, useEffect, useRef } from 'react';

// Product data with simplified context
const showcaseProducts = [
  {
    id: 'diagnostic',
    step: '01. DISCOVER',
    title: 'Deep Diagnostic',
    description:
      'We audit your current operations, constraints, and data accessibility. Rather than offering templates, we map out a customized assessment to establish a realistic readiness baseline before you write code or deploy models.',
    features: ['Operational Gaps Audit', 'Infrastructure Readiness', 'Constraint & Risk Check'],
  },
  {
    id: 'blueprint',
    step: '02. DESIGN',
    title: 'AI System Blueprint',
    description:
      'Aivory maps your diagnostic results into a recommended system architecture. This blueprint defines how data, processing layers, and automation models interface, creating a clear architectural blueprint tailored to your bottlenecks.',
    features: ['Data Pipeline Mapping', 'Integration Layers', 'Orchestration Blueprint'],
  },
  {
    id: 'roadmap',
    step: '03. PLAN',
    title: 'Implementation Roadmap',
    description:
      'A sequenced, phased plan designed to target your high-impact bottlenecks first. We split the implementation into manageable waves, ensuring each deployment phase reaches specific, measurable milestones.',
    features: ['Phased Deployment Waves', 'Milestone Checkpoints', 'Actionable Targets'],
  },
  {
    id: 'console',
    step: '04. CONTROL',
    title: 'AI Console',
    description:
      'A unified strategic interface. Query your systems, review diagnostic assessments, track operational telemetry, and instruct automated agents, keeping you in complete control from start to finish.',
    features: ['Conversational Consultation', 'System Telemetry', 'Agent Dispatch Control'],
  },
  {
    id: 'workflow',
    step: '05. BUILD',
    title: 'Workflow Builder',
    description:
      'Orchestrate operations visually. Link trigger conditions, processing layers, and applications together. The builder maps language commands into executable flows, automating tasks across your software stack.',
    features: ['Visual Flow Canvas', 'Multi-app Connections', 'Natural Language Translation'],
  },
];

const QUESTIONS = [
  { q: 'Define your business goals', a: 'Scale operations without headcount growth.' },
  { q: 'Identify potential risks', a: 'Data privacy compliance, change management.' },
];
const DIMS = [
  { label: 'Strategy', val: 80, delay: 0.2 },
  { label: 'Data Readiness', val: 75, delay: 0.5 },
  { label: 'Process Audit', val: 90, delay: 0.8 },
];

function DiagnosticAnimation() {
  const [phase, setPhase] = useState<'qa' | 'thinking' | 'score'>('qa');
  const [visibleQ, setVisibleQ] = useState(0);
  const [dots, setDots] = useState('');
  const [scoreVal, setScoreVal] = useState(0);
  const [barsVisible, setBarsVisible] = useState(false);
  const timerRefs = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearAll = () => { timerRefs.current.forEach(clearTimeout); timerRefs.current = []; };
  const t = (fn: () => void, s: number) => timerRefs.current.push(setTimeout(fn, s * 1000));

  useEffect(() => {
    const run = () => {
      setPhase('qa'); setVisibleQ(0); setScoreVal(0); setBarsVisible(false);
      QUESTIONS.forEach((_, i) => t(() => setVisibleQ(i + 1), 0.6 + i * 1.5));
      t(() => setPhase('thinking'), 3.6);
      t(() => {
        setPhase('score');
        let v = 0;
        const step = () => { v += 2; setScoreVal(v); if (v < 78) timerRefs.current.push(setTimeout(step, 20)); };
        step();
        timerRefs.current.push(setTimeout(() => setBarsVisible(true), 300));
      }, 5.5);
      t(run, 10.0);
    };
    run();
    return clearAll;
  }, []);

  useEffect(() => {
    if (phase !== 'thinking') return;
    let i = 0;
    const id = setInterval(() => { i = (i + 1) % 4; setDots('.'.repeat(i)); }, 400);
    return () => clearInterval(id);
  }, [phase]);

  return (
    <div className="w-full h-full relative overflow-hidden flex items-center justify-center">
      {/* QA & Thinking */}
      <div className={`absolute inset-0 flex flex-col justify-center p-2 transition-all duration-500 ${phase === 'score' ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'}`}>
        <div className="flex flex-col gap-4 mx-auto w-full max-w-[90%] md:max-w-[70%]">
          {QUESTIONS.slice(0, visibleQ).map((item, i) => (
            <div key={i} className="flex flex-col gap-2 animate-fade-in-up">
              <span className="text-xs text-white/50 font-medium">Q: {item.q}</span>
              <div className="bg-[#1E1E1E] border border-white/5 rounded-lg px-4 py-3 w-fit shadow-md">
                <p className="text-sm text-white/80 font-light">{item.a}</p>
              </div>
            </div>
          ))}
          {phase === 'thinking' && (
            <div className="flex items-center gap-2 mt-4 animate-fade-in-up">
               <span className="text-sm text-[#aec99d] font-medium tracking-wide">Agents Analyzing{dots}</span>
            </div>
          )}
        </div>
      </div>

      {/* Score */}
      <div className={`absolute inset-0 flex flex-col justify-center items-center p-2 transition-all duration-500 delay-200 ${phase === 'score' ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'}`}>
        <div className="relative w-28 h-28 flex items-center justify-center mb-8">
           <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
             <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
             <circle cx="50" cy="50" r="42" fill="none" stroke="#aec99d" strokeWidth="6" strokeDasharray={264} strokeDashoffset={barsVisible ? 264 - (264 * 0.78) : 264} className="transition-all duration-1000 ease-out drop-shadow-[0_0_8px_rgba(174,201,157,0.4)]" />
           </svg>
           <div className="absolute flex flex-col items-center">
             <span className="text-3xl font-light text-white" style={{ fontFamily: "'Doto', 'Courier New', monospace" }}>{scoreVal}</span>
           </div>
        </div>
        <div className="w-full space-y-4 px-6 max-w-[80%] md:max-w-sm">
          {DIMS.map((dim) => (
            <div key={dim.label} className={`text-xs space-y-1.5 transition-all duration-500 ${barsVisible ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDelay: `${dim.delay}s` }}>
              <div className="flex justify-between text-white/70 font-light"><span>{dim.label}</span><span className="text-[#aec99d]">{dim.val}%</span></div>
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden relative">
                <div className="absolute left-0 top-0 h-full bg-[#aec99d] rounded-full transition-all duration-700 ease-out" style={{ width: barsVisible ? `${dim.val}%` : '0%', transitionDelay: `${dim.delay}s` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ConsoleAnimation() {
  return (
    <div className="w-full h-full flex flex-col justify-center p-2 font-light">
      <div className="flex flex-col gap-4 w-full max-w-[100%] mx-auto">
        <div className="flex justify-end opacity-0 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <div className="bg-[#2A2A2A] border border-white/5 rounded-2xl rounded-tr-sm px-5 py-4 text-white/90 text-sm shadow-md max-w-[100%]">
            Can you analyze my current lead generation process?
          </div>
        </div>
        
        <div className="flex flex-col gap-4 mt-2">
          {/* Header: Circles + Text */}
          <div className="flex items-center gap-3 opacity-0 animate-fade-in-up" style={{ animationDelay: '1.2s' }}>
            <div className="flex -space-x-2">
              <div className="w-6 h-6 rounded-full bg-[#556B2F] border-2 border-[#181818] relative z-30" />
              <div className="w-6 h-6 rounded-full bg-[#6B8E23] border-2 border-[#181818] relative z-20" />
              <div className="w-6 h-6 rounded-full bg-[#9ACD32] border-2 border-[#181818] relative z-10" />
            </div>
            <div className="text-white/80 text-sm font-medium flex items-center gap-2">
              Agents analyzing <span className="text-white/40">·</span> <span className="text-[#aec99d] animate-pulse">Processing...</span>
            </div>
          </div>

          {/* Search Results List */}
          <div className="flex flex-col gap-3 pl-2">
            {[
              { source: 'Queried CRM', query: 'lead response time operations data', results: '520 records', delay: '2.0s' },
              { source: 'Analyzed Logs', query: 'email triage flow delay analysis', results: '12 bottlenecks', delay: '2.8s' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col gap-1 opacity-0 animate-fade-in-up" style={{ animationDelay: item.delay }}>
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2 text-xs">
                    <svg className="w-4 h-4 text-[#aec99d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <span className="text-white/70">{item.source}</span>
                  </div>
                  <div className="text-white/40 text-[11px]">
                    <span>{item.results}</span>
                  </div>
                </div>
                <div className="ml-6 font-mono text-[11px] sm:text-xs text-white/60 bg-white/5 w-fit max-w-[calc(100%-1.5rem)] px-3 py-1.5 rounded-md border border-white/5 break-words">
                  {item.query}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full max-w-[100%] mx-auto mt-2 bg-[#1D1D1D] border border-white/5 rounded-full px-5 py-3.5 flex items-center gap-3 shadow-lg opacity-0 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <svg className="w-4 h-4 text-[#aec99d]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" /></svg>
        <div className="text-white/40 text-sm animate-pulse">Waiting for prompt...</div>
      </div>
    </div>
  );
}

export function InteractiveShowcase() {
  const [activeIndex, setActiveIndex] = useState(-1);
  const [alignedIndex, setAlignedIndex] = useState<number | null>(null);
  
  const introRef = useRef<HTMLDivElement | null>(null);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const h4Refs = useRef<(HTMLHeadingElement | null)[]>([]);
  const stickyBoxRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // 1. Intersection Observer for Active Index (content fading)
    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -40% 0px', // Trigger when section is in middle of viewport
      threshold: 0.1,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (entry.target === introRef.current) {
            setActiveIndex(-1);
          } else {
            const index = sectionRefs.current.findIndex((ref) => ref === entry.target);
            if (index !== -1) {
              setActiveIndex(index);
            }
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    if (introRef.current) observer.observe(introRef.current);
    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    // 2. Scroll Listener for precise Alignment (line drawing)
    const handleScroll = () => {
      if (!stickyBoxRef.current) return;
      
      const boxRect = stickyBoxRef.current.getBoundingClientRect();
      const targetY = boxRect.top + 60; 
      let newlyAligned: number | null = null;
      
      h4Refs.current.forEach((ref, idx) => {
        if (!ref) return;
        const rect = ref.getBoundingClientRect();
        const h4CenterY = rect.top + (rect.height / 2);
        
        if (Math.abs(h4CenterY - targetY) < 60) {
          newlyAligned = idx;
        }
      });
      
      setAlignedIndex((prev) => (prev !== newlyAligned ? newlyAligned : prev));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Trigger once on mount
    handleScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section id="showcase" className="relative bg-black text-white py-16 md:py-32 border-b border-white/10">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24">
        {/* Sticky Scroll Layout Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 relative">
          
          {/* Left Column: Scrollable Description Blocks */}
          <div className="lg:col-span-6 flex flex-col gap-[30vh] lg:pb-[20vh]">
            <div ref={introRef} className="lg:min-h-[40vh] flex flex-col justify-center">
              <h2 className="text-[#b2cca2] uppercase tracking-widest text-xs font-semibold mb-3">
                Operational Framework
              </h2>
              <h3 className="text-4xl md:text-5xl font-light tracking-tight mb-6 leading-tight">
                From Assessment<br />to Staged Autonomy
              </h3>
              <p className="text-white/60 max-w-lg font-light leading-relaxed">
                We take you step-by-step from auditing bottlenecks to running customized, automated system workflows. Explore the core product layers.
              </p>
            </div>

            {showcaseProducts.map((product, idx) => (
              <div
                key={product.id}
                ref={(el) => {
                  sectionRefs.current[idx] = el;
                }}
                className={`flex flex-col justify-center min-h-[50vh] transition-all duration-500 ${
                  activeIndex === idx ? 'opacity-100 scale-100' : 'opacity-30 scale-95 lg:opacity-20'
                }`}
              >
                <span className="text-[#b2cca2] text-[15px] font-medium tracking-[0.2em] mb-4 uppercase" style={{ fontFamily: "'Doto', 'Courier New', monospace" }}>
                  {product.step}
                </span>
                <div className="flex items-center mb-6 relative w-full lg:w-[calc(100%+6rem)] z-10">
                  <h4 
                    ref={(el) => {
                      h4Refs.current[idx] = el;
                    }}
                    className="text-3xl font-light text-white shrink-0 pr-8"
                  >
                    {product.title}
                  </h4>
                  
                  {/* Animated Connecting Line to Right Visual Box */}
                  <div 
                    className={`hidden lg:block h-[1px] bg-[#b2cca2]/50 flex-grow transition-all duration-500 ease-out origin-left ${
                      alignedIndex === idx ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'
                    }`}
                  />
                </div>
                <p className="text-white/70 text-base font-light mb-8 leading-relaxed max-w-lg">
                  {product.description}
                </p>
                <ul className="space-y-3.5">
                  {product.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-center gap-3 text-sm font-light text-white/90">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#939393]" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Right Column: Sticky Mockup Visualizer Area */}
          <div className="lg:col-span-6 lg:sticky lg:top-[12vh] flex items-center justify-center z-20 mx-auto w-full max-w-[720px] aspect-[4/3]">
            <div 
              ref={stickyBoxRef}
              className={`w-full h-full bg-[#181818] border transition-all duration-500 rounded-3xl p-6 md:p-8 flex flex-col relative overflow-hidden shadow-2xl ${
                alignedIndex !== null ? 'border-[#b2cca2]/40 shadow-[0_0_30px_rgba(178,204,162,0.08)]' : 'border-white/5'
              }`}
            >
              
              {/* Showcase Screen Layers */}
              <div className="flex-1 relative w-full h-full">
                
                {/* Intro Visualizer */}
                <div
                  className={`absolute inset-0 flex flex-col justify-center items-center transition-all duration-700 ease-in-out ${
                    activeIndex === -1 ? 'opacity-100 pointer-events-auto z-10' : 'opacity-0 pointer-events-none'
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <span 
                      className="text-[#b2cca2] font-semibold text-lg md:text-xl uppercase tracking-wider text-center animate-pulse" 
                      style={{ fontFamily: "'Doto', 'Courier New', monospace" }}
                    >
                      YOUR AI TRANSFORMATION START HERE
                    </span>
                    <div className="mt-8 animate-bounce">
                      <div className="text-[#b2cca2] font-semibold text-3xl tracking-widest rotate-90">
                        &gt;&gt;&gt;
                      </div>
                    </div>
                  </div>
                </div>

                {/* 01. Diagnostic Visualizer */}
                <div
                  className={`absolute inset-0 flex flex-col justify-between transition-all duration-500 ease-in-out ${
                    activeIndex === 0 ? 'opacity-100 pointer-events-auto z-10' : 'opacity-0 pointer-events-none'
                  }`}
                >
                  <div key={`diag-${activeIndex === 0 ? 'active' : 'inactive'}`} className="flex-1 relative w-full h-full">
                    {activeIndex === 0 && <DiagnosticAnimation />}
                  </div>
                  <div className="text-[10px] text-white/30 text-center uppercase tracking-widest mt-6 pb-6 font-light">
                    * Interactive assessment evaluating operational constraints.
                  </div>
                </div>

                {/* 02. Blueprint Visualizer */}
                <div
                  className={`absolute inset-0 flex flex-col justify-between transition-all duration-500 ease-in-out ${
                    activeIndex === 1 ? 'opacity-100 pointer-events-auto z-10' : 'opacity-0 pointer-events-none'
                  }`}
                >
                  <div key={`blue-${activeIndex === 1 ? 'active' : 'inactive'}`} className="flex-1 flex flex-col justify-center items-center w-full h-full opacity-0 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    <div className="w-full bg-[#111111] border border-white/5 rounded-2xl p-8 relative shadow-lg">
                      <div className="text-[10px] text-white/40 uppercase tracking-widest text-center font-light mb-10 opacity-0 animate-fade-in" style={{ animationDelay: '0.6s', fontFamily: "'Doto', 'Courier New', monospace" }}>
                        System Architecture Pipeline
                      </div>
                      
                      {/* Visual pipeline stages */}
                      <div className="flex justify-between items-center relative w-full px-4 mt-8 opacity-0 animate-fade-in" style={{ animationDelay: '1.2s' }}>
                        <div className="absolute top-[16px] left-[15%] right-[15%] h-[1px] bg-white/10 -z-10" />
                        <div className="absolute top-[16px] left-[15%] right-[15%] h-[2px] bg-[#aec99d] -z-10 origin-left opacity-0 animate-scale-x" style={{ animationDelay: '1.8s' }} />
                        
                        {[
                          { name: 'Ingest', active: true, delay: '1.4s' },
                          { name: 'Process', active: true, delay: '2.0s' },
                          { name: 'Engine', active: true, delay: '2.6s', ping: true },
                          { name: 'Action', active: false, delay: '3.2s' },
                        ].map((node, i) => (
                          <div key={node.name} className="flex flex-col items-center gap-3 opacity-0 animate-fade-in-up relative" style={{ animationDelay: node.delay }}>
                            {node.ping && (
                              <>
                                <div className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-[#aec99d] animate-ping opacity-60 z-20" />
                                <div className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-[#aec99d] z-20" />
                              </>
                            )}
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs relative z-10 ${
                              node.active ? 'bg-[#aec99d] text-[#111111] font-bold shadow-[0_0_15px_rgba(174,201,157,0.3)]' : 'bg-[#111111] border border-white/10 text-[#939393]'
                            }`} style={{ fontFamily: "'Doto', 'Courier New', monospace" }}>
                              0{i + 1}
                            </div>
                            <span className="text-[10px] text-white/60 font-medium">{node.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="text-[10px] text-white/30 text-center uppercase tracking-widest mt-6 pb-6 font-light">
                    * Schematic mapping how databases interface with automation layers.
                  </div>
                </div>

                {/* 03. Roadmap Visualizer */}
                <div
                  className={`absolute inset-0 flex flex-col justify-between transition-all duration-500 ease-in-out ${
                    activeIndex === 2 ? 'opacity-100 pointer-events-auto z-10' : 'opacity-0 pointer-events-none'
                  }`}
                >
                  <div key={`road-${activeIndex === 2 ? 'active' : 'inactive'}`} className="flex-1 flex flex-col justify-center space-y-8 w-full h-full opacity-0 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    {/* Top nodes */}
                    <div className="flex items-center justify-between w-full mx-auto relative px-8 opacity-0 animate-fade-in" style={{ animationDelay: '0.6s' }}>
                      <div className="absolute top-1/2 left-12 right-12 h-[1px] bg-white/10 -translate-y-1/2 -z-10" />
                      <div className="absolute top-1/2 left-12 w-[33%] h-[1px] bg-[#aec99d] -translate-y-1/2 -z-10 origin-left opacity-0 animate-scale-x" style={{ animationDelay: '1.2s' }} />

                      {[
                        { num: 'W1', name: 'Setup', active: true, delay: '0.8s' },
                        { num: 'W2', name: 'Automations', active: true, delay: '1.4s' },
                        { num: 'W3', name: 'Scale', active: false, delay: '1.8s' },
                      ].map((wave) => (
                        <div key={wave.name} className="flex flex-col items-center gap-2 opacity-0 animate-fade-in-up" style={{ animationDelay: wave.delay }}>
                          <div className={`w-10 h-10 rounded-full border flex items-center justify-center text-xs ${
                            wave.active ? 'border-[#aec99d] bg-[#aec99d]/10 text-[#aec99d] font-semibold' : 'border-white/10 bg-[#111111] text-white/40'
                          }`} style={{ fontFamily: "'Doto', 'Courier New', monospace" }}>
                            {wave.num}
                          </div>
                          <span className="text-[10px] text-white/50 font-light">{wave.name}</span>
                        </div>
                      ))}
                    </div>

                    {/* Deliverables list */}
                    <div className="bg-[#111111] border border-white/5 rounded-2xl p-6 mx-auto w-full max-w-md space-y-4 shadow-lg opacity-0 animate-fade-in-up" style={{ animationDelay: '2.0s' }}>
                      <div className="text-[10px] text-white/40 uppercase tracking-widest font-light" style={{ fontFamily: "'Doto', 'Courier New', monospace" }}>
                        Wave 1 Milestone Action List
                      </div>
                      <div className="space-y-3">
                        {[
                          { text: 'Finalize Diagnostic Baseline Parameters', done: true, delay: '2.2s' },
                          { text: 'Map Centralized Data Storage Schema', done: true, delay: '2.4s' },
                          { text: 'Establish Slack / Email Communication Links', done: false, delay: '2.6s' },
                        ].map((item, i) => (
                          <div key={i} className="flex items-center gap-4 text-xs text-white/80 font-light opacity-0 animate-fade-in-up" style={{ animationDelay: item.delay }}>
                            <span className={`w-5 h-5 rounded border flex items-center justify-center text-[10px] transition-colors ${
                              item.done ? 'border-[#aec99d] text-[#aec99d] bg-[#aec99d]/10' : 'border-white/10 text-transparent'
                            }`}>
                              ✓
                            </span>
                            <span className={item.done ? 'line-through text-white/40' : ''}>{item.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="text-[10px] text-white/30 text-center uppercase tracking-widest mt-6 pb-6 font-light">
                    * Phased wave system mapping out operational integrations step-by-step.
                  </div>
                </div>

                {/* 04. Conversational Consultation Visualizer */}
                <div
                  className={`absolute inset-0 flex flex-col justify-between transition-all duration-500 ease-in-out ${
                    activeIndex === 3 ? 'opacity-100 pointer-events-auto z-10' : 'opacity-0 pointer-events-none'
                  }`}
                >
                  <div key={`chat-${activeIndex === 3 ? 'active' : 'inactive'}`} className="flex-1 w-full h-full relative">
                    {activeIndex === 3 && <ConsoleAnimation />}
                  </div>
                  <div className="text-[10px] text-white/30 text-center uppercase tracking-widest mt-6 pb-6 font-light">
                    * Conversational interface for strategic operational insights.
                  </div>
                </div>

                {/* 05. Workflow Visualizer */}
                <div
                  className={`absolute inset-0 flex flex-col justify-between transition-all duration-500 ease-in-out ${
                    activeIndex === 4 ? 'opacity-100 pointer-events-auto z-10' : 'opacity-0 pointer-events-none'
                  }`}
                >
                  <div key={`wf-${activeIndex === 4 ? 'active' : 'inactive'}`} className="w-full flex flex-col gap-4 h-full justify-center">
                    {/* Chat Prompt for Workflow */}
                    <div className="bg-[#111111] border border-white/5 rounded-2xl p-4 flex gap-4 items-center shadow-lg opacity-0 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                      <div className="w-9 h-9 rounded-full bg-[#1e1e1e] flex-shrink-0 flex items-center justify-center text-sm font-medium text-white/80 border border-white/5 shadow-sm">U</div>
                      <div className="text-white/90 text-sm flex-1 font-light leading-relaxed">
                        Create an automation workflow to extract email leads and send them to Slack.
                      </div>
                      <div className="w-5 h-5 rounded-full border-2 border-white/10 border-t-[#939393] flex-shrink-0 animate-spin opacity-0" style={{ animation: 'fade-in 0.1s ease-out 0.8s forwards, spin 1s linear infinite, fade-out 0.2s ease-in 2.5s forwards' }} />
                    </div>

                    {/* Generated Flow */}
                    <div className="w-full bg-[#111111] border border-white/5 rounded-2xl p-6 flex flex-col gap-6 relative overflow-hidden shadow-2xl opacity-0 animate-fade-in-up" style={{ animationDelay: '2.5s' }}>
                      <div className="absolute inset-0 bg-[#939393]/5 opacity-0" style={{ animation: 'fade-in 1s ease-out 3s forwards, pulse 3s ease-in-out infinite alternate 4s' }} />
                      <div className="text-[10px] text-white/40 uppercase tracking-widest text-center font-light z-10" style={{ fontFamily: "'Doto', 'Courier New', monospace" }}>
                        Workflow Generated
                      </div>

                      <div className="flex items-center justify-between w-full max-w-sm mx-auto z-10 relative">
                        {/* Connecting Lines */}
                        <div className="absolute top-1/2 left-[15%] right-[15%] h-[1px] bg-white/10 -translate-y-1/2 -z-10" />
                        <div className="absolute top-1/2 left-[15%] right-[50%] h-[1px] bg-white/30 -translate-y-1/2 -z-10 origin-left opacity-0 animate-scale-x" style={{ animationDelay: '3.2s' }} />
                        <div className="absolute top-1/2 left-[50%] right-[15%] h-[1px] bg-white/30 -translate-y-1/2 -z-10 origin-left opacity-0 animate-scale-x" style={{ animationDelay: '4.0s' }} />

                        {/* Node 1: Trigger */}
                        <div className="flex flex-col rounded-lg border border-white/15 shadow-md opacity-0 animate-fade-in-up flex-shrink-0 bg-[#333333] min-w-[90px]" style={{ animationDelay: '2.8s' }}>
                          <div className="px-2 py-1.5 text-center">
                            <span className="text-[9px] text-white/70 uppercase tracking-widest font-medium">Trigger</span>
                          </div>
                          <div className="bg-[#aec99d] px-2 py-3 text-center rounded-b-lg flex flex-col items-center justify-center gap-1.5">
                            <img src="/integrations/icons/gmail.svg" alt="Gmail" className="w-5 h-5 drop-shadow-sm" />
                            <span className="text-xs font-semibold text-[#111111]">Gmail</span>
                          </div>
                        </div>
                        
                        {/* Node 2: Agent */}
                        <div className="flex flex-col rounded-lg border border-white/25 shadow-md relative opacity-0 animate-fade-in-up flex-shrink-0 bg-[#333333] min-w-[90px]" style={{ animationDelay: '3.6s' }}>
                          <div className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-[#939393] animate-ping opacity-60 z-20" />
                          <div className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-[#939393] z-20" />
                          <div className="px-2 py-1.5 text-center">
                            <span className="text-[9px] text-[#939393] uppercase tracking-widest font-medium">AI Agent</span>
                          </div>
                          <div className="bg-[#111] px-2 py-3 text-center rounded-b-lg border-t border-[#939393]/30">
                            <span className="text-xs font-semibold text-[#939393]">Extract</span>
                          </div>
                        </div>

                        {/* Node 3: Action */}
                        <div className="flex flex-col rounded-lg border border-white/15 shadow-md opacity-0 animate-fade-in-up flex-shrink-0 bg-[#333333] min-w-[90px]" style={{ animationDelay: '4.4s' }}>
                          <div className="px-2 py-1.5 text-center">
                            <span className="text-[9px] text-white/70 uppercase tracking-widest font-medium">Action</span>
                          </div>
                          <div className="bg-[#aec99d] px-2 py-3 text-center rounded-b-lg flex flex-col items-center justify-center gap-1.5">
                            <img src="/integrations/icons/slack.svg" alt="Slack" className="w-5 h-5 drop-shadow-sm" />
                            <span className="text-xs font-semibold text-[#111111]">Slack</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-[10px] text-white/30 text-center uppercase tracking-widest mt-6 pb-6 font-light">
                    * Natural language command translated into execution nodes.
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
