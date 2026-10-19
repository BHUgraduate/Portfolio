import { initNav } from './nav.js';
import { initReveal } from './reveal.js';
import { initEffects } from './effects.js';
import { initStory } from './story.js';
import { initVaak } from './vaak.js';
import { initQuiz } from './quiz.js';
import { initReader } from './reader.js';
import { initContact } from './contact.js';

[initNav, initReveal, initEffects, initStory, initVaak, initQuiz, initReader, initContact].forEach((init) => {
  try { init(); } catch (err) { console.error(`[portfolio] ${init.name} failed`, err); }
});
