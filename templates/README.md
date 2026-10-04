# Page templates

Every page shares one shell: the same `<head>`, the header/menu and footer written by `js/site.js`, and styles from `css/components.css`. Start new pages from these templates so they stay consistent. Replace every `{{TOKEN}}` after copying.

| Template | Copy to | For |
| --- | --- | --- |
| `page.template.html` | `<slug>.html` | Any new top-level page |
| `profile.template.html` | `members/<id>.html` | A member's profile |
| `paper-page.template.html` | `<slug>.html` | A paper or project page |

## Shared pieces

**Shell (all templates).** Keep the `<head>` as is apart from the title, description and canonical URL. In `<body>`, keep the skip link and `<script src="/js/site.js"></script>` right after it: that script writes the header and footer. `<body data-page="...">` sets the highlighted menu item (`home`, `research`, `people`, `publications`, `join`). All paths start with `/`, so a page works at any folder depth.

**Building blocks (`css/components.css`).**

| Class | Use |
| --- | --- |
| `.page-header` | Page title and one-line intro |
| `.section` + `.section-label` | A titled section |
| `.prose` | Paragraphs of running text |
| `.card-grid` + `.card` | A grid of cards (`.card--link` for a clickable card) |
| `.entry-list` + `.entry` | A divided list (papers, CV lines, alumni) |
| `.dated-entry` | Date column + content (news, awards) |
| `.tag-row`, `.badge`, `.btn-link` | Venue badges and small link buttons |
| `.chips` + `.chip` | Tags such as research interests |
| `.join-cta` | The call-to-action box |

Content-driven lists (papers, people, awards, news) are built by `js/ui.js`, so they look the same on every page. A page asks for them through `js/pages.js` by including a container with a known id (for example `profile-publications`).

## New member profile

1. `cp templates/profile.template.html members/<id>.html` and fill in the tokens.
2. In `content/people.md`, on that person's entry, add `id: <id>`, `link: members/<id>.html`, and every spelling of their name that appears in author lists under `aliases:` (separated by `;`).
3. Their publications and challenge results then appear on the profile automatically, and their name is highlighted across the site.

## New paper page

1. `cp templates/paper-page.template.html <slug>.html` and fill in the tokens.
2. Keep the Figures section and redraw the diagrams with the theme-aware `.a-*` SVG classes, or delete it. Give each SVG's `<marker>`/`<pattern>` ids a unique prefix.
3. In `content/publications.md`, add `project: <slug>.html` to the paper's entry. A "Project page" button appears on it everywhere it is listed.

`pain-presence.html` is a finished example.

## New top-level page

1. `cp templates/page.template.html <slug>.html` and fill in the tokens.
2. To put it in the menu, add it to `SITE.nav` in `js/site.js`.

## Before publishing

Serve the site locally (`python3 -m http.server`), check the page in light and dark mode and at phone width, then commit.
