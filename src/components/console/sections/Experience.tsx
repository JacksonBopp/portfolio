import { experience } from "@/data/experience";

export default function Experience() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-xl font-semibold text-[var(--fg)]">Experience</h2>
        <p className="mt-1 text-sm text-[var(--fg-muted)]">
          Work history, most recent first.
        </p>
      </div>

      <div className="flex flex-col gap-5">
        {experience.map((entry) => (
          <div key={entry.org} className="hairline rounded p-5">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h3 className="text-base font-semibold text-[var(--fg)]">
                {entry.role}
              </h3>
              <span className="font-mono-tech text-xs text-[var(--fg-dim)]">
                {entry.start} - {entry.end}
              </span>
            </div>
            <p className="mt-0.5 font-mono-tech text-xs text-[var(--amber)]">
              {entry.org} · {entry.location}
            </p>
            <ul className="mt-3 flex flex-col gap-1.5">
              {entry.bullets.map((bullet, i) => (
                <li key={i} className="flex gap-2 text-sm text-[var(--fg-muted)]">
                  <span className="text-[var(--amber-dim)]">▸</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
