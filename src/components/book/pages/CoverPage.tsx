import { forwardRef } from "react";
import Page from "../Page";
import { profile } from "@/data/profile";

const CoverPage = forwardRef<HTMLDivElement>(function CoverPage(_props, ref) {
  return (
    <Page ref={ref} variant="cover" className="items-center justify-center">
      <div className="flex h-full flex-col items-center justify-center gap-6 text-center">
        <div
          aria-hidden
          className="wax-seal flex h-20 w-20 items-center justify-center rounded-full font-display text-xl tracking-widest sm:h-24 sm:w-24 sm:text-2xl"
        >
          {profile.initials}
        </div>

        <div aria-hidden className="flourish text-lg">
          &#10086;
        </div>

        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-[var(--gold-bright)] sm:text-4xl">
            {profile.name}
          </h1>
          <p className="mt-3 font-sans text-sm uppercase tracking-[0.25em] text-gold/80 sm:text-base">
            {profile.tagline}
          </p>
        </div>

        <p className="max-w-[22ch] font-serif text-base italic text-gold/70 sm:text-lg">
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
