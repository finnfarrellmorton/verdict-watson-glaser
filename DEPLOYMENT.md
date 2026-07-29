# Deployment

## Vercel

1. Ensure the GitHub repository is connected to the Vercel project.
2. Add all variables from `ENVIRONMENT_VARIABLES.md`.
3. Remove static-output assumptions. This project builds as a Next.js app.
4. Run `npm run build`.
5. Deploy through Vercel.

## Supabase

1. Create or select the Supabase project.
2. Apply migrations from `supabase/migrations`.
3. Enable authentication providers.
4. Verify RLS policies with test users.

## Stripe

1. Create products and prices.
2. Add webhook endpoint.
3. Set `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET`.
4. Verify subscription events update entitlements.
