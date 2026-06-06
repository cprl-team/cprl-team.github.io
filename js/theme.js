/* ==========================================================
   Theme Toggle — Dark / Light Mode
   ----------------------------------------------------------
   First paint is handled by a tiny inline snippet in each
   page's <head> (sets data-theme before CSS loads → no FOUC).
   This file wires the header toggle button(s) and keeps the
   system-preference listener + accessible state in sync.
   ========================================================== */

(function () {
  'use strict';

  var THEME_KEY = 'cprl-theme';

  function getStoredTheme() {
    return localStorage.getItem(THEME_KEY);
  }

  function getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function getPreferredTheme() {
    return getStoredTheme() || getSystemTheme();
  }

  function syncToggles(theme) {
    var isDark = theme === 'dark';
    var toggles = document.querySelectorAll('.theme-toggle');
    toggles.forEach(function (btn) {
      btn.setAttribute('aria-pressed', String(isDark));
    });
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
    syncToggles(theme);
  }

  function toggleTheme() {
    var current = document.documentElement.getAttribute('data-theme') || getSystemTheme();
    setTheme(current === 'dark' ? 'light' : 'dark');
  }

  /* Ensure the attribute matches the preferred theme (inline snippet
     normally set this already; harmless to confirm). */
  document.documentElement.setAttribute('data-theme', getPreferredTheme());

  /* Follow system changes only while the user hasn't made an explicit choice */
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
    if (!getStoredTheme()) {
      setTheme(e.matches ? 'dark' : 'light');
    }
  });

  /* Wire toggle buttons and reflect initial state */
  document.addEventListener('DOMContentLoaded', function () {
    var theme = document.documentElement.getAttribute('data-theme') || getPreferredTheme();
    syncToggles(theme);
    document.querySelectorAll('.theme-toggle').forEach(function (btn) {
      btn.addEventListener('click', toggleTheme);
    });
  });

  /* Expose for any inline callers */
  window.toggleTheme = toggleTheme;
})();
