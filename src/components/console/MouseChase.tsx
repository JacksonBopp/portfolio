"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import WalkingCatSilhouette from "./WalkingCatSilhouette";

const INTERVAL = 90_000;
const RUN_DURATION = 2.6;

export default function MouseChase() {
  const [running, setRunning] = useState(false);
  const [leftToRight, setLeftToRight] = useState(true);

  useEffect(() => {
    let reducedMotion = false;
    try {
      reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch {
      // ignore
    }
    if (reducedMotion) return;

    function trigger() {
      setLeftToRight(Math.random() > 0.5);
      setRunning(true);
      setTimeout(() => setRunning(false), RUN_DURATION * 1000 + 200);
    }

    const id = setInterval(trigger, INTERVAL);

    // Manual trigger: searching "cat chase" in the command palette.
    window.addEventListener("cat:chase", trigger);
    return () => {
      clearInterval(id);
      window.removeEventListener("cat:chase", trigger);
    };
  }, []);

  if (!running) return null;

  const width = typeof window !== "undefined" ? window.innerWidth : 1200;
  const startX = leftToRight ? -80 : width + 80;
  const endX = leftToRight ? width + 80 : -80;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 bottom-6 z-40">
      <motion.div
        className="absolute bottom-1 text-xl leading-none"
        style={{ transform: leftToRight ? undefined : "scaleX(-1)" }}
        initial={{ x: startX }}
        animate={{ x: endX }}
        transition={{ duration: RUN_DURATION, ease: "linear" }}
      >
        🐭
      </motion.div>
      <motion.div
        className="absolute bottom-0"
        initial={{ x: startX - (leftToRight ? 60 : -60) }}
        animate={{
          x: endX,
          y: [0, -4, 0, -4, 0, -4, 0],
        }}
        transition={{
          x: { duration: RUN_DURATION, ease: "linear", delay: 0.15 },
          y: { duration: 0.4, repeat: Math.ceil(RUN_DURATION / 0.4) },
        }}
      >
        <div style={{ transform: leftToRight ? undefined : "scaleX(-1)" }}>
          <WalkingCatSilhouette />
        </div>
      </motion.div>
    </div>
  );
}
