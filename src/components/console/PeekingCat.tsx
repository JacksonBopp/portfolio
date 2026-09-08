"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { acquireCat, releaseCat } from "./catActivity";
import { CAT_EAR_INNER, CAT_EYE, CAT_FUR, CAT_FUR_DARK, CAT_HIGHLIGHT } from "./catPalette";

type Position = "top-left" | "top-right" | "bottom-left" | "bottom-right" | "left" | "right";

const POSITIONS: Position[] = [
  "top-left",
  "top-right",
  "bottom-left",
  "bottom-right",
  "left",
  "right",
];

const CAT_HALF = 30;
const EDGE_OFFSET = 24;
const PROXIMITY_RADIUS = 150;

export function CatSilhouette({ dizzy = false }: { dizzy?: boolean } = {}) {
  return (
    <svg width="60" height="84" viewBox="0 0 70 100" xmlns="http://www.w3.org/2000/svg">
      {/* tail */}
      <path d="M56 82 C72 78 74 58 62 46" stroke={CAT_FUR} strokeWidth="8" strokeLinecap="round" fill="none" />
      {/* body */}
      <ellipse cx="35" cy="78" rx="20" ry="22" fill={CAT_FUR} />
      {/* belly shading */}
      <ellipse cx="35" cy="86" rx="13" ry="10" fill={CAT_FUR_DARK} opacity="0.5" />
      {/* paws */}
      <ellipse cx="24" cy="97" rx="7" ry="6" fill={CAT_FUR} />
      <ellipse cx="46" cy="97" rx="7" ry="6" fill={CAT_FUR} />
      {/* ears */}
      <polygon points="14,26 30,26 20,4" fill={CAT_FUR} />
      <polygon points="17,23 27,23 20,10" fill={CAT_EAR_INNER} />
      <polygon points="56,26 40,26 50,4" fill={CAT_FUR} />
      <polygon points="53,23 43,23 50,10" fill={CAT_EAR_INNER} />
      {/* head */}
      <path
        d="M12 22 H58 V38 C58 50 48 58 35 58 C22 58 12 50 12 38 Z"
        fill={CAT_FUR}
      />
      {/* eyes */}
      {dizzy ? (
        <>
          <path d="M20 37l8 6M28 37l-8 6" stroke={CAT_EYE} strokeWidth="2" strokeLinecap="round" />
          <path d="M42 37l8 6M50 37l-8 6" stroke={CAT_EYE} strokeWidth="2" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx="24" cy="40" r="4.2" fill={CAT_EYE} />
          <circle cx="22.6" cy="38.6" r="1.2" fill={CAT_HIGHLIGHT} />
          <circle cx="46" cy="40" r="4.2" fill={CAT_EYE} />
          <circle cx="44.6" cy="38.6" r="1.2" fill={CAT_HIGHLIGHT} />
        </>
      )}
      {/* nose */}
      <path d="M32 47 l3 2 -3 2 z" fill={CAT_EAR_INNER} />
    </svg>
  );
}

function edgeOf(position: Position): "top" | "bottom" | "left" | "right" {
  if (position === "left" || position === "right") return position;
  return position.startsWith("top") ? "top" : "bottom";
}

// Static orientation so the cat's "top" (ears) always leads into the screen from
// whichever edge it's peeking from.
function orientationTransform(position: Position): string {
  switch (position) {
    case "top-left":
      return "scaleX(1) scaleY(-1)";
    case "top-right":
      return "scaleX(-1) scaleY(-1)";
    case "bottom-left":
      return "scaleX(1) scaleY(1)";
    case "bottom-right":
      return "scaleX(-1) scaleY(1)";
    case "left":
      return "rotate(90deg)";
    case "right":
      return "rotate(-90deg)";
  }
}

function containerStyle(position: Position, visible: boolean): React.CSSProperties {
  const edge = edgeOf(position);

  if (edge === "top" || edge === "bottom") {
    const hiddenY = edge === "top" ? "-100%" : "100%";
    return {
      [edge]: "-20px",
      [position.endsWith("left") ? "left" : "right"]: "24px",
      transform: `translateY(${visible ? "0%" : hiddenY})`,
    } as React.CSSProperties;
  }

  const hiddenX = edge === "left" ? "-100%" : "100%";
  return {
    [edge]: "-20px",
    top: "50%",
    transform: `translateY(-50%) translateX(${visible ? "0%" : hiddenX})`,
  } as React.CSSProperties;
}

function anchorPoint(position: Position): { x: number; y: number } {
  const edge = edgeOf(position);
  if (edge === "top") return { x: position.endsWith("left") ? EDGE_OFFSET + CAT_HALF : window.innerWidth - EDGE_OFFSET - CAT_HALF, y: 40 };
  if (edge === "bottom") return { x: position.endsWith("left") ? EDGE_OFFSET + CAT_HALF : window.innerWidth - EDGE_OFFSET - CAT_HALF, y: window.innerHeight - 40 };
  if (edge === "left") return { x: 40, y: window.innerHeight / 2 };
  return { x: window.innerWidth - 40, y: window.innerHeight / 2 };
}

export default function PeekingCat() {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState<Position>("top-right");
  const hideTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const showTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const visibleRef = useRef(false);

  useEffect(() => {
    visibleRef.current = visible;
  }, [visible]);

  const scheduleNext = useCallback(() => {
    const delay = 10_000 + Math.random() * 15_000;
    showTimer.current = setTimeout(() => {
      if (!acquireCat()) {
        // Something else is out right now; try again shortly instead of
        // waiting for the next full random interval.
        showTimer.current = setTimeout(() => scheduleNext(), 3000);
        return;
      }
      setPosition(POSITIONS[Math.floor(Math.random() * POSITIONS.length)]);
      setVisible(true);
      hideTimer.current = setTimeout(retreat, 2800);
    }, delay);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const retreat = useCallback(() => {
    clearTimeout(hideTimer.current);
    setVisible(false);
    releaseCat();
    scheduleNext();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const summonNow = useCallback(() => {
    if (!acquireCat()) return; // another cat is already out
    clearTimeout(showTimer.current);
    clearTimeout(hideTimer.current);
    setPosition(POSITIONS[Math.floor(Math.random() * POSITIONS.length)]);
    setVisible(true);
    hideTimer.current = setTimeout(retreat, 2800);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let reducedMotion = false;
    try {
      reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch {
      // ignore
    }
    if (reducedMotion) return;

    scheduleNext();
    window.addEventListener("cat:summon", summonNow);

    function handleDismiss() {
      if (visibleRef.current) retreat();
    }
    window.addEventListener("cat:dismiss-peeking", handleDismiss);

    return () => {
      clearTimeout(showTimer.current);
      clearTimeout(hideTimer.current);
      window.removeEventListener("cat:summon", summonNow);
      window.removeEventListener("cat:dismiss-peeking", handleDismiss);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!visible) return;

    function handleMouseMove(e: MouseEvent) {
      const anchor = anchorPoint(position);
      const distance = Math.hypot(e.clientX - anchor.x, e.clientY - anchor.y);
      if (distance < PROXIMITY_RADIUS) {
        retreat();
      }
    }

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [visible, position, retreat]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed z-40 transition-transform duration-500 ease-out"
      style={containerStyle(position, visible)}
    >
      <div style={{ transform: orientationTransform(position) }}>
        <CatSilhouette />
      </div>
    </div>
  );
}
