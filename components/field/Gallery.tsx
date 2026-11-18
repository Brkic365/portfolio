'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, type MouseEvent } from 'react';
import FieldCanvas from '@/components/field/FieldCanvas';
import Knockout from '@/components/field/Knockout';
import type { FieldHandle } from '@/lib/field/engine';
import type { Signature } from '@/lib/field/signatures';
import { canMorph, morphTo } from '@/lib/field/transition';

export interface GalleryProject {
  slug: string;
  name: string;
  line: string;
  role: string;
  stack: string;
  url: string;
  urlLabel: string;
  image: string;
  lift: boolean;
  sig: Signature;
  accent: string;
}

const WORDS = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'];

/**
 * Selected work: a sticky horizontal track driven by vertical scroll, with a
 * field behind it that takes on each project's signature when you hover,
 * focus or (without hover) scroll a project into view. Below 820px it is a
 * plain vertical list, and each name's own knockout carries the signature.
 *
 * Clicking into a project streams particles out of its title, then morphs
 * the title into the case study's hero through a view transition.
 */
export default function Gallery({
  projects,
  accents,
}: {
  projects: GalleryProject[];
  accents: Partial<Record<Signature, string>>;
}) {
  const router = useRouter();
  const sec = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLElement>(null);
  const count = useRef<HTMLSpanElement>(null);
  const galCanvas = useRef<HTMLDivElement>(null);
  const gal = useRef<FieldHandle | null>(null);
  const names = useRef(new Map<string, FieldHandle>());
  const going = useRef(false);
  const total = projects.length;

  /* Signatures: hover, focus, or (without hover) the panel holding the middle of the screen. */
  useEffect(() => {
    const root = sec.current;
    if (!root) return;
    const panels = [...root.querySelectorAll<HTMLElement>('.panel[data-sig]')];
    let cur: HTMLElement | null = null;
    const set = (panel: HTMLElement | null) => {
      if (panel === cur) return;
      if (cur) {
        cur.classList.remove('on');
        names.current.get(cur.dataset.slug!)?.morph('curl');
      }
      cur = panel;
      const sig = (panel?.dataset.sig as Signature | undefined) ?? 'curl';
      if (panel) {
        panel.classList.add('on');
        names.current.get(panel.dataset.slug!)?.morph(sig);
      }
      gal.current?.morph(sig);
      if (panel?.dataset.accent) root.style.setProperty('--acc', panel.dataset.accent);
      else root.style.removeProperty('--acc');
    };
    const hover = window.matchMedia('(hover: hover) and (pointer: fine)');
    const off: (() => void)[] = [];
    for (const p of panels) {
      const enter = (e: PointerEvent) => e.pointerType === 'mouse' && set(p);
      const leave = (e: PointerEvent) => e.pointerType === 'mouse' && cur === p && set(null);
      const focusin = () => set(p);
      const focusout = (e: FocusEvent) => {
        if (!p.contains(e.relatedTarget as Node | null) && cur === p) set(null);
      };
      p.addEventListener('pointerenter', enter);
      p.addEventListener('pointerleave', leave);
      p.addEventListener('focusin', focusin);
      p.addEventListener('focusout', focusout);
      off.push(() => {
        p.removeEventListener('pointerenter', enter);
        p.removeEventListener('pointerleave', leave);
        p.removeEventListener('focusin', focusin);
        p.removeEventListener('focusout', focusout);
      });
    }
    let q = 0;
    const inView = () => {
      q = 0;
      if (hover.matches) return;
      const cx = window.innerWidth / 2, cy = window.innerHeight / 2;
      let hit: HTMLElement | null = null;
      for (const p of panels) {
        const r = p.getBoundingClientRect();
        if (r.left <= cx && r.right >= cx && r.top <= cy && r.bottom >= cy) {
          hit = p;
          break;
        }
      }
      set(hit);
    };
    const onScroll = () => {
      if (!q) q = requestAnimationFrame(inView);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    const t = setTimeout(inView, 600);
    return () => {
      off.forEach((f) => f());
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(q);
      clearTimeout(t);
    };
  }, []);

  /* The horizontal track, driven by vertical scroll. */
  useEffect(() => {
    const root = sec.current, tr = track.current;
    if (!root || !tr) return;
    const mq = window.matchMedia('(max-width: 820px)');
    let dist = 0;
    const update = () => {
      if (mq.matches) {
        if (count.current) count.current.textContent = `${total} projects`;
        return;
      }
      const top = root.getBoundingClientRect().top;
      const p = Math.min(1, Math.max(0, -top / (dist || 1)));
      tr.style.transform = `translate3d(${-p * dist}px,0,0)`;
      bar.current?.style.setProperty('--p', p.toFixed(4));
      const idx = Math.min(total, Math.max(0, Math.round(p * total)));
      if (count.current) count.current.textContent = idx === 0 ? 'Scroll down to move sideways' : `${idx} of ${total}`;
    };
    const measure = () => {
      if (mq.matches) {
        root.style.height = '';
        tr.style.transform = '';
        update();
        return;
      }
      dist = Math.max(0, tr.scrollWidth - window.innerWidth);
      root.style.height = `${window.innerHeight + dist}px`;
      update();
    };
    /* Keyboard: tabbing into a panel off to the side scrolls the page until it is in view. */
    const onFocus = (e: FocusEvent) => {
      if (mq.matches || !dist) return;
      const panel = (e.target as HTMLElement).closest<HTMLElement>('.panel');
      if (!panel) return;
      const r = panel.getBoundingClientRect();
      if (r.left >= 0 && r.right <= window.innerWidth + 1) return;
      const p = Math.min(1, Math.max(0, panel.offsetLeft / dist));
      const y = root.getBoundingClientRect().top + window.scrollY + p * dist;
      window.scrollTo({ top: y, behavior: 'instant' as ScrollBehavior });
    };
    const ro = new ResizeObserver(measure);
    ro.observe(tr);
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', measure);
    mq.addEventListener('change', measure);
    root.addEventListener('focusin', onFocus);
    measure();
    return () => {
      ro.disconnect();
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', measure);
      mq.removeEventListener('change', measure);
      root.removeEventListener('focusin', onFocus);
      root.style.height = '';
    };
  }, [total]);

  /* Into a case study: a burst out of the title, then the view transition. */
  const go = (e: MouseEvent<HTMLAnchorElement>, p: GalleryProject) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (!canMorph()) return; // no support, or reduced motion: the link just navigates
    e.preventDefault();
    if (going.current) return;
    going.current = true;
    const href = `/work/${p.slug}`;
    router.prefetch(href);
    const title = document.getElementById(`gt-${p.slug}`);
    const word = title?.querySelector('a') ?? title;
    const wrap = galCanvas.current?.querySelector('canvas');
    const useGal = !!wrap && getComputedStyle(wrap).display !== 'none' && gal.current;
    const field = useGal ? gal.current : names.current.get(p.slug);
    const canvas = useGal ? wrap : title?.parentElement?.querySelector('canvas');
    if (field && canvas && word) {
      const t = word.getBoundingClientRect(), r = canvas.getBoundingClientRect();
      field.morph(p.sig);
      field.burst(t.left - r.left, t.top - r.top + t.height * 0.15, t.width, t.height * 0.7);
    }
    setTimeout(() => {
      morphTo(router, href, title).finished.finally(() => {
        going.current = false;
      });
    }, 340);
  };

  return (
    <section className="work" id="work" aria-labelledby="work-h" ref={sec}>
      <div className="pin">
        <div ref={galCanvas} style={{ display: 'contents' }}>
          <FieldCanvas className="gal-field" preset="gallery" accents={accents} onField={(f) => (gal.current = f)} />
        </div>
        <div className="bar wrap small">
          <h2 id="work-h">Selected work</h2>
          <span ref={count}>Scroll down to move sideways</span>
        </div>
        <div className="prog" aria-hidden="true">
          <i ref={bar} />
        </div>
        <div className="track" ref={track}>
          <div className="panel intro">
            <Knockout as="h3" className="disp">
              {WORDS[total] ?? total}
              <br />
              projects.
            </Knockout>
            <p>Most of them have something live in them: a camera, a 3D model, traffic. Keep scrolling to move through them.</p>
          </div>

          {projects.map((p, i) => {
            const href = `/work/${p.slug}`;
            return (
              <article className="panel" key={p.slug} data-sig={p.sig} data-slug={p.slug} data-accent={p.accent}>
                <div className="p-meta small">
                  <span>
                    <b>{i + 1}</b> of {total}
                  </span>
                  <span>{p.role}</span>
                </div>
                <Knockout
                  as="h3"
                  id={`gt-${p.slug}`}
                  className="p-name disp"
                  wrapClassName="name-wrap"
                  preset="name"
                  accents={{ [p.sig]: p.accent }}
                  onField={(f) => {
                    if (f) names.current.set(p.slug, f);
                    else names.current.delete(p.slug);
                  }}
                >
                  <Link href={href} onClick={(e) => go(e, p)}>
                    {p.name}
                  </Link>
                </Knockout>
                <div className="p-body">
                  <figure className={p.lift ? 'lift' : undefined}>
                    <Link href={href} tabIndex={-1} aria-hidden="true" onClick={(e) => go(e, p)}>
                      <Image src={p.image} alt="" fill sizes="(max-width: 820px) 92vw, 80vw" />
                    </Link>
                  </figure>
                  <div className="p-text">
                    <p className="line">{p.line}.</p>
                    <dl>
                      <dt>Stack</dt>
                      <dd>{p.stack}</dd>
                      <dt>{p.urlLabel}</dt>
                      <dd>
                        <a href={`https://${p.url}`} target="_blank" rel="noopener noreferrer">
                          {p.url}
                        </a>
                      </dd>
                      <dt>More</dt>
                      <dd>
                        <Link href={href} onClick={(e) => go(e, p)}>
                          Read the case study
                        </Link>
                      </dd>
                    </dl>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
