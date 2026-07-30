"use client";

import {
  Children,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import dynamic from "next/dynamic";
import { motion } from "motion/react";
import type { HTMLFlipBookHandle } from "react-pageflip";

const HTMLFlipBook = dynamic(() => import("react-pageflip"), {
  ssr: false,
});

const ASPECT_RATIO = 1.42;
const CHROME_HEIGHT = 132;
const MIN_WIDTH = 260;
const MAX_WIDTH = 480;

function useBookSize() {
  const [size, setSize] = useState({ width: 340, height: 340 * ASPECT_RATIO });

  useEffect(() => {
    function computeSize() {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const maxHeight = Math.max(vh - CHROME_HEIGHT, 360);
      const maxWidth = Math.max(vw - 32, 220);

      let width = Math.min(maxWidth, maxHeight / ASPECT_RATIO, MAX_WIDTH);
      width = Math.max(width, Math.min(MIN_WIDTH, maxWidth));

      setSize({ width, height: width * ASPECT_RATIO });
    }

    computeSize();
    window.addEventListener("resize", computeSize);
    return () => window.removeEventListener("resize", computeSize);
  }, []);

  return size;
}

export type BookHandle = {
  goToPage: (page: number) => void;
  goNext: () => void;
  goPrev: () => void;
};

type BookProps = {
  children: ReactNode;
  onPageChange?: (index: number) => void;
};

const Book = forwardRef<BookHandle, BookProps>(function Book(
  { children, onPageChange },
  forwardedRef,
) {
  const bookRef = useRef<HTMLFlipBookHandle | null>(null);
  const { width, height } = useBookSize();
  const pages = useMemo(() => Children.toArray(children), [children]);
  const pageCount = pages.length;
  const [pageIndex, setPageIndex] = useState(0);
  const [ready, setReady] = useState(false);

  const updatePageIndex = useCallback(
    (index: number) => {
      setPageIndex(index);
      onPageChange?.(index);
    },
    [onPageChange],
  );

  const goNext = useCallback(() => {
    bookRef.current?.pageFlip().flipNext();
  }, []);

  const goPrev = useCallback(() => {
    bookRef.current?.pageFlip().flipPrev();
  }, []);

  const goToPage = useCallback(
    (page: number) => {
      // flip() breaks when jumping directly to page 0 in showCover mode;
      // turnToPage() jumps instantly without going through the flip animation
      // state machine, which is more reliable for arbitrary jumps anyway.
      bookRef.current?.pageFlip().turnToPage(page);
      updatePageIndex(page);
    },
    [updatePageIndex],
  );

  useImperativeHandle(forwardedRef, () => ({ goToPage, goNext, goPrev }), [
    goToPage,
    goNext,
    goPrev,
  ]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA"].includes(target.tagName)) return;

      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goNext, goPrev]);

  const isFirst = pageIndex <= 0;
  const isLast = pageIndex >= pageCount - 1;

  const flipBookProps = useMemo(
    () => ({
      width: Math.round(width),
      height: Math.round(height),
      size: "fixed" as const,
      showCover: true,
      usePortrait: true,
      mobileScrollSupport: true,
      flippingTime: 700,
      maxShadowOpacity: 0.5,
      className: "mx-auto",
      style: {},
      startPage: 0,
      drawShadow: true,
      swipeDistance: 20,
      clickEventForward: true,
      useMouseEvents: true,
      renderOnlyPageLengthChange: false,
      showPageCorners: false,
      disableFlipByClick: true,
    }),
    [width, height],
  );

  return (
    <div className="flex w-full flex-col items-center gap-5">
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        onAnimationComplete={() => setReady(true)}
        style={{
          filter: "drop-shadow(0 30px 45px rgba(0,0,0,0.45))",
        }}
      >
        <HTMLFlipBook
          key={`${flipBookProps.width}x${flipBookProps.height}`}
          {...flipBookProps}
          ref={bookRef}
          onFlip={(e) => updatePageIndex(e.data)}
        >
          {pages}
        </HTMLFlipBook>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-4 font-sans text-sm text-[var(--scene-muted)]"
      >
        <motion.button
          type="button"
          onClick={goPrev}
          disabled={isFirst}
          aria-label="Previous page"
          whileHover={isFirst ? undefined : { scale: 1.05 }}
          whileTap={isFirst ? undefined : { scale: 0.95 }}
          className="cursor-pointer rounded-full border border-[var(--gold)]/30 px-4 py-1.5 tracking-wide transition-colors hover:border-[var(--gold)] hover:text-[var(--gold-bright)] disabled:cursor-not-allowed disabled:opacity-30"
        >
          ← Prev
        </motion.button>
        <motion.button
          type="button"
          onClick={() => goToPage(0)}
          aria-label="Jump to cover"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="hidden cursor-pointer rounded-full border border-[var(--gold)]/30 px-4 py-1.5 tracking-wide transition-colors hover:border-[var(--gold)] hover:text-[var(--gold-bright)] sm:inline-block"
        >
          Cover
        </motion.button>
        <span className="tabular-nums" data-testid="page-indicator">
          {Math.min(pageIndex + 1, pageCount)} / {pageCount}
        </span>
        <motion.button
          type="button"
          onClick={goNext}
          disabled={isLast}
          aria-label="Next page"
          whileHover={isLast ? undefined : { scale: 1.05 }}
          whileTap={isLast ? undefined : { scale: 0.95 }}
          className="cursor-pointer rounded-full border border-[var(--gold)]/30 px-4 py-1.5 tracking-wide transition-colors hover:border-[var(--gold)] hover:text-[var(--gold-bright)] disabled:cursor-not-allowed disabled:opacity-30"
        >
          Next →
        </motion.button>
      </motion.div>
    </div>
  );
});

export default Book;
