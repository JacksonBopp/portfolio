"use client";

import { useEffect, useState } from "react";
import { profile } from "@/data/profile";

type NowPlaying = {
  isPlaying: boolean;
  title: string;
  artist: string;
  url: string;
};

const POLL_MS = 30_000;

export default function SpotifyNowPlaying() {
  const [track, setTrack] = useState<NowPlaying | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      try {
        const res = await fetch("/api/now-playing", { cache: "no-store" });
        const data: NowPlaying = await res.json();
        if (!cancelled) {
          setTrack(data);
        }
      } catch {
        if (!cancelled) {
          setTrack(null);
        }
      }
    }

    poll();
    const id = setInterval(poll, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  if (track?.isPlaying && track.title) {
    return (
      <a
        href={track.url || profile.links.spotify}
        target="_blank"
        rel="noreferrer"
        className="text-sm text-[var(--cyan)] hover:underline"
      >
        {track.title} · {track.artist}
      </a>
    );
  }

  return (
    <a
      href={profile.links.spotify}
      target="_blank"
      rel="noreferrer"
      className="text-sm text-[var(--fg-muted)] hover:underline"
    >
      Not playing right now
    </a>
  );
}
