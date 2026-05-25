"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SkeletonStatProps {
  className?: string;
  delay?: number;
}

export function SkeletonStat({ className, delay = 0 }: SkeletonStatProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "rounded-2xl border border-vivid-border/40 bg-vivid-surface/30 p-5",
        className
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-vivid-surfaceHover relative overflow-hidden">
            <div className="absolute inset-0 shimmer" />
          </div>
          <div className="h-3 w-16 rounded-lg bg-vivid-surfaceHover relative overflow-hidden">
            <div className="absolute inset-0 shimmer" />
          </div>
        </div>
        <div className="h-5 w-12 rounded-full bg-vivid-surfaceHover relative overflow-hidden">
          <div className="absolute inset-0 shimmer" />
        </div>
      </div>
      <div className="h-8 w-20 rounded-lg bg-vivid-surfaceHover relative overflow-hidden mb-2">
        <div className="absolute inset-0 shimmer" />
      </div>
      <div className="h-3 w-32 rounded-lg bg-vivid-surfaceHover relative overflow-hidden">
        <div className="absolute inset-0 shimmer" />
      </div>
    </motion.div>
  );
}
