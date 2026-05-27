"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springX = useSpring(cursorX, { stiffness: 500, damping: 28 });
  const springY = useSpring(cursorY, { stiffness: 500, damping: 28 });

  useEffect(() => {
    // Only show on desktop
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
    if (isMobile) return;

    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleEnter = () => setIsHovering(true);
    const handleLeave = () => setIsHovering(false);

    window.addEventListener("mousemove", move);

    const addListeners = () => {
      document.querySelectorAll("a, button, [role='button'], input, textarea, select, [data-cursor-hover]").forEach((el) => {
        el.addEventListener("mouseenter", handleEnter);
        el.addEventListener("mouseleave", handleLeave);
      });
    };

    // Initial attach + re-attach on DOM changes
    addListeners();
    const observer = new MutationObserver(addListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", move);
      observer.disconnect();
    };
  }, [cursorX, cursorY, isVisible]);

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference hidden md:block"
      style={{ x: springX, y: springY }}
    >
      <motion.div
        className="rounded-full bg-white"
        animate={{
          width: isHovering ? 48 : 12,
          height: isHovering ? 48 : 12,
          x: isHovering ? -24 : -6,
          y: isHovering ? -24 : -6,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      />
    </motion.div>
  );
}
