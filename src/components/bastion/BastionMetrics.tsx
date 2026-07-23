'use client';

import { FadeUp } from './FadeUp';
import { motion } from 'framer-motion';

export default function BastionMetrics() {
  return (
    <section className="bg-[#050508] text-white py-24 border-t border-b border-white/10 relative overflow-hidden font-sans">
      
      {/* Subtle Glowing Purple Background Gradient */}
      <div 
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% 50%, rgba(82,28,213,0.25) 0%, transparent 80%)'
        }}
      />

      {/* Subtle Isometric Dark Grid Lines */}
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(30deg, #521CD5 1px, transparent 1px),
            linear-gradient(150deg, #521CD5 1px, transparent 1px)
          `,
          backgroundSize: '60px 35px'
        }}
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <FadeUp className="mb-6 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono tracking-widest text-[#B3B3B3] uppercase mb-4">
            <span className="w-2 h-2 rounded-full bg-[#A855F7] animate-pulse" />
            System Architecture
          </div>
          <h2 className="text-3xl md:text-5xl font-light tracking-tight text-white mb-4">
            Built for enterprise resilience.
          </h2>
          <p className="text-base md:text-lg text-[#9CA3AF] max-w-3xl font-light leading-relaxed">
            Continuous threat monitoring, autonomous response, and zero-trust access engineered into a unified defensive posture.
          </p>
        </FadeUp>
      </div>

      {/* Main Vector SVG Isometric Canvas */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 mt-4">
        <div className="relative w-full aspect-[16/10] max-h-[850px] bg-[#0A0A0F]/80 backdrop-blur-xl rounded-2xl border border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.8)] overflow-hidden flex items-center justify-center p-2 md:p-4">
          
          <svg
            viewBox="0 0 1200 850"
            className="w-full h-full object-contain select-none"
            style={{ shapeRendering: 'geometricPrecision' }}
          >
            <defs>
              {/* Neon Glow Filters */}
              <filter id="purple-glow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              
              <filter id="node-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="#A855F7" floodOpacity="0.6" />
              </filter>

              {/* Linear Gradients */}
              <linearGradient id="slabGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#181424" />
                <stop offset="100%" stopColor="#0D0A14" />
              </linearGradient>

              <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#A855F7" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.3" />
              </linearGradient>
            </defs>

            {/* ========================================================
                1. THREE-TIERED ISOMETRIC PLATFORM SLABS (DARK GLASS)
               ======================================================== */}

            {/* LAYER 1: BASE SLAB (SECURITY & GOVERNANCE) */}
            <g id="layer-bottom">
              {/* Side Left */}
              <polygon points="180,590 180,620 600,830 600,800" fill="#0C0A14" stroke="#2D2245" strokeWidth="1" />
              {/* Side Right */}
              <polygon points="600,800 600,820 1020,620 1020,590" fill="#08060E" stroke="#2D2245" strokeWidth="1" />
              {/* Top Face */}
              <polygon points="600,390 1020,590 600,800 180,590" fill="#120F1F" stroke="#3D2C60" strokeWidth="1.5" />
              
              {/* Dotted Matrix */}
              <g opacity="0.3">
                {[...Array(8)].map((_, i) => (
                  <g key={`dot-row-${i}`}>
                    {[...Array(8)].map((_, j) => {
                      const x = 300 + i * 40 + j * 40;
                      const y = 560 - i * 20 + j * 20;
                      return <circle key={`dot-${i}-${j}`} cx={x} cy={y} r="2" fill="#A855F7" />;
                    })}
                  </g>
                ))}
              </g>

              {/* Layer 1 Label */}
              <text x="210" y="615" fontSize="10" fontFamily="monospace" fill="#71717A" letterSpacing="2">
                SECURITY & GOVERNANCE LAYER
              </text>
            </g>


            {/* LAYER 2: MIDDLE SLAB (BASTION INTEL ENGINE) */}
            <g id="layer-middle">
              {/* Side Left */}
              <polygon points="220,530 220,555 600,745 600,720" fill="#110E1D" stroke="#3B2A5C" strokeWidth="1" />
              {/* Side Right */}
              <polygon points="600,720 600,745 980,555 980,530" fill="#0B0913" stroke="#3B2A5C" strokeWidth="1" />
              {/* Top Face */}
              <polygon points="600,340 980,530 600,720 220,530" fill="url(#slabGrad)" stroke="#521CD5" strokeWidth="1.5" />
              
              {/* Layer 2 Label */}
              <text x="960" y="550" fontSize="10" fontFamily="monospace" fill="#A1A1AA" letterSpacing="2" textAnchor="end">
                BASTION INTEL ENGINE
              </text>
            </g>


            {/* LAYER 3: TOP ACTIVE PLATFORM (ACTIVE DEFENSE) */}
            <g id="layer-top">
              {/* Side Left */}
              <polygon points="260,470 260,490 600,660 600,640" fill="#1A152B" stroke="#6D28D9" strokeWidth="1" />
              {/* Side Right */}
              <polygon points="600,640 600,660 940,490 940,470" fill="#120E20" stroke="#6D28D9" strokeWidth="1" />
              {/* Top Face */}
              <polygon points="600,280 940,470 600,640 260,470" fill="#1E1933" stroke="#8B5CF6" strokeWidth="2" />
            </g>


            {/* ========================================================
                2. NEON CONDUIT PIPELINES & ANIMATED FLOW
               ======================================================== */}
            <g id="conduits" stroke="#8B5CF6" strokeWidth="2" fill="none" opacity="0.7">
              <path d="M 600,460 L 420,370" strokeDasharray="4 4" />
              <path d="M 600,460 L 780,370" strokeDasharray="4 4" />
              <path d="M 600,460 L 370,495" strokeDasharray="4 4" />
              <path d="M 600,460 L 830,495" strokeDasharray="4 4" />
              <path d="M 600,460 L 450,570" strokeDasharray="4 4" />
              <path d="M 600,460 L 750,570" strokeDasharray="4 4" />
            </g>


            {/* ========================================================
                3. PROMINENT DETAILED ISOMETRIC STRUCTURES (80px - 140px)
               ======================================================== */}

            {/* --- CENTRAL CORE COMMAND TOWER (600, 460) --- */}
            <g id="central-core" filter="url(#node-glow)">
              {/* Main Building Base */}
              <polygon points="550,440 600,410 650,440 650,480 600,510 550,480" fill="#2E244D" stroke="#A855F7" strokeWidth="2" />
              <polygon points="550,440 600,410 600,360 550,390" fill="#4C1D95" stroke="#C084FC" strokeWidth="2" />
              <polygon points="600,410 650,440 650,390 600,360" fill="#3B0764" stroke="#C084FC" strokeWidth="2" />
              
              {/* Upper Spire Tower */}
              <polygon points="575,360 600,345 625,360 625,300 600,285 575,300" fill="#6B21A8" stroke="#E9D5FF" strokeWidth="2" />
              <polygon points="600,345 625,360 625,300 600,285" fill="#4C1D95" stroke="#E9D5FF" strokeWidth="2" />

              {/* Antenna Beacon */}
              <line x1="600" y1="285" x2="600" y2="230" stroke="#FFFFFF" strokeWidth="3" />
              <circle cx="600" cy="230" r="6" fill="#A855F7" filter="url(#purple-glow)" />
              <circle cx="600" cy="230" r="16" fill="none" stroke="#E9D5FF" strokeWidth="1.5" strokeDasharray="3 3" />
            </g>


            {/* --- NODE 1: RADAR & TELEMETRY TOWER (420, 370) [24/7 Monitoring] --- */}
            <g id="node-1">
              <polygon points="380,360 420,340 460,360 420,380" fill="#251E3E" stroke="#A855F7" strokeWidth="1.5" />
              {/* Tower Mast */}
              <line x1="420" y1="360" x2="420" y2="290" stroke="#E9D5FF" strokeWidth="2.5" />
              {/* Large Dish Arc */}
              <path d="M 395,300 Q 420,270 445,300" fill="none" stroke="#A855F7" strokeWidth="3" />
              <line x1="420" y1="290" x2="420" y2="275" stroke="#FFFFFF" strokeWidth="2" />
              <circle cx="420" cy="275" r="4" fill="#38BDF8" filter="url(#purple-glow)" />
              {/* Concentric Signal Rings */}
              <circle cx="420" cy="275" r="14" fill="none" stroke="#38BDF8" strokeWidth="1" strokeDasharray="3 3" />
            </g>


            {/* --- NODE 2: AUTOMATED SHIELD FORTRESS (780, 370) [Adaptive Threat] --- */}
            <g id="node-2">
              <polygon points="740,360 780,340 820,360 780,380" fill="#251E3E" stroke="#A855F7" strokeWidth="1.5" />
              {/* 3D Shield Generator Base */}
              <polygon points="760,350 780,340 800,350 800,320 780,310 760,320" fill="#4C1D95" stroke="#E9D5FF" strokeWidth="2" />
              {/* Wireframe Shield Dome */}
              <path d="M 730,360 Q 780,280 830,360" fill="none" stroke="#38BDF8" strokeWidth="2.5" strokeDasharray="4 2" />
              <polygon points="770,335 780,320 790,335 780,350" fill="#A855F7" opacity="0.9" />
            </g>


            {/* --- NODE 3: OPTICAL SENSOR GRID (370, 495) [100% Security Visibility] --- */}
            <g id="node-3">
              <polygon points="330,480 370,460 410,480 370,500" fill="#251E3E" stroke="#A855F7" strokeWidth="1.5" />
              {/* Multi-Lens Sensors */}
              <polygon points="350,470 370,460 390,470 390,440 370,430 350,440" fill="#3B0764" stroke="#E9D5FF" strokeWidth="2" />
              <circle cx="370" cy="445" r="8" fill="#0EA5E9" stroke="#FFFFFF" strokeWidth="1.5" />
              <circle cx="370" cy="445" r="3" fill="#FFFFFF" />
            </g>


            {/* --- NODE 4: ZERO-TRUST IDENTITY VAULT (830, 495) [Zero Trust Access] --- */}
            <g id="node-4">
              <polygon points="790,480 830,460 870,480 830,500" fill="#251E3E" stroke="#A855F7" strokeWidth="1.5" />
              {/* Large Safe Vault Cube */}
              <polygon points="810,470 830,455 850,470 850,425 830,410 810,425" fill="#4C1D95" stroke="#E9D5FF" strokeWidth="2" />
              <circle cx="830" cy="440" r="10" fill="none" stroke="#38BDF8" strokeWidth="3" />
              <circle cx="830" cy="440" r="4" fill="#A855F7" />
            </g>


            {/* --- NODE 5: NEURAL AI SERVER STACK (450, 570) [Continuous Intel] --- */}
            <g id="node-5">
              <polygon points="410,555 450,535 490,555 450,575" fill="#251E3E" stroke="#A855F7" strokeWidth="1.5" />
              {/* Tall Server Rack */}
              <polygon points="430,545 450,530 470,545 470,485 450,470 430,485" fill="#3B0764" stroke="#E9D5FF" strokeWidth="2" />
              {/* Illuminated Server Blades */}
              <line x1="435" y1="500" x2="465" y2="515" stroke="#38BDF8" strokeWidth="2" />
              <line x1="435" y1="515" x2="465" y2="530" stroke="#A855F7" strokeWidth="2" />
              <line x1="435" y1="530" x2="465" y2="545" stroke="#10B981" strokeWidth="2" />
            </g>


            {/* --- NODE 6: REDUNDANT POWER TURBINES (750, 570) [Operational Resilience] --- */}
            <g id="node-6">
              <polygon points="710,555 750,535 790,555 750,575" fill="#251E3E" stroke="#A855F7" strokeWidth="1.5" />
              {/* Dual Cylinders */}
              <ellipse cx="735" cy="535" rx="14" ry="7" fill="#4C1D95" stroke="#E9D5FF" strokeWidth="2" />
              <ellipse cx="765" cy="550" rx="14" ry="7" fill="#4C1D95" stroke="#E9D5FF" strokeWidth="2" />
              <line x1="721" y1="535" x2="721" y2="560" stroke="#E9D5FF" strokeWidth="2" />
              <line x1="749" y1="535" x2="749" y2="560" stroke="#E9D5FF" strokeWidth="2" />
            </g>


            {/* ========================================================
                4. SLEEK DARK CALLOUT CARDS & POINTER LINES
               ======================================================== */}

            {/* CALLOUT 1: 24/7 CONTINUOUS MONITORING (Top Left) */}
            <g id="badge-1">
              <line x1="220" y1="140" x2="420" y2="140" stroke="#A855F7" strokeWidth="1.5" strokeDasharray="3 3" />
              <line x1="420" y1="140" x2="420" y2="275" stroke="#A855F7" strokeWidth="1.5" strokeDasharray="3 3" />
              <circle cx="420" cy="275" r="5" fill="#A855F7" filter="url(#purple-glow)" />
              
              <rect x="100" y="115" width="200" height="50" rx="8" fill="#0D0B14" stroke="#A855F7" strokeWidth="1.5" />
              <text x="115" y="138" fontSize="15" fontWeight="bold" fontFamily="sans-serif" fill="#FFFFFF">24/7</text>
              <text x="115" y="153" fontSize="9" fontFamily="monospace" fill="#9CA3AF" letterSpacing="1.5">CONTINUOUS MONITORING</text>
            </g>

            {/* CALLOUT 2: ADAPTIVE THREAT RESPONSE (Top Right) */}
            <g id="badge-2">
              <line x1="980" y1="140" x2="780" y2="140" stroke="#A855F7" strokeWidth="1.5" strokeDasharray="3 3" />
              <line x1="780" y1="140" x2="780" y2="310" stroke="#A855F7" strokeWidth="1.5" strokeDasharray="3 3" />
              <circle cx="780" cy="310" r="5" fill="#A855F7" filter="url(#purple-glow)" />
              
              <rect x="900" y="115" width="200" height="50" rx="8" fill="#0D0B14" stroke="#A855F7" strokeWidth="1.5" />
              <text x="915" y="138" fontSize="15" fontWeight="bold" fontFamily="sans-serif" fill="#FFFFFF">ADAPTIVE</text>
              <text x="915" y="153" fontSize="9" fontFamily="monospace" fill="#9CA3AF" letterSpacing="1.5">THREAT RESPONSE</text>
            </g>

            {/* CALLOUT 3: 100% SECURITY VISIBILITY (Mid Left) */}
            <g id="badge-3">
              <line x1="160" y1="330" x2="370" y2="330" stroke="#A855F7" strokeWidth="1.5" strokeDasharray="3 3" />
              <line x1="370" y1="330" x2="370" y2="430" stroke="#A855F7" strokeWidth="1.5" strokeDasharray="3 3" />
              <circle cx="370" cy="430" r="5" fill="#38BDF8" filter="url(#purple-glow)" />
              
              <rect x="50" y="305" width="200" height="50" rx="8" fill="#0D0B14" stroke="#A855F7" strokeWidth="1.5" />
              <text x="65" y="328" fontSize="15" fontWeight="bold" fontFamily="sans-serif" fill="#FFFFFF">100%</text>
              <text x="65" y="343" fontSize="9" fontFamily="monospace" fill="#9CA3AF" letterSpacing="1.5">SECURITY VISIBILITY</text>
            </g>

            {/* CALLOUT 4: ZERO TRUST ACCESS PROTECTION (Mid Right) */}
            <g id="badge-4">
              <line x1="1040" y1="330" x2="830" y2="330" stroke="#A855F7" strokeWidth="1.5" strokeDasharray="3 3" />
              <line x1="830" y1="330" x2="830" y2="410" stroke="#A855F7" strokeWidth="1.5" strokeDasharray="3 3" />
              <circle cx="830" cy="410" r="5" fill="#38BDF8" filter="url(#purple-glow)" />
              
              <rect x="950" y="305" width="200" height="50" rx="8" fill="#0D0B14" stroke="#A855F7" strokeWidth="1.5" />
              <text x="965" y="328" fontSize="15" fontWeight="bold" fontFamily="sans-serif" fill="#FFFFFF">ZERO TRUST</text>
              <text x="965" y="343" fontSize="9" fontFamily="monospace" fill="#9CA3AF" letterSpacing="1.5">ACCESS PROTECTION</text>
            </g>

            {/* CALLOUT 5: CONTINUOUS OPERATIONAL INTEL (Bottom Left) */}
            <g id="badge-5">
              <line x1="220" y1="680" x2="450" y2="680" stroke="#A855F7" strokeWidth="1.5" strokeDasharray="3 3" />
              <line x1="450" y1="680" x2="450" y2="530" stroke="#A855F7" strokeWidth="1.5" strokeDasharray="3 3" />
              <circle cx="450" cy="530" r="5" fill="#A855F7" filter="url(#purple-glow)" />
              
              <rect x="80" y="655" width="210" height="50" rx="8" fill="#0D0B14" stroke="#A855F7" strokeWidth="1.5" />
              <text x="95" y="678" fontSize="15" fontWeight="bold" fontFamily="sans-serif" fill="#FFFFFF">CONTINUOUS</text>
              <text x="95" y="693" fontSize="9" fontFamily="monospace" fill="#9CA3AF" letterSpacing="1.5">OPERATIONAL INTEL</text>
            </g>

            {/* CALLOUT 6: ENTERPRISE OPERATIONAL RESILIENCE (Bottom Right) */}
            <g id="badge-6">
              <line x1="980" y1="680" x2="750" y2="680" stroke="#A855F7" strokeWidth="1.5" strokeDasharray="3 3" />
              <line x1="750" y1="680" x2="750" y2="535" stroke="#A855F7" strokeWidth="1.5" strokeDasharray="3 3" />
              <circle cx="750" cy="535" r="5" fill="#A855F7" filter="url(#purple-glow)" />
              
              <rect x="910" y="655" width="210" height="50" rx="8" fill="#0D0B14" stroke="#A855F7" strokeWidth="1.5" />
              <text x="925" y="678" fontSize="15" fontWeight="bold" fontFamily="sans-serif" fill="#FFFFFF">ENTERPRISE</text>
              <text x="925" y="693" fontSize="9" fontFamily="monospace" fill="#9CA3AF" letterSpacing="1.5">OPERATIONAL RESILIENCE</text>
            </g>


            {/* ========================================================
                5. TELEMETRY HUD OVERLAY CARD (TOP-LEFT CORNER)
               ======================================================== */}
            <g id="telemetry-hud" transform="translate(60, 40)">
              <rect width="220" height="155" rx="8" fill="#08060F" stroke="#A855F7" strokeWidth="1.5" />
              
              {/* Header */}
              <rect width="220" height="30" rx="8" fill="#1A152B" />
              <text x="14" y="20" fontSize="10" fontFamily="monospace" fontWeight="bold" fill="#A855F7" letterSpacing="1.5">
                BASTION CORE OBJECT
              </text>
              
              {/* Status Rows */}
              <text x="14" y="52" fontSize="10" fontFamily="monospace" fill="#9CA3AF">Status</text>
              <circle cx="140" cy="49" r="4" fill="#10B981" />
              <text x="150" y="52" fontSize="10" fontFamily="monospace" fontWeight="bold" fill="#10B981">RUNNING</text>

              <text x="14" y="74" fontSize="10" fontFamily="monospace" fill="#9CA3AF">Monitoring</text>
              <text x="140" y="74" fontSize="10" fontFamily="monospace" fill="#FFFFFF">24/7 ACTIVE</text>

              <text x="14" y="96" fontSize="10" fontFamily="monospace" fill="#9CA3AF">Threat Latency</text>
              <text x="140" y="96" fontSize="10" fontFamily="monospace" fill="#38BDF8">&lt; 0.2ms</text>

              <text x="14" y="118" fontSize="10" fontFamily="monospace" fill="#9CA3AF">Visibility</text>
              <text x="140" y="118" fontSize="10" fontFamily="monospace" fill="#FFFFFF">100% COVERAGE</text>

              <text x="14" y="140" fontSize="10" fontFamily="monospace" fill="#9CA3AF">Uptime Score</text>
              <text x="140" y="140" fontSize="10" fontFamily="monospace" fontWeight="bold" fill="#FFFFFF">99.99%</text>
            </g>

          </svg>
        </div>
      </div>
    </section>
  );
}
