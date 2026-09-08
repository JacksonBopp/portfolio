"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { releaseCat, requestCatSlot } from "./catActivity";
import { CAT_EAR_INNER, CAT_EYE, CAT_FUR, CAT_FUR_DARK, CAT_HIGHLIGHT } from "./catPalette";

type Mood = "neutral" | "happy" | "sad";
type Phase = "idle" | "sitting" | "jumping" | "leaving";

const PET_TIMEOUT_MS = 30_000;
const SPIN_THRESHOLD_RAD = Math.PI * 2; // one full revolution around the cat

function SittingCatFace({ mood }: { mood: Mood }) {
  return (
    <svg width="104" height="104" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      {/* tail, curled in close and fluffy */}
      <path
        d="M86 94 C102 90 102 72 90 64 C96 74 94 86 80 92"
        fill={CAT_FUR}
      />
      {/* body, chubby "loaf" shape */}
      <ellipse cx="60" cy="90" rx="34" ry="22" fill={CAT_FUR} />
      {/* belly shading */}
      <ellipse cx="60" cy="98" rx="20" ry="10" fill={CAT_FUR_DARK} opacity="0.5" />
      {/* front paws, tucked in close */}
      <ellipse cx="48" cy="108" rx="9" ry="7.5" fill={CAT_FUR} />
      <ellipse cx="70" cy="108" rx="9" ry="7.5" fill={CAT_FUR} />
      {/* ears, small and rounded */}
      <path d="M30 38 Q28 18 40 12 Q46 22 42 40 Z" fill={CAT_FUR} />
      <path d="M34 34 Q34 22 40 18 Q42 26 40 35 Z" fill={CAT_EAR_INNER} />
      <path d="M90 38 Q92 18 80 12 Q74 22 78 40 Z" fill={CAT_FUR} />
      <path d="M86 34 Q86 22 80 18 Q78 26 80 35 Z" fill={CAT_EAR_INNER} />
      {/* head, big and round for a cuter look */}
      <circle cx="60" cy="56" r="34" fill={CAT_FUR} />
      {/* whiskers */}
      <path d="M30 58 h-13M30 62 h-14M31 66 h-12" stroke={CAT_FUR_DARK} strokeWidth="1" strokeLinecap="round" />
      <path d="M90 58 h13M90 62 h14M89 66 h12" stroke={CAT_FUR_DARK} strokeWidth="1" strokeLinecap="round" />
      {/* blush */}
      <circle cx="40" cy="66" r="5" fill={CAT_EAR_INNER} opacity="0.7" />
      <circle cx="80" cy="66" r="5" fill={CAT_EAR_INNER} opacity="0.7" />

      {mood === "happy" ? (
        <>
          <path d="M42 56 q7 7 14 0" stroke={CAT_EYE} strokeWidth="2.6" fill="none" strokeLinecap="round" />
          <path d="M64 56 q7 7 14 0" stroke={CAT_EYE} strokeWidth="2.6" fill="none" strokeLinecap="round" />
          <path d="M53 68 q7 6 14 0" stroke={CAT_EYE} strokeWidth="1.8" fill="none" strokeLinecap="round" />
          <path d="M60 8 l3.5 7 7 1 -5 4.5 1 7 -6.5 -3.5 -6.5 3.5 1 -7 -5 -4.5 7 -1 z" fill="var(--red)" opacity="0.9" />
        </>
      ) : mood === "sad" ? (
        <>
          <path d="M43 58 q7 -6 12 -1" stroke={CAT_EYE} strokeWidth="2.6" fill="none" strokeLinecap="round" />
          <path d="M65 57 q7 -6 12 -1" stroke={CAT_EYE} strokeWidth="2.6" fill="none" strokeLinecap="round" />
          <path d="M52 74 q8 -5 16 0" stroke={CAT_EYE} strokeWidth="1.8" fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx="47" cy="56" r="5.2" fill={CAT_EYE} />
          <circle cx="45.5" cy="54" r="1.5" fill={CAT_HIGHLIGHT} />
          <circle cx="73" cy="56" r="5.2" fill={CAT_EYE} />
          <circle cx="71.5" cy="54" r="1.5" fill={CAT_HIGHLIGHT} />
          <path d="M58 64 l2 2 2 -2" stroke={CAT_EYE} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M56 69 q4 3 8 0" stroke={CAT_EYE} strokeWidth="1.6" fill="none" strokeLinecap="round" />
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
      requestCatSlot(() => {
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
      });
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
