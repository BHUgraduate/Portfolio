import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { transliterate, toIast, detectScheme, normalize } from '../assets/js/vaak/index.js';

const deva = (s, o) => transliterate(s, o).text;

test('Latin → Devanāgarī: Sanskrit words', () => {
  const cases = {
    saMskRtam: 'संस्कृतम्', sarasvatii: 'सरस्वती', bhaaratam: 'भारतम्', dharmakshetre: 'धर्मक्षेत्रे',
    namaste: 'नमस्ते', shaanti: 'शान्ति', kRSNa: 'कृष्ण', yogaH: 'योगः', vaaNii: 'वाणी', aatmaa: 'आत्मा',
    gyaana: 'ज्ञान', guruH: 'गुरुः', ganesha: 'गनेश', vaak: 'वाक्', RgvedaH: 'ऋग्वेदः', raamaayaNa: 'रामायण',
  };
  for (const [src, want] of Object.entries(cases)) assert.equal(deva(src), want, src);
});

test('Latin: sh / S / z follow the common conventions', () => {
  assert.equal(deva('shiva'), 'शिव');   // sh = श
  assert.equal(deva('Siva'), 'षिव');    // S  = ष (Harvard-Kyoto)
  assert.equal(deva('zakti'), 'शक्ति'); // z  = श (Harvard-Kyoto)
});

test('IAST → Devanāgarī', () => {
  const cases = {
    'saṃskṛtam': 'संस्कृतम्', 'bhāratam': 'भारतम्', 'dharmakṣetre': 'धर्मक्षेत्रे', 'sarasvatī': 'सरस्वती',
    'śāntiḥ': 'शान्तिः', 'ṛgveda': 'ऋग्वेद', 'gaṇeśa': 'गणेश', 'kṛṣṇa': 'कृष्ण', 'pāṇini': 'पाणिनि',
    'jñāna': 'ज्ञान', 'vāk': 'वाक्', 'ṅ ñ ṭ ḍ ṇ': 'ङ् ञ् ट् ड् ण्', 'ṝ': 'ॠ',
  };
  for (const [src, want] of Object.entries(cases)) assert.equal(deva(src), want, src);
});

test('IAST: capitals, decomposed Unicode and dot-above anusvāra are normalised', () => {
  assert.equal(deva('Śāntiḥ'), 'शान्तिः');
  assert.equal(deva('saṃskṛtam'), 'संस्कृतम्');          // precomposed
  assert.equal(deva('saṁskṛ́tam'.normalize('NFC')), deva('saṁskṛ́tam'.normalize('NFC'))); // does not throw
  assert.equal(deva('saṁskṛtam'), 'संस्कृतम्');                    // ṁ → ṃ
  assert.equal(normalize('ā'), 'ā');
});

test('scheme detection', () => {
  assert.equal(detectScheme('saMskRtam'), 'latin');
  assert.equal(detectScheme('saṃskṛtam'), 'iast');
  assert.equal(transliterate('namaste').scheme, 'latin');
  assert.equal(transliterate('namaste', { scheme: 'iast' }).text, 'नमस्ते'); // explicit scheme wins
});

test('Devanāgarī → IAST', () => {
  const cases = { 'संस्कृतम्': 'saṃskṛtam', 'भारतम्': 'bhāratam', 'सरस्वती': 'sarasvatī', 'शान्तिः': 'śāntiḥ', 'ज्ञान': 'jñāna', 'ऋग्वेद': 'ṛgveda' };
  for (const [src, want] of Object.entries(cases)) assert.equal(toIast(src), want, src);
});

test('round trip: IAST → Devanāgarī → IAST is lossless for these words', () => {
  for (const w of ['saṃskṛtam', 'bhāratam', 'dharmakṣetre', 'sarasvatī', 'yogaḥ', 'śāntiḥ', 'ṛgveda', 'gaṇeśa', 'kṛṣṇa', 'pāṇini', 'jñāna', 'vāk', 'rāmāyaṇa', 'upaniṣad']) {
    assert.equal(toIast(deva(w)), w, w);
  }
});

test('Latin (VaakBoard input) and IAST agree on the same word', () => {
  const pairs = [['saMskRtam', 'saṃskṛtam'], ['bhaaratam', 'bhāratam'], ['sarasvatii', 'sarasvatī'], ['dharmakshetre', 'dharmakṣetre'], ['kRSNa', 'kṛṣṇa']];
  for (const [latin, iast] of pairs) assert.equal(deva(latin), deva(iast), latin);
});

test('pass-through: punctuation, numbers, spacing, emoji and Devanāgarī', () => {
  assert.equal(deva(''), '');
  assert.equal(deva('   '), '   ');
  assert.equal(deva('2026'), '2026');
  assert.equal(deva('namaste, bhaaratam!'), 'नमस्ते, भारतम्!');
  assert.equal(deva('a  b'), 'अ  ब्');                          // spacing preserved exactly
  assert.equal(deva('नमस्ते'), 'नमस्ते');                       // already Devanāgarī
  assert.equal(deva('namaste 🙏'), 'नमस्ते 🙏');
  assert.equal(deva('॥'), '॥');
});

test('pass-through: URLs, e-mail addresses, mentions and hashtags are never transliterated', () => {
  for (const s of ['bhugraduate@gmail.com', 'https://portfolio.hycyon.com/', 'www.hycyon.com', '@hycyon', '#sanskrit', 'hycyon.com']) {
    assert.equal(deva(s), s, s);
  }
  assert.equal(deva('namaste bhugraduate@gmail.com namaste'), 'नमस्ते bhugraduate@gmail.com नमस्ते');
});

test('danda and double danda', () => {
  assert.equal(deva('namaste|'), 'नमस्ते।');
  assert.equal(deva('namaste||'), 'नमस्ते॥');
});

test('token trace explains every output character', () => {
  const r = transliterate('saMskRtam');
  assert.deepEqual(r.tokens.map((t) => t.src), ['s', 'a', 'M', 's', 'k', 'R', 't', 'a', 'm']);
  assert.equal(r.tokens[1].inherent, true);
  assert.equal(r.text, 'संस्कृतम्');
});

test('repeated and long input does not hang or throw', () => {
  assert.equal(deva('ka'.repeat(500)), 'क'.repeat(500));
  assert.ok(deva('dharmakshetrekurukshetre '.repeat(200)).length > 1000);
});

/* ── Known limitations — asserted so they stay visible, not hidden ── */

test('KNOWN LIMITATION: English words typed in Latin mode are transliterated (no language detection yet)', () => {
  assert.notEqual(deva('Hello'), 'Hello');
});

test('KNOWN LIMITATION: independent vowel after vowel is not a diphthong (hiatus is kept)', () => {
  assert.equal(deva('boa'), 'बोअ');
});

/* ── The examples displayed on the portfolio page must match the engine ── */

test('portfolio page: every displayed demo pair is what the engine really outputs', () => {
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  const pairs = [...html.matchAll(/data-vaak-sample="([^"]+)"[^>]*data-expect="([^"]+)"/g)];
  assert.ok(pairs.length >= 4, 'expected at least 4 demo samples');
  for (const [, src, want] of pairs) assert.equal(deva(src), want, src);
});
