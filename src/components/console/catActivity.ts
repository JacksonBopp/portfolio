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

/**
 * Tries to claim the cat slot. If it's taken, asks the ambient peeking cat
 * (the only easily-interruptible one) to step aside and retries once after
 * it has had time to retreat. If something else entirely (feed, chase,
 * knockdown, pettable) is what's holding the slot, this just gives up
 * quietly rather than interrupting a deliberate in-progress animation.
 */
export function requestCatSlot(onGranted: () => void, retryDelayMs = 550): void {
  if (acquireCat()) {
    onGranted();
    return;
  }
  window.dispatchEvent(new Event("cat:dismiss-peeking"));
  setTimeout(() => {
    if (acquireCat()) {
      onGranted();
    }
  }, retryDelayMs);
}
