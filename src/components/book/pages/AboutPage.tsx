import { forwardRef } from "react";
import Page from "../Page";
import { profile } from "@/data/profile";
import { moods } from "@/data/moods";
import { PageEyebrow, PageTitle, Rule } from "./shared";

type AboutPageProps = { pageNumber?: number };

const AboutPage = forwardRef<HTMLDivElement, AboutPageProps>(
  function AboutPage({ pageNumber }, ref) {
    return (
      <Page ref={ref} pageNumber={pageNumber} accent={moods.about}>
        <PageEyebrow>Chapter One</PageEyebrow>
        <PageTitle>About</PageTitle>
        <Rule />

        <p className="font-serif text-base font-semibold leading-snug text-ink sm:text-lg">
          {profile.intro}
        </p>

        <div className="mt-3 flex flex-col gap-3 font-serif text-sm leading-relaxed text-ink sm:text-[15px]">
          {profile.bio.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>

        <dl className="mt-6 flex flex-col gap-2 border-t border-[var(--ink-muted)]/20 pt-4">
          {profile.facts.map((fact) => (
            <div key={fact.label} className="flex gap-3 font-sans text-xs">
              <dt className="w-24 shrink-0 uppercase tracking-wide text-[var(--ink-muted)]">
                {fact.label}
              </dt>
              <dd className="text-ink">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </Page>
    );
  },
);

export default AboutPage;
