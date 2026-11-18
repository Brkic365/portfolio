#!/usr/bin/env node
/**
 * Renders the social cards: one frozen frame of the field with the page title
 * as a knockout, 1200x630, for the homepage and every case study. Writes
 * public/og/<card>.png, which the pages' metadata points at.
 *
 * Run it by hand after changing a title, a line or the field, then commit the
 * PNGs. It is not part of the build, so a missing browser or font can never
 * break a deploy.
 *
 *   npm run build
 *   node scripts/og.mjs                 # starts `next start` on a spare port
 *   BASE=http://localhost:3000 node scripts/og.mjs   # or use a running server
 *   node scripts/og.mjs tavola home     # only some cards
 *
 * Needs Playwright with Chromium installed. It is deliberately not a project
 * dependency: install it globally (npm i -g playwright && npx playwright
 * install chromium) or anywhere on NODE_PATH.
 *
 * How it works: the cards use the real engine. lib/field/*.ts is transpiled
 * with the project's own TypeScript and served to the page as ES modules, and
 * the card page links the built site's stylesheet, so the title is traced in
 * the same self-hosted Archivo the site uses.
 */

import { spawn } from 'node:child_process';
import { mkdirSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'public', 'og');
const ts = require('typescript');

let chromium;
try {
  ({ chromium } = require('playwright'));
} catch {
  console.error('og: Playwright is not installed. Install it globally: npm i -g playwright && npx playwright install chromium');
  process.exit(1);
}

/* ---- the project data, straight from data/projects.ts ---- */

function transpile(file) {
  const src = readFileSync(path.join(ROOT, file), 'utf8');
  return ts.transpileModule(src, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 },
  }).outputText;
}

const data = await import(`data:text/javascript;base64,${Buffer.from(transpile('data/projects.ts')).toString('base64')}`);
const { projects, featured } = data;

const CARDS = {
  home: {
    title: 'Antonio<br>Brkić',
    kind: 'Portfolio',
    sig: 'curl',
    accent: '#ff5a1f',
    line: 'Full-stack developer in Zagreb. I build software with something moving in it.',
  },
};
for (const p of projects) {
  const n = featured.findIndex((f) => f.slug === p.slug);
  CARDS[p.slug] = {
    title: p.name,
    kind: n >= 0 ? `Case study, ${n + 1} of ${featured.length}` : 'Case study',
    sig: p.sig,
    accent: p.accent,
    line: `${p.line}.`,
  };
}

const only = process.argv.slice(2);
const names = only.length ? only.filter((n) => CARDS[n]) : Object.keys(CARDS);
if (!names.length) {
  console.error(`og: no such card. Cards: ${Object.keys(CARDS).join(', ')}`);
  process.exit(1);
}

/* ---- a server to render against ---- */

let server = null;
let BASE = process.env.BASE;
if (!BASE) {
  const port = 3000 + Math.floor(Math.random() * 900) + 100;
  BASE = `http://localhost:${port}`;
  server = spawn(path.join(ROOT, 'node_modules', '.bin', 'next'), ['start', '-p', String(port)], {
    cwd: ROOT,
    stdio: 'ignore',
  });
  let up = false;
  for (let i = 0; i < 60 && !up; i++) {
    await new Promise((r) => setTimeout(r, 500));
    up = await fetch(BASE).then((r) => r.ok, () => false);
  }
  if (!up) {
    server.kill();
    console.error('og: `next start` did not come up. Run `npm run build` first.');
    process.exit(1);
  }
}

/* The built homepage tells us the stylesheet and the font class. */
const home = await fetch(BASE).then((r) => r.text());
const styles = [...home.matchAll(/<link rel="stylesheet" href="([^"]+)"/g)].map((m) => m[1]);
const htmlClass = home.match(/<html[^>]*class="([^"]*)"/)?.[1] ?? '';

const template = (card) => `<!doctype html>
<html lang="en" class="${htmlClass}">
<head>
<meta charset="utf-8">
<meta name="robots" content="noindex">
${styles.map((h) => `<link rel="stylesheet" href="${h}">`).join('\n')}
<style>
  html, body { margin: 0; background: #0e0e10; }
  body { width: 1200px; height: 630px; overflow: hidden; position: relative; color: #edece6;
    font: 500 22px/1.3 var(--font-archivo), "Helvetica Neue", Arial, sans-serif; -webkit-font-smoothing: antialiased; }
  canvas { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
  .t { position: absolute; left: 58px; top: 96px; margin: 0; font-weight: 900; font-stretch: 125%;
    letter-spacing: -0.02em; line-height: .86; white-space: nowrap; }
  .t[data-ko="on"] { color: transparent; }
  .top { position: absolute; left: 64px; right: 64px; top: 30px; display: flex; justify-content: space-between;
    font-size: 20px; font-weight: 700; font-stretch: 112.5%; }
  .top span:last-child { color: #b9b8b1; font-weight: 500; font-stretch: 100%; }
  .foot { position: absolute; left: 64px; right: 64px; bottom: 42px; display: flex; justify-content: space-between;
    align-items: end; gap: 40px; padding-top: 18px; border-top: 2px solid ${card.accent}; }
  .foot p { margin: 0; max-width: 30ch; font-size: 28px; font-weight: 600; letter-spacing: -.01em; line-height: 1.12; }
  .foot span { color: #b9b8b1; white-space: nowrap; }
</style>
</head>
<body>
<canvas id="field" aria-hidden="true"></canvas>
<div class="top"><span>Antonio Brkić</span><span>${card.kind}</span></div>
<h1 class="t" id="t">${card.title}</h1>
<div class="foot"><p>${card.line}</p><span>antoniobrkic.com</span></div>
<script type="module">
  import { createField, textMask } from '/__og/field/engine.js';
  await document.fonts.ready;
  const t = document.getElementById('t');
  // Fit the title: as wide as the card allows, and no taller than the space above the footer.
  const lines = t.innerHTML.split('<br>').length;
  const maxW = 1200 - 2 * 58, maxH = lines > 1 ? 420 : 300;
  t.style.fontSize = '100px';
  const k = Math.min(maxW / t.getBoundingClientRect().width, maxH / (100 * (0.86 * lines + 0.14)));
  t.style.fontSize = (100 * k).toFixed(2) + 'px';
  if (lines === 1) t.style.top = (96 + (300 - 100 * k) / 2).toFixed(0) + 'px';
  const f = createField(document.getElementById('field'), {
    host: document.body, accent: ${JSON.stringify(card.accent)}, sig: ${JSON.stringify(card.sig)},
    frozen: true, disturb: false, density: 150, maxN: 6000, share: .1, speed: 1.2, fade: .035,
    outside: .16, fill: .05, light: .85, spawnIn: .75, life: [80, 240], dprMax: 1, still: 260,
    mask: textMask(t),
    onMask: (on) => { if (on) t.dataset.ko = 'on'; },
  });
  await f.ready;
  window.__ready = true;
</script>
</body>
</html>`;

/* ---- render ---- */

const modules = Object.fromEntries(
  ['engine', 'noise', 'signatures'].map((m) => [m, transpile(`lib/field/${m}.ts`)]),
);

mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));

let current = null;
await page.route('**/__og/**', (route) => {
  const url = new URL(route.request().url());
  const field = url.pathname.match(/^\/__og\/field\/(\w+)(\.js)?$/);
  if (field && modules[field[1]]) {
    return route.fulfill({ contentType: 'text/javascript', body: modules[field[1]] });
  }
  if (url.pathname === '/__og/card') return route.fulfill({ contentType: 'text/html', body: template(current) });
  return route.fulfill({ status: 404, body: '' });
});

try {
  for (const name of names) {
    current = CARDS[name];
    await page.goto(`${BASE}/__og/card?${name}`, { waitUntil: 'networkidle' });
    await page.waitForFunction(() => window.__ready === true, null, { timeout: 15000 });
    const file = path.join(OUT, `${name}.png`);
    await page.screenshot({ path: file });
    console.log('wrote', path.relative(ROOT, file));
  }
} finally {
  await browser.close();
  server?.kill();
}

if (errors.length) {
  console.error('og: errors while rendering:\n' + errors.join('\n'));
  process.exitCode = 1;
}
