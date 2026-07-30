export function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-[var(--ink-muted)]/25 bg-[var(--paper-shade)]/60 px-2.5 py-1 font-sans text-[11px] tracking-wide text-[var(--ink-muted)]">
      {children}
    </span>
  );
}

export function PageEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-[var(--page-accent,var(--accent))]">
      {children}
    </p>
  );
}

export function PageTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-1 font-display text-2xl font-semibold leading-tight text-ink sm:text-3xl">
      {children}
    </h2>
  );
}

export function Rule() {
  return (
    <div aria-hidden className="flourish my-4 flex items-center gap-2.5">
      <span className="h-px w-8 bg-current opacity-40" />
      <span className="select-none text-base leading-none">&#10086;</span>
      <span className="h-px w-8 bg-current opacity-40" />
    </div>
  );
}

export function LinkOut({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const isMail = href.startsWith("mailto:");
  return (
    <a
      href={href}
      target={isMail ? undefined : "_blank"}
      rel={isMail ? undefined : "noopener noreferrer"}
      className="inline-flex items-center gap-1.5 font-sans text-sm font-medium text-[var(--page-accent,var(--accent))] underline decoration-[var(--page-accent,var(--accent))]/40 underline-offset-4 transition hover:decoration-[var(--page-accent,var(--accent))]"
    >
      {children}
    </a>
  );
}
