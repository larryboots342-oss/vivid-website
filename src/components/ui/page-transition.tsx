"use client";

import { motion, AnimatePresence, Variants } from "framer-motion";
import { ReactNode, useEffect, useState } from "react";

interface PageTransitionProps {
  children: ReactNode;
}

const variants: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function PageTransition({ children }: PageTransitionProps) {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Skip animation in dev or for users who prefer reduced motion
  if (process.env.NODE_ENV === "development" || reducedMotion) {
    return <>{children}</>;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={typeof window !== "undefined" ? window.location.pathname : "static"}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="gpu-animate"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
