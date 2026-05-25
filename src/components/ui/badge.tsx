import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-vivid-primary/50 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-vivid-primary/10 text-vivid-primary hover:bg-vivid-primary/20",
        secondary:
          "border-transparent bg-vivid-surfaceHover text-vivid-textMuted hover:bg-vivid-border",
        destructive:
          "border-transparent bg-red-500/10 text-red-400 hover:bg-red-500/20",
        outline: "text-vivid-textMuted border-vivid-border",
        success:
          "border-transparent bg-green-500/10 text-green-400 hover:bg-green-500/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
