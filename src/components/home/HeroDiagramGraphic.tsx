'use client';

import { useEffect, useRef, useState } from 'react';

// Assets pulled from the "Hero Aivory New" Figma file
// (figma.com/design/mHnodNSQbgAnLeRrZV1M4i, node 1:2) and re-hosted locally
// so the hero doesn't depend on Figma's short-lived asset URLs. Coordinates
// below are canvas-relative (0,0 = the card's own top-left, matching the
// 1440x917 "Rectangle 33" background in the source file) — every layer's
// Figma `left`/`top` plus its parent frame's own offset.
const imgTexture = '/images/hero-new/texture.png';
const imgComputer = '/images/hero-new/computer.png';
const imgSmartphone = '/images/hero-new/smartphone.png';
const imgFolder = '/images/hero-new/folder.png';
const imgSmartwatchBot = '/images/hero-new/smartwatch-bot.png';
const imgSoftStar = '/images/hero-new/soft-star.svg';
const imgLines = '/images/hero-new/lines-bg.svg';
const imgBlobTopLeft = '/images/hero-new/group-35392.svg';
const imgBlobTopLeft2 = '/images/hero-new/group-35393.svg';
// Arrowheads, exported per-node from Figma with their rotation already
// applied (14:757 / 14:758), so nothing here has to be re-derived.
const imgHeadRight = '/images/hero-new/arrowhead-right.png';
const imgHeadLeft = '/images/hero-new/arrowhead-left.png';
// Connectors exported per-node from Figma (node ids 8:573 / 8:575 / 8:582 /
// 8:576) so each one carries the rotation it actually has in the composition.
const imgArrowData = '/images/hero-new/arrow-data.png';
const imgArrowAiAgent = '/images/hero-new/arrow-aiagent.png';
const imgArrowBizOps = '/images/hero-new/arrow-bizops.png';
const imgArrowWorkflows = '/images/hero-new/arrow-workflows.png';
// Trust-card illustrations (nodes 28:799 / 28:858) and the canonical NVIDIA
// lockup (reused rather than Figma's own re-traced export of it).
const imgKeynote = '/images/hero-new/trust-keynote.png';
const imgHand = '/images/hero-new/trust-hand.png';
const imgNvidiaBadge = '/images/nvidia-inception/nvidia-inception-program-badge-rgb-for-screen.svg';

const LITERATA = "var(--font-literata), Literata, serif";

// The whole graphic is authored once at this fixed size (matching the
// source card exactly) and scaled down as a single unit — see
// useCanvasScale — rather than reflowed with breakpoints. It reads as one
// illustration, so proportions matter more than the ability to rewrap any
// single label.
// How hard the ambient colour reads. The source blobs are pale washes; this
// deepens them without shifting hue — one knob, tuned by eye against the
// card's #ededed ground.
const BLOB_FILTER = 'saturate(1.5) brightness(0.86) contrast(1.06)';

const CANVAS_WIDTH = 1440;
// The lockup (labels, pill, pins, arrows) and its tagline are drawn at the
// source's size, then taken down 15% as one group — which is also what buys
// the composition its height back, since the top pin can only sit so close
// to the fixed 64px nav row.
const LOCKUP_SCALE = 0.85;
// The fixed navbar sits inside this card's top strip. TOP_PAD is the only
// clearance between the two, and it is negative because the artwork's own
// box starts above its topmost element: the orange pin (design y=92) is the
// real ceiling, and at this value it clears the 64px nav row by ~13px.
const TOP_PAD = -10;
// Tall enough for the lowest trust card (26:783, local y=547.97 + its own
// 176.18px = 724.15) once it's rendered — which is *after* LOCKUP_SCALE, not
// before: that scale's origin is the lockup group's own top edge, so it
// compresses everything toward TOP_PAD without changing the outer box this
// constant sizes. Using the raw 724 here (as an earlier pass did) left the
// outer box tall enough for unscaled content, i.e. ~150px of dead space
// under the actually-rendered (0.85x) cards. TOP_PAD + 724 * LOCKUP_SCALE
// (-10 + 615.4) plus a small margin.
const CANVAS_HEIGHT = 640;

const CARD_SHADOW =
  '0px 49px 37px rgba(0,0,0,0.02), 0px 32px 21.5px rgba(0,0,0,0.02), 0px 19px 12px rgba(0,0,0,0.02), 0px 10px 6px rgba(0,0,0,0.01), 0px 4px 3px rgba(0,0,0,0.01), 0px 1px 1.5px rgba(0,0,0,0.01)';

/**
 * A trust "sticky note" (nodes 25:778 / 26:783 / 29:882): a rotated white
 * card plus, for two of the three, an illustration that is a *separate*
 * sibling node in the source overlapping up and over the card's own top
 * edge — not a child clipped to its bounds. `left`/`top` are the card's own
 * canvas position; the illustration's are relative to that same origin.
 * Rotation wasn't in Figma's metadata for these nodes (only reachable per
 * isolated node, which normalizes away the parent-applied tilt), so it was
 * measured directly off each node's rendered screenshot — the angle of its
 * straight left edge from vertical.
 */
function Note({
  left,
  top,
  size,
  rotate,
  scale = 1,
  illustration,
  children,
}: {
  left: number;
  top: number;
  size: number;
  rotate: number;
  scale?: number;
  illustration?: { src: string; width: number; height: number; left: number; top: number };
  children: React.ReactNode;
}) {
  return (
    <div
      className="absolute"
      style={{ left, top, width: size, height: size, transform: scale !== 1 ? `scale(${scale})` : undefined, transformOrigin: '0 0' }}
    >
      <div
        className="absolute inset-0 rounded-[28px] bg-white"
        style={{ boxShadow: CARD_SHADOW, transform: `rotate(${rotate}deg)` }}
      >
        {children}
      </div>
      {illustration && (
        <img
          src={illustration.src}
          alt=""
          className="pointer-events-none absolute select-none"
          style={{ left: illustration.left, top: illustration.top, width: illustration.width, height: illustration.height }}
        />
      )}
    </div>
  );
}

function useCanvasScale(designWidth: number) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    // A width of 0 on the first layout pass would otherwise leave the whole
    // graphic hidden until something resized the window, so retry on the next
    // frame until the container has a real width.
    const update = () => {
      const w = el.getBoundingClientRect().width || el.offsetWidth;
      if (w > 0) {
        setScale(w / designWidth);
      } else {
        raf = requestAnimationFrame(update);
      }
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [designWidth]);

  return { ref, scale };
}

function Label({ left, top, children }: { left: number; top: number; children: string }) {
  return (
    <h3
      className="absolute m-0 whitespace-nowrap font-normal text-black"
      style={{ left, top, transform: 'translateY(-50%)', fontFamily: LITERATA, fontSize: 80, lineHeight: '50px' }}
    >
      {children}
    </h3>
  );
}

/**
 * A pin from the source file. Every number here is the node's own geometry as
 * Figma reports it — disc, pastel inset, stem offset and the 90px stem length
 * — not eyeballed. Getting the stem length wrong (it is 90, overlapping the
 * disc, for a 141.125 total) is what made an earlier pass read as too long.
 */
function Pin({
  left,
  top,
  height,
  ring,
  fill,
  discX = 0,
  discY = 0,
  stemX,
  children,
}: {
  left: number;
  top: number;
  height: number;
  ring: string;
  fill: string;
  discX?: number;
  discY?: number;
  stemX: number;
  children: React.ReactNode;
}) {
  return (
    <div className="absolute" style={{ left, top, width: 76, height }}>
      <span
        className="absolute rounded-[6px]"
        style={{ left: stemX, top: height - 90, width: 6, height: 90, background: ring }}
      />
      <div className="absolute rounded-full" style={{ left: discX, top: discY, width: 64, height: 64, background: ring }} />
      <div
        className="absolute rounded-full"
        style={{ left: discX + 3.82, top: discY + 4, width: 56, height: 56, background: fill }}
      />
      {children}
    </div>
  );
}

/**
 * Connector lines, exported from Figma exactly as they are composed there
 * (some instances are rotated in the source, and the codegen drops that) and
 * placed at each node's own bounding box. The render carries ~1.5px of stroke
 * bleed on each side, hence the -1.5 / +3 on the box.
 */
function Connector({ x, y, w, h, src }: { x: number; y: number; w: number; h: number; src: string }) {
  return <img src={src} alt="" className="absolute select-none" style={{ left: x, top: y, width: w, height: h }} />;
}

function ArrowHead({ x, y, src }: { x: number; y: number; src: string }) {
  return <img src={src} alt="" className="absolute select-none" style={{ left: x, top: y, width: 15, height: 17 }} />;
}

/**
 * The card's ground: the Figma blobs and grain, painted across the *whole*
 * card rather than only the diagram's box. Keeping this separate is what
 * stops a hard seam where the diagram canvas ends and the CTA block begins —
 * the gradient and texture have to run the full height of the card.
 *
 * The blobs are positioned in the same 1440-wide design space as the diagram
 * and scaled with it; the grain is a repeating tile, so it just covers.
 */
export function HeroCardBackdrop() {
  const { ref, scale } = useCanvasScale(CANVAS_WIDTH);

  return (
    <div ref={ref} aria-hidden="true" className="absolute inset-0 overflow-hidden" style={{ background: '#ededed' }}>
      <div
        className="absolute left-0 top-0 origin-top-left"
        style={{
          width: CANVAS_WIDTH,
          height: CANVAS_HEIGHT,
          transform: scale ? `scale(${scale})` : undefined,
          visibility: scale ? 'visible' : 'hidden',
        }}
      >
        {/* BLOB_X_SHIFT: both blob centres pulled further left (source values
            are -228/-334) so the deepest blue sits directly behind the
            navbar logo instead of past it. */}
        <div className="absolute inset-x-0 bottom-0" style={{ top: TOP_PAD, filter: BLOB_FILTER }}>
          <img src={imgBlobTopLeft} alt="" className="absolute" style={{ left: -228 - 150, top: -91, width: 956, height: 233 }} />
          <img
            src={imgBlobTopLeft2}
            alt=""
            className="absolute"
            style={{ left: -334 - 150, top: -132, width: 967, height: 253, transform: 'rotate(-4.98deg)' }}
          />
        </div>
      </div>

      {/* Concentric arcs (node 14:745) — a 1628px circle set rotated inside
          its own 2223.889px box. Dropped from an earlier pass by mistake. */}
      <div
        className="absolute left-0 top-0 origin-top-left"
        style={{
          width: CANVAS_WIDTH,
          height: CANVAS_HEIGHT,
          transform: scale ? `scale(${scale})` : undefined,
          visibility: scale ? 'visible' : 'hidden',
        }}
      >
        <div
          className="absolute flex items-center justify-center"
          style={{ left: -398, top: -722 + TOP_PAD, width: 2223.889, height: 2223.889 }}
        >
          <img
            src={imgLines}
            alt=""
            className="max-w-none"
            style={{ width: 1628, height: 1628, transform: 'rotate(-60deg)' }}
          />
        </div>
      </div>

      {/* grain, tiled across the entire card */}
      <div
        className="absolute inset-0 mix-blend-overlay"
        style={{
          backgroundImage: `url(${imgTexture})`,
          backgroundSize: '134px 134px',
          backgroundRepeat: 'repeat',
          opacity: 0.35,
        }}
      />
    </div>
  );
}

export default function HeroDiagramGraphic() {
  const { ref, scale } = useCanvasScale(CANVAS_WIDTH);

  return (
    <div
      ref={ref}
      className="relative w-full overflow-hidden"
      style={{ aspectRatio: `${CANVAS_WIDTH} / ${CANVAS_HEIGHT}` }}
    >
      <div
        className="absolute left-0 top-0 origin-top-left"
        style={{
          width: CANVAS_WIDTH,
          height: CANVAS_HEIGHT,
          transform: scale ? `scale(${scale})` : undefined,
          visibility: scale ? 'visible' : 'hidden',
        }}
      >
        <div
          className="absolute inset-x-0 bottom-0"
          style={{ top: TOP_PAD, transform: `scale(${LOCKUP_SCALE})`, transformOrigin: '50% 0' }}
        >
          {/* Build-up sequence: the pill first, then each connector group in
              the order a viewer's eye would trace the arrows, tagline last.
              transformOrigin is each group's own bounding-box centre so the
              pop reads as that piece arriving in place, not the whole 1440px
              canvas scaling from its centre. */}
          <div className="hero-pop hero-pop-1 absolute inset-0" style={{ transformOrigin: '820px 387px' }}>
            <div
              className="absolute flex items-center justify-center rounded-[30px]"
              style={{ left: 598.32, top: 335, width: 443.32, height: 103.4, background: '#3434ff' }}
            >
              {/* line-height: 1 (not the 50px used elsewhere in the diagram)
                  — this text is centred by the pill's flexbox, and a line box
                  shorter than the 70px font size let Literata's descender
                  push the glyphs down instead of centring them. */}
              <span className="font-normal text-white" style={{ fontFamily: LITERATA, fontSize: 70, lineHeight: 1 }}>
                One System
              </span>
            </div>
          </div>

          <div className="hero-pop hero-pop-2 absolute inset-0" style={{ transformOrigin: '683px 178px' }}>
            <Label left={444} top={194.5}>BizOps</Label>
            <Connector x={743} y={202} w={179} h={61} src={imgArrowBizOps} />
            <ArrowHead x={738} y={196} src={imgHeadLeft} />
            <Pin left={692} top={92} height={141.125} ring="#ffb366" fill="#ffeddb" stemX={28.82}>
              {/* Only the computer is clipped by its disc in the source; the
                  rest sit over theirs, which is why they read larger. */}
              <div className="absolute overflow-hidden rounded-full" style={{ left: 3.82, top: 4, width: 56, height: 56 }}>
                <img src={imgComputer} alt="" className="absolute max-w-none" style={{ left: -4, top: -5.88, width: 64, height: 64 }} />
              </div>
            </Pin>
          </div>

          <div className="hero-pop hero-pop-3 absolute inset-0" style={{ transformOrigin: '846px 257px' }}>
            <img src={imgSoftStar} alt="" className="absolute" style={{ left: 908, top: 136, width: 70, height: 75 }} />
            <Label left={598} top={279.5}>Workflows</Label>
            <Connector x={1047} y={281} w={47} h={96} src={imgArrowWorkflows} />
            <ArrowHead x={1039} y={273} src={imgHeadLeft} />
            <Pin left={997} top={173} height={141.125} ring="#9a139a" fill="#f5d2f5" stemX={28.82}>
              <img src={imgSmartphone} alt="" className="absolute max-w-none" style={{ left: 0, top: 0, width: 64, height: 64 }} />
            </Pin>
          </div>

          <div className="hero-pop hero-pop-4 absolute inset-0" style={{ transformOrigin: '493px 391px' }}>
            <Label left={365} top={381.5}>Data</Label>
            <Connector x={566} y={388} w={32} h={8} src={imgArrowData} />
            <ArrowHead x={559} y={385} src={imgHeadLeft} />
            <Pin left={523} top={280} height={144.125} ring="#138e9a" fill="#d2ecf5" discX={1} discY={3} stemX={29.82}>
              <div className="absolute flex items-center justify-center" style={{ left: 0, top: 0, width: 65.61, height: 65.61 }}>
                <img
                  src={imgFolder}
                  alt=""
                  className="max-w-none"
                  style={{ width: 55.374, height: 55.374, transform: 'rotate(-11.91deg)' }}
                />
              </div>
            </Pin>
            <img src={imgSoftStar} alt="" className="absolute" style={{ left: 551, top: 428, width: 70, height: 75 }} />
          </div>

          <div className="hero-pop hero-pop-5 absolute inset-0" style={{ transformOrigin: '934px 446px' }}>
            <Label left={773} top={479.5}>AI Agent</Label>
            <Connector x={707} y={445} w={61} h={53} src={imgArrowAiAgent} />
            <ArrowHead x={761} y={487} src={imgHeadRight} />
            <Pin left={1085} top={375} height={141.125} ring="#6495d4" fill="#d2ecf5" discX={6} discY={0} stemX={34.82}>
              <div className="absolute overflow-hidden" style={{ left: 0, top: 5, width: 76, height: 52 }}>
                <img
                  src={imgSmartwatchBot}
                  alt=""
                  className="absolute max-w-none"
                  style={{ left: '-15.68%', top: '-21.89%', width: '124.52%', height: '121.74%' }}
                />
              </div>
            </Pin>
          </div>

          <div className="hero-pop hero-pop-6 absolute inset-0" style={{ transformOrigin: '720px 619px' }}>
            <p
              className="absolute m-0 text-center font-normal text-black"
              style={{ left: 0, top: 559, width: CANVAS_WIDTH, fontFamily: LITERATA, fontSize: 25, lineHeight: '40px' }}
            >
              Map how your operations actually run
              <br />
              {' then deploy the intelligence that fit'}
              <br />
              All in one system
            </p>
          </div>

          {/* Step 7 of the pop-in sequence — after the tagline (step 6), see
              globals.css. transformOrigin is the bounding-box centre of all
              three cards + their illustrations, so the group pops in place. */}
          <div className="hero-pop hero-pop-7 absolute inset-0" style={{ transformOrigin: '789px 554px' }}>
            <Note left={265.2} top={479} size={176.36} rotate={13} scale={0.72} illustration={{ src: imgKeynote, width: 146, height: 147, left: 32, top: -95 }}>
              <p
                className="absolute m-0 whitespace-nowrap font-normal text-black"
                style={{ left: 21, top: 46, transform: 'translateY(-50%)', fontFamily: LITERATA, fontSize: 51, lineHeight: '50px' }}
              >
                500+
              </p>
              <p
                className="absolute m-0 font-normal text-black"
                style={{ left: 27, top: 101, width: 123, transform: 'translateY(-50%)', fontFamily: LITERATA, fontSize: 17, lineHeight: '17px' }}
              >
                Business running
                <br />
                on Aivory
              </p>
            </Note>

            <Note left={1136} top={547.97} size={176.18} rotate={-10} scale={0.72} illustration={{ src: imgHand, width: 169, height: 169, left: -15, top: -70 }}>
              <p
                className="absolute m-0 font-normal text-black"
                style={{ left: 19, top: 138, width: 123, transform: 'translateY(-50%)', fontFamily: LITERATA, fontSize: 17, lineHeight: '17px' }}
              >
                Zero training
                <br />
                on your data
              </p>
            </Note>

            <Note left={1000} top={597.87} size={124.82} rotate={-4}>
              <img
                src={imgNvidiaBadge}
                alt="NVIDIA Inception Program — Aivory AI is a member (2026 cohort)"
                className="absolute"
                style={{ left: 13, top: 15, width: 86, height: 32 }}
              />
              <p
                className="absolute m-0 font-normal text-black"
                style={{ left: 17, top: 75, width: 92, transform: 'translateY(-50%)', fontFamily: LITERATA, fontSize: 14, lineHeight: '14px' }}
              >
                NVIDIA
                <br />
                Inception member
              </p>
            </Note>
          </div>
        </div>
      </div>
    </div>
  );
}
