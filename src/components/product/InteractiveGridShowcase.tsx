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
    description: 'Say it, and it builds. Plain language becomes executable automation — no code, no complexity, just intent turned into action across your entire stack.',
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
const DIAGNOSTIC_STEPS = [
  {
    phase: '1/3 Business Objective',
    q: 'What is your primary business objective?',
    options: [
      'Reduce operational costs',
      'Scale without headcount growth',
      'Improve customer experience'
    ]
  },
  {
    phase: '2/3 Data Readiness',
    q: 'How centralized is your data?',
    options: [
      'Fully centralized',
      'Partially centralized',
      'Siloed across departments'
    ]
  },
  {
    phase: '3/3 Risk & Constraints',
    q: 'What is your risk tolerance?',
    options: [
      'High - willing to experiment',
      'Moderate - balanced approach',
      'Low - prefer proven solutions'
    ]
  }
];

const DIMS = [
  { label: 'Strategy', val: 65, delay: 0.2 },
  { label: 'Data Readiness', val: 45, delay: 0.5 },
  { label: 'Process Audit', val: 30, delay: 0.8 },
];

function DiagnosticAnimation() {
  const [phase, setPhase] = useState<'form' | 'thinking' | 'score' | 'improvements'>('form');
  const [stepIdx, setStepIdx] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [dots, setDots] = useState('');
  const [scoreVal, setScoreVal] = useState(0);
  const [barsVisible, setBarsVisible] = useState(false);
  const timerRefs = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearAll = () => { timerRefs.current.forEach(clearTimeout); timerRefs.current = []; };
  const t = (fn: () => void, s: number) => timerRefs.current.push(setTimeout(fn, s * 1000));

  useEffect(() => {
    const run = () => {
      setPhase('form'); 
      setStepIdx(0); 
      setSelectedIdx(null);
      setScoreVal(0); 
      setBarsVisible(false);
      
      // Step 0
      t(() => setSelectedIdx(1), 0.8);
      
      // Step 1
      t(() => { setStepIdx(1); setSelectedIdx(null); }, 1.6);
      t(() => setSelectedIdx(1), 2.4);
      
      // Step 2
      t(() => { setStepIdx(2); setSelectedIdx(null); }, 3.2);
      t(() => setSelectedIdx(1), 4.0);
      
      // Thinking
      t(() => setPhase('thinking'), 4.8);
      
      // Score
      t(() => {
        setPhase('score');
        let v = 0;
        const step = () => { v += 2; setScoreVal(v); if (v < 42) timerRefs.current.push(setTimeout(step, 20)); else setScoreVal(42); };
        step();
        timerRefs.current.push(setTimeout(() => setBarsVisible(true), 300));
      }, 7.0);
      
      // Improvements
      t(() => setPhase('improvements'), 10.5);
      
      t(run, 15.5);
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

  const currentStep = DIAGNOSTIC_STEPS[stepIdx];

  return (
    <div className="w-full flex-1 relative overflow-hidden grid place-items-center p-4">
      {/* Form & Thinking */}
      <div className={`col-start-1 row-start-1 flex flex-col justify-center w-full h-full transition-all duration-500 ${phase === 'score' || phase === 'improvements' ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'}`}>
        
        {phase === 'form' && (
          <div className="flex flex-col gap-3 w-full max-w-[220px] mx-auto animate-fade-in-up">
            <div className="flex items-center justify-between">
               <span className="text-[9px] text-[#aec99d] font-medium tracking-wider uppercase">{currentStep.phase}</span>
            </div>
            <span className="text-[12px] text-white/90 leading-snug">{currentStep.q}</span>
            
            <div className="flex flex-col gap-1.5 mt-1">
              {currentStep.options.map((opt, i) => (
                <div 
                  key={i} 
                  className={`flex items-center gap-2 rounded-md px-2.5 py-2 border transition-all duration-300 ${
                    selectedIdx === i 
                      ? 'bg-[#aec99d]/10 border-[#aec99d]/30' 
                      : 'bg-white/5 border-white/5'
                  }`}
                >
                  <div className={`w-3 h-3 rounded-full border flex items-center justify-center transition-colors shrink-0 ${
                    selectedIdx === i ? 'border-[#aec99d]' : 'border-white/30'
                  }`}>
                    {selectedIdx === i && <div className="w-1.5 h-1.5 bg-[#aec99d] rounded-full" />}
                  </div>
                  <span className={`text-[10px] ${selectedIdx === i ? 'text-[#aec99d]' : 'text-white/60'}`}>
                    {opt}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {phase === 'thinking' && (
          <div className="flex flex-col items-center justify-center gap-3 animate-fade-in-up">
            <div className="flex -space-x-1.5 opacity-80 mb-1">
              <div className="w-4 h-4 rounded-full bg-[#556B2F] border border-[#181818] relative z-30 animate-pulse" style={{ animationDelay: '0ms' }} />
              <div className="w-4 h-4 rounded-full bg-[#6B8E23] border border-[#181818] relative z-20 animate-pulse" style={{ animationDelay: '150ms' }} />
              <div className="w-4 h-4 rounded-full bg-[#9ACD32] border border-[#181818] relative z-10 animate-pulse" style={{ animationDelay: '300ms' }} />
            </div>
            <span className="text-[11px] text-[#aec99d]">Analyzing responses{dots}</span>
          </div>
        )}
      </div>

      {/* Score */}
      <div className={`col-start-1 row-start-1 flex flex-col justify-center items-center p-2 w-full h-full transition-all duration-500 delay-200 ${phase === 'score' ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
        <div className="relative w-16 h-16 flex items-center justify-center mb-4">
           <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
             <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
             <circle cx="50" cy="50" r="42" fill="none" stroke="#aec99d" strokeWidth="8" strokeDasharray={264} strokeDashoffset={barsVisible ? 264 - (264 * 0.42) : 264} className="transition-all duration-1000 ease-out" />
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

      {/* Improvements */}
      <div className={`col-start-1 row-start-1 flex flex-col justify-center items-center p-4 w-full h-full transition-all duration-500 delay-200 ${phase === 'improvements' ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'}`}>
         <div className="w-full max-w-[220px] flex flex-col gap-3">
           <div className="text-center mb-1">
             <span className="text-[10px] text-[#ff7a7a] font-medium tracking-wider uppercase block mb-0.5">Critical Bottlenecks</span>
           </div>
           {[
             { title: 'Manual Data Entry', desc: 'Siloed data causing sync delays' },
             { title: 'Workflow Inefficiency', desc: 'High overhead to scale ops' }
           ].map((item, i) => (
             <div key={i} className="flex gap-2 items-start bg-red-500/5 border border-red-500/10 rounded-md p-2 animate-fade-in-up" style={{ animationDelay: `${i * 0.3}s` }}>
               <div className="w-1.5 h-1.5 mt-1 rounded-full bg-[#ff7a7a] shrink-0 animate-pulse" />
               <div className="flex flex-col">
                 <span className="text-[10px] text-white/90 font-medium">{item.title}</span>
                 <span className="text-[8px] text-white/50">{item.desc}</span>
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
  const [phase, setPhase] = useState<'import' | 'generate' | 'blueprint'>('import');
  const timerRefs = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearAll = () => { timerRefs.current.forEach(clearTimeout); timerRefs.current = []; };
  const t = (fn: () => void, s: number) => timerRefs.current.push(setTimeout(fn, s * 1000));

  useEffect(() => {
    const run = () => {
      setPhase('import');
      t(() => setPhase('generate'), 3.5);
      t(() => setPhase('blueprint'), 7.0);
      t(run, 15.0);
    };
    run();
    return clearAll;
  }, []);

  return (
    <div className="w-full flex-1 relative overflow-hidden grid place-items-center p-4">
      <style>{`
        @keyframes document-drop-suck {
          0% { transform: translateY(-60px) scale(1); opacity: 0; }
          15% { transform: translateY(0) scale(1); opacity: 1; }
          45% { transform: translateY(0) scale(1); opacity: 1; }
          60% { transform: translateY(30px) scale(0); opacity: 0; }
          100% { transform: translateY(30px) scale(0); opacity: 0; }
        }
        @keyframes receiver-scan {
          0%, 45% { border-color: rgba(255,255,255,0.05); transform: scaleY(0.25) scaleX(1); background: transparent; }
          55%, 75% { border-color: rgba(174,201,157,0.8); box-shadow: 0 0 20px rgba(174,201,157,0.5), inset 0 0 10px rgba(174,201,157,0.5); transform: scaleY(0.25) scaleX(1.1); background: rgba(174,201,157,0.1); }
          100% { border-color: rgba(174,201,157,0.3); box-shadow: 0 0 10px rgba(174,201,157,0.2); transform: scaleY(0.25) scaleX(1); background: rgba(174,201,157,0.05); }
        }
        @keyframes receiver-glow {
          0%, 45% { opacity: 0; }
          55%, 75% { opacity: 0.8; }
          100% { opacity: 0.3; }
        }
        @keyframes fade-in-text {
          0%, 65% { opacity: 0; transform: translateY(15px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-pills {
          0%, 80% { opacity: 0; transform: translateY(15px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      
      {/* Import & Generate Phases */}
      <div className={`col-start-1 row-start-1 flex flex-col items-center justify-center transition-all duration-500 w-full h-full ${phase === 'blueprint' ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'}`}>
        
        {phase === 'import' && (
          <div className="flex flex-col items-center justify-start w-full pt-2">
            
            <div className="flex flex-col items-center animate-[document-drop-suck_3s_ease-in-out_forwards] z-10 relative">
               <div className="mb-2 text-[#aec99d] bg-[#111111] p-2.5 rounded-lg border border-[#aec99d]/30 shadow-[0_0_15px_rgba(174,201,157,0.15)]">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
               </div>
               <span className="text-[11px] text-[#aec99d] uppercase tracking-widest font-medium px-3 py-1 bg-[#111111] rounded shadow-sm">Deep Diagnostic Results</span>
            </div>
            
            <div className="relative w-full flex items-center justify-center z-0 h-0">
               <div className="absolute top-[-60px] w-32 h-32 rounded-full border border-white/10 animate-[receiver-scan_3s_ease-in-out_forwards] flex items-center justify-center pointer-events-none">
                  <div className="w-16 h-16 bg-[#aec99d] rounded-full blur-xl opacity-0 animate-[receiver-glow_3s_ease-in-out_forwards]" />
               </div>
            </div>

            <div className="flex flex-col items-center gap-3 z-10 relative mt-6 w-full">
              <span className="text-[10px] text-white/50 bg-[#111111]/80 px-3 py-1 rounded-full backdrop-blur-sm opacity-0 animate-[fade-in-text_3s_ease-out_forwards]">Engine processing from deep diagnostic result</span>
              <div className="flex flex-wrap justify-center gap-3 max-w-[240px] opacity-0 animate-[fade-in-pills_3s_ease-out_forwards]">
                <div className="bg-white/5 border border-white/10 rounded px-3 py-1.5 text-[10px] text-white/80 whitespace-nowrap">Goal: Scale Ops</div>
                <div className="bg-white/5 border border-white/10 rounded px-3 py-1.5 text-[10px] text-white/80 whitespace-nowrap">Data: Partially Centralized</div>
                <div className="bg-[#aec99d]/10 border border-[#aec99d]/30 rounded px-3 py-1.5 text-[10px] text-[#aec99d] shadow-[0_0_15px_rgba(174,201,157,0.15)] font-medium whitespace-nowrap">Score: 42%</div>
              </div>
            </div>
          </div>
        )}

        {phase === 'generate' && (
          <div className="flex flex-col items-center justify-center gap-4 animate-fade-in-up mt-2">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <div className="absolute inset-0 border-2 border-[#aec99d] rounded-full animate-ping opacity-20" />
              <div className="w-10 h-10 bg-[#aec99d]/10 border border-[#aec99d]/50 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-[#aec99d]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
              </div>
            </div>
            <span className="text-[11px] text-[#aec99d] animate-pulse uppercase tracking-widest font-medium">Brewing Blueprint</span>
          </div>
        )}
      </div>

      {/* Blueprint Layout */}
      <div className={`col-start-1 row-start-1 flex flex-col justify-center transition-all duration-500 delay-200 w-full h-full ${phase === 'blueprint' ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'}`}>
        <div className="flex flex-col items-center mb-4">
          <span className="text-[9px] text-[#aec99d] uppercase tracking-widest font-medium mb-0.5">Tailored Blueprint</span>
          <span className="text-xs text-white font-light text-center">Ops Scaling Architecture</span>
        </div>

        {/* Contextual Mapping */}
        <div className="flex flex-col gap-3 w-full max-w-[260px] mx-auto">
           <div className="flex justify-between items-center gap-2 bg-white/5 border border-white/10 rounded-lg p-2.5 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <div className="flex flex-col flex-1">
                 <span className="text-[8px] text-white/50 mb-0.5">Constraint Detected</span>
                 <span className="text-[10px] text-white/90">Partially Centralized Data</span>
              </div>
              <div className="text-[#aec99d] text-[10px] shrink-0">→</div>
              <div className="flex flex-col flex-1 text-right">
                 <span className="text-[8px] text-[#aec99d] mb-0.5">Resolution Layer</span>
                 <span className="text-[10px] text-white/90 font-medium">Autonomous Data Sync</span>
              </div>
           </div>

           <div className="flex justify-between items-center gap-2 bg-white/5 border border-white/10 rounded-lg p-2.5 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <div className="flex flex-col flex-1">
                 <span className="text-[8px] text-white/50 mb-0.5">Objective Targeted</span>
                 <span className="text-[10px] text-white/90">Scale Ops (No Headcount)</span>
              </div>
              <div className="text-[#aec99d] text-[10px] shrink-0">→</div>
              <div className="flex flex-col flex-1 text-right">
                 <span className="text-[8px] text-[#aec99d] mb-0.5">Action Engine</span>
                 <span className="text-[10px] text-white/90 font-medium">Automated Triage Flow</span>
              </div>
           </div>
        </div>
        
        <div className="mt-4 text-center animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
           <span className="text-[7px] sm:text-[8px] text-white/40 uppercase tracking-widest font-medium">Aivory Engine Processing Capacity: 98% Efficiency</span>
        </div>
      </div>
    </div>
  );
}

// ── 03. Roadmap ──
function RoadmapAnimation() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const nextStep = () => setStep(s => (s >= 13 ? 0 : s + 1));
    const delays = [500, 1000, 800, 800, 1200, 1000, 800, 800, 1200, 1000, 800, 800, 2500, 500];
    timer = setTimeout(nextStep, delays[step] || 1000);
    return () => clearTimeout(timer);
  }, [step]);

  const waves = [
    { num: 'W1', name: 'Setup', activeStep: 1 },
    { num: 'W2', name: 'Automations', activeStep: 5 },
    { num: 'W3', name: 'Scale', activeStep: 9 },
  ];

  const waveData = [
    {
      title: 'Wave 1 Milestones',
      tasks: ['Diagnostic Baseline', 'Storage Schema', 'App Links']
    },
    {
      title: 'Wave 2 Milestones',
      tasks: ['Core Agent Logic', 'CRM Integration', 'Sandbox Deploy']
    },
    {
      title: 'Wave 3 Milestones',
      tasks: ['Prod Rollout', 'Monitor Workflows', 'Expand Depts']
    }
  ];

  let currentWaveIdx = 0;
  if (step >= 9) currentWaveIdx = 2;
  else if (step >= 5) currentWaveIdx = 1;
  const currentData = waveData[currentWaveIdx];

  let checkedCount = 0;
  if (step === 2 || step === 6 || step === 10) checkedCount = 1;
  if (step === 3 || step === 7 || step === 11) checkedCount = 2;
  if (step >= 4 && step < 5) checkedCount = 3;
  if (step >= 8 && step < 9) checkedCount = 3;
  if (step >= 12) checkedCount = 3;

  return (
    <div className="w-full h-full flex flex-col justify-center gap-4 p-4">
      <div className="flex items-center justify-between w-full relative px-6">
        <div className="absolute top-1/2 left-[36px] right-[36px] h-[1px] bg-white/10 -translate-y-1/2 -z-10" />
        <div className={`absolute top-1/2 left-[36px] right-1/2 h-[1px] bg-[#aec99d] -translate-y-1/2 -z-10 origin-left transition-all duration-700 ${step >= 5 ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'}`} />
        <div className={`absolute top-1/2 left-1/2 right-[36px] h-[1px] bg-[#aec99d] -translate-y-1/2 -z-10 origin-left transition-all duration-700 ${step >= 9 ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'}`} />

        {waves.map((wave) => {
          const isActive = step >= wave.activeStep;
          return (
            <div key={wave.name} className="flex flex-col items-center gap-1 transition-all duration-500">
              <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-[10px] transition-all duration-500 relative z-10 ${isActive ? 'border-[#aec99d] bg-[#111111] text-[#aec99d] font-semibold scale-110 shadow-[0_0_10px_rgba(174,201,157,0.3)]' : 'border-white/10 bg-[#111111] text-white/40 scale-100'}`} style={{ fontFamily: "'Doto', 'Courier New', monospace" }}>
                {wave.num}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="bg-[#111111] border border-white/5 rounded-xl p-4 mx-auto w-full max-w-[90%] space-y-3 shadow-lg transition-all duration-500">
        <div className="text-[9px] text-[#c4c9b8] uppercase tracking-[0.15em] font-medium font-manrope">
          {currentData.title}
        </div>
        <div className="flex flex-col gap-2">
          {currentData.tasks.map((task, idx) => {
            const isChecked = idx < checkedCount;
            return (
              <div key={idx} className="flex items-center gap-2.5 transition-all duration-300">
                <div className={`w-3.5 h-3.5 rounded flex items-center justify-center shrink-0 border transition-colors duration-300 ${isChecked ? 'bg-[#aec99d]/20 border-[#aec99d] text-[#aec99d]' : 'border-white/10 text-transparent'}`}>
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <span className={`text-[10px] transition-all duration-300 font-light ${isChecked ? 'text-white/30 line-through' : 'text-white/80'}`}>
                  {task}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── 04. Console ──
function ConsoleAnimation() {
  const [phase, setPhase] = useState<
    'typing' | 'sent' | 'ai_typing' | 'ai_confirm' | 'user_typing_yes' | 'user_yes' | 'thinking' | 'response'
  >('typing');
  const [typedText, setTypedText] = useState('');
  const [typedYes, setTypedYes] = useState('');
  const [dots, setDots] = useState('');
  const timerRefs = useRef<ReturnType<typeof setTimeout>[]>([]);

  const fullText = "Can you analyze my current lead generation process?";
  const yesText = "Run a full end-to-end audit please.";

  const clearAll = () => { timerRefs.current.forEach(clearTimeout); timerRefs.current = []; };
  const t = (fn: () => void, s: number) => timerRefs.current.push(setTimeout(fn, s * 1000));

  useEffect(() => {
    const run = () => {
      setPhase('typing');
      setTypedText('');
      setTypedYes('');
      let currentText = '';
      const typeChar = (i: number) => {
        if (i < fullText.length) {
          currentText += fullText[i];
          setTypedText(currentText);
          timerRefs.current.push(setTimeout(() => typeChar(i + 1), 30));
        } else {
          t(() => setPhase('sent'), 0.4);
          t(() => setPhase('ai_typing'), 0.8);
          t(() => setPhase('ai_confirm'), 2.0);
          
          let currentYes = '';
          const typeYes = (j: number) => {
            if (j < yesText.length) {
              currentYes += yesText[j];
              setTypedYes(currentYes);
              timerRefs.current.push(setTimeout(() => typeYes(j + 1), 40));
            } else {
              t(() => setPhase('user_yes'), 0.4);
              t(() => setPhase('thinking'), 0.8);
              t(() => setPhase('response'), 2.8);
              t(run, 14.0);
            }
          };
          
          t(() => { setPhase('user_typing_yes'); typeYes(0); }, 4.0);
        }
      };
      t(() => typeChar(0), 0.5);
    };
    run();
    return clearAll;
  }, []);

  useEffect(() => {
    if (phase !== 'thinking' && phase !== 'ai_typing') return;
    let i = 0;
    const id = setInterval(() => { i = (i + 1) % 4; setDots('.'.repeat(i)); }, 400);
    return () => clearInterval(id);
  }, [phase]);

  return (
    <div className="w-full h-full flex flex-col justify-end px-6 pb-8 pt-4 font-light relative">
      <div className="flex flex-col gap-3 w-full max-w-[100%] mx-auto mb-2">
        {/* User Message 1 */}
        <div className={`flex justify-end transition-all duration-300 ease-out ${phase !== 'typing' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="bg-[#2A2A2A] rounded-2xl rounded-tr-sm px-4 py-2 text-white/90 text-[12px] max-w-[90%] shadow-md">
            {fullText}
          </div>
        </div>

        {/* AI Typing Indicator */}
        <div className={`flex items-center gap-2 transition-all duration-300 ease-out ${phase === 'ai_typing' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 hidden'}`}>
           <div className="bg-[#111111] border border-white/5 rounded-2xl rounded-tl-sm px-4 py-3 text-white/50 text-[12px] shadow-sm flex items-center gap-1">
             <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
             <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
             <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
           </div>
        </div>

        {/* AI Confirmation */}
        <div className={`flex justify-start transition-all duration-300 ease-out ${['ai_confirm', 'user_typing_yes', 'user_yes', 'thinking', 'response'].includes(phase) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 hidden'}`}>
           <div className="bg-[#111111] border border-white/5 rounded-2xl rounded-tl-sm px-4 py-2 sm:px-4 sm:py-2.5 text-white/80 text-[12px] max-w-[90%] leading-relaxed shadow-md">
             Sure. Should I focus on a specific pipeline, or run a comprehensive end-to-end audit?
           </div>
        </div>

        {/* User Message 2 (Yes) */}
        <div className={`flex justify-end transition-all duration-300 ease-out ${['user_yes', 'thinking', 'response'].includes(phase) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 hidden'}`}>
           <div className="bg-[#2A2A2A] rounded-2xl rounded-tr-sm px-4 py-2 text-white/90 text-[12px] max-w-[90%] shadow-md">
             {yesText}
           </div>
        </div>
        
        {/* AI Thinking & Response */}
        <div className={`flex flex-col gap-3 transition-all duration-300 ${phase === 'thinking' || phase === 'response' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 hidden'}`}>
          {phase === 'thinking' && (
            <div className="flex items-center gap-2 mt-1">
              <div className="flex -space-x-1.5 opacity-80">
                <div className="w-3.5 h-3.5 rounded-full bg-[#556B2F] border border-[#181818] relative z-30" />
                <div className="w-3.5 h-3.5 rounded-full bg-[#6B8E23] border border-[#181818] relative z-20" />
                <div className="w-3.5 h-3.5 rounded-full bg-[#9ACD32] border border-[#181818] relative z-10" />
              </div>
              <div className="text-white/50 text-[11px] font-medium">Analyzing systems{dots}</div>
            </div>
          )}

          {phase === 'response' && (
            <div className="flex flex-col gap-2.5 pl-1 animate-fade-in-up mt-1">
              <div className="text-white/90 text-[11px] font-medium">Comprehensive audit complete:</div>
              {[
                { title: 'CRM Sync', desc: '520 leads analyzed. 45 entries delayed by >2hrs.', delay: '0s' },
                { title: 'Triage Flow', desc: '12 bottlenecks detected in manual validation step.', delay: '0.4s' },
                { title: 'Conversion', desc: 'Drop-off rate at stage 3 is 18% higher than benchmark.', delay: '0.8s' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2 opacity-0 animate-fade-in-up" style={{ animationDelay: item.delay }}>
                  <div className="w-1 h-1 rounded-full bg-[#aec99d] mt-1.5 shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-white/80 text-[11px] leading-snug">{item.title}: <span className="text-white/60">{item.desc}</span></span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Chat Input Bar */}
      <div className="w-full bg-[#1A1A1A] rounded-xl border border-white/10 px-4 py-2.5 flex items-center shadow-lg mt-4 z-20 shrink-0">
        <div className="text-white/80 text-[12px] font-light min-h-[18px] flex items-center">
          {phase === 'typing' ? (
            <>
              {typedText}
              <span className="animate-pulse ml-0.5 inline-block w-[2px] h-3.5 bg-[#aec99d] translate-y-px"></span>
            </>
          ) : (
            <span className="text-white/30">Ask Aivory anything...</span>
          )}
        </div>
      </div>
    </div>
  );
}

// ── 05. Workflow ──
function WorkflowAnimation() {
  const [phase, setPhase] = useState<
    'typing' | 'sent' | 'ai_typing' | 'ai_confirm' | 'user_typing_yes' | 'user_yes' | 'generating' | 'generated' | 'buttons'
  >('typing');
  const [typedText, setTypedText] = useState('');
  const [typedYes, setTypedYes] = useState('');
  const [dots, setDots] = useState('');
  const timerRefs = useRef<ReturnType<typeof setTimeout>[]>([]);

  const fullText = "Create workflow to extract email leads and send them to Slack.";
  const yesText = "Yes, please.";

  const clearAll = () => { timerRefs.current.forEach(clearTimeout); timerRefs.current = []; };
  const t = (fn: () => void, s: number) => timerRefs.current.push(setTimeout(fn, s * 1000));

  useEffect(() => {
    const run = () => {
      setPhase('typing');
      setTypedText('');
      setTypedYes('');
      
      let currentText = '';
      const typeChar = (i: number) => {
        if (i < fullText.length) {
          currentText += fullText[i];
          setTypedText(currentText);
          timerRefs.current.push(setTimeout(() => typeChar(i + 1), 30));
        } else {
          t(() => setPhase('sent'), 0.4);
          t(() => setPhase('ai_typing'), 0.8);
          t(() => setPhase('ai_confirm'), 2.0);
          
          let currentYes = '';
          const typeYes = (j: number) => {
            if (j < yesText.length) {
              currentYes += yesText[j];
              setTypedYes(currentYes);
              timerRefs.current.push(setTimeout(() => typeYes(j + 1), 40));
            } else {
              t(() => setPhase('user_yes'), 0.4);
              t(() => setPhase('generating'), 0.8);
              t(() => setPhase('generated'), 2.8);
              t(() => setPhase('buttons'), 3.5);
              t(run, 9.0);
            }
          };
          
          t(() => { setPhase('user_typing_yes'); typeYes(0); }, 3.5);
        }
      };
      t(() => typeChar(0), 0.5);
    };
    run();
    return clearAll;
  }, []);

  useEffect(() => {
    if (phase !== 'generating' && phase !== 'ai_typing') return;
    let i = 0;
    const id = setInterval(() => { i = (i + 1) % 4; setDots('.'.repeat(i)); }, 400);
    return () => clearInterval(id);
  }, [phase]);

  return (
    <div className="w-full flex flex-col gap-4 h-full justify-end relative px-6 pb-8 pt-4 font-light">
      <div className="flex flex-col gap-3 sm:gap-4 w-full max-w-[100%] mx-auto mb-4">
        
        {/* User Message 1 */}
        <div className={`flex justify-end transition-all duration-300 ease-out ${phase !== 'typing' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
           <div className="bg-[#2A2A2A] rounded-3xl rounded-tr-md px-4 py-2 sm:px-5 sm:py-3 text-white/90 text-[12px] sm:text-[14px] max-w-[95%] sm:max-w-[90%] leading-relaxed shadow-md">
             {fullText}
           </div>
        </div>
        
        {/* AI Typing Indicator */}
        <div className={`flex items-center gap-2 transition-all duration-300 ease-out ${phase === 'ai_typing' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 hidden'}`}>
           <div className="bg-[#111111] border border-white/5 rounded-3xl rounded-tl-md px-4 py-3 text-white/50 text-[12px] shadow-sm flex items-center gap-1">
             <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
             <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
             <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
           </div>
        </div>

        {/* AI Confirmation */}
        <div className={`flex justify-start transition-all duration-300 ease-out ${['ai_confirm', 'user_typing_yes', 'user_yes', 'generating', 'generated', 'buttons'].includes(phase) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 hidden'}`}>
           <div className="bg-[#111111] border border-white/5 rounded-3xl rounded-tl-md px-4 py-2 sm:px-5 sm:py-3 text-white/80 text-[12px] sm:text-[14px] max-w-[95%] sm:max-w-[90%] leading-relaxed shadow-md">
             I can help with that. I will configure a <b>Gmail</b> trigger, an AI extractor agent, and a <b>Slack</b> action. Proceed?
           </div>
        </div>

        {/* User Message 2 (Yes) */}
        <div className={`flex justify-end transition-all duration-300 ease-out ${['user_yes', 'generating', 'generated', 'buttons'].includes(phase) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 hidden'}`}>
           <div className="bg-[#2A2A2A] rounded-3xl rounded-tr-md px-4 py-2 sm:px-5 sm:py-3 text-white/90 text-[12px] sm:text-[14px] max-w-[95%] sm:max-w-[90%] leading-relaxed shadow-md">
             {yesText}
           </div>
        </div>

        {/* Generating Indicator */}
        <div className={`flex items-center gap-2.5 transition-all duration-300 ${phase === 'generating' || phase === 'generated' || phase === 'buttons' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 hidden'}`}>
           {phase === 'generating' ? (
             <>
               <div className="w-4 h-4 rounded-full border-2 border-white/10 border-t-[#c1ccc8] animate-spin shrink-0" />
               <span className="text-white/50 text-[12px] sm:text-[13px] font-medium">Aivory is generating workflow<span className="animate-pulse">{dots}</span></span>
             </>
           ) : null}
        </div>

        {/* Generated Flow */}
        {(phase === 'generated' || phase === 'buttons') && (
          <div className="w-full bg-[#111111] border border-white/5 rounded-2xl p-4 sm:p-5 flex flex-col gap-4 sm:gap-5 relative overflow-hidden shadow-2xl animate-fade-in-up">
            <div className="text-[9px] sm:text-[10px] text-white uppercase tracking-widest text-center font-light z-10" style={{ fontFamily: "'Doto', 'Courier New', monospace" }}>
              Workflow Generated
            </div>

            <div className="flex items-center justify-between w-full max-w-[320px] mx-auto z-10 relative">
              {/* Connecting Lines */}
              <div className="absolute top-1/2 left-[15%] right-[15%] h-[1px] bg-white/10 -translate-y-1/2 -z-10" />
              <div className="absolute top-1/2 left-[15%] right-[50%] h-[1px] bg-[#c1ccc8] -translate-y-1/2 -z-10 origin-left animate-scale-x" />
              <div className="absolute top-1/2 left-[50%] right-[15%] h-[1px] bg-[#c1ccc8] -translate-y-1/2 -z-10 origin-left animate-scale-x" style={{ animationDelay: '0.4s' }} />

              {/* Node 1: Trigger */}
              <div className="flex flex-col rounded-[12px] sm:rounded-[14px] border border-white/10 shadow-lg flex-shrink-0 w-[70px] sm:w-[90px] h-[70px] sm:h-[85px] overflow-hidden bg-[#2A2A2A] relative z-10">
                <div className="h-[24px] sm:h-[28px] flex items-center justify-center bg-[#2A2A2A] border-b border-[#111]/50">
                  <span className="text-[7px] sm:text-[8px] text-white/60 uppercase tracking-widest font-medium">Trigger</span>
                </div>
                <div className="flex-1 bg-[#c1ccc8] flex flex-col items-center justify-center gap-1.5">
                  <img src="/integrations/icons/gmail.svg" alt="Gmail" className="w-3.5 h-3.5 sm:w-4 sm:h-4 drop-shadow-sm" />
                  <span className="text-[9px] sm:text-[11px] font-semibold text-[#111111]">Gmail</span>
                </div>
              </div>
              
              {/* Node 2: Agent */}
              <div className="relative flex-shrink-0 animate-fade-in-up z-20" style={{ animationDelay: '0.2s' }}>
                <div className="absolute top-[-3px] right-[-3px] w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-white/40 animate-ping z-30" />
                <div className="absolute top-[-3px] right-[-3px] w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-white/60 z-30 border border-[#111]" />
                
                <div className="flex flex-col rounded-[12px] sm:rounded-[14px] border border-white/10 shadow-lg w-[70px] sm:w-[90px] h-[70px] sm:h-[85px] overflow-hidden bg-[#2A2A2A]">
                  <div className="h-[24px] sm:h-[28px] flex items-center justify-center bg-[#2A2A2A] border-b border-[#111]">
                    <span className="text-[7px] sm:text-[8px] text-white/60 uppercase tracking-widest font-medium">AI Agent</span>
                  </div>
                  <div className="flex-1 bg-[#111111] flex flex-col items-center justify-center">
                    <span className="text-[9px] sm:text-[11px] font-medium text-white/60">Extract</span>
                  </div>
                </div>
              </div>

              {/* Node 3: Action */}
              <div className="flex flex-col rounded-[12px] sm:rounded-[14px] border border-white/10 shadow-lg flex-shrink-0 w-[70px] sm:w-[90px] h-[70px] sm:h-[85px] overflow-hidden bg-[#2A2A2A] relative z-10 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                <div className="h-[24px] sm:h-[28px] flex items-center justify-center bg-[#2A2A2A] border-b border-[#111]/50">
                  <span className="text-[7px] sm:text-[8px] text-white/60 uppercase tracking-widest font-medium">Action</span>
                </div>
                <div className="flex-1 bg-[#c1ccc8] flex flex-col items-center justify-center gap-1.5">
                  <img src="/integrations/icons/slack.svg" alt="Slack" className="w-3.5 h-3.5 sm:w-4 sm:h-4 drop-shadow-sm" />
                  <span className="text-[9px] sm:text-[11px] font-semibold text-[#111111]">Slack</span>
                </div>
              </div>
            </div>

            {/* Buttons sequence */}
            {(phase === 'buttons' || phase === 'generated') && (
              <div className={`flex items-center justify-center gap-3 mt-1 opacity-0 ${phase === 'buttons' ? 'animate-fade-in-up opacity-100' : ''}`} style={{ animationFillMode: 'forwards' }}>
                <button className="bg-transparent border border-white/20 hover:bg-white/10 text-white/80 text-[10px] sm:text-xs py-1.5 px-4 sm:px-5 rounded-full transition-colors font-medium">
                  Download JSON
                </button>
                <button className="bg-[#c1ccc8] hover:bg-[#aab5b1] text-black text-[10px] sm:text-xs py-1.5 px-4 sm:px-5 rounded-full transition-colors font-semibold shadow-[0_0_10px_rgba(193,204,200,0.3)]">
                  Deploy to n8n
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Chat Input Bar */}
      <div className="w-full bg-[#1A1A1A] rounded-xl border border-white/10 px-4 py-2.5 flex items-center shadow-lg mt-auto z-20 shrink-0">
        <div className="text-white/80 text-[12px] sm:text-[13px] font-light min-h-[18px] flex items-center">
          {phase === 'typing' ? (
            <>
              {typedText}
              <span className="animate-pulse ml-0.5 inline-block w-[2px] h-3.5 sm:h-4 bg-[#aec99d] translate-y-px"></span>
            </>
          ) : (
            <span className="text-white/30">Ask Aivory anything...</span>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main Layout ──
export function InteractiveGridShowcase() {
  return (
    <section id="framework" className="relative text-white py-24 md:py-32 overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-[#c4c9b8] uppercase tracking-widest text-xs font-manrope font-light mb-3">
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
