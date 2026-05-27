import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import SkipLink from "@/components/ui/skip-link";
import StructuredData from "@/components/marketing/structured-data";
import PageLoader from "@/components/ui/page-loader";
import VisitorTracker from "@/components/analytics/visitor-tracker";
import { Suspense } from "react";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
  fallback: ["system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  preload: true,
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0a0a0f",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  title: {
    default: "VIVID — AI-Powered Gaming Assistant",
    template: "%s | VIVID",
  },
  description:
    "VIVID is the next-generation AI gaming assistant with GPU-accelerated local inference, hardware-optimized performance, and complete privacy. Supports Roblox, Fortnite, CS2, Valorant, and more.",
  keywords: [
    "AI gaming assistant",
    "GPU optimization",
    "FPS enhancement",
    "hardware acceleration",
    "local AI inference",
    "gaming tool",
    "DirectML",
    "ONNX Runtime",
    "Roblox",
    "Fortnite",
    "Valorant",
    "CS2",
  ],
  authors: [{ name: "VIVID Software" }],
  creator: "VIVID Software",
  publisher: "VIVID Software",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://vivid.gg"
  ),
  alternates: {},
  openGraph: {
    title: "VIVID — AI-Powered Gaming Assistant",
    description:
      "GPU-accelerated local AI inference for gaming. Hardware-optimized performance with complete privacy.",
    type: "website",
    siteName: "VIVID",
    locale: "en_US",
    url: "/",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "VIVID AI Gaming Assistant",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VIVID — AI-Powered Gaming Assistant",
    description:
      "GPU-accelerated local AI inference for gaming. Hardware-optimized performance with complete privacy.",
    images: ["/og-image.png"],
    creator: "@vivid",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#00f5ff",
      },
    ],
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "VIVID",
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
      dir="ltr"
    >
      <head>
        <StructuredData />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="antialiased font-sans">
        <SkipLink />
        <Providers>
          <PageLoader />
          <Suspense fallback={null}>
            <VisitorTracker />
          </Suspense>
          {children}
        </Providers>
      </body>
    </html>
  );
}
