"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

type Mood = "neutral" | "happy" | "sad";
type Phase = "idle" | "sitting" | "jumping" | "leaving";

const PET_TIMEOUT_MS = 30_000;
const SPIN_THRESHOLD_RAD = Math.PI * 2; // one full revolution around the cat

function SittingCatFace({ mood }: { mood: Mood }) {
  return (
    <svg width="90" height="90" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      {/* body */}
      <ellipse cx="50" cy="72" rx="34" ry="24" fill="#0d0f12" stroke="var(--amber-dim)" strokeWidth="0.8" />
      {/* ears */}
      <polygon points="24,32 38,32 28,10" fill="#0d0f12" stroke="var(--amber-dim)" strokeWidth="0.8" />
      <polygon points="76,32 62,32 72,10" fill="#0d0f12" stroke="var(--amber-dim)" strokeWidth="0.8" />
      {/* head */}
      <circle cx="50" cy="45" r="26" fill="#0d0f12" stroke="var(--amber-dim)" strokeWidth="0.8" />

      {mood === "happy" ? (
        <>
          <path d="M36 44 q5 5 10 0" stroke="var(--amber)" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M54 44 q5 5 10 0" stroke="var(--amber)" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M43 54 q7 6 14 0" stroke="var(--amber)" strokeWidth="1.6" fill="none" strokeLinecap="round" />
          <path d="M50 16 l3 6 6 1 -4.5 4 1 6 -5.5 -3 -5.5 3 1 -6 -4.5 -4 6 -1 z" fill="var(--red)" opacity="0.85" />
        </>
      ) : mood === "sad" ? (
        <>
          <path d="M37 46 q5 -5 9 -1" stroke="var(--amber)" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M54 45 q5 -5 9 -1" stroke="var(--amber)" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M43 58 q7 -5 14 0" stroke="var(--amber)" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx="41" cy="45" r="3.2" fill="var(--amber)" />
          <circle cx="59" cy="45" r="3.2" fill="var(--amber)" />
          <path d="M46 55 q4 3 8 0" stroke="var(--amber)" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

export default function PettableCat() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [mood, setMood] = useState<Mood>("neutral");
  const containerRef = useRef<HTMLDivElement>(null);
  const cumulativeAngle = useRef(0);
  const lastAngle = useRef<number | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const resolvedRef = useRef(false);

  const leave = useCallback(() => {
    clearTimeout(timeoutRef.current);
    setPhase("leaving");
    setTimeout(() => {
      setPhase("idle");
      setMood("neutral");
      cumulativeAngle.current = 0;
      lastAngle.current = null;
      resolvedRef.current = false;
    }, 700);
  }, []);

  const succeed = useCallback(() => {
    if (resolvedRef.current) return;
    resolvedRef.current = true;
    clearTimeout(timeoutRef.current);
    setMood("happy");
    setPhase("jumping");
    setTimeout(leave, 900);
  }, [leave]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (phase !== "sitting" || resolvedRef.current) return;
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const angle = Math.atan2(e.clientY - cy, e.clientX - cx);

      if (lastAngle.current !== null) {
        let delta = angle - lastAngle.current;
        if (delta > Math.PI) delta -= Math.PI * 2;
        if (delta < -Math.PI) delta += Math.PI * 2;
        cumulativeAngle.current += delta;
        if (Math.abs(cumulativeAngle.current) >= SPIN_THRESHOLD_RAD) {
          succeed();
        }
      }
      lastAngle.current = angle;
    },
    [phase, succeed],
  );

  useEffect(() => {
    function trigger() {
      if (phase !== "idle") return;
      resolvedRef.current = false;
      cumulativeAngle.current = 0;
      lastAngle.current = null;
      setMood("neutral");
      setPhase("sitting");
      timeoutRef.current = setTimeout(() => {
        if (resolvedRef.current) return;
        resolvedRef.current = true;
        setMood("sad");
        leave();
      }, PET_TIMEOUT_MS);
    }
    window.addEventListener("cat:pet", trigger);
    return () => window.removeEventListener("cat:pet", trigger);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  if (phase === "idle") return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center">
      <AnimatePresence>
        <motion.div
          ref={containerRef}
          className="pointer-events-auto"
          onMouseMove={handleMouseMove}
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={
            phase === "jumping"
              ? { opacity: 1, scale: 1, y: [0, -30, 0] }
              : phase === "leaving"
                ? { opacity: 0, scale: 0.6, y: 20 }
                : { opacity: 1, scale: 1, y: 0 }
          }
          transition={
            phase === "jumping" ? { duration: 0.6, ease: "easeOut" } : { duration: 0.4 }
          }
        >
          <SittingCatFace mood={mood} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
