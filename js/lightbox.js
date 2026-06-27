/* ==========================================================
   Lightbox — tap/click an architecture figure to enlarge
   ----------------------------------------------------------
   Vanilla, dependency-free. Uses event delegation so it works
   on the async-rendered .arch-figure elements. Close via the
   button, the backdrop, or Escape. Restores focus on close.
   ========================================================== */

(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {
        var overlay = null;
        var lastFocus = null;

        function close() {
            if (!overlay) return;
            overlay.remove();
            overlay = null;
            document.body.style.overflow = '';
            if (lastFocus && lastFocus.focus) lastFocus.focus();
        }

        function open(figure) {
            lastFocus = document.activeElement;

            overlay = document.createElement('div');
            overlay.className = 'arch-lightbox';
            overlay.setAttribute('role', 'dialog');
            overlay.setAttribute('aria-modal', 'true');
            overlay.setAttribute('aria-label', 'Enlarged diagram');

            var inner = document.createElement('div');
            inner.className = 'arch-figure arch-lightbox__inner';
            inner.innerHTML = figure.innerHTML;

            var closeBtn = document.createElement('button');
            closeBtn.type = 'button';
            closeBtn.className = 'arch-lightbox__close';
            closeBtn.setAttribute('aria-label', 'Close enlarged diagram');
            closeBtn.textContent = '✕';

            overlay.appendChild(inner);
            overlay.appendChild(closeBtn);
            document.body.appendChild(overlay);
            document.body.style.overflow = 'hidden';
            closeBtn.focus();
        }

        document.addEventListener('click', function (e) {
            if (overlay) {
                if (e.target.closest('.arch-lightbox__close') ||
                    !e.target.closest('.arch-lightbox__inner')) {
                    close();
                }
                return;
            }
            var figure = e.target.closest ? e.target.closest('.arch-figure') : null;
            if (figure) open(figure);
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') { close(); return; }
            if (overlay) return;
            // Enter / Space on a focused figure opens it
            if (e.key === 'Enter' || e.key === ' ') {
                var figure = document.activeElement;
                if (figure && figure.classList && figure.classList.contains('arch-figure')) {
                    e.preventDefault();
                    open(figure);
                }
            }
        });
    });
})();
