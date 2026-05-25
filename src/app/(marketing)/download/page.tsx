"use client";

import { motion } from "framer-motion";
import { Download, Monitor, Shield, Wrench, Clock } from "lucide-react";

const requirements = [
  { icon: Monitor, label: "OS", value: "Windows 10/11 64-bit" },
  { icon: Shield, label: "GPU", value: "DirectX 12 compatible" },
  { icon: Wrench, label: "RAM", value: "8GB minimum, 16GB recommended" },
  { icon: Download, label: "Storage", value: "2GB free space" },
];

export default function DownloadPage() {
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
          <p className="text-vivid-textMuted text-lg">
            Desktop launcher coming soon.
          </p>
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid md:grid-cols-2 gap-4"
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
                <div className="text-white text-sm font-medium">
                  {req.value}
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
