export function AmbientGlow({ className = "" }: { className?: string }) {
  return (
    <div
      className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-vivid-primary/3 rounded-full blur-[150px] pointer-events-none ${className}`}
    />
  );
}
