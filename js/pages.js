/* ==========================================================
   Pages — build each page from content.js + ui.js
   ----------------------------------------------------------
   Runs the renderer named by <body data-page="...">. A member
   profile adds data-person="<id from people.md>". Each renderer
   fills containers with known ids and leaves the rest of the
   page (intro text, headings) as written in the HTML.
   ========================================================== */

var Pages = (function () {
    'use strict';

    var NEWS_LIMIT = 6;

    function $(id) { return document.getElementById(id); }

    function fail(el, what) {
        if (el) el.innerHTML = UI.note('Could not load ' + what + '. Please refresh the page.');
    }

    /* Hide the enclosing section when a block has nothing to show */
    function hideSection(el) {
        var s = el && el.closest('section');
        if (s) s.hidden = true;
    }

    function done(el) {
        if (window.SITE && SITE.reveal) SITE.reveal(el);
    }

    /* Content renders after load, so re-apply a #hash jump once targets exist */
    function jumpToHash() {
        if (!location.hash) return;
        var t = document.getElementById(decodeURIComponent(location.hash.slice(1)));
        if (t) t.scrollIntoView();
    }

    function byNewest(a, b) { return Content.dateKey(b.year || b.date) - Content.dateKey(a.year || a.date); }

    function plainAuthors(s) { return String(s || '').replace(/\*\*/g, ''); }

    function involves(str, patterns) {
        var plain = plainAuthors(str);
        return patterns.some(function (re) { return plain.search(re) !== -1; });
    }

    /* Ongoing first, then newest year first */
    function yearOrder(years) {
        return years.sort(function (a, b) {
            var na = parseInt(a, 10), nb = parseInt(b, 10);
            if (isNaN(na) && isNaN(nb)) return 0;
            if (isNaN(na)) return -1;
            if (isNaN(nb)) return 1;
            return nb - na;
        });
    }

    function groupByYear(pubs) {
        var groups = {};
        pubs.forEach(function (p) { (groups[p.year] = groups[p.year] || []).push(p); });
        return { years: yearOrder(Object.keys(groups)), groups: groups };
    }

    function yearId(y) { return 'year-' + Content.slug(y); }

    /* ── Home ───────────────────────────────────────────── */
    function home() {
        var newsEl = $('home-news'), areasEl = $('home-areas'), selEl = $('home-selected');

        Promise.all([Content.news(), Content.publications(), Content.awards(), Content.research(), Content.people()])
            .then(function (r) {
                var news = r[0] || [], pubs = r[1], awards = r[2] || [], areas = r[3], people = r[4];
                var patterns = UI.aliasPatterns(people);

                if (newsEl) {
                    var items = news.map(function (n) {
                        return { date: n.date, title: n.title, description: n.description, link: n.link, kind: n.kind || '', rank: 0 };
                    });
                    awards.filter(function (a) { return a.winner; }).forEach(function (a) {
                        items.push({ date: a.date, title: a.title, description: a.event, link: '/publications.html#awards', kind: 'Challenge win', rank: 1 });
                    });
                    (pubs || []).filter(function (p) { return !p.ongoing && p.type !== 'patent'; }).forEach(function (p) {
                        items.push({
                            date: p.year, title: p.title, description: p.venue_short || p.venue,
                            link: p.project ? '/' + p.project.replace(/^\//, '') : p.link, kind: 'Paper', rank: 2
                        });
                    });
                    var seen = {};
                    items = items.filter(function (it) {
                        var k = it.title.toLowerCase().trim();
                        if (seen[k]) return false;
                        seen[k] = true;
                        return true;
                    });
                    items.sort(function (a, b) { return byNewest(a, b) || a.rank - b.rank; });
                    items = items.slice(0, NEWS_LIMIT);
                    if (items.length) {
                        newsEl.innerHTML = '<div class="entry-list">' + items.map(UI.newsItem).join('') + '</div>';
                        done(newsEl);
                    } else hideSection(newsEl);
                }

                if (areasEl) {
                    if (areas) areasEl.innerHTML = areas.map(UI.areaCard).join('');
                    else fail(areasEl, 'research areas');
                }

                if (selEl) {
                    var picked = (pubs || []).filter(function (p) { return /^(yes|true)$/i.test(p.selected || ''); }).sort(byNewest);
                    if (picked.length) {
                        selEl.innerHTML = '<div class="entry-list">' + picked.map(function (p) { return UI.pub(p, { patterns: patterns }); }).join('') + '</div>';
                    } else hideSection(selEl);
                }
            });
    }

    /* ── Research ───────────────────────────────────────── */
    function research() {
        var el = $('research-content');
        if (!el) return;
        Promise.all([Content.research(), Content.publications(), Content.people()]).then(function (r) {
            var areas = r[0], pubs = r[1] || [], patterns = UI.aliasPatterns(r[2]);
            if (!areas) return fail(el, 'research areas');

            var html = UI.jumpNav(areas.map(function (a) { return { id: a.id, label: a.title }; }), 'Research areas');
            areas.forEach(function (a) {
                var related = pubs.filter(function (p) { return p.area === a.id; }).sort(byNewest);
                var buttons = UI.button('Publications', a.link) + UI.button('Code', a.code) + UI.button('Demo', a.demo);
                html += '<section class="research-area fade-in" id="' + UI.esc(a.id) + '">' +
                    '<h2 class="section-label">' + UI.esc(a.title) + '</h2>' +
                    (a.description ? '<p class="prose">' + UI.inline(a.description) + '</p>' : '') +
                    (a.team ? '<p class="meta-line"><span class="meta-label">People</span>' + UI.authors(a.team, patterns) + '</p>' : '') +
                    (buttons ? '<div class="tag-row">' + buttons + '</div>' : '') +
                    (related.length ? '<h3 class="subhead">Publications</h3><div class="entry-list">' +
                        related.map(function (p) { return UI.pub(p, { patterns: patterns }); }).join('') + '</div>' : '') +
                    '</section>';
            });
            el.innerHTML = html;
            done(el);
            jumpToHash();
        });
    }

    /* ── People ─────────────────────────────────────────── */
    function people() {
        var el = $('people-content');
        if (!el) return;
        Content.people().then(function (list) {
            if (!list) return fail(el, 'people');
            var order = [], groups = {};
            list.forEach(function (p) {
                if (!groups[p.group]) { groups[p.group] = []; order.push(p.group); }
                groups[p.group].push(p);
            });
            var html = '';
            order.forEach(function (g) {
                var members = groups[g];
                if (/alumni/i.test(g)) {
                    html += '<section class="section fade-in" id="alumni">' + UI.sectionLabel(g) +
                        '<ul class="entry-list">' + members.map(UI.alumnus).join('') + '</ul></section>';
                    return;
                }
                var lead = /investigator|leader|lead\b/i.test(g);
                html += '<section class="section fade-in">' + UI.sectionLabel(g) +
                    '<div class="card-grid' + (lead ? ' card-grid--lead' : '') + '">' +
                    members.map(function (p) { return UI.person(p, { lead: lead }); }).join('') +
                    '</div></section>';
            });
            el.innerHTML = html;
            done(el);
            jumpToHash();
        });
    }

    /* ── Publications (+ awards) ────────────────────────── */
    var TYPE_LABELS = { ongoing: 'Ongoing', journal: 'Journal', conference: 'Conference', patent: 'Patent', other: 'Other', award: 'Awards' };

    function publications() {
        var el = $('publications-content');
        if (!el) return;
        Promise.all([Content.publications(), Content.awards(), Content.people()]).then(function (r) {
            var pubs = r[0], awards = (r[1] || []).slice().sort(byNewest), patterns = UI.aliasPatterns(r[2]);
            if (!pubs) return fail(el, 'publications');

            var types = [];
            pubs.forEach(function (p) { if (types.indexOf(p.type) === -1) types.push(p.type); });
            if (awards.length) types.push('award');

            var g = groupByYear(pubs);
            var toc = g.years.map(function (y) { return { id: yearId(y), label: y, key: y }; });
            if (awards.length) toc.push({ id: 'awards', label: 'Awards', key: 'awards' });

            var filterYears = g.years.filter(function (y) { return !isNaN(parseInt(y, 10)); });
            awards.forEach(function (a) { if (a.year && filterYears.indexOf(a.year) === -1) filterYears.push(a.year); });
            filterYears.sort(function (a, b) { return b - a; });

            var controls = '<div class="filter-bar">' +
                '<div class="filter-group" role="group" aria-label="Filter by type">' +
                '<button type="button" class="filter-btn" data-filter-type="all" aria-pressed="true">All</button>' +
                types.map(function (t) {
                    return '<button type="button" class="filter-btn" data-filter-type="' + t + '" aria-pressed="false">' + (TYPE_LABELS[t] || t) + '</button>';
                }).join('') + '</div>' +
                '<label class="filter-year">Year <select data-filter-year><option value="all">All</option>' +
                filterYears.map(function (y) { return '<option value="' + UI.esc(y) + '">' + UI.esc(y) + '</option>'; }).join('') +
                '</select></label><span class="filter-count" aria-live="polite"></span></div>';

            var groupsHtml = g.years.map(function (y) {
                return '<section class="entry-group" id="' + yearId(y) + '" data-group="' + UI.esc(y) + '">' +
                    '<h2 class="entry-group__title">' + UI.esc(y) + '</h2><div class="entry-list">' +
                    g.groups[y].map(function (p) { return UI.pub(p, { patterns: patterns }); }).join('') +
                    '</div></section>';
            }).join('');
            if (awards.length) {
                groupsHtml += '<section class="entry-group" id="awards" data-group="awards">' +
                    '<h2 class="entry-group__title">Awards &amp; challenges</h2><div class="entry-list">' +
                    awards.map(function (a) { return UI.award(a, { patterns: patterns }); }).join('') +
                    '</div></section>';
            }

            el.innerHTML = '<div class="side-layout">' +
                UI.jumpNav(toc, 'Jump to year').replace('class="jump-nav"', 'class="jump-nav jump-nav--side"') +
                '<div class="side-layout__main">' + controls + groupsHtml + '</div></div>';
            wireFilters(el);
            jumpToHash();
        });
    }

    function wireFilters(el) {
        var buttons = el.querySelectorAll('[data-filter-type]');
        var yearSel = el.querySelector('[data-filter-year]');
        var countEl = el.querySelector('.filter-count');
        var entries = el.querySelectorAll('.entry[data-type]');
        var groups = el.querySelectorAll('.entry-group');
        var state = { type: 'all', year: 'all' };

        function apply() {
            var nPubs = 0, nAwards = 0;
            entries.forEach(function (it) {
                var t = it.getAttribute('data-type');
                var show = (state.type === 'all' || t === state.type) &&
                    (state.year === 'all' || it.getAttribute('data-year') === state.year);
                it.classList.toggle('is-hidden', !show);
                if (show) { if (t === 'award') nAwards++; else nPubs++; }
            });
            groups.forEach(function (gr) {
                var any = !!gr.querySelector('.entry:not(.is-hidden)');
                gr.classList.toggle('is-hidden', !any);
                var link = el.querySelector('.jump-nav a[data-jump="' + gr.getAttribute('data-group') + '"]');
                if (link) link.parentNode.classList.toggle('is-hidden', !any);
            });
            var parts = [];
            if (nPubs || !nAwards) parts.push(nPubs + (nPubs === 1 ? ' publication' : ' publications'));
            if (nAwards) parts.push(nAwards + (nAwards === 1 ? ' award' : ' awards'));
            if (countEl) countEl.textContent = parts.join(' · ');
        }

        buttons.forEach(function (btn) {
            btn.addEventListener('click', function () {
                state.type = btn.getAttribute('data-filter-type');
                buttons.forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
                apply();
            });
        });
        if (yearSel) yearSel.addEventListener('change', function () { state.year = yearSel.value; apply(); });

        /* Scroll-spy: highlight the jump link for the group in view */
        if ('IntersectionObserver' in window) {
            var links = el.querySelectorAll('.jump-nav a[data-jump]');
            var spy = new IntersectionObserver(function (es) {
                es.forEach(function (e) {
                    if (!e.isIntersecting) return;
                    var key = e.target.getAttribute('data-group');
                    links.forEach(function (a) { a.classList.toggle('is-active', a.getAttribute('data-jump') === key); });
                });
            }, { rootMargin: '-15% 0px -75% 0px' });
            groups.forEach(function (gr) { spy.observe(gr); });
        }
        apply();
    }

    /* ── Join us ────────────────────────────────────────── */
    function join() {
        var el = $('join-content');
        if (!el) return;
        Content.load('join').then(function (sections) {
            if (!sections) return fail(el, 'this page');
            el.innerHTML = sections.map(function (s) {
                var body;
                if (/apply/i.test(s.name)) {
                    body = '<ol class="steps">' + s.entries.map(function (e) {
                        return '<li class="steps__item"><h3>' + UI.esc(e.head.join(' | ')) + '</h3><p>' + UI.inline(e.text) + '</p></li>';
                    }).join('') + '</ol>';
                } else if (/faq|question/i.test(s.name)) {
                    body = '<div class="faq">' + s.entries.map(function (e) {
                        return '<details class="faq__item"><summary>' + UI.esc(e.head.join(' | ')) + '</summary><p>' + UI.inline(e.text) + '</p></details>';
                    }).join('') + '</div>';
                } else {
                    body = '<div class="card-grid card-grid--two">' + s.entries.map(function (e) {
                        return '<article class="card card--text"><h3>' + UI.esc(e.head.join(' | ')) + '</h3><p>' + UI.inline(e.text) + '</p></article>';
                    }).join('') + '</div>';
                }
                return '<section class="section fade-in">' + UI.sectionLabel(s.name) + body + '</section>';
            }).join('');
            done(el);
        });
    }

    /* ── Member profile: publications + awards by alias ── */
    function profile(id) {
        var pubsEl = $('profile-publications'), awardsEl = $('profile-awards');
        Promise.all([Content.people(), Content.publications(), Content.awards()]).then(function (r) {
            var everyone = r[0] || [], pubs = r[1] || [], awards = r[2] || [];
            var me = everyone.filter(function (p) { return p.id === id; })[0];
            var patterns = UI.aliasPatterns(everyone);
            var mine = me ? UI.aliasPatterns([me]) : [];

            if (pubsEl) {
                var list = pubs.filter(function (p) { return involves(p.authors, mine); });
                if (!list.length) { pubsEl.innerHTML = UI.note('No publications listed yet.'); }
                else {
                    var g = groupByYear(list);
                    pubsEl.innerHTML = '<p class="filter-count">' + list.length + ' publications</p>' +
                        g.years.map(function (y) {
                            return '<section class="entry-group"><h3 class="entry-group__title">' + UI.esc(y) + '</h3><div class="entry-list">' +
                                g.groups[y].map(function (p) { return UI.pub(p, { patterns: patterns }); }).join('') + '</div></section>';
                        }).join('');
                }
            }
            if (awardsEl) {
                var won = awards.filter(function (a) { return involves(a.team, mine); }).sort(byNewest);
                if (won.length) awardsEl.innerHTML = '<div class="entry-list">' + won.map(function (a) { return UI.award(a, { patterns: patterns }); }).join('') + '</div>';
                else hideSection(awardsEl);
            }
        });
    }

    var RENDERERS = { home: home, research: research, people: people, publications: publications, join: join };

    function run() {
        var body = document.body;
        var person = body.getAttribute('data-person');
        if (person) return profile(person);
        var fn = RENDERERS[body.getAttribute('data-page')];
        if (fn) fn();
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
    else run();

    return RENDERERS;
})();
