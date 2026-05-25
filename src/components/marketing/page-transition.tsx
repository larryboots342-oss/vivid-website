"use client";

import { motion, AnimatePresence, Variants } from "framer-motion";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

interface PageTransitionProps {
  children: ReactNode;
  variant?: "cinematic" | "subtle" | "none";
}

const cinematicVariants: Variants = {
  initial: {
    opacity: 0,
    y: 16,
    filter: "blur(8px)",
    scale: 0.985,
  },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    scale: 1,
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.04,
    },
  },
  exit: {
    opacity: 0,
    y: -12,
    filter: "blur(6px)",
    scale: 0.99,
    transition: {
      duration: 0.25,
      ease: [0.55, 0, 1, 0.45],
    },
  },
};

const subtleVariants: Variants = {
  initial: {
    opacity: 0,
    y: 8,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -4,
    transition: {
      duration: 0.18,
      ease: [0.55, 0, 1, 0.45],
    },
  },
};

const childVariants: Variants = {
  initial: {
    opacity: 0,
    y: 12,
    filter: "blur(4px)",
  },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function PageTransition({
  children,
  variant = "cinematic",
}: PageTransitionProps) {
  const pathname = usePathname();
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Skip animation in dev — instant render, no fade-in delay
  if (
    process.env.NODE_ENV === "development" ||
    variant === "none" ||
    reducedMotion
  ) {
    return <>{children}</>;
  }

  const variants = variant === "subtle" ? subtleVariants : cinematicVariants;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="gpu-animate"
      >
        {variant === "cinematic" ? (
          <motion.div variants={childVariants} className="gpu-animate">
            {children}
          </motion.div>
        ) : (
          children
        )}
      </motion.div>
    </AnimatePresence>
  );
}
