"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import { projects, type Project } from "@/data/projects";
import type { ResumeTrackId } from "@/data/profile";
import OpenSourceTab from "./OpenSourceTab";
import AudioRecorderDiagram from "../diagrams/AudioRecorderDiagram";

const PROJECT_DIAGRAMS: Record<string, React.ComponentType> = {
  "fpga-audio-message-recorder": AudioRecorderDiagram,
};

const STATUS_STYLE: Record<Project["status"], string> = {
  deployed: "text-[var(--green)]",
  complete: "text-[var(--cyan)]",
  archived: "text-[var(--fg-dim)]",
};

type Tab = "projects" | "open-source";

type ProjectsProps = {
  mode: ResumeTrackId;
  selectedSlug: string | null;
  onSelect: (slug: string) => void;
};

export default function Projects({ mode, selectedSlug, onSelect }: ProjectsProps) {
  const [tab, setTab] = useState<Tab>("projects");
  const active = projects.find((p) => p.slug === selectedSlug) ?? projects[0];

  useEffect(() => {
    setTab("projects");
  }, [selectedSlug]);

  function handleKeyDown(e: React.KeyboardEvent) {
    const currentIndex = projects.findIndex((p) => p.slug === active.slug);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = projects[Math.min(currentIndex + 1, projects.length - 1)];
      onSelect(next.slug);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prev = projects[Math.max(currentIndex - 1, 0)];
      onSelect(prev.slug);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-xl font-semibold text-[var(--fg)]">Project log</h2>
        <p className="mt-1 text-sm text-[var(--fg-muted)]">
          {tab === "projects"
            ? "Select an entry. Arrow keys work too."
            : "Real, merged fixes to projects I don't own."}
        </p>
      </div>

      <div className="flex gap-1 border-b border-[var(--hairline)]">
        {(
          [
            { id: "projects", label: "Projects" },
            { id: "open-source", label: "Open Source" },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={clsx(
              "-mb-px border-b-2 px-3 py-2 font-mono-tech text-sm tracking-wide transition active:scale-95",
              tab === t.id
                ? "border-[var(--amber)] text-[var(--amber)]"
                : "border-transparent text-[var(--fg-muted)] hover:text-[var(--fg)]",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "projects" ? (
        <div className="flex flex-col gap-6 sm:flex-row">
          <ul
            role="listbox"
            aria-label="Projects"
            className="flex shrink-0 flex-row gap-1 overflow-x-auto sm:w-56 sm:flex-col sm:overflow-visible"
          >
            {projects.map((project) => {
              const isActive = project.slug === active.slug;
              const relevant = mode !== "general" && project.tracks?.includes(mode);
              return (
                <li key={project.slug}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={isActive}
                    tabIndex={isActive ? 0 : -1}
                    onClick={() => onSelect(project.slug)}
                    onKeyDown={handleKeyDown}
                    className={clsx(
                      "flex w-full flex-col gap-0.5 whitespace-nowrap rounded px-3 py-2 text-left font-mono-tech text-sm transition active:scale-[0.97] sm:whitespace-normal",
                      isActive
                        ? "bg-[var(--amber)]/10 text-[var(--amber)]"
                        : "text-[var(--fg-muted)] hover:bg-white/5 hover:text-[var(--fg)]",
                      mode !== "general" && !relevant && !isActive && "opacity-50",
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <span className={clsx("text-[10px]", STATUS_STYLE[project.status])}>
                        ●
                      </span>
                      {project.name}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="hairline min-w-0 flex-1 rounded p-5">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-lg font-semibold text-[var(--fg)]">{active.name}</h3>
              <span
                className={clsx(
                  "font-mono-tech text-[11px] uppercase tracking-wide",
                  STATUS_STYLE[active.status],
                )}
              >
                {active.status}
              </span>
            </div>
            {active.role && (
              <p className="mt-1 font-mono-tech text-xs text-[var(--fg-dim)]">
                {active.role}
              </p>
            )}
            <p className="mt-3 text-sm leading-relaxed text-[var(--fg)]">
              {active.summary}
            </p>

            <ul className="mt-4 flex flex-col gap-2">
              {active.highlights.map((highlight, i) => (
                <li key={i} className="flex gap-2 text-sm text-[var(--fg-muted)]">
                  <span className="text-[var(--amber-dim)]">▸</span>
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>

            <div className="mt-4 flex flex-wrap gap-1.5">
              {active.tech.map((tech) => (
                <span
                  key={tech}
                  className="rounded border border-[var(--hairline)] px-2 py-0.5 font-mono-tech text-[11px] text-[var(--fg-muted)]"
                >
                  {tech}
                </span>
              ))}
            </div>

            {active.images && active.images.length > 0 && (
              <div className="mt-4 flex flex-col gap-3">
                {active.images.map((img) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={img.src}
                    src={img.src}
                    alt={img.alt}
                    className="hairline w-full rounded"
                  />
                ))}
              </div>
            )}

            {PROJECT_DIAGRAMS[active.slug] && (
              <div className="mt-4">
                {(() => {
                  const Diagram = PROJECT_DIAGRAMS[active.slug];
                  return <Diagram />;
                })()}
              </div>
            )}

            {active.links.length > 0 && (
              <div className="mt-5 flex gap-4 border-t border-[var(--hairline)] pt-4">
                {active.links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono-tech text-xs text-[var(--cyan)] hover:underline"
                  >
                    {link.label} ↗
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <OpenSourceTab mode={mode} />
      )}
    </div>
  );
}
