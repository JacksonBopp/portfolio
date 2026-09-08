import Image from "next/image";
import {
  profile,
  resumeTracks,
  skillCategories,
  type ResumeTrackId,
} from "@/data/profile";
import { projects } from "@/data/projects";
import FeedCat from "../FeedCat";
import D20Roller from "../D20Roller";
import NowPanel from "../NowPanel";

const featuredSlugByTrack: Record<ResumeTrackId, string> = {
  general: "testbench",
  automation: "decision-engine",
  embedded: "wireless-motor-pwm-controller",
  software: "radiology-second-opinion-agent",
};

const CORE_FOCUS_CATEGORY_ORDER = [
  "Hardware",
  "Languages",
  "AI / LLM Tools",
  "Frameworks & Libraries",
  "Infrastructure & Data",
];

const coreFocusAreas = Array.from(
  new Set(
    [...skillCategories]
      .sort(
        (a, b) =>
          CORE_FOCUS_CATEGORY_ORDER.indexOf(a.label) -
          CORE_FOCUS_CATEGORY_ORDER.indexOf(b.label),
      )
      .flatMap((category) =>
        category.skills.filter((s) => s.tier === "core").map((s) => s.name),
      ),
  ),
);

type OverviewProps = {
  mode: ResumeTrackId;
  onSelectProject: (slug: string) => void;
};

export default function Overview({ mode, onSelectProject }: OverviewProps) {
  const track = resumeTracks.find((t) => t.id === mode) ?? resumeTracks[0];
  const featured =
    projects.find((p) => p.slug === featuredSlugByTrack[mode]) ?? projects[0];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
        <div className="hairline bracket relative h-24 w-24 shrink-0 overflow-hidden rounded">
          <Image
            src="/headshot.jpg"
            alt={profile.name}
            fill
            sizes="96px"
            className="object-cover object-[30%_20%]"
            priority
          />
        </div>

        <div>
          <p className="font-mono-tech text-xs uppercase tracking-[0.2em] text-[var(--amber)]">
            {profile.tagline}
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-[var(--fg)] sm:text-3xl">
            {profile.name}
          </h1>
          <p className="mt-2 max-w-lg text-sm text-[var(--fg-muted)]">
            {profile.subtagline}
          </p>
        </div>
      </div>

      {mode !== "general" && (
        <div className="hairline rounded px-4 py-3 text-sm text-[var(--fg-muted)]">
          <span className="text-[var(--cyan)]">{track.label} track active</span>
          {" · "}
          {track.blurb}
        </div>
      )}

      <div className="flex flex-col gap-3">
        {profile.bio.map((paragraph, i) => (
          <p key={i} className="max-w-2xl text-sm leading-relaxed text-[var(--fg)]">
            {paragraph}
          </p>
        ))}
        <div className="flex flex-wrap items-center gap-2">
          <FeedCat />
          <D20Roller />
        </div>
      </div>

      <div>
        <span className="font-mono-tech text-[10px] uppercase tracking-[0.2em] text-[var(--fg-dim)]">
          Core focus
        </span>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {coreFocusAreas.map((name) => (
            <span
              key={name}
              data-skill-chip={name}
              className="rounded border border-[var(--amber-dim)] bg-[var(--amber)]/5 px-2.5 py-1 font-mono-tech text-xs text-[var(--amber)]"
            >
              {name}
            </span>
          ))}
        </div>
      </div>

      <dl className="grid grid-cols-1 gap-x-8 gap-y-3 border-t border-[var(--hairline)] pt-6 sm:grid-cols-2">
        {profile.facts.map((fact) => (
          <div key={fact.label} className="flex flex-col gap-0.5 sm:flex-row sm:gap-4">
            <dt className="font-mono-tech text-xs uppercase tracking-[0.15em] text-[var(--fg-dim)] sm:w-32 sm:shrink-0">
              {fact.label}
            </dt>
            <dd className="text-sm text-[var(--fg)]">{fact.value}</dd>
          </div>
        ))}
        <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-4">
          <dt className="font-mono-tech text-xs uppercase tracking-[0.15em] text-[var(--fg-dim)] sm:w-32 sm:shrink-0">
            Involvement
          </dt>
          <dd className="flex flex-wrap gap-x-1.5 text-sm text-[var(--fg)]">
            {profile.involvement.map((org, i) => (
              <span key={org.name}>
                <a
                  href={org.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[var(--cyan)] hover:underline"
                >
                  {org.name}
                </a>
                {i < profile.involvement.length - 1 && ","}
              </span>
            ))}
          </dd>
        </div>
      </dl>

      <NowPanel />

      <button
        type="button"
        onClick={() => onSelectProject(featured.slug)}
        className="hairline group flex flex-col gap-2 rounded p-5 text-left transition-colors hover:border-[var(--amber-dim)]"
      >
        <span className="font-mono-tech text-[10px] uppercase tracking-[0.2em] text-[var(--fg-dim)]">
          Featured project
        </span>
        <span className="text-lg font-semibold text-[var(--fg)]">
          {featured.name}
        </span>
        <span className="max-w-xl text-sm text-[var(--fg-muted)]">
          {featured.blurb}
        </span>
        <span className="mt-1 font-mono-tech text-xs text-[var(--amber)] group-hover:underline">
          View details →
        </span>
      </button>
    </div>
  );
}
