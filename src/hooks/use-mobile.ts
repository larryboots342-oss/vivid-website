"use client";

import { useState, useEffect, useCallback } from "react";

interface MobileState {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isTouch: boolean;
  isLowEnd: boolean;
  viewportWidth: number;
  viewportHeight: number;
}

function getMobileState(): MobileState {
  if (typeof window === "undefined") {
    return {
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      isTouch: false,
      isLowEnd: false,
      viewportWidth: 1024,
      viewportHeight: 768,
    };
  }

  const width = window.innerWidth;
  const height = window.innerHeight;
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;
  const isDesktop = width >= 1024;
  const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;

  // Detect low-end devices
  const isLowEnd =
    (navigator as any).deviceMemory !== undefined
      ? (navigator as any).deviceMemory < 4
      : false;

  return { isMobile, isTablet, isDesktop, isTouch, isLowEnd, viewportWidth: width, viewportHeight: height };
}

export function useMobile(): MobileState {
  const [state, setState] = useState<MobileState>(getMobileState);

  const handleResize = useCallback(() => {
    setState(getMobileState());
  }, []);

  useEffect(() => {
    window.addEventListener("resize", handleResize, { passive: true });
    window.addEventListener("orientationchange", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, [handleResize]);

  return state;
}

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return reduced;
}
