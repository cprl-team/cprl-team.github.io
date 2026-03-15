/* ==========================================================
   Site Config — Centralized Branding & Assets
   ==========================================================
   Change logo, favicon, or site titles here once —
   every page picks them up automatically.
   ========================================================== */

var SITE_CONFIG = {
    /* Header: small square logo + text */
    headerLogoSrc: 'logo.png',
    headerTitle: 'Causal Perception and Reasoning',
    headerLogoStyle: 'width:2.75rem;height:2.75rem;border-radius:var(--radius-sm);object-fit:contain;',
    /* Footer: theme-aware full logo + text */
    footerLogoSrcLight: 'logo_full_dark.png',
    // footerLogoSrcDark: 'logo_full_dark.png',
    footerTitle: '',
    footerLogoStyle: 'height:5rem;width:auto;object-fit:contain;',
    /* Shared */
    logoAlt: 'CPRL Logo',
    faviconHref: 'favicon.ico'
};

/* ── Apply config on page load ────────────────────────────── */
(function () {
    'use strict';

    function getFooterLogoSrc() {
        return SITE_CONFIG.footerLogoSrcLight;
    }

    function updateFooterLogos() {
        var src = getFooterLogoSrc();
        var imgs = document.querySelectorAll('a.logo[data-logo="footer"] .logo-img');
        imgs.forEach(function (img) { img.src = src; });
    }

    /* Favicon — inject <link rel="icon"> into <head> */
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
            var logoStyle = isFooter ? SITE_CONFIG.footerLogoStyle : SITE_CONFIG.headerLogoStyle;
            var logoSrc = isFooter ? getFooterLogoSrc() : SITE_CONFIG.headerLogoSrc;

            var img = document.createElement('img');
            img.src = logoSrc;
            img.alt = SITE_CONFIG.logoAlt;
            img.className = 'logo-img';
            img.style.cssText = logoStyle;

            el.textContent = '';
            el.appendChild(img);
            if (title) {
                var span = document.createElement('span');
                span.textContent = ' ' + title;
                el.appendChild(span);
            }
        });

        /* Watch for theme changes — only footer logos need updating */
        new MutationObserver(function (mutations) {
            mutations.forEach(function (m) {
                if (m.attributeName === 'data-theme') updateFooterLogos();
            });
        }).observe(document.documentElement, { attributes: true });
    });
})();
