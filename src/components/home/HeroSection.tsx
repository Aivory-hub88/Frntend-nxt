'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';
import Link from 'next/link';
import styles from './hero/HeroOrbit.module.css';
import { HERO_CARDS, HeroCard, type OrbDraw } from './hero/HeroCards';

export const WALKTHROUGH_URL = 'https://book.aivory.uk/book/aivory-call';

const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

const TAU = Math.PI * 2;
/** Seconds for one full turn of the ring. */
const PERIOD = 30;
/** Where the ring rests under reduced motion, and where it starts. */
const REST_T = 9;
/** Ring radii in the 1280x760 world, and the card scale at the back and front. */
const RX = 556;
const RY = 205;
/** Ring centre, above the middle of the 760px world: the ring is shallow and sits
 *  close under the copy instead of filling the whole hero. */
const CY = 316;
const SCALE_FAR = 0.56;
const SCALE_SPAN = 0.36;
/** The top arc is empty: cards fade out between these depths (k is 0 at the top, 1 at the bottom). */
const FADE_OUT = 0.2;
const FADE_IN = 0.36;
/** How much of its slot a hidden card keeps, so the unseen arc is crossed sooner. */
const HIDDEN_SLOT = 0.6;
/** Card edge in world px (matches `.card`), the room kept between cards, and table size. */
const CARD = 196;
const GAP = 8;
const LUT = 1024;

/** Two rails for narrow screens: the same cards, split so each rail mixes surfaces. */
const RAIL_A = ['audit', 'streamline', 'photo-celebrating', 'aether', 'automate', 'apps', 'decision', 'ui-timeline'];
const RAIL_B = ['encrypted', 'mail', 'ui-report', 'team', 'photo-profile', 'sovereignty', 'proof', 'ui-crm'];
const byId = (ids: string[]) => ids.map((id) => HERO_CARDS.find((c) => c.id === id)!);

/**
 * The hero is one light field with the headline at its centre.
 *
 * >= 1100px: the cards ride an ellipse around it. Cards near the bottom of
 * the ring are larger, and above the headline they fade out completely, so
 * the top of the hero stays clear and every card on screen is readable. One rAF loop writes `transform`, `opacity`
 * and `z-index` straight to the nodes (no React renders per frame); it runs
 * only while the hero is on screen, and not at all under reduced motion.
 *
 * < 1100px: the ring cannot fit, so the same cards run as two rails
 * (CSS animation, no JS) under the headline.
 *
 * `hero` opts the whole block out of ScrollRevealProvider's global `h2, p`
 * GSAP pass, which would otherwise hold the subline at opacity 0 on first paint.
 */
export default function HeroSection() {
  const rootRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const cardEls = useRef<(HTMLDivElement | null)[]>([]);
  const orbDraw = useRef<OrbDraw | null>(null);

  useIsoLayoutEffect(() => {
    const root = rootRef.current;
    const world = worldRef.current;
    if (!root || !world) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const n = HERO_CARDS.length;
    const lastZ: number[] = new Array(n).fill(-1);
    const lastShown: boolean[] = new Array(n).fill(true);
    let visible = true;
    let raf = 0;
    let start = 0;
    let frame = 0;

    /*
     * Spacing. Equal angles pile the cards up at the sides of the ring, where
     * the ellipse turns and the cards are still large (up to 77px of overlap,
     * which hid captions). Instead each card gets room in proportion to its
     * own size: `cum` integrates "card slots per radian" around the ring, and
     * `angleAt` inverts it, so equal steps in phase are equal steps in slots.
     * Hidden cards (top arc) keep only part of their slot, which leaves more
     * room for the ones on screen. With these radii and scales no two visible
     * cards touch at any point of the turn (smallest gap about 9px with sixteen
     * cards; re-simulate when the count or sizes change).
     */
    const scaleAt = (a: number) => SCALE_FAR + SCALE_SPAN * ((1 + Math.sin(a)) / 2);
    const shownAt = (a: number) => {
      const x = Math.min(1, Math.max(0, ((1 + Math.sin(a)) / 2 - FADE_OUT) / (FADE_IN - FADE_OUT)));
      return x * x * (3 - 2 * x);
    };
    const cum = new Float32Array(LUT + 1);
    for (let j = 0; j < LUT; j++) {
      const a = ((j + 0.5) / LUT) * TAU;
      const travel = Math.max(RX * Math.abs(Math.sin(a)), RY * Math.abs(Math.cos(a)));
      cum[j + 1] = cum[j] + travel / ((CARD * scaleAt(a) + GAP) * (HIDDEN_SLOT + (1 - HIDDEN_SLOT) * shownAt(a)));
    }
    const angleAt = (phase: number) => {
      const target = (phase - Math.floor(phase)) * cum[LUT];
      let lo = 0;
      let hi = LUT;
      while (hi - lo > 1) {
        const mid = (lo + hi) >> 1;
        if (cum[mid] <= target) lo = mid;
        else hi = mid;
      }
      return ((lo + (target - cum[lo]) / (cum[lo + 1] - cum[lo])) / LUT) * TAU;
    };

    const place = (t: number) => {
      for (let i = 0; i < n; i++) {
        const el = cardEls.current[i];
        if (!el) continue;
        const a = angleAt(t / PERIOD + i / n);
        const k = (1 + Math.sin(a)) / 2; // 1 at the front (bottom of the ring)
        const x = 640 + RX * Math.cos(a);
        const y = CY + RY * Math.sin(a);
        el.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0) scale(${scaleAt(a).toFixed(3)})`;
        const shown = shownAt(a);
        el.style.opacity = shown.toFixed(2);
        // Fully faded cards leave the render tree (their backdrop blur is not free).
        if (shown > 0 !== lastShown[i]) {
          el.style.visibility = shown > 0 ? '' : 'hidden';
          lastShown[i] = shown > 0;
        }
        const z = Math.round(k * 20);
        if (z !== lastZ[i]) {
          el.style.zIndex = String(z);
          lastZ[i] = z;
        }
      }
    };

    /** Fit the 1280x760 world into the field; false while the orbit layer is hidden. */
    const fit = () => {
      const w = root.clientWidth;
      // The ring fits the orbit layer, which stops above the trust strip.
      const h = (world.parentElement ?? root).clientHeight;
      if (w < 1100 || !h) return false;
      const s = Math.max(0.62, Math.min(1.35, w / 1280, h / 760));
      world.style.transform = `scale(${s.toFixed(4)})`;
      world.dataset.ready = 'true';
      return true;
    };

    const tick = (now: number) => {
      if (!start) start = now;
      const t = REST_T + (now - start) / 1000;
      place(t);
      if ((frame++ & 1) === 0) orbDraw.current?.(t);
      raf = requestAnimationFrame(tick);
    };
    const run = () => {
      if (reduce || raf || !visible || !fit()) return;
      raf = requestAnimationFrame(tick);
    };
    const halt = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const refit = () => {
      if (!fit()) {
        halt();
        return;
      }
      place(REST_T);
      run();
    };
    refit();

    const ro = new ResizeObserver(refit);
    ro.observe(root);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) run();
      else halt();
    });
    io.observe(root);
    return () => {
      halt();
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return (
    <div className="hero relative w-full pb-16 md:pb-24">
      <div className="relative z-10 w-full animate-slide-up-1">
        <div ref={rootRef} className={styles.root}>
          <div className={styles.orbit} aria-label="What Aivory does for an enterprise">
            <div ref={worldRef} className={styles.world}>
              {HERO_CARDS.map((def, i) => (
                <HeroCard
                  key={def.id}
                  def={def}
                  orbRef={def.id === 'aether' ? orbDraw : undefined}
                  cardRef={(el) => {
                    cardEls.current[i] = el;
                  }}
                />
              ))}
            </div>
          </div>

          <div className={styles.copy}>
            <h1 className={styles.h}>Your business, minus the busywork</h1>
            <p className={styles.sub}>
              Aivory takes you from first analysis to AI that works with you at any scale
            </p>
            <div className={styles.cta}>
              <Link href="/free-diagnostic" className={`${styles.btn} ${styles.btnPrimary}`}>
                Start free operations analysis
              </Link>
              <a
                href={WALKTHROUGH_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.btn} ${styles.btnGhost}`}
              >
                Book a walkthrough
              </a>
            </div>
          </div>

          <div className={styles.rails} aria-hidden="true">
            {[RAIL_A, RAIL_B].map((ids, r) => (
              <div key={r} className={styles.row} data-dir={r ? 'back' : 'fwd'}>
                <div className={styles.track}>
                  {[0, 1].map((copy) =>
                    byId(ids).map((def) => (
                      <div key={`${copy}-${def.id}`} className={styles.slot}>
                        <HeroCard def={def} decorative />
                      </div>
                    )),
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Trust strip: the programme Aivory belongs to. Sits inside the hero, on its
              background, so there is no band or divider under the ring. */}
          <ul className={styles.trust} aria-label="Programs Aivory belongs to">
            <li>
              <span>Member of</span>
              <Link href="/nvidia-inception" aria-label="NVIDIA Inception Program">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className={styles.trustBadge}
                  src="/images/nvidia-inception/nvidia-inception-program-badge-rgb-for-screen.svg"
                  alt="NVIDIA Inception Program"
                  width={450}
                  height={166}
                  loading="lazy"
                  decoding="async"
                />
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
