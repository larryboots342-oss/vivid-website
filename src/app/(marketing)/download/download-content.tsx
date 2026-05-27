"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Download,
  Monitor,
  Shield,
  Wrench,
  Clock,
  Mail,
  MessageCircle,
  Rocket,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import packageJson from "../../../package.json";

const requirements = [
  { icon: Monitor, label: "OS", value: "Windows 10/11 64-bit" },
  { icon: Shield, label: "GPU", value: "DirectX 12 compatible" },
  { icon: Wrench, label: "RAM", value: "8GB minimum, 16GB recommended" },
  { icon: Download, label: "Storage", value: "2GB free space" },
];

export default function DownloadContent() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleNotify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      toast.error("Please enter a valid email");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setEmail("");
      toast.success("You're on the list! We'll email you when the launcher drops.");
    }, 800);
  };

  return (
    <div className="pt-32 pb-16 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold mb-4">
            Download <span className="gradient-text">VIVID</span>
          </h1>
          <p className="text-vivid-textMuted text-lg mb-6">
            The VIVID desktop launcher is almost ready.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-vivid-primary/10 border border-vivid-primary/20 text-vivid-primary text-sm font-medium">
            <Rocket className="w-4 h-4" />
            Current Version: {packageJson.version}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl border border-vivid-border bg-vivid-surface/50 text-vivid-textMuted font-semibold">
            <Clock className="w-5 h-5" />
            Launcher available soon
          </div>
        </motion.div>

        {/* System Requirements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid md:grid-cols-2 gap-4 mb-16"
        >
          {requirements.map((req) => (
            <div
              key={req.label}
              className="flex items-center gap-4 p-4 rounded-xl border border-vivid-border bg-vivid-surface/50"
            >
              <div className="w-10 h-10 rounded-lg bg-vivid-primary/10 flex items-center justify-center">
                <req.icon className="w-5 h-5 text-vivid-primary" />
              </div>
              <div>
                <div className="text-vivid-textDim text-xs">{req.label}</div>
                <div className="text-white text-sm font-medium">{req.value}</div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Notify + Discord */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid md:grid-cols-2 gap-6"
        >
          <div className="rounded-2xl border border-vivid-border bg-vivid-surface/50 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-vivid-primary/10 flex items-center justify-center">
                <Mail className="w-5 h-5 text-vivid-primary" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Get Notified</h3>
                <p className="text-vivid-textMuted text-sm">
                  Be the first to know when the launcher drops.
                </p>
              </div>
            </div>
            <form onSubmit={handleNotify} className="flex gap-3">
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
                disabled={submitting}
              />
              <Button type="submit" disabled={submitting}>
                {submitting ? "Joining..." : "Notify Me"}
              </Button>
            </form>
          </div>

          <div className="rounded-2xl border border-vivid-border bg-vivid-surface/50 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-vivid-primary/10 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-vivid-primary" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Early Access</h3>
                <p className="text-vivid-textMuted text-sm">
                  Join our Discord for beta builds and support.
                </p>
              </div>
            </div>
            <Button asChild variant="outline" className="w-full">
              <a
                href="https://discord.gg/vivid"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                Join Discord
              </a>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
