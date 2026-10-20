// Renders src/case-studies.mjs to case-studies/<slug>/index.html (committed output).
// Zero dependencies. Run: npm run cases
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { caseStudies } from '../src/case-studies.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const ORIGIN = 'https://portfolio.hycyon.com';
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const bySlug = Object.fromEntries(caseStudies.map((c) => [c.slug, c]));

const paras = (a = []) => a.map((t) => `<p>${esc(t)}</p>`).join('');
const list = (a) => (a ? `<ul>${a.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>` : '');
const subs = (a = []) => a.map((s) => `<div class="cs-sub"><h3>${esc(s.title)}</h3>${paras(s.text)}${list(s.list)}</div>`).join('');

const section = (s, i) => `
<section class="cs-section" id="${s.id}" aria-labelledby="${s.id}-h">
  <p class="cs-no" aria-hidden="true">${String(i + 1).padStart(2, '0')}</p>
  <div class="cs-body"><h2 id="${s.id}-h">${esc(s.title)}</h2>${paras(s.text)}${list(s.list)}${subs(s.subsections)}</div>
</section>`;

const page = (c) => {
  const url = `${ORIGIN}/case-studies/${c.slug}/`;
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: c.title,
    description: c.description,
    url,
    inLanguage: 'en',
    author: { '@type': 'Person', name: 'Abhishek Sharma', url: `${ORIGIN}/` },
    publisher: { '@type': 'Organization', name: 'Hycyon', url: 'https://hycyon.com' },
    image: `${ORIGIN}/assets/img/og-image.jpg`,
  };
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(c.title)} — Abhishek Sharma</title>
  <meta name="description" content="${esc(c.description)}">
  <meta name="author" content="Abhishek Sharma">
  <meta name="theme-color" content="#080C14" media="(prefers-color-scheme: dark)">
  <meta name="theme-color" content="#F8FAFC" media="(prefers-color-scheme: light)">
  <link rel="canonical" href="${url}">
  <link rel="icon" href="../../assets/img/favicon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="../../assets/img/apple-touch-icon.png">
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="Abhishek Sharma">
  <meta property="og:title" content="${esc(c.title)}">
  <meta property="og:description" content="${esc(c.summary)}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${ORIGIN}/assets/img/og-image.jpg">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(c.title)}">
  <meta name="twitter:description" content="${esc(c.summary)}">
  <meta name="twitter:image" content="${ORIGIN}/assets/img/og-image.jpg">
  <script type="application/ld+json">${JSON.stringify(ld)}</script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@600;700;900&family=Plus+Jakarta+Sans:wght@400;500;700&family=JetBrains+Mono:wght@400;700&family=Noto+Sans+Devanagari:wght@500;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../../assets/css/site.css">
  <link rel="stylesheet" href="../../assets/css/case.css">
</head>
<body class="antialiased font-sans">
  <a href="#main" class="skip-link">Skip to content</a>
  <header class="cs-bar">
    <nav class="cs-nav" aria-label="Primary">
      <a class="cs-home" href="../../">Abhishek Sharma</a>
      <a href="../../#work">All work</a>
      <a href="../../#contact" class="cs-cta">Get in touch</a>
    </nav>
  </header>
  <main id="main">
    <article>
      <header class="cs-hero">
        <p class="cs-kicker">${esc(c.kicker)}</p>
        <h1>${esc(c.title)}</h1>
        <p class="cs-lede">${esc(c.summary)}</p>
        <p class="cs-status"><span class="cs-dot ${c.status.key}" aria-hidden="true"></span>${esc(c.status.label)}</p>
        <dl class="cs-facts">${c.facts.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
        <p class="cs-links">${c.links.map(([l, h]) => `<a href="${esc(h)}" rel="noopener">${esc(l)} →</a>`).join('')}</p>
      </header>
      <nav class="cs-toc" aria-label="In this case study"><ol>${c.sections.map((s) => `<li><a href="#${s.id}">${esc(s.title)}</a></li>`).join('')}</ol></nav>
      ${c.sections.map(section).join('')}
    </article>
    <aside class="cs-more" aria-labelledby="more-h">
      <h2 id="more-h">More case studies</h2>
      <ul>${c.next.map((n) => `<li><a href="../${n}/"><strong>${esc(bySlug[n].name)}</strong><span>${esc(bySlug[n].status.label)}</span></a></li>`).join('')}</ul>
      <p class="cs-end">Building something like this? <a href="https://catalogue.hycyon.com/#quote-section">Start a project with Hycyon</a> or <a href="../../#contact">write to me directly</a>.</p>
    </aside>
  </main>
  <footer class="cs-foot"><p>© 2026 Abhishek Sharma · <a href="https://hycyon.com/">Hycyon</a></p></footer>
</body>
</html>
`;
};

for (const c of caseStudies) {
  const dir = join(root, 'case-studies', c.slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), page(c));
}
console.log(`Built ${caseStudies.length} case studies.`);
