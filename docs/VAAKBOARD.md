# VaakBoard — product notes

Status of this document: **a product spec plus an honest account of what exists.** Nothing under *Vision* is built.

## What exists today

| | Status | Evidence |
|---|---|---|
| Language engine (Latin and IAST → Devanāgarī, Devanāgarī → IAST) | Working | `assets/js/vaak/`, `tests/engine.test.mjs` |
| Web demo (full on-screen keyboard) | Working | `sanskrit-keyboard.html`, uses the same engine |
| iOS keyboard (Swift, keyboard extension, custom trie, offline lexicon, CoreData) | Coming soon | Described in the portfolio and on hycyon.com. **Its source is not in this repository and was not reviewed for this document.** |

Run the engine tests: `npm test`.

## The problem

Typing Sanskrit on a phone is not a layout problem. It combines phonetics, transliteration, the rules of Devanāgarī and fast local lookup, inside the limits of a phone keyboard. A keyboard that only swaps letters cannot get conjuncts, vowel signs, anusvāra and visarga right.

## Principles

Every feature has to make typing faster, more accurate, easier, more natural or more accessible. If it doesn't, it doesn't ship.

1. **Precision before polish.** A beautiful keyboard that gets words wrong is a failure.
2. **Predictable.** The same input always gives the same output. Deterministic linguistics for anything where precision matters; no "AI" for its own sake.
3. **Recoverable.** Users must always be able to get back to what they typed.
4. **Offline-first.** Typing cannot depend on a connection. Core transliteration and lookup stay on the device.
5. **Private.** A keyboard sees everything. Typed text is not sent anywhere unless a feature clearly needs it, says so, and minimises what it sends.
6. **English stays excellent.** Multilingual must not cost normal keyboard behaviour.
7. **Few settings, grouped by questions users ask:** Languages, Appearance, Typing, Correction, Privacy, Advanced.

## Engine architecture

The keyboard UI contains no linguistic logic. The engine is a stack of small layers that can change independently:

```
Keyboard UI
  → Input normalisation     assets/js/vaak/normalize.js     built
  → Scheme tables           assets/js/vaak/schemes.js       built (data only)
  → Tokenise + compose      assets/js/vaak/transliterate.js built
  → Reverse (→ IAST)        assets/js/vaak/transliterate.js built
  → Language detection                                      not built
  → Lexicon / dictionary                                    not built in this engine
  → Suggestion engine                                       not built
  → Correction / undo                                       not built
  → Output renderer         (UI)
```

### How the current engine works

1. **Normalise.** Unicode NFC, `ṁ` → `ṃ`, scheme detected (IAST diacritics → `iast`, otherwise `latin`).
2. **Tokenise.** Greedy longest match, three letters then two then one.
3. **Compose.** A consonant is emitted with a virama. A following vowel replaces the virama with its matra (the inherent *a* just removes it). Anusvāra and visarga attach without a virama.
4. **Pass through** anything that is not ours: spaces, digits, punctuation, emoji, existing Devanāgarī, URLs, e-mail addresses, `@mentions` and `#tags`.

### Input schemes

* **latin** — Harvard-Kyoto style, case-sensitive: `M` anusvāra, `H` visarga, `R` ṛ, `T D N` retroflex, `G J` ṅ ñ, `aa ii uu` long vowels, `sh` श, `S` ष, `z` श, `ksh` क्ष, `gy` ज्ञ.
* **iast** — full IAST with diacritics, including capitals.

### Behaviour change to confirm

The earlier demo mapped `sh` → ष and `S` → श, and `shr` → श्र, which was internally inconsistent (`shaanti` produced षान्ति). The engine now follows the common conventions (`sh` → श, `S` → ष, `z` → श). If the iOS app uses the old mapping, the two should be aligned deliberately.

## Known limitations (also asserted in the tests)

* **No language detection.** English typed in Latin mode is transliterated (`Hello` becomes Devanāgarī). Mixed-language typing is the main open problem.
* **No Roman Hindi rules.** There is no schwa deletion, so `bharat` gives भरत, not भारत. That needs a lexicon, not a rule.
* **Vowel after vowel** is kept as hiatus (`boa` → बोअ), not merged.
* **No suggestions, correction or undo** in the engine yet.

## Roadmap

**V1 — Foundation.** Excellent English; Hindi; Sanskrit; Roman → Devanāgarī; IAST; accurate transliteration; reliable correction; numbers and symbols; cursor and backspace behaviour; keyboard-extension architecture; privacy foundation.
*Engine groundwork for the Sanskrit and IAST parts is done here. The rest belongs to the native keyboard.*

**V2 — Intelligence.** Contextual suggestions, mixed-language typing, language detection, personal dictionary, better Sanskrit lexicon, better correction.

**V3 — Advanced language.** Deeper Sanskrit morphology, richer dictionaries, specialised modes, custom transliteration schemes.

**V4 — Ecosystem.** More Indian languages and scripts, iPadOS/macOS, cross-device settings, possible APIs.

## Test corpus

`tests/engine.test.mjs` covers Sanskrit words in both schemes, IAST normalisation, scheme detection, reverse transliteration, lossless IAST round trips, Latin/IAST agreement, punctuation, digits, emoji, URLs and e-mail, danda, long input, and the page's own displayed examples.

Still to add as the native keyboard grows: English, Roman Hindi, Hindi, mixed Hindi/English, names, abbreviations, typos, backspace, cursor movement, selection and conjunct edge cases.

## Human factors still to design (native keyboard)

Thumb reach and one-handed use; key size and spacing; spacebar gestures (only if discoverable, predictable and reversible); long-press for diacritics so nobody hunts through a symbol page for ā or ṛ; language switching with the lowest possible cognitive cost; error recovery that never traps the user in the keyboard's interpretation.
