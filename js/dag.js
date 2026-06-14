/* ==========================================================
   DAG — Scroll-driven draw-in for the causal-graph motif
   ----------------------------------------------------------
   Adds `.dag--drawn` to each inline `.dag` SVG when it scrolls
   into view, which triggers the CSS edge/node transitions.
   If the user prefers reduced motion (or IntersectionObserver
   is unavailable) every graph is set to its final drawn state
   immediately — no animation, nothing left invisible.
   ========================================================== */

(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {
        var graphs = document.querySelectorAll('.dag');
        if (!graphs.length) return;

        var reduceMotion = window.matchMedia &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (reduceMotion || !('IntersectionObserver' in window)) {
            graphs.forEach(function (g) { g.classList.add('dag--drawn'); });
            return;
        }

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('dag--drawn');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.25 });

        graphs.forEach(function (g) { observer.observe(g); });
    });
})();
