import { forwardRef } from "react";
import { motion } from "motion/react";
import Page from "../Page";
import { profile } from "@/data/profile";

export type TocEntry = { label: string; page: number; note?: string };

type TitlePageProps = {
  entries: TocEntry[];
  onNavigate: (page: number) => void;
  pageNumber?: number;
};

const TitlePage = forwardRef<HTMLDivElement, TitlePageProps>(
  function TitlePage({ entries, onNavigate, pageNumber }, ref) {
    return (
      <Page ref={ref} pageNumber={pageNumber}>
        <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          Contents
        </p>
        <h2 className="mt-1 font-display text-2xl font-semibold text-ink sm:text-3xl">
          {profile.name}&rsquo;s Portfolio
        </h2>
        <div className="my-5 h-px w-12 bg-[var(--ink-muted)]/30" />

        <ol className="flex flex-1 flex-col gap-1">
          {entries.map((entry, i) => (
            <li key={entry.label}>
              <motion.button
                type="button"
                onClick={() => onNavigate(entry.page)}
                whileHover={{ x: 3 }}
                whileTap={{ scale: 0.98 }}
                className="group flex w-full cursor-pointer items-baseline gap-2 rounded px-1 py-2 text-left font-serif text-ink transition-colors hover:bg-[var(--paper-shade)]/60"
              >
                <span className="font-sans text-xs text-[var(--ink-muted)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex-1 text-[15px] group-hover:text-accent sm:text-base">
                  {entry.label}
                  {entry.note && (
                    <span className="ml-2 font-sans text-xs italic text-[var(--ink-muted)]">
                      {entry.note}
                    </span>
                  )}
                </span>
                <span className="flex-1 border-b border-dotted border-[var(--ink-muted)]/40 self-end mb-1.5" />
                <span className="font-sans text-xs tabular-nums text-[var(--ink-muted)]">
                  {entry.page + 1}
                </span>
              </motion.button>
            </li>
          ))}
        </ol>

        <p className="mt-4 font-sans text-[11px] text-[var(--ink-muted)]">
          Tip: use the arrow keys, swipe, or the buttons below to turn pages.
        </p>
      </Page>
    );
  },
);

export default TitlePage;
