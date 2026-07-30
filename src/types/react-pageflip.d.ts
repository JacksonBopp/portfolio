declare module "react-pageflip" {
  import * as React from "react";

  export interface FlipEvent {
    data: number;
    object: unknown;
  }

  export interface PageFlipInstance {
    flipNext: (corner?: "top" | "bottom") => void;
    flipPrev: (corner?: "top" | "bottom") => void;
    flip: (pageNum: number, corner?: "top" | "bottom") => void;
    turnToPage: (pageNum: number) => void;
    turnToNextPage: () => void;
    turnToPrevPage: () => void;
    getCurrentPageIndex: () => number;
    getPageCount: () => number;
  }

  export interface HTMLFlipBookHandle {
    pageFlip: () => PageFlipInstance;
  }

  export interface HTMLFlipBookProps {
    width: number;
    height: number;
    size?: "fixed" | "stretch";
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
    drawShadow?: boolean;
    flippingTime?: number;
    usePortrait?: boolean;
    startZIndex?: number;
    autoSize?: boolean;
    maxShadowOpacity?: number;
    showCover?: boolean;
    mobileScrollSupport?: boolean;
    swipeDistance?: number;
    clickEventForward?: boolean;
    useMouseEvents?: boolean;
    renderOnlyPageLengthChange?: boolean;
    startPage?: number;
    disableFlipByClick?: boolean;
    showPageCorners?: boolean;
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
    onFlip?: (e: FlipEvent) => void;
    onChangeOrientation?: (e: FlipEvent) => void;
    onChangeState?: (e: FlipEvent) => void;
    onInit?: (e: FlipEvent) => void;
    onUpdate?: (e: FlipEvent) => void;
  }

  const HTMLFlipBook: React.ForwardRefExoticComponent<
    HTMLFlipBookProps & React.RefAttributes<HTMLFlipBookHandle>
  >;

  export default HTMLFlipBook;
}
