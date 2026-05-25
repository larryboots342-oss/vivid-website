"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SkeletonActivityProps {
  className?: string;
  delay?: number;
  items?: number;
}

export function SkeletonActivity({
  className,
  delay = 0,
  items = 4,
}: SkeletonActivityProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn("space-y-1", className)}
    >
      {Array.from({ length: items }).map((_, i) => (
        <div
          key={i}
          className="flex items-start gap-4 p-4 rounded-xl"
        >
          {/* Avatar */}
          <div className="w-10 h-10 rounded-xl bg-vivid-surfaceHover relative overflow-hidden shrink-0">
            <div className="absolute inset-0 shimmer" />
          </div>
          {/* Content */}
          <div className="flex-1 min-w-0 space-y-2 pt-1">
            <div className="h-3.5 w-3/4 rounded-lg bg-vivid-surfaceHover relative overflow-hidden">
              <div className="absolute inset-0 shimmer" />
            </div>
            <div className="h-3 w-1/2 rounded-lg bg-vivid-surfaceHover relative overflow-hidden">
              <div className="absolute inset-0 shimmer" />
            </div>
          </div>
          {/* Time */}
          <div className="h-2.5 w-12 rounded bg-vivid-surfaceHover relative overflow-hidden shrink-0 mt-1">
            <div className="absolute inset-0 shimmer" />
          </div>
        </div>
      ))}
    </motion.div>
  );
}
