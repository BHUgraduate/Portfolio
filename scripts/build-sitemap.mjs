// Regenerates sitemap.xml with a per-page <lastmod>. Run: npm run sitemap (also part of npm test).
// A page keeps its date until its HTML changes; see scripts/lastmod.mjs.
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { lastmods } from './lastmod.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const ORIGIN = 'https://portfolio.hycyon.com';
const read = (f) => readFileSync(join(root, f), 'utf8');

const pages = {
  [`${ORIGIN}/`]: read('index.html'),
  [`${ORIGIN}/sanskrit-keyboard.html`]: read('sanskrit-keyboard.html'),
};
for (const slug of readdirSync(join(root, 'case-studies'))) {
  if (existsSync(join(root, 'case-studies', slug, 'index.html'))) pages[`${ORIGIN}/case-studies/${slug}/`] = read(`case-studies/${slug}/index.html`);
}

// Pages seen for the first time keep the date the previous sitemap gave them.
const previous = Object.fromEntries([...read('sitemap.xml').matchAll(/<loc>([^<]+)<\/loc><lastmod>([^<]+)</g)].map((m) => [m[1], m[2]]));
const dates = lastmods(pages, join(root, 'sitemap-lastmod.json'), previous);
writeFileSync(
  join(root, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${Object.entries(dates).map(([loc, d]) => `  <url><loc>${loc}</loc><lastmod>${d}</lastmod></url>`).join('\n')}\n</urlset>\n`,
);
