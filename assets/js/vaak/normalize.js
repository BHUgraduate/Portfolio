/* Layer 1 — input normalisation.
   Makes equivalent spellings identical before any mapping happens. */

const IAST_CHARS = /[āīūṛṝḷḹṃṁḥśṣñṅṭḍṇ]|m̐/i;

export function normalize(input) {
  return String(input ?? '')
    .normalize('NFC')          // a + ◌̄ becomes ā, s + ◌́ becomes ś, ...
    .replace(/ṁ/g, 'ṃ')        // dot-above anusvāra is the same sound as dot-below
    .replace(/Ṁ/g, 'Ṃ')
    .replace(/m̐/g, 'm̐');
}

/** True when the text uses IAST diacritics, which the plain-Latin scheme cannot express. */
export function looksLikeIast(text) {
  return IAST_CHARS.test(text);
}

/** URLs, e-mail addresses, @mentions and #tags must never be transliterated. */
export function isLiteralWord(word) {
  return /^(https?:\/\/|www\.)/i.test(word) || /@/.test(word) || /^#/.test(word) || /\.[a-z]{2,}(\/|$)/i.test(word);
}
