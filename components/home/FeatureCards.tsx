'use client';

import { useRef } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useGsapStackCards } from '@/hooks/useGsapStackCards';

/* ─── Card Data ─── */
const cards = [
  {
    step: 'DISCOVER',
    title: 'AI Readiness Deep Diagnostic',
    description:
      'Not a generic quiz. A structured multi-phase analysis across your business objective, data readiness, and constraints — so you know exactly where you stand before building anything.',
    visual: 'diagnostic',
  },
  {
    step: 'DESIGN',
    title: 'AI System Blueprint',
    description:
      'Aivory™ turns your diagnostic into a readiness score with KPI targets and a recommended AI architecture built specifically for your business — your score, your gaps, your next move.',
    visual: 'blueprint',
  },
  {
    step: 'PLAN',
    title: 'AI Roadmap',
    description:
      'Month by month. Milestone by milestone. With KPI targets and sequenced actions so your team knows exactly what to do next — a plan built to be executed, not just presented.',
    visual: 'roadmap',
  },
  {
    step: 'BUILD',
    title: 'Workflow Builder',
    description:
      'Tell the builder what you want to automate in plain language. It generates the entire flow, connects your tools, and outputs it ready to export or deploy — no coding required.',
    visual: 'workflow',
  },
  {
    step: 'DEPLOY',
    title: 'AI Agent',
    description:
      'Purpose-built agents for email, customer service, sales, and more. Deploy to Telegram, Slack, or wherever your team works — the right agent, everywhere you need it.',
    visual: 'agent',
  },
  {
    step: 'ACCELERATE',
    title: 'Automation Template Library',
    description:
      'Start with proven workflows instead of building from scratch. Choose from a growing library of ready-to-use automations for sales, operations, support, marketing, and more—then customize them to fit your business.',
    visual: 'templates',
  },
  {
    step: 'AI CONSOLE',
    title: 'Chat, plan, and run your AI in one place',
    description:
      'Chat, monitor, navigate, and follow up in one continuous flow, with full visibility from start to finish.\n\nNothing gets missed. Nothing moves without your awareness. You stay clear, confident, and in control throughout.',
    visual: 'console',
  },
];

/* ─── SVG Visuals ─── */
function DiagnosticVisual() {
  return (
    <svg width="380" height="160" viewBox="0 0 380 160" fill="none" style={{ maxWidth: '100%' }}>
      <rect x="8" y="8" width="130" height="28" fill="rgba(255,255,255,0.03)" rx="6" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" />
      <text x="73" y="26" fontSize="9" fill="#d1d5db" fontFamily="Manrope,sans-serif" fontWeight="300" textAnchor="middle" letterSpacing="0.06em">BUSINESS OBJECTIVE</text>
      <rect x="8" y="44" width="130" height="28" fill="rgba(255,255,255,0.03)" rx="6" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" />
      <text x="73" y="62" fontSize="9" fill="#d1d5db" fontFamily="Manrope,sans-serif" fontWeight="300" textAnchor="middle" letterSpacing="0.06em">DATA READINESS</text>
      <rect x="8" y="80" width="130" height="28" fill="rgba(255,255,255,0.03)" rx="6" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" />
      <text x="73" y="98" fontSize="9" fill="#d1d5db" fontFamily="Manrope,sans-serif" fontWeight="300" textAnchor="middle" letterSpacing="0.06em">CONSTRAINT</text>
      <rect x="8" y="116" width="130" height="28" fill="rgba(255,255,255,0.03)" rx="6" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" />
      <text x="73" y="134" fontSize="9" fill="#d1d5db" fontFamily="Manrope,sans-serif" fontWeight="300" textAnchor="middle" letterSpacing="0.06em">RISK + CHALLENGE</text>
      {/* Converging lines */}
      <path d="M138 22 C180 22 200 80 230 80" stroke="rgba(255,255,255,0.15)" strokeWidth="1" fill="none" />
      <path d="M138 58 C180 58 200 80 230 80" stroke="rgba(255,255,255,0.15)" strokeWidth="1" fill="none" />
      <path d="M138 94 C180 94 200 80 230 80" stroke="rgba(255,255,255,0.15)" strokeWidth="1" fill="none" />
      <path d="M138 130 C180 130 200 80 230 80" stroke="rgba(255,255,255,0.15)" strokeWidth="1" fill="none" />
      <path d="M230 80 L270 80" stroke="rgba(255,255,255,0.15)" strokeWidth="1" fill="none" />
      {/* Teal pulse */}
      <path d="M138 22 C180 22 200 80 230 80" stroke="#0ae8af" strokeWidth="1" fill="none" strokeLinecap="round" strokeDasharray="18 180" opacity="0.85">
        <animate attributeName="stroke-dashoffset" from="198" to="0" dur="3s" repeatCount="indefinite" />
      </path>
      <path d="M138 58 C180 58 200 80 230 80" stroke="#0ae8af" strokeWidth="1" fill="none" strokeLinecap="round" strokeDasharray="18 180" opacity="0.85">
        <animate attributeName="stroke-dashoffset" from="198" to="0" dur="3s" repeatCount="indefinite" begin="0.5s" />
      </path>
      <path d="M138 94 C180 94 200 80 230 80" stroke="#0ae8af" strokeWidth="1" fill="none" strokeLinecap="round" strokeDasharray="18 180" opacity="0.85">
        <animate attributeName="stroke-dashoffset" from="198" to="0" dur="3s" repeatCount="indefinite" begin="1s" />
      </path>
      <path d="M138 130 C180 130 200 80 230 80" stroke="#0ae8af" strokeWidth="1" fill="none" strokeLinecap="round" strokeDasharray="18 180" opacity="0.85">
        <animate attributeName="stroke-dashoffset" from="198" to="0" dur="3s" repeatCount="indefinite" begin="1.5s" />
      </path>
      <line x1="230" y1="80" x2="270" y2="80" stroke="#0ae8af" strokeWidth="1" strokeLinecap="round" strokeDasharray="18 50" opacity="0.85">
        <animate attributeName="stroke-dashoffset" from="68" to="0" dur="1s" repeatCount="indefinite" begin="2s" />
      </line>
      {/* Score Gauge */}
      <g transform="translate(320,80)">
        <circle cx="0" cy="0" r="48" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
        <g stroke="rgba(255,255,255,0.15)" strokeWidth="1">
          {Array.from({ length: 36 }, (_, i) => (
            <line key={i} x1="0" y1="-44" x2="0" y2="-40" transform={`rotate(${i * 6} 0 0)`} />
          ))}
        </g>
        <g strokeWidth="1.5">
          {Array.from({ length: 15 }, (_, i) => (
            <line key={i} x1="0" y1="-44" x2="0" y2="-39" transform={`rotate(${216 + i * 6} 0 0)`} stroke="#ff4d5a" opacity="0.7">
              <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" begin={`${i * 0.1}s`} />
            </line>
          ))}
        </g>
        <circle cx="0" cy="0" r="34" fill="rgba(255,255,255,0.15)" />
        <circle cx="0" cy="0" r="30" fill="rgba(255,255,255,0.1)" />
        <circle cx="0" cy="0" r="26" fill="#111" />
        <text x="0" y="-4" fontSize="7" fill="#aaa" fontFamily="'Doto','Courier New',monospace" fontWeight="300" textAnchor="middle" letterSpacing="0.1em">score</text>
        <text x="0" y="12" fontSize="18" fill="#fff" fontFamily="'Doto','Courier New',monospace" fontWeight="300" textAnchor="middle">
          33
          <animate attributeName="opacity" values="0.8;1;0.7;1;0.9" dur="3s" repeatCount="indefinite" />
        </text>
        <ellipse cx="0" cy="-42" rx="2.5" ry="5" fill="#e63946">
          <animateTransform attributeName="transform" type="rotate" values="300;298;303;299;301;300" dur="4s" repeatCount="indefinite" />
        </ellipse>
      </g>
    </svg>
  );
}

function BlueprintVisual() {
  return (
    <svg width="380" height="140" viewBox="0 0 380 140" fill="none" style={{ maxWidth: '100%' }}>
      <rect x="8" y="50" width="90" height="40" fill="rgba(255,255,255,0.03)" rx="6" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" />
      <text x="53" y="66" fontSize="7" fill="#d1d5db" fontFamily="Manrope,sans-serif" fontWeight="300" textAnchor="middle" letterSpacing="0.04em">DEEP DIAGNOSTIC</text>
      <text x="53" y="78" fontSize="7" fill="#d1d5db" fontFamily="Manrope,sans-serif" fontWeight="300" textAnchor="middle" letterSpacing="0.04em">SCORE</text>
      <rect x="155" y="25" width="80" height="30" fill="rgba(255,255,255,0.03)" rx="6" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" />
      <text x="195" y="44" fontSize="7" fill="#d1d5db" fontFamily="Manrope,sans-serif" fontWeight="300" textAnchor="middle" letterSpacing="0.04em">KPI TARGET</text>
      <rect x="155" y="85" width="80" height="30" fill="rgba(255,255,255,0.03)" rx="6" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" />
      <text x="195" y="104" fontSize="7" fill="#d1d5db" fontFamily="Manrope,sans-serif" fontWeight="300" textAnchor="middle" letterSpacing="0.04em">AI ARCHITECTURE</text>
      {/* Right box - dark style matching AI Agent hub */}
      <rect className="agent-hub-rect" x="290" y="40" width="82" height="60" rx="6" fill="#111" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
      <text x="331" y="65" fontSize="8.5" fill="rgba(255,255,255,0.9)" fontFamily="Manrope,sans-serif" fontWeight="300" textAnchor="middle" letterSpacing="0.03em">
        AI SYSTEM
      </text>
      <text x="331" y="79" fontSize="8.5" fill="rgba(255,255,255,0.9)" fontFamily="Manrope,sans-serif" fontWeight="300" textAnchor="middle" letterSpacing="0.03em">
        BLUEPRINT
      </text>
      {/* Connecting lines */}
      <path d="M98 65 C120 65 135 40 155 40" stroke="rgba(255,255,255,0.15)" strokeWidth="1" fill="none" />
      <path d="M98 75 C120 75 135 100 155 100" stroke="rgba(255,255,255,0.15)" strokeWidth="1" fill="none" />
      <path d="M235 40 C255 40 270 60 290 60" stroke="rgba(255,255,255,0.15)" strokeWidth="1" fill="none" />
      <path d="M235 100 C255 100 270 80 290 80" stroke="rgba(255,255,255,0.15)" strokeWidth="1" fill="none" />
      {/* Teal pulse */}
      <path d="M98 65 C120 65 135 40 155 40" stroke="#0ae8af" strokeWidth="1" fill="none" strokeLinecap="round" strokeDasharray="18 150" opacity="0.85">
        <animate attributeName="stroke-dashoffset" from="168" to="0" dur="2s" repeatCount="indefinite" />
      </path>
      <path d="M98 75 C120 75 135 100 155 100" stroke="#0ae8af" strokeWidth="1" fill="none" strokeLinecap="round" strokeDasharray="18 150" opacity="0.85">
        <animate attributeName="stroke-dashoffset" from="168" to="0" dur="2s" repeatCount="indefinite" begin="0.3s" />
      </path>
      <path d="M235 40 C255 40 270 60 290 60" stroke="#0ae8af" strokeWidth="1" fill="none" strokeLinecap="round" strokeDasharray="18 150" opacity="0.85">
        <animate attributeName="stroke-dashoffset" from="168" to="0" dur="2s" repeatCount="indefinite" begin="1.2s" />
      </path>
      <path d="M235 100 C255 100 270 80 290 80" stroke="#0ae8af" strokeWidth="1" fill="none" strokeLinecap="round" strokeDasharray="18 150" opacity="0.85">
        <animate attributeName="stroke-dashoffset" from="168" to="0" dur="2s" repeatCount="indefinite" begin="1.5s" />
      </path>
    </svg>
  );
}

function RoadmapVisual() {
  return (
    <svg width="380" height="160" viewBox="0 0 380 160" fill="none" style={{ maxWidth: '100%' }}>
      <rect x="8" y="55" width="100" height="40" rx="18" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" />
      <text x="58" y="80" fontSize="10" fill="#d1d5db" fontFamily="Manrope,sans-serif" fontWeight="300" textAnchor="middle" letterSpacing="0.08em">ROADMAP</text>
      <rect x="270" y="10" width="100" height="32" rx="14" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" />
      <text x="320" y="31" fontSize="9" fill="#d1d5db" fontFamily="Manrope,sans-serif" fontWeight="300" textAnchor="middle" letterSpacing="0.06em">PHASE 1</text>
      <rect x="270" y="60" width="100" height="32" rx="14" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" />
      <text x="320" y="81" fontSize="9" fill="#d1d5db" fontFamily="Manrope,sans-serif" fontWeight="300" textAnchor="middle" letterSpacing="0.06em">PHASE 2</text>
      <rect x="270" y="110" width="100" height="32" rx="14" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" />
      <text x="320" y="131" fontSize="9" fill="#d1d5db" fontFamily="Manrope,sans-serif" fontWeight="300" textAnchor="middle" letterSpacing="0.06em">PHASE 3</text>
      {/* Branching lines */}
      <path d="M108 75 C170 75 200 26 270 26" stroke="rgba(255,255,255,0.15)" strokeWidth="1" fill="none" />
      <path d="M108 75 C170 75 200 76 270 76" stroke="rgba(255,255,255,0.15)" strokeWidth="1" fill="none" />
      <path d="M108 75 C170 75 200 126 270 126" stroke="rgba(255,255,255,0.15)" strokeWidth="1" fill="none" />
      {/* Teal pulse */}
      <path d="M108 75 C170 75 200 26 270 26" stroke="#0ae8af" strokeWidth="1" fill="none" strokeLinecap="round" strokeDasharray="20 200" opacity="0.85">
        <animate attributeName="stroke-dashoffset" from="220" to="0" dur="2.5s" repeatCount="indefinite" />
      </path>
      <path d="M108 75 C170 75 200 76 270 76" stroke="#0ae8af" strokeWidth="1" fill="none" strokeLinecap="round" strokeDasharray="20 200" opacity="0.85">
        <animate attributeName="stroke-dashoffset" from="220" to="0" dur="2.5s" repeatCount="indefinite" begin="0.6s" />
      </path>
      <path d="M108 75 C170 75 200 126 270 126" stroke="#0ae8af" strokeWidth="1" fill="none" strokeLinecap="round" strokeDasharray="20 200" opacity="0.85">
        <animate attributeName="stroke-dashoffset" from="220" to="0" dur="2.5s" repeatCount="indefinite" begin="1.2s" />
      </path>
    </svg>
  );
}

function WorkflowVisual() {
  return (
    <div className="flex items-center gap-4">
      {/* Prompt input */}
      <div
        className="flex items-center gap-1 whitespace-nowrap"
        style={{
          border: '1px solid rgba(255,255,255,0.12)',
          padding: '8px 14px',
          background: 'rgba(255,255,255,0.06)',
          width: '178px',
        }}
      >
        <span
          className="wf-prompt-text"
          style={{
            fontSize: '11px',
            color: 'rgba(255,255,255,0.6)',
            fontFamily: "'Manrope', sans-serif",
          }}
        >
          Automate lead follow-up
        </span>
        <span
          className="wf-cursor"
          style={{
            display: 'inline-block',
            width: '2px',
            height: '13px',
            background: '#0ae8af',
          }}
        />
      </div>
      {/* Arrow */}
      <svg width="24" height="12" viewBox="0 0 24 12" fill="none" className="wf-arrow">
        <path d="M0 6h20M16 2l4 4-4 4" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
      </svg>
      {/* Flow nodes */}
      <div className="flex flex-col gap-[5px]">
        {['Trigger', 'Send Email', 'Wait 2 days', 'Log to CRM'].map((label, i) => (
          <div
            key={label}
            className="wf-node flex items-center gap-[6px]"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              padding: '5px 10px',
              fontSize: '10px',
              color: 'rgba(255,255,255,0.6)',
              fontFamily: "'Manrope', sans-serif",
              fontWeight: 300,
              animationDelay: `${i * 0.4}s`,
            }}
          >
            <span className="inline-block w-[6px] h-[6px] bg-accent" />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}

function AgentVisual() {
  return (
    <svg width="280" height="130" viewBox="0 0 280 130" fill="none">
      {/* Center: Agent hub */}
      <rect className="agent-hub-rect" x="100" y="40" width="80" height="50" rx="6" fill="#111" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
      <text x="140" y="60" fontSize="10" fill="rgba(255,255,255,0.9)" fontFamily="Manrope,sans-serif" fontWeight="300" textAnchor="middle">AI AGENT</text>
      <text x="140" y="76" fontSize="8" fill="rgba(255,255,255,0.5)" fontFamily="Manrope,sans-serif" fontWeight="300" textAnchor="middle">Email · Sales · CS</text>
      {/* Gmail icon - dark rounded box */}
      <rect x="16" y="16" width="44" height="34" rx="8" fill="#1a1a1a" stroke="rgba(255,255,255,0.1)" strokeWidth="0.8" />
      <svg x="26" y="21" width="24" height="24" viewBox="0 0 32 32" fill="none">
        <path d="M2 11.9556C2 8.47078 2 6.7284 2.67818 5.39739C3.27473 4.22661 4.22661 3.27473 5.39739 2.67818C6.7284 2 8.47078 2 11.9556 2H20.0444C23.5292 2 25.2716 2 26.6026 2.67818C27.7734 3.27473 28.7253 4.22661 29.3218 5.39739C30 6.7284 30 8.47078 30 11.9556V20.0444C30 23.5292 30 25.2716 29.3218 26.6026C28.7253 27.7734 27.7734 28.7253 26.6026 29.3218C25.2716 30 23.5292 30 20.0444 30H11.9556C8.47078 30 6.7284 30 5.39739 29.3218C4.22661 28.7253 3.27473 27.7734 2.67818 26.6026C2 25.2716 2 23.5292 2 20.0444V11.9556Z" fill="white" />
        <path d="M22.0515 8.52295L16.0644 13.1954L9.94043 8.52295V8.52421L9.94783 8.53053V15.0732L15.9954 19.8466L22.0515 15.2575V8.52295Z" fill="#EA4335" />
        <path d="M23.6231 7.38639L22.0508 8.52292V15.2575L26.9983 11.459V9.17074C26.9983 9.17074 26.3978 5.90258 23.6231 7.38639Z" fill="#FBBC05" />
        <path d="M22.0508 15.2575V23.9924H25.8428C25.8428 23.9924 26.9219 23.8813 26.9995 22.6513V11.459L22.0508 15.2575Z" fill="#34A853" />
        <path d="M9.94811 24.0001V15.0732L9.94043 15.0669L9.94811 24.0001Z" fill="#C5221F" />
        <path d="M9.94014 8.52404L8.37646 7.39382C5.60179 5.91001 5 9.17692 5 9.17692V11.4651L9.94014 15.0667V8.52404Z" fill="#C5221F" />
        <path d="M9.94043 8.52441V15.0671L9.94811 15.0734V8.53073L9.94043 8.52441Z" fill="#C5221F" />
        <path d="M5 11.4668V22.6591C5.07646 23.8904 6.15673 24.0003 6.15673 24.0003H9.94877L9.94014 15.0671L5 11.4668Z" fill="#4285F4" />
      </svg>
      {/* Slack icon - dark rounded box */}
      <rect x="16" y="80" width="44" height="34" rx="8" fill="#1a1a1a" stroke="rgba(255,255,255,0.1)" strokeWidth="0.8" />
      <svg x="29" y="88" width="18" height="18" viewBox="0 0 16 16">
        <path fill="#E01E5A" d="M2.471 11.318a1.474 1.474 0 001.47-1.471v-1.47h-1.47A1.474 1.474 0 001 9.846c.001.811.659 1.469 1.47 1.47zm3.682-2.942a1.474 1.474 0 00-1.47 1.471v3.683c.002.811.66 1.468 1.47 1.47a1.474 1.474 0 001.47-1.47V9.846a1.474 1.474 0 00-1.47-1.47z" />
        <path fill="#36C5F0" d="M4.683 2.471c.001.811.659 1.469 1.47 1.47h1.47v-1.47A1.474 1.474 0 006.154 1a1.474 1.474 0 00-1.47 1.47zm2.94 3.682a1.474 1.474 0 00-1.47-1.47H2.47A1.474 1.474 0 001 6.153c.002.812.66 1.469 1.47 1.47h3.684a1.474 1.474 0 001.47-1.47z" />
        <path fill="#2EB67D" d="M9.847 7.624a1.474 1.474 0 001.47-1.47V2.47A1.474 1.474 0 009.848 1a1.474 1.474 0 00-1.47 1.47v3.684c.002.81.659 1.468 1.47 1.47zm3.682-2.941a1.474 1.474 0 00-1.47 1.47v1.47h1.47A1.474 1.474 0 0015 6.154a1.474 1.474 0 00-1.47-1.47z" />
        <path fill="#ECB22E" d="M8.377 9.847c.002.811.659 1.469 1.47 1.47h3.683A1.474 1.474 0 0015 9.848a1.474 1.474 0 00-1.47-1.47H9.847a1.474 1.474 0 00-1.47 1.47zm2.94 3.682a1.474 1.474 0 00-1.47-1.47h-1.47v1.47c.002.812.659 1.469 1.47 1.47a1.474 1.474 0 001.47-1.47z" />
      </svg>
      {/* Telegram icon - dark rounded box */}
      <rect x="220" y="16" width="44" height="34" rx="8" fill="#1a1a1a" stroke="rgba(255,255,255,0.1)" strokeWidth="0.8" />
      <svg x="231" y="22" width="22" height="22" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="14" fill="#229ED9" />
        <path d="M22.9866 10.2088C23.1112 9.40332 22.3454 8.76755 21.6292 9.082L7.36482 15.3448C6.85123 15.5703 6.8888 16.3483 7.42147 16.5179L10.3631 17.4547C10.9246 17.6335 11.5325 17.541 12.0228 17.2023L18.655 12.6203C18.855 12.4821 19.073 12.7665 18.9021 12.9426L14.1281 17.8646C13.665 18.3421 13.7569 19.1512 14.314 19.5005L19.659 22.8523C20.2585 23.2282 21.0297 22.8506 21.1418 22.1261L22.9866 10.2088Z" fill="#FFF" />
      </svg>
      {/* HubSpot icon - dark rounded box */}
      <rect x="220" y="80" width="44" height="34" rx="8" fill="#1a1a1a" stroke="rgba(255,255,255,0.1)" strokeWidth="0.8" />
      <svg x="230" y="86" width="24" height="24" viewBox="0 0 1024 1024">
        <circle cx="512" cy="512" r="512" fill="#ff7a59" />
        <path d="M623.8 624.94c-38.23 0-69.24-30.67-69.24-68.51s31-68.52 69.24-68.52 69.26 30.67 69.26 68.52-31 68.51-69.26 68.51m20.74-200.42v-61a46.83 46.83 0 0 0 27.33-42.29v-1.41c0-25.78-21.32-46.86-47.35-46.86h-1.43c-26 0-47.35 21.09-47.35 46.86v1.41a46.85 46.85 0 0 0 27.33 42.29v61a135.08 135.08 0 0 0-63.86 27.79l-169.1-130.17A52.49 52.49 0 0 0 372 309c0-29.21-23.89-52.92-53.4-53s-53.45 23.59-53.48 52.81 23.85 52.88 53.36 52.93a53.29 53.29 0 0 0 26.33-7.09l166.38 128.1a132.14 132.14 0 0 0 2.07 150.3l-50.62 50.1A43.42 43.42 0 1 0 450.1 768c24.24 0 43.9-19.46 43.9-43.45a42.24 42.24 0 0 0-2-12.42l50-49.52a135.28 135.28 0 0 0 81.8 27.47c74.61 0 135.06-59.83 135.06-133.65 0-66.82-49.62-122-114.33-131.91" fill="#FFF" fillRule="evenodd" />
      </svg>
      {/* Connector lines (base layer) */}
      <path d="M60 33 C78 33 84 48 100 52" stroke="rgba(255,255,255,0.12)" strokeWidth="1" fill="none" />
      <path d="M60 97 C78 97 84 82 100 78" stroke="rgba(255,255,255,0.12)" strokeWidth="1" fill="none" />
      <path d="M180 52 C196 48 202 33 220 33" stroke="rgba(255,255,255,0.12)" strokeWidth="1" fill="none" />
      <path d="M180 78 C196 82 202 97 220 97" stroke="rgba(255,255,255,0.12)" strokeWidth="1" fill="none" />
      {/* Teal pulse on lines */}
      <path d="M60 33 C78 33 84 48 100 52" stroke="#0ae8af" strokeWidth="1" fill="none" strokeLinecap="round" strokeDasharray="18 150" opacity="0.85">
        <animate attributeName="stroke-dashoffset" from="168" to="0" dur="2s" repeatCount="indefinite" />
      </path>
      <path d="M60 97 C78 97 84 82 100 78" stroke="#0ae8af" strokeWidth="1" fill="none" strokeLinecap="round" strokeDasharray="18 150" opacity="0.85">
        <animate attributeName="stroke-dashoffset" from="168" to="0" dur="2s" repeatCount="indefinite" begin="0.3s" />
      </path>
      <path d="M180 52 C196 48 202 33 220 33" stroke="#0ae8af" strokeWidth="1" fill="none" strokeLinecap="round" strokeDasharray="18 150" opacity="0.85">
        <animate attributeName="stroke-dashoffset" from="168" to="0" dur="2s" repeatCount="indefinite" begin="1.2s" />
      </path>
      <path d="M180 78 C196 82 202 97 220 97" stroke="#0ae8af" strokeWidth="1" fill="none" strokeLinecap="round" strokeDasharray="18 150" opacity="0.85">
        <animate attributeName="stroke-dashoffset" from="168" to="0" dur="2s" repeatCount="indefinite" begin="1.5s" />
      </path>
    </svg>
  );
}

function TemplatesVisual() {
  const categories = [
    { label: 'Email', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 7L2 7"/></svg> },
    { label: 'Sales', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg> },
    { label: 'Support', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 18.72a9.094 9.094 0 003.741-4.066A9.002 9.002 0 0012 3a9 9 0 00-9.741 11.654A9.094 9.094 0 006 18.72"/><path d="M12 21a3 3 0 01-3-3v-2a3 3 0 016 0v2a3 3 0 01-3 3z"/></svg> },
    { label: 'Reports', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 16V12"/><path d="M12 16V8"/><path d="M16 16v-5"/></svg> },
    { label: 'Schedule', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/></svg> },
    { label: '+ More', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg> },
  ];

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '280px' }}>
      {/* 50+ badge top-right */}
      <div
        style={{
          position: 'absolute',
          top: '-12px',
          right: '0',
          color: '#0ae8af',
          fontSize: '14px',
          fontWeight: 500,
          fontFamily: "'Manrope', sans-serif",
        }}
      >
        50+
      </div>
      {/* 3x2 icon grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px',
          marginTop: '16px',
        }}
      >
        {categories.map((cat) => (
          <div
            key={cat.label}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '16px 8px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '10px',
              color: 'rgba(255,255,255,0.7)',
            }}
          >
            {cat.icon}
            <span
              style={{
                fontSize: '11px',
                color: 'rgba(255,255,255,0.7)',
                fontFamily: "'Manrope', sans-serif",
                fontWeight: 300,
              }}
            >
              {cat.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ConsoleVisual() {
  return (
    <div className="console-chat-container" style={{ width: '100%', maxWidth: '240px', position: 'relative', padding: '0' }}>
      {/* Top gradient fade */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '24px',
          background: 'linear-gradient(to bottom, #191919 0%, transparent 100%)',
          zIndex: 2,
          pointerEvents: 'none',
          borderRadius: '8px 8px 0 0',
        }}
      />
      {/* Chat messages */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '20px 10px 10px' }}>
        <div className="chat-b chat-user" style={{ animationName: 'msg1' }}>
          What&apos;s our current AI Readiness Score?
        </div>
        <div className="chat-b chat-ai" style={{ animationName: 'msg2' }}>
          Your overall readiness score is 33. The main bottleneck is data documentation in sales.
        </div>
        <div className="chat-b chat-user" style={{ animationName: 'msg3' }}>
          Can we generate the AI System Blueprint based on this?
        </div>
        <div className="chat-b chat-ai" style={{ animationName: 'msg4' }}>
          Yes. The blueprint recommends a 3-phase roadmap prioritizing sales workflow automation.
        </div>
        <div className="chat-b chat-user" style={{ animationName: 'msg5' }}>
          Deploy Phase 1 agents to staging.
        </div>
        <div className="chat-b chat-ai" style={{ animationName: 'msg6' }}>
          Phase 1 deployed. 5 agents are now active in the staging environment.
        </div>
      </div>
      {/* Bottom bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '8px 10px',
          color: '#777',
          fontSize: '11px',
          fontFamily: "'Manrope', sans-serif",
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <span>Chat</span>
        <span>Explore →</span>
      </div>
    </div>
  );
}

function getVisual(type: string) {
  switch (type) {
    case 'diagnostic': return <DiagnosticVisual />;
    case 'blueprint': return <BlueprintVisual />;
    case 'roadmap': return <RoadmapVisual />;
    case 'workflow': return <WorkflowVisual />;
    case 'agent': return <AgentVisual />;
    case 'templates': return <TemplatesVisual />;
    case 'console': return <ConsoleVisual />;
    default: return null;
  }
}

/* ─── Main Component ─── */
export default function FeatureCards() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { ref: animRef, isVisible } = useScrollAnimation();

  // GSAP stacking card parallax + batch animate
  useGsapStackCards(containerRef);

  return (
    <div ref={animRef} className={`animate-on-scroll ${isVisible ? 'is-visible' : ''} w-full py-24 relative`} id="features" style={{ background: 'transparent', zIndex: 1 }}>

      <div className="relative z-[1]" style={{ maxWidth: '1160px', margin: '0 auto', padding: '0 24px' }}>
        {/* Section heading */}
        <div style={{ marginBottom: '20px' }}>
          <h2
            className="text-white mb-3"
            style={{
              fontSize: '3.5rem',
              fontWeight: 400,
              fontFamily: "'Manrope', sans-serif",
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
            }}
          >
            Turn your AI Confusion<br />Into AI Execution
          </h2>
          <p
            style={{
              fontSize: '1.25rem',
              color: '#b2b2b2',
              fontFamily: "'Manrope', sans-serif",
              fontWeight: 300,
              lineHeight: 1.6,
            }}
          >
            Aivory™ helps organizations discover where AI creates value,<br />
            design the right systems, and deploy AI with confidence
          </p>
        </div>

        {/* Sticky Card Stack */}
        <div ref={containerRef} className="gsap-card-container">
          {cards.map((card, i) => (
            <div
              key={card.step}
              className="gsap-card"
              style={{ zIndex: i + 1 }}
            >
              <div className="gsap-card-text-area">
                <span className="fc-step-v">{card.step}</span>
                <div className="fc-title-v">{card.title}</div>
                <div className="fc-desc-v">{card.description}</div>
              </div>
              <div className="gsap-card-visual-area">
                {getVisual(card.visual)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
