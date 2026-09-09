"use client";

import { useEffect, useState, useTransition } from "react";
import { fetchCatCare, markCatFed, markCatWatered } from "@/app/[gate]/actions";

function timeSince(iso: string | null): string {
  if (!iso) return "never";
  const ms = Date.now() - new Date(iso).getTime();
  if (ms < 60_000) return "just now";
  const minutes = Math.floor(ms / 60_000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

// Ronnie: a real gray tabby, so this one breaks from the site's amber/cyan
// palette on purpose and uses his actual coloring instead, since this
// panel is only ever seen by the one person who knows what he looks like.
function SleepingCatSvg() {
  const fur = "#8a8171";
  const furDark = "#6b6255";
  const stripe = "#3c362c";
  const ear = "#c99283";

  return (
    <svg width="140" height="78" viewBox="0 0 160 90" xmlns="http://www.w3.org/2000/svg">
      {/* bed */}
      <ellipse cx="80" cy="78" rx="76" ry="10" fill="none" stroke="var(--hairline-strong)" strokeWidth="2" />

      {/* body, one continuous curled silhouette (fill only, no stroke, so it
          reads as a single curled shape rather than glued-together pieces) */}
      <ellipse cx="90" cy="50" rx="50" ry="23" fill={fur} />
      <ellipse cx="94" cy="60" rx="32" ry="10" fill={furDark} opacity="0.3" />

      {/* body stripes, spread across the whole back following its curve */}
      <path d="M56 36 q4 7 0 15" stroke={stripe} strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <path d="M68 31 q5 11 0 23" stroke={stripe} strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <path d="M80 28 q5 13 0 26" stroke={stripe} strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <path d="M92 27 q5 13 0 27" stroke={stripe} strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <path d="M104 29 q5 12 0 24" stroke={stripe} strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <path d="M116 34 q4 9 0 19" stroke={stripe} strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M126 40 q3 6 0 13" stroke={stripe} strokeWidth="1.8" fill="none" strokeLinecap="round" />

      {/* head, overlapping the body generously so no seam shows */}
      <ellipse cx="40" cy="44" rx="20" ry="17" fill={fur} />

      {/* ears, simple triangles tilted slightly outward for a relaxed,
          laid-back sleeping look rather than upright and alert */}
      <polygon points="24,32 35,32 27,15" fill={fur} />
      <polygon points="26,29 33,29 28,20" fill={ear} />
      <polygon points="43,30 54,30 51,12" fill={fur} />
      <polygon points="45,27 52,27 49.5,18" fill={ear} />

      {/* forehead "M" tabby marking */}
      <path
        d="M28 32 L32 38 L36 32 L40 38 L44 32"
        stroke={stripe}
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* whiskers */}
      <path d="M18 45 h-11M18 49 h-12M19 53 h-10" stroke={furDark} strokeWidth="0.8" strokeLinecap="round" />

      {/* closed, sleepy eyes, greenish like the real thing */}
      <path d="M27 44 q5 4 10 0.5" stroke="#7a9463" strokeWidth="1.7" fill="none" strokeLinecap="round" />
      <path d="M41 44.5 q5 4 10 0.5" stroke="#7a9463" strokeWidth="1.7" fill="none" strokeLinecap="round" />
      {/* nose */}
      <path d="M36 52 l4 0 -2 2.5 z" fill={ear} />

      {/* front paws, tucked in front of the chest */}
      <ellipse cx="56" cy="66" rx="10" ry="7" fill={fur} />
      <ellipse cx="72" cy="68" rx="10" ry="7" fill={fur} />

      {/* tail, curled from the haunch around over the front paws, drawn last
          so it visibly rests on top instead of hiding behind the body */}
      <path
        d="M124 56 C 122 70 100 80 72 78 C 64 77 58 74 54 67"
        stroke={furDark}
        strokeWidth="11"
        strokeLinecap="round"
        fill="none"
      />
      <path d="M112 68 l2 5M88 79 l0 5.5M65 76 l-2 5" stroke={stripe} strokeWidth="2.2" strokeLinecap="round" />

      {/* zzz */}
      <text x="94" y="26" fill="var(--fg-dim)" fontSize="10" fontFamily="var(--font-kalam)">
        z
      </text>
      <text x="103" y="17" fill="var(--fg-dim)" fontSize="13" fontFamily="var(--font-kalam)">
        z
      </text>
      <text x="114" y="6" fill="var(--fg-dim)" fontSize="16" fontFamily="var(--font-kalam)">
        z
      </text>
    </svg>
  );
}

function BowlIcon({ kind }: { kind: "food" | "water" }) {
  return (
    <svg width="28" height="20" viewBox="0 0 28 20" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="14" cy="14" rx="12" ry="5" fill="none" stroke="var(--fg-dim)" strokeWidth="1.5" />
      {kind === "food" ? (
        <>
          <circle cx="9" cy="12" r="2" fill="var(--amber)" />
          <circle cx="14" cy="10.5" r="2" fill="var(--amber)" />
          <circle cx="19" cy="12" r="2" fill="var(--amber)" />
        </>
      ) : (
        <path d="M8 11 q6 -5 12 0" stroke="var(--cyan)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      )}
    </svg>
  );
}

export default function SleepingCat() {
  const [care, setCare] = useState<{ lastFed: string | null; lastWatered: string | null }>({
    lastFed: null,
    lastWatered: null,
  });
  const [, tick] = useState(0);
  const [, startTransition] = useTransition();

  function reload() {
    startTransition(async () => {
      setCare(await fetchCatCare());
    });
  }

  useEffect(() => {
    reload();
    const id = setInterval(() => tick((n) => n + 1), 30_000);
    return () => clearInterval(id);
  }, []);

  function feed() {
    startTransition(async () => {
      await markCatFed();
      reload();
    });
  }

  function water() {
    startTransition(async () => {
      await markCatWatered();
      reload();
    });
  }

  return (
    <div className="hairline rounded p-5" style={{ fontFamily: "var(--font-kalam)" }}>
      <span className="font-mono-tech text-[10px] uppercase tracking-[0.2em] text-[var(--fg-dim)]">
        Ronnie
      </span>
      <div className="mt-2 flex items-center justify-center">
        <SleepingCatSvg />
      </div>
      <div className="mt-3 flex justify-center gap-8">
        <button onClick={feed} className="flex flex-col items-center gap-1 hover:opacity-80">
          <BowlIcon kind="food" />
          <span className="text-sm text-[var(--fg-muted)]">fed {timeSince(care.lastFed)}</span>
        </button>
        <button onClick={water} className="flex flex-col items-center gap-1 hover:opacity-80">
          <BowlIcon kind="water" />
          <span className="text-sm text-[var(--fg-muted)]">watered {timeSince(care.lastWatered)}</span>
        </button>
      </div>
    </div>
  );
}
