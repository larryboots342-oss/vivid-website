import { cn } from "@/lib/utils";

export function SkeletonHeader() {
  return (
    <div className="h-12 w-1/3 bg-white/5 rounded-lg skeleton-shimmer mb-16 mx-auto" />
  );
}

export function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div className={cn("bg-white/5 rounded-2xl skeleton-shimmer", className)} />
  );
}
