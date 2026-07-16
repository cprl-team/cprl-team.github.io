# Paper / project page template

`paper-page.template.html` is a starting point for a per-paper landing page,
matching the style of `pain-presence.html`. It reuses the site's CSS tokens,
so a new page inherits light/dark theming, the emerald brand, the header and
footer, fonts, and the tap-to-enlarge diagram system with no build step.

## Steps

1. **Copy it to the repo root** with a short slug as the filename:
   ```
   cp templates/paper-page.template.html my-paper.html
   ```

2. **Fill in the tokens.** Find/replace every `{{TOKEN}}`:

   | Token | What goes here |
   |-------|----------------|
   | `{{PAGE_SLUG}}` | the filename without `.html` (e.g. `my-paper`) — used in canonical/OG URLs |
   | `{{PAPER_TITLE}}` | the paper title (short form for the `<h1>`) |
   | `{{PAPER_SUBTITLE}}` | the rest of the title, or a one-line summary |
   | `{{VENUE_KICKER}}` | the small label above the title, e.g. `Paper · ACIIW 2026 · AI4Pain` |
   | `{{AUTHOR_NAME_N}}` | each author; add/remove `<sup>N</sup>` markers as needed |
   | `{{AFFILIATION_N}}` | one line per distinct affiliation, numbered to match the sups |
   | `{{VENUE_FULL}}` | full conference/journal name, year, and track |
   | `{{PRIMARY_ACTION_URL}}` / `{{PRIMARY_ACTION_LABEL}}` | the main button (dataset, code, or an authorised paper link) |
   | `{{ABSTRACT}}` | the abstract as a single paragraph (it renders justified) |
   | `{{META_DESCRIPTION}}` | ~1 sentence for search/social previews |
   | `{{BIBTEX}}` | the BibTeX entry (keep it inside the `<pre>`) |

3. **Delete the `noindex` line.** Remove
   `<meta name="robots" content="noindex">` (and the comment above it) so the
   real page is indexable. It exists only to hide the template file itself.

4. **Figures (optional).** The "Figures" section holds theme-aware inline
   SVG diagrams. Either redraw them for your paper (the section's comment
   lists the `.a-*` classes to use, and there's a starter 3-box pipeline to
   adapt), or delete the whole `<section>` if you don't want figures.
   - Give each SVG's `<marker>`/`<pattern>` ids a unique prefix so multiple
     figures on one page don't collide.
   - Keep prose em-dash-free (commas / "and"); the brand `CPR — X` titles
     keep their em-dash on purpose.

5. **Link it from Publications.** In `content/publications.md`, add this line
   under the paper's entry (same block as `authors:` / `venue:`):
   ```
   project: my-paper.html
   ```
   A "Project" link then renders on that publication automatically.

6. **(Optional) add to nav.** If the page should be reachable outside
   Publications, add a link in the header/footer of the relevant pages.

7. **Verify and ship.** Serve locally over HTTP (`python3 -m http.server`),
   check light/dark and that the figures reveal on scroll, then commit on the
   working branch, open a PR to `main`, and merge to publish.

## Reference

`pain-presence.html` is a complete, live example built from this template.
