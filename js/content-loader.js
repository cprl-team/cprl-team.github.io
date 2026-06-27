/* ==========================================================
   Content Loader — Parse Markdown Files at Runtime
   ========================================================== */

(function () {
    'use strict';

    /**
     * Fetch and parse a simple markdown content file.
     * Returns an object with sections and entries.
     */
    async function loadContent(path) {
        try {
            const response = await fetch(path);
            if (!response.ok) throw new Error('Failed to load ' + path);
            const text = await response.text();
            return text;
        } catch (err) {
            console.error('Content loader error:', err);
            return null;
        }
    }

    /**
     * Parse publications markdown into structured data.
     * Format: ### YEAR | Title\n authors: ...\n venue: ...\n venue_short: ...\n link: ...
     */
    function parsePublications(text) {
        var sections = {};
        var currentSection = '';
        var entries = [];
        var current = null;

        var lines = text.split('\n');
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i].trim();

            // Section header: ## Journal Papers / ## Conference Papers / ## Patents
            if (line.startsWith('## ')) {
                if (current) entries.push(current);
                if (currentSection && entries.length) {
                    sections[currentSection] = entries;
                    entries = [];
                }
                currentSection = line.replace('## ', '').trim();
                current = null;
                continue;
            }

            // Entry header: ### YEAR | Title
            if (line.startsWith('### ')) {
                if (current) entries.push(current);
                var headerParts = line.replace('### ', '').split(' | ');
                current = {
                    year: headerParts[0].trim(),
                    title: headerParts.slice(1).join(' | ').trim(),
                    authors: '',
                    venue: '',
                    venue_short: '',
                    link: '',
                    project: '',
                    note: ''
                };
                continue;
            }

            // Key-value metadata
            if (current && line.includes(': ')) {
                var colonIdx = line.indexOf(': ');
                var key = line.substring(0, colonIdx).trim();
                var value = line.substring(colonIdx + 2).trim();
                if (key in current) {
                    current[key] = value;
                }
                continue;
            }

            // Separator
            if (line === '---') {
                if (current) entries.push(current);
                if (currentSection && entries.length) {
                    sections[currentSection] = entries;
                    entries = [];
                }
                current = null;
                continue;
            }
        }

        // Flush last
        if (current) entries.push(current);
        if (currentSection && entries.length) {
            sections[currentSection] = entries;
        }

        return sections;
    }

    /**
     * Parse members markdown into structured data.
     */
    function parseMembers(text) {
        var sections = {};
        var currentSection = '';
        var entries = [];
        var current = null;

        var lines = text.split('\n');
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i].trim();

            if (line.startsWith('## ')) {
                if (current) entries.push(current);
                if (currentSection && entries.length) {
                    sections[currentSection] = entries;
                    entries = [];
                }
                currentSection = line.replace('## ', '').trim();
                current = null;
                continue;
            }

            if (line.startsWith('### ')) {
                if (current) entries.push(current);
                current = {
                    name: line.replace('### ', '').trim(),
                    role: '',
                    initials: '',
                    link: ''
                };
                continue;
            }

            if (current && line.includes(': ')) {
                var colonIdx = line.indexOf(': ');
                var key = line.substring(0, colonIdx).trim();
                var value = line.substring(colonIdx + 2).trim();
                if (key in current) {
                    current[key] = value;
                }
                continue;
            }

            if (line === '---') {
                if (current) entries.push(current);
                if (currentSection && entries.length) {
                    sections[currentSection] = entries;
                    entries = [];
                }
                current = null;
                continue;
            }
        }

        if (current) entries.push(current);
        if (currentSection && entries.length) {
            sections[currentSection] = entries;
        }

        return sections;
    }

    /**
     * Parse achievements markdown into structured data.
     */
    function parseAchievements(text) {
        var sections = {};
        var currentSection = '';
        var entries = [];
        var current = null;

        var lines = text.split('\n');
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i].trim();

            if (line.startsWith('## ')) {
                if (current) entries.push(current);
                if (currentSection && entries.length) {
                    sections[currentSection] = entries;
                    entries = [];
                }
                currentSection = line.replace('## ', '').trim();
                current = null;
                continue;
            }

            if (line.startsWith('### ')) {
                if (current) entries.push(current);
                var headerParts = line.replace('### ', '').split(' | ');
                current = {
                    date: headerParts[0].trim(),
                    title: headerParts.slice(1).join(' | ').trim(),
                    event: '',
                    team: '',
                    type: '',
                    link: ''
                };
                continue;
            }

            if (current && line.includes(': ')) {
                var colonIdx = line.indexOf(': ');
                var key = line.substring(0, colonIdx).trim();
                var value = line.substring(colonIdx + 2).trim();
                if (key in current) {
                    current[key] = value;
                }
                continue;
            }

            if (line === '---') {
                if (current) entries.push(current);
                if (currentSection && entries.length) {
                    sections[currentSection] = entries;
                    entries = [];
                }
                current = null;
                continue;
            }
        }

        if (current) entries.push(current);
        if (currentSection && entries.length) {
            sections[currentSection] = entries;
        }

        return sections;
    }

    /**
     * Parse projects markdown — sections of project entries with
     * key:value fields (status/area/team/link/code/demo) + free-form description.
     */
    function parseProjects(text) {
        var sections = {};
        var currentSection = '';
        var entries = [];
        var current = null;
        var KEYS = ['status', 'area', 'team', 'link', 'code', 'demo'];

        function flush() {
            if (current) entries.push(current);
            if (currentSection && entries.length) {
                sections[currentSection] = entries;
                entries = [];
            }
        }

        var lines = text.split('\n');
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i].trim();

            if (line.startsWith('### ')) {
                if (current) entries.push(current);
                current = {
                    title: line.replace('### ', '').trim(),
                    status: '', area: '', description: '',
                    team: '', link: '', code: '', demo: '', topics: [], figures: [], refs: []
                };
                continue;
            }

            if (line.startsWith('## ')) {
                flush();
                currentSection = line.replace('## ', '').trim();
                current = null;
                continue;
            }

            if (line === '---') {
                flush();
                current = null;
                continue;
            }

            if (current) {
                // Repeatable topic lines: "topic: UG | <text>" / "topic: Grad | <text>"
                if (line.indexOf('topic: ') === 0) {
                    var tparts = line.substring(7).trim().split(' | ');
                    var lvl = (tparts.shift() || '').trim();
                    var tid = tparts.length >= 2 ? tparts.pop().trim() : '';
                    current.topics.push({ level: lvl, text: tparts.join(' | ').trim(), id: tid });
                    continue;
                }
                if (line.indexOf('figure: ') === 0) {
                    var fv = line.substring(8).trim();
                    var fbar = fv.indexOf(' | ');
                    current.figures.push({
                        src: fbar >= 0 ? fv.substring(0, fbar).trim() : fv,
                        caption: fbar >= 0 ? fv.substring(fbar + 3).trim() : ''
                    });
                    continue;
                }
                if (line.indexOf('ref: ') === 0) {
                    var rv = line.substring(5).trim();
                    var rbar = rv.indexOf(' | ');
                    current.refs.push({
                        name: rbar >= 0 ? rv.substring(0, rbar).trim() : rv,
                        url: rbar >= 0 ? rv.substring(rbar + 3).trim() : ''
                    });
                    continue;
                }
                var matched = false;
                for (var k = 0; k < KEYS.length; k++) {
                    if (line.indexOf(KEYS[k] + ': ') === 0) {
                        current[KEYS[k]] = line.substring(KEYS[k].length + 2).trim();
                        matched = true;
                        break;
                    }
                }
                if (matched) continue;
                if (line && line.charAt(0) !== '#') {
                    current.description += (current.description ? ' ' : '') + line;
                }
            }
        }

        flush();
        return sections;
    }

    /**
     * Parse capstones markdown — full per-topic detail entries grouped by
     * section. Each entry has an id/slug, title, single-line fields, and a
     * repeatable reading list ("read: kind | text | url").
     */
    function parseCapstones(text) {
        var sections = {};
        var currentSection = '';
        var entries = [];
        var current = null;
        var FIELDS = ['level', 'duration', 'goal', 'context', 'questions', 'data', 'method', 'milestones'];

        function flush() {
            if (current) entries.push(current);
            if (currentSection && entries.length) { sections[currentSection] = entries; entries = []; }
        }

        var lines = text.split('\n');
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i].trim();

            if (line.indexOf('### ') === 0) {
                if (current) entries.push(current);
                var hdr = line.replace('### ', '').trim();
                var hb = hdr.indexOf(' | ');
                var id = hb >= 0 ? hdr.substring(0, hb).trim() : hdr;
                current = {
                    id: id, slug: id.toLowerCase().replace(/\s+/g, '-'),
                    title: hb >= 0 ? hdr.substring(hb + 3).trim() : hdr,
                    level: '', duration: '', goal: '', context: '', questions: '',
                    data: '', method: '', milestones: '', reading: []
                };
                continue;
            }
            if (line.indexOf('## ') === 0) { flush(); currentSection = line.replace('## ', '').trim(); current = null; continue; }
            if (line === '---') { flush(); current = null; continue; }
            if (!current) continue;

            if (line.indexOf('read: ') === 0) {
                var parts = line.substring(6).split(' | ');
                current.reading.push({
                    kind: (parts[0] || '').trim(),
                    text: (parts[1] || '').trim(),
                    url: (parts[2] || '').trim()
                });
                continue;
            }
            for (var k = 0; k < FIELDS.length; k++) {
                if (line.indexOf(FIELDS[k] + ': ') === 0) {
                    current[FIELDS[k]] = line.substring(FIELDS[k].length + 2).trim();
                    break;
                }
            }
        }
        flush();
        return sections;
    }

    /**
     * Parse home markdown — returns key-value pairs and research areas.
     */
    function parseHome(text) {
        var result = { meta: {}, researchAreas: [], news: [] };
        var currentSection = '';
        var current = null;

        var lines = text.split('\n');
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i].trim();

            if (line === '---') {
                if (current) {
                    if (currentSection === 'Research Areas') result.researchAreas.push(current);
                    if (currentSection === 'Recent News') result.news.push(current);
                }
                currentSection = '';
                current = null;
                continue;
            }

            if (line.startsWith('## ')) {
                if (current) {
                    if (currentSection === 'Research Areas') result.researchAreas.push(current);
                    if (currentSection === 'Recent News') result.news.push(current);
                }
                currentSection = line.replace('## ', '').trim();
                current = null;
                continue;
            }

            if (line.startsWith('### ') && currentSection === 'Research Areas') {
                if (current) result.researchAreas.push(current);
                current = { title: line.replace('### ', '').trim(), icon: '', image: '', description: '' };
                continue;
            }

            if (line.startsWith('### ') && currentSection === 'Recent News') {
                if (current) result.news.push(current);
                var parts = line.replace('### ', '').split(' | ');
                current = { year: parts[0].trim(), title: parts.slice(1).join(' | ').trim(), description: '' };
                continue;
            }

            if (currentSection === '' && line.includes(': ')) {
                var colonIdx = line.indexOf(': ');
                var key = line.substring(0, colonIdx).trim();
                var value = line.substring(colonIdx + 2).trim();
                result.meta[key] = value;
                continue;
            }

            if (current && line.startsWith('icon: ')) {
                current.icon = line.replace('icon: ', '').trim();
                continue;
            }

            if (current && line.startsWith('image: ')) {
                current.image = line.replace('image: ', '').trim();
                continue;
            }

            // Description text
            if (current && line && !line.startsWith('#')) {
                current.description += (current.description ? ' ' : '') + line;
            }
        }

        if (current) {
            if (currentSection === 'Research Areas') result.researchAreas.push(current);
            if (currentSection === 'Recent News') result.news.push(current);
        }

        return result;
    }

    // Expose globally
    window.ContentLoader = {
        load: loadContent,
        parsePublications: parsePublications,
        parseMembers: parseMembers,
        parseAchievements: parseAchievements,
        parseProjects: parseProjects,
        parseCapstones: parseCapstones,
        parseHome: parseHome
    };
})();
