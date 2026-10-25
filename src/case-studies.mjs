// Case studies. Every statement is drawn from the project's own repository or docs.
// Plain text only (the generator escapes it). `list` items render as bullets.
// Add a study by appending an object; `npm run cases` regenerates /case-studies/.
// Rule: no metrics, clients or testimonials unless they are real. Say what is not known.

export const caseStudies = [
  {
    slug: 'ebook-pro',
    name: 'eBook Pro',
    kicker: 'Product case study',
    status: { key: 'live', label: 'Web live · Android in preparation' },
    title: 'eBook Pro: turning reading into knowledge',
    description:
      'How eBook Pro was engineered: one coordinate pipeline for PDF text, OCR and search, an EPUB parser, on-device OCR and translation, and a server-enforced quota.',
    summary:
      'A reader for people who study what they read. The case study covers why it is a local-first Flutter app, the three hardest engineering problems, and what the product still does not do.',
    facts: [
      ['Role', 'Product, design and engineering'],
      ['Stack', 'Flutter, Dart, Drift, Firebase, Google ML Kit'],
      ['Version', '1.5.1 (build 9)'],
      ['Links', 'ebookpro.hycyon.com · ebookpro.web.app'],
    ],
    links: [
      ['Product site', 'https://ebookpro.hycyon.com/'],
      ['Open the web app', 'https://ebookpro.web.app/'],
    ],
    sections: [
      {
        id: 'problem',
        title: 'The problem',
        text: [
          'People who study a book use three tools: a reader, a notebook and a flashcard app. Every highlight has to be copied from the first to the second and again to the third, and scanned or non-English books make each step worse.',
          'eBook Pro starts from one question: how do you shorten the distance between reading a sentence and understanding it?',
        ],
      },
      {
        id: 'philosophy',
        title: 'Product philosophy',
        text: ['The product moves in one direction: read, understand, research, annotate, connect, learn, create. Three decisions follow from that.'],
        list: [
          'Your own files. The reader opens your PDF, EPUB and text files rather than selling a library.',
          'Local first. Books, progress and notes live in a local SQL database on the device. The network adds features; it is not required to read.',
          'AI is optional and bounded. It explains a selection. It does not replace reading.',
        ],
      },
      {
        id: 'ux',
        title: 'UX decisions',
        list: [
          'A page turn with physical shading, written as GLSL fragment shaders, so reading a long book feels like handling a page. This is the reason for Flutter over native.',
          'Peek-and-pop word lookup and translation, so a lookup does not take the reader out of the page.',
          'A progress overlay that shows pages left in the chapter and time remaining, and shows a dash until it has enough reading-speed samples rather than a misleading zero.',
          'Three reading palettes with literary typography and a generous line height.',
          'Zoom and page turning that never fight each other: paging is disabled while a zoom or selection gesture is active.',
        ],
      },
      {
        id: 'engineering',
        title: 'Engineering',
        text: [
          'One Flutter codebase for web and Android. Native Swift and Kotlin would have meant building every feature twice, and Flutter exposes the shader pipeline the page turn depends on.',
          'Drift (type-safe SQL) is the local database. The architecture notes record that Isar was considered and rejected because the project had stalled, a decision made after researching it rather than assuming it.',
          'Firebase supplies authentication, Firestore, Cloud Functions and Cloud Storage. Google ML Kit provides on-device OCR and translation, so scans never leave the device.',
        ],
      },
      {
        id: 'architecture',
        title: 'Architecture',
        text: ['Three layers: core (data, parsing, geometry, OCR, services), domain (logic that spans features, such as spaced-repetition scheduling and streaks) and presentation (screens and reader widgets). Repositories are the only code that touches both the database and the domain models, so the rest of the app sees plain objects and streams.'],
      },
      {
        id: 'hard-problems',
        title: 'The hard problems',
        subsections: [
          {
            title: 'Everything on a page must agree on where things are',
            text: [
              'Native PDF text, OCR words, search matches, selections and the magnifier all draw over the page. If each computed its own coordinates they would drift apart, especially on rotated pages and two-page spreads.',
              'They all go through one chain: document space, then a normalised upright page space, then the composed frame, then the viewport, then the zoom matrix. The two-page spread layout is defined once and used both for drawing and hit-testing, so painted pages and their text layers cannot disagree. PDF rotation behaviour was verified against real rotated PDFs and unit tested.',
            ],
          },
          {
            title: 'OCR on a phone without hurting the phone',
            text: [
              'Scanned pages have no text. The text layer checks memory, then a disk cache, then native text, and only then queues OCR. The queue runs one job at a time, newest page first, and drops pages the reader has already left. Parallel OCR was rejected because ML Kit is already multi-threaded and parallel jobs would only compete for memory.',
              'Results are cached by a fingerprint of the file (size, modified time and the first and last 64 KiB), written atomically and validated on read.',
            ],
          },
          {
            title: 'EPUB files as they exist in the wild',
            text: [
              'The EPUB pipeline reads EPUB 2 and 3 leniently: case and percent-insensitive archive lookups, tolerant fallbacks for malformed XHTML, fixed-layout detection, embedded fonts and image pages. Reading positions are stored as EPUB CFIs so a position survives re-layout.',
              'A deliberate trade-off: the publisher\'s CSS is not applied to reflowable text. The app\'s own typography is used, which keeps reading consistent but means some publisher styling is lost.',
            ],
          },
          {
            title: 'Cost and trust of AI features',
            text: [
              'AI answers are cached by a hash of the prompt so the first request pays and later ones do not. An early version limited daily use with a client-side counter. The architecture notes say plainly that a modified client could skip it, and name server-side enforcement as the real fix.',
              'The cloud storage quota added in 1.5.1 is enforced on the server: an upload needs a reservation made inside a transaction, and storage rules accept only that path at exactly that size before the reservation expires. Clients cannot write reservations.',
            ],
          },
        ],
      },
      {
        id: 'solution',
        title: 'The solution',
        text: ['Today the product reads PDF, EPUB and text files; recognises text in scans in Latin and Devanagari scripts on the device; translates on the device; turns highlights into notes and spaced-repetition flashcards; offers AI explanations of a selection; and has a notes and writing workspace, accounts, and a Free and Premium plan.'],
      },
      {
        id: 'current-state',
        title: 'Current state and limits',
        list: [
          'Web app: live. Android: in preparation. iOS has not been built in the development environment.',
          'OCR recognises Latin and Devanagari only. Hindi OCR was verified on an emulator with a generated page, not on a corpus of real scans.',
          'Publisher CSS, MathML typesetting, audio and video, and tappable in-text links in EPUBs are not supported.',
          'No download, rating or review figures are shown here because none have been verified.',
        ],
      },
    ],
    next: ['vaakboard', 'irons-irony'],
  },

  {
    slug: 'vaakboard',
    name: 'VaakBoard',
    kicker: 'Product case study',
    status: { key: 'soon', label: 'iOS keyboard coming soon · engine and web demo working' },
    title: 'VaakBoard: a precision input system for Sanskrit',
    description:
      'The language problem behind VaakBoard, the layered transliteration engine that exists today, what is tested, and what is deliberately not built yet.',
    summary:
      'Typing Sanskrit on a phone is a linguistics problem before it is a layout problem. This study separates what exists, what is being built, and what is only a plan.',
    facts: [
      ['Role', 'Product, language design and engineering'],
      ['Engine', 'JavaScript, covered by an automated test suite'],
      ['iOS', 'Swift keyboard extension — coming soon'],
      ['Demo', 'portfolio.hycyon.com/sanskrit-keyboard.html'],
    ],
    links: [['Try the web demo', 'https://portfolio.hycyon.com/sanskrit-keyboard.html']],
    sections: [
      {
        id: 'problem',
        title: 'The language problem',
        text: [
          'Devanagari is not an alphabet in the Latin sense. A consonant carries an inherent vowel, a following vowel replaces it with a sign, two consonants can fuse into a conjunct, and anusvara and visarga attach without any of that machinery. A keyboard that only swaps one letter for another cannot get these right.',
          'On a phone the problem is harder: phonetics, transliteration, the rules of the script and fast lookup all have to work inside the limits of a small keyboard.',
        ],
      },
      {
        id: 'model',
        title: 'The linguistic model',
        text: ['The engine treats typing as composition, not substitution. Text is normalised, tokenised by greedy longest match (three letters, then two, then one) and composed using the script\'s rules: a consonant is emitted with a virama; a following vowel replaces the virama with its matra; the inherent a just removes it. Anything that is not language input passes through untouched: spaces, digits, punctuation, emoji, URLs, e-mail addresses, @mentions and #tags.'],
        list: [
          'Two input schemes: a Harvard-Kyoto style Latin scheme (case-sensitive) and full IAST with diacritics.',
          'Reverse transliteration from Devanagari back to IAST, with lossless IAST round trips covered by tests.',
        ],
      },
      {
        id: 'architecture',
        title: 'Input architecture',
        text: ['The keyboard interface contains no linguistic logic. The engine is a stack of small layers that can change independently.'],
        list: [
          'Input normalisation: built',
          'Scheme tables (data only): built',
          'Tokenise and compose: built',
          'Reverse transliteration to IAST: built',
          'Language detection: not built',
          'Lexicon and dictionary: not built in this engine',
          'Suggestions: not built',
          'Correction and undo: not built',
        ],
      },
      {
        id: 'ux',
        title: 'UX principles',
        text: ['Every feature has to make typing faster, more accurate, easier, more natural or more accessible. If it does not, it does not ship.'],
        list: [
          'Predictable: the same input always gives the same output.',
          'Recoverable: a user can always get back to what they typed.',
          'Offline first and private: core transliteration stays on the device, and typed text is not sent anywhere.',
          'English stays excellent: multilingual must not cost normal keyboard behaviour.',
          'Few settings, grouped by the questions people ask.',
        ],
      },
      {
        id: 'implementation',
        title: 'Implementation',
        text: [
          'The engine and the web demo are in this repository and share the same code. The engine has a test corpus for Sanskrit words in both schemes, IAST normalisation, scheme detection, reverse transliteration, round trips, punctuation, digits, emoji, URLs and long input, and it checks the examples the page itself displays.',
          'The iOS keyboard is a Swift keyboard extension with a custom trie and an offline lexicon. Its source is not in this repository, so this study does not describe it beyond that.',
        ],
      },
      {
        id: 'challenges',
        title: 'Open problems, stated plainly',
        list: [
          'No language detection. English typed in Latin mode is transliterated, so Hello becomes Devanagari. Mixed-language typing is the main open problem.',
          'No Roman Hindi rules. Without schwa deletion, bharat gives भरत rather than भारत. That needs a lexicon, not a rule.',
          'A vowel after a vowel is kept as hiatus, so boa gives बोअ.',
          'The Latin scheme was changed to follow common conventions (sh as श, S as ष). If the iOS app used the older mapping, the two must be aligned deliberately.',
        ],
      },
      {
        id: 'current-state',
        title: 'Current, building, planned',
        subsections: [
          { title: 'Current', list: ['Sanskrit transliteration engine, both schemes, with tests.', 'Web demo using the same engine.'] },
          { title: 'Building', list: ['Native iOS keyboard (coming soon).'] },
          { title: 'Planned, not built', list: ['Contextual suggestions, language detection and a personal dictionary.', 'Deeper Sanskrit morphology and richer dictionaries.', 'More Indian languages and scripts, and other Apple platforms.'] },
        ],
      },
    ],
    next: ['ebook-pro', 'irons-irony'],
  },

  {
    slug: 'irons-irony',
    name: "iron's irony",
    kicker: 'Client case study',
    status: { key: 'client', label: 'Client project' },
    title: "iron's irony: a site for custom ironwork",
    description:
      "How a website for a gate, railing and staircase fabricator was designed around customer psychology, with a structure ready for real proof still to come.",
    summary:
      'A fabricator whose work is custom and site-specific needed a way for people to start a conversation without a finished brief. This study covers the thinking and what exists; it does not claim results that have not been measured.',
    facts: [
      ['Client', "iron's irony (building, architectural and decorative ironwork)"],
      ['Role', 'Information architecture, design and engineering'],
      ['Stack', 'Next.js 14, TypeScript, Tailwind CSS, Framer Motion, Zod'],
      ['Hosting', 'Netlify'],
    ],
    links: [["Visit iron's irony", 'https://ironsirony.hycyon.com/']],
    sections: [
      {
        id: 'problem',
        title: 'The business problem',
        text: ['Ironwork is bought rarely, built to order and fixed into a building. A visitor usually does not know the vocabulary, the options or what to ask for, and most will not call a workshop to find out. The site had to make the first step easy.'],
      },
      {
        id: 'psychology',
        title: 'Customer psychology',
        text: ['Nobody wants iron. They want the entrance that feels right and the staircase that feels solid. The copy is written around the finished space, not the metal.'],
        list: [
          'Four audiences with different questions: homeowners, architects and designers, builders and contractors, and businesses.',
          'The main fear is committing without seeing the result, so design is agreed before anything is cut, and the site says so.',
          'The main barrier is not having a brief, so a photograph, a sketch or a rough measurement is accepted as a start.',
        ],
      },
      {
        id: 'ia',
        title: 'Information architecture',
        text: ['The structure follows how the work happens: services by type of piece, a five-stage process (measure, design, fabricate, finish, install), project pages, an FAQ, a Customers page that speaks to each audience, and one Start a Project action that is always reachable.'],
      },
      {
        id: 'visual',
        title: 'Visual direction',
        text: ['The identity belongs to the client and is deliberately separate from Hycyon. The idea is that iron has weight: heavy type, hairline drawings, long settling motion, and dark iron grounds set against paper-light sections. With no real photography available, the site uses line drawings of iron pieces instead of stock imagery, and every project shown without real evidence is labelled as a representative example.'],
      },
      {
        id: 'conversion',
        title: 'Conversion flow',
        list: [
          'A four-step project consultation (what to create, the space, the vision, then how to reach you), so contact details are asked for last.',
          'Server-side validation with the same schema as the browser, a same-origin check, rate limiting and a honeypot against spam.',
          'If no enquiry destination is configured, the form says plainly that nothing was sent and offers WhatsApp, phone and email with the visitor\'s brief already written.',
          'A rule-based project assistant that answers only from the site\'s own content, never quotes prices or timelines, and says when it does not know. It is not AI.',
          'A feedback page where people who have worked with the business can say how it went. Nothing is published automatically: the owner confirms it is genuine, the person chooses full name, first name only or private, and a deploy-time check refuses unsafe entries. The wall of feedback stays empty until real words exist.',
        ],
      },
      {
        id: 'implementation',
        title: 'Implementation',
        text: ['Next.js App Router with TypeScript. All copy and business details live in data files, so content changes do not touch components. A small design system covers tokens, sections, type, form fields and the drawing components. The site is a full Next.js app, not a static export, because it has an API route and dynamic routes.'],
      },
      {
        id: 'result',
        title: 'Result',
        text: [
          'There are no results to report yet, and none are invented. No enquiry counts, conversion figures or customer feedback exist.',
          'What exists is the structure for evidence: each project can be switched from a representative drawing to a real completed project by adding a photograph and true facts, and customers can submit feedback that appears on the site once confirmed. The most valuable next step is real proof: actual installations, photographs, project details and customer words.',
        ],
      },
    ],
    next: ['ebook-pro', 'vaakboard'],
  },
];
