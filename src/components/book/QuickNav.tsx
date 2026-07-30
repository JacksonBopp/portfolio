"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import clsx from "clsx";

export type NavSection = { label: string; short: string; page: number };

type QuickNavProps = {
  sections: NavSection[];
  activePage: number;
  onNavigate: (page: number) => void;
};

export default function QuickNav({
  sections,
  activePage,
  onNavigate,
}: QuickNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Desktop: fixed side tabs, always visible */}
      <nav
        aria-label="Jump to section"
        className="fixed right-3 top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-2 lg:flex"
      >
        {sections.map((section) => {
          const active = section.page === activePage;
          return (
            <motion.button
              key={section.label}
              type="button"
              onClick={() => onNavigate(section.page)}
              whileHover={{ x: -4 }}
              whileTap={{ scale: 0.94 }}
              aria-label={`Go to ${section.label}`}
              aria-current={active ? "true" : undefined}
              className={clsx(
                "group relative flex h-9 w-9 items-center justify-center rounded-full border font-sans text-[11px] font-semibold tracking-wide backdrop-blur-sm transition-colors",
                active
                  ? "border-[var(--gold-bright)] bg-[var(--gold)]/20 text-[var(--gold-bright)]"
                  : "border-[var(--gold)]/25 bg-black/10 text-[var(--scene-muted)] hover:border-[var(--gold)]/60 hover:text-[var(--gold-bright)]",
              )}
            >
              {section.short}
              <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-md border border-[var(--gold)]/25 bg-[var(--scene-bg-1)] px-2.5 py-1 text-xs text-[var(--scene-fg)] opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100">
                {section.label}
              </span>
            </motion.button>
          );
        })}
      </nav>

      {/* Mobile / tablet: floating button that expands a menu */}
      <div className="fixed bottom-5 right-5 z-20 flex flex-col items-end gap-2 lg:hidden">
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.95 }}
              transition={{ duration: 0.18 }}
              className="flex max-h-[60dvh] flex-col gap-1 overflow-y-auto rounded-2xl border border-[var(--gold)]/25 bg-[var(--scene-bg-1)]/95 p-2 shadow-2xl backdrop-blur-sm"
            >
              {sections.map((section) => {
                const active = section.page === activePage;
                return (
                  <button
                    key={section.label}
                    type="button"
                    onClick={() => {
                      onNavigate(section.page);
                      setOpen(false);
                    }}
                    className={clsx(
                      "rounded-lg px-3 py-2 text-left font-sans text-sm tracking-wide transition-colors",
                      active
                        ? "bg-[var(--gold)]/20 text-[var(--gold-bright)]"
                        : "text-[var(--scene-muted)] hover:bg-[var(--gold)]/10 hover:text-[var(--gold-bright)]",
                    )}
                  >
                    {section.label}
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          type="button"
          onClick={() => setOpen((v) => !v)}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          aria-label={open ? "Close section menu" : "Open section menu"}
          aria-expanded={open}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--gold)]/40 bg-[var(--scene-bg-1)] text-[var(--gold-bright)] shadow-xl"
        >
          <motion.span
            animate={{ rotate: open ? 45 : 0 }}
            className="font-display text-2xl leading-none"
          >
            +
          </motion.span>
        </motion.button>
      </div>
    </>
  );
}
