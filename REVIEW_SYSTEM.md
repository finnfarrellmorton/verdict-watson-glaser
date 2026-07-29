# Review System

Verdict review should use FSRS scheduling, not a basic wrong-answer list.

## Review Reasons

- Incorrect answer
- Unanswered question
- Flagged question
- Low-confidence correct
- High-confidence incorrect
- Slow correct
- Scheduled concept review
- Bookmark

## Current State

The review page is routed and domain-aware, but it intentionally shows empty states until Supabase-backed attempts and FSRS state are configured.

## Required Production Work

- Add `review_items` and `review_logs`.
- Store FSRS stability, difficulty, repetitions, due date and interval.
- Record manual clearing separately from successful recall.
