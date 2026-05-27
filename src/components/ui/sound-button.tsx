"use client";

import { useCallback } from "react";
import { cn } from "@/lib/utils";

interface SoundButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary";
}

// Subtle click sound using Web Audio API
function playClickSound(variant: "primary" | "secondary" = "primary") {
  try {
    const AC: typeof AudioContext | undefined = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    const ctx = new AC();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    if (variant === "primary") {
      oscillator.frequency.setValueAtTime(800, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.08);
    } else {
      oscillator.frequency.setValueAtTime(400, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.08);
    }

    gainNode.gain.setValueAtTime(0.03, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.1);
  } catch {
    // Silently fail if audio is not supported
  }
}

export function SoundButton({
  children,
  className,
  variant = "primary",
  onClick,
  ...props
}: SoundButtonProps) {
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      playClickSound(variant);
      onClick?.(e);
    },
    [onClick, variant]
  );

  return (
    <button
      className={cn(className)}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
}
