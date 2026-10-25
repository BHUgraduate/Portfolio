// Per-page <lastmod> for the sitemap, without needing git history (CI checks out shallow).
// Each page's HTML is hashed and compared with the hash committed in the manifest: an unchanged
// page keeps its date, a changed page gets today's date. Commit the manifest with the build output.
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

// The footer's year changes every January without the page's content changing, so it is ignored.
const fingerprint = (html) => createHash('sha256').update(String(html).replace(/©\s*\d{4}/g, '©')).digest('hex').slice(0, 16);

/**
 * @param {Record<string,string>} pages  canonical URL -> page HTML
 * @param {URL|string} manifestPath      committed JSON file: { url: { hash, date } }
 * @param {string|Record<string,string>} seed  date given to pages seen for the first time (the previous sitemap's date), one for all or per URL
 * @returns {Record<string,string>}      canonical URL -> YYYY-MM-DD
 */
export const lastmods = (pages, manifestPath, seed) => {
  const old = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, 'utf8')) : {};
  const today = new Date().toISOString().slice(0, 10);
  const next = {};
  for (const url of Object.keys(pages).sort()) {
    const hash = fingerprint(pages[url]);
    const prev = old[url];
    next[url] = { hash, date: !prev ? (typeof seed === 'string' ? seed : seed[url] ?? today) : prev.hash === hash ? prev.date : today };
  }
  writeFileSync(manifestPath, JSON.stringify(next, null, 2) + '\n');
  return Object.fromEntries(Object.entries(next).map(([u, v]) => [u, v.date]));
};
