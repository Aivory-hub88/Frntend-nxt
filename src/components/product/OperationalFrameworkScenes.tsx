'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

const UI = {
  page: '#353531',
  surface: '#3a3a36',
  surfaceDark: '#282827',
  border: 'rgba(255,255,255,0.07)',
  text: '#f7f7f7',
  muted: '#a1a1aa',
  accent: '#00e59e',
  amber: '#fbbf24',
  red: '#f87171',
};

const panelStyle = {
  background: UI.surface,
  border: `1px solid ${UI.border}`,
  boxShadow: '0 12px 32px rgba(0,0,0,0.2)',
};

const enter = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.32 },
};

function DashboardFrame({
  label,
  meta,
  children,
}: {
  label: string;
  meta?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="absolute inset-0 flex min-h-0 flex-col overflow-hidden text-[#f7f7f7]"
      style={{ background: UI.page, fontFamily: "'Inter Tight', Inter, sans-serif" }}
    >
      <div
        className="flex h-9 shrink-0 items-center justify-between border-b px-3"
        style={{ borderColor: UI.border, background: '#30302d' }}
      >
        <div className="flex items-center gap-2">
          <div className="flex h-5 w-5 items-center justify-center rounded-md bg-[#282827] text-[8px] font-semibold text-[#00e59e]">
            A
          </div>
          <span className="text-[10px] font-medium tracking-wide text-white/85">{label}</span>
        </div>
        <span className="text-[8px] uppercase tracking-[0.12em] text-[#a1a1aa]">{meta || 'Aivory workspace'}</span>
      </div>
      <div className="min-h-0 flex-1 overflow-hidden p-3">{children}</div>
    </div>
  );
}

function MiniSpinner({ label }: { label: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3">
      <div className="relative h-12 w-12">
        <div className="absolute inset-0 rounded-full border border-white/10" />
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#00e59e]"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, ease: 'linear', repeat: Infinity }}
        />
        <div className="absolute inset-[17px] rounded-full bg-[#00e59e] shadow-[0_0_14px_rgba(0,229,158,0.45)]" />
      </div>
      <span className="text-[10px] font-medium tracking-wide text-white/80">{label}</span>
      <div className="h-1 w-28 overflow-hidden rounded-full bg-white/5">
        <motion.div
          className="h-full rounded-full bg-[#00e59e]"
          initial={{ width: '8%' }}
          animate={{ width: '92%' }}
          transition={{ duration: 2, ease: 'easeInOut' }}
        />
      </div>
    </div>
  );
}

const diagnosticTimeline = [
  [1800, 'analyze'],
  [3900, 'result'],
  [9200, 'opportunity'],
] as const;

type DiagnosticPhase = 'capture' | 'analyze' | 'result' | 'opportunity';

export function DiagnosticAnimation() {
  const reduceMotion = useReducedMotion();
  const [phase, setPhase] = useState<DiagnosticPhase>(reduceMotion ? 'result' : 'capture');

  useEffect(() => {
    if (reduceMotion) {
      setPhase('result');
      return;
    }
    let timers: ReturnType<typeof setTimeout>[] = [];
    let cancelled = false;
    const run = () => {
      setPhase('capture');
      diagnosticTimeline.forEach(([delay, next]) => timers.push(setTimeout(() => setPhase(next), delay)));
      timers.push(setTimeout(() => !cancelled && run(), 13500));
    };
    run();
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [reduceMotion]);

  return (
    <DashboardFrame label="Business Assessment" meta="Executive view">
      <AnimatePresence mode="wait">
        {phase === 'capture' && (
          <motion.div key="capture" {...enter} className="flex h-full items-center justify-center">
            <div className="w-full max-w-[330px] rounded-xl p-4" style={panelStyle}>
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="text-[8px] uppercase tracking-[0.14em] text-[#00e59e]">Operations baseline</p>
                  <p className="mt-1 text-[12px] font-medium">How does work move today?</p>
                </div>
                <span className="rounded-full border border-white/10 px-2 py-1 text-[8px] text-[#a1a1aa]">12 / 16</span>
              </div>
              <div className="mb-4 h-1 overflow-hidden rounded-full bg-white/5">
                <motion.div className="h-full bg-[#00e59e]" initial={{ width: '48%' }} animate={{ width: '75%' }} transition={{ duration: 1.3 }} />
              </div>
              {['Mostly manual and fragmented', 'Documented across core teams', 'Measured and continuously improved'].map((option, index) => (
                <motion.div
                  key={option}
                  className="mb-2 flex items-center gap-2 rounded-lg border px-3 py-2 text-[9px]"
                  style={{
                    borderColor: index === 1 ? 'rgba(0,229,158,0.45)' : UI.border,
                    background: index === 1 ? 'rgba(0,229,158,0.07)' : '#353531',
                    color: index === 1 ? UI.text : UI.muted,
                  }}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.18 * index }}
                >
                  <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full border" style={{ borderColor: index === 1 ? UI.accent : 'rgba(255,255,255,0.16)' }}>
                    {index === 1 && <span className="h-1.5 w-1.5 rounded-full bg-[#00e59e]" />}
                  </span>
                  {option}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {phase === 'analyze' && (
          <motion.div key="analyze" {...enter} className="h-full">
            <MiniSpinner label="Aivory is scoring operational readiness" />
          </motion.div>
        )}

        {(phase === 'result' || phase === 'opportunity') && (
          <motion.div key="result" {...enter} className="flex h-full min-h-0 flex-col gap-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[8px] uppercase tracking-[0.14em] text-[#a1a1aa]">Executive scorecard</p>
                <p className="text-[12px] font-medium">Operational Readiness</p>
              </div>
              <span className="rounded-full border border-[#fbbf24]/30 bg-[#fbbf24]/10 px-2 py-1 text-[8px] text-[#fbbf24]">Developing</span>
            </div>

            <div className="grid min-h-0 flex-1 grid-cols-[0.92fr_1.35fr] gap-2">
              <div className="flex min-h-0 flex-col items-center justify-center rounded-xl p-2" style={panelStyle}>
                <div className="relative h-[74px] w-[74px]">
                  <svg viewBox="0 0 80 80" className="h-full w-full -rotate-90">
                    <circle cx="40" cy="40" r="31" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
                    <motion.circle
                      cx="40" cy="40" r="31" fill="none" stroke={UI.accent} strokeWidth="6" strokeLinecap="round"
                      strokeDasharray="195" initial={{ strokeDashoffset: 195 }} animate={{ strokeDashoffset: 70 }} transition={{ duration: 1.4, ease: 'easeOut' }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-[20px] font-light">64</span>
                    <span className="text-[7px] text-[#a1a1aa]">/ 100</span>
                  </div>
                </div>
                <div className="mt-1 w-full space-y-1.5 border-t border-white/[0.07] pt-2">
                  <div className="flex items-center justify-between text-[7px]"><span className="text-[#a1a1aa]">Strongest</span><span>Data</span></div>
                  <div className="h-0.5 bg-[#00e59e]" />
                  <div className="flex items-center justify-between text-[7px]"><span className="text-[#a1a1aa]">Weakest</span><span>Process</span></div>
                  <div className="h-0.5 w-2/5 bg-[#f87171]" />
                </div>
              </div>

              <div className="flex min-h-0 flex-col gap-2">
                <div className="flex min-h-0 flex-1 items-center rounded-xl px-2" style={panelStyle}>
                  <svg viewBox="0 0 150 100" className="h-[88px] w-full overflow-visible">
                    {[1, 0.72, 0.44].map((scale) => (
                      <polygon key={scale} points="75,8 137,38 122,91 28,91 13,38" fill="none" stroke="rgba(255,255,255,0.09)" strokeWidth="1" transform={`translate(${75 * (1 - scale)} ${50 * (1 - scale)}) scale(${scale})`} />
                    ))}
                    {[[75,8],[137,38],[122,91],[28,91],[13,38]].map(([x,y]) => <line key={`${x}-${y}`} x1="75" y1="55" x2={x} y2={y} stroke="rgba(255,255,255,0.07)" />)}
                    <motion.polygon
                      points="75,18 120,42 108,78 42,83 31,42"
                      fill="rgba(0,229,158,0.14)" stroke={UI.accent} strokeWidth="1.5"
                      initial={{ opacity: 0, scale: 0.5, transformOrigin: '75px 55px' }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}
                    />
                    {['STRATEGY','DATA','PEOPLE','PROCESS','TECH'].map((label, i) => {
                      const points = [[75,5],[140,36],[126,99],[24,99],[2,36]];
                      return <text key={label} x={points[i][0]} y={points[i][1]} fill="#a1a1aa" fontSize="6" textAnchor={i === 0 ? 'middle' : i === 1 || i === 2 ? 'start' : 'end'}>{label}</text>;
                    })}
                  </svg>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {[['ROI','2.4x'],['Hours saved','38h'],['Payback','7 mo']].map(([label,value], index) => (
                    <motion.div key={label} className="rounded-lg border border-white/[0.07] bg-[#3a3a36] p-2" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 * index }}>
                      <p className="text-[6px] uppercase text-[#a1a1aa]">{label}</p><p className="mt-0.5 text-[10px] font-semibold text-[#00e59e]">{value}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            <motion.div
              className="flex items-center gap-2 rounded-lg border-l-2 bg-[#282827] px-3 py-2"
              style={{ borderLeftColor: phase === 'opportunity' ? UI.accent : UI.amber }}
              animate={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 6 }}
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: phase === 'opportunity' ? UI.accent : UI.amber }} />
              <p className="text-[8px] text-white/80"><strong>{phase === 'opportunity' ? 'Priority opportunity:' : 'Key finding:'}</strong> Automate lead qualification before scaling acquisition.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardFrame>
  );
}

const blueprintTimeline = [
  [2200, 'building'],
  [4800, 'blueprint'],
  [10500, 'ready'],
] as const;
type BlueprintPhase = 'source' | 'building' | 'blueprint' | 'ready';

export function BlueprintAnimation() {
  const reduceMotion = useReducedMotion();
  const [phase, setPhase] = useState<BlueprintPhase>(reduceMotion ? 'blueprint' : 'source');

  useEffect(() => {
    if (reduceMotion) return;
    let timers: ReturnType<typeof setTimeout>[] = [];
    let cancelled = false;
    const run = () => {
      setPhase('source');
      blueprintTimeline.forEach(([delay, next]) => timers.push(setTimeout(() => setPhase(next), delay)));
      timers.push(setTimeout(() => !cancelled && run(), 14200));
    };
    run();
    return () => { cancelled = true; timers.forEach(clearTimeout); };
  }, [reduceMotion]);

  return (
    <DashboardFrame label="Transformation Blueprint" meta="Strategy architecture">
      <AnimatePresence mode="wait">
        {phase === 'source' && (
          <motion.div key="source" {...enter} className="flex h-full items-center justify-center">
            <div className="w-full max-w-[320px] rounded-xl p-4" style={panelStyle}>
              <div className="mb-3 flex items-center justify-between">
                <div><p className="text-[8px] uppercase text-[#a1a1aa]">Assessment input</p><p className="text-[12px]">Operational Readiness</p></div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full border-[4px] border-[#00e59e] text-[14px] font-light">64</div>
              </div>
              {['Centralise customer data', 'Standardise lead handoff', 'Automate qualification'].map((item, index) => (
                <motion.div key={item} className="mb-1.5 flex items-center gap-2 rounded-md bg-[#353531] px-2 py-1.5 text-[8px] text-white/75" initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.18 }}>
                  <span className="h-1.5 w-1.5 rounded-full bg-[#00e59e]" />{item}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {phase === 'building' && (
          <motion.div key="building" {...enter} className="h-full"><MiniSpinner label="Mapping objectives into operating architecture" /></motion.div>
        )}

        {(phase === 'blueprint' || phase === 'ready') && (
          <motion.div key="blueprint" {...enter} className="flex h-full min-h-0 flex-col gap-2">
            <div className="flex items-center justify-between">
              <div><p className="text-[8px] uppercase tracking-[0.14em] text-[#a1a1aa]">AI transformation blueprint</p><p className="text-[12px] font-medium">Lead-to-Revenue Architecture</p></div>
              <div className="flex items-center gap-2">
                <span className="rounded-full border border-[#00e59e]/25 bg-[#00e59e]/10 px-2 py-1 text-[7px] text-[#00e59e]">READY · 64%</span>
              </div>
            </div>

            <div className="rounded-lg px-3 py-2" style={panelStyle}>
              <p className="text-[6px] uppercase tracking-[0.12em] text-[#00e59e]">Strategic objective</p>
              <p className="mt-1 text-[9px] text-white/85">Scale qualified pipeline without increasing operational headcount.</p>
              <div className="mt-2 grid grid-cols-3 gap-3 border-t border-white/[0.07] pt-2">
                {[['Conversion','+18%'],['Cycle time','-32%'],['Manual work','-41%']].map(([label,value]) => <div key={label}><p className="text-[6px] text-[#a1a1aa]">{label}</p><p className="text-[9px] font-medium text-[#f7f7f7]">{value}</p></div>)}
              </div>
            </div>

            <div className="min-h-0 flex-1 rounded-xl p-2.5" style={panelStyle}>
              <div className="mb-2 flex items-center justify-between"><span className="text-[7px] uppercase tracking-[0.12em] text-[#a1a1aa]">Target architecture</span><span className="text-[7px] text-[#00e59e]">4 connected layers</span></div>
              <div className="flex items-center justify-between gap-1">
                {[
                  ['01','Capture','CRM + Forms'],
                  ['02','Enrich','Data layer'],
                  ['03','Decide','AI routing'],
                  ['04','Act','Sales ops'],
                ].map(([num,title,detail], index) => (
                  <div key={title} className="contents">
                    <motion.div className="min-w-0 flex-1 rounded-lg border border-white/[0.07] bg-[#353531] p-2" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.14 }}>
                      <span className="text-[6px] text-[#00e59e]">{num}</span><p className="truncate text-[8px] font-medium">{title}</p><p className="truncate text-[6px] text-[#a1a1aa]">{detail}</p>
                    </motion.div>
                    {index < 3 && <motion.span className="h-px w-2 shrink-0 bg-[#00e59e]" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.3 + index * 0.14 }} />}
                  </div>
                ))}
              </div>
              <div className="mt-2 grid grid-cols-2 gap-1.5">
                {[['Lead Intake Agent','Classify & enrich'],['Revenue Signal Monitor','Detect & escalate']].map(([name,detail]) => (
                  <div key={name} className="flex items-center gap-2 rounded-md border border-white/[0.05] bg-[#282827] px-2 py-1.5"><span className="flex h-4 w-4 items-center justify-center rounded bg-[#00e59e]/10 text-[7px] text-[#00e59e]">AI</span><div><p className="text-[7px]">{name}</p><p className="text-[6px] text-[#a1a1aa]">{detail}</p></div></div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-white/[0.07] bg-[#3a3a36] px-3 py-2">
              <div className="flex items-center justify-between">
                {['Foundation','Pilot','Scale'].map((wave, index) => (
                  <div key={wave} className="flex items-center gap-1.5">
                    <motion.span className="flex h-4 w-4 items-center justify-center rounded-full border text-[6px]" style={{ borderColor: index === 0 || phase === 'ready' ? UI.accent : 'rgba(255,255,255,0.14)', color: index === 0 || phase === 'ready' ? UI.accent : UI.muted }} animate={phase === 'ready' ? { boxShadow: ['0 0 0 rgba(0,229,158,0)','0 0 10px rgba(0,229,158,.35)','0 0 0 rgba(0,229,158,0)'] } : {}} transition={{ duration: 1.5, repeat: Infinity, delay: index * 0.2 }}>{index + 1}</motion.span>
                    <span className="text-[7px] text-white/75">{wave}</span>
                    {index < 2 && <span className="mx-1 h-px w-5 bg-white/10" />}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardFrame>
  );
}

const roadmapPhases = [
  { name: 'Foundation', time: 'Weeks 1–2', milestone: 'Data baseline approved', kpi: '100%' },
  { name: 'Pilot', time: 'Weeks 3–5', milestone: 'Lead routing live', kpi: '-28%' },
  { name: 'Scale', time: 'Weeks 6–8', milestone: 'Sales team onboarded', kpi: '+18%' },
  { name: 'Optimise', time: 'Week 9+', milestone: 'Governance review', kpi: '2.4x' },
];

export function RoadmapAnimation() {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(reduceMotion ? 2 : 0);
  const [checked, setChecked] = useState(reduceMotion ? 3 : 0);

  useEffect(() => {
    if (reduceMotion) return;
    let activeIndex = 0;
    let checkIndex = 0;
    const tick = setInterval(() => {
      checkIndex += 1;
      if (checkIndex > 3) {
        checkIndex = 0;
        activeIndex = (activeIndex + 1) % roadmapPhases.length;
        setActive(activeIndex);
      }
      setChecked(checkIndex);
    }, 1150);
    return () => clearInterval(tick);
  }, [reduceMotion]);

  const current = roadmapPhases[active];
  const milestones = [current.milestone, active === 0 ? 'Ownership assigned' : 'Acceptance criteria met', active < 2 ? 'Risk controls documented' : 'Executive KPI validated'];

  return (
    <DashboardFrame label="Transformation Roadmap" meta="Delivery plan">
      <div className="flex h-full min-h-0 flex-col gap-2">
        <div className="flex items-center justify-between"><div><p className="text-[8px] uppercase tracking-[0.14em] text-[#a1a1aa]">Implementation roadmap</p><p className="text-[12px] font-medium">Lead Operations Transformation</p></div><span className="rounded-full border border-white/10 bg-[#282827] px-2 py-1 text-[7px] text-white/70">9 weeks</span></div>

        <div className="rounded-xl px-3 py-3" style={panelStyle}>
          <div className="relative flex justify-between">
            <div className="absolute left-[7%] right-[7%] top-[11px] h-px bg-white/10" />
            <motion.div className="absolute left-[7%] top-[11px] h-px bg-[#00e59e]" animate={{ width: `${active * 28.5}%` }} transition={{ duration: 0.45 }} />
            {roadmapPhases.map((item, index) => (
              <div key={item.name} className="relative z-10 flex w-1/4 flex-col items-center">
                <motion.div className="flex h-[22px] w-[22px] items-center justify-center rounded-full border bg-[#353531] text-[7px]" animate={{ borderColor: index <= active ? UI.accent : 'rgba(255,255,255,.14)', color: index <= active ? UI.accent : UI.muted, scale: index === active ? 1.12 : 1 }}>{index + 1}</motion.div>
                <p className="mt-1 text-[7px] text-white/80">{item.name}</p><p className="text-[6px] text-[#a1a1aa]">{item.time}</p>
              </div>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={active} {...enter} className="min-h-0 flex-1 overflow-hidden rounded-xl" style={panelStyle}>
            <div className="flex items-center justify-between border-b border-white/[0.07] px-3 py-2">
              <div><p className="text-[7px] uppercase text-[#00e59e]">Phase {active + 1}</p><p className="text-[10px] font-medium">{current.name}</p></div>
              <span className="text-[7px] text-[#a1a1aa]">{checked}/3 complete</span>
            </div>
            <div className="h-0.5 bg-white/5"><motion.div className="h-full bg-[#00e59e]" animate={{ width: `${checked * 33.33}%` }} /></div>
            <div className="grid grid-cols-[1.4fr_.8fr] gap-2 p-3">
              <div>
                <p className="mb-1.5 text-[6px] uppercase tracking-[0.12em] text-[#a1a1aa]">Milestones</p>
                {milestones.map((milestone, index) => (
                  <div key={milestone} className="mb-1.5 flex items-center gap-2 text-[7px] text-white/75">
                    <motion.span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded border text-[8px]" animate={{ background: index < checked ? UI.accent : 'transparent', borderColor: index < checked ? UI.accent : 'rgba(255,255,255,.16)', color: index < checked ? '#20201e' : 'transparent' }}>✓</motion.span>
                    <span className={index < checked ? 'text-white/45 line-through' : ''}>{milestone}</span>
                  </div>
                ))}
                <div className="mt-2 flex flex-wrap gap-1"><span className="rounded-full border border-white/10 bg-[#282827] px-2 py-1 text-[6px] text-white/65">CRM Sync</span><span className="rounded-full border border-white/10 bg-[#282827] px-2 py-1 text-[6px] text-white/65">Lead Agent</span></div>
              </div>
              <div className="grid gap-1.5">
                <div className="rounded-lg border border-white/[0.07] bg-[#353531] p-2"><p className="text-[6px] uppercase text-[#a1a1aa]">Target KPI</p><p className="mt-1 text-[15px] font-light text-[#00e59e]">{current.kpi}</p></div>
                <div className="rounded-lg border border-white/[0.07] bg-[#353531] p-2"><p className="text-[6px] uppercase text-[#a1a1aa]">Status</p><div className="mt-1 flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-[#00e59e]" /><span className="text-[7px]">On track</span></div></div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </DashboardFrame>
  );
}

type ConsolePhase = 'welcome' | 'typing' | 'sent' | 'working' | 'response';

export function ConsoleAnimation() {
  const reduceMotion = useReducedMotion();
  const prompt = 'Review today’s operations and flag anything that needs attention.';
  const [phase, setPhase] = useState<ConsolePhase>(reduceMotion ? 'response' : 'welcome');
  const [typed, setTyped] = useState(reduceMotion ? prompt : '');
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    if (reduceMotion) return;
    let cancelled = false;
    const clear = () => { timers.current.forEach(clearTimeout); timers.current = []; };
    const run = () => {
      clear();
      setPhase('welcome');
      setTyped('');
      timers.current.push(setTimeout(() => setPhase('typing'), 1300));
      prompt.split('').forEach((_, index) => timers.current.push(setTimeout(() => setTyped(prompt.slice(0, index + 1)), 1650 + index * 25)));
      const typedAt = 1650 + prompt.length * 25;
      timers.current.push(setTimeout(() => setPhase('sent'), typedAt + 450));
      timers.current.push(setTimeout(() => setPhase('working'), typedAt + 1250));
      timers.current.push(setTimeout(() => setPhase('response'), typedAt + 3900));
      timers.current.push(setTimeout(() => !cancelled && run(), typedAt + 11500));
    };
    run();
    return () => { cancelled = true; clear(); };
  }, [reduceMotion]);

  const showConversation = ['sent', 'working', 'response'].includes(phase);

  return (
    <DashboardFrame label="Operations Console" meta="Command centre">
      <div className="relative flex h-full min-h-0 flex-col">
        <AnimatePresence mode="wait">
          {!showConversation && (
            <motion.div key="welcome" {...enter} className="flex min-h-0 flex-1 flex-col items-center justify-center pb-14">
              <motion.div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#00e59e]/20 bg-[#282827] text-[13px] font-semibold text-[#00e59e]" animate={phase === 'welcome' ? { boxShadow: ['0 0 0 rgba(0,229,158,0)','0 0 18px rgba(0,229,158,.18)','0 0 0 rgba(0,229,158,0)'] } : {}} transition={{ duration: 2, repeat: Infinity }}>A</motion.div>
              <p className="mt-2 text-[13px] font-light">How can Aivory help?</p>
              <p className="mt-1 text-[7px] text-[#a1a1aa]">Ask, analyse, or orchestrate work across your business.</p>
              <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                {['Review operations','Track roadmap','Design workflow'].map((chip) => <span key={chip} className="rounded-full border border-white/[0.07] bg-[#3a3a36] px-2.5 py-1.5 text-[7px] text-white/65">{chip}</span>)}
              </div>
            </motion.div>
          )}

          {showConversation && (
            <motion.div key="conversation" {...enter} className="min-h-0 flex-1 overflow-hidden pb-12">
              <div className="flex h-full flex-col gap-2 overflow-hidden">
                <div className="flex justify-end"><div className="max-w-[82%] rounded-2xl rounded-tr-md border border-white/[0.07] bg-[#42423f] px-3 py-2 text-[8px] leading-relaxed text-white/85">{prompt}</div></div>
                <div className="flex items-start gap-2">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[#282827] text-[7px] font-semibold text-[#00e59e]">A</div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center gap-1.5"><span className="text-[8px] font-medium">Aivory</span><span className="text-[6px] text-[#a1a1aa]">Operations copilot</span></div>
                    {phase === 'working' && (
                      <div className="rounded-lg border border-white/[0.07] bg-[#3a3a36] p-2">
                        <p className="mb-1.5 text-[7px] text-white/70">Reviewing live operating context…</p>
                        {['Checking workflow health','Comparing roadmap milestones','Reviewing lead operations'].map((item, index) => (
                          <motion.div key={item} className="mb-1 flex items-center gap-2 text-[6.5px] text-[#a1a1aa]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.45 }}><motion.span className="h-1.5 w-1.5 rounded-full bg-[#00e59e]" animate={{ opacity: [0.3,1,0.3] }} transition={{ duration: 1, repeat: Infinity, delay: index * 0.2 }} />{item}</motion.div>
                        ))}
                      </div>
                    )}
                    {phase === 'response' && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-1.5">
                        <p className="text-[8px] leading-relaxed text-white/80">Operations are stable. Two items need executive attention:</p>
                        {[
                          ['Lead routing delay','12 records waiting > 2 hours','Investigate'],
                          ['Roadmap milestone','Pilot approval due Friday','On track'],
                        ].map(([title,detail,status], index) => (
                          <motion.div key={title} className="flex items-center justify-between rounded-lg border border-white/[0.07] bg-[#3a3a36] px-2.5 py-2" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.28 }}>
                            <div><p className="text-[7px] text-white/85">{title}</p><p className="text-[6px] text-[#a1a1aa]">{detail}</p></div>
                            <span className={`rounded-full px-2 py-1 text-[6px] ${index === 0 ? 'bg-[#fbbf24]/10 text-[#fbbf24]' : 'bg-[#00e59e]/10 text-[#00e59e]'}`}>{status}</span>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute bottom-0 left-0 right-0">
          <div className="mb-1 flex gap-1.5 px-1">
            <span className="rounded-full border border-white/[0.07] bg-[#282827] px-2 py-1 text-[6px] text-white/55">Context: Operations</span>
            <span className="rounded-full border border-white/[0.07] bg-[#282827] px-2 py-1 text-[6px] text-white/55">Governed AI</span>
          </div>
          <div className="flex items-end gap-2 rounded-[20px] border border-white/[0.07] bg-[#42423f] px-2.5 py-2 shadow-[0_8px_24px_rgba(0,0,0,.22)]">
            <button className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-white/[0.07] bg-[#353531] text-[12px] text-white/65">+</button>
            <div className="min-h-6 flex-1 py-1 text-[8px] leading-relaxed text-white/80">
              {phase === 'typing' ? <>{typed}<span className="ml-0.5 inline-block h-2.5 w-px animate-pulse bg-[#00e59e]" /></> : <span className="text-[#a1a1aa]">Ask Aivory about your operations…</span>}
            </div>
            <button className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#353531] text-[9px] text-white/80">↑</button>
          </div>
        </div>
      </div>
    </DashboardFrame>
  );
}
