import { forwardRef } from "react";
import Page from "../Page";
import { profile } from "@/data/profile";

const CoverPage = forwardRef<HTMLDivElement>(function CoverPage(_props, ref) {
  return (
    <Page ref={ref} variant="cover" className="items-center justify-center">
      <div className="flex h-full flex-col items-center justify-center gap-6 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full border border-[var(--gold)]/50 font-display text-2xl tracking-widest text-gold sm:h-24 sm:w-24 sm:text-3xl">
          {profile.initials}
        </div>

        <div className="h-px w-16 bg-[var(--gold)]/40" />

        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-[var(--gold-bright)] sm:text-4xl">
            {profile.name}
          </h1>
          <p className="mt-3 font-sans text-sm uppercase tracking-[0.25em] text-gold/80 sm:text-base">
            {profile.tagline}
          </p>
        </div>

        <p className="max-w-[22ch] font-serif text-sm italic text-gold/70 sm:text-base">
          {profile.subtagline}
        </p>

        <div className="mt-6 font-sans text-[11px] uppercase tracking-[0.3em] text-gold/50">
          Open to read →
        </div>
      </div>
    </Page>
  );
});

export default CoverPage;
