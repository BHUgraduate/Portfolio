# Portfolio — Abhishek Sharma

Static site served by GitHub Pages at https://portfolio.hycyon.com.

- `index.html` — the page (content lives here)
- `assets/js/` — small ES modules (nav, story, project previews, contact)
- `assets/js/vaak/` — VaakBoard's language engine (pure functions, tested)
- `tests/` and `docs/VAAKBOARD.md` — engine tests and product notes
- `src/case-studies.mjs` → `scripts/build-case-studies.mjs` → `case-studies/<slug>/index.html` (committed; styles in `assets/css/case.css`)
- `assets/css/fonts.css` + `assets/fonts/` — self-hosted fonts (Outfit, Plus Jakarta Sans, JetBrains Mono, Noto Sans Devanagari; SIL OFL, licences alongside). No request leaves the site. `latin-ext` covers IAST, `devanagari` covers Sanskrit and Hindi; `unicode-range` means a file is fetched only when needed. To add a weight, copy it from the matching `@fontsource/*` package and add its `@font-face`.
- `src/styles.css` + `tailwind.config.js` → compiled to `assets/css/site.css`

After changing markup or styles, rebuild the CSS and commit the result:

```
npm install
npm run build
```

Case studies: edit `src/case-studies.mjs`, then `npm run cases`. To add one, append an object (and link it from `index.html` and `sitemap.xml`; the tests fail if you forget). Only state what the project's own repository supports, and say what is not known: no invented metrics, clients or testimonials.

`npm test` regenerates the case studies and runs the engine and case-study tests.
