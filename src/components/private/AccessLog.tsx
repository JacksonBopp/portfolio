"use client";

import { useEffect, useState, useTransition } from "react";
import { fetchRecentAttempts } from "@/app/[gate]/actions";
import type { GateAttempt } from "@/lib/gateAttempts";

export default function AccessLog() {
  const [attempts, setAttempts] = useState<GateAttempt[]>([]);
  const [, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      setAttempts(await fetchRecentAttempts());
    });
  }, []);

  if (attempts.length === 0) return null;

  return (
    <div className="hairline rounded p-4">
      <span className="font-mono-tech text-[10px] uppercase tracking-[0.2em] text-[var(--fg-dim)]">
        Recent wrong-password attempts
      </span>
      <ul className="mt-2 flex flex-col gap-1">
        {attempts.map((a) => (
          <li key={a.id} className="font-mono-tech text-xs text-[var(--fg-muted)]">
            {new Date(a.attemptedAt).toLocaleString()} · {a.ip} · {a.userAgent}
          </li>
        ))}
      </ul>
    </div>
  );
}
