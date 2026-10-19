/* Shared environment checks. */
export const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
export const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
export const prefersReduced = () => reducedMotion.matches;
