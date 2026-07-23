'use client';

import { FadeUp } from './FadeUp';
import { motion } from 'framer-motion';

export default function BastionMetrics() {
  return (
    <section className="bg-[#F4F3F8] text-[#111827] py-24 border-t border-b border-black/5 relative overflow-hidden font-sans">
      
      {/* Subtle Isometric Background Grid Texture */}
      <div 
        className="absolute inset-0 opacity-[0.25] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(30deg, #A1A1AA 1px, transparent 1px),
            linear-gradient(150deg, #A1A1AA 1px, transparent 1px)
          `,
          backgroundSize: '40px 23px'
        }}
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <FadeUp className="mb-8 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 border border-black/10 text-xs font-mono tracking-widest text-[#4B5563] uppercase mb-4">
            <span className="w-2 h-2 rounded-full bg-[#521CD5] animate-pulse" />
            System Architecture
          </div>
          <h2 className="text-3xl md:text-5xl font-light tracking-tight text-[#111827] mb-4">
            Built for enterprise resilience.
          </h2>
          <p className="text-base md:text-lg text-[#4B5563] max-w-3xl font-light leading-relaxed">
            Continuous threat monitoring, autonomous response, and zero-trust access engineered into a unified defensive posture.
          </p>
        </FadeUp>
      </div>

      {/* Main SVG Vector Canvas */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 mt-8">
        <div className="relative w-full aspect-[4/3] max-h-[850px] bg-white/60 backdrop-blur-md rounded-2xl border border-black/10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden flex items-center justify-center p-2 md:p-6">
          
          <svg
            viewBox="0 0 1200 900"
            className="w-full h-full object-contain select-none"
            style={{ shapeRendering: 'geometricPrecision' }}
          >
            <defs>
              {/* Drop Shadow Filter for Floating Callout Badges */}
              <filter id="badge-shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000000" floodOpacity="0.08" />
              </filter>
              
              {/* Linear Gradient for Conduits */}
              <linearGradient id="pipeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#521CD5" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.4" />
              </linearGradient>
            </defs>

            {/* ========================================================
                1. THREE-TIERED ISOMETRIC PLATFORM SLABS
               ======================================================== */}

            {/* LAYER 1: BASE SLAB (SECURITY & GOVERNANCE) */}
            <g id="layer-bottom">
              {/* Side Left */}
              <polygon points="200,640 200,670 600,870 600,840" fill="#DCDAE2" stroke="#B8B5C3" strokeWidth="1" />
              {/* Side Right */}
              <polygon points="600,840 600,870 1000,670 1000,640" fill="#CBC7D5" stroke="#B8B5C3" strokeWidth="1" />
              {/* Top Face */}
              <polygon points="600,440 1000,640 600,840 200,640" fill="#EDEBF2" stroke="#C4C0CE" strokeWidth="1.5" />
              
              {/* Base Dot Matrix Pattern */}
              <g opacity="0.3">
                {[...Array(9)].map((_, i) => (
                  <g key={`dot-row-${i}`}>
                    {[...Array(9)].map((_, j) => {
                      const x = 320 + i * 35 + j * 35;
                      const y = 580 - i * 18 + j * 18;
                      return <circle key={`dot-${i}-${j}`} cx={x} cy={y} r="2" fill="#521CD5" />;
                    })}
                  </g>
                ))}
              </g>

              {/* Layer 1 Label */}
              <text x="230" y="660" fontSize="11" fontFamily="monospace" fill="#6B7280" letterSpacing="2">
                SECURITY & GOVERNANCE LAYER
              </text>
            </g>


            {/* LAYER 2: MIDDLE SLAB (ONTOLOGY & INTEL ENGINE) */}
            <g id="layer-middle">
              {/* Side Left */}
              <polygon points="240,580 240,605 600,785 600,760" fill="#D2CFDC" stroke="#B4AFBF" strokeWidth="1" />
              {/* Side Right */}
              <polygon points="600,760 600,785 960,585 960,560" fill="#C2BDCE" stroke="#B4AFBF" strokeWidth="1" />
              {/* Top Face */}
              <polygon points="600,380 960,560 600,760 240,580" fill="#F2EFF8" stroke="#BAB4C6" strokeWidth="1.5" />
              
              {/* Layer 2 Label */}
              <text x="940" y="580" fontSize="11" fontFamily="monospace" fill="#6B7280" letterSpacing="2" textAnchor="end">
                BASTION INTEL ENGINE
              </text>
            </g>


            {/* LAYER 3: TOP ACTIVE PLATFORM (DEFENSE PLATFORM) */}
            <g id="layer-top">
              {/* Side Left */}
              <polygon points="280,520 280,540 600,700 600,680" fill="#C5C0D3" stroke="#A8A2B6" strokeWidth="1" />
              {/* Side Right */}
              <polygon points="600,680 600,700 920,540 920,520" fill="#B5AFB6" stroke="#A8A2B6" strokeWidth="1" />
              {/* Top Face */}
              <polygon points="600,320 920,520 600,680 280,520" fill="#FAF9FC" stroke="#A8A2B6" strokeWidth="2" />
            </g>


            {/* ========================================================
                2. ISOMETRIC CONDUIT PIPELINES & DATA FLOW
               ======================================================== */}
            <g id="conduits" stroke="#521CD5" strokeWidth="2" fill="none" opacity="0.6" strokeDasharray="4 4">
              {/* Center to Node 1 */}
              <path d="M 600,500 L 420,410" />
              {/* Center to Node 2 */}
              <path d="M 600,500 L 780,410" />
              {/* Center to Node 3 */}
              <path d="M 600,500 L 380,530" />
              {/* Center to Node 4 */}
              <path d="M 600,500 L 820,530" />
              {/* Center to Node 5 */}
              <path d="M 600,500 L 460,610" />
              {/* Center to Node 6 */}
              <path d="M 600,500 L 740,610" />
            </g>


            {/* ========================================================
                3. ISOMETRIC INFRASTRUCTURE STRUCTURES & NODES
               ======================================================== */}

            {/* --- CENTRAL TOWER: BASTION CORE COMMAND (600, 500) --- */}
            <g id="central-core">
              {/* Main Building Base */}
              <polygon points="560,480 600,460 640,480 640,510 600,530 560,510" fill="#E2DFEB" stroke="#1E1E24" strokeWidth="1.5" />
              <polygon points="560,480 600,460 600,430 560,450" fill="#F4F2F9" stroke="#1E1E24" strokeWidth="1.5" />
              <polygon points="600,460 640,480 640,450 600,430" fill="#D6D2E1" stroke="#1E1E24" strokeWidth="1.5" />
              
              {/* Upper Tower Stack */}
              <polygon points="580,430 600,420 620,430 620,380 600,370 580,380" fill="#FAF9FC" stroke="#1E1E24" strokeWidth="1.5" />
              <polygon points="600,420 620,430 620,380 600,370" fill="#E2DFEB" stroke="#1E1E24" strokeWidth="1.5" />

              {/* Antenna Mast & Signal Waves */}
              <line x1="600" y1="370" x2="600" y2="320" stroke="#1E1E24" strokeWidth="2" />
              <circle cx="600" cy="320" r="4" fill="#521CD5" />
              <circle cx="600" cy="320" r="12" fill="none" stroke="#521CD5" strokeWidth="1" strokeDasharray="2 2" />
            </g>


            {/* --- NODE 1: RADAR & TELEMETRY TOWER (420, 410) [24/7 Monitoring] --- */}
            <g id="node-1">
              <polygon points="390,400 420,385 450,400 420,415" fill="#EBE7F3" stroke="#1E1E24" strokeWidth="1.5" />
              <line x1="420" y1="400" x2="420" y2="350" stroke="#1E1E24" strokeWidth="1.5" />
              {/* Radar Dish Arc */}
              <path d="M 405,355 Q 420,340 435,355" fill="none" stroke="#1E1E24" strokeWidth="2" />
              <circle cx="420" cy="345" r="3" fill="#521CD5" />
            </g>


            {/* --- NODE 2: AUTOMATED SHIELD FORTRESS (780, 410) [Adaptive Threat] --- */}
            <g id="node-2">
              <polygon points="750,400 780,385 810,400 780,415" fill="#EBE7F3" stroke="#1E1E24" strokeWidth="1.5" />
              {/* Hexagonal Shield Dome */}
              <path d="M 760,400 Q 780,360 800,400" fill="none" stroke="#521CD5" strokeWidth="2" strokeDasharray="3 3" />
              <polygon points="770,395 780,385 790,395 780,405" fill="#521CD5" opacity="0.8" />
            </g>


            {/* --- NODE 3: OPTICAL SENSOR GRID (380, 530) [100% Security Visibility] --- */}
            <g id="node-3">
              <polygon points="350,520 380,505 410,520 380,535" fill="#EBE7F3" stroke="#1E1E24" strokeWidth="1.5" />
              {/* Sensor Lenses */}
              <circle cx="370" cy="515" r="5" fill="#FAF9FC" stroke="#1E1E24" strokeWidth="1.5" />
              <circle cx="390" cy="525" r="5" fill="#FAF9FC" stroke="#1E1E24" strokeWidth="1.5" />
              <circle cx="370" cy="515" r="2" fill="#521CD5" />
              <circle cx="390" cy="525" r="2" fill="#521CD5" />
            </g>


            {/* --- NODE 4: ZERO-TRUST IDENTITY VAULT (820, 530) [Zero Trust Access] --- */}
            <g id="node-4">
              <polygon points="790,520 820,505 850,520 820,535" fill="#EBE7F3" stroke="#1E1E24" strokeWidth="1.5" />
              {/* Vault Cube */}
              <polygon points="805,510 820,500 835,510 835,525 820,535 805,525" fill="#FAF9FC" stroke="#1E1E24" strokeWidth="1.5" />
              <circle cx="820" cy="515" r="4" fill="none" stroke="#521CD5" strokeWidth="2" />
            </g>


            {/* --- NODE 5: NEURAL AI SERVER STACK (460, 610) [Continuous Intel] --- */}
            <g id="node-5">
              <polygon points="430,600 460,585 490,600 460,615" fill="#EBE7F3" stroke="#1E1E24" strokeWidth="1.5" />
              {/* Server Racks */}
              <polygon points="445,595 460,585 475,595 475,615 460,625 445,615" fill="#FAF9FC" stroke="#1E1E24" strokeWidth="1.5" />
              <line x1="448" y1="602" x2="472" y2="612" stroke="#521CD5" strokeWidth="1.5" />
              <line x1="448" y1="607" x2="472" y2="617" stroke="#521CD5" strokeWidth="1.5" />
            </g>


            {/* --- NODE 6: REDUNDANT INFRASTRUCTURE (740, 610) [Operational Resilience] --- */}
            <g id="node-6">
              <polygon points="710,600 740,585 770,600 740,615" fill="#EBE7F3" stroke="#1E1E24" strokeWidth="1.5" />
              {/* Power Storage Cylinders */}
              <ellipse cx="730" cy="595" rx="8" ry="4" fill="#FAF9FC" stroke="#1E1E24" strokeWidth="1.5" />
              <ellipse cx="750" cy="605" rx="8" ry="4" fill="#FAF9FC" stroke="#1E1E24" strokeWidth="1.5" />
            </g>


            {/* ========================================================
                4. TECHNICAL CALLOUT BADGES & POINTER LINES (PALANTIR STYLE)
               ======================================================== */}

            {/* CALLOUT 1: 24/7 CONTINUOUS MONITORING (Top Left) */}
            <g id="badge-1">
              <line x1="220" y1="180" x2="420" y2="180" stroke="#1E1E24" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="420" y1="180" x2="420" y2="340" stroke="#1E1E24" strokeWidth="1" strokeDasharray="3 3" />
              <circle cx="420" cy="340" r="3" fill="#521CD5" />
              
              <rect x="120" y="160" width="180" height="42" rx="4" fill="#FFFFFF" stroke="#1E1E24" strokeWidth="1.5" filter="url(#badge-shadow)" />
              <text x="135" y="182" fontSize="13" fontWeight="bold" fontFamily="sans-serif" fill="#111827">24/7</text>
              <text x="135" y="194" fontSize="9" fontFamily="monospace" fill="#6B7280" letterSpacing="1">CONTINUOUS MONITORING</text>
            </g>

            {/* CALLOUT 2: ADAPTIVE THREAT RESPONSE (Top Right) */}
            <g id="badge-2">
              <line x1="980" y1="180" x2="780" y2="180" stroke="#1E1E24" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="780" y1="180" x2="780" y2="385" stroke="#1E1E24" strokeWidth="1" strokeDasharray="3 3" />
              <circle cx="780" cy="385" r="3" fill="#521CD5" />
              
              <rect x="900" y="160" width="180" height="42" rx="4" fill="#FFFFFF" stroke="#1E1E24" strokeWidth="1.5" filter="url(#badge-shadow)" />
              <text x="915" y="182" fontSize="13" fontWeight="bold" fontFamily="sans-serif" fill="#111827">ADAPTIVE</text>
              <text x="915" y="194" fontSize="9" fontFamily="monospace" fill="#6B7280" letterSpacing="1">THREAT RESPONSE</text>
            </g>

            {/* CALLOUT 3: 100% SECURITY VISIBILITY (Mid Left) */}
            <g id="badge-3">
              <line x1="180" y1="360" x2="380" y2="360" stroke="#1E1E24" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="380" y1="360" x2="380" y2="505" stroke="#1E1E24" strokeWidth="1" strokeDasharray="3 3" />
              <circle cx="380" cy="505" r="3" fill="#521CD5" />
              
              <rect x="80" y="340" width="180" height="42" rx="4" fill="#FFFFFF" stroke="#1E1E24" strokeWidth="1.5" filter="url(#badge-shadow)" />
              <text x="95" y="362" fontSize="13" fontWeight="bold" fontFamily="sans-serif" fill="#111827">100%</text>
              <text x="95" y="374" fontSize="9" fontFamily="monospace" fill="#6B7280" letterSpacing="1">SECURITY VISIBILITY</text>
            </g>

            {/* CALLOUT 4: ZERO TRUST ACCESS PROTECTION (Mid Right) */}
            <g id="badge-4">
              <line x1="1020" y1="360" x2="820" y2="360" stroke="#1E1E24" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="820" y1="360" x2="820" y2="505" stroke="#1E1E24" strokeWidth="1" strokeDasharray="3 3" />
              <circle cx="820" cy="505" r="3" fill="#521CD5" />
              
              <rect x="940" y="340" width="180" height="42" rx="4" fill="#FFFFFF" stroke="#1E1E24" strokeWidth="1.5" filter="url(#badge-shadow)" />
              <text x="955" y="362" fontSize="13" fontWeight="bold" fontFamily="sans-serif" fill="#111827">ZERO TRUST</text>
              <text x="955" y="374" fontSize="9" fontFamily="monospace" fill="#6B7280" letterSpacing="1">ACCESS PROTECTION</text>
            </g>

            {/* CALLOUT 5: CONTINUOUS OPERATIONAL INTEL (Bottom Left) */}
            <g id="badge-5">
              <line x1="240" y1="720" x2="460" y2="720" stroke="#1E1E24" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="460" y1="720" x2="460" y2="615" stroke="#1E1E24" strokeWidth="1" strokeDasharray="3 3" />
              <circle cx="460" cy="615" r="3" fill="#521CD5" />
              
              <rect x="100" y="700" width="190" height="42" rx="4" fill="#FFFFFF" stroke="#1E1E24" strokeWidth="1.5" filter="url(#badge-shadow)" />
              <text x="115" y="722" fontSize="13" fontWeight="bold" fontFamily="sans-serif" fill="#111827">CONTINUOUS</text>
              <text x="115" y="734" fontSize="9" fontFamily="monospace" fill="#6B7280" letterSpacing="1">OPERATIONAL INTEL</text>
            </g>

            {/* CALLOUT 6: ENTERPRISE OPERATIONAL RESILIENCE (Bottom Right) */}
            <g id="badge-6">
              <line x1="960" y1="720" x2="740" y2="720" stroke="#1E1E24" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="740" y1="720" x2="740" y2="615" stroke="#1E1E24" strokeWidth="1" strokeDasharray="3 3" />
              <circle cx="740" cy="615" r="3" fill="#521CD5" />
              
              <rect x="910" y="700" width="190" height="42" rx="4" fill="#FFFFFF" stroke="#1E1E24" strokeWidth="1.5" filter="url(#badge-shadow)" />
              <text x="925" y="722" fontSize="13" fontWeight="bold" fontFamily="sans-serif" fill="#111827">ENTERPRISE</text>
              <text x="925" y="734" fontSize="9" fontFamily="monospace" fill="#6B7280" letterSpacing="1">OPERATIONAL RESILIENCE</text>
            </g>


            {/* ========================================================
                5. TELEMETRY HUD OVERLAY CARD (PLANT OBJECT STYLE)
               ======================================================== */}
            <g id="telemetry-hud" transform="translate(60, 480)">
              <rect width="210" height="150" rx="6" fill="#FFFFFF" stroke="#1E1E24" strokeWidth="1.5" filter="url(#badge-shadow)" />
              
              {/* Header */}
              <rect width="210" height="28" rx="6" fill="#1E1E24" />
              <text x="12" y="18" fontSize="10" fontFamily="monospace" fontWeight="bold" fill="#FFFFFF" letterSpacing="1">
                BASTION CORE OBJECT
              </text>
              
              {/* Status Rows */}
              <text x="12" y="48" fontSize="10" fontFamily="monospace" fill="#6B7280">Status</text>
              <circle cx="130" cy="45" r="3.5" fill="#10B981" />
              <text x="140" y="48" fontSize="10" fontFamily="monospace" fontWeight="bold" fill="#10B981">RUNNING</text>

              <text x="12" y="68" fontSize="10" fontFamily="monospace" fill="#6B7280">Monitoring</text>
              <text x="130" y="68" fontSize="10" fontFamily="monospace" fill="#111827">24/7 ACTIVE</text>

              <text x="12" y="88" fontSize="10" fontFamily="monospace" fill="#6B7280">Threat Latency</text>
              <text x="130" y="88" fontSize="10" fontFamily="monospace" fill="#521CD5">&lt; 0.2ms</text>

              <text x="12" y="108" fontSize="10" fontFamily="monospace" fill="#6B7280">Visibility</text>
              <text x="130" y="108" fontSize="10" fontFamily="monospace" fill="#111827">100% COVERAGE</text>

              <text x="12" y="128" fontSize="10" fontFamily="monospace" fill="#6B7280">Uptime Score</text>
              <text x="130" y="128" fontSize="10" fontFamily="monospace" fontWeight="bold" fill="#111827">99.99%</text>
            </g>

          </svg>
        </div>
      </div>
    </section>
  );
}
