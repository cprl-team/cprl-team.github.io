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
                        var children = entry.target.querySelectorAll('.card, .pub-item, .milestone-item, .member-card');
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
            var staggerItems = document.querySelectorAll('.card, .pub-item, .milestone-item');
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
    });
})();
