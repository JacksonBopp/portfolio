"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CatSilhouette } from "./PeekingCat";
import WalkingCatSilhouette from "./WalkingCatSilhouette";

const CYCLE_MS = 2 * 60 * 1000;
const TARGET_SKILL = "Linux";

type Phase =
  | "idle"
  | "falling"
  | "exiting-down"
  | "gap"
  | "entering"
  | "exiting-side";

export default function CatKnockdown() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [dropX, setDropX] = useState(0);
  const [dropY, setDropY] = useState(0);
  const peekingCatVisible = useRef(false);
  const phaseRef = useRef<Phase>("idle");

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    function handleVisibility(e: Event) {
      peekingCatVisible.current = (e as CustomEvent).detail.visible;
    }
    window.addEventListener("cat:visibility", handleVisibility);
    return () => window.removeEventListener("cat:visibility", handleVisibility);
  }, []);

  const knockOffChip = useCallback((chip: HTMLElement) => {
    chip.style.transition = "transform 0.4s ease-in, opacity 0.4s ease-in";
    chip.style.transform = "translateY(28px) rotate(-18deg)";
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

    const rect = chip.getBoundingClientRect();
    setDropX(rect.left + rect.width / 2);
    setDropY(rect.top);

    setPhase("falling");

    const t1 = setTimeout(() => {
      knockOffChip(chip);
    }, 500);

    const t2 = setTimeout(() => {
      setPhase("exiting-down");
    }, 900);

    const t3 = setTimeout(() => {
      setPhase("gap");
    }, 1500);

    const t4 = setTimeout(() => {
      setPhase("entering");
    }, 3000);

    const t5 = setTimeout(() => {
      const current = document.querySelector<HTMLElement>(`[data-skill-chip="${TARGET_SKILL}"]`);
      if (current) restoreChip(current);
    }, 4100);

    const t6 = setTimeout(() => {
      setPhase("exiting-side");
    }, 4300);

    const t7 = setTimeout(() => {
      setPhase("idle");
    }, 5100);

    return () => [t1, t2, t3, t4, t5, t6, t7].forEach(clearTimeout);
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
      if (peekingCatVisible.current) return; // don't overlap the ambient peeking cat
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
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-40">
      <AnimatePresence>
        {phase === "falling" && (
          <motion.div
            className="absolute"
            style={{ left: dropX - 30, top: 0 }}
            initial={{ y: -150 }}
            animate={{ y: dropY - 60 }}
            transition={{ duration: 0.5, ease: "easeIn" }}
          >
            <CatSilhouette />
          </motion.div>
        )}

        {phase === "exiting-down" && (
          <motion.div
            className="absolute"
            style={{ left: dropX - 30, top: dropY - 60 }}
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.5 }}
          >
            <CatSilhouette />
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
