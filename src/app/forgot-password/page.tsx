"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, KeyRound, Mail, Shield } from "lucide-react";
import AuthCard from "@/components/auth/auth-card";

export default function ForgotPasswordPage() {
  return (
    <AuthCard
      title="Reset your password"
      subtitle="We'll help you get back into your account"
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="space-y-6"
      >
        {/* Steps */}
        <div className="space-y-4">
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-vivid-primary/10 border border-vivid-primary/20 flex items-center justify-center shrink-0">
              <KeyRound className="w-4 h-4 text-vivid-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Enter your email</p>
              <p className="text-xs text-vivid-textMuted mt-0.5">
                We'll verify it's you
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-vivid-primary/10 border border-vivid-primary/20 flex items-center justify-center shrink-0">
              <Mail className="w-4 h-4 text-vivid-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Check your inbox</p>
              <p className="text-xs text-vivid-textMuted mt-0.5">
                You'll receive a secure reset code
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-vivid-primary/10 border border-vivid-primary/20 flex items-center justify-center shrink-0">
              <Shield className="w-4 h-4 text-vivid-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Set a new password</p>
              <p className="text-xs text-vivid-textMuted mt-0.5">
                Choose something strong and memorable
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <Link
          href="/sign-in"
          className="flex items-center justify-center gap-2 w-full h-11 rounded-xl bg-vivid-primary text-vivid-bg font-semibold hover:bg-vivid-primaryDim transition-all duration-200 shadow-lg shadow-vivid-primary/20"
        >
          Continue to reset password
          <ArrowRight className="w-4 h-4" />
        </Link>

        <p className="text-center text-xs text-vivid-textMuted">
          Our secure sign-in page will guide you through the password reset
          process with email verification.
        </p>

        {/* Back to sign in */}
        <p className="text-center text-sm text-vivid-textMuted pt-2 border-t border-vivid-border/30">
          Remember your password?{" "}
          <Link
            href="/sign-in"
            className="text-vivid-primary hover:text-vivid-primaryDim transition-colors font-medium"
          >
            Sign in
          </Link>
        </p>
      </motion.div>
    </AuthCard>
  );
}
