import { forwardRef } from "react";
import Page from "../Page";
import type { Project } from "@/data/projects";
import { moods } from "@/data/moods";
import { Chip, LinkOut, PageEyebrow, PageTitle, Rule } from "./shared";

type ProjectPageProps = {
  project: Project;
  index: number;
  total: number;
  pageNumber?: number;
};

const ProjectPage = forwardRef<HTMLDivElement, ProjectPageProps>(
  function ProjectPage({ project, index, total, pageNumber }, ref) {
    return (
      <Page
        ref={ref}
        pageNumber={pageNumber}
        accent={moods.projects[index % moods.projects.length]}
      >
        <PageEyebrow>
          Project {index + 1} of {total}
        </PageEyebrow>
        <PageTitle>{project.name}</PageTitle>
        {project.role && (
          <p className="mt-1 font-sans text-xs italic text-[var(--ink-muted)]">
            {project.role}
          </p>
        )}
        <Rule />

        <p className="font-serif text-[15px] font-semibold leading-snug text-ink sm:text-base">
          {project.blurb}
        </p>
        <p className="mt-2 font-serif text-sm leading-relaxed text-ink sm:text-[15px]">
          {project.summary}
        </p>

        <ul className="mt-3 flex flex-col gap-1.5">
          {project.highlights.map((point) => (
            <li
              key={point}
              className="flex gap-2 font-serif text-sm leading-snug text-ink sm:text-[15px]"
            >
              <span
                aria-hidden
                className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-[var(--page-accent,var(--accent))]"
              />
              <span>{point}</span>
            </li>
          ))}
        </ul>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.tech.map((t) => (
            <Chip key={t}>{t}</Chip>
          ))}
        </div>

        <div className="mt-auto flex flex-wrap gap-x-5 gap-y-1 pt-6">
          {project.links.map((link) => (
            <LinkOut key={link.href} href={link.href}>
              {link.label} ↗
            </LinkOut>
          ))}
        </div>
      </Page>
    );
  },
);

export default ProjectPage;
