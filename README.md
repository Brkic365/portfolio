# Portfolio

My personal site, live at **[antoniobrkic.com](https://antoniobrkic.com)**.

An index of the work at `/`, and a case study per project at `/work/<slug>`. Each
project page commits to its own palette and layout rather than reusing one
template, so moving between them feels like turning pages in a magazine instead
of paging through a CMS.

## How it is built

A few decisions that are worth knowing before changing anything.

**Every route is static.** The production build prerenders all of them and ships
no serverless functions. The contact form is a server action rather than an API
route, which means there is no public POST endpoint and the Resend key never
reaches the browser.

**Motion is scroll-driven CSS.** Reveals and the hero entrance use
`animation-timeline: view()`, so there is no animation library and no client
JavaScript keeping animations in sync with scroll. It is gated twice: behind
`@supports`, so browsers without scroll timelines render the final state, and
behind `prefers-reduced-motion`. Note that the global reduced-motion rule at the
bottom of `globals.css` does **not** cover timeline-driven animations, because
they ignore `animation-duration`. That is why the media query is repeated.

**One client component.** `components/art/ContactForm.tsx` is the only
`'use client'` file. React 19 resets an uncontrolled form once its action
resolves, so the action echoes submitted values back and the form is keyed on an
attempt counter. Without that, a validation error throws away whatever the person
had typed.

**Screenshots are framed, never full-bleed.** A UI screenshot carries its own
headlines, and putting site typography on top of it puts two type systems in one
space. `components/art/Shot.tsx` renders them in window chrome at roughly half
width, which also means the ~2300px sources downscale instead of upscaling.

**Dark screenshots get a gamma lift.** Several captures have a mean luminance
under 45 of 255 and disappear against a dark background. An SVG
`feComponentTransfer` filter in `app/(art)/layout.tsx` raises the shadows.
Keep it gentle: a steeper curve amplifies the compression noise sitting in the
near-black areas and the images turn grainy. Set per image with the `lift` flag.

**The social card is generated.** `app/opengraph-image.tsx` renders it at build
time in the site's own display face, so it cannot drift out of date. The font is
fetched without a User-Agent override, since legacy UA strings make Google serve
EOT, which Satori rejects. The buffer's signature is checked before use and the
card falls back to a default sans if anything fails.

**Missing files hide themselves.** `lib/publicAssets.ts` checks `/public` at
build time. The résumé link and some project screenshots only render if their
file exists, so nothing ships a 404. Drop the file in and it appears on the next
build.

## Stack

Next.js (App Router), TypeScript, Tailwind CSS v4, and Resend for the contact
form. Set in Instrument Serif, Newsreader and JetBrains Mono, all loaded with the
`latin-ext` subset so the ć in Brkić renders instead of falling back mid-word.

## Running it

```bash
npm install
npm run dev
```

The contact form needs a Resend key. Without one the action returns a clear
message rather than failing, so the rest of the site runs fine without it:

```env
RESEND_API_KEY=re_your_api_key_here
```

## Structure

```
app/
  (art)/            Route group for the site. Its layout holds the SVG filter.
    page.tsx        Index: hero, work, about, archive, contact footer
    work/<slug>/    One page per project, each with its own theme
    contact/        Contact page and its server action
  opengraph-image.tsx
components/art/     Shot (framed screenshot) and ContactForm
data/projectThemes.ts   Per-project palettes, applied as inline CSS variables
lib/publicAssets.ts     Build-time file existence checks
```

## Adding a project

1. Add a palette to `data/projectThemes.ts`. Check the secondary and tertiary
   inks clear 4.5:1 against the background.
2. Add an entry to the `work` array in `app/(art)/page.tsx`.
3. Create `app/(art)/work/<slug>/page.tsx`. Copy the closest existing page, then
   change the layout, since sharing one template defeats the point.
4. Add the slug to `app/sitemap.ts` and fix the next-project links either side of
   it in the chain.

---

Built by Antonio Brkić.
