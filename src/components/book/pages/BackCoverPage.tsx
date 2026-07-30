import { forwardRef } from "react";
import Page from "../Page";

type BackCoverPageProps = { onRestart: () => void };

const BackCoverPage = forwardRef<HTMLDivElement, BackCoverPageProps>(
  function BackCoverPage({ onRestart }, ref) {
    const year = new Date().getFullYear();
    return (
      <Page ref={ref} variant="cover" className="items-center justify-center">
        <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
          <div className="h-px w-10 bg-[var(--gold)]/40" />
          <p className="font-display text-sm italic text-gold/80">
            Thanks for reading
          </p>
          <button
            type="button"
            onClick={onRestart}
            className="mt-4 cursor-pointer rounded-full border border-[var(--gold)]/40 px-4 py-1.5 font-sans text-xs uppercase tracking-[0.2em] text-gold/80 transition hover:border-[var(--gold)] hover:text-[var(--gold-bright)]"
          >
            Back to cover
          </button>
          <p className="mt-8 font-sans text-[10px] uppercase tracking-[0.2em] text-gold/40">
            © {year} Jackson Bopp
          </p>
        </div>
      </Page>
    );
  },
);

export default BackCoverPage;
