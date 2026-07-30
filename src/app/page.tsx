"use client";

import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Book, { type BookHandle } from "@/components/book/Book";
import ClosedBook from "@/components/book/ClosedBook";
import QuickNav, { type NavSection } from "@/components/book/QuickNav";
import TitlePage from "@/components/book/pages/TitlePage";
import AboutPage from "@/components/book/pages/AboutPage";
import SkillsPage from "@/components/book/pages/SkillsPage";
import ProjectPage from "@/components/book/pages/ProjectPage";
import ContactPage from "@/components/book/pages/ContactPage";
import BackCoverPage from "@/components/book/pages/BackCoverPage";
import { projects } from "@/data/projects";

// Flip indices — must match the literal <Book> children order below.
// The closed 3D cover is a separate component and isn't one of these pages.
const TOC = 0;
const ABOUT = 1;
const SKILLS = 2;
const PROJECTS_START = 3;
const CONTACT = PROJECTS_START + projects.length;

export default function Home() {
  const bookRef = useRef<BookHandle>(null);
  const [activePage, setActivePage] = useState(0);
  const [opened, setOpened] = useState(false);

  const navigate = (page: number) => bookRef.current?.goToPage(page);

  const projectLeaves = useMemo(
    () => projects.map((project, i) => ({ label: project.name, page: PROJECTS_START + i })),
    [],
  );

  const navSections: NavSection[] = useMemo(
    () => [
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
      <AnimatePresence mode="wait">
        {!opened ? (
          <motion.div
            key="closed"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ClosedBook onOpen={() => setOpened(true)} />
          </motion.div>
        ) : (
          <motion.div
            key="open"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex w-full flex-col items-center"
          >
            <Book ref={bookRef} onPageChange={setActivePage}>
              <TitlePage
                about={{ label: "About", page: ABOUT }}
                skills={{ label: "Skills & Tools", page: SKILLS }}
                projects={projectLeaves}
                contact={{ label: "Get in Touch", page: CONTACT }}
                onNavigate={navigate}
                pageNumber={TOC + 1}
              />
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
              <BackCoverPage onRestart={() => navigate(TOC)} />
            </Book>

            <QuickNav sections={navSections} activePage={activePage} onNavigate={navigate} />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
