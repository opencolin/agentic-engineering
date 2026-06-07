/**
 * Theme controller. The early-init script in <head> already set
 * data-theme on <html> before paint to avoid FOUC; this script wires
 * up the toggle button and persists changes.
 */
(function () {
  var STORAGE_KEY = 'ae-theme';
  var root = document.documentElement;
  var mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: light)') : null;

  function currentTheme() {
    return root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  }

  function apply(theme, persist) {
    root.setAttribute('data-theme', theme);
    if (persist) {
      try { localStorage.setItem(STORAGE_KEY, theme); } catch (e) {}
    }
    document.querySelectorAll('.theme-toggle').forEach(function (btn) {
      btn.setAttribute('aria-pressed', theme === 'light' ? 'true' : 'false');
      btn.setAttribute('aria-label', theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode');
      btn.setAttribute('title', theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode');
    });
  }

  function bind() {
    document.querySelectorAll('.theme-toggle').forEach(function (btn) {
      if (btn.dataset.themeBound) return;
      btn.dataset.themeBound = '1';
      btn.addEventListener('click', function () {
        apply(currentTheme() === 'light' ? 'dark' : 'light', true);
      });
    });
    apply(currentTheme(), false);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bind);
  } else {
    bind();
  }

  if (mq && mq.addEventListener) {
    mq.addEventListener('change', function (e) {
      var stored;
      try { stored = localStorage.getItem(STORAGE_KEY); } catch (err) { stored = null; }
      if (!stored) apply(e.matches ? 'light' : 'dark', false);
    });
  }
})();
