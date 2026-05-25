"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#00f5ff",
          colorBackground: "#0a0a0f",
          colorText: "#e0e0e0",
          colorInputBackground: "#111111",
          colorInputText: "#e0e0e0",
          borderRadius: "0.75rem",
        },
        elements: {
          formButtonPrimary:
            "bg-vivid-primary text-vivid-bg hover:bg-vivid-primaryDim",
          card: "bg-vivid-surface border border-vivid-border",
          headerTitle: "text-white",
          headerSubtitle: "text-vivid-textMuted",
          socialButtonsBlockButton:
            "border-vivid-border bg-vivid-surfaceHover text-white hover:bg-vivid-border",
          formFieldLabel: "text-vivid-textMuted",
          formFieldInput:
            "bg-vivid-bg border-vivid-border text-white focus:border-vivid-primary",
          footerActionLink: "text-vivid-primary hover:text-vivid-primaryDim",
          identityPreviewText: "text-white",
          identityPreviewEditButton: "text-vivid-primary",
        },
      }}
    >
      {children}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#111111",
            border: "1px solid #252525",
            color: "#e0e0e0",
          },
        }}
      />
      <Analytics />
      <SpeedInsights />
    </ClerkProvider>
  );
}
