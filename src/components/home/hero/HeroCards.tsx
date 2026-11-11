'use client';

import { useEffect, useRef, type CSSProperties, type MutableRefObject, type ReactNode } from 'react';
import styles from './HeroOrbit.module.css';

/** Draws the Aether orb at time `t` (seconds). Registered by the card, called by the orbit loop. */
export type OrbDraw = (t: number) => void;

const TAU = Math.PI * 2;

/* ------------------------------------------------------------------ Aether orb */

// Nodes on a sphere (Fibonacci lattice), each linked to its nearest neighbours,
// plus a few long chords through the core. Built once, shared by every orb.
const ORB_POINTS: [number, number, number][] = [];
const ORB_EDGES: [number, number][] = [];
(function buildOrb() {
  const n = 86;
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (2 * (i + 0.5)) / n;
    const r = Math.sqrt(1 - y * y);
    ORB_POINTS.push([Math.cos(i * golden) * r, y, Math.sin(i * golden) * r]);
  }
  for (let i = 0; i < n; i++) {
    const d: [number, number][] = [];
    for (let j = 0; j < n; j++) {
      if (j === i) continue;
      const dx = ORB_POINTS[i][0] - ORB_POINTS[j][0];
      const dy = ORB_POINTS[i][1] - ORB_POINTS[j][1];
      const dz = ORB_POINTS[i][2] - ORB_POINTS[j][2];
      d.push([dx * dx + dy * dy + dz * dz, j]);
    }
    d.sort((a, b) => a[0] - b[0]);
    for (let j = 0; j < 3; j++) if (d[j][1] > i || j === 2) ORB_EDGES.push([i, d[j][1]]);
  }
  for (let i = 0; i < 14; i++) ORB_EDGES.push([(i * 7) % n, (i * 29 + 11) % n]);
})();

function makeOrbDrawer(ctx: CanvasRenderingContext2D): OrbDraw {
  const R = 118;
  const cx = 180;
  const cy = 168;
  const tilt = 0.42;
  const ct = Math.cos(tilt);
  const st = Math.sin(tilt);
  const grad = ctx.createLinearGradient(40, 40, 320, 320);
  grad.addColorStop(0, '#1d4a9a');
  grad.addColorStop(0.55, '#5d77a3');
  grad.addColorStop(1, '#e46a24');
  const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 1.25);
  glow.addColorStop(0, 'rgba(90,130,220,.26)');
  glow.addColorStop(0.6, 'rgba(120,150,230,.1)');
  glow.addColorStop(1, 'rgba(255,255,255,0)');
  const q: [number, number, number][] = ORB_POINTS.map(() => [0, 0, 0]);

  return (t) => {
    const a = t * 0.32;
    const ca = Math.cos(a);
    const sa = Math.sin(a);
    ctx.clearRect(0, 0, 360, 360);
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, 360, 360);
    for (let i = 0; i < ORB_POINTS.length; i++) {
      const p = ORB_POINTS[i];
      const x = p[0] * ca + p[2] * sa;
      const z0 = -p[0] * sa + p[2] * ca;
      q[i][0] = cx + x * R;
      q[i][1] = cy + (p[1] * ct - z0 * st) * R;
      q[i][2] = p[1] * st + z0 * ct;
    }
    ctx.strokeStyle = grad;
    ctx.fillStyle = grad;
    ctx.lineWidth = 1.4;
    for (const [ia, ib] of ORB_EDGES) {
      const A = q[ia];
      const B = q[ib];
      ctx.globalAlpha = 0.14 + (0.6 * ((A[2] + B[2]) / 2 + 1)) / 2;
      ctx.beginPath();
      ctx.moveTo(A[0], A[1]);
      ctx.lineTo(B[0], B[1]);
      ctx.stroke();
    }
    for (const p of q) {
      const k = (p[2] + 1) / 2;
      ctx.globalAlpha = 0.25 + 0.75 * k;
      ctx.beginPath();
      ctx.arc(p[0], p[1], 1.6 + 3 * k, 0, TAU);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  };
}

function AetherOrb({ drawRef }: { drawRef?: MutableRefObject<OrbDraw | null> }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const ctx = ref.current?.getContext('2d');
    if (!ctx) return;
    const draw = makeOrbDrawer(ctx);
    draw(9);
    if (drawRef) drawRef.current = draw;
    return () => {
      if (drawRef) drawRef.current = null;
    };
  }, [drawRef]);
  return <canvas ref={ref} width={360} height={360} className={styles.orbCanvas} aria-hidden="true" />;
}

/* ------------------------------------------------------------------ product UI crops */

/*
 * Two cards show the product itself rather than an illustration. They are
 * rebuilt in markup from the dashboard's own components (WorkflowNode and the
 * diagnostic report's ScoreRing + ROIMetricTile: same colours, radii, type
 * scale), with sample data, so they stay sharp at every ring size and carry
 * no account data.
 */

/** One workflow-builder node, expanded, with its dashed edges running off the card. */
const UiWorkflow = () => (
  <div className={styles.uiFlow} aria-hidden="true">
    <svg className={styles.uiEdges} viewBox="0 0 196 196" fill="none">
      <path className={styles.uiEdgeTrack} d="M-4 44 C 4 44, 6 60, 14 60" />
      <path className={styles.uiEdge} d="M-4 44 C 4 44, 6 60, 14 60" />
      <path className={styles.uiEdgeTrack} d="M182 60 C 190 60, 190 82, 200 82" />
      <path className={styles.uiEdge} d="M182 60 C 190 60, 190 82, 200 82" />
    </svg>
    <div className={styles.uiNode}>
      <i className={styles.uiDotL} />
      <i className={styles.uiDotR} />
      <div className={styles.uiNodeBar}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${IMG}/app-gmail.svg`} alt="" width={22} height={22} loading="lazy" decoding="async" />
        <span>
          <b>Trigger</b>
          <em>New invoice email</em>
        </span>
        <i className={styles.uiChevron}>
          <svg viewBox="0 0 12 12" width="8" height="8">
            <path d="M3 4.5 6 7.5 9 4.5" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </i>
      </div>
      <p className={styles.uiNodeBody}>
        <b>Read the PDF</b>
        Check totals against the PO
      </p>
    </div>
  </div>
);

/** Diagnostic report close-up: readiness ring plus two Financial Case cells. */
const RING_R = 24;
const RING_C = 2 * Math.PI * RING_R;
const UiReport = () => (
  <div className={styles.uiReport} aria-hidden="true">
    <div className={styles.uiScore}>
      <svg viewBox="0 0 64 64" width="64" height="64">
        <circle cx="32" cy="32" r={RING_R} className={styles.uiRingTrack} />
        <circle
          cx="32"
          cy="32"
          r={RING_R}
          className={styles.uiRingArc}
          strokeDasharray={`${(RING_C * 0.72).toFixed(1)} ${RING_C.toFixed(1)}`}
          transform="rotate(-90 32 32)"
        />
        <text x="32" y="33.5" className={styles.uiRingNum}>
          72
        </text>
      </svg>
      <span>
        <b>Sample report</b>
        <em>AI readiness</em>
      </span>
    </div>
    <dl className={styles.uiMetrics}>
      <div>
        <dt>Hours saved</dt>
        <dd>2,340</dd>
      </div>
      <div>
        <dt>Payback</dt>
        <dd>4.2 mo</dd>
      </div>
    </dl>
  </div>
);

/* ------------------------------------------------------------------ card bodies */

/** Bump (and rename the files) whenever the renders change: Cloudflare caches
 *  /landing/* for a year, so a new image needs a new URL. */
const RENDER_VERSION = 'v4';

/** Close-up 3D technical drawing (Three.js line render, baked to a transparent WebP). */
const Render = ({ name }: { name: string }) => (
  <img
    className={styles.render}
    src={`/landing/hero/render-${name}-${RENDER_VERSION}.webp`}
    alt=""
    aria-hidden="true"
    loading="lazy"
    decoding="async"
    draggable={false}
  />
)

const IMG = '/landing/hero';
const ICONS = '/integrations/icons';

type Drift = { src: string; w: number; x: number; y: number };
const APP_ICONS: Drift[] = [
  { src: `${IMG}/app-gmail.svg`, w: 54, x: 18, y: 24 },
  { src: `${ICONS}/slack.svg`, w: 44, x: 112, y: 12 },
  { src: `${ICONS}/notion.svg`, w: 38, x: 70, y: 66 },
  { src: `${IMG}/app-hubspot.svg`, w: 50, x: 14, y: 74 },
  { src: `${ICONS}/google-calendar.svg`, w: 32, x: 136, y: 74 },
  { src: `${ICONS}/shopify.svg`, w: 28, x: 84, y: 10 },
  { src: `${ICONS}/jira.svg`, w: 26, x: 150, y: 38 },
  { src: `${ICONS}/odoo.svg`, w: 52, x: 84, y: 96 },
];

type Head = { name: string; w: number; x: number; y: number; r: number; far?: boolean };
const HEADS: Head[] = [
  { name: 'ofira', w: 44, x: 6, y: 74, r: 9, far: true },
  { name: 'finn', w: 54, x: 128, y: 12, r: 10 },
  { name: 'teo', w: 66, x: 20, y: 14, r: -8 },
  { name: 'geno', w: 48, x: 138, y: 72, r: -7, far: true },
  { name: 'lex', w: 46, x: 84, y: 2, r: 5 },
  { name: 'aira', w: 80, x: 60, y: 40, r: 3 },
];

export type CardDef = {
  id: string;
  /** Extra class names from the module (surface + palette). */
  classes: string[];
  body: (o: { orbRef?: MutableRefObject<OrbDraw | null>; decorative: boolean }) => ReactNode;
};

const cap = (text: string) => <span className={styles.cap}>{text}</span>;
const photo = (src: string, alt: string, decorative: boolean) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img src={src} alt={decorative ? '' : alt} width={480} height={480} loading="lazy" decoding="async" />
);

/** Card order is the order around the ring. */

/** Glossy tags piled on each other: everything Aivory covers, in one stack. */
type Tag = { label: string; c: string; ink: string; x: number; y: number; r: number; size?: number };
/** Cool + ember: silvers and blues, one orange pill in front. */
const W = '#ffffff';
const TAGS: Tag[] = [
  { label: 'Email', c: '#c9d6ee', ink: '#16244a', x: -6, y: -40, r: -6 },
  { label: 'Workspace', c: '#5d77a3', ink: W, x: -18, y: -18, r: 4 },
  { label: 'CRM', c: '#17304f', ink: W, x: 40, y: -31, r: 12, size: 17 },
  { label: 'Automation', c: '#2b63c6', ink: W, x: 10, y: 22, r: 3 },
  { label: 'Enterprise AI', c: '#e46a24', ink: W, x: -2, y: 1, r: -4, size: 20 },
  { label: 'AI Agents', c: '#86aebb', ink: '#0e2a33', x: -16, y: 41, r: -5 },
];

export const HERO_CARDS: CardDef[] = [
  {
    id: 'audit',
    classes: ['tile', 'g2'],
    body: () => (
      <>
        <Render name="audit" />
        {cap('Governed, with a full audit trail')}
      </>
    ),
  },
  {
    id: 'streamline',
    classes: ['tile', 'g3'],
    body: () => (
      <>
        <Render name="streamline" />
        {cap('Streamline your business operations')}
      </>
    ),
  },
  {
    id: 'photo-celebrating',
    classes: ['glass', 'photo', 'zoom'],
    body: ({ decorative }) =>
      photo(`${IMG}/woman-celebrating.webp`, 'A woman celebrating with her laptop on an orange bean bag', decorative),
  },
  {
    id: 'ui-workflow',
    classes: ['ui'],
    body: () => (
      <>
        <UiWorkflow />
        {cap('Workflow builder')}
      </>
    ),
  },
  {
    id: 'aether',
    classes: ['glass'],
    body: ({ orbRef, decorative }) => (
      <>
        <AetherOrb drawRef={orbRef} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className={styles.orbLogo}
          src="/landing/aether/aivory-aether-black.svg"
          alt={decorative ? '' : 'Aivory Aether'}
          width={150}
          height={14}
          loading="lazy"
          decoding="async"
        />
      </>
    ),
  },
  {
    id: 'automate',
    classes: ['tile', 'g4'],
    body: () => (
      <>
        <Render name="automation" />
        {cap('Build any automation')}
      </>
    ),
  },
  {
    id: 'apps',
    classes: ['glass'],
    body: () => (
      <>
        <div className={styles.icons} aria-hidden="true">
          {APP_ICONS.map((a, i) => (
            <i
              key={a.src}
              style={{
                width: a.w,
                height: a.w,
                left: a.x,
                top: a.y,
                animationDuration: `${(5 + i * 0.9).toFixed(1)}s`,
                animationDelay: `-${(i * 1.3).toFixed(1)}s`,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={a.src} alt="" loading="lazy" decoding="async" />
            </i>
          ))}
        </div>
        {cap('Works with the apps you already use')}
      </>
    ),
  },
  {
    id: 'encrypted',
    classes: ['tile', 'g6'],
    body: () => (
      <>
        <Render name="lock" />
        {cap('Encrypted')}
      </>
    ),
  },
  {
    id: 'stack',
    classes: ['glass', 'stack'],
    body: ({ decorative }) => (
      <ul className={styles.tags} aria-label={decorative ? undefined : 'Email, Workspace, CRM, Automation, AI Agents, Enterprise AI'} aria-hidden={decorative || undefined}>
        {TAGS.map((t) => (
          <li
            key={t.label}
            style={
              {
                '--c': t.c,
                '--ink': t.ink,
                '--x': `${t.x}px`,
                '--y': `${t.y}px`,
                '--r': `${t.r}deg`,
                '--ts': t.ink === W ? '0 1px 1px rgba(0,0,0,.28)' : '0 1px 0 rgba(255,255,255,.55)',
                fontSize: t.size ?? 17,
              } as CSSProperties
            }
          >
            <span>{t.label}</span>
          </li>
        ))}
      </ul>
    ),
  },
  {
    id: 'ui-report',
    classes: ['ui'],
    body: () => (
      <>
        <UiReport />
        {cap('Operations analysis')}
      </>
    ),
  },
  {
    id: 'team',
    classes: ['glass'],
    body: () => (
      <>
        <div className={styles.heads} aria-hidden="true">
          {HEADS.map((h, i) => (
            <i
              key={h.name}
              className={h.far ? styles.far : undefined}
              style={
                {
                  width: h.w,
                  left: h.x,
                  top: h.y,
                  '--r': `${h.r}deg`,
                  animationDuration: `${(5.5 + i * 0.8).toFixed(1)}s`,
                  animationDelay: `-${(i * 1.1).toFixed(1)}s`,
                } as CSSProperties
              }
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${IMG}/head-${h.name}.webp`} alt="" loading="lazy" decoding="async" />
            </i>
          ))}
        </div>
        {cap('Team of agentic workforce')}
      </>
    ),
  },
  {
    id: 'decision',
    classes: ['tile', 'g7'],
    body: () => (
      <>
        <Render name="decision" />
        {cap('Faster decision making')}
      </>
    ),
  },
  {
    id: 'photo-profile',
    classes: ['glass', 'photo'],
    body: ({ decorative }) =>
      photo(`${IMG}/woman-profile.webp`, 'A smiling woman in profile against a blue studio backdrop', decorative),
  },
  {
    id: 'sovereignty',
    classes: ['tile', 'g5'],
    body: () => (
      <>
        <Render name="vault" />
        {cap('Data sovereignty')}
      </>
    ),
  },
  {
    id: 'proof',
    classes: ['glass', 'num'],
    body: ({ decorative }) => (
      <>
        <b>500+</b>
        {cap('Business running on Aivory')}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className={styles.nv}
          src="/images/nvidia-inception/nvidia-inception-program-badge-rgb-for-screen.svg"
          alt={decorative ? '' : 'NVIDIA Inception Program — Aivory AI is a member (2026 cohort)'}
          loading="lazy"
          decoding="async"
        />
      </>
    ),
  },
];

/** One card: the surface classes plus its body. */
export function HeroCard({
  def,
  orbRef,
  decorative = false,
  cardRef,
}: {
  def: CardDef;
  orbRef?: MutableRefObject<OrbDraw | null>;
  decorative?: boolean;
  cardRef?: (el: HTMLDivElement | null) => void;
}) {
  const cls = [styles.card, ...def.classes.map((c) => styles[c])].join(' ');
  return (
    <div ref={cardRef} className={cls} data-card={def.id}>
      {def.classes.includes('tile') && <i className={styles.wash} aria-hidden="true" />}
      {def.body({ orbRef, decorative })}
    </div>
  );
}
