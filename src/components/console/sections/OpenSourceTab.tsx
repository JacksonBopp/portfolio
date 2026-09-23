import clsx from "clsx";
import { openSourceContributions } from "@/data/openSource";
import type { ResumeTrackId } from "@/data/profile";
import GithubRepoFeed from "../GithubRepoFeed";

export default function OpenSourceTab({ mode }: { mode: ResumeTrackId }) {
  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        {openSourceContributions.map((contribution) => {
          const relevant = mode === "general" || contribution.tracks.includes(mode);
          return (
            <a
              key={contribution.project}
              href={contribution.repoUrl}
              target="_blank"
              rel="noreferrer"
              className={clsx(
                "hairline flex flex-col gap-2 rounded p-4 transition-colors hover:border-[var(--cyan-dim)]",
                !relevant && "opacity-50",
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono-tech text-sm text-[var(--fg)]">
                  {contribution.project}
                </span>
                <span className="font-mono-tech text-[11px] text-[var(--cyan)]">↗</span>
              </div>
              <ul className="flex flex-col gap-1">
                {contribution.bullets.map((bullet, i) => (
                  <li key={i} className="flex gap-2 text-xs text-[var(--fg-muted)]">
                    <span className="text-[var(--amber-dim)]">▸</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-1.5">
                {contribution.tech.map((tech) => (
                  <span
                    key={tech}
                    className="rounded border border-[var(--hairline)] px-2 py-0.5 font-mono-tech text-[10px] text-[var(--fg-muted)]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </a>
          );
        })}
      </div>

      <GithubRepoFeed />
    </div>
  );
}
