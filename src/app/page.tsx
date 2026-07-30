"use client";

import { useMemo, useRef } from "react";
import Book, { type BookHandle } from "@/components/book/Book";
import CoverPage from "@/components/book/pages/CoverPage";
import TitlePage, {
  type TocEntry,
} from "@/components/book/pages/TitlePage";
import AboutPage from "@/components/book/pages/AboutPage";
import SkillsPage from "@/components/book/pages/SkillsPage";
import ProjectPage from "@/components/book/pages/ProjectPage";
import ContactPage from "@/components/book/pages/ContactPage";
import BackCoverPage from "@/components/book/pages/BackCoverPage";
import { projects } from "@/data/projects";

// Flip indices — must match the literal <Book> children order below.
const COVER = 0;
const TOC = 1;
const ABOUT = 2;
const SKILLS = 3;
const PROJECTS_START = 4;
const CONTACT = PROJECTS_START + projects.length;

export default function Home() {
  const bookRef = useRef<BookHandle>(null);

  const navigate = (page: number) => bookRef.current?.goToPage(page);

  const tocEntries: TocEntry[] = useMemo(
    () => [
      { label: "About", page: ABOUT },
      { label: "Skills & Tools", page: SKILLS },
      ...projects.map((project, i) => ({
        label: project.name,
        page: PROJECTS_START + i,
        note: "project",
      })),
      { label: "Get in Touch", page: CONTACT },
    ],
    [],
  );

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-10 sm:py-14">
      <Book ref={bookRef}>
        <CoverPage />
        <TitlePage entries={tocEntries} onNavigate={navigate} pageNumber={TOC + 1} />
        <AboutPage pageNumber={ABOUT + 1} />
        <SkillsPage pageNumber={SKILLS + 1} />
        {projects.map((project, i) => (
          <ProjectPage
            key={project.slug}
            project={project}
            index={i}
            total={projects.length}
            pageNumber={PROJECTS_START + i + 1}
          />
        ))}
        <ContactPage pageNumber={CONTACT + 1} />
        <BackCoverPage onRestart={() => navigate(COVER)} />
      </Book>
    </main>
  );
}
