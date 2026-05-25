"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ToggleLeft,
  Plus,
  X,
  Zap,
  Percent,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureFlag {
  id: string;
  key: string;
  description: string | null;
  enabled: boolean;
  rollout: number;
}

export default function AdminFeaturesPage() {
  const [features, setFeatures] = useState<FeatureFlag[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newFeature, setNewFeature] = useState({ key: "", description: "", enabled: false, rollout: 0 });

  const fetchFeatures = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/features");
    const data = await res.json();
    setFeatures(data.features || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchFeatures();
  }, []);

  const toggleFeature = async (id: string, enabled: boolean) => {
    await fetch("/api/admin/features", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featureId: id, enabled }),
    });
    fetchFeatures();
  };

  const updateRollout = async (id: string, rollout: number) => {
    await fetch("/api/admin/features", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featureId: id, rollout }),
    });
    fetchFeatures();
  };

  const createFeature = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/admin/features", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newFeature),
    });
    setShowCreate(false);
    setNewFeature({ key: "", description: "", enabled: false, rollout: 0 });
    fetchFeatures();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Feature Flags</h1>
          <p className="text-vivid-textMuted">Control feature rollouts and toggles</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="h-10 px-4 rounded-xl bg-vivid-primary text-vivid-bg font-semibold text-sm flex items-center gap-2 hover:bg-vivid-primaryDim transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Flag
        </button>
      </div>

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm" onClick={() => setShowCreate(false)}>
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-2xl border border-vivid-border/50 bg-vivid-surface/95 backdrop-blur-2xl p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white">Create Feature Flag</h2>
              <button onClick={() => setShowCreate(false)} className="p-1.5 rounded-lg hover:bg-white/5 text-vivid-textDim hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={createFeature} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-vivid-textMuted mb-1.5">Flag Key</label>
                <input
                  value={newFeature.key}
                  onChange={(e) => setNewFeature((f) => ({ ...f, key: e.target.value }))}
                  required
                  className="w-full h-11 px-4 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder:text-vivid-textDim focus:border-vivid-primary/50 outline-none text-sm font-mono"
                  placeholder="e.g., new_onboarding_flow"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-vivid-textMuted mb-1.5">Description</label>
                <input
                  value={newFeature.description}
                  onChange={(e) => setNewFeature((f) => ({ ...f, description: e.target.value }))}
                  className="w-full h-11 px-4 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder:text-vivid-textDim focus:border-vivid-primary/50 outline-none text-sm"
                  placeholder="What does this flag control?"
                />
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm text-vivid-textMuted cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newFeature.enabled}
                    onChange={(e) => setNewFeature((f) => ({ ...f, enabled: e.target.checked }))}
                    className="w-4 h-4 rounded border-white/20 bg-white/[0.04] text-vivid-primary focus:ring-vivid-primary/30"
                  />
                  Enabled
                </label>
              </div>
              <button type="submit" className="w-full h-11 rounded-xl bg-vivid-primary text-vivid-bg font-semibold hover:bg-vivid-primaryDim transition-colors">
                Create Flag
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {/* Flags Grid */}
      <div className="grid gap-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 rounded-2xl bg-white/5 animate-pulse" />
          ))
        ) : features.length === 0 ? (
          <div className="text-center py-16 rounded-2xl border border-vivid-border/50 bg-vivid-surface/40">
            <ToggleLeft className="w-12 h-12 text-vivid-textDim mx-auto mb-4" />
            <p className="text-lg font-semibold text-white mb-2">No feature flags</p>
            <p className="text-sm text-vivid-textMuted">Create your first flag to control feature rollouts</p>
          </div>
        ) : (
          features.map((feature, i) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl border border-vivid-border/50 bg-vivid-surface/40 backdrop-blur-xl p-5 hover:bg-vivid-surface/60 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <Zap className="w-4 h-4 text-vivid-primary" />
                    <h3 className="text-sm font-semibold text-white font-mono">{feature.key}</h3>
                    <span className={cn(
                      "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider",
                      feature.enabled
                        ? "bg-green-500/10 text-green-400 border border-green-500/20"
                        : "bg-white/5 text-vivid-textDim border border-white/10"
                    )}>
                      {feature.enabled ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                      {feature.enabled ? "ON" : "OFF"}
                    </span>
                  </div>
                  {feature.description && (
                    <p className="text-sm text-vivid-textMuted">{feature.description}</p>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  {/* Rollout slider */}
                  <div className="flex items-center gap-2">
                    <Percent className="w-3.5 h-3.5 text-vivid-textDim" />
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={feature.rollout}
                      onChange={(e) => updateRollout(feature.id, parseInt(e.target.value))}
                      className="w-24 accent-vivid-primary"
                    />
                    <span className="text-xs text-vivid-textMuted w-8">{feature.rollout}%</span>
                  </div>

                  {/* Toggle switch */}
                  <button
                    onClick={() => toggleFeature(feature.id, !feature.enabled)}
                    className={cn(
                      "relative w-12 h-7 rounded-full transition-colors duration-300",
                      feature.enabled ? "bg-vivid-primary" : "bg-white/10"
                    )}
                  >
                    <motion.div
                      animate={{ x: feature.enabled ? 20 : 2 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      className="absolute top-1 w-5 h-5 rounded-full bg-white shadow-sm"
                    />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
