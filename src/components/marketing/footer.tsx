"use client";

import { motion } from "framer-motion";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import Link from "next/link";
import { ArrowRight, Heart, Shield, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { LinkReveal } from "@/components/ui/link-reveal";
import ParticleBackground from "@/components/marketing/particle-background";

/* ------------------------------------------------------------------ */
/*  Social Icons (inline SVG for premium look)                        */
/* ------------------------------------------------------------------ */
function SocialIcon({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      whileHover={{ y: -4, scale: 1.15 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "w-11 h-11 rounded-xl flex items-center justify-center touch-target",
        "bg-white/[0.04] border border-white/[0.08]",
        "text-vivid-textMuted hover:text-white hover:border-vivid-primary/30 hover:bg-vivid-primary/10",
        "transition-colors duration-300"
      )}
    >
      {children}
    </motion.a>
  );
}

/* ------------------------------------------------------------------ */
/*  Link Column                                                       */
/* ------------------------------------------------------------------ */
function LinkColumn({
  title,
  links,
  delay,
}: {
  title: string;
  links: { label: string; href: string }[];
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">
        {title}
      </h4>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className={cn(
                "group inline-flex items-center gap-1.5 text-base text-vivid-textMuted",
                "hover:text-white transition-colors duration-300"
              )}
            >
              <LinkReveal>{link.label}</LinkReveal>
            </Link>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* ------------------------------------------------------------------ */
/*  Main Footer                                                       */
/* ------------------------------------------------------------------ */
export default function Footer() {
  const brandRef = useScrollReveal({ selector: ".footer-brand", y: 40 });
  const bottomRef = useScrollReveal({
    selector: ".footer-bottom",
    y: 20,
    delay: 0.3,
  });

  const linkGroups = [
    {
      title: "Product",
      links: [
        { label: "Features", href: "/features" },
        { label: "Games", href: "/games" },
        { label: "Pricing", href: "/pricing" },
        { label: "Download", href: "/download" },
      ],
      delay: 0.15,
    },
    {
      title: "Account",
      links: [
        { label: "Dashboard", href: "/dashboard" },
        { label: "Licenses", href: "/dashboard/subscription" },
        { label: "Billing", href: "/dashboard/billing" },
        { label: "Settings", href: "/dashboard/settings" },
      ],
      delay: 0.2,
    },
    {
      title: "Support",
      links: [
        { label: "Discord Community", href: "https://discord.gg/KHXpfmF3" },
        { label: "Contact Us", href: "mailto:support@vivid.gg" },
        { label: "FAQ", href: "/#faq" },
      ],
      delay: 0.25,
    },
    {
      title: "Legal",
      links: [
        { label: "Terms of Service", href: "/terms" },
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Refund Policy", href: "/refund" },
      ],
      delay: 0.3,
    },
  ];

  return (
    <footer className="relative overflow-hidden border-t border-vivid-border/40">
      {/* Gradient glow at top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-px bg-gradient-to-r from-transparent via-vivid-primary/40 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-24 bg-gradient-to-b from-vivid-primary/5 to-transparent pointer-events-none" />

      {/* Ambient glow orbs */}
      <div className="absolute top-20 left-0 w-[400px] h-[400px] bg-vivid-primary/[0.02] rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-20 right-0 w-[300px] h-[300px] bg-purple-500/[0.02] rounded-full blur-[120px] pointer-events-none" />

      {/* Floating particles */}
      <ParticleBackground className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.6 }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-14 sm:pt-20 pb-8">
        {/* Main grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-8">
          {/* Brand column */}
          <div ref={brandRef} className="footer-brand col-span-1 sm:col-span-2 lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-3 mb-5 group">
              <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-vivid-primary to-vivid-primaryDim flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                <span className="relative text-vivid-bg font-bold text-lg">
                  V
                </span>
              </div>
              <div>
                <span className="text-xl font-bold text-white tracking-tight">
                  VIVID
                </span>
                <span className="block text-[10px] text-vivid-textDim uppercase tracking-[0.2em] -mt-0.5">
                  AI Gaming
                </span>
              </div>
            </Link>

            <p className="text-base text-vivid-textMuted leading-relaxed max-w-xs mb-6">
              GPU-accelerated AI assistance with hardware-optimized inference.
              Your hardware, maximized. Your privacy, guaranteed.
            </p>

            {/* Social icons */}
            <div className="flex items-center justify-center sm:justify-start gap-4 mb-8">
              <SocialIcon href="https://discord.gg/KHXpfmF3" label="Discord">
                <svg
                  className="w-[18px] h-[18px]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
              </SocialIcon>
            </div>

            {/* Discord CTA */}
            <div className="relative rounded-2xl border border-[#5865F2]/20 bg-[#5865F2]/5 p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#5865F2]/15 flex items-center justify-center shrink-0">
                  <svg
                    className="w-5 h-5 text-[#5865F2]"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-white text-sm font-semibold">
                    Join our Discord
                  </p>
                  <p className="text-vivid-textMuted text-xs">
                    Get support and updates
                  </p>
                </div>
                <a
                  href="https://discord.gg/KHXpfmF3"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-auto px-4 py-2.5 rounded-lg bg-[#5865F2]/15 border border-[#5865F2]/30 text-[#5865F2] text-xs font-semibold hover:bg-[#5865F2]/25 transition-colors touch-target flex items-center"
                >
                  Join
                </a>
              </div>
            </div>
          </div>

          {/* Link columns */}
          {linkGroups.map((group) => (
            <div key={group.title} className="col-span-1 sm:col-span-1 lg:col-span-1">
              <LinkColumn
                title={group.title}
                links={group.links}
                delay={group.delay}
              />
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="relative my-14">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full h-px bg-gradient-to-r from-transparent via-vivid-border/50 to-transparent" />
          </div>
        </div>

        {/* Bottom bar */}
        <div ref={bottomRef} className="footer-bottom flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-sm text-vivid-textDim">
            <span className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-vivid-primary/60" />
              &copy; {new Date().getFullYear()} VIVID Software
            </span>
            <span className="hidden sm:inline text-vivid-border">|</span>
            <span className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-vivid-primary/60" />
              All rights reserved
            </span>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <Link
              href="/terms"
              className="text-sm text-vivid-textDim hover:text-vivid-text transition-colors min-h-[44px] flex items-center px-2"
            >
              Terms
            </Link>
            <Link
              href="/privacy"
              className="text-sm text-vivid-textDim hover:text-vivid-text transition-colors min-h-[44px] flex items-center px-2"
            >
              Privacy
            </Link>
            <span className="flex items-center gap-1 text-sm text-vivid-textDim min-h-[44px] flex items-center px-2">
              <Heart className="w-3 h-3 text-vivid-primary/70 fill-vivid-primary/30" />
              Built for gamers
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
