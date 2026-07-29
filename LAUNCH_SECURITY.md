# Verdict launch checklist

This project is currently a static prototype with production launch wiring added.
Before launch, complete the steps below.

## 1. Hosting

Recommended stack:

- Vercel for hosting the static pages and `/api/*` serverless functions.
- Supabase for Auth, Postgres, row-level security, and user data.
- Stripe Checkout + Billing for payments and subscriptions.
- Cloudflare for DNS, HTTPS, CDN, and basic traffic protection.

## 2. Environment variables

Copy `.env.example` to `.env.local` for local development and add the same values in Vercel:

- `APP_BASE_URL`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PRICE_DAILY`
- `STRIPE_PRICE_UNLIMITED`
- `STRIPE_PRICE_LIFETIME`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_ANON_KEY`

Never put secret keys in browser JavaScript.

## 3. Supabase

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the SQL editor.
3. Enable email authentication.
4. Keep row-level security enabled.
5. Store user test attempts in `test_attempts`.
6. Store Stripe subscription status in `subscriptions`.

Passwords should be handled by Supabase Auth. Do not store raw passwords in this project.

## 4. Stripe

Create three Stripe products/prices:

- Daily Practice: monthly subscription.
- Unlimited Practice: monthly subscription.
- Lifetime Access: one-time payment.

Add the price IDs to the environment variables.

Create a webhook endpoint:

`https://your-domain.com/api/stripe-webhook`

Listen for:

- `checkout.session.completed`
- `invoice.paid`
- `customer.subscription.updated`
- `customer.subscription.deleted`

The app should provision access only from Stripe webhook data, not from a browser redirect alone.

## 5. Protect paid content

The current `question-bank.js` is acceptable for a prototype, but it exposes all paid questions to the browser.
Before launch:

- Move authored questions into Supabase or a protected server data store.
- Use `/api/session-questions` to deliver only questions the user is entitled to access.
- Daily users should receive only the daily mixed test.
- Unlimited/lifetime users can receive the full bank and focused drills.

## 6. Data protection

Use:

- HTTPS everywhere.
- Supabase row-level security.
- Server-side Stripe webhook verification.
- Secure session cookies or Supabase auth tokens.
- Minimal personal data collection.
- No card storage outside Stripe.
- Database backups.
- Privacy policy and terms.

## 7. Legal and trust notes

The question bank should remain original Watson Glaser-style practice content.
Do not scrape, copy, or reproduce licensed Pearson/Watson Glaser questions.

Firm data should include source labels and a verification note because salary, retention, and intake numbers change.
