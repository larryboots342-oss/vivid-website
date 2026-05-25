"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Activity, BarChart3 } from "lucide-react";

export default function AnalyticsContent() {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-white mb-1">Analytics</h1>
        <p className="text-vivid-textMuted">Track performance and usage across all users</p>
      </motion.div>

      {/* Metrics Grid — empty state until real data is wired */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Inferences", icon: Activity },
          { label: "Avg Response Time", icon: BarChart3 },
          { label: "Active Users", icon: Activity },
          { label: "Detection Accuracy", icon: BarChart3 },
        ].map((metric, i) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <Card className="h-full">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-vivid-primary/10 flex items-center justify-center">
                    <metric.icon className="w-5 h-5 text-vivid-primary" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-white">—</p>
                <p className="text-sm text-vivid-textMuted mt-1">{metric.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* No data message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card>
          <CardContent className="py-16 text-center">
            <BarChart3 className="w-12 h-12 text-vivid-textDim mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              Analytics coming soon
            </h3>
            <p className="text-vivid-textMuted text-sm max-w-md mx-auto">
              Real-time usage metrics and performance data will be available here once the inference tracking system is connected.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
