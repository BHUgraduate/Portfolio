/* Latin → Devanāgarī mapping (Harvard-Kyoto style input).
   Same tables and greedy longest-match logic as sanskrit-keyboard.jsx / .html. */

const CONSONANTS = {
  'ksh':'क्ष्', 'shr':'श्र्', 'tr':'त्र्', 'gy':'ज्ञ्',
  'kh':'ख्', 'gh':'घ्', 'ch':'छ्', 'jh':'झ्', 'Th':'ठ्', 'Dh':'ढ्', 'th':'थ्', 'dh':'ध्', 'ph':'फ्', 'bh':'भ्', 'sh':'ष्',
  'k':'क्', 'g':'ग्', 'c':'च्', 'j':'ज्', 'T':'ट्', 'D':'ड्', 'N':'ण्', 't':'त्', 'd':'द्', 'n':'न्', 'p':'प्', 'b':'ब्', 'm':'म्',
  'y':'य्', 'r':'र्', 'l':'ल्', 'v':'व्', 'w':'व्', 'S':'श्', 's':'स्', 'h':'ह्',
};
const IND_VOWELS = {
  'aa':'आ', 'ii':'ई', 'uu':'ऊ', 'ai':'ऐ', 'au':'औ',
  'a':'अ', 'i':'इ', 'I':'ई', 'u':'उ', 'U':'ऊ', 'e':'ए', 'o':'ओ', 'R':'ऋ',
};
const DEP_VOWELS = {
  'aa':'ा', 'ii':'ी', 'uu':'ू', 'ai':'ै', 'au':'ौ',
  'a':'', 'i':'ि', 'I':'ी', 'u':'ु', 'U':'ू', 'e':'े', 'o':'ो', 'R':'ृ',
};
const MODIFIERS = { 'M':'ं', 'H':'ः' };
const VIRAMA = '्';

export function transliterate(latin) {
  if (!latin) return '';
  let out = '';
  let i = 0;
  while (i < latin.length) {
    let len = 0, type = '', val = '';
    for (let n = 3; n > 0; n--) {
      if (i + n > latin.length) continue;
      const chunk = latin.substr(i, n);
      if (CONSONANTS[chunk]) { val = CONSONANTS[chunk]; type = 'C'; len = n; break; }
      if (IND_VOWELS[chunk]) { val = chunk; type = 'V'; len = n; break; }
      if (MODIFIERS[chunk]) { val = MODIFIERS[chunk]; type = 'M'; len = n; break; }
    }
    if (!len) { out += latin[i]; i++; continue; }
    if (type === 'C') out += val;
    else if (type === 'V') {
      out = out.endsWith(VIRAMA) ? out.slice(0, -1) + DEP_VOWELS[val] : out + IND_VOWELS[val];
    } else out += val;
    i += len;
  }
  return out;
}
