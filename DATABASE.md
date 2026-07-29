# Database

The existing `supabase/schema.sql` remains as a launch reference. New migrations should live under `supabase/migrations`.

## Required Tables

The production database needs profiles, preferences, roles, entitlements, questions, question versions, attempts, responses, progress aggregates, review schedules, lessons, firm research, billing events and audit logs.

## Row Level Security

RLS must ensure students can only access their own attempts, responses, profile, preferences, progress, review queue and saved firms. Admin and reviewer access must be granted through server-controlled database roles, not browser state.
