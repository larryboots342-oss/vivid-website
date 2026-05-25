"use client";

import { motion } from "framer-motion";
import { SkeletonStat } from "./skeleton-stat";
import { SkeletonCard } from "./skeleton-card";
import { SkeletonChart } from "./skeleton-chart";
import { SkeletonActivity } from "./skeleton-activity";
import { cn } from "@/lib/utils";

interface SkeletonPageProps {
  className?: string;
}

export function SkeletonPage({ className }: SkeletonPageProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={cn("space-y-8", className)}
    >
      {/* Welcome header */}
      <div className="space-y-2">
        <div className="h-9 w-64 rounded-xl bg-vivid-surfaceHover relative overflow-hidden">
          <div className="absolute inset-0 shimmer" />
        </div>
        <div className="h-4 w-80 rounded-lg bg-vivid-surfaceHover relative overflow-hidden">
          <div className="absolute inset-0 shimmer" />
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SkeletonStat delay={0.05} />
        <SkeletonStat delay={0.1} />
        <SkeletonStat delay={0.15} />
        <SkeletonStat delay={0.2} />
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <SkeletonCard className="h-full" delay={0.25} />
        <div className="lg:col-span-2 space-y-1 rounded-2xl border border-vivid-border/40 bg-vivid-surface/30 p-6">
          <SkeletonActivity delay={0.3} items={5} />
        </div>
      </div>

      {/* Chart */}
      <SkeletonChart delay={0.35} />
    </motion.div>
  );
}
