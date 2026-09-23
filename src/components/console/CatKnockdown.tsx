"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CatSilhouette } from "./PeekingCat";
import WalkingCatSilhouette from "./WalkingCatSilhouette";
import { acquireCat, releaseCat } from "./catActivity";

const CYCLE_MS = 2 * 60 * 1000;
const TARGET_SKILL = "Linux";
const FALL_DURATION_MS = 900;

type Phase = "idle" | "falling" | "gap" | "entering" | "exiting-side";

export default function CatKnockdown() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [dropX, setDropX] = useState(0);
  const [dropY, setDropY] = useState(0);
  const [fallToY, setFallToY] = useState(0);
  const phaseRef = useRef<Phase>("idle");

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  const knockOffChip = useCallback((chip: HTMLElement, fallDistance: number) => {
    chip.style.transition = `transform ${FALL_DURATION_MS}ms ease-in, opacity ${FALL_DURATION_MS}ms ease-in`;
    chip.style.transform = `translateY(${fallDistance}px) rotate(-25deg)`;
    chip.style.opacity = "0";
  }, []);

  const restoreChip = useCallback((chip: HTMLElement) => {
    chip.style.transition = "transform 0.4s ease-out, opacity 0.4s ease-out";
    chip.style.transform = "none";
    chip.style.opacity = "1";
  }, []);

  const runSequence = useCallback(() => {
    const chip = document.querySelector<HTMLElement>(`[data-skill-chip="${TARGET_SKILL}"]`);
    if (!chip) return;
    if (!acquireCat()) return; // another cat easter egg is already active

    const rect = chip.getBoundingClientRect();
    const viewportH = window.innerHeight;
    setDropX(rect.left + rect.width / 2);
    setDropY(rect.top);
    setFallToY(viewportH + 100);

    setPhase("falling");

    // Knock the chip off partway through the cat's fall, roughly when the
    // cat visually reaches it, then let both keep falling off the bottom.
    const knockDelay = Math.round(FALL_DURATION_MS * ((rect.top + 150) / (viewportH + 250)));
    const t1 = setTimeout(() => {
      knockOffChip(chip, viewportH - rect.top + 150);
    }, knockDelay);

    const t2 = setTimeout(() => {
      setPhase("gap");
    }, FALL_DURATION_MS + 200);

    const t3 = setTimeout(() => {
      setPhase("entering");
    }, FALL_DURATION_MS + 1700);

    const t4 = setTimeout(() => {
      const current = document.querySelector<HTMLElement>(`[data-skill-chip="${TARGET_SKILL}"]`);
      if (current) restoreChip(current);
    }, FALL_DURATION_MS + 2800);

    const t5 = setTimeout(() => {
      setPhase("exiting-side");
    }, FALL_DURATION_MS + 3000);

    const t6 = setTimeout(() => {
      setPhase("idle");
      releaseCat();
    }, FALL_DURATION_MS + 3800);

    return () => [t1, t2, t3, t4, t5, t6].forEach(clearTimeout);
  }, [knockOffChip, restoreChip]);

  useEffect(() => {
    let reducedMotion = false;
    try {
      reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch {
      // ignore
    }
    if (reducedMotion) return;

    const interval = setInterval(() => {
      if (phaseRef.current !== "idle") return; // don't overlap ourselves
      runSequence();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, CYCLE_MS);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Manual trigger: searching "cat fall" in the command palette.
  useEffect(() => {
    function handleManualFall() {
      if (phaseRef.current !== "idle") return;
      runSequence();
    }
    window.addEventListener("cat:fall", handleManualFall);
    return () => window.removeEventListener("cat:fall", handleManualFall);
  }, [runSequence]);

  if (phase === "idle") return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
      <AnimatePresence>
        {phase === "falling" && (
          <motion.div
            className="absolute"
            style={{ left: dropX - 30, top: 0 }}
            initial={{ y: -150 }}
            animate={{ y: fallToY }}
            transition={{ duration: FALL_DURATION_MS / 1000, ease: "easeIn" }}
          >
            <CatSilhouette dizzy />
          </motion.div>
        )}

        {phase === "entering" && (
          <motion.div
            className="absolute"
            style={{ top: dropY - 30 }}
            initial={{
              x: typeof window !== "undefined" ? window.innerWidth + 40 : 1200,
              scaleX: -1,
            }}
            animate={{ x: dropX - 47, scaleX: -1 }}
            transition={{ duration: 1.1, ease: "easeInOut" }}
          >
            <WalkingCatSilhouette />
          </motion.div>
        )}

        {phase === "exiting-side" && (
          <motion.div
            className="absolute"
            style={{ top: dropY - 30 }}
            initial={{ x: dropX - 47 }}
            animate={{
              x: typeof window !== "undefined" ? window.innerWidth + 40 : 1200,
            }}
            transition={{ duration: 0.9, ease: "easeIn" }}
          >
            <WalkingCatSilhouette />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
