import { forwardRef } from "react";
import Page from "../Page";
import { profile } from "@/data/profile";
import { moods } from "@/data/moods";
import { LinkOut, PageEyebrow, PageTitle, Rule } from "./shared";

type ContactPageProps = { pageNumber?: number };

const ContactPage = forwardRef<HTMLDivElement, ContactPageProps>(
  function ContactPage({ pageNumber }, ref) {
    return (
      <Page ref={ref} pageNumber={pageNumber} accent={moods.contact}>
        <PageEyebrow>Last Chapter</PageEyebrow>
        <PageTitle>Get in Touch</PageTitle>
        <Rule />

        <p className="font-serif text-[15px] leading-relaxed text-ink sm:text-base">
          Graduating fall 2026 and looking for embedded, hardware test, or
          full-stack roles. Reach out, I read everything that lands in this
          inbox.
        </p>

        <a
          href="/jackson-bopp-resume.pdf"
          download
          className="mt-5 inline-flex w-fit items-center gap-2 rounded-full border border-[var(--page-accent,var(--accent))] bg-[var(--page-accent,var(--accent))]/10 px-4 py-2 font-sans text-sm font-semibold text-[var(--page-accent,var(--accent))] transition hover:bg-[var(--page-accent,var(--accent))]/20"
        >
          Download resume ↓
        </a>

        <div className="mt-6 flex flex-col gap-3 font-sans text-sm">
          <div className="flex items-center gap-3">
            <span className="w-20 shrink-0 text-xs uppercase tracking-wide text-[var(--ink-muted)]">
              Email
            </span>
            <LinkOut href={`mailto:${profile.links.email}`}>
              {profile.links.email}
            </LinkOut>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-20 shrink-0 text-xs uppercase tracking-wide text-[var(--ink-muted)]">
              GitHub
            </span>
            <LinkOut href={profile.links.github}>
              github.com/JacksonBopp
            </LinkOut>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-20 shrink-0 text-xs uppercase tracking-wide text-[var(--ink-muted)]">
              LinkedIn
            </span>
            <LinkOut href={profile.links.linkedin}>linkedin.com/in/jbopp</LinkOut>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-20 shrink-0 text-xs uppercase tracking-wide text-[var(--ink-muted)]">
              Instagram
            </span>
            <LinkOut href={profile.links.instagram}>
              instagram.com/JacksonBopp
            </LinkOut>
          </div>
        </div>
      </Page>
    );
  },
);

export default ContactPage;
