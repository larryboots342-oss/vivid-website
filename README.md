# VIVID Website

Professional payment website for VIVID AI Gaming Assistant.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Payments:** PayPal (Stripe coming soon)
- **Email:** Resend
- **Database:** Supabase

## Setup

1. Install dependencies:
```bash
cd website
npm install
```

2. Copy environment variables:
```bash
cp .env.example .env.local
```

3. Fill in your credentials in `.env.local`:
- `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` (from your Supabase project)
- `PAYPAL_CLIENT_ID` and `PAYPAL_CLIENT_SECRET` (from PayPal Developer Dashboard)
- `RESEND_API_KEY` (from Resend dashboard)

4. Run development server:
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
```

## Pages

- `/` — Landing page with hero, games, features, pricing
- `/games` — Supported platforms
- `/features` — Feature showcase with scroll animations
- `/pricing` — Pricing tiers
- `/checkout/paypal` — PayPal checkout
- `/success` — Post-payment license key display
- `/download` — Download page

## API Routes

- `POST /api/paypal/create-order` — Creates PayPal order
- `GET /api/paypal/capture-order` — Captures payment, creates license, sends email
- `POST /api/license/create` — Generic license creation endpoint

## Deployment

Recommended: Deploy to Vercel:
```bash
npx vercel --prod
```

## Supabase Schema

Run this SQL in your Supabase SQL editor:

```sql
-- Enhanced license_keys table
ALTER TABLE license_keys
ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS payment_provider TEXT,
ADD COLUMN IF NOT EXISTS payment_order_id TEXT,
ADD COLUMN IF NOT EXISTS payment_amount DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS payment_currency TEXT DEFAULT 'USD',
ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ;

-- Payments audit table
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    license_key_id UUID REFERENCES license_keys(id),
    provider TEXT NOT NULL,
    provider_order_id TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    status TEXT NOT NULL,
    payer_email TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);
```
