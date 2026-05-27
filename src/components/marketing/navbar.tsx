"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { useAuth } from "@clerk/nextjs";
import { SignInButton, UserButton } from "@clerk/nextjs";
import SignOutButton from "@/components/auth/sign-out-button";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Showcase", href: "#showcase" },
  { label: "FAQ", href: "#faq" },
];

const authItems = [
  { label: "Dashboard", href: "/dashboard" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const pathname = usePathname();
  const { isSignedIn } = useAuth();
  const { scrollY } = useScroll();
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 20);
  });

  useEffect(() => {
    if (pathname !== "/") return;

    const sections = navItems.map((item) => item.href.replace("#", ""));
    const observers: IntersectionObserver[] = [];

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(id);
            }
          });
        },
        { threshold: 0.3, rootMargin: "-80px 0px -60% 0px" }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [pathname]);

  const handleAnchorClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      if (href.startsWith("#")) {
        e.preventDefault();
        const id = href.replace("#", "");
        const el = document.getElementById(id);
        if (el) {
          const offset = 80;
          const top = el.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top, behavior: "smooth" });
        }
        setMobileOpen(false);
      }
    },
    []
  );

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      // Return focus to hamburger button when menu closes
      hamburgerRef.current?.focus();
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const isHome = pathname === "/";

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          scrolled
            ? "bg-vivid-bg/70 backdrop-blur-xl border-b border-vivid-border/40 shadow-lg shadow-black/20"
            : "bg-transparent"
        )}
      >
        <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group relative">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-vivid-primary to-vivid-primaryDim flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                <span className="text-vivid-bg font-bold text-sm">V</span>
              </div>
              <div className="absolute inset-0 rounded-xl bg-vivid-primary/40 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">
              VIVID
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = isHome && activeSection === item.href.replace("#", "");
              return (
                <Link
                  key={item.label}
                  href={isHome ? item.href : `/${item.href}`}
                  onClick={isHome ? (e) => handleAnchorClick(e, item.href) : undefined}
                  className="relative px-4 py-2 text-sm font-medium text-vivid-textMuted hover:text-white transition-colors duration-300 rounded-lg hover:bg-white/5 min-h-[44px] flex items-center"
                  aria-current={isActive ? "page" : undefined}
                >
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-vivid-primary rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {isSignedIn ? (
              <>
                <Link
                  href="/dashboard"
                  className="px-4 py-2 text-sm font-medium text-vivid-textMuted hover:text-white transition-colors duration-300 rounded-lg hover:bg-white/5"
                >
                  Dashboard
                </Link>
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8 ring-2 ring-vivid-primary/30 ring-offset-2 ring-offset-vivid-bg",
                    },
                  }}
                  userProfileUrl="/dashboard/settings"
                />
              </>
            ) : (
              <>
                <SignInButton mode="modal">
                  <button className="px-4 py-2 text-sm font-medium text-vivid-textMuted hover:text-white transition-colors duration-300 rounded-lg hover:bg-white/5">
                    Login
                  </button>
                </SignInButton>
                <Link
                  href="/pricing"
                  className="relative px-5 py-2 text-sm font-semibold text-vivid-bg bg-vivid-primary rounded-lg overflow-hidden group transition-transform duration-300 hover:scale-105"
                >
                  <span className="relative z-10">Get Started</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-vivid-primary to-vivid-primaryDim opacity-100 group-hover:opacity-90 transition-opacity" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-vivid-primary/30 blur-md" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            ref={hamburgerRef}
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden relative w-11 h-11 flex items-center justify-center rounded-lg hover:bg-white/5 transition-colors"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            <div className="w-5 h-4 relative flex flex-col justify-between">
              <motion.span
                animate={{
                  rotate: mobileOpen ? 45 : 0,
                  y: mobileOpen ? 6 : 0,
                }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="block w-full h-0.5 bg-white origin-center"
              />
              <motion.span
                animate={{
                  opacity: mobileOpen ? 0 : 1,
                  scaleX: mobileOpen ? 0 : 1,
                }}
                transition={{ duration: 0.2 }}
                className="block w-full h-0.5 bg-white"
              />
              <motion.span
                animate={{
                  rotate: mobileOpen ? -45 : 0,
                  y: mobileOpen ? -6 : 0,
                }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="block w-full h-0.5 bg-white origin-center"
              />
            </div>
          </button>
        </nav>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
              onClick={() => setMobileOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              id="mobile-menu"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="fixed top-16 left-4 right-4 z-40 md:hidden gpu-animate"
            >
              <div className="rounded-2xl border border-vivid-border/60 bg-vivid-surface/95 backdrop-blur-xl shadow-2xl shadow-black/40 overflow-hidden">
                <div className="p-2">
                  {navItems.map((item, i) => {
                    const isActive = isHome && activeSection === item.href.replace("#", "");
                    return (
                      <motion.div
                        key={item.label}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 + 0.1 }}
                      >
                        <Link
                          href={isHome ? item.href : `/${item.href}`}
                          onClick={isHome ? (e) => handleAnchorClick(e, item.href) : () => setMobileOpen(false)}
                          className={cn(
                            "flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-colors touch-target",
                            isActive
                              ? "text-vivid-primary bg-vivid-primary/10"
                              : "text-vivid-textMuted hover:text-white hover:bg-white/5"
                          )}
                        >
                          <span className={cn("w-1.5 h-1.5 rounded-full", isActive ? "bg-vivid-primary" : "bg-vivid-textDim")} />
                          {item.label}
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>

                <div className="border-t border-vivid-border/40 p-4 space-y-2">
                  {isSignedIn ? (
                    <>
                      <Link
                        href="/dashboard"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium text-vivid-textMuted hover:text-white hover:bg-white/5 transition-colors touch-target"
                      >
                        Dashboard
                      </Link>
                      <div className="px-4 py-2">
                        <UserButton
                          userProfileUrl="/dashboard/settings"
                        />
                      </div>
                      <SignOutButton
                        variant="menu"
                        className="!text-vivid-accent hover:!text-vivid-accent hover:!bg-vivid-accent/10"
                      />
                    </>
                  ) : (
                    <>
                      <SignInButton mode="modal">
                        <button className="w-full text-left px-4 py-3.5 rounded-xl text-sm font-medium text-vivid-textMuted hover:text-white hover:bg-white/5 transition-colors touch-target">
                          Login
                        </button>
                      </SignInButton>
                      <Link
                        href="/pricing"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl text-sm font-semibold text-vivid-bg bg-vivid-primary hover:bg-vivid-primaryDim transition-colors touch-target"
                      >
                        Get Started
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
