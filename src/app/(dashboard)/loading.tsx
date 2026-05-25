import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  // In dev, show nothing — instant navigation, no skeleton flash
  if (process.env.NODE_ENV === "development") {
    return null;
  }

  return (
    <div className="min-h-screen bg-vivid-bg p-6 lg:p-8 pt-20 lg:pt-6 max-w-7xl">
      {/* Header skeleton */}
      <div className="flex items-center justify-between mb-8">
        <Skeleton className="h-8 w-48 rounded-lg" />
        <Skeleton className="h-10 w-10 rounded-xl" />
      </div>

      {/* Stats skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-2xl" />
        ))}
      </div>

      {/* Content skeleton */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Skeleton className="h-80 rounded-2xl" />
        <Skeleton className="h-80 rounded-2xl lg:col-span-2" />
      </div>
    </div>
  );
}
