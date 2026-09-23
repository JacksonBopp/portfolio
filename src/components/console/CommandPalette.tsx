"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";
import { projects } from "@/data/projects";
import { SECTIONS, type Section } from "./section-config";

type PaletteItem = {
  key: string;
  label: string;
  sublabel?: string;
  onSelect: () => void;
};

type CommandPaletteProps = {
  open: boolean;
  onClose: () => void;
  onGoToSection: (section: Section) => void;
  onSelectProject: (slug: string) => void;
};

export default function CommandPalette({
  open,
  onClose,
  onGoToSection,
  onSelectProject,
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [highlight, setHighlight] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const items: PaletteItem[] = useMemo(
    () => [
      ...SECTIONS.map((s) => ({
        key: `section:${s.id}`,
        label: s.label,
        sublabel: "section",
        onSelect: () => onGoToSection(s.id),
      })),
      ...projects.map((p) => ({
        key: `project:${p.slug}`,
        label: p.name,
        sublabel: p.blurb,
        onSelect: () => onSelectProject(p.slug),
      })),
    ],
    [onGoToSection, onSelectProject],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.sublabel?.toLowerCase().includes(q),
    );
  }, [items, query]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setHighlight(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  useEffect(() => {
    setHighlight(0);
  }, [query]);

  const hadCat = useRef(false);
  const hadCatFall = useRef(false);
  const hadCatChase = useRef(false);
  useEffect(() => {
    const q = query.toLowerCase();
    const hasCatFall = q.includes("cat fall");
    const hasCatChase = q.includes("cat chase");
    const hasCat = q.includes("cat");

    if (hasCatFall && !hadCatFall.current) {
      window.dispatchEvent(new Event("cat:fall"));
    } else if (hasCatChase && !hadCatChase.current) {
      window.dispatchEvent(new Event("cat:chase"));
    } else if (hasCat && !hasCatFall && !hasCatChase && !hadCat.current) {
      window.dispatchEvent(new Event("cat:summon"));
    }

    hadCat.current = hasCat;
    hadCatFall.current = hasCatFall;
    hadCatChase.current = hasCatChase;
  }, [query]);

  if (!open) return null;

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => Math.min(h + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = filtered[highlight];
      if (item) {
        item.onSelect();
        onClose();
      }
    } else if (e.key === "Escape") {
      onClose();
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 pt-24"
      onClick={onClose}
    >
      <div
        className="hairline-strong w-full max-w-lg rounded-lg bg-[var(--panel-raised)] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Jump to a section or project…"
          className="w-full border-b border-[var(--hairline)] bg-transparent px-4 py-3 font-mono-tech text-sm text-[var(--fg)] outline-none placeholder:text-[var(--fg-dim)]"
        />
        <ul className="max-h-80 overflow-y-auto scrollbar-thin py-1">
          {filtered.length === 0 && (
            <li className="px-4 py-3 font-mono-tech text-sm text-[var(--fg-dim)]">
              No matches
            </li>
          )}
          {filtered.map((item, i) => (
            <li key={item.key}>
              <button
                type="button"
                onClick={() => {
                  item.onSelect();
                  onClose();
                }}
                onMouseEnter={() => setHighlight(i)}
                className={clsx(
                  "flex w-full flex-col gap-0.5 px-4 py-2 text-left transition-colors",
                  i === highlight ? "bg-white/5" : "",
                )}
              >
                <span className="font-mono-tech text-sm text-[var(--fg)]">
                  {item.label}
                </span>
                {item.sublabel && (
                  <span className="truncate text-xs text-[var(--fg-dim)]">
                    {item.sublabel}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
