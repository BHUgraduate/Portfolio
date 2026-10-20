/* Layers 3–4 — tokenise (greedy longest match) and compose (virama / matra rules).
   Pure functions. No DOM, no network, no state: the same code runs in the browser and under `node --test`. */

import { normalize, looksLikeIast, isLiteralWord } from './normalize.js';
import { SCHEMES, MATRA, VIRAMA, TO_IAST } from './schemes.js';

const MAX_TOKEN = 3;

function lookup(scheme, chunk) {
  if (scheme.clusters[chunk]) return { kind: 'C', base: scheme.clusters[chunk] };
  if (scheme.consonants[chunk]) return { kind: 'C', base: scheme.consonants[chunk] };
  if (scheme.vowels[chunk]) return { kind: 'V', base: scheme.vowels[chunk] };
  if (scheme.marks[chunk]) return { kind: 'M', base: scheme.marks[chunk] };
  return null;
}

function convertWord(word, scheme) {
  let out = '';
  let afterConsonant = false;   // last emitted unit ends in a virama that a vowel may replace
  const tokens = [];

  for (let i = 0; i < word.length;) {
    let hit = null, len = 0;
    for (let n = Math.min(MAX_TOKEN, word.length - i); n > 0; n--) {
      const chunk = word.substr(i, n);
      hit = lookup(scheme, chunk);
      if (hit) { len = n; break; }
    }
    if (!hit) {                                   // not ours: pass through untouched
      out += word[i]; tokens.push({ src: word[i], kind: 'X', piece: word[i] });
      afterConsonant = false; i++; continue;
    }
    const src = word.substr(i, len);
    if (hit.kind === 'C') {
      out += hit.base + VIRAMA; afterConsonant = true;
      tokens.push({ src, kind: 'C', piece: hit.base + VIRAMA });
    } else if (hit.kind === 'V') {
      if (afterConsonant) {                       // vowel after consonant: replace virama with the matra
        const matra = hit.base === 'अ' ? '' : MATRA[hit.base];
        out = out.slice(0, -1) + matra;
        tokens.push({ src, kind: 'V', piece: matra, inherent: hit.base === 'अ' });
      } else {                                    // standalone vowel
        out += hit.base; tokens.push({ src, kind: 'V', piece: hit.base });
      }
      afterConsonant = false;
    } else {
      out += hit.base; tokens.push({ src, kind: 'M', piece: hit.base });
      /* anusvāra / visarga keep the preceding consonant bare, as in संस्कृतम् */
      afterConsonant = false;
    }
    i += len;
  }
  return { text: out, tokens };
}

export function detectScheme(text) {
  return looksLikeIast(text) ? 'iast' : 'latin';
}

/**
 * Latin or IAST → Devanāgarī.
 * @param {string} input
 * @param {{scheme?: 'auto'|'latin'|'iast'}} [opts]
 * @returns {{text: string, scheme: string, normalized: string, tokens: object[]}}
 */
export function transliterate(input, { scheme = 'auto' } = {}) {
  const normalized = normalize(input);
  const name = scheme === 'auto' ? detectScheme(normalized) : scheme;
  const table = SCHEMES[name];
  let text = '';
  const tokens = [];
  /* Split on anything that is not a word so spaces, punctuation, digits and literals survive exactly. */
  for (const part of normalized.split(/(\s+)/)) {
    if (!part || /^\s+$/.test(part) || isLiteralWord(part)) { text += part; if (part) tokens.push({ src: part, kind: 'X', piece: part }); continue; }
    const word = table.lowercase ? part.toLowerCase() : part;
    const r = convertWord(word, table);
    text += r.text; tokens.push(...r.tokens);
  }
  return { text, scheme: name, normalized, tokens };
}

/** Devanāgarī → IAST. Text that is not Devanāgarī passes through. */
export function toIast(devanagari) {
  const { consonants, vowels, matras, marks } = TO_IAST;
  const s = String(devanagari ?? '').normalize('NFC');
  let out = '';
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (consonants[c]) {
      const next = s[i + 1];
      if (next === VIRAMA) { out += consonants[c]; i++; }
      else if (matras[next]) { out += consonants[c] + matras[next]; i++; }
      else out += consonants[c] + 'a';
    } else if (vowels[c]) out += vowels[c];
    else if (marks[c]) out += marks[c];
    else out += c;
  }
  return out;
}
