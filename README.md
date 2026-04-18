# Agentic Engineering

A comprehensive reference to autonomous coding agents, agentic organizations, and the emerging patterns of AI-native software engineering. Built as a [Mintlify](https://mintlify.com) documentation portal.

Covers 14+ agent systems (Stripe Minions, Claude Managed Agents, OpenAI Symphony, OpenHands, AgentField, Devin, and more), 180+ infrastructure vendors, and the architectural patterns, organizational models, and market structure of the category.

## Local Development

Requires Node 22 or earlier (Mintlify CLI doesn't support Node 25+).

```bash
npm install
npm run dev           # Boot local preview on http://localhost:3000
npm run broken-links  # Validate internal links
```

## Structure

```
.
├── docs.json                # Mintlify config (navigation, theme, logo)
├── index.mdx                # Home page
├── approaches.mdx           # Deep dives on agent systems
├── patterns.mdx             # Architectural patterns
├── comparison.mdx           # Feature matrix
├── organizations.mdx        # How companies organize around agents
├── inference.mdx            # LLM inference solutions
├── sandboxes.mdx            # Sandbox infrastructure deep dive
├── infrastructure.mdx       # Hosting and execution platforms
├── favicon.svg
└── logo/
    ├── light.svg
    └── dark.svg
```

## Deployment

This site is designed for Mintlify hosting. To deploy:

1. Sign up at [mintlify.com/dashboard](https://mintlify.com/dashboard)
2. Connect this GitHub repository
3. Mintlify auto-builds and hosts the site on every push to `main`

## Editing Content

Every page is an MDX file at the repo root. Markdown plus Mintlify components like `<Card>`, `<CardGroup>`, `<Note>`, `<Warning>`, and `<Steps>`. Internal links use clean URLs (`/approaches#section` style). See [Mintlify docs](https://mintlify.com/docs) for the full component library.

## License

MIT
