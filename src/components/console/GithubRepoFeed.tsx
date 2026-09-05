"use client";

import { useEffect, useState } from "react";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { openSourceContributions } from "@/data/openSource";

type Repo = {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  fork: boolean;
  updated_at: string;
};

function timeAgo(iso: string): string {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (days < 1) return "today";
  if (days === 1) return "1 day ago";
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} mo ago`;
  return `${Math.floor(months / 12)} yr ago`;
}

const curatedNames = new Set([
  ...projects.map((p) => p.slug.toLowerCase()),
  ...openSourceContributions.map((c) =>
    c.repoUrl.split("/").pop()!.toLowerCase(),
  ),
  profile.githubUsername.toLowerCase(),
  "portfolio",
]);

export default function GithubRepoFeed() {
  const [repos, setRepos] = useState<Repo[] | "loading" | "unavailable">(
    "loading",
  );

  useEffect(() => {
    const controller = new AbortController();
    fetch(
      `https://api.github.com/users/${profile.githubUsername}/repos?sort=updated&per_page=100`,
      { signal: controller.signal, headers: { Accept: "application/vnd.github+json" } },
    )
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((data: Repo[]) => {
        const filtered = data
          .filter((r) => !curatedNames.has(r.name.toLowerCase()))
          .slice(0, 12);
        setRepos(filtered);
      })
      .catch(() => setRepos("unavailable"));
    return () => controller.abort();
  }, []);

  if (repos === "loading") {
    return (
      <p className="font-mono-tech text-xs text-[var(--fg-dim)]">
        Fetching public repositories…
      </p>
    );
  }

  if (repos === "unavailable" || repos.length === 0) return null;

  return (
    <div>
      <h3 className="font-mono-tech text-xs uppercase tracking-[0.2em] text-[var(--fg-dim)]">
        More on GitHub
      </h3>
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {repos.map((repo) => (
          <a
            key={repo.id}
            href={repo.html_url}
            target="_blank"
            rel="noreferrer"
            className="hairline flex flex-col gap-1.5 rounded p-3.5 transition-colors hover:border-[var(--cyan-dim)]"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="truncate font-mono-tech text-sm text-[var(--fg)]">
                {repo.name}
              </span>
              {repo.fork && (
                <span className="shrink-0 font-mono-tech text-[10px] uppercase text-[var(--fg-dim)]">
                  fork
                </span>
              )}
            </div>
            {repo.description && (
              <p className="line-clamp-2 text-xs text-[var(--fg-muted)]">
                {repo.description}
              </p>
            )}
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono-tech text-[11px] text-[var(--fg-dim)]">
              {repo.language && <span>{repo.language}</span>}
              {repo.stargazers_count > 0 && <span>★ {repo.stargazers_count}</span>}
              <span>updated {timeAgo(repo.updated_at)}</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
