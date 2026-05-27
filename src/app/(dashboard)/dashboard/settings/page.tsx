"use client";

import { useState, useEffect } from "react";
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
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import LicenseCountdown from "@/components/dashboard/license-countdown";

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "license", label: "License", icon: Key },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "preferences", label: "Preferences", icon: Monitor },
];

function NotificationToggle({
  title,
  description,
  defaultChecked,
}: {
  title: string;
  description: string;
  defaultChecked: boolean;
}) {
  const [checked, setChecked] = useState(defaultChecked);
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-white">{title}</p>
        <p className="text-xs text-vivid-textMuted mt-0.5 leading-relaxed">{description}</p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
        <input
          type="checkbox"
          role="switch"
          aria-checked={checked}
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
          className="sr-only peer"
        />
        <div className="w-10 h-5 sm:w-11 sm:h-6 bg-vivid-surfaceHover rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 sm:after:h-5 sm:after:w-5 after:transition-all peer-checked:bg-vivid-primary" />
      </label>
    </div>
  );
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [savingNotifications, setSavingNotifications] = useState(false);
  const [savingPreferences, setSavingPreferences] = useState(false);

  const handleSaveNotifications = () => {
    setSavingNotifications(true);
    setTimeout(() => {
      setSavingNotifications(false);
      toast.success("Notification preferences saved");
    }, 600);
  };

  const handleSavePreferences = () => {
    setSavingPreferences(true);
    setTimeout(() => {
      setSavingPreferences(false);
      toast.success("Preferences saved");
    }, 600);
  };

  function LicenseTabContent() {
    const [licenses, setLicenses] = useState<Array<{
      id: string;
      key: string;
      tier: string;
      isActive: boolean;
      isLifetime: boolean;
      expiresAt: string | null;
    }>>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      fetch("/api/user/licenses")
        .then((r) => r.json())
        .then((data) => {
          setLicenses(data.licenses || []);
          setLoading(false);
        })
        .catch(() => {
          setError("Failed to load license data.");
          setLoading(false);
        });
    }, []);

    if (loading) {
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
            <p className="text-sm text-red-400">{error}</p>
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
          <LicenseCountdown licenses={licenses} />
          <p className="text-xs text-vivid-textDim">
            License keys are shared between the website and the VIVID desktop app.
            Validate your key in either place — both sync through the same system.
          </p>
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
        <p className="text-vivid-textMuted text-sm sm:text-base">Manage your account preferences</p>
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
              <nav className="flex lg:flex-col gap-1 overflow-x-auto pb-1 lg:pb-0 -mx-2 px-2 lg:mx-0 lg:px-0 scrollbar-hide">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap shrink-0 ${
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
              <Card>
                <CardHeader>
                  <CardTitle className="text-white">Notification Preferences</CardTitle>
                  <CardDescription className="text-vivid-textMuted">
                    Choose what notifications you want to receive
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    {
                      title: "Payment Notifications",
                      description: "Get notified about successful payments, failed charges, and invoice availability",
                      defaultChecked: true,
                    },
                    {
                      title: "Product Updates",
                      description: "Receive emails about new features, game support, and version updates",
                      defaultChecked: true,
                    },
                    {
                      title: "Security Alerts",
                      description: "Get notified about new logins, password changes, and security events",
                      defaultChecked: true,
                    },
                    {
                      title: "Marketing & Promotions",
                      description: "Receive special offers, discounts, and promotional content",
                      defaultChecked: false,
                    },
                    {
                      title: "License Expiry",
                      description: "Get notified before your license expires",
                      defaultChecked: true,
                    },
                  ].map((item, i) => (
                    <div key={item.title}>
                      {i > 0 && <Separator className="bg-vivid-border/40 mb-4" />}
                      <NotificationToggle
                        title={item.title}
                        description={item.description}
                        defaultChecked={item.defaultChecked}
                      />
                    </div>
                  ))}

                  <div className="pt-2 flex justify-end">
                    <Button
                      size="sm"
                      onClick={handleSaveNotifications}
                      disabled={savingNotifications}
                    >
                      {savingNotifications && <Loader2 className="w-4 h-4 animate-spin mr-1.5" />}
                      Save Preferences
                    </Button>
                  </div>
                </CardContent>
              </Card>
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
                        <p className="text-sm font-medium text-white">Two-Factor Authentication</p>
                        <p className="text-xs text-vivid-textMuted">Protect your account with an additional layer</p>
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
                        <p className="text-sm font-medium text-white">Active Sessions</p>
                        <p className="text-xs text-vivid-textMuted">View and manage your active sessions</p>
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
                        <p className="text-sm font-medium text-white">Dark Mode</p>
                        <p className="text-xs text-vivid-textMuted">Always use dark theme</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input
                        type="checkbox"
                        role="switch"
                        aria-checked={true}
                        defaultChecked
                        className="sr-only peer"
                      />
                      <div className="w-10 h-5 sm:w-11 sm:h-6 bg-vivid-surfaceHover rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 sm:after:h-5 sm:after:w-5 after:transition-all peer-checked:bg-vivid-primary" />
                    </label>
                  </div>

                  <Separator className="bg-vivid-border/40" />

                  <div>
                    <p className="text-sm font-medium text-white mb-3">Dashboard Layout</p>
                    <div className="grid grid-cols-3 gap-2 sm:gap-3">
                      {["Compact", "Comfortable", "Detailed"].map((layout) => {
                        const isActive = layout === "Comfortable";
                        return (
                          <button
                            key={layout}
                            aria-pressed={isActive}
                            className={`p-3 sm:p-4 rounded-xl border text-sm font-medium transition-all ${
                              isActive
                                ? "border-vivid-primary bg-vivid-primary/10 text-vivid-primary"
                                : "border-vivid-border text-vivid-textMuted hover:border-vivid-primary/30"
                            }`}
                          >
                            {layout}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="pt-2 flex justify-end">
                    <Button
                      size="sm"
                      onClick={handleSavePreferences}
                      disabled={savingPreferences}
                    >
                      {savingPreferences && <Loader2 className="w-4 h-4 animate-spin mr-1.5" />}
                      Save Preferences
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
