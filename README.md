# Portfolio

My personal site, live at **[antoniobrkic.com](https://antoniobrkic.com)**.

An index of the work at `/`, and a case study per project at `/work/<slug>`. The
whole site sits on one moving particle field that runs behind every page, top
to bottom, with no edges. The big type is cut out of it, so the field shows
through the letters, and each project has a motion of its own that the field
takes on when you point at the project or open its page.

## How it is built

A few decisions that are worth knowing before changing anything.

**Every route is static.** The production build prerenders all of them and ships
no serverless functions. The contact form is a server action rather than an API
route, which means there is no public POST endpoint and the Resend key never
reaches the browser.

**The pages are server components.** Anything that moves is a small client
component dropped into a server-rendered page: `Backdrop`, `PageSignature`,
`FieldCanvas`, `Knockout`, `Gallery`, `FieldTuning` and `ContactForm`. Server
code asks for a field by role (`preset="quiet"`) rather than passing option objects across the client
boundary. The presets live in `lib/field/presets.ts`.

**The contact form keeps what you typed.** React 19 resets an uncontrolled form
once its action resolves. The action echoes the submitted values back and the
form is keyed on an attempt counter. Without that, a validation error throws
away whatever the person had typed.

**Dark screenshots get a gamma lift.** Several captures have a mean luminance
under 45 of 255 and disappear against a dark background. An SVG
`feComponentTransfer` filter in `app/(art)/layout.tsx` raises the shadows.
Keep it gentle: a steeper curve amplifies the compression noise sitting in the
near-black areas and the images turn grainy. It is set per project with the
`lift` flag in `data/projects.ts`, from measured luminance, not by eye.

**Missing files hide themselves.** `lib/publicAssets.ts` checks `/public` at
build time. The portrait and the résumé link only render if their file exists,
so nothing ships a 404. Drop the file in and it appears on the next build.

## The field

`lib/field/engine.ts` is a curl-noise particle field drawn on a 2D canvas.
Particles leave trails in an offscreen buffer that fades a little every frame,
and that buffer is composited into the visible canvas. A field can also take a
mask, which is how the knockouts work.

### The background field

There is one field behind everything: `components/field/Backdrop.tsx`, mounted
once in `app/(art)/layout.tsx`, so it survives client navigation and never
rebuilds between pages. It is a fixed canvas the size of the viewport, never
the size of the page, at `z-index: -1`. That is why `body` has no background
(the ground is painted by `html`) and why nothing else on the page may paint an
opaque ground: any box with its own background would cut a hole in the field
with a hard edge. Bands between sections are now just space it shows through.

- **Brighter at the top.** It stands in for the hero's own field. Its trail
  opacity eases from `TOP` at the top of a page down to the preset's `outside`
  over the first screen of scroll, so the hero fades into the rest of the page
  instead of ending at a box edge.
- **Drifts with the scroll.** It follows the page at 30% of its speed
  (`handle.shift()`, in whole device pixels so the trails never blur), on top of
  the scroll-velocity boost every field gets.
- **Pointer and clicks anywhere.** It listens on the document, so the field
  bends around the cursor and a click drops a vortex wherever you are.
- **Takes the page's signature.** Curl and orange on the index. A case study
  renders `PageSignature`, which sets its own signature and accent through
  `lib/field/backdrop.ts` and hands back curl when you leave. The gallery
  morphs it to the project under the pointer (or, without hover, the one in the
  middle of the screen), and a click bursts it out of the project's title.
- **Readable on top.** Running text sits on a scrim: a soft, feathered dark
  wash just behind the text column (two crossed gradient masks in
  `globals.css`), never a hard panel. Body text measures at least 4.5:1 against
  the field behind it, sampled from screenshots.

On phones it runs too, with `maxNarrow` particles.

It has to run on every page without costing much, so:

- **One loop for the page.** Every field on the page shares a single
  `requestAnimationFrame`. When nothing is running, the loop stops instead of
  idling.
- **Built when it is needed.** An `IntersectionObserver` builds a field the
  first time it comes within 320px of the viewport. The builds run one per
  task, so a long page never blocks on all of them at once. Once built, a field
  pauses whenever it is off screen.
- **Stopped while the tab is hidden.** The loop is cancelled on
  `visibilitychange` rather than relying on the browser to throttle rAF.
- **Capped on narrow screens.** Below 700 CSS px a field uses `maxNarrow`
  instead of `maxN`. Phones get roughly a quarter of the particles.
- **Resized only when it matters.** On touch devices only a width change
  rebuilds a field, so the address bar sliding in and out does not reset it.
- **Still for reduced motion.** With `prefers-reduced-motion` the field draws
  one settled frame and never starts the loop. The cursor and tap interactions
  are off, the hero name does not assemble, and view transitions are skipped.

Scrolling briefly speeds up every trail, and the pointer bends the field around
it. Neither does anything under reduced motion.

### Knockouts

A knockout draws only inside its letters (`outside: 0` in every knockout
preset), so it sits on the background field with no rectangle around it. Almost
every respawn lands inside the letters, since particles anywhere else would
never be seen. The hero name and the case study titles work the same way, with
denser fields of their own.

`components/field/Knockout.tsx` renders a heading as real text, laid out by CSS,
selectable and read by screen readers. The canvas behind it traces that layout:
`textMask()` walks the element's text with a `Range`, so it reads the browser's
own line breaks and never touches the DOM React owns. Text inside `.sr-only` is
skipped. Once the mask is drawn the element gets `data-ko="on"` and its text
turns transparent. Without JavaScript, or before the field has drawn, the text
is simply solid.

The canvas has to set `font` before `fontStretch`, because assigning `font`
resets the stretch. Canvas only takes the CSS keywords, so the computed
percentage is snapped to the nearest one (125% is `expanded`). If it were
skipped, the traced letters would come out narrower than the real ones and the
knockout would not line up.

Hero titles are sized with container queries: `--k` is 1 divided by the title's
width in em at the site's settings, so any name spans the hero whatever its
length. `--km` does the same for the narrow layout, where the `.mbr` breaks
split the name across lines.

### Signatures

A signature is the motion a field takes on for one project. They are listed in
`lib/field/signatures.ts`:

| Signature | Project | Motion |
| --- | --- | --- |
| `curl` | the site | Curl noise, the default |
| `orbit` | Vectra XR | Concentric ellipses, as if around a turntable |
| `grain` | Stolarija-BM | Long parallel lines, like wood grain |
| `swirl` | Tavola | A slow, warm swirl around the middle |
| `pulse` | Pentix | Breathes out and in about once a second |
| `bubble` | Shelf | Bubbles rising and wobbling |
| `grid` | RouteMaster | Travel along a street grid |
| `stream` | Runtime | A fast stream that jumps where a graph spikes |
| `tick` | Stocks Royale | Flat runs broken by sudden price jumps |

A field never switches signatures abruptly. `morph()` blends from one set of
weights to the next over about 600ms. The colour belongs to the project, not to
the signature, and is passed in with it.

To add a signature, add an entry to `SIGNATURES` (`tint` is how much of the
project's colour the trails take, `fade` scales trail length). Then add its
velocity term to the flow loop in `engine.ts`, next to the others. Each one is
a few lines that add to `vx` and `vy`, weighted by the signature's current
blend.

### Activity

`lib/activity.ts` counts my public GitHub commits from the last 30 days, once,
at build time. `FieldTuning` maps that count to the field's speed and density
for the whole site: a quiet month is calm, a busy one is livelier, and both are
clamped. Nothing on the page shows the number; it only sets the pace.

It must never break or slow the build. There is a 4 second deadline for the
whole count, and any failure (no network, rate limit, odd payload) returns
`null`, and the field runs at its default. `GITHUB_TOKEN` is optional and only raises the rate limit.

### Transitions

Opening a project from the gallery bursts the field outwards and then navigates
inside `document.startViewTransition`. The project name morphs into the case
study's title, which carries the same `view-transition-name`. The App Router
renders the next page asynchronously, so `lib/field/transition.ts` polls on a
timer until `#case-title` exists and its field has drawn before letting the
transition finish, and gives up after 2.5 seconds so the browser cross-fades
instead. Both titles carry a still of their own field, clipped to the letters,
while the browser snapshots them, so the name travels as particles; a plain
knockout would snapshot as nothing and solid text would flash white. Where view
transitions are not supported, or under reduced motion, the link is an
ordinary link.

## Social cards

The cards are PNGs in `public/og`, one for the homepage and one per case study,
and `lib/meta.ts` points each page's metadata at its own. If a card is missing,
a page falls back to `home.png`. If that is missing too, the page has no image
rather than a broken one.

They are rendered by `scripts/og.mjs` from the real engine: a frozen frame of
the field with the title as a knockout, in the site's own Archivo. It runs by
hand, not in the build, so a missing browser or font can never break a deploy.
Run it after changing a title, a project line or the field, then commit the
PNGs:

```bash
npm run build
npm run og                                   # starts `next start` on a spare port
BASE=http://localhost:3000 node scripts/og.mjs   # or use a server that is already running
node scripts/og.mjs tavola home              # only some cards
```

It needs Playwright with Chromium, which is deliberately not a project
dependency. Install it globally (`npm i -g playwright && npx playwright install
chromium`) or anywhere on `NODE_PATH`.

## Stack

Next.js (App Router), TypeScript, Tailwind CSS v4, and Resend for the contact
form. Set in Archivo through `next/font`, with its width axis loaded so the
display type can run at 125% (expanded). It loads with the `latin-ext` subset
so the ć in Brkić renders instead of falling back mid-word.

## Running it

```bash
npm install
npm run dev
```

The contact form needs a Resend key. Without one the action returns a clear
message rather than failing, so the rest of the site runs fine without it:

```env
RESEND_API_KEY=re_your_api_key_here
GITHUB_TOKEN=optional_for_the_activity_count
```

## Structure

```
app/
  (art)/            Route group for the site. Its layout holds the background
                    field, the lift filter and applies the activity tuning.
    page.tsx        Index: hero, gallery, experience, about, more work, contact
    work/<slug>/    One case study per project
    contact/        Contact page and its server action
  sitemap.ts        Built from data/projects.ts
components/
  field/            Backdrop, PageSignature, FieldCanvas, Knockout, Gallery,
                    FieldTuning (client)
  site/             CaseStudy, CaseHero, NextProject, Band, Frame, Facts and friends
  art/ContactForm.tsx
data/projects.ts    Every project: copy, accent, signature, chain order
lib/
  field/            engine, signatures, presets, noise, useField, transition,
                    backdrop (the background field's shared handle)
  activity.ts       Build-time GitHub commit count
  meta.ts           Page metadata and social card paths
  publicAssets.ts   Build-time file existence checks
scripts/og.mjs      Renders the social cards
public/og/          The rendered cards, committed
```

## Adding a project

1. Add an entry to `projects` in `data/projects.ts`: copy, screenshot and its
   pixel size, `lift`, a signature and an accent. Check that the accent clears
   4.5:1 against `#0e0e10`, since it also colours small text. Position in the
   array is position in the gallery and in the next-project chain, so the links
   either side update themselves. Set `featured: false` to keep it out of both
   and list it under More work instead.
2. Create `app/(art)/work/<slug>/page.tsx`. Wrap it in `CaseStudy` and give the
   hero its `k` and `km`: one divided by the width of the name's longest line in
   em, set in Archivo at 900 weight, 125% stretch and -0.02em tracking. Measure
   it in a browser rather than guessing. Use `pageMetadata` with
   `card: '<slug>'`.
3. Render its card with `node scripts/og.mjs <slug>` and commit the PNG.

The sitemap reads from `data/projects.ts`, so there is nothing to add there.

---

Built by Antonio Brkić.
