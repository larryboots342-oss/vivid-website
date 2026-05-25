"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SkeletonCardProps {
  className?: string;
  delay?: number;
}

export function SkeletonCard({ className, delay = 0 }: SkeletonCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "rounded-2xl border border-vivid-border/40 bg-vivid-surface/30 p-6",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-vivid-surfaceHover relative overflow-hidden">
          <div className="absolute inset-0 shimmer" />
        </div>
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 rounded-lg bg-vivid-surfaceHover relative overflow-hidden">
            <div className="absolute inset-0 shimmer" />
          </div>
          <div className="h-3 w-1/2 rounded-lg bg-vivid-surfaceHover relative overflow-hidden">
            <div className="absolute inset-0 shimmer" />
          </div>
        </div>
      </div>
      {/* Body lines */}
      <div className="space-y-3">
        <div className="h-3 w-full rounded-lg bg-vivid-surfaceHover relative overflow-hidden">
          <div className="absolute inset-0 shimmer" />
        </div>
        <div className="h-3 w-5/6 rounded-lg bg-vivid-surfaceHover relative overflow-hidden">
          <div className="absolute inset-0 shimmer" />
        </div>
        <div className="h-3 w-4/6 rounded-lg bg-vivid-surfaceHover relative overflow-hidden">
          <div className="absolute inset-0 shimmer" />
        </div>
      </div>
    </motion.div>
  );
}
