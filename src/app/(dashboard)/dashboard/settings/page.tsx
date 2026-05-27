"use client";

import { useState } from "react";
import useSWR from "swr";
import { motion } from "framer-motion";
import { UserProfile } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Bell,
  Shield,
  Monitor,
  Moon,
  Globe,
  Key,
} from "lucide-react";
import LicenseCountdown from "@/components/dashboard/license-countdown";
import { useSettings } from "@/lib/settings";

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "license", label: "License", icon: Key },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "preferences", label: "Preferences", icon: Monitor },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  function LicenseTabContent() {
    const { data, isLoading, error } = useSWR<{ licenses: Array<{
      id: string;
      key: string;
      tier: string;
      isActive: boolean;
      isLifetime: boolean;
      expiresAt: string | null;
    }> }>("/api/user/licenses");

    if (isLoading) {
      return (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="animate-pulse space-y-3">
              <div className="h-4 w-32 bg-vivid-border/50 rounded mx-auto" />
              <div className="h-20 w-full bg-vivid-border/30 rounded" />
            </div>
          </CardContent>
        </Card>
      );
    }

    if (error) {
      return (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-base text-red-400">Failed to load license data.</p>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-white">License Status</CardTitle>
          <CardDescription className="text-vivid-textMuted">
            View your active license and time remaining
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <LicenseCountdown licenses={data?.licenses || []} />
          <p className="text-base text-vivid-textDim">
            License keys are shared between the website and the VIVID desktop app.
            Validate your key in either place — both sync through the same system.
          </p>
        </CardContent>
      </Card>
    );
  }

  function NotificationSettings() {
    const { settings, updateSetting } = useSettings();

    const items = [
      {
        key: "paymentNotifications" as const,
        title: "Payment Notifications",
        description: "Get notified about successful payments, failed charges, and invoice availability",
      },
      {
        key: "productUpdates" as const,
        title: "Product Updates",
        description: "Receive emails about new features, game support, and version updates",
      },
      {
        key: "securityAlerts" as const,
        title: "Security Alerts",
        description: "Get notified about new logins, password changes, and security events",
      },
      {
        key: "marketingPromotions" as const,
        title: "Marketing & Promotions",
        description: "Receive special offers, discounts, and promotional content",
      },
      {
        key: "licenseExpiry" as const,
        title: "License Expiry",
        description: "Get notified before your license expires",
      },
    ];

    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-white">Notification Preferences</CardTitle>
          <CardDescription className="text-vivid-textMuted">
            Choose what notifications you want to receive
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.map((item, i) => (
            <div key={item.key}>
              {i > 0 && <Separator className="bg-vivid-border/40 mb-4" />}
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-base font-medium text-white">{item.title}</p>
                  <p className="text-base text-vivid-textMuted mt-0.5 leading-relaxed">{item.description}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
                  <input
                    type="checkbox"
                    checked={settings[item.key]}
                    onChange={(e) => updateSetting(item.key, e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 sm:w-11 sm:h-6 bg-vivid-surfaceHover rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 sm:after:h-5 sm:after:w-5 after:transition-all peer-checked:bg-vivid-primary" />
                </label>
              </div>
            </div>
          ))}

          <p className="text-base text-vivid-textDim pt-2">
            Settings auto-save when toggled.
          </p>
        </CardContent>
      </Card>
    );
  }

  function PreferenceSettings() {
    const { settings, updateSetting } = useSettings();

    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-white">App Preferences</CardTitle>
          <CardDescription className="text-vivid-textMuted">
            Customize your dashboard experience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-vivid-primary/10 flex items-center justify-center shrink-0">
                <Moon className="w-5 h-5 text-vivid-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-base font-medium text-white">Dark Mode</p>
                <p className="text-base text-vivid-textMuted">Always use dark theme</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={settings.darkMode}
                onChange={(e) => updateSetting("darkMode", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-10 h-5 sm:w-11 sm:h-6 bg-vivid-surfaceHover rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 sm:after:h-5 sm:after:w-5 after:transition-all peer-checked:bg-vivid-primary" />
            </label>
          </div>

          <Separator className="bg-vivid-border/40" />

          <div>
            <p className="text-base font-medium text-white mb-3">Dashboard Layout</p>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {["Compact", "Comfortable", "Detailed"].map((layout) => (
                <button
                  key={layout}
                  className={`p-3 sm:p-4 rounded-xl border text-base font-medium transition-all ${
                    layout === "Comfortable"
                      ? "border-vivid-primary bg-vivid-primary/10 text-vivid-primary"
                      : "border-vivid-border text-vivid-textMuted hover:border-vivid-primary/30"
                  }`}
                >
                  {layout}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">Settings</h1>
        <p className="text-vivid-textMuted text-base">Manage your account preferences</p>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Settings Navigation — horizontal scroll on mobile, sticky sidebar on desktop */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:w-64 shrink-0"
        >
          <Card className="lg:sticky lg:top-24 overflow-hidden">
            <CardContent className="p-2">
              {/* Mobile: horizontal scrollable tabs */}
              <nav 
                className="flex lg:flex-col gap-1 overflow-x-auto pb-1 lg:pb-0 -mx-2 px-2 lg:mx-0 lg:px-0 scrollbar-hide"
                role="tablist"
                aria-label="Settings tabs"
              >
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    role="tab"
                    aria-selected={activeTab === tab.id}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 whitespace-nowrap shrink-0 min-h-[44px] touch-target ${
                      activeTab === tab.id
                        ? "bg-vivid-primary/10 text-vivid-primary border border-vivid-primary/20"
                        : "text-vivid-textMuted hover:text-white hover:bg-white/5 border border-transparent"
                    }`}
                  >
                    <tab.icon className="w-4 h-4 lg:w-5 lg:h-5" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </CardContent>
          </Card>
        </motion.div>

        {/* Settings Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex-1 min-w-0"
        >
          {activeTab === "profile" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-white">Profile Information</CardTitle>
                  <CardDescription className="text-vivid-textMuted">
                    Update your personal information and avatar
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="max-w-2xl">
                    <UserProfile
                      appearance={{
                        elements: {
                          card: "bg-transparent shadow-none border-0 p-0",
                          headerTitle: "text-white",
                          headerSubtitle: "text-vivid-textMuted",
                          profileSectionTitle: "text-white",
                          profileSectionSubtitle: "text-vivid-textMuted",
                          formButtonPrimary: "bg-vivid-primary text-vivid-bg hover:bg-vivid-primaryDim",
                          formFieldInput: "bg-vivid-bg border-vivid-border text-white",
                          formFieldLabel: "text-vivid-textMuted",
                          accordionTriggerButton: "text-white hover:bg-vivid-surface",
                          accordionContent: "bg-vivid-surface/30",
                          menuButton: "text-white hover:bg-vivid-surface",
                          menuItem: "text-vivid-text hover:bg-vivid-surface",
                        },
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "license" && (
            <div className="space-y-6">
              <LicenseTabContent />
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-6">
              <NotificationSettings />
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-white">Security Settings</CardTitle>
                  <CardDescription className="text-vivid-textMuted">
                    Manage your password and 2FA settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-vivid-bg border border-vivid-border">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-vivid-primary/10 flex items-center justify-center shrink-0">
                        <Shield className="w-5 h-5 text-vivid-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-base font-medium text-white">Two-Factor Authentication</p>
                        <p className="text-base text-vivid-textMuted">Protect your account with an additional layer</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="border-vivid-border text-vivid-textMuted shrink-0 ml-2">
                      Coming soon
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-vivid-bg border border-vivid-border">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-vivid-primary/10 flex items-center justify-center shrink-0">
                        <Globe className="w-5 h-5 text-vivid-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-base font-medium text-white">Active Sessions</p>
                        <p className="text-base text-vivid-textMuted">View and manage your active sessions</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="border-vivid-border text-vivid-textMuted shrink-0 ml-2">
                      Coming soon
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "preferences" && (
            <div className="space-y-6">
              <PreferenceSettings />
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
