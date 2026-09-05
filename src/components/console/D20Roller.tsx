"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { playBlip } from "./sound";

function D20Icon({ label }: { label: string | number }) {
  return (
    <svg width="26" height="26" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      <polygon
        points="20,2 36,12 36,28 20,38 4,28 4,12"
        fill="#0d0f12"
        stroke="var(--amber-dim)"
        strokeWidth="1"
      />
      <polygon
        points="20,2 36,12 20,20 4,12"
        fill="none"
        stroke="var(--amber-dim)"
        strokeWidth="0.6"
      />
      <polygon
        points="4,28 20,20 36,28 20,38"
        fill="none"
        stroke="var(--amber-dim)"
        strokeWidth="0.6"
      />
      <line x1="4" y1="12" x2="20" y2="20" stroke="var(--amber-dim)" strokeWidth="0.6" />
      <line x1="36" y1="12" x2="20" y2="20" stroke="var(--amber-dim)" strokeWidth="0.6" />
      <line x1="4" y1="28" x2="20" y2="20" stroke="var(--amber-dim)" strokeWidth="0.6" />
      <line x1="36" y1="28" x2="20" y2="20" stroke="var(--amber-dim)" strokeWidth="0.6" />
      <text
        x="20"
        y="23"
        textAnchor="middle"
        fontSize="11"
        fontFamily="var(--font-geist-mono), monospace"
        fill="var(--amber)"
      >
        {label}
      </text>
    </svg>
  );
}

function flavorFor(roll: number): { text: string; color: string } {
  if (roll === 20) return { text: "Critical hit!", color: "var(--green)" };
  if (roll === 1) return { text: "Critical miss...", color: "var(--red)" };
  if (roll >= 15) return { text: "Nice roll.", color: "var(--cyan)" };
  if (roll <= 5) return { text: "Rough one.", color: "var(--fg-dim)" };
  return { text: "You rolled.", color: "var(--fg-muted)" };
}

export default function D20Roller() {
  const [rolling, setRolling] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [display, setDisplay] = useState<number | string>(20);
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  function roll() {
    if (rolling) return;
    playBlip();
    setRolling(true);
    setResult(null);

    let ticks = 0;
    intervalRef.current = setInterval(() => {
      setDisplay(1 + Math.floor(Math.random() * 20));
      ticks += 1;
      if (ticks > 12) {
        clearInterval(intervalRef.current);
        const finalRoll = 1 + Math.floor(Math.random() * 20);
        setDisplay(finalRoll);
        setResult(finalRoll);
        setRolling(false);
        setTimeout(() => setResult(null), 2200);
      }
    }, 70);
  }

  const flavor = result !== null ? flavorFor(result) : null;

  return (
    <div className="relative inline-flex w-fit items-center">
      <button
        type="button"
        onClick={roll}
        disabled={rolling}
        aria-label="Roll a d20"
        title="Roll a d20"
        className="inline-flex items-center gap-1.5 rounded border border-[var(--hairline)] px-2.5 py-1 font-mono-tech text-xs text-[var(--fg-muted)] transition hover:border-[var(--amber-dim)] hover:text-[var(--amber)] active:scale-95 disabled:opacity-70"
      >
        <motion.span
          animate={rolling ? { rotate: 360 } : { rotate: 0 }}
          transition={rolling ? { duration: 0.7, repeat: Infinity, ease: "linear" } : {}}
          className="flex items-center"
        >
          <D20Icon label={display} />
        </motion.span>
        roll
      </button>

      <AnimatePresence>
        {flavor && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4 }}
            className="hairline absolute left-1/2 top-full z-10 mt-2 -translate-x-1/2 whitespace-nowrap rounded px-2.5 py-1 font-mono-tech text-xs"
            style={{ color: flavor.color }}
          >
            {result} · {flavor.text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
