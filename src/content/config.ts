// Content collection schema for v1.4 Astro migration.
//
// The legacy site stored page metadata in two places:
//   1. `<!-- description: ... -->` HTML comments at the top of each markdown file.
//   2. `content/manifest.json` (sidebar grouping/ordering).
//
// We unify both into per-file YAML frontmatter validated by this Zod schema.
// `manifest.json` becomes deprecated once all pages are migrated.

import { defineCollection, z } from 'astro:content';

const docs = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    // Sidebar grouping. Mirrors the headings used in build.sh's heredoc:
    // "Get Started" | "Foundations" | "People & Orgs" | "Infrastructure"
    // | "Interfaces" | "Reference" | "Community".
    group: z.enum([
      'Get Started',
      'Foundations',
      'People & Orgs',
      'Infrastructure',
      'Interfaces',
      'Reference',
      'Community',
    ]),
    // Within-group sort key. Lower = higher in the sidebar.
    order: z.number().int().nonnegative(),
    // Optional editorial metadata, kept open for v1.3 + v2.0 freshness work.
    lastVerified: z.string().optional(),
    staleBy: z.string().optional(),
  }),
});

export const collections = { docs };
