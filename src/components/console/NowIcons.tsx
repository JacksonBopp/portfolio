"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

export type NowIconKey =
  | "moba"
  | "storm"
  | "pickaxe"
  | "drift"
  | "circuitEye"
  | "psychicSwirl"
  | "occultEye";

function IconFrame({
  children,
  label,
}: {
  children: ReactNode;
  label: string;
}) {
  return (
    <motion.span
      aria-hidden="true"
      title={label}
      className="inline-flex h-4 w-4 shrink-0 items-center justify-center text-[var(--amber)]"
      whileHover={{ scale: 1.35, rotate: 8 }}
      transition={{ type: "spring", stiffness: 400, damping: 12 }}
    >
      <svg
        viewBox="0 0 24 24"
        width="14"
        height="14"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {children}
      </svg>
    </motion.span>
  );
}

// League of Legends: a crossed-blades / shield motif for a MOBA.
function MobaIcon() {
  return (
    <IconFrame label="MOBA">
      <path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
      <path d="M9 12l3-3 3 3-3 3-3-3z" />
    </IconFrame>
  );
}

// Risk of Rain 2: rain + a burst, for the roguelike storm-of-loot chaos.
function StormIcon() {
  return (
    <IconFrame label="Roguelike">
      <path d="M6 10a4 4 0 0 1 7.75-1.5A3.5 3.5 0 0 1 17 15H7a3 3 0 0 1-1-5.9z" />
      <path d="M9 17l-1 3M13 17l-1 3M17 17l-1 3" />
    </IconFrame>
  );
}

// Terraria: a pickaxe, for the sandbox-mining loop.
function PickaxeIcon() {
  return (
    <IconFrame label="Sandbox">
      <path d="M4 9c3-3.5 7-5 11-5 1 2-1.5 6-5 9" />
      <path d="M9.5 12.5L4 18l1.5 1.5L11 14" />
    </IconFrame>
  );
}

// Sonny Boy: kids adrift between worlds, a compass with a wandering needle.
function DriftIcon() {
  return (
    <IconFrame label="Drift anime">
      <circle cx="12" cy="12" r="8" />
      <path d="M14.5 9.5L12 12l-4 4 2.5-6.5L15 8l-0.5 1.5z" />
    </IconFrame>
  );
}

// Ergo Proxy: a mechanical eye, for the cyberpunk android mystery.
function CircuitEyeIcon() {
  return (
    <IconFrame label="Cyberpunk anime">
      <path d="M2 12s4-5 10-5 10 5 10 5-4 5-10 5-10-5-10-5z" />
      <circle cx="12" cy="12" r="2.5" />
      <path d="M12 4.5V2M19.5 12H22M12 19.5V22M2 12h2.5" />
    </IconFrame>
  );
}

// Saiki K: a psychic swirl, for the deadpan-psychic comedy.
function PsychicSwirlIcon() {
  return (
    <IconFrame label="Comedy anime">
      <path d="M12 3a9 9 0 1 0 9 9" />
      <path d="M12 7a5 5 0 1 0 5 5" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
    </IconFrame>
  );
}

// Lord of Mysteries: an open book with a watching eye, for the occult mystery.
function OccultEyeIcon() {
  return (
    <IconFrame label="Mystery novel">
      <path d="M3 5.5c2.5-1 5-1 7 .5v13c-2-1.5-4.5-1.5-7-.5v-13z" />
      <path d="M21 5.5c-2.5-1-5-1-7 .5v13c2-1.5 4.5-1.5 7-.5v-13z" />
      <circle cx="12" cy="10" r="1.4" />
    </IconFrame>
  );
}

const ICONS: Record<NowIconKey, () => ReactNode> = {
  moba: MobaIcon,
  storm: StormIcon,
  pickaxe: PickaxeIcon,
  drift: DriftIcon,
  circuitEye: CircuitEyeIcon,
  psychicSwirl: PsychicSwirlIcon,
  occultEye: OccultEyeIcon,
};

export default function NowIcon({ icon }: { icon?: NowIconKey }) {
  if (!icon) return null;
  const Icon = ICONS[icon];
  return <Icon />;
}
