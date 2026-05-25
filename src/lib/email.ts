import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.FROM_EMAIL || "licenses@vivid.gg";

const resend = resendApiKey ? new Resend(resendApiKey) : null;

interface LicenseEmailData {
  to: string;
  licenseKey: string;
  tier: string;
  expiresAt: Date | null;
}

export async function sendLicenseEmail({ to, licenseKey, tier, expiresAt }: LicenseEmailData) {
  if (!resend) {
    console.warn("Resend not configured. License email would have been sent to:", to);
    return { success: false, error: "Email service not configured" };
  }

  const tierName = tier.charAt(0).toUpperCase() + tier.slice(1);
  const expirationText = expiresAt
    ? `Your license expires on ${expiresAt.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })}.`
    : "Your license never expires.";

  try {
    const { data, error } = await resend.emails.send({
      from: `VIVID <${fromEmail}>`,
      to,
      subject: `Your VIVID ${tierName} License Key`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { background: #080808; color: #e0e0e0; font-family: 'Segoe UI', sans-serif; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 40px 24px; }
    .logo { text-align: center; margin-bottom: 32px; }
    .logo-text { font-size: 28px; font-weight: bold; color: #00e5ff; letter-spacing: 2px; }
    .card { background: #111111; border: 1px solid #252525; border-radius: 16px; padding: 32px; }
    .heading { font-size: 22px; font-weight: bold; color: #ffffff; margin-bottom: 8px; }
    .subheading { color: #a0a0a0; font-size: 14px; margin-bottom: 24px; }
    .key-box { background: #080808; border: 1px solid #00e5ff40; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0; }
    .key-text { font-family: 'Consolas', monospace; font-size: 20px; font-weight: bold; color: #00e5ff; letter-spacing: 2px; }
    .tier-badge { display: inline-block; padding: 6px 16px; border-radius: 999px; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px; }
    .tier-pro { background: #00e5ff15; border: 1px solid #00e5ff40; color: #00e5ff; }
    .tier-elite { background: #b829dd15; border: 1px solid #b829dd40; color: #b829dd; }
    .tier-enterprise { background: #00ff9d15; border: 1px solid #00ff9d40; color: #00ff9d; }
    .instructions { margin-top: 24px; padding-top: 24px; border-top: 1px solid #252525; }
    .instructions h3 { font-size: 14px; color: #ffffff; margin-bottom: 12px; }
    .instructions ol { margin: 0; padding-left: 20px; color: #a0a0a0; font-size: 13px; line-height: 1.8; }
    .footer { text-align: center; margin-top: 32px; color: #707070; font-size: 12px; }
    .footer a { color: #00e5ff; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">
      <div class="logo-text">VIVID</div>
    </div>
    <div class="card">
      <div class="tier-badge tier-${tier.toLowerCase()}">${tierName}</div>
      <div class="heading">Thank you for your purchase!</div>
      <div class="subheading">Your license key is ready. Copy it below and activate it in the VIVID software.</div>
      
      <div class="key-box">
        <div class="key-text">${licenseKey}</div>
      </div>
      
      <p style="color: #a0a0a0; font-size: 13px; text-align: center;">${expirationText}</p>
      
      <div class="instructions">
        <h3>How to activate:</h3>
        <ol>
          <li>Open the VIVID software</li>
          <li>Go to the Subscription / Key tab</li>
          <li>Enter your license key and click Validate</li>
          <li>Your access will be activated instantly</li>
        </ol>
      </div>
    </div>
    <div class="footer">
      <p>Need help? Contact support at <a href="mailto:support@vivid.gg">support@vivid.gg</a></p>
      <p style="margin-top: 8px;">© ${new Date().getFullYear()} VIVID Software</p>
    </div>
  </div>
</body>
</html>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err: any) {
    console.error("Email send error:", err);
    return { success: false, error: err.message };
  }
}
