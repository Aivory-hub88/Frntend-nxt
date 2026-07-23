'use client';

import { FadeUp, FadeUpChild } from './FadeUp';
import { motion } from 'framer-motion';

const metrics = [
  { id: 'n1', value: '24/7', label: 'Continuous Monitoring', x: 200, y: 200, path: 'M 600 400 L 400 400 L 200 200' },
  { id: 'n2', value: 'Adaptive', label: 'Threat Response', x: 1000, y: 200, path: 'M 600 400 L 800 400 L 1000 200' },
  { id: 'n3', value: '100%', label: 'Security Visibility', x: 150, y: 450, path: 'M 600 400 L 150 450' },
  { id: 'n4', value: 'Zero Trust', label: 'Access Protection', x: 1050, y: 450, path: 'M 600 400 L 1050 450' },
  { id: 'n5', value: 'Continuous', label: 'Operational Intelligence', x: 250, y: 650, path: 'M 600 400 L 400 400 L 250 650' },
  { id: 'n6', value: 'Enterprise', label: 'Operational Resilience', x: 950, y: 650, path: 'M 600 400 L 800 400 L 950 650' },
];

export default function BastionMetrics() {
  return (
    <section className="bg-transparent text-white py-32 border-t border-white/5 relative z-10">
      
      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-20">
        <FadeUp className="mb-12 md:mb-20">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-light leading-tight text-white mb-6 tracking-tight">
            Built for enterprise resilience.
          </h2>
          <div className="space-y-4 max-w-3xl text-lg text-[#B3B3B3] font-light leading-relaxed">
            <p>Modern security is measured by resilience. Not only by prevention.</p>
            <p>Bastion continuously monitors, analyses, and strengthens your defensive posture while maintaining operational continuity.</p>
          </div>
        </FadeUp>
      </div>

      {/* Mobile Layout (Standard Grid) */}
      <div className="md:hidden max-w-7xl mx-auto px-6 relative z-20">
        <FadeUp staggerChildren={0.1} className="grid grid-cols-2 gap-x-8 gap-y-12">
          {metrics.map((metric) => (
            <FadeUpChild key={`mobile-${metric.id}`} className="flex flex-col bg-black/40 backdrop-blur-sm border border-white/10 p-5 rounded-xl">
              <span className="text-3xl font-light text-white mb-2 tracking-tight">
                {metric.value}
              </span>
              <span className="text-xs text-[#B3B3B3] uppercase tracking-widest">
                {metric.label}
              </span>
            </FadeUpChild>
          ))}
        </FadeUp>
      </div>

      {/* Desktop Layout (Palantir HUD Animation over original background) */}
      <div className="hidden md:block relative w-full max-w-[1400px] mx-auto h-[800px] -mt-20 pointer-events-none">
        
        {/* Transparent SVG Canvas for Callout Lines */}
        <svg
          viewBox="0 0 1200 800"
          className="absolute inset-0 w-full h-full"
        >
          {metrics.map((metric, i) => (
            <g key={`connection-${metric.id}`}>
              {/* Animated drawing line */}
              <motion.path
                d={metric.path}
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="1"
                strokeOpacity="0.2"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.5, delay: 0.5 + (i * 0.1), ease: "easeOut" }}
              />
              {/* Anchor point at the card */}
              <motion.circle
                cx={metric.x}
                cy={metric.y}
                r="3"
                fill="#FFFFFF"
                opacity="0.5"
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 0.5 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 2 + (i * 0.1) }}
              />
              {/* Inner glowing dot */}
              <motion.circle
                cx={metric.x}
                cy={metric.y}
                r="1"
                fill="#FFFFFF"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 2.2 + (i * 0.1) }}
              />
            </g>
          ))}
        </svg>

        {/* Floating Metric Cards (HTML) */}
        {metrics.map((metric, i) => (
          <motion.div
            key={`card-${metric.id}`}
            className="absolute flex flex-col items-center justify-center pointer-events-auto"
            style={{
              left: `${(metric.x / 1200) * 100}%`,
              top: `${(metric.y / 800) * 100}%`,
              transform: 'translate(-50%, -50%)',
            }}
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 1 + (i * 0.1), type: "spring" }}
          >
            {/* Gentle continuous float */}
            <motion.div
              animate={{ y: [-4, 4, -4] }}
              transition={{ duration: 6 + (i % 3), repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
              className="bg-black/50 backdrop-blur-md border border-white/10 px-8 py-5 rounded-xl flex flex-col items-center hover:bg-black/70 hover:border-white/30 transition-all duration-300"
            >
              <span className="text-4xl lg:text-5xl font-light text-white tracking-tight mb-2">
                {metric.value}
              </span>
              <span className="text-[10px] lg:text-xs text-[#B3B3B3] uppercase tracking-[0.2em] font-medium whitespace-nowrap">
                {metric.label}
              </span>
            </motion.div>
          </motion.div>
        ))}

      </div>
    </section>
  );
}
