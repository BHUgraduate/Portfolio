# Portfolio — Abhishek Sharma

Static site served by GitHub Pages at https://portfolio.hycyon.com.

- `index.html` — the page (content lives here)
- `assets/js/` — small ES modules (nav, story, project previews, contact)
- `assets/js/vaak/` — VaakBoard's language engine (pure functions, tested)
- `tests/` and `docs/VAAKBOARD.md` — engine tests and product notes
- `src/styles.css` + `tailwind.config.js` → compiled to `assets/css/site.css`

After changing markup or styles, rebuild the CSS and commit the result:

```
npm install
npm run build
```

Run the engine tests with `npm test`.
