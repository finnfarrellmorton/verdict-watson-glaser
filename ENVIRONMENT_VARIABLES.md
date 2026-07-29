# Environment Variables

| Variable | Visibility | Required For |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Public | Supabase client/session integration |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public | Supabase client/session integration |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only | Admin imports, migrations and secure backend operations |
| `STRIPE_SECRET_KEY` | Server-only | Checkout and billing portal |
| `STRIPE_WEBHOOK_SECRET` | Server-only | Verified subscription webhooks |
| `NEXT_PUBLIC_POSTHOG_KEY` | Public | Product analytics |
| `SENTRY_DSN` | Server/client configured by Sentry | Error monitoring |
