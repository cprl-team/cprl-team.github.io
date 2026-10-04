# CPR — Causal Perception and Reasoning Research Group

Static website for the [Causal Perception and Reasoning (CPR)](https://cpr.ai.vn/) research group, Ho Chi Minh City, Vietnam. Plain HTML, CSS, and JavaScript with no build step, served by GitHub Pages from the `main` branch.

## Run locally

Pages load their content from `content/*.md` with `fetch`, so open the site through a local server, not straight from disk:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Updating content

Most edits only touch a markdown file in `content/`. The pages read these files at runtime, so the HTML does not need to change.

| To update...                          | Edit                        | Shown on                         |
| ------------------------------------- | --------------------------- | -------------------------------- |
| Papers, ongoing work, patents         | `content/publications.md`   | Publications, Home → News, profiles |
| Non-paper news (awards, talks, grants)| `content/home.md` → *Recent News* | Home → News                |
| Research projects                     | `content/projects.md`       | Projects                         |
| People                                | `content/members.md`        | Members                          |
| Challenge wins and competitions       | `content/achievements.md`   | Achievements                     |

Home → News merges the curated items in `home.md` with the newest accepted papers from `publications.md` (five items in total), so a new paper appears there with no extra edit.

The home page intro and its research-area cards are written directly in `index.html`.

`content/capstones.md` holds detailed student project briefs. No page renders it at the moment.

### Entry format

Every content file uses the same shape: `##` starts a section, `###` starts an entry, and `key: value` lines below it set fields. A publication looks like this:

```markdown
### 2026 | Paper Title
authors: **Member Name**, External Author
venue: Full venue name
venue_short: ABBR 2026
link: https://doi.org/...
```

Wrap lab members in `**bold**` in author lists. Use `Ongoing` in place of the year for work in preparation.

### Pages for people and papers

- **Member profiles** live in `members/` (see `members/vthuynh.html`). Link one from `content/members.md` with `link: members/<name>.html`.
- **Paper pages** start from `templates/paper-page.template.html`; `templates/README.md` has the steps. Link one from its publication with `project: <page>.html`.

## Project structure

```
├── index.html            Home: intro, news, research areas, join us
├── publications.html     Publications with type/year filters
├── projects.html         Research projects by area
├── members.html          People
├── achievements.html     Challenge wins and competitions
├── pain-presence.html    Paper page (AI4Pain @ ACIIW 2026)
├── members/              Individual profile pages
├── 404.html
├── content/              Editable markdown content
├── css/
│   ├── variables.css     Design tokens: colours, type, spacing, light/dark
│   ├── base.css          Reset and typography
│   ├── layout.css        Header, container, footer
│   ├── components.css    Cards, lists, badges, page sections
│   └── pages.css         (empty; styles live in the files above)
├── js/
│   ├── site-config.js    Logo, favicon, and header title for every page
│   ├── content-loader.js Markdown parsers
│   ├── content-renderer.js  Builds each page from the parsed content
│   ├── theme.js          Light/dark toggle (saved in localStorage)
│   ├── navigation.js     Active link and mobile menu
│   ├── lightbox.js       Tap-to-enlarge figures on paper pages
│   └── main.js           Fade-in animations and back-to-top
├── templates/            Paper page template
└── tools/                Local helper scripts
```

## Search engines

The site is kept out of search engines on purpose: `robots.txt` disallows all crawling and every page carries `<meta name="robots" content="noindex, nofollow">`. Remove both to make it indexable.

## Deploy

Push to `main`. GitHub Pages serves the repository root, and `CNAME` maps it to `cpr.ai.vn`. `.nojekyll` turns off Jekyll processing.

## License

© 2026 CPR — Causal Perception and Reasoning Research Group. All rights reserved.
