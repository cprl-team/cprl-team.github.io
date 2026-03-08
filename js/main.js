/* ==========================================================
   Main — Page Initialization
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
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });

            fadeElements.forEach(function (el) {
                observer.observe(el);
            });
        } else {
            // Fallback: show all elements
            fadeElements.forEach(function (el) {
                el.classList.add('visible');
            });
        }
    });
})();
