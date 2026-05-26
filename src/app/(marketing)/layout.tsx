"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/marketing/navbar";
import ScrollToHash from "@/components/marketing/scroll-to-hash";

const Footer = dynamic(() => import("@/components/marketing/footer"), {
  loading: () => (
    <div className="h-64 border-t border-vivid-border/40 bg-vivid-surface/30 animate-pulse" />
  ),
});

const ParticleBackground = dynamic(
  () => import("@/components/marketing/particle-background"),
  { ssr: false }
);

const PageTransition = dynamic(
  () => import("@/components/marketing/page-transition"),
  { ssr: false }
);

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-vivid-bg">
      <Suspense fallback={null}>
        <ParticleBackground />
      </Suspense>
      <ScrollToHash />
      <Navbar />
      <div id="main-content" className="pt-16" tabIndex={-1}>
        <PageTransition>{children}</PageTransition>
      </div>
      <Footer />
    </div>
  );
}
