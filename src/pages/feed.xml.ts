// /feed.xml — RSS 2.0 feed of changelog entries and other launch posts.
//
// The legacy changelog lives at content/changelog.md as a single page with
// date-headed sections. We parse those headings into discrete <item> elements
// so subscribers see one entry per content addition rather than one entry
// per file write.

import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import fs from 'node:fs';
import path from 'node:path';

interface FeedItem {
  title: string;
  pubDate: Date;
  description: string;
  link: string;
}

const SITE = 'https://agentic-engineering.vercel.app';
const REPO_ROOT = path.resolve(process.cwd());
const CHANGELOG_PATH = path.join(REPO_ROOT, 'content', 'changelog.md');

/**
 * Parse the Site additions block of content/changelog.md into discrete items.
 * The changelog file structure is:
 *
 *   ## Site additions
 *   ### YYYY-MM-DD
 *   - [PR-title](pr-url) — short description
 *   ...
 *   ### YYYY-MM-DD
 *   - ...
 *
 * We treat each "### YYYY-MM-DD" block as a single RSS item: title = "Site
 * additions YYYY-MM-DD", description = the bullet list under it. If the file
 * isn't present (early build, deletion in flight), we degrade to an empty list.
 */
function parseChangelogItems(): FeedItem[] {
  if (!fs.existsSync(CHANGELOG_PATH)) return [];
  const raw = fs.readFileSync(CHANGELOG_PATH, 'utf8');

  // Split on H3 headings that look like dates. We only want the section under
  // "## Site additions", so first carve that block out.
  const additionsStart = raw.indexOf('## Site additions');
  if (additionsStart === -1) return [];
  const after = raw.slice(additionsStart);
  // Stop at the next H2 (e.g. "## Primary source timeline").
  const nextH2 = after.slice(2).search(/\n## /);
  const block = nextH2 === -1 ? after : after.slice(0, nextH2 + 2);

  const items: FeedItem[] = [];
  const dateHeading = /^###\s+(\d{4}-\d{2}-\d{2})\s*$/gm;
  const matches = [...block.matchAll(dateHeading)];
  for (let i = 0; i < matches.length; i++) {
    const m = matches[i];
    const date = m[1];
    const start = m.index! + m[0].length;
    const end = i + 1 < matches.length ? matches[i + 1].index! : block.length;
    const body = block.slice(start, end).trim();
    if (!body) continue;
    items.push({
      title: `Site additions ${date}`,
      pubDate: new Date(date + 'T00:00:00Z'),
      description: body,
      link: `${SITE}/changelog/#${date}`,
    });
  }
  return items;
}

/**
 * Pull the launch post and any state-of-* reports from content/. These are
 * one-off feed items separate from the rolling changelog.
 */
function parseStandaloneItems(): FeedItem[] {
  const items: FeedItem[] = [];
  const candidates: { file: string; slug: string }[] = [
    { file: 'content/blog/v2-launch.md', slug: 'blog/v2-launch' },
    { file: 'content/state-of-agentic-engineering-2026-q2.md', slug: 'state-of-agentic-engineering-2026-q2' },
  ];
  for (const c of candidates) {
    const p = path.join(REPO_ROOT, c.file);
    if (!fs.existsSync(p)) continue;
    const raw = fs.readFileSync(p, 'utf8');
    // Pull title from the YAML frontmatter or first H1. Tolerate a leading
    // HTML comment (some legacy files have `<!-- description: ... -->` before
    // the YAML block).
    const frontmatter = raw.match(/(?:^|\n)---\n([\s\S]*?)\n---/);
    let title = c.slug;
    let date = new Date();
    let description = '';
    if (frontmatter) {
      const fm = frontmatter[1];
      const t = fm.match(/^title:\s*(.+)$/m);
      const d = fm.match(/^date:\s*(\d{4}-\d{2}-\d{2})/m);
      const desc = fm.match(/^description:\s*(.+)$/m);
      if (t) title = t[1].replace(/^["']|["']$/g, '').trim();
      if (d) date = new Date(d[1] + 'T00:00:00Z');
      if (desc) description = desc[1].replace(/^["']|["']$/g, '').trim();
    } else {
      const h1 = raw.match(/^#\s+(.+)$/m);
      if (h1) title = h1[1];
    }
    if (!description) {
      // Fall back to the legacy <!-- description: ... --> comment.
      const cm = raw.match(/<!--\s*description:\s*([\s\S]*?)\s*-->/);
      if (cm) description = cm[1].trim();
    }
    items.push({
      title,
      pubDate: date,
      description,
      link: `${SITE}/${c.slug}/`,
    });
  }
  return items;
}

export async function GET(context: APIContext) {
  const items = [...parseChangelogItems(), ...parseStandaloneItems()].sort(
    (a, b) => +b.pubDate - +a.pubDate,
  );

  return rss({
    title: 'Agentic Engineering',
    description:
      'The opinionated reference for shipping agents in production. Content additions, quarterly reports, and launch posts.',
    site: context.site ?? SITE,
    items: items.map((it) => ({
      title: it.title,
      pubDate: it.pubDate,
      description: it.description,
      link: it.link,
    })),
    customData: '<language>en-us</language>',
  });
}
