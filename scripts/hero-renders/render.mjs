// Usage: node render.mjs <scene> <out.png> [w] [h]  (expects a static server on :8765 serving this folder)
import { writeFileSync } from 'node:fs';
import { chromium } from 'playwright';
const [scene, out, w = '1200', h = '900'] = process.argv.slice(2);
const b = await chromium.launch({ args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] });
const p = await b.newPage({ viewport: { width: +w, height: +h } });
const logs = [];
p.on('console', m => logs.push(m.text()));
p.on('pageerror', e => logs.push('ERR ' + e.message));
await p.goto(`http://localhost:8765/${process.env.PAGE || "line.html"}?scene=${scene}&w=${w}&h=${h}`);
try {
  await p.waitForFunction(() => window.__done, null, { timeout: 60000 });
} catch (e) {
  console.log(logs.join('\n'));
  throw e;
}
const data = await p.evaluate(() => window.__png);
const webp = await p.evaluate(() => window.__webp);
writeFileSync(out.replace(/\.png$/, '.webp'), Buffer.from(webp.split(',')[1], 'base64'));
writeFileSync(out, Buffer.from(data.split(',')[1], 'base64'));
if (logs.length) console.log(logs.join('\n'));
await b.close();
