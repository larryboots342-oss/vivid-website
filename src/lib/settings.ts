"use client";

import useSWR from "swr";

const SETTINGS_KEY = "vivid-user-settings";

export interface UserSettings {
  paymentNotifications: boolean;
  productUpdates: boolean;
  securityAlerts: boolean;
  marketingPromotions: boolean;
  licenseExpiry: boolean;
  darkMode: boolean;
}

const defaultSettings: UserSettings = {
  paymentNotifications: true,
  productUpdates: true,
  securityAlerts: true,
  marketingPromotions: false,
  licenseExpiry: true,
  darkMode: true,
};

function getStoredSettings(): UserSettings {
  if (typeof window === "undefined") return defaultSettings;
  try {
    const saved = localStorage.getItem(SETTINGS_KEY);
    return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
  } catch {
    return defaultSettings;
  }
}

export function useSettings() {
  const { data, mutate } = useSWR<UserSettings>(
    SETTINGS_KEY,
    getStoredSettings,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const settings = data || defaultSettings;

  const updateSetting = <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
    mutate(
      (current) => {
        const updated = { ...(current || defaultSettings), [key]: value };
        if (typeof window !== "undefined") {
          localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
        }
        return updated;
      },
      false
    );
  };

  return { settings, updateSetting };
}
