const QUESTIONS = [
  { q: 'VaakBoard’s custom engine is built around which data structure?', a: ['Trie', 'Stack', 'Heap'], correct: 0 },
  { q: 'Which script is Sanskrit most commonly written in today?', a: ['Cyrillic', 'Devanāgarī', 'Hangul'], correct: 1 },
  { q: 'What does IAST stand for?', a: ['International Alphabet of Sanskrit Transliteration', 'Indian Alphabet Standard Text', 'Internet Alphabet for Script Translation'], correct: 0 },
];

export function initQuiz() {
  const root = document.querySelector('[data-quiz]');
  if (!root) return;
  const qEl = root.querySelector('[data-quiz-q]');
  const optsEl = root.querySelector('[data-quiz-opts]');
  const msg = root.querySelector('[data-quiz-msg]');
  const scoreEl = root.querySelector('[data-quiz-score]');
  const totalEl = root.querySelector('[data-quiz-total]');
  let i = 0, score = 0, answered = 0;

  const setScore = () => {
    scoreEl.textContent = score; totalEl.textContent = answered;
    scoreEl.classList.remove('score-pop'); void scoreEl.offsetWidth; scoreEl.classList.add('score-pop');
  };
  const button = (text, cls, onClick) => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = cls; b.textContent = text; b.addEventListener('click', onClick);
    return b;
  };

  function show() {
    const item = QUESTIONS[i];
    qEl.textContent = item.q;
    msg.textContent = '';
    optsEl.replaceChildren(...item.a.map((text, n) => {
      const b = button(text, 'quiz-opt', () => answer(n, b));
      b.dataset.n = n;
      return b;
    }));
  }

  function answer(n, btn) {
    const item = QUESTIONS[i];
    answered++;
    optsEl.querySelectorAll('button').forEach((b) => { b.disabled = true; });
    if (n === item.correct) {
      score++; btn.dataset.state = 'correct'; msg.textContent = 'Correct.';
    } else {
      btn.dataset.state = 'wrong';
      optsEl.querySelector(`[data-n="${item.correct}"]`).dataset.state = 'correct';
      msg.textContent = `Not quite. It’s ${item.a[item.correct]}.`;
    }
    setScore();
    const last = i === QUESTIONS.length - 1;
    const next = button(last ? 'Play again' : 'Next question →', 'ml-2 font-bold text-amber-ink underline underline-offset-4 min-h-[36px]', () => {
      if (last) { i = 0; score = 0; answered = 0; setScore(); } else i++;
      show();
      optsEl.querySelector('button').focus({ preventScroll: true });
    });
    msg.append(' ', next);
  }

  show();
}
