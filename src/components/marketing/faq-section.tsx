"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Search,
  ChevronDown,
  MessageCircle,
  X,
  HelpCircle,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ */
/*  Types & Data                                                      */
/* ------------------------------------------------------------------ */
interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const categories = ["All", "General", "Technical", "Billing", "Security"];

const faqs: FAQItem[] = [
  {
    id: "1",
    category: "General",
    question: "How does VIVID work?",
    answer:
      "VIVID runs entirely on your local machine using your GPU. Our AI models are loaded directly into memory and process game frames in real-time using DirectML and ONNX Runtime. No data ever leaves your PC — everything happens locally for maximum privacy and minimum latency.",
  },
  {
    id: "2",
    category: "Security",
    question: "Is VIVID detectable by anti-cheat systems?",
    answer:
      "VIVID operates at the hardware level using screen capture and synthetic mouse input, making it virtually undetectable by standard anti-cheat solutions. We do not inject DLLs, hook game processes, or modify game memory. However, we always recommend using it responsibly and understanding the terms of service of any game you play.",
  },
  {
    id: "3",
    category: "Technical",
    question: "What hardware do I need?",
    answer:
      "You need a Windows 10 or 11 PC with a DirectX 12 compatible GPU. For optimal performance, we recommend a modern NVIDIA RTX 30-series or AMD RX 6000-series GPU with at least 8GB of VRAM and 16GB of system RAM. VIVID also works on laptops with dedicated GPUs.",
  },
  {
    id: "4",
    category: "Billing",
    question: "Do licenses auto-renew?",
    answer:
      "No. All VIVID licenses are one-time purchases. Your license key is valid for the purchased duration (7 days, 30 days, or lifetime) and never auto-renews. When your license expires, you can purchase a new one anytime — no subscriptions, no surprises.",
  },
  {
    id: "5",
    category: "Billing",
    question: "Do you offer refunds?",
    answer:
      "Refunds are only issued in serious cases — for example, if the software fails to activate or a critical bug prevents usage. Change of mind or 'did not like it' are not valid reasons for a refund. Contact support with proof of the issue and we will review within 48 hours.",
  },
  {
    id: "6",
    category: "General",
    question: "How often do you release updates?",
    answer:
      "We ship updates every 2–3 weeks on average. These include new game support, model improvements, UI enhancements, and bug fixes. Enterprise license holders get early access to beta features and can request priority game support.",
  },
  {
    id: "7",
    category: "Technical",
    question: "Which games are currently supported?",
    answer:
      "VIVID currently supports Valorant, CS2, Fortnite, Roblox, Apex Legends, and Overwatch 2. We're constantly adding new titles based on user demand. Enterprise users can request priority support for specific games.",
  },
  {
    id: "8",
    category: "Security",
    question: "Is my data private?",
    answer:
      "Completely. VIVID performs all inference locally on your GPU. No screenshots, gameplay footage, or telemetry data ever leaves your machine. We do not collect usage statistics, crash reports, or any personally identifiable information.",
  },
  {
    id: "9",
    category: "Billing",
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards (Visa, MasterCard, American Express) and Apple Pay. All transactions are processed securely through Stripe with PCI DSS Level 1 compliance.",
  },
  {
    id: "10",
    category: "Technical",
    question: "Can I use my own trained models?",
    answer:
      "No. VIVID uses proprietary models optimised for each supported game. Custom or third-party models are not permitted and will result in immediate license termination. This policy ensures consistent performance, security, and fair play across all users.",
  },
  {
    id: "11",
    category: "General",
    question: "Do you offer team or clan licenses?",
    answer:
      "Enterprise licenses include multi-seat activation perfect for esports teams, content creator groups, and gaming clans. Contact our support team for custom pricing on 5+ seat deployments with centralized management.",
  },
  {
    id: "12",
    category: "Security",
    question: "How do you handle license security?",
    answer:
      "Licenses are bound to your hardware fingerprint using a combination of CPU ID, motherboard serial, and GPU identifier. This prevents sharing while allowing you to transfer your license to a new PC up to 2 times per month from your dashboard.",
  },
];

/* ------------------------------------------------------------------ */
/*  Single Accordion Item                                             */
/* ------------------------------------------------------------------ */
function AccordionItem({
  item,
  isOpen,
  onToggle,
  index,
}: {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10, scale: 0.98 }}
      transition={{ duration: 0.35, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
      className="group"
    >
      <div
        className={cn(
          "relative rounded-2xl border transition-all duration-500 overflow-hidden gpu-animate",
          isOpen
            ? "border-vivid-primary/30 bg-vivid-surface/60 shadow-lg shadow-vivid-primary/5"
            : "border-vivid-border/40 bg-vivid-surface/30 hover:border-vivid-border/70 hover:bg-vivid-surface/50"
        )}
      >
        {/* Subtle glow when open */}
        {isOpen && (
          <div className="absolute inset-0 bg-gradient-to-b from-vivid-primary/5 to-transparent pointer-events-none" />
        )}

        <button
          ref={buttonRef}
          onClick={onToggle}
          className="relative w-full flex items-center justify-between gap-4 p-6 text-left"
          aria-expanded={isOpen}
          aria-controls={`faq-content-${item.id}`}
          id={`faq-trigger-${item.id}`}
        >
          <div className="flex items-center gap-4 min-w-0">
            {/* Index number */}
            <span
              className={cn(
                "hidden sm:flex w-8 h-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold transition-colors duration-300",
                isOpen
                  ? "bg-vivid-primary/15 text-vivid-primary"
                  : "bg-white/5 text-vivid-textMuted group-hover:bg-white/10"
              )}
            >
              {String(index + 1).padStart(2, "0")}
            </span>

            <span
              className={cn(
                "text-base md:text-lg font-medium transition-colors duration-300",
                isOpen ? "text-white" : "text-vivid-text group-hover:text-white"
              )}
            >
              {item.question}
            </span>
          </div>

          <motion.span
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "shrink-0 w-9 h-9 rounded-xl flex items-center justify-center border transition-all duration-300",
              isOpen
                ? "border-vivid-primary/40 bg-vivid-primary/10 text-vivid-primary"
                : "border-vivid-border/60 bg-white/[0.03] text-vivid-textMuted group-hover:border-vivid-primary/30"
            )}
          >
            <ChevronDown className="w-4 h-4" />
          </motion.span>
        </button>

        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              id={`faq-content-${item.id}`}
              role="region"
              aria-labelledby={`faq-trigger-${item.id}`}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{
                height: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
                opacity: { duration: 0.25, delay: isOpen ? 0.05 : 0 },
              }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-6 pt-0">
                <div className="pl-0 sm:pl-12">
                  <p className="text-sm md:text-[15px] text-vivid-textMuted leading-[1.8] max-w-2xl">
                    {item.answer}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Section                                                           */
/* ------------------------------------------------------------------ */
export default function FAQSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const [openId, setOpenId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [isSearching, setIsSearching] = useState(false);

  /* ---------- Filtering ---------- */
  const filteredFaqs = useMemo(() => {
    let result = faqs;

    if (activeCategory !== "All") {
      result = result.filter((f) => f.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (f) =>
          f.question.toLowerCase().includes(q) ||
          f.answer.toLowerCase().includes(q)
      );
    }

    return result;
  }, [searchQuery, activeCategory]);

  /* ---------- Keyboard Navigation ---------- */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const items = filteredFaqs;
      const currentIndex = items.findIndex((i) => i.id === openId);

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          if (currentIndex < items.length - 1) {
            setOpenId(items[currentIndex + 1]?.id ?? null);
          }
          break;
        case "ArrowUp":
          e.preventDefault();
          if (currentIndex > 0) {
            setOpenId(items[currentIndex - 1]?.id ?? null);
          }
          break;
        case "Escape":
          setOpenId(null);
          searchRef.current?.blur();
          break;
        case "Home":
          e.preventDefault();
          setOpenId(items[0]?.id ?? null);
          break;
        case "End":
          e.preventDefault();
          setOpenId(items[items.length - 1]?.id ?? null);
          break;
      }
    },
    [filteredFaqs, openId]
  );

  /* ---------- Toggle ---------- */
  const toggleItem = useCallback((id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  }, []);

  /* ---------- GSAP entrance ---------- */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".faq-title",
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: titleRef.current, start: "top 85%" },
        }
      );
      gsap.fromTo(
        ".faq-subtitle",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          delay: 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: titleRef.current, start: "top 85%" },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="faq"
      ref={sectionRef}
      className="relative section-padding overflow-hidden"
      onKeyDown={handleKeyDown}
    >
      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 right-0 w-[600px] h-[600px] bg-vivid-primary/[0.03] rounded-full blur-[180px]" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-purple-500/[0.02] rounded-full blur-[150px]" />
      </div>

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Header */}
        <div ref={titleRef} className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-vivid-primary/10 border border-vivid-primary/20 text-vivid-primary text-sm font-medium mb-8"
          >
            <HelpCircle className="w-4 h-4" />
            Support Center
          </motion.div>

          <h2 className="faq-title text-fluid-3xl font-bold mb-4 md:mb-6 text-balance">
            Frequently <span className="gradient-text">Asked</span>
          </h2>
          <p className="faq-subtitle text-fluid-base text-vivid-textMuted max-w-xl mx-auto leading-relaxed px-4">
            Everything you need to know about VIVID. Can&apos;t find your
            question? Our team is here to help.
          </p>
        </div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative mb-8"
        >
          <div
            className={cn(
              "relative flex items-center rounded-2xl border bg-vivid-surface/40 backdrop-blur-xl transition-all duration-300",
              isSearching
                ? "border-vivid-primary/40 shadow-lg shadow-vivid-primary/5"
                : "border-vivid-border/50 hover:border-vivid-border"
            )}
          >
            <Search className="absolute left-4 w-5 h-5 text-vivid-textMuted pointer-events-none" />
            <input
              ref={searchRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearching(true)}
              onBlur={() => setIsSearching(false)}
              placeholder="Search questions..."
              className="w-full bg-transparent py-4 pl-12 pr-12 text-white placeholder:text-vivid-textDim outline-none text-[15px]"
              aria-label="Search FAQ"
            />
            <AnimatePresence>
              {searchQuery && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => {
                    setSearchQuery("");
                    searchRef.current?.focus();
                  }}
                  className="absolute right-3 w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-vivid-textMuted hover:text-white transition-colors"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-2 mb-10"
          role="tablist"
          aria-label="FAQ categories"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setOpenId(null);
              }}
              role="tab"
              aria-selected={activeCategory === cat}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300",
                activeCategory === cat
                  ? "bg-vivid-primary/15 text-vivid-primary border border-vivid-primary/25"
                  : "bg-white/5 text-vivid-textMuted border border-transparent hover:bg-white/10 hover:text-vivid-text"
              )}
            >
              {cat}
              {cat !== "All" && (
                <span className="ml-1.5 text-[10px] opacity-60">
                  {faqs.filter((f) => f.category === cat).length}
                </span>
              )}
            </button>
          ))}
        </motion.div>

        {/* Results count */}
        <AnimatePresence mode="wait">
          {searchQuery && (
            <motion.p
              key="results"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="text-center text-sm text-vivid-textMuted mb-6"
            >
              {filteredFaqs.length} result{filteredFaqs.length !== 1 ? "s" : ""} for &ldquo;{searchQuery}&rdquo;
            </motion.p>
          )}
        </AnimatePresence>

        {/* Accordion List */}
        <div className="space-y-3" role="presentation">
          <AnimatePresence mode="popLayout">
            {filteredFaqs.map((faq, index) => (
              <AccordionItem
                key={faq.id}
                item={faq}
                isOpen={openId === faq.id}
                onToggle={() => toggleItem(faq.id)}
                index={index}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        <AnimatePresence>
          {filteredFaqs.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="text-center py-16"
            >
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-vivid-border/50 flex items-center justify-center mx-auto mb-4">
                <Search className="w-7 h-7 text-vivid-textMuted" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                No results found
              </h3>
              <p className="text-sm text-vivid-textMuted max-w-sm mx-auto">
                Try adjusting your search terms or browse a different category.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("All");
                }}
                className="mt-4 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-vivid-border/50 hover:border-vivid-border text-sm text-vivid-text transition-all duration-300"
              >
                Clear filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16"
        >
          <div className="relative rounded-3xl border border-vivid-border/40 bg-vivid-surface/30 backdrop-blur-xl p-8 md:p-10 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-vivid-primary/5 via-transparent to-purple-500/5 pointer-events-none" />

            <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-vivid-primary/10 border border-vivid-primary/20 flex items-center justify-center shrink-0">
                  <MessageCircle className="w-6 h-6 text-vivid-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">
                    Still have questions?
                  </h3>
                  <p className="text-sm text-vivid-textMuted">
                    Our support team typically responds within 2 hours.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="mailto:support@vivid.gg"
                  className={cn(
                    "group inline-flex items-center gap-2 px-6 py-3 rounded-xl",
                    "bg-vivid-primary/10 border border-vivid-primary/30 text-vivid-primary",
                    "hover:bg-vivid-primary/20 hover:border-vivid-primary/50 transition-all duration-300",
                    "text-sm font-semibold"
                  )}
                >
                  <Sparkles className="w-4 h-4" />
                  Contact Support
                </a>

                <a
                  href="https://discord.gg/vivid"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "group inline-flex items-center gap-2 px-6 py-3 rounded-xl",
                    "bg-[#5865F2]/10 border border-[#5865F2]/30 text-[#5865F2]",
                    "hover:bg-[#5865F2]/20 hover:border-[#5865F2]/50 transition-all duration-300",
                    "text-sm font-semibold"
                  )}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.007.128 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                  </svg>
                  Join Discord
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
