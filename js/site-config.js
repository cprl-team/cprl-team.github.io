/* ==========================================================
   Site Config — Centralized Branding & Assets
   ==========================================================
   Change logo, favicon, or site titles here once —
   every page picks them up automatically.

   Styling for the injected logo images lives in CSS
   (.logo-img--header / .logo-img--footer in layout.css),
   not inline, so it stays token-driven.
   ========================================================== */

var SITE_CONFIG = {
    /* Header: small square logo + text.
       Paths are root-relative so they resolve from any depth
       (e.g. /members/vthuynh.html), on both localhost and the
       custom domain, which both serve from the site root. */
    headerLogoSrc: '/logo.png',
    headerTitle: 'Causal Perception and Reasoning',
    /* Footer: full logo (the footer is a dark slab in both themes,
       so the light-on-dark logo is always valid) */
    footerLogoSrc: '/logo_full_dark.png',
    footerTitle: '',
    /* Shared */
    logoAlt: 'Causal Perception and Reasoning logo',
    faviconHref: '/favicon.ico'
};

/* ── Apply config on page load ────────────────────────────── */
(function () {
    'use strict';

    /* Favicon — ensure <link rel="icon"> points at the configured asset */
    var favicon = document.getElementById('site-favicon');
    if (!favicon) {
        favicon = document.createElement('link');
        favicon.id = 'site-favicon';
        favicon.rel = 'icon';
        document.head.appendChild(favicon);
    }
    favicon.href = SITE_CONFIG.faviconHref;

    /* Logo — populate every <a class="logo" data-logo> element */
    document.addEventListener('DOMContentLoaded', function () {
        var logos = document.querySelectorAll('a.logo[data-logo]');

        logos.forEach(function (el) {
            var isFooter = el.getAttribute('data-logo') === 'footer';
            var title = isFooter ? SITE_CONFIG.footerTitle : SITE_CONFIG.headerTitle;
            var logoSrc = isFooter ? SITE_CONFIG.footerLogoSrc : SITE_CONFIG.headerLogoSrc;

            var img = document.createElement('img');
            img.src = logoSrc;
            img.alt = SITE_CONFIG.logoAlt;
            img.className = 'logo-img ' + (isFooter ? 'logo-img--footer' : 'logo-img--header');

            el.textContent = '';
            el.appendChild(img);
            if (title) {
                var span = document.createElement('span');
                span.textContent = ' ' + title;
                el.appendChild(span);
            }
        });
    });
})();
