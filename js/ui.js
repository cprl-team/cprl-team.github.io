/* ==========================================================
   UI — shared building blocks
   ----------------------------------------------------------
   Each function takes one record from content.js and returns
   an HTML string. Pages compose these, so a paper, person,
   award or news item looks the same wherever it appears.
   Matching styles live in css/components.css.
   ========================================================== */

var UI = (function () {
    'use strict';

    function esc(s) {
        return String(s == null ? '' : s)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    function isExternal(url) { return /^(https?:)?\/\//i.test(url || ''); }

    function linkAttrs(url) {
        return ' href="' + esc(url) + '"' + (isExternal(url) ? ' target="_blank" rel="noopener"' : '');
    }

    /* Inline markdown: **bold**, *italic*, [text](url) — on escaped text */
    function inline(s) {
        return esc(s)
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.+?)\*/g, '<em>$1</em>')
            .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, function (_, text, url) {
                return '<a' + linkAttrs(url.replace(/&amp;/g, '&')) + '>' + text + '</a>';
            });
    }

    /* ── Author highlighting ────────────────────────────── */
    /* Build one regex per alias that ignores hyphen/space differences and
       only matches a whole author (between list separators). */
    function aliasPatterns(people) {
        var names = [];
        (people || []).forEach(function (p) { names = names.concat(p.aliases || []); });
        names.sort(function (a, b) { return b.length - a.length; });
        return names.map(function (n) {
            var body = n.split(/[\s-]+/).map(function (part) {
                return part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            }).join('[\\s-]+');
            return new RegExp('(^|,\\s*|&\\s*)(' + body + ')(?=\\s*(,|&|$))', 'g');
        });
    }

    /* Bold every lab member in an author list; existing **bold** is kept */
    function authors(str, patterns) {
        var parts = String(str || '').split(/(\*\*[^*]+\*\*)/);
        var out = parts.map(function (part) {
            if (/^\*\*/.test(part)) return part;
            (patterns || []).forEach(function (re) { part = part.replace(re, '$1**$2**'); });
            return part;
        }).join('');
        return inline(out);
    }

    /* ── Small pieces ───────────────────────────────────── */
    function badge(text, variant, title) {
        if (!text) return '';
        return '<span class="badge' + (variant ? ' badge--' + variant : '') + '"' +
            (title ? ' title="' + esc(title) + '"' : '') + '>' + esc(text) + '</span>';
    }

    function button(label, url) {
        if (!url) return '';
        return '<a class="btn-link"' + linkAttrs(url) + '>' + esc(label) + (isExternal(url) ? ' ↗' : '') + '</a>';
    }

    function sectionLabel(text, id) {
        return '<h2 class="section-label"' + (id ? ' id="' + esc(id) + '"' : '') + '>' + esc(text) + '</h2>';
    }

    function note(text) { return '<p class="empty-note">' + esc(text) + '</p>'; }

    /* ── Publication ────────────────────────────────────── */
    function pub(p, ctx) {
        ctx = ctx || {};
        var tags =
            badge(p.venue_short, '', p.venue) +
            badge(p.series, 'muted') +
            badge(p.award, 'winner') +
            button(p.type === 'patent' ? 'Patent' : 'Paper', p.link) +
            button('PDF', p.pdf) + button('Code', p.code) + button('Data', p.data) +
            button('Slides', p.slides) + button('Video', p.video) +
            button('Project page', p.project ? '/' + p.project.replace(/^\//, '') : '');
        return '<article class="entry pub" data-type="' + esc(p.type) + '" data-year="' + esc(p.year) + '">' +
            '<h3 class="entry__title">' + esc(p.title) + '</h3>' +
            '<p class="entry__people">' + authors(p.authors, ctx.patterns) + '</p>' +
            (tags ? '<div class="tag-row">' + tags + '</div>' : '') +
            (p.note ? '<p class="entry__note">' + inline(p.note) + '</p>' : '') +
            '</article>';
    }

    /* ── Award / challenge result ───────────────────────── */
    function award(a, ctx) {
        ctx = ctx || {};
        var event = a.event ? (a.link ? '<a' + linkAttrs(a.link) + '>' + esc(a.event) + '</a>' : esc(a.event)) : '';
        return '<article class="entry dated-entry award" data-type="award" data-year="' + esc(a.year) + '">' +
            '<time class="dated-entry__date">' + esc(a.date) + '</time>' +
            '<div class="dated-entry__body">' +
            '<div class="tag-row tag-row--tight">' + (a.winner ? badge('Winner', 'winner') : badge(a.place || 'Challenge', 'muted')) + '</div>' +
            '<h3 class="entry__title">' + esc(a.title) + '</h3>' +
            (event ? '<p class="entry__venue">' + event + '</p>' : '') +
            (a.team ? '<p class="entry__people">' + authors(a.team, ctx.patterns) + '</p>' : '') +
            '</div></article>';
    }

    /* ── News item ──────────────────────────────────────── */
    function newsItem(n) {
        var title = n.link ? '<a' + linkAttrs(n.link) + '>' + esc(n.title) + '</a>' : esc(n.title);
        return '<article class="dated-entry news">' +
            '<time class="dated-entry__date">' + esc(n.date) + '</time>' +
            '<div class="dated-entry__body">' +
            (n.kind ? '<span class="news__kind">' + esc(n.kind) + '</span>' : '') +
            '<h3 class="entry__title">' + title + '</h3>' +
            (n.description ? '<p class="entry__venue">' + inline(n.description) + '</p>' : '') +
            '</div></article>';
    }

    /* ── Person ─────────────────────────────────────────── */
    function avatar(p) {
        if (p.photo) return '<img class="avatar" src="/' + esc(p.photo.replace(/^\//, '')) + '" alt="" loading="lazy">';
        return '<span class="avatar avatar--initials" aria-hidden="true">' + esc(p.initials || '') + '</span>';
    }

    function profileUrl(p) {
        if (!p.link) return '';
        return isExternal(p.link) ? p.link : '/' + p.link.replace(/^\//, '');
    }

    function person(p, opts) {
        opts = opts || {};
        var url = profileUrl(p);
        var name = url ? '<a' + linkAttrs(url) + '>' + esc(p.name) + '</a>' : esc(p.name);
        var buttons =
            button(!isExternal(url) ? 'Profile' : /scholar\.google/.test(url) ? 'Scholar' : 'Website', url) +
            button('Scholar', p.scholar) + button('GitHub', p.github) + button('Website', p.website);
        return '<article class="card person' + (opts.lead ? ' person--lead' : '') + '">' +
            avatar(p) +
            '<h3 class="person__name">' + name + '</h3>' +
            (p.role ? '<p class="person__role">' + esc(p.role) + '</p>' : '') +
            (p.interests ? '<p class="person__interests">' + esc(p.interests) + '</p>' : '') +
            (buttons ? '<div class="tag-row tag-row--center">' + buttons + '</div>' : '') +
            '</article>';
    }

    function alumnus(p) {
        var url = profileUrl(p);
        return '<li class="entry entry--compact">' +
            '<span class="entry__title">' + (url ? '<a' + linkAttrs(url) + '>' + esc(p.name) + '</a>' : esc(p.name)) + '</span>' +
            (p.now ? '<span class="entry__venue">Now: ' + esc(p.now) + '</span>' : '') +
            '</li>';
    }

    /* ── Research area card (Home) ──────────────────────── */
    function areaCard(r) {
        return '<a class="card card--link area-card" href="/research.html#' + esc(r.id) + '">' +
            '<h3>' + esc(r.title) + '</h3>' +
            '<p>' + inline(r.summary || '') + '</p></a>';
    }

    /* Jump links (chips) to anchors on the same page */
    function jumpNav(items, label) {
        return '<nav class="jump-nav" aria-label="' + esc(label || 'On this page') + '"><ul>' +
            items.map(function (it) {
                return '<li><a href="#' + esc(it.id) + '"' + (it.key ? ' data-jump="' + esc(it.key) + '"' : '') + '>' + esc(it.label) + '</a></li>';
            }).join('') + '</ul></nav>';
    }

    return {
        esc: esc,
        inline: inline,
        aliasPatterns: aliasPatterns,
        authors: authors,
        badge: badge,
        button: button,
        sectionLabel: sectionLabel,
        note: note,
        pub: pub,
        award: award,
        newsItem: newsItem,
        person: person,
        alumnus: alumnus,
        areaCard: areaCard,
        jumpNav: jumpNav
    };
})();
