"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { acquireCat, releaseCat } from "./catActivity";

type Mood = "neutral" | "happy" | "sad";
type Phase = "idle" | "sitting" | "jumping" | "leaving";

const PET_TIMEOUT_MS = 30_000;
const SPIN_THRESHOLD_RAD = Math.PI * 2; // one full revolution around the cat

function SittingCatFace({ mood }: { mood: Mood }) {
  return (
    <svg width="104" height="104" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      {/* tail, curled to the side */}
      <path
        d="M84 92 C104 90 108 70 96 58"
        stroke="var(--amber-dim)"
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
      />
      {/* body */}
      <ellipse cx="60" cy="86" rx="36" ry="26" fill="#0d0f12" stroke="var(--amber-dim)" strokeWidth="0.8" />
      {/* front paws */}
      <ellipse cx="46" cy="108" rx="8" ry="7" fill="#0d0f12" stroke="var(--amber-dim)" strokeWidth="0.8" />
      <ellipse cx="72" cy="108" rx="8" ry="7" fill="#0d0f12" stroke="var(--amber-dim)" strokeWidth="0.8" />
      {/* ears, with inner shading */}
      <polygon points="30,40 46,40 34,16" fill="#0d0f12" stroke="var(--amber-dim)" strokeWidth="0.8" />
      <polygon points="33,36 42,36 35,23" fill="var(--amber-dim)" opacity="0.35" />
      <polygon points="90,40 74,40 86,16" fill="#0d0f12" stroke="var(--amber-dim)" strokeWidth="0.8" />
      <polygon points="87,36 78,36 85,23" fill="var(--amber-dim)" opacity="0.35" />
      {/* head */}
      <circle cx="60" cy="54" r="30" fill="#0d0f12" stroke="var(--amber-dim)" strokeWidth="0.8" />
      {/* whiskers */}
      <path d="M32 56 h-14M32 60 h-14M32 64 h-13" stroke="var(--amber-dim)" strokeWidth="0.8" strokeLinecap="round" />
      <path d="M88 56 h14M88 60 h14M88 64 h13" stroke="var(--amber-dim)" strokeWidth="0.8" strokeLinecap="round" />

      {mood === "happy" ? (
        <>
          <path d="M44 53 q6 6 12 0" stroke="var(--amber)" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          <path d="M64 53 q6 6 12 0" stroke="var(--amber)" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          <path d="M52 65 q8 7 16 0" stroke="var(--amber)" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          <path d="M60 18 l3.5 7 7 1 -5 4.5 1 7 -6.5 -3.5 -6.5 3.5 1 -7 -5 -4.5 7 -1 z" fill="var(--red)" opacity="0.85" />
        </>
      ) : mood === "sad" ? (
        <>
          <path d="M45 55 q6 -6 11 -1" stroke="var(--amber)" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          <path d="M64 54 q6 -6 11 -1" stroke="var(--amber)" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          <path d="M51 70 q9 -6 17 0" stroke="var(--amber)" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx="49" cy="54" r="3.6" fill="var(--amber)" />
          <circle cx="71" cy="54" r="3.6" fill="var(--amber)" />
          <path d="M55 66 q5 4 10 0" stroke="var(--amber)" strokeWidth="1.8" fill="none" strokeLinecap="round" />
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
      releaseCat();
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
      if (!acquireCat()) return; // another cat easter egg is already out
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
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center">
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
