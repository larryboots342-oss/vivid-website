import type { Metadata } from "next";
import PageWrapper from "@/components/ui/page-wrapper";

export const metadata: Metadata = {
  title: "Refund Policy",
  description: "VIVID Refund Policy",
};

export default function RefundPage() {
  return (
    <PageWrapper className="pt-32 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">
          Refund Policy
        </h1>
        <p className="text-vivid-textMuted text-sm mb-10">
          Last updated: {new Date().toLocaleDateString("en-GB", { month: "long", year: "numeric" })}
        </p>

        <div className="space-y-8 text-vivid-text leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">No Refunds by Default</h2>
            <p>
              All VIVID license purchases are final. <strong>We do not offer refunds for change of mind, 
              dissatisfaction, or deciding the Software does not meet your expectations.</strong> By purchasing, 
              you acknowledge and accept that you are buying a digital product with immediate delivery.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">When We May Issue a Refund</h2>
            <p>
              Refunds are only considered in serious, documented cases, including:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-vivid-textMuted">
              <li>The license key fails to activate on a compatible system and our support team cannot resolve the issue</li>
              <li>A critical bug in the Software prevents all core functionality, and no workaround is available</li>
              <li>Duplicate charges or billing errors caused by our payment processor</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Refund Request Process</h2>
            <p>
              To request a refund under the exceptions above, contact our support team within 7 days of 
              purchase with:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-vivid-textMuted">
              <li>Your order ID or license key</li>
              <li>A detailed description of the issue</li>
              <li>Screenshots, screen recordings, or error logs demonstrating the problem</li>
            </ul>
            <p className="mt-2">
              We will review your request within 48 hours and may ask for additional information. 
              Approved refunds are processed to the original payment method within 5–10 business days.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Chargebacks</h2>
            <p>
              Initiating a chargeback without first contacting our support team will result in immediate 
              termination of your license and account. We reserve the right to dispute fraudulent chargebacks 
              and provide evidence of the purchase and our terms to your payment provider.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Contact</h2>
            <p>
              For refund requests or questions about this policy, contact us at{" "}
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
