# Admin Guide

The production admin application must be protected by server-side role checks and Supabase RLS.

## Required Workflows

- Question creation and editing.
- Human review.
- Version diffing.
- Approval and publication.
- Archiving and restoration.
- User search and entitlement grants.
- Firm data management.
- Audit logs.

## Current State

The new `/admin` route intentionally blocks fake admin controls until roles and RLS are configured.
