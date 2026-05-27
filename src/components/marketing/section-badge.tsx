import { LucideIcon } from "lucide-react";

interface SectionBadgeProps {
  icon: LucideIcon;
  label: string;
}

export function SectionBadge({ icon: Icon, label }: SectionBadgeProps) {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-vivid-primary/10 border border-vivid-primary/20 text-vivid-primary text-xs font-semibold uppercase tracking-wider mb-6">
      <Icon className="w-3.5 h-3.5" />
      {label}
    </div>
  );
}
