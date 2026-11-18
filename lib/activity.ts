import 'server-only';

/**
 * Real activity for the field: public GitHub commits in the last 30 days,
 * counted once at build time.
 *
 * It must never break or noticeably slow the build, so every failure path
 * (no network, rate limit, odd payload, timeout) returns null and the field
 * runs at its default speed. Set GITHUB_TOKEN to raise the rate limit; it is
 * optional.
 *
 * Counting: each PushEvent contributes its `size` (commits in the push). Since
 * late 2025 GitHub has been trimming commit details from public event
 * payloads, so when `size` is missing a push counts as one commit, then
 * `commits.length` if that is present. The public events feed also only goes
 * back 300 events or 90 days, which is plenty for a 30-day window.
 */

const USER = 'Brkic365';
const WINDOW_DAYS = 30;
const PAGES = 3;
const TIMEOUT_MS = 4000;

interface PushPayload {
  size?: number;
  commits?: unknown[];
}

interface GitHubEvent {
  type?: string;
  created_at?: string;
  payload?: PushPayload;
}

async function fetchCommits(): Promise<number | null> {
  try {
    const headers: Record<string, string> = {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'portfolio-build',
      'X-GitHub-Api-Version': '2022-11-28',
    };
    if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

    const since = Date.now() - WINDOW_DAYS * 24 * 60 * 60 * 1000;
    // One deadline for the whole count, not one per page.
    const signal = AbortSignal.timeout(TIMEOUT_MS);
    let commits = 0;

    for (let page = 1; page <= PAGES; page++) {
      const res = await fetch(
        `https://api.github.com/users/${USER}/events/public?per_page=100&page=${page}`,
        { headers, signal, cache: 'force-cache' },
      );
      if (!res.ok) return null;
      const events = (await res.json()) as unknown;
      if (!Array.isArray(events)) return null;

      let older = false;
      for (const ev of events as GitHubEvent[]) {
        const at = ev.created_at ? Date.parse(ev.created_at) : NaN;
        if (!Number.isFinite(at)) continue;
        if (at < since) {
          older = true;
          continue;
        }
        if (ev.type !== 'PushEvent') continue;
        const p = ev.payload ?? {};
        commits +=
          typeof p.size === 'number' && p.size >= 0
            ? p.size
            : Array.isArray(p.commits) && p.commits.length
              ? p.commits.length
              : 1;
      }
      // Events are newest first, so once a page reaches past the window there is nothing more to count.
      if (older || events.length < 100) break;
    }
    return commits;
  } catch {
    return null;
  }
}

let memo: Promise<number | null> | null = null;

/** Commits in the last 30 days, or null when GitHub could not be reached. */
export function getActivity(): Promise<number | null> {
  memo ??= fetchCommits();
  return memo;
}

export function activityLabel(commits: number | null): string {
  if (commits === null) return 'Field speed: default';
  return `Field speed: ${commits} commit${commits === 1 ? '' : 's'} in the last 30 days`;
}
