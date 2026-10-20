const QUESTIONS = [
  { q: 'A train 120 m long passes a pole in 6 seconds. What is its speed?', a: ['18 m/s', '20 m/s', '24 m/s'], correct: 1 },
  { q: 'What comes next? 2, 6, 12, 20, …', a: ['28', '30', '32'], correct: 1 },
  { q: 'What is 25% of 240?', a: ['50', '60', '75'], correct: 1 },
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
