"use client";

import { useEffect, useState, useTransition } from "react";
import { fetchStatus, updateStatus } from "@/app/[gate]/actions";

export default function StatusEditor() {
  const [text, setText] = useState("");
  const [saved, setSaved] = useState(false);
  const [, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      setText(await fetchStatus());
    });
  }, []);

  function handleSave() {
    startTransition(async () => {
      await updateStatus(text);
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    });
  }

  return (
    <div className="hairline rounded p-5" style={{ fontFamily: "var(--font-kalam)" }}>
      <span className="font-mono-tech text-[10px] uppercase tracking-[0.2em] text-[var(--fg-dim)]">
        Status (shown publicly as &quot;Currently&quot;)
      </span>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={2}
        className="hairline mt-2 w-full resize-none rounded bg-transparent px-2 py-1.5 text-base outline-none focus:border-[var(--cyan-dim)]"
      />
      <div className="mt-2 flex items-center gap-3">
        <button
          onClick={handleSave}
          className="hairline-strong rounded px-3 py-1.5 font-mono-tech text-sm text-[var(--amber)] hover:bg-[var(--amber)]/10"
        >
          Save
        </button>
        {saved && <span className="text-sm text-[var(--fg-muted)]">saved</span>}
      </div>
    </div>
  );
}
