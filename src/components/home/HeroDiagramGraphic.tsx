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
const imgEclipse = '/images/hero-new/eclipse.svg';
const imgEclipse2 = '/images/hero-new/eclipse2.svg';
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
// real ceiling, and at this value it clears the 64px nav row by ~13px. The canvas ends shortly after the
// tagline (which bottoms out at 679) so the CTAs below sit close.
const TOP_PAD = -10;
const CANVAS_HEIGHT = 600;

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
        <div className="absolute inset-x-0 bottom-0" style={{ top: TOP_PAD, filter: BLOB_FILTER }}>
          <img src={imgBlobTopLeft} alt="" className="absolute" style={{ left: -228, top: -91, width: 956, height: 233 }} />
          <img
            src={imgBlobTopLeft2}
            alt=""
            className="absolute"
            style={{ left: -334, top: -132, width: 967, height: 253, transform: 'rotate(-4.98deg)' }}
          />
          <img
            src={imgEclipse}
            alt=""
            className="absolute"
            style={{ left: 797, top: 400, width: 964, height: 623, transform: 'rotate(-11.48deg)' }}
          />
          <div
            className="absolute rounded-full blur-[100px]"
            style={{
              left: 1000,
              top: 600,
              width: 260,
              height: 420,
              transform: 'rotate(50deg)',
              background: 'linear-gradient(to bottom, rgba(24,75,255,0), rgba(63,74,104,0.78))',
            }}
          />
          <img src={imgEclipse2} alt="" className="absolute" style={{ left: 663, top: 540, width: 543, height: 432 }} />
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
          <img src={imgSoftStar} alt="" className="absolute" style={{ left: 908, top: 136, width: 70, height: 75 }} />
          <img src={imgSoftStar} alt="" className="absolute" style={{ left: 551, top: 428, width: 70, height: 75 }} />

          <Label left={444} top={194.5}>BizOps</Label>
          <Label left={598} top={279.5}>Workflows</Label>
          <Label left={365} top={381.5}>Data</Label>
          <Label left={773} top={479.5}>AI Agent</Label>

          <div
            className="absolute flex items-center justify-center rounded-[30px]"
            style={{ left: 598.32, top: 335, width: 443.32, height: 103.4, background: '#3434ff' }}
          >
            <span className="font-normal text-white" style={{ fontFamily: LITERATA, fontSize: 70, lineHeight: '50px' }}>
              One System
            </span>
          </div>

          <Connector x={566} y={388} w={32} h={8} src={imgArrowData} />
          <Connector x={707} y={445} w={61} h={53} src={imgArrowAiAgent} />
          <Connector x={743} y={202} w={179} h={61} src={imgArrowBizOps} />
          <Connector x={1047} y={281} w={47} h={96} src={imgArrowWorkflows} />

          <ArrowHead x={559} y={385} src={imgHeadLeft} />
          <ArrowHead x={738} y={196} src={imgHeadLeft} />
          <ArrowHead x={1039} y={273} src={imgHeadLeft} />
          <ArrowHead x={761} y={487} src={imgHeadRight} />

          {/* Only the computer is clipped by its disc in the source; the rest
              sit over theirs, which is why they read larger. */}
          <Pin left={692} top={92} height={141.125} ring="#ffb366" fill="#ffeddb" stemX={28.82}>
            <div className="absolute overflow-hidden rounded-full" style={{ left: 3.82, top: 4, width: 56, height: 56 }}>
              <img src={imgComputer} alt="" className="absolute max-w-none" style={{ left: -4, top: -5.88, width: 64, height: 64 }} />
            </div>
          </Pin>
          <Pin left={997} top={173} height={141.125} ring="#9a139a" fill="#f5d2f5" stemX={28.82}>
            <img src={imgSmartphone} alt="" className="absolute max-w-none" style={{ left: 0, top: 0, width: 64, height: 64 }} />
          </Pin>
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
      </div>
    </div>
  );
}
