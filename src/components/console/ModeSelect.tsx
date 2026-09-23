"use client";

import clsx from "clsx";
import { resumeTracks, type ResumeTrackId } from "@/data/profile";
import { playBlip } from "./sound";

type ModeSelectProps = {
  mode: ResumeTrackId;
  onChange: (mode: ResumeTrackId) => void;
};

export default function ModeSelect({ mode, onChange }: ModeSelectProps) {
  const activeTrack = resumeTracks.find((t) => t.id === mode) ?? resumeTracks[0];

  return (
    <div className="flex flex-col gap-2">
      <span className="font-mono-tech text-[10px] uppercase tracking-[0.2em] text-[var(--fg-dim)]">
        Resume track
      </span>
      <div className="flex flex-wrap gap-1.5 md:flex-col">
        {resumeTracks.map((track) => {
          const active = track.id === mode;
          return (
            <button
              key={track.id}
              type="button"
              onClick={() => {
                playBlip();
                onChange(track.id);
              }}
              aria-pressed={active}
              title={track.blurb}
              className={clsx(
                "rounded px-2.5 py-1.5 text-left font-mono-tech text-xs tracking-wide transition active:scale-95",
                active
                  ? "bg-[var(--cyan)]/10 text-[var(--cyan)] hairline"
                  : "text-[var(--fg-muted)] hover:bg-white/5 hover:text-[var(--fg)]",
              )}
            >
              {track.label}
            </button>
          );
        })}
      </div>
      <a
        href={activeTrack.file}
        target="_blank"
        rel="noreferrer"
        className="mt-0.5 inline-flex w-fit items-center gap-1 font-mono-tech text-[11px] text-[var(--amber)] hover:underline"
      >
        View {activeTrack.label} résumé ↗
      </a>
    </div>
  );
}
