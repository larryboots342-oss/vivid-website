import { LucideIcon } from "lucide-react";
import { SectionBadge } from "./section-badge";

interface SectionHeaderProps {
  badge?: { icon: LucideIcon; label: string };
  title: React.ReactNode;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

export function SectionHeader({
  badge,
  title,
  subtitle,
  centered = true,
  className = "",
}: SectionHeaderProps) {
  return (
    <div className={`${centered ? "text-center" : ""} ${className}`}>
      {badge && <SectionBadge icon={badge.icon} label={badge.label} />}
      <h2 className="text-fluid-3xl font-bold mb-4 md:mb-6 text-balance">
        {title}
      </h2>
      {subtitle && (
        <p className="text-vivid-textMuted text-fluid-base max-w-2xl mx-auto leading-relaxed px-4">
          {subtitle}
        </p>
      )}
    </div>
  );
}
