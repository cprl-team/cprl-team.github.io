/* ==========================================================
   Navigation — Active Links & Mobile Menu
   ========================================================== */

(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {
        // ── Active Link Highlighting ──────────────────────
        var currentPage = window.location.pathname.split('/').pop() || 'index.html';
        var navLinks = document.querySelectorAll('.main-nav a');

        navLinks.forEach(function (link) {
            var href = link.getAttribute('href');
            if (href === currentPage || (currentPage === '' && href === 'index.html')) {
                link.classList.add('active');
            }
        });

        // ── Mobile Menu Toggle ────────────────────────────
        var navToggle = document.querySelector('.nav-toggle');
        var mainNav = document.querySelector('.main-nav');

        if (navToggle && mainNav) {
            navToggle.addEventListener('click', function () {
                mainNav.classList.toggle('open');
                var isOpen = mainNav.classList.contains('open');
                navToggle.setAttribute('aria-expanded', isOpen);
            });

            // Close menu on link click
            mainNav.querySelectorAll('a').forEach(function (link) {
                link.addEventListener('click', function () {
                    mainNav.classList.remove('open');
                    navToggle.setAttribute('aria-expanded', 'false');
                });
            });

            // Close menu on outside click
            document.addEventListener('click', function (e) {
                if (!navToggle.contains(e.target) && !mainNav.contains(e.target)) {
                    mainNav.classList.remove('open');
                    navToggle.setAttribute('aria-expanded', 'false');
                }
            });
        }
    });
})();
