# Hero 3D drawings

Source for `public/landing/hero/render-*.webp`, the gradient cards in the hero orbit.

`line.html` holds the live style: close-up 3D technical drawings (Three.js). It uses white hairline edges, flat face tones and hidden lines removed, rendered full-bleed at 720x720. `render.html` holds the earlier ceramic/chrome renders and is kept for reference only. `render.mjs` renders one scene to PNG + WebP; set `PAGE=render.html` to use the old page.

```bash
cd scripts/hero-renders
ln -sfn ../../node_modules/three three
python3 -m http.server 8765 --bind 127.0.0.1 &   # another port: PORT=8791 node render.mjs ...
node render.mjs automation /tmp/automation.png 720 720   # also writes /tmp/automation.webp
```

Scenes: `automation`, `growth` (the "Streamline your business operations" card; `streamline` is its earlier drawing, no longer shipped), `audit`, `lock`, `vault`, `decision`. Copy each `.webp` to `public/landing/hero/render-<name>-<version>.webp` and bump `RENDER_VERSION` in HeroCards.tsx. Cloudflare caches `/landing/*` for a year, so a changed image must get a new file name.

## Glass cards (v5, current)

The six gradient cards now ship as one baked WebP each: a gradient sampled from the brand references, a single clear-glass object in extreme close-up refracting it (Three.js transmission + dispersion), film grain, and the folder-shaped liquid-glass caption pane. The caption text stays live HTML (`glassCap` + `.folder` in HeroOrbit.module.css); the pane is sized in the bake with the same caption metrics, so keep the two in step.

```bash
cd scripts/hero-renders/glass
NODE_PATH=../../../node_modules node bake.cjs   # writes baked/card-<name>-v5.webp (and bake.html)
```

`cards.html` holds every candidate row plus `#chosen`, the set that ships; change a card by editing its `data-i` in `#chosen`. Copy `baked/card-<name>-vN.webp` to `public/landing/hero/render-<name>-vN.webp` and bump `RENDER_VERSION`.
