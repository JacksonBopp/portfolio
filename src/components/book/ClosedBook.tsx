"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { profile } from "@/data/profile";
import { useBookSize } from "./useBookSize";

const THICKNESS = 30;

type ClosedBookProps = {
  onOpen: () => void;
};

export default function ClosedBook({ onOpen }: ClosedBookProps) {
  const { width, height } = useBookSize();
  const [opening, setOpening] = useState(false);

  const handleOpen = () => {
    if (opening) return;
    setOpening(true);
    window.setTimeout(onOpen, 850);
  };

  return (
    <div
      className="flex items-center justify-center"
      style={{ perspective: 2200, width, height: height + 40 }}
    >
      <motion.button
        type="button"
        onClick={handleOpen}
        aria-label="Open the book"
        className="book3d cursor-pointer"
        initial={{ opacity: 0, y: 30 }}
        animate={{
          opacity: opening ? 0 : 1,
          y: 0,
          rotateY: opening ? -70 : -22,
        }}
        whileHover={opening ? undefined : { rotateY: -16, scale: 1.02 }}
        transition={{ duration: opening ? 0.85 : 0.9, ease: [0.16, 1, 0.3, 1] }}
        style={{
          width,
          height,
          transformStyle: "preserve-3d",
        }}
      >
        {/* page stack, fanned out behind the cover to read as real thickness */}
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="book3d__leaf"
            style={{
              transform: `translateZ(${-i * 3}px) translate(${i * 1.5}px, ${i * 1.5}px)`,
            }}
          />
        ))}

        {/* spine, the book's left-facing edge */}
        <div
          className="book3d__spine"
          style={{
            width: THICKNESS,
            height,
            transform: `rotateY(-90deg) translateZ(${-THICKNESS / 2}px) translateX(${-THICKNESS / 2}px)`,
          }}
        >
          <span className="book3d__spine-label">{profile.name}</span>
        </div>

        {/* front cover */}
        <div
          className="book3d__cover book-cover-face"
          style={{ width, height, transform: "translateZ(1px)" }}
        >
          <div className="flex h-full flex-col items-center justify-center gap-6 p-8 text-center">
            <div className="wax-seal flex h-20 w-20 items-center justify-center rounded-full font-display text-xl tracking-widest sm:h-24 sm:w-24 sm:text-2xl">
              {profile.initials}
            </div>
            <div aria-hidden className="flourish text-lg">
              &#10086;
            </div>
            <div>
              <h1 className="font-display text-3xl font-semibold tracking-tight text-[var(--gold-bright)] sm:text-4xl">
                {profile.name}
              </h1>
              <p className="mt-3 font-sans text-sm uppercase tracking-[0.25em] text-gold/80 sm:text-base">
                {profile.tagline}
              </p>
            </div>
            <p className="max-w-[22ch] font-serif text-base italic text-gold/70 sm:text-lg">
              {profile.subtagline}
            </p>
            <div className="mt-4 font-sans text-[11px] uppercase tracking-[0.3em] text-gold/50">
              Open the book →
            </div>
          </div>
        </div>
      </motion.button>
    </div>
  );
}
