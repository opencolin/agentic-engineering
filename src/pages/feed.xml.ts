// STUB — picks up once v1.4 (Astro substrate) merges.
//
// /feed.xml — RSS 2.0 feed of changelog entries and quarterly reports.
//
// Implementation TODO (post v1.4 merge):
// 1. Use Astro's content collections to list:
//    - All entries in content/changelog.md (split by date heading) OR
//      a structured content/changelog collection if we move to MDX.
//    - All issues of content/state-of-agentic-engineering-*.md.
//    - All posts in content/blog/.
// 2. Sort by date desc.
// 3. Emit RSS 2.0 XML using @astrojs/rss (`import rss from '@astrojs/rss'`).
// 4. Validate against the W3C validator on every build.
//
// Expected shape (when implemented):
//
//   import rss from '@astrojs/rss';
//   import { getCollection } from 'astro:content';
//
//   export async function GET(context) {
//     const blog = await getCollection('blog');
//     const reports = await getCollection('reports');
//     return rss({
//       title: 'Agentic Engineering',
//       description: 'The opinionated reference for shipping agents in production.',
//       site: context.site,
//       items: [...blog, ...reports]
//         .sort((a, b) => +new Date(b.data.date) - +new Date(a.data.date))
//         .map((entry) => ({
//           title: entry.data.title,
//           pubDate: new Date(entry.data.date),
//           description: entry.data.description,
//           link: `/${entry.slug}/`,
//         })),
//     });
//   }

export async function GET() {
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Agentic Engineering</title>
    <link>https://agentic-engineering.vercel.app</link>
    <description>STUB — feed.xml ships with v2.0 launch. See src/pages/feed.xml.ts for the planned shape.</description>
    <language>en-us</language>
  </channel>
</rss>`,
    { headers: { 'Content-Type': 'application/rss+xml' } },
  );
}
