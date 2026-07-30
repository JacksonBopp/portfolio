"use client";

import { forwardRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Page from "../Page";
import { profile } from "@/data/profile";

export type TocLeaf = { label: string; page: number };

type TitlePageProps = {
  about: TocLeaf;
  skills: TocLeaf;
  projects: TocLeaf[];
  contact: TocLeaf;
  onNavigate: (page: number) => void;
  pageNumber?: number;
};

function TocRow({
  index,
  label,
  onClick,
  note,
}: {
  index: string;
  label: string;
  onClick: () => void;
  note?: string;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ x: 3 }}
      whileTap={{ scale: 0.98 }}
      className="group flex w-full cursor-pointer items-baseline gap-2 rounded px-1 py-2 text-left font-serif text-ink transition-colors hover:bg-[var(--paper-shade)]/60"
    >
      <span className="font-sans text-xs text-[var(--ink-muted)]">{index}</span>
      <span className="flex-1 text-[15px] group-hover:text-[var(--page-accent,var(--accent))] sm:text-base">
        {label}
        {note && (
          <span className="ml-2 font-sans text-xs italic text-[var(--ink-muted)]">
            {note}
          </span>
        )}
      </span>
      <span className="mb-1.5 h-px flex-1 self-end border-b border-dotted border-[var(--ink-muted)]/40" />
    </motion.button>
  );
}

const TitlePage = forwardRef<HTMLDivElement, TitlePageProps>(
  function TitlePage(
    { about, skills, projects, contact, onNavigate, pageNumber },
    ref,
  ) {
    const [expanded, setExpanded] = useState(false);

    return (
      <Page ref={ref} pageNumber={pageNumber}>
        <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          Contents
        </p>
        <h2 className="mt-1 font-display text-2xl font-semibold text-ink sm:text-3xl">
          {profile.name}&rsquo;s Portfolio
        </h2>
        <div className="my-5 h-px w-12 bg-[var(--ink-muted)]/30" />

        <div className="flex flex-1 flex-col gap-0.5">
          <TocRow index="01" label={about.label} onClick={() => onNavigate(about.page)} />
          <TocRow index="02" label={skills.label} onClick={() => onNavigate(skills.page)} />

          <motion.button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            whileTap={{ scale: 0.98 }}
            aria-expanded={expanded}
            className="group flex w-full cursor-pointer items-baseline gap-2 rounded px-1 py-2 text-left font-serif text-ink transition-colors hover:bg-[var(--paper-shade)]/60"
          >
            <span className="font-sans text-xs text-[var(--ink-muted)]">03</span>
            <span className="flex-1 text-[15px] group-hover:text-[var(--page-accent,var(--accent))] sm:text-base">
              Projects
              <span className="ml-2 font-sans text-xs italic text-[var(--ink-muted)]">
                {projects.length} entries
              </span>
            </span>
            <motion.span
              animate={{ rotate: expanded ? 90 : 0 }}
              transition={{ duration: 0.2 }}
              aria-hidden
              className="font-sans text-xs text-[var(--ink-muted)]"
            >
              &#10148;
            </motion.span>
          </motion.button>

          <AnimatePresence initial={false}>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="overflow-hidden pl-6"
              >
                {projects.map((project, i) => (
                  <TocRow
                    key={project.label}
                    index={String.fromCharCode(97 + i)}
                    label={project.label}
                    onClick={() => onNavigate(project.page)}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <TocRow index="04" label={contact.label} onClick={() => onNavigate(contact.page)} />
        </div>

        <p className="mt-4 font-sans text-[11px] text-[var(--ink-muted)]">
          Tip: use the arrow keys, swipe, or the buttons below to turn pages.
        </p>
      </Page>
    );
  },
);

export default TitlePage;
