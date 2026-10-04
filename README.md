# CPR — Causal Perception and Reasoning Research Group

Static website for the [Causal Perception and Reasoning (CPR)](https://cpr.ai.vn/) research group, Ho Chi Minh City, Vietnam. Plain HTML, CSS, and JavaScript with no build step, served by GitHub Pages from the `main` branch.

## Run locally

Pages load their content from `content/*.md` with `fetch` and use root-relative paths, so open the site through a local server at the site root, not straight from disk:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Updating content

Most edits only touch a markdown file in `content/`. Pages read these files in the browser, so the HTML does not change.

| To update...                               | Edit                      | Shown on                                   |
| ------------------------------------------ | ------------------------- | ------------------------------------------ |
| Papers, ongoing work, patents              | `content/publications.md` | Publications, Home (News, Selected), Research, profiles |
| Challenge results                          | `content/awards.md`       | Publications → Awards, Home (wins), profiles |
| Other news (grants, talks, new members)    | `content/news.md`         | Home → News                                |
| Research areas                             | `content/research.md`     | Research, Home (area cards)                |
| People                                     | `content/people.md`       | People, author highlighting, profiles      |
| Openings, how to apply, FAQ                | `content/join.md`         | Join Us                                    |

Each fact lives in one file and appears wherever it is needed:

- **Home → News** merges `news.md`, every 1st-place result in `awards.md`, and the newest accepted papers, then shows the 6 newest. A new paper or win appears there with no extra edit.
- **Selected publications** on Home lists papers marked `selected: yes`. The section stays hidden until at least one paper is marked.
- **Research** lists, under each area, the papers tagged `area: <area-anchor>`.
- **Author highlighting and profiles** use the `aliases:` in `people.md`, so every spelling of a member's name (e.g. "Van Thong Huynh", "Van-Thong Huynh", "Huynh, V. T.") is recognised.

Each file starts with a comment listing its fields.

### Entry format

All content files share one shape: `##` starts a group, `###` starts an entry (`|` splits its heading), `key: value` lines set fields, and any other line is the entry's text. A publication:

```markdown
### 2026 | Paper Title
authors: **Member Name**, External Author
venue: Full venue name
venue_short: ABBR 2026
link: https://doi.org/...
code: https://github.com/...
selected: yes
```

Use `Ongoing` instead of the year for work in preparation.

### New pages

Start from `templates/`: a generic page, a member profile, or a paper page. `templates/README.md` lists the shared building blocks and the steps.

## Project structure

```
├── index.html            Home: intro, news, research areas, selected papers, join
├── research.html         Research areas with people and papers
├── people.html           PI, members, collaborators, alumni
├── publications.html     Papers + awards, with type/year filters
├── join.html             Who we look for, how to apply, FAQ
├── pain-presence.html    Paper page (AI4Pain @ ACIIW 2026)
├── members/              Member profile pages
├── projects.html, members.html, achievements.html
│                         Redirects from the old URLs
├── 404.html
├── content/              Editable markdown content (see above)
├── css/
│   ├── variables.css     Design tokens: colours, type, spacing, light/dark
│   ├── base.css          Reset and typography
│   ├── layout.css        Header, container, footer
│   └── components.css    Shared building blocks + page-specific blocks
├── js/
│   ├── site.js           Menu, contact email, logo; writes header + footer; theme, mobile menu
│   ├── content.js        Loads and parses content/*.md (one parser for all files)
│   ├── ui.js             Shared blocks: paper, person, award, news item, area card
│   ├── pages.js          Builds each page from content.js + ui.js
│   └── lightbox.js       Tap-to-enlarge figures on paper pages
└── templates/            Starting points for new pages
```

## Search engines

The site is kept out of search engines on purpose: `robots.txt` disallows all crawling and every page carries `<meta name="robots" content="noindex, nofollow">`. Remove both to make it indexable.

## Deploy

Push to `main`. GitHub Pages serves the repository root, and `CNAME` maps it to `cpr.ai.vn`. `.nojekyll` turns off Jekyll processing.

## License

© 2026 CPR — Causal Perception and Reasoning Research Group. All rights reserved.
