"use client";

import { cn } from "@/lib/utils";

interface LinkRevealProps {
  children: string;
  className?: string;
}

export function LinkReveal({ children, className }: LinkRevealProps) {
  return (
    <span className={cn("link-reveal", className)}>
      <span>{children}</span>
      <span aria-hidden="true">{children}</span>
    </span>
  );
}
