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
                current = { title: line.replace('### ', '').trim(), icon: '', description: '' };
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
        parseHome: parseHome
    };
})();
