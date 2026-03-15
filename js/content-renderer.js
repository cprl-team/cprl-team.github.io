/* ==========================================================
   Content Renderer — Render parsed markdown content into HTML
   ========================================================== */

(function () {
    'use strict';

    var SVG_PAPER = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>';
    var SVG_PATENT = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>';

    function escapeHTML(str) {
        var div = document.createElement('div');
        div.appendChild(document.createTextNode(str));
        return div.innerHTML;
    }

    /**
     * Render members page content
     */
    async function renderMembers(containerId) {
        var container = document.getElementById(containerId);
        if (!container) return;

        var text = await ContentLoader.load('content/members.md');
        if (!text) {
            container.innerHTML = '<p>Failed to load members.</p>';
            return;
        }

        var sections = ContentLoader.parseMembers(text);
        var html = '';

        for (var sectionName in sections) {
            var members = sections[sectionName];
            html += '<section class="member-section fade-in">';
            html += '<h2 class="section-label">' + escapeHTML(sectionName) + '</h2>';
            html += '<div class="card-grid">';

            for (var i = 0; i < members.length; i++) {
                var m = members[i];
                html += '<div class="card member-card">';
                html += '<div class="avatar-initials">' + escapeHTML(m.initials) + '</div>';
                html += '<h3>';
                if (m.link) {
                    html += '<a href="' + escapeHTML(m.link) + '" target="_blank" rel="noopener">' + escapeHTML(m.name) + '</a>';
                } else {
                    html += escapeHTML(m.name);
                }
                html += '</h3>';
                html += '</div>';
            }

            html += '</div></section>';
        }

        container.innerHTML = html;
        // Trigger fade-in animations
        requestAnimationFrame(function () {
            var fadeEls = container.querySelectorAll('.fade-in');
            for (var j = 0; j < fadeEls.length; j++) {
                fadeEls[j].classList.add('visible');
            }
        });
    }

    /**
     * Render publications page content
     */
    async function renderPublications(containerId) {
        var container = document.getElementById(containerId);
        if (!container) return;

        var text = await ContentLoader.load('content/publications.md');
        if (!text) {
            container.innerHTML = '<p>Failed to load publications.</p>';
            return;
        }

        var sections = ContentLoader.parsePublications(text);
        var html = '';

        for (var sectionName in sections) {
            var pubs = sections[sectionName];
            var isPatent = sectionName.toLowerCase().indexOf('patent') !== -1;

            html += '<section class="pub-section fade-in">';
            html += '<h2 class="section-label">' + escapeHTML(sectionName) + '</h2>';
            html += '<div class="pub-list">';

            for (var i = 0; i < pubs.length; i++) {
                var p = pubs[i];
                html += '<div class="pub-item">';
                html += '<div class="pub-icon">' + (isPatent ? SVG_PATENT : SVG_PAPER) + '</div>';
                html += '<div class="pub-content">';
                html += '<h3>' + escapeHTML(p.title) + '</h3>';
                html += '<p class="pub-authors">' + escapeHTML(p.authors).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') + '</p>';
                html += '<div class="pub-meta">';
                html += '<span class="badge">' + escapeHTML(p.venue_short) + '</span>';

                if (p.link) {
                    html += ' <a href="' + escapeHTML(p.link) + '" class="btn-link" target="_blank" rel="noopener">';
                    html += (isPatent ? 'Patent' : 'Paper') + ' ↗</a>';
                }
                if (p.project) {
                    html += ' <a href="' + escapeHTML(p.project) + '" class="btn-link" target="_blank" rel="noopener">Project ↗</a>';
                }

                html += '</div>';

                if (p.note) {
                    html += '<p class="pub-note" style="margin-top:var(--spacing-2);font-size:0.8rem;color:var(--color-text-muted);font-family:var(--font-mono);">';
                    html += escapeHTML(p.note) + '</p>';
                }

                html += '</div></div>';
            }

            html += '</div></section>';
        }

        container.innerHTML = html;
        requestAnimationFrame(function () {
            var fadeEls = container.querySelectorAll('.fade-in');
            for (var j = 0; j < fadeEls.length; j++) {
                fadeEls[j].classList.add('visible');
            }
        });
    }

    /**
     * Render achievements page content
     */
    async function renderAchievements(containerId) {
        var container = document.getElementById(containerId);
        if (!container) return;

        var text = await ContentLoader.load('content/achievements.md');
        if (!text) {
            container.innerHTML = '<p>Failed to load achievements.</p>';
            return;
        }

        var sections = ContentLoader.parseAchievements(text);
        var html = '';

        for (var sectionName in sections) {
            var items = sections[sectionName];
            html += '<section class="section fade-in">';
            html += '<h2 class="section-label">' + escapeHTML(sectionName) + '</h2>';
            html += '<div class="milestones">';

            for (var i = 0; i < items.length; i++) {
                var a = items[i];
                var isWinner = a.type === 'winner';
                var isLast = (i === items.length - 1);

                html += '<div class="milestone-item">';
                html += '<div class="milestone-marker">';
                html += '<div class="milestone-dot' + (isWinner ? ' winner-dot' : '') + '"></div>';
                if (!isLast) {
                    html += '<div class="milestone-line"></div>';
                }
                html += '</div>';
                html += '<div class="milestone-content">';
                html += '<h3>' + escapeHTML(a.title) + '</h3>';
                html += '<p class="milestone-year">' + escapeHTML(a.date) + '</p>';

                // Event description with optional link
                if (a.event) {
                    html += '<p>';
                    if (a.link) {
                        html += escapeHTML(a.event.split('(')[0]) + '(<a href="' + escapeHTML(a.link) + '" target="_blank" rel="noopener">' + escapeHTML(a.event.replace(/.*\(/, '').replace(/\).*/, '')) + '</a>).';
                    } else {
                        html += escapeHTML(a.event) + '.';
                    }
                    html += '</p>';
                }

                if (a.team) {
                    html += '<p class="milestone-team">' + escapeHTML(a.team).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') + '</p>';
                }

                html += '</div></div>';
            }

            html += '</div></section>';
        }

        container.innerHTML = html;
        requestAnimationFrame(function () {
            var fadeEls = container.querySelectorAll('.fade-in');
            for (var j = 0; j < fadeEls.length; j++) {
                fadeEls[j].classList.add('visible');
            }
        });
    }

    // Expose globally
    window.ContentRenderer = {
        renderMembers: renderMembers,
        renderPublications: renderPublications,
        renderAchievements: renderAchievements
    };
})();
