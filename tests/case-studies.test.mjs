import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { caseStudies } from '../src/case-studies.mjs';

const path = (...p) => fileURLToPath(new URL(['..', ...p].join('/'), import.meta.url));
const banned = [/trusted by/i, /award[- ]winning/i, /\b\d[\d,]*\+? (downloads|users|clients|customers)\b/i, /world-class|cutting-edge|revolutionary|next-generation|industry-leading|best-in-class/i];

test('every case study renders a page with canonical, description and JSON-LD', () => {
  for (const c of caseStudies) {
    const f = path('case-studies', c.slug, 'index.html');
    assert.ok(existsSync(f), `${c.slug} page missing: run npm run cases`);
    const html = readFileSync(f, 'utf8');
    assert.match(html, new RegExp(`rel="canonical" href="https://portfolio.hycyon.com/case-studies/${c.slug}/"`));
    assert.match(html, /name="description"/);
    assert.match(html, /application\/ld\+json/);
    assert.equal((html.match(/<h1[ >]/g) || []).length, 1, 'exactly one h1');
  }
});

test('case studies stay truthful: no invented metrics, clients or hype', () => {
  for (const c of caseStudies) {
    const text = JSON.stringify(c);
    for (const re of banned) assert.doesNotMatch(text, re, `${c.slug}: ${re}`);
  }
});

test('each study declares its status and links only to existing studies', () => {
  const slugs = new Set(caseStudies.map((c) => c.slug));
  for (const c of caseStudies) {
    assert.ok(c.status?.label && c.status?.key);
    for (const n of c.next) assert.ok(slugs.has(n), `${c.slug} -> unknown ${n}`);
    for (const s of c.sections) assert.ok(s.id && s.title);
  }
});

test('the portfolio and sitemap link every case study', () => {
  const index = readFileSync(path('index.html'), 'utf8');
  const sitemap = readFileSync(path('sitemap.xml'), 'utf8');
  for (const c of caseStudies) {
    assert.ok(index.includes(`case-studies/${c.slug}/`), `${c.slug} not linked from index.html`);
    assert.ok(sitemap.includes(`/case-studies/${c.slug}/`), `${c.slug} not in sitemap`);
  }
});
