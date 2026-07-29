# Access Control

Roles and subscriptions must be controlled server-side.

## Roles

- `student`
- `content_reviewer`
- `administrator`
- `institution_manager`

## Current State

The active Next.js app has no role switcher and no user-editable subscription selector.

## Required Production Work

- Store roles in Supabase `user_roles`.
- Enforce route access with server checks.
- Enforce data access with RLS.
- Add tests proving students cannot access admin routes or mutate entitlements.
