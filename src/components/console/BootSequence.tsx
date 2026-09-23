"use client";

import { useEffect, useRef, useState } from "react";
import { profile } from "@/data/profile";
import { playConfirm, primeAudio } from "./sound";

const BOOT_KEY = "jb-console-booted";

const LINES = [
  "JB-01 DIAGNOSTIC CONSOLE",
  `INIT PROFILE: ${profile.name.toUpperCase()}`,
  `ROLE: ${profile.tagline.toUpperCase()}`,
  "LOADING SKILLS TABLE ... OK",
  "LOADING PROJECT LOG ... OK",
  "LINKING RESUME TRACKS ... OK",
  "READY",
];

export default function BootSequence({ onDone }: { onDone: () => void }) {
  const [visibleLines, setVisibleLines] = useState(0);
  const skippedRef = useRef(false);

  useEffect(() => {
    let alreadyBooted = false;
    let reducedMotion = false;
    try {
      alreadyBooted = sessionStorage.getItem(BOOT_KEY) === "1";
    } catch {
      // sessionStorage unavailable, treat as not booted
    }
    try {
      reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
    } catch {
      // ignore
    }

    if (alreadyBooted || reducedMotion) {
      onDone();
      return;
    }

    const timers: ReturnType<typeof setTimeout>[] = [];
    LINES.forEach((_, i) => {
      timers.push(
        setTimeout(() => {
          setVisibleLines(i + 1);
        }, i * 180),
      );
    });
    timers.push(
      setTimeout(
        () => {
          if (!skippedRef.current) finish();
        },
        LINES.length * 180 + 500,
      ),
    );

    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function finish() {
    skippedRef.current = true;
    try {
      sessionStorage.setItem(BOOT_KEY, "1");
    } catch {
      // ignore
    }
    playConfirm();
    onDone();
  }

  return (
    <div
      onPointerDown={primeAudio}
      className="flex min-h-dvh flex-col items-start justify-center bg-[var(--bg-0)] px-6 font-mono-tech text-sm text-[var(--fg-muted)] sm:px-16"
    >
      <div className="mx-auto flex w-full max-w-xl flex-col gap-1.5">
        {LINES.slice(0, visibleLines).map((line, i) => (
          <div key={i} className="flex items-baseline gap-3">
            <span className="text-[var(--fg-dim)]">
              [{String(i).padStart(2, "0")}]
            </span>
            <span
              className={
                i === LINES.length - 1 ? "text-[var(--amber)]" : "text-[var(--fg)]"
              }
            >
              {line}
            </span>
          </div>
        ))}
        <button
          type="button"
          onClick={finish}
          className="mt-6 self-start rounded border border-[var(--hairline-strong)] px-3 py-1.5 text-xs text-[var(--fg-muted)] transition-colors hover:text-[var(--fg)]"
        >
          Skip →
        </button>
      </div>
    </div>
  );
}
