'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { SpotlightButton } from '@/components/ui/SpotlightButton';

type Status = 'yes' | 'no' | 'warn';

interface ComparisonRow {
  capability: string;
  aiChat: Status;
  consulting: Status;
  automation: Status;
  aivory: Status;
}

const ROWS: ComparisonRow[] = [
  { capability: 'Business Understanding', aiChat: 'no', consulting: 'yes', automation: 'warn', aivory: 'yes' },
  { capability: 'AI Deployment', aiChat: 'warn', consulting: 'no', automation: 'yes', aivory: 'yes' },
  { capability: 'Workflow Design', aiChat: 'no', consulting: 'yes', automation: 'warn', aivory: 'yes' },
  { capability: 'Continuous Platform', aiChat: 'no', consulting: 'no', automation: 'yes', aivory: 'yes' },
  { capability: 'Executive Visibility', aiChat: 'no', consulting: 'warn', automation: 'warn', aivory: 'yes' },
];

const COLUMNS: { key: keyof Omit<ComparisonRow, 'capability'>; label: string }[] = [
  { key: 'aiChat', label: 'AI Chat' },
  { key: 'consulting', label: 'Consulting' },
  { key: 'automation', label: 'Automation' },
  { key: 'aivory', label: 'Aivory' },
];

function StatusIcon({ status, highlight = false }: { status: Status; highlight?: boolean }) {
  if (status === 'yes') {
    return (
      <svg
        className={`w-4 h-4 ${highlight ? 'text-emerald-400' : 'text-[#bbe2ef]'}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
      </svg>
    );
  }
  if (status === 'warn') {
    return (
      <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v3.75m0 3.75h.008M10.29 3.86l-8.18 14.18A1.5 1.5 0 003.42 20.4h17.16a1.5 1.5 0 001.31-2.36L13.71 3.86a1.5 1.5 0 00-2.42 0z" />
      </svg>
    );
  }
  return (
    <svg className="w-4 h-4 text-red-400/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

export default function EnterpriseComparisonSection() {
  const reduceMotion = useReducedMotion();

  const rowVariants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring' as const, damping: 25, stiffness: 200 },
    },
  };

  return (
    <section className="w-full py-16 md:py-24 px-6 relative">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <SpotlightButton
          className="mb-6 pointer-events-auto hover:-translate-y-0 inline-flex"
          style={{
            borderWidth: '0.5px',
            borderStyle: 'solid',
            borderColor: 'rgba(255,255,255,0.1)',
            cursor: 'default',
          }}
          icon={false}
        >
          COMPETITIVE LANDSCAPE
        </SpotlightButton>
        <h3
          className="text-4xl md:text-5xl font-light tracking-normal"
          style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 300 }}
        >
          Why Enterprise Choose <span style={{ color: '#e4effd' }}>Aivory.</span>
        </h3>
      </div>

      <motion.div
        className="max-w-4xl mx-auto rounded-2xl border border-white/[0.08] bg-white/[0.02] overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={{ visible: { transition: { staggerChildren: reduceMotion ? 0 : 0.08 } } }}
      >
        {/* Header row */}
        <div className="grid grid-cols-[1.4fr_repeat(4,0.8fr)] md:grid-cols-[1.6fr_repeat(4,0.85fr)] px-4 md:px-8 py-4 border-b border-white/[0.08]">
          <span className="text-[11px] uppercase tracking-wider text-white/40 font-light">Capabilities</span>
          {COLUMNS.map((col) =>
            col.key === 'aivory' ? (
              <span key={col.key} className="flex items-center justify-center">
                <img
                  src="/aivory-logo.svg"
                  alt="Aivory"
                  width={383}
                  height={79}
                  className="h-3 w-auto object-contain brightness-0 invert opacity-90"
                />
              </span>
            ) : (
              <span
                key={col.key}
                className="text-[11px] uppercase tracking-wider font-light text-center text-white/40"
              >
                {col.label}
              </span>
            )
          )}
        </div>

        {ROWS.map((row, i) => (
          <motion.div
            key={row.capability}
            variants={rowVariants}
            className={`grid grid-cols-[1.4fr_repeat(4,0.8fr)] md:grid-cols-[1.6fr_repeat(4,0.85fr)] items-center px-4 md:px-8 py-4 ${
              i !== ROWS.length - 1 ? 'border-b border-white/[0.06]' : ''
            }`}
          >
            <span className="text-[13px] md:text-sm text-white/80 font-light text-left">{row.capability}</span>
            {COLUMNS.map((col) => (
              <span
                key={col.key}
                className={`flex items-center justify-center ${
                  col.key === 'aivory' ? 'bg-[#e4effd]/[0.06] rounded-lg py-1.5 -mx-1' : ''
                }`}
              >
                <StatusIcon status={row[col.key]} highlight={col.key === 'aivory'} />
              </span>
            ))}
          </motion.div>
        ))}
      </motion.div>

      <p className="text-center text-white/40 text-sm font-light mt-8 max-w-xl mx-auto">
        Nobody else combines consulting-grade business understanding with software-grade scalability.
      </p>
    </section>
  );
}
