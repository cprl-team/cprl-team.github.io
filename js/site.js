/* ==========================================================
   Site — shared config + page chrome for every page
   ----------------------------------------------------------
   Load it with a plain (non-deferred) <script> right after the
   skip link in <body>. It writes the header in place, so there
   is no flash, then adds the footer and wires the theme toggle,
   mobile menu, fade-ins and back-to-top button once the DOM is
   ready. The active menu item comes from <body data-page="...">.

   Change the menu, contact email or logo here, once.
   ========================================================== */

var SITE = {
    name: 'Causal Perception and Reasoning',
    shortName: 'CPR',
    tagline: 'Causal Perception and Reasoning Research Group, advancing causal AI research from Ho Chi Minh City, Vietnam.',
    email: 'contact@cpr.ai.vn',
    /* Root-relative so they resolve from any depth (e.g. /members/x.html) */
    logo: '/logo.svg',
    footerLogo: '/logo_full_dark.png',
    nav: [
        { id: 'home', label: 'Home', href: '/' },
        { id: 'research', label: 'Research', href: '/research.html' },
        { id: 'people', label: 'People', href: '/people.html' },
        { id: 'publications', label: 'Publications', href: '/publications.html' },
        { id: 'join', label: 'Join Us', href: '/join.html' }
    ]
};

(function () {
    'use strict';

    var THEME_KEY = 'cprl-theme';
    var page = document.body.getAttribute('data-page') || '';

    /* ── Header (written synchronously, in place) ────────── */
    var ICON_MOON = '<svg class="icon-moon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
    var ICON_SUN = '<svg class="icon-sun" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>';
    var ICON_MENU = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18"/></svg>';

    var links = SITE.nav.map(function (item) {
        var current = item.id === page ? ' class="active" aria-current="page"' : '';
        return '<a href="' + item.href + '"' + current + '>' + item.label + '</a>';
    }).join('');

    var header =
        '<header class="site-header"><div class="container header-inner">' +
        '<div class="header-left"><a href="/" class="logo">' +
        '<img class="logo-img logo-img--header" src="' + SITE.logo + '" alt="' + SITE.shortName + ' logo">' +
        '<span class="logo__full">' + SITE.name + '</span><span class="logo__short">' + SITE.shortName + '</span></a></div>' +
        '<nav class="main-nav" id="main-nav" aria-label="Main navigation">' + links + '</nav>' +
        '<div class="header-right">' +
        '<button class="theme-toggle" type="button" aria-label="Toggle dark mode" aria-pressed="false">' + ICON_MOON + ICON_SUN + '</button>' +
        '<button class="nav-toggle" type="button" aria-label="Toggle navigation menu" aria-controls="main-nav" aria-expanded="false">' + ICON_MENU + '</button>' +
        '</div></div></header>';

    if (document.currentScript) document.currentScript.insertAdjacentHTML('beforebegin', header);

    /* ── Theme ───────────────────────────────────────────── */
    function storedTheme() { try { return localStorage.getItem(THEME_KEY); } catch (e) { return null; } }
    function systemTheme() { return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'; }
    function syncToggles(theme) {
        document.querySelectorAll('.theme-toggle').forEach(function (b) {
            b.setAttribute('aria-pressed', String(theme === 'dark'));
        });
    }
    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        try { localStorage.setItem(THEME_KEY, theme); } catch (e) { /* private mode */ }
        syncToggles(theme);
    }
    document.documentElement.setAttribute('data-theme', storedTheme() || systemTheme());
    matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
        if (!storedTheme()) setTheme(e.matches ? 'dark' : 'light');
    });

    /* ── Fade-ins (also used for content rendered later) ── */
    var observer = null;
    function reveal(root) {
        var els = (root || document).querySelectorAll('.fade-in:not(.visible)');
        if (!observer) { els.forEach(function (el) { el.classList.add('visible'); }); return; }
        els.forEach(function (el) { observer.observe(el); });
    }
    SITE.reveal = reveal;

    document.addEventListener('DOMContentLoaded', function () {
        /* Footer */
        var main = document.querySelector('main');
        var year = new Date().getFullYear();
        var footer =
            '<footer class="site-footer"><div class="container">' +
            '<div class="footer-inner">' +
            '<div class="footer-brand"><a href="/" class="logo"><img class="logo-img logo-img--footer" src="' + SITE.footerLogo + '" alt="' + SITE.name + ' logo"></a>' +
            '<p>' + SITE.tagline + '</p></div>' +
            '<div class="footer-links"><h4>Contact</h4><ul>' +
            '<li><a href="mailto:' + SITE.email + '">' + SITE.email + '</a></li>' +
            '<li><a href="/join.html">Join us</a></li></ul></div>' +
            '</div>' +
            '<div class="footer-bottom"><p>&copy; ' + year + ' ' + SITE.shortName + ' — ' + SITE.name + ' Research Group.</p></div>' +
            '</div></footer>';
        if (main) main.insertAdjacentHTML('afterend', footer);

        /* Theme toggle */
        syncToggles(document.documentElement.getAttribute('data-theme'));
        document.querySelectorAll('.theme-toggle').forEach(function (btn) {
            btn.addEventListener('click', function () {
                setTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
            });
        });

        /* Mobile menu */
        var toggle = document.querySelector('.nav-toggle');
        var nav = document.querySelector('.main-nav');
        if (toggle && nav) {
            var setOpen = function (open) {
                nav.classList.toggle('open', open);
                toggle.setAttribute('aria-expanded', String(open));
            };
            toggle.addEventListener('click', function () { setOpen(!nav.classList.contains('open')); });
            document.addEventListener('click', function (e) {
                if (!toggle.contains(e.target) && !nav.contains(e.target)) setOpen(false);
            });
            document.addEventListener('keydown', function (e) {
                if (e.key === 'Escape' && nav.classList.contains('open')) { setOpen(false); toggle.focus(); }
            });
        }

        /* Fade-ins */
        if ('IntersectionObserver' in window) {
            observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (!entry.isIntersecting) return;
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                });
            }, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });
        }
        reveal(document);

        /* Back to top */
        var back = document.createElement('button');
        back.type = 'button';
        back.className = 'back-to-top';
        back.setAttribute('aria-label', 'Back to top');
        back.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="18 15 12 9 6 15"/></svg>';
        document.body.appendChild(back);
        var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
        back.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' }); });
        var onScroll = function () { back.classList.toggle('is-visible', window.pageYOffset > 600); };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    });
})();
