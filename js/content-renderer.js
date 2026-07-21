/* ==========================================================
   Content Renderer — Render parsed markdown content into HTML
   ========================================================== */

(function () {
    'use strict';

    var SVG_PAPER = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>';
    var SVG_PATENT = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>';

    /* Maps research-area order → illustration (fallback if home.md lacks image:) */
    var RESEARCH_IMAGES = [
        'images/causal_video.svg',
        'images/causal_document.svg',
        'images/causal_healthcare.svg',
        'images/physics_causal.svg',
        'images/neuro_symbolic.svg'
    ];

    /* ── Helpers ────────────────────────────────────────── */
    function escapeHTML(str) {
        var div = document.createElement('div');
        div.appendChild(document.createTextNode(str == null ? '' : str));
        return div.innerHTML;
    }

    /* Render **bold** markup inside an otherwise-escaped string */
    function boldMarkup(str) {
        return escapeHTML(str).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    }

    function pad2(n) {
        return (n < 10 ? '0' : '') + n;
    }

    /* Classify a publications section name into a stable filter slug */
    function sectionSlug(name) {
        var n = (name || '').toLowerCase();
        if (n.indexOf('patent') !== -1) return 'patent';
        if (n.indexOf('journal') !== -1) return 'journal';
        if (n.indexOf('conference') !== -1) return 'conference';
        return 'other';
    }

    function slugLabel(slug, fallback) {
        if (slug === 'journal') return 'Journal';
        if (slug === 'conference') return 'Conference';
        if (slug === 'patent') return 'Patent';
        return fallback || 'Other';
    }

    /* Strip a leading "🏆 Winner — " prefix for display (markdown stays intact) */
    function cleanTitle(t) {
        return (t || '').replace(/^\s*🏆\s*/, '').replace(/^\s*winner\s*[—–-]\s*/i, '').trim();
    }

    /* Inline first-party .svg illustrations so they inherit the page's
       theme tokens (an external <img> svg is color-isolated). Trusted files. */
    async function inlineSvgs(container) {
        var holders = container.querySelectorAll('[data-svg]');
        for (var i = 0; i < holders.length; i++) {
            var holder = holders[i];
            try {
                var markup = await ContentLoader.load(holder.getAttribute('data-svg'));
                if (markup) holder.innerHTML = markup;
            } catch (e) {
                /* leave the empty media frame rather than break the layout */
            }
        }
    }

    /* Reveal dynamically-injected .fade-in blocks (the IntersectionObserver
       in main.js has already run by the time async content arrives). */
    function revealFadeIns(container) {
        requestAnimationFrame(function () {
            var els = container.querySelectorAll('.fade-in');
            for (var j = 0; j < els.length; j++) els[j].classList.add('visible');
        });
    }

    /* Single publication row — shared by the full list + homepage selection */
    function renderPubItem(p, slug) {
        var isPatent = slug === 'patent';
        var h = '';
        h += '<div class="pub-item" data-type="' + escapeHTML(slug) + '" data-year="' + escapeHTML(p.year) + '">';
        h += '<div class="pub-icon">' + (isPatent ? SVG_PATENT : SVG_PAPER) + '</div>';
        h += '<div class="pub-content">';
        h += '<h3>' + escapeHTML(p.title) + '</h3>';
        h += '<p class="pub-authors">' + boldMarkup(p.authors) + '</p>';
        h += '<div class="pub-meta">';
        h += '<span class="badge">' + escapeHTML(p.venue_short) + '</span>';
        if (p.link) {
            h += ' <a href="' + escapeHTML(p.link) + '" class="btn-link" target="_blank" rel="noopener">' +
                (isPatent ? 'Patent' : 'Paper') + ' ↗</a>';
        }
        if (p.project) {
            h += ' <a href="' + escapeHTML(p.project) + '" class="btn-link" target="_blank" rel="noopener">Project ↗</a>';
        }
        h += '</div>';
        if (p.note) {
            h += '<p class="pub-note">' + escapeHTML(p.note) + '</p>';
        }
        h += '</div></div>';
        return h;
    }

    /* Flatten parsed publication sections into [{p, slug}] + ordered type list */
    function flattenPublications(sections) {
        var all = [];
        var types = [];
        var seen = {};
        for (var name in sections) {
            var slug = sectionSlug(name);
            if (!seen[slug]) { seen[slug] = true; types.push({ slug: slug, label: slugLabel(slug, name) }); }
            sections[name].forEach(function (p) { all.push({ p: p, slug: slug }); });
        }
        return { all: all, types: types };
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
            var isLeaders = sectionName.toLowerCase().indexOf('leader') !== -1;

            html += '<section class="member-section fade-in">';
            html += '<h2 class="section-label">' + escapeHTML(sectionName) + '</h2>';

            if (isLeaders) {
                html += '<div class="member-leader">';
                for (var li = 0; li < members.length; li++) {
                    var lm = members[li];
                    html += '<div class="feature feature--leader">';
                    html += '<div class="avatar-initials">' + escapeHTML(lm.initials) + '</div>';
                    html += '<div>';
                    if (lm.role) html += '<p class="feature__role">' + escapeHTML(lm.role) + '</p>';
                    if (lm.link) {
                        html += '<p class="feature__name"><a href="' + escapeHTML(lm.link) + '" target="_blank" rel="noopener">' + escapeHTML(lm.name) + '</a></p>';
                    } else {
                        html += '<p class="feature__name">' + escapeHTML(lm.name) + '</p>';
                    }
                    html += '</div></div>';
                }
                html += '</div>';
            } else {
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
                    if (m.role) html += '<p class="member-card__role">' + escapeHTML(m.role) + '</p>';
                    html += '</div>';
                }
                html += '</div>';
            }

            html += '</section>';
        }

        container.innerHTML = html;
        revealFadeIns(container);
    }

    /**
     * Render publications page content — grouped by year with type/year filters.
     */
    async function renderPublications(containerId) {
        var container = document.getElementById(containerId);
        if (!container) return;

        var text = await ContentLoader.load('content/publications.md');
        if (!text) {
            container.innerHTML = '<p>Failed to load publications.</p>';
            return;
        }

        var flat = flattenPublications(ContentLoader.parsePublications(text));
        var all = flat.all;

        // Distinct years, newest first
        var years = [];
        var yearSeen = {};
        all.forEach(function (it) {
            var y = it.p.year;
            if (y && !yearSeen[y]) { yearSeen[y] = true; years.push(y); }
        });
        years.sort(function (a, b) {
            var na = parseInt(a, 10), nb = parseInt(b, 10);
            var aNum = !isNaN(na), bNum = !isNaN(nb);
            if (aNum && bNum) return nb - na;   // both years: newest first
            if (aNum) return 1;                 // non-numeric (e.g. "Ongoing") sorts to the top
            if (bNum) return -1;
            return 0;
        });

        var html = '';

        // Controls
        html += '<div class="pub-controls">';
        html += '<div class="pub-filter__group" role="group" aria-label="Filter by type">';
        html += '<button type="button" class="pub-filter" data-filter-type="all" aria-pressed="true">All</button>';
        flat.types.forEach(function (t) {
            html += '<button type="button" class="pub-filter" data-filter-type="' + escapeHTML(t.slug) + '" aria-pressed="false">' + escapeHTML(t.label) + '</button>';
        });
        html += '</div>';
        html += '<label class="pub-year-filter">Year ';
        html += '<select class="pub-filter-select" data-filter-year>';
        html += '<option value="all">All</option>';
        years.forEach(function (y) {
            if (isNaN(parseInt(y, 10))) return; // skip non-year buckets (e.g. "Ongoing") in the Year filter
            html += '<option value="' + escapeHTML(y) + '">' + escapeHTML(y) + '</option>';
        });
        html += '</select></label>';
        html += '<span class="pub-count" aria-live="polite"></span>';
        html += '</div>';

        // Year groups
        html += '<div class="pub-results">';
        years.forEach(function (y) {
            html += '<div class="pub-year-group fade-in" data-year-group="' + escapeHTML(y) + '">';
            html += '<h2 class="pub-year">' + escapeHTML(y) + '</h2>';
            html += '<div class="pub-list">';
            all.forEach(function (it) {
                if (it.p.year === y) html += renderPubItem(it.p, it.slug);
            });
            html += '</div></div>';
        });
        html += '</div>';

        container.innerHTML = html;
        wirePublicationFilters(container);
        revealFadeIns(container);
    }

    /* Wire the publications filter controls (type buttons + year select). */
    function wirePublicationFilters(container) {
        try {
            var typeButtons = container.querySelectorAll('[data-filter-type]');
            var yearSelect = container.querySelector('[data-filter-year]');
            var countEl = container.querySelector('.pub-count');
            var items = container.querySelectorAll('.pub-item');
            var groups = container.querySelectorAll('.pub-year-group');
            var state = { type: 'all', year: 'all' };

            function apply() {
                var visible = 0;
                items.forEach(function (it) {
                    var okType = state.type === 'all' || it.getAttribute('data-type') === state.type;
                    var okYear = state.year === 'all' || it.getAttribute('data-year') === state.year;
                    var show = okType && okYear;
                    it.classList.toggle('is-hidden', !show);
                    if (show) visible++;
                });
                groups.forEach(function (g) {
                    var any = g.querySelectorAll('.pub-item:not(.is-hidden)').length > 0;
                    g.classList.toggle('is-hidden', !any);
                });
                if (countEl) countEl.textContent = visible + (visible === 1 ? ' publication' : ' publications');
            }

            typeButtons.forEach(function (btn) {
                btn.addEventListener('click', function () {
                    state.type = btn.getAttribute('data-filter-type');
                    typeButtons.forEach(function (b) {
                        b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
                    });
                    apply();
                });
            });
            if (yearSelect) {
                yearSelect.addEventListener('change', function () {
                    state.year = yearSelect.value;
                    apply();
                });
            }
            apply();
        } catch (e) {
            console.error('Publication filter wiring failed:', e);
        }
    }

    /**
     * Render a compact "selected publications" list for the homepage.
     */
    async function renderSelectedPublications(containerId, opts) {
        opts = opts || {};
        var limit = opts.limit || 5;
        var container = document.getElementById(containerId);
        if (!container) return;

        var text = await ContentLoader.load('content/publications.md');
        if (!text) { container.innerHTML = '<p>Failed to load publications.</p>'; return; }

        var all = flattenPublications(ContentLoader.parsePublications(text)).all;
        all.sort(function (a, b) { return (parseInt(b.p.year, 10) || 0) - (parseInt(a.p.year, 10) || 0); });
        var picked = all.slice(0, limit);

        var html = '<div class="pub-list">';
        picked.forEach(function (it) { html += renderPubItem(it.p, it.slug); });
        html += '</div>';
        container.innerHTML = html;
    }

    /**
     * Render the research areas as a "causal graph" of editorial nodes.
     * Sourced from content/home.md (parseHome().researchAreas).
     */
    async function renderResearch(containerId) {
        var container = document.getElementById(containerId);
        if (!container) return;

        var text = await ContentLoader.load('content/home.md');
        if (!text) { container.innerHTML = '<p>Failed to load research areas.</p>'; return; }

        var areas = ContentLoader.parseHome(text).researchAreas || [];
        var html = '<div class="research-graph">';
        for (var i = 0; i < areas.length; i++) {
            var a = areas[i];
            var img = a.image || RESEARCH_IMAGES[i] || '';
            html += '<article class="research-node">';
            if (img && /\.svg(\?|$)/i.test(img)) {
                // Inlined after render so the schematic adapts to the theme toggle
                html += '<div class="research-node__media" data-svg="' + escapeHTML(img) +
                    '" role="img" aria-label="' + escapeHTML(a.title) + ' schematic"></div>';
            } else if (img) {
                html += '<div class="research-node__media"><img src="' + escapeHTML(img) +
                    '" alt="' + escapeHTML(a.title) + ' illustration" width="600" height="375" loading="lazy" decoding="async"></div>';
            }
            html += '<div class="research-node__body">';
            html += '<span class="research-node__num">' + pad2(i + 1) + '</span>';
            html += '<h3>' + escapeHTML(a.title) + '</h3>';
            html += '<p>' + escapeHTML(a.description) + '</p>';
            html += '</div></article>';
        }
        html += '</div>';
        container.innerHTML = html;
        inlineSvgs(container);
    }

    /**
     * Render the recognition highlight band (stats + featured wins).
     */
    async function renderRecognition(containerId, opts) {
        opts = opts || {};
        var limit = opts.limit || 3;
        var container = document.getElementById(containerId);
        if (!container) return;

        var text = await ContentLoader.load('content/achievements.md');
        if (!text) { container.innerHTML = '<p>Failed to load achievements.</p>'; return; }

        var sections = ContentLoader.parseAchievements(text);
        var all = [];
        for (var name in sections) { sections[name].forEach(function (a) { all.push(a); }); }
        var wins = all.filter(function (a) { return a.type === 'winner'; });
        var featured = (opts.winnersOnly ? wins : all).slice(0, limit);

        var html = '<div class="recognition-grid">';

        html += '<div class="stat-grid">';
        html += '<div class="stat"><span class="stat__num">' + wins.length + '</span><span class="stat__label">challenge wins</span></div>';
        html += '<div class="stat"><span class="stat__num">' + all.length + '</span><span class="stat__label">competitions entered</span></div>';
        html += '</div>';

        html += '<div class="milestones">';
        featured.forEach(function (a, idx) {
            var isLast = idx === featured.length - 1;
            html += '<div class="milestone-item">';
            html += '<div class="milestone-marker">';
            html += '<div class="milestone-dot' + (a.type === 'winner' ? ' winner-dot' : '') + '"></div>';
            if (!isLast) html += '<div class="milestone-line"></div>';
            html += '</div>';
            html += '<div class="milestone-content">';
            if (a.type === 'winner') html += '<span class="badge winner-badge">Winner</span>';
            html += '<h3>' + escapeHTML(cleanTitle(a.title)) + '</h3>';
            html += '<p class="milestone-year">' + escapeHTML(a.date) + '</p>';
            if (a.event) {
                html += '<p>';
                if (a.link) html += '<a href="' + escapeHTML(a.link) + '" target="_blank" rel="noopener">' + escapeHTML(a.event) + '</a>';
                else html += escapeHTML(a.event);
                html += '</p>';
            }
            html += '</div></div>';
        });
        html += '</div>';

        html += '</div>';
        container.innerHTML = html;
    }

    /**
     * Render a people preview for the homepage: featured leader + avatar strip.
     */
    async function renderPeoplePreview(containerId) {
        var container = document.getElementById(containerId);
        if (!container) return;

        var text = await ContentLoader.load('content/members.md');
        if (!text) { container.innerHTML = '<p>Failed to load team.</p>'; return; }

        var sections = ContentLoader.parseMembers(text);
        var leader = null;
        var others = [];
        for (var name in sections) {
            var isLeaders = name.toLowerCase().indexOf('leader') !== -1;
            sections[name].forEach(function (m) {
                if (isLeaders && !leader) leader = m;
                else others.push(m);
            });
        }

        var html = '<div class="people-preview">';
        if (leader) {
            html += '<div class="feature feature--leader">';
            html += '<div class="avatar-initials">' + escapeHTML(leader.initials) + '</div>';
            html += '<div>';
            if (leader.role) html += '<p class="feature__role">' + escapeHTML(leader.role) + '</p>';
            html += '<p class="feature__name">' + escapeHTML(leader.name) + '</p>';
            html += '</div></div>';
        }
        html += '<div class="people-strip">';
        others.forEach(function (m) {
            if (m.link) {
                html += '<a href="' + escapeHTML(m.link) + '" target="_blank" rel="noopener" title="' + escapeHTML(m.name) + '" aria-label="' + escapeHTML(m.name) + '"><span class="avatar-initials">' + escapeHTML(m.initials) + '</span></a>';
            } else {
                html += '<span class="avatar-initials" title="' + escapeHTML(m.name) + '">' + escapeHTML(m.initials) + '</span>';
            }
        });
        html += '</div>';
        html += '</div>';
        container.innerHTML = html;
    }

    /**
     * Render achievements page content — causal timeline with winner badges.
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
                if (!isLast) html += '<div class="milestone-line"></div>';
                html += '</div>';
                html += '<div class="milestone-content">';
                if (isWinner) html += '<span class="badge winner-badge">Winner</span>';
                html += '<h3>' + escapeHTML(cleanTitle(a.title)) + '</h3>';
                html += '<p class="milestone-year">' + escapeHTML(a.date) + '</p>';

                if (a.event) {
                    html += '<p>';
                    if (a.link) html += '<a href="' + escapeHTML(a.link) + '" target="_blank" rel="noopener">' + escapeHTML(a.event) + '</a>';
                    else html += escapeHTML(a.event);
                    html += '</p>';
                }

                if (a.team) {
                    html += '<p class="milestone-team">' + boldMarkup(a.team) + '</p>';
                }

                html += '</div></div>';
            }

            html += '</div></section>';
        }

        container.innerHTML = html;
        revealFadeIns(container);
    }

    function projectLink(label, url) {
        if (!url) return '';
        var external = /^https?:/i.test(url);
        var attrs = external ? ' target="_blank" rel="noopener"' : '';
        return '<a href="' + escapeHTML(url) + '" class="btn-link"' + attrs + '>' + label + ' ↗</a>';
    }

    /**
     * Render the projects page — project cards grouped by section,
     * sourced from content/projects.md (organized by research area).
     */
    async function renderProjects(containerId) {
        var container = document.getElementById(containerId);
        if (!container) return;

        var text = await ContentLoader.load('content/projects.md');
        if (!text) {
            container.innerHTML = '<p>Failed to load projects.</p>';
            return;
        }

        var sections = ContentLoader.parseProjects(text);
        var html = '';
        var figProjects = [];

        for (var sectionName in sections) {
            var items = sections[sectionName];
            if (!items.length) continue;
            html += '<section class="project-section fade-in">';
            html += '<h2 class="section-label">' + escapeHTML(sectionName) + '</h2>';
            html += '<div class="card-grid">';
            for (var i = 0; i < items.length; i++) {
                var p = items[i];
                if (p.figures && p.figures.length) figProjects.push(p);
                html += '<article class="card project-card">';
                if (p.status) {
                    html += '<span class="badge project-status project-status--' + escapeHTML(p.status.toLowerCase()) +
                        '">' + escapeHTML(p.status) + '</span>';
                }
                if (p.area) html += '<p class="project-card__area">' + escapeHTML(p.area) + '</p>';
                html += '<h3>' + escapeHTML(p.title) + '</h3>';
                if (p.description) html += '<p class="project-card__desc">' + escapeHTML(p.description) + '</p>';
                if (p.team) html += '<p class="project-card__team">' + boldMarkup(p.team) + '</p>';
                var links = projectLink('Publications', p.link) + projectLink('Code', p.code) + projectLink('Demo', p.demo);
                if (links) html += '<div class="project-card__links">' + links + '</div>';
                if (p.topics && p.topics.length) {
                    html += '<details class="project-topics"><summary>Open capstone &amp; thesis topics</summary>';
                    html += '<ul class="topic-list">';
                    for (var t = 0; t < p.topics.length; t++) {
                        var tp = p.topics[t];
                        var lvl = (tp.level || '').toLowerCase();
                        var ttext = tp.id
                            ? '<a href="capstones.html#' + escapeHTML(tp.id) + '">' + escapeHTML(tp.text) + '</a>'
                            : escapeHTML(tp.text);
                        html += '<li><span class="topic-level topic-level--' + escapeHTML(lvl) + '">' +
                            escapeHTML(tp.level) + '</span> ' + ttext + '</li>';
                    }
                    html += '</ul></details>';
                }
                if (p.refs && p.refs.length) {
                    html += '<details class="project-refs"><summary>Key references</summary><ul class="ref-list">';
                    for (var r = 0; r < p.refs.length; r++) {
                        var rf = p.refs[r];
                        if (rf.url) {
                            html += '<li><a href="' + escapeHTML(rf.url) + '" target="_blank" rel="noopener">' +
                                escapeHTML(rf.name) + ' ↗</a></li>';
                        } else {
                            html += '<li>' + escapeHTML(rf.name) + '</li>';
                        }
                    }
                    html += '</ul></details>';
                }
                html += '</article>';
            }
            html += '</div></section>';
        }

        // Full-width "Approach" section with the architecture diagrams
        if (figProjects.length) {
            html += '<section class="project-section fade-in">';
            html += '<h2 class="section-label">Approach &amp; architecture</h2>';
            for (var fp = 0; fp < figProjects.length; fp++) {
                var proj = figProjects[fp];
                for (var fg = 0; fg < proj.figures.length; fg++) {
                    var fig = proj.figures[fg];
                    var cap = escapeHTML(proj.title) + (fig.caption ? ' · ' + escapeHTML(fig.caption) : '');
                    html += '<figure class="arch-figure" role="button" tabindex="0" aria-label="' + cap + ' (tap to enlarge)">';
                    html += '<figcaption class="arch-figcaption">' + cap +
                        '<span class="arch-figcaption__hint">⤢ tap to enlarge</span></figcaption>';
                    html += '<div data-svg="' + escapeHTML(fig.src) + '"></div>';
                    html += '</figure>';
                }
            }
            html += '</section>';
        }

        container.innerHTML = html;
        inlineSvgs(container);
        revealFadeIns(container);
    }

    /**
     * Render the capstones page — full per-topic detail with deep-link anchors.
     */
    async function renderCapstones(containerId) {
        var container = document.getElementById(containerId);
        if (!container) return;

        var text = await ContentLoader.load('content/capstones.md');
        if (!text) { container.innerHTML = '<p>Failed to load capstones.</p>'; return; }

        var sections = ContentLoader.parseCapstones(text);

        function block(label, val) {
            return val ? '<div class="capstone__block"><h4>' + label + '</h4><p>' + escapeHTML(val) + '</p></div>' : '';
        }

        var html = '';
        for (var sectionName in sections) {
            var items = sections[sectionName];
            html += '<section class="capstone-section fade-in">';
            html += '<h2 class="section-label">' + escapeHTML(sectionName) + '</h2>';
            for (var i = 0; i < items.length; i++) {
                var c = items[i];
                html += '<article class="capstone" id="' + escapeHTML(c.slug) + '">';
                html += '<div class="capstone__head">';
                html += '<span class="topic-level topic-level--' + escapeHTML((c.level || '').toLowerCase()) + '">' + escapeHTML(c.level) + '</span>';
                html += '<h3>' + escapeHTML(c.id) + ' · ' + escapeHTML(c.title) + '</h3>';
                if (c.duration) html += '<span class="capstone__dur">' + escapeHTML(c.duration) + '</span>';
                html += '</div>';
                html += block('Goal', c.goal) + block('Context', c.context) + block('Questions', c.questions) +
                    block('Data', c.data) + block('Method', c.method) + block('Milestones', c.milestones);
                if (c.reading.length) {
                    html += '<div class="capstone__block"><h4>Reading</h4><ul class="capstone__reading">';
                    for (var r = 0; r < c.reading.length; r++) {
                        var rd = c.reading[r];
                        var kind = rd.kind ? '<span class="read-kind">' + escapeHTML(rd.kind) + '</span> ' : '';
                        var body = rd.url
                            ? escapeHTML(rd.text) + ' <a href="' + escapeHTML(rd.url) + '" target="_blank" rel="noopener">link ↗</a>'
                            : escapeHTML(rd.text);
                        html += '<li>' + kind + body + '</li>';
                    }
                    html += '</ul></div>';
                }
                html += '</article>';
            }
            html += '</section>';
        }

        container.innerHTML = html;
        revealFadeIns(container);
    }

    /**
     * Render the "Recent News" list on the home page, sourced from
     * content/home.md (parsed by ContentLoader.parseHome).
     */
    async function renderNews(containerId) {
        var container = document.getElementById(containerId);
        if (!container) return;

        var text = await ContentLoader.load('content/home.md');
        if (!text) {
            container.innerHTML = '<p>Failed to load news.</p>';
            return;
        }

        var data = ContentLoader.parseHome(text);
        var news = data.news || [];
        if (!news.length) {
            var section = container.closest('.section');
            if (section) section.style.display = 'none';
            return;
        }

        var html = '<div class="news-list">';
        for (var i = 0; i < news.length; i++) {
            var n = news[i];
            html += '<div class="news-item">';
            html += '<div class="news-year">' + escapeHTML(n.year) + '</div>';
            html += '<div class="news-content">';
            html += '<h3>' + escapeHTML(n.title) + '</h3>';
            if (n.description) {
                html += '<p>' + escapeHTML(n.description) + '</p>';
            }
            html += '</div></div>';
        }
        html += '</div>';

        container.innerHTML = html;
        if (window.typesetMath) window.typesetMath(container);
    }

    // Expose globally
    window.ContentRenderer = {
        renderMembers: renderMembers,
        renderPublications: renderPublications,
        renderSelectedPublications: renderSelectedPublications,
        renderResearch: renderResearch,
        renderRecognition: renderRecognition,
        renderPeoplePreview: renderPeoplePreview,
        renderAchievements: renderAchievements,
        renderProjects: renderProjects,
        renderCapstones: renderCapstones,
        renderNews: renderNews
    };
})();
