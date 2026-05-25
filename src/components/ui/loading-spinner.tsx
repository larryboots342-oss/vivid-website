"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  variant?: "default" | "primary" | "minimal" | "dots" | "orbit";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  label?: string;
}

const sizeMap = {
  sm: { container: "w-4 h-4", orbit: "w-1 h-1", dot: "w-1.5 h-1.5" },
  md: { container: "w-6 h-6", orbit: "w-1.5 h-1.5", dot: "w-2 h-2" },
  lg: { container: "w-8 h-8", orbit: "w-2 h-2", dot: "w-2.5 h-2.5" },
  xl: { container: "w-12 h-12", orbit: "w-2.5 h-2.5", dot: "w-3 h-3" },
};

export default function LoadingSpinner({
  variant = "default",
  size = "md",
  className,
  label,
}: LoadingSpinnerProps) {
  const s = sizeMap[size];

  if (variant === "orbit") {
    return (
      <div className={cn("relative inline-flex items-center justify-center", s.container, className)}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className={cn("absolute rounded-full bg-vivid-primary", s.orbit)}
            animate={{ rotate: 360 }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear",
              delay: i * 0.15,
            }}
            style={{
              transformOrigin: "center",
              margin: "auto",
            }}
          >
            <motion.div
              className="absolute rounded-full bg-vivid-primary"
              style={{
                width: "100%",
                height: "100%",
                transform: `translateX(${size === "sm" ? 6 : size === "md" ? 8 : size === "lg" ? 10 : 14}px)`,
              }}
            />
          </motion.div>
        ))}
        {label && <span className="sr-only">{label}</span>}
      </div>
    );
  }

  if (variant === "dots") {
    return (
      <div className={cn("flex items-center gap-1", className)}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className={cn("rounded-full bg-vivid-primary", s.dot)}
            animate={{
              scale: [0, 1, 0],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.15,
            }}
          />
        ))}
        {label && <span className="sr-only">{label}</span>}
      </div>
    );
  }

  if (variant === "minimal") {
    return (
      <motion.div
        className={cn(
          "rounded-full border-2 border-vivid-border/60 border-t-vivid-primary",
          s.container,
          className
        )}
        animate={{ rotate: 360 }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
      >
        {label && <span className="sr-only">{label}</span>}
      </motion.div>
    );
  }

  // Default & primary variants
  return (
    <div className={cn("relative inline-flex items-center justify-center", s.container, className)}>
      {/* Outer ring */}
      <motion.div
        className={cn(
          "absolute inset-0 rounded-full border-2",
          variant === "primary"
            ? "border-vivid-primary/20 border-t-vivid-primary"
            : "border-vivid-border/40 border-t-vivid-textMuted"
        )}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      {/* Inner ring (counter-rotate for premium feel) */}
      <motion.div
        className={cn(
          "absolute inset-1 rounded-full border-2",
          variant === "primary"
            ? "border-vivid-primary/10 border-b-vivid-primary/60"
            : "border-vivid-border/20 border-b-vivid-textDim"
        )}
        animate={{ rotate: -360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      />
      {label && <span className="sr-only">{label}</span>}
    </div>
  );
}
