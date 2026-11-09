import type { CSSProperties } from 'react';
import { BokehGradient, type BokehScene } from '@/components/ui/BokehGradient';
import { ParametricPattern } from '@/components/ui/ParametricPattern';
import s from './landing.module.css';

type Status = 'yes' | 'no' | 'warn';

const ROWS: Array<{ capability: string; detail: string; values: [Status, Status, Status] }> = [
  { capability: 'Business Understanding', detail: 'Learns your processes, data and goals', values: ['no', 'yes', 'warn'] },
  { capability: 'AI Deployment', detail: 'Puts working agents into your tools', values: ['warn', 'no', 'yes'] },
  { capability: 'Workflow Design', detail: 'Maps how work should flow, end to end', values: ['no', 'yes', 'warn'] },
  { capability: 'Continuous Platform', detail: 'Keeps running and improving after launch', values: ['no', 'no', 'yes'] },
  { capability: 'Executive Visibility', detail: 'One view of impact for leadership', values: ['no', 'warn', 'warn'] },
];

const RIVALS = ['AI Chat', 'Consulting', 'Automation'];
const LABEL: Record<Status, string> = { yes: 'Yes', warn: 'Partly', no: 'No' };

/* Aivory's own trio (same world as the Operational plan card): deep blue field,
   a periwinkle-steel shape, a warm orange glow. The one colour moment of the section. */
const SCENE: BokehScene = {
  colors: ['#0a1838', '#1d4a9a', '#5a6fb0', '#e46a24', '#9aaedc', '#9aaedc'],
  mode: 'tri',
  scale: 0.55,
  seed: 5.2,
  light: 0.35,
  shadow: 0.55,
};

/* Every cell is placed explicitly (the card holds the last column on every row, which breaks
   auto-placement). Rows pass their line numbers down as custom properties: --r on desktop,
   --rl (title) and --rm (marks) on mobile, where the title sits on its own line. */
const rowLines = (i: number) => ({ '--r': String(i + 2), '--rl': String(2 * i + 2), '--rm': String(2 * i + 3) }) as CSSProperties;
const HEAD_LINES = { '--r': '1', '--rl': '1', '--rm': '1' } as CSSProperties;

/** Neutral marks for the other columns: filled = yes, half = partly, dashed ring = no. */
function Mark({ status }: { status: Status }) {
  return (
    <span className={s.cmpMark} data-status={status}>
      <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
        {status === 'yes' && (
          <>
            <circle cx="11" cy="11" r="10" fill="currentColor" />
            <path d="M6.8 11.3l2.8 2.8 5.6-6" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </>
        )}
        {status === 'warn' && (
          <>
            <circle cx="11" cy="11" r="9.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path d="M11 1.75a9.25 9.25 0 0 1 0 18.5z" fill="currentColor" />
          </>
        )}
        {status === 'no' && <circle cx="11" cy="11" r="9.25" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2.4 2.6" />}
      </svg>
      <span className={s.cmpMarkLabel}>{LABEL[status]}</span>
    </span>
  );
}

function AivoryMark() {
  return (
    <span className={s.cmpYes}>
      <span className={s.cmpYesDot}>
        <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
          <path d="M2.6 6.2l2.2 2.2 4.6-4.9" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span className={s.cmpMarkLabel}>Included</span>
    </span>
  );
}

export default function ComparisonSection() {
  return (
    <section id="comparison" className={`${s.band} ${s.light}`}>
      <div className={s.wrap}>
        <div className={s.head}>
          <span className={s.eyebrow}>Why <span className={s.eyebrowLogo} role="img" aria-label="Aivory" /></span>
          <h2 className={s.h2}>
            One platform instead of
            <br />
            <span className={s.dim}>chat, consultants and scripts</span>
          </h2>
        </div>

        <div className={s.cmp}>
          <div className={s.cmpGrid} role="table" aria-label="Aivory compared with AI chat, consulting and automation">
            {/* The Aivory column: one gradient card (with a parametric facade pattern) behind the last column, overhanging the panel. */}
            <BokehGradient scene={SCENE} className={s.cmpCard}>
              <ParametricPattern kind="lattice" />
            </BokehGradient>

            <div className={s.cmpRow} role="row" style={HEAD_LINES}>
              <span className={`${s.cmpHead} ${s.cmpCap}`} role="columnheader">Capabilities</span>
              {RIVALS.map((r) => (
                <span key={r} className={s.cmpHead} role="columnheader">{r}</span>
              ))}
              <span className={`${s.cmpHead} ${s.cmpMe}`} role="columnheader">
                <span className={s.cmpLogo} role="img" aria-label="Aivory" />
              </span>
            </div>

            {ROWS.map((row, r) => (
              <div key={row.capability} className={s.cmpRow} role="row" style={rowLines(r)}>
                <span className={`${s.cmpCell} ${s.cmpCap}`} role="rowheader">
                  <span className={s.cmpTitle}>{row.capability}</span>
                  <span className={s.cmpDetail}>{row.detail}</span>
                </span>
                {row.values.map((v, i) => (
                  <span key={RIVALS[i]} className={s.cmpCell} role="cell"><Mark status={v} /></span>
                ))}
                <span className={`${s.cmpCell} ${s.cmpMe}`} role="cell"><AivoryMark /></span>
              </div>
            ))}
          </div>
        </div>

        <div className={s.cmpLegend} aria-hidden="true">
          <Mark status="yes" />
          <Mark status="warn" />
          <Mark status="no" />
        </div>
      </div>
    </section>
  );
}
