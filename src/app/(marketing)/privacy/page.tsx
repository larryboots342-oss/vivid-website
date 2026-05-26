import type { Metadata } from "next";
import PageWrapper from "@/components/ui/page-wrapper";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "VIVID Privacy Policy and Data Practices",
};

export default function PrivacyPage() {
  return (
    <PageWrapper className="pt-32 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">
          Privacy Policy
        </h1>
        <p className="text-vivid-textMuted text-sm mb-10">
          Last updated: {new Date().toLocaleDateString("en-GB", { month: "long", year: "numeric" })}
        </p>

        <div className="space-y-8 text-vivid-text leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Introduction</h2>
            <p>
              VIVID (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is committed to protecting your privacy. This Privacy Policy 
              explains how we collect, use, store, and protect your personal information when you use 
              our website and software.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Information We Collect</h2>
            <p>We collect the following types of information:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-vivid-textMuted">
              <li><strong>Account information:</strong> Name, email address, and profile data via Clerk authentication</li>
              <li><strong>License information:</strong> License keys, tier, activation status, and hardware fingerprint</li>
              <li><strong>Payment information:</strong> Processed securely by Stripe — we do not store card details</li>
              <li><strong>Usage data:</strong> Purchase history and dashboard activity</li>
              <li><strong>Technical data:</strong> IP address and country (for fraud prevention and analytics)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-vivid-textMuted">
              <li>Provide and manage your license and account</li>
              <li>Process payments and send license keys via email</li>
              <li>Prevent fraud and unauthorised use</li>
              <li>Send important updates about the Software</li>
              <li>Respond to support requests</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Data Storage & Security</h2>
            <p>
              Your data is stored securely using PostgreSQL (via Prisma) and Supabase. We implement 
              industry-standard security measures including encryption in transit (HTTPS/TLS) and 
              access controls. License keys and hardware fingerprints are stored securely to prevent 
              unauthorised sharing.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Third-Party Services</h2>
            <p>We use the following third-party services:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-vivid-textMuted">
              <li><strong>Clerk</strong> — Authentication and user management</li>
              <li><strong>Stripe</strong> — Payment processing</li>
              <li><strong>Resend</strong> — License key email delivery</li>
              <li><strong>Supabase</strong> — License database synchronisation</li>
              <li><strong>Vercel</strong> — Website hosting and analytics</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Cookies</h2>
            <p>
              We use essential cookies for authentication (via Clerk) and to maintain your session. 
              We do not use tracking or advertising cookies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. Your Rights</h2>
            <p>Depending on your jurisdiction, you may have the right to:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-vivid-textMuted">
              <li>Access the personal data we hold about you</li>
              <li>Request correction or deletion of your data</li>
              <li>Object to or restrict certain processing activities</li>
              <li>Export your data in a portable format</li>
            </ul>
            <p className="mt-2">
              To exercise these rights, contact us at{" "}
              <a href="mailto:support@vivid.gg" className="text-vivid-primary hover:underline">
                support@vivid.gg
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">8. Data Retention</h2>
            <p>
              We retain your account and license data for as long as your account is active. 
              You may request deletion of your account and associated data at any time. Some 
              data may be retained for legal or fraud prevention purposes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">9. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy periodically. We will notify you of significant 
              changes via email or through the Software.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">10. Contact</h2>
            <p>
              If you have questions about this Privacy Policy, contact us at{" "}
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
