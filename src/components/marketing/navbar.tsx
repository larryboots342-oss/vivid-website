"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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

/* ── Focus Trap Hook ─────────────────────────────────────────────── */
function useFocusTrap(isActive: boolean, containerRef: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(', ');

    const getFocusable = () => Array.from(container.querySelectorAll<HTMLElement>(focusableSelectors)).filter((el) => el.offsetParent !== null);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const focusable = getFocusable();
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    // Focus first element
    const focusable = getFocusable();
    if (focusable.length > 0) focusable[0].focus();

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isActive, containerRef]);
}

/* ── Swipe to Close Hook ─────────────────────────────────────────── */
function useSwipeToClose(
  isOpen: boolean,
  onClose: () => void,
  direction: 'left' | 'right' | 'up' | 'down' = 'left',
  threshold = 80
) {
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleTouchStart = (e: TouchEvent) => {
      touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStart.current) return;
      const dx = e.changedTouches[0].clientX - touchStart.current.x;
      const dy = e.changedTouches[0].clientY - touchStart.current.y;
      touchStart.current = null;

      let shouldClose = false;
      if (direction === 'left' && dx < -threshold && Math.abs(dx) > Math.abs(dy)) shouldClose = true;
      if (direction === 'right' && dx > threshold && Math.abs(dx) > Math.abs(dy)) shouldClose = true;
      if (direction === 'up' && dy < -threshold && Math.abs(dy) > Math.abs(dx)) shouldClose = true;
      if (direction === 'down' && dy > threshold && Math.abs(dy) > Math.abs(dx)) shouldClose = true;

      if (shouldClose) onClose();
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isOpen, onClose, direction, threshold]);
}

/* ── Discord Icon ────────────────────────────────────────────────── */
function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
    </svg>
  );
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const pathname = usePathname();
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { scrollY } = useScroll();
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 20);
  });

  /* Close on route change */
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

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

  /* Body scroll lock */
  useEffect(() => {
    if (mobileOpen) {
      const originalOverflow = document.body.style.overflow;
      const originalPaddingRight = document.body.style.paddingRight;
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;
      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.paddingRight = originalPaddingRight;
      };
    }
  }, [mobileOpen]);

  /* Return focus to hamburger when menu closes */
  useEffect(() => {
    if (!mobileOpen) {
      hamburgerRef.current?.focus();
    }
  }, [mobileOpen]);

  /* Focus trap + swipe to close */
  useFocusTrap(mobileOpen, mobileMenuRef);
  useSwipeToClose(mobileOpen, () => setMobileOpen(false), 'left', 80);

  const isHome = pathname === "/";

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500 safe-top",
          scrolled
            ? "bg-vivid-bg/70 backdrop-blur-xl border-b border-vivid-border/40 shadow-lg shadow-black/20"
            : "bg-transparent"
        )}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group relative min-h-[44px]">
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
                  className="relative px-4 py-2 text-sm font-medium text-vivid-textMuted hover:text-white transition-colors duration-300 rounded-lg hover:bg-white/5 min-h-[44px] flex items-center link-underline"
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
            <a
              href="https://discord.gg/KHXpfmF3"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Join our Discord community"
              className="relative px-3 py-2 text-vivid-textMuted hover:text-[#5865F2] transition-colors duration-300 rounded-lg hover:bg-[#5865F2]/10 min-h-[44px] w-11 flex items-center justify-center link-underline group"
            >
              <DiscordIcon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
              <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-[0_0_20px_rgba(88,101,242,0.25)] pointer-events-none" />
            </a>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {isSignedIn ? (
              <>
                <Link
                  href="/dashboard"
                  onMouseEnter={() => router.prefetch("/dashboard")}
                  className="px-4 py-2 text-sm font-medium text-vivid-textMuted hover:text-white transition-colors duration-300 rounded-lg hover:bg-white/5 link-underline min-h-[44px] flex items-center"
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
                  <button className="px-4 py-2 text-sm font-medium text-vivid-textMuted hover:text-white transition-colors duration-300 rounded-lg hover:bg-white/5 min-h-[44px]">
                    Login
                  </button>
                </SignInButton>
                <Link
                  href="/pricing"
                  className="relative px-5 py-2 text-sm font-semibold text-vivid-bg bg-vivid-primary rounded-lg overflow-hidden group transition-transform duration-300 hover:scale-105 min-h-[44px] flex items-center"
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
            className="md:hidden relative w-11 h-11 flex items-center justify-center rounded-lg hover:bg-white/5 transition-colors touch-target"
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

      {/* Mobile Menu Overlay - Full Screen */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md md:hidden"
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />

            {/* Menu Panel - Full screen slide from right */}
            <motion.div
              id="mobile-menu"
              ref={mobileMenuRef}
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-0 z-50 md:hidden gpu-animate flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 pt-safe h-16 shrink-0">
                <Link href="/" className="flex items-center gap-3 group" onClick={() => setMobileOpen(false)}>
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-vivid-primary to-vivid-primaryDim flex items-center justify-center">
                    <span className="text-vivid-bg font-bold text-sm">V</span>
                  </div>
                  <span className="text-lg font-bold tracking-tight text-white">VIVID</span>
                </Link>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="w-11 h-11 flex items-center justify-center rounded-lg hover:bg-white/5 transition-colors touch-target"
                  aria-label="Close menu"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              {/* Nav Items */}
              <div className="flex-1 overflow-y-auto px-4 py-6">
                <div className="space-y-2">
                  {navItems.map((item, i) => {
                    const isActive = isHome && activeSection === item.href.replace("#", "");
                    return (
                      <motion.div
                        key={item.label}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 + 0.1 }}
                      >
                        <Link
                          href={isHome ? item.href : `/${item.href}`}
                          onClick={isHome ? (e) => handleAnchorClick(e, item.href) : () => setMobileOpen(false)}
                          className={cn(
                            "flex items-center gap-4 px-4 py-4 rounded-xl text-base font-medium transition-colors touch-target",
                            isActive
                              ? "text-vivid-primary bg-vivid-primary/10"
                              : "text-vivid-textMuted hover:text-white hover:bg-white/5"
                          )}
                        >
                          <span className={cn("w-2 h-2 rounded-full", isActive ? "bg-vivid-primary" : "bg-vivid-textDim")} />
                          {item.label}
                        </Link>
                      </motion.div>
                    );
                  })}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: navItems.length * 0.05 + 0.1 }}
                  >
                    <a
                      href="https://discord.gg/KHXpfmF3"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Join our Discord community"
                      className="flex items-center gap-4 px-4 py-4 rounded-xl text-base font-medium text-vivid-textMuted hover:text-[#5865F2] hover:bg-[#5865F2]/10 transition-colors touch-target"
                    >
                      <DiscordIcon className="w-5 h-5 shrink-0" />
                      Discord
                    </a>
                  </motion.div>
                </div>

                <div className="mt-8 pt-8 border-t border-vivid-border/40 space-y-3">
                  {isSignedIn ? (
                    <>
                      <Link
                        href="/dashboard"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-4 px-4 py-4 rounded-xl text-base font-medium text-vivid-textMuted hover:text-white hover:bg-white/5 transition-colors touch-target"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect width="7" height="9" x="3" y="3" rx="1" />
                          <rect width="7" height="5" x="14" y="3" rx="1" />
                          <rect width="7" height="9" x="14" y="12" rx="1" />
                          <rect width="7" height="5" x="3" y="16" rx="1" />
                        </svg>
                        Dashboard
                      </Link>
                      <div className="px-4 py-2">
                        <UserButton
                          userProfileUrl="/dashboard/settings"
                          appearance={{
                            elements: {
                              avatarBox: "w-10 h-10 ring-2 ring-vivid-primary/30",
                            },
                          }}
                        />
                      </div>
                      <SignOutButton
                        variant="menu"
                        className="!text-vivid-accent hover:!text-vivid-accent hover:!bg-vivid-accent/10 touch-target"
                      />
                    </>
                  ) : (
                    <>
                      <SignInButton mode="modal">
                        <button className="w-full text-left px-4 py-4 rounded-xl text-base font-medium text-vivid-textMuted hover:text-white hover:bg-white/5 transition-colors touch-target">
                          Login
                        </button>
                      </SignInButton>
                      <Link
                        href="/pricing"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center justify-center gap-2 px-4 py-4 rounded-xl text-base font-semibold text-vivid-bg bg-vivid-primary hover:bg-vivid-primaryDim transition-colors touch-target"
                      >
                        Get Started
                      </Link>
                    </>
                  )}
                </div>
              </div>

              {/* Swipe hint */}
              <div className="shrink-0 pb-safe px-4 py-4 flex justify-center">
                <div className="w-12 h-1 rounded-full bg-white/20" />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
