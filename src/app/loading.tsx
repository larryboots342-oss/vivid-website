export default function RootLoading() {
  // In dev, show nothing — the page structure is visible while compiling
  if (process.env.NODE_ENV === "development") {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-vivid-bg">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-2 border-vivid-primary/20" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-vivid-primary animate-spin" />
        </div>
        <p className="text-vivid-textMuted text-sm animate-pulse">Loading...</p>
      </div>
    </div>
  );
}
