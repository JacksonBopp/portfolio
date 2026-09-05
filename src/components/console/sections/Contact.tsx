import { profile, type ResumeTrack } from "@/data/profile";
import ContactForm from "./ContactForm";

const LINKS = [
  { label: "Email", value: profile.links.email, href: `mailto:${profile.links.email}` },
  { label: "GitHub", value: "github.com/JacksonBopp", href: profile.links.github },
  { label: "LinkedIn", value: "linkedin.com/in/jbopp", href: profile.links.linkedin },
  {
    label: "Instagram",
    value: "instagram.com/JacksonBopp",
    href: profile.links.instagram,
  },
];

export default function Contact({ track }: { track: ResumeTrack }) {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-xl font-semibold text-[var(--fg)]">Connect</h2>
        <p className="mt-1 max-w-md text-sm text-[var(--fg-muted)]">
          Graduating fall 2026, looking for embedded, hardware test, or
          full‑stack roles. I read everything that lands here.
        </p>
      </div>

      <div className="hairline bracket flex flex-col gap-4 rounded p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="font-mono-tech text-xs uppercase tracking-[0.15em] text-[var(--fg-dim)]">
            Résumé
          </span>
          <p className="mt-1 text-sm text-[var(--fg)]">
            {track.label} track · {track.blurb}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <a
            href={track.file}
            target="_blank"
            rel="noreferrer"
            className="hairline-strong inline-flex items-center gap-2 rounded px-4 py-2.5 font-mono-tech text-sm text-[var(--amber)] transition active:scale-95 hover:bg-[var(--amber)]/10"
          >
            View résumé ↗
          </a>
          <a
            href={track.file}
            download={`Jackson-Bopp-Resume-${track.label}.pdf`}
            className="font-mono-tech text-xs text-[var(--cyan)] hover:underline"
          >
            Download ↓
          </a>
        </div>
      </div>

      <dl className="flex flex-col divide-y divide-[var(--hairline)] border-t border-[var(--hairline)]">
        {LINKS.map((link) => (
          <div key={link.label} className="flex items-center justify-between gap-4 py-3">
            <dt className="font-mono-tech text-xs uppercase tracking-[0.15em] text-[var(--fg-dim)]">
              {link.label}
            </dt>
            <dd>
              <a
                href={link.href}
                target={link.href.startsWith("mailto:") ? undefined : "_blank"}
                rel="noreferrer"
                className="text-sm text-[var(--cyan)] hover:underline"
              >
                {link.value}
              </a>
            </dd>
          </div>
        ))}
      </dl>

      <div className="font-mono-tech text-sm">
        <p className="text-[var(--fg-dim)]">
          <span className="text-[var(--green)]">jb-01</span>:~$ cat closing_note.txt
        </p>
        <p className="mt-2 max-w-lg text-[var(--fg-muted)]">
          Thanks for making it this far. Whether you're hiring, just poking
          around, or both, I appreciate you taking the time to look.
        </p>
        <p className="mt-3 text-[var(--fg-dim)]">
          <span className="text-[var(--green)]">jb-01</span>:~${" "}
          <span className="animate-blink">▌</span>
        </p>
      </div>

      <ContactForm />
    </div>
  );
}
