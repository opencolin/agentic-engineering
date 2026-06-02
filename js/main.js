// Markdown rendering, sidebar navigation, and search
function init() {
  if (typeof marked === 'undefined') {
    setTimeout(init, 50);
    return;
  }

  // Generate heading IDs from text and render inline markdown (links, bold, etc.)
  const renderer = new marked.Renderer();
  renderer.heading = function (arg) {
    const depth = arg.depth;
    let innerHTML;
    let plainText;
    if (arg.tokens && this.parser && typeof this.parser.parseInline === 'function') {
      innerHTML = this.parser.parseInline(arg.tokens);
      // Strip tags and HTML entities. parseInline escapes `&` → `&amp;` and
      // `'` → `&#39;`, so without this both "Memory & Context" and "you're"
      // would carry entity noise into the slug. Removing entities (rather
      // than replacing with a space) keeps "you're" → "youre" while letting
      // the surrounding whitespace in "X &amp; Y" still collapse to one dash.
      plainText = innerHTML
        .replace(/<[^>]+>/g, '')
        .replace(/&[a-z]+;|&#x?[0-9a-f]+;/gi, '');
    } else {
      const raw = typeof arg.text === 'string' ? arg.text : (arg.text && (arg.text.text || arg.text.raw)) || String(arg.text);
      innerHTML = raw;
      plainText = raw;
    }
    const slug = plainText.toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    // Add a hover-revealed anchor link before the heading text. depth>1 only
    // — h1 is the chapter title and doesn't need a self-link.
    const anchor = depth > 1
      ? `<a class="heading-anchor" href="#${slug}" aria-label="Link to ${plainText}">#</a>`
      : '';
    return `<h${depth} id="${slug}">${anchor}${innerHTML}</h${depth}>`;
  };
  marked.setOptions({ renderer });

  const contentEl = document.getElementById('content');
  const pages = {};
  const pageTitles = {
    index: 'Overview',
    'table-of-contents': 'Table of Contents',
    approaches: 'Approaches',
    patterns: 'Patterns',
    'harness-engineering': 'Harness Engineering',
    schools: 'Schools',
    benchmarks: 'Benchmarks',
    organizations: 'Organizations',
    'who-is-who': "Who's Who",
    inference: 'Inference',
    sandboxes: 'Sandboxes',
    infrastructure: 'Hosting & Execution',
    'generative-ui': 'Generative UI',
  };

  // Collect inline markdown from script tags
  document.querySelectorAll('script[type="text/markdown"]').forEach(s => {
    pages[s.dataset.page] = s.textContent;
  });

  let currentPage = '';

  function renderPage(page, scrollToFragment) {
    const needsRender = page !== currentPage;
    if (needsRender) {
      currentPage = page;

      const md = pages[page];
      if (!md) {
        contentEl.innerHTML = '<p>Page not found.</p>';
        return;
      }

      contentEl.innerHTML = marked.parse(md);

      // Tag each <td> with its column header so the mobile card layout can
      // render a "LABEL: value" stack via CSS ::before. Also flag the first
      // link in each row as the card's primary link, so mobile CSS can
      // stretch it across the whole row for an easier tap target.
      contentEl.querySelectorAll('table').forEach(table => {
        const headers = Array.from(table.querySelectorAll('thead th'))
          .map(th => th.textContent.trim());
        table.querySelectorAll('tbody tr').forEach(tr => {
          if (headers.length) {
            Array.from(tr.children).forEach((td, i) => {
              if (headers[i]) td.setAttribute('data-label', headers[i]);
            });
          }
          const firstLink = tr.querySelector('a');
          if (firstLink) firstLink.classList.add('card-primary-link');
        });
      });

      // Update active sidebar link
      document.querySelectorAll('.sidebar-link').forEach(a => {
        const isActive = a.dataset.page === page;
        a.classList.toggle('active', isActive);
        if (isActive) a.setAttribute('aria-current', 'page');
        else a.removeAttribute('aria-current');
      });

      // Close mobile sidebar after navigating
      closeSidebar();

      // Rewrite in-page anchor links from `#slug` to the SPA `#page:slug`
      // form so they participate in the hash router instead of being treated
      // as a different page. Runs BEFORE the .md handler so that .md
      // links — which only have href `xxx.md` at this point, not `#xxx`
      // — aren't accidentally caught here.
      contentEl.querySelectorAll('a').forEach(a => {
        const href = a.getAttribute('href');
        if (!href || !href.startsWith('#') || href.length < 2) return;
        const slug = href.slice(1);
        if (slug.includes(':')) return;
        a.setAttribute('href', '#' + page + ':' + slug);
        if (!a.classList.contains('heading-anchor')) {
          a.addEventListener('click', (e) => {
            e.preventDefault();
            renderPage(page, slug);
          });
        }
      });

      // Make markdown links to .md files work as SPA navigation. Skip
      // absolute URLs — `https://github.com/.../strategy.md` is an external
      // link, not an internal page reference.
      contentEl.querySelectorAll('a').forEach(a => {
        const href = a.getAttribute('href');
        if (!href || !href.includes('.md')) return;
        if (/^[a-z]+:\/\//i.test(href) || href.startsWith('mailto:')) return;
        const [file, fragment] = href.split('#');
        const pageName = file.replace(/\.md$/, '').replace(/^.*\//, '');
        a.href = fragment ? '#' + pageName + ':' + fragment : '#' + pageName;
        a.addEventListener('click', (e) => {
          e.preventDefault();
          renderPage(pageName, fragment);
        });
      });

      // Decorate code blocks with language label + copy button.
      decorateCodeBlocks();

      // Wire up the heading `#` anchor links to copy the permalink.
      wireHeadingAnchors(page);

      // Build the right-rail / details / bottom-sheet "On this page" TOC.
      buildTocRail(page);
    }

    if (scrollToFragment) {
      const scrollTo = () => {
        const target = document.getElementById(scrollToFragment);
        if (target) target.scrollIntoView({ behavior: 'smooth' });
      };
      needsRender ? setTimeout(scrollTo, 50) : scrollTo();
    } else if (needsRender) {
      window.scrollTo(0, 0);
    }

    const newHash = page === 'index' && !scrollToFragment ? '' :
      scrollToFragment ? page + ':' + scrollToFragment : page;
    history.replaceState(null, '', '#' + newHash);
  }

  // Decorate every <pre> block with a top-left language label (from the
  // class `language-xxx` injected by marked) and a top-right copy button.
  function decorateCodeBlocks() {
    contentEl.querySelectorAll('pre').forEach(pre => {
      if (pre.dataset.decorated) return;
      pre.dataset.decorated = '1';
      const codeEl = pre.querySelector('code');
      // Language label
      let lang = '';
      if (codeEl) {
        const m = (codeEl.className || '').match(/language-([\w+-]+)/);
        if (m) lang = m[1];
      }
      if (lang) {
        const label = document.createElement('span');
        label.className = 'code-lang';
        label.textContent = lang;
        pre.appendChild(label);
      }
      // Copy button
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'code-copy';
      btn.textContent = 'Copy';
      btn.setAttribute('aria-label', 'Copy code to clipboard');
      btn.addEventListener('click', async () => {
        const text = codeEl ? codeEl.textContent : pre.textContent;
        try {
          await navigator.clipboard.writeText(text);
        } catch (_) {
          // Fallback for older browsers / non-secure contexts
          const ta = document.createElement('textarea');
          ta.value = text;
          ta.style.position = 'fixed';
          ta.style.opacity = '0';
          document.body.appendChild(ta);
          ta.select();
          try { document.execCommand('copy'); } catch (_) {}
          document.body.removeChild(ta);
        }
        btn.textContent = 'Copied!';
        btn.classList.add('copied');
        setTimeout(() => {
          btn.textContent = 'Copy';
          btn.classList.remove('copied');
        }, 1500);
      });
      pre.appendChild(btn);
    });
  }

  // Wire up the hover-revealed `#` anchor links so clicking copies the
  // permalink (full URL including hash) to the clipboard and shows a 1.5s
  // confirmation. We still update the location hash so the page state
  // matches what was copied.
  function wireHeadingAnchors(page) {
    contentEl.querySelectorAll('.heading-anchor').forEach(a => {
      if (a.dataset.wired) return;
      a.dataset.wired = '1';
      a.addEventListener('click', async (e) => {
        e.preventDefault();
        const slug = (a.getAttribute('href') || '').replace(/^#/, '');
        if (!slug) return;
        const hash = '#' + page + ':' + slug;
        const url = location.origin + location.pathname + hash;
        try {
          await navigator.clipboard.writeText(url);
        } catch (_) {
          const ta = document.createElement('textarea');
          ta.value = url;
          ta.style.position = 'fixed';
          ta.style.opacity = '0';
          document.body.appendChild(ta);
          ta.select();
          try { document.execCommand('copy'); } catch (_) {}
          document.body.removeChild(ta);
        }
        history.replaceState(null, '', hash);
        a.classList.add('copied');
        setTimeout(() => a.classList.remove('copied'), 1500);
      });
    });
  }

  // On-this-page TOC. Drives three surfaces from the same data + observer:
  //   - .toc-rail (desktop right rail, ≥1180px)
  //   - .toc-details (tablet collapsible, 768–1179px)
  //   - .toc-sheet  (mobile bottom-sheet, <768px) opened by .toc-sheet-toggle
  // Scroll-spy syncs `.active` on all three plus the sidebar group.
  let tocObserver = null;
  const tocRail = document.getElementById('toc-rail');
  const tocRailList = document.getElementById('toc-rail-list');
  const tocSheet = document.getElementById('toc-sheet');
  const tocSheetList = document.getElementById('toc-sheet-list');
  const tocSheetToggle = document.getElementById('toc-sheet-toggle');
  let tocDetails = null;
  let tocDetailsList = null;
  function ensureTocDetails() {
    // Inject a <details> placeholder once, just above the rendered article
    // content. The CSS shows it only in the 768–1179px range.
    if (tocDetails) return;
    tocDetails = document.createElement('details');
    tocDetails.className = 'toc-details';
    tocDetails.hidden = true;
    const summary = document.createElement('summary');
    summary.textContent = 'On this page';
    tocDetailsList = document.createElement('ul');
    tocDetails.appendChild(summary);
    tocDetails.appendChild(tocDetailsList);
    contentEl.parentNode.insertBefore(tocDetails, contentEl);
  }
  function closeTocSheet() {
    if (!tocSheet || !tocSheetToggle) return;
    tocSheet.classList.remove('open');
    tocSheetToggle.setAttribute('aria-expanded', 'false');
  }
  if (tocSheetToggle && tocSheet) {
    tocSheetToggle.addEventListener('click', () => {
      const open = !tocSheet.classList.contains('open');
      tocSheet.classList.toggle('open', open);
      tocSheetToggle.setAttribute('aria-expanded', String(open));
    });
    // Tap outside the sheet closes it.
    document.addEventListener('click', (e) => {
      if (!tocSheet.classList.contains('open')) return;
      if (e.target.closest('#toc-sheet') || e.target.closest('#toc-sheet-toggle')) return;
      closeTocSheet();
    });
  }

  function buildTocRail(page) {
    if (tocObserver) { tocObserver.disconnect(); tocObserver = null; }
    ensureTocDetails();
    if (tocRailList) tocRailList.innerHTML = '';
    if (tocDetailsList) tocDetailsList.innerHTML = '';
    if (tocSheetList) tocSheetList.innerHTML = '';
    closeTocSheet();

    // H2 + H3 of the rendered article.
    const headings = Array.from(contentEl.querySelectorAll('h2[id], h3[id]'));
    const h2Only = headings.filter(h => h.tagName === 'H2');

    // Hide everything if the page is too short to warrant a TOC.
    if (h2Only.length < 4) {
      if (tocRail) tocRail.hidden = true;
      if (tocDetails) tocDetails.hidden = true;
      if (tocSheetToggle) tocSheetToggle.hidden = true;
      if (tocSheet) tocSheet.hidden = true;
      return;
    }

    const linksById = {};
    function appendTo(list, h, indent) {
      if (!list) return;
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = '#' + page + ':' + h.id;
      a.textContent = h.textContent.replace(/^#\s*/, '').trim();
      if (indent) a.style.paddingLeft = '1.6rem';
      a.addEventListener('click', (e) => {
        e.preventDefault();
        closeTocSheet();
        renderPage(page, h.id);
      });
      (linksById[h.id] = linksById[h.id] || []).push(a);
      li.appendChild(a);
      list.appendChild(li);
    }
    headings.forEach(h => {
      const isH3 = h.tagName === 'H3';
      appendTo(tocRailList, h, isH3);
      appendTo(tocDetailsList, h, isH3);
      appendTo(tocSheetList, h, isH3);
    });

    if (tocRail) tocRail.hidden = false;
    if (tocDetails) tocDetails.hidden = false;
    if (tocSheetToggle) tocSheetToggle.hidden = false;
    if (tocSheet) tocSheet.hidden = false;

    // Scroll-spy: highlight the topmost visible H2/H3.
    const visible = new Set();
    tocObserver = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) visible.add(e.target.id);
        else visible.delete(e.target.id);
      });
      let activeId = null;
      for (const h of headings) {
        if (visible.has(h.id)) { activeId = h.id; break; }
      }
      if (!activeId) {
        for (let i = headings.length - 1; i >= 0; i--) {
          if (headings[i].getBoundingClientRect().top < 100) { activeId = headings[i].id; break; }
        }
      }
      Object.entries(linksById).forEach(([id, links]) => {
        const isActive = id === activeId;
        links.forEach(a => a.classList.toggle('active', isActive));
      });
    }, { rootMargin: '-80px 0px -65% 0px' });
    headings.forEach(h => tocObserver.observe(h));
  }

  // Page click handlers (sidebar + brand)
  document.querySelectorAll('[data-page]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      renderPage(el.dataset.page);
    });
  });

  // Sidebar toggle (mobile) — drawer + scrim + body scroll lock + Escape close.
  const toggle = document.querySelector('.sidebar-toggle');
  const sidebar = document.querySelector('.sidebar');
  const scrim = document.getElementById('sidebar-scrim');
  // Stash the pre-open scroll position so we can restore it on close. iOS
  // Safari reflows to top when body becomes position:fixed; we mitigate by
  // pinning `top` while locked and resetting it after.
  let savedScrollY = 0;
  function openSidebar() {
    if (!sidebar) return;
    savedScrollY = window.scrollY || window.pageYOffset || 0;
    sidebar.classList.add('open');
    if (scrim) scrim.classList.add('visible');
    if (toggle) toggle.setAttribute('aria-expanded', 'true');
    document.body.style.top = '-' + savedScrollY + 'px';
    document.body.classList.add('scroll-locked');
  }
  function closeSidebar() {
    if (!sidebar) return;
    const wasOpen = sidebar.classList.contains('open');
    sidebar.classList.remove('open');
    if (scrim) scrim.classList.remove('visible');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
    if (wasOpen && document.body.classList.contains('scroll-locked')) {
      document.body.classList.remove('scroll-locked');
      document.body.style.top = '';
      window.scrollTo(0, savedScrollY);
    }
  }
  if (toggle && sidebar) {
    toggle.addEventListener('click', () => {
      if (sidebar.classList.contains('open')) closeSidebar();
      else openSidebar();
    });
  }
  if (scrim) scrim.addEventListener('click', closeSidebar);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar && sidebar.classList.contains('open')) {
      closeSidebar();
      if (toggle) toggle.focus();
    }
  });
  // Make closeSidebar accessible to renderPage above (defined earlier in
  // the closure via hoisting — function declarations are hoisted).

  // Hash navigation
  const pageRedirects = { comparison: 'approaches' };
  function handleHash() {
    const raw = window.location.hash.slice(1) || 'index';
    const colonIdx = raw.indexOf(':');
    let page = colonIdx > -1 ? raw.substring(0, colonIdx) : raw;
    const fragment = colonIdx > -1 ? raw.substring(colonIdx + 1) : '';
    if (pageRedirects[page]) {
      page = pageRedirects[page];
      // Default the comparison landing to the feature matrix when no anchor.
      if (!fragment && page === 'approaches') {
        renderPage(page, 'feature-matrix');
        return;
      }
    }
    renderPage(page, fragment);
  }
  window.addEventListener('hashchange', handleHash);
  handleHash();

  // === Search ===
  // Build a lightweight in-memory index over all pages.
  // Each entry: { page, title, heading, headingSlug, anchor, text }
  const index = buildSearchIndex(pages, pageTitles);

  const searchInput = document.getElementById('search-input');
  const resultsList = document.getElementById('search-results');

  function hideResults() {
    if (!resultsList) return;
    resultsList.hidden = true;
    resultsList.innerHTML = '';
    if (searchInput) {
      searchInput.setAttribute('aria-expanded', 'false');
      searchInput.removeAttribute('aria-activedescendant');
    }
  }

  function setActiveResult(idx) {
    if (!resultsList) return;
    const items = resultsList.querySelectorAll('li[role="option"]');
    items.forEach((li, i) => {
      const active = i === idx;
      li.setAttribute('aria-selected', active ? 'true' : 'false');
      const a = li.querySelector('a');
      if (a) a.classList.toggle('is-active', active);
      if (active) {
        li.scrollIntoView({ block: 'nearest' });
        if (searchInput) searchInput.setAttribute('aria-activedescendant', li.id);
      }
    });
  }

  function render(results, query) {
    if (!resultsList) return;
    resultsList.innerHTML = '';
    if (!results.length) {
      const li = document.createElement('li');
      li.className = 'search-empty';
      li.textContent = `No matches for "${query}"`;
      resultsList.appendChild(li);
    } else {
      results.forEach((r, i) => {
        const li = document.createElement('li');
        li.id = 'search-result-' + i;
        li.setAttribute('role', 'option');
        li.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
        const a = document.createElement('a');
        a.href = r.anchor;
        if (i === 0) a.classList.add('is-active');
        const page = document.createElement('span');
        page.className = 'search-result-page';
        page.textContent = pageTitles[r.page] || r.page;
        const title = document.createElement('span');
        title.textContent = r.heading || r.title;
        const ctx = document.createElement('div');
        ctx.className = 'search-result-context';
        ctx.textContent = r.snippet;
        a.appendChild(page);
        a.appendChild(title);
        a.appendChild(ctx);
        a.addEventListener('click', (e) => {
          e.preventDefault();
          const [hashPage, hashFrag] = r.anchor.slice(1).split(':');
          renderPage(hashPage, hashFrag);
          hideResults();
          if (searchInput) searchInput.value = '';
        });
        li.appendChild(a);
        resultsList.appendChild(li);
      });
      if (searchInput) searchInput.setAttribute('aria-activedescendant', 'search-result-0');
    }
    resultsList.hidden = false;
    if (searchInput) searchInput.setAttribute('aria-expanded', 'true');
  }

  if (searchInput && resultsList) {
    searchInput.addEventListener('input', () => {
      const q = searchInput.value.trim();
      if (!q) { hideResults(); return; }
      const results = searchIndex(index, q, 12);
      render(results, q);
    });
    searchInput.addEventListener('focus', () => {
      if (searchInput.value.trim()) searchInput.dispatchEvent(new Event('input'));
    });
    // Arrow keys / Enter on the search input drive the listbox.
    searchInput.addEventListener('keydown', (e) => {
      if (resultsList.hidden) return;
      const items = resultsList.querySelectorAll('li[role="option"]');
      if (!items.length) return;
      let idx = Array.from(items).findIndex(li => li.getAttribute('aria-selected') === 'true');
      if (idx < 0) idx = 0;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveResult((idx + 1) % items.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveResult((idx - 1 + items.length) % items.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const link = items[idx] && items[idx].querySelector('a');
        if (link) link.click();
      }
    });
    // Press "/" anywhere to focus search
    document.addEventListener('keydown', (e) => {
      if (e.key === '/' && document.activeElement !== searchInput) {
        e.preventDefault();
        searchInput.focus();
      } else if (e.key === 'Escape' && document.activeElement === searchInput) {
        searchInput.blur();
        hideResults();
      }
    });
    // Hide when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.topbar-search')) hideResults();
    });
  }
}

// === Search index helpers ===
function buildSearchIndex(pages, titles) {
  const entries = [];
  for (const [page, md] of Object.entries(pages)) {
    const sections = splitIntoSections(md);
    sections.forEach(sec => {
      entries.push({
        page,
        title: titles[page] || page,
        heading: sec.heading,
        headingSlug: sec.slug,
        anchor: buildAnchor(page, sec.slug),
        text: sec.text,
      });
    });
  }
  return entries;
}

function splitIntoSections(md) {
  // Split into (heading, body) pairs. Treat the very top as heading "" (page intro).
  const lines = md.split('\n');
  const sections = [];
  let current = { heading: '', slug: '', text: '' };
  for (const line of lines) {
    const m = line.match(/^(#{1,4})\s+(.+?)\s*$/);
    if (m) {
      if (current.text.trim() || current.heading) sections.push(current);
      const heading = m[2].replace(/\[([^\]]+)\]\([^)]+\)/g, '$1'); // strip md link syntax
      const slug = heading.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
      current = { heading, slug, text: '' };
    } else {
      current.text += line + ' ';
    }
  }
  if (current.text.trim() || current.heading) sections.push(current);
  return sections;
}

function buildAnchor(page, slug) {
  if (!slug) return page === 'index' ? '#' : '#' + page;
  return '#' + page + ':' + slug;
}

function searchIndex(index, query, limit) {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  const scored = [];
  for (const entry of index) {
    const title = (entry.title || '').toLowerCase();
    const heading = (entry.heading || '').toLowerCase();
    const text = (entry.text || '').toLowerCase();
    let score = 0;
    let matchedAll = true;
    for (const t of terms) {
      const inTitle = title.includes(t);
      const inHeading = heading.includes(t);
      const inText = text.includes(t);
      if (!inTitle && !inHeading && !inText) { matchedAll = false; break; }
      if (inHeading) score += 10;
      if (inTitle) score += 3;
      if (inText) score += 1;
    }
    if (!matchedAll) continue;
    // Build a snippet around the first term match
    const snippet = makeSnippet(entry.text, terms[0]);
    scored.push({ ...entry, score, snippet });
  }
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit);
}

function makeSnippet(text, term) {
  if (!text) return '';
  const lower = text.toLowerCase();
  const idx = lower.indexOf(term.toLowerCase());
  const start = Math.max(0, idx - 60);
  const end = Math.min(text.length, (idx >= 0 ? idx : 0) + 140);
  let snippet = text.substring(start, end).trim();
  if (start > 0) snippet = '…' + snippet;
  if (end < text.length) snippet = snippet + '…';
  return snippet.replace(/\s+/g, ' ');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
