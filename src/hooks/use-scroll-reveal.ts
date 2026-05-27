"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealOptions {
  selector: string;
  y?: number;
  duration?: number;
  ease?: string;
  start?: string;
  stagger?: number;
  delay?: number;
  scale?: number;
}

export function useScrollReveal(options: ScrollRevealOptions) {
  const ref = useRef<HTMLDivElement>(null);
  const {
    selector,
    y = 50,
    duration = 0.8,
    ease = "power3.out",
    start = "top 85%",
    stagger = 0,
    delay = 0,
    scale,
  } = options;

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const fromVars: gsap.TweenVars = { y, opacity: 0 };
    const toVars: gsap.TweenVars = {
      y: 0,
      opacity: 1,
      duration,
      ease,
      stagger,
      delay,
      scrollTrigger: {
        trigger: ref.current,
        start,
      },
    };

    if (scale !== undefined) {
      fromVars.scale = scale;
      toVars.scale = 1;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(selector, fromVars, toVars);
    }, ref);

    return () => ctx.revert();
  }, [selector, y, duration, ease, start, stagger, delay, scale]);

  return ref;
}
