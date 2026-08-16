/* ==========================================================
   Main — Page Initialization & Animations
   ========================================================== */

(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {
        // ── Fade-in Animation ─────────────────────────────
        var fadeElements = document.querySelectorAll('.fade-in');

        if ('IntersectionObserver' in window) {
            var observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');

                        // Stagger children if present
                        var children = entry.target.querySelectorAll('.card, .pub-item, .milestone-item, .member-card, .research-node, .stat');
                        children.forEach(function (child, index) {
                            child.style.transitionDelay = (index * 0.08) + 's';
                            child.classList.add('visible');
                        });

                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });

            fadeElements.forEach(function (el) {
                observer.observe(el);
            });

            // Also observe individual stagger children
            var staggerItems = document.querySelectorAll('.card, .pub-item, .milestone-item, .member-card, .research-node, .stat');
            staggerItems.forEach(function (el) {
                if (!el.closest('.fade-in')) {
                    el.style.opacity = '0';
                    el.style.transform = 'translateY(16px)';
                    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                    observer.observe(el);
                }
            });
        } else {
            // Fallback: show all elements
            fadeElements.forEach(function (el) {
                el.classList.add('visible');
            });
        }

        // ── Back-to-top button ────────────────────────────
        var backBtn = document.createElement('button');
        backBtn.type = 'button';
        backBtn.className = 'back-to-top';
        backBtn.setAttribute('aria-label', 'Back to top');
        backBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" ' +
            'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
            'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
            '<polyline points="18 15 12 9 6 15" /></svg>';
        document.body.appendChild(backBtn);

        var prefersReduced = window.matchMedia &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        backBtn.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
        });

        var toggleBackBtn = function () {
            if (window.pageYOffset > 600) backBtn.classList.add('is-visible');
            else backBtn.classList.remove('is-visible');
        };
        window.addEventListener('scroll', toggleBackBtn, { passive: true });
        toggleBackBtn();
    });
})();
