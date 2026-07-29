# Security

## Completed In This Rebuild

- Removed client-side role and plan controls from the active Next.js app.
- Introduced server-side assessment scoring.
- Stopped the active session API from sending correct answers or explanations before submission.
- Added Zod validation for environment variables, session requests and submission payloads.
- Kept Supabase service-role usage out of browser code.

## Required Before Production

- Apply Supabase RLS policies from migrations.
- Verify Stripe webhook signatures in production.
- Add rate limiting for authentication and assessment mutations.
- Add Sentry filtering to avoid question-bank and answer leakage.
- Add PostHog privacy masking before session replay.
- Add full Playwright payload-inspection tests.
