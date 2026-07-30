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

        <div className="flex flex-col gap-3 font-serif text-[15px] leading-relaxed text-ink sm:text-base">
          {profile.bio.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>

        <div className="mt-auto flex flex-col gap-1 pt-6 font-sans text-xs text-[var(--ink-muted)]">
          <span>{profile.location}</span>
          <span>{profile.graduation}</span>
        </div>
      </Page>
    );
  },
);

export default AboutPage;
