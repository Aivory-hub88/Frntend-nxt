# Hero 3D renders

Source for `public/landing/hero/render-*.webp` (the gradient cards in the hero orbit).
Scenes live in `render.html` (Three.js); `render.mjs` renders one to a trimmed transparent PNG + WebP.

```bash
cd scripts/hero-renders
ln -sfn ../../node_modules/three three
python3 -m http.server 8765 --bind 127.0.0.1 &
node render.mjs streamline /tmp/streamline.png 1600 1200   # also writes /tmp/streamline.webp
```

Scenes: streamline, audit, automate, lock, vault. Copy the .webp to `public/landing/hero/render-<name>.webp`.
