import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  shimmer?: boolean;
}

function Skeleton({
  className,
  shimmer: useShimmer = false,
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        "rounded-md bg-vivid-surfaceHover relative overflow-hidden",
        useShimmer ? "" : "animate-pulse",
        className
      )}
      {...props}
    >
      {useShimmer && <div className="absolute inset-0 shimmer" />}
    </div>
  );
}

export { Skeleton };
