'use client';

import { useEffect, useRef } from 'react';
import { GLITCH_CELLS } from './pricingGlitchCells';

/* The live ASCII layer over a pricing header. The canvas has the art's own pixel size and the same
   object-cover box, so every glyph stays on the glitch block it was placed on. */

const WIDTH = 960;
const HEIGHT = 820;
const CELL_W = 18;
const CELL_H = 27;
const GLYPHS = 'XHMS#8I40/_';
const TICK_MS = 110;

const glyph = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)];

export function GlitchAscii({ name, className = '' }: { name: string; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    const data = GLITCH_CELLS[name];
    if (!canvas || !ctx || !data) return;

    const cells = data.split(';').map((pair) => {
      const [col, row] = pair.split(',').map(Number);
      return { x: col * CELL_W + 2, y: row * CELL_H + 2 };
    });
    ctx.font = '500 25px "JetBrains Mono", Menlo, ui-monospace, monospace';
    ctx.textBaseline = 'top';
    ctx.fillStyle = 'rgba(255,255,255,0.92)';

    const draw = (cell: { x: number; y: number }) => {
      ctx.clearRect(cell.x - 2, cell.y - 2, CELL_W, CELL_H);
      ctx.fillText(glyph(), cell.x, cell.y);
    };
    cells.forEach(draw);

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // A few glyphs change per tick, and only while the card is on screen.
    let timer: number | undefined;
    const observer = new IntersectionObserver(([entry]) => {
      window.clearInterval(timer);
      if (!entry.isIntersecting) return;
      timer = window.setInterval(() => {
        for (let i = 0; i < cells.length / 12; i++) draw(cells[Math.floor(Math.random() * cells.length)]);
      }, TICK_MS);
    });
    observer.observe(canvas);
    return () => {
      observer.disconnect();
      window.clearInterval(timer);
    };
  }, [name]);

  return <canvas ref={ref} width={WIDTH} height={HEIGHT} aria-hidden="true" className={className} />;
}
