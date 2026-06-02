// Astro scaffold for v1.4 release.
//
// IMPORTANT (read me before changing build wiring):
// This Astro setup lives ALONGSIDE the legacy `build.sh` pipeline on the
// `claude/v1.4-astro-design` branch. `vercel.json` still points at the bash
// build and continues to ship `index.html` as the production preview.
//
// The flip from `bash build.sh` to `astro build` happens at MERGE TIME — not
// during the migration. Until then, both pipelines coexist here:
//   - `npm run build` / `npm run build:legacy` → bash → `index.html` (deployed)
//   - `npm run astro:build` → Astro → `dist/`  (local iteration only)
//
// See MIGRATION.md for the full plan.

import { defineConfig } from 'astro/config';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

export default defineConfig({
  site: 'https://agentic-engineering.vercel.app',
  output: 'static',
  outDir: './dist',
  // While bash build owns the root deploy, drop Astro output into ./dist and
  // do NOT touch index.html. vercel.json still serves the bash-built tree.
  build: {
    format: 'directory',
  },
  markdown: {
    shikiConfig: {
      // PM #3 §4 preferred theme. `github-dark-dimmed` is the fallback.
      theme: 'vesper',
      wrap: false,
    },
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: 'append',
          properties: {
            className: ['header-anchor'],
            ariaLabel: 'Link to section',
          },
          content: {
            type: 'text',
            value: '#',
          },
        },
      ],
    ],
  },
  vite: {
    // Keep the legacy /css and /js assets reachable in dev so we can
    // visually compare bash vs Astro output side-by-side.
    server: {
      fs: { allow: ['..'] },
    },
  },
});
