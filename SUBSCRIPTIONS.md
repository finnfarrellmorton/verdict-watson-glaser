# Subscriptions

Stripe is the authoritative billing system.

## Plans

- Free
- Pro
- Institution

## Rules

- Checkout creates billing sessions.
- Webhooks update subscriptions and entitlements.
- The billing portal handles cancellation and payment-method changes.
- Students cannot grant themselves paid access through profile settings.

## Current State

The UI displays pricing. Existing Stripe API files remain as migration reference. Production entitlement enforcement requires Stripe products, webhook secrets and Supabase entitlement tables.
