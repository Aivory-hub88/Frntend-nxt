'use client';

import { useState, useEffect, useRef, MouseEvent } from 'react';

// Product context text
const showcaseProducts = [
  {
    step: '01. DISCOVER', title: 'Deep Diagnostic',
    description: 'We audit your current operations, constraints, and data accessibility. We map out a customized assessment to establish a realistic readiness baseline.',
  },
  {
    step: '02. DESIGN', title: 'AI System Blueprint',
    description: 'Aivory maps your diagnostic results into a recommended system architecture, defining how data, processing layers, and automation models interface.',
  },
  {
    step: '03. PLAN', title: 'Implementation Roadmap',
    description: 'A sequenced, phased plan designed to target your high-impact bottlenecks first. We split the implementation into manageable deployment waves.',
  },
  {
    step: '04. CONTROL', title: 'AI Console',
    description: 'A unified strategic interface. Query your systems, review diagnostic assessments, track operational telemetry, and instruct automated agents.',
  },
  {
    step: '05. BUILD', title: 'Workflow Builder',
    description: 'Orchestrate operations visually. Link trigger conditions, processing layers, and applications. The builder maps commands into executable flows.',
  },
];

// Spotlight Card
function SpotlightCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty('--mouse-x', `${x}px`);
    cardRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={`spotlight-card rounded-2xl border border-white/5 bg-zinc-950/65 shadow-lg flex flex-col p-6 ${className}`}
    >
      {children}
    </div>
  );
}

// ── 01. Diagnostic ──
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
        <div className="flex flex-col gap-3">
          {QUESTIONS.slice(0, visibleQ).map((item, i) => (
            <div key={i} className="flex flex-col gap-1 animate-fade-in-up">
              <span className="text-[10px] text-white/50">Q: {item.q}</span>
              <div className="bg-[#1E1E1E] border border-white/5 rounded-md px-2 py-1.5 w-fit max-w-[90%]">
                <p className="text-[10px] text-white/80">{item.a}</p>
              </div>
            </div>
          ))}
          {phase === 'thinking' && (
            <div className="flex items-center gap-2 mt-2 animate-fade-in-up">
               <span className="text-[10px] text-[#aec99d]">Analyzing{dots}</span>
            </div>
          )}
        </div>
      </div>

      {/* Score */}
      <div className={`absolute inset-0 flex flex-col justify-center items-center p-2 transition-all duration-500 delay-200 ${phase === 'score' ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'}`}>
        <div className="relative w-16 h-16 flex items-center justify-center mb-4">
           <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
             <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
             <circle cx="50" cy="50" r="42" fill="none" stroke="#aec99d" strokeWidth="8" strokeDasharray={264} strokeDashoffset={barsVisible ? 264 - (264 * 0.78) : 264} className="transition-all duration-1000 ease-out" />
           </svg>
           <div className="absolute flex flex-col items-center">
             <span className="text-xl font-light text-white" style={{ fontFamily: "'Doto', 'Courier New', monospace" }}>{scoreVal}</span>
           </div>
        </div>
        <div className="w-full space-y-2.5 px-4">
          {DIMS.map((dim) => (
            <div key={dim.label} className={`text-[9px] space-y-1 transition-all duration-500 ${barsVisible ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDelay: `${dim.delay}s` }}>
              <div className="flex justify-between text-white/70"><span>{dim.label}</span><span className="text-[#aec99d]">{dim.val}%</span></div>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden relative">
                <div className="absolute left-0 top-0 h-full bg-[#aec99d] rounded-full transition-all duration-700 ease-out" style={{ width: barsVisible ? `${dim.val}%` : '0%', transitionDelay: `${dim.delay}s` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── 02. Blueprint ──
function BlueprintAnimation() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-2">
      <div className="text-[9px] text-[#aec99d] uppercase tracking-widest font-light mb-6 text-center w-full">Architecture Pipeline</div>
      <div className="flex justify-between items-center relative w-full px-2 mt-2">
        <div className="absolute top-[16px] left-[15%] right-[15%] h-[1px] bg-white/10 -z-10" />
        <div className="absolute top-[16px] left-[15%] right-[15%] h-[1px] bg-[#aec99d]/50 -z-10 overflow-hidden">
          <div className="h-full w-16 bg-[#aec99d] animate-[laser-right_3s_ease-in-out_infinite]" />
        </div>
        {[ 'Ingest', 'Process', 'Engine', 'Action' ].map((node, i) => (
          <div key={node} className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#111] border border-white/10 flex items-center justify-center text-[#939393]">
              <span className="text-[10px]" style={{ fontFamily: "'Doto', 'Courier New', monospace" }}>0{i+1}</span>
            </div>
            <span className="text-[8px] text-white/60 font-medium">{node}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── 03. Roadmap ──
function RoadmapAnimation() {
  return (
    <div className="w-full h-full flex flex-col justify-center gap-6 p-4">
      <div className="flex items-center justify-between w-full relative px-2">
        <div className="absolute top-1/2 left-6 right-6 h-[1px] bg-white/10 -translate-y-1/2 -z-10" />
        <div className="absolute top-1/2 left-6 w-[40%] h-[1px] bg-[#aec99d] -translate-y-1/2 -z-10" />
        {[ { n:'W1', a:true }, { n:'W2', a:true }, { n:'W3', a:false } ].map((w) => (
          <div key={w.n} className={`w-8 h-8 rounded-full border flex items-center justify-center text-[10px] ${w.a ? 'border-[#aec99d] bg-[#aec99d]/10 text-[#aec99d]' : 'border-white/10 bg-[#111] text-white/40'}`}>
            {w.n}
          </div>
        ))}
      </div>
      <div className="bg-[#181818] border border-white/5 rounded-lg p-3 w-full">
        <div className="text-[8px] text-white/40 uppercase mb-2">Milestones</div>
        <div className="space-y-2">
          {[ { t:'Diagnostic Baseline', d:true }, { t:'Data Storage Schema', d:true }, { t:'App Links', d:false } ].map((m, i) => (
            <div key={i} className="flex items-center gap-2 text-[10px] text-white/70">
              <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center text-[8px] ${m.d ? 'border-[#aec99d] text-[#aec99d]' : 'border-white/10 text-transparent'}`}>✓</span>
              <span className={m.d ? 'line-through text-white/30' : ''}>{m.t}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── 04. Console ──
function ConsoleAnimation() {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="w-full h-full flex flex-col justify-center p-2 font-light">
      {inView && (
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
      )}
    </div>
  );
}

// ── 05. Workflow ──
function WorkflowAnimation() {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="w-full flex flex-col gap-4 h-full justify-center px-4">
      {inView && (
        <>
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

            <div className="flex items-center justify-between w-full mx-auto z-10 relative">
              {/* Connecting Lines */}
              <div className="absolute top-1/2 left-[15%] right-[15%] h-[1px] bg-white/10 -translate-y-1/2 -z-10" />
              <div className="absolute top-1/2 left-[15%] right-[50%] h-[1px] bg-white/30 -translate-y-1/2 -z-10 origin-left opacity-0 animate-scale-x" style={{ animationDelay: '3.2s' }} />
              <div className="absolute top-1/2 left-[50%] right-[15%] h-[1px] bg-white/30 -translate-y-1/2 -z-10 origin-left opacity-0 animate-scale-x" style={{ animationDelay: '4.0s' }} />

              {/* Node 1: Trigger */}
              <div className="flex flex-col rounded-lg border border-white/15 shadow-md opacity-0 animate-fade-in-up flex-shrink-0 bg-[#333333] min-w-[70px] md:min-w-[90px]" style={{ animationDelay: '2.8s' }}>
                <div className="px-2 py-1.5 text-center">
                  <span className="text-[9px] text-white/70 uppercase tracking-widest font-medium">Trigger</span>
                </div>
                <div className="bg-[#aec99d] px-2 py-3 text-center rounded-b-lg flex flex-col items-center justify-center gap-1.5">
                  <img src="/integrations/icons/gmail.svg" alt="Gmail" className="w-5 h-5 drop-shadow-sm" />
                  <span className="text-xs font-semibold text-[#111111]">Gmail</span>
                </div>
              </div>
              
              {/* Node 2: Agent */}
              <div className="flex flex-col rounded-lg border border-white/25 shadow-md relative opacity-0 animate-fade-in-up flex-shrink-0 bg-[#333333] min-w-[70px] md:min-w-[90px]" style={{ animationDelay: '3.6s' }}>
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
              <div className="flex flex-col rounded-lg border border-white/15 shadow-md opacity-0 animate-fade-in-up flex-shrink-0 bg-[#333333] min-w-[70px] md:min-w-[90px]" style={{ animationDelay: '4.4s' }}>
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
        </>
      )}
    </div>
  );
}

// ── Main Layout ──
export function InteractiveGridShowcase() {
  return (
    <section id="framework" className="relative bg-black text-white py-24 md:py-32 border-b border-white/10 overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-[#b2cca2] uppercase tracking-widest text-xs font-semibold mb-3">
            Operational Framework
          </h2>
          <h3 className="text-4xl md:text-5xl font-light tracking-tight mb-6 leading-tight">
            From Assessment <br className="hidden md:block" />to Staged Autonomy
          </h3>
          <p className="text-white/60 font-light leading-relaxed">
            We take you step-by-step from auditing bottlenecks to running customized, automated system workflows. Explore the core product layers.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
          
          {/* Card 1: Diagnostic */}
          <SpotlightCard className="col-span-1 md:col-span-1 lg:col-span-2">
            <div className="relative z-10 mb-4 flex-shrink-0">
              <span className="text-[#b2cca2] text-[13px] font-medium tracking-[0.2em] mb-2 block uppercase" style={{ fontFamily: "'Doto', 'Courier New', monospace" }}>{showcaseProducts[0].step}</span>
              <h4 className="text-xl font-medium text-white mb-2">{showcaseProducts[0].title}</h4>
              <p className="text-white/50 text-[13px] font-light leading-relaxed">{showcaseProducts[0].description}</p>
            </div>
            <div className="relative z-10 flex-1 min-h-[260px] bg-[#0A0A0A] border border-white/5 rounded-xl mt-auto overflow-hidden">
              <DiagnosticAnimation />
            </div>
          </SpotlightCard>

          {/* Card 2: Blueprint */}
          <SpotlightCard className="col-span-1 md:col-span-1 lg:col-span-2">
            <div className="relative z-10 mb-4 flex-shrink-0">
              <span className="text-[#b2cca2] text-[13px] font-medium tracking-[0.2em] mb-2 block uppercase" style={{ fontFamily: "'Doto', 'Courier New', monospace" }}>{showcaseProducts[1].step}</span>
              <h4 className="text-xl font-medium text-white mb-2">{showcaseProducts[1].title}</h4>
              <p className="text-white/50 text-[13px] font-light leading-relaxed">{showcaseProducts[1].description}</p>
            </div>
            <div className="relative z-10 flex-1 min-h-[260px] bg-[#0A0A0A] border border-white/5 rounded-xl mt-auto overflow-hidden">
              <BlueprintAnimation />
            </div>
          </SpotlightCard>

          {/* Card 3: Roadmap */}
          <SpotlightCard className="col-span-1 md:col-span-2 lg:col-span-2">
            <div className="relative z-10 mb-4 flex-shrink-0">
              <span className="text-[#b2cca2] text-[13px] font-medium tracking-[0.2em] mb-2 block uppercase" style={{ fontFamily: "'Doto', 'Courier New', monospace" }}>{showcaseProducts[2].step}</span>
              <h4 className="text-xl font-medium text-white mb-2">{showcaseProducts[2].title}</h4>
              <p className="text-white/50 text-[13px] font-light leading-relaxed">{showcaseProducts[2].description}</p>
            </div>
            <div className="relative z-10 flex-1 min-h-[260px] bg-[#0A0A0A] border border-white/5 rounded-xl mt-auto overflow-hidden">
              <RoadmapAnimation />
            </div>
          </SpotlightCard>

          {/* Card 4: Console */}
          <SpotlightCard className="col-span-1 md:col-span-1 lg:col-span-3">
            <div className="relative z-10 mb-4 flex-shrink-0">
              <span className="text-[#b2cca2] text-[13px] font-medium tracking-[0.2em] mb-2 block uppercase" style={{ fontFamily: "'Doto', 'Courier New', monospace" }}>{showcaseProducts[3].step}</span>
              <h4 className="text-xl font-medium text-white mb-2">{showcaseProducts[3].title}</h4>
              <p className="text-white/50 text-[13px] font-light leading-relaxed max-w-md">{showcaseProducts[3].description}</p>
            </div>
            <div className="relative z-10 flex-1 min-h-[280px] bg-[#0A0A0A] border border-white/5 rounded-xl mt-auto overflow-hidden">
              <ConsoleAnimation />
            </div>
          </SpotlightCard>

          {/* Card 5: Workflow */}
          <SpotlightCard className="col-span-1 md:col-span-1 lg:col-span-3">
            <div className="relative z-10 mb-4 flex-shrink-0">
              <span className="text-[#b2cca2] text-[13px] font-medium tracking-[0.2em] mb-2 block uppercase" style={{ fontFamily: "'Doto', 'Courier New', monospace" }}>{showcaseProducts[4].step}</span>
              <h4 className="text-xl font-medium text-white mb-2">{showcaseProducts[4].title}</h4>
              <p className="text-white/50 text-[13px] font-light leading-relaxed max-w-md">{showcaseProducts[4].description}</p>
            </div>
            <div className="relative z-10 flex-1 min-h-[280px] bg-[#0A0A0A] border border-white/5 rounded-xl mt-auto overflow-hidden">
              <WorkflowAnimation />
            </div>
          </SpotlightCard>

        </div>
      </div>
    </section>
  );
}
