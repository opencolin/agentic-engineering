// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
  site: 'https://agentic-engineering.pages.dev',
  integrations: [
    starlight({
      title: 'Agentic Engineering',
      description:
        'A comprehensive reference to autonomous coding agents, agentic organizations, and the emerging patterns of AI-native software engineering.',
      logo: {
        light: './src/assets/light.svg',
        dark: './src/assets/dark.svg',
        replacesTitle: true,
      },
      favicon: '/favicon.svg',
      social: [
        {
          icon: 'rss',
          label: 'Events',
          href: '/events/',
        },
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/opencolin/agentic-engineering',
        },
      ],
      customCss: ['./src/styles/theme.css'],
      sidebar: [
        {
          label: 'Get Started',
          items: [
            { label: 'Overview', slug: 'index' },
            { label: 'Table of Contents', slug: 'table-of-contents' },
            { label: 'Events', slug: 'events' },
          ],
        },
        {
          label: 'Landscape',
          items: [
            { label: 'Models', slug: 'models' },
            { label: 'Approaches', slug: 'approaches' },
            { label: 'Patterns', slug: 'patterns' },
            { label: 'Harness Engineering', slug: 'harness-engineering' },
            { label: 'Schools', slug: 'schools' },
            { label: 'Benchmarks', slug: 'benchmarks' },
            { label: 'Comparison', slug: 'comparison' },
            { label: 'Organizations', slug: 'organizations' },
            { label: "Who's Who", slug: 'who-is-who' },
          ],
        },
        {
          label: 'Infrastructure',
          items: [
            { label: 'Inference', slug: 'inference' },
            { label: 'Sandboxes', slug: 'sandboxes' },
            { label: 'Hosting & Execution', slug: 'infrastructure' },
          ],
        },
        {
          label: 'Interfaces',
          items: [
            { label: 'Generative UI', slug: 'generative-ui' },
          ],
        },
        {
          label: 'Reference',
          items: [
            { label: 'Research Notes', slug: 'research-notes' },
          ],
        },
      ],
      editLink: {
        baseUrl:
          'https://github.com/opencolin/agentic-engineering/edit/main/docs/',
      },
      lastUpdated: true,
    }),
  ],
});
