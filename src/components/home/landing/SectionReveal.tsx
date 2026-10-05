'use client';

import { useEffect } from 'react';

/**
 * One-shot fade-in for each landing band. Sections already on screen at load
 * are left alone, and a revealed section never hides again (unlike the old
 * per-word reveal, which reversed on scroll-up). Content stays visible if this
 * never runs, and reduced-motion users get no animation at all.
 */
export default function SectionReveal({ rootId }: { rootId: string }) {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const root = document.getElementById(rootId);
    if (!root || !('IntersectionObserver' in window)) return;

    const sections = Array.from(root.querySelectorAll<HTMLElement>(':scope > section'));
    const pending = sections.filter((el) => el.getBoundingClientRect().top > window.innerHeight * 0.9);
    pending.forEach((el) => (el.dataset.reveal = 'pending'));

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          io.unobserve(el);
          el.dataset.reveal = 'in';
          // Drop the transform once settled so it creates no lasting stacking context.
          el.addEventListener('transitionend', () => (el.dataset.reveal = 'done'), { once: true });
        });
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.05 },
    );
    pending.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [rootId]);

  return null;
}
