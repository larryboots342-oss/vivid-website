"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Save,
  Eye,
  Globe,
  MessageSquare,
  Gamepad2,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ContentSection {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  content: string;
}

const defaultContent: ContentSection[] = [
  {
    id: "hero",
    label: "Hero Section",
    icon: Sparkles,
    content: "GPU-accelerated performance. Hardware-optimized inference. Experience the next generation of intelligent gaming assistance.",
  },
  {
    id: "features",
    label: "Features Description",
    icon: Gamepad2,
    content: "Every feature is designed around performance, privacy, and precision. No bloat. Just results.",
  },
  {
    id: "pricing",
    label: "Pricing Subtitle",
    icon: FileText,
    content: "Choose the plan that fits your needs. One-time purchase, instant delivery.",
  },
  {
    id: "cta",
    label: "CTA Section",
    icon: MessageSquare,
    content: "Join thousands of gamers who have already upgraded their experience. Download VIVID for free and see the difference.",
  },
  {
    id: "footer",
    label: "Footer Tagline",
    icon: Globe,
    content: "GPU-accelerated AI assistance with hardware-optimized inference. Your hardware, maximized. Your privacy, guaranteed.",
  },
];

export default function AdminContentPage() {
  const [sections, setSections] = useState(defaultContent);
  const [activeSection, setActiveSection] = useState("hero");
  const [saved, setSaved] = useState(false);

  const active = sections.find((s) => s.id === activeSection)!;

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const updateContent = (id: string, content: string) => {
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, content } : s)));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Content</h1>
          <p className="text-vivid-textMuted">Edit marketing copy and page content</p>
        </div>
        <button
          onClick={handleSave}
          className={cn(
            "h-10 px-5 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all",
            saved
              ? "bg-green-500/15 text-green-400 border border-green-500/30"
              : "bg-vivid-primary text-vivid-bg hover:bg-vivid-primaryDim"
          )}
        >
          {saved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saved ? "Saved" : "Save Changes"}
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Section list */}
        <div className="space-y-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm font-medium transition-all",
                activeSection === section.id
                  ? "bg-vivid-primary/10 border border-vivid-primary/20 text-vivid-primary"
                  : "bg-white/[0.03] border border-transparent text-vivid-textMuted hover:text-white hover:bg-white/[0.05]"
              )}
            >
              <section.icon className="w-4 h-4" />
              {section.label}
            </button>
          ))}
        </div>

        {/* Editor */}
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
          className="lg:col-span-2 rounded-2xl border border-vivid-border/50 bg-vivid-surface/40 backdrop-blur-xl p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <active.icon className="w-5 h-5 text-vivid-primary" />
            <h2 className="text-lg font-bold text-white">{active.label}</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-vivid-textMuted mb-1.5">
                Content
              </label>
              <textarea
                value={active.content}
                onChange={(e) => updateContent(active.id, e.target.value)}
                rows={8}
                className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder:text-vivid-textDim focus:border-vivid-primary/50 outline-none text-sm resize-none leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-vivid-textMuted mb-1.5">
                Preview
              </label>
              <div className="rounded-xl border border-vivid-border/30 bg-vivid-bg/50 p-4">
                <p className="text-sm text-vivid-text leading-relaxed">{active.content}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-2">
              <div className="flex items-center gap-2 text-xs text-vivid-textDim">
                <Eye className="w-3.5 h-3.5" />
                {active.content.length} characters
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
