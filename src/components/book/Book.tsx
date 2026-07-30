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
import { useBookSize } from "./useBookSize";

const HTMLFlipBook = dynamic(() => import("react-pageflip"), {
  ssr: false,
});

const FLIP_MS = 340;

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

  const cascadeTargetRef = useRef<number | null>(null);

  const updatePageIndex = useCallback(
    (index: number) => {
      setPageIndex(index);
      onPageChange?.(index);
    },
    [onPageChange],
  );

  // Riffles toward cascadeTargetRef one real flip at a time. Each step is
  // scheduled on its own timer (not chained inside onFlip) because calling
  // flipNext() again synchronously inside the flip library's own completion
  // callback never yields back to the browser, so every flip after the first
  // resolves within the same tick with nothing actually painted. Waiting a
  // full FLIP_MS between steps forces each turn to really render.
  const cascadeStep = useCallback((target: number) => {
    if (cascadeTargetRef.current !== target) return; // cancelled or superseded
    const pf = bookRef.current?.pageFlip();
    if (!pf) return;
    const current = pf.getCurrentPageIndex();
    if (current === target) {
      cascadeTargetRef.current = null;
      return;
    }
    if (target > current) {
      pf.flipNext();
    } else {
      // flipPrev() simulates a click near the left edge of a two-page
      // spread to trigger the backward flip gesture; in single-page
      // "portrait" mode that coordinate lands inside the current page
      // instead of a previous-page region, so it silently no-ops.
      // turnToPrevPage() jumps directly by index instead, which is
      // reliable here (it just loses the flip animation).
      pf.turnToPrevPage();
    }
    window.setTimeout(() => cascadeStep(target), FLIP_MS + 30);
  }, []);

  const goNext = useCallback(() => {
    cascadeTargetRef.current = null;
    bookRef.current?.pageFlip().flipNext();
  }, []);

  const goPrev = useCallback(() => {
    cascadeTargetRef.current = null;
    bookRef.current?.pageFlip().turnToPrevPage();
  }, []);

  const goToPage = useCallback(
    (page: number) => {
      const clamped = Math.max(0, Math.min(page, pageCount - 1));
      const current = bookRef.current?.pageFlip().getCurrentPageIndex() ?? pageIndex;
      if (clamped === current) {
        cascadeTargetRef.current = null;
        return;
      }
      cascadeTargetRef.current = clamped;
      cascadeStep(clamped);
    },
    [cascadeStep, pageCount, pageIndex],
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
      showCover: false,
      usePortrait: true,
      mobileScrollSupport: true,
      flippingTime: FLIP_MS,
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
        className="relative"
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
          aria-label="Jump to contents"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="hidden cursor-pointer rounded-full border border-[var(--gold)]/30 px-4 py-1.5 tracking-wide transition-colors hover:border-[var(--gold)] hover:text-[var(--gold-bright)] sm:inline-block"
        >
          Contents
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
