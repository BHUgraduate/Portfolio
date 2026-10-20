/* Layer 2 — scheme tables. Data only; no logic.
   Both schemes map to the same canonical Devanāgarī, so adding a scheme never touches the engine.

   'latin'  VaakBoard's plain-keyboard input: Harvard-Kyoto style, case-sensitive
            (T D N = retroflex, R = ṛ, M = anusvāra, H = visarga, aa ii uu = long vowels).
   'iast'   IAST with diacritics (ā ī ū ṛ ṃ ḥ ś ṣ ñ ṅ ṭ ḍ ṇ ...). */

export const VIRAMA = '्';

/* Matra (dependent vowel sign) for each independent vowel. 'अ' has none: it is the inherent vowel. */
export const MATRA = {
  'आ': 'ा', 'इ': 'ि', 'ई': 'ी', 'उ': 'ु', 'ऊ': 'ू', 'ऋ': 'ृ', 'ॠ': 'ॄ', 'ऌ': 'ॢ', 'ॡ': 'ॣ',
  'ए': 'े', 'ऐ': 'ै', 'ओ': 'ो', 'औ': 'ौ',
};

export const SCHEMES = {
  latin: {
    consonants: {
      'kh': 'ख', 'gh': 'घ', 'ch': 'छ', 'jh': 'झ', 'Th': 'ठ', 'Dh': 'ढ', 'th': 'थ', 'dh': 'ध', 'ph': 'फ', 'bh': 'भ',
      'sh': 'श', 'Sh': 'ष',
      'k': 'क', 'g': 'ग', 'G': 'ङ', 'c': 'च', 'j': 'ज', 'J': 'ञ', 'T': 'ट', 'D': 'ड', 'N': 'ण',
      't': 'त', 'd': 'द', 'n': 'न', 'p': 'प', 'b': 'ब', 'm': 'म',
      'y': 'य', 'r': 'र', 'l': 'ल', 'v': 'व', 'w': 'व', 'z': 'श', 'S': 'ष', 's': 'स', 'h': 'ह', 'L': 'ळ',
    },
    /* Fixed conjuncts typed as one unit. */
    clusters: { 'ksh': 'क्ष', 'gy': 'ज्ञ' },
    vowels: {
      'aa': 'आ', 'ii': 'ई', 'uu': 'ऊ', 'ai': 'ऐ', 'au': 'औ', 'RR': 'ॠ', 'lR': 'ऌ',
      'a': 'अ', 'A': 'आ', 'i': 'इ', 'I': 'ई', 'u': 'उ', 'U': 'ऊ', 'e': 'ए', 'o': 'ओ', 'R': 'ऋ',
    },
    marks: { 'M': 'ं', 'H': 'ः', '||': '॥', '|': '।' },
  },

  iast: {
    consonants: {
      'kh': 'ख', 'gh': 'घ', 'ch': 'छ', 'jh': 'झ', 'ṭh': 'ठ', 'ḍh': 'ढ', 'th': 'थ', 'dh': 'ध', 'ph': 'फ', 'bh': 'भ',
      'k': 'क', 'g': 'ग', 'ṅ': 'ङ', 'c': 'च', 'j': 'ज', 'ñ': 'ञ', 'ṭ': 'ट', 'ḍ': 'ड', 'ṇ': 'ण',
      't': 'त', 'd': 'द', 'n': 'न', 'p': 'प', 'b': 'ब', 'm': 'म',
      'y': 'य', 'r': 'र', 'l': 'ल', 'v': 'व', 'ś': 'श', 'ṣ': 'ष', 's': 'स', 'h': 'ह',
    },
    clusters: {},
    vowels: {
      'ai': 'ऐ', 'au': 'औ',
      'a': 'अ', 'ā': 'आ', 'i': 'इ', 'ī': 'ई', 'u': 'उ', 'ū': 'ऊ', 'ṛ': 'ऋ', 'ṝ': 'ॠ', 'ḷ': 'ऌ', 'ḹ': 'ॡ',
      'e': 'ए', 'o': 'ओ',
    },
    marks: { 'ṃ': 'ं', 'ḥ': 'ः', 'm̐': 'ँ', '|': '।', '||': '॥' },
    lowercase: true,
  },
};

/* Reverse table: Devanāgarī → IAST. */
export const TO_IAST = {
  consonants: {
    'क': 'k', 'ख': 'kh', 'ग': 'g', 'घ': 'gh', 'ङ': 'ṅ', 'च': 'c', 'छ': 'ch', 'ज': 'j', 'झ': 'jh', 'ञ': 'ñ',
    'ट': 'ṭ', 'ठ': 'ṭh', 'ड': 'ḍ', 'ढ': 'ḍh', 'ण': 'ṇ', 'त': 't', 'थ': 'th', 'द': 'd', 'ध': 'dh', 'न': 'n',
    'प': 'p', 'फ': 'ph', 'ब': 'b', 'भ': 'bh', 'म': 'm', 'य': 'y', 'र': 'r', 'ल': 'l', 'व': 'v',
    'श': 'ś', 'ष': 'ṣ', 'स': 's', 'ह': 'h', 'ळ': 'ḷ',
  },
  vowels: {
    'अ': 'a', 'आ': 'ā', 'इ': 'i', 'ई': 'ī', 'उ': 'u', 'ऊ': 'ū', 'ऋ': 'ṛ', 'ॠ': 'ṝ', 'ऌ': 'ḷ', 'ॡ': 'ḹ',
    'ए': 'e', 'ऐ': 'ai', 'ओ': 'o', 'औ': 'au',
  },
  matras: {
    'ा': 'ā', 'ि': 'i', 'ी': 'ī', 'ु': 'u', 'ू': 'ū', 'ृ': 'ṛ', 'ॄ': 'ṝ', 'ॢ': 'ḷ', 'ॣ': 'ḹ',
    'े': 'e', 'ै': 'ai', 'ो': 'o', 'ौ': 'au',
  },
  marks: { 'ं': 'ṃ', 'ः': 'ḥ', 'ँ': 'm̐', '।': '|', '॥': '||', 'ऽ': '’' },
};
