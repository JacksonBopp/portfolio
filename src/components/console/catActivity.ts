// Shared mutual-exclusion so at most one of the cat easter eggs (peeking,
// knockdown, pettable, feed, mouse-chase) is ever visible at the same time.
// Plain module-level state is enough here: every cat component runs
// client-side in the same page/module instance, no React context needed.
let active = false;

export function isCatActive(): boolean {
  return active;
}

/** Returns true if the cat slot was free and is now claimed. */
export function acquireCat(): boolean {
  if (active) return false;
  active = true;
  return true;
}

export function releaseCat(): void {
  active = false;
}
