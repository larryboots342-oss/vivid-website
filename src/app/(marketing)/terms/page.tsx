import type { Metadata } from "next";
import PageWrapper from "@/components/ui/page-wrapper";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "VIVID Terms of Service and License Agreement",
};

export default function TermsPage() {
  return (
    <PageWrapper className="pt-32 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">
          Terms of Service
        </h1>
        <p className="text-vivid-textMuted text-sm mb-10">
          Last updated: {new Date().toLocaleDateString("en-GB", { month: "long", year: "numeric" })}
        </p>

        <div className="space-y-8 text-vivid-text leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Acceptance of Terms</h2>
            <p>
              By purchasing, downloading, installing, or using VIVID software (&quot;the Software&quot;), 
              you agree to be bound by these Terms of Service. If you do not agree to these terms, 
              do not purchase or use the Software.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. License Grant</h2>
            <p>
              Upon purchase, VIVID grants you a limited, non-exclusive, non-transferable license 
              to use the Software on your personal device(s) for the duration specified at purchase 
              (7 days, 30 days, or lifetime). Each license key is bound to your hardware fingerprint 
              and may be transferred up to 2 times per month via your dashboard.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. Restrictions</h2>
            <p>You may not:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-vivid-textMuted">
              <li>Share, resell, or distribute your license key</li>
              <li>Reverse engineer, decompile, or modify the Software</li>
              <li>Use custom or third-party models with the Software</li>
              <li>Use the Software for commercial purposes without an Enterprise license</li>
              <li>Attempt to bypass hardware fingerprinting or license validation</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Account & Authentication</h2>
            <p>
              You must be at least 18 years old to purchase and use VIVID. You are responsible 
              for maintaining the confidentiality of your account credentials. VIVID uses Clerk 
              for authentication and reserves the right to terminate accounts that violate these terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Payments</h2>
            <p>
              All purchases are one-time payments processed through Stripe or PayPal. Prices are 
              displayed in GBP. You are responsible for any applicable taxes or fees imposed by 
              your jurisdiction.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Limitation of Liability</h2>
            <p>
              VIVID is provided &quot;as is&quot; without warranties of any kind. We are not liable for any 
              damages arising from the use or inability to use the Software, including but not limited 
              to game account suspensions, hardware issues, or data loss. Use at your own risk.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. Termination</h2>
            <p>
              We reserve the right to terminate your license and access to the Software at any time 
              for violations of these terms, fraudulent activity, or chargebacks. Upon termination, 
              all rights granted to you shall cease immediately.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">8. Changes to Terms</h2>
            <p>
              We may update these Terms of Service from time to time. Continued use of the Software 
              after changes constitutes acceptance of the revised terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">9. Contact</h2>
            <p>
              For questions about these terms, contact us at{" "}
              <a href="mailto:support@vivid.gg" className="text-vivid-primary hover:underline">
                support@vivid.gg
              </a>{" "}
              or via our{" "}
              <a href="https://discord.gg/vivid" target="_blank" rel="noopener noreferrer" className="text-vivid-primary hover:underline">
                Discord server
              </a>.
            </p>
          </section>
        </div>
      </div>
    </PageWrapper>
  );
}
