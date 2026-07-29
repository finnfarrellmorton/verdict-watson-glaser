# Architecture

Verdict has been migrated from a hidden-view static page toward a Next.js App Router application.

## Routes

- `/` public marketing page
- `/pricing` public pricing page
- `/firms` public firm directory
- `/firms/[slug]` firm profile
- `/login` authentication entry
- `/app/dashboard` student dashboard
- `/app/practice` practice setup
- `/app/sessions/[attemptId]` active practice session
- `/app/results/[attemptId]` persisted-result placeholder
- `/app/review` review queue
- `/app/analytics` analytics
- `/app/settings/profile` profile and integration status
- `/admin` server-controlled admin access placeholder

## Data

Existing static data files are preserved as migration inputs. Server-only loaders in `lib/legacy-data.ts` read them in Node and expose typed data to Server Components and API routes.

## Security Boundary

Safe question payloads omit correct answers and explanations before submission. Scoring is performed by a route handler using server-only data.

## Remaining Backend Work

Supabase migrations, RLS policies, persistent attempts, billing entitlements and admin workflows require production credentials and database application before they can be considered complete.
