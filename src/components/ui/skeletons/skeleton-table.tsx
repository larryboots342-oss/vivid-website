"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SkeletonTableProps {
  className?: string;
  delay?: number;
  rows?: number;
  columns?: number;
}

export function SkeletonTable({
  className,
  delay = 0,
  rows = 5,
  columns = 4,
}: SkeletonTableProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "rounded-2xl border border-vivid-border/40 bg-vivid-surface/30 overflow-hidden",
        className
      )}
    >
      {/* Header row */}
      <div className="flex items-center gap-4 px-6 py-4 border-b border-vivid-border/30 bg-white/[0.02]">
        {Array.from({ length: columns }).map((_, i) => (
          <div
            key={`header-${i}`}
            className="h-4 rounded-lg bg-vivid-surfaceHover relative overflow-hidden flex-1"
            style={{ maxWidth: i === 0 ? "40%" : undefined }}
          >
            <div className="absolute inset-0 shimmer" />
          </div>
        ))}
      </div>
      {/* Data rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={`row-${rowIndex}`}
          className="flex items-center gap-4 px-6 py-4 border-b border-vivid-border/20 last:border-b-0"
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div
              key={`cell-${rowIndex}-${colIndex}`}
              className="h-3.5 rounded-lg bg-vivid-surfaceHover relative overflow-hidden flex-1"
              style={{
                maxWidth: colIndex === 0 ? "40%" : undefined,
                opacity: 0.7 + Math.random() * 0.3,
              }}
            >
              <div className="absolute inset-0 shimmer" />
            </div>
          ))}
        </div>
      ))}
    </motion.div>
  );
}
