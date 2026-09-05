import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-[var(--bg-0)] px-6 text-center">
      <span className="font-mono-tech text-xs uppercase tracking-[0.3em] text-[var(--red)]">
        Error 404
      </span>
      <h1 className="font-mono-tech text-2xl text-[var(--fg)] sm:text-3xl">
        Signal lost
      </h1>
      <p className="max-w-sm text-sm text-[var(--fg-muted)]">
        This route doesn't exist on JB-01. It may have moved, or the link was
        never valid.
      </p>
      <Link
        href="/"
        className="hairline-strong mt-4 inline-flex items-center gap-2 rounded px-4 py-2 font-mono-tech text-sm text-[var(--amber)] transition hover:bg-[var(--amber)]/10 active:scale-95"
      >
        ← Back to console
      </Link>
    </div>
  );
}
