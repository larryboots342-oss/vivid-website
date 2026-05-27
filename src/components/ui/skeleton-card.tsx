export function SkeletonHeader() {
  return (
    <div className="h-12 w-1/3 bg-white/5 rounded-lg animate-pulse mb-16 mx-auto" />
  );
}

export function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div className={`bg-white/5 rounded-2xl animate-pulse ${className}`} />
  );
}
