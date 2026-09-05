"use client";

import { useEffect, useState } from "react";
import { isSoundEnabled, setSoundEnabled, primeAudio } from "./sound";

export default function SoundToggle() {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    setEnabled(isSoundEnabled());
  }, []);

  function toggle() {
    const next = !enabled;
    setEnabled(next);
    setSoundEnabled(next);
    if (next) primeAudio();
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="flex w-fit items-center gap-1.5 font-mono-tech text-[11px] text-[var(--fg-dim)] transition hover:text-[var(--fg-muted)] active:scale-95"
      aria-pressed={enabled}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${enabled ? "bg-[var(--green)]" : "bg-[var(--fg-dim)]"}`}
      />
      sound: {enabled ? "on" : "off"}
    </button>
  );
}
