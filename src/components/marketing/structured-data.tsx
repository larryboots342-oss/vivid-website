import packageJson from "@/../package.json";
const version = packageJson.version;

export default function StructuredData() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://vivid.gg";

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: "VIVID",
        description:
          "AI-Powered Gaming Assistant with GPU-accelerated local inference",
        applicationCategory: "GameApplication",
        operatingSystem: "Windows 10/11",
        softwareVersion: version,
        offers: [
          {
            "@type": "Offer",
            price: "9.99",
            priceCurrency: "USD",
            name: "Basic Plan",
            description: "Perfect for casual gamers getting started",
          },
          {
            "@type": "Offer",
            price: "19.99",
            priceCurrency: "USD",
            name: "Pro Plan",
            description: "Full AI assistant with all platforms",
          },
          {
            "@type": "Offer",
            price: "39.99",
            priceCurrency: "USD",
            name: "Enterprise Plan",
            description: "Maximum performance with dedicated support",
          },
        ],
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.9",
          ratingCount: "12000",
          bestRating: "5",
          worstRating: "1",
        },
        featureList: [
          "Local AI Inference",
          "GPU Acceleration",
          "Real-time FPS Monitoring",
          "Privacy First",
          "Multi-Game Support",
          "Adaptive Smoothing",
        ],
        screenshot: {
          "@type": "ImageObject",
          url: `${appUrl}/screenshot.png`,
        },
      },
      {
        "@type": "Organization",
        name: "VIVID Software",
        url: appUrl,
        logo: {
          "@type": "ImageObject",
          url: `${appUrl}/logo.png`,
          width: 512,
          height: 512,
        },
        sameAs: [
          "https://twitter.com/vivid",
          "https://discord.gg/vivid",
          "https://github.com/vividsoftware",
        ],
      },
      {
        "@type": "WebSite",
        url: appUrl,
        name: "VIVID",
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${appUrl}/search?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "How does VIVID work?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "VIVID runs entirely on your local machine using your GPU. Our AI models are loaded directly into memory and process game frames in real-time using DirectML and ONNX Runtime. No data ever leaves your PC.",
            },
          },
          {
            "@type": "Question",
            name: "Is VIVID detectable by anti-cheat systems?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "VIVID operates at the hardware level using screen capture and synthetic mouse input, making it virtually undetectable by standard anti-cheat solutions.",
            },
          },
          {
            "@type": "Question",
            name: "What hardware do I need?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "You need a Windows 10 or 11 PC with a DirectX 12 compatible GPU. For optimal performance, we recommend a modern NVIDIA RTX 30-series or AMD RX 6000-series GPU with at least 8GB of VRAM.",
            },
          },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
