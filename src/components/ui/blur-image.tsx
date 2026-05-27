"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface BlurImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  priority?: boolean;
  className?: string;
  containerClassName?: string;
  placeholderColor?: string;
  placeholderSrc?: string;
  sizes?: string;
  onLoad?: () => void;
}

export default function BlurImage({
  src,
  alt,
  width,
  height,
  fill = false,
  priority = false,
  className,
  containerClassName,
  placeholderColor = "#111111",
  placeholderSrc,
  sizes,
  onLoad,
}: BlurImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    onLoad?.();
  }, [onLoad]);

  // Skip blur animation for priority images
  const skipAnimation = priority;

  return (
    <div
      className={cn(
        "relative overflow-hidden",
        fill && "absolute inset-0",
        containerClassName
      )}
      style={{
        backgroundColor: placeholderColor,
      }}
    >
      {/* Blur placeholder */}
      {!skipAnimation && (
        <AnimatePresence>
          {!isLoaded && (
            <motion.div
              className="absolute inset-0 z-10"
              initial={{ opacity: 1, scale: 1.05 }}
              exit={{ opacity: 0, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              {placeholderSrc ? (
                <Image
                  src={placeholderSrc}
                  alt=""
                  fill
                  className="object-cover"
                  aria-hidden="true"
                />
              ) : (
                <div
                  className="w-full h-full"
                  style={{
                    background: `linear-gradient(135deg, ${placeholderColor} 0%, #1a1a2e 50%, ${placeholderColor} 100%)`,
                  }}
                />
              )}
              {/* Subtle shimmer on placeholder */}
              <div className="absolute inset-0 shimmer opacity-30" />
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Actual image */}
      <Image
        src={src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        priority={priority}
        sizes={sizes}
        onLoad={handleLoad}
        className={cn(
          "transition-opacity duration-500",
          !skipAnimation && !isLoaded ? "opacity-0" : "opacity-100",
          className
        )}
      />
    </div>
  );
}
