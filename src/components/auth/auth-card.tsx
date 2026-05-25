"use client";

import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

/* ── Minimal particle canvas for auth pages ─────────────────────── */
function AuthParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
      a: number;
    }> = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const init = () => {
      resize();
      particles.length = 0;
      for (let i = 0; i < 30; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.2,
          r: Math.random() * 1.5 + 0.5,
          a: Math.random() * 0.3 + 0.1,
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 245, 255, ${p.a})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };

    init();
    draw();
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.5 }}
      aria-hidden="true"
    />
  );
}

/* ── Auth Card ──────────────────────────────────────────────────── */
interface AuthCardProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  showBackLink?: boolean;
  className?: string;
}

export default function AuthCard({
  children,
  title,
  subtitle,
  showBackLink = true,
  className,
}: AuthCardProps) {
  return (
    <main id="main-content" className="relative min-h-screen bg-vivid-bg flex items-center justify-center px-6 py-12 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-vivid-primary/[0.04] rounded-full blur-[180px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/[0.02] rounded-full blur-[150px]" />
      </div>

      <AuthParticles />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={cn("relative z-10 w-full max-w-[440px]", className)}
      >
        {/* Back link */}
        {showBackLink && (
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-vivid-textMuted hover:text-white transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to home
          </Link>
        )}

        {/* Card */}
        <div className="relative rounded-3xl border border-vivid-border/50 bg-vivid-surface/60 backdrop-blur-2xl shadow-2xl shadow-black/30 overflow-hidden">
          {/* Top gradient line */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-vivid-primary/40 to-transparent" />

          {/* Header */}
          <div className="px-8 pt-10 pb-6 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 mb-6 group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-vivid-primary to-vivid-primaryDim flex items-center justify-center">
                <span className="text-vivid-bg font-bold text-lg">V</span>
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                VIVID
              </span>
            </Link>
            <h1 className="text-2xl font-bold text-white mb-2">{title}</h1>
            {subtitle && (
              <p className="text-sm text-vivid-textMuted">{subtitle}</p>
            )}
          </div>

          {/* Content */}
          <div className="px-8 pb-10">{children}</div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-vivid-textDim mt-8">
          Secure authentication powered by Clerk
        </p>
      </motion.div>
    </main>
  );
}
