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
    <svg width="120" height="70" viewBox="0 0 140 80" xmlns="http://www.w3.org/2000/svg">
      {/* bed */}
      <ellipse cx="70" cy="66" rx="66" ry="12" fill="none" stroke="var(--hairline-strong)" strokeWidth="2" />
      {/* tail, curled around the body, with a few tabby rings */}
      <path
        d="M110 58 C126 54 126 38 112 34"
        stroke={fur}
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
      />
      <path d="M113 56 l4 -3M116 49 l4.5 -2M116 42 l4.5 -1" stroke={stripe} strokeWidth="1.4" strokeLinecap="round" />
      {/* body, lying down */}
      <ellipse cx="70" cy="50" rx="46" ry="20" fill={fur} stroke={furDark} strokeWidth="0.8" />
      {/* body stripes */}
      <path d="M46 34 q4 8 0 16" stroke={stripe} strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M58 32 q5 10 0 20" stroke={stripe} strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M70 31 q5 11 0 22" stroke={stripe} strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M82 33 q5 10 0 20" stroke={stripe} strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* ears, pink inner */}
      <polygon points="24,34 36,34 28,20" fill={fur} stroke={furDark} strokeWidth="0.8" />
      <polygon points="26,32 33,32 28.5,24" fill={ear} />
      <polygon points="44,32 56,32 52,18" fill={fur} stroke={furDark} strokeWidth="0.8" />
      <polygon points="46,30 53,30 49.5,22" fill={ear} />
      {/* head */}
      <ellipse cx="38" cy="44" rx="18" ry="15" fill={fur} stroke={furDark} strokeWidth="0.8" />
      {/* forehead "M" tabby marking */}
      <path
        d="M30 33 l2 5 -2 4 M36 31 l0 5 M42 33 l-2 5 2 4"
        stroke={stripe}
        strokeWidth="1.3"
        fill="none"
        strokeLinecap="round"
      />
      {/* cheek stripes */}
      <path d="M22 46 l6 1M22 50 l6 0" stroke={stripe} strokeWidth="1.2" strokeLinecap="round" />
      <path d="M54 46 l-6 1M54 50 l-6 0" stroke={stripe} strokeWidth="1.2" strokeLinecap="round" />
      {/* closed eyes, greenish like the real thing */}
      <path d="M30 44 q4 3 8 0" stroke="#7a9463" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M42 44 q4 3 8 0" stroke="#7a9463" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* zzz */}
      <text x="86" y="24" fill="var(--fg-dim)" fontSize="10" fontFamily="var(--font-kalam)">
        z
      </text>
      <text x="94" y="16" fill="var(--fg-dim)" fontSize="13" fontFamily="var(--font-kalam)">
        z
      </text>
      <text x="104" y="7" fill="var(--fg-dim)" fontSize="16" fontFamily="var(--font-kalam)">
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
