import { Skeleton } from "@/components/ui/skeleton";

export default function MarketingLoading() {
  // In dev, show nothing — the page structure is visible while compiling
  if (process.env.NODE_ENV === "development") {
    return null;
  }

  return (
    <div className="min-h-screen bg-vivid-bg">
      {/* Hero skeleton */}
      <div className="h-screen flex flex-col items-center justify-center px-6">
        <Skeleton className="h-8 w-48 rounded-full mb-8" />
        <Skeleton className="h-24 w-64 md:w-96 rounded-xl mb-4" />
        <Skeleton className="h-24 w-48 md:w-72 rounded-xl mb-8" />
        <Skeleton className="h-6 w-full max-w-lg rounded-lg mb-10" />
        <div className="flex gap-4">
          <Skeleton className="h-14 w-40 rounded-xl" />
          <Skeleton className="h-14 w-40 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
