"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function PageLoader() {
  // Skip loader entirely in development — it just adds unnecessary delay
  // and masks compilation time. Production builds are fast enough without it.
  if (process.env.NODE_ENV === "development") {
    return null;
  }

  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const canDismissRef = useRef(false);

  // Simulate progress
  useEffect(() => {
    if (!isLoading) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        // Slow down as we approach 90%
        const increment = prev < 30 ? 12 : prev < 60 ? 8 : prev < 80 ? 4 : 2;
        return Math.min(prev + increment + Math.random() * 4, 90);
      });
    }, 120);

    return () => clearInterval(interval);
  }, [isLoading]);

  // Track current progress in a ref to avoid stale closures
  const progressRef = useRef(progress);
  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  // Minimum display time + window load + safety timeout
  useEffect(() => {
    const minTimer = setTimeout(() => {
      canDismissRef.current = true;
      // If already at 100%, dismiss now
      if (progressRef.current >= 100) {
        setIsLoading(false);
      }
    }, 800);

    // Safety timeout — never block the UI for more than 3 seconds
    const safetyTimer = setTimeout(() => {
      setProgress(100);
      setIsLoading(false);
    }, 3000);

    const handleLoad = () => {
      setProgress(100);
      // Wait a beat at 100% before dismissing
      setTimeout(() => {
        if (canDismissRef.current) {
          setIsLoading(false);
        }
      }, 300);
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
    }

    return () => {
      clearTimeout(minTimer);
      clearTimeout(safetyTimer);
      window.removeEventListener("load", handleLoad);
    };
  }, []);

  // Dismiss when progress hits 100% and min time has passed
  useEffect(() => {
    if (progress >= 100 && canDismissRef.current) {
      const timer = setTimeout(() => setIsLoading(false), 300);
      return () => clearTimeout(timer);
    }
  }, [progress]);

  const handleAnimationComplete = useCallback(() => {
    // Cleanup after exit animation
    document.body.style.overflow = "";
  }, []);

  // Lock scroll while loading
  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isLoading]);

  return (
    <AnimatePresence onExitComplete={handleAnimationComplete}>
      {isLoading && (
        <motion.div
          key="page-loader"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-vivid-bg"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -40, filter: "blur(12px)" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Ambient glow */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-vivid-primary/[0.03] rounded-full blur-[120px]" />
          </div>

          {/* Logo with SVG draw animation */}
          <motion.div
            className="relative mb-10"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Glow ring */}
            <motion.div
              className="absolute inset-0 rounded-3xl bg-vivid-primary/20 blur-2xl"
              animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.35, 0.2] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              style={{ margin: "-20px" }}
            />

            {/* Logo container */}
            <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-vivid-primary to-vivid-primaryDim flex items-center justify-center">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent" />
              <svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                className="relative z-10"
              >
                <motion.path
                  d="M10 8L20 32L30 8"
                  stroke="#0a0a0f"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                />
                <motion.path
                  d="M14 20H26"
                  stroke="#0a0a0f"
                  strokeWidth="3"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.8 }}
                />
              </svg>
            </div>

            {/* Sparkle particles */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-vivid-primary"
                style={{
                  top: `${20 + Math.random() * 60}%`,
                  left: `${20 + Math.random() * 60}%`,
                }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 0.8, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.25 + 0.5,
                  ease: "easeInOut",
                }}
              />
            ))}
          </motion.div>

          {/* Brand name */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1 className="text-2xl font-bold text-white tracking-tight mb-1">
              VIVID
            </h1>
            <p className="text-xs text-vivid-textDim uppercase tracking-[0.3em]">
              Loading Experience
            </p>
          </motion.div>

          {/* Progress bar */}
          <motion.div
            className="w-48 h-1 rounded-full bg-vivid-surfaceHover overflow-hidden relative"
            initial={{ opacity: 0, scaleX: 0.8 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            role="progressbar"
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Page loading progress"
          >
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-vivid-primary to-vivid-primaryDim"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
            {/* Shimmer on progress bar */}
            <div className="absolute inset-0 animate-progress-shimmer rounded-full" />
          </motion.div>

          {/* Progress percentage */}
          <motion.p
            className="mt-3 text-xs text-vivid-textDim font-mono tabular-nums"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            {Math.round(progress)}%
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
