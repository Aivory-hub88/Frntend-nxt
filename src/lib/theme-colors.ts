// Single source of truth for the interactive showcase's cyan accent. It was
// previously the literal hex (or its rgb() triplet) hardcoded in ~130 places
// across InteractiveShowcase.tsx -- one intentional colour, copy-pasted
// everywhere instead of named once. `showcase-accent` in tailwind.config.ts
// reads this same value, so Tailwind classes, arbitrary-value theme()
// references, and runtime inline styles all trace back to this one constant.
export const SHOWCASE_ACCENT = '#bbe2ef';
export const SHOWCASE_ACCENT_RGB = '187, 226, 239';
