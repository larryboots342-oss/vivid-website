import { SkeletonCard } from "./skeleton-card";

export function SkeletonGrid({
  count = 3,
  className = "",
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div className={`grid gap-6 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} className="h-64" />
      ))}
    </div>
  );
}
