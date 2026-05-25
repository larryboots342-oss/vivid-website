"use client";

import { useState, useEffect, RefObject, useRef, useCallback } from "react";

interface MousePosition {
  x: number;
  y: number;
  normalizedX: number;
  normalizedY: number;
}

export function useMousePosition(
  ref?: RefObject<HTMLElement | null>
): MousePosition {
  const [position, setPosition] = useState<MousePosition>({
    x: 0,
    y: 0,
    normalizedX: 0,
    normalizedY: 0,
  });

  const rafRef = useRef<number>(0);
  const pendingRef = useRef<MouseEvent | null>(null);

  const updatePosition = useCallback(
    (e: MouseEvent) => {
      if (ref?.current) {
        const rect = ref.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setPosition({
          x,
          y,
          normalizedX: x / rect.width - 0.5,
          normalizedY: y / rect.height - 0.5,
        });
      } else {
        setPosition({
          x: e.clientX,
          y: e.clientY,
          normalizedX: e.clientX / window.innerWidth - 0.5,
          normalizedY: e.clientY / window.innerHeight - 0.5,
        });
      }
    },
    [ref]
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      pendingRef.current = e;
      if (rafRef.current) return;

      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = 0;
        if (pendingRef.current) {
          updatePosition(pendingRef.current);
          pendingRef.current = null;
        }
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, [updatePosition]);

  return position;
}
