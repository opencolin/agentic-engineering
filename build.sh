#!/bin/bash
# Build index.html by inlining markdown content
cd "$(dirname "$0")"

cat > index.html << 'HTMLHEAD'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Automate Engineering — A Reference for Agentic Engineering</title>
  <meta name="description" content="A comprehensive guide to autonomous coding agents, agentic organizations, and the emerging patterns of AI-native software engineering.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/style.css">
  <script>
    // Early theme init — runs before <body> paints to avoid FOUC.
    (function () {
      try {
        var stored = localStorage.getItem('ae-theme');
        var theme = stored || (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
        document.documentElement.setAttribute('data-theme', theme);
      } catch (e) {}
    })();
  </script>
</head>
<body>
  <a href="#main" class="skip-to-content">Skip to content</a>
  <header class="topbar">
    <button class="sidebar-toggle" aria-label="Toggle navigation" aria-expanded="false" aria-controls="sidebar">&#9776;</button>
    <a href="#" class="topbar-brand" data-page="index"><span>&gt;_</span> Automate Engineering</a>
    <div class="topbar-search">
      <label class="search-field">
        <span class="search-icon" aria-hidden="true">&#128269;</span>
        <input type="search" id="search-input" placeholder="Search..." autocomplete="off" spellcheck="false" role="combobox" aria-controls="search-results" aria-expanded="false" aria-autocomplete="list" aria-label="Search the reference" />
        <kbd class="search-kbd">/</kbd>
      </label>
      <ul id="search-results" class="search-results" role="listbox" hidden></ul>
    </div>
    <div class="topbar-actions">
      <a href="/events/" class="topbar-action-link">Events</a>
      <a href="/contact/" class="topbar-action-link">Contact</a>
      <button class="theme-toggle" type="button" aria-pressed="false" aria-label="Switch to light mode" title="Switch to light mode">
        <svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>
        <svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
      </button>
    </div>
  </header>

  <div id="sidebar-scrim" class="sidebar-scrim" aria-hidden="true"></div>

  <div class="layout">
    <aside id="sidebar" class="sidebar" aria-label="Navigation">
      <div class="sidebar-inner">
        <nav class="sidebar-nav" aria-label="Primary">
          <div class="sidebar-group">
            <div class="sidebar-group-title">Get Started</div>
            <a href="#" class="sidebar-link" data-page="index">Overview</a>
            <a href="#" class="sidebar-link" data-page="table-of-contents">Table of Contents</a>
            <a href="#" class="sidebar-link" data-page="reading-list">Reading List</a>
            <a href="#" class="sidebar-link" data-page="changelog">Changelog</a>
          </div>
          <div class="sidebar-group">
            <div class="sidebar-group-title">Foundations</div>
            <a href="#" class="sidebar-link" data-page="approaches">Approaches</a>
            <a href="#" class="sidebar-link" data-page="patterns">Patterns</a>
            <a href="#" class="sidebar-link" data-page="harness-engineering">Harness Engineering</a>
            <a href="#" class="sidebar-link" data-page="context-engineering">Context Engineering</a>
            <a href="#" class="sidebar-link" data-page="tool-design">Tool Design</a>
            <a href="#" class="sidebar-link" data-page="skills">Skills</a>
            <a href="#" class="sidebar-link" data-page="memory">Memory</a>
            <a href="#" class="sidebar-link" data-page="evals">Evals</a>
            <a href="#" class="sidebar-link" data-page="benchmarks">Benchmarks</a>
            <a href="#" class="sidebar-link" data-page="models">Models</a>
          </div>
          <div class="sidebar-group">
            <div class="sidebar-group-title">People &amp; Orgs</div>
            <a href="#" class="sidebar-link" data-page="schools">Schools</a>
            <a href="#" class="sidebar-link" data-page="who-is-who">Who's Who</a>
            <a href="#" class="sidebar-link" data-page="organizations">Organizations</a>
          </div>
          <div class="sidebar-group">
            <div class="sidebar-group-title">Infrastructure</div>
            <a href="#" class="sidebar-link" data-page="inference">Inference</a>
            <a href="#" class="sidebar-link" data-page="sandboxes">Sandboxes</a>
            <a href="#" class="sidebar-link" data-page="infrastructure">Hosting</a>
          </div>
          <div class="sidebar-group">
            <div class="sidebar-group-title">Interfaces</div>
            <a href="#" class="sidebar-link" data-page="generative-ui">Generative UI</a>
          </div>
          <div class="sidebar-group">
            <div class="sidebar-group-title">Operate</div>
            <a href="#" class="sidebar-link" data-page="deployment">Deployment</a>
            <a href="#" class="sidebar-link" data-page="observability">Observability</a>
            <a href="#" class="sidebar-link" data-page="safety">Safety</a>
            <a href="#" class="sidebar-link" data-page="cost-economics">Cost &amp; Economics</a>
          </div>
          <div class="sidebar-group">
            <div class="sidebar-group-title">Reference</div>
            <a href="#" class="sidebar-link" data-page="research-notes">Research Notes</a>
          </div>
          <div class="sidebar-group">
            <div class="sidebar-group-title">Community</div>
            <a href="https://github.com/opencolin/agentic-engineering" class="sidebar-link sidebar-link-external" target="_blank" rel="noopener">GitHub &#8599;</a>
          </div>
        </nav>
      </div>
    </aside>

    <main id="main" class="content" tabindex="-1">
      <article id="content" class="markdown-body">
        <p class="loading">Loading...</p>
      </article>
      <footer class="content-footer">
        <p>Automate Engineering &mdash; a reference for agentic engineering. Content stored as plain markdown for easy reading by humans and agents alike.</p>
      </footer>
    </main>

    <aside class="toc-rail" id="toc-rail" aria-label="On this page" hidden>
      <div class="toc-rail-title">On this page</div>
      <ul id="toc-rail-list"></ul>
    </aside>
  </div>

  <button id="toc-sheet-toggle" class="toc-sheet-toggle" type="button" aria-controls="toc-sheet" aria-expanded="false" hidden>On this page</button>
  <div id="toc-sheet" class="toc-sheet" role="dialog" aria-label="On this page" aria-modal="false" hidden>
    <div class="toc-sheet-handle" aria-hidden="true"></div>
    <div class="toc-sheet-title">On this page</div>
    <ul id="toc-sheet-list"></ul>
  </div>

HTMLHEAD

# Inline each markdown file as a script tag
for page in index table-of-contents reading-list changelog approaches patterns harness-engineering context-engineering tool-design skills memory evals benchmarks models schools who-is-who organizations inference sandboxes infrastructure generative-ui deployment observability safety cost-economics research-notes; do
  echo "  <script type=\"text/markdown\" data-page=\"${page}\">" >> index.html
  # Escape </script> in content just in case
  sed 's|</script>|<\\/script>|g' "content/${page}.md" >> index.html
  echo "  </script>" >> index.html
done

cat >> index.html << 'HTMLFOOT'

  <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
  <script src="js/main.js"></script>
  <script src="js/theme.js"></script>
</body>
</html>
HTMLFOOT

echo "Built index.html with inlined markdown"
