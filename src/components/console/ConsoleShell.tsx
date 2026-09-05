"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import clsx from "clsx";
import { resumeTracks, type ResumeTrackId } from "@/data/profile";
import { projects } from "@/data/projects";
import BootSequence from "./BootSequence";
import ModeSelect from "./ModeSelect";
import StatusStrip from "./StatusStrip";
import CommandPalette from "./CommandPalette";
import PeekingCat from "./PeekingCat";
import MouseChase from "./MouseChase";
import SoundToggle from "./SoundToggle";
import { playBlip } from "./sound";
import { SECTIONS, type Section } from "./section-config";
import Overview from "./sections/Overview";
import Experience from "./sections/Experience";
import Skills from "./sections/Skills";
import Projects from "./sections/Projects";
import Contact from "./sections/Contact";

export default function ConsoleShell() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialProject = searchParams.get("project");

  const [booted, setBooted] = useState(false);
  const [section, setSection] = useState<Section>(
    initialProject ? "projects" : "overview",
  );
  const [mode, setMode] = useState<ResumeTrackId>("general");
  const [selectedProject, setSelectedProject] = useState<string | null>(
    initialProject && projects.some((p) => p.slug === initialProject)
      ? initialProject
      : (projects[0]?.slug ?? null),
  );
  const [paletteOpen, setPaletteOpen] = useState(false);

  const selectProject = useCallback(
    (slug: string) => {
      playBlip();
      setSelectedProject(slug);
      setSection("projects");
      const params = new URLSearchParams(searchParams.toString());
      params.set("project", slug);
      router.replace(`/?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  const goToSection = useCallback((s: Section) => {
    playBlip();
    setSection(s);
    setPaletteOpen(false);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
      if (e.key === "Escape") setPaletteOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const activeTrack = useMemo(
    () => resumeTracks.find((t) => t.id === mode) ?? resumeTracks[0],
    [mode],
  );

  if (!booted) {
    return <BootSequence onDone={() => setBooted(true)} />;
  }

  return (
    <div className="flex min-h-dvh flex-col md:flex-row">
      <aside className="hairline-strong flex shrink-0 flex-row items-center justify-between gap-3 overflow-y-auto border-x-0 border-t-0 px-4 py-3 scrollbar-thin md:w-60 md:flex-col md:items-stretch md:justify-start md:border-b-0 md:border-r md:px-5 md:py-6">
        <button
          type="button"
          onClick={() => goToSection("overview")}
          className="flex items-center gap-2 transition active:scale-95 md:mb-8"
          aria-label="Go to overview"
        >
          <span className="h-2 w-2 rounded-full bg-[var(--green)] animate-blink" />
          <span className="font-mono-tech text-xs tracking-[0.2em] text-[var(--fg-muted)]">
            JB-01
          </span>
        </button>

        <nav className="hidden md:flex md:flex-col md:gap-1">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => goToSection(s.id)}
              className={clsx(
                "flex items-center justify-between rounded px-3 py-2 text-left font-mono-tech text-sm tracking-wide transition active:scale-[0.97]",
                section === s.id
                  ? "bg-[var(--amber)]/10 text-[var(--amber)]"
                  : "text-[var(--fg-muted)] hover:bg-white/5 hover:text-[var(--fg)]",
              )}
            >
              <span>{s.label}</span>
              <span className="text-[var(--fg-dim)]">{s.hint}</span>
            </button>
          ))}
        </nav>

        <nav className="flex gap-1 md:hidden">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => goToSection(s.id)}
              className={clsx(
                "rounded px-2.5 py-1.5 font-mono-tech text-xs tracking-wide transition active:scale-95",
                section === s.id
                  ? "bg-[var(--amber)]/10 text-[var(--amber)]"
                  : "text-[var(--fg-muted)]",
              )}
            >
              {s.label}
            </button>
          ))}
        </nav>

        <div className="hidden md:mt-auto md:flex md:flex-col md:gap-6">
          <ModeSelect mode={mode} onChange={setMode} />
          <StatusStrip />
          <SoundToggle />
          <a
            href="https://github.com/JacksonBopp/portfolio"
            target="_blank"
            rel="noreferrer"
            className="font-mono-tech text-[11px] text-[var(--fg-dim)] transition hover:text-[var(--fg-muted)]"
          >
            view source ↗
          </a>
        </div>
      </aside>

      <main className="relative flex-1 overflow-y-auto px-5 py-8 sm:px-10 sm:py-12">
        <button
          type="button"
          onClick={() => setPaletteOpen(true)}
          className="hairline absolute right-5 top-5 hidden items-center gap-2 rounded px-3 py-1.5 font-mono-tech text-xs text-[var(--fg-muted)] transition active:scale-95 hover:text-[var(--fg)] sm:flex"
        >
          <span>Search</span>
          <kbd className="rounded border border-[var(--hairline-strong)] px-1.5 py-0.5 text-[10px]">
            ⌘K
          </kbd>
        </button>

        <div className="mx-auto max-w-[min(92vw,1400px)]">
          <AnimatePresence mode="wait">
            <motion.div
              key={section}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            >
              {section === "overview" && (
                <Overview mode={mode} onSelectProject={selectProject} />
              )}
              {section === "experience" && <Experience />}
              {section === "skills" && <Skills mode={mode} />}
              {section === "projects" && (
                <Projects
                  mode={mode}
                  selectedSlug={selectedProject}
                  onSelect={selectProject}
                />
              )}
              {section === "contact" && <Contact track={activeTrack} />}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mx-auto mt-10 flex max-w-4xl flex-col gap-6 md:hidden">
          <ModeSelect mode={mode} onChange={setMode} />
          <StatusStrip />
          <SoundToggle />
          <a
            href="https://github.com/JacksonBopp/portfolio"
            target="_blank"
            rel="noreferrer"
            className="font-mono-tech text-[11px] text-[var(--fg-dim)] transition hover:text-[var(--fg-muted)]"
          >
            view source ↗
          </a>
        </div>
      </main>

      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onGoToSection={goToSection}
        onSelectProject={selectProject}
      />

      <PeekingCat />
      <MouseChase />
    </div>
  );
}
