"use client";

import { useEffect, useState } from "react";
import { profile } from "@/data/profile";

type GithubEvent = {
  id: string;
  type: string;
  repo: { name: string };
  created_at: string;
};

type ActivityItem = { text: string; url: string };

function describeEvent(event: GithubEvent): ActivityItem | null {
  const repo = event.repo.name.split("/")[1] ?? event.repo.name;
  const url = `https://github.com/${event.repo.name}`;
  switch (event.type) {
    case "PushEvent":
      return { text: `pushed to ${repo}`, url };
    case "CreateEvent":
      return { text: `created ${repo}`, url };
    case "PullRequestEvent":
      return { text: `opened a PR on ${repo}`, url };
    case "WatchEvent":
      return { text: `starred ${repo}`, url };
    case "IssuesEvent":
      return { text: `filed an issue on ${repo}`, url };
    default:
      return null;
  }
}

export default function StatusStrip() {
  const [time, setTime] = useState<string | null>(null);
  const [activity, setActivity] = useState<
    ActivityItem[] | "loading" | "unavailable"
  >("loading");

  useEffect(() => {
    const update = () =>
      setTime(
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "America/New_York",
        }),
      );
    update();
    const id = setInterval(update, 30_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`https://api.github.com/users/${profile.githubUsername}/events/public`, {
      signal: controller.signal,
      headers: { Accept: "application/vnd.github+json" },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((events: GithubEvent[]) => {
        const described = events
          .map(describeEvent)
          .filter((d): d is ActivityItem => Boolean(d))
          .slice(0, 3);
        setActivity(described.length ? described : "unavailable");
      })
      .catch(() => setActivity("unavailable"));
    return () => controller.abort();
  }, []);

  return (
    <div className="flex flex-col gap-3 font-mono-tech text-xs text-[var(--fg-muted)]">
      <div className="flex items-center justify-between">
        <span className="uppercase tracking-[0.2em] text-[var(--fg-dim)]">
          Local time (ET)
        </span>
        <span className="text-[var(--fg)]">{time ?? "--:--"}</span>
      </div>

      <div>
        <span className="uppercase tracking-[0.2em] text-[var(--fg-dim)]">
          Status
        </span>
        <p className="mt-1 text-[var(--fg)]">
          {profile.facts.find((f) => f.label === "Currently")?.value}
        </p>
      </div>

      <div>
        <span className="uppercase tracking-[0.2em] text-[var(--fg-dim)]">
          GitHub activity
        </span>
        <ul className="mt-1 flex flex-col gap-0.5">
          {activity === "loading" && <li className="text-[var(--fg-dim)]">fetching…</li>}
          {activity === "unavailable" && (
            <li className="text-[var(--fg-dim)]">no recent public activity</li>
          )}
          {Array.isArray(activity) &&
            activity.map((item, i) => (
              <li key={i} className="truncate">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[var(--fg)] hover:text-[var(--cyan)] hover:underline"
                >
                  {item.text}
                </a>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
