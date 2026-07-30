import { forwardRef } from "react";
import Page from "../Page";
import { skillCategories } from "@/data/profile";
import { Chip, PageEyebrow, PageTitle, Rule } from "./shared";

type SkillsPageProps = { pageNumber?: number };

const SkillsPage = forwardRef<HTMLDivElement, SkillsPageProps>(
  function SkillsPage({ pageNumber }, ref) {
    return (
      <Page ref={ref} pageNumber={pageNumber}>
        <PageEyebrow>Chapter Two</PageEyebrow>
        <PageTitle>Skills &amp; Tools</PageTitle>
        <Rule />

        <div className="flex flex-col gap-5">
          {skillCategories.map((category) => (
            <div key={category.label}>
              <h3 className="font-sans text-xs font-semibold uppercase tracking-[0.15em] text-[var(--ink-muted)]">
                {category.label}
              </h3>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {category.skills.map((skill) => (
                  <Chip key={skill}>{skill}</Chip>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Page>
    );
  },
);

export default SkillsPage;
