"use client";

import { useEffect, useState } from "react";

export const ASPECT_RATIO = 1.42;
export const CHROME_HEIGHT = 132;
export const MIN_WIDTH = 260;
export const MAX_WIDTH = 480;

export function useBookSize() {
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
