import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 sm:h-10 w-full rounded-lg border border-vivid-border bg-vivid-bg px-3 py-2 text-base sm:text-sm text-white placeholder:text-vivid-textDim focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vivid-primary/50 focus-visible:border-vivid-primary/50 disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
