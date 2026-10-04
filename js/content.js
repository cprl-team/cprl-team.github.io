/* ==========================================================
   Content — load and parse the markdown files in /content
   ----------------------------------------------------------
   Every content file has the same shape:

     ## Section                      -> a group
     ### Head | More head            -> an entry ("|" splits the heading)
     key: value                      -> a field on the entry
     any other line                  -> the entry's free text

   <!-- comments --> are ignored. Each loader below turns that
   generic shape into the records one page type needs, and caches
   it, so pages that share a file (e.g. Home and Publications both
   read publications.md) fetch it once.
   ========================================================== */

var Content = (function () {
    'use strict';

    var cache = {};

    function fetchText(name) {
        if (!cache[name]) {
            cache[name] = fetch('/content/' + name + '.md')
                .then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); })
                .catch(function (err) { console.error('Content: failed to load ' + name, err); return null; });
        }
        return cache[name];
    }

    /* Generic parser: [{ name, entries: [{ head: [...], fields: {}, text }] }] */
    function parse(text) {
        var sections = [];
        var section = null;
        var entry = null;
        text.replace(/<!--[\s\S]*?-->/g, '').split('\n').forEach(function (raw) {
            var line = raw.trim();
            if (!line || line === '---' || /^# /.test(line)) return;
            if (/^## /.test(line)) {
                section = { name: line.slice(3).trim(), entries: [] };
                sections.push(section);
                entry = null;
                return;
            }
            if (/^### /.test(line)) {
                if (!section) { section = { name: '', entries: [] }; sections.push(section); }
                entry = {
                    head: line.slice(4).split(' | ').map(function (s) { return s.trim(); }),
                    fields: {},
                    text: ''
                };
                section.entries.push(entry);
                return;
            }
            if (!entry) return;
            var m = /^([a-z_]+):\s+(.*)$/.exec(line);
            if (m) entry.fields[m[1]] = m[2].trim();
            else entry.text += (entry.text ? ' ' : '') + line;
        });
        return sections;
    }

    function loadParsed(name) {
        return fetchText(name).then(function (t) { return t == null ? null : parse(t); });
    }

    function assign(target, fields) {
        for (var k in fields) if (!(k in target)) target[k] = fields[k];
        return target;
    }

    /* "causal-ai-in-healthcare" from "Causal AI in Healthcare" */
    function slug(s) {
        return (s || '').toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    }

    var MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

    /* Sortable key for "2026" or "Sep 2026"; year-only sorts before a dated month */
    function dateKey(s) {
        var y = parseInt((/\d{4}/.exec(s || '') || [])[0], 10);
        if (isNaN(y)) return Infinity; /* "Ongoing" */
        var m = MONTHS.indexOf((s || '').trim().slice(0, 3).toLowerCase());
        return y * 13 + (m + 1);
    }

    function typeOf(sectionName) {
        var n = sectionName.toLowerCase();
        if (n.indexOf('patent') !== -1) return 'patent';
        if (n.indexOf('journal') !== -1) return 'journal';
        if (n.indexOf('conference') !== -1) return 'conference';
        if (n.indexOf('ongoing') !== -1) return 'ongoing';
        return 'other';
    }

    function publications() {
        return loadParsed('publications').then(function (sections) {
            if (!sections) return null;
            var out = [];
            sections.forEach(function (s) {
                var type = typeOf(s.name);
                s.entries.forEach(function (e) {
                    out.push(assign({
                        type: type,
                        year: e.head[0],
                        title: e.head.slice(1).join(' | '),
                        ongoing: isNaN(parseInt(e.head[0], 10))
                    }, e.fields));
                });
            });
            return out;
        });
    }

    function people() {
        return loadParsed('people').then(function (sections) {
            if (!sections) return null;
            var out = [];
            sections.forEach(function (s) {
                s.entries.forEach(function (e) {
                    var p = assign({ group: s.name, name: e.head[0] }, e.fields);
                    p.aliases = (p.aliases || '').split(';').map(function (a) { return a.trim(); }).filter(Boolean);
                    out.push(p);
                });
            });
            return out;
        });
    }

    function awards() {
        return loadParsed('awards').then(function (sections) {
            if (!sections) return null;
            var out = [];
            sections.forEach(function (s) {
                s.entries.forEach(function (e) {
                    var a = assign({ date: e.head[0], title: e.head.slice(1).join(' | ') }, e.fields);
                    a.year = (/\d{4}/.exec(a.date) || [''])[0];
                    a.winner = /^1st\b|^winner/i.test(a.place || '');
                    out.push(a);
                });
            });
            return out;
        });
    }

    function research() {
        return loadParsed('research').then(function (sections) {
            if (!sections) return null;
            var out = [];
            sections.forEach(function (s) {
                s.entries.forEach(function (e) {
                    out.push(assign({ title: e.head[0], id: slug(e.head[0]), description: e.text }, e.fields));
                });
            });
            return out;
        });
    }

    function news() {
        return loadParsed('news').then(function (sections) {
            if (!sections) return null;
            var out = [];
            sections.forEach(function (s) {
                s.entries.forEach(function (e) {
                    out.push(assign({ date: e.head[0], title: e.head.slice(1).join(' | '), description: e.text }, e.fields));
                });
            });
            return out;
        });
    }

    return {
        parse: parse,
        load: loadParsed,
        publications: publications,
        people: people,
        awards: awards,
        research: research,
        news: news,
        slug: slug,
        dateKey: dateKey
    };
})();
