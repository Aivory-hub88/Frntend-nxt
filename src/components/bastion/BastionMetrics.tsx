'use client';

import { FadeUp } from './FadeUp';
import { motion } from 'framer-motion';

const nodes = [
  { id: 'n1', x: 250, y: 250, value: '24/7', label: 'Continuous Monitoring' },
  { id: 'n2', x: 750, y: 350, value: 'Adaptive', label: 'Threat Response' },
  { id: 'n3', x: 300, y: 550, value: 'Enterprise', label: 'Operational Resilience' },
  { id: 'n4', x: 800, y: 650, value: '100%', label: 'Security Visibility' },
  { id: 'n5', x: 250, y: 850, value: 'Continuous', label: 'Operational Intelligence' },
  { id: 'n6', x: 750, y: 950, value: 'Zero Trust', label: 'Access Protection' },
];

const paths = [
  { id: 'p1', from: 'n1', to: 'n2' },
  { id: 'p2', from: 'n1', to: 'n3' },
  { id: 'p3', from: 'n2', to: 'n4' },
  { id: 'p4', from: 'n3', to: 'n5' },
  { id: 'p5', from: 'n3', to: 'n4' },
  { id: 'p6', from: 'n4', to: 'n6' },
  { id: 'p7', from: 'n5', to: 'n6' },
];

const getPathString = (fromId: string, toId: string) => {
  const from = nodes.find(n => n.id === fromId)!;
  const to = nodes.find(n => n.id === toId)!;
  return `M ${from.x} ${from.y} L ${from.x} ${to.y} L ${to.x} ${to.y}`;
};

export default function BastionMetrics() {
  // Layer Z heights
  const LAYER1_Z = 0;
  const LAYER2_Z = 60;
  const LAYER3_Z = 120;
  const PANEL_Z = 300;
  const LASER_HEIGHT = PANEL_Z - LAYER3_Z;

  return (
    <section className="bg-transparent text-white py-32 border-t border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <FadeUp className="mb-8 md:mb-0 relative z-20">
          <h2 className="text-3xl md:text-5xl font-light leading-tight text-[#FFFFFF] mb-6">
            Built for enterprise resilience.
          </h2>
        </FadeUp>
      </div>

      {/* 3D Perspective Container */}
      <div 
        className="w-full h-[700px] md:h-[1000px] relative mt-12 md:-mt-12 pointer-events-none flex justify-center items-center"
        style={{ perspective: '2500px' }}
      >
        {/* Isometric Rotator with continuous levitation */}
        <motion.div
          className="relative w-[1000px] h-[1000px] flex-shrink-0 origin-center"
          style={{
            transformStyle: 'preserve-3d',
            transform: 'rotateX(60deg) rotateZ(-45deg) scale(0.65)',
          }}
          animate={{
            y: [-10, 10, -10],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {/* ==========================================
              LAYER 1: Security Foundation (Bottom)
             ========================================== */}
          <motion.div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm border border-white/5 rounded-3xl overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.8)]"
            style={{ 
              transform: `translateZ(${LAYER1_Z}px)`,
              backgroundImage: 'radial-gradient(circle at center, rgba(82,28,213,0.15) 0%, transparent 70%)'
            }}
            initial={{ opacity: 0, translateZ: -200 }}
            whileInView={{ opacity: 1, translateZ: LAYER1_Z }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            {/* Dotted Matrix */}
            <div 
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
                backgroundSize: '40px 40px',
                backgroundPosition: '0 0'
              }}
            />
          </motion.div>


          {/* ==========================================
              LAYER 2: Operational Intelligence (Middle)
             ========================================== */}
          <motion.div 
            className="absolute inset-0 bg-white/[0.02] border border-[#521cd5]/20 rounded-3xl"
            style={{ 
              transform: `translateZ(${LAYER2_Z}px)`,
              boxShadow: 'inset 0 0 50px rgba(82,28,213,0.1)'
            }}
            initial={{ opacity: 0, translateZ: LAYER1_Z }}
            whileInView={{ opacity: 1, translateZ: LAYER2_Z }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
          >
            {/* Animated SVG Circuitry */}
            <svg className="absolute inset-0 w-full h-full overflow-visible">
              {paths.map((path, i) => (
                <motion.path
                  key={path.id}
                  d={getPathString(path.from, path.to)}
                  fill="none"
                  stroke="#521cd5"
                  strokeWidth="2"
                  strokeOpacity="0.5"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 2, delay: 0.5 + i * 0.1, ease: "easeInOut" }}
                />
              ))}
              
              {/* Data Pulses */}
              {paths.map((path, i) => (
                <motion.path
                  key={`pulse-${path.id}`}
                  d={getPathString(path.from, path.to)}
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray="0 1 1000"
                  animate={{
                    strokeDasharray: ["0 1000", "40 1000", "0 1000"],
                    strokeDashoffset: [0, -1000]
                  }}
                  transition={{
                    duration: 3 + (i % 2),
                    repeat: Infinity,
                    ease: "linear",
                    delay: i * 0.3
                  }}
                  style={{ filter: 'drop-shadow(0 0 6px #FFFFFF)' }}
                />
              ))}
            </svg>
          </motion.div>


          {/* ==========================================
              LAYER 3: Active Defense Nodes (Top)
             ========================================== */}
          <motion.div 
            className="absolute inset-0 pointer-events-none"
            style={{ transform: `translateZ(${LAYER3_Z}px)` }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            {nodes.map(node => (
              <div 
                key={`node-base-${node.id}`}
                className="absolute w-8 h-8 rounded-full border border-[#521cd5]/50 flex items-center justify-center bg-black"
                style={{
                  left: node.x,
                  top: node.y,
                  transform: 'translate(-50%, -50%)',
                  boxShadow: '0 0 20px rgba(82,28,213,0.3)'
                }}
              >
                <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_10px_#FFFFFF]" />
              </div>
            ))}
          </motion.div>


          {/* ==========================================
              VERTICAL LASERS & FLOATING PANELS
             ========================================== */}
          {nodes.map((node, i) => (
            <div key={`vertical-${node.id}`} className="absolute" style={{ left: node.x, top: node.y, transformStyle: 'preserve-3d' }}>
              
              {/* Vertical Laser Connection */}
              <motion.div
                className="absolute origin-top bg-gradient-to-b from-[#521cd5] to-transparent"
                style={{
                  width: '2px',
                  height: `${LASER_HEIGHT}px`,
                  left: '-1px',
                  top: 0,
                  transform: `translateZ(${LAYER3_Z}px) rotateX(-90deg)`,
                }}
                initial={{ scaleY: 0, opacity: 0 }}
                whileInView={{ scaleY: 1, opacity: 0.6 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 1 + (i * 0.15) }}
              />

              {/* Floating Text Panel (Inverse Rotated for perfect legibility) */}
              <motion.div
                className="absolute flex flex-col items-center justify-center whitespace-nowrap"
                style={{
                  transform: `translateZ(${PANEL_Z}px) translate(-50%, -50%) rotateZ(45deg) rotateX(-60deg)`,
                }}
                initial={{ opacity: 0, scale: 0.8, translateZ: LAYER3_Z }}
                whileInView={{ opacity: 1, scale: 1, translateZ: PANEL_Z }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 1.2 + (i * 0.15), type: "spring" }}
              >
                <div className="bg-[#050505]/80 backdrop-blur-xl border border-white/10 px-8 py-5 rounded-2xl flex flex-col items-center shadow-[0_20px_40px_rgba(0,0,0,0.8),_0_0_30px_rgba(82,28,213,0.2)]">
                  <span className="text-4xl md:text-5xl font-light text-white tracking-tight mb-2 drop-shadow-md">
                    {node.value}
                  </span>
                  <span className="text-[10px] md:text-xs text-[#B3B3B3] uppercase tracking-[0.2em] font-medium">
                    {node.label}
                  </span>
                </div>
              </motion.div>

            </div>
          ))}

        </motion.div>
      </div>
    </section>
  );
}
