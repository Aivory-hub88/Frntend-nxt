'use client';

import { FadeUp } from './FadeUp';
import { motion } from 'framer-motion';

const nodes = [
  { id: 'n1', x: 200, y: 200, value: '24/7', label: 'Continuous Monitoring' },
  { id: 'n2', x: 700, y: 200, value: 'Adaptive', label: 'Threat Response' },
  { id: 'n3', x: 450, y: 450, value: 'Enterprise', label: 'Operational Resilience' },
  { id: 'n4', x: 200, y: 700, value: '100%', label: 'Security Visibility' },
  { id: 'n5', x: 700, y: 700, value: 'Continuous', label: 'Operational Intelligence' },
  { id: 'n6', x: 900, y: 450, value: 'Zero Trust', label: 'Access Protection' },
];

const paths = [
  { id: 'p1', from: 'n1', to: 'n2' },
  { id: 'p2', from: 'n1', to: 'n3' },
  { id: 'p3', from: 'n2', to: 'n6' },
  { id: 'p4', from: 'n3', to: 'n2' },
  { id: 'p5', from: 'n3', to: 'n4' },
  { id: 'p6', from: 'n3', to: 'n5' },
  { id: 'p7', from: 'n4', to: 'n1' },
  { id: 'p8', from: 'n5', to: 'n6' },
  { id: 'p9', from: 'n6', to: 'n3' },
];

const getPathString = (fromId: string, toId: string) => {
  const from = nodes.find(n => n.id === fromId)!;
  const to = nodes.find(n => n.id === toId)!;
  // Draw a path with a right angle (Manhattan routing) for a more technical circuit board look
  // rather than a straight diagonal line.
  const midX = from.x;
  const midY = to.y;
  return `M ${from.x} ${from.y} L ${midX} ${midY} L ${to.x} ${to.y}`;
};

export default function BastionMetrics() {
  return (
    <section className="bg-transparent text-white py-32 border-t border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <FadeUp className="mb-8 md:mb-0 relative z-20">
          <h2 className="text-3xl md:text-5xl font-light leading-tight text-[#FFFFFF] mb-6">
            Built for enterprise resilience.
          </h2>
        </FadeUp>
      </div>

      {/* Isometric Visualization Container */}
      <div className="w-full h-[600px] md:h-[800px] relative mt-12 md:-mt-24 pointer-events-none flex justify-center items-center">
        
        {/* The 3D Projected Plane */}
        <div
          className="relative w-[1000px] h-[1000px] flex-shrink-0 origin-center"
          style={{
            transform: 'rotateX(60deg) rotateZ(-45deg) scale(0.7)',
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Base Grid */}
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'linear-gradient(to right, #4b5563 1px, transparent 1px), linear-gradient(to bottom, #4b5563 1px, transparent 1px)',
              backgroundSize: '50px 50px'
            }}
          />

          {/* SVG Connecting Paths */}
          <svg className="absolute inset-0 w-full h-full overflow-visible">
            {paths.map((path, i) => (
              <motion.path
                key={path.id}
                d={getPathString(path.from, path.to)}
                fill="none"
                stroke="#521cd5"
                strokeWidth="2"
                strokeOpacity="0.4"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 2, delay: i * 0.1, ease: "easeInOut" }}
              />
            ))}
            
            {/* Animated Data Pulses */}
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
                  strokeDasharray: ["0 1000", "50 1000", "0 1000"],
                  strokeDashoffset: [0, -1000]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                  delay: i * 0.4
                }}
                style={{ filter: 'drop-shadow(0 0 4px #FFFFFF)' }}
              />
            ))}
          </svg>

          {/* Render Text Nodes */}
          {nodes.map((node, i) => (
            <motion.div
              key={node.id}
              className="absolute flex flex-col items-center justify-center whitespace-nowrap"
              style={{
                left: node.x,
                top: node.y,
                // Reverse the isometric transform so text faces the screen perfectly flat!
                transform: 'translate(-50%, -50%) rotateZ(45deg) rotateX(-60deg)',
              }}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: 1 + i * 0.1 }}
            >
              {/* Base Glowing Dot on the grid */}
              <div 
                className="absolute w-4 h-4 rounded-full bg-[#521cd5]" 
                style={{
                  transform: 'rotateX(60deg) rotateZ(-45deg) translateZ(-20px)',
                  boxShadow: '0 0 20px 5px rgba(82, 28, 213, 0.5)'
                }}
              />

              <div className="bg-black/60 backdrop-blur-md border border-white/10 px-6 py-4 rounded-xl flex flex-col items-center shadow-[0_0_30px_rgba(82,28,213,0.15)] mt-[-60px]">
                <span className="text-3xl md:text-4xl font-light text-white tracking-tight mb-1">
                  {node.value}
                </span>
                <span className="text-xs md:text-sm text-[#B3B3B3] uppercase tracking-widest font-medium">
                  {node.label}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
