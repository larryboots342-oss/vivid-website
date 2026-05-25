"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SkeletonChartProps {
  className?: string;
  delay?: number;
  bars?: number;
}

export function SkeletonChart({ className, delay = 0, bars = 7 }: SkeletonChartProps) {
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
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-2">
          <div className="h-5 w-40 rounded-lg bg-vivid-surfaceHover relative overflow-hidden">
            <div className="absolute inset-0 shimmer" />
          </div>
          <div className="h-3 w-56 rounded-lg bg-vivid-surfaceHover relative overflow-hidden">
            <div className="absolute inset-0 shimmer" />
          </div>
        </div>
        <div className="h-8 w-24 rounded-lg bg-vivid-surfaceHover relative overflow-hidden">
          <div className="absolute inset-0 shimmer" />
        </div>
      </div>
      {/* Bars */}
      <div className="flex items-end justify-between gap-3 h-40">
        {Array.from({ length: bars }).map((_, i) => {
          const height = 30 + Math.random() * 60;
          return (
            <motion.div
              key={i}
              className="flex-1 flex flex-col items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: delay + i * 0.05 }}
            >
              <div
                className="w-full max-w-[48px] rounded-t-lg bg-vivid-surfaceHover relative overflow-hidden"
                style={{ height: `${height}%` }}
              >
                <div className="absolute inset-0 shimmer" />
              </div>
              <div className="h-2.5 w-6 rounded bg-vivid-surfaceHover relative overflow-hidden">
                <div className="absolute inset-0 shimmer" />
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
