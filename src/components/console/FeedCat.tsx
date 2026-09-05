"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { playBlip } from "./sound";
import WalkingCatSilhouette from "./WalkingCatSilhouette";

const TREATS = ["🐟", "🍗", "🥛", "🍤", "🧀"];
const FULL_AFTER = 4;

type Phase = "idle" | "walking-in" | "eating" | "full" | "walking-out";

export default function FeedCat() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [targetX, setTargetX] = useState(0);
  const [treat, setTreat] = useState(TREATS[0]);
  const [feedCount, setFeedCount] = useState(0);

  function feed() {
    if (phase !== "idle") return;
    playBlip();
    setTreat(TREATS[Math.floor(Math.random() * TREATS.length)]);
    setTargetX(window.innerWidth / 2 - 47);

    const nextCount = feedCount + 1;
    setFeedCount(nextCount);
    const isFull = nextCount % FULL_AFTER === 0;

    setPhase("walking-in");
    setTimeout(() => setPhase(isFull ? "full" : "eating"), 1300);
    setTimeout(() => setPhase("walking-out"), isFull ? 2600 : 2200);
    setTimeout(() => setPhase("idle"), isFull ? 3900 : 3500);
  }

  const walking = phase === "walking-in" || phase === "walking-out";
  const showTreat = phase === "walking-in" || phase === "eating" || phase === "full";
  const x =
    phase === "walking-out"
      ? (typeof window !== "undefined" ? window.innerWidth : 1200) + 80
      : phase === "idle"
        ? -140
        : targetX;

  return (
    <>
      <button
        type="button"
        onClick={feed}
        disabled={phase !== "idle"}
        className="inline-flex w-fit items-center gap-1.5 rounded border border-[var(--hairline)] px-2.5 py-1 font-mono-tech text-xs text-[var(--fg-muted)] transition hover:border-[var(--amber-dim)] hover:text-[var(--amber)] active:scale-95 disabled:opacity-40"
      >
        🐟 feed the cat
      </button>

      {phase !== "idle" && (
        <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 bottom-6 z-40">
          {showTreat && (
            <div
              className="absolute bottom-0 text-lg leading-none"
              style={{ left: "calc(50% - 10px)" }}
            >
              {treat}
            </div>
          )}

          <AnimatePresence>
            {phase === "full" && (
              <motion.div
                className="absolute bottom-16 text-lg"
                style={{ left: "calc(50% - 10px)" }}
                initial={{ opacity: 0, y: 4, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4 }}
              >
                🙅
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            className="absolute bottom-0"
            initial={{ x: -140, y: 0, rotate: 0 }}
            animate={{
              x,
              y: walking ? [0, -4, 0, -4, 0] : 0,
              rotate: phase === "full" ? [0, -6, 6, -6, 0] : 0,
            }}
            transition={{
              x: { duration: 1.3, ease: "easeInOut" },
              y: walking ? { duration: 0.45, repeat: 2 } : { duration: 0.2 },
              rotate: phase === "full" ? { duration: 0.5 } : { duration: 0.2 },
            }}
          >
            <WalkingCatSilhouette />
          </motion.div>
        </div>
      )}
    </>
  );
}
