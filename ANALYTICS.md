# Analytics

Verdict analytics must be calculated from submitted responses, not fabricated dashboard values.

## Metrics

- Raw score
- Answered accuracy
- Completion
- Domain accuracy
- Median and mean response time
- Timed versus untimed performance
- Confidence calibration
- Review retention

## Current State

The Next.js analytics page shows honest empty states until persisted attempt data exists.

## Required Production Work

- Persist attempts and responses in Supabase.
- Build reproducible aggregates.
- Add accessible Recharts wrappers.
- Add URL filters for time range, mode, timing, domain and difficulty.
