import { SignUp } from "@clerk/nextjs";
import { Metadata } from "next";
import AuthCard from "@/components/auth/auth-card";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create your VIVID account. GPU-accelerated AI gaming assistant with local inference.",
  robots: { index: false, follow: false },
};

const clerkAppearance = {
  variables: {
    colorPrimary: "#00f5ff",
    colorBackground: "transparent",
    colorText: "#e0e0e0",
    colorTextSecondary: "#888888",
    colorInputBackground: "#111111",
    colorInputText: "#e0e0e0",
    borderRadius: "0.75rem",
    fontFamily: "var(--font-inter), Inter, system-ui, sans-serif",
  },
  elements: {
    rootBox: "mx-auto w-full",
    card: "bg-transparent shadow-none border-0 p-0",
    header: "hidden",
    socialButtonsBlockButton:
      "h-11 rounded-xl border border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08] hover:border-white/20 transition-all duration-200",
    socialButtonsBlockButtonText: "text-sm font-medium",
    socialButtonsProviderIcon: "filter brightness-200",
    dividerLine: "bg-vivid-border/50",
    dividerText: "text-vivid-textDim text-xs",
    formFieldLabel: "text-vivid-textMuted text-sm font-medium mb-1.5",
    formFieldInput:
      "h-11 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder:text-vivid-textDim focus:border-vivid-primary/50 focus:ring-1 focus:ring-vivid-primary/30 transition-all",
    formFieldErrorText: "text-vivid-accent text-xs mt-1",
    formFieldHintText: "text-vivid-textDim text-xs mt-1",
    formButtonPrimary:
      "h-11 rounded-xl bg-vivid-primary text-vivid-bg font-semibold hover:bg-vivid-primaryDim transition-all duration-200 shadow-lg shadow-vivid-primary/20",
    formButtonReset:
      "text-vivid-textMuted hover:text-white text-sm transition-colors",
    footer: "hidden",
    footerAction: "hidden",
    identityPreview: "bg-white/[0.04] border border-white/10 rounded-xl p-3",
    identityPreviewText: "text-white text-sm",
    identityPreviewEditButton: "text-vivid-primary hover:text-vivid-primaryDim",
    otpCodeFieldInput:
      "h-12 w-12 rounded-xl bg-white/[0.04] border border-white/10 text-white text-center text-lg focus:border-vivid-primary/50",
    formFieldWarningText: "text-yellow-400 text-xs mt-1",
    phoneInputBox:
      "h-11 rounded-xl bg-white/[0.04] border border-white/10 text-white",
  },
};

export default function SignUpPage() {
  return (
    <AuthCard
      title="Create your account"
      subtitle="Create your account today — purchase a license when you're ready"
    >
      <SignUp
        routing="path"
        path="/sign-up"
        signInUrl="/sign-in"
        fallbackRedirectUrl="/dashboard"
        appearance={clerkAppearance}
      />
    </AuthCard>
  );
}
