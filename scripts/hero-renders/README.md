# Hero 3D drawings

Source for `public/landing/hero/render-*.webp`, the gradient cards in the hero orbit.

`line.html` holds the live style: close-up 3D technical drawings (Three.js). It uses white hairline edges, flat face tones and hidden lines removed, rendered full-bleed at 720x720. `render.html` holds the earlier ceramic/chrome renders and is kept for reference only. `render.mjs` renders one scene to PNG + WebP; set `PAGE=render.html` to use the old page.

```bash
cd scripts/hero-renders
ln -sfn ../../node_modules/three three
python3 -m http.server 8765 --bind 127.0.0.1 &
node render.mjs automation /tmp/automation.png 720 720   # also writes /tmp/automation.webp
```

Scenes: `automation`, `streamline`, `audit`, `lock`, `vault`. Copy each `.webp` to `public/landing/hero/render-<name>-<version>.webp` and bump `RENDER_VERSION` in HeroCards.tsx. Cloudflare caches `/landing/*` for a year, so a changed image must get a new file name.
