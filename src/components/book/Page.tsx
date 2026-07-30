import { forwardRef } from "react";
import clsx from "clsx";

type PageProps = {
  children: React.ReactNode;
  className?: string;
  pageNumber?: number;
  variant?: "paper" | "cover";
};

const Page = forwardRef<HTMLDivElement, PageProps>(function Page(
  { children, className, pageNumber, variant = "paper" },
  ref,
) {
  return (
    <div
      ref={ref}
      className={clsx(
        "relative h-full w-full overflow-hidden select-none",
        variant === "paper" ? "book-page-face" : "book-cover-face",
        className,
      )}
    >
      <div className="scrollbar-thin flex h-full flex-col overflow-y-auto px-6 py-8 sm:px-10 sm:py-10">
        {children}
      </div>
      {pageNumber !== undefined && (
        <div className="pointer-events-none absolute bottom-3 left-0 right-0 text-center font-serif text-xs tracking-widest text-[var(--ink-muted)]">
          {pageNumber}
        </div>
      )}
    </div>
  );
});

export default Page;
