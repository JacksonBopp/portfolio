"use client";

import { useMemo, useRef, useState } from "react";
import Book, { type BookHandle } from "@/components/book/Book";
import QuickNav, { type NavSection } from "@/components/book/QuickNav";
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
  const [activePage, setActivePage] = useState(0);

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

  const navSections: NavSection[] = useMemo(
    () => [
      { label: "Cover", short: "JB", page: COVER },
      { label: "Contents", short: "TC", page: TOC },
      { label: "About", short: "AB", page: ABOUT },
      { label: "Skills & Tools", short: "SK", page: SKILLS },
      ...projects.map((project, i) => ({
        label: project.name,
        short: `P${i + 1}`,
        page: PROJECTS_START + i,
      })),
      { label: "Get in Touch", short: "GT", page: CONTACT },
    ],
    [],
  );

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-10 sm:py-14">
      <Book ref={bookRef} onPageChange={setActivePage}>
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

      <QuickNav sections={navSections} activePage={activePage} onNavigate={navigate} />
    </main>
  );
}
